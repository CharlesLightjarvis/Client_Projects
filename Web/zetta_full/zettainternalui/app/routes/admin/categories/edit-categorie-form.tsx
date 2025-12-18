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
import { useRolesStore } from "~/hooks/use-roles-store";
import { useUsersStore } from "~/hooks/use-users-store";
import { useCategoriesStore } from "~/hooks/use-categories-store";

interface EditCategorieFormProps {
  categorieId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditCategorieForm({
  categorieId,
  open,
  onOpenChange,
}: EditCategorieFormProps) {
  const { updateCategorie, setSelectedCategorie, selectedCategorie } =
    useCategoriesStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const formData = new FormData(form);
    const categorieData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
    };

    try {
      const message = await updateCategorie(categorieId, categorieData);
      setSelectedCategorie(null); // Réinitialiser l'utilisateur sélectionné
      form.reset();
      onOpenChange(false);

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

  // Charger l'utilisateur sélectionné quand le dialogue s'ouvre
  useEffect(() => {
    if (open && categorieId) {
      const categorie = useCategoriesStore
        .getState()
        .categories.find((c) => c.id === categorieId);
      if (categorie) {
        setSelectedCategorie(categorie);
      }
    } else {
      setSelectedCategorie(null);
    }
  }, [open, categorieId, setSelectedCategorie]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[500px] md:max-w-[600px] max-h-[85vh] overflow-y-auto"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <form className="w-full" onSubmit={handleSubmit}>
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl font-semibold">
              Modifier la catégorie
            </DialogTitle>
            <DialogDescription>
              Modifier les informations de la catégorie ci-dessous.
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
                  defaultValue={selectedCategorie?.name}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  placeholder="Cette catégorie concerne les matières d'informatique."
                  className="w-full"
                  defaultValue={selectedCategorie?.description}
                  required
                />
              </div>
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
