import { AnimatedCounter } from "@/components/AnimatedCounter";
import { GraduationCap, Users, FlaskConical, Award } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: 10000,
    suffix: "+",
    label: "Étudiants",
    description: "actifs sur le campus"
  },
  {
    icon: GraduationCap,
    value: 500,
    suffix: "+",
    label: "Enseignants",
    description: "experts qualifiés"
  },
  {
    icon: FlaskConical,
    value: 50,
    suffix: "+",
    label: "Laboratoires",
    description: "de recherche"
  },
  {
    icon: Award,
    value: 95,
    suffix: "%",
    label: "Taux de Réussite",
    description: "insertion professionnelle"
  },
];

export const StatsSection = () => {
  return (
    <section className="py-20 bg-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "40px 40px"
        }} />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className="text-center animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-4">
                <stat.icon className="h-8 w-8 text-accent" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-white font-semibold mb-1">{stat.label}</div>
              <div className="text-white/60 text-sm">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
