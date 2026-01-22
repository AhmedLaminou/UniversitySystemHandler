import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Mail, Lock, ArrowRight, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      const from = (location.state as any)?.from?.pathname || "/dashboard";
      toast.success("Bon retour parmi nous !");
      navigate(from, { replace: true });
    } catch (err: any) {
      toast.error(err?.message || "Identifiants incorrects. Veuillez réessayer.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Connexion | UniPortal Premium</title>
      </Helmet>

      <div className="min-h-screen flex bg-[#f8fafc] dark:bg-[#020617] transition-colors duration-500 overflow-hidden">
        {/* Left Side: Visual/Marketing - Hidden on mobile */}
        <div className="hidden lg:flex w-1/2 relative bg-[#0f172a] text-white p-12 flex-col justify-between">
          {/* Animated Background Gradients */}
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px] animate-pulse-soft" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-accent/20 rounded-full blur-[120px] animate-pulse-soft delay-700" />
          
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                UniPortal
              </span>
            </Link>
          </div>

          <div className="relative z-10 space-y-8 max-w-lg">
            <h1 className="text-6xl font-extrabold leading-[1.1] tracking-tight">
              L'excellence <br /> 
              <span className="text-premium">Académique</span> <br />
              Redéfinie.
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed font-light">
              Connectez-vous pour accéder à un écosystème intelligent conçu pour propulser votre réussite universitaire.
            </p>
            
            <div className="space-y-4 pt-6">
              {[
                "Accès centralisé aux cours & ressources",
                "Suivi en temps réel de votre progression",
                "Assistant IA personnalisé pour vos études",
                "Gestion simplifiée de votre scolarité"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </div>
                  <span className="text-sm font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between text-slate-500 text-sm">
            <span>© 2026 UniPortal Corporation</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Aide</a>
              <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
          {/* Subtle patterns for the form side */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]" 
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }} />

          <div className="w-full max-w-md space-y-8 relative z-10">
            <div className="text-center lg:text-left space-y-2">
              <h2 className="text-4xl font-extrabold text-[#0f172a] dark:text-white tracking-tight">
                Bon retour !
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                Veuillez entrer vos identifiants pour continuer.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                    Adresse Email
                  </Label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                      <Mail className="h-5 w-5" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="nom@universite.tn"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-premium pl-12 h-14 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <Label htmlFor="password" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      Mot de passe
                    </Label>
                    <Link to="/forgot-password" 
                          className="text-xs font-bold text-primary hover:text-accent transition-colors">
                      Oublié ?
                    </Link>
                  </div>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                      <Lock className="h-5 w-5" />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-premium pl-12 pr-12 h-14 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:border-primary"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-1">
                <input type="checkbox" id="remember" 
                       className="rounded border-slate-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer" />
                <Label htmlFor="remember" className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer font-medium">
                  Se souvenir de moi
                </Label>
              </div>

              <Button
                type="submit"
                className="btn-premium w-full h-14 flex items-center justify-center gap-2 text-lg shadow-xl"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Connexion...
                  </div>
                ) : (
                  <>
                    Se connecter
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                <span className="bg-[#f8fafc] dark:bg-[#020617] px-4 text-slate-400">Ou continuer avec</span>
              </div>
            </div>

            <Button variant="outline" className="w-full h-14 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 font-bold transition-all duration-300">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png" 
                   className="w-5 h-5 mr-3" alt="Google" />
              S'authentifier via l'ENT
            </Button>

            <p className="text-center text-slate-500 font-medium">
              Pas encore inscrit ?{" "}
              <Link to="/register" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
