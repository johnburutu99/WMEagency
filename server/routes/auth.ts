import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { authService, BookingIdSchema } from "../services/authService";
import { globalClients } from "./booking-submission";
import { z } from "zod";

// Request validation schemas
const LoginRequestSchema = z.object({
  bookingId: BookingIdSchema,
});

const AdminLoginRequestSchema = z.object({
  username: z.string(),
  password: z.string(),
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

    const authorization = req.headers.authorization;
    if (authorization && authorization.startsWith("Bearer ")) {
      const token = authorization.split(" ")[1];
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) throw new Error("JWT secret not set");

      try {
        const decoded = jwt.verify(token, jwtSecret) as { bookingId: string; isImpersonating: boolean };
        if (decoded.isImpersonating && decoded.bookingId === req.body.bookingId) {
          // Impersonation successful, proceed to fetch client data
          console.log(`Impersonation login for bookingId: ${decoded.bookingId}`);
        } else {
          return res.status(401).json({ success: false, error: "Invalid impersonation token" });
        }
      } catch (error) {
        return res.status(401).json({ success: false, error: "Invalid impersonation token" });
      }
    }

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
        error: result.error || "Invalid booking ID",
      });
    }

    // Return user data (excluding sensitive information)
    const { user } = result;
    const userResponse = {
      bookingId: user!.bookingId,
      name: user!.name,
      artist: user!.artist,
      event: user!.event,
      eventDate: user!.eventDate,
      status: user!.status,
      coordinator: user!.coordinator,
    };

    console.log("Login successful for:", userResponse.name);

    res.json({
      success: true,
      user: userResponse,
      message: "Authentication successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

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
      bookingId: booking!.bookingId,
      name: booking!.name,
      artist: booking!.artist,
      event: booking!.event,
      eventDate: booking!.eventDate,
      status: booking!.status,
      coordinator: booking!.coordinator,
      createdAt: booking!.metadata?.createdAt,
    };

    console.log("Booking created successfully:", bookingResponse.bookingId);

    res.status(201).json({
      success: true,
      booking: bookingResponse,
      message: "Booking created successfully",
    });
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

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
      bookingId: user!.bookingId,
      name: user!.name,
      artist: user!.artist,
      event: user!.event,
      eventDate: user!.eventDate,
      status: user!.status,
      coordinator: user!.coordinator,
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

// POST /api/auth/admin/login
export const handleAdminLogin: RequestHandler = async (req, res) => {
  try {
    const validation = AdminLoginRequestSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: "Invalid request format",
        details: validation.error.errors,
      });
    }

    const { username, password } = validation.data;

    const adminUser = process.env.ADMIN_USER;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const jwtSecret = process.env.JWT_SECRET;

    if (!adminUser || !adminPassword || !jwtSecret) {
      console.error("Admin credentials or JWT secret not set in .env");
      return res.status(500).json({
        success: false,
        error: "Server configuration error",
      });
    }

    if (username === adminUser && password === adminPassword) {
      const token = jwt.sign({ isAdmin: true, username }, jwtSecret, {
        expiresIn: "1h",
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600000, // 1 hour
      });

      return res.json({
        success: true,
        message: "Admin login successful",
      });
    } else {
      return res.status(401).json({
        success: false,
        error: "Invalid admin credentials",
      });
    }
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// GET /api/auth/admin/verify
export const handleVerifyAdminSession: RequestHandler = (req, res) => {
  // This route is protected by the adminAuthMiddleware.
  // If we reach here, the user is an authenticated admin.
  res.json({
    success: true,
    message: "Admin session is valid",
    user: req.user,
  });
};

// POST /api/auth/admin/logout
export const handleAdminLogout: RequestHandler = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
  });

  res.json({
    success: true,
    message: "Admin logged out successfully",
  });
};

// POST /api/auth/admin/impersonate
export const handleImpersonateClient: RequestHandler = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        error: "Booking ID is required",
      });
    }

    const result = await authService.authenticateByBookingId(bookingId);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        error: "Client not found",
      });
    }

    const { user } = result;
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error("JWT secret not set in .env");
      return res.status(500).json({
        success: false,
        error: "Server configuration error",
      });
    }

    const impersonationToken = jwt.sign(
      {
        bookingId: user!.bookingId,
        isImpersonating: true,
        adminUsername: req.user?.username, // Assuming admin user is on req.user
      },
      jwtSecret,
      { expiresIn: "10m" } // Short-lived token
    );

    res.json({
      success: true,
      data: {
        impersonationToken,
        client: {
          bookingId: user!.bookingId,
          name: user!.name,
        },
      },
      message: `Impersonation session started for ${user!.name}.`,
    });
  } catch (error) {
    console.error("Impersonate client error:", error);
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
};
