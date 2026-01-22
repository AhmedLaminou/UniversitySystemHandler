import { ArrowRight, BookOpen, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroCampus from "@/assets/hero-campus.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Cyber Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroCampus} 
          alt="Campus universitaire" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/10" />
      </div>

      {/* Cyber Grid Background */}
      <div className="absolute inset-0 cyber-grid-bg opacity-30" />
      
      {/* Scanline Overlay */}
      <div className="scanline-overlay absolute inset-0" />

      {/* Animated Holographic Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 holographic blur-3xl rounded-full opacity-40 animate-float" />
        <div className="absolute bottom-40 right-10 w-[500px] h-[500px] holographic blur-3xl rounded-full opacity-30 animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-2xl rounded-full animate-pulse" />
      </div>

      {/* Floating Cyber Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-data-stream"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 20}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 3}s`,
              boxShadow: '0 0 10px hsl(var(--cyber-cyan))',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Cyber Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full neon-border bg-background/40 backdrop-blur-md mb-8 animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="neon-text text-sm font-bold tracking-wider">RENTRÉE 2026 - INSCRIPTIONS OUVERTES</span>
            <div className="pulse-ring bg-cyan-400/20" />
          </div>

          {/* Main Heading with Glitch Effect */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-foreground mb-6 leading-tight animate-fade-in-up animation-delay-100">
            L'Excellence Académique{" "}
            <span className="relative inline-block">
              <span className="glitch-text neon-text">à Portée de Main</span>
              <span className="absolute inset-0 glitch-text neon-text-purple opacity-50 mix-blend-screen" style={{ transform: 'translate(2px, 2px)' }}>
                à Portée de Main
              </span>
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            Découvrez une plateforme universitaire{" "}
            <span className="text-cyan-400 font-semibold">ultra-moderne</span>{" "}
            qui simplifie votre parcours académique et ouvre les portes de votre avenir professionnel.
          </p>

          {/* CTA Buttons with Neon Effects */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-300">
            <Button 
              size="lg" 
              asChild 
              className="group relative overflow-hidden neon-border-purple bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold px-8 py-6 text-lg rounded-xl transition-all duration-300 hover:scale-105 animate-cyber-glow"
            >
              <Link to="/login">
                <Zap className="w-5 h-5 mr-2 animate-pulse" />
                Espace Étudiant
                <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              asChild
              className="group neon-border backdrop-blur-sm bg-background/40 hover:bg-background/60 font-semibold px-8 py-6 text-lg rounded-xl transition-all duration-300"
            >
              <Link to="/formations">
                <BookOpen className="h-5 w-5 mr-2" />
                Découvrir nos Formations
              </Link>
            </Button>
          </div>

          {/* Trust Badges with Cyber Style */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 animate-fade-in-up animation-delay-400">
            <div className="cyber-card-glow flex items-center gap-3 px-6 py-3 rounded-xl backdrop-blur-sm">
              <div className="w-12 h-12 rounded-full neon-border bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                <span className="neon-text font-extrabold text-lg">A+</span>
              </div>
              <span className="text-sm font-semibold text-foreground">Accréditation<br/>Internationale</span>
            </div>
            <div className="cyber-card-glow flex items-center gap-3 px-6 py-3 rounded-xl backdrop-blur-sm">
              <div className="w-12 h-12 rounded-full neon-border-purple bg-gradient-to-br from-purple-500/20 to-magenta-500/20 flex items-center justify-center">
                <span className="neon-text-purple font-extrabold text-lg">#1</span>
              </div>
              <span className="text-sm font-semibold text-foreground">Top Université<br/>au Sénégal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full neon-border flex items-start justify-center p-2">
          <div className="w-1.5 h-3 rounded-full bg-cyan-400 animate-pulse" style={{ boxShadow: '0 0 10px hsl(var(--cyber-cyan))' }} />
        </div>
      </div>
    </section>
  );
};
