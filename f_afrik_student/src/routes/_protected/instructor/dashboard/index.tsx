import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { createFileRoute } from '@tanstack/react-router'

import {
  BookOpen,
  Users,
  TrendingUp,
  Award,
  GraduationCap,
  Clock,
} from 'lucide-react'

const mockData = {
  myFormations: 8,
  totalStudents: 125,
  completionRate: 87,
  averageRating: 4.7,
  activeStudents: 98,
  pendingQuestions: 12,
}

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

export const Route = createFileRoute('/_protected/instructor/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <InstructorDashboard />
}

function InstructorDashboard() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Tableau de bord Formateur
        </h1>
        <p className="text-muted-foreground">
          Gérez vos formations et suivez vos étudiants
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Mes Formations
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockData.myFormations}
            </div>
            <p className="text-xs text-muted-foreground">
              Formations actives
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
              {mockData.totalStudents}
            </div>
            <p className="text-xs text-muted-foreground">
              {mockData.activeStudents} actifs ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taux de complétion
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockData.completionRate}%
            </div>
            <div className="flex items-center pt-1">
              {growthIndicator(5)}
              <span className="text-xs text-muted-foreground ml-2">
                vs mois précédent
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Note moyenne
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockData.averageRating}/5
            </div>
            <p className="text-xs text-muted-foreground">
              Basé sur les évaluations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Questions en attente
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockData.pendingQuestions}
            </div>
            <p className="text-xs text-muted-foreground">
              À répondre
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Activités récentes</CardTitle>
          <CardDescription>
            Dernières interactions avec vos formations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Aucune activité récente
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
