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
    const brandColor = "#cdaa7c

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your One-Time Password</title>
        <style>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">

                  </td>
                </tr>
              </table>
              <p style="color: #bbbbbb; line-height: 1.6;">If you did not request this code, you can safely ignore this email.</p>
              <p style="color: #bbbbbb; line-height: 1.6;">Thank you,<br>The WME Team</p>
            </td>
          </tr>
          <tr>

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

    const mailOptions = {
      from: `"WME Client Portal" <${process.env.EMAIL_USER}>`,
      to: email,

      html: htmlBody,
    };

    try {
      await this.transporter.sendMail(mailOptions);

    }
  }
}

export const emailService = new EmailService();
