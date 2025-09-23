import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";
import { Button } from "./ui/button";

export function NotificationCenter() {
  const notifications = [
    {
      id: 1,
      title: "New message from Sarah Johnson",
      description: "The Taylor Swift contract is ready for your review.",
      time: "2 min ago",
    },
    {
      id: 2,
      title: "Payment received",
      description: "Payment of $150,000 for the Vogue photoshoot has been confirmed.",
      time: "3 hours ago",
    },
    {
      id: 3,
      title: "Document uploaded",
      description: "The NDA for the Fast X premiere has been uploaded.",
      time: "1 day ago",
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-wme-gold rounded-full" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.map((notification) => (
          <DropdownMenuItem key={notification.id}>
            <div>
              <p className="font-semibold">{notification.title}</p>
              <p className="text-sm text-muted-foreground">
                {notification.description}
              </p>
              <p className="text-xs text-muted-foreground">{notification.time}</p>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
