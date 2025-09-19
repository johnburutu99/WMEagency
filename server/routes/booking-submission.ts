import { RequestHandler } from "express";
import { z } from "zod";

// Validation schema for booking form
const BookingFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(1, "Phone number is required"),
  company: z.string().optional(),

  eventType: z.string().min(1, "Event type is required"),
  eventTitle: z.string().min(1, "Event title is required"),
  eventDescription: z.string().optional(),
  eventDate: z.string().min(1, "Event date is required"),
  eventLocation: z.string().min(1, "Event location is required"),
  eventDuration: z.string().min(1, "Event duration is required"),

  artistName: z.string().min(1, "Artist name is required"),
  artistCategory: z.string().min(1, "Artist category is required"),
  specialRequests: z.string().optional(),

  budgetRange: z.string().min(1, "Budget range is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  billingAddress: z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(1, "ZIP code is required"),
    country: z.string().min(1, "Country is required"),
  }),

  hearAboutUs: z.string().optional(),
  additionalNotes: z.string().optional(),
  termsAccepted: z
    .boolean()
    .refine((val) => val === true, "Terms must be accepted"),
  marketingConsent: z.boolean().optional(),
});

// Simple in-memory store for demo purposes
// In production, use a proper database
interface BookingSubmission {
  id: string;
  bookingId: string;
  formData: z.infer<typeof BookingFormSchema>;
  status: "pending" | "verified" | "processed";
  emailVerified: boolean;
  otpCode?: string;
  otpExpiry?: Date;
  submittedAt: Date;
  verifiedAt?: Date;
}

interface OTPSession {
  email: string;
  otpCode: string;
  bookingId: string;
  expiresAt: Date;
}

const bookingSubmissions = new Map<string, BookingSubmission>();
const otpSessions = new Map<string, OTPSession>();

