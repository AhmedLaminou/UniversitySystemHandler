import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  GraduationCap,
  Building2,
  RefreshCw,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { fetchTeachers, Teacher } from "@/lib/api";
import { useState, useMemo } from "react";
import { SkeletonLoader } from "@/components/SkeletonLoader";

// Fallback data when API is unavailable
const fallbackTeachers: Teacher[] = [
  {
    id: "1",
    firstName: "Ghada",
    lastName: "Feki",
    email: "ghada.feki@fss.rnu.tn",
    phone: "+216 74 274 100",
    office: "Bureau 312, Bloc A",
    department: "Informatique",
    title: "Maître de Conférences",
    specialization: "Architecture des Ordinateurs",
  },
  {
    id: "2",
    firstName: "Karim",
    lastName: "Mansour",
    email: "karim.mansour@fss.rnu.tn",
    phone: "+216 74 274 101",
    office: "Bureau 215, Bloc B",
    department: "Informatique",
    title: "Professeur",
    specialization: "Génie Logiciel",
  },
  {
    id: "3",
    firstName: "Sonia",
    lastName: "Mekni",
    email: "sonia.mekni@fss.rnu.tn",
    phone: "+216 74 274 103",
    office: "Bureau 118, Bloc C",
    department: "Informatique",
    title: "Maître Assistante",
    specialization: "Bases de Données",
  },
  {
    id: "4",
    firstName: "Sami",
    lastName: "Trabelsi",
    email: "sami.trabelsi@fss.rnu.tn",
    phone: "+216 74 274 104",
    office: "Bureau 420, Bloc D",
    department: "Informatique",
    title: "Professeur",
    specialization: "Réseaux Informatiques",
  },
  {
    id: "5",
    firstName: "Yassine",
    lastName: "Ben Salah",
    email: "yassine.bensalah@fss.rnu.tn",
    phone: "+216 74 274 105",
    office: "Bureau 322, Bloc A",
    department: "Informatique",
    title: "Maître de Conférences",
    specialization: "Développement Web",
  },
  {
    id: "6",
    firstName: "Amira",
    lastName: "Chaabane",
    email: "amira.chaabane@fss.rnu.tn",
    phone: "+216 74 274 106",
    office: "Bureau 225, Bloc B",
    department: "Informatique",
    title: "Professeure",
    specialization: "Intelligence Artificielle",
  },
  {
    id: "7",
    firstName: "Mohamed",
    lastName: "Bouazizi",
    email: "mohamed.bouazizi@fss.rnu.tn",
    phone: "+216 74 274 107",
    office: "Bureau 130, Bloc A",
    department: "Mathématiques",
    title: "Professeur",
    specialization: "Analyse Numérique",
  },
  {
    id: "8",
    firstName: "Leila",
    lastName: "Trabelsi",
    email: "leila.trabelsi@fss.rnu.tn",
    phone: "+216 74 274 102",
    office: "Bureau 216, Bloc B",
    department: "Informatique",
    title: "Assistante",
    specialization: "Programmation",
  },
];

