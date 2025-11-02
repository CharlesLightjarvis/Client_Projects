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
  TrendingUp,
  Award,
  Clock,
  Target,
  CheckCircle2,
} from 'lucide-react'

const mockData = {
  enrolledFormations: 5,
  completedFormations: 2,
  inProgressFormations: 3,
  totalCertificates: 2,
  studyHours: 42,
  averageScore: 85,
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

export const Route = createFileRoute('/_protected/student/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <StudentDashboard />
}

function StudentDashboard() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Tableau de bord Étudiant
        </h1>
        <p className="text-muted-foreground">
          Suivez votre progression et vos formations
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Formations inscrites
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockData.enrolledFormations}
            </div>
            <p className="text-xs text-muted-foreground">
              {mockData.inProgressFormations} en cours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Formations complétées
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockData.completedFormations}
            </div>
            <div className="flex items-center pt-1">
              {growthIndicator(100)}
              <span className="text-xs text-muted-foreground ml-2">
                vs mois précédent
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Certificats obtenus
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockData.totalCertificates}
            </div>
            <p className="text-xs text-muted-foreground">
              Certifications validées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Heures d'étude
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockData.studyHours}h
            </div>
            <p className="text-xs text-muted-foreground">
              Ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Score moyen
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockData.averageScore}%
            </div>
            <div className="flex items-center pt-1">
              {growthIndicator(3)}
              <span className="text-xs text-muted-foreground ml-2">
                vs mois précédent
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formations en cours */}
      <Card>
        <CardHeader>
          <CardTitle>Mes formations en cours</CardTitle>
          <CardDescription>
            Continuez votre apprentissage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Aucune formation en cours
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recommandations */}
      <Card>
        <CardHeader>
          <CardTitle>Formations recommandées</CardTitle>
          <CardDescription>
            Basées sur votre profil et progression
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Aucune recommandation pour le moment
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
