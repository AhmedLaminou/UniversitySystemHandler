import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import heroImage from "@/assets/hero-campus.jpg";
import image4 from "@/assets/4.jpg";
import image5 from "@/assets/5.jpg";
import image6 from "@/assets/6.jpg";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      const from = (location.state as any)?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    } catch (err: any) {
      toast({
        title: "Échec de la connexion",
        description: err?.message || "Vérifiez vos identifiants et réessayez.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Connexion - UniPortal</title>
        <meta name="description" content="Connectez-vous à votre espace étudiant UniPortal pour accéder à vos cours, notes et services universitaires." />
      </Helmet>

      <div className="min-h-screen flex relative overflow-hidden">
        {/* Animated Background - Left Side */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          {/* Animated Gradient Background with Dazzling Ribbons */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-accent/60">
            {/* Dazzling Animated Metallic Ribbons */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/4 left-0 w-full h-32 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-y-12 animate-ribbon-1" />
              <div className="absolute top-1/2 left-0 w-full h-32 bg-gradient-to-r from-transparent via-white/15 to-transparent transform skew-y-12 animate-ribbon-2" />
              <div className="absolute bottom-1/4 left-0 w-full h-32 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-y-12 animate-ribbon-3" />
            </div>
            
            {/* Overlay Images */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-black/40" />
              <img
                src={heroImage}
                alt="Campus"
                className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
              />
              <div className="absolute top-10 left-10 w-48 h-32 rounded-xl overflow-hidden shadow-2xl transform rotate-6 hover:scale-110 transition-transform duration-500">
                <img src={image4} alt="Activité étudiante" className="w-full h-full object-cover" />
              </div>
              <div className="absolute top-1/2 right-10 w-48 h-32 rounded-xl overflow-hidden shadow-2xl transform -rotate-6 hover:scale-110 transition-transform duration-500 delay-200">
                <img src={image5} alt="Bâtiment" className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-20 left-1/3 w-48 h-32 rounded-xl overflow-hidden shadow-2xl transform rotate-3 hover:scale-110 transition-transform duration-500 delay-500">
                <img src={image6} alt="Étudiants" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
          
          {/* Animated Orbs */}
          <div className="absolute top-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float delay-1000" />
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-accent/40 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-pulse delay-500" />
          
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
          
          {/* Animated Particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/30 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-between p-12 text-white">
            <div className="animate-fade-in-up">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="p-2.5 rounded-xl gradient-accent group-hover:scale-110 transition-transform duration-300 animate-float">
                  <GraduationCap className="h-7 w-7 text-primary" />
                </div>
                <span className="font-bold text-2xl bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  UniPortal
                </span>
              </Link>
            </div>
            
            <div className="space-y-6 animate-fade-in-up delay-200">
              <h1 className="text-5xl font-bold leading-tight">
                Bienvenue dans votre
                <span className="block mt-2 bg-gradient-to-r from-accent via-yellow-300 to-accent bg-clip-text text-transparent animate-gradient">
                  Espace Académique
                </span>
              </h1>
              <p className="text-white/90 text-lg max-w-md leading-relaxed">
                Accédez à vos cours, consultez vos notes, gérez votre parcours académique et bien plus encore.
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-8">
                <div className="glass-card p-5 rounded-2xl border border-white/20 hover:scale-105 transition-transform duration-300 hover:shadow-2xl">
                  <div className="text-3xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">24/7</div>
                  <div className="text-white/80 text-sm mt-1">Accès continu</div>
                </div>
                <div className="glass-card p-5 rounded-2xl border border-white/20 hover:scale-105 transition-transform duration-300 hover:shadow-2xl">
                  <div className="text-3xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">100%</div>
                  <div className="text-white/80 text-sm mt-1">Sécurisé</div>
                </div>
              </div>
            </div>

            <div className="text-white/60 text-sm animate-fade-in-up delay-500">
              © 2025 UniPortal. Tous droits réservés.
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
          {/* Animated Background - Right Side */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5">
            {/* Subtle animated orbs */}
            <div className="absolute top-10 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-10 left-10 w-48 h-48 bg-accent/5 rounded-full blur-2xl animate-pulse delay-1000" />
          </div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[size:2rem_2rem]" />

          <div className="w-full max-w-md relative z-10 animate-fade-in">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8 animate-fade-in-up">
              <div className="p-2.5 rounded-xl gradient-primary animate-float">
                <GraduationCap className="h-7 w-7 text-primary-foreground" />
              </div>
              <span className="font-bold text-2xl text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                UniPortal
              </span>
            </div>

            <Card className="border-2 border-primary/20 shadow-2xl bg-card/80 backdrop-blur-xl hover:shadow-primary/20 transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4 mx-auto animate-float">
                  <Lock className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Connexion
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Entrez vos identifiants pour accéder à votre espace
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground font-semibold flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      Adresse Email
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="prenom.nom@universite.tn"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-12 h-14 rounded-xl bg-secondary/50 border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-foreground font-semibold flex items-center gap-2">
                        <Lock className="h-4 w-4 text-primary" />
                        Mot de Passe
                      </Label>
                      <Link to="/forgot-password" className="text-sm text-primary hover:text-primary/80 transition-colors font-medium">
                        Mot de passe oublié ?
                      </Link>
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-12 pr-12 h-14 rounded-xl bg-secondary/50 border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-14 gradient-primary text-lg font-semibold hover:scale-[1.02] transition-transform duration-200 shadow-lg hover:shadow-xl"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Connexion en cours...
                      </div>
                    ) : (
                      <>
                        Se Connecter
                        <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-card text-muted-foreground font-medium">ou</span>
                  </div>
                </div>

                <Button variant="outline" size="lg" className="w-full h-14 border-2 hover:bg-secondary/50 transition-all duration-200">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/24px-Google_%22G%22_Logo.svg.png" alt="Google" className="w-5 h-5 mr-2" />
                  Connexion avec ENT
                </Button>
              </CardContent>

              <CardFooter className="justify-center pt-6">
                <p className="text-muted-foreground text-sm">
                  Pas encore de compte ?{" "}
                  <Link to="/register" className="text-primary font-semibold hover:text-primary/80 transition-colors">
                    Créer un compte
                  </Link>
                </p>
              </CardFooter>
            </Card>

            <p className="text-center text-muted-foreground text-sm mt-8 animate-fade-in-up delay-300">
              <Link to="/" className="hover:text-primary transition-colors font-medium flex items-center justify-center gap-2">
                <span>←</span> Retour à l'accueil
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
