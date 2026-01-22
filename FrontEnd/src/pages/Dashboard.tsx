import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useState } from "react";
import AiFloatingButton from "@/components/ai/AiFloatingButton";
import AiChatWindow from "@/components/ai/AiChatWindow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
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
  CheckCircle,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import {
  fetchStudentList,
  fetchBillingHealth,
  fetchCourseWsdl,
  fetchAuthHealth,
  fetchStudentHealth,
  fetchGradeHealth,
} from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

const gpaData = [
  { semester: "S1", gpa: 12.5 },
  { semester: "S2", gpa: 13.2 },
  { semester: "S3", gpa: 13.8 },
  { semester: "S4", gpa: 14.1 },
  { semester: "S5", gpa: 14.5 },
];

const Dashboard = () => {
  const { user, accessToken } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Health Queries
  const { data: authHealth } = useQuery({ queryKey: ["auth-health"], queryFn: fetchAuthHealth });
  const { data: studentHealth } = useQuery({ queryKey: ["student-health"], queryFn: fetchStudentHealth });
  const { data: courseHealth } = useQuery({ queryKey: ["course-health"], queryFn: fetchCourseWsdl });
  const { data: billingHealth } = useQuery({ queryKey: ["billing-health"], queryFn: fetchBillingHealth });
  const { data: gradeHealth } = useQuery({ queryKey: ["grade-health"], queryFn: fetchGradeHealth });

  const { data: students } = useQuery({
    queryKey: ["students-list"],
    enabled: isAdmin && !!accessToken,
    queryFn: () => fetchStudentList(accessToken!),
  });

  const studentsList = Array.isArray(students) ? students : [];

  return (
    <>
      <Helmet>
        <title>Tableau de Bord | UniPortal Premium</title>
      </Helmet>

      <AiFloatingButton onClick={() => setIsChatOpen(!isChatOpen)} isOpen={isChatOpen} />
      <AiChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <DashboardLayout>
        <div className="space-y-10 animate-fade-in pb-12">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
                <Zap className="h-3 w-3" /> Espace {isAdmin ? "Administration" : "Étudiant"}
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-[#0f172a] dark:text-white">
                Ravi de vous voir, {user?.firstName} !
              </h1>
              <p className="text-slate-500 font-medium">
                {isAdmin 
                  ? "Aperçu global de l'écosystème universitaire et état des services."
                  : "Voici un résumé de votre progression et de vos prochaines échéances."}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
               <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold overflow-hidden ring-2 ring-transparent hover:ring-primary transition-all cursor-pointer">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="avatar" />
                    </div>
                  ))}
               </div>
               <p className="text-xs font-bold text-slate-400 ml-2 uppercase tracking-widest leading-none">
                 +1.2k <br/>étudiants
               </p>
            </div>
          </div>

          {isAdmin ? (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Service Health Cards */}
              <div className="xl:col-span-1 space-y-6">
                 <Card className="hover-glow overflow-hidden border-none shadow-2xl bg-[#0f172a] text-white">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-bold uppercase tracking-widest opacity-60 flex items-center gap-2">
                        <Activity className="h-4 w-4" /> État des Services
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                      {[
                        { name: "Authentification", status: authHealth?.status },
                        { name: "Base Étudiants", status: studentHealth?.status },
                        { name: "Gestion de Cours", status: courseHealth?.status },
                        { name: "Facturation (SOAP)", status: billingHealth?.status },
                        { name: "Notes & Examens", status: gradeHealth?.status },
                      ].map((s, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                          <span className="text-sm font-semibold">{s.name}</span>
                          <Badge className={cn(
                            "rounded-full px-3",
                            s.status === "UP" ? "bg-emerald-500/20 text-emerald-400 border-none" : "bg-rose-500/20 text-rose-400 border-none"
                          )}>
                            {s.status === "UP" ? "Opérationnel" : "Incident"}
                          </Badge>
                        </div>
                      ))}
                    </CardContent>
                 </Card>

                 <Card className="hover-glow overflow-hidden border-none shadow-xl bg-white dark:bg-slate-900">
                    <CardHeader>
                       <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Total étudiants</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-end justify-between">
                       <h3 className="text-5xl font-black text-[#0f172a] dark:text-white">{studentsList.length}</h3>
                       <div className="text-right">
                          <p className="text-emerald-500 font-bold flex items-center justify-end gap-1">
                             <TrendingUp className="h-4 w-4" /> +12%
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">ce mois-ci</p>
                       </div>
                    </CardContent>
                 </Card>
              </div>

              {/* Students Table */}
              <div className="xl:col-span-2">
                <Card className="border-none shadow-2xl overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem]">
                  <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 p-8">
                    <CardTitle className="text-xl font-bold flex items-center gap-3">
                      <Users className="h-6 w-6 text-primary" /> Liste des Étudiants
                    </CardTitle>
                    <Button variant="outline" className="rounded-xl font-bold border-2">Tout voir</Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                        <TableRow className="border-none">
                          <TableHead className="font-bold uppercase text-[10px] tracking-widest px-8">Matricule</TableHead>
                          <TableHead className="font-bold uppercase text-[10px] tracking-widest">Nom & Prénom</TableHead>
                          <TableHead className="font-bold uppercase text-[10px] tracking-widest">Email</TableHead>
                          <TableHead className="font-bold uppercase text-[10px] tracking-widest px-8 text-right">Statut</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {studentsList.slice(0, 6).map((s: any) => (
                          <TableRow key={s.id || s._id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                            <TableCell className="px-8 font-mono text-xs font-bold text-slate-400">{s.matricule || "N/A"}</TableCell>
                            <TableCell className="font-bold">{s.firstName} {s.lastName}</TableCell>
                            <TableCell className="text-slate-500 font-medium">{s.email}</TableCell>
                            <TableCell className="px-8 text-right">
                              <Badge className={cn(
                                "rounded-full px-3 font-bold text-[10px]",
                                s.status === 'active' ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none" : "bg-slate-100 dark:bg-slate-800 text-slate-400 border-none"
                              )}>
                                {s.status?.toUpperCase() || "PENDING"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Stats Grid */}
              <div className="lg:col-span-3 space-y-8">
                 {/* Top Summary Cards */}
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <Card className="border-none shadow-xl transition-all hover:-translate-y-1">
                       <CardContent className="p-6 space-y-2">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                             <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Cours Validés</p>
                          <h4 className="text-3xl font-black">12 / 15</h4>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                             <div className="bg-primary h-full rounded-full w-[80%]" />
                          </div>
                       </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl transition-all hover:-translate-y-1">
                       <CardContent className="p-6 space-y-2">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                             <Clock className="h-5 w-5 text-amber-500" />
                          </div>
                          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Présence</p>
                          <h4 className="text-3xl font-black">94.2 %</h4>
                          <p className="text-xs font-bold text-emerald-500">+2.1% vs S1</p>
                       </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl transition-all hover:-translate-y-1">
                       <CardContent className="p-6 space-y-2">
                          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                             <GraduationCap className="h-5 w-5 text-purple-500" />
                          </div>
                          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Crédits ECTS</p>
                          <h4 className="text-3xl font-black">48 / 60</h4>
                          <p className="text-xs font-bold text-slate-400 tracking-tight">Objectif : Diplôme Juin 2026</p>
                       </CardContent>
                    </Card>
                 </div>

                 {/* GPA Chart Area */}
                 <Card className="border-none shadow-2xl overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem]">
                    <CardHeader className="p-8 pb-0 flex flex-row items-center justify-between">
                       <div>
                          <CardTitle className="text-2xl font-black">Évolution Académique</CardTitle>
                          <p className="text-slate-500 font-medium">Votre moyenne générale par semestre.</p>
                       </div>
                       <div className="text-right">
                          <h4 className="text-4xl font-black text-primary">14.50</h4>
                          <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Moyenne S5</p>
                       </div>
                    </CardHeader>
                    <CardContent className="p-8 h-[300px]">
                       <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={gpaData}>
                           <defs>
                             <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                               <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                             </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                           <XAxis dataKey="semester" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700 }} />
                           <YAxis hide domain={[10, 16]} />
                           <Tooltip 
                              contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                              itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 800 }}
                           />
                           <Area 
                              type="monotone" 
                              dataKey="gpa" 
                              stroke="hsl(var(--primary))" 
                              strokeWidth={4} 
                              fillOpacity={1} 
                              fill="url(#colorGpa)" 
                              dot={{ r: 6, fill: 'white', stroke: 'hsl(var(--primary))', strokeWidth: 3 }}
                              activeDot={{ r: 8, strokeWidth: 0 }}
                           />
                         </AreaChart>
                       </ResponsiveContainer>
                    </CardContent>
                 </Card>

                 {/* Next Class Area */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="border-none shadow-xl bg-primary text-white overflow-hidden relative group">
                       <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700" />
                       <CardContent className="p-8 space-y-6 relative z-10">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-widest">
                             <Clock className="h-3 w-3" /> Maintenant
                          </div>
                          <div className="space-y-1">
                             <h4 className="text-2xl font-black leading-tight">Architecture des Systèmes</h4>
                             <p className="opacity-80 font-medium">Dr. Ahmed Ben Salem • Amphi A</p>
                          </div>
                          <Button variant="secondary" className="w-full h-12 rounded-xl font-bold">
                             Rejoindre la séance
                          </Button>
                       </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                       <CardContent className="p-8 space-y-6">
                          <div className="flex items-center justify-between">
                             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Facturation</p>
                             <Badge className="bg-rose-500/10 text-rose-600 border-none font-bold">IMPAYÉ</Badge>
                          </div>
                          <div className="space-y-1">
                             <h4 className="text-2xl font-black text-[#0f172a] dark:text-white">1,200 DT</h4>
                             <p className="text-sm font-medium text-slate-500">Échéance : 25 Janvier 2026</p>
                          </div>
                          <Link to="/dashboard/billing">
                            <Button variant="outline" className="w-full h-12 rounded-xl font-bold border-2">
                               Régler maintenant
                            </Button>
                          </Link>
                       </CardContent>
                    </Card>
                 </div>
              </div>

              {/* Sidebar Info Area */}
              <div className="lg:col-span-1 space-y-8">
                 <Card className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-[2rem]">
                    <CardHeader className="p-6 pb-2 border-b border-slate-100 dark:border-slate-800">
                       <CardTitle className="text-lg font-bold flex items-center gap-2">
                          <Bell className="h-unit-5 w-5 text-accent" /> Notifications
                       </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                       <ScrollArea className="h-80 pr-4">
                          <div className="space-y-4">
                             {[
                               { title: "Nouveau document", sub: "Génie Logiciel - Support de cours S2", time: "10m ago", icon: FileText, color: "text-blue-500" },
                               { title: "Note publiée", sub: "Bases de Données (Examen)", time: "2h ago", icon: GraduationCap, color: "text-purple-500" },
                               { title: "Evenement", sub: "Hackathon UniPortal 2026", time: "Hier", icon: Zap, color: "text-amber-500" },
                               { title: "Facture générée", sub: "Frais inscription S2", time: "Hier", icon: CreditCard, color: "text-rose-500" },
                             ].map((n, i) => (
                               <div key={i} className="flex gap-4 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
                                  <div className={cn("w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0", n.color)}>
                                     <n.icon className="h-5 w-5" />
                                  </div>
                                  <div className="min-w-0">
                                     <h5 className="text-sm font-bold group-hover:text-primary transition-colors">{n.title}</h5>
                                     <p className="text-xs text-slate-500 truncate">{n.sub}</p>
                                     <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{n.time}</p>
                                  </div>
                               </div>
                             ))}
                          </div>
                       </ScrollArea>
                    </CardContent>
                 </Card>

                 <Card className="border-none shadow-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-[2rem] overflow-hidden relative">
                    <div className="absolute bottom-[-10%] left-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                    <CardContent className="p-8 text-center space-y-4">
                       <div className="w-16 h-16 bg-white/20 rounded-2xl mx-auto flex items-center justify-center">
                          <Users className="h-8 w-8" />
                       </div>
                       <h4 className="text-xl font-bold">Besoin d'aide ?</h4>
                       <p className="text-sm opacity-80 leading-relaxed font-medium">Contacter le support étudiant ou consulter la base de connaissances.</p>
                       <Button variant="secondary" className="w-full h-12 rounded-xl font-bold text-primary">
                          Contacter le Support
                       </Button>
                    </CardContent>
                 </Card>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default Dashboard;
