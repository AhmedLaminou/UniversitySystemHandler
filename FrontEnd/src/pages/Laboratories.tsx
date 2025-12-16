import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { FlaskConical, Microscope, Cpu, Sparkles } from "lucide-react";

const Laboratories = () => {
  const labs = [
    {
      name: "Labo IA & Data Science",
      icon: Cpu,
      description:
        "Recherche en apprentissage profond, vision par ordinateur, traitement du langage, MLOps et systèmes intelligents.",
      focus: "IA, Big Data, MLOps",
    },
    {
      name: "Labo Systèmes & Réseaux",
      icon: Microscope,
      description:
        "Cloud, edge computing, cybersécurité, 5G et réseaux programmables. Plateformes de simulation et bancs de tests.",
      focus: "Cloud, Réseaux, Sécurité",
    },
    {
      name: "Labo Physique & Matériaux",
      icon: FlaskConical,
      description:
        "Nanomatériaux, énergie renouvelable, optoélectronique et capteurs intelligents pour l'industrie et la santé.",
      focus: "Énergie, Matériaux",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Laboratoires - UniPortal</title>
        <meta
          name="description"
          content="Découvrez les laboratoires de recherche d'UniPortal, au croisement de l'innovation scientifique et technologique."
        />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
        <div className="fixed inset-0 -z-10 opacity-80">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),_transparent_55%),radial-gradient(circle_at_center,_rgba(34,197,94,0.14),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(250,204,21,0.14),_transparent_55%)]" />
        </div>

        <Navbar />

        <main className="pt-24">
          <section className="container mx-auto px-4 py-10 md:py-16">
            <div className="mb-10 space-y-4 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/60 bg-slate-900/70 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.25em] text-emerald-200">
                <Sparkles className="h-3 w-3" />
                Laboratoires
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Des espaces de{" "}
                <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-amber-200 bg-clip-text text-transparent">
                  recherche augmentée
                </span>
              </h1>
              <p className="mx-auto max-w-2xl text-sm md:text-base text-slate-200/85">
                Les laboratoires d&apos;UniPortal réunissent enseignants-chercheurs, doctorants et étudiants autour de
                projets de recherche à fort impact scientifique et sociétal.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {labs.map((lab) => (
                <div
                  key={lab.name}
                  className="group relative overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/80 p-5 shadow-xl backdrop-blur transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:border-emerald-400/60"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-cyan-500/5 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative space-y-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15">
                        <lab.icon className="h-4 w-4 text-emerald-300" />
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-200/90">Laboratoire</p>
                        <h2 className="text-sm font-semibold">{lab.name}</h2>
                      </div>
                    </div>
                    <p className="text-slate-200/85">{lab.description}</p>
                    <p className="text-[11px] text-emerald-200/90">Axes : {lab.focus}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Laboratories;


