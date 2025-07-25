import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Users, 
  Search, 
  Phone, 
  Mail, 
  MessageSquare, 
  Calendar,
  MapPin,
  Star,
  Clock,
  Globe,
  Award,
  Building,
  User
} from 'lucide-react';

export default function Coordinators() {
  const [searchTerm, setSearchTerm] = useState('');

  const coordinators = [
    {
      id: 'coord1',
      name: 'Sarah Johnson',
      role: 'Senior Talent Coordinator',
      department: 'Music Division',
      email: 'sarah.johnson@wme.com',
      phone: '+1 (310) 285-9000',
      location: 'Beverly Hills, CA',
      timezone: 'PST (UTC-8)',
      avatar: 'SJ',
      status: 'online',
      specialties: ['Music', 'Live Performances', 'Awards Shows'],
      experience: '8 years',
      languages: ['English', 'Spanish'],
      activeClients: 15,
      rating: 4.9,
      nextAvailable: 'Available now',
      recentProjects: [
        'Taylor Swift Grammy Performance',
        'Billie Eilish World Tour',
        'Ariana Grande Vegas Residency'
      ]
    },
    {
      id: 'coord2',
      name: 'Michael Chen',
      role: 'Talent Coordinator',
      department: 'Film & TV Division',
      email: 'michael.chen@wme.com',
      phone: '+1 (310) 285-9001',
      location: 'Los Angeles, CA',
      timezone: 'PST (UTC-8)',
      avatar: 'MC',
      status: 'busy',
      specialties: ['Film', 'Television', 'Digital Content'],
      experience: '6 years',
      languages: ['English', 'Mandarin'],
      activeClients: 12,
      rating: 4.8,
      nextAvailable: 'Available at 3:00 PM',
      recentProjects: [
        'Fast X Premiere Campaign',
        'Marvel Phase 5 Projects',
        'Netflix Original Series'
      ]
    },
    {
      id: 'coord3',
      name: 'Emma Williams',
      role: 'Project Manager',
      department: 'Digital & Brand Partnerships',
      email: 'emma.williams@wme.com',
      phone: '+1 (310) 285-9002',
      location: 'New York, NY',
      timezone: 'EST (UTC-5)',
      avatar: 'EW',
      status: 'offline',
      specialties: ['Brand Partnerships', 'Digital Strategy', 'Influencer Management'],
      experience: '5 years',
      languages: ['English', 'French'],
      activeClients: 18,
      rating: 4.7,
      nextAvailable: 'Tomorrow at 9:00 AM',
      recentProjects: [
        'Zendaya Vogue Partnership',
        'Instagram Creator Fund',
        'TikTok Brand Collaborations'
      ]
    },
    {
      id: 'coord4',
      name: 'David Park',
      role: 'Legal Coordinator',
      department: 'Legal Affairs',
      email: 'david.park@wme.com',
      phone: '+1 (310) 285-9003',
      location: 'Beverly Hills, CA',
      timezone: 'PST (UTC-8)',
      avatar: 'DP',
      status: 'online',
      specialties: ['Contract Negotiation', 'Intellectual Property', 'Rights Management'],
      experience: '10 years',
      languages: ['English', 'Korean'],
      activeClients: 8,
      rating: 4.9,
      nextAvailable: 'Available now',
      recentProjects: [
        'Ryan Reynolds Press Tour Contracts',
        'Music Rights Negotiations',
        'International Distribution Deals'
      ]
    },
    {
      id: 'coord5',
      name: 'Jessica Rivera',
      role: 'International Coordinator',
      department: 'Global Markets',
      email: 'jessica.rivera@wme.com',
      phone: '+1 (310) 285-9004',
      location: 'London, UK',
      timezone: 'GMT (UTC+0)',
      avatar: 'JR',
      status: 'online',
      specialties: ['International Markets', 'Tour Management', 'Cultural Liaison'],
      experience: '7 years',
      languages: ['English', 'Spanish', 'Italian'],
      activeClients: 14,
      rating: 4.8,
      nextAvailable: 'Available at 11:00 AM GMT',
      recentProjects: [
        'European Tour Coordination',
        'International Film Festivals',
        'Global Brand Campaigns'
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Online';
      case 'busy': return 'Busy';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  const filteredCoordinators = coordinators.filter(coord =>
    coord.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coord.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coord.specialties.some(specialty => specialty.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Coordinator Directory</h1>
            <p className="text-muted-foreground">Connect with your dedicated WME team members</p>
          </div>
          <Link to="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Coordinators</p>
                  <p className="text-2xl font-bold">{coordinators.length}</p>
                </div>
                <Users className="w-8 h-8 text-wme-gold" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Online Now</p>
                  <p className="text-2xl font-bold">{coordinators.filter(c => c.status === 'online').length}</p>
                </div>
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Departments</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
                <Building className="w-8 h-8 text-wme-gold" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                  <p className="text-2xl font-bold">2h</p>
                </div>
                <Clock className="w-8 h-8 text-wme-gold" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search coordinators by name, department, or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Coordinator Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Coordinators</TabsTrigger>
            <TabsTrigger value="online">Online</TabsTrigger>
            <TabsTrigger value="music">Music</TabsTrigger>
            <TabsTrigger value="film">Film & TV</TabsTrigger>
            <TabsTrigger value="digital">Digital</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCoordinators.map((coordinator) => (
                <Card key={coordinator.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-16 h-16 bg-wme-gold rounded-full flex items-center justify-center text-black font-bold text-lg">
                            {coordinator.avatar}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(coordinator.status)} rounded-full border-2 border-background`} />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{coordinator.name}</h3>
                          <p className="text-sm text-muted-foreground mb-1">{coordinator.role}</p>
                          <Badge variant="outline" className="text-xs">
                            {coordinator.department}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-wme-gold fill-current" />
                        <span className="text-sm font-medium">{coordinator.rating}</span>
                      </div>
                    </div>

                    {/* Status and Availability */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 ${getStatusColor(coordinator.status)} rounded-full`} />
                        <span className="text-sm">{getStatusText(coordinator.status)}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{coordinator.nextAvailable}</span>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{coordinator.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{coordinator.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{coordinator.location}</span>
                        <span className="text-muted-foreground">({coordinator.timezone})</span>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Specialties:</p>
                      <div className="flex flex-wrap gap-1">
                        {coordinator.specialties.map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                      <div>
                        <p className="text-sm font-medium">{coordinator.activeClients}</p>
                        <p className="text-xs text-muted-foreground">Active Clients</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{coordinator.experience}</p>
                        <p className="text-xs text-muted-foreground">Experience</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{coordinator.languages.length}</p>
                        <p className="text-xs text-muted-foreground">Languages</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="online">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCoordinators
                .filter(coord => coord.status === 'online')
                .map((coordinator) => (
                  <Card key={coordinator.id} className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-12 h-12 bg-wme-gold rounded-full flex items-center justify-center text-black font-bold">
                              {coordinator.avatar}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{coordinator.name}</h3>
                            <p className="text-sm text-muted-foreground">{coordinator.role}</p>
                            <p className="text-xs text-green-600 font-medium">Available now</p>
                          </div>
                        </div>
                        <Button size="sm" className="bg-wme-gold text-black hover:bg-wme-gold/90">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="music">
            <p className="text-muted-foreground">Music division coordinators will be displayed here.</p>
          </TabsContent>

          <TabsContent value="film">
            <p className="text-muted-foreground">Film & TV coordinators will be displayed here.</p>
          </TabsContent>

          <TabsContent value="digital">
            <p className="text-muted-foreground">Digital & brand partnership coordinators will be displayed here.</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
