import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PortfolioProvider } from "@/contexts/PortfolioContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import ProjectDetails from "./pages/ProjectDetails";
import AdminLayout from "./components/admin/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import UserLayout from "./components/user/UserLayout";
import UserLogin from "./pages/user/UserLogin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <PortfolioProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/project/:id" element={<ProjectDetails />} />
              
              {/* Admin Login (public) */}
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Admin Routes (protected) - using wildcard to avoid conflict */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute type="admin">
                    <AdminLayout />
                  </ProtectedRoute>
                }
              />

              {/* User Login (public) */}
              <Route path="/user/login" element={<UserLogin />} />

              {/* User Routes (protected) - using wildcard to avoid conflict */}
              <Route
                path="/user/*"
                element={
                  <ProtectedRoute type="user">
                    <UserLayout />
                  </ProtectedRoute>
                }
              />
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </PortfolioProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
