"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Clock,
  Award,
  Users,
  User,
  Calendar,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Link } from "react-router";
import { Footer } from "~/components/footer";
import { MainNav } from "~/components/main-nav";
import { Input } from "~/components/ui/input";
import useFormationStore from "~/store/use-formation-store";
import { LoadingScreen } from "~/components/loading-screen";
import useCategoryStore from "~/store/use-category-store";
import type { Session } from "~/types/formation";
import defaultLearningImage from "~/assets/Learning-bro.png";
import UpperNav from "~/components/upper-nav";

const ITEMS_PER_PAGE = 7; // Nombre d'éléments par page

export default function FormationsPage() {
  const { formations, fetchFormations, loading, error, removeFormation } =
    useFormationStore();

  const { categories, fetchCategories } = useCategoryStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const getTotalEnrolledStudents = (sessions: Session[]): number => {
    return sessions.reduce(
      (total, session) => total + session.enrolled_students,
      0
    );
  };

  const filteredFormations = formations.filter((formation) => {
    const matchesSearch =
      formation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formation.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || formation.category.name === categoryFilter;

    const matchesLevel =
      levelFilter === "all" ||
      (levelFilter === "debutant" && formation.level === "beginner") ||
      (levelFilter === "intermediaire" && formation.level === "intermediate") ||
      (levelFilter === "avance" && formation.level === "advanced");

    return matchesSearch && matchesCategory && matchesLevel;
  });

  // Calcul de la pagination
  const totalPages = Math.ceil(filteredFormations.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentFormations = filteredFormations.slice(startIndex, endIndex);

  const getCourseTypeLabel = (courseType: string) => {
    return courseType.toLowerCase() === "day course"
      ? "Cours du jour"
      : "Cours du soir";
  };

  const getBadgeLabel = (level: string) => {
    switch (level) {
      case "beginner":
        return "Débutant";
      case "intermediate":
        return "Intermédiaire";
      case "advanced":
        return "Avancé";
      default:
        return "Tous les niveaux";
    }
  };

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, levelFilter]);

  useEffect(() => {
    fetchFormations();
    fetchCategories();
  }, [fetchFormations, fetchCategories]);

  if (loading) return <LoadingScreen />;

  if (error) return <div>Erreur : {error}</div>;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <UpperNav />
        <div className="container border-b">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        <section className="relative py-12 md:py-16 lg:py-20 overflow-hidden bg-muted">
          {/* Image de fond bien visible mais discrète */}
          <div className="absolute inset-0 z-0">
            <img
              src={defaultLearningImage} // Remplacez par votre image
              alt="Arrière-plan formations"
              className="w-full h-full object-cover object-center opacity-30" // Opacité à 30% pour une bonne visibilité
            />
            <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-muted/70"></div>{" "}
            {/* Dégradé pour améliorer la lisibilité */}
          </div>

          {/* Contenu */}
          <div className="container relative z-10">
            <motion.div
              className="mx-auto max-w-[800px] text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground">
                Nos Formations
              </h1>
              <p className="mt-4 text-muted-foreground md:text-xl">
                Découvrez notre catalogue de formations certifiantes pour
                développer vos compétences et booster votre carrière
              </p>
            </motion.div>
          </div>
        </section>

        <section className="container py-12">
          <div className="mb-8 space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une formation..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e: any) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les niveaux</SelectItem>
                    <SelectItem value="debutant">Débutant</SelectItem>
                    <SelectItem value="intermediaire">Intermédiaire</SelectItem>
                    <SelectItem value="avance">Avancé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {filteredFormations.length === 0 ? (
            <div className="my-20 text-center">
              <h3 className="text-xl font-medium">
                Aucune formation ne correspond à votre recherche
              </h3>
              <p className="mt-2 text-muted-foreground">
                Essayez de modifier vos critères de recherche
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("all");
                  setLevelFilter("all");
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-8">
                {currentFormations.map((formation, index) => (
                  <motion.div
                    key={formation.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                        <div className="md:col-span-1 relative h-full min-h-[220px] md:min-h-[320px] bg-slate-50 flex items-center justify-center overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-tr from-orange-50 to-slate-50 opacity-50"></div>
                          <img
                            src={formation.image || defaultLearningImage}
                            alt={formation.name}
                            className="relative h-[80%] w-[80%] object-contain transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div className="md:col-span-2 p-6 md:p-8 flex flex-col">
                          <div className="flex items-center gap-4 mb-4">
                            <Badge className="px-3 py-1 font-medium text-xs bg-orange-100 text-orange-800 hover:bg-orange-200 border-0">
                              {getBadgeLabel(formation.level)}
                            </Badge>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="mr-2 h-4 w-4 text-orange-500" />
                              {formation.duration} heures
                            </div>
                          </div>

                          <h3 className="text-2xl font-bold mb-3 text-slate-800 leading-tight">
                            {formation.name}
                          </h3>

                          <p className="text-muted-foreground mb-6 line-clamp-2">
                            {formation.description}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 mb-6">
                            <div className="flex items-center text-sm text-slate-600">
                              <User className="mr-2 h-4 w-4 text-orange-500" />
                              <span className="mr-1">Formateur:</span>
                              <span className="font-medium">
                                {formation.sessions[0].teacher.fullName}
                              </span>
                            </div>

                            <div className="flex items-center text-sm text-slate-600">
                              <Calendar className="mr-2 h-4 w-4 text-orange-500" />
                              <span>
                                Du{" "}
                                <span className="font-medium">
                                  {formation.sessions[0].start_date}
                                </span>{" "}
                                au{" "}
                                <span className="font-medium">
                                  {formation.sessions[0].end_date}
                                </span>
                              </span>
                            </div>

                            <div className="flex items-center text-sm text-slate-600">
                              <BookOpen className="mr-2 h-4 w-4 text-orange-500" />
                              <span className="mr-1">Type:</span>
                              <span className="font-medium">
                                {getCourseTypeLabel(
                                  formation.sessions[0].course_type
                                )}
                              </span>
                            </div>
                          </div>

                          <div className="mb-6 bg-slate-50 p-3 rounded-lg">
                            <h4 className="text-sm font-medium mb-2 text-slate-700 flex items-center">
                              <Award className="mr-2 h-4 w-4 text-orange-500" />
                              Certifications
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {formation.certifications.map((cert, i) => (
                                <Badge
                                  key={i}
                                  variant="outline"
                                  className="bg-white text-slate-700 border-slate-200 font-normal"
                                >
                                  {cert.name}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center justify-center gap-3 mb-2">
                              {formation.discount_price ? (
                                <>
                                  <span className="text-3xl font-bold text-orange-600">
                                    {formation.discount_price} DT
                                  </span>
                                  <span className="text-xl text-gray-500 line-through">
                                    {formation.price} DT
                                  </span>
                                </>
                              ) : (
                                <span className="text-3xl font-bold text-orange-600">
                                  {formation.price} DT
                                </span>
                              )}
                            </div>

                            <Button
                              asChild
                              className="px-6 py-2 bg-orange-600 hover:bg-orange-700 transition-colors shadow-md hover:shadow-lg"
                            >
                              <Link
                                to={formation.link}
                                className="flex items-center"
                              >
                                Découvrir cette formation
                                <ChevronRight className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNumber) => (
                      <Button
                        key={pageNumber}
                        variant={
                          pageNumber === currentPage ? "default" : "outline"
                        }
                        onClick={() => setCurrentPage(pageNumber)}
                      >
                        {pageNumber}
                      </Button>
                    )
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
