import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { Newspaper, Sparkles, Clock, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Actualites = () => {
  const news = [
    {
      title: "Journée IA & Data Science 2025",
      tag: "Événement",
      description:
        "Conférences, workshops et stands dédiés à l'intelligence artificielle, animés par des chercheurs et industriels.",
      date: "12 Mars 2025",
    },
    {
      title: "Ouverture du FabLab quantique",
      tag: "Innovation",
      description:
        "Un nouvel espace de prototypage avancé pour les projets en robotique, IoT, VR et calcul haute performance.",
      date: "27 Février 2025",
    },
    {
      title: "Programme de bourses internationales",
      tag: "Opportunités",
      description:
        "Bourses d'excellence pour des mobilités en Europe, Amérique du Nord et Asie sur des programmes double-diplôme.",
      date: "5 Février 2025",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Actualités - UniPortal</title>
        <meta
          name="description"
          content="Suivez les actualités, événements et innovations de la faculté dans un univers numérique animé."
        />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
        <div className="fixed inset-0 -z-10 opacity-70">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_55%),radial-gradient(circle_at_center,_rgba(129,140,248,0.18),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(251,191,36,0.18),_transparent_55%)] animate-pulse" />
        </div>

        <Navbar />

        <main className="pt-24">
          <section className="container mx-auto px-4 py-10 md:py-14">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-slate-900/60 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.25em] text-amber-300/90">
                  <Sparkles className="h-3 w-3" />
                  Fil d&apos;actualités
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                  L&apos;innovation{" "}
                  <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-rose-300 bg-clip-text text-transparent">
                    en temps réel
                  </span>
                </h1>
                <p className="max-w-xl text-slate-200/80 text-sm md:text-base">
                  Restez connecté aux événements, appels à projets, colloques et annonces stratégiques de la faculté.
                </p>
              </div>
              <Button
                variant="outline"
                className="border-amber-400/60 bg-slate-900/60 text-amber-100 hover:bg-amber-500/10"
              >
                S&apos;abonner à la newsletter
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-[1.4fr,1fr]">
              <div className="space-y-4">
                {news.map((item) => (
                  <article
                    key={item.title}
                    className="group relative overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/80 p-5 shadow-xl backdrop-blur transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:border-amber-400/60"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex flex-col gap-3">
                      <div className="flex items-center justify-between gap-4">
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/50 bg-slate-900/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-200">
                          <Newspaper className="h-3 w-3" />
                          {item.tag}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <Clock className="h-3.5 w-3.5" />
                          {item.date}
                        </div>
                      </div>
                      <h2 className="text-sm md:text-base font-semibold">{item.title}</h2>
                      <p className="text-xs md:text-sm text-slate-200/80">{item.description}</p>
                      <button className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-amber-200/90 hover:text-amber-100">
                        Découvrir le programme
                        <ArrowUpRight className="h-3 w-3" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <aside className="space-y-4 rounded-2xl border border-slate-700/80 bg-slate-900/80 p-5 shadow-xl backdrop-blur">
                <h3 className="mb-2 text-sm font-semibold text-slate-50">Flux rapides</h3>
                <ul className="space-y-3 text-xs text-slate-200/90">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <div>
                      <p className="font-medium">Résultats du concours d&apos;entrée</p>
                      <p className="text-slate-400">Consultables dès maintenant sur votre espace étudiant.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    <div>
                      <p className="font-medium">Hackathon 48h - Smart Campus</p>
                      <p className="text-slate-400">Inscriptions ouvertes pour les équipes multidisciplinaires.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-rose-400" />
                    <div>
                      <p className="font-medium">Webinaire carrière &amp; AI</p>
                      <p className="text-slate-400">Animé par des alumni travaillant dans les plus grandes techs.</p>
                    </div>
                  </li>
                </ul>
              </aside>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Actualites;


