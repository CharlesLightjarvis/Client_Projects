import { useEffect, useState } from "react";
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
import { CalendarIcon } from "lucide-react";
import { useSessionsStore } from "~/hooks/use-sessions-store";
import { useFormationsStore } from "~/hooks/use-formations-store";
import { useUsersStore } from "~/hooks/use-users-store";
import { cn } from "~/lib/utils";
import { format, parse } from "date-fns";
import { fr } from "date-fns/locale";

interface EditSessionFormProps {
  sessionId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditSessionForm({
  sessionId,
  open,
  onOpenChange,
}: EditSessionFormProps) {
  const { updateSession, setSelectedSession, selectedSession } =
    useSessionsStore();
  const { formations, getFormations } = useFormationsStore();
  const { users, getUsers } = useUsersStore();
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState<"active" | "cancelled" | "completed">(
    "active"
  );

  useEffect(() => {
    getFormations();
    getUsers();
  }, [getFormations, getUsers]);

  const teachers = users?.filter((user) => user.role === "teacher") || [];

  useEffect(() => {
    if (open && sessionId) {
      const session = useSessionsStore
        .getState()
        .sessions.find((s) => s.id === sessionId);
      if (session) {
        setSelectedSession(session);

        // Ajoutez cette ligne pour définir le statut initial
        if (session.status) {
          setStatus(session.status as "active" | "cancelled" | "completed");
        }

        // Convertir les chaînes de date en objets Date
        if (session.start_date) {
          setStartDate(parse(session.start_date, "yyyy-MM-dd", new Date()));
        }
        if (session.end_date) {
          setEndDate(parse(session.end_date, "yyyy-MM-dd", new Date()));
        }
      }
    } else {
      setSelectedSession(null);
      setStartDate(undefined);
      setEndDate(undefined);
    }
  }, [open, sessionId, setSelectedSession]);

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
      status: status, // Ajoutez cette ligne
    };

    try {
      const message = await updateSession(sessionId, sessionData);
      setSelectedSession(null);
      onOpenChange(false);

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <form className="w-full" onSubmit={handleSubmit}>
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl font-semibold">
              Modifier la session
            </DialogTitle>
            <DialogDescription>
              Modifiez les informations de la session ci-dessous.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div className="w-full space-y-2">
              <Label>Formation</Label>
              <Select
                name="formation"
                required
                defaultValue={selectedSession?.formation.id}
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
              <Label>Enseignant</Label>
              <Select
                name="teacher"
                required
                defaultValue={selectedSession?.teacher.id}
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
              <Label>Type de cours</Label>
              <Select
                name="course_type"
                required
                defaultValue={selectedSession?.course_type}
              >
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
                defaultValue={selectedSession?.capacity}
                className="w-full"
              />
            </div>
          </div>

          {/* Ajoutez ce bloc après le champ "Type de cours" */}
          <div className="w-full space-y-2">
            <Label>Statut</Label>
            <Select
              value={status}
              onValueChange={(value) =>
                setStatus(value as "active" | "cancelled" | "completed")
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionnez le statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                    Actif
                  </div>
                </SelectItem>
                <SelectItem value="cancelled">
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                    Annulé
                  </div>
                </SelectItem>
                <SelectItem value="completed">
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                    Terminé
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
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
