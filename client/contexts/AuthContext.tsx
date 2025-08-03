import React, { createContext, useContext, useState, useEffect } from "react";

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Mock users for demo
const mockUsers: User[] = [
  { id: "1", username: "tech1", role: "technician", name: "John Technician" },
  { id: "2", username: "admin1", role: "admin", name: "Sarah Admin" },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem("coffee_auth_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock authentication - in real app this would be API call
    const foundUser = mockUsers.find((u) => u.username === username);
    if (foundUser && (password === "password" || password === username)) {
      setUser(foundUser);
      localStorage.setItem("coffee_auth_user", JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("coffee_auth_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
