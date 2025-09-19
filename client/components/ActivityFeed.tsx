import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";

export function ActivityFeed() {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_BASE_URL || "http://localhost:8080");

    socket.on("new-activity", (activity) => {
      setActivities((prevActivities) => [activity, ...prevActivities]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
      <h4 className="mb-4 text-sm font-medium leading-none">Activity Feed</h4>
      {activities.map((activity, index) => (
        <div key={index} className="mb-4">
          <p className="text-sm">
            {activity.message} <Badge>{activity.type}</Badge>
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date(activity.timestamp).toLocaleString()}
          </p>
        </div>
      ))}
    </ScrollArea>
  );
}
