import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown, Users, Search } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { fetchStudentAverage, fetchStudentGrades, fetchAllGrades, fetchStudentList } from "@/lib/api";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface ApiGrade {
  id?: string;
  course_id?: string;
  student_id?: string;
  grade?: number;
  feedback?: string;
}

const getGradeBadge = (grade: number) => {
  if (grade >= 14) {
    return <Badge className="bg-success/20 text-success border-success/30">{grade.toFixed(1)}</Badge>;
  } else if (grade >= 10) {
    return <Badge className="bg-accent/20 text-accent border-accent/30">{grade.toFixed(1)}</Badge>;
  } else {
    return <Badge className="bg-destructive/20 text-destructive border-destructive/30">{grade.toFixed(1)}</Badge>;
  }
};

const Grades = () => {
  const { user, accessToken } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  const studentId = user?.id?.toString() ?? "";

  // Admin: fetch all students for dropdown
  const { data: students } = useQuery({
    queryKey: ["students-list"],
    enabled: isAdmin && !!accessToken,
    queryFn: () => fetchStudentList(accessToken!),
  });

  const studentsList = Array.isArray(students) ? students : [];

  // Admin: fetch all grades or filtered by student
  const { data: allGrades, isLoading: isLoadingAll } = useQuery({
    queryKey: ["all-grades", selectedStudent],
    enabled: isAdmin && !!accessToken,
    queryFn: async () => {
      const data = await fetchAllGrades(accessToken!);
      return data as ApiGrade[];
    },
  });

  // Student: fetch own grades
  const { data: apiGrades, isLoading } = useQuery({
    queryKey: ["grades", studentId],
    enabled: !isAdmin && !!accessToken && !!studentId,
    queryFn: async () => {
      const data = await fetchStudentGrades(studentId, accessToken!);
      return data as ApiGrade[];
    },
  });

  const { data: avgData } = useQuery({
    queryKey: ["grades-average", studentId],
    enabled: !isAdmin && !!accessToken && !!studentId,
    queryFn: async () => {
      const data = await fetchStudentAverage(studentId, accessToken!);
      return data as { average?: number; total_courses?: number };
    },
  });

  // Fallback to static sample if API not available
  const displayGrades =
    apiGrades && apiGrades.length > 0
      ? apiGrades.map((g) => ({
          module: g.course_id ?? "Cours",
          coef: 1,
          cc: g.grade ?? 0,
          ds: g.grade ?? 0,
          exam: g.grade ?? 0,
          average: g.grade ?? 0,
        }))
      : [
          { module: "Architecture des Ordinateurs", coef: 3, cc: 14, ds: 13, exam: 15, average: 14.2 },
          { module: "Génie Logiciel", coef: 4, cc: 16, ds: 15, exam: 14, average: 14.8 },
          { module: "Bases de Données Avancées", coef: 3, cc: 12, ds: 11, exam: 13, average: 12.2 },
          { module: "Réseaux Informatiques", coef: 3, cc: 15, ds: 14, exam: 16, average: 15.1 },
        ];

  const totalCoef = displayGrades.reduce((sum, g) => sum + g.coef, 0);
  const weightedAvg = displayGrades.reduce((sum, g) => sum + g.average * g.coef, 0) / (totalCoef || 1);

  const gpaData = [
    { semester: "S1", gpa: weightedAvg || 12.5 },
    { semester: "S2", gpa: (weightedAvg || 12.5) + 0.5 },
    { semester: "S3", gpa: (weightedAvg || 12.5) + 0.8 },
    { semester: "S4", gpa: (weightedAvg || 12.5) + 1.0 },
    { semester: "S5", gpa: (weightedAvg || 12.5) + 1.2 },
  ];

  // Filter grades for admin view
  const filteredGrades = isAdmin
    ? (Array.isArray(allGrades) ? allGrades : []).filter((g) => {
        if (selectedStudent && selectedStudent !== "__all__" && g.student_id !== selectedStudent) return false;
        return true;
      })
    : [];

  return (
    <>
      <Helmet>
        <title>{isAdmin ? "Notes Étudiants" : "Mes Notes"} - UniPortal</title>
      </Helmet>

      <DashboardLayout>
        <div className="space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                {isAdmin ? "Notes des Étudiants" : "Mes Notes & Résultats"}
              </h1>
              <p className="text-muted-foreground mt-1">
                {isAdmin ? "Gérer et consulter les notes de tous les étudiants" : "Semestre 1 - Année 2024/2025"}
              </p>
            </div>
            
            {isAdmin && (
              <div className="flex gap-3">
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger className="w-[250px]">
                    <SelectValue placeholder="Filtrer par étudiant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">Tous les étudiants</SelectItem>
                    {studentsList
                      .filter((s: any) => s._id || s.id)
                      .map((s: any) => (
                        <SelectItem key={s._id || s.id} value={String(s._id || s.id)}>
                          {s.firstName} {s.lastName}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card variant="elevated">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Moyenne Générale</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {(avgData?.average ?? weightedAvg).toFixed(2)}
                </p>
                <div className="flex items-center gap-1 mt-2 text-success text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span>+0.4 vs S4</span>
                </div>
              </CardContent>
            </Card>
            <Card variant="elevated">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Modules Validés</p>
                <p className="text-3xl font-bold text-foreground mt-1">{displayGrades.filter(g => g.average >= 10).length}/{displayGrades.length}</p>
                <div className="text-success text-sm mt-2">Excellent</div>
              </CardContent>
            </Card>
            <Card variant="elevated">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Meilleure Note</p>
                <p className="text-3xl font-bold text-foreground mt-1">{Math.max(...displayGrades.map(g => g.average)).toFixed(1)}</p>
                <div className="text-muted-foreground text-sm mt-2 truncate">Programmation Web</div>
              </CardContent>
            </Card>
            <Card variant="elevated">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Rang</p>
                <p className="text-3xl font-bold text-foreground mt-1">5<span className="text-lg">ème</span></p>
                <div className="text-muted-foreground text-sm mt-2">sur 45 étudiants</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Grades Table */}
            <Card variant="elevated" className="lg:col-span-2 overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg">Détail des Notes</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  {isLoading ? (
                    <div className="p-6">
                      <SkeletonLoader />
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-semibold">Module</TableHead>
                          <TableHead className="text-center font-semibold">Coef</TableHead>
                          <TableHead className="text-center font-semibold">CC</TableHead>
                          <TableHead className="text-center font-semibold">DS</TableHead>
                          <TableHead className="text-center font-semibold">Examen</TableHead>
                          <TableHead className="text-center font-semibold">Moyenne</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {displayGrades.map((grade) => (
                          <TableRow key={grade.module} className="hover:bg-muted/30">
                            <TableCell className="font-medium">{grade.module}</TableCell>
                            <TableCell className="text-center">{grade.coef}</TableCell>
                            <TableCell className="text-center">{grade.cc}</TableCell>
                            <TableCell className="text-center">{grade.ds}</TableCell>
                            <TableCell className="text-center">{grade.exam}</TableCell>
                            <TableCell className="text-center">{getGradeBadge(grade.average)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* GPA Chart */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="text-lg">Évolution de la Moyenne</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={gpaData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="semester" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis domain={[10, 18]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "12px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="gpa"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 5 }}
                        activeDot={{ r: 7, fill: "hsl(var(--accent))" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default Grades;
