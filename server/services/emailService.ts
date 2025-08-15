import nodemailer from 'nodemailer';

class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SSL === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  private generateOtpHtmlTemplate(otp: string): string {
    const brandColor = "#cdaa7c";
    const fontFamily = "Georgia, serif";
    const logoUrl = "https://i.imgur.com/oZ1Z3bO.png"; // Placeholder logo

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your One-Time Password</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Roboto:wght@400&display=swap');
          .button:hover {
            opacity: 0.8;
            transition: opacity 0.3s ease;
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Roboto', ${fontFamily}; background-color: #121212; color: #ffffff;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #1a1a1a; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          <tr>
            <td align="center" style="padding: 40px 20px; border-bottom: 1px solid #333333;">
              <img src="${logoUrl}" alt="WME Logo" style="width: 120px;"/>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #ffffff; margin-top: 0; font-family: 'Playfair Display', serif; font-size: 28px;">Your Verification Code</h2>
              <p style="color: #bbbbbb; line-height: 1.6;">Hello,</p>
              <p style="color: #bbbbbb; line-height: 1.6;">Please use the following verification code to complete your action. This code is valid for 10 minutes.</p>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 30px 0;">
                <tr>
                  <td align="center" style="background-color: #2a2a2a; padding: 20px; border-radius: 8px;">
                    <p style="color: ${brandColor}; font-size: 36px; font-weight: bold; letter-spacing: 8px; margin: 0; font-family: 'Courier New', Courier, monospace;">${otp}</p>
                  </td>
                </tr>
              </table>
              <p style="color: #bbbbbb; line-height: 1.6;">If you did not request this code, you can safely ignore this email.</p>
              <p style="color: #bbbbbb; line-height: 1.6;">Thank you,<br>The WME Team</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px 30px; background-color: #111111; border-top-left-radius: 12px; border-top-right-radius: 12px;">
              <p style="color: #888888; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} WME. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  }

  private generateWelcomeHtmlTemplate(name: string, bookingId: string): string {
    const brandColor = "#cdaa7c";
    const portalUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const fontFamily = "Georgia, serif";
    const logoUrl = "https://i.imgur.com/oZ1Z3bO.png"; // Placeholder logo

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to the WME Client Portal</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Roboto:wght@400&display=swap');
          .button:hover {
            opacity: 0.8;
            transition: opacity 0.3s ease;
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Roboto', ${fontFamily}; background-color: #121212; color: #ffffff;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #1a1a1a; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          <tr>
            <td align="center" style="padding: 40px 20px; border-bottom: 1px solid #333333;">
              <img src="${logoUrl}" alt="WME Logo" style="width: 120px;"/>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #ffffff; margin-top: 0; font-family: 'Playfair Display', serif; font-size: 28px;">Welcome, ${name}!</h2>
              <p style="color: #bbbbbb; line-height: 1.6;">Thank you for choosing WME. Your client portal for the booking <strong>${bookingId}</strong> is now ready. You can access it using your unique Booking ID.</p>
              <p style="color: #bbbbbb; line-height: 1.6;">Your Booking ID is:</p>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 30px 0;">
                <tr>
                  <td align="center" style="background-color: #2a2a2a; padding: 20px; border-radius: 8px;">
                    <p style="color: ${brandColor}; font-size: 36px; font-weight: bold; letter-spacing: 8px; margin: 0; font-family: 'Courier New', Courier, monospace;">${bookingId}</p>
                  </td>
                </tr>
              </table>
              <p style="text-align: center; margin-top: 30px;">
                <a href="${portalUrl}" class="button" style="background-color: ${brandColor}; color: #000000; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">Access Your Portal</a>
              </p>
              <p style="color: #bbbbbb; line-height: 1.6; margin-top: 30px;">If you have any questions, please contact your WME coordinator.</p>
              <p style="color: #bbbbbb; line-height: 1.6;">Thank you,<br>The WME Team</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px 30px; background-color: #111111; border-top-left-radius: 12px; border-top-right-radius: 12px;">
              <p style="color: #888888; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} WME. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  }

  public async sendWelcomeEmail(email: string, name: string, bookingId: string): Promise<{ success: boolean; message: string }> {
    const htmlBody = this.generateWelcomeHtmlTemplate(name, bookingId);

    const mailOptions = {
      from: `"WME Client Portal" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to the WME Client Portal',
      html: htmlBody,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Welcome email sent to ${email}`);
      return { success: true, message: 'Welcome email sent successfully.' };
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, message: 'Failed to send welcome email.' };
    }
  }

  public async sendOtpEmail(email: string, otp: string): Promise<{ success: boolean; message: string }> {
    const htmlBody = this.generateOtpHtmlTemplate(otp);

    const mailOptions = {
      from: `"WME Client Portal" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your One-Time Password (OTP)',
      html: htmlBody,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`OTP email sent to ${email}`);
      return { success: true, message: 'OTP email sent successfully.' };
    } catch (error) {
      console.error('Error sending OTP email:', error);
      return { success: false, message: 'Failed to send OTP email.' };
    }
  }

  public async sendReminderEmail(
    email: string,
    name: string,
    balance: number,
  ): Promise<{ success: boolean; message: string }> {
    const brandColor = "#cdaa7c";
    const portalUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const fontFamily = "Georgia, serif";
    const logoUrl = "https://i.imgur.com/oZ1Z3bO.png"; // Placeholder logo

    const htmlBody = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Reminder</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Roboto:wght@400&display=swap');
          .button:hover {
            opacity: 0.8;
            transition: opacity 0.3s ease;
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Roboto', ${fontFamily}; background-color: #121212; color: #ffffff;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #1a1a1a; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          <tr>
            <td align="center" style="padding: 40px 20px; border-bottom: 1px solid #333333;">
              <img src="${logoUrl}" alt="WME Logo" style="width: 120px;"/>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #ffffff; margin-top: 0; font-family: 'Playfair Display', serif; font-size: 28px;">Payment Reminder</h2>
              <p style="color: #bbbbbb; line-height: 1.6;">Hello ${name},</p>
              <p style="color: #bbbbbb; line-height: 1.6;">This is a friendly reminder that you have a pending balance of <strong>$${balance.toLocaleString()}</strong>.</p>
              <p style="color: #bbbbbb; line-height: 1.6;">Please log in to your account to make a payment at your earliest convenience.</p>
              <p style="text-align: center; margin-top: 30px;">
                <a href="${portalUrl}/dashboard/payments" class="button" style="background-color: ${brandColor}; color: #000000; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">Make a Payment</a>
              </p>
              <p style="color: #bbbbbb; line-height: 1.6; margin-top: 30px;">If you have already made this payment, please disregard this email.</p>
              <p style="color: #bbbbbb; line-height: 1.6;">Thank you,<br>The WME Team</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px 30px; background-color: #111111; border-top-left-radius: 12px; border-top-right-radius: 12px;">
              <p style="color: #888888; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} WME. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"WME Client Portal" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Payment Reminder",
      html: htmlBody,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Reminder email sent to ${email}`);
      return { success: true, message: "Reminder email sent successfully." };
    } catch (error) {
      console.error("Error sending reminder email:", error);
      return { success: false, message: "Failed to send reminder email." };
    }
  }
}

export const emailService = new EmailService();
