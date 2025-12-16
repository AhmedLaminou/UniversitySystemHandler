import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const Privacy = () => {
  return (
    <>
      <Helmet>
        <title>Politique de Confidentialité - UniPortal</title>
        <meta
          name="description"
          content="Découvrez comment UniPortal protège vos données personnelles et votre vie privée."
        />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
        <Navbar />
        <main className="pt-24">
          <section className="container mx-auto px-4 py-10 md:py-16">
            <div className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-slate-700/80 bg-slate-900/80 p-6 text-xs md:text-sm shadow-xl backdrop-blur">
              <h1 className="text-xl md:text-2xl font-bold mb-2">Politique de Confidentialité</h1>
              <p className="text-slate-200/85">
                UniPortal collecte uniquement les données nécessaires au fonctionnement du système académique (gestion
                des comptes, inscriptions, notes, accès aux services). Les informations ne sont jamais revendues et
                restent stockées sur des infrastructures sécurisées de l&apos;université.
              </p>
              <p className="text-slate-300/85">
                Vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données
                personnelles. Pour toute demande, contactez le délégué à la protection des données via l&apos;adresse
                officielle de l&apos;établissement.
              </p>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Privacy;


