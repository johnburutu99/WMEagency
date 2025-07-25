import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Eye, EyeOff, Lock, Mail, Shield, Star, Users, Globe } from 'lucide-react';

export default function Index() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual authentication
    console.log('Login attempt:', { email, password });

    // For demo purposes, redirect to dashboard
    if (email && password) {
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 bg-black/50 backdrop-blur-sm border-b border-wme-gold/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-wme-gold rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">WME</h1>
                <p className="text-xs text-wme-gold">Client Portal</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-sm text-gray-300">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-wme-gold" />
                Secure Access
              </span>
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-wme-gold" />
                Global Network
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex min-h-screen">
        {/* Left Side - Hero */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-wme-gold/10 via-transparent to-black/50" />
          <div className="flex flex-col justify-center p-12 relative z-10">
            <h2 className="text-5xl font-bold text-white mb-6">
              Welcome to the
              <span className="block text-wme-gold">
                <strong>WME Client Portal</strong>
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Your secure gateway to world-class talent representation. 
              Manage bookings, documents, communications, and payments all in one place.
            </p>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-3 text-gray-200">
                <Users className="w-5 h-5 text-wme-gold" />
                <span>Direct access to your dedicated coordinator</span>
              </div>
              <div className="flex items-center gap-3 text-gray-200">
                <Lock className="w-5 h-5 text-wme-gold" />
                <span>Bank-level security with 2FA protection</span>
              </div>
              <div className="flex items-center gap-3 text-gray-200">
                <Mail className="w-5 h-5 text-wme-gold" />
                <span>Real-time notifications and updates</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-8 lg:hidden">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-wme-gold rounded-lg flex items-center justify-center">
                  <Star className="w-7 h-7 text-black" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">WME</h1>
                  <p className="text-sm text-wme-gold">Client Portal</p>
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">Welcome Back</h2>
              <p className="text-gray-400">Sign in to access your account</p>
            </div>

            <Card className="bg-white/5 backdrop-blur-sm border-wme-gold/20">
              <CardHeader className="hidden lg:block">
                <CardTitle className="text-2xl text-white">Welcome Back</CardTitle>
                <CardDescription className="text-gray-400">
                  Sign in to access your WME client account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-black/20">
                    <TabsTrigger value="login" className="data-[state=active]:bg-wme-gold data-[state=active]:text-black">
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger value="register" className="data-[state=active]:bg-wme-gold data-[state=active]:text-black">
                      New Client
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login" className="space-y-4">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-200">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-black/20 border-gray-600 text-white placeholder:text-gray-400 focus:border-wme-gold"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-gray-200">Password</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-black/20 border-gray-600 text-white placeholder:text-gray-400 focus:border-wme-gold pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-wme-gold"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                          <input type="checkbox" className="accent-wme-gold" />
                          Remember me
                        </label>
                        <Link to="/forgot-password" className="text-wme-gold hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-wme-gold text-black hover:bg-wme-gold/90 font-semibold"
                        size="lg"
                      >
                        Sign In
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="register" className="space-y-4">
                    <div className="text-center py-8">
                      <h3 className="text-lg font-semibold text-white mb-3">New Client Registration</h3>
                      <p className="text-gray-400 mb-6">
                        To create a new client account, please contact your WME representative who will provide you with registration credentials and setup instructions.
                      </p>
                      <Button variant="outline" className="border-wme-gold text-wme-gold hover:bg-wme-gold hover:text-black">
                        Contact WME
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="text-center">
                  <p className="text-xs text-gray-400">
                    By signing in, you agree to our{' '}
                    <Link to="/terms" className="text-wme-gold hover:underline">Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-wme-gold hover:underline">Privacy Policy</Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                © 2024 William Morris Endeavor Entertainment. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
