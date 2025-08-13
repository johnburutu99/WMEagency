import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Shield, Star, Users, Globe, IdCard, Loader2 } from "lucide-react";
import { apiClient } from "../lib/api";

export default function Index() {
  const [bookingId, setBookingId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validateBookingId = (id: string) => {
    // Check if it's 8 alphanumeric characters
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
      // First try the real API for authentication
      const response = await apiClient.login(bookingId);

      if (response.success && response.data?.client) {
        // Store user data in localStorage for the dashboard
        localStorage.setItem(
          "wme-user-data",
          JSON.stringify(response.data.client),
        );

        // Redirect to dashboard
        window.location.href = "/dashboard";
        return;
      }
    } catch (error) {
      console.error("API login failed, trying fallback:", error);
    }

    // Fallback to local authentication if API fails
    const mockUserData = {
      WME24001: {
        bookingId: "WME24001",
        name: "John Doe",
        email: "john.doe@email.com",
        artist: "Taylor Swift",
        event: "Grammy Awards Performance",
        eventDate: "2024-02-04",
        status: "active",
        contractAmount: 2500000,
        coordinator: {
          name: "Sarah Johnson",
          email: "sarah.johnson@wme.com",
          department: "Music Division",
        },
      },
      WME24002: {
        bookingId: "WME24002",
        name: "Jane Smith",
        email: "jane.smith@email.com",
        artist: "Dwayne Johnson",
        event: "Fast X Premiere",
        eventDate: "2024-01-15",
        status: "pending",
        contractAmount: 750000,
        coordinator: {
          name: "Michael Chen",
          email: "michael.chen@wme.com",
          department: "Film & TV Division",
        },
      },
      WME24003: {
        bookingId: "WME24003",
        name: "Mike Johnson",
        email: "mike.johnson@email.com",
        artist: "Zendaya",
        event: "Vogue Photoshoot",
        eventDate: "2024-01-22",
        status: "completed",
        contractAmount: 150000,
        coordinator: {
          name: "Emma Williams",
          email: "emma.williams@wme.com",
          department: "Digital & Brand Partnerships",
        },
      },
      ABC12345: {
        bookingId: "ABC12345",
        name: "Sarah Wilson",
        email: "sarah.wilson@email.com",
        artist: "Ryan Reynolds",
        event: "Press Tour Services",
        eventDate: "2024-03-15",
        status: "active",
        contractAmount: 1200000,
        coordinator: {
          name: "David Park",
          email: "david.park@wme.com",
          department: "Legal Affairs",
        },
      },
      XYZ98765: {
        bookingId: "XYZ98765",
        name: "David Chen",
        email: "david.chen@email.com",
        artist: "Chris Evans",
        event: "Marvel Contract Signing",
        eventDate: "2024-02-20",
        status: "active",
        contractAmount: 950000,
        coordinator: {
          name: "Jessica Rivera",
          email: "jessica.rivera@wme.com",
          department: "Global Markets",
        },
      },
    };

    const userData =
      mockUserData[bookingId.toUpperCase() as keyof typeof mockUserData];

    if (userData) {
      // Store user data in localStorage for the dashboard
      localStorage.setItem("wme-user-data", JSON.stringify(userData));

      // Redirect to dashboard
      window.location.href = "/dashboard";
    } else {
      setError("Invalid Booking ID. Please check your booking confirmation.");
      setIsLoading(false);
    }
  };

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

      {/* Main Content */}
      <div className="flex min-h-screen">
        {/* Left Side - Hero */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-wme-gold/10 via-transparent to-black/50" />
          <div className="flex flex-col justify-center p-12 relative z-10">
            <h2 className="text-5xl font-bold text-white mb-6">
              Welcome to the
              <span className="block text-wme-gold">
                <strong>WME Client Portal</strong>
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Your secure gateway to world-class talent representation. Access
              your booking information, documents, and communications with your
              unique Booking ID.
            </p>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-3 text-gray-200">
                <Users className="w-5 h-5 text-wme-gold" />
                <span>Direct access to your dedicated coordinator</span>
              </div>
              <div className="flex items-center gap-3 text-gray-200">
                <IdCard className="w-5 h-5 text-wme-gold" />
                <span>Secure access with your unique Booking ID</span>
              </div>
              <div className="flex items-center gap-3 text-gray-200">
                <Shield className="w-5 h-5 text-wme-gold" />
                <span>Bank-level security and data protection</span>
              </div>
            </div>

            {/* Sample Booking IDs for testing */}
            <div className="mt-8 p-4 bg-black/30 rounded-lg border border-wme-gold/20">
              <p className="text-sm text-wme-gold font-semibold mb-2">
                For Demo - Try these Booking IDs:
              </p>
              <div className="text-xs text-gray-300 space-y-1">
                <div>WME24001 - John Doe (Taylor Swift)</div>
                <div>WME24002 - Jane Smith (Dwayne Johnson)</div>
                <div>ABC12345 - Sarah Wilson (Ryan Reynolds)</div>
                <div>XYZ98765 - David Chen (Chris Evans)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-8 lg:hidden">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-wme-gold rounded-lg flex items-center justify-center">
                  <Star className="w-7 h-7 text-black" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">WME</h1>
                  <p className="text-sm text-wme-gold">Client Portal</p>
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                Access Your Booking
              </h2>
              <p className="text-gray-400">Enter your Booking ID to continue</p>
            </div>

            <Card className="bg-white/5 backdrop-blur-sm border-wme-gold/20">
              <CardHeader className="hidden lg:block">
                <CardTitle className="text-2xl text-white">
                  Access Your Booking
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Enter your 8-character Booking ID to access your WME client
                  account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-black/20">
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
                    <TabsTrigger
                      value="help"
                      className="data-[state=active]:bg-wme-gold data-[state=active]:text-black"
                    >
                      Need Help?
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
                        <p className="text-xs text-gray-400">
                          Format: 8 alphanumeric characters (e.g., WME24001)
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

                  <TabsContent value="booking" className="space-y-4">
                    <div className="text-center py-6">
                      <h3 className="text-lg font-semibold text-white mb-3">
                        Ready to Book with WME?
                      </h3>
                      <p className="text-gray-400 mb-6 text-sm">
                        Start your booking request by providing details about your event.
                        We'll guide you through the entire process and connect you with
                        the perfect talent for your needs.
                      </p>
                      <div className="space-y-3">
                        <Link to="/booking">
                          <Button className="w-full bg-wme-gold text-black hover:bg-wme-gold/90 font-semibold">
                            Start New Booking Request
                          </Button>
                        </Link>
                        <p className="text-xs text-gray-400">
                          Already have a booking? Use the "Client Access" tab to log in
                          with your Booking ID.
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="help" className="space-y-4">
                    <div className="text-center py-4">
                      <h3 className="text-lg font-semibold text-white mb-3">
                        Can't Find Your Booking ID?
                      </h3>
                      <p className="text-gray-400 mb-6 text-sm">
                        Your Booking ID can be found in your booking
                        confirmation email or contract documents. It's an
                        8-character code that starts with letters followed by
                        numbers.
                      </p>
                      <div className="space-y-3">
                        <Button
                          variant="outline"
                          className="w-full border-wme-gold text-wme-gold hover:bg-wme-gold hover:text-black"
                        >
                          Contact Your Coordinator
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white"
                        >
                          Request New Booking ID
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="text-center">
                  <p className="text-xs text-gray-400">
                    By accessing your account, you agree to our{" "}
                    <Link to="/terms" className="text-wme-gold hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-wme-gold hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 text-center space-y-2">
              <Link to="/admin">
                <Button
                  variant="link"
                  className="text-xs text-gray-400 hover:text-wme-gold"
                >
                  Admin Access
                </Button>
              </Link>
              <p className="text-xs text-gray-500">
                © 2024 William Morris Endeavor Entertainment. All rights
                reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
