import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
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
  Mail,
  Phone,
  MapPin,
  Activity,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
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

// Fallback courses when API is unavailable
const fallbackCourses: DisplayCourse[] = [
  {
    id: "1",
    code: "INFO301",
    name: "Architecture des Ordinateurs",
    professor: "Mme Ghada Feki",
    progress: 75,
    resources: 12,
    nextSession: "Lun 16 Déc, 08:30",
    color: "from-primary to-primary/80",
    credits: 3,
  },
  {
    id: "2",
    code: "INFO302",
    name: "Génie Logiciel",
    professor: "M. Karim Mansour",
    progress: 60,
    resources: 18,
    nextSession: "Mar 17 Déc, 10:00",
    color: "from-purple-600 to-purple-500",
    credits: 4,
  },
  {
    id: "3",
    code: "INFO303",
    name: "Bases de Données Avancées",
    professor: "Mme Sonia Mekni",
    progress: 45,
    resources: 8,
    nextSession: "Mer 18 Déc, 14:00",
    color: "from-green-600 to-green-500",
    credits: 3,
  },
  {
    id: "4",
    code: "INFO304",
    name: "Réseaux Informatiques",
    professor: "M. Sami Trabelsi",
    progress: 80,
    resources: 15,
    nextSession: "Jeu 19 Déc, 08:30",
    color: "from-orange-600 to-orange-500",
    credits: 3,
  },
  {
    id: "5",
    code: "INFO305",
    name: "Programmation Web",
    professor: "M. Yassine Ben Salah",
    progress: 90,
    resources: 22,
    nextSession: "Ven 20 Déc, 10:00",
    color: "from-pink-600 to-pink-500",
    credits: 3,
  },
  {
    id: "6",
    code: "INFO306",
    name: "Intelligence Artificielle",
    professor: "Mme Amira Chaabane",
    progress: 35,
    resources: 10,
    nextSession: "Lun 23 Déc, 14:00",
    color: "from-cyan-600 to-cyan-500",
    credits: 4,
  },
];

const colors = [
  "from-primary to-primary/80",
  "from-purple-600 to-purple-500",
  "from-green-600 to-green-500",
  "from-orange-600 to-orange-500",
  "from-pink-600 to-pink-500",
  "from-cyan-600 to-cyan-500",
];

const resources = [
  { id: 1, name: "Chapitre 1 - Introduction", type: "pdf", size: "2.4 MB" },
  { id: 2, name: "TP1 - Exercices Pratiques", type: "pdf", size: "1.8 MB" },
  { id: 3, name: "Cours Vidéo - Séance 3", type: "video", size: "245 MB" },
  { id: 4, name: "Chapitre 2 - Architecture", type: "pdf", size: "3.1 MB" },
  { id: 5, name: "Devoir 1 - Consignes", type: "pdf", size: "0.5 MB" },
];

