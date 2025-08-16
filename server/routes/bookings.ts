import { RequestHandler } from "express";
import { authService } from "../services/authService";
import { z } from "zod";

// Request validation schemas
const UpdateBookingStatusSchema = z.object({
  status: z.enum(["active", "pending", "completed", "cancelled"]),
});

// GET /api/bookings/my-bookings
export const handleGetMyBookings: RequestHandler = async (req, res) => {
  try {
    const bookingId = req.headers["x-booking-id"] as string;

    if (!bookingId) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    // Verify user exists
    const authResult = await authService.authenticateByBookingId(bookingId);
    if (!authResult.success || !authResult.user) {
      return res.status(401).json({
        success: false,
        error: "Invalid authentication",
      });
    }

    const user = authResult.user;

    // For this demo, return the user's current booking
    // In a real system, a user might have multiple bookings
    const booking = {
      id: user.bookingId,
      artist: user.artist,
      event: user.event,
      eventDate: user.eventDate,
      status: user.status,
      coordinatorId: user.coordinator.name,
      timeline: getBookingProgress(user.status),
      amount: getAmountForArtist(user.artist),
      location: getLocationForEvent(user.event),
      coordinator: getCoordinatorInfo(user.coordinator.name),
    };

    res.json({
      success: true,
      bookings: [booking],
      total: 1,
    });
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// GET /api/bookings/:bookingId
export const handleGetBookingDetails: RequestHandler = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const requestingBookingId = req.headers["x-booking-id"] as string;

    // Verify requesting user
    const authResult =
      await authService.authenticateByBookingId(requestingBookingId);
    if (!authResult.success || !authResult.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    // For security, users can only access their own booking details
    if (bookingId !== requestingBookingId) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    const user = authResult.user;

    // Return detailed booking information
    const bookingDetails = {
      id: user.bookingId,
      artist: user.artist,
      event: user.event,
      eventDate: user.eventDate,
      status: user.status,
      coordinatorId: user.coordinator.name,
      timeline: getBookingProgress(user.status),
      amount: getAmountForArtist(user.artist),
      location: getLocationForEvent(user.event),
      coordinator: getCoordinatorInfo(user.coordinator.name),
      documents: getBookingDocuments(user.bookingId),
      payments: getPaymentHistory(user.bookingId),
      messages: getRecentMessages(user.coordinator.name),
      createdAt: user.metadata?.createdAt,
      updatedAt: user.metadata?.updatedAt,
    };

    res.json({
      success: true,
      booking: bookingDetails,
    });
  } catch (error) {
    console.error("Get booking details error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// PUT /api/bookings/:bookingId/status
export const handleUpdateBookingStatus: RequestHandler = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const requestingBookingId = req.headers["x-booking-id"] as string;

    // Validate request body
    const validation = UpdateBookingStatusSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: "Invalid status update data",
        details: validation.error.issues,
      });
    }

    const { status } = validation.data;

    // Verify requesting user
    const authResult =
      await authService.authenticateByBookingId(requestingBookingId);
    if (!authResult.success || !authResult.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    // For security, users can only update their own booking
    if (bookingId !== requestingBookingId) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    // Update booking status
    const updateResult = await authService.updateBookingStatus(
      bookingId,
      status,
    );
    if (!updateResult.success) {
      return res.status(400).json({
        success: false,
        error: updateResult.error,
      });
    }

    res.json({
      success: true,
      booking: updateResult.booking,
      message: "Booking status updated successfully",
    });
  } catch (error) {
    console.error("Update booking status error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// Helper functions to simulate related data
function getBookingProgress(status: string): number {
  const progressMap: { [key: string]: number } = {
    pending: 25,
    active: 75,
    completed: 100,
    cancelled: 0,
  };
  return progressMap[status] || 0;
}

function getAmountForArtist(artist: string): string {
  const amounts: { [key: string]: string } = {
    "Taylor Swift": "$2,500,000",
    "Dwayne Johnson": "$750,000",
    Zendaya: "$150,000",
    "Ryan Reynolds": "$1,200,000",
    "Chris Evans": "$950,000",
  };
  return amounts[artist] || "$500,000";
}

function getLocationForEvent(event: string): string {
  const locations: { [key: string]: string } = {
    "Grammy Awards Performance": "Crypto.com Arena, Los Angeles",
    "Fast X Premiere": "TCL Chinese Theatre, Hollywood",
    "Vogue Photoshoot": "Conde Nast Studios, NYC",
    "Press Tour Services": "Various Locations",
    "Marvel Contract Signing": "Disney Studios, Burbank",
  };
  return locations[event] || "TBD";
}

function getCoordinatorInfo(coordinatorId: string) {
  const coordinators: { [key: string]: any } = {
    coord_001: {
      id: "coord_001",
      name: "Sarah Johnson",
      role: "Senior Talent Coordinator",
      email: "sarah.johnson@wme.com",
      phone: "+1 (310) 285-9000",
    },
    coord_002: {
      id: "coord_002",
      name: "Michael Chen",
      role: "Talent Coordinator",
      email: "michael.chen@wme.com",
      phone: "+1 (310) 285-9001",
    },
    coord_003: {
      id: "coord_003",
      name: "Emma Williams",
      role: "Project Manager",
      email: "emma.williams@wme.com",
      phone: "+1 (310) 285-9002",
    },
    coord_004: {
      id: "coord_004",
      name: "David Park",
      role: "Legal Coordinator",
      email: "david.park@wme.com",
      phone: "+1 (310) 285-9003",
    },
  };
  return (
    coordinators[coordinatorId] || {
      id: coordinatorId,
      name: "WME Coordinator",
      role: "Coordinator",
      email: "coordinator@wme.com",
      phone: "+1 (310) 285-9000",
    }
  );
}

function getBookingDocuments(bookingId: string) {
  return [
    {
      id: "doc_001",
      name: "Performance Agreement",
      type: "Contract",
      status: "signed",
      uploadDate: "2024-01-15",
      size: "2.4 MB",
    },
    {
      id: "doc_002",
      name: "NDA Agreement",
      type: "NDA",
      status: "pending",
      uploadDate: "2024-01-20",
      size: "1.2 MB",
    },
  ];
}

function getPaymentHistory(bookingId: string) {
  return [
    {
      id: "pay_001",
      amount: "$1,250,000",
      description: "Booking Deposit (50%)",
      status: "paid",
      date: "2024-01-15",
      method: "Wire Transfer",
    },
    {
      id: "pay_002",
      amount: "$1,250,000",
      description: "Final Payment (50%)",
      status: "pending",
      dueDate: "2024-02-01",
      method: "Wire Transfer",
    },
  ];
}

function getRecentMessages(coordinatorId: string) {
  return [
    {
      id: "msg_001",
      from: "Sarah Johnson",
      content: "Hi! The contract is ready for your review.",
      timestamp: "2024-01-20T10:30:00Z",
      unread: true,
    },
    {
      id: "msg_002",
      from: "You",
      content: "Thank you! I'll review it today.",
      timestamp: "2024-01-20T11:00:00Z",
      unread: false,
    },
  ];
}
