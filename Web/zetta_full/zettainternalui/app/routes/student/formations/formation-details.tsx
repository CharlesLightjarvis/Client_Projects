"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  GraduationCap,
  Trophy,
  Calendar,
  User,
  Target,
  CheckCircle2,
  FileText,
  Award,
  Download,
  BookOpen,
  BarChart2,
  Info,
  ListChecks,
  Users,
  BookOpenCheck,
  FileQuestion,
  File,
  X,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Check,
} from "lucide-react";
import { useFormationsStore } from "~/hooks/use-formations-store";
import { LoadingScreen } from "~/components/loading-screen";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Link, useParams } from "react-router";
import { api } from "~/api";
import { Separator } from "~/components/ui/separator";
import { Progress } from "~/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "~/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import { toast } from "sonner";

// Types pour les données mockées
interface Resource {
  id: string;
  lesson_id: string;
  title: string;
  description: string;
  file_url: string;
  type: "video" | "pdf" | "image" | "audio";
  size: number;
}

interface QuizAnswer {
  id: number;
  text: string;
  correct: boolean;
}

interface QuizQuestion {
  id: string;
  question: string;
  answers: QuizAnswer[];
  difficulty: string;
  points: number;
  type: string;
}

interface LessonQuiz {
  lesson_id: string;
  lesson_name: string;
  module_id: string;
  module_name: string;
  questions: QuizQuestion[];
}

interface LessonProgress {
  lessonId: string;
  completed: boolean;
  resourcesViewed: string[];
  quizzesTaken: {
    quizId: string;
    score: number;
    passed: boolean;
    dateTaken: Date;
  }[];
}

// Données mockées pour la progression
const mockProgress: LessonProgress[] = [
  {
    lessonId: "lesson-1",
    completed: true,
    resourcesViewed: ["res-1-1"],
    quizzesTaken: [
      {
        quizId: "quiz-1-1",
        score: 80,
        passed: true,
        dateTaken: new Date(2023, 5, 15),
      },
    ],
  },
  {
    lessonId: "lesson-2",
    completed: false,
    resourcesViewed: [],
    quizzesTaken: [],
  },
];

