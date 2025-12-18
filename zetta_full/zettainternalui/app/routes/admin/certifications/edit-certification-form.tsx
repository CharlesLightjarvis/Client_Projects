import { useEffect, useState, useCallback } from "react";
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
import { ImageIcon, PlusIcon, XIcon, TrashIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useFormationsStore } from "~/hooks/use-formations-store";
import { useCertificationsStore } from "~/hooks/use-certifications-store";
import { cn } from "~/lib/utils";

interface EditCertificationFormProps {
  certificationId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditCertificationForm({
  certificationId,
  open,
  onOpenChange,
}: EditCertificationFormProps) {
  const { updateCertification, certifications } = useCertificationsStore();
  const { formations, getFormations } = useFormationsStore();
  const [prerequisites, setPrerequisites] = useState<string[]>([]);
  const [benefits, setBenefits] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [bestFor, setBestFor] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Pour la gestion des formations sélectionnées (many-to-many)
  const [selectedFormations, setSelectedFormations] = useState<string[]>([]);
  const [currentFormation, setCurrentFormation] = useState<string>("");

  // Trouver la certification à éditer dans le store
  const certification = certifications.find((c) => c.id === certificationId);

  useEffect(() => {
    getFormations();
  }, [getFormations]);

  useEffect(() => {
    if (open && certification) {
      setPrerequisites(
        certification.prerequisites?.length ? certification.prerequisites : [""]
      );
      setBenefits(
        certification.benefits?.length ? certification.benefits : [""]
      );
      setSkills(certification.skills?.length ? certification.skills : [""]);
      setBestFor(
        certification.best_for?.length ? certification.best_for : [""]
      );

      // Initialiser l'image preview avec l'URL existante
      if (certification.image) {
        setImagePreview(certification.image);
      }

      // Initialiser les formations sélectionnées (pour many-to-many)
      if (Array.isArray(certification.formations)) {
        setSelectedFormations(certification.formations.map((f: any) => f.id));
      } else {
        setSelectedFormations([]);
      }
    }
  }, [open, certification]);

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
      // Réinitialiser les champs quand le dialogue se ferme
      setPrerequisites([""]);
      setBenefits([""]);
      setSkills([""]);
      setBestFor([""]);
      setImageFile(null);
      setImagePreview(null);
      setSelectedFormations([]);
      setCurrentFormation("");
    }
    onOpenChange(newOpen);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!certification) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Ajouter l'image si elle a été modifiée
    if (imageFile) {
      formData.append("image", imageFile);
    } else if (!imagePreview && certification.image) {
      // Si l'image a été supprimée
      formData.append("remove_image", "true");
    }

    // Ajouter les tableaux
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

    // Ajouter les formations sélectionnées (many-to-many)
    selectedFormations.forEach((formationId) => {
      formData.append("formation_ids[]", formationId);
    });

    try {
      const message = await updateCertification(certificationId, formData);
      onOpenChange(false);
      toast.success("Succès", { description: message });
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

  const handleRemoveArrayField = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number
  ) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  if (!certification) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[700px] md:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <form className="w-full" onSubmit={handleSubmit}>
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl font-semibold">
              Modifier la certification
            </DialogTitle>
            <DialogDescription>
              Modifiez les informations de la certification.
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
                  defaultValue={certification.name}
                />
              </div>

              {/* Many-to-many Formations */}
              <div className="w-full space-y-2 col-span-2">
                <Label>Formations</Label>
                <div className="space-y-4">
                  <Select
                    value={currentFormation}
                    onValueChange={(value) => {
                      if (!selectedFormations.includes(value)) {
                        setSelectedFormations([...selectedFormations, value]);
                      }
                      setCurrentFormation("");
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner une formation" />
                    </SelectTrigger>
                    <SelectContent>
                      {formations?.map((formation) => (
                        <SelectItem
                          key={formation.id}
                          value={formation.id}
                          disabled={selectedFormations.includes(formation.id)}
                        >
                          {formation.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="space-y-2">
                    {selectedFormations.map((formationId, index) => (
                      <div
                        key={formationId}
                        className="flex items-center justify-between bg-secondary p-2 rounded-md"
                      >
                        <span>
                          {formations?.find((f) => f.id === formationId)?.name}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedFormations(
                              selectedFormations.filter(
                                (id) => id !== formationId
                              )
                            );
                          }}
                        >
                          <TrashIcon size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="provider">Fournisseur</Label>
                <Input
                  id="provider"
                  name="provider"
                  placeholder="Nom du fournisseur"
                  required
                  defaultValue={certification.provider}
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
                  min="1"
                  placeholder="1"
                  required
                  defaultValue={certification.validity_period}
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="level">Niveau</Label>
                <Select
                  name="level"
                  required
                  defaultValue={certification.level}
                >
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
                defaultValue={certification.description}
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
                    {value.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleRemoveArrayField(setter, index)}
                      >
                        <XIcon size={16} />
                      </Button>
                    )}
                    {index === value.length - 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleAddArrayField(setter)}
                      >
                        <PlusIcon size={16} />
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
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button type="submit">Modifier</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
