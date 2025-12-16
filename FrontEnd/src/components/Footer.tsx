import { GraduationCap, Mail, Phone, MapPin, Facebook, Linkedin, Youtube, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Wave Decoration */}
      <div className="relative">
        <svg className="w-full h-16 text-background" viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path fill="currentColor" d="M0,0 C480,60 960,60 1440,0 L1440,60 L0,60 Z" />
        </svg>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Identity & Contact */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent">
                <GraduationCap className="h-8 w-8 text-accent-foreground" />
              </div>
              <div>
                <span className="font-bold text-xl block">UniPortal</span>
                <span className="text-primary-foreground/70 text-xs">Faculté des Sciences</span>
              </div>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Adresse:</p>
                  <p className="text-primary-foreground/80">Route de la Boulangerie</p>
                  <p className="text-primary-foreground/80">3018 Dakar, Sénégal</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-accent shrink-0" />
                <div>
                  <span className="font-medium">T:</span> +216 56 19 28 34
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-accent shrink-0" />
                <span className="text-primary-foreground/80">contact@fss.rnu.sn</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <a href="#" className="p-2 rounded bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground transition-colors" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
              Navigation Rapide
              <span className="h-0.5 w-8 bg-accent inline-block" />
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="text-primary-foreground/80 hover:text-accent transition-colors flex items-center gap-2 text-sm">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-primary-foreground/80 hover:text-accent transition-colors flex items-center gap-2 text-sm">
                  <ExternalLink className="h-3.5 w-3.5" />
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-primary-foreground/80 hover:text-accent transition-colors flex items-center gap-2 text-sm">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Actualités
                </Link>
              </li>
              <li>
                <Link to="/dashboard/jobs" className="text-primary-foreground/80 hover:text-accent transition-colors flex items-center gap-2 text-sm">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Emplois & Stages
                </Link>
              </li>
            </ul>
          </div>

          {/* Academic Resources */}
          <div>
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
              Ressources Académiques
              <span className="h-0.5 w-8 bg-accent inline-block" />
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/formations" className="text-primary-foreground/80 hover:text-accent transition-colors flex items-center gap-2 text-sm">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Formations
                </Link>
              </li>
              <li>
                <Link to="/laboratories" className="text-primary-foreground/80 hover:text-accent transition-colors flex items-center gap-2 text-sm">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Laboratoires
                </Link>
              </li>
              <li>
                <Link to="/research" className="text-primary-foreground/80 hover:text-accent transition-colors flex items-center gap-2 text-sm">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Recherche
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-accent hover:text-accent/80 transition-colors flex items-center gap-2 text-sm font-medium">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Espace Extranet
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media & Links */}
          <div>
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
              Suivez-nous
              <span className="h-0.5 w-8 bg-accent inline-block" />
            </h4>
            <div className="space-y-3">
              <a href="#" className="flex items-center gap-3 p-3 rounded-lg bg-primary-foreground/5 hover:bg-primary-foreground/10 transition-colors group">
                <Facebook className="h-6 w-6 text-accent" />
                <div>
                  <p className="font-medium text-sm group-hover:text-accent transition-colors">Facebook</p>
                  <p className="text-xs text-primary-foreground/60">@FaculteSciences</p>
                </div>
              </a>
              <a href="#" className="flex items-center gap-3 p-3 rounded-lg bg-primary-foreground/5 hover:bg-primary-foreground/10 transition-colors group">
                <Linkedin className="h-6 w-6 text-accent" />
                <div>
                  <p className="font-medium text-sm group-hover:text-accent transition-colors">LinkedIn</p>
                  <p className="text-xs text-primary-foreground/60">Faculté des Sciences</p>
                </div>
              </a>
              <a href="#" className="flex items-center gap-3 p-3 rounded-lg bg-primary-foreground/5 hover:bg-primary-foreground/10 transition-colors group">
                <Youtube className="h-6 w-6 text-accent" />
                <div>
                  <p className="font-medium text-sm group-hover:text-accent transition-colors">YouTube</p>
                  <p className="text-xs text-primary-foreground/60">Chaîne Officielle</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-primary-foreground/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © 2025 UniPortal - Faculté des Sciences de Sénagal. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="/legal" className="text-primary-foreground/60 hover:text-accent transition-colors">
              Mentions Légales
            </Link>
            <Link to="/privacy" className="text-primary-foreground/60 hover:text-accent transition-colors">
              Politique de Confidentialité
            </Link>
            <Link to="/sitemap" className="text-primary-foreground/60 hover:text-accent transition-colors">
              Plan du Site
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
