import { useEffect } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useModulesStore } from "~/hooks/use-modules-store";
import { useLessonsStore } from "~/hooks/use-lessons-store";

interface EditLessonFormProps {
  lessonId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditLessonForm({
  lessonId,
  open,
  onOpenChange,
}: EditLessonFormProps) {
  const { updateLesson, setSelectedLesson, selectedLesson, lessons } =
    useLessonsStore();
  const { modules, getModules } = useModulesStore();

  // Récupère les modules à l'ouverture
  useEffect(() => {
    if (open) getModules();
  }, [open, getModules]);

  // Met à jour la leçon sélectionnée à l'ouverture ou changement d'id
  useEffect(() => {
    if (open && lessonId) {
      const lesson = lessons.find((l) => l.id === lessonId);
      if (lesson) setSelectedLesson(lesson);
      else setSelectedLesson(null);
    } else {
      setSelectedLesson(null);
    }
  }, [open, lessonId, lessons, setSelectedLesson]);

  // Si lessonId est null ou la leçon n'existe pas, propose de sélectionner une leçon (ou affiche un message)
  if (!lessonId || !selectedLesson) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Sélectionnez une leçon</DialogTitle>
            <DialogDescription>
              Veuillez sélectionner une leçon à modifier.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Formulaire d'édition de la leçon
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const formData = new FormData(form);
    const lessonData = {
      module_id: formData.get("module_id") as string,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      duration: Number(formData.get("duration")),
    };

    try {
      const message = await updateLesson(lessonId, lessonData);
      setSelectedLesson(null);
      onOpenChange(false);

      toast.success("Succès", {
        description: message || "Leçon modifiée avec succès",
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
      <DialogContent
        className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <form className="w-full" onSubmit={handleSubmit}>
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl font-semibold">
              Modifier la leçon
            </DialogTitle>
            <DialogDescription>
              Modifiez les informations de la leçon ci-dessous.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div className="w-full space-y-2">
              <Label htmlFor="module_id">Module</Label>
              <Select
                name="module_id"
                defaultValue={selectedLesson?.module?.id}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez un module" />
                </SelectTrigger>
                <SelectContent>
                  {modules?.map((module) => (
                    <SelectItem key={module.id} value={module.id}>
                      {module.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full space-y-2">
              <Label htmlFor="name">Nom de la leçon</Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="Nom de la leçon"
                className="w-full"
                defaultValue={selectedLesson?.name}
              />
            </div>

            <div className="w-full space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                required
                placeholder="Description de la leçon"
                className="w-full min-h-24 resize-y"
                defaultValue={selectedLesson?.description}
              />
            </div>

            <div className="w-full space-y-2">
              <Label htmlFor="duration">Durée (heures)</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                defaultValue={selectedLesson?.duration}
                required
                placeholder="Durée de la leçon"
                className="w-full"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Modifier
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
