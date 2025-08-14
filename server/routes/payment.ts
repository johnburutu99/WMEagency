import { RequestHandler } from "express";
import { z } from "zod";
import { otpService } from "../services/otpService";
import { emailService } from "../services/emailService";
import { clientDatabase } from "../models/Client";

// Schema for initiating OTP request
const InitiateOtpSchema = z.object({
  bookingId: z.string(),
});

// Schema for verifying OTP request
const VerifyOtpSchema = z.object({
  bookingId: z.string(),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const handleInitiatePaymentOtp: RequestHandler = async (req, res) => {
  try {
    const validation = InitiateOtpSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: "Invalid request" });
    }

    const { bookingId } = validation.data;

    // In a real app, you'd get the user from the authenticated session.
    // Here, we'll fetch the client to get their email.
    const client = await clientDatabase.getClient(bookingId);
    if (!client || !client.email) {
      return res.status(404).json({ success: false, error: "Client not found or has no email." });
    }

    const otp = otpService.generateOtp(client.email);
    await emailService.sendOtpEmail(client.email, otp);

    res.json({ success: true, message: "OTP has been sent to your registered email." });

  } catch (error) {
    console.error("Initiate OTP error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const handleVerifyPaymentOtp: RequestHandler = async (req, res) => {
  try {
    const validation = VerifyOtpSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: "Invalid request" });
    }

    const { bookingId, otp } = validation.data;

    // Again, fetch client to get the identifier (email)
    const client = await clientDatabase.getClient(bookingId);
    if (!client || !client.email) {
      return res.status(404).json({ success: false, error: "Client not found." });
    }

    const isValid = otpService.verifyOtp(client.email, otp);

    if (isValid) {
      // In a real app, you might issue a short-lived token here for the next step.
      res.json({ success: true, message: "OTP verified successfully." });
    } else {
      res.status(400).json({ success: false, error: "Invalid or expired OTP." });
    }

  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
