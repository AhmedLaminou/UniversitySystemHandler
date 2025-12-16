import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { FlaskConical } from "lucide-react";
import { Link } from "react-router-dom";

const Research = () => {
  return (
    <>
      <Helmet>
        <title>Recherche - UniPortal</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-20 container mx-auto px-4">
          <div className="text-center mb-12">
            <FlaskConical className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl font-bold mb-4">Recherche</h1>
            <p className="text-muted-foreground">Découvrez nos laboratoires et projets de recherche.</p>
            <Link to="/laboratories" className="text-primary hover:underline mt-4 inline-block">
              Voir les laboratoires →
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Research;

