import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./hooks/use-theme";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import Documents from "./pages/Documents";
import Messages from "./pages/Messages";
import Payments from "./pages/Payments";
import Coordinators from "./pages/Coordinators";
import PlaceholderPage from "./components/PlaceholderPage";
import NotFound from "./pages/NotFound";
import { Settings } from "lucide-react";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="wme-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/bookings" element={<Bookings />} />
            <Route path="/dashboard/documents" element={<Documents />} />
            <Route path="/dashboard/messages" element={<Messages />} />
            <Route path="/dashboard/payments" element={<Payments />} />
            <Route path="/dashboard/coordinators" element={<Coordinators />} />
            <Route
              path="/dashboard/settings"
              element={
                <PlaceholderPage
                  title="Account Settings"
                  description="Manage your account preferences, privacy settings, and notifications."
                  icon={<Settings className="w-12 h-12 text-wme-gold" />}
                />
              }
            />
            {/* Legal and support pages */}
            <Route
              path="/terms"
              element={
                <PlaceholderPage
                  title="Terms of Service"
                  description="View the WME Client Portal terms of service and usage policies."
                  backTo="/"
                />
              }
            />
            <Route
              path="/privacy"
              element={
                <PlaceholderPage
                  title="Privacy Policy"
                  description="Learn about how we protect and handle your personal information."
                  backTo="/"
                />
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PlaceholderPage
                  title="Password Reset"
                  description="Reset your password by contacting your WME coordinator."
                  backTo="/"
                />
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
