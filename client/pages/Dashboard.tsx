import { useState, useEffect } from "react";
import { apiClient } from "../services/apiClient";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { ThemeToggle } from "../components/ThemeToggle";
import {
  Bell,
  Calendar,
  FileText,
  MessageSquare,
  CreditCard,
  Users,
  Settings,
  Star,
  Menu,
  X,
  Sun,
  Moon,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Load user data and verify session
  const [userData, setUserData] = useState<any>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  useEffect(() => {
    const initializeSession = async () => {
      // First check if we have local data
      const storedData = localStorage.getItem("wme-user-data");
      if (storedData) {
        setUserData(JSON.parse(storedData));
      }

      // Then verify with backend
      if (apiClient.isAuthenticated()) {
        try {
          const response = await apiClient.verifySession();
          if (response.success && response.user) {
            setUserData(response.user);
            // Update local storage with fresh data
            localStorage.setItem(
              "wme-user-data",
              JSON.stringify(response.user),
            );
          } else {
            // Session invalid, clear and redirect
            apiClient.clearSession();
            window.location.href = "/";
            return;
          }
        } catch (error) {
          console.error("Session verification failed:", error);
          // On network error, keep local data if available
          if (!storedData) {
            window.location.href = "/";
            return;
          }
        }
      } else {
        // No session, redirect to login
        window.location.href = "/";
        return;
      }

      setIsLoadingSession(false);
    };

    initializeSession();
  }, []);

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: TrendingUp,
      current: location.pathname === "/dashboard",
    },
    {
      name: "Bookings",
      href: "/dashboard/bookings",
      icon: Calendar,
      current: location.pathname === "/dashboard/bookings",
      badge: "3",
    },
    {
      name: "Documents",
      href: "/dashboard/documents",
      icon: FileText,
      current: location.pathname === "/dashboard/documents",
      badge: "2",
    },
    {
      name: "Messages",
      href: "/dashboard/messages",
      icon: MessageSquare,
      current: location.pathname === "/dashboard/messages",
      badge: "5",
    },
    {
      name: "Payments",
      href: "/dashboard/payments",
      icon: CreditCard,
      current: location.pathname === "/dashboard/payments",
    },
    {
      name: "Coordinators",
      href: "/dashboard/coordinators",
      icon: Users,
      current: location.pathname === "/dashboard/coordinators",
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      current: location.pathname === "/dashboard/settings",
    },
  ];

  // Create personalized recent bookings with user's booking first
  const getRecentBookings = () => {
    const baseBookings = [
      {
        id: "BK002",
        artist: "Dwayne Johnson",
        event: "Fast X Premiere",
        date: "2024-01-15",
        status: "Pending",
        amount: "$750,000",
      },
      {
        id: "BK003",
        artist: "Zendaya",
        event: "Vogue Photoshoot",
        date: "2024-01-22",
        status: "Completed",
        amount: "$150,000",
      },
    ];

    if (userData) {
      const userBooking = {
        id: userData.bookingId,
        artist: userData.artist,
        event: userData.event,
        date: "2024-02-04",
        status: "Confirmed",
        amount: getAmountForArtist(userData.artist),
      };
      return [userBooking, ...baseBookings];
    }

    return [
      {
        id: "BK001",
        artist: "Taylor Swift",
        event: "Grammy Awards Performance",
        date: "2024-02-04",
        status: "Confirmed",
        amount: "$2,500,000",
      },
      ...baseBookings,
    ];
  };

  const getAmountForArtist = (artist: string) => {
    const amounts: { [key: string]: string } = {
      "Taylor Swift": "$2,500,000",
      "Dwayne Johnson": "$750,000",
      Zendaya: "$150,000",
      "Ryan Reynolds": "$1,200,000",
      "Chris Evans": "$950,000",
    };
    return amounts[artist] || "$500,000";
  };

  const recentBookings = getRecentBookings();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "Completed":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  // Show loading state while verifying session
  if (isLoadingSession || !userData) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-wme-gold rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-6 h-6 text-black animate-pulse" />
          </div>
          <h2 className="text-xl font-semibold mb-2">WME Client Portal</h2>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border">
            <div className="flex h-16 items-center justify-between px-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-wme-gold rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h1 className="font-bold">WME</h1>
                  <p className="text-xs text-wme-gold">Client Portal</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <nav className="px-4 py-6">
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        item.current
                          ? "bg-wme-gold text-black"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-4 h-4" />
                        {item.name}
                      </div>
                      {item.badge && (
                        <Badge
                          variant="secondary"
                          className="bg-wme-gold text-black"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:bg-card lg:border-r lg:border-border">
        <div className="flex h-16 items-center px-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-wme-gold rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="font-bold">WME</h1>
              <p className="text-xs text-wme-gold">Client Portal</p>
            </div>
          </div>
        </div>
        <nav className="px-4 py-6">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    item.current
                      ? "bg-wme-gold text-black"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </div>
                  {item.badge && (
                    <Badge
                      variant="secondary"
                      className="bg-wme-gold/20 text-wme-gold border-wme-gold/30"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {userData?.name || "Client"}
              </p>
              {userData?.bookingId && (
                <p className="text-xs text-wme-gold">
                  Booking ID: {userData.bookingId}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-wme-gold rounded-full" />
            </Button>
            <div className="w-8 h-8 bg-wme-gold rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-black">
                {userData?.name
                  ? userData.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .slice(0, 2)
                  : "CL"}
              </span>
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="p-6">
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Active Bookings
                    </p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                  <Calendar className="w-8 h-8 text-wme-gold" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  +2 from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Pending Documents
                    </p>
                    <p className="text-2xl font-bold">3</p>
                  </div>
                  <FileText className="w-8 h-8 text-wme-gold" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  2 NDAs, 1 Contract
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Unread Messages
                    </p>
                    <p className="text-2xl font-bold">8</p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-wme-gold" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  From coordinators
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Revenue
                    </p>
                    <p className="text-2xl font-bold">$4.2M</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-wme-gold" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">This year</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent bookings */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Bookings</CardTitle>
                  <CardDescription>
                    Your latest talent bookings and their status
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  View All
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-wme-gold/10 rounded-lg flex items-center justify-center">
                        <Star className="w-6 h-6 text-wme-gold" />
                      </div>
                      <div>
                        <p className="font-semibold">{booking.artist}</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.event}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {booking.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{booking.amount}</p>
                      <Badge
                        className={`mt-1 ${getStatusColor(booking.status)}`}
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
