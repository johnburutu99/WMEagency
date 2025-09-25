import nodemailer from "nodemailer";

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SSL === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  private generateOtpHtmlTemplate(otp: string): string {
    const brandColor = "#cdaa7c";

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your One-Time Password</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f6f6f6; }
          .card { background: #fff; max-width: 600px; margin: 40px auto; padding: 20px; border-radius: 8px; }
          .brand { color: ${brandColor}; font-weight: bold; }
          .otp { font-size: 28px; letter-spacing: 4px; font-weight: 700; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2 class="brand">WME Client Portal</h2>
          <p>Your one-time password (OTP) is:</p>
          <p class="otp">${otp}</p>
          <p>If you did not request this code, you can safely ignore this email.</p>
          <p>Thank you,<br/>The WME Team</p>
        </div>
      </body>
      </html>
    `;
  }

  private generateWelcomeHtmlTemplate(name: string, bookingId: string): string {
    const brandColor = "#cdaa7c";
    const portalUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to WME Client Portal</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f6f6f6; }
          .card { background: #fff; max-width: 600px; margin: 40px auto; padding: 20px; border-radius: 8px; }
          .brand { color: ${brandColor}; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2 class="brand">Welcome, ${name}!</h2>
          <p>Your booking ID is <strong>${bookingId}</strong>.</p>
          <p>You can access your client portal here: <a href="${portalUrl}">${portalUrl}</a></p>
          <p>Thank you,<br/>The WME Team</p>
        </div>
      </body>
      </html>
    `;
  }

  async sendOtpEmail(to: string, otp: string) {
    const html = this.generateOtpHtmlTemplate(otp);
    const mailOptions = {
      from: `"WME Client Portal" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Your WME OTP",
      html,
    };

    return this.transporter.sendMail(mailOptions);
  }

  async sendWelcomeEmail(to: string, name: string, bookingId: string) {
    const html = this.generateWelcomeHtmlTemplate(name, bookingId);
    const mailOptions = {
      from: `"WME Client Portal" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Welcome to WME Client Portal",
      html,
    };

    return this.transporter.sendMail(mailOptions);
  }
}

export const emailService = new EmailService();
