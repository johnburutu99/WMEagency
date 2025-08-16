import { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { Badge } from "./ui/badge";
import {
  Settings,
  UserCog,
  Eye,
  ExternalLink,
  MessageSquare,
  Bell,
  RefreshCw,
  ArrowLeft,
  Shield,
  Activity,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

interface AdminFloatingToolbarProps {
  isImpersonating?: boolean;
  isViewOnly?: boolean;
  clientData?: {
    bookingId: string;
    name: string;
  };
}

export function AdminFloatingToolbar({
  isImpersonating = false,
  isViewOnly = false,
  clientData
}: AdminFloatingToolbarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  if (!isImpersonating && !isViewOnly) {
    return null;
  }

  const handleBackToAdmin = () => {
    localStorage.removeItem("wme-admin-impersonating");
    localStorage.removeItem("wme-admin-view-only");
    window.open("/admin", "_blank");
  };

  const handleOpenAdminPanel = () => {
    if (clientData?.bookingId) {
      window.open(`/admin/client/${clientData.bookingId}`, "_blank");
    }
  };

  const handleSendMessage = () => {
    toast.success("Message interface opened");
  };

  const handleSendNotification = () => {
    toast.success("Notification sent to client");
  };

  const handleRefreshClient = () => {
    window.location.reload();
    toast.success("Client dashboard refreshed");
  };

  const handleEndSession = () => {
    localStorage.removeItem("wme-admin-impersonating");
    localStorage.removeItem("wme-admin-view-only");
    localStorage.removeItem("wme-user-data");
    window.location.href = "/admin";
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="bg-black/90 backdrop-blur-sm border-wme-gold/30 shadow-2xl">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-wme-gold" />
              <CardTitle className="text-sm text-white">Admin Session</CardTitle>
              <Badge 
                className={
                  isImpersonating 
                    ? "bg-wme-gold/20 text-wme-gold border-wme-gold/30" 
                    : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                }
              >
                {isImpersonating ? "Control" : "View Only"}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </Button>
          </div>
          {clientData && (
            <CardDescription className="text-xs text-gray-400">
              {clientData.name} ({clientData.bookingId})
            </CardDescription>
          )}
        </CardHeader>
        
        {isExpanded && (
          <CardContent className="pt-0 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToAdmin}
                className="bg-wme-gold/10 border-wme-gold/30 text-wme-gold hover:bg-wme-gold/20"
              >
                <ArrowLeft className="w-3 h-3 mr-1" />
                Admin
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenAdminPanel}
                className="bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
              >
                <Settings className="w-3 h-3 mr-1" />
                Panel
              </Button>
              {isImpersonating && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSendMessage}
                    className="bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20"
                  >
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Message
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSendNotification}
                    className="bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20"
                  >
                    <Bell className="w-3 h-3 mr-1" />
                    Notify
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshClient}
                className="bg-gray-500/10 border-gray-500/30 text-gray-400 hover:bg-gray-500/20"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Refresh
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleEndSession}
                className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Exit
              </Button>
            </div>
            
            {/* Quick stats */}
            <div className="border-t border-gray-700 pt-2 mt-2">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-center">
                  <div className="text-gray-400">Session</div>
                  <div className="text-white font-mono">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400">Mode</div>
                  <div className="text-wme-gold font-semibold">
                    {isImpersonating ? "CONTROL" : "VIEW"}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
