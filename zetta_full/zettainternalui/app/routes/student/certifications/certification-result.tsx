import React from "react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  Award,
  RotateCcw,
  Home,
  GraduationCap,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { useNavigate, useLocation } from "react-router";

interface QuizResult {
  certification_name: string;
  score: number;
  passing_score: number;
  passed: boolean;
  attempt_number: number;
  completed_at: string;
  questions: Array<{
    question: string;
    student_answer: string;
    correct_answer: string;
    is_correct: boolean;
    points_earned: number;
    points_possible: number;
    difficulty: string;
  }>;
  total_questions: number;
  correct_answers: number;
}

interface LearningResult {
  mode: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  questions: Array<{
    id: string;
    chapter_id: string;
    chapter_name: string;
    question: string;
    answers: Array<{
      id: number;
      text: string;
      correct: boolean;
    }>;
    type: string;
    difficulty: string;
    points: number;
    user_answers: number[];
    is_correct: boolean;
  }>;
}

export default function ExamResults() {
  const location = useLocation();
  const navigate = useNavigate();

  // Gérer les deux types de résultats
  const examResult = location.state?.examResult;
  const learningResult = location.state?.learningResult;

  const isLearningMode = !!learningResult;
  const result = isLearningMode ? learningResult : examResult;

  const pathParts = location.pathname.split("/");
  const slug = pathParts[pathParts.indexOf("certifications") + 1];

  if (!result) {
    return <div>Chargement des résultats...</div>;
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  const totalPointsPossible = isLearningMode
    ? result.questions.reduce((sum: number, q: any) => sum + q.points, 0)
    : result.questions.reduce((sum: number, q: any) => sum + q.points_possible, 0);

  const totalPointsEarned = isLearningMode
    ? result.questions.reduce(
        (sum: number, q: any) => sum + (q.is_correct ? q.points : 0),
        0
      )
    : result.questions.reduce((sum: number, q: any) => sum + q.points_earned, 0);

  const passingScore = isLearningMode ? 75 : result.passing_score; // Valeur par défaut pour le mode apprentissage
  const passed = isLearningMode ? result.score >= passingScore : result.passed;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-blue-50 dark:hover:bg-blue-950"
                onClick={() => navigate("/student/dashboard")}
              >
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="hover:bg-blue-50 dark:hover:bg-blue-950"
                onClick={() => navigate("/student/dashboard/certifications")}
              >
                <GraduationCap className="h-4 w-4 mr-2" />
                Certifications
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Recommencer l'examen
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Recommencer l'examen ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Vous allez pouvoir choisir à nouveau le mode d'examen
                      (strict ou relax). Votre tentative actuelle sera conservée
                      dans votre historique.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() =>
                        navigate(
                          `/student/dashboard/certifications/${slug}/certification-mode`
                        )
                      }
                    >
                      Continuer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {!passed && (
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900 dark:text-blue-100">
                  Conseil pour la prochaine tentative
                </h3>
                <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                  Prenez le temps de revoir les questions où vous avez fait des
                  erreurs. Vous pouvez aussi choisir le mode "relax" pour vous
                  entraîner sans limite de temps.
                </p>
              </div>
            </div>
          )}
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold dark:text-white">
                  Résultats {isLearningMode ? "d'apprentissage" : "de l'examen"}{" "}
                  : {result.certification_name || "Certification"}
                </h1>
                <div className="flex items-center gap-2">
                  {isLearningMode && (
                    <Badge variant="outline">Mode Apprentissage</Badge>
                  )}
                  <Badge variant={passed ? "default" : "destructive"}>
                    {passed ? "Réussi" : "Échoué"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Points obtenus
                  </h3>
                  <p className="text-3xl font-bold mt-2 dark:text-white">
                    {totalPointsEarned}/{totalPointsPossible}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Pourcentage
                  </h3>
                  <p className="text-3xl font-bold mt-2 dark:text-white">
                    {Math.round(result.score)}%
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Statut
                  </h3>
                  <div className="flex items-center justify-center mt-2">
                    {passed ? (
                      <Award className="h-8 w-8 text-green-500" />
                    ) : (
                      <XCircle className="h-8 w-8 text-red-500" />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-xl font-semibold mb-4 dark:text-white">
            Détail des questions
          </h2>
          {result.questions.map((question: any, index: number) => {
              // Adapter les données selon le mode
              const questionData = isLearningMode
                ? {
                    question: question.question,
                    is_correct: question.is_correct,
                    points_possible: question.points,
                    difficulty: question.difficulty,
                    student_answer: question.user_answers
                      .map(
                        (id: number) =>
                          question.answers.find((a: any) => a.id === id)?.text
                      )
                      .join(", "),
                    correct_answer: question.answers
                      .filter((a: any) => a.correct)
                      .map((a: any) => a.text)
                      .join(", "),
                  }
                : question;

              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="mb-4"
                >
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">
                              Question {index + 1}
                            </Badge>
                            <Badge
                              variant={
                                questionData.is_correct
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {questionData.points_possible} points
                            </Badge>
                            <Badge variant="outline">
                              {questionData.difficulty}
                            </Badge>
                            {isLearningMode && (
                              <Badge variant="secondary">
                                {question.chapter_name}
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-800 dark:text-gray-200 mb-4">
                            {questionData.question}
                          </p>

                          <div className="space-y-4">
                            {/* Réponse de l'étudiant */}
                            <div className="flex items-start gap-2">
                              <div
                                className={`p-3 rounded-lg flex-1 ${
                                  questionData.is_correct
                                    ? "bg-green-50 dark:bg-green-950"
                                    : "bg-red-50 dark:bg-red-950"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-medium dark:text-white">
                                    Votre réponse:
                                  </span>
                                  {questionData.is_correct ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                  ) : (
                                    <XCircle className="h-5 w-5 text-red-500" />
                                  )}
                                </div>
                                <p className="mt-1 dark:text-gray-300">
                                  {questionData.student_answer ||
                                    "Aucune réponse"}
                                </p>
                              </div>
                            </div>

                            {/* Bonne réponse (affichée seulement si la réponse est incorrecte) */}
                            {!questionData.is_correct && (
                              <div className="flex items-start gap-2">
                                <div className="p-3 rounded-lg flex-1 bg-green-50 dark:bg-green-950">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium dark:text-white">
                                      Bonne réponse:
                                    </span>
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                  </div>
                                  <p className="mt-1 dark:text-gray-300">
                                    {questionData.correct_answer}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
        </motion.div>
      </div>
    </div>
  );
}
