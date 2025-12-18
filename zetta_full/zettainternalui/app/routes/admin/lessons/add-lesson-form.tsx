import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { PlusIcon } from "lucide-react";
import { useModulesStore } from "~/hooks/use-modules-store";
import { useLessonsStore } from "~/hooks/use-lessons-store";

export function AddLessonForm() {
  const [open, setOpen] = useState(false);
  const { modules, getModules } = useModulesStore();
  const { createLesson } = useLessonsStore();
  const [selectedModule, setSelectedModule] = useState<string>("");

  // Load modules when the dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      getModules();
    }
    setOpen(newOpen);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const formData = new FormData(form);
    const lessonData = {
      module_id: formData.get("module_id") as string,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      duration: Number(formData.get("duration")),
      // Add any other fields needed for lessons
    };

    try {
      const message = await createLesson(lessonData);
      form.reset();
      setSelectedModule("");
      setOpen(false);

      toast.success("Succès", {
        description: message || "Leçon créée avec succès",
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
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
              Ajouter une nouvelle leçon
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations ci-dessous pour créer une nouvelle
              leçon.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            {/* <div className="w-full space-y-2">
              <Label htmlFor="module_id">Module</Label>
              <Select
                name="module_id"
                required
                value={selectedModule}
                onValueChange={setSelectedModule}
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
            </div> */}

            <div className="w-full space-y-2">
              <Label htmlFor="name">Nom de la leçon</Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="Nom de la leçon"
                className="w-full"
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
              />
            </div>

            <div className="w-full space-y-2">
              <Label htmlFor="duration">Durée (heures)</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                defaultValue={0}
                required
                placeholder="Durée de la leçon"
                className="w-full"
              />
            </div>

            {/* You can add other fields specific to lessons here */}
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
