import React from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Slider } from "~/components/ui/slider";
import { Badge } from "~/components/ui/badge";
import {
  SearchIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  Settings,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { api } from "~/api";
import { ConfirmDialog } from "~/components/ui/confirm-dialog";
import type { CertificationSchema } from "~/types/certification";

interface Answer {
  id: number;
  text: string;
  correct: boolean;
}

interface Question {
  id: string;
  question: string;
  answers: Answer[];
  difficulty: string;
  type: string;
  points: number;
}

interface Chapter {
  id: string;
  name: string;
  description?: string;
  order: number;
  questions_count: number;
  questions?: Question[];
  isExpanded?: boolean;
  questionsLoaded?: boolean;
}

interface ExamConfiguration {
  chapter_distribution: Record<string, number>;
  time_limit: number;
  passing_score: number;
  total_questions: number;
}

interface ChaptersCertificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certification: CertificationSchema;
}

export function ChaptersCertificationDialog({
  open,
  onOpenChange,
  certification,
}: ChaptersCertificationDialogProps) {
  const [chapters, setChapters] = React.useState<Chapter[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingQuestions, setLoadingQuestions] = React.useState<string | null>(
    null
  );
  const [examConfig, setExamConfig] = React.useState<ExamConfiguration>({
    chapter_distribution: {},
    time_limit: 90,
    passing_score: 75,
    total_questions: 0,
  });

  // États pour les dialogues chapitres
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [selectedChapter, setSelectedChapter] = React.useState<Chapter | null>(
    null
  );
  const [confirmDelete, setConfirmDelete] = React.useState<{
    id: string;
    name: string;
  } | null>(null);

  // États pour les dialogues questions
  const [questionDialogOpen, setQuestionDialogOpen] = React.useState(false);
  const [selectedQuestion, setSelectedQuestion] =
    React.useState<Question | null>(null);
  const [currentChapterId, setCurrentChapterId] = React.useState<string>("");
  const [confirmDeleteQuestion, setConfirmDeleteQuestion] = React.useState<{
    id: string;
    question: string;
  } | null>(null);

  // État pour le formulaire de question
  const [newQuestion, setNewQuestion] = React.useState<Partial<Question>>({
    question: "",
    answers: [
      { id: 1, text: "", correct: true },
      { id: 2, text: "", correct: false },
      { id: 3, text: "", correct: false },
      { id: 4, text: "", correct: false },
    ],
    difficulty: "easy",
    type: "certification",
    points: 3,
  });

  // Charger la configuration d'examen qui contient aussi les chapitres
  const loadExamConfig = async () => {
    if (!certification.id) return;

    setIsLoading(true);
    try {
      const response = await api.get(
        `/api/v1/admin/certifications/${certification.id}/exam-configuration`
      );
      const data = response.data;

      // Mettre à jour les chapitres avec les données de l'API exam-configuration
      if (data.chapters) {
        setChapters(
          data.chapters.map((chapter: Chapter) => ({
            ...chapter,
            isExpanded: false,
            questionsLoaded: false,
            questions: [],
          }))
        );
      }

      const config = data.configuration || {
        chapter_distribution: {},
        time_limit: 90,
        passing_score: 75,
        total_questions: 0,
      };

      // Initialiser la distribution pour tous les chapitres qui n'en ont pas
      if (data.chapters) {
        data.chapters.forEach((chapter: Chapter) => {
          if (!(chapter.id in config.chapter_distribution)) {
            // Par défaut, utiliser toutes les questions disponibles du chapitre
            config.chapter_distribution[chapter.id] =
              chapter.questions_count || 0;
          }
        });
      }

      setExamConfig(config);
    } catch (error) {
      console.error("Failed to load exam config:", error);
      toast.error("Erreur", {
        description: "Impossible de charger la configuration d'examen",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les questions d'un chapitre
  const loadChapterQuestions = async (chapterId: string) => {
    setLoadingQuestions(chapterId);
    try {
      const response = await api.get(
        `/api/v1/admin/chapters/${chapterId}/questions`
      );
      const questions = response.data.data || [];

      setChapters((prev) =>
        prev.map((chapter) =>
          chapter.id === chapterId
            ? { ...chapter, questions, questionsLoaded: true }
            : chapter
        )
      );
    } catch (error) {
      console.error("Failed to load chapter questions:", error);
      toast.error("Erreur", {
        description: "Impossible de charger les questions du chapitre",
      });
    } finally {
      setLoadingQuestions(null);
    }
  };

  // Toggle expansion d'un chapitre
  const toggleChapterExpansion = async (chapterId: string) => {
    const chapter = chapters.find((c) => c.id === chapterId);
    if (!chapter) return;

    // Si on expand et que les questions ne sont pas encore chargées
    if (!chapter.isExpanded && !chapter.questionsLoaded) {
      await loadChapterQuestions(chapterId);
    }

    setChapters((prev) =>
      prev.map((c) =>
        c.id === chapterId ? { ...c, isExpanded: !c.isExpanded } : c
      )
    );
  };

  React.useEffect(() => {
    if (open) {
      loadExamConfig();
    }
  }, [open, certification]);

  const handleAddChapter = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const chapterData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      order: chapters.length + 1,
    };

    setIsLoading(true);
    try {
      await api.post(
        `/api/v1/admin/certifications/${certification.id}/chapters`,
        chapterData
      );

      await loadExamConfig();
      setAddDialogOpen(false);
      toast.success("Succès", {
        description: "Chapitre ajouté avec succès",
      });
    } catch (error: any) {
      toast.error("Erreur", {
        description:
          error.response?.data?.message || "Erreur lors de l'ajout du chapitre",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditChapter = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedChapter) return;

    const formData = new FormData(e.currentTarget);
    const updatedData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
    };

    setIsLoading(true);
    try {
      await api.put(
        `/api/v1/admin/chapters/${selectedChapter.id}`,
        updatedData
      );

      await loadExamConfig();
      setEditDialogOpen(false);
      setSelectedChapter(null);
      toast.success("Succès", {
        description: "Chapitre modifié avec succès",
      });
    } catch (error: any) {
      toast.error("Erreur", {
        description:
          error.response?.data?.message ||
          "Erreur lors de la modification du chapitre",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteChapter = async (chapterId: string) => {
    setIsLoading(true);
    try {
      await api.delete(`/api/v1/admin/chapters/${chapterId}`);

      await loadExamConfig();
      setConfirmDelete(null);
      toast.success("Succès", {
        description: "Chapitre supprimé avec succès",
      });
    } catch (error: any) {
      toast.error("Erreur", {
        description:
          error.response?.data?.message ||
          "Erreur lors de la suppression du chapitre",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChapterDistributionChange = (
    chapterId: string,
    value: number
  ) => {
    setExamConfig((prev) => ({
      ...prev,
      chapter_distribution: {
        ...prev.chapter_distribution,
        [chapterId]: value,
      },
    }));
  };

  const saveExamConfiguration = async () => {
    setIsLoading(true);
    try {
      await api.put(
        `/api/v1/admin/certifications/${certification.id}/exam-configuration`,
        examConfig
      );

      toast.success("Succès", {
        description: "Configuration d'examen sauvegardée",
      });
    } catch (error: any) {
      toast.error("Erreur", {
        description:
          error.response?.data?.message || "Erreur lors de la sauvegarde",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fonctions pour les questions
  const handleQuestionChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setNewQuestion((prev) => ({ ...prev, [name]: value }));
  };

  const handleAnswerChange = (
    index: number,
    field: string,
    value: string | boolean
  ) => {
    setNewQuestion((prev) => {
      const answers = [...(prev.answers || [])];
      answers[index] = { ...answers[index], [field]: value };
      return { ...prev, answers };
    });
  };

  const handleCorrectAnswerChange = (index: number) => {
    setNewQuestion((prev) => {
      const answers = (prev.answers || []).map((answer, i) => ({
        ...answer,
        correct: i === index,
      }));
      return { ...prev, answers };
    });
  };

  const validateQuestionForm = () => {
    if (!newQuestion.question?.trim()) {
      toast.error("La question est requise");
      return false;
    }

    if (
      !newQuestion.answers ||
      newQuestion.answers.some((answer) => !answer.text.trim())
    ) {
      toast.error("Toutes les réponses doivent avoir un texte");
      return false;
    }

    return true;
  };

  const submitQuestion = async () => {
    if (!validateQuestionForm()) return;

    setIsLoading(true);
    try {
      const questionData = {
        question: newQuestion.question,
        answers: newQuestion.answers,
        difficulty: newQuestion.difficulty,
        type: newQuestion.type,
        points: newQuestion.points,
      };

      if (selectedQuestion) {
        // Utiliser l'endpoint spécifique au chapitre pour modifier
        await api.put(
          `/api/v1/admin/chapters/${currentChapterId}/questions/${selectedQuestion.id}`,
          questionData
        );
        toast.success("Question mise à jour avec succès");
      } else {
        // Utiliser l'endpoint spécifique au chapitre pour créer
        await api.post(
          `/api/v1/admin/chapters/${currentChapterId}/questions`,
          questionData
        );
        toast.success("Question créée avec succès");
      }

      // Recharger les questions du chapitre
      await loadChapterQuestions(currentChapterId);
      await loadExamConfig(); // Pour mettre à jour le count

      resetQuestionForm();
      setQuestionDialogOpen(false);
    } catch (error: any) {
      console.error("Erreur lors de la soumission de la question:", error);
      toast.error(
        error.response?.data?.message ||
          "Erreur lors de l'enregistrement de la question"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const deleteQuestion = async (questionId: string) => {
    setIsLoading(true);
    try {
      // Utiliser l'endpoint spécifique au chapitre pour supprimer
      await api.delete(
        `/api/v1/admin/chapters/${currentChapterId}/questions/${questionId}`
      );
      toast.success("Question supprimée avec succès");

      // Recharger les questions du chapitre
      await loadChapterQuestions(currentChapterId);
      await loadExamConfig(); // Pour mettre à jour le count

      setConfirmDeleteQuestion(null);
    } catch (error: any) {
      console.error("Erreur lors de la suppression de la question:", error);
      toast.error("Erreur lors de la suppression de la question");
    } finally {
      setIsLoading(false);
    }
  };

  const editQuestion = (question: Question, chapterId: string) => {
    setSelectedQuestion(question);
    setCurrentChapterId(chapterId);
    setNewQuestion({
      ...question,
    });
    setQuestionDialogOpen(true);
  };

  const addQuestion = (chapterId: string) => {
    setSelectedQuestion(null);
    setCurrentChapterId(chapterId);
    resetQuestionForm();
    setQuestionDialogOpen(true);
  };

  const resetQuestionForm = () => {
    setNewQuestion({
      question: "",
      answers: [
        { id: 1, text: "", correct: true },
        { id: 2, text: "", correct: false },
        { id: 3, text: "", correct: false },
        { id: 4, text: "", correct: false },
      ],
      difficulty: "easy",
      type: "certification",
      points: 3,
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredChapters = chapters.filter((chapter) =>
    chapter.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalDistribution = Object.values(
    examConfig.chapter_distribution
  ).reduce((sum, val) => sum + val, 0);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="min-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              Gestion des chapitres - {certification.name}
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="chapters" className="flex-1 overflow-hidden">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chapters">Chapitres</TabsTrigger>
              <TabsTrigger value="exam-config">
                Configuration d'examen
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="chapters"
              className="overflow-auto max-h-[70vh]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 flex-1">
                  <SearchIcon className="w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un chapitre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>

                <Button
                  onClick={() => setAddDialogOpen(true)}
                  disabled={isLoading}
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Ajouter un chapitre
                </Button>
              </div>

              <div className="space-y-4">
                {filteredChapters.map((chapter) => (
                  <Card key={chapter.id}>
                    <Collapsible
                      open={chapter.isExpanded}
                      onOpenChange={() => toggleChapterExpansion(chapter.id)}
                    >
                      <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                {chapter.isExpanded ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                                <Badge variant="outline">
                                  #{chapter.order}
                                </Badge>
                              </div>
                              <div>
                                <CardTitle className="text-lg">
                                  {chapter.name}
                                </CardTitle>
                                {chapter.description && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {chapter.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">
                                {chapter.questions_count} questions
                              </Badge>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedChapter(chapter);
                                    setEditDialogOpen(true);
                                  }}
                                  disabled={isLoading}
                                >
                                  <EditIcon className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setConfirmDelete({
                                      id: chapter.id,
                                      name: chapter.name,
                                    });
                                  }}
                                  disabled={isLoading}
                                >
                                  <TrashIcon className="w-4 h-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="pt-0">
                          {loadingQuestions === chapter.id ? (
                            <div className="flex items-center justify-center py-8">
                              <div className="text-sm text-muted-foreground">
                                Chargement des questions...
                              </div>
                            </div>
                          ) : chapter.questions &&
                            chapter.questions.length > 0 ? (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm text-muted-foreground">
                                  Questions du chapitre (
                                  {chapter.questions.length})
                                </h4>
                                <Button
                                  size="sm"
                                  onClick={() => addQuestion(chapter.id)}
                                  disabled={isLoading}
                                >
                                  <PlusIcon className="w-3 h-3 mr-1" />
                                  Ajouter une question
                                </Button>
                              </div>
                              <div className="grid gap-3">
                                {chapter.questions.map((question, index) => (
                                  <Card key={question.id} className="p-4">
                                    <div className="space-y-3">
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-2">
                                            <Badge variant="outline">
                                              Q{index + 1}
                                            </Badge>
                                            <Badge
                                              className={getDifficultyColor(
                                                question.difficulty
                                              )}
                                            >
                                              {question.difficulty}
                                            </Badge>
                                            <Badge variant="secondary">
                                              {question.points} pts
                                            </Badge>
                                          </div>
                                          <p className="text-sm font-medium mb-3">
                                            {question.question}
                                          </p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                              editQuestion(question, chapter.id)
                                            }
                                            disabled={isLoading}
                                          >
                                            <EditIcon className="w-3 h-3" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                              setCurrentChapterId(chapter.id);
                                              setConfirmDeleteQuestion({
                                                id: question.id,
                                                question: question.question,
                                              });
                                            }}
                                            disabled={isLoading}
                                          >
                                            <TrashIcon className="w-3 h-3 text-destructive" />
                                          </Button>
                                        </div>
                                      </div>
                                      <div className="grid gap-2">
                                        {question.answers.map(
                                          (answer, answerIndex) => (
                                            <div
                                              key={answer.id}
                                              className={`p-2 rounded-md text-xs border ${
                                                answer.correct
                                                  ? "bg-green-50 border-green-200 text-green-800"
                                                  : "bg-gray-50 border-gray-200"
                                              }`}
                                            >
                                              <span className="font-medium">
                                                {String.fromCharCode(
                                                  65 + answerIndex
                                                )}
                                                .
                                              </span>{" "}
                                              {answer.text}
                                              {answer.correct && (
                                                <Badge
                                                  className="ml-2"
                                                  variant="default"
                                                >
                                                  Correcte
                                                </Badge>
                                              )}
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-8 text-muted-foreground">
                              <p className="text-sm mb-2">
                                Aucune question dans ce chapitre
                              </p>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => addQuestion(chapter.id)}
                                disabled={isLoading}
                              >
                                <PlusIcon className="w-3 h-3 mr-1" />
                                Ajouter la première question
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent
              value="exam-config"
              className="overflow-auto max-h-[70vh]"
            >
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Paramètres généraux
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="time-limit">Durée limite (minutes)</Label>
                      <Input
                        id="time-limit"
                        type="number"
                        value={examConfig.time_limit}
                        onChange={(e) =>
                          setExamConfig((prev) => ({
                            ...prev,
                            time_limit: parseInt(e.target.value) || 0,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="passing-score">
                        Score de passage (%)
                      </Label>
                      <Input
                        id="passing-score"
                        type="number"
                        value={examConfig.passing_score}
                        onChange={(e) =>
                          setExamConfig((prev) => ({
                            ...prev,
                            passing_score: parseInt(e.target.value) || 0,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="total-questions">Total questions</Label>
                      <Input
                        id="total-questions"
                        type="number"
                        value={examConfig.total_questions}
                        onChange={(e) =>
                          setExamConfig((prev) => ({
                            ...prev,
                            total_questions: parseInt(e.target.value) || 0,
                          }))
                        }
                      />
                      <div className="text-sm text-muted-foreground mt-1">
                        Distribution actuelle: {totalDistribution}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>
                      Distribution des questions par chapitre
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {chapters.map((chapter) => (
                      <div key={chapter.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">{chapter.name}</span>
                            <span className="text-sm text-muted-foreground ml-2">
                              ({chapter.questions_count} questions disponibles)
                            </span>
                          </div>
                          <span className="font-medium">
                            {examConfig.chapter_distribution[chapter.id] || 0}{" "}
                            questions
                          </span>
                        </div>
                        <Slider
                          value={[
                            examConfig.chapter_distribution[chapter.id] || 0,
                          ]}
                          onValueChange={(value) =>
                            handleChapterDistributionChange(
                              chapter.id,
                              value[0]
                            )
                          }
                          max={chapter.questions_count}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button onClick={saveExamConfiguration} disabled={isLoading}>
                    Sauvegarder la configuration
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Dialogue d'ajout de chapitre */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ajouter un chapitre</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddChapter} className="space-y-4">
            <div>
              <Label htmlFor="name">Nom du chapitre</Label>
              <Input
                id="name"
                name="name"
                placeholder="Nom du chapitre"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Description du chapitre"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                Ajouter
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialogue d'édition de chapitre */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifier le chapitre</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditChapter} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nom du chapitre</Label>
              <Input
                id="edit-name"
                name="name"
                defaultValue={selectedChapter?.name}
                placeholder="Nom du chapitre"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                defaultValue={selectedChapter?.description}
                placeholder="Description du chapitre"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                Modifier
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialogue d'ajout/édition de question */}
      <Dialog open={questionDialogOpen} onOpenChange={setQuestionDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedQuestion
                ? "Modifier la question"
                : "Ajouter une question"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="question">Question</Label>
              <Textarea
                id="question"
                name="question"
                value={newQuestion.question || ""}
                onChange={handleQuestionChange}
                placeholder="Saisissez votre question..."
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="difficulty">Difficulté</Label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={newQuestion.difficulty}
                  onChange={handleQuestionChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="easy">Facile</option>
                  <option value="medium">Moyen</option>
                  <option value="hard">Difficile</option>
                </select>
              </div>
              <div>
                <Label htmlFor="points">Points</Label>
                <Input
                  id="points"
                  name="points"
                  type="number"
                  value={newQuestion.points || 3}
                  onChange={handleQuestionChange}
                  min="1"
                  max="10"
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  name="type"
                  value={newQuestion.type}
                  onChange={handleQuestionChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="certification">Certification</option>
                  <option value="normal">Normal</option>
                </select>
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Réponses</Label>
              {newQuestion.answers?.map((answer, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <Input
                    value={answer.text}
                    onChange={(e) =>
                      handleAnswerChange(index, "text", e.target.value)
                    }
                    placeholder={`Réponse ${index + 1}`}
                    required
                  />
                  <Button
                    type="button"
                    variant={answer.correct ? "default" : "outline"}
                    onClick={() => handleCorrectAnswerChange(index)}
                  >
                    {answer.correct ? "Correcte" : "Incorrecte"}
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setQuestionDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button onClick={submitQuestion} disabled={isLoading}>
                {selectedQuestion ? "Mettre à jour" : "Créer"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialogue de confirmation de suppression de chapitre */}
      <ConfirmDialog
        open={!!confirmDelete}
        onOpenChange={(open) => !open && setConfirmDelete(null)}
        onConfirm={() => confirmDelete && handleDeleteChapter(confirmDelete.id)}
        title="Confirmer la suppression"
        description={`Êtes-vous sûr de vouloir supprimer le chapitre "${confirmDelete?.name}" ?`}
      />

      {/* Dialogue de confirmation de suppression de question */}
      <ConfirmDialog
        open={!!confirmDeleteQuestion}
        onOpenChange={(open) => !open && setConfirmDeleteQuestion(null)}
        onConfirm={() =>
          confirmDeleteQuestion && deleteQuestion(confirmDeleteQuestion.id)
        }
        title="Confirmer la suppression"
        description={`Êtes-vous sûr de vouloir supprimer la question "${confirmDeleteQuestion?.question}" ?`}
      />
    </>
  );
}
