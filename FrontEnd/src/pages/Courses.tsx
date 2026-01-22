import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import CourseAiPanel from "@/components/ai/CourseAiPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  BookOpen,
  FileText,
  Video,
  Download,
  Clock,
  User,
  ChevronRight,
  Activity,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  ArrowRight
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCourseWsdl,
  fetchAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  Course as ApiCourse,
} from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import { cn } from "@/lib/utils";

interface DisplayCourse {
  id: string;
  code: string;
  name: string;
  professor: string;
  professorId?: string;
  progress: number;
  resources: number;
  nextSession: string;
  color: string;
  description?: string;
  credits?: number;
}

const fallbackCourses: DisplayCourse[] = [
  { id: "1", code: "INFO301", name: "Architecture des Ordinateurs", professor: "Mme Ghada Feki", progress: 75, resources: 12, nextSession: "Lun 16 Déc, 08:30", color: "from-blue-600 to-indigo-600", credits: 3 },
  { id: "2", code: "INFO302", name: "Génie Logiciel", professor: "M. Karim Mansour", progress: 60, resources: 18, nextSession: "Mar 17 Déc, 10:00", color: "from-purple-600 to-pink-600", credits: 4 },
  { id: "3", code: "INFO303", name: "Bases de Données Avancées", professor: "Mme Sonia Mekni", progress: 45, resources: 8, nextSession: "Mer 18 Déc, 14:00", color: "from-emerald-600 to-teal-600", credits: 3 },
  { id: "4", code: "INFO304", name: "Réseaux Informatiques", professor: "M. Sami Trabelsi", progress: 80, resources: 15, nextSession: "Jeu 19 Déc, 08:30", color: "from-amber-600 to-orange-600", credits: 3 },
];

const colors = ["from-blue-600 to-indigo-600", "from-purple-600 to-pink-600", "from-emerald-600 to-teal-600", "from-amber-600 to-orange-600"];

