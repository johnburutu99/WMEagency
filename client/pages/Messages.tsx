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
import { Separator } from "../components/ui/separator";
import { ScrollArea } from "../components/ui/scroll-area";
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  Phone,
  Video,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  Circle,
  Star,
  User,
  Smile,
  Image,
  FileText,
} from "lucide-react";

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState("chat1");
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const conversations = [
    {
      id: "chat1",
      name: "Sarah Johnson",
      role: "Senior Coordinator",
      avatar: "SJ",
      lastMessage:
        "The Taylor Swift contract is ready for your review. Please check the attached documents.",
      timestamp: "2 min ago",
      unread: 3,
      online: true,
      priority: "high",
    },
    {
      id: "chat2",
      name: "Michael Chen",
      role: "Talent Coordinator",
      avatar: "MC",
      lastMessage: "Great news! The venue confirmed the Fast X premiere date.",
      timestamp: "1 hour ago",
      unread: 1,
      online: true,
      priority: "medium",
    },
    {
      id: "chat3",
      name: "Emma Williams",
      role: "Project Manager",
      avatar: "EW",
      lastMessage: "Invoice has been processed and payment is confirmed.",
      timestamp: "3 hours ago",
      unread: 0,
      online: false,
      priority: "low",
    },
    {
      id: "chat4",
      name: "David Park",
      role: "Legal Coordinator",
      avatar: "DP",
      lastMessage:
        "Please review the updated NDA terms at your earliest convenience.",
      timestamp: "Yesterday",
      unread: 0,
      online: false,
      priority: "high",
    },
    {
      id: "chat5",
      name: "WME Support Team",
      role: "Support",
      avatar: "ST",
      lastMessage: "Your ticket #WME-2024-001 has been resolved.",
      timestamp: "2 days ago",
      unread: 0,
      online: true,
      priority: "low",
    },
  ];

  const messages = {
    chat1: [
      {
        id: 1,
        sender: "Sarah Johnson",
        content: "Hi John! I hope you're doing well.",
        timestamp: "10:30 AM",
        isMe: false,
        status: "read",
      },
      {
        id: 2,
        sender: "You",
        content: "Hi Sarah! Yes, everything is great. Thanks for checking in.",
        timestamp: "10:32 AM",
        isMe: true,
        status: "read",
      },
      {
        id: 3,
        sender: "Sarah Johnson",
        content:
          "Perfect! I have some exciting updates about the Taylor Swift Grammy performance.",
        timestamp: "10:33 AM",
        isMe: false,
        status: "read",
      },
      {
        id: 4,
        sender: "Sarah Johnson",
        content:
          "The contract is ready for your review. I've attached all the necessary documents including the performance agreement and technical requirements.",
        timestamp: "10:35 AM",
        isMe: false,
        status: "read",
        attachments: [
          {
            name: "Taylor_Swift_Performance_Contract.pdf",
            size: "2.4 MB",
            type: "pdf",
          },
          { name: "Technical_Requirements.docx", size: "1.1 MB", type: "doc" },
        ],
      },
      {
        id: 5,
        sender: "You",
        content:
          "Thank you! I'll review these documents today and get back to you.",
        timestamp: "10:40 AM",
        isMe: true,
        status: "delivered",
      },
      {
        id: 6,
        sender: "Sarah Johnson",
        content:
          "Sounds great! Please let me know if you have any questions. The deadline for signature is Friday.",
        timestamp: "2 min ago",
        isMe: false,
        status: "unread",
      },
    ],
  };

  const currentChat = conversations.find((chat) => chat.id === selectedChat);
  const currentMessages = messages[selectedChat as keyof typeof messages] || [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.role.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Secure Messaging</h1>
            <p className="text-muted-foreground">
              Communicate with your WME coordinators and team
            </p>
          </div>
          <Link to="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        {/* Messaging Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Chat List */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Conversations</CardTitle>
                <Badge variant="secondary">{conversations.length}</Badge>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[450px]">
                <div className="space-y-1 p-4 pt-0">
                  {filteredConversations.map((conv) => (
                    <div
                      key={conv.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedChat === conv.id
                          ? "bg-wme-gold/10 border border-wme-gold/20"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => setSelectedChat(conv.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-wme-gold rounded-full flex items-center justify-center text-black font-semibold">
                            {conv.avatar}
                          </div>
                          {conv.online && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-sm truncate">
                              {conv.name}
                            </h4>
                            <div className="flex items-center gap-1">
                              {conv.priority === "high" && (
                                <Star className="w-3 h-3 text-red-500 fill-current" />
                              )}
                              <span className="text-xs text-muted-foreground">
                                {conv.timestamp}
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">
                            {conv.role}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {conv.lastMessage}
                          </p>
                          {conv.unread > 0 && (
                            <div className="flex justify-end mt-2">
                              <Badge className="bg-wme-gold text-black text-xs">
                                {conv.unread}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Window */}
          <Card className="lg:col-span-2">
            {currentChat ? (
              <>
                {/* Chat Header */}
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-wme-gold rounded-full flex items-center justify-center text-black font-semibold">
                          {currentChat.avatar}
                        </div>
                        {currentChat.online && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{currentChat.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {currentChat.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Video className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <Separator />

                {/* Messages */}
                <ScrollArea className="flex-1 p-4 h-[350px]">
                  <div className="space-y-4">
                    {currentMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.isMe ? "bg-wme-gold text-black" : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>

                          {/* Attachments */}
                          {message.attachments && (
                            <div className="mt-2 space-y-2">
                              {message.attachments.map((attachment, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 p-2 bg-background/50 rounded"
                                >
                                  <FileText className="w-4 h-4" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium truncate">
                                      {attachment.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {attachment.size}
                                    </p>
                                  </div>
                                  <Button variant="ghost" size="sm">
                                    Download
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}

                          <div
                            className={`flex items-center justify-between mt-2 text-xs ${
                              message.isMe
                                ? "text-black/70"
                                : "text-muted-foreground"
                            }`}
                          >
                            <span>{message.timestamp}</span>
                            {message.isMe && (
                              <div className="flex items-center gap-1">
                                {message.status === "delivered" && (
                                  <CheckCircle2 className="w-3 h-3" />
                                )}
                                {message.status === "read" && (
                                  <CheckCircle2 className="w-3 h-3 text-blue-500" />
                                )}
                                {message.status === "unread" && (
                                  <Circle className="w-3 h-3" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <Separator />

                {/* Message Input */}
                <div className="p-4">
                  <form
                    onSubmit={handleSendMessage}
                    className="flex items-center gap-2"
                  >
                    <Button variant="ghost" size="sm" type="button">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" type="button">
                      <Image className="w-4 h-4" />
                    </Button>
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="ghost" size="sm" type="button">
                      <Smile className="w-4 h-4" />
                    </Button>
                    <Button
                      type="submit"
                      className="bg-wme-gold text-black hover:bg-wme-gold/90"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                  <p className="text-xs text-muted-foreground mt-2">
                    Messages are encrypted and secure. Only you and WME
                    coordinators can access this conversation.
                  </p>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Select a conversation</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
