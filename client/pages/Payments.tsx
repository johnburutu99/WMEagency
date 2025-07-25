import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { 
  CreditCard, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  Wallet,
  Receipt,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function Payments() {
  const [searchTerm, setSearchTerm] = useState('');

  const transactions = [
    {
      id: 'TXN001',
      invoiceId: 'INV-2024-001',
      description: 'Taylor Swift Grammy Performance',
      amount: 2500000,
      currency: 'USD',
      status: 'Paid',
      method: 'Wire Transfer',
      date: '2024-01-15',
      dueDate: '2024-01-30',
      type: 'Invoice',
      coordinator: 'Sarah Johnson',
      category: 'Performance Fee'
    },
    {
      id: 'TXN002',
      invoiceId: 'INV-2024-002',
      description: 'Dwayne Johnson Fast X Premiere',
      amount: 750000,
      currency: 'USD',
      status: 'Pending',
      method: 'ACH Transfer',
      date: '2024-01-10',
      dueDate: '2024-01-25',
      type: 'Invoice',
      coordinator: 'Michael Chen',
      category: 'Event Appearance'
    },
    {
      id: 'TXN003',
      invoiceId: 'RCT-2024-003',
      description: 'Zendaya Vogue Photoshoot',
      amount: 150000,
      currency: 'USD',
      status: 'Paid',
      method: 'Credit Card',
      date: '2024-01-08',
      dueDate: '2024-01-20',
      type: 'Receipt',
      coordinator: 'Emma Williams',
      category: 'Photo/Video'
    },
    {
      id: 'TXN004',
      invoiceId: 'INV-2024-004',
      description: 'Ryan Reynolds Press Tour Services',
      amount: 1200000,
      currency: 'USD',
      status: 'Overdue',
      method: 'Wire Transfer',
      date: '2024-01-05',
      dueDate: '2024-01-20',
      type: 'Invoice',
      coordinator: 'David Park',
      category: 'Publicity Services'
    },
    {
      id: 'TXN005',
      invoiceId: 'PMT-2024-005',
      description: 'Commission Payment - Music Division',
      amount: 180000,
      currency: 'USD',
      status: 'Processing',
      method: 'Direct Deposit',
      date: '2024-01-20',
      dueDate: '2024-01-22',
      type: 'Payment',
      coordinator: 'Sarah Johnson',
      category: 'Commission'
    }
  ];

  const paymentMethods = [
    {
      id: 'pm1',
      type: 'Credit Card',
      last4: '4242',
      brand: 'Visa',
      expiryMonth: 12,
      expiryYear: 2026,
      isDefault: true
    },
    {
      id: 'pm2',
      type: 'Bank Account',
      last4: '6789',
      bankName: 'Chase Bank',
      accountType: 'Checking',
      isDefault: false
    },
    {
      id: 'pm3',
      type: 'Wire Transfer',
      accountName: 'WME Client Account',
      routingNumber: '021000021',
      isDefault: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'Processing': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Overdue': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Cancelled': return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid': return <CheckCircle className="w-4 h-4" />;
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'Processing': return <Clock className="w-4 h-4" />;
      case 'Overdue': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const filteredTransactions = transactions.filter(txn =>
    txn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    txn.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    txn.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPaid = transactions.filter(t => t.status === 'Paid').reduce((sum, t) => sum + t.amount, 0);
  const totalPending = transactions.filter(t => t.status === 'Pending' || t.status === 'Processing').reduce((sum, t) => sum + t.amount, 0);
  const totalOverdue = transactions.filter(t => t.status === 'Overdue').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Payments & Invoices</h1>
            <p className="text-muted-foreground">Manage your payments, invoices, and billing information</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Payment Method
            </Button>
            <Link to="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Paid</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalPaid)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">This year</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Payments</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalPending)}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Awaiting processing</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                  <p className="text-2xl font-bold text-red-500">{formatCurrency(totalOverdue)}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Requires attention</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Transaction</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalPaid / transactions.filter(t => t.status === 'Paid').length || 0)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-wme-gold" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Per transaction</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search transactions by description, invoice ID, or category..."
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

        {/* Payment Tabs */}
        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="transactions">All Transactions</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="methods">Payment Methods</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <Card key={transaction.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Left section */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-wme-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        {getStatusIcon(transaction.status)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{transaction.description}</h3>
                          <Badge variant="outline" className="flex-shrink-0">
                            {transaction.type}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <Receipt className="w-3 h-3" />
                            {transaction.invoiceId}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {transaction.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Wallet className="w-3 h-3" />
                            {transaction.method}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                          <Badge variant="secondary">
                            {transaction.category}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Right section */}
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* Amount */}
                      <div className="text-right lg:w-32">
                        <p className="text-2xl font-bold">{formatCurrency(transaction.amount)}</p>
                        <p className="text-sm text-muted-foreground">Due: {transaction.dueDate}</p>
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
                        {transaction.status === 'Pending' && (
                          <Button size="sm" className="bg-wme-gold text-black hover:bg-wme-gold/90">
                            <CreditCard className="w-4 h-4 mr-2" />
                            Pay Now
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Payment progress for pending/overdue */}
                  {(transaction.status === 'Pending' || transaction.status === 'Overdue') && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Payment Progress</span>
                        <span className={`text-sm font-medium ${transaction.status === 'Overdue' ? 'text-red-600' : 'text-yellow-600'}`}>
                          {transaction.status === 'Overdue' ? 'Past Due' : 'Processing'}
                        </span>
                      </div>
                      <Progress 
                        value={transaction.status === 'Overdue' ? 100 : 65} 
                        className={`h-2 ${transaction.status === 'Overdue' ? '[&>div]:bg-red-500' : '[&>div]:bg-yellow-500'}`}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="invoices">
            <div className="space-y-4">
              {filteredTransactions
                .filter(txn => txn.type === 'Invoice')
                .map((transaction) => (
                  <Card key={transaction.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Receipt className="w-6 h-6 text-wme-gold" />
                          <div>
                            <h3 className="font-semibold">{transaction.description}</h3>
                            <p className="text-sm text-muted-foreground">{transaction.invoiceId} • {transaction.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">{formatCurrency(transaction.amount)}</p>
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="payments">
            <div className="space-y-4">
              {filteredTransactions
                .filter(txn => txn.type === 'Payment' || txn.type === 'Receipt')
                .map((transaction) => (
                  <Card key={transaction.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <CheckCircle className="w-6 h-6 text-green-500" />
                          <div>
                            <h3 className="font-semibold">{transaction.description}</h3>
                            <p className="text-sm text-muted-foreground">{transaction.invoiceId} • {transaction.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-green-600">{formatCurrency(transaction.amount)}</p>
                          <p className="text-sm text-muted-foreground">{transaction.method}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="methods">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Payment Methods</h3>
                <Button className="bg-wme-gold text-black hover:bg-wme-gold/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Method
                </Button>
              </div>
              
              {paymentMethods.map((method) => (
                <Card key={method.id} className={method.isDefault ? 'border-wme-gold bg-wme-gold/5' : ''}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-wme-gold/10 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-wme-gold" />
                        </div>
                        <div>
                          <h4 className="font-semibold flex items-center gap-2">
                            {method.type}
                            {method.isDefault && (
                              <Badge className="bg-wme-gold text-black">Default</Badge>
                            )}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {method.type === 'Credit Card' 
                              ? `${method.brand} ending in ${method.last4} • Expires ${method.expiryMonth}/${method.expiryYear}`
                              : method.type === 'Bank Account'
                              ? `${method.bankName} ${method.accountType} ending in ${method.last4}`
                              : `${method.accountName} • ${method.routingNumber}`
                            }
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!method.isDefault && (
                          <Button variant="outline" size="sm">
                            Set as Default
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
