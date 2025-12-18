"use client";

import { useState, useEffect } from "react";
import { api } from "~/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  BookOpen,
  Calendar,
  Clock,
  Award,
  Loader2,
  FileText,
  Check,
  UserCheck,
  BarChart2,
  Activity,
  CreditCard,
  PieChart,
  GraduationCap,
  Users,
  ClipboardCheck,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Pie,
  PieChart as RechartsPieChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";

interface StudentStatistics {
  formation_stats: {
    total_formations: number;
    active_formations: number;
    completed_formations: number;
    upcoming_formations: number;
  };
  session_stats: {
    total_sessions: number;
    active_sessions: number;
    upcoming_sessions: number;
    completed_sessions: number;
    sessions_by_month: Array<{ month: number; count: number }>;
  };
  attendance_stats: {
    total_attendances: number;
    present_count: number;
    absent_count: number;
    late_count: number;
    excused_count: number;
    attendance_rate: number;
    recent_attendance: Array<{
      id: number;
      date: string;
      status: string;
      session: {
        id: number;
        title: string;
        formation: {
          id: number;
          name: string;
        } | null;
      } | null;
    }>;
  };
  certification_stats: {
    total_certifications: number;
    completed_certifications: number;
    passed_certifications: number;
    certification_success_rate: number;
  };
  quiz_stats: {
    total_quizzes: number;
    average_score: number;
    best_score: number;
    recent_quizzes: Array<{
      id: number;
      score: number;
      completed: boolean;
      updated_at: string;
      trackable: {
        id: number;
        title: string;
      } | null;
    }>;
  };
  payment_stats: {
    total_payments: number;
    total_amount: string;
    pending_payments: number;
    completed_payments: number;
    recent_payments: Array<{
      id: number;
      amount: string;
      status: string;
      payment_date: string;
      formation: {
        id: number;
        name: string;
      } | null;
    }>;
  };
}

interface ApiResponse {
  statistics: StudentStatistics;
}

