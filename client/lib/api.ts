// API Configuration and JWT Token Management
import { tokenManager } from "./tokenManager";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

// Debug logging for local development
const DEBUG = import.meta.env.VITE_DEBUG === "true" || import.meta.env.DEV;

// Export token manager for use in other files
export { tokenManager };

// API Client with automatic JWT handling
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    // Add JWT token to headers if available
    const token = tokenManager.getToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token && !tokenManager.isTokenExpired(token)) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        // Add timeout for better error handling
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      // Handle 401 (unauthorized) - token might be expired
      if (response.status === 401) {
        tokenManager.removeToken();
        throw new Error("Authentication required");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `HTTP ${response.status}: ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      // Better error classification with silent handling for demo mode
      if (error instanceof TypeError && error.message.includes("fetch")) {
        // Backend unavailable - working in demo mode
        throw new Error("Backend unavailable - working in demo mode");
      }

      if (error instanceof Error && error.name === "AbortError") {
        // Request timeout
        throw new Error("Request timeout - please check your connection");
      }

      // Only log actual errors, not expected connection failures (silently handled)
      throw error;
    }
  }

  // Authentication - JWT Based
  async login(username: string, password: string) {
    return this.request<{
      accessToken: string;
      tokenType: string;
      user: {
        id: string;
        username: string;
        name: string;
        role: string;
        city?: string;
        officeName?: string;
      };
    }>("/auth/signin", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  }

  async signup(
    username: string,
    name: string,
    password: string,
    role: string,
    city?: string,
    officeName?: string,
  ) {
    return this.request<{
      message: string;
      user?: {
        id: string;
        username: string;
        name: string;
        role: string;
        city?: string;
        officeName?: string;
      };
    }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        username,
        name,
        password,
        role,
        city,
        officeName,
      }),
    });
  }

  async logout() {
    return this.request("/auth/signout", {
      method: "POST",
    });
  }

  // Coffee Machines
  async getMachines() {
    return this.request<any[]>("/machines");
  }

  async getMachine(id: string) {
    return this.request<any>(`/machines/${id}`);
  }

  async getMachineByMachineId(machineId: string) {
    return this.request<any>(`/machines/machine/${machineId}`);
  }

  async updateMachine(id: string, data: any) {
    return this.request<any>(`/machines/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async updateSupplies(id: string, supplies: any) {
    return this.request<{ message: string }>(`/machines/${id}/supplies`, {
      method: "PUT",
      body: JSON.stringify(supplies),
    });
  }

  // Location navigation
  async getLocations() {
    return this.request<string[]>("/machines/locations");
  }

  async getOffices(location: string) {
    return this.request<string[]>(
      `/machines/offices?location=${encodeURIComponent(location)}`,
    );
  }

  async getFloors(location: string, office: string) {
    return this.request<string[]>(
      `/machines/floors?location=${encodeURIComponent(location)}&office=${encodeURIComponent(office)}`,
    );
  }

  async getMachinesByLocationOfficeFloor(
    location: string,
    office: string,
    floor: string,
  ) {
    return this.request<any[]>(
      `/machines/by-location-office-floor?location=${encodeURIComponent(location)}&office=${encodeURIComponent(office)}&floor=${encodeURIComponent(floor)}`,
    );
  }

  // Monitoring
  async getLowSupplyMachines(threshold: number = 30) {
    return this.request<any[]>(`/machines/low-supplies?threshold=${threshold}`);
  }

  async getMaintenanceNeededMachines() {
    return this.request<any[]>("/machines/maintenance-needed");
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
