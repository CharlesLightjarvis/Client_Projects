import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import { api } from "~/api";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Flag,
  Check,
  CheckCircle,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

interface Answer {
  id: number;
  text: string;
  correct?: boolean;
  explanation?: string;
}

interface Question {
  id: string;
  chapter_id: string;
  chapter_name: string;
  question: string;
  answers: Answer[];
  type: string;
  difficulty: string;
  points: number;
}

interface ExamData {
  certification_id: string;
  questions: Question[];
  time_limit: number;
  total_points: number;
  total_questions: number;
}

interface ExamSession {
  session_id: string;
  exam_data: ExamData;
  started_at: string;
  expires_at: string;
  remaining_time: number;
  total_questions: number;
}

interface QuizSubmissionResponse {
  quiz_result: {
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
      explanation: string;
      is_correct: boolean;
      points_earned: number;
      points_possible: number;
      difficulty: string;
    }>;
    total_questions: number;
    correct_answers: number;
  };
}

export default function CertificationExam() {
  const location = useLocation();
  const navigate = useNavigate();

  const examMode = location.state?.mode || "strict";
  const certificationId = location.state?.certificationId;

  // Pour le mode apprentissage (relax), on utilise quizData
  // Pour le mode examen (strict), on utilise examSession
  const quizData = location.state?.quizData;
  const examSession: ExamSession | null = location.state?.examSession;

  const examData: ExamData =
    examMode === "strict" && examSession ? examSession.exam_data : quizData;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<string[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(
    examMode === "strict" && examSession
      ? examSession.remaining_time
      : examData?.time_limit * 60 || 0
  );
  const [examCompleted, setExamCompleted] = useState(false);
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
  const [showConfirmComplete, setShowConfirmComplete] = useState(false);

  const completeExam = async () => {
    try {
      console.log("Réponses brutes:", answers);

      if (examMode === "strict" && examSession) {
        // Mode examen : soumettre via la session d'examen
        const response = await api.post(
          `/api/v1/admin/exam-sessions/${examSession.session_id}/submit`,
          { answers }
        );

        console.log("Réponse du backend (mode examen):", response.data);

        // Redirection vers la page des résultats
        const attemptNumber =
          response.data.data.quiz_result.attempt_number || 1;
        navigate(
          `/student/dashboard/certifications/${certificationId}/results/${attemptNumber}`,
          {
            replace: true,
            state: { examResult: response.data.data.quiz_result },
          }
        );
      } else {
        // Mode apprentissage : pas de soumission formelle, juste afficher les résultats
        const correctAnswers = examData.questions.reduce((count, question) => {
          const userAnswers = answers[question.id] || [];
          const correctAnswerIds = question.answers
            .filter((answer) => answer.correct)
            .map((answer) => answer.id);

          const isCorrect =
            userAnswers.length === correctAnswerIds.length &&
            userAnswers.every((id) => correctAnswerIds.includes(id));

          return count + (isCorrect ? 1 : 0);
        }, 0);

        const score = (correctAnswers / examData.questions.length) * 100;

        // Créer un objet résultat pour le mode apprentissage
        const learningResult = {
          mode: "learning",
          score,
          total_questions: examData.questions.length,
          correct_answers: correctAnswers,
          questions: examData.questions.map((question) => {
            const userAnswers = answers[question.id] || [];
            const correctAnswerIds = question.answers
              .filter((answer) => answer.correct)
              .map((answer) => answer.id);

            const isCorrect =
              userAnswers.length === correctAnswerIds.length &&
              userAnswers.every((id) => correctAnswerIds.includes(id));

            return {
              ...question,
              user_answers: userAnswers,
              is_correct: isCorrect,
            };
          }),
        };

        navigate(
          `/student/dashboard/certifications/${certificationId}/results/learning`,
          {
            replace: true,
            state: { learningResult },
          }
        );
      }
    } catch (error: any) {
      console.error("Erreur lors de la soumission:", error);
      if (error.response) {
        console.error("Détails de l'erreur:", error.response.data);
      }
    }
  };

  const handleCompleteExam = () => {
    setShowConfirmComplete(true);
  };

  const confirmComplete = async () => {
    setShowConfirmComplete(false);
    await completeExam();
  };

  useEffect(() => {
    if (!examData) {
      navigate("/student/dashboard/certifications");
      return;
    }
  }, [examData, navigate]);

  useEffect(() => {
    if (examCompleted || examMode === "relax") return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setExamCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examCompleted, examMode]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours > 0 ? `${hours}h ` : ""}${minutes}m ${secs}s`;
  };

  const handleAnswerSelect = async (questionId: string, answerId: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: [answerId], // Pour l'instant, on supporte une seule réponse
    }));

    // Sauvegarder automatiquement en mode examen
    if (examMode === "strict" && examSession) {
      try {
        await api.post(
          `/api/v1/admin/exam-sessions/${examSession.session_id}/save-answer`,
          {
            question_id: questionId,
            answer_ids: [answerId],
          }
        );
      } catch (error) {
        console.error("Erreur lors de la sauvegarde de la réponse:", error);
      }
    }

    if (examMode === "relax") {
      setShowAnswerFeedback(true);
    }
  };

  const toggleFlaggedQuestion = (questionId: string) => {
    setFlaggedQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < examData.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      if (examMode === "relax") {
        const nextQuestionId = examData.questions[currentQuestionIndex + 1].id;
        // Toujours montrer le feedback si une réponse existe
        setShowAnswerFeedback(answers[nextQuestionId] !== undefined);
      }
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      if (examMode === "relax") {
        const prevQuestionId = examData.questions[currentQuestionIndex - 1].id;
        // Toujours montrer le feedback si une réponse existe
        setShowAnswerFeedback(answers[prevQuestionId] !== undefined);
      }
    }
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    if (examMode === "relax") {
      const questionId = examData.questions[index].id;
      // Toujours montrer le feedback si une réponse existe
      setShowAnswerFeedback(answers[questionId] !== undefined);
    }
  };

  if (!examData) return null;

  const currentQuestion = examData.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === examData.questions.length - 1;
  const answeredCount = Object.keys(answers).length;

  if (examCompleted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50">
        <Card className="mx-4 max-w-md text-center p-8">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-gray-800">
            Examen terminé
          </h2>
          <p className="text-xl text-gray-600">Merci de votre participation.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <div className="flex items-center justify-between border-b border-border px-6 py-2">
        <h1 className="text-xl font-semibold text-foreground">
          Certification Exam
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <span>
              {answeredCount}/{examData.total_questions}
            </span>
          </div>
          {examMode === "strict" && (
            <div className="flex items-center gap-2 text-base font-semibold bg-red-500/10 dark:bg-red-500/20 px-3 py-1 rounded-full text-red-600 dark:text-red-400">
              <Clock className="h-5 w-5" />
              <span className="text-lg">{formatTime(timeRemaining)}</span>
            </div>
          )}
          <span className="text-sm font-medium text-foreground">
            Question {currentQuestionIndex + 1}/{examData.questions.length}
          </span>
        </div>
      </div>

      <div className="h-1 w-full bg-muted">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{
            width: `${(answeredCount / examData.total_questions) * 100}%`,
          }}
        />
      </div>

      <div className="flex flex-1">
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-foreground">
              {currentQuestion.question}
            </h2>
          </div>

          <div className="space-y-3">
            {currentQuestion.answers.map((answer) => {
              const isSelected = answers[currentQuestion.id]?.includes(
                answer.id
              );
              const showFeedback = examMode === "relax" && showAnswerFeedback;
              const isAnswered = answers[currentQuestion.id] !== undefined;
              const isDisabled = examMode === "relax" && isAnswered;

              return (
                <div
                  key={answer.id}
                  className={cn(
                    "flex items-center space-x-2 rounded-lg border border-border p-4",
                    !isDisabled && "hover:bg-accent",
                    isDisabled && "opacity-80 cursor-not-allowed",
                    showFeedback && {
                      "border-green-500 dark:border-green-400 bg-green-500/10 dark:bg-green-500/20":
                        answer.correct,
                      "border-red-500 dark:border-red-400 bg-red-500/10 dark:bg-red-500/20":
                        isSelected && !answer.correct,
                    }
                  )}
                  onClick={() => {
                    if (!isDisabled) {
                      handleAnswerSelect(currentQuestion.id, answer.id);
                    }
                  }}
                >
                  <div className="flex h-5 w-5 items-center justify-center rounded-full border border-primary">
                    {isSelected && (
                      <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                    )}
                  </div>
                  <Label
                    htmlFor={`answer-${answer.id}`}
                    className={cn(
                      "flex-1",
                      isDisabled ? "cursor-not-allowed" : "cursor-pointer"
                    )}
                  >
                    {answer.text}
                  </Label>
                </div>
              );
            })}
          </div>

          {examMode === "relax" && showAnswerFeedback && (
            <div
              className={cn(
                "mt-4 p-4 rounded-lg",
                answers[currentQuestion.id]?.includes(
                  currentQuestion.answers.find((a) => a.correct)?.id || 0
                )
                  ? "bg-green-500/10 dark:bg-green-500/20 text-green-700 dark:text-green-300"
                  : "bg-red-500/10 dark:bg-red-500/20 text-red-700 dark:text-red-300"
              )}
            >
              <p className="font-medium">
                {answers[currentQuestion.id]?.includes(
                  currentQuestion.answers.find((a) => a.correct)?.id || 0
                )
                  ? "Correct!"
                  : "Incorrect"}
              </p>
              <p className="mt-2">
                {currentQuestion.answers.find((a) => a.correct)?.explanation ||
                  "La bonne réponse est : " +
                    currentQuestion.answers.find((a) => a.correct)?.text}
              </p>
            </div>
          )}
        </div>

        <div className="w-64 border-l border-border p-4">
          <div className="grid grid-cols-5 gap-2">
            {examData.questions.map((question, index) => {
              const isAnswered = answers[question.id] !== undefined;
              const isFlagged = flaggedQuestions.includes(question.id);
              const isCorrect =
                examMode === "relax" &&
                answers[question.id]?.includes(
                  question.answers.find((a) => a.correct)?.id || 0
                );
              const isIncorrect =
                examMode === "relax" && isAnswered && !isCorrect;

              return (
                <div key={index} className="relative">
                  <Button
                    variant={
                      currentQuestionIndex === index ? "default" : "outline"
                    }
                    className={cn(
                      "h-10 w-10",
                      examMode === "relax"
                        ? {
                            "border-green-500 dark:border-green-400 border":
                              isCorrect,
                            "border-red-500 dark:border-red-400 border":
                              isIncorrect,
                          }
                        : {
                            "border-green-500 dark:border-green-400 border":
                              isAnswered,
                          },
                      isFlagged && "ring-2 ring-yellow-400 dark:ring-yellow-500"
                    )}
                    onClick={() => goToQuestion(index)}
                  >
                    {index + 1}
                  </Button>
                  {isAnswered && (
                    <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full flex items-center justify-center">
                      {examMode === "relax" ? (
                        isCorrect ? (
                          <div className="bg-green-500 dark:bg-green-400 h-4 w-4 rounded-full flex items-center justify-center">
                            <Check className="h-3 w-3 text-background" />
                          </div>
                        ) : (
                          <div className="bg-red-500 dark:bg-red-400 h-4 w-4 rounded-full flex items-center justify-center">
                            <X className="h-3 w-3 text-background" />
                          </div>
                        )
                      ) : (
                        <div className="bg-green-500 dark:bg-green-400 h-4 w-4 rounded-full flex items-center justify-center">
                          <Check className="h-3 w-3 text-background" />
                        </div>
                      )}
                    </div>
                  )}
                  {isFlagged && (
                    <div className="absolute -bottom-1 -right-1">
                      <Flag className="h-3 w-3 text-yellow-500 dark:text-yellow-400 fill-yellow-500 dark:fill-yellow-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex justify-between">
            <Button
              variant="outline"
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              Précédent
            </Button>

            {isLastQuestion ? (
              <Button onClick={handleCompleteExam}>Terminer</Button>
            ) : (
              <Button onClick={goToNextQuestion}>
                Suivant
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>

          <Button
            variant="outline"
            className="mt-4 w-full"
            onClick={() => toggleFlaggedQuestion(currentQuestion.id)}
          >
            <Flag className="mr-2 h-4 w-4" />
            {flaggedQuestions.includes(currentQuestion.id)
              ? "Retirer le marqueur"
              : "Marquer la question"}
          </Button>

          {/* Dialog de confirmation */}
          <Dialog
            open={showConfirmComplete}
            onOpenChange={setShowConfirmComplete}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Terminer l'examen ?</DialogTitle>
                <DialogDescription>
                  Êtes-vous sûr de vouloir terminer l'examen ? Cette action est
                  irréversible et vous ne pourrez plus revenir en arrière pour
                  modifier vos réponses.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmComplete(false)}
                >
                  Continuer l'examen
                </Button>
                <Button onClick={confirmComplete}>Terminer l'examen</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
