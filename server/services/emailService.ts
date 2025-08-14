class EmailService {
  private generateHtmlTemplate(otp: string): string {
    const brandColor = "#cdaa7c"; // WME Gold color
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your One-Time Password</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <tr>
            <td align="center" style="padding: 40px 20px; background-color: #1a1a1a; border-top-left-radius: 8px; border-top-right-radius: 8px;">
              <h1 style="color: ${brandColor}; margin: 0; font-size: 28px;">WME Client Portal</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #333333; margin-top: 0;">Your Verification Code</h2>
              <p style="color: #555555; line-height: 1.6;">Hello,</p>
              <p style="color: #555555; line-height: 1.6;">Please use the following verification code to complete your action. This code is valid for 10 minutes.</p>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 30px 0;">
                <tr>
                  <td align="center" style="background-color: #f4f4f4; padding: 20px; border-radius: 8px;">
                    <p style="color: #333333; font-size: 36px; font-weight: bold; letter-spacing: 4px; margin: 0;">${otp}</p>
                  </td>
                </tr>
              </table>
              <p style="color: #555555; line-height: 1.6;">If you did not request this code, you can safely ignore this email.</p>
              <p style="color: #555555; line-height: 1.6;">Thank you,<br>The WME Team</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px 30px; background-color: #f9f9f9; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
              <p style="color: #999999; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} WME. All rights reserved.</p>
              <p style="color: #999999; font-size: 12px; margin: 0;">This is an automated message. Please do not reply.</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  }

  public async sendOtpEmail(email: string, otp: string): Promise<{ success: boolean; message: string }> {
    // In a real application, you would integrate with an email provider like SendGrid, Mailgun, or AWS SES.
    // For this project, we will simulate sending the email by logging it to the console.

    const htmlBody = this.generateHtmlTemplate(otp);

    console.log("====================================");
    console.log("      SIMULATING EMAIL SENDING      ");
    console.log("====================================");
    console.log(`To: ${email}`);
    console.log(`Subject: Your One-Time Password (OTP)`);
    console.log(`Body (HTML):`);
    console.log(htmlBody); // Log the HTML content
    console.log("====================================");

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return { success: true, message: "OTP email sent successfully (simulated)." };
  }
}

export const emailService = new EmailService();
