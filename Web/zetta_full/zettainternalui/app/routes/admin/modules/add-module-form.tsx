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
import { useFormationsStore } from "~/hooks/use-formations-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { Lesson } from "~/types/module";
import { useLessonsStore } from "~/hooks/use-lessons-store";

export function AddModuleForm() {
  const [open, setOpen] = useState(false);
  const { createModule } = useModulesStore();
  const { lessons, getLessons } = useLessonsStore();
  const [lessonsState, setLessonsState] = useState<Lesson[]>([
    { name: "", description: "", duration: 0 },
  ]);
  const [currentLesson, setCurrentLesson] = useState<string>("");
  const [selectedLessons, setSelectedLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    if (open) {
      getLessons();
    }
  }, [open, getLessons]);

  const handleAddLesson = () => {
    setLessonsState([
      ...lessonsState,
      { name: "", description: "", duration: 0 },
    ]);
  };

  const handleRemoveLesson = (index: number) => {
    if (lessonsState.length > 1) {
      const newLessons = [...lessonsState];
      newLessons.splice(index, 1);
      setLessonsState(newLessons);
    }
  };

  const handleLessonChange = (
    index: number,
    field: keyof Lesson,
    value: string
  ) => {
    const newLessons = [...lessonsState];

    if (field === "duration") {
      newLessons[index][field] = Number(value) as any;
    } else {
      newLessons[index][field] = value as any;
    }

    setLessonsState(newLessons);
  };

  const handleLessonSelect = (lesson: Lesson) => {
    if (!selectedLessons.some((l) => l.name === lesson.name)) {
      setSelectedLessons([...selectedLessons, lesson]);
    }
    setCurrentLesson("");
  };

  const removeSelectedLesson = (index: number) => {
    setSelectedLessons(selectedLessons.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const formData = new FormData(form);
    const moduleData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      existing_lesson_ids: selectedLessons
        .map((lesson) => lesson.id)
        .filter((id): id is string => typeof id === "string"),

      new_lessons: lessonsState.filter((lesson) => lesson.name.trim() !== ""),
    };

    try {
      const message = await createModule(moduleData);
      form.reset();
      setLessonsState([{ name: "", description: "", duration: 0 }]);
      setSelectedLessons([]);
      setOpen(false);

      toast.success("Succès", {
        description: message || "Module créé avec succès",
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <PlusIcon size={16} />
          <span>Ajouter</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <form className="w-full" onSubmit={handleSubmit}>
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl font-semibold">
              Ajouter un nouveau module
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations ci-dessous pour créer un nouveau
              module.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div className="w-full space-y-2">
              <Label htmlFor="name">Nom du module</Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="Nom du module"
                className="w-full"
              />
            </div>

            <div className="w-full space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                required
                placeholder="Description du module"
                className="w-full min-h-24 resize-y"
              />
            </div>

            <div className="w-full space-y-2">
              <Label>Leçons existantes</Label>
              <div className="space-y-4">
                <Select
                  value={currentLesson}
                  onValueChange={(value) => {
                    const lesson = lessons.find((l) => l.name === value);
                    if (lesson) handleLessonSelect(lesson);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner une leçon existante" />
                  </SelectTrigger>
                  <SelectContent>
                    {lessons
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

            <div className="space-y-4">
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

              {lessonsState.map((lesson, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Leçon {index + 1}</h4>
                    {lessonsState.length > 1 && (
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
                    <Label htmlFor={`lesson-description-${index}`}>
                      Description de la leçon
                    </Label>
                    <Textarea
                      id={`lesson-description-${index}`}
                      value={lesson.description}
                      onChange={(e) =>
                        handleLessonChange(index, "description", e.target.value)
                      }
                      placeholder="Description de la leçon"
                      className="resize-y"
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
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Annuler
            </Button>
            <Button type="submit">Créer</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
