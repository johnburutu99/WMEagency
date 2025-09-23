import crypto from "crypto";
import { clientDatabase } from "../models/Client";

export async function generateBookingId(): Promise<string> {
  let bookingId: string;
  let attempts = 0;
  const maxAttempts = 10;

  do {
    // Generate random 8-character booking ID
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    bookingId = "";
    for (let i = 0; i < 8; i++) {
      bookingId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    attempts++;
  } while (
    (await clientDatabase.verifyBookingId(bookingId)) &&
    attempts < maxAttempts
  );

  if (attempts >= maxAttempts) {
    throw new Error("Unable to generate unique booking ID");
  }

  return bookingId;
}

class CryptoService {
  public generateDepositAddress(): { address:string; nonce:string } {
    // In a real application, you would use a proper library to generate a new
    // address for each deposit. For this demo, we will generate a random
    // string to simulate a new address.
    const address = `0x${crypto.randomBytes(20).toString("hex")}`;
    const nonce = crypto.randomBytes(16).toString("hex");
    return { address, nonce };
  }
}

export const cryptoService = new CryptoService();
