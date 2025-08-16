import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
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
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "../components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { Calendar } from "../components/ui/calendar";
import { format } from "date-fns";
import {
  Users,
  Plus,
  Search,
  Download,
  Edit,
  Trash2,
  Eye,
  Activity,
  TrendingUp,
  DollarSign,
  Star,
  AlertCircle,
  Loader2,
  LogOut,
  ShieldCheck,
  ShieldAlert,
  UserCog,
  Settings,
  Home,
  Bell,
  BellOff,
  CheckCircle2,
  Calendar as CalendarIcon,
} from "lucide-react";
import { apiClient, type Client, type CreateClient } from "../lib/api";
import { io } from "socket.io-client";
import { ActivityFeed } from "../components/ActivityFeed";
import { AdminClientDashboard } from "../components/AdminClientDashboard";

export default function Admin() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [coordinatorFilter, setCoordinatorFilter] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [viewingClient, setViewingClient] = useState<Client | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingClientId, setDeletingClientId] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // Form state for creating new client
  const [newClient, setNewClient] = useState<CreateClient>({
    bookingId: "",
    name: "",
    email: "",
    phone: "",
    artist: "",
    event: "",
    eventDate: "",
    eventLocation: "",
    status: "active",
    contractAmount: 0,
    currency: "USD",
    balance: 0,
    coordinator: {
      name: "",
      email: "",
      phone: "",
      department: "",
    },
    metadata: {
      priority: "medium",
    },
  });

  useEffect(() => {
    loadClients();
    loadStats();
  }, [statusFilter, searchTerm]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_BASE_URL || "http://localhost:8080");

    socket.on("new-client", (newClient: Client) => {
      setClients((prevClients) => [newClient, ...prevClients]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const loadClients = async () => {
    setLoading(true);
    try {
      const response = await apiClient.getAllClients({
        status:
          statusFilter && statusFilter !== "all" ? statusFilter : undefined,
        search: searchTerm || undefined,
        date: dateFilter ? dateFilter.toISOString().split("T")[0] : undefined,
        coordinator:
          coordinatorFilter && coordinatorFilter !== "all"
            ? coordinatorFilter
            : undefined,
      });

      if (response.success && response.data) {
        setClients(response.data.clients);
      } else {
        setError(response.error || "Failed to load clients");
      }
    } catch (err) {
      setError("Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await apiClient.getDashboardStats();
      if (response.success && response.data) {
        setStats(response.data.stats);
        setRecentActivity(response.data.recentActivity);
      }
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  };

  const generateBookingId = async () => {
    try {
      const response = await apiClient.generateBookingId();
      if (response.success && response.data) {
        setNewClient((prev) => ({
          ...prev,
          bookingId: response.data!.bookingId,
        }));
      }
    } catch (err) {
      console.error("Failed to generate booking ID:", err);
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await apiClient.createClient(newClient);

      if (response.success) {
        setShowCreateDialog(false);
        setNewClient({
          bookingId: "",
          name: "",
          email: "",
          phone: "",
          artist: "",
          event: "",
          eventDate: "",
          eventLocation: "",
          status: "active",
          contractAmount: 0,
          currency: "USD",
          balance: 0,
          coordinator: {
            name: "",
            email: "",
            phone: "",
            department: "",
          },
          metadata: {
            priority: "medium",
          },
        });
        loadClients();
        loadStats();
      } else {
        setError(response.error || "Failed to create client");
      }
    } catch (err) {
      setError("Failed to create client");
    }
  };

  const confirmDeleteClient = (bookingId: string) => {
    setDeletingClientId(bookingId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteClient = async () => {
    if (!deletingClientId) return;

    try {
      const response = await apiClient.deleteClient(deletingClientId);
      if (response.success) {
        loadClients();
        loadStats();
      } else {
        setError(response.error || "Failed to delete client");
      }
    } catch (err) {
      setError("Failed to delete client");
    } finally {
      setShowDeleteConfirm(false);
      setDeletingClientId(null);
    }
  };

  const handleEditClick = (client: Client) => {
    setEditingClient(client);
    setShowEditDialog(true);
  };

  const handleViewClick = (client: Client) => {
    setViewingClient(client);
    setShowViewDialog(true);
  };

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;

    try {
      const response = await apiClient.updateClient(
        editingClient.bookingId,
        editingClient,
      );

      if (response.success) {
        setShowEditDialog(false);
        setEditingClient(null);
        loadClients();
        loadStats();
      } else {
        setError(response.error || "Failed to update client");
      }
    } catch (err) {
      setError("Failed to update client");
    }
  };

  const handleToggleVerify = async (client: Client) => {
    try {
      const response = await apiClient.updateClient(client.bookingId, {
        metadata: {
          isVerified: !client.metadata?.isVerified,
        },
      });

      if (response.success) {
        loadClients();
      } else {
        setError(response.error || "Failed to update verification status");
      }
    } catch (err) {
      setError("Failed to update verification status");
    }
  };

  const handleImpersonate = async (bookingId: string) => {
    try {
      const response = await apiClient.impersonateClient(bookingId);
      if (response.success && response.data) {
        sessionStorage.setItem(
          "impersonationToken",
          response.data.impersonationToken,
        );
        window.open(`/?impersonate=true&bookingId=${bookingId}`, "_blank");
      } else {
        setError(response.error || "Failed to start impersonation session");
      }
    } catch (err) {
      setError("Failed to start impersonation session");
    }
  };

  const handleToggleEmailReminders = async (client: Client) => {
    try {
      const response = await apiClient.updateClient(client.bookingId, {
        metadata: {
          notifications: {
            emailReminders: !client.metadata?.notifications?.emailReminders,
          },
        },
      });

      if (response.success) {
        loadClients();
      } else {
        setError(response.error || "Failed to update email reminder status");
      }
    } catch (err) {
      setError("Failed to update email reminder status");
    }
  };

  const handleSendCommand = async (bookingId: string, command: string) => {
    try {
      const response = await apiClient.sendCommandToClient(bookingId, command, {
        message: `Hello from the admin dashboard!`,
      });
      if (!response.success) {
        setError(response.error || "Failed to send command");
      }
    } catch (err) {
      setError("Failed to send command");
    }
  };

  const handleApprovePayment = async (bookingId: string) => {
    try {
      const response = await apiClient.approvePayment(bookingId);
      if (response.success) {
        loadClients();
      } else {
        setError(response.error || "Failed to approve payment");
      }
    } catch (err) {
      setError("Failed to approve payment");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "completed":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "low":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const exportClients = async (format: "json" | "csv") => {
    try {
      const response = await apiClient.exportClients({
        format,
        status:
          statusFilter && statusFilter !== "all" ? statusFilter : undefined,
      });

      if (response.success && response.data) {
        if (format === "json") {
          const blob = new Blob([JSON.stringify(response.data, null, 2)], {
            type: "application/json",
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `wme-clients-${new Date().toISOString().split("T")[0]}.json`;
          a.click();
        }
        // CSV download is handled by the server
      }
    } catch (err) {
      setError("Failed to export clients");
    }
  };

  const handleLogout = async () => {
    try {
      await apiClient.adminLogout();
      navigate("/admin/login");
    } catch (err) {
      setError("Logout failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="bg-background rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                WME Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage client bookings and profile data
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Link to="/">
                <Button variant="outline">
                  <Home className="w-4 h-4 mr-2" />
                  Portal Home
                </Button>
              </Link>
              <Link to="/admin/settings">
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </Link>
              <Link to="/admin/analytics">
                <Button variant="outline">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
              </Link>
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-500 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </p>
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Clients
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Bookings
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.active}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${(stats.totalRevenue / 1000000).toFixed(1)}M
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg. Contract
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${(stats.avgContractValue / 1000).toFixed(0)}K
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <ActivityFeed />
          </div>
        </div>

        {/* Client Dashboard Access Hub */}
        <div className="mb-8">
          <AdminClientDashboard onClientSelect={(client) => {
            // Handle client selection for quick access
            console.log('Selected client:', client);
          }} />
        </div>

        {/* Client Lists */}
        <Tabs defaultValue="live">
          <TabsList className="mb-4">
            <TabsTrigger value="live">Live Clients</TabsTrigger>
          </TabsList>
          <TabsContent value="live">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Live Client Management</CardTitle>
                    <CardDescription>
                      {loading
                        ? "Loading..."
                        : `${clients.length} live clients found`}
                    </CardDescription>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search clients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={coordinatorFilter}
                      onValueChange={setCoordinatorFilter}
                    >
                      <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="All Coordinators" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Coordinators</SelectItem>
                        <SelectItem value="Sarah Johnson">
                          Sarah Johnson
                        </SelectItem>
                        <SelectItem value="Michael Chen">
                          Michael Chen
                        </SelectItem>
                        <SelectItem value="Emma Williams">
                          Emma Williams
                        </SelectItem>
                        <SelectItem value="David Park">David Park</SelectItem>
                        <SelectItem value="Jessica Rivera">
                          Jessica Rivera
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="w-full sm:w-auto"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateFilter ? (
                            format(dateFilter, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateFilter}
                          onSelect={setDateFilter}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <Button
                      variant="outline"
                      onClick={() => exportClients("json")}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      JSON
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => exportClients("csv")}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      CSV
                    </Button>
                    <Dialog
                      open={showCreateDialog}
                      onOpenChange={setShowCreateDialog}
                    >
                      <DialogTrigger asChild>
                        <Button className="bg-wme-gold text-black hover:bg-wme-gold/90">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Client
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Create New Client</DialogTitle>
                          <DialogDescription>
                            Add a new client with their booking information
                          </DialogDescription>
                        </DialogHeader>

                        <form
                          onSubmit={handleCreateClient}
                          className="space-y-4"
                        >
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="bookingId">Booking ID</Label>
                              <div className="flex gap-2">
                                <Input
                                  id="bookingId"
                                  value={newClient.bookingId}
                                  onChange={(e) =>
                                    setNewClient((prev) => ({
                                      ...prev,
                                      bookingId: e.target.value.toUpperCase(),
                                    }))
                                  }
                                  placeholder="8-character ID"
                                  maxLength={8}
                                  required
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={generateBookingId}
                                >
                                  Generate
                                </Button>
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="name">Client Name</Label>
                              <Input
                                id="name"
                                value={newClient.name}
                                onChange={(e) =>
                                  setNewClient((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                  }))
                                }
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                type="email"
                                value={newClient.email}
                                onChange={(e) =>
                                  setNewClient((prev) => ({
                                    ...prev,
                                    email: e.target.value,
                                  }))
                                }
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="phone">Phone</Label>
                              <Input
                                id="phone"
                                value={newClient.phone}
                                onChange={(e) =>
                                  setNewClient((prev) => ({
                                    ...prev,
                                    phone: e.target.value,
                                  }))
                                }
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="artist">Artist/Talent</Label>
                              <Input
                                id="artist"
                                value={newClient.artist}
                                onChange={(e) =>
                                  setNewClient((prev) => ({
                                    ...prev,
                                    artist: e.target.value,
                                  }))
                                }
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="event">Event</Label>
                              <Input
                                id="event"
                                value={newClient.event}
                                onChange={(e) =>
                                  setNewClient((prev) => ({
                                    ...prev,
                                    event: e.target.value,
                                  }))
                                }
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="contractAmount">
                                Contract Amount
                              </Label>
                              <Input
                                id="contractAmount"
                                type="number"
                                value={newClient.contractAmount}
                                onChange={(e) =>
                                  setNewClient((prev) => ({
                                    ...prev,
                                    contractAmount: Number(e.target.value),
                                  }))
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="balance">Balance</Label>
                              <Input
                                id="balance"
                                type="number"
                                value={newClient.balance}
                                onChange={(e) =>
                                  setNewClient((prev) => ({
                                    ...prev,
                                    balance: Number(e.target.value),
                                  }))
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="status">Status</Label>
                              <Select
                                value={newClient.status}
                                onValueChange={(value) =>
                                  setNewClient((prev) => ({
                                    ...prev,
                                    status: value as any,
                                  }))
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="pending">
                                    Pending
                                  </SelectItem>
                                  <SelectItem value="completed">
                                    Completed
                                  </SelectItem>
                                  <SelectItem value="cancelled">
                                    Cancelled
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h4 className="font-semibold">
                              Coordinator Information
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="coordName">
                                  Coordinator Name
                                </Label>
                                <Input
                                  id="coordName"
                                  value={newClient.coordinator.name}
                                  onChange={(e) =>
                                    setNewClient((prev) => ({
                                      ...prev,
                                      coordinator: {
                                        ...prev.coordinator,
                                        name: e.target.value,
                                      },
                                    }))
                                  }
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="coordEmail">
                                  Coordinator Email
                                </Label>
                                <Input
                                  id="coordEmail"
                                  type="email"
                                  value={newClient.coordinator.email}
                                  onChange={(e) =>
                                    setNewClient((prev) => ({
                                      ...prev,
                                      coordinator: {
                                        ...prev.coordinator,
                                        email: e.target.value,
                                      },
                                    }))
                                  }
                                  required
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="department">Department</Label>
                              <Input
                                id="department"
                                value={newClient.coordinator.department}
                                onChange={(e) =>
                                  setNewClient((prev) => ({
                                    ...prev,
                                    coordinator: {
                                      ...prev.coordinator,
                                      department: e.target.value,
                                    },
                                  }))
                                }
                                required
                              />
                            </div>
                          </div>

                          <div className="flex justify-end gap-3">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setShowCreateDialog(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              className="bg-wme-gold text-black hover:bg-wme-gold/90"
                            >
                              Create Client
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {clients.map((client) => (
                      <div
                        key={client.bookingId}
                        className="p-4 border bg-background hover:bg-muted/50 rounded-lg transition-colors"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-wme-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Star className="w-6 h-6 text-wme-gold" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{client.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {client.artist} - {client.event}
                              </p>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <Badge
                                  className={getStatusColor(client.status)}
                                >
                                  {client.status}
                                </Badge>
                                {client.priority && (
                                  <Badge
                                    className={getPriorityColor(
                                      client.priority,
                                    )}
                                  >
                                    {client.priority} priority
                                  </Badge>
                                )}
                                <span className="text-xs text-muted-foreground font-mono">
                                  {client.bookingId}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <div className="text-left sm:text-right sm:mr-4">
                              <p className="font-semibold">
                                $
                                {(
                                  client.contractAmount || 0
                                ).toLocaleString()}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {client.coordinator.name}
                              </p>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewClick(client)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditClick(client)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                outline
                                size="sm"
                                onClick={() =>
                                  confirmDeleteClient(client.bookingId)
                                }
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant={
                                  client.metadata?.isVerified
                                    ? "secondary"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => handleToggleVerify(client)}
                              >
                                {client.metadata?.isVerified ? (
                                  <ShieldCheck className="w-4 h-4 text-green-500" />
                                ) : (
                                  <ShieldAlert className="w-4 h-4 text-red-500" />
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleImpersonate(client.bookingId)
                                }
                              >
                                <UserCog className="w-4 h-4" />
                              </Button>
                              <Button
                                variant={
                                  client.metadata?.notifications?.emailReminders
                                    ? "secondary"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => handleToggleEmailReminders(client)}
                              >
                                {client.metadata?.notifications?.emailReminders ? (
                                  <Bell className="w-4 h-4 text-green-500" />
                                ) : (
                                  <BellOff className="w-4 h-4 text-red-500" />
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleSendCommand(client.bookingId, "show-alert")
                                }
                              >
                                <AlertCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleApprovePayment(client.bookingId)
                                }
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Client Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Client</DialogTitle>
              <DialogDescription>
                Update the client's booking information.
              </DialogDescription>
            </DialogHeader>
            {editingClient && (
              <form onSubmit={handleUpdateClient} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-bookingId">Booking ID</Label>
                    <Input
                      id="edit-bookingId"
                      value={editingClient.bookingId}
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-name">Client Name</Label>
                    <Input
                      id="edit-name"
                      value={editingClient.name}
                      onChange={(e) =>
                        setEditingClient({
                          ...editingClient,
                          name: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editingClient.email || ""}
                      onChange={(e) =>
                        setEditingClient({
                          ...editingClient,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-phone">Phone</Label>
                    <Input
                      id="edit-phone"
                      value={editingClient.phone || ""}
                      onChange={(e) =>
                        setEditingClient({
                          ...editingClient,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-artist">Artist/Talent</Label>
                    <Input
                      id="edit-artist"
                      value={editingClient.artist}
                      onChange={(e) =>
                        setEditingClient({
                          ...editingClient,
                          artist: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-event">Event</Label>
                    <Input
                      id="edit-event"
                      value={editingClient.event}
                      onChange={(e) =>
                        setEditingClient({
                          ...editingClient,
                          event: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-contractAmount">
                      Contract Amount
                    </Label>
                    <Input
                      id="edit-contractAmount"
                      type="number"
                      value={editingClient.contractAmount || 0}
                      onChange={(e) =>
                        setEditingClient({
                          ...editingClient,
                          contractAmount: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-balance">Balance</Label>
                    <Input
                      id="edit-balance"
                      type="number"
                      value={editingClient.balance || 0}
                      onChange={(e) =>
                        setEditingClient({
                          ...editingClient,
                          balance: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-status">Status</Label>
                    <Select
                      value={editingClient.status}
                      onValueChange={(value) =>
                        setEditingClient({
                          ...editingClient,
                          status: value as any,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Coordinator Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-coordName">Coordinator Name</Label>
                      <Input
                        id="edit-coordName"
                        value={editingClient.coordinator.name}
                        onChange={(e) =>
                          setEditingClient({
                            ...editingClient,
                            coordinator: {
                              ...editingClient.coordinator,
                              name: e.target.value,
                            },
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-coordEmail">
                        Coordinator Email
                      </Label>
                      <Input
                        id="edit-coordEmail"
                        type="email"
                        value={editingClient.coordinator.email}
                        onChange={(e) =>
                          setEditingClient({
                            ...editingClient,
                            coordinator: {
                              ...editingClient.coordinator,
                              email: e.target.value,
                            },
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="edit-department">Department</Label>
                    <Input
                      id="edit-department"
                      value={editingClient.coordinator.department}
                      onChange={(e) =>
                        setEditingClient({
                          ...editingClient,
                          coordinator: {
                            ...editingClient.coordinator,
                            department: e.target.value,
                          },
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEditDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-wme-gold text-black hover:bg-wme-gold/90"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* View Client Dialog */}
        <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>View Client Details</DialogTitle>
              <DialogDescription>
                Read-only view of client information.
              </DialogDescription>
            </DialogHeader>
            {viewingClient && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Booking ID</Label>
                    <p className="font-mono text-sm">
                      {viewingClient.bookingId}
                    </p>
                  </div>
                  <div>
                    <Label>Client Name</Label>
                    <p>{viewingClient.name}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Email</Label>
                    <p>{viewingClient.email}</p>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <p>{viewingClient.phone || "N/A"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Artist/Talent</Label>
                    <p>{viewingClient.artist}</p>
                  </div>
                  <div>
                    <Label>Event</Label>
                    <p>{viewingClient.event}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Contract Amount</Label>
                    <p>
                      ${(viewingClient.contractAmount || 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <Label>Balance</Label>
                    <p>${(viewingClient.balance || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <p>
                      <Badge className={getStatusColor(viewingClient.status)}>
                        {viewingClient.status}
                      </Badge>
                    </p>
                  </div>
                </div>
                <div>
                  <Label>Verification Status</Label>
                  <p>
                    {viewingClient.metadata?.isVerified ? (
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                        Verified
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
                        Not Verified
                      </Badge>
                    )}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Coordinator Information</h4>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <Label>Name</Label>
                      <p>{viewingClient.coordinator.name}</p>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <p>{viewingClient.coordinator.email}</p>
                    </div>
                    <div>
                      <Label>Department</Label>
                      <p>{viewingClient.coordinator.department}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete the
                client and their associated data.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button variant="destructive" onClick={handleDeleteClient}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
