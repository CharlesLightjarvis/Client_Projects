import React, { useEffect, useMemo, useState } from "react";
import { api } from "~/api";
import { useCertificationsStore } from "~/hooks/use-certifications-store";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { Award, Clock, TrendingUp, Trophy } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { motion } from "framer-motion";
import CertificationDetails from "./certification-details";
import { LoadingScreen } from "~/components/loading-screen";

interface Certification {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  provider: string;
  validity_period: number;
  level: string;
  //   benefits: string[];
  //   skills: string[];
  //   best_for: string[];
  //   prerequisites: string[];
  formation?: {
    id: string;
    name: string;
    category: string; // Ajout de category
  };
  created_at: string;
  updated_at: string;
}

interface Answer {
  id: string;
  correct: boolean;
  text: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  answers: Answer[];
  difficulty: string;
}

interface CertificationQuiz {
  certification_id: string;
  certification_name: string;
  time_limit: number;
  questions: QuizQuestion[];
  total_questions: number;
  passing_score: number;
}

const CertificationTest: React.FC = () => {
  const [view, setView] = useState<"list" | "details" | "quiz">("list");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const {
    studentCertifications,
    studentCertificationsLoading: loading,
    studentCertificationsError: error,
    getStudentCertifications,
  } = useCertificationsStore();

  // Nouveau: Extraire les catégories uniques des certifications
  const uniqueCategories = useMemo(() => {
    const categories = studentCertifications.flatMap(
      (cert) => cert.formations?.map((f) => f.category) ?? []
    );
    const uniqueCategories = Array.from(new Set(categories));
    return uniqueCategories;
  }, [studentCertifications]);
  // const uniqueCategories = useMemo(() => {
  //   const categories = studentCertifications
  //     .map((cert) => cert.formation?.category)
  //     .filter((category): category is string => !!category);

  //   return Array.from(new Set(categories));
  // }, [studentCertifications]);

  useEffect(() => {
    getStudentCertifications();
  }, []);

  const filteredCertifications =
    selectedCategory === "all"
      ? studentCertifications
      : studentCertifications.filter((cert) =>
          cert.formations?.some((f) => f.category === selectedCategory)
        );

  // const filteredCertifications =
  //   selectedCategory === "all"
  //     ? studentCertifications
  //     : studentCertifications.filter(
  //         (cert) => cert.formation?.category === selectedCategory
  //       );

  const renderList = () => {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-10">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Certifications Professionnelles
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Développez vos compétences et boostez votre carrière avec nos
              certifications reconnues
            </p>
          </div>

          {filteredCertifications.length === 0 ? (
            // Affichage lorsqu'il n'y a pas de certifications
            <div className="flex flex-col items-center justify-center py-16">
              <Award className="h-24 w-24 text-muted-foreground mb-6 opacity-50" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Aucune certification disponible
              </h2>
              <p className="text-muted-foreground text-center max-w-md">
                Il n'y a actuellement aucune certification disponible. Veuillez
                vérifier ultérieurement pour de nouvelles opportunités de
                certification.
              </p>
            </div>
          ) : (
            // Affichage normal lorsqu'il y a des certifications
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
                  {uniqueCategories.map((category: any) => (
                    <TabsTrigger key={category} value={category}>
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredCertifications.map((cert) => (
                  <motion.div
                    key={cert.id}
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
                              src={cert.image || "/placeholder.svg"}
                              alt={cert.name}
                              className="h-full w-full object-contain"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold leading-none text-foreground">
                              {cert.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {cert.provider}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="mt-4">
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {cert.description}
                        </p>
                        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Trophy className="h-4 w-4" />
                            <span>{cert.level}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <TrendingUp className="h-4 w-4" />
                            <span>{cert.skills?.length ?? 0} compétences</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Link
                          to={`/student/dashboard/certifications/${cert.id}`}
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
  };

  const renderDetails = () => {
    return <CertificationDetails />;
  };

  return (
    <div className="p-4">
      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded mb-4 dark:bg-destructive/20">
          <strong>Error:</strong> {error}
        </div>
      )}

      {loading && <LoadingScreen />}

      {view === "list" && renderList()}
      {view === "details" && renderDetails()}
    </div>
  );
};

export default CertificationTest;
