import { useEffect, useState } from "react";
import {
  Clock,
  Award,
  Users,
  CheckCircle,
  Calendar,
  BookOpen,
  Info,
} from "lucide-react";
import { Link, useParams } from "react-router";
import { MainNav } from "~/components/main-nav";
import { Button } from "~/components/ui/button";
import { Footer } from "~/components/footer";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Card, CardContent } from "~/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import useFormationStore from "~/store/use-formation-store";
import { LoadingScreen } from "~/components/loading-screen";
import user from "~/assets/user.png";
import type { Session } from "~/types/formation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import api from "~/api";
import echo from "../../echo";
import defaultLearningImage from "~/assets/Learning-bro.png";
import UpperNav from "~/components/upper-nav";

// Données fictives pour les formations
const getCourseTypeLabel = (courseType: string) => {
  return courseType === "DAY" ? "Cours du jour" : "Cours du soir";
};

const getLevelLabel = (level: string) => {
  switch (level) {
    case "beginner":
      return "Débutant";
    case "intermediate":
      return "Intermédiaire";
    case "advanced":
      return "Avancé";
    default:
      return level;
  }
};

export default function FormationDetailPage() {
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { formationDetails, fetchFormationDetails, loading, error } =
    useFormationStore();

  const formation = formationDetails;

  // Ajoutez cette fonction helper en haut du fichier
  const getTotalEnrolledStudents = (sessions: Session[]): number => {
    return sessions.reduce(
      (total, session) => total + session.enrolled_students,
      0
    );
  };

  echo
    .channel("formation-interests")
    .listen("NewFormationInterest", (e: any) => {
      console.log(e);
    });

  const handlePreregistration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message"),
      formation_id: formation?.id,
    };

    try {
      console.log("Données de préinscription:", data);
      await api.post("/admin/interests", data);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Erreur lors de la préinscription:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchFormationDetails(slug);
    }
  }, [fetchFormationDetails, slug]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (loading)
    return (
      <div>
        <LoadingScreen />
      </div>
    );

  if (error) return <div>Erreur : {error}</div>;

  // // Vérifier si le slug est une chaîne de caractères
  // const formationSlug = Array.isArray(slug) ? slug[0] : slug;

  // Récupérer les données de la formation

  if (!formation) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <UpperNav />
          <div className="container border-b">
            <MainNav />
          </div>
        </header>
        <main className="flex-1 container py-12">
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold mb-4">Formation non trouvée</h1>
            <p className="text-muted-foreground mb-8">
              La formation que vous recherchez n'existe pas ou a été déplacée.
            </p>
            <Button asChild>
              <Link to="/formations">Voir toutes nos formations</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <UpperNav />
        <div className="container border-b">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        <div
          className="relative h-[300px] md:h-[400px] w-full"
          style={{
            backgroundImage: `url(${formation.image || defaultLearningImage})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
          <div className="container relative z-10 flex h-full flex-col justify-center text-white">
            <Badge className="mb-4 w-fit">{formation.category.name}</Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {formation.name}
            </h1>
            <div className="mt-4 flex flex-wrap gap-4">
              <div className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                <span>{formation.duration} heures</span>
              </div>
              <div className="flex items-center">
                <Award className="mr-2 h-5 w-5" />
                <span>{getLevelLabel(formation.level)}</span>
              </div>
              {/* <div className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                <span>
                  {getTotalEnrolledStudents(formation.sessions)} étudiants
                  inscrits
                </span>
              </div> */}
            </div>
          </div>
        </div>

        <section className="container py-8">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-8 grid w-full grid-cols-3 md:w-auto">
              <TabsTrigger value="overview">Aperçu</TabsTrigger>
              <TabsTrigger value="program">Programme</TabsTrigger>
              <TabsTrigger value="certifications">Certifications</TabsTrigger>
              {/* <TabsTrigger value="testimonials">Témoignages</TabsTrigger> */}
            </TabsList>
            <TabsContent value="overview" className="space-y-8">
              <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Description</h2>
                    <p className="text-muted-foreground">
                      {formation.description}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4">
                      Objectifs de la formation
                    </h2>
                    <ul className="space-y-2">
                      {formation.objectives.map((objective, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
                          <span>{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4">Prérequis</h2>
                    <ul className="space-y-2">
                      {formation.prerequisites.map((prerequisite, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
                          <span>{prerequisite}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4">Formateur</h2>
                    <div className="flex items-start space-x-4">
                      <img
                        // src={formation.teacher.imageUrl || "/placeholder.svg"}
                        src={user}
                        alt={formation.sessions[0].teacher.fullName}
                        width={100}
                        height={100}
                        className="rounded-full"
                      />
                      <div>
                        <h3 className="text-xl font-medium">
                          {formation.sessions[0].teacher.fullName}
                        </h3>
                        <p className="text-primary font-medium">
                          {formation.sessions[0].teacher.title}
                        </p>
                        <p className="text-muted-foreground mt-2">
                          {formation.sessions[0].teacher.bio}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
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
                        <p className="text-muted-foreground text-center">
                          TVA incluse
                        </p>

                        {/* // dialog submission */}
                        <Dialog
                          open={isDialogOpen}
                          onOpenChange={setIsDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button className="w-full hover:cursor-pointer  bg-orange-600 hover:bg-orange-700">
                              Faire une Préinscription
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Préinscription à la formation
                              </DialogTitle>
                            </DialogHeader>
                            <form
                              onSubmit={handlePreregistration}
                              className="space-y-4"
                            >
                              <div className="space-y-2">
                                <Label htmlFor="fullName">Nom complet</Label>
                                <Input id="fullName" name="fullName" required />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                  id="email"
                                  name="email"
                                  type="email"
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="phone">Téléphone</Label>
                                <Input
                                  id="phone"
                                  name="phone"
                                  type="tel"
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea
                                  id="message"
                                  name="message"
                                  rows={5}
                                  placeholder="Précisez vos attentes, questions ou besoins spécifiques..."
                                />
                              </div>
                              <Button
                                type="submit"
                                className="w-full bg-orange-600 hover:bg-orange-700"
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? (
                                  <>
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                    Envoi en cours...
                                  </>
                                ) : (
                                  "Envoyer la préinscription"
                                )}
                              </Button>
                            </form>
                          </DialogContent>
                        </Dialog>

                        <div className="pt-4 border-t">
                          <h3 className="font-medium mb-2 flex items-center">
                            <Calendar className="mr-2 h-5 w-5 text-primary" />
                            Prochaine session
                          </h3>
                          <p className="font-medium">
                            Du {formation.sessions[0].start_date} au{" "}
                            {formation.sessions[0].end_date}
                          </p>
                          <div className="mt-2">
                            <h4 className="text-sm font-medium mb-1">
                              Type de cours :
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {getCourseTypeLabel(
                                formation.sessions[0].course_type
                              )}
                            </p>
                          </div>
                        </div>

                        {/* <div className="pt-4 border-t">
                          <h3 className="font-medium mb-2 flex items-center">
                            <Calendar className="mr-2 h-5 w-5 text-primary" />
                            Sessions suivantes
                          </h3>
                          <ul className="space-y-2">
                            {formation.sessions
                              .slice(1)
                              .map((session, index) => (
                                <li
                                  key={index}
                                  className="text-muted-foreground"
                                >
                                  {session.start_date}
                                </li>
                              ))}
                          </ul>
                        </div> */}

                        <div className="pt-4 border-t">
                          <h3 className="font-medium mb-2 flex items-center">
                            <Award className="mr-2 h-5 w-5 text-primary" />
                            Certifications incluses
                          </h3>
                          {formation.certifications &&
                          formation.certifications.length > 0 ? (
                            <ul className="space-y-2">
                              {formation.certifications.map(
                                (certification, index) => (
                                  <li
                                    key={index}
                                    className="text-muted-foreground"
                                  >
                                    {certification.name}
                                  </li>
                                )
                              )}
                            </ul>
                          ) : (
                            <p className="text-muted-foreground italic">
                              Aucune certification disponible pour cette
                              formation
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="program" className="space-y-8">
              <h2 className="text-3xl font-bold mb-6 text-primary">
                Programme de la formation
              </h2>
              <Accordion
                type="single"
                collapsible
                className="w-full shadow-sm border rounded-lg overflow-hidden"
              >
                {formation.modules.map((module, index) => (
                  <AccordionItem
                    key={index}
                    value={`module-${index}`}
                    className="border-b last:border-b-0"
                  >
                    <AccordionTrigger className="text-lg font-medium cursor-pointer hover:bg-muted/30 px-4 py-3">
                      <div className="flex items-center">
                        <span className="text-muted-foreground mr-3">
                          Module:
                        </span>
                        <span className="bg-primary/10 text-primary font-bold w-8 h-8 rounded-full flex items-center justify-center mr-3">
                          {index + 1}
                        </span>
                        {module.name}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 bg-muted/5 p-4">
                      <p className="text-muted-foreground border-l-4 border-primary/50 pl-3 py-2 italic bg-muted/20 rounded-r">
                        {module.description}
                      </p>
                      <div>
                        <h4 className="font-medium mb-4 flex items-center text-primary bg-primary/5 p-2 rounded-md">
                          <BookOpen className="mr-2 h-5 w-5 text-primary" />
                          Contenu du module
                        </h4>
                        <ul className="space-y-4 pl-0">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <li
                              key={lessonIndex}
                              className="pl-4 border-l-2 border-primary/30 hover:border-primary transition-all"
                            >
                              <div className="flex items-center mb-1">
                                <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded mr-2 flex-shrink-0">
                                  {lessonIndex + 1}
                                </span>
                                <span className="font-medium hover:text-primary">
                                  {lesson.name}
                                </span>
                              </div>
                              {lesson.description && (
                                <p className="text-sm text-muted-foreground ml-7">
                                  {lesson.description}
                                </p>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>

            <TabsContent value="certifications" className="space-y-8">
              <h2 className="text-3xl font-bold mb-6 text-primary">
                Certifications
              </h2>
              <div className="grid gap-8 md:grid-cols-2">
                {formation.certifications &&
                formation.certifications.length > 0 ? (
                  formation.certifications.map((certification, index) => (
                    <Card
                      key={index}
                      className="overflow-hidden border-2 hover:border-primary/50 transition-all hover:shadow-md"
                    >
                      <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-3 border-b">
                        <h3 className="text-xl font-semibold text-primary">
                          {certification.name}
                        </h3>
                      </div>
                      <CardContent className="p-6 flex flex-col md:flex-row gap-6">
                        <div className="flex-shrink-0">
                          <img
                            src={certification.image ?? defaultLearningImage}
                            alt={`Certification ${certification.name}`}
                            className="w-24 h-24 object-contain rounded-md border p-1"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-muted-foreground mb-4">
                            Cette certification reconnue internationalement
                            valide vos compétences en {formation.category.name}{" "}
                            et augmente votre valeur sur le marché du travail.
                          </p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                            <span>Reconnue internationalement</span>
                          </div>
                        </div>
                      </CardContent>
                      <div className="px-6 pb-6 pt-2 flex justify-end">
                        <button className="text-sm px-4 py-2 bg-primary/10 hover:bg-primary hover:text-white rounded-md transition-colors flex items-center">
                          <Info className="h-4 w-4 mr-2" />
                          En savoir plus
                        </button>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-2 flex flex-col items-center justify-center p-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-full shadow-sm mb-6">
                      <Award className="h-12 w-12 text-orange-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                      Aucune certification disponible
                    </h3>
                    <p className="text-center text-gray-600 dark:text-gray-400 max-w-md">
                      Cette formation se concentre sur l'acquisition de
                      compétences pratiques sans certification associée pour le
                      moment.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            {/* <TabsContent value="testimonials" className="space-y-8">
              <h2 className="text-2xl font-bold mb-6">
                Témoignages d'anciens étudiants
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {formation.testimonials.map((testimonial, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <blockquote className="border-l-2 border-primary pl-4 italic mb-4">
                        "{testimonial.testimonial}"
                      </blockquote>
                      <div className="flex items-center space-x-4">
                        <img
                          src={testimonial.image || "/placeholder.svg"}
                          alt={testimonial.name}
                          width={50}
                          height={50}
                          className="rounded-full"
                        />
                        <div>
                          <p className="font-medium">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.role}, {testimonial.company}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent> */}
          </Tabs>
        </section>

        {/* <section className="bg-muted py-12">
          <div className="container text-center">
            <h2 className="text-2xl font-bold mb-4">
              Prêt à développer vos compétences ?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-[600px] mx-auto">
              Rejoignez notre formation {formation.name} et obtenez des
              certifications reconnues dans le monde entier.
            </p>
            <Button asChild size="lg">
              <Link to="/contact#interest-form">Exprimer mon intérêt</Link>
            </Button>
          </div>
        </section> */}
      </main>
      <Footer />
    </div>
  );
}
