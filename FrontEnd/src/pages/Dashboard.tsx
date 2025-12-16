import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  GraduationCap,
  CreditCard,
  CalendarDays,
  Bell,
  ArrowRight,
  TrendingUp,
  Clock,
  MapPin,
  FileText,
  Users,
  Activity,
  UserPlus,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchStudentList,
  fetchBillingHealth,
  fetchCourseWsdl,
  fetchStudentRequests,
  approveStudentRequest,
  rejectStudentRequest,
  fetchAuthHealth,
  fetchStudentHealth,
  fetchGradeHealth,
} from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

const gpaData = [
  { semester: "S1", gpa: 12.5 },
  { semester: "S2", gpa: 13.2 },
  { semester: "S3", gpa: 13.8 },
  { semester: "S4", gpa: 14.1 },
  { semester: "S5", gpa: 14.5 },
];

const notifications = [
  { id: 1, title: "Nouvelle note disponible", message: "Architecture des Ordinateurs - DS", time: "Il y a 2h", unread: true },
  { id: 2, title: "Rappel de paiement", message: "Échéance des frais de scolarité le 20 Dec", time: "Il y a 5h", unread: true },
  { id: 3, title: "Cours annulé", message: "Génie Logiciel - 15 Dec reporté", time: "Hier", unread: false },
];

