import { useState } from "react";
import { Link } from "react-router-dom";
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
import {
  Calendar,
  Search,
  Filter,
  Star,
  Clock,
  MapPin,
  DollarSign,
  Eye,
  Download,
  MoreHorizontal,
} from "lucide-react";

export default function Bookings() {
  const [searchTerm, setSearchTerm] = useState("");

  const bookings = [
    {
      id: "BK001",
      artist: "Taylor Swift",
      event: "Grammy Awards Performance",
      date: "2024-02-04",
      location: "Crypto.com Arena, Los Angeles",
      status: "Confirmed",
      amount: "$2,500,000",
      timeline: 85,
      coordinator: "Sarah Johnson",
    },
    {
      id: "BK002",
      artist: "Dwayne Johnson",
      event: "Fast X Premiere",
      date: "2024-01-15",
      location: "TCL Chinese Theatre, Hollywood",
      status: "Pending",
      amount: "$750,000",
      timeline: 60,
      coordinator: "Michael Chen",
    },
    {
      id: "BK003",
      artist: "Zendaya",
      event: "Vogue Photoshoot",
      date: "2024-01-22",
      location: "Conde Nast Studios, NYC",
      status: "Completed",
      amount: "$150,000",
      timeline: 100,
      coordinator: "Emma Williams",
    },
    {
      id: "BK004",
      artist: "Ryan Reynolds",
      event: "Deadpool 3 Press Tour",
      date: "2024-03-15",
      location: "Various Locations",
      status: "Draft",
      amount: "$1,200,000",
      timeline: 25,
      coordinator: "David Park",
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

  const getTimelineColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-wme-gold";
  };

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Bookings</h1>
            <p className="text-muted-foreground">
              Manage your talent bookings and track their progress
            </p>
          </div>
          <Link to="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search bookings by artist, event, or booking ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Bookings</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredBookings.map((booking) => (
              <Card
                key={booking.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Left section */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-wme-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Star className="w-6 h-6 text-wme-gold" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">
                            {booking.artist}
                          </h3>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-1">
                          {booking.event}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {booking.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {booking.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {booking.amount}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right section */}
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* Progress */}
                      <div className="lg:w-32">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">
                            Progress
                          </span>
                          <span className="text-xs font-medium">
                            {booking.timeline}%
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getTimelineColor(booking.timeline)}`}
                            style={{ width: `${booking.timeline}%` }}
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Coordinator info */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      Coordinator:{" "}
                      <span className="font-medium text-foreground">
                        {booking.coordinator}
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="active">
            <p className="text-muted-foreground">
              Active bookings will be displayed here.
            </p>
          </TabsContent>

          <TabsContent value="pending">
            <p className="text-muted-foreground">
              Pending bookings will be displayed here.
            </p>
          </TabsContent>

          <TabsContent value="completed">
            <p className="text-muted-foreground">
              Completed bookings will be displayed here.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
