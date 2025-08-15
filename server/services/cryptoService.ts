import crypto from "crypto";

class CryptoService {
  public generateDepositAddress(): { address: string; nonce: string } {
    // In a real application, you would use a proper library to generate a new
    // address for each deposit. For this demo, we will generate a random
    // string to simulate a new address.
    const address = `0x${crypto.randomBytes(20).toString("hex")}`;
    const nonce = crypto.randomBytes(16).toString("hex");
    return { address, nonce };
  }
}

export const cryptoService = new CryptoService();
