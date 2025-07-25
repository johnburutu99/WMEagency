import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleLogin,
  handleCreateBooking,
  handleVerifySession,
  handleLogout,
  handleGenerateBookingId,
} from "./routes/auth";
import {
  handleGetMyBookings,
  handleGetBookingDetails,
  handleUpdateBookingStatus,
} from "./routes/bookings";

export function createServer() {
  const app = express();

  // Middleware
  app.use(
    cors({
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logging middleware
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });

  // Health check
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping, timestamp: new Date().toISOString() });
  });

  // Legacy demo route
  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.post("/api/auth/login", handleLogin);
  app.post("/api/auth/create-booking", handleCreateBooking);
  app.get("/api/auth/verify-session", handleVerifySession);
  app.post("/api/auth/logout", handleLogout);
  app.get("/api/auth/generate-booking-id", handleGenerateBookingId);

  // Booking management routes
  app.get("/api/bookings/my-bookings", handleGetMyBookings);
  app.get("/api/bookings/:bookingId", handleGetBookingDetails);
  app.put("/api/bookings/:bookingId/status", handleUpdateBookingStatus);

  // Error handling middleware
  app.use(
    (
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      console.error("Server error:", err);
      res.status(500).json({
        success: false,
        error: "Internal server error",
        ...(process.env.NODE_ENV === "development" && { details: err.message }),
      });
    },
  );

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: "API endpoint not found",
      path: req.path,
    });
  });

  return app;
}
