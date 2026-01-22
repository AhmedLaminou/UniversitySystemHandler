import { GraduationCap, Menu, X, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b neon-border">
      {/* Scanline effect */}
      <div className="absolute inset-0 scanline-overlay opacity-20 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between h-16">
          {/* Logo with Cyber Effect */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-xl gradient-primary group-hover:scale-110 transition-transform duration-300 relative">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
              <div className="absolute inset-0 pulse-ring bg-cyan-400/20 rounded-xl" />
            </div>
            <span className="font-bold text-xl text-foreground relative">
              <span className="neon-text">Uni</span>
              <span className="neon-text-purple">Portal</span>
              <Sparkles className="inline-block w-4 h-4 ml-1 text-cyan-400 animate-pulse" />
            </span>
          </Link>

          {/* Desktop Navigation with Neon Effects */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-foreground/80 hover:text-cyan-400 transition-colors font-medium relative group">
              Accueil
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/formations" className="text-foreground/80 hover:text-cyan-400 transition-colors font-medium relative group">
              Formations
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/gallery" className="text-foreground/80 hover:text-purple-400 transition-colors font-medium relative group">
              Galerie
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/actualites" className="text-foreground/80 hover:text-cyan-400 transition-colors font-medium relative group">
              Actualités
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/contact" className="text-foreground/80 hover:text-purple-400 transition-colors font-medium relative group">
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          {/* CTA Buttons with Cyber Styling */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" asChild className="hover:text-cyan-400 transition-colors">
              <Link to="/login">Se Connecter</Link>
            </Button>
            <Button asChild className="neon-border-purple bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 transition-all duration-300 hover:scale-105">
              <Link to="/register">S'inscrire</Link>
            </Button>
          </div>

          {/* Mobile Menu Button with Cyber Effect */}
          <button 
            className="md:hidden p-2 relative group"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="h-6 w-6 text-cyan-400" />
            ) : (
              <>
                <Menu className="h-6 w-6 text-foreground group-hover:text-cyan-400 transition-colors" />
                <div className="absolute inset-0 pulse-ring bg-cyan-400/10 rounded" />
              </>
            )}
          </button>
        </div>

        {/* Mobile Menu with Cyber Design */}
        {isOpen && (
          <div className="md:hidden py-4 border-t neon-border animate-fade-in cyber-card-glow backdrop-blur-xl">
            <div className="flex flex-col gap-4">
              <Link to="/" className="text-foreground/80 hover:text-cyan-400 transition-colors font-medium px-4 py-2 hover:bg-cyan-400/10 rounded-lg">
                Accueil
              </Link>
              <Link to="/formations" className="text-foreground/80 hover:text-cyan-400 transition-colors font-medium px-4 py-2 hover:bg-cyan-400/10 rounded-lg">
                Formations
              </Link>
              <Link to="/gallery" className="text-foreground/80 hover:text-purple-400 transition-colors font-medium px-4 py-2 hover:bg-purple-400/10 rounded-lg">
                Galerie
              </Link>
              <Link to="/actualites" className="text-foreground/80 hover:text-cyan-400 transition-colors font-medium px-4 py-2 hover:bg-cyan-400/10 rounded-lg">
                Actualités
              </Link>
              <Link to="/contact" className="text-foreground/80 hover:text-purple-400 transition-colors font-medium px-4 py-2 hover:bg-purple-400/10 rounded-lg">
                Contact
              </Link>
              <div className="flex flex-col gap-2 px-4 pt-4 border-t border-border/50">
                <Button variant="outline" asChild className="w-full neon-border">
                  <Link to="/login">Se Connecter</Link>
                </Button>
                <Button asChild className="w-full neon-border-purple bg-gradient-to-r from-purple-600 to-cyan-600">
                  <Link to="/register">S'inscrire</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
