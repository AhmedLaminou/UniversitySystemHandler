import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Inscription from "@/assets/1.jpg";
const news = [
  {
    id: 1,
    title: "Ouverture des Inscriptions pour l'Année 2025-2026",
    excerpt: "Les inscriptions pour la nouvelle année académique sont désormais ouvertes. Découvrez nos nouveaux programmes.",
    date: "15 Déc 2024",
    category: "Inscriptions",
    image: Inscription,
  },
  {
    id: 2,
    title: "Conférence Internationale sur l'IA et l'Éducation",
    excerpt: "Notre université accueille des experts mondiaux pour discuter de l'avenir de l'éducation avec l'IA.",
    date: "10 Déc 2024",
    category: "Événement",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop"
  },
  {
    id: 3,
    title: "Nouveau Partenariat avec Microsoft",
    excerpt: "Un accord stratégique pour offrir des certifications Microsoft à nos étudiants en informatique.",
    date: "5 Déc 2024",
    category: "Partenariat",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop"
  },
];

export const NewsSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 gradient-accent text-accent-foreground">Actualités</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Restez Informé
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Les dernières nouvelles et événements de notre communauté universitaire
          </p>
        </div>

        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((article, index) => (
            <Card 
              key={article.id}
              variant="elevated"
              className="group overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="backdrop-blur-sm bg-white/90">
                    {article.category}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                  <Calendar className="h-4 w-4" />
                  {article.date}
                </div>
                <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                  {article.excerpt}
                </p>
                <Link 
                  to={`/actualites/${article.id}`}
                  className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:gap-3 transition-all"
                >
                  Lire la suite <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link 
            to="/actualites"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
          >
            Voir toutes les actualités <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
