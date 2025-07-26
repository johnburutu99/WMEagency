import { RequestHandler } from "express";
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

    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

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
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// Logout (client-side operation, just acknowledge)
export const logout: RequestHandler = async (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully",
  });
};
