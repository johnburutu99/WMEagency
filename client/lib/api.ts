// API client for WME Client Portal

const API_BASE_URL = "/api";

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
}

export interface Client {
  bookingId: string;
  name: string;
  email?: string;
  phone?: string;
  artist: string;
  event: string;
  eventDate?: string;
  eventLocation?: string;
  status: "active" | "pending" | "completed" | "cancelled";
  contractAmount?: number;
  currency?: string;
  balance?: number;
  coordinator: {
    name: string;
    email: string;
    phone?: string;
    department: string;
  };
  lastLogin?: string;
  priority?: "low" | "medium" | "high";
}

export interface CreateClient {
  bookingId: string;
  name: string;
  email: string;
  phone?: string;
  artist: string;
  event: string;
  eventDate?: string;
  eventLocation?: string;
  status?: "active" | "pending" | "completed" | "cancelled";
  contractAmount?: number;
  currency?: string;
  balance?: number;
  coordinator: {
    name: string;
    email: string;
    phone?: string;
    department: string;
  };
  metadata?: {
    priority?: "low" | "medium" | "high";
  };
}

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Request failed",
      };
    }
  }

  // Authentication
  async adminLogin(credentials: {
    username?: string;
    password?: string;
  }): Promise<ApiResponse<{ message: string }>> {
    return this.request("/auth/admin/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async verifyAdminSession(): Promise<ApiResponse<{ user: { isAdmin: boolean } }>> {
    return this.request("/auth/admin/verify");
  }

  async adminLogout(): Promise<ApiResponse<{ message: string }>> {
    return this.request("/auth/admin/logout", {
      method: "POST",
    });
  }

  async login(
    bookingId: string,
    impersonationToken?: string,
  ): Promise<ApiResponse<{ client: Client; message: string }>> {
    const headers: Record<string, string> = {};
    if (impersonationToken) {
      headers["Authorization"] = `Bearer ${impersonationToken}`;
    }

    return this.request("/auth/login", {
      method: "POST",
      headers,
      body: JSON.stringify({ bookingId }),
    });
  }

  async verifyBookingId(
    bookingId: string,
  ): Promise<ApiResponse<{ exists: boolean; bookingId: string }>> {
    return this.request(`/auth/verify/${bookingId}`);
  }

  async logout(): Promise<ApiResponse<{ message: string }>> {
    return this.request("/auth/logout", {
      method: "POST",
    });
  }

  // Payment
  async initiatePaymentOtp(
    bookingId: string
  ): Promise<ApiResponse<{ message: string }>> {
    return this.request("/payment/initiate-otp", {
      method: "POST",
      body: JSON.stringify({ bookingId }),
    });
  }

  async verifyPaymentOtp(
    bookingId: string,
    otp: string
  ): Promise<ApiResponse<{ message: string }>> {
    return this.request("/payment/verify-otp", {
      method: "POST",
      body: JSON.stringify({ bookingId, otp }),
    });
  }

  // Client management
  async getAllClients(options?: {
    status?: string;
    search?: string;
  }): Promise<ApiResponse<{ clients: Client[]; total: number }>> {
    const params = new URLSearchParams();
    if (options?.status) params.append("status", options.status);
    if (options?.search) params.append("search", options.search);

    return this.request(`/clients?${params.toString()}`);
  }

  async getClient(bookingId: string): Promise<ApiResponse<{ client: Client }>> {
    return this.request(`/clients/${bookingId}`);
  }

  async createClient(
    clientData: CreateClient,
  ): Promise<ApiResponse<{ client: Client; message: string }>> {
    return this.request("/clients", {
      method: "POST",
      body: JSON.stringify(clientData),
    });
  }

  async updateClient(
    bookingId: string,
    updates: Partial<Omit<Client, "bookingId">>,
  ): Promise<ApiResponse<{ client: Client; message: string }>> {
    return this.request(`/clients/${bookingId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  async deleteClient(
    bookingId: string,
  ): Promise<ApiResponse<{ message: string; bookingId: string }>> {
    return this.request(`/clients/${bookingId}`, {
      method: "DELETE",
    });
  }

  async bulkUpdateClients(
    bookingIds: string[],
    updates: Partial<Omit<Client, "bookingId">>,
  ): Promise<ApiResponse<{ results: any[]; updated: number; failed: number }>> {
    return this.request("/clients/bulk-update", {
      method: "POST",
      body: JSON.stringify({ bookingIds, updates }),
    });
  }

  async generateBookingId(): Promise<ApiResponse<{ bookingId: string }>> {
    return this.request("/booking-id/generate");
  }

  // Admin endpoints
  async getDashboardStats(): Promise<
    ApiResponse<{
      stats: any;
      recentActivity: any[];
      revenueByMonth: any[];
      topArtists: any[];
    }>
  > {
    return this.request("/admin/dashboard");
  }

  async getClientAnalytics(period?: string): Promise<
    ApiResponse<{
      analytics: any;
      period: string;
    }>
  > {
    const params = period ? `?period=${period}` : "";
    return this.request(`/admin/analytics${params}`);
  }

  async exportClients(options?: {
    format?: "json" | "csv";
    status?: string;
  }): Promise<
    ApiResponse<{ clients: any[]; total: number; exportedAt: string }>
  > {
    const params = new URLSearchParams();
    if (options?.format) params.append("format", options.format);
    if (options?.status) params.append("status", options.status);

    return this.request(`/admin/export?${params.toString()}`);
  }

  async getSystemHealth(): Promise<ApiResponse<any>> {
    return this.request("/admin/health");
  }

  async getDemoClients(): Promise<ApiResponse<{ clients: Client[]; total: number }>> {
    return this.request("/admin/demo-clients");
  }

  async impersonateClient(bookingId: string): Promise<ApiResponse<{ impersonationToken: string }>> {
    return this.request("/auth/admin/impersonate", {
      method: "POST",
      body: JSON.stringify({ bookingId }),
    });
  }

  // Utility methods
  async ping(): Promise<
    ApiResponse<{ message: string; timestamp: string; status: string }>
  > {
    return this.request("/ping");
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export types
export type { ApiResponse };
