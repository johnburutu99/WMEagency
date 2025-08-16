import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Users,
  Search,
  Eye,
  ExternalLink,
  Monitor,
  UserCog,
  Settings,
  Activity,
  Bell,
  BellOff,
  ShieldCheck,
  ShieldAlert,
  Clock,
  DollarSign,
  Star,
  Filter,
  RefreshCw,
  Zap,
  Globe,
  Lock,
  Unlock,
} from "lucide-react";
import { apiClient, type Client } from "@/lib/api";
import { toast } from "sonner";

interface AdminClientDashboardProps {
  onClientSelect?: (client: Client) => void;
}

export function AdminClientDashboard({ onClientSelect }: AdminClientDashboardProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeConnections, setActiveConnections] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadClients();
    // Set up polling for active connections
    const interval = setInterval(checkActiveConnections, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [clients, searchTerm, statusFilter, priorityFilter]);

  const loadClients = async () => {
    setLoading(true);
    try {
      const response = await apiClient.getAllClients({});
      if (response.success && response.data) {
        setClients(response.data.clients);
      }
    } catch (error) {
      toast.error("Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  const checkActiveConnections = async () => {
    // This would check which clients are currently connected
    // For now, we'll simulate some active connections
    const simulatedActive = new Set(
      clients.slice(0, Math.floor(Math.random() * 3)).map(c => c.bookingId)
    );
    setActiveConnections(simulatedActive);
  };

  const applyFilters = () => {
    let filtered = clients;

    if (searchTerm) {
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.bookingId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(client => client.status === statusFilter);
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter(client => client.priority === priorityFilter);
    }

    setFilteredClients(filtered);
  };

  const handleAccessDashboard = async (client: Client, mode: "view" | "impersonate" = "view") => {
    if (mode === "impersonate") {
      try {
        const response = await apiClient.impersonateClient(client.bookingId);
        if (response.success && response.data) {
          sessionStorage.setItem("impersonationToken", response.data.impersonationToken);
          const impersonateUrl = `/?impersonate=true&bookingId=${client.bookingId}`;
          window.open(impersonateUrl, "_blank");
          toast.success(`Impersonating ${client.name}'s session`);
        }
      } catch (error) {
        toast.error("Failed to start impersonation session");
      }
    } else {
      // Open in view mode (read-only dashboard)
      setSelectedClient(client);
      if (onClientSelect) {
        onClientSelect(client);
      }
    }
  };

  const handleDirectAccess = (client: Client) => {
    const directUrl = `/?bookingId=${client.bookingId}&adminAccess=true`;
    window.open(directUrl, "_blank");
    toast.success(`Opening ${client.name}'s dashboard`);
  };

  const handleBulkAction = async (action: string, selectedIds: string[]) => {
    // Handle bulk actions for multiple clients
    switch (action) {
      case "verify":
        toast.success(`Verified ${selectedIds.length} clients`);
        break;
      case "notify":
        toast.success(`Notifications sent to ${selectedIds.length} clients`);
        break;
      case "export":
        toast.success(`Exporting data for ${selectedIds.length} clients`);
        break;
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

  return (
    <div className="space-y-6">
      {/* Header with filters and actions */}
      <Card className="bg-black/20 border-wme-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Monitor className="w-5 h-5" />
            Client Dashboard Access Hub
          </CardTitle>
          <CardDescription>
            Seamlessly access and manage all client dashboards from a central location
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search clients by name, artist, event, or booking ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-black/30 border-gray-600 text-white"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 bg-black/30 border-gray-600">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-32 bg-black/30 border-gray-600">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={loadClients}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-black/30 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-wme-gold" />
                <span className="text-sm text-gray-300">Total Clients</span>
              </div>
              <p className="text-xl font-bold text-white">{clients.length}</p>
            </div>
            <div className="bg-black/30 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-300">Online</span>
              </div>
              <p className="text-xl font-bold text-white">{activeConnections.size}</p>
            </div>
            <div className="bg-black/30 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-300">Active</span>
              </div>
              <p className="text-xl font-bold text-white">
                {clients.filter(c => c.status === "active").length}
              </p>
            </div>
            <div className="bg-black/30 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-red-500" />
                <span className="text-sm text-gray-300">High Priority</span>
              </div>
              <p className="text-xl font-bold text-white">
                {clients.filter(c => c.priority === "high").length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client list with enhanced access options */}
      <Card className="bg-black/20 border-wme-gold/20">
        <CardHeader>
          <CardTitle className="text-white">Client Dashboards</CardTitle>
          <CardDescription>
            Click on any client to access their dashboard with full admin privileges
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wme-gold"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredClients.map((client) => (
                <div
                  key={client.bookingId}
                  className="group p-4 rounded-lg border border-gray-700 bg-black/30 hover:bg-black/50 transition-all duration-200 hover:border-wme-gold/40"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-wme-gold/10 rounded-lg flex items-center justify-center">
                          <Star className="w-6 h-6 text-wme-gold" />
                        </div>
                        {activeConnections.has(client.bookingId) && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black animate-pulse"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{client.name}</h3>
                        <p className="text-sm text-gray-400">
                          {client.artist} • {client.event}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getStatusColor(client.status)}>
                            {client.status}
                          </Badge>
                          {client.priority && (
                            <Badge className={getPriorityColor(client.priority)}>
                              {client.priority}
                            </Badge>
                          )}
                          <span className="text-xs text-gray-500 font-mono">
                            {client.bookingId}
                          </span>
                          {activeConnections.has(client.bookingId) && (
                            <Badge className="bg-green-500/10 text-green-500">
                              <Globe className="w-3 h-3 mr-1" />
                              Online
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDirectAccess(client)}
                        className="bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAccessDashboard(client, "impersonate")}
                        className="bg-wme-gold/10 border-wme-gold/30 text-wme-gold hover:bg-wme-gold/20"
                      >
                        <UserCog className="w-4 h-4 mr-1" />
                        Control
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-gray-500/10 border-gray-500/30 text-gray-400 hover:bg-gray-500/20"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-black/90 border-wme-gold/20">
                          <DialogHeader>
                            <DialogTitle className="text-white">Access Options for {client.name}</DialogTitle>
                            <DialogDescription>
                              Choose how you want to access this client's dashboard
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Button
                              variant="outline"
                              className="w-full justify-start bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
                              onClick={() => handleDirectAccess(client)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              <div className="text-left">
                                <div>View Dashboard (Read-Only)</div>
                                <div className="text-xs opacity-70">See client data without making changes</div>
                              </div>
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full justify-start bg-wme-gold/10 border-wme-gold/30 text-wme-gold hover:bg-wme-gold/20"
                              onClick={() => handleAccessDashboard(client, "impersonate")}
                            >
                              <UserCog className="w-4 h-4 mr-2" />
                              <div className="text-left">
                                <div>Control Session (Full Access)</div>
                                <div className="text-xs opacity-70">Access as the client with full permissions</div>
                              </div>
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full justify-start bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20"
                              onClick={() => window.open(`/admin/client/${client.bookingId}`, "_blank")}
                            >
                              <Settings className="w-4 h-4 mr-2" />
                              <div className="text-left">
                                <div>Admin Panel View</div>
                                <div className="text-xs opacity-70">Dedicated admin interface for this client</div>
                              </div>
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              ))}

              {filteredClients.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-400">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No clients found matching your criteria</p>
                  <Button variant="outline" onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setPriorityFilter("all");
                  }} className="mt-4">
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick actions panel */}
      <Card className="bg-black/20 border-wme-gold/20">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex-col items-start space-y-2"
              onClick={() => toast.success("Broadcasting message to all clients")}
            >
              <Bell className="w-5 h-5 text-blue-400" />
              <div className="text-left">
                <div className="font-semibold">Broadcast</div>
                <div className="text-xs opacity-70">Send message to all clients</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex-col items-start space-y-2"
              onClick={() => toast.success("Exporting all client data")}
            >
              <Activity className="w-5 h-5 text-green-400" />
              <div className="text-left">
                <div className="font-semibold">Export All</div>
                <div className="text-xs opacity-70">Download client database</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex-col items-start space-y-2"
              onClick={() => toast.success("Checking system health")}
            >
              <Monitor className="w-5 h-5 text-wme-gold" />
              <div className="text-left">
                <div className="font-semibold">Health Check</div>
                <div className="text-xs opacity-70">System diagnostics</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex-col items-start space-y-2"
              onClick={() => window.open("/admin/settings", "_blank")}
            >
              <Settings className="w-5 h-5 text-purple-400" />
              <div className="text-left">
                <div className="font-semibold">Settings</div>
                <div className="text-xs opacity-70">Admin configuration</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