const Courses = () => {
  const { user, accessToken } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const queryClient = useQueryClient();

  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<DisplayCourse | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({ code: "", name: "", description: "", credits: 3, professorId: "" });

  const { data: wsdlHealth } = useQuery({ queryKey: ["course-wsdl"], queryFn: fetchCourseWsdl });
  const { data: apiCourses, isLoading, refetch, isRefetching } = useQuery<ApiCourse[]>({
    queryKey: ["courses-list"],
    queryFn: () => fetchAllCourses(accessToken!),
  });

  const courses: DisplayCourse[] = apiCourses && apiCourses.length > 0
    ? apiCourses.map((c, index) => ({
        id: c.id || index.toString(),
        code: c.code,
        name: c.name,
        professor: c.professorName || "Non assigné",
        professorId: c.professorId,
        progress: Math.floor(Math.random() * 60) + 20,
        resources: Math.floor(Math.random() * 20) + 5,
        nextSession: "Semaine Prochaine",
        color: colors[index % colors.length],
        description: c.description,
        credits: c.credits,
      }))
    : fallbackCourses;

  const filteredCourses = courses.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCourseData = courses.find((c) => c.id === selectedCourse);

  const createMutation = useMutation({
    mutationFn: (data: Partial<ApiCourse>) => createCourse(data, accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses-list"] });
      toast.success("Cours créé avec succès");
      setIsAddDialogOpen(false);
      setFormData({ code: "", name: "", description: "", credits: 3, professorId: "" });
    },
  });

  return (
    <>
      <Helmet>
        <title>Mes Cours | UniPortal Premium</title>
      </Helmet>

      <DashboardLayout>
        <div className="space-y-10 animate-fade-in pb-20">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
                <BookOpen className="h-3 w-3" /> Académique
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-[#0f172a] dark:text-white">
                {isAdmin ? "Gestion du Curriculum" : "Mes Cours & Formations"}
              </h1>
              <p className="text-slate-500 font-medium max-w-2xl">
                Explorez vos ressources pédagogiques, suivez votre progression et interagissez avec vos enseignants.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
               <div className="relative group min-w-[300px]">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <Input 
                    placeholder="Rechercher un cours..." 
                    className="input-premium pl-12 h-12 bg-white dark:bg-slate-900"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </div>
               {isAdmin && (
                 <Button onClick={() => setIsAddDialogOpen(true)} className="btn-premium h-12 px-6">
                    <Plus className="h-5 w-5 mr-2" /> Nouveau Cours
                 </Button>
               )}
            </div>
          </div>

          {selectedCourse && selectedCourseData ? (
            <div className="space-y-8">
              <Button variant="ghost" onClick={() => setSelectedCourse(null)} className="font-bold text-slate-500 hover:text-primary gap-2">
                <ArrowRight className="h-4 w-4 rotate-180" /> Retour au catalogue
              </Button>
              
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                <div className="xl:col-span-2 space-y-8">
                  <Card className="border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden">
                    <div className={cn("h-4 bg-gradient-to-r", selectedCourseData.color)} />
                    <CardHeader className="p-10 pb-6 flex flex-row items-start justify-between">
                      <div className="space-y-2">
                         <Badge className="bg-primary/10 text-primary border-none font-bold">{selectedCourseData.code}</Badge>
                         <CardTitle className="text-3xl font-black text-[#0f172a] dark:text-white">{selectedCourseData.name}</CardTitle>
                         <p className="flex items-center gap-2 text-slate-500 font-medium">
                            <User className="h-4 w-4" /> Enseignant : {selectedCourseData.professor}
                         </p>
                      </div>
                      <div className="text-right space-y-2">
                         <div className="text-3xl font-black text-primary">{selectedCourseData.progress}%</div>
                         <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Ma Progression</p>
                      </div>
                    </CardHeader>
                    <CardContent className="px-10 pb-10">
                      <Progress value={selectedCourseData.progress} className="h-3 mb-10" />

                      <Tabs defaultValue="ressources" className="w-full">
                        <TabsList className="bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl mb-8">
                          <TabsTrigger value="ressources" className="rounded-xl font-bold py-3 px-8">Ressources</TabsTrigger>
                          <TabsTrigger value="details" className="rounded-xl font-bold py-3 px-8">Détails du Cours</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="ressources" className="space-y-4">
                           {[1,2,3,4].map(i => (
                             <div key={i} className="flex items-center justify-between p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border-2 border-transparent hover:border-primary/20 transition-all cursor-pointer group shadow-sm hover:shadow-xl">
                                <div className="flex items-center gap-6">
                                   <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-700 flex items-center justify-center shadow-md">
                                      {i % 2 === 0 ? <FileText className="h-6 w-6 text-rose-500" /> : <Video className="h-6 w-6 text-primary" />}
                                   </div>
                                   <div>
                                      <h5 className="font-bold text-[#0f172a] dark:text-white group-hover:text-primary transition-colors">Chapitre {i} : Les Fondamentaux</h5>
                                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{i % 2 === 0 ? "PDF Document • 4.2 MB" : "Video Lecture • 45:12"}</p>
                                   </div>
                                </div>
                                <Button variant="ghost" className="rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                   <Download className="h-5 w-5" />
                                </Button>
                             </div>
                           ))}
                        </TabsContent>
                        
                        <TabsContent value="details" className="p-4 space-y-6">
                           <div className="prose dark:prose-invert max-w-none text-slate-500 font-medium leading-relaxed">
                              {selectedCourseData.description || "Aucune description détaillée n'est disponible pour ce cours pour le moment. Veuillez contacter votre enseignant pour plus d'informations sur le syllabus et les objectifs pédagogiques."}
                           </div>
                           <div className="grid grid-cols-2 gap-6 pt-6">
                              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Crédits ECTS</p>
                                 <p className="text-xl font-black">{selectedCourseData.credits || 0} Points</p>
                              </div>
                              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Dernière Mise à jour</p>
                                 <p className="text-xl font-black">Hier, 14:30</p>
                              </div>
                           </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </div>

                <div className="xl:col-span-1">
                  <div className="sticky top-10">
                    <CourseAiPanel courseId={selectedCourse} courseTitle={selectedCourseData.name} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Stats Bar */}
              <div className="flex items-center gap-6 px-4 py-2 bg-slate-50 dark:bg-slate-900/50 rounded-2xl w-fit">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">État du Service:</span>
                <Badge className={cn("rounded-full px-3", wsdlHealth?.status === "UP" ? "bg-emerald-500/10 text-emerald-600 border-none" : "bg-rose-500/10 text-rose-600 border-none")}>
                   {wsdlHealth?.status === "UP" ? "Opérationnel (SOAP)" : "Maintenance"}
                </Badge>
                <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-800" />
                <button onClick={() => refetch()} className="text-xs font-black text-primary hover:underline flex items-center gap-2">
                   <RefreshCw className={cn("h-3 w-3", isRefetching && "animate-spin")} /> Rafraîchir
                </button>
              </div>

              {isLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(6)].map((_, i) => <Card key={i} className="h-[400px] rounded-[2.5rem]"><SkeletonLoader /></Card>)}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {filteredCourses.map((course) => (
                    <Card
                      key={course.id}
                      className="group cursor-pointer border-none shadow-xl hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] overflow-hidden bg-white dark:bg-slate-900 relative hover:-translate-y-2"
                      onClick={() => setSelectedCourse(course.id)}
                    >
                      <div className={cn("h-4 bg-gradient-to-r", course.color)} />
                      <CardContent className="p-8 space-y-6">
                        <div className="flex items-start justify-between">
                           <div className={cn("p-4 rounded-3xl bg-gradient-to-r shadow-lg group-hover:scale-110 transition-transform duration-500", course.color)}>
                              <BookOpen className="h-6 w-6 text-white" />
                           </div>
                           <Badge variant="outline" className="rounded-full border-2 font-black px-3 py-1 text-[10px]">
                              {course.credits || 3} ECTS
                           </Badge>
                        </div>
                        
                        <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{course.code}</p>
                           <h3 className="text-xl font-black text-[#0f172a] dark:text-white leading-tight group-hover:text-primary transition-colors line-clamp-2">
                              {course.name}
                           </h3>
                           <p className="text-sm font-medium text-slate-500 mt-2 flex items-center gap-2">
                              <User className="h-4 w-4" /> {course.professor}
                           </p>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                           <div>
                              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                 <span>Ma Progression</span>
                                 <span>{course.progress}%</span>
                              </div>
                              <Progress value={course.progress} className="h-2" />
                           </div>
                           
                           <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                              <div className="flex items-center gap-2">
                                 <FileText className="h-4 w-4" /> {course.resources} Docs
                              </div>
                              <div className="flex items-center gap-2">
                                 <Clock className="h-4 w-4" /> {course.nextSession.split(',')[0]}
                              </div>
                           </div>
                        </div>

                        {isAdmin && (
                          <div className="absolute top-8 right-8 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <Button size="icon" variant="ghost" className="rounded-xl bg-white/50 backdrop-blur-md shadow-lg" onClick={(e) => e.stopPropagation()}>
                                <Pencil className="h-4 w-4" />
                             </Button>
                             <Button size="icon" variant="destructive" className="rounded-xl shadow-lg" onClick={(e) => { e.stopPropagation(); deleteCourse(course.id, accessToken!); }}>
                                <Trash2 className="h-4 w-4" />
                             </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Add Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
           <DialogContent className="rounded-[2.5rem] p-10 max-w-2xl">
              <DialogHeader className="mb-8">
                 <DialogTitle className="text-3xl font-black">Nouveau Cours</DialogTitle>
                 <DialogDescription className="font-medium text-lg">Définissez les paramètres du nouvel enseignement.</DialogDescription>
              </DialogHeader>
              <div className="grid md:grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <Label className="font-bold">Code Académique</Label>
                    <Input placeholder="INFO-301" className="input-premium h-12" />
                 </div>
                 <div className="space-y-3">
                    <Label className="font-bold">Intitulé du Cours</Label>
                    <Input placeholder="Algorithmique Avancée" className="input-premium h-12" />
                 </div>
                 <div className="md:col-span-2 space-y-3">
                    <Label className="font-bold">Description</Label>
                    <Textarea placeholder="Présentation du cours..." className="input-premium p-4 min-h-[120px]" />
                 </div>
              </div>
              <DialogFooter className="mt-10">
                 <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)} className="rounded-xl font-bold">Annuler</Button>
                 <Button className="btn-premium px-10 h-12">Créer le cours</Button>
              </DialogFooter>
           </DialogContent>
        </Dialog>
      </DashboardLayout>
    </>
  );
};

export default Courses;
