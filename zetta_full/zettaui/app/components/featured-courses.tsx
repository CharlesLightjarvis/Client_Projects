"use client";

import { motion } from "framer-motion";
import {
  Clock,
  Award,
  Users,
  User,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { Link } from "react-router";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import useFormationStore from "~/store/use-formation-store";
import { useEffect } from "react";
import { LoadingScreen } from "./loading-screen";
import type { Session } from "~/types/formation";
import learning from "../assets/Learning-bro.png";

export function FeaturedCourses() {
  const { formations, fetchFormations, loading, error, removeFormation } =
    useFormationStore();

  const getTotalEnrolledStudents = (sessions: Session[]): number => {
    return sessions.reduce(
      (total, session) => total + session.enrolled_students,
      0
    );
  };

  const getCourseTypeLabel = (courseType: string) => {
    return courseType.toLowerCase() === "day course"
      ? "Cours du jour"
      : "Cours du soir";
  };

  useEffect(() => {
    fetchFormations();
  }, [fetchFormations]);

  if (loading)
    return (
      <div>
        <LoadingScreen />
      </div>
    );

  if (error) return <div>Erreur : {error}</div>;

  const featuredFormations = formations.slice(0, 3);

  return (
    <section className="container py-12 md:py-16 lg:py-20">
      <motion.div
        className="mb-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="w-20 h-1 bg-orange-600 mx-auto mb-6" />
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Formations populaires
        </h2>
        <p className="mt-4 text-muted-foreground">
          Découvrez nos formations les plus demandées sur le marché
        </p>
      </motion.div>

      <div className="space-y-8">
        {featuredFormations.map((course, index) => (
          <motion.div
            key={course.id}
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
                    src={course.image || learning}
                    alt={course.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="md:col-span-2 p-6 md:p-8 flex flex-col">
                  <div className="flex items-center gap-4 mb-4">
                    <Badge className="px-3 py-1 font-medium text-xs bg-orange-100 text-orange-800 hover:bg-orange-200 border-0">
                      {course.level}
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-2 h-4 w-4 text-orange-500" />
                      {course.duration} heures
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-3 text-slate-800 leading-tight">
                    {course.name}
                  </h3>

                  <p className="text-muted-foreground mb-6 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 mb-6">
                    <div className="flex items-center text-sm text-slate-600">
                      <User className="mr-2 h-4 w-4 text-orange-500" />
                      <span className="mr-1">Formateur:</span>
                      <span className="font-medium">
                        {course.sessions[0].teacher.fullName}
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-slate-600">
                      <BookOpen className="mr-2 h-4 w-4 text-orange-500" />
                      <span className="mr-1">Type:</span>
                      <span className="font-medium">
                        {getCourseTypeLabel(course.sessions[0].course_type)}
                      </span>
                    </div>
                  </div>

                  <div className="mb-6 bg-slate-50 p-3 rounded-lg">
                    <h4 className="text-sm font-medium mb-2 text-slate-700 flex items-center">
                      <Award className="mr-2 h-4 w-4 text-orange-500" />
                      Certifications
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {course.certifications.length === 0 ? (
                        <p className="semi-bold text-slate-700">
                          Aucune Certification disponible
                        </p>
                      ) : (
                        course.certifications.map((cert, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="bg-white text-slate-700 border-slate-200 font-normal"
                          >
                            {cert.name}
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      {course.discount_price === 0 ? (
                        <>
                          <span className="text-3xl font-bold text-orange-600">
                            {course.price} DT
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-3xl font-bold text-orange-600">
                            {course.discount_price} DT
                          </span>
                          <span className="text-xl text-gray-500 line-through">
                            {course.price} DT
                          </span>
                          <p className="text-muted-foreground text-center">
                            TVA incluse
                          </p>
                        </>
                      )}
                    </div>

                    <Button
                      asChild
                      className="px-6 py-2 bg-orange-600 hover:bg-orange-700 transition-colors shadow-md hover:shadow-lg"
                    >
                      <Link to={course.link} className="flex items-center">
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

      <div className="mt-12 text-center">
        <Button asChild variant="outline" size="lg">
          <Link to="/formations">
            Voir toutes nos formations
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
