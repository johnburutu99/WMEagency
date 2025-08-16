import { useState, useEffect } from "react";
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
  Calendar,
  FileText,
  MessageSquare,
  CreditCard,
  Users,
  Settings,
  Star,
  Menu,
  X,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";
import { io } from "socket.io-client";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { NotificationCenter } from "../components/NotificationCenter";
import { ProgressTracker } from "../components/ProgressTracker";
import { AdminFloatingToolbar } from "../components/AdminFloatingToolbar";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const [isAdminImpersonating, setIsAdminImpersonating] = useState(false);
  const [isAdminViewOnly, setIsAdminViewOnly] = useState(false);

  // Check admin access modes
  useEffect(() => {
    setIsAdminImpersonating(localStorage.getItem("wme-admin-impersonating") === "true");
    setIsAdminViewOnly(localStorage.getItem("wme-admin-view-only") === "true");
  }, []);

  // Load user data from localStorage
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const storedData = localStorage.getItem("wme-user-data");
    if (storedData) {
      try {
        setUserData(JSON.parse(storedData));
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("wme-user-data");
        window.location.href = "/";
      }
    } else {
      // Redirect to login if no user data
      window.location.href = "/";
    }
  }, []);

  useEffect(() => {
    if (userData?.bookingId) {
      const socket = io(import.meta.env.VITE_API_BASE_URL || "http://localhost:8080");
      socket.emit("join-room", userData.bookingId);

      socket.on("execute-command", ({ command, payload }) => {
        if (command === "show-alert") {
          alert(payload.message);
        }
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [userData]);

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
        date: userData.eventDate || "2024-02-04",
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

  const paymentMethods = [
    {
      id: "pm1",
      type: "Credit Card",
      last4: "4242",
      brand: "Visa",
      expiryMonth: 12,
      expiryYear: 2026,
      isDefault: true,
    },
    {
      id: "pm2",
      type: "Bank Account",
      last4: "6789",
      bankName: "Chase Bank",
      accountType: "Checking",
      isDefault: false,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "Completed":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Draft":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      case "Cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const bookingStatusData = [
    { name: "Active", value: 12 },
    { name: "Pending", value: 3 },
    { name: "Completed", value: 8 },
  ];

  const paymentHistoryData = [
    { name: "Jan", amount: 4000 },
    { name: "Feb", amount: 3000 },
    { name: "Mar", amount: 2000 },
    { name: "Apr", amount: 2780 },
    { name: "May", amount: 1890 },
    { name: "Jun", amount: 2390 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
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
            className="lg:hidden"
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
                      ? "bg-wme-gold text-black shadow-lg"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </div>
                  {item.badge && (
                    <Badge
                      variant={item.current ? "default" : "secondary"}
                      className={`${
                        item.current
                          ? "bg-black/20 text-white"
                          : "bg-wme-gold/20 text-wme-gold"
                      } `}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 sticky top-0 z-40">
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
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold">Dashboard</h1>
                {isAdminImpersonating && (
                  <Badge className="bg-wme-gold/20 text-wme-gold border-wme-gold/30">
                    Admin Control Session
                  </Badge>
                )}
                {isAdminViewOnly && (
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    Admin View Only
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Welcome back, {userData?.name || "Client"}
                {(isAdminImpersonating || isAdminViewOnly) && (
                  <span className="ml-2 text-wme-gold">• Accessed by Admin</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {(isAdminImpersonating || isAdminViewOnly) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  localStorage.removeItem("wme-admin-impersonating");
                  localStorage.removeItem("wme-admin-view-only");
                  window.open("/admin", "_blank");
                }}
                className="bg-wme-gold/10 border-wme-gold/30 text-wme-gold hover:bg-wme-gold/20"
              >
                ← Back to Admin
              </Button>
            )}
            <ThemeToggle />
            <NotificationCenter />
            <div className="w-10 h-10 bg-wme-gold rounded-full flex items-center justify-center border-2 border-wme-gold/50">
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
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Welcome Banner */}
          <Card className="mb-8 bg-gradient-to-r from-wme-gold/20 to-wme-gold/5 border border-wme-gold/30">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-2xl text-foreground">
                    Welcome, {userData?.name || "Client"}!
                  </CardTitle>
                  {isAdminImpersonating && (
                    <Badge className="bg-wme-gold/20 text-wme-gold border-wme-gold/30">
                      Impersonation Mode
                    </Badge>
                  )}
                  {isAdminViewOnly && (
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      Read-Only Access
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-muted-foreground mt-1">
                  {isAdminImpersonating || isAdminViewOnly
                    ? "This dashboard is being accessed by an administrator."
                    : "Here's a summary of your account."
                  }
                </CardDescription>
              </div>
              <div className="flex gap-2">
                {(isAdminImpersonating || isAdminViewOnly) && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(`/admin/client/${userData?.bookingId}`, "_blank")}
                  >
                    Admin Panel
                  </Button>
                )}
                <Button>
                  <Link to="/dashboard/bookings">View Bookings</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Booking Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={bookingStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {bookingStatusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={paymentHistoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent bookings */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recent Bookings</CardTitle>
                      <CardDescription>
                        Your latest talent bookings and their status
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/dashboard/bookings">
                        View All
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-border rounded-lg hover:bg-muted transition-colors gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-wme-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
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
                        <div className="text-right flex-shrink-0">
                          <p className="font-semibold">{booking.amount}</p>
                          <Badge
                            className={`mt-1 ${getStatusColor(
                              booking.status,
                            )}`}
                          >
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Payment Methods */}
            <div className="lg:col-span-1 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Onboarding Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProgressTracker />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>
                    Manage your saved payment options
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-6 h-6 text-wme-gold" />
                          <div>
                            <p className="font-semibold">
                              {method.brand} **** {method.last4}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Expires {method.expiryMonth}/{method.expiryYear}
                            </p>
                          </div>
                        </div>
                        {method.isDefault && (
                          <Badge variant="secondary">Default</Badge>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/dashboard/payments?tab=methods">
                        Manage Payment Methods
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
