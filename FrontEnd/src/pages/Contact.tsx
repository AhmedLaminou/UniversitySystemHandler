import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { Mail, Phone, MapPin, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Contact = () => {
  return (
    <>
      <Helmet>
        <title>Contact - UniPortal</title>
        <meta
          name="description"
          content="Contactez l'équipe pédagogique et administrative d'UniPortal via un espace de contact futuriste."
        />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(129,140,248,0.12),_transparent_60%)]" />
        </div>

        <Navbar />

        <main className="pt-24">
          <section className="container mx-auto px-4 py-10 md:py-16">
            <div className="grid gap-10 md:grid-cols-[1.1fr,0.9fr] items-stretch">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-slate-900/70 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.25em] text-cyan-200">
                  <Sparkles className="h-3 w-3" />
                  Contact
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                  Parlons de{" "}
                  <span className="bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-200 bg-clip-text text-transparent">
                    votre projet académique
                  </span>
                </h1>
                <p className="max-w-xl text-sm md:text-base text-slate-200/80">
                  Une question sur les inscriptions, les formations, les mobilités internationales ou les services
                  numériques ? Envoyez-nous un message, l&apos;équipe vous répondra dans les plus brefs délais.
                </p>

                <form className="space-y-4 rounded-2xl border border-slate-700/80 bg-slate-900/80 p-5 shadow-xl backdrop-blur">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5 text-xs">
                      <label htmlFor="name" className="font-medium text-slate-100">
                        Nom complet
                      </label>
                      <Input
                        id="name"
                        placeholder="Votre nom et prénom"
                        className="h-10 border-slate-700 bg-slate-950/60 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <label htmlFor="email" className="font-medium text-slate-100">
                        Adresse email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="vous@universite.tn"
                        className="h-10 border-slate-700 bg-slate-950/60 text-xs"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <label htmlFor="subject" className="font-medium text-slate-100">
                      Sujet
                    </label>
                    <Input
                      id="subject"
                      placeholder="Objet de votre demande"
                      className="h-10 border-slate-700 bg-slate-950/60 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <label htmlFor="message" className="font-medium text-slate-100">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      rows={5}
                      placeholder="Expliquez-nous comment nous pouvons vous aider..."
                      className="border-slate-700 bg-slate-950/60 text-xs resize-none"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-[11px] text-slate-400">
                      En envoyant ce message, vous acceptez que l&apos;équipe UniPortal vous contacte par email.
                    </p>
                    <Button
                      type="submit"
                      className="gradient-primary shadow-lg shadow-cyan-500/30 text-xs md:text-sm"
                    >
                      Envoyer
                      <Send className="ml-2 h-3.5 w-3.5" />
                    </Button>
                  </div>
                </form>
              </div>

              <aside className="space-y-4 rounded-2xl border border-slate-700/80 bg-slate-900/80 p-5 shadow-xl backdrop-blur">
                <h2 className="mb-2 text-sm font-semibold text-slate-50">Coordonnées</h2>
                <div className="space-y-3 text-xs text-slate-200/90">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/15">
                      <MapPin className="h-4 w-4 text-cyan-300" />
                    </div>
                    <div>
                      <p className="font-medium">Campus UniPortal</p>
                      <p className="text-slate-400">Route de la plage, 3018 Sfax, Tunisie</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15">
                      <Phone className="h-4 w-4 text-emerald-300" />
                    </div>
                    <div>
                      <p className="font-medium">Standard</p>
                      <p className="text-slate-400">+216 74 274 088</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/15">
                      <Mail className="h-4 w-4 text-amber-300" />
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-slate-400">contact@fss.rnu.tn</p>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Contact;


