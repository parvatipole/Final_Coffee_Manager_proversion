import { jwtDecode } from 'jwt-decode';

// JWT payload interface
interface JWTPayload {
  sub: string;        // username
  userId: string;     // user ID
  role: string;       // user role
  officeName?: string; // office name (null for admin)
  city?: string;      // city (null for admin)
  iat: number;        // issued at
  exp: number;        // expiration time
}

export const tokenManager = {
  // Store JWT token in localStorage
  setToken: (token: string): void => {
    localStorage.setItem("coffee_auth_token", token);
  },

  // Get JWT token from localStorage
  getToken: (): string | null => {
    return localStorage.getItem("coffee_auth_token");
  },

  // Remove JWT token and user data
  removeToken: (): void => {
    localStorage.removeItem("coffee_auth_token");
    localStorage.removeItem("coffee_auth_user");
  },

  // Decode JWT token to get user information
  decodeToken: (token: string): JWTPayload | null => {
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      return decoded;
    } catch (error) {
      console.error("Failed to decode JWT token:", error);
      return null;
    }
  },

  // Check if JWT token is expired
  isTokenExpired: (token: string): boolean => {
    try {
      const decoded = tokenManager.decodeToken(token);
      if (!decoded) return true;
      
      const currentTime = Date.now() / 1000; // Convert to seconds
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  },

  // Get user data from JWT token
  getUserFromToken: (token: string): any | null => {
    const decoded = tokenManager.decodeToken(token);
    if (!decoded) return null;

    return {
      id: decoded.userId,
      username: decoded.sub,
      role: decoded.role,
      officeName: decoded.officeName,
      city: decoded.city
    };
  },

  // Check if token exists and is valid
  isValidToken: (): boolean => {
    const token = tokenManager.getToken();
    if (!token) return false;
    return !tokenManager.isTokenExpired(token);
  }
};
