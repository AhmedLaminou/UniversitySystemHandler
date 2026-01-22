import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { StatsSection } from "@/components/landing/StatsSection";
import TeachersSection from "@/components/landing/TeachersSection";
import { NewsSection } from "@/components/landing/NewsSection";
import { PartnersSection } from "@/components/landing/PartnersSection";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>UniPortal - L'Excellence Académique à Portée de Main</title>
        <meta name="description" content="Votre portail universitaire moderne pour une gestion académique efficace. Accédez à vos cours, notes, et services en un seul endroit." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <HeroSection />
          <StatsSection />
          <TeachersSection />
          <NewsSection />
          <PartnersSection />
        </main>
        <Footer />
        <ThemeSwitcher />
      </div>
    </>
  );
};

export default Index;
