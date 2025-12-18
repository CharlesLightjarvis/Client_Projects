import React from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { api } from "~/api";
import type { FormationSchema } from "~/types/formation";
import { useUsersStore } from "~/hooks/use-users-store";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { SearchIcon, UserPlusIcon, UserXIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ConfirmDialog } from "~/components/ui/confirm-dialog";

interface AddStudentsFormationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formation: FormationSchema;
}

export function AddStudentsFormationsDialog({
  open,
  onOpenChange,
  formation,
}: AddStudentsFormationsDialogProps) {
  const { getStudents } = useUsersStore();
  const [enrolledStudents, setEnrolledStudents] = React.useState<any[]>([]);
  const [availableStudents, setAvailableStudents] = React.useState<any[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [openAddStudent, setOpenAddStudent] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [confirmEnrollStudent, setConfirmEnrollStudent] = React.useState<{
    id: string;
    name: string;
  } | null>(null);
  const [confirmUnenrollStudent, setConfirmUnenrollStudent] = React.useState<{
    id: string;
    name: string;
  } | null>(null);

  React.useEffect(() => {
    if (open) {
      loadEnrolledStudents();
      loadAvailableStudents();
    }
  }, [open]);

  // Charger les étudiants déjà inscrits à la formation
  const loadEnrolledStudents = async () => {
    try {
      const response = await api.get(
        `/api/v1/admin/formations/${formation.id}/students`
      );
      setEnrolledStudents(response.data.students);
      console.log(response.data);
    } catch (error) {
      console.error("Failed to load enrolled students:", error);
      toast.error("Erreur", {
        description: "Impossible de charger la liste des étudiants inscrits",
      });
    }
  };

  // Charger les étudiants disponibles pour inscription
  const loadAvailableStudents = async () => {
    try {
      const allStudents = await getStudents();
      const availableStudents = allStudents.filter(
        (student) =>
          student.role === "student" &&
          !enrolledStudents.some((enrolled) => enrolled.id === student.id)
      );
      setAvailableStudents(availableStudents);
    } catch (error) {
      console.error("Failed to load available students:", error);
      toast.error("Erreur", {
        description: "Impossible de charger la liste des étudiants disponibles",
      });
    }
  };

  const handleEnrollStudent = async (studentId: string) => {
    setIsLoading(true);
    console.log("Starting enrollment process for student:", studentId);
    console.log("Formation ID:", formation.id);

    try {
      console.log("Sending enrollment request with data:", {
        student_id: studentId,
        formation_id: formation.id,
      });

      const response = await api.post(
        `/api/v1/admin/formations/${formation.id}/enroll`,
        {
          student_id: studentId,
        }
      );

      console.log("Enrollment API response:", response.data);

      await loadEnrolledStudents();
      await loadAvailableStudents();

      toast.success("Succès", {
        description: response.data.message || "Étudiant inscrit avec succès",
      });
      setConfirmEnrollStudent(null);
      setOpenAddStudent(false);
    } catch (error: any) {
      console.error("Enrollment error:", error);
      console.error("Error response:", error.response?.data);

      toast.error("Erreur", {
        description:
          error.response?.data?.message ||
          "Erreur lors de l'inscription de l'étudiant",
      });
    } finally {
      console.log("Enrollment process completed");
      setIsLoading(false);
    }
  };

  const handleUnenrollStudent = async (studentId: string) => {
    setIsLoading(true);
    try {
      const response = await api.delete(
        `/api/v1/admin/formations/${formation.id}/unenroll/${studentId}`
      );
      await loadEnrolledStudents();
      await loadAvailableStudents();
      toast.success("Succès", {
        description: response.data.message || "Étudiant désinscrit avec succès",
      });
      setConfirmUnenrollStudent(null);
    } catch (error: any) {
      toast.error("Erreur", {
        description:
          error.response?.data?.message ||
          "Erreur lors de la désinscription de l'étudiant",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEnrolledStudents = enrolledStudents.filter((student) =>
    student.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="min-w-3xl">
          <DialogHeader>
            <DialogTitle>Étudiants de la formation</DialogTitle>
          </DialogHeader>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 flex-1">
              <SearchIcon className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un étudiant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <Popover open={openAddStudent} onOpenChange={setOpenAddStudent}>
              <PopoverTrigger asChild>
                <Button>
                  <UserPlusIcon className="w-4 h-4 mr-2" />
                  Ajouter un étudiant
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <Command>
                  <CommandInput placeholder="Rechercher un étudiant..." />
                  <CommandEmpty>Aucun étudiant trouvé.</CommandEmpty>
                  <CommandGroup>
                    {availableStudents.map((student) => (
                      <CommandItem
                        key={student.id}
                        onSelect={() =>
                          setConfirmEnrollStudent({
                            id: student.id,
                            name: student.fullName,
                          })
                        }
                      >
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={student.imageUrl || ""} />
                          <AvatarFallback>
                            {student.fullName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {student.fullName}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="relative overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Étudiant</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date d'inscription</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEnrolledStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={student.imageUrl || ""} />
                        <AvatarFallback>
                          {student.fullName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {student.fullName}
                    </TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>
                      {new Date(student.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setConfirmUnenrollStudent({
                            id: student.id,
                            name: student.fullName,
                          })
                        }
                      >
                        <UserXIcon className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!confirmEnrollStudent}
        onOpenChange={(open) => !open && setConfirmEnrollStudent(null)}
        onConfirm={() =>
          confirmEnrollStudent && handleEnrollStudent(confirmEnrollStudent.id)
        }
        title="Confirmer l'inscription"
        description={`Êtes-vous sûr de vouloir inscrire ${confirmEnrollStudent?.name} à cette formation ?`}
      />

      <ConfirmDialog
        open={!!confirmUnenrollStudent}
        onOpenChange={(open) => !open && setConfirmUnenrollStudent(null)}
        onConfirm={() =>
          confirmUnenrollStudent &&
          handleUnenrollStudent(confirmUnenrollStudent.id)
        }
        title="Confirmer la désinscription"
        description={`Êtes-vous sûr de vouloir désinscrire ${confirmUnenrollStudent?.name} de cette formation ?`}
      />
    </>
  );
}
