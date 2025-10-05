import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  ArrowLeft,
  User,
  Star,
  Calendar,
  MapPin,
  DollarSign,
  Mail,
  Phone,
  Building,
  Shield,
  Bell,
  Eye,
  UserCog,
  ExternalLink,
  RefreshCw,
  Settings,
  Activity,
  CreditCard,
  FileText,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Download,
} from "lucide-react";
import { apiClient, type Client } from "@/lib/api";

export default function AdminClientDashboard() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [lastActivity, setLastActivity] = useState<Date | null>(null);

  useEffect(() => {
    if (bookingId) {
      loadClient();
      checkClientStatus();
      // Set up real-time monitoring
      const statusInterval = setInterval(checkClientStatus, 30000);
      return () => clearInterval(statusInterval);
    }
  }, [bookingId]);

  const loadClient = async () => {
    if (!bookingId) return;

    setLoading(true);
    try {
      const response = await apiClient.getClient(bookingId);
      if (response.success && response.data) {
        setClient(response.data.client);
      } else {
        setError("Client not found");
      }
    } catch (err) {
      setError("Failed to load client data");
    } finally {
      setLoading(false);
    }
  };

  const checkClientStatus = async () => {
    // Simulate checking if client is online
    setIsOnline(Math.random() > 0.7);
    setLastActivity(new Date(Date.now() - Math.random() * 3600000)); // Random time within last hour
  };

  const handleImpersonate = async () => {
    if (!client) return;

    try {
      const response = await apiClient.impersonateClient(client.bookingId);
      if (response.success && response.data) {
        sessionStorage.setItem(
          "impersonationToken",
          response.data.impersonationToken,
        );
        window.open(
          `/?impersonate=true&bookingId=${client.bookingId}`,
          "_blank",
        );
        toast.success(`Now impersonating ${client.name}'s session`);
      }
    } catch (error) {
      toast.error("Failed to start impersonation session");
    }
  };

  const handleDirectAccess = () => {
    if (!client) return;
    window.open(`/?bookingId=${client.bookingId}&adminAccess=true`, "_blank");
    toast.success(`Opening ${client.name}'s dashboard`);
  };

  const handleSendMessage = async () => {
    if (!client) return;
    toast.success(`Message sent to ${client.name}`);
  };

  const handleSendCommand = async (command: string) => {
    if (!client) return;

    try {
      await apiClient.sendCommandToClient(client.bookingId, command, {
        timestamp: new Date().toISOString(),
        adminUser: "admin", // Replace with actual admin user
      });
      toast.success(`Command "${command}" sent to client`);
    } catch (error) {
      toast.error("Failed to send command");
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

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/40 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wme-gold"></div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="min-h-screen bg-muted/40 flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {error || "Client not found"}
            </p>
            <Button onClick={() => navigate("/admin")} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" onClick={() => navigate("/admin")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Button>
            <div className="h-6 w-px bg-border" />
            <Link to="/admin/settings">
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Admin Settings
              </Button>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-wme-gold/10 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-wme-gold" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    {client.name}
                  </h1>
                  <p className="text-muted-foreground">
                    {client.artist} • {client.event}
                  </p>
                </div>
                {isOnline && (
                  <div className="relative">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={getStatusColor(client.status)}>
                  {client.status}
                </Badge>
                {client.priority && (
                  <Badge className={getPriorityColor(client.priority)}>
                    {client.priority} priority
                  </Badge>
                )}
                <Badge variant="outline" className="font-mono">
                  {client.bookingId}
                </Badge>
                {isOnline ? (
                  <Badge className="bg-green-500/10 text-green-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    Online
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    <div className="w-2 h-2 bg-gray-500 rounded-full mr-1"></div>
                    Offline
                  </Badge>
                )}
              </div>
              {lastActivity && (
                <p className="text-sm text-muted-foreground">
                  Last activity: {lastActivity.toLocaleString()}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" onClick={handleDirectAccess}>
                <Eye className="w-4 h-4 mr-2" />
                View Dashboard
              </Button>
              <Button
                onClick={handleImpersonate}
                className="bg-wme-gold text-black hover:bg-wme-gold/90"
              >
                <UserCog className="w-4 h-4 mr-2" />
                Control Session
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  window.open(`/?bookingId=${client.bookingId}`, "_blank")
                }
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Portal
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="communications">Messages</TabsTrigger>
            <TabsTrigger value="controls">Controls</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Client Information */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Client Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Personal
                        </label>
                        <div className="mt-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span>{client.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span>{client.email}</span>
                          </div>
                          {client.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-muted-foreground" />
                              <span>{client.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Event Details
                        </label>
                        <div className="mt-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-muted-foreground" />
                            <span>{client.artist}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>{client.event}</span>
                          </div>
                          {client.eventDate && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span>{client.eventDate}</span>
                            </div>
                          )}
                          {client.eventLocation && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span>{client.eventLocation}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Coordinator
                    </label>
                    <div className="mt-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>{client.coordinator.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{client.coordinator.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-muted-foreground" />
                        <span>{client.coordinator.department}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Financial Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Contract Amount
                      </label>
                      <p className="text-2xl font-bold">
                        ${(client.contractAmount || 0).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Current Balance
                      </label>
                      <p className="text-xl font-semibold">
                        ${(client.balance || 0).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Currency
                      </label>
                      <p>{client.currency || "USD"}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Account Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Verification</span>
                      {client.metadata?.isVerified ? (
                        <Badge className="bg-green-500/10 text-green-500">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge className="bg-red-500/10 text-red-500">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Unverified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email Notifications</span>
                      {client.metadata?.notifications?.emailReminders ? (
                        <Badge className="bg-blue-500/10 text-blue-500">
                          <Bell className="w-3 h-3 mr-1" />
                          Enabled
                        </Badge>
                      ) : (
                        <Badge variant="outline">Disabled</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Connection Status</span>
                      {isOnline ? (
                        <Badge className="bg-green-500/10 text-green-500">
                          Online
                        </Badge>
                      ) : (
                        <Badge variant="outline">Offline</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Client Activity Log
                </CardTitle>
                <CardDescription>
                  Recent actions and interactions for this client
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Mock activity data */}
                  <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium">Client logged in</p>
                      <p className="text-sm text-muted-foreground">
                        2 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium">Payment method updated</p>
                      <p className="text-sm text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium">Email notification sent</p>
                      <p className="text-sm text-muted-foreground">
                        2 days ago
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Payment history and management will be displayed here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Documents & Files
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Client documents and files will be displayed here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="communications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Communications
                </CardTitle>
                <CardDescription>
                  Message history and communication tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button onClick={handleSendMessage} className="w-full">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message to Client
                  </Button>
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Communication history will be displayed here
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="controls">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Admin Controls
                </CardTitle>
                <CardDescription>
                  Direct client management and control options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    onClick={() => handleSendCommand("refresh-dashboard")}
                    className="h-auto p-4 flex-col items-start space-y-2"
                  >
                    <RefreshCw className="w-5 h-5" />
                    <div>
                      <div className="font-semibold">Refresh Dashboard</div>
                      <div className="text-xs opacity-70">
                        Force client dashboard reload
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSendCommand("show-notification")}
                    className="h-auto p-4 flex-col items-start space-y-2"
                  >
                    <Bell className="w-5 h-5" />
                    <div>
                      <div className="font-semibold">Send Notification</div>
                      <div className="text-xs opacity-70">
                        Show notification to client
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSendCommand("update-data")}
                    className="h-auto p-4 flex-col items-start space-y-2"
                  >
                    <Download className="w-5 h-5" />
                    <div>
                      <div className="font-semibold">Update Data</div>
                      <div className="text-xs opacity-70">
                        Sync latest client data
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSendCommand("show-maintenance")}
                    className="h-auto p-4 flex-col items-start space-y-2"
                  >
                    <AlertCircle className="w-5 h-5" />
                    <div>
                      <div className="font-semibold">Maintenance Notice</div>
                      <div className="text-xs opacity-70">
                        Display maintenance message
                      </div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
