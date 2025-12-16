import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { Sparkles, Users, Globe2, Cpu } from "lucide-react";

const About = () => {
  return (
    <>
      <Helmet>
        <title>À propos - UniPortal</title>
        <meta
          name="description"
          content="Découvrez la vision, les valeurs et l'ADN numérique d'UniPortal, la plateforme moderne de gestion universitaire."
        />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
        <div className="fixed inset-0 -z-10 opacity-80">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),_transparent_55%),radial-gradient(circle_at_center,_rgba(129,140,248,0.14),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(52,211,153,0.12),_transparent_55%)]" />
        </div>

        <Navbar />

        <main className="pt-24">
          <section className="container mx-auto px-4 py-10 md:py-16">
            <div className="mb-10 space-y-4 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-600/60 bg-slate-900/70 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.25em] text-slate-200">
                <Sparkles className="h-3 w-3" />
                À propos
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Une faculté{" "}
                <span className="bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-200 bg-clip-text text-transparent">
                  ancrée dans le futur
                </span>
              </h1>
              <p className="mx-auto max-w-2xl text-sm md:text-base text-slate-200/85">
                UniPortal connecte les étudiants, enseignants, chercheurs et services administratifs dans un même
                espace numérique. Une expérience fluide, sécurisée et pensée pour l&apos;excellence académique.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-cyan-500/40 bg-slate-900/80 p-5 shadow-xl backdrop-blur">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500/15">
                    <Users className="h-4 w-4 text-cyan-300" />
                  </div>
                  <h2 className="text-sm font-semibold">Communauté</h2>
                </div>
                <p className="text-xs text-slate-200/80">
                  Des milliers d&apos;étudiants encadrés par une équipe pédagogique et administrative engagée, au service
                  de la réussite et de l&apos;innovation.
                </p>
              </div>

              <div className="rounded-2xl border border-violet-500/40 bg-slate-900/80 p-5 shadow-xl backdrop-blur">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500/15">
                    <Cpu className="h-4 w-4 text-violet-300" />
                  </div>
                  <h2 className="text-sm font-semibold">Plateforme intelligente</h2>
                </div>
                <p className="text-xs text-slate-200/80">
                  Un socle technique basé sur des microservices modernes, des APIs sécurisées et une interface
                  réactive, pensée pour l&apos;expérience utilisateur.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-500/40 bg-slate-900/80 p-5 shadow-xl backdrop-blur">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15">
                    <Globe2 className="h-4 w-4 text-emerald-300" />
                  </div>
                  <h2 className="text-sm font-semibold">Ouverture internationale</h2>
                </div>
                <p className="text-xs text-slate-200/80">
                  Des coopérations avec des universités partenaires, des mobilités étudiantes et des programmes
                  internationaux pour des parcours sans frontières.
                </p>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default About;


