import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  Clock,
  GraduationCap,
  Trophy,
  BookOpen,
  Target,
  FileText,
  Info,
  ListChecks,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { useFormations } from '@/hooks/use-formations'

export const Route = createFileRoute(
  '/_protected/student/formations/$formationId/',
)({
  component: StudentFormationDetailsPage,
})

function StudentFormationDetailsPage() {
  const { formationId } = Route.useParams()
  const {
    currentFormation: formation,
    loading: isLoading,
    error,
    fetchFormation,
  } = useFormations()
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (formationId) {
      fetchFormation(formationId)
    }
  }, [formationId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  if (error || !formation) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 w-full">
          <div className="bg-destructive/10 dark:bg-destructive/20 border border-destructive text-destructive px-4 py-3 rounded mb-4">
            <strong>Erreur:</strong> {error || 'Formation introuvable'}
          </div>
          <Link to="/student/formations">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux formations
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* conteneur centré, responsive */}
      <div className="max-w-6xl mx-auto w-full py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-3 mb-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <Link to="/student/formations">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-muted p-2">
                <img
                  src={formation.image_url || '/placeholder.svg'}
                  alt={formation.title}
                  className="h-full w-full object-contain"
                />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {formation.title}
              </h1>
              {formation.level?.label && (
                <Badge variant="outline">{formation.level.label}</Badge>
              )}
            </div>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base">
            Explorez les détails et le programme de cette formation
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Durée</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formation.duration ?? 0}h
              </div>
              <p className="text-xs text-muted-foreground">
                Temps total de formation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Niveau</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formation.level?.label ?? 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                Niveau de difficulté
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Modules</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formation.modules?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Modules de formation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prix</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formation.price} <span className="text-base">DT</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Investissement total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content : TABS FULL WIDTH */}
        <div className="w-full">
          <Card className="w-full">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <CardTitle>À propos de la formation</CardTitle>
                  <CardDescription>
                    Découvrez tous les détails de cette formation
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                {/* Tabs header */}
                <div className="px-4 sm:px-6">
                  <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4 h-10">
                    <TabsTrigger
                      value="overview"
                      className="text-xs sm:text-sm"
                    >
                      <Info className="h-3.5 w-3.5 mr-1.5" />
                      Aperçu
                    </TabsTrigger>
                    <TabsTrigger
                      value="objectives"
                      className="text-xs sm:text-sm"
                    >
                      <Target className="h-3.5 w-3.5 mr-1.5" />
                      Objectifs
                    </TabsTrigger>
                    <TabsTrigger value="skills" className="text-xs sm:text-sm">
                      <Target className="h-3.5 w-3.5 mr-1.5" />
                      Compétences
                    </TabsTrigger>
                    <TabsTrigger value="modules" className="text-xs sm:text-sm">
                      <ListChecks className="h-3.5 w-3.5 mr-1.5" />
                      Programme
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Tabs content */}
                <div className="mt-6 pb-6">
                  {/* Aperçu */}
                  <TabsContent
                    value="overview"
                    className="px-4 sm:px-6 space-y-6 m-0"
                  >
                    <p className="text-base leading-relaxed whitespace-pre-line">
                      {formation.description}
                    </p>
                  </TabsContent>

                  {/* Objectifs */}
                  <TabsContent
                    value="objectives"
                    className="px-4 sm:px-6 space-y-6 m-0"
                  >
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        Objectifs d&apos;apprentissage
                      </h3>
                      <div className="bg-muted/30 p-4 rounded-lg border border-border">
                        <p className="text-foreground whitespace-pre-line">
                          {formation.learning_objectives}
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Compétences */}
                  <TabsContent
                    value="skills"
                    className="px-4 sm:px-6 space-y-6 m-0"
                  >
                    {formation.target_skills &&
                    formation.target_skills.length > 0 ? (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Target className="h-5 w-5 text-primary" />
                          Compétences visées
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {formation.target_skills.map((skill, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 p-2 rounded-md bg-muted/50"
                            >
                              <Target className="h-4 w-4 text-primary" />
                              <span className="text-sm">{skill}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Aucune compétence spécifique renseignée.
                      </p>
                    )}
                  </TabsContent>

                  {/* Programme / Modules */}
                  <TabsContent value="modules" className="px-4 sm:px-6 m-0">
                    <div className="max-h-[800px] overflow-y-auto pr-1 sm:pr-4">
                      <div className="space-y-4">
                        {formation.modules?.length ? (
                          formation.modules.map((module, moduleIndex) => (
                            <Card key={module.id} className="overflow-hidden">
                              <CardHeader className="bg-muted/30 pb-3">
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <span className="text-sm font-medium text-primary">
                                      {moduleIndex + 1}
                                    </span>
                                  </div>
                                  <div>
                                    <CardTitle className="text-base">
                                      {module.title}
                                    </CardTitle>
                                    {module.description && (
                                      <CardDescription className="mt-1 text-xs">
                                        {module.description}
                                      </CardDescription>
                                    )}
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="pt-4">
                                <div className="space-y-3">
                                  {module.lessons?.map((lesson) => (
                                    <Link
                                      key={lesson.id}
                                      to="/student/formations/$formationId/lessons/$lessonId"
                                      params={{
                                        formationId,
                                        lessonId: lesson.id,
                                      }}
                                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left border border-transparent hover:border-primary/20"
                                    >
                                      <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                      <div className="flex-1">
                                        <div className="text-sm font-medium">
                                          {lesson.title}
                                        </div>
                                        {lesson.content && (
                                          <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                            {lesson.content}
                                          </div>
                                        )}
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Aucun module n&apos;a encore été ajouté à cette
                            formation.
                          </p>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
