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
} from "../components/ui/dialog";
import {
  Users,
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  Activity,
  TrendingUp,
  DollarSign,
  Calendar,
  Star,
  AlertCircle,
  CheckCircle,
  Loader2,
  LogOut,
} from "lucide-react";
import { apiClient, type Client, type CreateClient } from "../lib/api";

export default function Admin() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [viewingClient, setViewingClient] = useState<Client | null>(null);
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

  const loadClients = async () => {
    setLoading(true);
    try {
      const response = await apiClient.getAllClients({
        status:
          statusFilter && statusFilter !== "all" ? statusFilter : undefined,
        search: searchTerm || undefined,
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

  const handleDeleteClient = async (bookingId: string) => {
    if (!confirm("Are you sure you want to delete this client?")) {
      return;
    }

    try {
      const response = await apiClient.deleteClient(bookingId);
      if (response.success) {
        loadClients();
        loadStats();
      } else {
        setError(response.error || "Failed to delete client");
      }
    } catch (err) {
      setError("Failed to delete client");
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
      // The updateClient method in apiClient might need to be created or adjusted
      const response = await apiClient.updateClient(editingClient.bookingId, editingClient);

      if (response.success) {
        setShowEditDialog(false);
        setEditingClient(null);
        loadClients(); // Refresh the client list
        loadStats(); // Refresh stats
      } else {
        setError(response.error || "Failed to update client");
      }
    } catch (err) {
      setError("Failed to update client");
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">WME Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage client bookings and profile data
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => exportClients("json")}>
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
            <Button variant="outline" onClick={() => exportClients("csv")}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Link to="/">
              <Button variant="outline">Back to Portal</Button>
            </Link>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Clients
                    </p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <Users className="w-8 h-8 text-wme-gold" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Active Bookings
                    </p>
                    <p className="text-2xl font-bold">{stats.active}</p>
                  </div>
                  <Activity className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Revenue
                    </p>
                    <p className="text-2xl font-bold">
                      ${(stats.totalRevenue / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-wme-gold" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Avg Contract
                    </p>
                    <p className="text-2xl font-bold">
                      ${(stats.avgContractValue / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-wme-gold" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Updates and logins from clients.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.bookingId} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">{activity.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.lastLogin ? `Logged in` : `Profile updated`} - {new Date(activity.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline" className="ml-auto">{activity.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search clients by name, artist, event, or booking ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
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

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
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

              <form onSubmit={handleCreateClient} className="space-y-4">
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
                    <Label htmlFor="contractAmount">Contract Amount</Label>
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
                      <Label htmlFor="coordName">Coordinator Name</Label>
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
                      <Label htmlFor="coordEmail">Coordinator Email</Label>
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
                      <Input id="edit-bookingId" value={editingClient.bookingId} disabled />
                    </div>
                    <div>
                      <Label htmlFor="edit-name">Client Name</Label>
                      <Input
                        id="edit-name"
                        value={editingClient.name}
                        onChange={(e) =>
                          setEditingClient({ ...editingClient, name: e.target.value })
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
                        value={editingClient.email || ''}
                        onChange={(e) =>
                          setEditingClient({ ...editingClient, email: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-phone">Phone</Label>
                      <Input
                        id="edit-phone"
                        value={editingClient.phone || ''}
                        onChange={(e) =>
                          setEditingClient({ ...editingClient, phone: e.target.value })
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
                          setEditingClient({ ...editingClient, artist: e.target.value })
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
                          setEditingClient({ ...editingClient, event: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-contractAmount">Contract Amount</Label>
                      <Input
                        id="edit-contractAmount"
                        type="number"
                        value={editingClient.contractAmount || 0}
                        onChange={(e) =>
                          setEditingClient({ ...editingClient, contractAmount: Number(e.target.value) })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-status">Status</Label>
                      <Select
                        value={editingClient.status}
                        onValueChange={(value) =>
                           setEditingClient({ ...editingClient, status: value as any})
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
                            setEditingClient({ ...editingClient, coordinator: { ...editingClient.coordinator, name: e.target.value } })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-coordEmail">Coordinator Email</Label>
                        <Input
                          id="edit-coordEmail"
                          type="email"
                          value={editingClient.coordinator.email}
                          onChange={(e) =>
                            setEditingClient({ ...editingClient, coordinator: { ...editingClient.coordinator, email: e.target.value } })
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
                          setEditingClient({ ...editingClient, coordinator: { ...editingClient.coordinator, department: e.target.value } })
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
                    <Button type="submit" className="bg-wme-gold text-black hover:bg-wme-gold/90">
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
                      <p className="font-mono text-sm">{viewingClient.bookingId}</p>
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
                      <p>{viewingClient.phone || 'N/A'}</p>
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
                      <p>${(viewingClient.contractAmount || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <p><Badge className={getStatusColor(viewingClient.status)}>{viewingClient.status}</Badge></p>
                    </div>
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
        </div>

        {/* Client List */}
        <Card>
          <CardHeader>
            <CardTitle>Client Management</CardTitle>
            <CardDescription>
              {loading ? "Loading..." : `${clients.length} clients found`}
            </CardDescription>
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
                    className="p-4 border border-border rounded-lg"
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
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getStatusColor(client.status)}>
                              {client.status}
                            </Badge>
                            {client.priority && (
                              <Badge
                                className={getPriorityColor(client.priority)}
                              >
                                {client.priority} priority
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              ID: {client.bookingId}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="text-left sm:text-right sm:mr-4">
                          <p className="font-semibold">
                            ${(client.contractAmount || 0).toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {client.coordinator.name}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleViewClick(client)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditClick(client)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClient(client.bookingId)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
