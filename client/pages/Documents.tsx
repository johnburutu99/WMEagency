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
import { Progress } from "../components/ui/progress";
import {
  FileText,
  Search,
  Filter,
  Upload,
  Download,
  Eye,
  PenTool,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  User,
  MoreHorizontal,
  Shield,
  Stamp,
} from "lucide-react";

export default function Documents() {
  const [searchTerm, setSearchTerm] = useState("");

  const documents = [
    {
      id: "DOC001",
      name: "NDA - Taylor Swift Grammy Performance",
      type: "NDA",
      status: "Pending Signature",
      uploadDate: "2024-01-15",
      dueDate: "2024-01-22",
      size: "2.4 MB",
      coordinator: "Sarah Johnson",
      priority: "High",
    },
    {
      id: "DOC002",
      name: "Contract - Dwayne Johnson Fast X Premiere",
      type: "Contract",
      status: "Signed",
      uploadDate: "2024-01-10",
      signedDate: "2024-01-12",
      size: "1.8 MB",
      coordinator: "Michael Chen",
      priority: "Medium",
    },
    {
      id: "DOC003",
      name: "Invoice - Zendaya Vogue Photoshoot",
      type: "Invoice",
      status: "Completed",
      uploadDate: "2024-01-08",
      completedDate: "2024-01-10",
      size: "0.6 MB",
      coordinator: "Emma Williams",
      priority: "Low",
    },
    {
      id: "DOC004",
      name: "Privacy Agreement - Ryan Reynolds Press Tour",
      type: "Privacy Agreement",
      status: "Under Review",
      uploadDate: "2024-01-20",
      size: "1.2 MB",
      coordinator: "David Park",
      priority: "Medium",
    },
    {
      id: "DOC005",
      name: "Media Rights - Chris Evans Marvel Contract",
      type: "Media Rights",
      status: "Draft",
      uploadDate: "2024-01-18",
      size: "3.1 MB",
      coordinator: "Sarah Johnson",
      priority: "High",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending Signature":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "Signed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Completed":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Under Review":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "Draft":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "Medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "Low":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending Signature":
        return <PenTool className="w-4 h-4" />;
      case "Signed":
        return <CheckCircle className="w-4 h-4" />;
      case "Completed":
        return <CheckCircle className="w-4 h-4" />;
      case "Under Review":
        return <Clock className="w-4 h-4" />;
      case "Draft":
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const pendingSignatures = documents.filter(
    (doc) => doc.status === "Pending Signature",
  ).length;
  const completedDocs = documents.filter(
    (doc) => doc.status === "Completed" || doc.status === "Signed",
  ).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Document Center</h1>
            <p className="text-muted-foreground">
              Manage NDAs, contracts, and legal documents
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
            <Link to="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Documents
                  </p>
                  <p className="text-2xl font-bold">{documents.length}</p>
                </div>
                <FileText className="w-8 h-8 text-wme-gold" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Pending Signatures
                  </p>
                  <p className="text-2xl font-bold">{pendingSignatures}</p>
                </div>
                <PenTool className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Completed
                  </p>
                  <p className="text-2xl font-bold">{completedDocs}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Compliance Rate
                  </p>
                  <p className="text-2xl font-bold">98%</p>
                </div>
                <Shield className="w-8 h-8 text-wme-gold" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search documents by name, type, or ID..."
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

        {/* Document Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Documents</TabsTrigger>
            <TabsTrigger value="pending">Pending Signature</TabsTrigger>
            <TabsTrigger value="signed">Signed</TabsTrigger>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
            <TabsTrigger value="ndas">NDAs</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Left section */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-wme-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        {getStatusIcon(doc.status)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg truncate">
                            {doc.name}
                          </h3>
                          <Badge variant="outline" className="flex-shrink-0">
                            {doc.type}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Uploaded: {doc.uploadDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {doc.coordinator}
                          </span>
                          <span>{doc.size}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(doc.status)}>
                            {doc.status}
                          </Badge>
                          <Badge className={getPriorityColor(doc.priority)}>
                            {doc.priority} Priority
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Right section */}
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
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
                        {doc.status === "Pending Signature" && (
                          <Button
                            size="sm"
                            className="bg-wme-gold text-black hover:bg-wme-gold/90"
                          >
                            <Stamp className="w-4 h-4 mr-2" />
                            Sign Now
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Progress bar for pending signatures */}
                  {doc.status === "Pending Signature" && doc.dueDate && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">
                          Due: {doc.dueDate}
                        </span>
                        <span className="text-sm font-medium text-yellow-600">
                          Action Required
                        </span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="pending">
            <div className="space-y-4">
              {filteredDocuments
                .filter((doc) => doc.status === "Pending Signature")
                .map((doc) => (
                  <Card
                    key={doc.id}
                    className="border-yellow-200 bg-yellow-50/50 dark:bg-yellow-950/20"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <AlertCircle className="w-6 h-6 text-yellow-500" />
                          <div>
                            <h3 className="font-semibold">{doc.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Due: {doc.dueDate}
                            </p>
                          </div>
                        </div>
                        <Button className="bg-wme-gold text-black hover:bg-wme-gold/90">
                          <Stamp className="w-4 h-4 mr-2" />
                          Sign Document
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="signed">
            <p className="text-muted-foreground">
              Signed documents will be displayed here.
            </p>
          </TabsContent>

          <TabsContent value="contracts">
            <p className="text-muted-foreground">
              Contract documents will be displayed here.
            </p>
          </TabsContent>

          <TabsContent value="ndas">
            <p className="text-muted-foreground">
              NDA documents will be displayed here.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
