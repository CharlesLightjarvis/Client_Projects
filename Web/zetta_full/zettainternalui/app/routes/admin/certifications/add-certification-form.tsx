import { useEffect, useState, useCallback } from "react";
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
import { ImageIcon, PlusIcon, XIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useFormationsStore } from "~/hooks/use-formations-store";
import { useCertificationsStore } from "~/hooks/use-certifications-store";
import { cn } from "~/lib/utils";

export function AddCertificationForm() {
  const [open, setOpen] = useState(false);
  const { formations, getFormations } = useFormationsStore();
  const { createCertification } = useCertificationsStore();
  const [prerequisites, setPrerequisites] = useState([""]);
  const [benefits, setBenefits] = useState([""]);
  const [skills, setSkills] = useState([""]);
  const [bestFor, setBestFor] = useState([""]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    getFormations();
  }, [getFormations]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];

      if (file.size > 2 * 1024 * 1024) {
        toast.error("Erreur", {
          description: "L'image ne doit pas dépasser 2MB",
        });
        return;
      }

      setImageFile(file);

      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "image/gif": [".gif"],
    },
    maxFiles: 1,
    maxSize: 2 * 1024 * 1024,
  });

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset states when dialog closes
      setPrerequisites([""]);
      setBenefits([""]);
      setSkills([""]);
      setBestFor([""]);
      setImageFile(null);
      setImagePreview(null);
    }
    setOpen(newOpen);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Ajouter l'image si elle existe
    if (imageFile) {
      formData.append("image", imageFile);
    }

    // Ajouter les arrays
    prerequisites
      .filter((p) => p.trim() !== "")
      .forEach((prerequisite) => {
        formData.append("prerequisites[]", prerequisite);
      });

    benefits
      .filter((b) => b.trim() !== "")
      .forEach((benefit) => {
        formData.append("benefits[]", benefit);
      });

    skills
      .filter((s) => s.trim() !== "")
      .forEach((skill) => {
        formData.append("skills[]", skill);
      });

    bestFor
      .filter((b) => b.trim() !== "")
      .forEach((best) => {
        formData.append("best_for[]", best);
      });

    try {
      const message = await createCertification(formData);
      form.reset();
      setOpen(false);
      setPrerequisites([""]);
      setBenefits([""]);
      setSkills([""]);
      setBestFor([""]);
      setImageFile(null);
      setImagePreview(null);

      toast.success("Succès", {
        description: message,
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

  const handleAddArrayField = (
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) => [...prev, ""]);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <PlusIcon size={16} />
          <span>Ajouter</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] md:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <form className="w-full" onSubmit={handleSubmit}>
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl font-semibold">
              Ajouter une nouvelle certification
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations ci-dessous pour créer une nouvelle
              certification.
            </DialogDescription>
          </DialogHeader>

          <div className="w-full space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Nom de la certification"
                  required
                />
              </div>

              {/* <div className="space-y-2 col-span-2">
                <Label htmlFor="formation_id">Formation</Label>
                <Select name="formation_id" required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner une formation" />
                  </SelectTrigger>
                  <SelectContent>
                    {formations?.map((formation) => (
                      <SelectItem key={formation.id} value={formation.id}>
                        {formation.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}

              <div className="space-y-2">
                <Label htmlFor="provider">Fournisseur</Label>
                <Input
                  id="provider"
                  name="provider"
                  placeholder="Nom du fournisseur"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="validity_period">
                  Période de validité (années)
                </Label>
                <Input
                  id="validity_period"
                  name="validity_period"
                  type="number"
                  defaultValue="1"
                  min="1"
                  required
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="level">Niveau</Label>
                <Select name="level" required defaultValue="beginner">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner un niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Débutant</SelectItem>
                    <SelectItem value="intermediate">Intermédiaire</SelectItem>
                    <SelectItem value="advanced">Avancé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 col-span-2">
                <Label>Image de la certification</Label>
                {imagePreview ? (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                    <img
                      src={imagePreview}
                      alt="Aperçu de l'image"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 rounded-full p-1 h-8 w-8"
                      onClick={removeImage}
                    >
                      <XIcon size={16} />
                    </Button>
                  </div>
                ) : (
                  <div
                    {...getRootProps()}
                    className={cn(
                      "border-2 border-dashed rounded-lg p-6 cursor-pointer flex flex-col items-center justify-center h-32",
                      isDragActive
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/20"
                    )}
                  >
                    <input {...getInputProps()} />
                    <ImageIcon
                      size={32}
                      className="text-muted-foreground mb-2"
                    />
                    {isDragActive ? (
                      <p className="text-center text-muted-foreground">
                        Déposez l'image ici...
                      </p>
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <p>
                          Glissez et déposez une image ici, ou cliquez pour
                          sélectionner
                        </p>
                        <p className="text-sm mt-1">JPG, PNG, GIF (max 2MB)</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Description de la certification..."
                className="min-h-[100px]"
              />
            </div>

            {/* Arrays fields */}
            {[
              {
                label: "Prérequis",
                value: prerequisites,
                setter: setPrerequisites,
                placeholder: "Prérequis...",
              },
              {
                label: "Avantages",
                value: benefits,
                setter: setBenefits,
                placeholder: "Avantage...",
              },
              {
                label: "Compétences",
                value: skills,
                setter: setSkills,
                placeholder: "Compétence...",
              },
              {
                label: "Meilleur pour",
                value: bestFor,
                setter: setBestFor,
                placeholder: "Meilleur pour...",
              },
            ].map(({ label, value, setter, placeholder }) => (
              <div key={label} className="space-y-2">
                <Label>{label}</Label>
                {value.map((item, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <Input
                      value={item}
                      onChange={(e) => {
                        const newArray = [...value];
                        newArray[index] = e.target.value;
                        setter(newArray);
                      }}
                      placeholder={placeholder}
                    />
                    {index === value.length - 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleAddArrayField(setter)}
                      >
                        +
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ))}

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Annuler
              </Button>
              <Button type="submit">Créer</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
