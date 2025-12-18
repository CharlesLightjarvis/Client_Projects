"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { api } from "~/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Calendar } from "~/components/ui/calendar";
import {
  CalendarIcon,
  CheckIcon,
  XIcon,
  TrashIcon,
  FilterIcon,
  SearchIcon,
  RefreshCw,
  Clock,
  AlertCircle,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { Skeleton } from "~/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

// Types
export interface User {
  id: string;
  fullName: string;
  email: string;
  status: string;
  imageUrl?: string;
  phone?: string;
  role: string;
}

export interface Formation {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  level?: string;
  duration?: string;
  price?: number;
}

export interface FormationSession {
  id: string;
  formation_id: string;
  teacher_id: string;
  course_type: string;
  start_date: string;
  end_date: string;
  capacity: number;
  status: string;
  enrolled_students: number;
  price?: number;
  formation?: Formation;
  name?: string;
}

export interface Attendance {
  id: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  notes?: string;
  student: User;
  session: FormationSession;
  created_at: string;
  updated_at: string;
}

export interface AttendanceRecord {
  student_id: string;
  status: "present" | "absent" | "late" | "excused";
  notes?: string;
}

export interface AttendanceSubmission {
  session_id: string;
  date: string;
  attendances: AttendanceRecord[];
}

export interface AttendanceFilter {
  session_id?: string;
  formation_id?: string;
  student_id?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
}

// Composants auxiliaires
const StudentAvatar = ({ student }: { student: User }) => (
  <div className="flex items-center gap-2">
    {student.imageUrl ? (
      <img
        src={student.imageUrl || "/placeholder.svg"}
        alt={student.fullName}
        className="h-8 w-8 rounded-full object-cover"
      />
    ) : (
      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
        <span className="text-xs font-medium text-gray-600">
          {student.fullName.charAt(0)}
        </span>
      </div>
    )}
    <div>
      <p className="font-medium">{student.fullName}</p>
      <p className="text-xs text-gray-500">{student.email}</p>
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800";
      case "absent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "present":
        return "Présent";
      case "absent":
        return "Absent";

      default:
        return "Inconnu";
    }
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
        status
      )}`}
    >
      {getStatusLabel(status)}
    </span>
  );
};

const DateSelector = ({
  date,
  onDateChange,
  disabled = false,
}: {
  date: Date;
  onDateChange: (date: Date) => void;
  disabled?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "d MMMM yyyy", { locale: fr })
          ) : (
            <span>Sélectionner une date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => {
            onDateChange(date || new Date());
            setIsOpen(false);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

const EmptyState = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="text-center py-12 border rounded-md bg-gray-50">
    <div className="flex flex-col items-center">
      <div className="rounded-full bg-gray-100 p-3 mb-4">
        <CalendarIcon className="h-6 w-6 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="text-gray-500 mt-1">{description}</p>
    </div>
  </div>
);

// Composant principal
export default function AttendancePage() {
  // États
  const [teacherAttendances, setTeacherAttendances] = useState<Attendance[]>(
    []
  );
  const [sessions, setSessions] = useState<FormationSession[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("my-records");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filter, setFilter] = useState<AttendanceFilter>({});
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState<boolean>(false);

  // États pour la prise de présence
  const [isAttendanceDialogOpen, setIsAttendanceDialogOpen] =
    useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [currentAttendance, setCurrentAttendance] = useState<Attendance | null>(
    null
  );
  const [selectedSession, setSelectedSession] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [studentAttendances, setStudentAttendances] = useState<
    Record<string, AttendanceRecord>
  >({});
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState<boolean>(false);
  const [currentNote, setCurrentNote] = useState<{
    studentId: string;
    note: string;
  }>({
    studentId: "",
    note: "",
  });

  // Effets
  useEffect(() => {
    if (activeTab === "my-records") {
      fetchTeacherAttendances();
    }
  }, [activeTab, filter]);

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    if (selectedSession && selectedDate && activeTab === "record") {
      fetchSessionAttendances();
    }
  }, [selectedSession, selectedDate, activeTab]);

  // Fonctions de récupération des données
  const fetchTeacherAttendances = async () => {
    try {
      setIsLoading(true);

      // Construire les paramètres de requête à partir des filtres
      const params = new URLSearchParams();
      if (filter.session_id) params.append("session_id", filter.session_id);
      if (filter.formation_id)
        params.append("formation_id", filter.formation_id);
      if (filter.student_id) params.append("student_id", filter.student_id);
      if (filter.status) params.append("status", filter.status);
      if (filter.date_from) params.append("date_from", filter.date_from);
      if (filter.date_to) params.append("date_to", filter.date_to);

      const response = await api.get(
        `/api/v1/teacher/attendance/my-records?${params.toString()}`
      );
      setTeacherAttendances(response.data.attendances);
    } catch (error) {
      toast.error("Erreur lors du chargement des présences");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSessions = async () => {
    try {
      const response = await api.get("/api/v1/teacher/sessions");
      setSessions(response.data.sessions);
    } catch (error) {
      toast.error("Erreur lors du chargement des sessions");
    }
  };

  const fetchSessionAttendances = async () => {
    try {
      setIsLoading(true);

      // Récupérer les présences existantes
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const attendancesResponse = await api.get(
        `/api/v1/teacher/attendance/sessions/${selectedSession}?date=${formattedDate}`
      );

      // Récupérer tous les étudiants inscrits à cette session
      const studentsResponse = await api.get(
        `/api/v1/admin/sessions/${selectedSession}/students`
      );
      setStudents(studentsResponse.data.students);

      // Préparer les données pour l'affichage
      const attendanceMap: Record<string, AttendanceRecord> = {};

      // Initialiser tous les étudiants comme présents par défaut
      studentsResponse.data.students.forEach((student: User) => {
        attendanceMap[student.id] = {
          student_id: student.id,
          status: "present",
          notes: "",
        };
      });

      // Mettre à jour avec les présences existantes
      attendancesResponse.data.attendances.forEach((attendance: Attendance) => {
        attendanceMap[attendance.student.id] = {
          student_id: attendance.student.id,
          status: attendance.status,
          notes: attendance.notes || "",
        };
      });

      setStudentAttendances(attendanceMap);
    } catch (error) {
      toast.error("Erreur lors du chargement des présences");
    } finally {
      setIsLoading(false);
    }
  };

  // Fonctions de gestion des présences
  const updateStudentStatus = (
    studentId: string,
    status: "present" | "absent" | "late" | "excused"
  ) => {
    setStudentAttendances((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const openNoteDialog = (studentId: string) => {
    setCurrentNote({
      studentId,
      note: studentAttendances[studentId]?.notes || "",
    });
    setIsNoteDialogOpen(true);
  };

  const saveNote = () => {
    setStudentAttendances((prev) => ({
      ...prev,
      [currentNote.studentId]: {
        ...prev[currentNote.studentId],
        notes: currentNote.note,
      },
    }));
    setIsNoteDialogOpen(false);
  };

  const submitAttendances = async () => {
    try {
      setIsSubmitting(true);

      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const attendanceRecords = Object.values(studentAttendances);

      const submission: AttendanceSubmission = {
        session_id: selectedSession,
        date: formattedDate,
        attendances: attendanceRecords,
      };

      await api.post("/api/v1/teacher/attendance/record", submission);

      toast.success("Présences enregistrées avec succès");
      fetchTeacherAttendances();
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement des présences");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteDialog = (attendance: Attendance) => {
    setCurrentAttendance(attendance);
    setIsDeleteDialogOpen(true);
  };

  const deleteAttendance = async () => {
    if (!currentAttendance) return;

    try {
      setIsSubmitting(true);
      await api.delete(`/api/v1/teacher/attendance/${currentAttendance.id}`);
      toast.success("Présence supprimée avec succès");
      fetchTeacherAttendances();
    } catch (error) {
      toast.error("Erreur lors de la suppression de la présence");
    } finally {
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  // Fonctions de filtrage
  const applyFilters = () => {
    fetchTeacherAttendances();
    setIsFilterDialogOpen(false);
  };

  const resetFilters = () => {
    setFilter({});
    fetchTeacherAttendances();
  };

  const filteredAttendances = teacherAttendances.filter((attendance) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      attendance.student.fullName.toLowerCase().includes(query) ||
      attendance.session.formation?.name?.toLowerCase().includes(query) ||
      format(new Date(attendance.date), "dd/MM/yyyy").includes(query)
    );
  });

  // Rendu des composants
  const renderAttendanceTable = () => {
    if (isLoading) {
      return (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      );
    }

    if (filteredAttendances.length === 0) {
      return (
        <EmptyState
          title="Aucune présence trouvée"
          description={
            Object.keys(filter).length > 0
              ? "Essayez de modifier vos filtres ou d'ajouter de nouvelles présences."
              : "Commencez par enregistrer des présences dans l'onglet 'Prendre les présences'."
          }
        />
      );
    }

    return (
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Date</TableHead>
              <TableHead>Étudiant</TableHead>
              <TableHead>Formation</TableHead>
              <TableHead className="hidden md:table-cell">Session</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="hidden md:table-cell">Note</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAttendances.map((attendance) => (
              <TableRow key={attendance.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  {format(new Date(attendance.date), "dd/MM/yyyy")}
                </TableCell>
                <TableCell>
                  <StudentAvatar student={attendance.student} />
                </TableCell>
                <TableCell>
                  {attendance.session.formation?.name || "N/A"}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {format(
                    new Date(attendance.session.start_date),
                    "dd/MM/yyyy"
                  )}
                </TableCell>
                <TableCell>
                  <StatusBadge status={attendance.status} />
                </TableCell>
                <TableCell className="hidden md:table-cell max-w-[200px]">
                  {attendance.notes ? (
                    <p
                      className="text-sm text-gray-600 truncate"
                      title={attendance.notes}
                    >
                      {attendance.notes}
                    </p>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteDialog(attendance)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  const renderRecordAttendanceForm = () => {
    if (isLoading) {
      return (
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      );
    }

    if (!selectedSession || students.length === 0) {
      return (
        <EmptyState
          title="Aucun étudiant trouvé"
          description={
            selectedSession
              ? "Aucun étudiant inscrit à cette session ou aucune présence enregistrée."
              : "Veuillez sélectionner une session et une date pour voir les présences."
          }
        />
      );
    }

    return (
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Étudiant</TableHead>
              <TableHead className="w-[300px]">Statut</TableHead>
              <TableHead className="w-[120px] text-center">Note</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">
                  <StudentAvatar student={student} />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "flex-1",
                        studentAttendances[student.id]?.status === "present" &&
                          "bg-green-100 border-green-200"
                      )}
                      onClick={() => updateStudentStatus(student.id, "present")}
                    >
                      <CheckIcon
                        className={cn(
                          "h-4 w-4 mr-1",
                          studentAttendances[student.id]?.status === "present"
                            ? "text-green-600"
                            : "text-gray-400"
                        )}
                      />
                      Présent
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "flex-1",
                        studentAttendances[student.id]?.status === "absent" &&
                          "bg-red-100 border-red-200"
                      )}
                      onClick={() => updateStudentStatus(student.id, "absent")}
                    >
                      <XIcon
                        className={cn(
                          "h-4 w-4 mr-1",
                          studentAttendances[student.id]?.status === "absent"
                            ? "text-red-600"
                            : "text-gray-400"
                        )}
                      />
                      Absent
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openNoteDialog(student.id)}
                  >
                    {studentAttendances[student.id]?.notes
                      ? "Voir note"
                      : "Ajouter note"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="p-4 bg-gray-50 flex justify-end">
          <Button onClick={submitAttendances} disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement..." : "Enregistrer les présences"}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des présences</CardTitle>
          <CardDescription>
            Consultez et gérez les présences de vos étudiants
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="my-records">Mes enregistrements</TabsTrigger>
              <TabsTrigger value="record">Prendre les présences</TabsTrigger>
            </TabsList>

            {/* Onglet "Mes enregistrements" */}
            <TabsContent value="my-records" className="space-y-4">
              {/* Barre d'outils avec recherche et filtres */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="relative w-full sm:w-auto flex-1 max-w-sm">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher un étudiant, une formation..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4"
                  />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFilterDialogOpen(true)}
                    className="flex-1 sm:flex-none"
                  >
                    <FilterIcon className="h-4 w-4 mr-2" />
                    Filtrer
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetFilters}
                    className="flex-1 sm:flex-none"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Réinitialiser
                  </Button>
                </div>
              </div>

              {/* Tableau des présences */}
              {renderAttendanceTable()}
            </TabsContent>

            {/* Onglet "Prendre les présences" */}
            <TabsContent value="record" className="space-y-4">
              {/* Sélection de la session et de la date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="session">Session</Label>
                  <Select
                    value={selectedSession}
                    onValueChange={(value) => setSelectedSession(value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="session">
                      <SelectValue placeholder="Sélectionner une session" />
                    </SelectTrigger>
                    <SelectContent>
                      {sessions.map((session) => (
                        <SelectItem key={session.id} value={session.id}>
                          {session.formation?.name} -{" "}
                          {format(new Date(session.start_date), "d MMMM yyyy", {
                            locale: fr,
                          })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date</Label>
                  <DateSelector
                    date={selectedDate}
                    onDateChange={setSelectedDate}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Formulaire de prise de présence */}
              {renderRecordAttendanceForm()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Boîte de dialogue pour les notes */}
      <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Note pour l'absence</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="note">Note</Label>
              <Textarea
                id="note"
                value={currentNote.note}
                onChange={(e) =>
                  setCurrentNote({ ...currentNote, note: e.target.value })
                }
                placeholder="Ajouter une note concernant cette absence..."
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNoteDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button onClick={saveNote}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Boîte de dialogue pour la suppression d'une présence */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera définitivement l'enregistrement de
              présence pour {currentAttendance?.student.fullName} du{" "}
              {currentAttendance &&
                format(new Date(currentAttendance.date), "dd/MM/yyyy")}
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteAttendance}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Boîte de dialogue pour les filtres */}
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Filtrer les présences</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="filter-session">Session</Label>
              <Select
                value={filter.session_id}
                onValueChange={(value) =>
                  setFilter({ ...filter, session_id: value })
                }
              >
                <SelectTrigger id="filter-session">
                  <SelectValue placeholder="Toutes les sessions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les sessions</SelectItem>
                  {sessions.map((session) => (
                    <SelectItem key={session.id} value={session.id}>
                      {session.formation?.name} -{" "}
                      {format(new Date(session.start_date), "dd/MM/yyyy")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-status">Statut</Label>
              <Select
                value={filter.status}
                onValueChange={(value) =>
                  setFilter({ ...filter, status: value })
                }
              >
                <SelectTrigger id="filter-status">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="present">Présent</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date de début</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filter.date_from ? (
                        format(new Date(filter.date_from), "dd/MM/yyyy")
                      ) : (
                        <span>Sélectionner</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        filter.date_from
                          ? new Date(filter.date_from)
                          : undefined
                      }
                      onSelect={(date) =>
                        setFilter({
                          ...filter,
                          date_from: date
                            ? format(date, "yyyy-MM-dd")
                            : undefined,
                        })
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
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filter.date_to ? (
                        format(new Date(filter.date_to), "dd/MM/yyyy")
                      ) : (
                        <span>Sélectionner</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        filter.date_to ? new Date(filter.date_to) : undefined
                      }
                      onSelect={(date) =>
                        setFilter({
                          ...filter,
                          date_to: date
                            ? format(date, "yyyy-MM-dd")
                            : undefined,
                        })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsFilterDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button onClick={applyFilters}>Appliquer les filtres</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
