import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, BookOpen, GraduationCap } from "lucide-react";

// Sample teachers data - in production, this would come from an API
const teachers = [
  {
    id: 1,
    name: "Dr. Ahmed Ben Salem",
    email: "ahmed.bensalem@university.tn",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    department: "Informatique",
    courses: ["Architecture des Ordinateurs", "Systèmes d'Exploitation"],
    title: "Professeur"
  },
  {
    id: 2,
    name: "Dr. Fatma Gharbi",
    email: "fatma.gharbi@university.tn",
    photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    department: "Informatique",
    courses: ["Génie Logiciel", "Programmation Orientée Objet"],
    title: "Maître de Conférences"
  },
  {
    id: 3,
    name: "Dr. Mohamed Trabelsi",
    email: "mohamed.trabelsi@university.tn",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    department: "Mathématiques",
    courses: ["Algèbre Linéaire", "Analyse Numérique"],
    title: "Professeur"
  },
  {
    id: 4,
    name: "Dr. Sonia Mejri",
    email: "sonia.mejri@university.tn",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    department: "Informatique",
    courses: ["Bases de Données", "Big Data"],
    title: "Maître Assistante"
  },
  {
    id: 5,
    name: "Dr. Karim Bouaziz",
    email: "karim.bouaziz@university.tn",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    department: "Réseaux",
    courses: ["Réseaux Informatiques", "Sécurité des Systèmes"],
    title: "Professeur"
  },
  {
    id: 6,
    name: "Dr. Leila Hamdi",
    email: "leila.hamdi@university.tn",
    photo: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    department: "Intelligence Artificielle",
    courses: ["Machine Learning", "Deep Learning"],
    title: "Maître de Conférences"
  },
];

export const TeachersSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 px-4 py-1">
            <GraduationCap className="w-4 h-4 mr-2" />
            Corps Enseignant
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Nos Enseignants
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Une équipe d'enseignants-chercheurs qualifiés et passionnés, 
            dédiée à l'excellence académique et à l'accompagnement des étudiants.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((teacher) => (
            <Card 
              key={teacher.id} 
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img
                      src={teacher.photo}
                      alt={teacher.name}
                      className="w-20 h-20 rounded-full object-cover ring-4 ring-primary/10 group-hover:ring-primary/30 transition-all"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-background" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-lg truncate">
                      {teacher.name}
                    </h3>
                    <p className="text-sm text-primary font-medium">
                      {teacher.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Département: {teacher.department}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Mail className="w-4 h-4 text-primary" />
                    <a 
                      href={`mailto:${teacher.email}`} 
                      className="hover:text-primary transition-colors truncate"
                    >
                      {teacher.email}
                    </a>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <BookOpen className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div className="flex flex-wrap gap-1">
                      {teacher.courses.map((course, idx) => (
                        <Badge 
                          key={idx} 
                          variant="secondary" 
                          className="text-xs"
                        >
                          {course}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <a 
            href="/teachers" 
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
          >
            Voir tous les enseignants
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
};
