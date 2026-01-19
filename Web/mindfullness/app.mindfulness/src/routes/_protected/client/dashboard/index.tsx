import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createFileRoute } from '@tanstack/react-router'

import {
  BookOpen,
  DollarSign,
  TrendingUp,
  Users,
  Award,
  Activity,
  BarChart2,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from 'recharts'

const mockData = {
  overview: {
    totalUsers: 1250,
    totalFormations: 45,
    totalRevenue: 15750,
    totalCertifications: 320,
    userGrowth: 12,
    formationGrowth: 5,
    revenueGrowth: 18,
    revenueByMonth: [
      { month: 'Jan', total: 1200 },
      { month: 'Fév', total: 1400 },
      { month: 'Mar', total: 1800 },
      { month: 'Avr', total: 2100 },
      { month: 'Mai', total: 2500 },
      { month: 'Juin', total: 3150 },
    ],
    formationsByLevel: [
      { level: 'Débutant', count: 18 },
      { level: 'Intermédiaire', count: 20 },
      { level: 'Avancé', count: 7 },
    ],
    mostActiveDays: [
      { day: 'Lun', count: 245 },
      { day: 'Mar', count: 310 },
      { day: 'Mer', count: 280 },
      { day: 'Jeu', count: 420 },
      { day: 'Ven', count: 380 },
      { day: 'Sam', count: 150 },
      { day: 'Dim', count: 95 },
    ],
    questionsByDifficulty: [
      { difficulty: 'Facile', value: 120 },
      { difficulty: 'Moyen', value: 180 },
      { difficulty: 'Difficile', value: 85 },
    ],
  },
  finances: {
    totalRevenue: 15750,
    revenueThisMonth: 3150,
    revenueLastMonth: 2500,
    averagePayment: 85.5,
    partialPayments: 12,
    revenueByMonth: [
      { month: 'Jan', total: 1200 },
      { month: 'Fév', total: 1400 },
      { month: 'Mar', total: 1800 },
      { month: 'Avr', total: 2100 },
      { month: 'Mai', total: 2500 },
      { month: 'Juin', total: 3150 },
    ],
  },
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

const growthIndicator = (value: number) => {
  if (value > 0) {
    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        <TrendingUp className="h-3 w-3 mr-1" /> +{value}%
      </Badge>
    )
  } else if (value < 0) {
    return (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
        <TrendingUp className="h-3 w-3 mr-1 rotate-180" /> {value}%
      </Badge>
    )
  } else {
    return (
      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">0%</Badge>
    )
  }
}

export const Route = createFileRoute('/_protected/client/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AdminDashboard />
}

function AdminDashboard() {
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="finances">Finances</TabsTrigger>
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
                  {mockData.overview.totalUsers.toLocaleString()}
                </div>
                <div className="flex items-center pt-1">
                  {growthIndicator(mockData.overview.userGrowth)}
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
                  {mockData.overview.totalFormations}
                </div>
                <div className="flex items-center pt-1">
                  {growthIndicator(mockData.overview.formationGrowth)}
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
                  {mockData.overview.totalRevenue.toLocaleString()}€
                </div>
                <div className="flex items-center pt-1">
                  {growthIndicator(mockData.overview.revenueGrowth)}
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
                  {mockData.overview.totalCertifications}
                </div>
                <p className="text-xs text-muted-foreground">
                  Toutes certifications
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
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
                      data={mockData.overview.revenueByMonth}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
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

            <Card>
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
                      data={mockData.overview.formationsByLevel}
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

          {/* Engagement */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
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
                      data={mockData.overview.mostActiveDays}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
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

            <Card>
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
                        data={mockData.overview.questionsByDifficulty}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="difficulty"
                        label={(entry: any) => {
                          const { difficulty, percent } = entry
                          return `${difficulty}: ${(percent * 100).toFixed(0)}%`
                        }}
                      >
                        {mockData.overview.questionsByDifficulty.map(
                          (_entry: any, index: any) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ),
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
                  {mockData.finances.totalRevenue.toLocaleString()}€
                </div>
                <p className="text-xs text-muted-foreground">
                  {growthIndicator(mockData.overview.revenueGrowth)}
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
                  {mockData.finances.revenueThisMonth.toLocaleString()}€
                </div>
                <p className="text-xs text-muted-foreground">
                  {(
                    (mockData.finances.revenueThisMonth /
                      mockData.finances.revenueLastMonth -
                      1) *
                    100
                  ).toFixed(1)}
                  % vs mois dernier
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Paiement moyen
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockData.finances.averagePayment.toFixed(2)}€
                </div>
                <p className="text-xs text-muted-foreground">Par transaction</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Paiements partiels
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockData.finances.partialPayments}
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
                    data={mockData.finances.revenueByMonth}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `${value}€`} />
                    <Tooltip formatter={(value) => [`${value}€`, `Revenus`]} />
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
      </Tabs>
    </div>
  )
}
