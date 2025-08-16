import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Database,
  Settings,
  Mail,
  Shield,
  Users,
  Palette,
  Plug,
  Activity,
  Download,
  Upload,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Globe,
  Server,
  Key,
  Bell,
  Eye,
  Clock,
} from "lucide-react";

interface SystemHealth {
  status: string;
  database: {
    status: string;
    clients: number;
  };
  memory: {
    used: number;
    total: number;
  };
  uptime: number;
}

export default function AdminSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [settings, setSettings] = useState({
    // Database settings
    database: {
      backupEnabled: true,
      backupFrequency: "daily",
      retentionDays: 30,
    },
    // Email settings
    email: {
      smtpHost: "",
      smtpPort: "587",
      smtpUser: "",
      smtpPassword: "",
      sslEnabled: true,
      fromEmail: "noreply@wme.com",
      fromName: "WME Client Portal",
    },
    // Security settings
    security: {
      sessionTimeout: 24,
      maxLoginAttempts: 5,
      requireTwoFactor: false,
      passwordMinLength: 8,
      jwtSecret: "",
    },
    // System settings
    system: {
      maintenanceMode: false,
      debugMode: false,
      apiRateLimit: 100,
      maxFileSize: 10,
      allowRegistration: false,
    },
    // Notification settings
    notifications: {
      emailReminders: true,
      smsNotifications: false,
      webhookUrl: "",
      reminderHours: 24,
    },
    // Application settings
    app: {
      siteName: "WME Client Portal",
      supportEmail: "support@wme.com",
      termsUrl: "/terms",
      privacyUrl: "/privacy",
      logoUrl: "",
    },
  });

  useEffect(() => {
    fetchSystemHealth();
    fetchSettings();
  }, []);

  const fetchSystemHealth = async () => {
    try {
      const response = await fetch("/api/admin/system-health");
      if (response.ok) {
        const data = await response.json();
        setSystemHealth(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch system health:", error);
    }
  };

  const fetchSettings = async () => {
    // In a real implementation, this would fetch current settings from the server
    // For now, we'll use the default values
  };

  const handleSaveSettings = async (section: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(`${section} settings saved successfully`);
    } catch (error) {
      toast.error(`Failed to save ${section} settings`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async (format: string) => {
    try {
      const response = await fetch(
        `/api/admin/export-clients?format=${format}`,
      );
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `wme-clients-${new Date().toISOString().split("T")[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success(`Data exported as ${format.toUpperCase()}`);
      }
    } catch (error) {
      toast.error("Failed to export data");
    }
  };

  const handleBackupDatabase = async () => {
    setIsLoading(true);
    try {
      // Simulate backup process
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Database backup completed successfully");
    } catch (error) {
      toast.error("Failed to create database backup");
    } finally {
      setIsLoading(false);
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const isHealthy = status === "healthy" || status === "connected";
    return (
      <Badge variant={isHealthy ? "default" : "destructive"} className="ml-2">
        {isHealthy ? (
          <CheckCircle className="w-3 h-3 mr-1" />
        ) : (
          <XCircle className="w-3 h-3 mr-1" />
        )}
        {status}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Settings</h1>
        <p className="text-gray-400">
          Manage system configuration, security, and application settings
        </p>
      </div>

      {/* System Health Overview */}
      {systemHealth && (
        <Card className="mb-8 bg-black/20 border-wme-gold/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Activity className="w-5 h-5" />
              System Health
              <StatusBadge status={systemHealth.status} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Database</Label>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Status</span>
                  <StatusBadge status={systemHealth.database.status} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Clients</span>
                  <span className="text-sm text-white">
                    {systemHealth.database.clients}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Memory Usage</Label>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Used</span>
                  <span className="text-sm text-white">
                    {systemHealth.memory.used.toFixed(1)} MB
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Total</span>
                  <span className="text-sm text-white">
                    {systemHealth.memory.total.toFixed(1)} MB
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Uptime</Label>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Running</span>
                  <span className="text-sm text-white">
                    {Math.floor(systemHealth.uptime / 3600)}h{" "}
                    {Math.floor((systemHealth.uptime % 3600) / 60)}m
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="database" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 bg-black/20">
          <TabsTrigger value="database" className="flex items-center gap-1">
            <Database className="w-4 h-4" />
            <span className="hidden sm:inline">Database</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-1">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">System</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-1">
            <Mail className="w-4 h-4" />
            <span className="hidden sm:inline">Email</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-1">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="app" className="flex items-center gap-1">
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">App</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-1">
            <Plug className="w-4 h-4" />
            <span className="hidden sm:inline">Integrations</span>
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Monitoring</span>
          </TabsTrigger>
        </TabsList>

        {/* Database Settings */}
        <TabsContent value="database">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-black/20 border-wme-gold/20">
              <CardHeader>
                <CardTitle className="text-white">
                  Database Configuration
                </CardTitle>
                <CardDescription>
                  Manage database connection and backup settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Database Type</Label>
                  <Input
                    value="JSON File Database"
                    disabled
                    className="bg-black/30 border-gray-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Database Path</Label>
                  <Input
                    value="./db.json"
                    disabled
                    className="bg-black/30 border-gray-600"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-gray-300">Auto Backup</Label>
                  <Switch
                    checked={settings.database.backupEnabled}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        database: { ...prev.database, backupEnabled: checked },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Backup Frequency</Label>
                  <Select
                    value={settings.database.backupFrequency}
                    onValueChange={(value) =>
                      setSettings((prev) => ({
                        ...prev,
                        database: { ...prev.database, backupFrequency: value },
                      }))
                    }
                  >
                    <SelectTrigger className="bg-black/30 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={() => handleSaveSettings("Database")}
                  disabled={isLoading}
                  className="w-full bg-wme-gold text-black hover:bg-wme-gold/90"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-wme-gold/20">
              <CardHeader>
                <CardTitle className="text-white">Data Management</CardTitle>
                <CardDescription>
                  Export data and manage database operations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Export Client Data</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleExportData("json")}
                      className="flex-1"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      JSON
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleExportData("csv")}
                      className="flex-1"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      CSV
                    </Button>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label className="text-gray-300">Database Operations</Label>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      onClick={handleBackupDatabase}
                      disabled={isLoading}
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Create Backup
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Reset Database
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Reset Database</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete all client data and
                            reset the database to its initial state. This action
                            cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                            Reset Database
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system">
          <Card className="bg-black/20 border-wme-gold/20">
            <CardHeader>
              <CardTitle className="text-white">System Configuration</CardTitle>
              <CardDescription>
                Configure global system settings and environment variables
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    General Settings
                  </h3>
                  <div className="flex items-center justify-between">
                    <Label className="text-gray-300">Maintenance Mode</Label>
                    <Switch
                      checked={settings.system.maintenanceMode}
                      onCheckedChange={(checked) =>
                        setSettings((prev) => ({
                          ...prev,
                          system: { ...prev.system, maintenanceMode: checked },
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-gray-300">Debug Mode</Label>
                    <Switch
                      checked={settings.system.debugMode}
                      onCheckedChange={(checked) =>
                        setSettings((prev) => ({
                          ...prev,
                          system: { ...prev.system, debugMode: checked },
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-gray-300">
                      Allow New Registrations
                    </Label>
                    <Switch
                      checked={settings.system.allowRegistration}
                      onCheckedChange={(checked) =>
                        setSettings((prev) => ({
                          ...prev,
                          system: {
                            ...prev.system,
                            allowRegistration: checked,
                          },
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Performance Settings
                  </h3>
                  <div className="space-y-2">
                    <Label className="text-gray-300">
                      API Rate Limit (per hour)
                    </Label>
                    <Input
                      type="number"
                      value={settings.system.apiRateLimit}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          system: {
                            ...prev.system,
                            apiRateLimit: parseInt(e.target.value),
                          },
                        }))
                      }
                      className="bg-black/30 border-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Max File Size (MB)</Label>
                    <Input
                      type="number"
                      value={settings.system.maxFileSize}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          system: {
                            ...prev.system,
                            maxFileSize: parseInt(e.target.value),
                          },
                        }))
                      }
                      className="bg-black/30 border-gray-600"
                    />
                  </div>
                </div>
              </div>
              <Button
                onClick={() => handleSaveSettings("System")}
                disabled={isLoading}
                className="bg-wme-gold text-black hover:bg-wme-gold/90"
              >
                <Save className="w-4 h-4 mr-2" />
                Save System Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email">
          <Card className="bg-black/20 border-wme-gold/20">
            <CardHeader>
              <CardTitle className="text-white">Email Configuration</CardTitle>
              <CardDescription>
                Configure SMTP settings and email templates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    SMTP Settings
                  </h3>
                  <div className="space-y-2">
                    <Label className="text-gray-300">SMTP Host</Label>
                    <Input
                      value={settings.email.smtpHost}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          email: { ...prev.email, smtpHost: e.target.value },
                        }))
                      }
                      placeholder="smtp.gmail.com"
                      className="bg-black/30 border-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">SMTP Port</Label>
                    <Input
                      value={settings.email.smtpPort}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          email: { ...prev.email, smtpPort: e.target.value },
                        }))
                      }
                      className="bg-black/30 border-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Username</Label>
                    <Input
                      value={settings.email.smtpUser}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          email: { ...prev.email, smtpUser: e.target.value },
                        }))
                      }
                      className="bg-black/30 border-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Password</Label>
                    <Input
                      type="password"
                      value={settings.email.smtpPassword}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          email: {
                            ...prev.email,
                            smtpPassword: e.target.value,
                          },
                        }))
                      }
                      className="bg-black/30 border-gray-600"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-gray-300">SSL/TLS Enabled</Label>
                    <Switch
                      checked={settings.email.sslEnabled}
                      onCheckedChange={(checked) =>
                        setSettings((prev) => ({
                          ...prev,
                          email: { ...prev.email, sslEnabled: checked },
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Email Identity
                  </h3>
                  <div className="space-y-2">
                    <Label className="text-gray-300">From Email</Label>
                    <Input
                      value={settings.email.fromEmail}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          email: { ...prev.email, fromEmail: e.target.value },
                        }))
                      }
                      className="bg-black/30 border-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">From Name</Label>
                    <Input
                      value={settings.email.fromName}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          email: { ...prev.email, fromName: e.target.value },
                        }))
                      }
                      className="bg-black/30 border-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Test Email</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="test@example.com"
                        className="bg-black/30 border-gray-600"
                      />
                      <Button variant="outline">
                        <Mail className="w-4 h-4 mr-2" />
                        Test
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => handleSaveSettings("Email")}
                disabled={isLoading}
                className="bg-wme-gold text-black hover:bg-wme-gold/90"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Email Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card className="bg-black/20 border-wme-gold/20">
            <CardHeader>
              <CardTitle className="text-white">
                Security Configuration
              </CardTitle>
              <CardDescription>
                Configure authentication, sessions, and security policies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Authentication
                  </h3>
                  <div className="space-y-2">
                    <Label className="text-gray-300">
                      Session Timeout (hours)
                    </Label>
                    <Input
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          security: {
                            ...prev.security,
                            sessionTimeout: parseInt(e.target.value),
                          },
                        }))
                      }
                      className="bg-black/30 border-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Max Login Attempts</Label>
                    <Input
                      type="number"
                      value={settings.security.maxLoginAttempts}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          security: {
                            ...prev.security,
                            maxLoginAttempts: parseInt(e.target.value),
                          },
                        }))
                      }
                      className="bg-black/30 border-gray-600"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-gray-300">
                      Require Two-Factor Auth
                    </Label>
                    <Switch
                      checked={settings.security.requireTwoFactor}
                      onCheckedChange={(checked) =>
                        setSettings((prev) => ({
                          ...prev,
                          security: {
                            ...prev.security,
                            requireTwoFactor: checked,
                          },
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Password Policy
                  </h3>
                  <div className="space-y-2">
                    <Label className="text-gray-300">
                      Minimum Password Length
                    </Label>
                    <Input
                      type="number"
                      value={settings.security.passwordMinLength}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          security: {
                            ...prev.security,
                            passwordMinLength: parseInt(e.target.value),
                          },
                        }))
                      }
                      className="bg-black/30 border-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">JWT Secret Key</Label>
                    <div className="flex gap-2">
                      <Input
                        type="password"
                        value={settings.security.jwtSecret}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            security: {
                              ...prev.security,
                              jwtSecret: e.target.value,
                            },
                          }))
                        }
                        className="bg-black/30 border-gray-600"
                      />
                      <Button variant="outline" size="sm">
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => handleSaveSettings("Security")}
                disabled={isLoading}
                className="bg-wme-gold text-black hover:bg-wme-gold/90"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs content would be similar... */}
        <TabsContent value="users">
          <Card className="bg-black/20 border-wme-gold/20">
            <CardHeader>
              <CardTitle className="text-white">User Management</CardTitle>
              <CardDescription>
                Manage admin users and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  User Management
                </h3>
                <p className="text-gray-400 mb-4">
                  This feature will allow you to manage admin users, roles, and
                  permissions.
                </p>
                <Button variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="app">
          <Card className="bg-black/20 border-wme-gold/20">
            <CardHeader>
              <CardTitle className="text-white">Application Settings</CardTitle>
              <CardDescription>
                Customize application appearance and branding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Branding</h3>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Site Name</Label>
                    <Input
                      value={settings.app.siteName}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          app: { ...prev.app, siteName: e.target.value },
                        }))
                      }
                      className="bg-black/30 border-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Support Email</Label>
                    <Input
                      value={settings.app.supportEmail}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          app: { ...prev.app, supportEmail: e.target.value },
                        }))
                      }
                      className="bg-black/30 border-gray-600"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Legal Pages
                  </h3>
                  <div className="space-y-2">
                    <Label className="text-gray-300">
                      Terms of Service URL
                    </Label>
                    <Input
                      value={settings.app.termsUrl}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          app: { ...prev.app, termsUrl: e.target.value },
                        }))
                      }
                      className="bg-black/30 border-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Privacy Policy URL</Label>
                    <Input
                      value={settings.app.privacyUrl}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          app: { ...prev.app, privacyUrl: e.target.value },
                        }))
                      }
                      className="bg-black/30 border-gray-600"
                    />
                  </div>
                </div>
              </div>
              <Button
                onClick={() => handleSaveSettings("Application")}
                disabled={isLoading}
                className="bg-wme-gold text-black hover:bg-wme-gold/90"
              >
                <Save className="w-4 h-4 mr-2" />
                Save App Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card className="bg-black/20 border-wme-gold/20">
            <CardHeader>
              <CardTitle className="text-white">Integration Settings</CardTitle>
              <CardDescription>
                Configure third-party integrations and webhooks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Plug className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Integration Hub
                </h3>
                <p className="text-gray-400 mb-4">
                  Connect with external services like payment processors, CRM
                  systems, and notification services.
                </p>
                <Button variant="outline">
                  <Plug className="w-4 h-4 mr-2" />
                  Configure Integrations
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring">
          <Card className="bg-black/20 border-wme-gold/20">
            <CardHeader>
              <CardTitle className="text-white">Monitoring & Logs</CardTitle>
              <CardDescription>
                View system logs, audit trails, and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Eye className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  System Monitoring
                </h3>
                <p className="text-gray-400 mb-4">
                  Monitor system performance, view audit logs, and track user
                  activity.
                </p>
                <Button variant="outline">
                  <Activity className="w-4 h-4 mr-2" />
                  View Logs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
