import crypto from "crypto";
import { emailService } from "./emailService";

interface OtpEntry {
  otp: string;
  expires: number;
}

// In-memory store for OTPs. In production, use a database or Redis.
const otpStore = new Map<string, OtpEntry>();

class OtpService {
  public async generateOtp(identifier: string): Promise<string> {
    const otp = crypto.randomInt(100000, 999999).toString();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    otpStore.set(identifier, { otp, expires });

    await emailService.sendOtpEmail(identifier, otp);

    console.log(`Generated and sent OTP for ${identifier}: ${otp}`); // For debugging
    return otp;
  }

  public verifyOtp(identifier: string, otpToVerify: string): boolean {
    const entry = otpStore.get(identifier);

    if (!entry) {
      return false;
    }

    if (Date.now() > entry.expires) {
      otpStore.delete(identifier); // Clean up expired OTP
      return false;
    }

    if (entry.otp === otpToVerify) {
      otpStore.delete(identifier); // OTP is single-use
      return true;
    }

    return false;
  }
}

export const otpService = new OtpService();
