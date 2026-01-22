import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Mail, Lock, User, Phone, MapPin, Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import { registerRequest, type RegisterRequest as RegisterRequestType } from "@/lib/api";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterRequestType>({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setIsLoading(true);
    try {
      await registerRequest(formData);
      toast.success("Bienvenue chez UniPortal ! Votre compte a été créé.");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err: any) {
      toast.error(err?.message || "Une erreur est survenue lors de l'inscription.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Inscription | UniPortal Premium</title>
      </Helmet>

      <div className="min-h-screen flex bg-[#f8fafc] dark:bg-[#020617] transition-colors duration-500 overflow-hidden">
        {/* Left Side: Visual/Marketing - Hidden on mobile */}
        <div className="hidden lg:flex w-1/2 relative bg-[#0f172a] text-white p-12 flex-col justify-between">
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
              Rejoignez <br /> 
              <span className="text-premium">L'Elite</span> <br />
              Universitaire.
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed font-light">
              Créez votre profil en quelques minutes et accédez immédiatement à un univers de connaissances et d'outils performants.
            </p>
            
            <div className="space-x-4 flex pt-6">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-3xl flex-1 hover-glow">
                <div className="text-3xl font-bold text-premium">100%</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">Numérique</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-3xl flex-1 hover-glow">
                <div className="text-3xl font-bold text-emerald-500">Fast</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">Inscription</div>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-slate-500 text-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Systèmes opérationnels et sécurisés</span>
          </div>
        </div>

        {/* Right Side: Register Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative overflow-y-auto custom-scrollbar">
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]" 
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }} />

          <div className="w-full max-w-lg space-y-8 relative z-10 py-12">
            <div className="text-center lg:text-left space-y-2">
              <h2 className="text-4xl font-extrabold text-[#0f172a] dark:text-white tracking-tight">
                Créer un compte
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                Rejoignez 5000+ étudiants et enseignants déjà inscrits.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-bold ml-1">Prénom</Label>
                  <Input name="firstName" value={formData.firstName} onChange={handleChange}
                         className="input-premium h-14" placeholder="Jean" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold ml-1">Nom</Label>
                  <Input name="lastName" value={formData.lastName} onChange={handleChange}
                         className="input-premium h-14" placeholder="Dupont" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold ml-1">Nom d'utilisateur *</Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary" />
                  <Input name="username" value={formData.username} onChange={handleChange} required
                         className="input-premium pl-12 h-14" placeholder="j.dupont" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold ml-1">Email académique *</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary" />
                  <Input name="email" type="email" value={formData.email} onChange={handleChange} required
                         className="input-premium pl-12 h-14" placeholder="jean.dupont@universite.tn" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-bold ml-1">Mot de passe *</Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary" />
                    <Input name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} required
                           className="input-premium pl-12 h-14" placeholder="••••••••" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary">
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold ml-1">Confirmer *</Label>
                  <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                         className="input-premium h-14" placeholder="••••••••" />
                </div>
              </div>

              <div className="flex items-start space-x-2 ml-1">
                <input type="checkbox" id="terms" required
                       className="mt-1 rounded border-slate-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer" />
                <Label htmlFor="terms" className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer font-medium leading-tight">
                  J'accepte les <a href="#" className="text-primary hover:underline">Conditions d'utilisation</a> et la <a href="#" className="text-primary hover:underline">Politique de confidentialité</a>.
                </Label>
              </div>

              <Button
                type="submit"
                className="btn-premium w-full h-14 flex items-center justify-center gap-2 text-lg shadow-xl"
                disabled={isLoading}
              >
                {isLoading ? "Création du profil..." : "S'inscrire maintenant"}
                {!isLoading && <ArrowRight className="h-5 w-5" />}
              </Button>
            </form>

            <p className="text-center text-slate-500 font-medium">
              Déjà un compte ?{" "}
              <Link to="/login" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">
                Se connecter
              </Link>
            </p>

            <div className="pt-8 text-center child:inline">
              <Link to="/" className="text-slate-400 hover:text-primary transition-colors text-sm font-bold flex items-center justify-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
