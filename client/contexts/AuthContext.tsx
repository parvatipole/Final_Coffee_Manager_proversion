import React, { createContext, useContext, useState, useEffect } from "react";
import { apiClient, tokenManager } from "@/lib/api";
import { initializeMQTT } from "@/lib/mqtt";

export type UserRole = "technician" | "admin";

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
  city?: string;
  officeName?: string; // Office name for technicians, null for admin
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Create a default context value to avoid null issues
const defaultContextValue: AuthContextType = {
  user: null,
  login: async () => false,
  logout: () => {},
  isLoading: true,
  isAuthenticated: false,
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  return context;
};

// Detect demo mode based on hostname patterns
const isDemoMode = () => {
  const hostname = window.location.hostname;
  return (
    hostname.includes(".fly.dev") ||
    hostname.includes(".netlify.app") ||
    hostname.includes(".vercel.app") ||
    hostname.includes("builder.io") ||
    (hostname.includes("localhost") === false && hostname !== "127.0.0.1")
  );
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [demoMode] = useState(isDemoMode());

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem("coffee_auth_user");
    const token = tokenManager.getToken();

    if (storedUser && token && !tokenManager.isTokenExpired(token)) {
      setUser(JSON.parse(storedUser));
      // Initialize MQTT connection for authenticated users
      initializeMQTT().then((connected) => {
        if (connected) {
          // MQTT initialized for authenticated user
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
      // First try to authenticate with the backend
      const response = await apiClient.login(username, password);

      if (response && response.accessToken) {
        // Backend authentication successful
        tokenManager.setToken(response.accessToken);

        const userData: User = {
          id: response.userId.toString(),
          username: response.username,
          name: response.name,
          role: response.role as UserRole,
          city: undefined, // Backend doesn't provide city
          officeName: response.officeName,
        };

        setUser(userData);
        localStorage.setItem("coffee_auth_user", JSON.stringify(userData));

        // Initialize MQTT connection
        await initializeMQTT();

        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.log("Backend authentication failed, trying local storage...");

      try {
        // Check registered users as fallback
        const registeredUsers = JSON.parse(
          localStorage.getItem("registeredUsers") || "[]",
        );
        const foundUser = registeredUsers.find(
          (user: any) =>
            user.username === username && user.password === password,
        );

        if (foundUser) {
          const userData: User = {
            id: foundUser.username,
            username: foundUser.username,
            name: foundUser.name,
            role: foundUser.role as UserRole,
            city: foundUser.city,
            officeName: foundUser.officeName,
          };

          setUser(userData);
          localStorage.setItem("coffee_auth_user", JSON.stringify(userData));

          // Simple token for demo
          localStorage.setItem(
            "coffee_auth_token",
            "simple_token_" + Date.now(),
          );

          // Initialize MQTT connection
          await initializeMQTT();

          setIsLoading(false);
          return true;
        }

        // Final fallback to demo users
        return performMockLogin(username, password);
      } catch (fallbackError) {
        // Ultimate fallback to demo mode
        return performMockLogin(username, password);
      }
    }

    setIsLoading(false);
    return false;
  };

  const performMockLogin = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    // Fallback to mock authentication for demo purposes
    const mockUsers = [
      {
        id: "1",
        username: "tech1",
        role: "technician",
        name: "John Technician",
        city: "pune",
        officeName: "Hinjewadi IT Park",
      },
      {
        id: "3",
        username: "tech2",
        role: "technician",
        name: "Priya Shah",
        city: "mumbai",
        officeName: "Mumbai BKC",
      },
      {
        id: "2",
        username: "admin1",
        role: "admin",
        name: "Sarah Admin",
        city: null,
        officeName: null, // Admin has access to all offices
      },
    ];

    const foundUser = mockUsers.find((u) => u.username === username);
    if (foundUser && (password === "password" || password === username)) {
      // Create mock JWT token
      const mockToken = btoa(
        JSON.stringify({
          sub: foundUser.username,
          role: foundUser.role,
          exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
        }),
      );

      tokenManager.setToken(mockToken);

      const userData: User = {
        id: foundUser.id,
        username: foundUser.username,
        name: foundUser.name,
        role: foundUser.role as UserRole,
        city: foundUser.city,
        officeName: foundUser.officeName,
      };

      setUser(userData);
      localStorage.setItem("coffee_auth_user", JSON.stringify(userData));

      // Initialize MQTT in demo mode
      await initializeMQTT();

      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const logout = async () => {
    try {
      // Always try to call backend logout endpoint if we have a token
      const token = tokenManager.getToken();
      if (token && !tokenManager.isTokenExpired(token)) {
        await apiClient.logout();
      }
    } catch (error) {
      // Logout API call failed, continue with local cleanup
      console.log("Backend logout failed, continuing with local cleanup");
    }

    // Clear local state and storage
    setUser(null);
    tokenManager.removeToken();

    // Disconnect MQTT
    try {
      const { mqttClient } = await import("@/lib/mqtt");
      if (mqttClient) {
        mqttClient.disconnect();
      }
    } catch (error) {
      // MQTT disconnect failed, continue
      console.log("MQTT disconnect failed");
    }
  };

  const isAuthenticated = !!user && !!tokenManager.getToken();

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
