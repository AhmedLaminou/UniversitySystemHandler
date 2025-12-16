import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Mail, Lock, User, Phone, MapPin, Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useToast } from "@/components/ui/use-toast";
import { registerRequest, type RegisterRequest as RegisterRequestType } from "@/lib/api";
import heroImage from "@/assets/hero-campus.jpg";
import image1 from "@/assets/1.jpg";
import image2 from "@/assets/2.jpg";
import image3 from "@/assets/3.jpg";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await registerRequest(formData);
      toast({
        title: "Inscription réussie !",
        description: "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.",
      });
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err: any) {
      toast({
        title: "Erreur d'inscription",
        description: err?.message || "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Inscription - UniPortal</title>
        <meta name="description" content="Créez votre compte étudiant sur UniPortal pour accéder à tous les services universitaires." />
      </Helmet>

      <div className="min-h-screen flex relative overflow-hidden">
        {/* Left Side - Images Carousel with Dazzling Animation */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          {/* Dazzling Animated Background - Metallic Ribbons */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-accent/60">
            {/* Animated Metallic Ribbons */}
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
                <img src={image1} alt="Activité étudiante" className="w-full h-full object-cover" />
              </div>
              <div className="absolute top-1/2 right-10 w-48 h-32 rounded-xl overflow-hidden shadow-2xl transform -rotate-6 hover:scale-110 transition-transform duration-500 delay-200">
                <img src={image2} alt="Bâtiment" className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-20 left-1/3 w-48 h-32 rounded-xl overflow-hidden shadow-2xl transform rotate-3 hover:scale-110 transition-transform duration-500 delay-500">
                <img src={image3} alt="Étudiants" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Animated Orbs */}
            <div className="absolute top-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float delay-1000" />
          </div>

          {/* Content Overlay */}
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
                Rejoignez notre
                <span className="block mt-2 bg-gradient-to-r from-accent via-yellow-300 to-accent bg-clip-text text-transparent animate-gradient">
                  Communauté Académique
                </span>
              </h1>
              <p className="text-white/90 text-lg max-w-md leading-relaxed">
                Créez votre compte et accédez à tous les services universitaires en un seul endroit.
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-8">
                <div className="glass-card p-5 rounded-2xl border border-white/20 hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">100%</div>
                  <div className="text-white/80 text-sm mt-1">Gratuit</div>
                </div>
                <div className="glass-card p-5 rounded-2xl border border-white/20 hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">24/7</div>
                  <div className="text-white/80 text-sm mt-1">Disponible</div>
                </div>
              </div>
            </div>

            <div className="text-white/60 text-sm animate-fade-in-up delay-500">
              © 2025 UniPortal. Tous droits réservés.
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative overflow-y-auto">
          {/* Subtle Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5">
            <div className="absolute top-10 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-10 left-10 w-48 h-48 bg-accent/5 rounded-full blur-2xl animate-pulse delay-1000" />
          </div>
          
          <div className="w-full max-w-md relative z-10 animate-fade-in py-8">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8 animate-fade-in-up">
              <div className="p-2.5 rounded-xl gradient-primary animate-float">
                <GraduationCap className="h-7 w-7 text-primary-foreground" />
              </div>
              <span className="font-bold text-2xl text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                UniPortal
              </span>
            </div>

            <Card className="border-2 border-primary/20 shadow-2xl bg-card/80 backdrop-blur-xl">
              <CardHeader className="text-center pb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4 mx-auto animate-float">
                  <User className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Créer un Compte
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Remplissez le formulaire pour commencer
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-foreground font-semibold flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        Prénom
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="Jean"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="h-12 rounded-xl bg-secondary/50 border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-foreground font-semibold flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        Nom
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Dupont"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="h-12 rounded-xl bg-secondary/50 border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-foreground font-semibold flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      Nom d'utilisateur *
                    </Label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="jean.dupont"
                      value={formData.username}
                      onChange={handleChange}
                      className="h-12 rounded-xl bg-secondary/50 border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground font-semibold flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      Email *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="jean.dupont@universite.tn"
                      value={formData.email}
                      onChange={handleChange}
                      className="h-12 rounded-xl bg-secondary/50 border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-foreground font-semibold flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      Téléphone
                    </Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      placeholder="+216 XX XXX XXX"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="h-12 rounded-xl bg-secondary/50 border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-foreground font-semibold flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      Adresse
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      placeholder="Ville, Pays"
                      value={formData.address}
                      onChange={handleChange}
                      className="h-12 rounded-xl bg-secondary/50 border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground font-semibold flex items-center gap-2">
                      <Lock className="h-4 w-4 text-primary" />
                      Mot de passe *
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        className="pl-12 pr-12 h-12 rounded-xl bg-secondary/50 border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
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

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-foreground font-semibold flex items-center gap-2">
                      <Lock className="h-4 w-4 text-primary" />
                      Confirmer le mot de passe *
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-12 pr-12 h-12 rounded-xl bg-secondary/50 border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-14 gradient-primary text-lg font-semibold hover:scale-[1.02] transition-transform duration-200 shadow-lg hover:shadow-xl mt-6"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Création du compte...
                      </div>
                    ) : (
                      <>
                        Créer mon Compte
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>

              <CardFooter className="justify-center pt-6">
                <p className="text-muted-foreground text-sm">
                  Vous avez déjà un compte ?{" "}
                  <Link to="/login" className="text-primary font-semibold hover:text-primary/80 transition-colors">
                    Se connecter
                  </Link>
                </p>
              </CardFooter>
            </Card>

            <p className="text-center text-muted-foreground text-sm mt-8 animate-fade-in-up delay-300">
              <Link to="/" className="hover:text-primary transition-colors font-medium flex items-center justify-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Retour à l'accueil
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;