const Dashboard = () => {
  const { user, accessToken } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const { data: students } = useQuery({
    queryKey: ["students-admin"],
    enabled: isAdmin && !!accessToken,
    queryFn: () => fetchStudentList(accessToken!),
  });

  const { data: billingHealth } = useQuery({
    queryKey: ["billing-health-dashboard"],
    queryFn: fetchBillingHealth,
  });

  const { data: courseHealth } = useQuery({
    queryKey: ["course-health-dashboard"],
    queryFn: fetchCourseWsdl,
  });

  const { data: authHealth } = useQuery({
    queryKey: ["auth-health-dashboard"],
    queryFn: fetchAuthHealth,
  });

  const { data: studentServiceHealth } = useQuery({
    queryKey: ["student-health-dashboard"],
    queryFn: fetchStudentHealth,
  });

  const { data: gradeHealth } = useQuery({
    queryKey: ["grade-health-dashboard"],
    queryFn: fetchGradeHealth,
  });

  const { data: studentRequests, refetch: refetchRequests, isRefetching: isRefetchingRequests } = useQuery({
    queryKey: ["student-requests"],
    enabled: isAdmin && !!accessToken,
    queryFn: () => fetchStudentRequests(accessToken!),
  });

  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: (requestId: string) => approveStudentRequest(requestId, accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-requests"] });
      queryClient.invalidateQueries({ queryKey: ["students-admin"] });
      toast.success("Demande approuvée");
    },
    onError: () => toast.error("Erreur lors de l'approbation"),
  });

  const rejectMutation = useMutation({
    mutationFn: (requestId: string) => rejectStudentRequest(requestId, accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-requests"] });
      toast.success("Demande rejetée");
    },
    onError: () => toast.error("Erreur lors du rejet"),
  });

  const pendingRequests = Array.isArray(studentRequests) ? studentRequests.filter((r) => r.status === "pending") : [];

  // Ensure students is always an array
  const studentsList = Array.isArray(students) ? students : [];
  const totalStudents = studentsList.length;
  const activeStudents = studentsList.filter((s: any) => s.status === "active").length;
  const inactiveStudents = totalStudents - activeStudents;

  return (
    <>
      <Helmet>
        <title>Tableau de Bord - UniPortal</title>
      </Helmet>

      <DashboardLayout>
        <div className="space-y-6">
          {isAdmin ? (
            <>
              {/* Admin Welcome Section */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                    Tableau de Bord Administrateur
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Vue globale sur les étudiants et les services du système.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="gap-2 py-1.5 w-fit">
                    <Users className="h-4 w-4" />
                    {totalStudents} étudiants
                  </Badge>
                  <Badge variant="outline" className="gap-2 py-1.5 w-fit">
                    <Activity className="h-4 w-4" />
                    Billing: {billingHealth?.status === "UP" ? "UP" : "DOWN"} | Course:{" "}
                    {courseHealth?.status === "UP" ? "UP" : "DOWN"}
                  </Badge>
                </div>
              </div>

              {/* Admin Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                <Card className="border-l-4 border-l-primary">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-muted-foreground">Étudiants Actifs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-foreground">{activeStudents}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Sur {totalStudents} étudiants au total
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-accent">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-muted-foreground">Étudiants Inactifs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-foreground">{inactiveStudents}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Comptes à vérifier / archivés
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-success">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-muted-foreground">
                      Services Back-End
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="flex items-center justify-between text-sm">
                      <span>Auth Service</span>
                      <span className={authHealth?.status === "UP" ? "text-emerald-500 font-semibold" : "text-red-500 font-semibold"}>
                        {authHealth?.status === "UP" ? "UP" : "DOWN"}
                      </span>
                    </p>
                    <p className="flex items-center justify-between text-sm">
                      <span>Student Service</span>
                      <span className={studentServiceHealth?.status === "UP" ? "text-emerald-500 font-semibold" : "text-red-500 font-semibold"}>
                        {studentServiceHealth?.status === "UP" ? "UP" : "DOWN"}
                      </span>
                    </p>
                    <p className="flex items-center justify-between text-sm">
                      <span>Grade Service</span>
                      <span className={gradeHealth?.status === "UP" ? "text-emerald-500 font-semibold" : "text-red-500 font-semibold"}>
                        {gradeHealth?.status === "UP" ? "UP" : "DOWN"}
                      </span>
                    </p>
                    <p className="flex items-center justify-between text-sm">
                      <span>Billing Service</span>
                      <span className={billingHealth?.status === "UP" ? "text-emerald-500 font-semibold" : "text-red-500 font-semibold"}>
                        {billingHealth?.status === "UP" ? "UP" : "DOWN"}
                      </span>
                    </p>
                    <p className="flex items-center justify-between text-sm">
                      <span>Course Service</span>
                      <span className={courseHealth?.status === "UP" ? "text-emerald-500 font-semibold" : "text-red-500 font-semibold"}>
                        {courseHealth?.status === "UP" ? "UP" : "DOWN"}
                      </span>
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Student Requests Section */}
              {pendingRequests.length > 0 && (
                <Card className="border-l-4 border-l-accent">
                  <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <UserPlus className="h-5 w-5 text-accent" />
                      Demandes d'Inscription ({pendingRequests.length})
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => refetchRequests()}
                      disabled={isRefetchingRequests}
                    >
                      <RefreshCw className={`h-4 w-4 ${isRefetchingRequests ? "animate-spin" : ""}`} />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="max-h-64">
                      <div className="space-y-3">
                        {pendingRequests.map((request) => (
                          <div
                            key={request.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border"
                          >
                            <div>
                              <p className="font-medium text-foreground">
                                {request.firstName} {request.lastName}
                              </p>
                              <p className="text-sm text-muted-foreground">{request.email}</p>
                              <p className="text-xs text-muted-foreground">
                                Formation: {(request as any).formation || "Non spécifié"}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-success border-success hover:bg-success/10"
                                onClick={() => approveMutation.mutate(request.id)}
                                disabled={approveMutation.isPending}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approuver
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-destructive border-destructive hover:bg-destructive/10"
                                onClick={() => rejectMutation.mutate(request.id)}
                                disabled={rejectMutation.isPending}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Rejeter
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}

              {/* Students table */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Étudiants
                  </CardTitle>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/dashboard/profile">
                      Gérer les profils
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Matricule</TableHead>
                          <TableHead>Nom & Prénom</TableHead>
                          <TableHead>Programme</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Statut</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {studentsList.map((s: any) => (
                          <TableRow key={s._id ?? s.id}>
                            <TableCell>{s.matricule ?? "-"}</TableCell>
                            <TableCell>
                              {s.firstName} {s.lastName}
                            </TableCell>
                            <TableCell>{s.program ?? "-"}</TableCell>
                            <TableCell>{s.email}</TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  s.status === "active"
                                    ? "bg-success/20 text-success border-success/30"
                                    : "bg-muted text-muted-foreground"
                                }
                              >
                                {s.status ?? "N/A"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {studentsList.length === 0 && (
                      <div className="p-6 text-sm text-muted-foreground">
                        Aucune donnée étudiant trouvée (assurez-vous que le Student Service est en cours
                        d'exécution et que des étudiants existent).
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              {/* Welcome Section */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                    Bonjour, {user?.firstName ?? "Étudiant"}
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Voici un aperçu de votre activité académique
                  </p>
                </div>
                <Badge variant="outline" className="gap-2 py-1.5 w-fit">
                  <Clock className="h-4 w-4" />
                  Semestre 1 - 2024/2025
                </Badge>
              </div>

              {/* Bento Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                {/* Large Card - Next Scheduled Class */}
                <Card className="lg:col-span-2 border-l-4 border-l-accent">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items_center gap-2">
                      <CalendarDays className="h-5 w-5 text-accent" />
                      Prochain Cours
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground">
                          Architecture des Ordinateurs
                        </h3>
                        <p className="text-muted-foreground mt-1">Mme Ghada Feki</p>
                        <div className="flex flex-wrap items-center gap-4 mt-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-primary" />
                            <span className="font-medium">08:30 - 10:00</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span className="font-medium">Amphi A</span>
                          </div>
                          <Badge className="bg-accent text-accent-foreground">
                            Cours Magistral
                          </Badge>
                        </div>
                      </div>
                      <Button asChild className="shrink-0">
                        <Link to="/dashboard/schedule">
                          Voir l'emploi du temps
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Small Card - Billing Status */}
                <Card className="border-l-4 border-l-destructive">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-destructive" />
                      Facturation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Montant Restant</p>
                        <p className="text-2xl font-bold text-foreground">1,200 DT</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-destructive border-destructive">
                          En Attente
                        </Badge>
                        <span className="text-sm text-muted-foreground">Échéance: 20 Dec</span>
                      </div>
                      <Button variant="outline" size="sm" asChild className="w-full">
                        <Link to="/dashboard/billing">Voir les détails</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Medium Card - GPA Evolution */}
                <Card className="lg:col-span-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-success" />
                        Évolution de la Moyenne
                      </CardTitle>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">14.5</p>
                        <p className="text-xs text-success">+0.4 ce semestre</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={gpaData}>
                          <XAxis
                            dataKey="semester"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis
                            domain={[10, 16]}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12 }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="gpa"
                            stroke="hsl(var(--accent))"
                            strokeWidth={3}
                            dot={{ fill: "hsl(var(--accent))", strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      Statistiques
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm text-muted-foreground">Cours Validés</span>
                      <span className="font-bold text-foreground">12/15</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm text-muted-foreground">Présence</span>
                      <span className="font-bold text-success">92%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm text-muted-foreground">Crédits ECTS</span>
                      <span className="font-bold text-foreground">48/60</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions - Student only */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Actions Rapides</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Link
                      to="/dashboard/grades"
                      className="flex flex-col items-center gap-2 p-4 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors group"
                    >
                      <GraduationCap className="h-6 w-6 text-primary" />
                      <span className="font-medium text-sm text-center">Mes Notes</span>
                    </Link>
                    <Link
                      to="/dashboard/schedule"
                      className="flex flex-col items-center gap-2 p-4 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors group"
                    >
                      <CalendarDays className="h-6 w-6 text-accent" />
                      <span className="font-medium text-sm text-center">Emploi du Temps</span>
                    </Link>
                    <Link
                      to="/dashboard/courses"
                      className="flex flex-col items-center gap-2 p-4 rounded-lg bg-success/10 hover:bg-success/20 transition-colors group"
                    >
                      <BookOpen className="h-6 w-6 text-success" />
                      <span className="font-medium text-sm text-center">Mes Cours</span>
                    </Link>
                    <Link
                      to="/dashboard/billing"
                      className="flex flex-col items-center gap-2 p-4 rounded-lg bg-destructive/10 hover:bg-destructive/20 transition-colors group"
                    >
                      <FileText className="h-6 w-6 text-destructive" />
                      <span className="font-medium text-sm text-center">Mes Factures</span>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bell className="h-5 w-5 text-accent" />
                    Notifications Récentes
                  </CardTitle>
                  <Button variant="ghost" size="sm">
                    Voir tout <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${
                        notif.unread ? "bg-primary/5 border-l-4 border-l-primary" : "bg-muted/30"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          notif.unread ? "bg-accent" : "bg-muted-foreground/30"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm">{notif.title}</p>
                        <p className="text-muted-foreground text-sm truncate">{notif.message}</p>
                        <p className="text-muted-foreground/60 text-xs mt-1">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default Dashboard;
