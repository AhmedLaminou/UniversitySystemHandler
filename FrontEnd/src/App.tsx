import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Grades from "./pages/Grades";
import Schedule from "./pages/Schedule";
import Billing from "./pages/Billing";
import Courses from "./pages/Courses";
import Jobs from "./pages/Jobs";
import NotFound from "./pages/NotFound";
import { RequireAuth } from "./components/RequireAuth";
import { AuthProvider } from "./hooks/useAuth";
import Formations from "./pages/Formations";
import Actualites from "./pages/Actualites";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Laboratories from "./pages/Laboratories";
import Privacy from "./pages/Privacy";
import Sitemap from "./pages/Sitemap";
import Legal from "./pages/Legal";
import News from "./pages/News";
import Research from "./pages/Research";
import Teachers from "./pages/Teachers";
import StudentExtranet from "./pages/StudentExtranet";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Landing & public pages */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/formations" element={<Formations />} />
              <Route path="/actualites" element={<Actualites />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/laboratories" element={<Laboratories />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/sitemap" element={<Sitemap />} />
              <Route path="/legal" element={<Legal />} />
              {/* Aliases used in footer */}
              <Route path="/news" element={<News />} />
              <Route path="/research" element={<Research />} />
              {/* Teachers - PUBLIC (no auth required) */}
              <Route path="/teachers" element={<Teachers />} />
              <Route path="/enseignants" element={<Teachers />} />

              {/* Authenticated dashboard */}
              <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/dashboard/profile"
              element={
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              }
            />
            <Route
              path="/dashboard/grades"
              element={
                <RequireAuth>
                  <Grades />
                </RequireAuth>
              }
            />
            <Route
              path="/dashboard/schedule"
              element={
                <RequireAuth>
                  <Schedule />
                </RequireAuth>
              }
            />
            <Route
              path="/dashboard/billing"
              element={
                <RequireAuth>
                  <Billing />
                </RequireAuth>
              }
            />
            <Route
              path="/dashboard/courses"
              element={
                <RequireAuth>
                  <Courses />
                </RequireAuth>
              }
            />
            <Route
              path="/dashboard/jobs"
              element={
                <RequireAuth>
                  <Jobs />
                </RequireAuth>
              }
            />
            <Route
              path="/dashboard/extranet"
              element={
                <RequireAuth>
                  <StudentExtranet />
                </RequireAuth>
              }
            />
            <Route
              path="/extranet"
              element={
                <RequireAuth>
                  <StudentExtranet />
                </RequireAuth>
              }
            />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
