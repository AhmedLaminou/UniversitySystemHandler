import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarDays, Clock, MapPin, User, Plus, Pencil, Trash2, RefreshCw } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchSchedule,
  createScheduleSlot,
  updateScheduleSlot,
  deleteScheduleSlot,
  ScheduleSlot,
} from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useState, useMemo } from "react";
import { toast } from "sonner";

interface DisplayScheduleItem {
  id: string;
  courseName: string;
  professor: string;
  room: string;
  startTime: string;
  endTime: string;
  type: "cours" | "td" | "tp";
  day: string;
}

// Fallback schedule data
const fallbackScheduleItems: DisplayScheduleItem[] = [
  { id: "1", courseName: "Architecture des Ordinateurs", professor: "Mme Ghada Feki", room: "Amphi A", startTime: "08:30", endTime: "10:00", type: "cours", day: "Lundi" },
  { id: "2", courseName: "Bases de Données Avancées", professor: "M. Karim Mansour", room: "Lab Info 3", startTime: "10:30", endTime: "12:00", type: "tp", day: "Lundi" },
  { id: "3", courseName: "Développement Web", professor: "M. Sami Trabelsi", room: "Salle 108", startTime: "14:00", endTime: "15:30", type: "td", day: "Lundi" },
  { id: "4", courseName: "Génie Logiciel", professor: "M. Yassine Ben Salah", room: "Amphi B", startTime: "08:30", endTime: "10:00", type: "cours", day: "Mardi" },
  { id: "5", courseName: "Réseaux Informatiques", professor: "Mme Sonia Mekni", room: "Salle 204", startTime: "10:30", endTime: "12:00", type: "cours", day: "Mardi" },
  { id: "6", courseName: "Intelligence Artificielle", professor: "Mme Amira Chaabane", room: "Amphi A", startTime: "08:30", endTime: "10:00", type: "cours", day: "Mercredi" },
  { id: "7", courseName: "Architecture des Ordinateurs", professor: "Mme Ghada Feki", room: "Lab Info 1", startTime: "14:00", endTime: "16:00", type: "tp", day: "Mercredi" },
  { id: "8", courseName: "Bases de Données Avancées", professor: "M. Karim Mansour", room: "Amphi C", startTime: "08:30", endTime: "10:00", type: "cours", day: "Jeudi" },
  { id: "9", courseName: "Génie Logiciel", professor: "M. Yassine Ben Salah", room: "Salle 112", startTime: "10:30", endTime: "12:00", type: "td", day: "Jeudi" },
  { id: "10", courseName: "Développement Web", professor: "M. Sami Trabelsi", room: "Lab Info 2", startTime: "14:00", endTime: "16:00", type: "tp", day: "Jeudi" },
  { id: "11", courseName: "Réseaux Informatiques", professor: "Mme Sonia Mekni", room: "Lab Réseaux", startTime: "08:30", endTime: "10:30", type: "tp", day: "Vendredi" },
  { id: "12", courseName: "Intelligence Artificielle", professor: "Mme Amira Chaabane", room: "Salle 208", startTime: "10:30", endTime: "12:00", type: "td", day: "Vendredi" },
];

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
const timeSlots = ["08:30", "10:00", "10:30", "12:00", "14:00", "15:30", "16:00"];

