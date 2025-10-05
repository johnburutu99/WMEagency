import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Star, Shield, Globe, IdCard, Loader2 } from "lucide-react";
import { apiClient } from "../lib/api";

export default function Index() {
  const [searchParams] = useSearchParams();
  const [bookingId, setBookingId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const verified = searchParams.get("verified");
    const verifiedBookingId = searchParams.get("bookingId");
    const isImpersonating = searchParams.get("impersonate") === "true";

    if (isImpersonating) {
      const impersonationToken = sessionStorage.getItem("impersonationToken");
      const impersonatedBookingId = searchParams.get("bookingId");
      if (impersonationToken && impersonatedBookingId) {
        handleImpersonatedLogin(impersonatedBookingId, impersonationToken);
      }
    } else if (verified === "true" && verifiedBookingId) {
      setShowSuccess(true);
      setBookingId(verifiedBookingId);
      const timer = setTimeout(() => setShowSuccess(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleImpersonatedLogin = async (
    impersonatedBookingId: string,
    token: string,
  ) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await apiClient.login(impersonatedBookingId, token);
      if (response && response.success) {
        try {
          localStorage.setItem(
            "wme-user-data",
            JSON.stringify((response as any).client),
          );
        } catch (e) {
          /* ignore storage errors */
        }
        window.location.href = "/dashboard";
      } else {
        setError("Impersonation login failed.");
      }
    } catch (err) {
      setError("An error occurred during impersonation login.");
    } finally {
      setIsLoading(false);
    }
  };

  const validateBookingId = (id: string) => {
    const regex = /^[A-Z0-9]{8}$/i;
    return regex.test(id);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!bookingId) {
      setError("Please enter your Booking ID");
      return;
    }

    if (!validateBookingId(bookingId)) {
      setError("Booking ID must be 8 alphanumeric characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.login(bookingId);
      if (response && response.success) {
        try {
          localStorage.setItem(
            "wme-user-data",
            JSON.stringify((response as any).client),
          );
        } catch (e) {
          /* ignore storage errors */
        }
        window.location.href = "/dashboard";
      } else {
        setError(response.error || "Login failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <header className="absolute top-0 left-0 right-0 z-10 bg-black/50 backdrop-blur-sm border-b border-wme-gold/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-wme-gold rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">WME</h1>
                <p className="text-xs text-wme-gold">Client Portal</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-sm text-gray-300">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-wme-gold" />
                Secure Access
              </span>
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-wme-gold" />
                Global Network
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-2xl p-6">
          <Card>
            <CardHeader>
              <CardTitle>Access Your Client Portal</CardTitle>
            </CardHeader>
            <CardContent>
              {showSuccess && (
                <div className="p-4 bg-green-800/30 border border-green-700 rounded mb-4">
                  <p className="text-green-200 text-sm">
                    Your email was verified successfully.
                  </p>
                </div>
              )}

              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-black/20">
                  <TabsTrigger
                    value="login"
                    className="data-[state=active]:bg-wme-gold data-[state=active]:text-black"
                  >
                    Client Access
                  </TabsTrigger>
                  <TabsTrigger
                    value="booking"
                    className="data-[state=active]:bg-wme-gold data-[state=active]:text-black"
                  >
                    New Booking
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bookingId" className="text-gray-200">
                        Booking ID
                      </Label>
                      <div className="relative">
                        <Input
                          id="bookingId"
                          type="text"
                          placeholder="Enter 8-character Booking ID"
                          value={bookingId}
                          onChange={(e) => {
                            const value = e.target.value
                              .toUpperCase()
                              .replace(/[^A-Z0-9]/g, "");
                            if (value.length <= 8) {
                              setBookingId(value);
                              setError("");
                            }
                          }}
                          className="bg-black/20 border-gray-600 text-white placeholder:text-gray-400 focus:border-wme-gold pl-10"
                          maxLength={8}
                          required
                        />
                        <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      </div>
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
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Authenticating...
                        </>
                      ) : (
                        "Access Account"
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="booking">
                  <div className="text-sm text-gray-300">
                    New booking flow coming soon.
                  </div>
                </TabsContent>
              </Tabs>

              <div className="text-center mt-6">
                <p className="text-xs text-gray-400">
                  By accessing your account, you agree to our{" "}
                  <Link to="/terms" className="text-wme-gold hover:underline">
                    Terms of Service
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
