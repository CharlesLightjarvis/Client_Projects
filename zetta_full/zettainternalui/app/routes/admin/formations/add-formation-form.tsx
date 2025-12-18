import { useState, useEffect, useCallback } from "react";
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
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  PlusIcon,
  TrashIcon,
  CalendarIcon,
  UploadIcon,
  ImageIcon,
  XIcon,
} from "lucide-react";
import { useFormationsStore } from "~/hooks/use-formations-store";
import { useCategoriesStore } from "~/hooks/use-categories-store";
import { useModulesStore } from "~/hooks/use-modules-store";
import { useUsersStore } from "~/hooks/use-users-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "~/lib/utils";
import type { CreateFormationData } from "~/types/formation";
import { useDropzone } from "react-dropzone";
import { useCertificationsStore } from "~/hooks/use-certifications-store";

interface Session {
  teacher_id: string;
  course_type: "day course" | "night course";
  start_date: Date | undefined;
  end_date: Date | undefined;
  capacity: number;
}

export function AddFormationForm() {
  const [open, setOpen] = useState(false);
  const { createFormation } = useFormationsStore();
  const { categories, getCategories } = useCategoriesStore();
  const { modules, getModules } = useModulesStore();
  const { certifications, getCertifications } = useCertificationsStore();
  const { users, getUsers } = useUsersStore();
  const [prerequisites, setPrerequisites] = useState<string[]>([""]);
  const [objectives, setObjectives] = useState<string[]>([""]);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [selectedCertifications, setSelectedCertifications] = useState<
    string[]
  >([]);
  const [currentModule, setCurrentModule] = useState<string>("");
  const [currentCertification, setCurrentCertification] = useState<string>("");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const teachers = users?.filter((user) => user.role === "teacher") || [];

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];

      // Vérification de la taille (max 2MB = 2048KB selon la validation Laravel)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Erreur", {
          description: "L'image ne doit pas dépasser 2MB",
        });
        return;
      }

      setImageFile(file);

      // Create preview
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
    maxSize: 2 * 1024 * 1024, // 2MB (2048KB) selon la validation Laravel
  });

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  useEffect(() => {
    if (open) {
      getCategories();
      getModules();
      getCertifications();
      getUsers();
    }
  }, [open, getCategories, getModules, getUsers, getCertifications]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setPrerequisites([""]);
      setObjectives([""]);
      setSelectedModules([]);
      setSelectedCertifications([]);
      setSessions([]);
      setImageFile(null);
      setImagePreview(null);
    }
    setOpen(newOpen);
  };

  const handleAddSession = () => {
    setSessions([
      ...sessions,
      {
        teacher_id: "",
        course_type: "day course",
        start_date: undefined,
        end_date: undefined,
        capacity: 1,
      },
    ]);
  };

  const handleRemoveSession = (index: number) => {
    setSessions(sessions.filter((_, i) => i !== index));
  };

  const handleSessionChange = (
    index: number,
    field: keyof Session,
    value: any
  ) => {
    const newSessions = [...sessions];
    newSessions[index] = {
      ...newSessions[index],
      [field]: value,
    };
    setSessions(newSessions);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    // Validation côté client
    const validSessions = sessions.every((session) => {
      if (!session.start_date || !session.end_date) {
        toast.error("Erreur", {
          description: "Veuillez remplir toutes les dates des sessions",
        });
        return false;
      }
      if (session.end_date <= session.start_date) {
        toast.error("Erreur", {
          description: "La date de fin doit être après la date de début",
        });
        return false;
      }

      // Vérification que la date de début est aujourd'hui ou après
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (session.start_date < today) {
        toast.error("Erreur", {
          description:
            "La date de début doit être aujourd'hui ou une date future",
        });
        return false;
      }

      return true;
    });

    if (!validSessions) return;

    // Créer un objet FormData pour l'envoi multipart/form-data (pour le fichier)
    const formData = new FormData();

    // Ajouter les champs de base
    formData.append(
      "name",
      (form.elements.namedItem("name") as HTMLInputElement).value
    );
    formData.append(
      "description",
      (form.elements.namedItem("description") as HTMLTextAreaElement).value
    );
    formData.append(
      "level",
      (form.elements.namedItem("level") as HTMLSelectElement).value
    );
    formData.append(
      "duration",
      (form.elements.namedItem("duration") as HTMLInputElement).value
    );
    formData.append(
      "price",
      (form.elements.namedItem("price") as HTMLInputElement).value
    );
    formData.append(
      "discount_price",
      (form.elements.namedItem("discount_price") as HTMLInputElement).value
    );
    formData.append(
      "category_id",
      (form.elements.namedItem("category") as HTMLSelectElement).value
    );

    // Ajouter l'image si elle existe
    if (imageFile) {
      formData.append("image", imageFile);
    }

    // Ajouter les prérequis et objectifs (tableau)
    prerequisites.forEach((prereq, index) => {
      if (prereq.trim() !== "") {
        formData.append(`prerequisites[${index}]`, prereq);
      }
    });

    objectives.forEach((obj, index) => {
      if (obj.trim() !== "") {
        formData.append(`objectives[${index}]`, obj);
      }
    });

    // Ajouter les modules sélectionnés
    if (selectedModules.length > 0) {
      selectedModules.forEach((moduleId, index) => {
        formData.append(`module_ids[${index}]`, moduleId);
      });
    }

    // Ajouter les certifications sélectionnées
    if (selectedCertifications.length > 0) {
      selectedCertifications.forEach((certificationId, index) => {
        formData.append(`certification_ids[${index}]`, certificationId);
      });
    }

    // Ajouter les sessions
    sessions.forEach((session, index) => {
      formData.append(`sessions[${index}][teacher_id]`, session.teacher_id);
      formData.append(`sessions[${index}][course_type]`, session.course_type);
      formData.append(
        `sessions[${index}][start_date]`,
        format(session.start_date!, "yyyy-MM-dd")
      );
      formData.append(
        `sessions[${index}][end_date]`,
        format(session.end_date!, "yyyy-MM-dd")
      );
      formData.append(
        `sessions[${index}][capacity]`,
        session.capacity.toString()
      );
    });

    try {
      const message = await createFormation(formData);
      form.reset();
      setOpen(false);
      setPrerequisites([""]);
      setObjectives([""]);
      setSelectedModules([]);
      setSelectedCertifications([]);
      setSessions([]);
      setImageFile(null);
      setImagePreview(null);

      toast.success("Succès", {
        description: message || "Formation créée avec succès",
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

  const handleAddPrerequisite = () => {
    setPrerequisites([...prerequisites, ""]);
  };

  const handleAddObjective = () => {
    setObjectives([...objectives, ""]);
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
          <DialogHeader className="mb-6 w-full">
            <DialogTitle className="text-xl font-semibold">
              Ajouter une nouvelle formation
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations ci-dessous pour créer une nouvelle
              formation.
            </DialogDescription>
          </DialogHeader>

          <div className="w-full space-y-6 py-4">
            <div className="w-full grid grid-cols-2 gap-4">
              <div className="space-y-2 w-full">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Développement Web Frontend"
                  required
                  maxLength={255}
                  className="w-full"
                />
              </div>

              <div className="space-y-2 w-full">
                <Label htmlFor="category">Catégorie</Label>
                <Select name="category" required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 w-full">
                <Label htmlFor="level">Niveau</Label>
                <Select name="level" required>
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

              <div className="space-y-2 w-full">
                <Label htmlFor="duration">Durée (heures)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  min="1"
                  placeholder="100"
                  required
                  className="w-full"
                />
              </div>
            </div>

            {/* Image upload using react-dropzone */}
            <div className="space-y-2 w-full">
              <Label htmlFor="image">Image de la formation</Label>
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
                  <input
                    {...getInputProps()}
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        onDrop(Array.from(files));
                      }
                    }}
                  />
                  <ImageIcon size={32} className="text-muted-foreground mb-2" />
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

            <div className="space-y-2 w-full">
              <Label htmlFor="discount_price">Prix Promotionnel (DT)</Label>
              <Input
                id="discount_price"
                name="discount_price"
                type="number"
                defaultValue={0}
                min="0"
                placeholder="99.99"
                className="w-full"
              />
            </div>

            <div className="space-y-2 w-full">
              <Label htmlFor="price">Prix (DT)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                placeholder="99.99"
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2 w-full">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Description détaillée de la formation..."
                className="min-h-[100px] w-full"
                required
                maxLength={1000}
              />
            </div>

            <div className="space-y-2 w-full">
              <Label>Prérequis</Label>
              {prerequisites.map((prerequisite, index) => (
                <div key={index} className="flex gap-2 mt-2 w-full">
                  <Input
                    value={prerequisite}
                    onChange={(e) => {
                      const newPrerequisites = [...prerequisites];
                      newPrerequisites[index] = e.target.value;
                      setPrerequisites(newPrerequisites);
                    }}
                    placeholder="Prérequis..."
                    className="w-full"
                  />
                  {index === prerequisites.length - 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddPrerequisite}
                    >
                      +
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-2 w-full">
              <Label>Objectifs</Label>
              {objectives.map((objective, index) => (
                <div key={index} className="flex gap-2 mt-2 w-full">
                  <Input
                    value={objective}
                    onChange={(e) => {
                      const newObjectives = [...objectives];
                      newObjectives[index] = e.target.value;
                      setObjectives(newObjectives);
                    }}
                    placeholder="Objectif..."
                    className="w-full"
                  />
                  {index === objectives.length - 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddObjective}
                    >
                      +
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="w-full space-y-2">
              <Label>Modules</Label>
              <div className="space-y-4">
                <Select
                  value={currentModule}
                  onValueChange={(value) => {
                    if (!selectedModules.includes(value)) {
                      setSelectedModules([...selectedModules, value]);
                    }
                    setCurrentModule("");
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner un module" />
                  </SelectTrigger>
                  <SelectContent>
                    {modules?.map((module) => (
                      <SelectItem key={module.id} value={module.id}>
                        {module.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="space-y-2">
                  {selectedModules.map((moduleId, index) => (
                    <div
                      key={moduleId}
                      className="flex items-center justify-between bg-secondary p-2 rounded-md"
                    >
                      <span>
                        {modules?.find((m) => m.id === moduleId)?.name}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedModules(
                            selectedModules.filter((id) => id !== moduleId)
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

            <div className="w-full space-y-2">
              <Label>Certifications</Label>
              <div className="space-y-4">
                <Select
                  value={currentCertification}
                  onValueChange={(value) => {
                    if (!selectedCertifications.includes(value)) {
                      setSelectedCertifications([
                        ...selectedCertifications,
                        value,
                      ]);
                    }
                    setCurrentCertification("");
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner une certification" />
                  </SelectTrigger>
                  <SelectContent>
                    {certifications?.map((certification) => (
                      <SelectItem
                        key={certification.id}
                        value={certification.id}
                      >
                        {certification.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="space-y-2">
                  {selectedCertifications.map((certificationId, index) => (
                    <div
                      key={certificationId}
                      className="flex items-center justify-between bg-secondary p-2 rounded-md"
                    >
                      <span>
                        {
                          certifications?.find((c) => c.id === certificationId)
                            ?.name
                        }
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedCertifications(
                            selectedCertifications.filter(
                              (id) => id !== certificationId
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

            <div className="w-full space-y-4">
              <div className="flex items-center justify-between">
                <Label>Sessions</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddSession}
                >
                  <PlusIcon size={16} className="mr-2" />
                  Ajouter une session
                </Button>
              </div>

              {sessions.map((session, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 space-y-4 relative"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => handleRemoveSession(index)}
                  >
                    <TrashIcon size={16} />
                  </Button>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Enseignant</Label>
                      <Select
                        value={session.teacher_id}
                        onValueChange={(value) =>
                          handleSessionChange(index, "teacher_id", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un enseignant" />
                        </SelectTrigger>
                        <SelectContent>
                          {teachers.map((teacher) => (
                            <SelectItem key={teacher.id} value={teacher.id}>
                              {teacher.fullName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Type de cours</Label>
                      <Select
                        value={session.course_type}
                        onValueChange={(value) =>
                          handleSessionChange(
                            index,
                            "course_type",
                            value as "day course" | "night course"
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="day course">Jour</SelectItem>
                          <SelectItem value="night course">Soir</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date de début</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !session.start_date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {session.start_date ? (
                              format(session.start_date, "PPP", { locale: fr })
                            ) : (
                              <span>Choisir une date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={session.start_date}
                            onSelect={(date) =>
                              handleSessionChange(index, "start_date", date)
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>Date de fin</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !session.end_date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {session.end_date ? (
                              format(session.end_date, "PPP", { locale: fr })
                            ) : (
                              <span>Choisir une date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={session.end_date}
                            onSelect={(date) =>
                              handleSessionChange(index, "end_date", date)
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Capacité</Label>
                    <Input
                      type="number"
                      min="1"
                      value={session.capacity}
                      onChange={(e) =>
                        handleSessionChange(
                          index,
                          "capacity",
                          parseInt(e.target.value)
                        )
                      }
                      placeholder="Nombre maximum d'étudiants"
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
