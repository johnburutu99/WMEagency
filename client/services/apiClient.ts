interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  user?: T;
  booking?: T;
  bookings?: T;
  error?: string;
  message?: string;
}

interface UserData {
  id: string;
  bookingId: string;
  name: string;
  artist: string;
  event: string;
  eventDate: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  coordinatorId: string;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = '/api'; // Use relative path for same-origin requests
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const bookingId = localStorage.getItem('wme-booking-id');
      
      const defaultHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        ...(bookingId && { 'x-booking-id': bookingId }),
      };

      const config: RequestInit = {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      };

      console.log(`Making API request: ${options.method || 'GET'} ${url}`);
      
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        console.error(`API Error ${response.status}:`, data);
        return {
          success: false,
          error: data.error || `HTTP ${response.status}`,
        };
      }

      console.log(`API Success:`, data);
      return data;
    } catch (error) {
      console.error('Network error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection and try again.',
      };
    }
  }

  // Authentication methods
  async login(bookingId: string): Promise<ApiResponse<UserData>> {
    const response = await this.makeRequest<UserData>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ bookingId }),
    });

    if (response.success && response.user) {
      // Store booking ID for subsequent requests
      localStorage.setItem('wme-booking-id', response.user.bookingId);
      localStorage.setItem('wme-user-data', JSON.stringify(response.user));
    }

    return response;
  }

  async verifySession(): Promise<ApiResponse<UserData>> {
    return this.makeRequest<UserData>('/auth/verify-session');
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.makeRequest('/auth/logout', {
      method: 'POST',
    });

    if (response.success) {
      localStorage.removeItem('wme-booking-id');
      localStorage.removeItem('wme-user-data');
    }

    return response;
  }

  async createBooking(bookingData: {
    clientName: string;
    clientEmail: string;
    artist: string;
    event: string;
    eventDate: string;
    coordinatorId: string;
  }): Promise<ApiResponse> {
    return this.makeRequest('/auth/create-booking', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async generateBookingId(): Promise<ApiResponse<{ bookingId: string }>> {
    return this.makeRequest('/auth/generate-booking-id');
  }

  // Booking management methods
  async getMyBookings(): Promise<ApiResponse> {
    return this.makeRequest('/bookings/my-bookings');
  }

  async getBookingDetails(bookingId: string): Promise<ApiResponse> {
    return this.makeRequest(`/bookings/${bookingId}`);
  }

  async updateBookingStatus(
    bookingId: string, 
    status: 'confirmed' | 'pending' | 'completed' | 'cancelled'
  ): Promise<ApiResponse> {
    return this.makeRequest(`/bookings/${bookingId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!localStorage.getItem('wme-booking-id');
  }

  getCurrentUser(): UserData | null {
    const userData = localStorage.getItem('wme-user-data');
    return userData ? JSON.parse(userData) : null;
  }

  clearSession(): void {
    localStorage.removeItem('wme-booking-id');
    localStorage.removeItem('wme-user-data');
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export type { UserData, ApiResponse };
