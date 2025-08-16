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
  X,
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
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
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
      {!isVisible ? (
        <Button
          onClick={() => setIsVisible(true)}
          className="w-8 h-8 p-0 bg-gray-800/50 hover:bg-gray-700/80 border border-gray-600/30 shadow-lg opacity-30 hover:opacity-100 transition-opacity"
          variant="ghost"
        >
          <Shield className="w-3 h-3 text-gray-400" />
        </Button>
      ) : (
        <Card className="bg-black/95 backdrop-blur-sm border-gray-600/30 shadow-2xl max-w-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-3 h-3 text-gray-400" />
                <CardTitle className="text-xs text-gray-300">Admin</CardTitle>
                <Badge 
                  className={
                    isImpersonating 
                      ? "bg-wme-gold/20 text-wme-gold border-wme-gold/30 text-xs px-1" 
                      : "bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs px-1"
                  }
                >
                  {isImpersonating ? "Control" : "View"}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="h-5 w-5 p-0 text-gray-400 hover:text-white"
                >
                  {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsVisible(false)}
                  className="h-5 w-5 p-0 text-gray-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          {isExpanded && (
            <CardContent className="pt-0 space-y-2">
              <div className="grid grid-cols-3 gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBackToAdmin}
                  className="bg-wme-gold/10 border-wme-gold/30 text-wme-gold hover:bg-wme-gold/20 text-xs h-8"
                >
                  <ArrowLeft className="w-3 h-3 mr-1" />
                  Admin
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenAdminPanel}
                  className="bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20 text-xs h-8"
                >
                  <Settings className="w-3 h-3 mr-1" />
                  Panel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleEndSession}
                  className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs h-8"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Exit
                </Button>
              </div>
              
              {isImpersonating && (
                <div className="grid grid-cols-2 gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSendMessage}
                    className="bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20 text-xs h-7"
                  >
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Message
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefreshClient}
                    className="bg-gray-500/10 border-gray-500/30 text-gray-400 hover:bg-gray-500/20 text-xs h-7"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Refresh
                  </Button>
                </div>
              )}
              
              {/* Session info */}
              <div className="border-t border-gray-700 pt-1 mt-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Mode:</span>
                  <span className="text-wme-gold font-mono">
                    {isImpersonating ? "CTRL" : "VIEW"}
                  </span>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}
