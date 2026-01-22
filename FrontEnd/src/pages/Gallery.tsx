import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, MapPin, Users, Sparkles, Image as ImageIcon } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// Mock data - In production, this would come from an API
const galleryItems = [
  {
    id: 1,
    title: "Cérémonie de Remise des Diplômes 2025",
    date: "2025-12-15",
    location: "Grand Amphithéâtre",
    category: "Cérémonie",
    attendees: 450,
    image: "/src/assets/1.jpg",
    description: "Une journée mémorable célébrant la réussite de nos diplômés"
  },
  {
    id: 2,
    title: "Journée Portes Ouvertes",
    date: "2025-11-20",
    location: "Campus Principal",
    category: "Événement",
    attendees: 800,
    image: "/src/assets/2.jpg",
    description: "Découverte des formations et rencontre avec les professeurs"
  },
  {
    id: 3,
    title: "Hackathon Innovation 2025",
    date: "2025-10-10",
    location: "Lab Informatique",
    category: "Compétition",
    attendees: 120,
    image: "/src/assets/3.jpg",
    description: "48h de créativité et d'innovation technologique"
  },
  {
    id: 4,
    title: "Conférence Intelligence Artificielle",
    date: "2025-09-25",
    location: "Amphi A",
    category: "Conférence",
    attendees: 300,
    image: "/src/assets/4.jpg",
    description: "L'avenir de l'IA avec des experts internationaux"
  },
  {
    id: 5,
    title: "Tournoi Sportif Inter-Facultés",
    date: "2025-09-05",
    location: "Stade Universitaire",
    category: "Sport",
    attendees: 600,
    image: "/src/assets/5.jpg",
    description: "Compétition amicale entre toutes les facultés"
  },
  {
    id: 6,
    title: "Festival Culturel Étudiant",
    date: "2025-08-18",
    location: "Esplanade Campus",
    category: "Culture",
    attendees: 1000,
    image: "/src/assets/6.jpg",
    description: "Célébration de la diversité culturelle"
  },
];

const categories = ["Tous", "Cérémonie", "Événement", "Compétition", "Conférence", "Sport", "Culture"];

const Gallery = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  const filteredItems = galleryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Tous" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Helmet>
        <title>Galerie - UniPortal</title>
        <meta name="description" content="Découvrez les événements et moments marquants de notre université" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-24 pb-16">
          {/* Hero Section with Cyber Design */}
          <section className="relative py-20 overflow-hidden">
            {/* Cyber Background */}
            <div className="absolute inset-0 cyber-grid-bg opacity-10" />
            <div className="scanline-overlay absolute inset-0 opacity-20" />
            <div className="absolute top-20 right-20 w-96 h-96 holographic blur-3xl rounded-full opacity-20 animate-float" />
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-500/10 blur-3xl rounded-full animate-float delay-1000" />
            
            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center max-w-3xl mx-auto animate-fade-in-up">
                <div className="cyber-card-glow inline-flex items-center gap-2 px-6 py-3 rounded-full backdrop-blur-sm mb-6">
                  <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
                  <span className="neon-text text-sm font-bold tracking-wider">GALERIE ÉVÉNEMENTS</span>
                </div>
                
                <h1 className="text-5xl md:text-6xl font-bold mb-6">
                  <span className="glitch-text neon-text-purple">Nos Événements</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Revivez les moments forts et découvrez la vie dynamique de notre campus
                </p>

                {/* Search Bar with Cyber Styling */}
                <div className="relative max-w-xl mx-auto">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-cyan-500" />
                  <Input
                    type="text"
                    placeholder="Rechercher un événement..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-14 rounded-xl neon-border bg-background/50 backdrop-blur-sm border-2 border-border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:shadow-lg focus:shadow-cyan-500/20 text-lg"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Category Filter */}
          <section className="container mx-auto px-4 mb-12">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    selectedCategory === category
                      ? "neon-border-purple bg-gradient-to-r from-purple-600 to-cyan-600 text-white scale-105"
                      : "cyber-card hover:scale-105 text-foreground"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </section>

          {/* Gallery Grid */}
          <section className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => (
                <Card 
                  key={item.id} 
                  className="cyber-card-glow overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer group animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    {/* Category Badge */}
                    <Badge className="absolute top-4 right-4 neon-border-purple bg-gradient-to-r from-purple-600 to-cyan-600 text-white">
                      {item.category}
                    </Badge>

                    {/* Overlay Effect */}
                    <div className="absolute inset-0 scanline-overlay opacity-0 group-hover:opacity-30 transition-opacity" />
                  </div>

                  <CardHeader>
                    <CardTitle className="text-xl group-hover:text-cyan-400 transition-colors">
                      {item.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <p className="text-muted-foreground text-sm">
                      {item.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-3 text-sm">
                      <div className="flex items-center gap-2 text-cyan-500">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(item.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-purple-500">
                        <MapPin className="h-4 w-4" />
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-cyan-500">
                        <Users className="h-4 w-4" />
                        <span>{item.attendees} participants</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* No Results */}
            {filteredItems.length === 0 && (
              <div className="text-center py-16">
                <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Aucun événement trouvé</h3>
                <p className="text-muted-foreground">
                  Essayez de modifier vos critères de recherche
                </p>
              </div>
            )}
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Gallery;
