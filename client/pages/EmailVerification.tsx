import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "../components/ui/input-otp";
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
  AlertCircle,
} from "lucide-react";
import { apiClient } from "../lib/api";
import { useToast } from "../hooks/use-toast";

export default function EmailVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [otpCode, setOtpCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const email = searchParams.get("email");
  const bookingId = searchParams.get("bookingId");

  useEffect(() => {
    if (!email || !bookingId) {
      navigate("/");
    }
  }, [email, bookingId, navigate]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!otpCode || otpCode.length !== 6) {
      setError("Please enter a valid 6-digit verification code.");
      return;
    }

    setIsVerifying(true);

    try {
      const response = await apiClient.verifyEmail({ email, otpCode });

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate(`/?verified=true&bookingId=${bookingId}`);
        }, 2000);
      } else {
        setError(response.error || "Verification failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setError("");
    setIsResending(true);

    try {
      const response = await apiClient.resendOtp({ email });

      if (response.success) {
        setCountdown(60);
        toast({
          title: "Code Sent",
          description: "A new verification code has been sent to your email.",
        });
      } else {
        setError(response.error || "Failed to resend code.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-6">
        <Card className="w-full max-w-md bg-white/5 backdrop-blur-sm border-wme-gold/20 text-center">
          <CardContent className="p-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Email Verified!
            </h2>
            <p className="text-gray-400 mb-4">
              Your booking request has been submitted successfully.
            </p>
            <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Redirecting you to the login page...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <header className="absolute top-0 left-0 right-0 z-10 bg-black/50 backdrop-blur-sm border-b border-wme-gold/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-wme-gold rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">WME</h1>
                <p className="text-xs text-wme-gold">Email Verification</p>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-wme-gold text-wme-gold hover:bg-wme-gold hover:text-black"
                >
                  <ArrowLeft className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Back to Home</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex min-h-screen items-center justify-center p-6 pt-24">
        <div className="w-full max-w-md">
          <Card className="bg-white/5 backdrop-blur-sm border-wme-gold/20">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-wme-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-wme-gold/20">
                <Mail className="w-8 h-8 text-wme-gold" />
              </div>
              <CardTitle className="text-2xl text-white">
                Verify Your Email
              </CardTitle>
              <CardDescription className="text-gray-400">
                We've sent a 6-digit verification code to{" "}
                <strong className="text-wme-gold font-medium">{email}</strong>.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleVerification} className="space-y-6">
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otpCode}
                    onChange={setOtpCode}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                {error && (
                  <div className="p-3 bg-red-900/50 border border-red-500/30 rounded-lg text-center">
                    <p className="text-red-400 text-sm flex items-center justify-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </p>
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
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Email"
                  )}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-sm text-gray-400 mb-2">
                  Didn't receive the code?
                </p>
                <Button
                  onClick={handleResendOTP}
                  disabled={isResending || countdown > 0}
                  variant="link"
                  className="text-wme-gold hover:text-wme-gold/80"
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

              <div className="text-center text-xs text-gray-500 pt-4 border-t border-white/10">
                <p>
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
      </main>
    </div>
  );
}
