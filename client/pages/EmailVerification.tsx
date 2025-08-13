import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Star,
  Mail,
  CheckCircle,
  Loader2,
  RefreshCw,
  ArrowLeft,
  Shield,
} from "lucide-react";

export default function EmailVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [otpCode, setOtpCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const email = searchParams.get("email");
  const bookingId = searchParams.get("bookingId");

  useEffect(() => {
    if (!email || !bookingId) {
      navigate("/");
    }
  }, [email, bookingId, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!otpCode || otpCode.length !== 6) {
      setError("Please enter a valid 6-digit verification code");
      return;
    }

    setIsVerifying(true);

    try {
      const response = await fetch("/api/booking/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otpCode,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate(`/?verified=true&bookingId=${bookingId}`);
        }, 2000);
      } else {
        setError(data.error || "Verification failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    setIsResending(true);

    try {
      const response = await fetch("/api/booking/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setCountdown(60); // 60 second cooldown
        // Show success message briefly
        setError(""); // Clear any existing errors
      } else {
        setError(data.error || "Failed to resend verification code");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-6">
        <Card className="w-full max-w-md bg-white/5 backdrop-blur-sm border-wme-gold/20">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Email Verified!
            </h2>
            <p className="text-gray-400 mb-4">
              Your booking request has been submitted successfully.
            </p>
            <p className="text-sm text-gray-400">
              Redirecting you to the login page...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 bg-black/50 backdrop-blur-sm border-b border-wme-gold/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-wme-gold rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">WME</h1>
                <p className="text-xs text-wme-gold">Email Verification</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-300">
                <Shield className="w-4 h-4 text-wme-gold" />
                <span>Secure Verification</span>
              </div>
              <Link to="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-wme-gold text-wme-gold hover:bg-wme-gold hover:text-black"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex min-h-screen items-center justify-center p-6 pt-20">
        <div className="w-full max-w-md">
          <Card className="bg-white/5 backdrop-blur-sm border-wme-gold/20">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-wme-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-wme-gold" />
              </div>
              <CardTitle className="text-2xl text-white">
                Verify Your Email
              </CardTitle>
              <CardDescription className="text-gray-400">
                We've sent a 6-digit verification code to{" "}
                <span className="text-wme-gold font-medium">{email}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleVerification} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otpCode" className="text-gray-200">
                    Verification Code
                  </Label>
                  <Input
                    id="otpCode"
                    type="text"
                    value={otpCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 6) {
                        setOtpCode(value);
                        setError("");
                      }
                    }}
                    className="bg-black/20 border-gray-600 text-white text-center text-lg tracking-widest"
                    placeholder="000000"
                    maxLength={6}
                    required
                  />
                  <p className="text-xs text-gray-400">
                    Enter the 6-digit code sent to your email
                  </p>
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-wme-gold text-black hover:bg-wme-gold/90 font-semibold"
                  size="lg"
                  disabled={isVerifying || otpCode.length !== 6}
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Email"
                  )}
                </Button>
              </form>

              <div className="text-center space-y-3">
                <p className="text-sm text-gray-400">
                  Didn't receive the code?
                </p>
                <Button
                  onClick={handleResendOTP}
                  disabled={isResending || countdown > 0}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white"
                  size="sm"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : countdown > 0 ? (
                    `Resend in ${countdown}s`
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Resend Code
                    </>
                  )}
                </Button>
              </div>

              <div className="bg-black/20 rounded-lg p-4 border border-gray-600">
                <h4 className="text-sm font-semibold text-white mb-2">
                  Your Booking Details:
                </h4>
                <div className="text-xs text-gray-300 space-y-1">
                  <div>
                    <strong>Booking ID:</strong> {bookingId}
                  </div>
                  <div>
                    <strong>Email:</strong> {email}
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  After verification, you can access your booking portal using
                  your Booking ID.
                </p>
              </div>

              <div className="text-center">
                <p className="text-xs text-gray-400">
                  Having trouble? Contact{" "}
                  <a
                    href="mailto:support@wme.com"
                    className="text-wme-gold hover:underline"
                  >
                    support@wme.com
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
