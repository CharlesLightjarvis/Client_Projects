import { useEffect } from 'react'
import { BookX, Clock, Trophy } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { useFormations } from '@/hooks/use-formations'

export default function StudentFormationsList() {
  const { formations, loading: isLoading, fetchStudentFormations } = useFormations()

  useEffect(() => {
    fetchStudentFormations()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background px-4 md:px-8">
      <div className="container mx-auto py-10">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Formations Disponibles
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Découvrez nos formations et développez vos compétences
          </p>
        </div>

        {formations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <BookX className="h-24 w-24 text-muted-foreground mb-6" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Aucune formation disponible
            </h2>
            <p className="text-muted-foreground text-center max-w-md">
              Il n'y a actuellement aucune formation disponible. Veuillez
              vérifier ultérieurement pour de nouvelles opportunités
              d'apprentissage.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {formations.map((formation) => (
              <Card
                key={formation.id}
                className="h-full overflow-hidden transition-all hover:shadow-lg dark:hover:shadow-primary/10"
              >
                <CardHeader className="relative pb-0">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-muted p-2">
                      <img
                        src={formation.image_url || '/placeholder.svg'}
                        alt={formation.title}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold leading-none text-foreground">
                        {formation.title}
                      </h3>
                      <Badge variant="outline" className="mt-2">
                        {formation.level?.label ||
                          formation.level?.value ||
                          'N/A'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="mt-4">
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {formation.description}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{formation.duration}h</span>
                    </div>
                    {formation.price && (
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4" />
                        <span>{formation.price} DT</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="mt-4">
                  <Link
                    to="/student/formations/$formationId"
                    params={{ formationId: formation.id }}
                  >
                    <Button className="w-full">En savoir plus</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
