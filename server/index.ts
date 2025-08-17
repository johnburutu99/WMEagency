import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { handleDemo } from "./routes/demo";
import {
  handleLogin,
  handleCreateBooking,
  handleVerifySession,
  handleLogout,
  handleGenerateBookingId,
  handleAdminLogin,
  handleVerifyAdminSession,
  handleAdminLogout,
  handleImpersonateClient,
} from "./routes/auth";
import {
  handleGetMyBookings,
  handleGetBookingDetails,
  handleUpdateBookingStatus,
} from "./routes/bookings";
import {
  getAllClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
  bulkUpdateClients,
  generateBookingId,
} from "./routes/clients";
import {
  getDashboardStats,
  getClientAnalytics,
  exportClients,
  getSystemHealth,
  sendCommandToClient,
  approvePayment,
} from "./routes/admin";
import { adminAuthMiddleware } from "./middleware/auth";
import {
  handleBookingSubmission,
  handleEmailVerification,
  handleResendOTP,
  handleBookingStatus,
} from "./routes/booking-submission";
import {
  handleInitiatePaymentOtp,
  handleVerifyPaymentOtp,
  handleGenerateDepositAddress,
} from "./routes/payment";
import { handleProfilePictureUpload } from "./routes/user";
import http from "http";
import { SocketService } from "./services/socketService";
import {
  createInvoice,
  listInvoices,
  getInvoice,
} from "./routes/invoice.js";

export function createServer() {
  const app = express();
  const server = http.createServer(app);
  const socketService = new SocketService(server);
  const io = socketService.getIO();

  // Middleware
  app.use((req, res, next) => {
    (req as any).io = io;
    next();
  });
  app.use(
    cors({
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use(cookieParser());

  // Request logging middleware
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });

  // Health check
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({
      message: ping,
      timestamp: new Date().toISOString(),
      status: "healthy",
    });
  });

  // Legacy demo route
  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.post("/api/auth/login", handleLogin);
  app.post("/api/auth/admin/login", handleAdminLogin);
  app.post("/api/auth/admin/logout", handleAdminLogout);
  app.get("/api/auth/admin/verify", adminAuthMiddleware, handleVerifyAdminSession);
  app.post("/api/auth/admin/impersonate", adminAuthMiddleware, handleImpersonateClient);
  app.post("/api/auth/create-booking", handleCreateBooking);
  app.get("/api/auth/verify-session", handleVerifySession);
  app.post("/api/auth/logout", handleLogout);
  app.get("/api/auth/generate-booking-id", handleGenerateBookingId);

  // Booking management routes
  app.get("/api/bookings/my-bookings", handleGetMyBookings);
  app.get("/api/bookings/:bookingId", handleGetBookingDetails);
  app.put("/api/bookings/:bookingId/status", handleUpdateBookingStatus);

  // Client management routes
  app.get("/api/clients", getAllClients);
  app.get("/api/clients/:bookingId", getClient);
  app.post("/api/clients", adminAuthMiddleware, createClient);
  app.put("/api/clients/:bookingId", adminAuthMiddleware, updateClient);
  app.delete("/api/clients/:bookingId", adminAuthMiddleware, deleteClient);
  app.post("/api/clients/bulk-update", adminAuthMiddleware, bulkUpdateClients);
  app.get("/api/booking-id/generate", generateBookingId);

  // Admin routes
  app.get("/api/admin/dashboard", adminAuthMiddleware, getDashboardStats);
  app.get("/api/admin/analytics", adminAuthMiddleware, getClientAnalytics);
  app.get("/api/admin/export", adminAuthMiddleware, exportClients);
  app.get("/api/admin/health", adminAuthMiddleware, getSystemHealth);
  app.post("/api/admin/command", adminAuthMiddleware, sendCommandToClient);
  app.post(
    "/api/admin/approve-payment/:bookingId",
    adminAuthMiddleware,
    approvePayment,
  );

  // Booking submission routes
  app.post("/api/booking/submit", handleBookingSubmission);
  app.post("/api/booking/verify-email", handleEmailVerification);
  app.post("/api/booking/resend-otp", handleResendOTP);
  app.get("/api/booking/status/:bookingId", handleBookingStatus);

  // Payment routes
  app.post("/api/payment/initiate-otp", handleInitiatePaymentOtp);
  app.post("/api/payment/verify-otp", handleVerifyPaymentOtp);
  app.get(
    "/api/payment/deposit-address",
    adminAuthMiddleware,
    handleGenerateDepositAddress,
  );

  // app.get("/api/invoice/:id", async (req, res) => {
  //   const { checkPayment } = await import("./services/paymentService");
  //   const { clientDatabase } = await import("./models/Client");
  //   const client = await clientDatabase.getClient(req.params.id);
  //   if (!client) {
  //     return res.status(404).json({ error: "Invoice not found" });
  //   }
  //   const paid = await checkPayment(
  //     "bc1qynk4vkfuvjfwyylta9w6dq9haa5yx3hsrx80m6",
  //     ((client.contractAmount || 0) / 50000).toString(),
  //   );
  //   if (paid) {
  //     client.status = "completed";
  //     await clientDatabase.updateClient(req.params.id, client);
  //   }
  //   res.json(client);
  // });

  // User routes
  app.post("/api/user/profile-picture", handleProfilePictureUpload);

  // Invoice routes
  app.post("/api/invoice", createInvoice);
  app.get("/api/invoices", listInvoices);
  app.get("/api/invoice/:id", getInvoice);

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

  // 404 handler for API routes
  app.use("/api/*", (req, res) => {
    res.status(404).json({
      success: false,
      error: `API endpoint not found: ${req.method} ${req.path}`,
      path: req.path,
    });
  });

  // Let Vite handle non-API routes in development
  // In production, you would serve static files here

  return app;
}