const Teachers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

  const {
    data: apiTeachers,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["teachers-public"],
    queryFn: fetchTeachers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Use API data if available, otherwise fallback
  const teachers = apiTeachers && apiTeachers.length > 0 ? apiTeachers : fallbackTeachers;

  // Get unique departments
  const departments = useMemo(() => {
    const depts = new Set(teachers.map((t) => t.department).filter(Boolean));
    return Array.from(depts) as string[];
  }, [teachers]);

  // Filter teachers
  const filteredTeachers = useMemo(() => {
    return teachers.filter((teacher) => {
      const matchesSearch =
        !searchQuery ||
        `${teacher.firstName} ${teacher.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.specialization?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDept = !selectedDepartment || teacher.department === selectedDepartment;

      return matchesSearch && matchesDept;
    });
  }, [teachers, searchQuery, selectedDepartment]);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-primary",
      "bg-accent",
      "bg-success",
      "bg-purple-600",
      "bg-pink-600",
      "bg-cyan-600",
      "bg-orange-600",
      "bg-emerald-600",
    ];
    const index = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  return (
    <>
      <Helmet>
        <title>Nos Enseignants - UniPortal</title>
        <meta
          name="description"
          content="Découvrez notre équipe pédagogique composée d'enseignants-chercheurs de haut niveau."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
        {/* Animated background */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute -top-40 -left-32 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl animate-[float_10s_ease-in-out_infinite]" />
          <div className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl animate-[float_12s_ease-in-out_infinite_reverse]" />
        </div>

        <Navbar />

        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-slate-900/60 px-4 py-1.5 text-sm font-medium text-cyan-300/80 mb-4">
                <Users className="h-4 w-4" />
                Corps Enseignant
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Nos{" "}
                <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-emerald-300 bg-clip-text text-transparent">
                  Enseignants
                </span>
              </h1>
              <p className="text-slate-300/80 max-w-2xl mx-auto">
                Une équipe pédagogique d'excellence, composée d'enseignants-chercheurs passionnés
                et reconnus dans leurs domaines d'expertise.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Rechercher un enseignant par nom, email ou spécialisation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-900/60 border-slate-700 text-slate-100 placeholder:text-slate-500"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedDepartment === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDepartment(null)}
                  className={selectedDepartment === null ? "gradient-primary" : "border-slate-600"}
                >
                  Tous
                </Button>
                {departments.map((dept) => (
                  <Button
                    key={dept}
                    variant={selectedDepartment === dept ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDepartment(dept)}
                    className={selectedDepartment === dept ? "gradient-primary" : "border-slate-600"}
                  >
                    {dept}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  disabled={isRefetching}
                  className="border-slate-600"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-slate-900/60 border-slate-700">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-100">{teachers.length}</p>
                    <p className="text-xs text-slate-400">Enseignants</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/60 border-slate-700">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/20">
                    <Building2 className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-100">{departments.length}</p>
                    <p className="text-xs text-slate-400">Départements</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/60 border-slate-700">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/20">
                    <GraduationCap className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-100">
                      {teachers.filter((t) => t.title?.includes("Professeur")).length}
                    </p>
                    <p className="text-xs text-slate-400">Professeurs</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/60 border-slate-700">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <BookOpen className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-100">
                      {new Set(teachers.map((t) => t.specialization)).size}
                    </p>
                    <p className="text-xs text-slate-400">Spécialisations</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Teachers Grid */}
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="bg-slate-900/60 border-slate-700">
                    <CardContent className="p-6">
                      <SkeletonLoader />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredTeachers.length === 0 ? (
              <div className="text-center py-16">
                <Users className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-300 mb-2">Aucun enseignant trouvé</h3>
                <p className="text-slate-500">Essayez de modifier vos critères de recherche.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTeachers.map((teacher) => (
                  <Card
                    key={teacher.id || teacher._id}
                    className="bg-slate-900/60 border-slate-700 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10 group"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center mb-4">
                        <div
                          className={`w-20 h-20 rounded-full ${getAvatarColor(
                            teacher.firstName + teacher.lastName
                          )} flex items-center justify-center text-white font-bold text-xl mb-3 group-hover:scale-110 transition-transform`}
                        >
                          {teacher.photoUrl ? (
                            <img
                              src={teacher.photoUrl}
                              alt={`${teacher.firstName} ${teacher.lastName}`}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            getInitials(teacher.firstName, teacher.lastName)
                          )}
                        </div>
                        <h3 className="font-semibold text-slate-100 text-lg">
                          {teacher.firstName} {teacher.lastName}
                        </h3>
                        <Badge variant="outline" className="mt-1 border-slate-600 text-slate-400">
                          {teacher.title || "Enseignant"}
                        </Badge>
                      </div>

                      {teacher.specialization && (
                        <div className="flex items-center gap-2 text-sm text-cyan-400 mb-3 justify-center">
                          <BookOpen className="h-4 w-4" />
                          <span>{teacher.specialization}</span>
                        </div>
                      )}

                      <div className="space-y-2 text-sm">
                        {teacher.email && (
                          <a
                            href={`mailto:${teacher.email}`}
                            className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors"
                          >
                            <Mail className="h-4 w-4 shrink-0" />
                            <span className="truncate">{teacher.email}</span>
                          </a>
                        )}
                        {teacher.phone && (
                          <div className="flex items-center gap-2 text-slate-400">
                            <Phone className="h-4 w-4 shrink-0" />
                            <span>{teacher.phone}</span>
                          </div>
                        )}
                        {teacher.office && (
                          <div className="flex items-center gap-2 text-slate-400">
                            <MapPin className="h-4 w-4 shrink-0" />
                            <span>{teacher.office}</span>
                          </div>
                        )}
                        {teacher.department && (
                          <div className="flex items-center gap-2 text-slate-400">
                            <Building2 className="h-4 w-4 shrink-0" />
                            <span>{teacher.department}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Teachers;