export default function StudentDashboard() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get<ApiResponse>(
          "/api/v1/student/statistics"
        );
        setData(response.data);
        console.log(response.data);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Une erreur est survenue")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Chargement de vos statistiques...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-destructive text-xl">
          Une erreur est survenue lors du chargement de vos données
        </div>
      </div>
    );
  }

  if (!data || !data.statistics) return null;

  const stats = data.statistics;

  // Format month numbers to month names
  const monthNames = [
    "Jan",
    "Fév",
    "Mar",
    "Avr",
    "Mai",
    "Juin",
    "Juil",
    "Août",
    "Sep",
    "Oct",
    "Nov",
    "Déc",
  ];

  // Prepare data for charts with null checks
  const sessionsByMonthData = (
    stats.session_stats?.sessions_by_month || []
  ).map((item) => ({
    name: monthNames[(item.month || 1) - 1] || "Inconnu",
    count: item.count || 0,
  }));

  const attendanceData = [
    { name: "Présent", value: stats.attendance_stats?.present_count || 0 },
    { name: "Absent", value: stats.attendance_stats?.absent_count || 0 },
    { name: "Retard", value: stats.attendance_stats?.late_count || 0 },
    { name: "Excusé", value: stats.attendance_stats?.excused_count || 0 },
  ];

  const formationStatusData = [
    { name: "Actives", value: stats.formation_stats?.active_formations || 0 },
    {
      name: "Terminées",
      value: stats.formation_stats?.completed_formations || 0,
    },
    { name: "À venir", value: stats.formation_stats?.upcoming_formations || 0 },
  ];

  const sessionStatusData = [
    { name: "Actives", value: stats.session_stats?.active_sessions || 0 },
    { name: "Terminées", value: stats.session_stats?.completed_sessions || 0 },
    { name: "À venir", value: stats.session_stats?.upcoming_sessions || 0 },
  ];

  const certificationData = [
    {
      name: "Réussies",
      value: stats.certification_stats?.passed_certifications || 0,
    },
    {
      name: "Échouées",
      value:
        (stats.certification_stats?.completed_certifications || 0) -
        (stats.certification_stats?.passed_certifications || 0),
    },
    {
      name: "En cours",
      value:
        (stats.certification_stats?.total_certifications || 0) -
        (stats.certification_stats?.completed_certifications || 0),
    },
  ];

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82ca9d",
    "#ffc658",
  ];

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (e) {
      return "Date invalide";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge className="bg-green-100 text-green-800">Présent</Badge>;
      case "absent":
        return <Badge className="bg-red-100 text-red-800">Absent</Badge>;
      case "late":
        return <Badge className="bg-amber-100 text-amber-800">Retard</Badge>;
      case "excused":
        return <Badge className="bg-blue-100 text-blue-800">Excusé</Badge>;
      default:
        return <Badge>{status || "Inconnu"}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Complété</Badge>;
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-800">En attente</Badge>
        );
      default:
        return <Badge>{status || "Inconnu"}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Tableau de bord étudiant
        </h1>
        <p className="text-muted-foreground">
          Suivez vos formations, sessions, certifications et plus encore
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="formations">Formations</TabsTrigger>
          <TabsTrigger value="attendance">Assiduité</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="quizzes">Quiz</TabsTrigger>
          <TabsTrigger value="payments">Paiements</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Formations totales
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.formation_stats?.total_formations || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.formation_stats?.active_formations || 0} formations
                  actives
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Sessions totales
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.session_stats?.total_sessions || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.session_stats?.completed_sessions || 0} sessions
                  terminées
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Taux d'assiduité
                </CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(stats.attendance_stats?.attendance_rate || 0).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.attendance_stats?.present_count || 0} présences sur{" "}
                  {stats.attendance_stats?.total_attendances || 0} sessions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Certifications
                </CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.certification_stats?.passed_certifications || 0} /{" "}
                  {stats.certification_stats?.total_certifications || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Taux de réussite:{" "}
                  {(
                    stats.certification_stats?.certification_success_rate || 0
                  ).toFixed(1)}
                  %
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Sessions par mois</CardTitle>
                <CardDescription>
                  Répartition de vos sessions sur l'année
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={sessionsByMonthData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="count"
                        fill="#8884d8"
                        name="Nombre de sessions"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Assiduité</CardTitle>
                <CardDescription>
                  Répartition de vos présences et absences
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={attendanceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {attendanceData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Activités récentes</CardTitle>
              <CardDescription>
                Vos dernières activités sur la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm">Présences récentes</h3>
                    <Badge variant="outline">Status</Badge>
                  </div>
                  <ScrollArea className="h-48">
                    <div className="space-y-2">
                      {(stats.attendance_stats?.recent_attendance || []).map(
                        (attendance) => (
                          <div
                            key={attendance.id}
                            className="flex items-center justify-between"
                          >
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">
                                {attendance.session?.formation?.name ||
                                  "Formation inconnue"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(attendance.date)}
                              </span>
                            </div>
                            <div>{getStatusBadge(attendance.status)}</div>
                          </div>
                        )
                      )}
                    </div>
                  </ScrollArea>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm">Quiz récents</h3>
                    <Badge variant="outline">Score</Badge>
                  </div>
                  <ScrollArea className="h-48">
                    <div className="space-y-2">
                      {(stats.quiz_stats?.recent_quizzes || []).map((quiz) => (
                        <div
                          key={quiz.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {quiz.trackable?.title || "Quiz inconnu"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(quiz.updated_at)}
                            </span>
                          </div>
                          <div>
                            <Badge
                              className={`${
                                (quiz.score || 0) >= 70
                                  ? "bg-green-100 text-green-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {(quiz.score || 0).toFixed(0)}%
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm">Paiements récents</h3>
                    <Badge variant="outline">Montant</Badge>
                  </div>
                  <ScrollArea className="h-48">
                    <div className="space-y-2">
                      {(stats.payment_stats?.recent_payments || []).map(
                        (payment) => (
                          <div
                            key={payment.id}
                            className="flex items-center justify-between"
                          >
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">
                                {payment.formation?.name ||
                                  "Formation inconnue"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(payment.payment_date)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                {parseFloat(payment.amount || "0").toFixed(2)}DT
                              </span>
                              {getPaymentStatusBadge(payment.status)}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Formations Tab */}
        <TabsContent value="formations" className="space-y-6">
          {/* Formation Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Formations totales
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.formation_stats?.total_formations || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Toutes vos formations
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Formations actives
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.formation_stats?.active_formations || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Formations en cours
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Formations terminées
                </CardTitle>
                <Check className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.formation_stats?.completed_formations || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Formations achevées
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Formations à venir
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.formation_stats?.upcoming_formations || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Formations planifiées
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Formation Status Chart */}
          <Card>
            <CardHeader>
              <CardTitle>État de vos formations</CardTitle>
              <CardDescription>
                Répartition de vos formations par statut
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={formationStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {formationStatusData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Sessions</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Sessions totales</span>
                        <span className="font-semibold">
                          {stats.session_stats?.total_sessions || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Sessions actives</span>
                        <span className="font-semibold">
                          {stats.session_stats?.active_sessions || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Sessions terminées</span>
                        <span className="font-semibold">
                          {stats.session_stats?.completed_sessions || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Sessions à venir</span>
                        <span className="font-semibold">
                          {stats.session_stats?.upcoming_sessions || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-2">Progression</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Taux de complétion</span>
                        <span className="font-semibold">
                          {stats.session_stats?.total_sessions
                            ? (
                                ((stats.session_stats?.completed_sessions ||
                                  0) /
                                  stats.session_stats.total_sessions) *
                                100
                              ).toFixed(1)
                            : "0"}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{
                            width: stats.session_stats?.total_sessions
                              ? `${
                                  ((stats.session_stats?.completed_sessions ||
                                    0) /
                                    stats.session_stats.total_sessions) *
                                  100
                                }%`
                              : "0%",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sessions by Month */}
          <Card>
            <CardHeader>
              <CardTitle>Sessions par mois</CardTitle>
              <CardDescription>
                Répartition de vos sessions sur l'année
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={sessionsByMonthData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="count"
                      fill="#8884d8"
                      name="Nombre de sessions"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-6">
          {/* Attendance Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Présences totales
                </CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.attendance_stats?.total_attendances || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Sessions enregistrées
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Taux de présence
                </CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(stats.attendance_stats?.attendance_rate || 0).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.attendance_stats?.present_count || 0} présences
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Absences</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.attendance_stats?.absent_count || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.attendance_stats?.excused_count || 0} absences excusées
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Retards</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.attendance_stats?.late_count || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Sessions avec retard
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Attendance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition des présences</CardTitle>
              <CardDescription>
                Vue d'ensemble de votre assiduité
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={attendanceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {attendanceData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              entry.name === "Présent"
                                ? "#4ade80"
                                : entry.name === "Absent"
                                ? "#f87171"
                                : entry.name === "Retard"
                                ? "#facc15"
                                : "#60a5fa"
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Détails</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                          <span>Présent</span>
                        </div>
                        <span className="font-semibold">
                          {stats.attendance_stats?.present_count || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                          <span>Absent</span>
                        </div>
                        <span className="font-semibold">
                          {stats.attendance_stats?.absent_count || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                          <span>Retard</span>
                        </div>
                        <span className="font-semibold">
                          {stats.attendance_stats?.late_count || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                          <span>Excusé</span>
                        </div>
                        <span className="font-semibold">
                          {stats.attendance_stats?.excused_count || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-2">
                      Taux de présence
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Taux global</span>
                        <span className="font-semibold">
                          {(
                            stats.attendance_stats?.attendance_rate || 0
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-green-500 h-2.5 rounded-full"
                          style={{
                            width: `${
                              stats.attendance_stats?.attendance_rate || 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Attendance */}
          <Card>
            <CardHeader>
              <CardTitle>Présences récentes</CardTitle>
              <CardDescription>
                Historique de vos dernières présences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Date</th>
                      <th className="text-left py-2 px-4">Formation</th>
                      <th className="text-left py-2 px-4">Session</th>
                      <th className="text-center py-2 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(stats.attendance_stats?.recent_attendance || []).map(
                      (attendance) => (
                        <tr
                          key={attendance.id}
                          className="border-b hover:bg-muted/50"
                        >
                          <td className="py-2 px-4">
                            {formatDate(attendance.date)}
                          </td>
                          <td className="py-2 px-4">
                            {attendance.session?.formation?.name ||
                              "Formation inconnue"}
                          </td>
                          <td className="py-2 px-4">
                            {attendance.session?.title || "Session inconnue"}
                          </td>
                          <td className="py-2 px-4 text-center">
                            {getStatusBadge(attendance.status)}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certifications Tab */}
        <TabsContent value="certifications" className="space-y-6">
          {/* Certification Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Certifications totales
                </CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.certification_stats?.total_certifications || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Toutes vos certifications
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Certifications complétées
                </CardTitle>
                <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.certification_stats?.completed_certifications || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Certifications terminées
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Certifications réussies
                </CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.certification_stats?.passed_certifications || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Certifications obtenues
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Taux de réussite
                </CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(
                    stats.certification_stats?.certification_success_rate || 0
                  ).toFixed(1)}
                  %
                </div>
                <p className="text-xs text-muted-foreground">
                  Certifications réussies / complétées
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Certification Chart */}
          <Card>
            <CardHeader>
              <CardTitle>État de vos certifications</CardTitle>
              <CardDescription>
                Répartition de vos certifications par statut
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={certificationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {certificationData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              entry.name === "Réussies"
                                ? "#4ade80"
                                : entry.name === "Échouées"
                                ? "#f87171"
                                : "#60a5fa"
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Détails</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                          <span>Réussies</span>
                        </div>
                        <span className="font-semibold">
                          {stats.certification_stats?.passed_certifications ||
                            0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                          <span>Échouées</span>
                        </div>
                        <span className="font-semibold">
                          {(stats.certification_stats
                            ?.completed_certifications || 0) -
                            (stats.certification_stats?.passed_certifications ||
                              0)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                          <span>En cours</span>
                        </div>
                        <span className="font-semibold">
                          {(stats.certification_stats?.total_certifications ||
                            0) -
                            (stats.certification_stats
                              ?.completed_certifications || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-2">
                      Taux de réussite
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Taux global</span>
                        <span className="font-semibold">
                          {(
                            stats.certification_stats
                              ?.certification_success_rate || 0
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-green-500 h-2.5 rounded-full"
                          style={{
                            width: `${
                              stats.certification_stats
                                ?.certification_success_rate || 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Certification Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Progression des certifications</CardTitle>
              <CardDescription>
                Votre avancement dans les certifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Certifications complétées</span>
                    <span className="font-semibold">
                      {stats.certification_stats?.completed_certifications || 0}{" "}
                      / {stats.certification_stats?.total_certifications || 0}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{
                        width: stats.certification_stats?.total_certifications
                          ? `${
                              ((stats.certification_stats
                                ?.completed_certifications || 0) /
                                stats.certification_stats
                                  .total_certifications) *
                              100
                            }%`
                          : "0%",
                      }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Certifications réussies</span>
                    <span className="font-semibold">
                      {stats.certification_stats?.passed_certifications || 0} /{" "}
                      {stats.certification_stats?.total_certifications || 0}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-500 h-2.5 rounded-full"
                      style={{
                        width: stats.certification_stats?.total_certifications
                          ? `${
                              ((stats.certification_stats
                                ?.passed_certifications || 0) /
                                stats.certification_stats
                                  .total_certifications) *
                              100
                            }%`
                          : "0%",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quizzes Tab */}
        <TabsContent value="quizzes" className="space-y-6">
          {/* Quiz Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Quiz totaux
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.quiz_stats?.total_quizzes || 0}
                </div>
                <p className="text-xs text-muted-foreground">Tous vos quiz</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Score moyen
                </CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(stats.quiz_stats?.average_score || 0).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Moyenne de tous vos quiz
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Meilleur score
                </CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(stats.quiz_stats?.best_score || 0).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Votre score le plus élevé
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Quiz récents
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(stats.quiz_stats?.recent_quizzes || []).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Derniers quiz complétés
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quiz Score Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Scores des quiz récents</CardTitle>
              <CardDescription>
                Vos performances sur les derniers quiz
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={(stats.quiz_stats?.recent_quizzes || []).map(
                      (quiz) => ({
                        name: quiz.trackable?.title
                          ? quiz.trackable.title.length > 20
                            ? quiz.trackable.title.substring(0, 20) + "..."
                            : quiz.trackable.title
                          : "Quiz inconnu",
                        score: quiz.score || 0,
                      })
                    )}
                    margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" fill="#8884d8" name="Score (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Quizzes */}
          <Card>
            <CardHeader>
              <CardTitle>Quiz récents</CardTitle>
              <CardDescription>
                Détails de vos derniers quiz complétés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Quiz</th>
                      <th className="text-left py-2 px-4">Date</th>
                      <th className="text-center py-2 px-4">Score</th>
                      <th className="text-center py-2 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(stats.quiz_stats?.recent_quizzes || []).map((quiz) => (
                      <tr key={quiz.id} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-4">
                          {quiz.trackable?.title || "Quiz inconnu"}
                        </td>
                        <td className="py-2 px-4">
                          {formatDate(quiz.updated_at)}
                        </td>
                        <td className="py-2 px-4 text-center font-medium">
                          {(quiz.score || 0).toFixed(1)}%
                        </td>
                        <td className="py-2 px-4 text-center">
                          {(quiz.score || 0) >= 70 ? (
                            <Badge className="bg-green-100 text-green-800">
                              Réussi
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-100 text-amber-800">
                              À améliorer
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-6">
          {/* Payment Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Paiements totaux
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.payment_stats?.total_payments || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Tous vos paiements
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Montant total
                </CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {parseFloat(stats.payment_stats?.total_amount || "0").toFixed(
                    2
                  )}
                  DT
                </div>
                <p className="text-xs text-muted-foreground">
                  Somme de tous vos paiements
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Paiements complétés
                </CardTitle>
                <Check className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.payment_stats?.completed_payments || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Paiements finalisés
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Paiements en attente
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.payment_stats?.pending_payments || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Paiements non finalisés
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Payment Status Chart */}
          <Card>
            <CardHeader>
              <CardTitle>État de vos paiements</CardTitle>
              <CardDescription>
                Répartition de vos paiements par statut
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={[
                          {
                            name: "Complétés",
                            value: stats.payment_stats?.completed_payments || 0,
                          },
                          {
                            name: "En attente",
                            value: stats.payment_stats?.pending_payments || 0,
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        <Cell fill="#4ade80" />
                        <Cell fill="#facc15" />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Détails</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                          <span>Complétés</span>
                        </div>
                        <span className="font-semibold">
                          {stats.payment_stats?.completed_payments || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                          <span>En attente</span>
                        </div>
                        <span className="font-semibold">
                          {stats.payment_stats?.pending_payments || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-2">Montant total</h3>
                    <div className="text-3xl font-bold">
                      {parseFloat(
                        stats.payment_stats?.total_amount || "0"
                      ).toFixed(2)}
                      DT
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Montant moyen par paiement:{" "}
                      {stats.payment_stats?.total_payments &&
                      stats.payment_stats.total_payments > 0
                        ? (
                            parseFloat(
                              stats.payment_stats?.total_amount || "0"
                            ) / stats.payment_stats.total_payments
                          ).toFixed(2)
                        : "0.00"}
                      DT
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Payments */}
          <Card>
            <CardHeader>
              <CardTitle>Paiements récents</CardTitle>
              <CardDescription>
                Historique de vos derniers paiements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Date</th>
                      <th className="text-left py-2 px-4">Formation</th>
                      <th className="text-right py-2 px-4">Montant</th>
                      <th className="text-center py-2 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(stats.payment_stats?.recent_payments || []).map(
                      (payment) => (
                        <tr
                          key={payment.id}
                          className="border-b hover:bg-muted/50"
                        >
                          <td className="py-2 px-4">
                            {formatDate(payment.payment_date)}
                          </td>
                          <td className="py-2 px-4">
                            {payment.formation?.name || "Formation inconnue"}
                          </td>
                          <td className="py-2 px-4 text-right font-medium">
                            {parseFloat(payment.amount || "0").toFixed(2)}DT
                          </td>
                          <td className="py-2 px-4 text-center">
                            {getPaymentStatusBadge(payment.status)}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
