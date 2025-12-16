import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  User, 
  GraduationCap as GradeIcon, 
  CreditCard, 
  BookOpen, 
  Briefcase, 
  CalendarDays,
  LogOut, 
  Menu,
  X,
  GraduationCap,
  Bell,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Navigation items based on role
const getNavItems = (role: string | undefined) => {
  const isAdmin = role === "ADMIN";
  
  const items = [
    { icon: LayoutDashboard, label: "Tableau de Bord", path: "/dashboard", showFor: "all" },
    { icon: User, label: "Mon Profil", path: "/dashboard/profile", showFor: "all" },
    { icon: GradeIcon, label: isAdmin ? "Notes Étudiants" : "Mes Notes", path: "/dashboard/grades", showFor: "all" },
    { icon: CalendarDays, label: "Emploi du Temps", path: "/dashboard/schedule", showFor: "all" },
    { icon: CreditCard, label: isAdmin ? "Facturation Étudiants" : "Ma Facturation", path: "/dashboard/billing", showFor: "all" },
    { icon: BookOpen, label: isAdmin ? "Tous les Cours" : "Mes Cours", path: "/dashboard/courses", showFor: "all" },
    { icon: Briefcase, label: "Emplois & Stages", path: "/dashboard/jobs", showFor: "student" },
  ];
  
  return items.filter(item => item.showFor === "all" || (item.showFor === "student" && !isAdmin));
};

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          "hidden lg:flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 border-r border-sidebar-border",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-3">
            <div className="p-2 rounded-xl gradient-accent shrink-0">
              <GraduationCap className="h-6 w-6 text-sidebar" />
            </div>
            {sidebarOpen && (
              <span className="font-bold text-xl animate-fade-in">UniPortal</span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {getNavItems(user?.role).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  isActive 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg" 
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-sidebar-border space-y-2">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground w-full transition-all"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            {sidebarOpen && <span className="font-medium">{isDark ? "Mode Clair" : "Mode Sombre"}</span>}
          </button>
          
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 w-full transition-all"
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span className="font-medium">Déconnexion</span>}
          </button>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-24 -right-3 p-1.5 rounded-full bg-sidebar-accent border border-sidebar-border text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground transition-colors"
        >
          {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-sidebar animate-slide-in-right">
            <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
              <Link to="/" className="flex items-center gap-3">
                <div className="p-2 rounded-xl gradient-accent">
                  <GraduationCap className="h-6 w-6 text-sidebar" />
                </div>
                <span className="font-bold text-xl text-sidebar-foreground">UniPortal</span>
              </Link>
              <button onClick={() => setMobileOpen(false)}>
                <X className="h-6 w-6 text-sidebar-foreground" />
              </button>
            </div>

            <nav className="p-4 space-y-2">
              {getNavItems(user?.role).map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                      isActive 
                        ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="h-16 bg-card/80 backdrop-blur-xl border-b border-border px-4 lg:px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 hover:bg-muted rounded-lg"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-foreground hidden sm:block">
              {user ? `Bienvenue, ${user.firstName}` : "Espace Étudiant"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
            </button>
            
            <div className="flex items-center gap-3 pl-3 border-l border-border">
              <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                {user ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "ST" : "ST"}
              </div>
              {user && (
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-foreground">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user.role === "ADMIN" ? "Administrateur" : user.role === "PROFESSOR" ? "Enseignant" : "Étudiant"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
