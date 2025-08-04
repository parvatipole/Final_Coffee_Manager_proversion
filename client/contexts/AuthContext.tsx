import React, { createContext, useContext, useState, useEffect } from "react";
import { apiClient, tokenManager } from "@/lib/api";
import { initializeMQTT } from "@/lib/mqtt";

export type UserRole = "technician" | "admin";

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem("coffee_auth_user");
    const token = tokenManager.getToken();
    
    if (storedUser && token && !tokenManager.isTokenExpired(token)) {
      setUser(JSON.parse(storedUser));
      // Initialize MQTT connection for authenticated users
      initializeMQTT().then(connected => {
        if (connected) {
          console.log("🔌 MQTT initialized for authenticated user");
        }
      });
    } else {
      // Clear invalid stored data
      tokenManager.removeToken();
    }
    
    setIsLoading(false);
  }, []);

  const login = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Call real backend API
      const response = await apiClient.login(username, password);
      
      // Store JWT token
      tokenManager.setToken(response.accessToken);
      
      // Create user object
      const userData: User = {
        id: response.id.toString(),
        username: response.username,
        name: response.name,
        role: response.role as UserRole
      };
      
      // Store user data
      setUser(userData);
      localStorage.setItem("coffee_auth_user", JSON.stringify(userData));
      
      // Initialize MQTT connection
      await initializeMQTT();
      
      setIsLoading(false);
      return true;
      
    } catch (error) {
      console.error("Login failed:", error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint
      await apiClient.logout();
    } catch (error) {
      console.warn("Logout API call failed:", error);
    }
    
    // Clear local state and storage
    setUser(null);
    tokenManager.removeToken();
    
    // Disconnect MQTT
    const { mqttClient } = await import("@/lib/mqtt");
    mqttClient.disconnect();
  };

  const isAuthenticated = !!user && !!tokenManager.getToken();

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isLoading, 
      isAuthenticated 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
