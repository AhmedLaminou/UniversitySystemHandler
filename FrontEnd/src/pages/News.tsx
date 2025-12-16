import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { Newspaper } from "lucide-react";
import { Link } from "react-router-dom";

const News = () => {
  return (
    <>
      <Helmet>
        <title>Actualités - UniPortal</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-20 container mx-auto px-4">
          <div className="text-center mb-12">
            <Newspaper className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl font-bold mb-4">Actualités</h1>
            <p className="text-muted-foreground">Cette page redirige vers la page Actualités principale.</p>
            <Link to="/actualites" className="text-primary hover:underline mt-4 inline-block">
              Voir toutes les actualités →
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default News;

