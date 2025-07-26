import { z } from "zod";
import crypto from "crypto";

// Validation schemas
export const BookingIdSchema = z
  .string()
  .regex(/^[A-Z0-9]{8}$/, "Booking ID must be 8 alphanumeric characters");

export interface UserData {
  id: string;
  bookingId: string;
  name: string;
  email: string;
  artist: string;
  event: string;
  eventDate: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  coordinatorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBookingRequest {
  clientName: string;
  clientEmail: string;
  artist: string;
  event: string;
  eventDate: string;
  coordinatorId: string;
}

// In-memory database simulation (replace with real database)
class BookingDatabase {
  private bookings: Map<string, UserData> = new Map();
  private usedIds: Set<string> = new Set();

  constructor() {
    // Initialize with some demo data
    this.seedDemoData();
  }

  private seedDemoData() {
    const demoBookings: UserData[] = [
      {
        id: "user_001",
        bookingId: "WME24001",
        name: "John Doe",
        email: "john.doe@example.com",
        artist: "Taylor Swift",
        event: "Grammy Awards Performance",
        eventDate: "2024-02-04",
        status: "confirmed",
        coordinatorId: "coord_001",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
      {
        id: "user_002",
        bookingId: "WME24002",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        artist: "Dwayne Johnson",
        event: "Fast X Premiere",
        eventDate: "2024-01-15",
        status: "confirmed",
        coordinatorId: "coord_002",
        createdAt: new Date("2024-01-02"),
        updatedAt: new Date("2024-01-02"),
      },
      {
        id: "user_003",
        bookingId: "WME24003",
        name: "Mike Johnson",
        email: "mike.johnson@example.com",
        artist: "Zendaya",
        event: "Vogue Photoshoot",
        eventDate: "2024-01-22",
        status: "completed",
        coordinatorId: "coord_003",
        createdAt: new Date("2024-01-03"),
        updatedAt: new Date("2024-01-03"),
      },
      {
        id: "user_004",
        bookingId: "ABC12345",
        name: "Sarah Wilson",
        email: "sarah.wilson@example.com",
        artist: "Ryan Reynolds",
        event: "Press Tour Services",
        eventDate: "2024-03-15",
        status: "pending",
        coordinatorId: "coord_004",
        createdAt: new Date("2024-01-04"),
        updatedAt: new Date("2024-01-04"),
      },
      {
        id: "user_005",
        bookingId: "XYZ98765",
        name: "David Chen",
        email: "david.chen@example.com",
        artist: "Chris Evans",
        event: "Marvel Contract Signing",
        eventDate: "2024-02-20",
        status: "confirmed",
        coordinatorId: "coord_001",
        createdAt: new Date("2024-01-05"),
        updatedAt: new Date("2024-01-05"),
      },
    ];

    demoBookings.forEach((booking) => {
      this.bookings.set(booking.bookingId, booking);
      this.usedIds.add(booking.bookingId);
    });
  }

  async findByBookingId(bookingId: string): Promise<UserData | null> {
    return this.bookings.get(bookingId) || null;
  }

  async createBooking(data: CreateBookingRequest): Promise<UserData> {
    const bookingId = this.generateBookingId();
    const booking: UserData = {
      id: `user_${Date.now()}`,
      bookingId,
      name: data.clientName,
      email: data.clientEmail,
      artist: data.artist,
      event: data.event,
      eventDate: data.eventDate,
      status: "pending",
      coordinatorId: data.coordinatorId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.bookings.set(bookingId, booking);
    this.usedIds.add(bookingId);

    return booking;
  }

  async updateBooking(
    bookingId: string,
    updates: Partial<UserData>,
  ): Promise<UserData | null> {
    const existing = this.bookings.get(bookingId);
    if (!existing) return null;

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };

    this.bookings.set(bookingId, updated);
    return updated;
  }

  async getAllBookings(): Promise<UserData[]> {
    return Array.from(this.bookings.values());
  }

  private generateBookingId(): string {
    let attempts = 0;
    const maxAttempts = 1000;

    while (attempts < maxAttempts) {
      const bookingId = this.createBookingId();
      if (!this.usedIds.has(bookingId)) {
        return bookingId;
      }
      attempts++;
    }

    throw new Error(
      "Unable to generate unique booking ID after maximum attempts",
    );
  }

  private createBookingId(): string {
    const year = new Date().getFullYear().toString().slice(-2); // Last 2 digits of year
    const prefix = "WME"; // WME prefix

    // Generate 3 random alphanumeric characters
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomPart = "";
    for (let i = 0; i < 3; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Format: WME + YY + XXX (e.g., WME24A1B)
    return `${prefix}${year}${randomPart}`;
  }
}

// Authentication service
export class AuthService {
  private db = new BookingDatabase();

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

      // Find user by booking ID
      const user = await this.db.findByBookingId(bookingId.toUpperCase());
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
      // Validate input data
      if (
        !data.clientName ||
        !data.clientEmail ||
        !data.artist ||
        !data.event
      ) {
        return {
          success: false,
          error: "Missing required booking information.",
        };
      }

      const booking = await this.db.createBooking(data);

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

  async getUserBookings(userId: string): Promise<UserData[]> {
    const allBookings = await this.db.getAllBookings();
    return allBookings.filter((booking) => booking.id === userId);
  }

  async updateBookingStatus(
    bookingId: string,
    status: UserData["status"],
  ): Promise<{ success: boolean; booking?: UserData; error?: string }> {
    try {
      const updated = await this.db.updateBooking(bookingId, { status });
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
    return new BookingDatabase()["generateBookingId"]();
  }
}

// Export singleton instance
export const authService = new AuthService();