// Generate random booking ID
function generateBookingId(): string {
  const prefix = "WME";
  const year = new Date().getFullYear().toString().slice(-2);
  const randomNum = Math.floor(Math.random() * 99999)
    .toString()
    .padStart(5, "0");
  return `${prefix}${year}${randomNum}`;
}

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Simulate sending email (in production, use actual email service)
function sendEmail(
  to: string,
  subject: string,
  content: string,
): Promise<boolean> {
  return new Promise((resolve) => {
    console.log(`\n📧 Email Simulation:`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content: ${content}`);
    console.log(`─────────────────────────────────────\n`);

    // Simulate async email sending
    setTimeout(() => resolve(true), 100);
  });
}

// Submit booking form
export const handleBookingSubmission: RequestHandler = async (req, res) => {
  try {
    // Validate request body
    const validatedData = BookingFormSchema.parse(req.body);

    // Generate unique booking ID
    const bookingId = generateBookingId();
    const submissionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Generate OTP for email verification
    const otpCode = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store booking submission
    const submission: BookingSubmission = {
      id: submissionId,
      bookingId,
      formData: validatedData,
      status: "pending",
      emailVerified: false,
      otpCode,
      otpExpiry,
      submittedAt: new Date(),
    };

    bookingSubmissions.set(bookingId, submission);

    // Store OTP session
    const otpSession: OTPSession = {
      email: validatedData.email,
      otpCode,
      bookingId,
      expiresAt: otpExpiry,
    };

    otpSessions.set(validatedData.email, otpSession);

    // Send verification email
    const emailContent = `
Hello ${validatedData.firstName},

Thank you for your booking request with WME!

Your booking ID is: ${bookingId}

To complete your booking request, please verify your email address using the following verification code:

Verification Code: ${otpCode}

This code will expire in 10 minutes.

Event Details:
- Event: ${validatedData.eventTitle}
- Artist: ${validatedData.artistName}
- Date: ${validatedData.eventDate}
- Location: ${validatedData.eventLocation}

What happens next:
1. Verify your email with the code above
2. Our team will review your request within 24 hours
3. You'll receive a follow-up email with next steps
4. Access your booking portal at any time with your Booking ID

If you have any questions, feel free to contact us.

Best regards,
WME Booking Team
    `;

    await sendEmail(
      validatedData.email,
      `WME Booking Request - Verification Required (${bookingId})`,
      emailContent,
    );

    res.json({
      success: true,
      data: {
        bookingId,
        submissionId,
        message:
          "Booking request submitted successfully. Please check your email for verification instructions.",
        nextStep: "email_verification",
      },
    });
  } catch (error) {
    console.error("Booking submission error:", error);

    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: "Validation failed",
        details: error.issues,
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Failed to submit booking request",
      });
    }
  }
};

// Verify email OTP
export const handleEmailVerification: RequestHandler = async (req, res) => {
  try {
    const { email, otpCode } = req.body;

    if (!email || !otpCode) {
      return res.status(400).json({
        success: false,
        error: "Email and OTP code are required",
      });
    }

    // Check OTP session
    const otpSession = otpSessions.get(email);
    if (!otpSession) {
      return res.status(400).json({
        success: false,
        error: "Invalid email or OTP session expired",
      });
    }

    // Check if OTP has expired
    if (new Date() > otpSession.expiresAt) {
      otpSessions.delete(email);
      return res.status(400).json({
        success: false,
        error: "OTP code has expired. Please request a new one.",
      });
    }

    // Verify OTP code
    if (otpSession.otpCode !== otpCode) {
      return res.status(400).json({
        success: false,
        error: "Invalid OTP code",
      });
    }

    // Mark submission as verified
    const submission = bookingSubmissions.get(otpSession.bookingId);
    if (submission) {
      submission.emailVerified = true;
      submission.status = "verified";
      submission.verifiedAt = new Date();

      // Process the booking (create client profile)
      await processVerifiedBooking(submission);
    }

    // Clean up OTP session
    otpSessions.delete(email);

    // Send confirmation email
    const confirmationContent = `
Hello ${submission?.formData.firstName},

Your email has been successfully verified!

Your booking request for "${submission?.formData.eventTitle}" has been submitted and is now under review.

Booking ID: ${otpSession.bookingId}

You can now access your client portal using your Booking ID at: ${process.env.FRONTEND_URL || "http://localhost:8080"}

Our team will review your request and contact you within 24 hours with:
- Talent availability confirmation
- Detailed quote and contract terms
- Next steps for your booking

Thank you for choosing WME!

Best regards,
WME Booking Team
    `;

    await sendEmail(
      email,
      `Email Verified - Booking Request Under Review (${otpSession.bookingId})`,
      confirmationContent,
    );

    res.json({
      success: true,
      data: {
        bookingId: otpSession.bookingId,
        message:
          "Email verified successfully. Your booking request is now under review.",
        nextStep: "access_portal",
      },
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to verify email",
    });
  }
};

// Resend OTP
export const handleResendOTP: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required",
      });
    }

    // Check if there's an active OTP session
    const existingSession = otpSessions.get(email);
    if (!existingSession) {
      return res.status(400).json({
        success: false,
        error: "No active OTP session found for this email",
      });
    }

    // Generate new OTP
    const newOtpCode = generateOTP();
    const newExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Update session
    existingSession.otpCode = newOtpCode;
    existingSession.expiresAt = newExpiry;

    // Update submission
    const submission = bookingSubmissions.get(existingSession.bookingId);
    if (submission) {
      submission.otpCode = newOtpCode;
      submission.otpExpiry = newExpiry;
    }

    // Send new OTP email
    const emailContent = `
Hello,

Here is your new verification code for your WME booking request:

Verification Code: ${newOtpCode}
Booking ID: ${existingSession.bookingId}

This code will expire in 10 minutes.

If you did not request this code, please ignore this email.

Best regards,
WME Booking Team
    `;

    await sendEmail(
      email,
      `WME Booking - New Verification Code (${existingSession.bookingId})`,
      emailContent,
    );

    res.json({
      success: true,
      data: {
        message: "New verification code sent to your email",
      },
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to resend verification code",
    });
  }
};

// Process verified booking - create client profile
async function processVerifiedBooking(submission: BookingSubmission) {
  try {
    const { formData, bookingId } = submission;

    // Estimate contract amount based on budget range
    const getEstimatedAmount = (budgetRange: string): number => {
      const ranges: Record<string, number> = {
        "under-10k": 5000,
        "10k-25k": 17500,
        "25k-50k": 37500,
        "50k-100k": 75000,
        "100k-250k": 175000,
        "250k-500k": 375000,
        "500k-1m": 750000,
        "over-1m": 1500000,
      };
      return ranges[budgetRange] || 0;
    };

    // Assign coordinator based on artist category
    const getCoordinator = (category: string) => {
      const coordinators: Record<string, any> = {
        musician: {
          name: "Sarah Johnson",
          email: "sarah.johnson@wme.com",
          phone: "+1 (555) 123-4567",
          department: "Music Division",
        },
        actor: {
          name: "Michael Chen",
          email: "michael.chen@wme.com",
          phone: "+1 (555) 234-5678",
          department: "Film & TV Division",
        },
        comedian: {
          name: "Emma Williams",
          email: "emma.williams@wme.com",
          phone: "+1 (555) 345-6789",
          department: "Comedy Division",
        },
        speaker: {
          name: "David Park",
          email: "david.park@wme.com",
          phone: "+1 (555) 456-7890",
          department: "Speakers Bureau",
        },
        athlete: {
          name: "Jessica Rivera",
          email: "jessica.rivera@wme.com",
          phone: "+1 (555) 567-8901",
          department: "Sports Division",
        },
        default: {
          name: "Booking Team",
          email: "bookings@wme.com",
          phone: "+1 (555) 123-4567",
          department: "New Bookings",
        },
      };
      return coordinators[category] || coordinators.default;
    };

    // Create client profile in the system
    const clientData = {
      bookingId,
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      artist: formData.artistName,
      event: formData.eventTitle,
      eventDate: formData.eventDate,
      eventLocation: formData.eventLocation,
      status: "pending" as const,
      contractAmount: getEstimatedAmount(formData.budgetRange),
      currency: "USD",
      coordinator: getCoordinator(formData.artistCategory),
      lastLogin: new Date().toISOString(),
      priority: "medium" as const,
      // Store additional booking data
      company: formData.company,
      eventDescription: formData.eventDescription,
      eventDuration: formData.eventDuration,
      artistCategory: formData.artistCategory,
      specialRequests: formData.specialRequests,
      budgetRange: formData.budgetRange,
      paymentMethod: formData.paymentMethod,
      billingAddress: formData.billingAddress,
      hearAboutUs: formData.hearAboutUs,
      additionalNotes: formData.additionalNotes,
      marketingConsent: formData.marketingConsent,
      metadata: {
        originalSubmission: formData,
        submissionId: submission.id,
        verifiedAt: submission.verifiedAt,
        paymentStatus: "pending",
        contractStatus: "draft",
      },
    };

    // In a real application, this would save to the same database as the existing clients
    // For now, we'll add it to a global clients store that the API can access
    globalClients.set(bookingId, clientData);

    console.log("✅ Client profile created:", clientData);

    submission.status = "processed";
  } catch (error) {
    console.error("Error processing verified booking:", error);
  }
}

// Global clients store (in production, this would be a database)
export const globalClients = new Map<string, any>();

// Get booking status
export const handleBookingStatus: RequestHandler = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const submission = bookingSubmissions.get(bookingId);
    if (!submission) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    res.json({
      success: true,
      data: {
        bookingId: submission.bookingId,
        status: submission.status,
        emailVerified: submission.emailVerified,
        submittedAt: submission.submittedAt,
        verifiedAt: submission.verifiedAt,
        eventTitle: submission.formData.eventTitle,
        artistName: submission.formData.artistName,
      },
    });
  } catch (error) {
    console.error("Get booking status error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get booking status",
    });
  }
};
