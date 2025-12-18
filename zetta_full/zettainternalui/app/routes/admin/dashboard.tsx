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
  DollarSign,
  TrendingUp,
  Users,
  Award,
  Loader2,
  School,
  Calendar,
  Clock,
  Star,
  FileText,
  Check,
  Shield,
  UserCheck,
  BarChart2,
  Activity,
  User,
  CreditCard,
  AlertTriangle,
  PieChart,
} from "lucide-react";
import { ChartContainer, ChartTooltipContent } from "~/components/ui/chart";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
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

interface Statistics {
  user_stats: {
    total_users: number;
    active_users: number;
    inactive_users: number;
    total_students: number;
    new_students_this_month: number;
    total_teachers: number;
    new_teachers_this_month: number;
    verified_users: number;
    users_with_2fa: number;
  };
  formation_stats: {
    total_formations: number;
    formations_by_level: any[];
    most_popular_categories: Array<{ name: string; formation_count: number }>;
    completed_sessions: number;
    active_sessions: number;
    upcoming_sessions: number;
    average_students_per_session: number;
  };
  financial_stats: {
    total_revenue: number;
    revenue_this_month: number;
    revenue_last_month: number;
    average_payment: number;
    partial_payments: number;
    revenue_by_month: Array<{ month: number; total: number }>;
  };
  certification_stats: {
    total_certifications: number;
    average_validity_period: number;
    certifications_by_level: Array<{ level: string; count: number }>;
    certifications_by_provider: Array<{ provider: string; count: number }>;
  };
  quiz_stats: {
    total_questions: number;
    average_quiz_duration: number;
    average_passing_score: number;
    questions_by_difficulty: Array<{ difficulty: string; count: number }>;
  };
  engagement_stats: {
    most_active_days: Array<{ day: string; count: number }>;
    peak_hours: Array<{ hour: number; count: number }>;
  };
  growth_stats: {
    user_growth: number;
    formation_growth: number;
    revenue_growth: number;
  };
}

interface ApiResponse {
  statistics: Statistics;
}

