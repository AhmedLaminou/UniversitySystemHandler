import { GraduationCap, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 rounded-xl gradient-primary">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">UniPortal</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors font-medium">
              Accueil
            </Link>
            <Link to="/formations" className="text-foreground/80 hover:text-foreground transition-colors font-medium">
              Formations
            </Link>
            <Link to="/actualites" className="text-foreground/80 hover:text-foreground transition-colors font-medium">
              Actualités
            </Link>
            <Link to="/contact" className="text-foreground/80 hover:text-foreground transition-colors font-medium">
              Contact
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Se Connecter</Link>
            </Button>
            <Button asChild>
              <Link to="/register">S'inscrire</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors font-medium px-4 py-2">
                Accueil
              </Link>
              <Link to="/formations" className="text-foreground/80 hover:text-foreground transition-colors font-medium px-4 py-2">
                Formations
              </Link>
              <Link to="/actualites" className="text-foreground/80 hover:text-foreground transition-colors font-medium px-4 py-2">
                Actualités
              </Link>
              <Link to="/contact" className="text-foreground/80 hover:text-foreground transition-colors font-medium px-4 py-2">
                Contact
              </Link>
              <div className="flex flex-col gap-2 px-4 pt-4 border-t border-border">
                <Button variant="outline" asChild className="w-full">
                  <Link to="/login">Se Connecter</Link>
                </Button>
                <Button asChild className="w-full">
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
