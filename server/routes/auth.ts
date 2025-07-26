import { RequestHandler } from "express";
<<<<<<< HEAD
import { z } from "zod";
import { clientDatabase } from "../models/Client";

// Validation schemas
const LoginSchema = z.object({
  bookingId: z
    .string()
    .regex(/^[A-Z0-9]{8}$/i, "Booking ID must be 8 alphanumeric characters"),
});

// Login with booking ID
export const login: RequestHandler = async (req, res) => {
  try {
    const { bookingId } = LoginSchema.parse(req.body);

    // Get client data
    const client = await clientDatabase.getClient(bookingId);

    if (!client) {
      return res.status(401).json({
        success: false,
        error: "Invalid Booking ID. Please check your booking confirmation.",
      });
    }

    if (!client.metadata?.isVerified) {
      return res.status(403).json({
        success: false,
        error: "Booking ID is not verified. Please contact your coordinator.",
      });
    }

    // Return client data (excluding sensitive information)
    const clientData = {
      bookingId: client.bookingId,
      name: client.name,
      artist: client.artist,
      event: client.event,
      eventDate: client.eventDate,
      eventLocation: client.eventLocation,
      status: client.status,
      contractAmount: client.contractAmount,
      currency: client.currency,
      coordinator: client.coordinator,
      lastLogin: client.metadata?.lastLogin,
      priority: client.metadata?.priority,
    };

    res.json({
      success: true,
      data: {
        client: clientData,
        message: "Authentication successful",
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: "Invalid booking ID format",
        details: error.errors,
      });
    }

=======
import { authService, BookingIdSchema } from "../services/authService";
import { z } from "zod";

// Request validation schemas
const LoginRequestSchema = z.object({
  bookingId: BookingIdSchema,
});

const CreateBookingRequestSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  clientEmail: z.string().email("Valid email is required"),
  artist: z.string().min(1, "Artist name is required"),
  event: z.string().min(1, "Event description is required"),
  eventDate: z.string().min(1, "Event date is required"),
  coordinatorId: z.string().min(1, "Coordinator ID is required"),
});

// POST /api/auth/login
export const handleLogin: RequestHandler = async (req, res) => {
  try {
    console.log("Login attempt:", req.body);

    // Validate request body
    const validation = LoginRequestSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: "Invalid request format",
        details: validation.error.errors,
      });
    }

    const { bookingId } = validation.data;

    // Simulate processing delay (remove in production)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Authenticate user
    const result = await authService.authenticateByBookingId(bookingId);

    if (!result.success) {
      return res.status(401).json({
        success: false,
        error: result.error,
      });
    }

    // Return user data (excluding sensitive information)
    const { user } = result;
    const userResponse = {
      id: user!.id,
      bookingId: user!.bookingId,
      name: user!.name,
      artist: user!.artist,
      event: user!.event,
      eventDate: user!.eventDate,
      status: user!.status,
      coordinatorId: user!.coordinatorId,
    };

    console.log("Login successful for:", userResponse.name);

    res.json({
      success: true,
      user: userResponse,
      message: "Authentication successful",
    });
  } catch (error) {
>>>>>>> 78090f6af51bfa4bce7537e950ad787e75a88f6c
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

<<<<<<< HEAD
// Verify booking ID exists
export const verifyBookingId: RequestHandler = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!bookingId || !bookingId.match(/^[A-Z0-9]{8}$/i)) {
      return res.status(400).json({
        success: false,
        error: "Invalid booking ID format",
      });
    }

    const exists = await clientDatabase.verifyBookingId(bookingId);

    res.json({
      success: true,
      data: {
        exists,
        bookingId: bookingId.toUpperCase(),
      },
    });
  } catch (error) {
    console.error("Verification error:", error);
=======
// POST /api/auth/create-booking
export const handleCreateBooking: RequestHandler = async (req, res) => {
  try {
    console.log("Creating new booking:", req.body);

    // Validate request body
    const validation = CreateBookingRequestSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: "Invalid booking data",
        details: validation.error.errors,
      });
    }

    const bookingData = validation.data;

    // Create new booking
    const result = await authService.createNewBooking(bookingData);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
      });
    }

    // Return booking confirmation
    const { booking } = result;
    const bookingResponse = {
      id: booking!.id,
      bookingId: booking!.bookingId,
      name: booking!.name,
      artist: booking!.artist,
      event: booking!.event,
      eventDate: booking!.eventDate,
      status: booking!.status,
      coordinatorId: booking!.coordinatorId,
      createdAt: booking!.createdAt,
    };

    console.log("Booking created successfully:", bookingResponse.bookingId);

    res.status(201).json({
      success: true,
      booking: bookingResponse,
      message: "Booking created successfully",
    });
  } catch (error) {
    console.error("Create booking error:", error);
>>>>>>> 78090f6af51bfa4bce7537e950ad787e75a88f6c
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

<<<<<<< HEAD
// Logout (client-side operation, just acknowledge)
export const logout: RequestHandler = async (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully",
  });
=======
// GET /api/auth/verify-session
export const handleVerifySession: RequestHandler = async (req, res) => {
  try {
    // In a real implementation, you would verify JWT token or session
    // For now, we'll check if booking ID is provided in headers
    const bookingId = req.headers["x-booking-id"] as string;

    if (!bookingId) {
      return res.status(401).json({
        success: false,
        error: "No session found",
      });
    }

    // Verify booking ID still exists
    const result = await authService.authenticateByBookingId(bookingId);

    if (!result.success) {
      return res.status(401).json({
        success: false,
        error: "Invalid session",
      });
    }

    const { user } = result;
    const userResponse = {
      id: user!.id,
      bookingId: user!.bookingId,
      name: user!.name,
      artist: user!.artist,
      event: user!.event,
      eventDate: user!.eventDate,
      status: user!.status,
      coordinatorId: user!.coordinatorId,
    };

    res.json({
      success: true,
      user: userResponse,
      message: "Session valid",
    });
  } catch (error) {
    console.error("Session verification error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// POST /api/auth/logout
export const handleLogout: RequestHandler = async (req, res) => {
  try {
    // In a real implementation, you would invalidate the JWT token or session
    // For this demo, we'll just return success

    console.log("User logged out");

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// GET /api/auth/generate-booking-id (Admin only - for testing)
export const handleGenerateBookingId: RequestHandler = async (req, res) => {
  try {
    const newBookingId = authService.generateNewBookingId();

    res.json({
      success: true,
      bookingId: newBookingId,
      message: "New booking ID generated",
    });
  } catch (error) {
    console.error("Generate booking ID error:", error);
    res.status(500).json({
      success: false,
      error: "Unable to generate booking ID",
    });
  }
>>>>>>> 78090f6af51bfa4bce7537e950ad787e75a88f6c
};