const Courses = () => {
  const { user, accessToken } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const queryClient = useQueryClient();

  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<DisplayCourse | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    credits: 3,
    professorId: "",
  });

  const { data: wsdlHealth } = useQuery({
    queryKey: ["course-wsdl"],
    queryFn: fetchCourseWsdl,
  });

  const {
    data: apiCourses,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["courses-list"],
    queryFn: fetchAllCourses,
  });

  // Transform API courses to display format
  const courses: DisplayCourse[] =
    apiCourses && apiCourses.length > 0
      ? apiCourses.map((c, index) => ({
          id: c.id || index.toString(),
          code: c.code,
          name: c.name,
          professor: c.professorName || "Non assigné",
          professorId: c.professorId,
          progress: Math.floor(Math.random() * 100), // Simulated progress
          resources: Math.floor(Math.random() * 20) + 5, // Simulated resources
          nextSession: "À définir",
          color: colors[index % colors.length],
          description: c.description,
          credits: c.credits,
        }))
      : fallbackCourses;

  const selectedCourseData = courses.find((c) => c.id === selectedCourse);

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: Partial<ApiCourse>) => createCourse(data, accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses-list"] });
      toast.success("Cours créé avec succès");
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast.error("Erreur lors de la création du cours");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ApiCourse> }) =>
      updateCourse(id, data, accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses-list"] });
      toast.success("Cours mis à jour avec succès");
      setIsEditDialogOpen(false);
      setEditingCourse(null);
      resetForm();
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour du cours");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCourse(id, accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses-list"] });
      toast.success("Cours supprimé avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression du cours");
    },
  });

  const resetForm = () => {
    setFormData({ code: "", name: "", description: "", credits: 3, professorId: "" });
  };

  const handleAddCourse = () => {
    createMutation.mutate(formData);
  };

  const handleEditCourse = () => {
    if (editingCourse) {
      updateMutation.mutate({ id: editingCourse.id, data: formData });
    }
  };

  const handleDeleteCourse = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce cours ?")) {
      deleteMutation.mutate(id);
    }
  };

  const openEditDialog = (course: DisplayCourse) => {
    setEditingCourse(course);
    setFormData({
      code: course.code,
      name: course.name,
      description: course.description || "",
      credits: course.credits || 3,
      professorId: course.professorId || "",
    });
    setIsEditDialogOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>Mes Cours - UniPortal</title>
      </Helmet>

      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              {isAdmin ? "Gestion des Cours" : "Mes Cours"}
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-muted-foreground">Semestre 1 - 2024/2025</p>
              <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                <Activity className="h-3 w-3" />
                Course Service: {wsdlHealth?.status === "UP" ? "en ligne" : "hors ligne"}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isRefetching}
              >
                <RefreshCw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
              </Button>
              {isAdmin && (
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Ajouter un cours
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ajouter un nouveau cours</DialogTitle>
                      <DialogDescription>
                        Remplissez les informations du cours à ajouter.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="code">Code du cours</Label>
                        <Input
                          id="code"
                          placeholder="INFO301"
                          value={formData.code}
                          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom du cours</Label>
                        <Input
                          id="name"
                          placeholder="Architecture des Ordinateurs"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Description du cours..."
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="credits">Crédits</Label>
                          <Input
                            id="credits"
                            type="number"
                            min={1}
                            max={10}
                            value={formData.credits}
                            onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) || 3 })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="professorId">ID Professeur</Label>
                          <Input
                            id="professorId"
                            placeholder="PROF001"
                            value={formData.professorId}
                            onChange={(e) => setFormData({ ...formData, professorId: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button onClick={handleAddCourse} disabled={createMutation.isPending}>
                        {createMutation.isPending ? "Création..." : "Créer le cours"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Modifier le cours</DialogTitle>
                <DialogDescription>
                  Modifiez les informations du cours.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-code">Code du cours</Label>
                  <Input
                    id="edit-code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nom du cours</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-credits">Crédits</Label>
                    <Input
                      id="edit-credits"
                      type="number"
                      min={1}
                      max={10}
                      value={formData.credits}
                      onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) || 3 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-professorId">ID Professeur</Label>
                    <Input
                      id="edit-professorId"
                      value={formData.professorId}
                      onChange={(e) => setFormData({ ...formData, professorId: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleEditCourse} disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Mise à jour..." : "Enregistrer"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {selectedCourse && selectedCourseData ? (
            // Course Detail View
            <div className="space-y-6">
              <Button variant="ghost" onClick={() => setSelectedCourse(null)} className="mb-4">
                ← Retour aux cours
              </Button>
              
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{selectedCourseData.name}</CardTitle>
                      <p className="text-muted-foreground mt-1 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {selectedCourseData.professor}
                      </p>
                    </div>
                    <Badge className="bg-success/20 text-success border-success/30">En cours</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progression</span>
                      <span className="font-medium">{selectedCourseData.progress}%</span>
                    </div>
                    <Progress value={selectedCourseData.progress} className="h-3" />
                  </div>

                  <Tabs defaultValue="resources" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="resources">Ressources</TabsTrigger>
                      <TabsTrigger value="instructors">Enseignants</TabsTrigger>
                    </TabsList>

                    <TabsContent value="resources" className="mt-4 space-y-3">
                      {resources.map((resource) => (
                        <div
                          key={resource.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${resource.type === "pdf" ? "bg-destructive/10" : "bg-primary/10"}`}>
                              {resource.type === "pdf" ? (
                                <FileText className={`h-5 w-5 text-destructive`} />
                              ) : (
                                <Video className="h-5 w-5 text-primary" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{resource.name}</p>
                              <p className="text-sm text-muted-foreground">{resource.size}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="instructors" className="mt-4 space-y-4">
                      <Card className="border">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0">
                              {selectedCourseData.professor.split(" ").map(n => n[0]).join("").slice(0, 2)}
                            </div>
                            <div className="flex-1 space-y-2">
                              <div>
                                <h4 className="font-semibold text-foreground">{selectedCourseData.professor}</h4>
                                <p className="text-sm text-muted-foreground">Enseignant responsable</p>
                              </div>
                              <div className="space-y-1.5 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <BookOpen className="h-4 w-4 text-primary" />
                                  <span>{selectedCourseData.code}</span>
                                </div>
                                {selectedCourseData.credits && (
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Clock className="h-4 w-4 text-primary" />
                                    <span>{selectedCourseData.credits} crédits ECTS</span>
                                  </div>
                                )}
                                {selectedCourseData.description && (
                                  <p className="text-muted-foreground mt-2">{selectedCourseData.description}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          ) : isLoading ? (
            // Loading state
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="border">
                  <CardContent className="p-5">
                    <SkeletonLoader />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // Course Grid View
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card
                  key={course.id}
                  className="hover-lift cursor-pointer group border relative"
                  onClick={() => setSelectedCourse(course.id)}
                >
                  {/* Admin controls */}
                  {isAdmin && (
                    <div className="absolute top-3 right-3 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditDialog(course);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCourse(course.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <CardContent className="p-0">
                    {/* Color Header */}
                    <div className={`h-2 rounded-t-lg bg-gradient-to-r ${course.color}`} />
                    
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-r ${course.color}`}>
                          <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex items-center gap-2">
                          {course.credits && (
                            <Badge variant="outline" className="text-xs">
                              {course.credits} ECTS
                            </Badge>
                          )}
                          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground mb-1">{course.code}</p>
                      <h3 className="font-semibold text-foreground mb-1 line-clamp-2">
                        {course.name}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mb-4">
                        <User className="h-3.5 w-3.5" />
                        {course.professor}
                      </p>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Progression</span>
                            <span className="font-medium text-foreground">{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            {course.resources} ressources
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {course.nextSession.split(",")[0]}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default Courses;
