import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet-async";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Save, Upload, Sparkles, Image as ImageIcon, Calendar, MapPin, Users, Tag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const AdminGalleryCreate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split('T')[0],
    location: "",
    category: "",
    attendees: "",
    imageUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In production, call API endpoint
      // await api.gallery.create(formData);
      
      toast({
        title: "Événement ajouté !",
        description: "L'événement a été ajouté à la galerie avec succès.",
      });
      
      setTimeout(() => {
        navigate("/dashboard/admin/gallery");
      }, 1500);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'événement.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const categories = ["Cérémonie", "Événement", "Compétition", "Conférence", "Sport", "Culture"];

  return (
    <>
      <Helmet>
        <title>Ajouter un Événement - Admin - UniPortal</title>
      </Helmet>

      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="cyber-card-glow inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm mb-3">
                <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                <span className="neon-text-purple text-xs font-bold tracking-wider">ADMIN - GALLERY</span>
              </div>
              <h1 className="text-3xl font-bold">
                <span className="glitch-text neon-text">Ajouter un Événement</span>
              </h1>
              <p className="text-muted-foreground mt-1">
                Ajoutez des photos d'événements à la galerie
              </p>
            </div>
            <Button variant="outline" asChild className="neon-border">
              <Link to="/dashboard/admin/gallery">
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
                    <span className="neon-text-purple">Détails de l'Événement</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-foreground font-semibold">
                      Titre de l'événement *
                    </Label>
                    <Input
                      id="title"
                      placeholder="Ex: Cérémonie de Remise des Diplômes 2026"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="h-14 rounded-xl neon-border-purple bg-secondary/50 border-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:shadow-lg focus:shadow-purple-500/20 text-lg"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-foreground font-semibold">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Décrivez l'événement..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="rounded-xl neon-border bg-secondary/50 border-2 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 min-h-[150px]"
                    />
                  </div>

                  {/* Grid for Date, Location, Attendees */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-foreground font-semibold flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-cyan-400" />
                        Date *
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="rounded-xl neon-border bg-secondary/50 focus:border-cyan-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-foreground font-semibold flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-purple-400" />
                        Lieu
                      </Label>
                      <Input
                        id="location"
                        placeholder="Ex: Grand Amphithéâtre"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="rounded-xl neon-border-purple bg-secondary/50 focus:border-purple-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="attendees" className="text-foreground font-semibold flex items-center gap-2">
                        <Users className="h-4 w-4 text-cyan-400" />
                        Participants
                      </Label>
                      <Input
                        id="attendees"
                        type="number"
                        placeholder="450"
                        value={formData.attendees}
                        onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                        className="rounded-xl neon-border bg-secondary/50 focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
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
                    Sélectionnez une catégorie *
                  </Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-12 rounded-xl neon-border-purple bg-secondary/50 border-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 px-4"
                    required
                  >
                    <option value="">Choisir...</option>
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

              {/* Image Upload */}
              <Card className="cyber-card-glow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-cyan-400" />
                    Photo de l'Événement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl" className="text-sm font-semibold">
                      URL de la photo *
                    </Label>
                    <Input
                      id="imageUrl"
                      type="url"
                      placeholder="https://example.com/photo.jpg"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="rounded-xl neon-border bg-secondary/50 focus:border-cyan-500"
                      required
                    />
                  </div>

                  <div className="text-center">
                    <Button type="button" variant="outline" className="w-full neon-border-purple">
                      <Upload className="h-4 w-4 mr-2" />
                      Télécharger une Image
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Formats: JPG, PNG (Max 2MB)
                    </p>
                  </div>

                  {formData.imageUrl && (
                    <div className="rounded-xl overflow-hidden neon-border">
                      <img
                        src={formData.imageUrl}
                        alt="Prévisualisation"
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.jpg";
                        }}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-14 neon-border bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold text-lg rounded-xl transition-all duration-300 hover:scale-[1.02] animate-cyber-glow"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Ajout en cours...
                  </div>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Ajouter à la Galerie
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DashboardLayout>
    </>
  );
};

export default AdminGalleryCreate;
