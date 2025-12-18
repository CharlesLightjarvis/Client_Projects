import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useModulesStore } from "~/hooks/use-modules-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { Lesson } from "~/types/module";
import { useLessonsStore } from "~/hooks/use-lessons-store";

interface EditModuleFormProps {
  moduleId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditModuleForm({
  moduleId,
  open,
  onOpenChange,
}: EditModuleFormProps) {
  const { modules, updateModule } = useModulesStore();
  const { lessons: allLessons, getLessons } = useLessonsStore();

  // Module name & description states for controlled inputs
  const [moduleName, setModuleName] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");

  // Leçons existantes sélectionnées (par objet Lesson)
  const [selectedLessons, setSelectedLessons] = useState<Lesson[]>([]);

  // Leçons personnalisées à éditer (nouvelles leçons)
  const [newLessons, setNewLessons] = useState<Lesson[]>([
    { name: "", description: "", duration: 0 },
  ]);

  // Select value for leçons existantes
  const [currentLesson, setCurrentLesson] = useState<string>("");

  // Charger les données du module à l'ouverture du dialog
  useEffect(() => {
    if (open) {
      getLessons();

      const module = modules.find((m) => m.id === moduleId);
      if (module) {
        setModuleName(module.name ?? "");
        setModuleDescription(module.description ?? "");

        // Leçons existantes liées au module (ici on part du principe que module.lessons contiennent toutes les leçons)
        // Si tu veux différencier leçons existantes / nouvelles, tu peux adapter selon ta data.
        // Ici on suppose que module.lessons contient les leçons déjà existantes liées au module
        // Et les nouvelles leçons à éditer dans un autre tableau si besoin.
        // Pour faire simple on sépare les leçons en selectedLessons (existantes) et newLessons (sans id)
        const existing = module.lessons.filter((l) => l.id);
        const newOnes = module.lessons.filter((l) => !l.id);

        setSelectedLessons(existing);
        setNewLessons(
          newOnes.length > 0
            ? newOnes
            : [{ name: "", description: "", duration: 0 }]
        );
      }
    } else {
      // Reset tout à la fermeture
      setModuleName("");
      setModuleDescription("");
      setSelectedLessons([]);
      setNewLessons([{ name: "", description: "", duration: 0 }]);
      setCurrentLesson("");
    }
  }, [open, moduleId, modules, getLessons]);

  // Ajouter une nouvelle leçon (vide)
  const handleAddLesson = () => {
    setNewLessons([...newLessons, { name: "", description: "", duration: 0 }]);
  };

  // Supprimer une nouvelle leçon
  const handleRemoveLesson = (index: number) => {
    if (newLessons.length > 1) {
      setNewLessons(newLessons.filter((_, i) => i !== index));
    }
  };

  // Modifier une nouvelle leçon (nom/description)
  const handleLessonChange = (
    index: number,
    field: keyof Lesson,
    value: string
  ) => {
    const updated = [...newLessons];
    if (field === "duration") {
      updated[index][field] = Number(value) as any;
    } else {
      updated[index][field] = value as any;
    }
    setNewLessons(updated);
  };

  // Sélectionner une leçon existante dans le select
  const handleLessonSelect = (lesson: Lesson) => {
    if (!selectedLessons.some((l) => l.name === lesson.name)) {
      setSelectedLessons([...selectedLessons, lesson]);
    }
    setCurrentLesson("");
  };

  // Supprimer une leçon existante sélectionnée
  const removeSelectedLesson = (index: number) => {
    setSelectedLessons(selectedLessons.filter((_, i) => i !== index));
  };

  // Soumettre le formulaire pour update
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!moduleName.trim()) {
      toast.error("Le nom du module est requis");
      return;
    }

    const moduleData = {
      name: moduleName,
      description: moduleDescription,
      existing_lesson_ids: selectedLessons
        .map((lesson) => lesson.id)
        .filter((id): id is string => typeof id === "string"),

      new_lessons: newLessons.filter((lesson) => lesson.name.trim() !== ""),
    };

    try {
      const message = await updateModule(moduleId, moduleData);
      onOpenChange(false);

      toast.success("Succès", {
        description: message || "Module modifié avec succès",
      });
    } catch (error) {
      toast.error("Erreur", {
        description:
          error instanceof Error
            ? error.message
            : "Une erreur inattendue s'est produite",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <form className="w-full" onSubmit={handleSubmit}>
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl font-semibold">
              Modifier le module
            </DialogTitle>
            <DialogDescription>
              Modifiez les informations ci-dessous pour mettre à jour le module.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            {/* Nom du module */}
            <div className="w-full space-y-2">
              <Label htmlFor="name">Nom du module</Label>
              <Input
                id="name"
                name="name"
                required
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
                placeholder="Nom du module"
                className="w-full"
              />
            </div>

            {/* Description */}
            <div className="w-full space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                required
                value={moduleDescription}
                onChange={(e) => setModuleDescription(e.target.value)}
                placeholder="Description du module"
                className="w-full min-h-24 resize-y"
              />
            </div>

            {/* Sélection des leçons existantes */}
            <div className="w-full space-y-2">
              <Label>Leçons existantes</Label>
              <div className="space-y-4">
                <Select
                  value={currentLesson}
                  onValueChange={(value) => {
                    const lesson = allLessons.find((l) => l.name === value);
                    if (lesson) handleLessonSelect(lesson);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner une leçon existante" />
                  </SelectTrigger>
                  <SelectContent>
                    {allLessons
                      .filter((lesson) => lesson.name.trim() !== "")
                      .map((lesson, index) => (
                        <SelectItem
                          key={index}
                          value={lesson.name}
                          disabled={selectedLessons.some(
                            (l) => l.name === lesson.name
                          )}
                        >
                          {lesson.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                <div className="flex flex-wrap gap-2">
                  {selectedLessons.map((lesson, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-md"
                    >
                      <span>{lesson.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 hover:bg-transparent"
                        onClick={() => removeSelectedLesson(index)}
                      >
                        <TrashIcon size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Nouvelles leçons */}
            {/* <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Nouvelles leçons</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddLesson}
                >
                  Ajouter une leçon
                </Button>
              </div>

              {newLessons.map((lesson, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Leçon {index + 1}</h4>
                    {newLessons.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveLesson(index)}
                      >
                        <TrashIcon size={16} />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`lesson-name-${index}`}>
                      Nom de la leçon
                    </Label>
                    <Input
                      id={`lesson-name-${index}`}
                      value={lesson.name}
                      onChange={(e) =>
                        handleLessonChange(index, "name", e.target.value)
                      }
                      placeholder="Nom de la leçon"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`lesson-desc-${index}`}>Description</Label>
                    <Textarea
                      id={`lesson-desc-${index}`}
                      value={lesson.description}
                      onChange={(e) =>
                        handleLessonChange(index, "description", e.target.value)
                      }
                      placeholder="Description de la leçon"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`lesson-duration-${index}`}>
                      Durée de la leçon (heures)
                    </Label>

                    <Input
                      id={`lesson-duration-${index}`}
                      value={lesson.duration}
                      onChange={(e) =>
                        handleLessonChange(index, "duration", e.target.value)
                      }
                      type="number"
                      defaultValue={0}
                      min="0"
                      placeholder="Durée de la leçon"
                      className="w-full"
                    />
                  </div>
                </div>
              ))}
            </div> */}
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                }}
              >
                Annuler
              </Button>
            </DialogTrigger>

            <Button type="submit">Modifier</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
