import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  GraduationCap,
  CreditCard,
  User,
  BookOpen,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Mail,
  Phone,
  MapPin,
  Building2,
  FileText,
  RefreshCw,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import {
  fetchStudentGrades,
  fetchStudentAverage,
  fetchInvoices,
  fetchBalance,
  fetchStudentById,
} from "@/lib/api";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { SkeletonLoader } from "@/components/SkeletonLoader";

// Fallback data
const fallbackGrades = [
  { module: "Architecture des Ordinateurs", ds: 15.5, exam: 14.0, tp: 16.0, average: 15.0, coefficient: 2 },
  { module: "Génie Logiciel", ds: 14.0, exam: 15.5, tp: 14.5, average: 14.8, coefficient: 3 },
  { module: "Bases de Données Avancées", ds: 16.0, exam: 15.0, tp: 17.0, average: 16.0, coefficient: 2 },
  { module: "Réseaux Informatiques", ds: 13.5, exam: 14.0, tp: 15.0, average: 14.1, coefficient: 2 },
  { module: "Programmation Web", ds: 17.0, exam: 16.5, tp: 18.0, average: 17.1, coefficient: 3 },
  { module: "Intelligence Artificielle", ds: 12.0, exam: 13.5, tp: 14.0, average: 13.1, coefficient: 2 },
];

const fallbackSemesterData = [
  { semester: "S1", gpa: 12.5 },
  { semester: "S2", gpa: 13.2 },
  { semester: "S3", gpa: 13.8 },
  { semester: "S4", gpa: 14.1 },
  { semester: "S5", gpa: 14.8 },
];

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat("fr-TN", { minimumFractionDigits: 0 }).format(amount) + " DT";
};

