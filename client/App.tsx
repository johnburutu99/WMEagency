import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./hooks/use-theme";
import Index from "./pages/Index";
import BookingForm from "./pages/BookingForm";
import EmailVerification from "./pages/EmailVerification";
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import Documents from "./pages/Documents";
import Messages from "./pages/Messages";
import Payments from "./pages/Payments";
import Coordinators from "./pages/Coordinators";
import { AdminProtectedRoute } from "./components/AdminProtectedRoute";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import AdminSettings from "./pages/AdminSettings";

import PlaceholderPage from "./components/PlaceholderPage";
import NotFound from "./pages/NotFound";
import SettingsPage from "./pages/Settings"; // Renamed to avoid conflict with lucide-react
import VerifyIdentityPage from "./pages/VerifyIdentity";

const queryClient = new QueryClient();

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="wme-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/booking" element={<BookingForm />} />
            <Route path="/verify-email" element={<EmailVerification />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <Admin />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <AdminProtectedRoute>
                  <AdminSettings />
                </AdminProtectedRoute>
              }
            />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/verify-identity" element={<VerifyIdentityPage />} />
            <Route path="/dashboard/bookings" element={<Bookings />} />
            <Route path="/dashboard/documents" element={<Documents />} />
            <Route path="/dashboard/messages" element={<Messages />} />
            <Route path="/dashboard/payments" element={<Payments />} />
            <Route path="/dashboard/coordinators" element={<Coordinators />} />
            <Route path="/dashboard/settings" element={<SettingsPage />} />
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

// Fix React 18 createRoot warning by using a module-level root
const container = document.getElementById("root")!;
let root: ReturnType<typeof createRoot> | null = null;

function renderApp() {
  if (!root) {
    root = createRoot(container);
  }
  root.render(<App />);
}

renderApp();
