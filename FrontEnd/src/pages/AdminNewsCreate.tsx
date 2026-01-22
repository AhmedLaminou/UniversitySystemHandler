import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet-async";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Save, Eye, Sparkles, Image as ImageIcon, Calendar, Tag } from "lucide-react";
import { Link } from "react-router-dom";

const AdminNewsCreate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    excerpt: "",
    imageUrl: "",
    publishDate: new Date().toISOString().split('T')[0],
    featured: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In production, this would call an API endpoint
      // await api.news.create(formData);
      
      toast({
        title: "Article publié !",
        description: "Votre article a été créé avec succès.",
      });
      
      setTimeout(() => {
        navigate("/dashboard/admin/news");
      }, 1500);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de publier l'article.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    "Actualités",
    "Événements",
    "Recherche",
    "Vie Étudiante",
    "Partenariats",
    "Innovation",
  ];

  return (
    <>
      <Helmet>
        <title>Créer un Article - Admin - UniPortal</title>
      </Helmet>

      <DashboardLayout>
        <div className="space-y-6">
          {/* Header with Cyber Design */}
          <div className="flex items-center justify-between">
            <div>
              <div className="cyber-card-glow inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm mb-3">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="neon-text text-xs font-bold tracking-wider">ADMIN - NEWS</span>
              </div>
              <h1 className="text-3xl font-bold">
                <span className="glitch-text neon-text-purple">Créer un Article</span>
              </h1>
              <p className="text-muted-foreground mt-1">
                Publiez de nouvelles actualités pour les étudiants
              </p>
            </div>
            <Button variant="outline" asChild className="neon-border">
              <Link to="/dashboard/admin/news">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Link>
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="cyber-card-glow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="neon-text">Contenu de l'Article</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-foreground font-semibold">
                      Titre de l'article *
                    </Label>
                    <Input
                      id="title"
                      placeholder="Ex: Nouvelle formation en Intelligence Artificielle"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="h-14 rounded-xl neon-border bg-secondary/50 border-2 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:shadow-lg focus:shadow-cyan-500/20 text-lg"
                      required
                    />
                  </div>

                  {/* Excerpt */}
                  <div className="space-y-2">
                    <Label htmlFor="excerpt" className="text-foreground font-semibold">
                      Résumé (pour la prévisualisation)
                    </Label>
                    <Textarea
                      id="excerpt"
                      placeholder="Court résumé de l'article..."
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      className="rounded-xl neon-border bg-secondary/50 border-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 min-h-[100px]"
                      maxLength={200}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.excerpt.length}/200 caractères
                    </p>
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <Label htmlFor="content" className="text-foreground font-semibold">
                      Contenu de l'article *
                    </Label>
                    <Textarea
                      id="content"
                      placeholder="Écrivez le contenu complet de votre article ici..."
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="rounded-xl neon-border bg-secondary/50 border-2 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 min-h-[300px]"
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Meta Information */}
            <div className="space-y-6">
              {/* Publish Settings */}
              <Card className="cyber-card-glow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-cyan-400" />
                    Publication
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="publishDate" className="text-sm font-semibold">
                      Date de publication
                    </Label>
                    <Input
                      id="publishDate"
                      type="date"
                      value={formData.publishDate}
                      onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                      className="rounded-xl neon-border bg-secondary/50 focus:border-purple-500"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 rounded border-cyan-500 text-cyan-600 focus:ring-cyan-500"
                    />
                    <Label htmlFor="featured" className="text-sm cursor-pointer">
                      Article à la une
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Category */}
              <Card className="cyber-card-glow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Tag className="h-5 w-5 text-purple-400" />
                    Catégorie
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-semibold">
                    Sélectionnez une catégorie
                  </Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-12 rounded-xl neon-border-purple bg-secondary/50 border-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 px-4"
                    required
                  >
                    <option value="">Choisir une catégorie</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>

                  {formData.category && (
                    <Badge className="neon-border-purple bg-gradient-to-r from-purple-600 to-cyan-600 text-white mt-2">
                      {formData.category}
                    </Badge>
                  )}
                </CardContent>
              </Card>

              {/* Featured Image */}
              <Card className="cyber-card-glow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-cyan-400" />
                    Image À la Une
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Label htmlFor="imageUrl" className="text-sm font-semibold">
                    URL de l'image
                  </Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="rounded-xl neon-border bg-secondary/50 focus:border-cyan-500"
                  />
                  
                  {formData.imageUrl && (
                    <div className="mt-4 rounded-xl overflow-hidden neon-border">
                      <img
                        src={formData.imageUrl}
                        alt="Prévisualisation"
                        className="w-full h-40 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
                        }}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full h-14 neon-border-purple bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-lg rounded-xl transition-all duration-300 hover:scale-[1.02] animate-cyber-glow"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Publication...
                    </div>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      Publier l'Article
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 neon-border"
                  onClick={() => {
                    // Preview functionality
                    toast({
                      title: "Prévisualisation",
                      description: "Fonctionnalité en développement",
                    });
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Prévisualiser
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DashboardLayout>
    </>
  );
};

export default AdminNewsCreate;
