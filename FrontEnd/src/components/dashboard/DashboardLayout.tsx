import { useState, useEffect } from "react";
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
  ChevronRight,
  Search,
  Settings as SettingsIcon,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const getNavItems = (role: string | undefined) => {
  const isAdmin = role === "ADMIN";
  
  return [
    { icon: LayoutDashboard, label: "Tableau de Bord", path: "/dashboard", showFor: "all" },
    { icon: User, label: "Mon Profil", path: "/dashboard/profile", showFor: "all" },
    { icon: GradeIcon, label: isAdmin ? "Notes Étudiants" : "Mes Notes", path: "/dashboard/grades", showFor: "all" },
    { icon: CalendarDays, label: "Emploi du Temps", path: "/dashboard/schedule", showFor: "all" },
    { icon: CreditCard, label: isAdmin ? "Facturation" : "Ma Facturation", path: "/dashboard/billing", showFor: "all" },
    { icon: BookOpen, label: isAdmin ? "Gestion des Cours" : "Mes Cours", path: "/dashboard/courses", showFor: "all" },
    { icon: Briefcase, label: "Carrière", path: "/dashboard/jobs", showFor: "student" },
  ].filter(item => item.showFor === "all" || (item.showFor === "student" && !isAdmin));
};

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check if user is dark mode
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] text-foreground flex transition-colors duration-500 font-['Plus_Jakarta_Sans']">
      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          "hidden lg:flex flex-col bg-[#0f172a] text-white transition-all duration-300 relative border-r border-white/5",
          sidebarOpen ? "w-72" : "w-24"
        )}
      >
        {/* Logo Section */}
        <div className="p-6 h-20 flex items-center mb-4">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            {sidebarOpen && (
              <span className="font-bold text-xl tracking-tight font-['Outfit'] animate-fade-in">
                UniPortal
              </span>
            )}
          </Link>
        </div>

        {/* Search Bar - only if open */}
        {sidebarOpen && (
          <div className="px-6 mb-8 mt-2 animate-fade-in">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {getNavItems(user?.role).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "sidebar-link group",
                  isActive 
                    ? "active" 
                    : "text-slate-400 hover:text-white"
                )}
              >
                <item.icon className={cn("h-5 w-5 shrink-0 transition-transform group-hover:scale-110", isActive && "text-white")} />
                {sidebarOpen && (
                  <span className="font-semibold text-sm tracking-wide">
                    {item.label}
                  </span>
                )}
                {!sidebarOpen && isActive && (
                   <div className="absolute left-0 w-1 h-8 bg-primary rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="p-4 mt-auto border-t border-white/5 space-y-1.5">
          <button
            onClick={toggleTheme}
            className="sidebar-link w-full text-slate-400 hover:text-white active:bg-white/5"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            {sidebarOpen && <span className="font-semibold text-sm">{isDark ? "Mode Clair" : "Mode Sombre"}</span>}
          </button>
          
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="sidebar-link w-full text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all font-bold"
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span className="text-sm">Déconnexion</span>}
          </button>
        </div>

        {/* Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-20 -right-4 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg border-4 border-[#f8fafc] dark:border-[#020617] text-white hover:scale-110 transition-all"
        >
          {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold font-['Outfit']">UniPortal</span>
        </div>
        <button onClick={() => setMobileOpen(true)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-80 bg-[#0f172a] text-white flex flex-col p-6 animate-slide-in-right">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-xl font-['Outfit']">UniPortal</span>
              </div>
              <button 
                onClick={() => setMobileOpen(false)}
                className="p-2 hover:bg-white/5 rounded-lg"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex-1 space-y-2">
              {getNavItems(user?.role).map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "sidebar-link",
                      isActive ? "active" : "text-slate-400 hover:text-white"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-bold">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            
            <div className="pt-6 border-t border-white/5 space-y-2">
              <button onClick={toggleTheme} className="sidebar-link w-full text-slate-400">
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                <span className="font-bold">{isDark ? "Mode Clair" : "Mode Sombre"}</span>
              </button>
              <button onClick={logout} className="sidebar-link w-full text-rose-400 font-bold">
                <LogOut className="h-5 w-5" />
                <span>Déconnexion</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 max-h-screen">
        {/* Top Header (Desktop) */}
        <header className="hidden lg:flex h-20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 px-10 items-center justify-between sticky top-0 z-40">
          <div className="flex-1">
            <h1 className="text-xl font-extrabold text-[#0f172a] dark:text-white tracking-tight font-['Outfit']">
              Tableau de bord <span className="text-slate-400 font-medium ml-2">/ {location.pathname.split('/').pop() || 'Overview'}</span>
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <button className="relative p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all group">
                <Bell className="h-5 w-5 text-slate-500 group-hover:text-primary" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-800" />
              </button>
               <button className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all group">
                <SettingsIcon className="h-5 w-5 text-slate-500 group-hover:text-primary" />
              </button>
            </div>

            <div className="h-8 w-[1px] bg-slate-200 dark:border-slate-800 mx-2" />

            <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/dashboard/profile')}>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-[#0f172a] dark:text-white group-hover:text-primary transition-colors">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[10px] uppercase font-extrabold text-slate-400 tracking-widest">
                  {user?.role === "ADMIN" ? "Administrateur" : user?.role === "PROFESSOR" ? "Enseignant" : "Étudiant"}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-black shadow-lg shadow-primary/10 group-hover:scale-110 transition-all duration-300">
                {user ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "ST" : "ST"}
              </div>
            </div>
          </div>
        </header>

        {/* Content Section */}
        <main className="flex-1 overflow-y-auto custom-scrollbar pt-20 lg:pt-0">
          <div className="p-6 lg:p-10 max-w-[1600px] mx-auto min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