const getTypeColor = (type: string) => {
  switch (type) {
    case "cours":
      return "bg-primary text-primary-foreground";
    case "td":
      return "bg-success text-success-foreground";
    case "tp":
      return "bg-accent text-accent-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getTypeBadge = (type: string) => {
  switch (type) {
    case "cours":
      return "Cours";
    case "td":
      return "TD";
    case "tp":
      return "TP";
    default:
      return type;
  }
};

const Schedule = () => {
  const { user, accessToken } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const queryClient = useQueryClient();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    courseName: "",
    professorName: "",
    day: "Lundi",
    startTime: "08:30",
    endTime: "10:00",
    room: "",
    type: "cours" as "cours" | "td" | "tp",
  });

  const {
    data: apiSchedule,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["schedule"],
    queryFn: () => fetchSchedule(accessToken || undefined),
  });

  // Transform API data or use fallback
  const scheduleItems: DisplayScheduleItem[] = useMemo(() => {
    if (apiSchedule && apiSchedule.length > 0) {
      return apiSchedule.map((s, i) => ({
        id: s.id || i.toString(),
        courseName: s.courseName || "",
        professor: s.professorName || "",
        room: s.room,
        startTime: s.startTime,
        endTime: s.endTime,
        type: s.type,
        day: s.day,
      }));
    }
    return fallbackScheduleItems;
  }, [apiSchedule]);

  // Group by day for easier rendering
  const scheduleByDay = useMemo(() => {
    const grouped: Record<string, DisplayScheduleItem[]> = {};
    days.forEach((day) => {
      grouped[day] = scheduleItems.filter((item) => item.day === day);
    });
    return grouped;
  }, [scheduleItems]);

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: Partial<ScheduleSlot>) => createScheduleSlot(data, accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
      toast.success("Créneau ajouté avec succès");
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast.error("Erreur lors de l'ajout du créneau");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteScheduleSlot(id, accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
      toast.success("Créneau supprimé");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression");
    },
  });

  const resetForm = () => {
    setFormData({
      courseName: "",
      professorName: "",
      day: "Lundi",
      startTime: "08:30",
      endTime: "10:00",
      room: "",
      type: "cours",
    });
  };

  const handleAddSlot = () => {
    createMutation.mutate({
      courseName: formData.courseName,
      professorName: formData.professorName,
      day: formData.day,
      startTime: formData.startTime,
      endTime: formData.endTime,
      room: formData.room,
      type: formData.type,
    });
  };

  const handleDeleteSlot = (id: string) => {
    if (confirm("Supprimer ce créneau ?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <>
      <Helmet>
        <title>Emploi du Temps - UniPortal</title>
        <meta name="description" content="Consultez votre emploi du temps hebdomadaire" />
      </Helmet>

      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                {isAdmin ? "Gestion de l'Emploi du Temps" : "Emploi du Temps"}
              </h1>
              <p className="text-muted-foreground mt-1">Semestre 1 - 2024/2025</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="gap-2 py-1.5">
                <CalendarDays className="h-4 w-4" />
                Semaine du 16 Décembre
              </Badge>
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
                      Ajouter créneau
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ajouter un créneau</DialogTitle>
                      <DialogDescription>
                        Ajoutez un nouveau cours à l'emploi du temps.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Jour</Label>
                          <Select value={formData.day} onValueChange={(v) => setFormData({ ...formData, day: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {days.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Type</Label>
                          <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as any })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cours">Cours</SelectItem>
                              <SelectItem value="td">TD</SelectItem>
                              <SelectItem value="tp">TP</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Nom du cours</Label>
                        <Input value={formData.courseName} onChange={(e) => setFormData({ ...formData, courseName: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Professeur</Label>
                        <Input value={formData.professorName} onChange={(e) => setFormData({ ...formData, professorName: e.target.value })} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Début</Label>
                          <Input type="time" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Fin</Label>
                          <Input type="time" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Salle</Label>
                        <Input value={formData.room} onChange={(e) => setFormData({ ...formData, room: e.target.value })} />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Annuler</Button>
                      <Button onClick={handleAddSlot} disabled={createMutation.isPending}>
                        {createMutation.isPending ? "Ajout..." : "Ajouter"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          {/* Legend */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">Légende:</span>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-primary" />
                  <span className="text-sm">Cours Magistral</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-success" />
                  <span className="text-sm">Travaux Dirigés (TD)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-accent" />
                  <span className="text-sm">Travaux Pratiques (TP)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Desktop Weekly Grid */}
          <Card className="hidden lg:block">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                Vue Hebdomadaire
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-6 gap-2">
                {/* Header Row */}
                <div className="p-3 bg-muted rounded-lg text-center font-semibold text-sm text-muted-foreground">
                  Horaire
                </div>
                {days.map((day) => (
                  <div key={day} className="p-3 bg-primary rounded-lg text-center font-semibold text-primary-foreground">
                    {day}
                  </div>
                ))}

                {/* Time Slots */}
                {["08:30 - 10:00", "10:30 - 12:00", "14:00 - 16:00"].map((slot) => (
                  <>
                    <div key={`time-${slot}`} className="p-3 bg-muted/50 rounded-lg text-center text-sm font-medium flex items-center justify-center">
                      {slot}
                    </div>
                    {days.map((day) => {
                      const [slotStart] = slot.split(" - ");
                      const courseInSlot = scheduleByDay[day]?.find(
                        (item) => item.startTime === slotStart || 
                        (slotStart === "14:00" && (item.startTime === "14:00"))
                      );

                      return (
                        <div key={`${day}-${slot}`} className="min-h-24 relative group">
                          {courseInSlot ? (
                            <div className={`h-full p-3 rounded-lg ${getTypeColor(courseInSlot.type)} flex flex-col justify-between`}>
                              {isAdmin && (
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => handleDeleteSlot(courseInSlot.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                              <div>
                                <p className="font-semibold text-sm leading-tight line-clamp-2">
                                  {courseInSlot.courseName}
                                </p>
                                <p className="text-xs opacity-90 mt-1 flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {courseInSlot.professor}
                                </p>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs opacity-90 flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {courseInSlot.room}
                                </span>
                                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                                  {getTypeBadge(courseInSlot.type)}
                                </Badge>
                              </div>
                            </div>
                          ) : (
                            <div className="h-full bg-muted/20 rounded-lg border border-dashed border-border" />
                          )}
                        </div>
                      );
                    })}
                  </>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mobile Day-by-Day View */}
          <div className="lg:hidden space-y-4">
            {days.map((day) => (
              <Card key={day}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    {day}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {scheduleByDay[day]?.length > 0 ? (
                    scheduleByDay[day].map((item) => (
                      <div
                        key={item.id}
                        className={`p-4 rounded-lg ${getTypeColor(item.type)} relative`}
                      >
                        {isAdmin && (
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6"
                            onClick={() => handleDeleteSlot(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold">{item.courseName}</p>
                            <p className="text-sm opacity-90 flex items-center gap-1 mt-1">
                              <User className="h-3.5 w-3.5" />
                              {item.professor}
                            </p>
                          </div>
                          <Badge variant="secondary" className="shrink-0">
                            {getTypeBadge(item.type)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-sm opacity-90">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {item.startTime} - {item.endTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {item.room}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm text-center py-4">
                      Aucun cours prévu
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default Schedule;