const StudentExtranet = () => {
  const { user, accessToken } = useAuth();
  const studentId = user?.id?.toString() || "";

  // Fetch student profile
  const { data: studentProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["student-profile", studentId],
    queryFn: () => fetchStudentById(studentId, accessToken!),
    enabled: !!accessToken && !!studentId,
  });

  // Fetch grades
  const { data: apiGrades, isLoading: isLoadingGrades, refetch: refetchGrades, isRefetching: isRefetchingGrades } = useQuery({
    queryKey: ["extranet-grades", studentId],
    queryFn: () => fetchStudentGrades(studentId, accessToken!),
    enabled: !!accessToken && !!studentId,
  });

  // Fetch averages
  const { data: averagesData } = useQuery({
    queryKey: ["extranet-averages", studentId],
    queryFn: () => fetchStudentAverage(studentId, accessToken!),
    enabled: !!accessToken && !!studentId,
  });

  // Fetch billing
  const { data: invoices, isLoading: isLoadingBilling } = useQuery({
    queryKey: ["extranet-invoices", studentId],
    queryFn: () => fetchInvoices(studentId, accessToken!),
    enabled: !!accessToken && !!studentId,
  });

  const { data: balanceData } = useQuery({
    queryKey: ["extranet-balance", studentId],
    queryFn: () => fetchBalance(studentId, accessToken!),
    enabled: !!accessToken && !!studentId,
  });

  // Transform grades for display
  const grades = apiGrades && apiGrades.length > 0
    ? apiGrades.map((g: any) => ({
        module: g.courseName || g.module,
        ds: g.ds || g.dsGrade || 0,
        exam: g.exam || g.examGrade || 0,
        tp: g.tp || g.tpGrade || 0,
        average: g.average || g.finalGrade || 0,
        coefficient: g.coefficient || g.credits || 1,
      }))
    : fallbackGrades;

  // Calculate summary stats
  const overallAverage = averagesData?.average || 
    (grades.reduce((sum, g) => sum + g.average * g.coefficient, 0) / grades.reduce((sum, g) => sum + g.coefficient, 0)).toFixed(2);
  const validatedModules = grades.filter((g) => g.average >= 10).length;
  const highestGrade = Math.max(...grades.map((g) => g.average));
  const totalCredits = grades.reduce((sum, g) => g.average >= 10 ? sum + g.coefficient : sum, 0);

  // Billing summary
  const billingInvoices = invoices || [];
  const totalPaid = billingInvoices.filter((i) => i.status === "paid").reduce((sum, i) => sum + i.amount, 0);
  const totalPending = billingInvoices.filter((i) => i.status === "pending").reduce((sum, i) => sum + i.amount, 0);
  const totalAmount = billingInvoices.reduce((sum, i) => sum + i.amount, 0);
  const paymentProgress = totalAmount > 0 ? Math.round((totalPaid / totalAmount) * 100) : 0;

  return (
    <>
      <Helmet>
        <title>Mon Espace Étudiant - UniPortal</title>
      </Helmet>

      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                Mon Espace Étudiant
              </h1>
              <p className="text-muted-foreground mt-1">
                Bienvenue, {user?.firstName || "Étudiant"} - Consultez vos résultats et votre situation financière
              </p>
            </div>
            <Badge variant="outline" className="gap-2 py-1.5 w-fit">
              <Calendar className="h-4 w-4" />
              Année académique 2024/2025
            </Badge>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{overallAverage}</p>
                    <p className="text-xs text-muted-foreground">Moyenne Générale</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/20">
                    <CheckCircle className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{validatedModules}/{grades.length}</p>
                    <p className="text-xs text-muted-foreground">Modules Validés</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/20">
                    <BookOpen className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{totalCredits}</p>
                    <p className="text-xs text-muted-foreground">Crédits ECTS</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <CreditCard className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{paymentProgress}%</p>
                    <p className="text-xs text-muted-foreground">Paiements</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="grades" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="grades" className="gap-2">
                <GraduationCap className="h-4 w-4" />
                <span className="hidden sm:inline">Notes</span>
              </TabsTrigger>
              <TabsTrigger value="billing" className="gap-2">
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Finances</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profil</span>
              </TabsTrigger>
            </TabsList>

            {/* Grades Tab */}
            <TabsContent value="grades" className="mt-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Relevé de Notes - Semestre 5</h2>
                <Button variant="outline" size="sm" onClick={() => refetchGrades()} disabled={isRefetchingGrades}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefetchingGrades ? "animate-spin" : ""}`} />
                  Actualiser
                </Button>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Grades Table */}
                <Card className="lg:col-span-2">
                  <CardContent className="p-0">
                    {isLoadingGrades ? (
                      <div className="p-6"><SkeletonLoader /></div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="text-left p-3 text-sm font-medium">Module</th>
                              <th className="text-center p-3 text-sm font-medium">DS</th>
                              <th className="text-center p-3 text-sm font-medium">Exam</th>
                              <th className="text-center p-3 text-sm font-medium">TP</th>
                              <th className="text-center p-3 text-sm font-medium">Moy</th>
                              <th className="text-center p-3 text-sm font-medium">Coef</th>
                            </tr>
                          </thead>
                          <tbody>
                            {grades.map((grade, index) => (
                              <tr key={index} className="border-t border-border hover:bg-muted/30">
                                <td className="p-3 text-sm font-medium">{grade.module}</td>
                                <td className="p-3 text-sm text-center">{grade.ds.toFixed(1)}</td>
                                <td className="p-3 text-sm text-center">{grade.exam.toFixed(1)}</td>
                                <td className="p-3 text-sm text-center">{grade.tp.toFixed(1)}</td>
                                <td className="p-3 text-sm text-center">
                                  <span className={`font-semibold ${grade.average >= 10 ? "text-success" : "text-destructive"}`}>
                                    {grade.average.toFixed(2)}
                                  </span>
                                </td>
                                <td className="p-3 text-sm text-center">{grade.coefficient}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* GPA Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      Évolution des Moyennes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={fallbackSemesterData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="semester" tick={{ fontSize: 12 }} />
                        <YAxis domain={[10, 20]} tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="gpa" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))" }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Billing Tab */}
            <TabsContent value="billing" className="mt-6 space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="border-l-4 border-l-success">
                  <CardContent className="p-4 flex items-center gap-3">
                    <CheckCircle className="h-8 w-8 text-success" />
                    <div>
                      <p className="text-2xl font-bold">{formatAmount(balanceData?.totalPaid || totalPaid)}</p>
                      <p className="text-sm text-muted-foreground">Payé</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-accent">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Clock className="h-8 w-8 text-accent" />
                    <div>
                      <p className="text-2xl font-bold">{formatAmount(totalPending)}</p>
                      <p className="text-sm text-muted-foreground">En Attente</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-destructive">
                  <CardContent className="p-4 flex items-center gap-3">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                    <div>
                      <p className="text-2xl font-bold">{formatAmount(balanceData?.balance || totalPending)}</p>
                      <p className="text-sm text-muted-foreground">Solde Dû</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Payment Progress */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-medium">Progression des Paiements</p>
                    <p className="text-primary font-semibold">{paymentProgress}%</p>
                  </div>
                  <Progress value={paymentProgress} className="h-3" />
                  <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                    <span>{formatAmount(totalPaid)} payés</span>
                    <span>{formatAmount(totalAmount)} total</span>
                  </div>
                </CardContent>
              </Card>

              {/* Invoices List */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Historique des Factures
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {isLoadingBilling ? (
                    <SkeletonLoader />
                  ) : billingInvoices.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">Aucune facture</p>
                  ) : (
                    billingInvoices.map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
                        <div>
                          <p className="font-medium">{invoice.description}</p>
                          <p className="text-sm text-muted-foreground">{invoice.id}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="font-semibold">{formatAmount(invoice.amount)}</p>
                            <Badge variant={invoice.status === "paid" ? "default" : "secondary"} className="text-xs">
                              {invoice.status === "paid" ? "Payé" : "En Attente"}
                            </Badge>
                          </div>
                          <Button variant="outline" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Informations Personnelles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingProfile ? (
                    <SkeletonLoader />
                  ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <User className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Nom complet</p>
                            <p className="font-medium">
                              {studentProfile?.firstName || user?.firstName} {studentProfile?.lastName || user?.lastName}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium">{studentProfile?.email || user?.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Téléphone</p>
                            <p className="font-medium">{(studentProfile as any)?.phone || "+216 XX XXX XXX"}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <GraduationCap className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Formation</p>
                            <p className="font-medium">{(studentProfile as any)?.formation || "Licence Sciences Informatiques"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Building2 className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Niveau</p>
                            <p className="font-medium">{(studentProfile as any)?.level || "3ème année (L3)"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Numéro étudiant</p>
                            <p className="font-medium">{(studentProfile as any)?.studentNumber || studentId || "STU-2024-001"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </>
  );
};

export default StudentExtranet;
