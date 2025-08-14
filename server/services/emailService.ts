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
    const fontFamily = "Arial, sans-serif";

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your One-Time Password</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
        </style>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Poppins', ${fontFamily}; background-color: #f4f4f4;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 6px 18px rgba(0,0,0,0.06);">
          <tr>
            <td align="center" style="padding: 30px 20px; background-color: #1a1a1a; border-top-left-radius: 12px; border-top-right-radius: 12px;">
              <h1 style="color: ${brandColor}; margin: 0; font-size: 28px; font-weight: 600;">WME Client Portal</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #333333; margin-top: 0; font-weight: 600;">Your Verification Code</h2>
              <p style="color: #555555; line-height: 1.6;">Hello,</p>
              <p style="color: #555555; line-height: 1.6;">Please use the following verification code to complete your action. This code is valid for 10 minutes.</p>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 30px 0;">
                <tr>
                  <td align="center" style="background-color: #f4f4f4; padding: 20px; border-radius: 8px;">
                    <p style="color: #333333; font-size: 36px; font-weight: bold; letter-spacing: 8px; margin: 0; font-family: 'Courier New', Courier, monospace;">${otp}</p>
                  </td>
                </tr>
              </table>
              <p style="color: #555555; line-height: 1.6;">If you did not request this code, you can safely ignore this email.</p>
              <p style="color: #555555; line-height: 1.6;">Thank you,<br>The WME Team</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px 30px; background-color: #f9f9f9; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;">
              <p style="color: #999999; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} WME. All rights reserved.</p>
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
    const fontFamily = "Arial, sans-serif";

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to the WME Client Portal</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
        </style>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Poppins', ${fontFamily}; background-color: #f4f4f4;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 6px 18px rgba(0,0,0,0.06);">
          <tr>
            <td align="center" style="padding: 30px 20px; background-color: #1a1a1a; border-top-left-radius: 12px; border-top-right-radius: 12px;">
              <h1 style="color: ${brandColor}; margin: 0; font-size: 28px; font-weight: 600;">WME Client Portal</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #333333; margin-top: 0; font-weight: 600;">Welcome, ${name}!</h2>
              <p style="color: #555555; line-height: 1.6;">Thank you for choosing WME. Your client portal is now ready. You can access it using your unique Booking ID.</p>
              <p style="color: #555555; line-height: 1.6;">Your Booking ID is:</p>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 30px 0;">
                <tr>
                  <td align="center" style="background-color: #f4f4f4; padding: 20px; border-radius: 8px;">
                    <p style="color: #333333; font-size: 36px; font-weight: bold; letter-spacing: 8px; margin: 0; font-family: 'Courier New', Courier, monospace;">${bookingId}</p>
                  </td>
                </tr>
              </table>
              <p style="text-align: center; margin-top: 30px;">
                <a href="${portalUrl}" style="background-color: ${brandColor}; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">Access Your Portal</a>
              </p>
              <p style="color: #555555; line-height: 1.6; margin-top: 30px;">If you have any questions, please contact your WME coordinator.</p>
              <p style="color: #555555; line-height: 1.6;">Thank you,<br>The WME Team</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px 30px; background-color: #f9f9f9; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;">
              <p style="color: #999999; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} WME. All rights reserved.</p>
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
}

export const emailService = new EmailService();
