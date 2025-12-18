import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Progress } from "~/components/ui/progress";
import {
  Loader2,
  UserRound,
  BookOpen,
  Calendar,
  Users,
  Award,
  BarChart3,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { api } from "~/api";

interface TeacherStatistics {
  session_stats: {
    total_sessions: number;
    active_sessions: number;
    upcoming_sessions: number;
    completed_sessions: number;
    sessions_by_month: { month: number; count: number }[];
  };
  student_stats: {
    total_students: number;
    average_students_per_session: number;
    new_students_this_month: number;
  };
  attendance_stats: {
    attendance_rate: number;
    recent_absences: number;
    attendance_by_session: {
      name: string;
      total: number;
      present_count: number;
    }[];
  };
  formation_stats: {
    total_formations: number;
    popular_formations: {
      id: number;
      name: string;
      students_count: number;
    }[];
  };
  certification_stats: {
    total_certifications: number;
    certification_success_rate: {
      total: number;
      passed: number;
    };
  };
  top_students: {
    id: number;
    fullName: string;
    average_score: number;
    attendance_count: number;
  }[];
  growth_stats: {
    session_growth: number;
    student_growth: number;
  };
}

const monthNames = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

export default function TeacherDashboard() {
  const [statistics, setStatistics] = useState<TeacherStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/v1/teacher/statistics");
        setStatistics(response.data.statistics);
        setError(null);
      } catch (err) {
        setError("Erreur lors du chargement des statistiques");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement des statistiques...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>Aucune statistique disponible</div>
      </div>
    );
  }

  // Préparer les données pour le graphique des sessions par mois
  const sessionsByMonthData = statistics.session_stats.sessions_by_month.map(
    (item) => ({
      name: monthNames[item.month - 1],
      sessions: item.count,
    })
  );

  // Calculer le taux de réussite des certifications
  const certificationSuccessRate =
    statistics.certification_stats.certification_success_rate?.total > 0
      ? (statistics.certification_stats.certification_success_rate.passed /
          statistics.certification_stats.certification_success_rate.total) *
        100
      : 0;

  return (
    <>
      <title>Tableau de bord enseignant | Formation App</title>

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            Tableau de bord enseignant
          </h2>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="students">Étudiants</TabsTrigger>
            <TabsTrigger value="attendance">Assiduité</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Sessions totales
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statistics.session_stats.total_sessions}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {statistics.growth_stats.session_growth > 0 ? "+" : ""}
                    {statistics.growth_stats.session_growth.toFixed(1)}% depuis
                    le mois dernier
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Étudiants totaux
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statistics.student_stats.total_students}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {statistics.growth_stats.student_growth > 0 ? "+" : ""}
                    {statistics.growth_stats.student_growth.toFixed(1)}% depuis
                    le mois dernier
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Taux d'assiduité
                  </CardTitle>
                  <UserRound className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statistics.attendance_stats.attendance_rate.toFixed(1)}%
                  </div>
                  <Progress
                    value={statistics.attendance_stats.attendance_rate}
                    className="mt-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Formations
                  </CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statistics.formation_stats.total_formations}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {statistics.certification_stats.total_certifications}{" "}
                    certifications disponibles
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Sessions par mois</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={sessionsByMonthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="sessions" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Top 5 des étudiants</CardTitle>
                  <CardDescription>
                    Meilleurs étudiants par score moyen
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Score moyen</TableHead>
                        <TableHead>Présences</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {statistics.top_students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">
                            {student.fullName}
                          </TableCell>
                          <TableCell>
                            {Number.isFinite(student.average_score)
                              ? student.average_score.toFixed(1)
                              : "N/A"}
                          </TableCell>
                          <TableCell>{student.attendance_count}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Sessions */}
          <TabsContent value="sessions" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Sessions actives
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statistics.session_stats.active_sessions}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {(
                      (statistics.session_stats.active_sessions /
                        statistics.session_stats.total_sessions) *
                      100
                    ).toFixed(1)}
                    % du total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Sessions à venir
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statistics.session_stats.upcoming_sessions}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {(
                      (statistics.session_stats.upcoming_sessions /
                        statistics.session_stats.total_sessions) *
                      100
                    ).toFixed(1)}
                    % du total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Sessions terminées
                  </CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statistics.session_stats.completed_sessions}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {(
                      (statistics.session_stats.completed_sessions /
                        statistics.session_stats.total_sessions) *
                      100
                    ).toFixed(1)}
                    % du total
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Formations populaires</CardTitle>
                <CardDescription>
                  Les formations avec le plus grand nombre d'étudiants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Formation</TableHead>
                      <TableHead className="text-right">
                        Nombre d'étudiants
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {statistics.formation_stats.popular_formations.map(
                      (formation) => (
                        <TableRow key={formation.id}>
                          <TableCell className="font-medium">
                            {formation.name}
                          </TableCell>
                          <TableCell className="text-right">
                            {formation.students_count}
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Étudiants */}
          <TabsContent value="students" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Étudiants totaux
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statistics.student_stats.total_students}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Moyenne par session
                  </CardTitle>
                  <UserRound className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Number.isFinite(
                      statistics.student_stats.average_students_per_session
                    )
                      ? statistics.student_stats.average_students_per_session.toFixed(
                          1
                        )
                      : "0.0"}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Nouveaux ce mois-ci
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statistics.student_stats.new_students_this_month}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {(
                      (statistics.student_stats.new_students_this_month /
                        statistics.student_stats.total_students) *
                      100
                    ).toFixed(1)}
                    % du total
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Taux de réussite des certifications</CardTitle>
                <CardDescription>
                  {statistics.certification_stats.certification_success_rate
                    ?.passed || 0}{" "}
                  étudiants ont réussi sur un total de{" "}
                  {statistics.certification_stats.certification_success_rate
                    ?.total || 0}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  {certificationSuccessRate.toFixed(1)}%
                </div>
                <Progress value={certificationSuccessRate} className="h-2" />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assiduité */}
          <TabsContent value="attendance" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Taux d'assiduité global
                  </CardTitle>
                  <UserRound className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statistics.attendance_stats.attendance_rate.toFixed(1)}%
                  </div>
                  <Progress
                    value={statistics.attendance_stats.attendance_rate}
                    className="mt-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Absences récentes (30 jours)
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statistics.attendance_stats.recent_absences}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Assiduité par session</CardTitle>
                <CardDescription>
                  Taux de présence pour chaque session
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Session</TableHead>
                      <TableHead>Présences</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead className="text-right">Taux</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {statistics.attendance_stats.attendance_by_session.map(
                      (session, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {session.name}
                          </TableCell>
                          <TableCell>{session.present_count}</TableCell>
                          <TableCell>{session.total}</TableCell>
                          <TableCell className="text-right">
                            {(
                              (session.present_count / session.total) *
                              100
                            ).toFixed(1)}
                            %
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