export default function FormationDetails() {
  const { id } = useParams();
  const { selectedFormation, setSelectedFormation } = useFormationsStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("modules");
  const [expandedModules, setExpandedModules] = useState<
    Record<string, boolean>
  >({});

  // États pour les fonctionnalités avancées
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null
  );
  const [selectedQuiz, setSelectedQuiz] = useState<any | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [userProgress, setUserProgress] =
    useState<LessonProgress[]>(mockProgress);

  useEffect(() => {
    const fetchFormationDetails = async () => {
      if (!id) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await api.get(`/api/v1/student/formations/${id}`);
        console.log(response.data.formation);
        setSelectedFormation(response.data.formation);
      } catch (err: any) {
        console.error("Error fetching formation details:", err);
        setError(
          err.response?.data?.message || "Failed to load formation details"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchFormationDetails();
  }, [id, setSelectedFormation]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  // Fonctions pour gérer les ressources
  const handleResourceClick = (resource: Resource) => {
    setSelectedResource(resource);
    setIsResourceModalOpen(true);
  };

  const [previewPdf, setPreviewPdf] = useState<{
    open: boolean;
    url: string;
    title: string;
  }>({
    open: false,
    url: "",
    title: "",
  });

  const handleDownloadResource = async (resource: Resource) => {
    console.log("Downloading resource:", resource);

    if (!resource?.file_url) {
      toast.error("Erreur", {
        description: "Le chemin du fichier est indisponible.",
      });
      return;
    }

    setIsDownloading(resource.id);

    try {
      // Créer un lien de téléchargement
      const link = document.createElement("a");

      // Vérifier si file_path est une URL complète ou un chemin relatif
      const isFullUrl = resource.file_url.startsWith("http");
      const fileUrl = isFullUrl
        ? resource.file_url
        : `${api.defaults.baseURL || ""}${resource.file_url}`;

      link.href = fileUrl;
      link.download = resource.title || "document";
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      // Déclencher le téléchargement
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Mettre à jour la progression
      const updatedProgress = [...userProgress];
      const lessonProgress = updatedProgress.find((p) =>
        selectedFormation?.modules?.some((m) =>
          m.lessons?.some((l) => l.resources?.some((r) => r.id === resource.id))
        )
      );

      if (
        lessonProgress &&
        !lessonProgress.resourcesViewed.includes(resource.id)
      ) {
        lessonProgress.resourcesViewed.push(resource.id);
        setUserProgress(updatedProgress);
      }

      toast.success("Téléchargement lancé", {
        description: `Le téléchargement de ${resource.title} a commencé.`,
      });
    } catch (error) {
      console.error("Erreur de téléchargement:", error);
      toast.error("Échec du téléchargement", {
        description:
          "Impossible de télécharger le fichier. Veuillez réessayer.",
      });
    } finally {
      setIsDownloading(null);
    }
  };

  // Fonctions pour gérer les quiz
  const handleStartQuiz = (quiz: any) => {
    setSelectedQuiz(quiz);
    setCurrentQuestionIndex(0);
    setQuizAnswers({});
    setQuizCompleted(false);
    setQuizScore(0);
    setIsQuizModalOpen(true);
  };

  const getQuizzesForLesson = (lessonId: string) => {
    if (!selectedFormation?.lesson_quizzes) return [];

    const lessonQuizzes = selectedFormation.lesson_quizzes.filter(
      (quiz: any) => quiz.lesson_id === lessonId
    );

    if (lessonQuizzes.length === 0) return [];

    // Transform the backend quiz format to the format expected by the UI
    return lessonQuizzes.map((lessonQuiz: any) => ({
      id: `quiz-${lessonQuiz.lesson_id}`,
      name: `Quiz d'évaluation - ${lessonQuiz.lesson_name}`,
      description: `Testez vos connaissances sur ${lessonQuiz.lesson_name}`,
      questions: lessonQuiz.questions.map((question: any) => ({
        id: question.id,
        question: question.question,
        options: question.answers.map((answer: any) => ({
          id: answer.id.toString(),
          text: answer.text,
        })),
        correctAnswer:
          question.answers
            .find((answer: any) => answer.correct)
            ?.id.toString() || "0",
        explanation: `Question de difficulté ${question.difficulty} - ${question.points} points`,
        difficulty: question.difficulty,
        points: question.points,
      })),
      passingScore: 60, // Default passing score
      originalData: lessonQuiz, // Keep the original data for reference
    }));
  };

  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const handleNextQuestion = () => {
    if (
      selectedQuiz &&
      currentQuestionIndex < selectedQuiz.questions.length - 1
    ) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Calculer le score
      calculateQuizScore();
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const calculateQuizScore = () => {
    if (!selectedQuiz) return;

    let correctAnswers = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    selectedQuiz.questions.forEach((question: any) => {
      // Get points from the question
      const points = question.points || 1;
      totalPoints += points;

      if (quizAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
        earnedPoints += points;
      }
    });

    const score = Math.round((earnedPoints / totalPoints) * 100);
    setQuizScore(score);
    setQuizCompleted(true);

    // Update progress
    const updatedProgress = [...userProgress];
    const lessonId = selectedQuiz.originalData?.lesson_id;

    if (lessonId) {
      let lessonProgress = updatedProgress.find((p) => p.lessonId === lessonId);

      if (!lessonProgress) {
        lessonProgress = {
          lessonId,
          completed: false,
          resourcesViewed: [],
          quizzesTaken: [],
        };
        updatedProgress.push(lessonProgress);
      }

      lessonProgress.quizzesTaken.push({
        quizId: selectedQuiz.id,
        score,
        passed: score >= selectedQuiz.passingScore,
        dateTaken: new Date(),
      });

      // Check if the lesson is completed
      const resources =
        selectedFormation?.modules
          ?.flatMap((m) => m.lessons || [])
          ?.find((l) => l.id === lessonId)?.resources || [];

      const allResourcesViewed = resources.every((r) =>
        lessonProgress?.resourcesViewed.includes(r.id)
      );

      // Get quizzes for this lesson
      const lessonQuizzes = getQuizzesForLesson(lessonId);

      const allQuizzesPassed = lessonQuizzes.every((q: any) =>
        lessonProgress?.quizzesTaken.some(
          (qt) => qt.quizId === q.id && qt.passed
        )
      );

      if (allResourcesViewed && allQuizzesPassed) {
        lessonProgress.completed = true;
      }

      setUserProgress(updatedProgress);
    }
  };

  const getLessonProgress = (lessonId: string) => {
    return (
      userProgress.find((p) => p.lessonId === lessonId) || {
        lessonId,
        completed: false,
        resourcesViewed: [],
        quizzesTaken: [],
      }
    );
  };

  const getResourceViewedStatus = (resourceId: string) => {
    return userProgress.some((p) => p.resourcesViewed.includes(resourceId));
  };

  const getQuizStatus = (quizId: string) => {
    for (const progress of userProgress) {
      const quizTaken = progress.quizzesTaken.find((q) => q.quizId === quizId);
      if (quizTaken) {
        return quizTaken;
      }
    }
    return null;
  };

  const getProgressPercentage = () => {
    // Placeholder - à remplacer par le calcul réel de progression
    return 35;
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-10">
          <div className="bg-destructive/10 dark:bg-destructive/20 border border-destructive text-destructive px-4 py-3 rounded">
            <strong>Erreur:</strong> {error}
          </div>
        </div>
      </div>
    );
  }

  if (!selectedFormation) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-10">
          <h1 className="text-2xl font-bold text-foreground">
            Formation introuvable
          </h1>
          <Link to="/student/dashboard/formations">
            <Button variant="ghost" className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux formations
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 max-w-[1400px]">
        <div className="flex flex-col space-y-2 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link to="/student/dashboard/formations">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold tracking-tight">
                {selectedFormation.name}
              </h1>
              <Badge variant="outline" className="ml-2">
                {selectedFormation.category.name}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-4 w-4" />
                Télécharger
              </Button>
              <Button size="sm" className="gap-1">
                S'inscrire
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground">
            Explorez les détails, le programme et les sessions de cette
            formation
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Durée</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {selectedFormation.duration}h
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
                {selectedFormation.level}
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
                {selectedFormation.modules?.length || 0}
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
                {selectedFormation.price} DT
              </div>
              <p className="text-xs text-muted-foreground">
                Investissement total
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="sticky top-6"
            >
              <Card className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle>Informations</CardTitle>
                  <CardDescription>Détails sur cette formation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Progression</span>
                      <span className="text-sm font-medium">
                        {getProgressPercentage()}%
                      </span>
                    </div>
                    <Progress value={getProgressPercentage()} className="h-2" />
                  </div>

                  <Separator />

                  {/* Teacher */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Formateur</h3>
                    {selectedFormation.sessions &&
                      selectedFormation.sessions[0]?.teacher && (
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback>
                              {selectedFormation.sessions[0].teacher.fullName.charAt(
                                0
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">
                              {selectedFormation.sessions[0].teacher.fullName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Formateur professionnel
                            </p>
                          </div>
                        </div>
                      )}
                  </div>

                  <Separator />

                  {/* Sessions */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">
                      Sessions disponibles
                    </h3>
                    <div className="space-y-2">
                      {selectedFormation.sessions?.map((session, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span className="text-sm">
                              {format(new Date(session.start_date), "dd MMM", {
                                locale: fr,
                              })}{" "}
                              -{" "}
                              {format(new Date(session.end_date), "dd MMM", {
                                locale: fr,
                              })}
                            </span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {session.teacher.fullName.split(" ")[0]}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Certifications */}
                  {selectedFormation.certifications &&
                    selectedFormation.certifications.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium mb-3">
                          Certifications
                        </h3>
                        <div className="space-y-2">
                          {selectedFormation.certifications.map(
                            (certification, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 p-2 rounded-md bg-muted/50"
                              >
                                <Award className="h-4 w-4 text-amber-500" />
                                <span className="text-sm">
                                  {certification.name}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </CardContent>
                <CardFooter className="bg-muted/50 px-6 py-4">
                  <Button className="w-full">S'inscrire à la formation</Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-2">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="space-y-6"
            >
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <CardTitle>À propos de la formation</CardTitle>
                      <CardDescription>
                        Découvrez tous les détails de cette formation
                      </CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-primary border-primary/20 bg-primary/5 self-start sm:self-auto"
                    >
                      {selectedFormation.level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <div className="px-6">
                      <TabsList className="w-full grid grid-cols-5 h-10">
                        <TabsTrigger value="overview" className="text-xs">
                          <Info className="h-3.5 w-3.5 mr-1.5" />
                          Aperçu
                        </TabsTrigger>
                        <TabsTrigger value="objectives" className="text-xs">
                          <Target className="h-3.5 w-3.5 mr-1.5" />
                          Objectifs
                        </TabsTrigger>
                        <TabsTrigger value="modules" className="text-xs">
                          <ListChecks className="h-3.5 w-3.5 mr-1.5" />
                          Programme
                        </TabsTrigger>
                        <TabsTrigger value="sessions" className="text-xs">
                          <Calendar className="h-3.5 w-3.5 mr-1.5" />
                          Sessions
                        </TabsTrigger>
                        <TabsTrigger value="certifications" className="text-xs">
                          <Award className="h-3.5 w-3.5 mr-1.5" />
                          Certifications
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <div className="mt-6 pb-6">
                      <TabsContent
                        value="overview"
                        className="px-6 space-y-6 m-0"
                      >
                        <div className="prose max-w-none dark:prose-invert">
                          <p className="text-base leading-relaxed">
                            {selectedFormation.description}
                          </p>
                        </div>

                        {selectedFormation.prerequisites &&
                          selectedFormation.prerequisites.length > 0 && (
                            <div className="mt-6">
                              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-primary" />
                                Prérequis
                              </h3>
                              <div className="grid sm:grid-cols-2 gap-3">
                                {selectedFormation.prerequisites.map(
                                  (prereq, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center gap-3 bg-muted/30 p-3 rounded-lg border border-border"
                                    >
                                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                                      <span className="text-foreground">
                                        {prereq}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                      </TabsContent>

                      <TabsContent
                        value="objectives"
                        className="px-6 space-y-6 m-0"
                      >
                        <div>
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Target className="h-5 w-5 text-primary" />
                            Objectifs d'apprentissage
                          </h3>
                          <div className="grid sm:grid-cols-2 gap-3">
                            {selectedFormation.objectives?.map(
                              (objective, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-3 bg-muted/30 p-4 rounded-lg border border-border"
                                >
                                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Target className="h-4 w-4 text-primary" />
                                  </div>
                                  <span className="text-foreground">
                                    {objective}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="modules" className="px-6 m-0">
                        <ScrollArea className="h-[600px] pr-4">
                          <div className="space-y-4">
                            {selectedFormation.modules?.map((module, index) => (
                              <Card
                                key={index}
                                className="overflow-hidden border"
                              >
                                <CardHeader className="bg-muted/30 pb-3">
                                  <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                      <span className="text-sm font-medium text-primary">
                                        {index + 1}
                                      </span>
                                    </div>
                                    <div>
                                      <CardTitle className="text-base">
                                        {module.name}
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
                                  <Accordion type="multiple" className="w-full">
                                    {module.lessons.map(
                                      (lesson, lessonIndex) => {
                                        const lessonProgress =
                                          getLessonProgress(lesson.id);
                                        const resources =
                                          lesson.resources || [];
                                        const quizzes = getQuizzesForLesson(
                                          lesson.id
                                        );

                                        return (
                                          <AccordionItem
                                            key={lessonIndex}
                                            value={`lesson-${module.id}-${lessonIndex}`}
                                            className="border-b border-border last:border-0"
                                          >
                                            <AccordionTrigger className="py-3 hover:no-underline">
                                              <div className="flex items-center justify-between w-full pr-4">
                                                <div className="flex items-center gap-3">
                                                  <div
                                                    className={cn(
                                                      "h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0",
                                                      lessonProgress.completed
                                                        ? "bg-green-100 dark:bg-green-900/30"
                                                        : "bg-muted"
                                                    )}
                                                  >
                                                    {lessonProgress.completed ? (
                                                      <CheckCircle className="h-3 w-3 text-green-500" />
                                                    ) : (
                                                      <FileText className="h-3 w-3 text-muted-foreground" />
                                                    )}
                                                  </div>
                                                  <span className="text-sm font-medium">
                                                    {lesson.name}
                                                  </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                  {resources.length > 0 && (
                                                    <Badge
                                                      variant="outline"
                                                      className="text-xs"
                                                    >
                                                      {resources.length}{" "}
                                                      ressource
                                                      {resources.length > 1
                                                        ? "s"
                                                        : ""}
                                                    </Badge>
                                                  )}
                                                  {quizzes.length > 0 && (
                                                    <Badge
                                                      variant="outline"
                                                      className="text-xs bg-primary/5 text-primary border-primary/20"
                                                    >
                                                      {quizzes.length} quiz
                                                    </Badge>
                                                  )}
                                                </div>
                                              </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="pb-4 pt-1">
                                              <div className="pl-9 space-y-4">
                                                {/* Ressources */}
                                                {resources.length > 0 && (
                                                  <div className="space-y-2">
                                                    <h4 className="text-sm font-medium flex items-center gap-2 text-primary">
                                                      <BookOpenCheck className="h-4 w-4" />
                                                      Ressources
                                                    </h4>
                                                    <div className="space-y-1">
                                                      {resources.map(
                                                        (resource: any) => {
                                                          const isViewed =
                                                            getResourceViewedStatus(
                                                              resource.id
                                                            );

                                                          return (
                                                            <div
                                                              key={resource.id}
                                                              className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors text-sm border border-border/50"
                                                            >
                                                              <div className="flex items-center gap-2">
                                                                <File className="h-4 w-4 text-red-500" />
                                                                <div>
                                                                  <div className="flex items-center gap-2">
                                                                    <span className="font-medium">
                                                                      {
                                                                        resource.title
                                                                      }
                                                                    </span>
                                                                    {isViewed && (
                                                                      <Badge
                                                                        variant="outline"
                                                                        className="text-[10px] py-0 h-4 bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                                                                      >
                                                                        Consulté
                                                                      </Badge>
                                                                    )}
                                                                  </div>
                                                                  {resource.description && (
                                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                                      {
                                                                        resource.description
                                                                      }
                                                                    </p>
                                                                  )}
                                                                </div>
                                                              </div>
                                                              <div className="flex items-center gap-2">
                                                                <div className="text-xs text-muted-foreground">
                                                                  {
                                                                    resource.size
                                                                  }
                                                                </div>
                                                                <div className="flex gap-1">
                                                                  <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-7 w-7"
                                                                    onClick={() =>
                                                                      handleResourceClick(
                                                                        resource
                                                                      )
                                                                    }
                                                                  >
                                                                    <File className="h-3.5 w-3.5" />
                                                                  </Button>
                                                                  <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-7 w-7"
                                                                    onClick={() =>
                                                                      handleDownloadResource(
                                                                        resource
                                                                      )
                                                                    }
                                                                    disabled={
                                                                      isDownloading ===
                                                                      resource.id
                                                                    }
                                                                  >
                                                                    {isDownloading ===
                                                                    resource.id ? (
                                                                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                                    ) : (
                                                                      <Download className="h-3.5 w-3.5" />
                                                                    )}
                                                                  </Button>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          );
                                                        }
                                                      )}
                                                    </div>
                                                  </div>
                                                )}

                                                {/* Quiz */}
                                                {quizzes.length > 0 && (
                                                  <div className="space-y-2">
                                                    <h4 className="text-sm font-medium flex items-center gap-2 text-primary">
                                                      <FileQuestion className="h-4 w-4" />
                                                      Quiz et évaluations
                                                    </h4>
                                                    <div className="space-y-2">
                                                      {quizzes.map(
                                                        (quiz: any) => {
                                                          const quizStatus =
                                                            getQuizStatus(
                                                              quiz.id
                                                            );

                                                          return (
                                                            <div
                                                              key={quiz.id}
                                                              className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50 transition-colors text-sm border border-border/50"
                                                            >
                                                              <div className="flex items-center gap-3">
                                                                <div
                                                                  className={cn(
                                                                    "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                                                                    quizStatus?.passed
                                                                      ? "bg-green-100 dark:bg-green-900/30"
                                                                      : quizStatus
                                                                      ? "bg-amber-100 dark:bg-amber-900/30"
                                                                      : "bg-primary/10"
                                                                  )}
                                                                >
                                                                  {quizStatus?.passed ? (
                                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                                  ) : quizStatus ? (
                                                                    <AlertCircle className="h-4 w-4 text-amber-500" />
                                                                  ) : (
                                                                    <FileQuestion className="h-4 w-4 text-primary" />
                                                                  )}
                                                                </div>
                                                                <div>
                                                                  <div className="font-medium">
                                                                    {quiz.name}
                                                                  </div>
                                                                  {quiz.description && (
                                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                                      {
                                                                        quiz.description
                                                                      }
                                                                    </p>
                                                                  )}
                                                                </div>
                                                              </div>
                                                              <div className="flex items-center gap-3">
                                                                {quizStatus && (
                                                                  <div className="flex flex-col items-end">
                                                                    <div className="flex items-center gap-1">
                                                                      <span className="text-xs font-medium">
                                                                        Score:{" "}
                                                                        {
                                                                          quizStatus.score
                                                                        }
                                                                        %
                                                                      </span>
                                                                      <Badge
                                                                        variant={
                                                                          quizStatus.passed
                                                                            ? "default"
                                                                            : "outline"
                                                                        }
                                                                        className="text-[10px] py-0 h-4"
                                                                      >
                                                                        {quizStatus.passed
                                                                          ? "Réussi"
                                                                          : "Échoué"}
                                                                      </Badge>
                                                                    </div>
                                                                    <span className="text-[10px] text-muted-foreground">
                                                                      {format(
                                                                        new Date(
                                                                          quizStatus.dateTaken
                                                                        ),
                                                                        "dd/MM/yyyy"
                                                                      )}
                                                                    </span>
                                                                  </div>
                                                                )}
                                                                <Button
                                                                  variant={
                                                                    quizStatus
                                                                      ? "outline"
                                                                      : "default"
                                                                  }
                                                                  size="sm"
                                                                  onClick={() =>
                                                                    handleStartQuiz(
                                                                      quiz
                                                                    )
                                                                  }
                                                                >
                                                                  {quizStatus
                                                                    ? "Reprendre"
                                                                    : "Commencer"}
                                                                </Button>
                                                              </div>
                                                            </div>
                                                          );
                                                        }
                                                      )}
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                            </AccordionContent>
                                          </AccordionItem>
                                        );
                                      }
                                    )}
                                  </Accordion>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </ScrollArea>
                      </TabsContent>

                      <TabsContent
                        value="sessions"
                        className="px-6 space-y-4 m-0"
                      >
                        <div>
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-primary" />
                            Sessions programmées
                          </h3>
                          <div className="grid gap-4">
                            {selectedFormation.sessions?.map(
                              (session, index) => (
                                <Card
                                  key={index}
                                  className="overflow-hidden border hover:border-primary/20 transition-colors"
                                >
                                  <CardContent className="p-0">
                                    <div className="flex flex-col sm:flex-row items-start">
                                      <div className="p-4 sm:p-6 bg-primary/5 flex items-center justify-center sm:w-48 w-full">
                                        <div className="text-center">
                                          <Calendar className="h-6 w-6 text-primary mx-auto mb-2" />
                                          <div className="text-sm font-medium">
                                            {format(
                                              new Date(session.start_date),
                                              "dd MMM",
                                              { locale: fr }
                                            )}
                                            {" - "}
                                            {format(
                                              new Date(session.end_date),
                                              "dd MMM yyyy",
                                              { locale: fr }
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="p-4 sm:p-6 flex-grow">
                                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                                          <div className="space-y-3">
                                            <h3 className="font-medium">
                                              Session {index + 1}
                                            </h3>
                                            <div className="flex items-center gap-2">
                                              <User className="h-4 w-4 text-primary" />
                                              <span className="text-sm">
                                                Formateur:{" "}
                                                {session.teacher.fullName}
                                              </span>
                                            </div>
                                          </div>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="mt-2 sm:mt-0"
                                          >
                                            Détails
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              )
                            )}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent
                        value="certifications"
                        className="px-6 space-y-4 m-0"
                      >
                        <div>
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Award className="h-5 w-5 text-primary" />
                            Certifications disponibles
                          </h3>
                          <div className="grid sm:grid-cols-2 gap-4">
                            {selectedFormation.certifications?.map(
                              (certification, index) => (
                                <Card
                                  key={index}
                                  className="overflow-hidden border hover:border-amber-200 transition-colors"
                                >
                                  <div className="h-1.5 bg-gradient-to-r from-amber-400 to-amber-500"></div>
                                  <CardContent className="p-6">
                                    <div className="flex items-center gap-4">
                                      <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                                        <Award className="h-6 w-6 text-amber-500" />
                                      </div>
                                      <div>
                                        <h3 className="font-medium">
                                          {certification.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                          Certification professionnelle reconnue
                                        </p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              )
                            )}
                          </div>
                        </div>
                      </TabsContent>
                    </div>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Additional information */}
              <Card>
                <CardHeader>
                  <CardTitle>Statistiques de la formation</CardTitle>
                  <CardDescription>
                    Informations complémentaires sur cette formation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg">
                      <Users className="h-8 w-8 text-primary mb-2" />
                      <span className="text-2xl font-bold">24</span>
                      <span className="text-sm text-muted-foreground">
                        Étudiants inscrits
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg">
                      <BarChart2 className="h-8 w-8 text-primary mb-2" />
                      <span className="text-2xl font-bold">92%</span>
                      <span className="text-sm text-muted-foreground">
                        Taux de satisfaction
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg">
                      <Award className="h-8 w-8 text-primary mb-2" />
                      <span className="text-2xl font-bold">18</span>
                      <span className="text-sm text-muted-foreground">
                        Certifications délivrées
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modal pour afficher les ressources PDF */}
      <Dialog open={isResourceModalOpen} onOpenChange={setIsResourceModalOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{selectedResource?.title}</DialogTitle>
            <DialogDescription>
              {selectedResource?.description || "Ressource pédagogique"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="border rounded-md overflow-hidden h-[400px] flex items-center justify-center bg-muted/30">
              <div className="text-center p-6">
                <File className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Aperçu du document PDF
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Taille: {selectedResource?.size}
                </p>
                <Button
                  onClick={() =>
                    selectedResource && handleDownloadResource(selectedResource)
                  }
                >
                  {isDownloading === selectedResource?.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Téléchargement...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Télécharger
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Fermer</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal pour les quiz */}
      <Dialog open={isQuizModalOpen} onOpenChange={setIsQuizModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[95vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>{selectedQuiz?.name}</DialogTitle>
            <DialogDescription>
              {selectedQuiz?.description || "Évaluez vos connaissances"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 overflow-y-auto max-h-[calc(90vh-8rem)] pr-2">
            {!quizCompleted ? (
              <div className="space-y-6">
                {selectedQuiz && (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Question {currentQuestionIndex + 1} sur{" "}
                        {selectedQuiz.questions.length}
                      </div>
                      <div className="text-sm font-medium">
                        Score minimum: {selectedQuiz.passingScore}%
                      </div>
                    </div>
                    <Progress
                      value={
                        ((currentQuestionIndex + 1) /
                          selectedQuiz.questions.length) *
                        100
                      }
                      className="h-2"
                    />

                    <div className="border rounded-md p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">
                          {
                            selectedQuiz?.questions[currentQuestionIndex]
                              ?.question
                          }
                        </h3>

                        {/* Difficulty badge */}
                        {selectedQuiz?.questions[currentQuestionIndex]
                          ?.difficulty && (
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs",
                              selectedQuiz.questions[currentQuestionIndex]
                                .difficulty === "easy"
                                ? "bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                                : selectedQuiz.questions[currentQuestionIndex]
                                    .difficulty === "medium"
                                ? "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
                                : "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                            )}
                          >
                            {selectedQuiz.questions[currentQuestionIndex]
                              .difficulty === "easy"
                              ? "Facile"
                              : selectedQuiz.questions[currentQuestionIndex]
                                  .difficulty === "medium"
                              ? "Moyen"
                              : "Difficile"}
                            {" - "}
                            {
                              selectedQuiz.questions[currentQuestionIndex]
                                .points
                            }{" "}
                            point
                            {selectedQuiz.questions[currentQuestionIndex]
                              .points > 1
                              ? "s"
                              : ""}
                          </Badge>
                        )}
                      </div>

                      <RadioGroup
                        value={
                          quizAnswers[
                            selectedQuiz?.questions[currentQuestionIndex]?.id
                          ]
                        }
                        onValueChange={(value) =>
                          handleAnswerSelect(
                            selectedQuiz?.questions[currentQuestionIndex]?.id,
                            value
                          )
                        }
                      >
                        {selectedQuiz?.questions[
                          currentQuestionIndex
                        ]?.options.map((option: any) => (
                          <div
                            key={option.id}
                            className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted"
                          >
                            <RadioGroupItem
                              value={option.id}
                              id={`option-${option.id}`}
                            />
                            <Label
                              htmlFor={`option-${option.id}`}
                              className="flex-grow cursor-pointer"
                            >
                              {option.text}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={handlePrevQuestion}
                        disabled={currentQuestionIndex === 0}
                      >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Précédent
                      </Button>
                      <Button
                        onClick={handleNextQuestion}
                        disabled={
                          !quizAnswers[
                            selectedQuiz?.questions[currentQuestionIndex]?.id
                          ]
                        }
                      >
                        {currentQuestionIndex ===
                        selectedQuiz.questions.length - 1 ? (
                          <>
                            Terminer
                            <Check className="ml-2 h-4 w-4" />
                          </>
                        ) : (
                          <>
                            Suivant
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="border rounded-md p-6 text-center">
                  <div
                    className={cn(
                      "h-16 w-16 rounded-full mx-auto mb-4 flex items-center justify-center",
                      quizScore >= (selectedQuiz?.passingScore || 0)
                        ? "bg-green-100 dark:bg-green-900/30"
                        : "bg-amber-100 dark:bg-amber-900/30"
                    )}
                  >
                    {quizScore >= (selectedQuiz?.passingScore || 0) ? (
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    ) : (
                      <AlertCircle className="h-8 w-8 text-amber-500" />
                    )}
                  </div>

                  <h3 className="text-xl font-bold mb-2">
                    {quizScore >= (selectedQuiz?.passingScore || 0)
                      ? "Félicitations !"
                      : "Essayez encore !"}
                  </h3>

                  <p className="text-muted-foreground mb-4">
                    {quizScore >= (selectedQuiz?.passingScore || 0)
                      ? "Vous avez réussi le quiz avec succès."
                      : "Vous n'avez pas atteint le score minimum requis."}
                  </p>

                  <div className="flex items-center justify-center gap-2 mb-6">
                    <div className="text-3xl font-bold">{quizScore}%</div>
                    <div className="text-sm text-muted-foreground">
                      (Score minimum: {selectedQuiz?.passingScore}%)
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Révision des questions</h4>
                    <div className="space-y-2">
                      {selectedQuiz?.questions.map(
                        (question: any, index: any) => {
                          const isCorrect =
                            quizAnswers[question.id] === question.correctAnswer;

                          return (
                            <div
                              key={question.id}
                              className={cn(
                                "p-3 rounded-md text-sm border",
                                isCorrect
                                  ? "bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800"
                                  : "bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800"
                              )}
                            >
                              <div className="flex items-start gap-2">
                                <div
                                  className={cn(
                                    "mt-0.5 h-4 w-4 rounded-full flex-shrink-0 flex items-center justify-center",
                                    isCorrect ? "bg-green-500" : "bg-red-500"
                                  )}
                                >
                                  {isCorrect ? (
                                    <Check className="h-3 w-3 text-white" />
                                  ) : (
                                    <X className="h-3 w-3 text-white" />
                                  )}
                                </div>
                                <div>
                                  <div className="flex items-center justify-between">
                                    <div className="font-medium">
                                      {question.question}
                                    </div>
                                    <Badge
                                      variant="outline"
                                      className={cn(
                                        "text-xs ml-2",
                                        question.difficulty === "easy"
                                          ? "bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                                          : question.difficulty === "medium"
                                          ? "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
                                          : "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                                      )}
                                    >
                                      {question.points} point
                                      {question.points > 1 ? "s" : ""}
                                    </Badge>
                                  </div>
                                  <div className="mt-1 text-xs">
                                    <span className="font-medium">
                                      Votre réponse:
                                    </span>{" "}
                                    {question.options.find(
                                      (o: any) =>
                                        o.id === quizAnswers[question.id]
                                    )?.text || "Aucune réponse"}
                                  </div>
                                  {!isCorrect && (
                                    <div className="mt-1 text-xs text-green-600 dark:text-green-400">
                                      <span className="font-medium">
                                        Réponse correcte:
                                      </span>{" "}
                                      {
                                        question.options.find(
                                          (o: any) =>
                                            o.id === question.correctAnswer
                                        )?.text
                                      }
                                    </div>
                                  )}
                                  {question.explanation && (
                                    <div className="mt-2 text-xs p-2 bg-muted rounded-sm">
                                      <span className="font-medium">
                                        Explication:
                                      </span>{" "}
                                      {question.explanation}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            {quizCompleted ? (
              <div className="flex gap-2 w-full justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsQuizModalOpen(false)}
                >
                  Fermer
                </Button>
                <Button
                  onClick={() => {
                    setQuizCompleted(false);
                    setCurrentQuestionIndex(0);
                    setQuizAnswers({});
                  }}
                >
                  Recommencer
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <Button
                  variant="ghost"
                  onClick={() => setIsQuizModalOpen(false)}
                >
                  Quitter
                </Button>
                <div className="text-sm text-muted-foreground">
                  Répondez à toutes les questions pour terminer le quiz
                </div>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
