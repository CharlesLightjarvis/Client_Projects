import * as React from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useUsersStore } from "~/hooks/use-users-store";
import { SearchIcon, UserPlusIcon, UserXIcon } from "lucide-react";
import type { Session } from "~/types/session";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { useSessionsStore } from "~/hooks/use-sessions-store";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={onConfirm}>Confirmer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface SessionStudentsDialogProps {
  session: Session;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SessionStudentsDialog({
  session,
  open,
  onOpenChange,
}: SessionStudentsDialogProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [openAddStudent, setOpenAddStudent] = React.useState(false);
  const [confirmEnrollStudent, setConfirmEnrollStudent] = React.useState<{
    id: string;
    name: string;
  } | null>(null);
  const [confirmUnenrollStudent, setConfirmUnenrollStudent] = React.useState<{
    id: string;
    name: string;
  } | null>(null);
  const { users, getUsers } = useUsersStore();
  const { enrollStudent, unenrollStudent, getSessionStudents } =
    useSessionsStore();
  const [students, setStudents] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (open) {
      getUsers();
      loadStudents();
    }
  }, [open]);

  const loadStudents = async () => {
    const sessionStudents = await getSessionStudents(session.id);
    setStudents(sessionStudents);
  };

  const handleEnrollStudent = async (userId: string) => {
    try {
      const response = await enrollStudent(session.id, userId);
      await loadStudents();
      setOpenAddStudent(false);
      setConfirmEnrollStudent(null);

      // Utilisation du message de l'API
      toast.success("Succès", {
        description: response.message,
      });
    } catch (error: any) {
      toast.error("Erreur", {
        description:
          error.response?.data?.message ||
          "Erreur lors de l'inscription de l'étudiant",
      });
    }
  };

  const handleUnenrollStudent = async (userId: string) => {
    try {
      const response = await unenrollStudent(session.id, userId);
      await loadStudents();
      setConfirmUnenrollStudent(null);

      // Utilisation du message de l'API
      toast.success("Succès", {
        description: response.message,
      });
    } catch (error: any) {
      toast.error("Erreur", {
        description:
          error.response?.data?.message ||
          "Erreur lors de la désinscription de l'étudiant",
      });
    }
  };

  const filteredStudents = students.filter((student) =>
    student.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableStudents = users.filter(
    (user) =>
      user.role === "student" &&
      !students.some((student) => student.id === user.id)
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="min-w-3xl">
          <DialogHeader>
            <DialogTitle>Étudiants de la session</DialogTitle>
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
                {filteredStudents.map((student) => (
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

      {/* Dialogue de confirmation pour l'inscription */}
      <ConfirmDialog
        open={!!confirmEnrollStudent}
        onOpenChange={(open) => !open && setConfirmEnrollStudent(null)}
        onConfirm={() =>
          confirmEnrollStudent && handleEnrollStudent(confirmEnrollStudent.id)
        }
        title="Confirmer l'inscription"
        description={`Êtes-vous sûr de vouloir inscrire ${confirmEnrollStudent?.name} à cette session ?`}
      />

      {/* Dialogue de confirmation pour la désinscription */}
      <ConfirmDialog
        open={!!confirmUnenrollStudent}
        onOpenChange={(open) => !open && setConfirmUnenrollStudent(null)}
        onConfirm={() =>
          confirmUnenrollStudent &&
          handleUnenrollStudent(confirmUnenrollStudent.id)
        }
        title="Confirmer la désinscription"
        description={`Êtes-vous sûr de vouloir désinscrire ${confirmUnenrollStudent?.name} de cette session ?`}
      />
    </>
  );
}
