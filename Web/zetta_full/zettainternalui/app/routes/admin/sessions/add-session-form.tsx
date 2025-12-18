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
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { CalendarIcon, PlusIcon } from "lucide-react";
import { useSessionsStore } from "~/hooks/use-sessions-store";
import { useFormationsStore } from "~/hooks/use-formations-store";
import { useUsersStore } from "~/hooks/use-users-store";
import { cn } from "~/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export function AddSessionForm() {
  const [open, setOpen] = useState(false);
  const { createSession } = useSessionsStore();
  const { formations, getFormations } = useFormationsStore();
  const { users, getUsers } = useUsersStore();
  const [selectedFormation, setSelectedFormation] = useState<string>("");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    getFormations();
    getUsers();
  }, [getFormations, getUsers]);

  const teachers = users?.filter((user) => user.role === "teacher") || [];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      toast.error("Erreur", {
        description: "Veuillez sélectionner les dates de début et de fin",
      });
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);

    const sessionData = {
      formation_id: formData.get("formation") as string,
      teacher_id: formData.get("teacher") as string,
      course_type: formData.get("course_type") as "day course" | "night course",
      start_date: format(startDate, "yyyy-MM-dd"),
      end_date: format(endDate, "yyyy-MM-dd"),
      capacity: Number(formData.get("capacity")),
    };

    try {
      const message = await createSession(sessionData);
      form.reset();
      setStartDate(undefined);
      setEndDate(undefined);
      setOpen(false);

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
              Ajouter une nouvelle session
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations ci-dessous pour créer une nouvelle
              session.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div className="w-full space-y-2">
              <Label htmlFor="formation">Formation</Label>
              <Select
                name="formation"
                required
                onValueChange={setSelectedFormation}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez une formation" />
                </SelectTrigger>
                <SelectContent>
                  {formations?.map((formation) => (
                    <SelectItem key={formation.id} value={formation.id}>
                      {formation.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full space-y-2">
              <Label htmlFor="teacher">Enseignant</Label>
              <Select
                name="teacher"
                required
                onValueChange={setSelectedTeacher}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez un enseignant" />
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

            <div className="w-full space-y-2">
              <Label htmlFor="course_type">Type de cours</Label>
              <Select name="course_type" required defaultValue="day course">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez le type de cours" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day course">Jour</SelectItem>
                  <SelectItem value="night course">Soir</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div className="w-full space-y-2">
                <Label htmlFor="start_date">Date de début</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? (
                        format(startDate, "PPP", { locale: fr })
                      ) : (
                        <span>Choisir une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <input
                  type="hidden"
                  name="start_date"
                  value={startDate ? format(startDate, "yyyy-MM-dd") : ""}
                />
              </div>

              <div className="w-full space-y-2">
                <Label htmlFor="end_date">Date de fin</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? (
                        format(endDate, "PPP", { locale: fr })
                      ) : (
                        <span>Choisir une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <input
                  type="hidden"
                  name="end_date"
                  value={endDate ? format(endDate, "yyyy-MM-dd") : ""}
                />
              </div>
            </div>

            <div className="w-full space-y-2">
              <Label htmlFor="capacity">Capacité</Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                min="1"
                required
                placeholder="Nombre maximum d'étudiants"
                className="w-full"
              />
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
