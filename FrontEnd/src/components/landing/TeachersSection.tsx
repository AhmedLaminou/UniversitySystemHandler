import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, BookOpen, GraduationCap, Award } from "lucide-react";
import senghorImg from "@/assets/senghor.jpg";
import cesaireImg from "@/assets/cesaire.avif";
import femmeEnseignanteImg from "@/assets/femme_enseignante.jpg";
import femmeDeuxImg from "@/assets/femme_deux.jpeg";
import recteurImg from "@/assets/recteur.jpg";
import adamTidjaniImg from "@/assets/AdamTidjani.jpg";

const teachers = [
  {
    id: 1,
    name: "Dr. Ahmed Ben Salem",
    email: "ahmed.bensalem@university.tn",
    photo: recteurImg,
    department: "Génie Informatique",
    courses: ["Architecture des Ordinateurs", "Systèmes Distribués"],
    specialty: "PhD. Hardware Security"
  },
  {
    id: 2,
    name: "Dr. Fatma Gharbi",
    email: "fatma.gharbi@university.tn",
    photo: femmeEnseignanteImg, 
    department: "Génie Logiciel",
    courses: ["Développement Web", "DevOps"],
    specialty: "PhD. Software Engineering"
  },
  {
    id: 3,
    name: "Dr. Mohamed Diop",
    email: "mohamed.diop@university.sn",
    photo: adamTidjaniImg,
    department: "Mathématiques",
    courses: ["Algèbre Linéaire", "Analyse Numérique"],
    specialty: "PhD. Applied Mathematics"
  },
  {
    id: 4,
    name: "Dr. Sonia Jallé",
    email: "sonia.jalle@university.sn",
    photo: femmeDeuxImg,
    department: "Informatique",
    courses: ["Bases de Données", "Big Data"],
    specialty: "PhD. Data Science"
  },
  {
    id: 5,
    name: "Dr. Karim Sanogo",
    email: "karim.sanogo@university.sn",
    photo: senghorImg,
    department: "Réseaux",
    courses: ["Réseaux Informatiques", "Sécurité des Systèmes"],
    specialty: "PhD. Network Security"
  },
  {
    id: 6,
    name: "Dr. Aicha Diangaré",
    email: "aicha.diangare@university.sn",
    photo: cesaireImg, 
    department: "Intelligence Artificielle",
    courses: ["Machine Learning", "Deep Learning"],
    specialty: "PhD. Artificial Intelligence"
  },
];

const TeachersSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 -skew-y-3 transform origin-top-left scale-110" />
      
      <div className="container relative z-10 mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="outline" className="px-4 py-1.5 text-sm font-semibold border-primary/20 bg-primary/5 text-primary rounded-full">
            <Award className="w-4 h-4 mr-2" />
            Excellence Académique
          </Badge>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Nos Enseignants Chercheurs
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Une équipe pédagogique d'élite, composée d'experts internationaux et de chercheurs passionnés, dédiée à votre réussite.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teachers.map((teacher) => (
            <Card key={teacher.id} className="group overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-300 bg-card/50 backdrop-blur-sm">
              <CardHeader className="p-0 relative aspect-[4/3] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                <img 
                  src={teacher.photo} 
                  alt={teacher.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute bottom-4 left-4 right-4 z-20 text-white">
                  <Badge className="bg-primary hover:bg-primary/90 text-white border-none mb-2">
                    {teacher.department}
                  </Badge>
                  <CardTitle className="text-xl font-bold leading-tight">
                    {teacher.name}
                  </CardTitle>
                  <p className="text-sm text-white/80 font-medium">
                    {teacher.specialty}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    Enseignements
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {teacher.courses.map((course, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-secondary/50 hover:bg-secondary">
                        {course}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 p-0 font-semibold">
                    Voir Profil <GraduationCap className="w-4 h-4 ml-2" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary rounded-full hover:bg-primary/10">
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeachersSection;
