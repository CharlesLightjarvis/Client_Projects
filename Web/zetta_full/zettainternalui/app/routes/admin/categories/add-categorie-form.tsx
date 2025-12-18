import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { PlusIcon } from "lucide-react";
import { useCategoriesStore } from "~/hooks/use-categories-store";

export function AddCategorieForm() {
  const [open, setOpen] = useState(false);
  const { createCategorie } = useCategoriesStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const formData = new FormData(form);
    const categorieData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
    };

    try {
      const message = await createCategorie(categorieData);
      form.reset();
      setOpen(false);

      toast.success("Success", {
        description: message,
      });
    } catch (error) {
      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
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
      <DialogContent className="sm:max-w-[500px] md:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <form className="w-full" onSubmit={handleSubmit}>
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl font-semibold">
              Ajouter une nouvelle catégorie
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations ci-dessous pour créer une nouvelle
              catégorie.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4 overflow-y-auto">
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Informatique"
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  placeholder="Cette catégorie concerne les matières d'informatique."
                  required
                />
              </div>
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
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Créer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
