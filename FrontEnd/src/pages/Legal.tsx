import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { Scale, FileText, Shield, Gavel, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Legal = () => {
  return (
    <>
      <Helmet>
        <title>Mentions Légales - UniPortal</title>
        <meta name="description" content="Mentions légales et conditions d'utilisation du portail UniPortal." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <Navbar />
        
        <main className="relative z-10 pt-24 pb-20">
          {/* Hero Section */}
          <section className="container mx-auto px-4 mb-16">
            <div className="text-center space-y-6 animate-fade-in-up">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-primary mb-4 animate-float">
                <Scale className="h-10 w-10 text-primary-foreground" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
                Mentions Légales
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Informations légales et conditions d'utilisation du portail universitaire UniPortal
              </p>
            </div>
          </section>

          {/* Content */}
          <section className="container mx-auto px-4 max-w-4xl">
            <div className="space-y-8">
              {/* Éditeur */}
              <Card className="border-2 border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <FileText className="h-6 w-6 text-primary" />
                    Éditeur du Site
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p><strong className="text-foreground">Raison sociale :</strong> Faculté des Sciences de Sfax</p>
                  <p><strong className="text-foreground">Adresse :</strong> Route de la plage, 3018 Sfax, Tunisie</p>
                  <p><strong className="text-foreground">Téléphone :</strong> +216 74 274 088</p>
                  <p><strong className="text-foreground">Email :</strong> contact@fss.rnu.tn</p>
                  <p><strong className="text-foreground">Directeur de publication :</strong> Doyen de la Faculté des Sciences</p>
                </CardContent>
              </Card>

              {/* Hébergement */}
              <Card className="border-2 border-accent/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Shield className="h-6 w-6 text-accent" />
                    Hébergement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>Le site UniPortal est hébergé par les services informatiques de l'université.</p>
                  <p><strong className="text-foreground">Infrastructure :</strong> Serveurs dédiés de l'université</p>
                  <p><strong className="text-foreground">Sécurité :</strong> Conformité RGPD et standards de sécurité universitaires</p>
                </CardContent>
              </Card>

              {/* Propriété Intellectuelle */}
              <Card className="border-2 border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Gavel className="h-6 w-6 text-primary" />
                    Propriété Intellectuelle
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>
                    L'ensemble de ce site relève de la législation tunisienne et internationale sur le droit d'auteur et la propriété intellectuelle.
                  </p>
                  <p>
                    Tous les éléments de ce site (textes, images, vidéos, logos, icônes) sont la propriété exclusive de la Faculté des Sciences de Sfax, sauf mention contraire.
                  </p>
                  <p>
                    Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans autorisation écrite préalable.
                  </p>
                </CardContent>
              </Card>

              {/* Protection des Données */}
              <Card className="border-2 border-accent/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Shield className="h-6 w-6 text-accent" />
                    Protection des Données Personnelles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>
                    Conformément à la loi tunisienne sur la protection des données personnelles, vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant.
                  </p>
                  <p>
                    Pour exercer ce droit, vous pouvez nous contacter à l'adresse : <strong className="text-foreground">contact@fss.rnu.tn</strong>
                  </p>
                  <p>
                    Les données collectées sont utilisées uniquement dans le cadre de la gestion académique et ne sont pas transmises à des tiers sans votre consentement.
                  </p>
                </CardContent>
              </Card>

              {/* Responsabilité */}
              <Card className="border-2 border-destructive/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <AlertCircle className="h-6 w-6 text-destructive" />
                    Limitation de Responsabilité
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>
                    La Faculté des Sciences de Sfax s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site, dont elle se réserve le droit de corriger, à tout moment et sans préavis, le contenu.
                  </p>
                  <p>
                    Toutefois, la Faculté ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition sur ce site.
                  </p>
                  <p>
                    En conséquence, l'utilisateur reconnaît utiliser ces informations sous sa responsabilité exclusive.
                  </p>
                </CardContent>
              </Card>

              {/* Cookies */}
              <Card className="border-2 border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <FileText className="h-6 w-6 text-primary" />
                    Cookies
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>
                    Le site UniPortal utilise des cookies techniques nécessaires au fonctionnement du site et à l'authentification des utilisateurs.
                  </p>
                  <p>
                    Ces cookies ne sont pas utilisés à des fins de publicité ou de tracking. Vous pouvez configurer votre navigateur pour refuser les cookies, mais cela peut affecter certaines fonctionnalités du site.
                  </p>
                </CardContent>
              </Card>

              {/* Contact */}
              <Card className="border-2 border-accent/20 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-accent/5 to-transparent">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <AlertCircle className="h-6 w-6 text-accent" />
                    Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>
                    Pour toute question concernant les mentions légales ou le fonctionnement du site, vous pouvez nous contacter :
                  </p>
                  <p className="text-foreground font-medium">
                    Email : contact@fss.rnu.tn<br />
                    Téléphone : +216 74 274 088
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Legal;

