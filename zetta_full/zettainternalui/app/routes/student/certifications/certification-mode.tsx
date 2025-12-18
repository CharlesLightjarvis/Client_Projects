import { motion } from "framer-motion";
import { ArrowLeft, Clock, BookOpen } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useNavigate, useParams } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { useEffect, useState } from "react";
import { useCertificationsStore } from "~/hooks/use-certifications-store";
import { api } from "~/api";
import { LoadingScreen } from "~/components/loading-screen";

interface QuizDetails {
  certification_name: string;
  passing_score: number;
  time_limit: number;
  total_questions: number;
}

export default function ExamMode() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { selectedCertification, setSelectedCertification } =
    useCertificationsStore();
  const [isRelaxModalOpen, setIsRelaxModalOpen] = useState(false);
  const [isStrictModalOpen, setIsStrictModalOpen] = useState(false);
  const [relaxQuizDetails, setRelaxQuizDetails] = useState<QuizDetails | null>(
    null
  );
  const [strictQuizDetails, setStrictQuizDetails] =
    useState<QuizDetails | null>(null);

  const ExamDetailsModal = ({
    mode,
    quizDetails,
    open,
    onOpenChange,
    onStartExam,
  }: {
    mode: "relax" | "strict";
    quizDetails: QuizDetails | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onStartExam: () => void;
  }) => {
    if (!quizDetails || !selectedCertification) return null;

    const modeDetails = {
      relax: {
        title: "Mode Apprentissage",
        description: "Préparation et pratique sans pression",
        instructions: [
          "Pas de limite de temps",
          "Feedback immédiat après chaque réponse",
          "Possibilité de revenir en arrière",
          "Explications détaillées disponibles",
        ],
      },
      strict: {
        title: "Mode Examen",
        description: "Conditions réelles d'examen",
        instructions: [
          "Temps limité strictement appliqué",
          "Pas de retour en arrière possible",
          "Score minimum requis pour réussir",
          "Résultats uniquement à la fin",
        ],
      },
    };

    const currentMode = modeDetails[mode];

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {currentMode.title}: {selectedCertification.name}
            </DialogTitle>
            <DialogDescription>{currentMode.description}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <h3 className="font-medium">Score de passage</h3>
                <p className="text-sm text-muted-foreground">
                  {quizDetails.passing_score}%
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium">
                  Durée {mode === "relax" ? "recommandée" : "limite"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {quizDetails.time_limit} minutes
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="font-medium">Nombre de questions</h3>
              <p className="text-sm text-muted-foreground">
                {quizDetails.total_questions} questions
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="font-medium">Instructions spécifiques</h3>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                {currentMode.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> {instruction}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button onClick={onStartExam}>Commencer l'examen</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  useEffect(() => {
    const fetchCertificationDetails = async () => {
      if (!id) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await api.get(`/api/v1/student/certifications/${id}`);
        setSelectedCertification(response.data.certification);
      } catch (err: any) {
        console.error("Error fetching certification details:", err);
        setError(
          err.response?.data?.message || "Failed to load certification details"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertificationDetails();
  }, [id, setSelectedCertification]);
  // Fonction pour récupérer les détails du quiz (génération d'aperçu)
  const fetchQuizDetails = async () => {
    if (!selectedCertification) return;

    setIsLoading(true);
    try {
      const response = await api.get(
        `/api/v1/admin/certifications/${selectedCertification.id}/exam/generate`
      );
      console.log("Quiz preview:", response.data);

      return response.data.data;
    } catch (err) {
      console.error("Error fetching quiz details:", err);
      setError("Failed to load quiz details");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartRelaxQuiz = async () => {
    const quizDetails = await fetchQuizDetails();
    if (quizDetails) {
      setRelaxQuizDetails(quizDetails);
      setIsRelaxModalOpen(true);
    }
  };

  const handleStartStrictQuiz = async () => {
    const quizDetails = await fetchQuizDetails();
    if (quizDetails) {
      setStrictQuizDetails(quizDetails);
      setIsStrictModalOpen(true);
    }
  };

  const handleConfirmStartRelaxQuiz = async () => {
    if (!selectedCertification) return;

    setIsLoading(true);
    try {
      // Fermer le modal immédiatement
      setIsRelaxModalOpen(false);

      // Pour le mode apprentissage, on génère directement l'examen
      const response = await api.get(
        `/api/v1/admin/certifications/${selectedCertification.id}/exam/generate`
      );

      console.log("Quiz data:", response.data);

      navigate(
        `/student/dashboard/certifications/${selectedCertification.id}/exam/relax`,
        {
          state: {
            quizData: response.data.data,
            certificationId: selectedCertification.id,
            mode: "relax",
          },
        }
      );
    } catch (err) {
      console.error("Error starting relax quiz:", err);
      setError("Failed to start the quiz");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmStartStrictQuiz = async () => {
    if (!selectedCertification) return;

    setIsLoading(true);
    try {
      // Fermer le modal immédiatement
      setIsStrictModalOpen(false);

      // Pour le mode examen, on démarre une session d'examen
      const response = await api.post(
        `/api/v1/admin/certifications/${selectedCertification.id}/exam/start`
      );

      console.log("Exam session data:", response.data);

      navigate(
        `/student/dashboard/certifications/${selectedCertification.id}/exam/strict`,
        {
          state: {
            examSession: response.data.data,
            certificationId: selectedCertification.id,
            mode: "strict",
          },
        }
      );
    } catch (err) {
      console.error("Error starting strict quiz:", err);
      setError("Failed to start the quiz");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour aux détails de la Certification
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-3xl font-bold">Choisissez votre mode d'examen</h1>
          <p className="text-muted-foreground text-lg">
            {selectedCertification?.name}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Mode Relax */}
          <Card
            className="cursor-pointer hover:shadow-lg transition-all"
            onClick={handleStartRelaxQuiz}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-100">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Mode Apprentissage</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Idéal pour la préparation et la pratique. Prenez votre temps et
                apprenez de vos erreurs.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Sans limite de temps
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Feedback immédiat
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Explications
                  détaillées
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Possibilité de
                  revenir en arrière
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Mode Strict */}
          <Card
            className="cursor-pointer hover:shadow-lg transition-all"
            onClick={handleStartStrictQuiz}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-red-100">
                  <Clock className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Mode Examen</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Simulez les conditions réelles de l'examen. Testez vos
                connaissances sous pression.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Durée limitée
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Score minimum requis
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Questions marquables
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Résultats à la fin
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Modals */}
      <ExamDetailsModal
        mode="relax"
        quizDetails={relaxQuizDetails}
        open={isRelaxModalOpen}
        onOpenChange={setIsRelaxModalOpen}
        onStartExam={handleConfirmStartRelaxQuiz}
      />

      <ExamDetailsModal
        mode="strict"
        quizDetails={strictQuizDetails}
        open={isStrictModalOpen}
        onOpenChange={setIsStrictModalOpen}
        onStartExam={handleConfirmStartStrictQuiz}
      />
    </div>
  );
}
