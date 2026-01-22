import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet-async";
import { Search, Plus, Edit, Trash2, Eye, Calendar, Tag, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data - In production, this would come from an API
const mockNews = [
  {
    id: 1,
    title: "Nouvelle Formation en Intelligence Artificielle",
    category: "Actualités",
    publishDate: "2026-01-05",
    featured: true,
    excerpt: "Lancement d'un nouveau programme de Master en IA et Machine Learning",
    imageUrl: "/src/assets/hero-campus.jpg",
    status: "published",
  },
  {
    id: 2,
    title: "Hackathon Innovation 2026",
    category: "Événements",
    publishDate: "2026-01-10",
    featured: false,
    excerpt: "Participez au plus grand hackathon universitaire de l'année",
    imageUrl: "/src/assets/1.jpg",
    status: "published",
  },
  {
    id: 3,
    title: "Partenariat avec Google",
    category: "Partenariats",
    publishDate: "2025-12-28",
    featured: true,
    excerpt: "Nouvel accord de collaboration pour la recherche en IA",
    imageUrl: "/src/assets/google.jpg",
    status: "published",
  },
];

const AdminNewsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  const categories = ["Tous", "Actualités", "Événements", "Recherche", "Vie Étudiante", "Partenariats"];

  const filteredNews = mockNews.filter((news) => {
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Tous" || news.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Helmet>
        <title>Gestion des Actualités - Admin - UniPortal</title>
      </Helmet>

      <DashboardLayout>
        <div className="space-y-6">
          {/* Header with Cyber Design */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="cyber-card-glow inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm mb-3">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="neon-text text-xs font-bold tracking-wider">ADMIN - NEWS MANAGEMENT</span>
              </div>
              <h1 className="text-3xl font-bold">
                <span className="glitch-text neon-text-purple">Gestion des Actualités</span>
              </h1>
              <p className="text-muted-foreground mt-1">
                Créez, modifiez et gérez les actualités de l'université
              </p>
            </div>
            <Button 
              asChild 
              className="neon-border-purple bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 transition-all duration-300 hover:scale-105"
            >
              <Link to="/dashboard/admin/news/create">
                <Plus className="h-5 w-5 mr-2" />
                Créer un Article
              </Link>
            </Button>
          </div>

          {/* Search & Filters */}
          <Card className="cyber-card-glow">
            <CardContent className="pt-6 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-cyan-500" />
                <Input
                  type="text"
                  placeholder="Rechercher un article..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-14 rounded-xl neon-border bg-background/50 border-2 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:shadow-lg focus:shadow-cyan-500/20"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      selectedCategory === category
                        ? "neon-border-purple bg-gradient-to-r from-purple-600 to-cyan-600 text-white scale-105"
                        : "cyber-card hover:scale-105 text-foreground"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* News List */}
          <div className="grid grid-cols-1 gap-4">
            {filteredNews.map((news) => (
              <Card key={news.id} className="cyber-card-glow hover:scale-[1.02] transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Image */}
                    {news.imageUrl && (
                      <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden neon-border flex-shrink-0">
                        <img
                          src={news.imageUrl}
                          alt={news.title}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {news.featured && (
                              <Badge className="neon-border bg-gradient-to-r from-cyan-600 to-purple-600 text-white">
                                À la Une
                              </Badge>
                            )}
                            <Badge variant="outline" className="neon-border-purple">
                              <Tag className="h-3 w-3 mr-1" />
                              {news.category}
                            </Badge>
                          </div>
                          <h3 className="text-xl font-bold text-foreground hover:text-cyan-400 transition-colors">
                            {news.title}
                          </h3>
                          <p className="text-muted-foreground text-sm mt-2">
                            {news.excerpt}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-border/50">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-cyan-400" />
                            <span>{new Date(news.publishDate).toLocaleDateString('fr-FR')}</span>
                          </div>
                          <Badge variant="outline" className="text-emerald-500 border-emerald-500/30">
                            Publié
                          </Badge>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" className="neon-border">
                            <Eye className="h-4 w-4 mr-1" />
                            Voir
                          </Button>
                          <Button size="sm" variant="outline" className="neon-border-purple">
                            <Edit className="h-4 w-4 mr-1" />
                            Modifier
                          </Button>
                          <Button size="sm" variant="destructive" className="border-2">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredNews.length === 0 && (
            <Card className="cyber-card-glow">
              <CardContent className="py-16 text-center">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full neon-border bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                    <Search className="h-8 w-8 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Aucun article trouvé</h3>
                  <p className="text-muted-foreground">
                    Essayez de modifier vos critères de recherche ou créez un nouvel article
                  </p>
                  <Button 
                    asChild 
                    className="neon-border-purple bg-gradient-to-r from-purple-600 to-cyan-600"
                  >
                    <Link to="/dashboard/admin/news/create">
                      <Plus className="h-4 w-4 mr-2" />
                      Créer un Article
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default AdminNewsList;
