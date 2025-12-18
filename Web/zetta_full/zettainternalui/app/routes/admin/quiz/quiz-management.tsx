import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Slider } from "~/components/ui/slider";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Alert, AlertDescription } from "~/components/ui/alert";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { api } from "~/api";
import { toast } from "sonner";

interface Module {
  id: string;
  name: string;
  description?: string;
}

interface Lesson {
  id: string;
  name: string;
  module_id: string;
}

interface Certification {
  id: string;
  name: string;
  formation_id: string;
  formation: {
    id: string;
    name: string;
  };
}

interface Formation {
  id: string;
  name: string;
  modules: Module[];
}

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
  questionable_type: string;
  questionable_id: string;
}

interface QuizConfiguration {
  id: string;
  configurable_type: string;
  configurable_id: string;
  total_questions: number;
  difficulty_distribution: {
    easy: number;
    medium: number;
    hard: number;
  };
  module_distribution: Record<string, number>;
  question_type: string;
  passing_score: number;
  time_limit?: number;
}

const QuizManager: React.FC = () => {
  // États pour les entités
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizConfigurations, setQuizConfigurations] = useState<
    QuizConfiguration[]
  >([]);

  // États pour les formulaires
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    question: "",
    answers: [
      { id: 1, text: "", correct: true },
      { id: 2, text: "", correct: false },
      { id: 3, text: "", correct: false },
      { id: 4, text: "", correct: false },
    ],
    difficulty: "easy",
    type: "normal",
    points: 10,
    questionable_type: "",
    questionable_id: "",
  });

  const [newQuizConfig, setNewQuizConfig] = useState<
    Partial<QuizConfiguration>
  >({
    configurable_type: "",
    configurable_id: "",
    total_questions: 20,
    difficulty_distribution: {
      easy: 40,
      medium: 40,
      hard: 20,
    },
    module_distribution: {},
    passing_score: 70,
    time_limit: 60,
    question_type: "normal",
  });

  // États pour les formulaires de modification
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [selectedQuizConfig, setSelectedQuizConfig] =
    useState<QuizConfiguration | null>(null);

  // États pour les modales
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [moduleDistributionDialogOpen, setModuleDistributionDialogOpen] =
    useState(false);

  // État pour les modules de formation sélectionnée
  const [selectedFormationModules, setSelectedFormationModules] = useState<
    Module[]
  >([]);

  // État pour les erreurs
  const [error, setError] = useState<string | null>(null);

  // États pour la pagination et le tri
  const [currentQuestionsPage, setCurrentQuestionsPage] = useState(1);
  const [currentConfigsPage, setCurrentConfigsPage] = useState(1);
  const [questionsPerPage] = useState(10);
  const [configsPerPage] = useState(10);
  const [questionSearchTerm, setQuestionSearchTerm] = useState("");
  const [configSearchTerm, setConfigSearchTerm] = useState("");
  const [questionSortField, setQuestionSortField] =
    useState<string>("question");
  const [questionSortDirection, setQuestionSortDirection] = useState<
    "asc" | "desc"
  >("asc");
  const [configSortField, setConfigSortField] =
    useState<string>("configurable_type");
  const [configSortDirection, setConfigSortDirection] = useState<
    "asc" | "desc"
  >("asc");

  // Chargement initial des données
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Définir des données par défaut vides pour éviter les erreurs undefined
      let modulesData: Module[] = [];
      let lessonsData: Lesson[] = [];
      let certificationsData: Certification[] = [];
      let formationsData: Formation[] = [];
      let questionsData: Question[] = [];
      let configurationsData: QuizConfiguration[] = [];

      try {
        const modulesRes = await api.get("/api/v1/admin/modules");
        modulesData = modulesRes.data.modules || [];
      } catch (error) {
        console.error("Erreur lors du chargement des modules:", error);
        toast.error("Impossible de charger les modules");
      }

      try {
        const lessonsRes = await api.get("/api/v1/admin/lessons");
        lessonsData = lessonsRes.data.lessons || [];
      } catch (error) {
        console.error("Erreur lors du chargement des leçons:", error);
        toast.error("Impossible de charger les leçons");
      }

      try {
        const certificationsRes = await api.get("/api/v1/admin/certifications");
        certificationsData = certificationsRes.data.certifications || [];
      } catch (error) {
        console.error("Erreur lors du chargement des certifications:", error);
        toast.error("Impossible de charger les certifications");
      }

      try {
        const formationsRes = await api.get("/api/v1/admin/formations");
        formationsData = formationsRes.data.formations || [];
      } catch (error) {
        console.error("Erreur lors du chargement des formations:", error);
        toast.error("Impossible de charger les formations");
      }

      try {
        const questionsRes = await api.get("/api/v1/admin/quiz/questions");
        questionsData = questionsRes.data.data || [];
      } catch (error) {
        console.error("Erreur lors du chargement des questions:", error);
        toast.error("Impossible de charger les questions");
      }

      try {
        const configsRes = await api.get("/api/v1/admin/quiz/configurations");
        configurationsData = configsRes.data.data || [];
        console.log(configurationsData);
      } catch (error) {
        console.error("Erreur lors du chargement des configurations:", error);
        toast.error("Impossible de charger les configurations");
      }

      setModules(modulesData);
      setLessons(lessonsData);
      setCertifications(certificationsData);
      setFormations(formationsData);
      setQuestions(questionsData);
      setQuizConfigurations(configurationsData);
    } catch (error) {
      console.error("Erreur globale lors du chargement des données:", error);
      toast.error("Une erreur est survenue lors du chargement des données");
    }
  };

  // Gestion des formulaires
  const handleQuestionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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

  const handleQuizConfigChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewQuizConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleDifficultyDistributionChange = (
    difficulty: string,
    value: number
  ) => {
    setNewQuizConfig((prev) => ({
      ...prev,
      difficulty_distribution: {
        // Ensure we have default values for all properties
        easy: prev.difficulty_distribution?.easy || 0,
        medium: prev.difficulty_distribution?.medium || 0,
        hard: prev.difficulty_distribution?.hard || 0,
        // Then override the specific one being changed
        [difficulty]: value,
      },
    }));
  };

  const handleModuleDistributionChange = (moduleId: string, value: number) => {
    setNewQuizConfig((prev) => ({
      ...prev,
      module_distribution: {
        ...(prev.module_distribution || {}),
        [moduleId]: value,
      },
    }));
  };

  const validateDifficultyDistribution = () => {
    const { difficulty_distribution } = newQuizConfig;
    if (!difficulty_distribution) return false;

    const total =
      difficulty_distribution.easy +
      difficulty_distribution.medium +
      difficulty_distribution.hard;
    return total === 100;
  };

  const validateModuleDistribution = () => {
    const { module_distribution } = newQuizConfig;
    if (!module_distribution) return false;

    const total = Object.values(module_distribution).reduce(
      (sum, value) => sum + value,
      0
    );
    return total === 100;
  };

  // Vérifier si l'ID existe dans la collection
  const verifyIdExists = (collection: any[], id: string): boolean => {
    return collection.some((item) => item.id === id);
  };

  // Validation du formulaire de question
  const validateQuestionForm = () => {
    setError(null);

    // Vérifier si toutes les réponses ont un texte
    if (
      !newQuestion.answers ||
      newQuestion.answers.some((answer) => !answer.text.trim())
    ) {
      setError("Toutes les réponses doivent avoir un texte");
      toast.error("Toutes les réponses doivent avoir un texte");
      return false;
    }

    // Vérifier si le questionable_type et questionable_id sont définis
    if (!newQuestion.questionable_type || !newQuestion.questionable_id) {
      setError("Veuillez sélectionner un type et un élément associé");
      toast.error("Veuillez sélectionner un type et un élément associé");
      return false;
    }

    // Vérifier si l'ID existe dans la collection correspondante
    if (newQuestion.questionable_type === "module") {
      if (!verifyIdExists(modules, newQuestion.questionable_id)) {
        setError("Le module sélectionné n'existe pas dans la base de données");
        toast.error(
          "Le module sélectionné n'existe pas dans la base de données"
        );
        return false;
      }
    } else if (newQuestion.questionable_type === "lesson") {
      if (!verifyIdExists(lessons, newQuestion.questionable_id)) {
        setError("La leçon sélectionnée n'existe pas dans la base de données");
        toast.error(
          "La leçon sélectionnée n'existe pas dans la base de données"
        );
        return false;
      }
    }

    return true;
  };

  // Soumission des formulaires
  const submitQuestion = async () => {
    try {
      if (!validateQuestionForm()) {
        return;
      }

      // Préparer les données de la question - Ne pas transformer questionable_type
      const questionData = { ...newQuestion };

      if (selectedQuestion) {
        // Mise à jour d'une question existante
        await api.put(
          `/api/v1/admin/quiz/questions/${selectedQuestion.id}`,
          questionData
        );
        toast.success("Question mise à jour avec succès");
      } else {
        // Création d'une nouvelle question
        await api.post("/api/v1/admin/quiz/questions", questionData);
        toast.success("Question créée avec succès");
      }

      // Réinitialiser le formulaire et rafraîchir les données
      setNewQuestion({
        question: "",
        answers: [
          { id: 1, text: "", correct: true },
          { id: 2, text: "", correct: false },
          { id: 3, text: "", correct: false },
          { id: 4, text: "", correct: false },
        ],
        difficulty: "easy",
        type: "normal",
        points: 10,
        questionable_type: "",
        questionable_id: "",
      });
      setSelectedQuestion(null);
      setQuestionDialogOpen(false);
      fetchData();
    } catch (error: any) {
      console.error("Erreur lors de la soumission de la question:", error);
      setError(
        error.response?.data?.message ||
          "Erreur lors de l'enregistrement de la question"
      );
      toast.error(
        error.response?.data?.message ||
          "Erreur lors de l'enregistrement de la question"
      );
    }
  };

  const submitQuizConfig = async () => {
    try {
      setError(null);

      if (!validateDifficultyDistribution()) {
        setError(
          "La somme des pourcentages de difficulté doit être égale à 100%"
        );
        toast.error(
          "La somme des pourcentages de difficulté doit être égale à 100%"
        );
        return;
      }

      if (
        newQuizConfig.configurable_type === "certification" &&
        !validateModuleDistribution()
      ) {
        setError("La somme des pourcentages par module doit être égale à 100%");
        toast.error(
          "La somme des pourcentages par module doit être égale à 100%"
        );
        return;
      }

      // Définir le type en fonction du configurable_type
      const type =
        newQuizConfig.configurable_type === "certification"
          ? "certification"
          : "normal";

      // Préparer les données avec les types corrects attendus par le backend
      const configData = {
        ...newQuizConfig,
        question_type:
          newQuizConfig.configurable_type === "certification"
            ? "certification"
            : "normal",
      };

      // S'assurer qu'on a une distribution par module pour les certifications
      if (
        newQuizConfig.configurable_type === "certification" &&
        (!newQuizConfig.module_distribution ||
          Object.keys(newQuizConfig.module_distribution).length === 0)
      ) {
        setError(
          "La distribution par module est requise pour les certifications"
        );
        toast.error(
          "La distribution par module est requise pour les certifications"
        );
        return;
      }

      let response;
      if (selectedQuizConfig) {
        // Mise à jour d'une configuration existante
        response = await api.put(
          `/api/v1/admin/quiz/configurations/${selectedQuizConfig.id}`,
          configData
        );
        toast.success("Configuration mise à jour avec succès");
      } else {
        // Création d'une nouvelle configuration
        response = await api.post(
          "/api/v1/admin/quiz/configurations",
          configData
        );
        toast.success("Configuration créée avec succès");
      }

      // Réinitialiser le formulaire et rafraîchir les données
      setNewQuizConfig({
        configurable_type: "",
        configurable_id: "",
        total_questions: 20,
        difficulty_distribution: {
          easy: 40,
          medium: 40,
          hard: 20,
        },
        module_distribution: {},
        passing_score: 70,
        time_limit: 60,
      });
      setSelectedQuizConfig(null);
      setConfigDialogOpen(false);
      fetchData();
    } catch (error: any) {
      console.error("Erreur lors de la soumission de la configuration:", error);
      setError(
        error.response?.data?.message ||
          "Erreur lors de l'enregistrement de la configuration"
      );
      toast.error(
        error.response?.data?.message ||
          "Erreur lors de l'enregistrement de la configuration"
      );
    }
  };

  const deleteQuestion = async (id: string) => {
    try {
      await api.delete(`/api/v1/admin/quiz/questions/${id}`);
      toast.success("Question supprimée avec succès");
      fetchData();
    } catch (error) {
      console.error("Erreur lors de la suppression de la question:", error);
      toast.error("Erreur lors de la suppression de la question");
    }
  };

  const deleteQuizConfig = async (id: string) => {
    try {
      await api.delete(`/api/v1/admin/quiz/configurations/${id}`);
      toast.success("Configuration supprimée avec succès");
      fetchData();
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de la configuration:",
        error
      );
      toast.error("Erreur lors de la suppression de la configuration");
    }
  };

  const editQuestion = (question: Question) => {
    // Transformer questionable_type du format complet au format simplifié pour l'interface
    const simplifiedType = question.questionable_type.includes("Module")
      ? "module"
      : "lesson";

    setSelectedQuestion(question);
    setNewQuestion({
      ...question,
      questionable_type: simplifiedType,
    });
    setQuestionDialogOpen(true);
  };

  // Modify the editQuizConfig function to properly handle the module distribution
  const editQuizConfig = (config: QuizConfiguration) => {
    // Transformer configurable_type du format complet au format simplifié pour l'interface
    const simplifiedType = config.configurable_type.includes("Certification")
      ? "certification"
      : "lesson";

    setSelectedQuizConfig(config);
    setNewQuizConfig({
      ...config,
      configurable_type: simplifiedType,
    });

    if (simplifiedType === "certification") {
      const certificationId = config.configurable_id;
      // First set the modules, then handle certification selection
      handleCertificationSelect(certificationId);
    }

    setConfigDialogOpen(true);
  };

  // Modify the handleCertificationSelect function to preserve existing module distribution
  const handleCertificationSelect = async (certificationId: string) => {
    try {
      const response = await api.get(
        `/api/v1/admin/certifications/${certificationId}/modules`
      );
      const modulesData = response.data || [];
      console.log("Modules data:", modulesData);

      setSelectedFormationModules(modulesData);

      // Only initialize module distribution if it doesn't exist or is empty
      setNewQuizConfig((prev) => {
        // If we have existing module distribution with values, keep it
        if (
          prev.module_distribution &&
          Object.keys(prev.module_distribution).length > 0
        ) {
          return prev;
        }

        // Otherwise, initialize with equal values
        const moduleCount = modulesData.length;
        if (moduleCount > 0) {
          const equalPercentage = Math.floor(100 / moduleCount);
          const remainder = 100 - equalPercentage * moduleCount;

          const distribution: Record<string, number> = {};
          modulesData.forEach((module: Module, index: number) => {
            distribution[module.id] =
              equalPercentage + (index === 0 ? remainder : 0);
          });

          return {
            ...prev,
            module_distribution: distribution,
          };
        }
        return prev;
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des modules:", error);
      setSelectedFormationModules([]);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getQuestionableTypeName = (type: string) => {
    if (type.includes("Module")) return "Module";
    if (type.includes("Lesson")) return "Leçon";
    return type;
  };

  const getQuestionableNameById = (type: string, id: string) => {
    if (type.includes("Module")) {
      const module = modules.find((m) => m.id === id);
      return module ? module.name : id;
    } else if (type.includes("Lesson")) {
      const lesson = lessons.find((l) => l.id === id);
      return lesson ? lesson.name : id;
    }
    return id;
  };

  const getConfigurableTypeName = (type: string) => {
    if (type.includes("Certification")) return "Certification";
    if (type.includes("Lesson")) return "Leçon";
    return type;
  };

  const getConfigurableNameById = (type: string, id: string) => {
    if (type.includes("Certification")) {
      const certification = certifications.find((c) => c.id === id);
      return certification ? certification.name : id;
    } else if (type.includes("Lesson")) {
      const lesson = lessons.find((l) => l.id === id);
      return lesson ? lesson.name : id;
    }
    return id;
  };

  // Fonctions de tri et de filtrage
  const sortQuestions = (a: Question, b: Question) => {
    let fieldA: any;
    let fieldB: any;

    switch (questionSortField) {
      case "question":
        fieldA = a.question.toLowerCase();
        fieldB = b.question.toLowerCase();
        break;
      case "difficulty":
        fieldA = a.difficulty;
        fieldB = b.difficulty;
        break;
      case "type":
        fieldA = a.type;
        fieldB = b.type;
        break;
      case "points":
        fieldA = a.points;
        fieldB = b.points;
        break;
      default:
        fieldA = a.question.toLowerCase();
        fieldB = b.question.toLowerCase();
    }

    if (fieldA < fieldB) return questionSortDirection === "asc" ? -1 : 1;
    if (fieldA > fieldB) return questionSortDirection === "asc" ? 1 : -1;
    return 0;
  };

  const sortConfigs = (a: QuizConfiguration, b: QuizConfiguration) => {
    let fieldA: any;
    let fieldB: any;

    switch (configSortField) {
      case "configurable_type":
        fieldA = getConfigurableTypeName(a.configurable_type).toLowerCase();
        fieldB = getConfigurableTypeName(b.configurable_type).toLowerCase();
        break;
      case "name":
        fieldA = getConfigurableNameById(
          a.configurable_type,
          a.configurable_id
        ).toLowerCase();
        fieldB = getConfigurableNameById(
          b.configurable_type,
          b.configurable_id
        ).toLowerCase();
        break;
      case "total_questions":
        fieldA = a.total_questions;
        fieldB = b.total_questions;
        break;
      case "passing_score":
        fieldA = a.passing_score;
        fieldB = b.passing_score;
        break;
      default:
        fieldA = getConfigurableTypeName(a.configurable_type).toLowerCase();
        fieldB = getConfigurableTypeName(b.configurable_type).toLowerCase();
    }

    if (fieldA < fieldB) return configSortDirection === "asc" ? -1 : 1;
    if (fieldA > fieldB) return configSortDirection === "asc" ? 1 : -1;
    return 0;
  };

  const toggleQuestionSort = (field: string) => {
    if (questionSortField === field) {
      setQuestionSortDirection(
        questionSortDirection === "asc" ? "desc" : "asc"
      );
    } else {
      setQuestionSortField(field);
      setQuestionSortDirection("asc");
    }
  };

  const toggleConfigSort = (field: string) => {
    if (configSortField === field) {
      setConfigSortDirection(configSortDirection === "asc" ? "desc" : "asc");
    } else {
      setConfigSortField(field);
      setConfigSortDirection("asc");
    }
  };

  const filterQuestions = (question: Question) => {
    if (!questionSearchTerm) return true;
    const searchLower = questionSearchTerm.toLowerCase();
    return (
      question.question.toLowerCase().includes(searchLower) ||
      getQuestionableNameById(
        question.questionable_type,
        question.questionable_id
      )
        .toLowerCase()
        .includes(searchLower)
    );
  };

  const filterConfigs = (config: QuizConfiguration) => {
    if (!configSearchTerm) return true;
    const searchLower = configSearchTerm.toLowerCase();
    return getConfigurableNameById(
      config.configurable_type,
      config.configurable_id
    )
      .toLowerCase()
      .includes(searchLower);
  };

  // Pagination
  const filteredQuestions = questions
    .filter(filterQuestions)
    .sort(sortQuestions);
  const filteredConfigs = quizConfigurations
    .filter(filterConfigs)
    .sort(sortConfigs);

  const indexOfLastQuestion = currentQuestionsPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );

  const indexOfLastConfig = currentConfigsPage * configsPerPage;
  const indexOfFirstConfig = indexOfLastConfig - configsPerPage;
  const currentConfigs = filteredConfigs.slice(
    indexOfFirstConfig,
    indexOfLastConfig
  );

  const questionPageCount = Math.ceil(
    filteredQuestions.length / questionsPerPage
  );
  const configPageCount = Math.ceil(filteredConfigs.length / configsPerPage);

  const renderQuestionPagination = () => {
    if (questionPageCount <= 1) return null;

    return (
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => {
                setCurrentQuestionsPage((prev) => Math.max(prev - 1, 1));
              }}
              className={
                currentQuestionsPage === 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>

          {Array.from({ length: Math.min(5, questionPageCount) }, (_, i) => {
            let pageNumber;

            if (questionPageCount <= 5) {
              pageNumber = i + 1;
            } else if (currentQuestionsPage <= 3) {
              pageNumber = i + 1;
              if (i === 4)
                return (
                  <PaginationItem key={i}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
            } else if (currentQuestionsPage >= questionPageCount - 2) {
              pageNumber = questionPageCount - 4 + i;
              if (i === 0)
                return (
                  <PaginationItem key={i}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
            } else {
              if (i === 0)
                return (
                  <PaginationItem key={i}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              if (i === 4)
                return (
                  <PaginationItem key={i}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              pageNumber = currentQuestionsPage - 1 + (i - 1);
            }

            return (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={currentQuestionsPage === pageNumber}
                  onClick={() => {
                    setCurrentQuestionsPage(pageNumber);
                  }}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              onClick={() => {
                setCurrentQuestionsPage((prev) =>
                  Math.min(prev + 1, questionPageCount)
                );
              }}
              className={
                currentQuestionsPage === questionPageCount
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  const renderConfigPagination = () => {
    if (configPageCount <= 1) return null;

    return (
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => {
                setCurrentConfigsPage((prev) => Math.max(prev - 1, 1));
              }}
              className={
                currentConfigsPage === 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>

          {Array.from({ length: Math.min(5, configPageCount) }, (_, i) => {
            let pageNumber;

            if (configPageCount <= 5) {
              pageNumber = i + 1;
            } else if (currentConfigsPage <= 3) {
              pageNumber = i + 1;
              if (i === 4)
                return (
                  <PaginationItem key={i}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
            } else if (currentConfigsPage >= configPageCount - 2) {
              pageNumber = configPageCount - 4 + i;
              if (i === 0)
                return (
                  <PaginationItem key={i}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
            } else {
              if (i === 0)
                return (
                  <PaginationItem key={i}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              if (i === 4)
                return (
                  <PaginationItem key={i}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              pageNumber = currentConfigsPage - 1 + (i - 1);
            }

            return (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={currentConfigsPage === pageNumber}
                  onClick={() => {
                    setCurrentConfigsPage(pageNumber);
                  }}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              onClick={() => {
                setCurrentConfigsPage((prev) =>
                  Math.min(prev + 1, configPageCount)
                );
              }}
              className={
                currentConfigsPage === configPageCount
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  const renderSortIcon = (
    field: string,
    currentField: string,
    direction: "asc" | "desc"
  ) => {
    if (field !== currentField) return null;
    return direction === "asc" ? (
      <ChevronUp className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1" />
    );
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Gestion des Quiz</h1>

      {error && (
        <Alert className="mb-4" variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="questions" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="configurations">Configurations</TabsTrigger>
        </TabsList>

        {/* Onglet des Questions */}
        <TabsContent value="questions">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Questions</CardTitle>
                  <CardDescription>
                    Gérer les questions pour les quiz et examens de
                    certification
                  </CardDescription>
                </div>
                <Dialog
                  open={questionDialogOpen}
                  onOpenChange={setQuestionDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      className="w-full md:w-auto"
                      onClick={() => {
                        setError(null);
                        setSelectedQuestion(null);
                        setNewQuestion({
                          question: "",
                          answers: [
                            { id: 1, text: "", correct: true },
                            { id: 2, text: "", correct: false },
                            { id: 3, text: "", correct: false },
                            { id: 4, text: "", correct: false },
                          ],
                          difficulty: "easy",
                          type: "normal",
                          points: 10,
                          questionable_type: "",
                          questionable_id: "",
                        });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter une question
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <ScrollArea className="max-h-[80vh]">
                      <DialogHeader>
                        <DialogTitle>
                          {selectedQuestion
                            ? "Modifier la question"
                            : "Ajouter une question"}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="questionable_type">
                              Type de rattachement
                            </Label>
                            <Select
                              value={newQuestion.questionable_type}
                              onValueChange={(value) => {
                                setNewQuestion({
                                  ...newQuestion,
                                  questionable_type: value,
                                  questionable_id: "",
                                });
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="module">Module</SelectItem>
                                <SelectItem value="lesson">Leçon</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {newQuestion.questionable_type === "module" && (
                            <div>
                              <Label htmlFor="questionable_id">Module</Label>
                              <Select
                                value={newQuestion.questionable_id}
                                onValueChange={(value) =>
                                  setNewQuestion({
                                    ...newQuestion,
                                    questionable_id: value,
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner un module..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {modules && modules.length > 0 ? (
                                    modules.map((module) => (
                                      <SelectItem
                                        key={module.id}
                                        value={module.id}
                                      >
                                        {module.name}
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <SelectItem value="" disabled>
                                      Aucun module disponible
                                    </SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          {newQuestion.questionable_type === "lesson" && (
                            <div>
                              <Label htmlFor="questionable_id">Leçon</Label>
                              <Select
                                value={newQuestion.questionable_id}
                                onValueChange={(value) =>
                                  setNewQuestion({
                                    ...newQuestion,
                                    questionable_id: value,
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner une leçon..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {lessons && lessons.length > 0 ? (
                                    lessons.map((lesson) => (
                                      <SelectItem
                                        key={lesson.id}
                                        value={lesson.id}
                                      >
                                        {lesson.name}
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <SelectItem value="" disabled>
                                      Aucune leçon disponible
                                    </SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="question">Question</Label>
                          <Input
                            id="question"
                            name="question"
                            value={newQuestion.question}
                            onChange={handleQuestionChange}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="difficulty">Difficulté</Label>
                            <Select
                              value={newQuestion.difficulty}
                              onValueChange={(value) =>
                                setNewQuestion({
                                  ...newQuestion,
                                  difficulty: value,
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="easy">Facile</SelectItem>
                                <SelectItem value="medium">Moyen</SelectItem>
                                <SelectItem value="hard">Difficile</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="type">Type</Label>
                            <Select
                              value={newQuestion.type}
                              onValueChange={(value) =>
                                setNewQuestion({ ...newQuestion, type: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="certification">
                                  Certification
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="points">Points</Label>
                          <Input
                            id="points"
                            name="points"
                            type="number"
                            value={newQuestion.points}
                            onChange={handleQuestionChange}
                          />
                        </div>

                        <div>
                          <Label className="mb-2 block">Réponses</Label>
                          {newQuestion.answers?.map((answer, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 mb-2"
                            >
                              <Input
                                value={answer.text}
                                onChange={(e) =>
                                  handleAnswerChange(
                                    index,
                                    "text",
                                    e.target.value
                                  )
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

                        <Button onClick={submitQuestion}>
                          {selectedQuestion ? "Mettre à jour" : "Créer"}
                        </Button>
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex flex-col md:flex-row gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher une question..."
                    value={questionSearchTerm}
                    onChange={(e) => {
                      setQuestionSearchTerm(e.target.value);
                      setCurrentQuestionsPage(1);
                    }}
                    className="pl-8"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full md:w-auto">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filtres
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem
                      onClick={() => toggleQuestionSort("question")}
                    >
                      Trier par question{" "}
                      {renderSortIcon(
                        "question",
                        questionSortField,
                        questionSortDirection
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => toggleQuestionSort("difficulty")}
                    >
                      Trier par difficulté{" "}
                      {renderSortIcon(
                        "difficulty",
                        questionSortField,
                        questionSortDirection
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => toggleQuestionSort("type")}
                    >
                      Trier par type{" "}
                      {renderSortIcon(
                        "type",
                        questionSortField,
                        questionSortDirection
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => toggleQuestionSort("points")}
                    >
                      Trier par points{" "}
                      {renderSortIcon(
                        "points",
                        questionSortField,
                        questionSortDirection
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => toggleQuestionSort("question")}
                      >
                        <div className="flex items-center">
                          Question
                          {renderSortIcon(
                            "question",
                            questionSortField,
                            questionSortDirection
                          )}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => toggleQuestionSort("type")}
                      >
                        <div className="flex items-center">
                          Type
                          {renderSortIcon(
                            "type",
                            questionSortField,
                            questionSortDirection
                          )}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => toggleQuestionSort("difficulty")}
                      >
                        <div className="flex items-center">
                          Difficulté
                          {renderSortIcon(
                            "difficulty",
                            questionSortField,
                            questionSortDirection
                          )}
                        </div>
                      </TableHead>
                      <TableHead>Rattaché à</TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => toggleQuestionSort("points")}
                      >
                        <div className="flex items-center">
                          Points
                          {renderSortIcon(
                            "points",
                            questionSortField,
                            questionSortDirection
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentQuestions.length > 0 ? (
                      currentQuestions.map((question) => (
                        <TableRow key={question.id}>
                          <TableCell className="font-medium max-w-[200px] truncate">
                            {question.question}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                question.type === "certification"
                                  ? "default"
                                  : "outline"
                              }
                            >
                              {question.type === "certification"
                                ? "Certification"
                                : "Normal"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={getDifficultyColor(
                                question.difficulty
                              )}
                            >
                              {question.difficulty === "easy"
                                ? "Facile"
                                : question.difficulty === "medium"
                                ? "Moyen"
                                : "Difficile"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center">
                              <Badge variant="outline" className="mr-1">
                                {getQuestionableTypeName(
                                  question.questionable_type
                                )}
                              </Badge>
                              <span className="truncate max-w-[150px] inline-block">
                                {getQuestionableNameById(
                                  question.questionable_type,
                                  question.questionable_id
                                )}
                              </span>
                            </span>
                          </TableCell>
                          <TableCell>{question.points}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => editQuestion(question)}
                                >
                                  Modifier
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    if (
                                      confirm(
                                        "Êtes-vous sûr de vouloir supprimer cette question ?"
                                      )
                                    ) {
                                      deleteQuestion(question.id);
                                    }
                                  }}
                                  className="text-destructive focus:text-destructive"
                                >
                                  Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-6 text-muted-foreground"
                        >
                          {filteredQuestions.length === 0
                            ? "Aucune question disponible"
                            : "Aucun résultat trouvé pour cette recherche"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              {renderQuestionPagination()}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet des Configurations */}
        <TabsContent value="configurations">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Configurations de Quiz</CardTitle>
                  <CardDescription>
                    Gérer les configurations de quiz pour les leçons et les
                    certifications
                  </CardDescription>
                </div>
                <Dialog
                  open={configDialogOpen}
                  onOpenChange={setConfigDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      className="w-full md:w-auto"
                      onClick={() => {
                        setError(null);
                        setSelectedQuizConfig(null);
                        setNewQuizConfig({
                          configurable_type: "",
                          configurable_id: "",
                          total_questions: 20,
                          difficulty_distribution: {
                            easy: 40,
                            medium: 40,
                            hard: 20,
                          },
                          module_distribution: {},
                          passing_score: 70,
                          time_limit: 60,
                        });
                        setSelectedFormationModules([]);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter une configuration
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <ScrollArea className="max-h-[80vh]">
                      <DialogHeader>
                        <DialogTitle>
                          {selectedQuizConfig
                            ? "Modifier la configuration"
                            : "Ajouter une configuration"}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="configurable_type">
                              Type de configuration
                            </Label>
                            <Select
                              value={newQuizConfig.configurable_type}
                              onValueChange={(value) => {
                                setNewQuizConfig({
                                  ...newQuizConfig,
                                  configurable_type: value,
                                  configurable_id: "",
                                  module_distribution: {},
                                  // Ajout du type en fonction du configurable_type
                                  question_type:
                                    value === "certification"
                                      ? "certification"
                                      : "normal",
                                });
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="certification">
                                  Certification
                                </SelectItem>
                                <SelectItem value="lesson">Leçon</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {newQuizConfig.configurable_type ===
                            "certification" && (
                            <div>
                              <Label htmlFor="configurable_id">
                                Certification
                              </Label>
                              <Select
                                value={newQuizConfig.configurable_id}
                                onValueChange={(value) => {
                                  setNewQuizConfig({
                                    ...newQuizConfig,
                                    configurable_id: value,
                                  });
                                  handleCertificationSelect(value);
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner une certification..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {certifications &&
                                  certifications.length > 0 ? (
                                    certifications.map((certification) => (
                                      <SelectItem
                                        key={certification.id}
                                        value={certification.id}
                                      >
                                        {certification.name}
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <SelectItem value="" disabled>
                                      Aucune certification disponible
                                    </SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          {newQuizConfig.configurable_type === "lesson" && (
                            <div>
                              <Label htmlFor="configurable_id">Leçon</Label>
                              <Select
                                value={newQuizConfig.configurable_id}
                                onValueChange={(value) =>
                                  setNewQuizConfig({
                                    ...newQuizConfig,
                                    configurable_id: value,
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner une leçon..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {lessons && lessons.length > 0 ? (
                                    lessons.map((lesson) => (
                                      <SelectItem
                                        key={lesson.id}
                                        value={lesson.id}
                                      >
                                        {lesson.name}
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <SelectItem value="" disabled>
                                      Aucune leçon disponible
                                    </SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="total_questions">
                              Nombre total de questions
                            </Label>
                            <Input
                              id="total_questions"
                              name="total_questions"
                              type="number"
                              value={newQuizConfig.total_questions}
                              onChange={(e) =>
                                setNewQuizConfig({
                                  ...newQuizConfig,
                                  total_questions: Number.parseInt(
                                    e.target.value
                                  ),
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="passing_score">
                              Score de réussite (%)
                            </Label>
                            <Input
                              id="passing_score"
                              name="passing_score"
                              type="number"
                              value={newQuizConfig.passing_score}
                              onChange={(e) =>
                                setNewQuizConfig({
                                  ...newQuizConfig,
                                  passing_score: Number.parseInt(
                                    e.target.value
                                  ),
                                })
                              }
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="time_limit">
                            Temps limite (minutes)
                          </Label>
                          <Input
                            id="time_limit"
                            name="time_limit"
                            type="number"
                            value={newQuizConfig.time_limit}
                            onChange={(e) =>
                              setNewQuizConfig({
                                ...newQuizConfig,
                                time_limit: Number.parseInt(e.target.value),
                              })
                            }
                          />
                        </div>

                        <div className="p-4 border rounded-lg bg-muted/30">
                          <Label className="mb-2 block font-medium">
                            Distribution par difficulté
                          </Label>
                          <div className="space-y-6">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span>Facile</span>
                                <span className="font-medium">
                                  {newQuizConfig.difficulty_distribution
                                    ?.easy || 0}
                                  %
                                </span>
                              </div>
                              <Slider
                                value={[
                                  newQuizConfig.difficulty_distribution?.easy ||
                                    0,
                                ]}
                                min={0}
                                max={100}
                                step={1}
                                onValueChange={(value) =>
                                  handleDifficultyDistributionChange(
                                    "easy",
                                    value[0]
                                  )
                                }
                              />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span>Moyen</span>
                                <span className="font-medium">
                                  {newQuizConfig.difficulty_distribution
                                    ?.medium || 0}
                                  %
                                </span>
                              </div>
                              <Slider
                                value={[
                                  newQuizConfig.difficulty_distribution
                                    ?.medium || 0,
                                ]}
                                min={0}
                                max={100}
                                step={1}
                                onValueChange={(value) =>
                                  handleDifficultyDistributionChange(
                                    "medium",
                                    value[0]
                                  )
                                }
                              />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span>Difficile</span>
                                <span className="font-medium">
                                  {newQuizConfig.difficulty_distribution
                                    ?.hard || 0}
                                  %
                                </span>
                              </div>
                              <Slider
                                value={[
                                  newQuizConfig.difficulty_distribution?.hard ||
                                    0,
                                ]}
                                min={0}
                                max={100}
                                step={1}
                                onValueChange={(value) =>
                                  handleDifficultyDistributionChange(
                                    "hard",
                                    value[0]
                                  )
                                }
                              />
                            </div>
                          </div>
                          {!validateDifficultyDistribution() && (
                            <Alert className="mt-4" variant="destructive">
                              <AlertDescription>
                                La somme des pourcentages doit être égale à 100%
                                (actuellement:
                                {(newQuizConfig.difficulty_distribution?.easy ||
                                  0) +
                                  (newQuizConfig.difficulty_distribution
                                    ?.medium || 0) +
                                  (newQuizConfig.difficulty_distribution
                                    ?.hard || 0)}
                                %)
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>

                        {newQuizConfig.configurable_type ===
                          "certification" && (
                          <div className="p-4 border rounded-lg bg-muted/30">
                            <div className="flex justify-between items-center mb-4">
                              <Label className="font-medium">
                                Distribution par module
                              </Label>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setModuleDistributionDialogOpen(true)
                                }
                              >
                                Configurer
                              </Button>
                            </div>

                            <Dialog
                              open={moduleDistributionDialogOpen}
                              onOpenChange={setModuleDistributionDialogOpen}
                            >
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>
                                    Distribution par module
                                  </DialogTitle>
                                </DialogHeader>
                                <ScrollArea className="max-h-[60vh]">
                                  <div className="space-y-6 p-4">
                                    {selectedFormationModules &&
                                    selectedFormationModules.length > 0 ? (
                                      selectedFormationModules.map((module) => (
                                        <div key={module.id}>
                                          <div className="flex justify-between mb-1">
                                            <span>{module.name}</span>
                                            <span className="font-medium">
                                              {newQuizConfig
                                                .module_distribution?.[
                                                module.id
                                              ] || 0}
                                              %
                                            </span>
                                          </div>
                                          <Slider
                                            value={[
                                              newQuizConfig
                                                .module_distribution?.[
                                                module.id
                                              ] || 0,
                                            ]}
                                            min={0}
                                            max={100}
                                            step={1}
                                            onValueChange={(value) =>
                                              handleModuleDistributionChange(
                                                module.id,
                                                value[0]
                                              )
                                            }
                                          />
                                        </div>
                                      ))
                                    ) : (
                                      <div className="text-center py-4 text-muted-foreground">
                                        Aucun module disponible
                                      </div>
                                    )}

                                    {selectedFormationModules &&
                                      selectedFormationModules.length > 0 &&
                                      !validateModuleDistribution() && (
                                        <Alert
                                          className="mt-4"
                                          variant="destructive"
                                        >
                                          <AlertDescription>
                                            La somme des pourcentages par module
                                            doit être égale à 100%
                                            (actuellement:
                                            {Object.values(
                                              newQuizConfig.module_distribution ||
                                                {}
                                            ).reduce(
                                              (sum, val) => sum + val,
                                              0
                                            )}
                                            %)
                                          </AlertDescription>
                                        </Alert>
                                      )}
                                  </div>
                                </ScrollArea>
                                <div className="flex justify-end mt-4">
                                  <Button
                                    onClick={() =>
                                      setModuleDistributionDialogOpen(false)
                                    }
                                  >
                                    Fermer
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>

                            <div className="border rounded-md p-3 bg-background">
                              {selectedFormationModules &&
                              selectedFormationModules.length > 0 ? (
                                <div className="space-y-2">
                                  {selectedFormationModules.map((module) => (
                                    <div
                                      key={module.id}
                                      className="flex justify-between"
                                    >
                                      <span className="truncate max-w-[250px]">
                                        {module.name}
                                      </span>
                                      <Badge variant="outline">
                                        {newQuizConfig.module_distribution?.[
                                          module.id
                                        ] || 0}
                                        %
                                      </Badge>
                                    </div>
                                  ))}
                                  {!validateModuleDistribution() && (
                                    <div className="text-red-500 text-sm mt-2">
                                      Total:{" "}
                                      {Object.values(
                                        newQuizConfig.module_distribution || {}
                                      ).reduce((sum, val) => sum + val, 0)}
                                      % (devrait être 100%)
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-center py-4 text-muted-foreground">
                                  Sélectionnez une certification pour configurer
                                  la distribution par module
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <Button onClick={submitQuizConfig}>
                          {selectedQuizConfig ? "Mettre à jour" : "Créer"}
                        </Button>
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex flex-col md:flex-row gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher une configuration..."
                    value={configSearchTerm}
                    onChange={(e) => {
                      setConfigSearchTerm(e.target.value);
                      setCurrentConfigsPage(1);
                    }}
                    className="pl-8"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full md:w-auto">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filtres
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem
                      onClick={() => toggleConfigSort("configurable_type")}
                    >
                      Trier par type{" "}
                      {renderSortIcon(
                        "configurable_type",
                        configSortField,
                        configSortDirection
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleConfigSort("name")}>
                      Trier par nom{" "}
                      {renderSortIcon(
                        "name",
                        configSortField,
                        configSortDirection
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => toggleConfigSort("total_questions")}
                    >
                      Trier par nombre de questions{" "}
                      {renderSortIcon(
                        "total_questions",
                        configSortField,
                        configSortDirection
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => toggleConfigSort("passing_score")}
                    >
                      Trier par score de réussite{" "}
                      {renderSortIcon(
                        "passing_score",
                        configSortField,
                        configSortDirection
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => toggleConfigSort("configurable_type")}
                      >
                        <div className="flex items-center">
                          Type
                          {renderSortIcon(
                            "configurable_type",
                            configSortField,
                            configSortDirection
                          )}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => toggleConfigSort("name")}
                      >
                        <div className="flex items-center">
                          Nom
                          {renderSortIcon(
                            "name",
                            configSortField,
                            configSortDirection
                          )}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => toggleConfigSort("total_questions")}
                      >
                        <div className="flex items-center">
                          Questions
                          {renderSortIcon(
                            "total_questions",
                            configSortField,
                            configSortDirection
                          )}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => toggleConfigSort("passing_score")}
                      >
                        <div className="flex items-center">
                          Score de réussite
                          {renderSortIcon(
                            "passing_score",
                            configSortField,
                            configSortDirection
                          )}
                        </div>
                      </TableHead>
                      <TableHead>Temps limite</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentConfigs.length > 0 ? (
                      currentConfigs.map((config) => (
                        <TableRow key={config.id}>
                          <TableCell>
                            <Badge variant="outline">
                              {getConfigurableTypeName(
                                config.configurable_type
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium max-w-[200px] truncate">
                            {getConfigurableNameById(
                              config.configurable_type,
                              config.configurable_id
                            )}
                          </TableCell>
                          <TableCell>{config.total_questions}</TableCell>
                          <TableCell>{config.passing_score}%</TableCell>
                          <TableCell>{config.time_limit} min</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => editQuizConfig(config)}
                                >
                                  Modifier
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    if (
                                      confirm(
                                        "Êtes-vous sûr de vouloir supprimer cette configuration ?"
                                      )
                                    ) {
                                      deleteQuizConfig(config.id);
                                    }
                                  }}
                                  className="text-destructive focus:text-destructive"
                                >
                                  Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-6 text-muted-foreground"
                        >
                          {filteredConfigs.length === 0
                            ? "Aucune configuration disponible"
                            : "Aucun résultat trouvé pour cette recherche"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              {renderConfigPagination()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuizManager;