export default function AdminDashboard() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get<ApiResponse>("/api/v1/admin/statistics");
        setData(response.data);
        console.log(response.data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An error occurred"));
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
            Chargement des données...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-destructive text-xl">
          Une erreur est survenue lors du chargement des données
        </div>
      </div>
    );
  }

  if (!data) return null;

  const stats = data.statistics as any;

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

  const revenueData = stats.financial_stats.revenue_by_month.map(
    (item: any) => ({
      name: monthNames[item.month - 1],
      total: parseFloat(item.total),
    })
  );

  const formationsByLevelData = stats.formation_stats.formations_by_level;

  const mostActiveDaysData = stats.engagement_stats.most_active_days.map(
    (item: any) => ({
      name: item.day,
      count: item.count,
    })
  );

  const peakHoursData = stats.engagement_stats.peak_hours.map((item: any) => ({
    name: `${item.hour}h`,
    count: item.count,
  }));

  const questionsByDifficultyData =
    stats.quiz_stats.questions_by_difficulty.map((item: any) => ({
      name: item.difficulty,
      value: item.count,
    }));

  const certificationsByLevelData =
    stats.certification_stats.certifications_by_level.map((item: any) => ({
      name: item.level,
      value: item.count,
    }));

  const certificationsByProviderData =
    stats.certification_stats.certifications_by_provider
      .slice(0, 10) // Limit to top 10 for better visualization
      .map((item: any) => ({
        name: item.provider,
        value: item.count,
      }));

  const popularCategoriesData =
    stats.formation_stats.most_popular_categories.map((item: any) => ({
      name: item.name,
      count: item.formation_count,
    }));

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82ca9d",
    "#ffc658",
    "#8dd1e1",
    "#a4de6c",
    "#d0ed57",
  ];

  const growthIndicator = (value: any) => {
    if (value > 0) {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <TrendingUp className="h-3 w-3 mr-1" /> +{value}%
        </Badge>
      );
    } else if (value < 0) {
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          <TrendingUp className="h-3 w-3 mr-1 rotate-180" /> {value}%
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
          0%
        </Badge>
      );
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Tableau de bord administrateur
        </h1>
        <p className="text-muted-foreground">
          Visualisez et analysez les performances de votre plateforme de
          formation
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="formations">Formations</TabsTrigger>
          <TabsTrigger value="finances">Finances</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Utilisateurs totaux
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.user_stats.total_users.toLocaleString()}
                </div>
                <div className="flex items-center pt-1">
                  {growthIndicator(stats.growth_stats.user_growth)}
                  <span className="text-xs text-muted-foreground ml-2">
                    vs mois précédent
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Formations totales
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.formation_stats.total_formations.toLocaleString()}
                </div>
                <div className="flex items-center pt-1">
                  {growthIndicator(stats.growth_stats.formation_growth)}
                  <span className="text-xs text-muted-foreground ml-2">
                    vs mois précédent
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Revenus totaux
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {parseFloat(
                    stats.financial_stats.total_revenue
                  ).toLocaleString()}
                  €
                </div>
                <div className="flex items-center pt-1">
                  {growthIndicator(stats.growth_stats.revenue_growth)}
                  <span className="text-xs text-muted-foreground ml-2">
                    vs mois précédent
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Certifications totales
                </CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.certification_stats.total_certifications.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Validité moyenne:{" "}
                  {parseFloat(
                    stats.certification_stats.average_validity_period
                  ).toFixed(1)}{" "}
                  mois
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Revenus mensuels</CardTitle>
                <CardDescription>
                  Évolution des revenus sur les derniers mois
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={revenueData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                        name="Revenus (€)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Formations par niveau</CardTitle>
                <CardDescription>
                  Distribution des formations selon leur niveau
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={formationsByLevelData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="level" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="count"
                        fill="#8884d8"
                        name="Nombre de formations"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performances</CardTitle>
              <CardDescription>
                Les meilleures formations et enseignants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm">
                      Formations populaires
                    </h3>
                    <Badge variant="outline">Sessions</Badge>
                  </div>
                  <ScrollArea className="h-48">
                    <div className="space-y-2">
                      {stats.top_performers.top_formations.map(
                        (formation: any) => (
                          <div
                            key={formation.id}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm truncate max-w-xs">
                              {formation.name}
                            </span>
                            <span className="font-medium text-sm">
                              {formation.sessions_count}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </ScrollArea>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm">
                      Meilleurs enseignants
                    </h3>
                    <Badge variant="outline">Sessions</Badge>
                  </div>
                  <ScrollArea className="h-48">
                    <div className="space-y-2">
                      {stats.top_performers.top_teachers.map((teacher: any) => (
                        <div
                          key={teacher.id}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm truncate max-w-xs">
                            {teacher.fullName}
                          </span>
                          <span className="font-medium text-sm">
                            {teacher.teaching_sessions_count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm">
                      Catégories populaires
                    </h3>
                    <Badge variant="outline">Formations</Badge>
                  </div>
                  <ScrollArea className="h-48">
                    <div className="space-y-2">
                      {stats.formation_stats.most_popular_categories.map(
                        (category: any, index: any) => (
                          <div
                            key={index}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm truncate max-w-xs">
                              {category.name}
                            </span>
                            <span className="font-medium text-sm">
                              {category.formation_count}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Engagement */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Jours les plus actifs</CardTitle>
                <CardDescription>
                  Activité par jour de la semaine
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={mostActiveDaysData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="count"
                        fill="#82ca9d"
                        name="Nombre d'activités"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Heures de pointe</CardTitle>
                <CardDescription>
                  Activité par heure de la journée
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={peakHoursData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="count"
                        fill="#ffc658"
                        name="Nombre d'activités"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quiz and Certifications */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Questions par difficulté</CardTitle>
                <CardDescription>
                  Distribution des questions par niveau de difficulté
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={questionsByDifficultyData}
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
                        {questionsByDifficultyData.map(
                          (entry: any, index: any) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          )
                        )}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Certifications par niveau</CardTitle>
                <CardDescription>
                  Distribution des certifications par niveau
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={certificationsByLevelData}
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
                        {certificationsByLevelData.map(
                          (entry: any, index: any) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          )
                        )}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          {/* User Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Utilisateurs totaux
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.user_stats.total_users}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.user_stats.active_users} actifs,{" "}
                  {stats.user_stats.inactive_users} inactifs
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Étudiants</CardTitle>
                <School className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.user_stats.total_students}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.user_stats.new_students_this_month} nouveaux ce mois
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Enseignants
                </CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.user_stats.total_teachers}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.user_stats.new_teachers_this_month} nouveaux ce mois
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Sécurité utilisateurs
                </CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.user_stats.users_with_2fa}
                </div>
                <p className="text-xs text-muted-foreground">
                  Utilisateurs avec 2FA activé
                </p>
              </CardContent>
            </Card>
          </div>

          {/* User Details */}
          <Card>
            <CardHeader>
              <CardTitle>Enseignants les plus actifs</CardTitle>
              <CardDescription>
                Classement des enseignants par nombre de sessions enseignées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Nom</th>
                      <th className="text-left py-2 px-4">Email</th>
                      <th className="text-left py-2 px-4">Titre</th>
                      <th className="text-center py-2 px-4">Sessions</th>
                      <th className="text-center py-2 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.top_performers.top_teachers.map((teacher: any) => (
                      <tr
                        key={teacher.id}
                        className="border-b hover:bg-muted/50"
                      >
                        <td className="py-2 px-4">{teacher.fullName}</td>
                        <td className="py-2 px-4 text-muted-foreground">
                          {teacher.email}
                        </td>
                        <td className="py-2 px-4">{teacher.title}</td>
                        <td className="py-2 px-4 text-center">
                          {teacher.teaching_sessions_count}
                        </td>
                        <td className="py-2 px-4 text-center">
                          {teacher.status === "active" ? (
                            <Badge className="bg-green-100 text-green-800">
                              Actif
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">
                              Inactif
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

          {/* User Verification */}
          <Card>
            <CardHeader>
              <CardTitle>Statut de vérification</CardTitle>
              <CardDescription>
                Aperçu de la sécurité et vérification des comptes utilisateurs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Utilisateurs vérifiés</span>
                      <span className="font-semibold">
                        {stats.user_stats.verified_users} /{" "}
                        {stats.user_stats.total_users}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{
                          width: `${
                            (stats.user_stats.verified_users /
                              stats.user_stats.total_users) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Utilisateurs avec 2FA</span>
                      <span className="font-semibold">
                        {stats.user_stats.users_with_2fa} /{" "}
                        {stats.user_stats.total_users}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-600 h-2.5 rounded-full"
                        style={{
                          width: `${
                            (stats.user_stats.users_with_2fa /
                              stats.user_stats.total_users) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center p-4 bg-amber-100 text-amber-800 rounded-full">
                      <AlertTriangle className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-medium">
                      Sécurité des comptes
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      {stats.user_stats.users_with_2fa === 0
                        ? "Aucun utilisateur n'a activé l'authentification à deux facteurs (2FA). Considérez encourager l'activation pour améliorer la sécurité."
                        : `Seulement ${stats.user_stats.users_with_2fa} utilisateurs ont activé l'authentification à deux facteurs (2FA). Encouragez davantage d'utilisateurs à activer cette fonctionnalité pour améliorer la sécurité.`}
                    </p>
                  </div>
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
                  {stats.formation_stats.total_formations}
                </div>
                <p className="text-xs text-muted-foreground">
                  {growthIndicator(stats.growth_stats.formation_growth)}
                  <span className="ml-2">vs mois précédent</span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Sessions actives
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.formation_stats.active_sessions}
                </div>
                <p className="text-xs text-muted-foreground">
                  Sessions actuellement en cours
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Taux de complétion
                </CardTitle>
                <Check className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.formation_stats.completed_sessions} /{" "}
                  {stats.formation_stats.active_sessions +
                    stats.formation_stats.upcoming_sessions +
                    stats.formation_stats.completed_sessions}
                </div>
                <p className="text-xs text-muted-foreground">
                  Sessions terminées
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Moyenne d'étudiants
                </CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {parseFloat(
                    stats.formation_stats.average_students_per_session
                  ).toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Étudiants par session
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Formation Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Catégories de formations</CardTitle>
              <CardDescription>
                Distribution des formations par catégorie
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={popularCategoriesData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="count"
                      fill="#8884d8"
                      name="Nombre de formations"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Formation Level */}
          <Card>
            <CardHeader>
              <CardTitle>Niveaux de formations</CardTitle>
              <CardDescription>
                Distribution des formations par niveau
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                      <span>Débutant</span>
                    </div>
                    <span className="font-medium">
                      {formationsByLevelData.find(
                        (item: any) => item.level === "beginner"
                      )?.count || 0}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-500 h-2.5 rounded-full"
                      style={{
                        width: `${
                          ((formationsByLevelData.find(
                            (item: any) => item.level === "beginner"
                          )?.count || 0) /
                            stats.formation_stats.total_formations) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                      <span>Intermédiaire</span>
                    </div>
                    <span className="font-medium">
                      {formationsByLevelData.find(
                        (item: any) => item.level === "intermediate"
                      )?.count || 0}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-500 h-2.5 rounded-full"
                      style={{
                        width: `${
                          ((formationsByLevelData.find(
                            (item: any) => item.level === "intermediate"
                          )?.count || 0) /
                            stats.formation_stats.total_formations) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
                      <span>Avancé</span>
                    </div>
                    <span className="font-medium">
                      {formationsByLevelData.find(
                        (item: any) => item.level === "advanced"
                      )?.count || 0}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-purple-500 h-2.5 rounded-full"
                      style={{
                        width: `${
                          ((formationsByLevelData.find(
                            (item: any) => item.level === "advanced"
                          )?.count || 0) /
                            stats.formation_stats.total_formations) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Finances Tab */}
        <TabsContent value="finances" className="space-y-6">
          {/* Financial Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Revenus totaux
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {parseFloat(
                    stats.financial_stats.total_revenue
                  ).toLocaleString()}
                  €
                </div>
                <p className="text-xs text-muted-foreground">
                  {growthIndicator(stats.growth_stats.revenue_growth)}
                  <span className="ml-2">vs mois précédent</span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Revenus ce mois
                </CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {parseFloat(
                    stats.financial_stats.revenue_this_month
                  ).toLocaleString()}
                  €
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.financial_stats.revenue_last_month > 0
                    ? `${(
                        (stats.financial_stats.revenue_this_month /
                          stats.financial_stats.revenue_last_month -
                          1) *
                        100
                      ).toFixed(1)}% vs mois dernier`
                    : "Premier mois de revenus"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Paiement moyen
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {parseFloat(stats.financial_stats.average_payment).toFixed(2)}
                  €
                </div>
                <p className="text-xs text-muted-foreground">Par transaction</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Paiements partiels
                </CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.financial_stats.partial_payments}
                </div>
                <p className="text-xs text-muted-foreground">
                  En attente de régularisation
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Évolution des revenus</CardTitle>
              <CardDescription>Revenus mensuels sur la période</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={revenueData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `${value}€`} />
                    <Tooltip formatter={(value) => [`${value}€`, "Revenus"]} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                      name="Revenus"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
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
                  {stats.certification_stats.total_certifications}
                </div>
                <p className="text-xs text-muted-foreground">
                  Tous niveaux confondus
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Durée de validité
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {parseFloat(
                    stats.certification_stats.average_validity_period
                  ).toFixed(1)}{" "}
                  mois
                </div>
                <p className="text-xs text-muted-foreground">
                  Validité moyenne
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Niveau débutant
                </CardTitle>
                <School className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {certificationsByLevelData.find(
                    (item: any) => item.name === "beginner"
                  )?.value || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Certifications niveau débutant
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Niveau intermédiaire+
                </CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {certificationsByLevelData.find(
                    (item: any) => item.name === "intermediate"
                  )?.value || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Certifications niveau intermédiaire ou supérieur
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Certification Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Certifications par niveau</CardTitle>
                <CardDescription>
                  Distribution des certifications par niveau de compétence
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={certificationsByLevelData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {certificationsByLevelData.map(
                          (entry: any, index: any) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          )
                        )}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top 10 organismes certificateurs</CardTitle>
                <CardDescription>
                  Les organismes ayant délivré le plus de certifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={certificationsByProviderData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={150} />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="value"
                        fill="#82ca9d"
                        name="Nombre de certifications"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quiz Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistiques des quiz</CardTitle>
              <CardDescription>
                Métriques concernant les questionnaires d'évaluation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Questions totales
                  </div>
                  <div className="text-3xl font-bold">
                    {stats.quiz_stats.total_questions}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Durée moyenne
                  </div>
                  <div className="text-3xl font-bold">
                    {parseFloat(stats.quiz_stats.average_quiz_duration).toFixed(
                      1
                    )}{" "}
                    min
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Score de passage
                  </div>
                  <div className="text-3xl font-bold">
                    {parseFloat(stats.quiz_stats.average_passing_score).toFixed(
                      1
                    )}
                    %
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Répartition par difficulté
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-xs">Facile</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-xs">Moyen</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-xs">Difficile</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={questionsByDifficultyData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label
                      >
                        {questionsByDifficultyData.map(
                          (entry: any, index: any) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                entry.name === "easy"
                                  ? "#4ade80"
                                  : entry.name === "medium"
                                  ? "#facc15"
                                  : "#f87171"
                              }
                            />
                          )
                        )}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
