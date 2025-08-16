import { z } from "zod";
import { clientDatabase, Client } from "../models/Client";
import { generateBookingId as generateNewBookingId } from "./cryptoService";

// Re-export the Client type as UserData for compatibility with existing code.
// Ideally, we would refactor the codebase to use the `Client` type directly.
export type UserData = Client;

// Validation schemas
export const BookingIdSchema = z
  .string()
  .regex(/^[A-Z0-9]{8}$/, "Booking ID must be 8 alphanumeric characters");

export interface CreateBookingRequest {
  clientName: string;
  clientEmail: string;
  artist: string;
  event: string;
  eventDate: string;
  coordinatorId: string;
}

// Authentication service
export class AuthService {
  // Use the singleton clientDatabase instance
  private db = clientDatabase;

  async authenticateByBookingId(
    bookingId: string,
  ): Promise<{ success: boolean; user?: UserData; error?: string }> {
    try {
      // Validate booking ID format
      const validation = BookingIdSchema.safeParse(bookingId);
      if (!validation.success) {
        return {
          success: false,
          error:
            "Invalid booking ID format. Must be 8 alphanumeric characters.",
        };
      }

      // Find user by booking ID in the central database
      const user = await this.db.getClient(bookingId.toUpperCase());
      if (!user) {
        return {
          success: false,
          error:
            "Booking ID not found. Please check your booking confirmation.",
        };
      }

      // Check if booking is cancelled
      if (user.status === "cancelled") {
        return {
          success: false,
          error:
            "This booking has been cancelled. Please contact your coordinator.",
        };
      }

      return {
        success: true,
        user,
      };
    } catch (error) {
      console.error("Authentication error:", error);
      return {
        success: false,
        error:
          "Authentication service temporarily unavailable. Please try again later.",
      };
    }
  }

  async createNewBooking(
    data: CreateBookingRequest,
  ): Promise<{ success: boolean; booking?: UserData; error?: string }> {
    try {
      const newClientData = {
        bookingId: generateNewBookingId(),
        name: data.clientName,
        email: data.clientEmail,
        artist: data.artist,
        event: data.event,
        eventDate: data.eventDate,
        coordinator: {
          // This is a placeholder. In a real app, you'd look up the coordinator.
          name: "Default Coordinator",
          email: "coordinator@example.com",
          phone: "N/A",
          department: "Music",
        },
      };

      const booking = await this.db.createClient(newClientData);

      return {
        success: true,
        booking,
      };
    } catch (error) {
      console.error("Booking creation error:", error);
      return {
        success: false,
        error: "Unable to create booking. Please try again later.",
      };
    }
  }

  async updateBookingStatus(
    bookingId: string,
    status: UserData["status"],
  ): Promise<{ success: boolean; booking?: UserData; error?: string }> {
    try {
      const updated = await this.db.updateClient(bookingId, { status });
      if (!updated) {
        return {
          success: false,
          error: "Booking not found.",
        };
      }

      return {
        success: true,
        booking: updated,
      };
    } catch (error) {
      console.error("Booking update error:", error);
      return {
        success: false,
        error: "Unable to update booking status.",
      };
    }
  }

  // Generate a new booking ID (useful for testing)
  generateNewBookingId(): string {
    return generateNewBookingId();
  }
}

// Export singleton instance
export const authService = new AuthService();
