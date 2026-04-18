import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import OrphansPage from "./pages/OrphansPage";
import StaffPage from "./pages/StaffPage";
import DonationsPage from "./pages/DonationsPage";
import EventsPage from "./pages/EventsPage";
import GalleryPage from "./pages/GalleryPage";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import RecoveryOtpPage from "./pages/RecoveryOtpPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AdminSetupPage from "./pages/AdminSetupPage";
import ChildEnrollmentPage from "./pages/ChildEnrollmentPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/recovery-otp" element={<RecoveryOtpPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route
              path="/orphans"
              element={<OrphansPage />}
            />
            <Route
              path="/staff"
              element={<StaffPage />}
            />
            <Route
              path="/donations"
              element={<DonationsPage />}
            />
            <Route
              path="/events"
              element={<EventsPage />}
            />
            <Route
              path="/gallery"
              element={<GalleryPage />}
            />
            <Route
              path="/announcements"
              element={(
                <ProtectedRoute>
                  <AnnouncementsPage />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/reports"
              element={(
                <ProtectedRoute>
                  <ReportsPage />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/settings"
              element={(
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/admin-setup"
              element={(
                <ProtectedRoute>
                  <AdminSetupPage />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/child-enrollment"
              element={(
                <ProtectedRoute>
                  <ChildEnrollmentPage />
                </ProtectedRoute>
              )}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
