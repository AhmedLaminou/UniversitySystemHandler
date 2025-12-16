import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { Map, Home, GraduationCap, BookOpen, Newspaper, Mail, User, FileText, Building2, Briefcase, Calendar, CreditCard, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Sitemap = () => {
  const sections = [
    {
      title: "Pages Publiques",
      icon: Home,
      links: [
        { path: "/", label: "Accueil", icon: Home },
        { path: "/about", label: "À Propos", icon: FileText },
        { path: "/formations", label: "Formations", icon: GraduationCap },
        { path: "/laboratories", label: "Laboratoires", icon: Building2 },
        { path: "/actualites", label: "Actualités", icon: Newspaper },
        { path: "/contact", label: "Contact", icon: Mail },
      ],
    },
    {
      title: "Espace Étudiant",
      icon: User,
      links: [
        { path: "/login", label: "Connexion", icon: User },
        { path: "/dashboard", label: "Tableau de Bord", icon: Home },
        { path: "/dashboard/profile", label: "Mon Profil", icon: User },
        { path: "/dashboard/grades", label: "Mes Notes", icon: GraduationCap },
        { path: "/dashboard/courses", label: "Mes Cours", icon: BookOpen },
        { path: "/dashboard/schedule", label: "Emploi du Temps", icon: Calendar },
        { path: "/dashboard/billing", label: "Facturation", icon: CreditCard },
        { path: "/dashboard/jobs", label: "Emplois & Stages", icon: Briefcase },
      ],
    },
    {
      title: "Informations Légales",
      icon: FileText,
      links: [
        { path: "/legal", label: "Mentions Légales", icon: FileText },
        { path: "/privacy", label: "Politique de Confidentialité", icon: Settings },
        { path: "/sitemap", label: "Plan du Site", icon: Map },
      ],
    },
  ];

  return (
    <>
      <Helmet>
        <title>Plan du Site - UniPortal</title>
        <meta name="description" content="Plan du site UniPortal - Navigation complète de toutes les pages disponibles." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        <Navbar />
        
        <main className="relative z-10 pt-24 pb-20">
          {/* Hero Section */}
          <section className="container mx-auto px-4 mb-16">
            <div className="text-center space-y-6 animate-fade-in-up">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-primary mb-4 animate-float">
                <Map className="h-10 w-10 text-primary-foreground" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
                Plan du Site
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Explorez toutes les pages et fonctionnalités disponibles sur UniPortal
              </p>
            </div>
          </section>

          {/* Sitemap Content */}
          <section className="container mx-auto px-4 max-w-6xl">
            <div className="grid md:grid-cols-3 gap-8">
              {sections.map((section, idx) => {
                const Icon = section.icon;
                return (
                  <Card
                    key={section.title}
                    className="border-2 border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] animate-fade-in-up"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="p-2 rounded-lg gradient-primary">
                          <Icon className="h-5 w-5 text-primary-foreground" />
                        </div>
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {section.links.map((link) => {
                          const LinkIcon = link.icon;
                          return (
                            <li key={link.path}>
                              <Link
                                to={link.path}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-all duration-200 group"
                              >
                                <LinkIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                <span className="text-foreground group-hover:text-primary transition-colors">
                                  {link.label}
                                </span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Quick Actions */}
            <Card className="mt-12 border-2 border-accent/20 shadow-xl bg-gradient-to-br from-accent/5 to-transparent">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button asChild size="lg" className="gradient-primary">
                    <Link to="/login">Se Connecter</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link to="/contact">Nous Contacter</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link to="/formations">Découvrir les Formations</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Sitemap;

