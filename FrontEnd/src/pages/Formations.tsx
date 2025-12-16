import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { BookOpen, GraduationCap, Sparkles, ArrowRight, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Formations = () => {
  return (
    <>
      <Helmet>
        <title>Formations - UniPortal</title>
        <meta
          name="description"
          content="Découvrez les formations Licence, Master et Doctorat proposées par UniPortal dans un univers futuriste et immersif."
        />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50 overflow-hidden">
        {/* Animated background blobs */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute -top-40 -left-32 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl animate-[float_10s_ease-in-out_infinite]" />
          <div className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl animate-[float_12s_ease-in-out_infinite_reverse]" />
          <div className="absolute bottom-0 left-1/2 h-64 w-[40rem] -translate-x-1/2 bg-gradient-to-r from-amber-500/20 via-cyan-500/10 to-violet-500/20 blur-3xl" />
        </div>

        <Navbar />

        <main className="pt-24">
          {/* Hero */}
          <section className="container mx-auto px-4 py-12 md:py-16">
            <div className="grid gap-10 md:grid-cols-[1.3fr,1fr] items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-slate-900/60 px-3 py-1 text-xs font-medium uppercase tracking-[0.25em] text-cyan-300/80 animate-[fade-in-up_0.6s_ease-out_forwards]">
                  <Sparkles className="h-3 w-3" />
                  Parcours d&apos;excellence
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">
                  Construisez votre{" "}
                  <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-emerald-300 bg-clip-text text-transparent">
                    avenir académique
                  </span>{" "}
                  dans un campus numérique
                </h1>
                <p className="max-w-xl text-slate-300/80 text-sm md:text-base">
                  Licences, Masters et Doctorats conçus pour les ingénieurs, data scientists et chercheurs de demain.
                  Une pédagogie connectée, immersive et alignée sur les standards internationaux.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button size="lg" className="gradient-primary shadow-lg shadow-cyan-500/30">
                    Explorer les Licences
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-cyan-400/60 bg-slate-900/40 text-cyan-100 hover:bg-cyan-500/10"
                  >
                    Télécharger la brochure
                  </Button>
                </div>
              </div>

              {/* Futuristic cards */}
              <div className="grid gap-4 md:gap-6">
                <div className="rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-950/80 p-5 shadow-xl shadow-cyan-500/20 backdrop-blur-xl animate-[slide-in-right_0.5s_ease-out_forwards]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/20">
                      <GraduationCap className="h-5 w-5 text-cyan-300" />
                    </div>
                    <h3 className="text-base font-semibold">Licence &amp; Pré-ingénierie</h3>
                  </div>
                  <p className="text-xs text-slate-300/80">
                    Des parcours solides en informatique, mathématiques, physique et sciences des données, avec des
                    laboratoires virtuels et des projets encadrés par des experts.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-violet-500/40 bg-slate-900/80 p-4 text-xs shadow-lg shadow-violet-500/20 backdrop-blur">
                    <div className="mb-2 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-violet-300" />
                      <span className="font-semibold">Masters spécialisés</span>
                    </div>
                    <p className="text-slate-300/80">
                      Intelligence Artificielle, Cloud, Cybersécurité, Big Data, IoT...
                    </p>
                  </div>
                  <div className="rounded-2xl border border-emerald-500/40 bg-slate-900/80 p-4 text-xs shadow-lg shadow-emerald-500/20 backdrop-blur">
                    <div className="mb-2 flex items-center gap-2">
                      <Globe2 className="h-4 w-4 text-emerald-300" />
                      <span className="font-semibold">Programmes internationaux</span>
                    </div>
                    <p className="text-slate-300/80">
                      Doubles diplômes, mobilités Erasmus+ et projets co-encadrés avec des universités partenaires.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Tracks grid */}
          <section className="container mx-auto px-4 pb-16">
            <div className="mb-8 flex items-center justify-between gap-4">
              <h2 className="text-xl md:text-2xl font-semibold text-slate-50">Parcours disponibles</h2>
              <p className="text-xs md:text-sm text-slate-400 max-w-md">
                Des cycles modulaires, flexibles et professionnalisants, articulés autour des enjeux de l&apos;industrie
                4.0 et de la recherche scientifique de haut niveau.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  title: "Licence Informatique",
                  badge: "Bac +3",
                  color: "from-cyan-500/15 to-sky-500/10",
                  desc: "Algorithmes avancés, structures de données, génie logiciel, web et mobile, bases de données, DevOps.",
                },
                {
                  title: "Master Data & IA",
                  badge: "Bac +5",
                  color: "from-violet-500/15 to-fuchsia-500/10",
                  desc: "Machine Learning, Deep Learning, MLOps, Data Engineering, traitement de la langue et des images.",
                },
                {
                  title: "Doctorat Sciences",
                  badge: "Bac +8",
                  color: "from-emerald-500/15 to-teal-500/10",
                  desc: "Thèses en IA, optimisation, systèmes distribués, cybersécurité, modélisation mathématique.",
                },
              ].map((track) => (
                <div
                  key={track.title}
                  className={`group relative overflow-hidden rounded-2xl border border-slate-700/80 bg-gradient-to-br ${track.color} p-5 shadow-xl transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl`}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_top,_rgba(248,250,252,0.08),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.08),_transparent_55%)]" />
                  <div className="relative space-y-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-slate-500/60 bg-slate-900/60 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-slate-300/80">
                      {track.badge}
                    </div>
                    <h3 className="text-sm md:text-base font-semibold">{track.title}</h3>
                    <p className="text-xs text-slate-300/80">{track.desc}</p>
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

export default Formations;


