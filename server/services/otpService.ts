import crypto from "crypto";

interface OtpEntry {
  otp: string;
  expires: number;
}

// In-memory store for OTPs. In production, use a database or Redis.
const otpStore = new Map<string, OtpEntry>();

class OtpService {
  public generateOtp(identifier: string): string {
    const otp = crypto.randomInt(100000, 999999).toString();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    otpStore.set(identifier, { otp, expires });

    console.log(`Generated OTP for ${identifier}: ${otp}`); // For debugging
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
