import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroCampus from "@/assets/hero-campus.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroCampus} 
          alt="Campus universitaire" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 gradient-hero opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Animated Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-white/90 text-sm font-medium">Rentrée 2026 - Inscriptions Ouvertes</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in-up animation-delay-100">
            L'Excellence Académique{" "}
            <span className="text-gradient">à Portée de Main</span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            Découvrez une plateforme universitaire moderne qui simplifie votre parcours académique et ouvre les portes de votre avenir professionnel.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-300">
            <Button size="xl" variant="hero" asChild>
              <Link to="/login" className="group">
                Espace Étudiant
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="xl" variant="heroOutline" asChild>
              <Link to="/formations">
                <BookOpen className="h-5 w-5" />
                Découvrir nos Formations
              </Link>
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-white/60 animate-fade-in-up animation-delay-400">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-accent font-bold">A+</span>
              </div>
              <span className="text-sm">Accréditation Internationale</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-accent font-bold">#1</span>
              </div>
              <span className="text-sm">Top Université en Sénégal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <div className="w-1 h-3 rounded-full bg-white/60 animate-pulse" />
        </div>
      </div>
    </section>
  );
};
