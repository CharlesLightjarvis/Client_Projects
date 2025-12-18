import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Award, BookX, Clock, GraduationCap, Trophy } from "lucide-react";
import { useFormationsStore } from "~/hooks/use-formations-store";
import { LoadingScreen } from "~/components/loading-screen";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Link } from "react-router";

export default function FormationsList() {
  const { formations, isLoading, getStudentFormations } = useFormationsStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Extraire les catégories uniques des formations
  const uniqueCategories = useMemo(() => {
    const categories = formations
      .map((formation) => formation.category?.name)
      .filter((category): category is string => !!category);

    return Array.from(new Set(categories));
  }, [formations]);

  // Filtrer les formations selon la catégorie sélectionnée
  const filteredFormations = useMemo(() => {
    return selectedCategory === "all"
      ? formations
      : formations.filter(
          (formation) => formation.category?.name === selectedCategory
        );
  }, [formations, selectedCategory]);

  useEffect(() => {
    getStudentFormations();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
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
          // Affichage lorsqu'il n'y a pas de formations
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
          // Affichage normal lorsqu'il y a des formations
          <>
            <Tabs
              defaultValue="all"
              className="mb-8 w-full"
              onValueChange={(value) => setSelectedCategory(value)}
            >
              <TabsList className="w-full justify-start">
                <TabsTrigger className="flex-1" value="all">
                  Toutes
                </TabsTrigger>
                {uniqueCategories.map((category) => (
                  <TabsTrigger
                    key={category}
                    className="flex-1"
                    value={category}
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredFormations.map((formation) => (
                <motion.div
                  key={formation.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="h-full overflow-hidden transition-all hover:shadow-lg dark:hover:shadow-primary/10">
                    <CardHeader className="relative pb-0">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-muted p-2">
                          <img
                            src={formation.image || "/placeholder.svg"}
                            alt={formation.name}
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold leading-none text-foreground">
                            {formation.name}
                          </h3>
                          <Badge variant="outline" className="mt-2">
                            {formation.category.name}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="mt-4">
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {formation.description}
                      </p>
                    </CardContent>

                    <CardFooter className="mt-4">
                      <Link
                        to={`/student/dashboard/formations/${formation.id}`}
                        className="w-full"
                      >
                        <Button className="w-full">En savoir plus</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
