"use client";

import { useState, useEffect, useMemo } from "react";
import {
  format,
  startOfWeek,
  parseISO,
  startOfMonth,
  endOfMonth,
  addDays,
} from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/fr";
import "react-big-calendar/lib/css/react-big-calendar.css";

import {
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
  Filter,
  X,
  Plus,
  Save,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/api";
import { Input } from "~/components/ui/input";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useFormationsStore } from "~/hooks/use-formations-store";
import { useSessionsStore } from "~/hooks/use-sessions-store";
import { useUsersStore } from "~/hooks/use-users-store";
import { create } from "zustand";
import { toast } from "sonner";

// Configuration du localizer pour react-big-calendar
moment.locale("fr");
const localizer = momentLocalizer(moment);

// Styles pour corriger le problème de défilement horizontal
import { useEffect as useEffectOnce } from "react";

// Types
interface CourseScheduleDay {
  id: string;
  course_schedule_id: string;
  day_of_week: number;
  day_name: string;
}

interface CourseSchedule {
  id: string;
  session_id: string;
  start_time: string;
  end_time: string;
  room: string | null;
  recurrence: "weekly" | "biweekly" | "monthly";
  start_date: string;
  end_date: string | null;
  teacher_id: string | null;
  days: CourseScheduleDay[];
  session?: {
    id: string;
    course_type: string;
    formation?: {
      id: string;
      name: string;
    };
  };
  teacher?: {
    id: string;
    fullName: string;
  };
}

interface WeekScheduleDay {
  date: string;
  day_name: string;
  schedules: CourseSchedule[];
}

interface WeekSchedule {
  [key: string]: WeekScheduleDay;
}

// Type pour les événements du calendrier
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: CourseSchedule;
}

// Store pour les plannings
interface ScheduleState {
  weekSchedule: WeekSchedule | null;
  isLoading: boolean;
  error: string | null;
  fetchWeekSchedule: (
    weekStart: string,
    formationId?: string,
    sessionId?: string,
    teacherId?: string
  ) => Promise<void>;
  fetchScheduleForDateRange: (
    startDate: string,
    endDate: string,
    formationId?: string,
    sessionId?: string,
    teacherId?: string
  ) => Promise<void>;
  createSchedule: (scheduleData: any) => Promise<void>;
}

const useScheduleStore = create<ScheduleState>((set) => ({
  weekSchedule: null,
  isLoading: false,
  error: null,

  fetchWeekSchedule: async (weekStart, formationId, sessionId, teacherId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/api/v1/schedules/week", {
        params: {
          week_start: weekStart,
          formation_id: formationId,
          session_id: sessionId,
          teacher_id: teacherId,
        },
      });
      set({ weekSchedule: response.data, isLoading: false });
    } catch (err: any) {
      console.error("Erreur lors du chargement du planning:", err);
      set({
        error:
          "Impossible de charger le planning. Veuillez réessayer plus tard.",
        isLoading: false,
      });
    }
  },

  fetchScheduleForDateRange: async (
    startDate,
    endDate,
    formationId,
    sessionId,
    teacherId
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/api/v1/schedules/date-range", {
        params: {
          start_date: startDate,
          end_date: endDate,
          formation_id: formationId,
          session_id: sessionId,
          teacher_id: teacherId,
        },
      });
      set({ weekSchedule: response.data, isLoading: false });
      console.log("response data", response);
    } catch (err: any) {
      console.error("Erreur lors du chargement du planning:", err);
      set({
        error:
          "Impossible de charger le planning. Veuillez réessayer plus tard.",
        isLoading: false,
      });
    }
  },

  createSchedule: async (scheduleData) => {
    set({ isLoading: true, error: null });
    try {
      await api.post("/api/v1/schedules", scheduleData);
      set({ isLoading: false });
    } catch (err: any) {
      console.error("Erreur lors de la création du planning:", err);
      set({
        error: "Impossible de créer le planning. Veuillez réessayer.",
        isLoading: false,
      });
      throw err;
    }
  },
}));

export default function ScheduleViewer() {
  // Utilisation des stores
  const { formations, getFormations } = useFormationsStore();
  const { sessions, getSessions } = useSessionsStore();
  const { users, getUsers } = useUsersStore();
  const {
    weekSchedule,
    isLoading,
    error,
    fetchScheduleForDateRange,
    createSchedule,
  } = useScheduleStore();

  // État local
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedView, setSelectedView] = useState<"month" | "week" | "day">(
    "month"
  );
  const [selectedFormation, setSelectedFormation] = useState<string | null>(
    null
  );
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState<boolean>(false);

  // État pour la sélection de formation dans le formulaire d'ajout
  const [formationForNewSchedule, setFormationForNewSchedule] = useState<
    string | null
  >(null);

  // Filtrer les enseignants
  const teachers = users?.filter((user) => user.role === "teacher") || [];

  // État pour le formulaire d'ajout
  const [newSchedule, setNewSchedule] = useState({
    session_id: "",
    start_time: "08:00",
    end_time: "10:00",
    room: "",
    recurrence: "weekly" as "weekly" | "biweekly" | "monthly",
    teacher_id: "",
    days_of_week: [] as number[],
  });

  // Ajouter des styles CSS pour corriger le problème de défilement horizontal
  useEffect(() => {
    // Ajouter des styles pour limiter la largeur des événements
    const style = document.createElement("style");
    style.innerHTML = `
      .rbc-event {
        max-width: 100% !important;
        width: 100% !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
      }
      
      .rbc-day-slot .rbc-events-container {
        width: 100% !important;
        right: 0 !important;
      }
      
      .rbc-time-content {
        overflow-x: hidden !important;
      }
      
      .rbc-calendar {
        max-width: 100% !important;
        overflow-x: hidden !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Chargement initial des données
  useEffect(() => {
    getFormations();
    getSessions();
    getUsers();
  }, [getFormations, getSessions, getUsers]);

  // Charger les données du planning en fonction de la vue
  useEffect(() => {
    let startDate, endDate;

    if (selectedView === "month") {
      startDate = startOfMonth(currentDate);
      endDate = endOfMonth(currentDate);
    } else if (selectedView === "week") {
      startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
      endDate = addDays(startDate, 6);
    } else {
      // day view
      startDate = currentDate;
      endDate = currentDate;
    }

    console.log(
      `Chargement des données du ${format(startDate, "yyyy-MM-dd")} au ${format(
        endDate,
        "yyyy-MM-dd"
      )}`
    );

    fetchScheduleForDateRange(
      format(startDate, "yyyy-MM-dd"),
      format(endDate, "yyyy-MM-dd"),
      selectedFormation === "all" ? undefined : selectedFormation || undefined,
      selectedSession === "all" ? undefined : selectedSession || undefined,
      selectedTeacher === "all" ? undefined : selectedTeacher || undefined
    );
  }, [
    currentDate,
    selectedView,
    selectedFormation,
    selectedSession,
    selectedTeacher,
    fetchScheduleForDateRange,
  ]);

  // Convertir les données du planning en événements pour le calendrier
  const events = useMemo(() => {
    if (!weekSchedule) return [];

    const calendarEvents: CalendarEvent[] = [];

    // Parcourir chaque date dans la réponse (format YYYY-MM-DD)
    Object.entries(weekSchedule).forEach(([dateString, dayData]) => {
      if (!dayData || !dayData.schedules || !dayData.schedules.length) return;

      // Traiter chaque horaire pour cette date
      dayData.schedules.forEach((schedule: any) => {
        if (!schedule || !schedule.start_time || !schedule.end_time) return;

        // Utiliser la date spécifique de cette occurrence
        const dayDate = parseISO(schedule.specific_date || dayData.date);

        // Extraire les heures et minutes
        const [startHours, startMinutes] = schedule.start_time
          .split(":")
          .map(Number);
        const [endHours, endMinutes] = schedule.end_time.split(":").map(Number);

        // Créer les dates de début et de fin pour cet événement
        const startDate = new Date(dayDate);
        startDate.setHours(startHours, startMinutes, 0);

        const endDate = new Date(dayDate);
        endDate.setHours(endHours, endMinutes, 0);

        // ID unique pour cet événement
        const eventId = `${schedule.id}-${format(dayDate, "yyyy-MM-dd")}`;

        // Informations sur l'événement - Tronquer les noms trop longs
        const formationName = schedule.session?.formation?.name || "Formation";
        const shortFormationName =
          formationName.length > 15
            ? formationName.substring(0, 15) + "..."
            : formationName;
        const room = schedule.room || "";

        calendarEvents.push({
          id: eventId,
          title: `${shortFormationName} - ${room}`,
          start: startDate,
          end: endDate,
          resource: schedule,
        });
      });
    });

    return calendarEvents;
  }, [weekSchedule]);

  // Filtrer les sessions en fonction de la formation sélectionnée pour le filtre
  const filteredSessions =
    selectedFormation && selectedFormation !== "all"
      ? sessions.filter(
          (session) => session.formation?.id === selectedFormation
        )
      : sessions;

  // Filtrer les sessions pour le formulaire d'ajout
  const sessionsForNewSchedule = formationForNewSchedule
    ? sessions.filter(
        (session) => session.formation?.id === formationForNewSchedule
      )
    : [];

  // Navigation dans le calendrier
  const handleNavigate = (action: "PREV" | "NEXT" | "TODAY") => {
    switch (action) {
      case "PREV":
        if (selectedView === "month") {
          setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
          );
        } else if (selectedView === "week") {
          const newDate = new Date(currentDate);
          newDate.setDate(newDate.getDate() - 7);
          setCurrentDate(newDate);
        } else {
          // day view
          const newDate = new Date(currentDate);
          newDate.setDate(newDate.getDate() - 1);
          setCurrentDate(newDate);
        }
        break;
      case "NEXT":
        if (selectedView === "month") {
          setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
          );
        } else if (selectedView === "week") {
          const newDate = new Date(currentDate);
          newDate.setDate(newDate.getDate() + 7);
          setCurrentDate(newDate);
        } else {
          // day view
          const newDate = new Date(currentDate);
          newDate.setDate(newDate.getDate() + 1);
          setCurrentDate(newDate);
        }
        break;
      case "TODAY":
        setCurrentDate(new Date());
        break;
    }
  };

  // Gestion des filtres
  const handleFormationChange = (value: string) => {
    setSelectedFormation(value);
    setSelectedSession(null);
  };

  const handleSessionChange = (value: string) => {
    setSelectedSession(value);
  };

  const handleTeacherChange = (value: string) => {
    setSelectedTeacher(value);
  };

  const resetFilters = () => {
    setSelectedFormation(null);
    setSelectedSession(null);
    setSelectedTeacher(null);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Gestion du formulaire d'ajout
  const handleNewScheduleChange = (field: string, value: any) => {
    setNewSchedule((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFormationForNewScheduleChange = (value: string) => {
    setFormationForNewSchedule(value);
    setNewSchedule((prev) => ({ ...prev, session_id: "" }));
  };

  const handleDayToggle = (day: number) => {
    setNewSchedule((prev) => {
      const days = [...prev.days_of_week];
      if (days.includes(day)) {
        return {
          ...prev,
          days_of_week: days.filter((d) => d !== day),
        };
      } else {
        return {
          ...prev,
          days_of_week: [...days, day].sort(),
        };
      }
    });
  };

  const handleSubmitNewSchedule = async () => {
    if (!newSchedule.session_id) {
      toast("Veuillez choisir une session");
      return;
    }

    if (newSchedule.days_of_week.length === 0) {
      toast("Veuillez choisir au moins un jour de la semaine");
      return;
    }

    setIsSubmitting(true);
    try {
      await createSchedule(newSchedule);

      toast("Planning ajouté avec succès");

      // Réinitialiser le formulaire
      setNewSchedule({
        session_id: "",
        start_time: "08:00",
        end_time: "10:00",
        room: "",
        recurrence: "weekly",
        teacher_id: "",
        days_of_week: [],
      });
      setFormationForNewSchedule(null);

      // Fermer la boîte de dialogue
      setIsAddDialogOpen(false);

      // Rafraîchir les données
      let startDate, endDate;

      if (selectedView === "month") {
        startDate = startOfMonth(currentDate);
        endDate = endOfMonth(currentDate);
      } else if (selectedView === "week") {
        startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
        endDate = addDays(startDate, 6);
      } else {
        // day view
        startDate = currentDate;
        endDate = currentDate;
      }

      fetchScheduleForDateRange(
        format(startDate, "yyyy-MM-dd"),
        format(endDate, "yyyy-MM-dd"),
        selectedFormation === "all"
          ? undefined
          : selectedFormation || undefined,
        selectedSession === "all" ? undefined : selectedSession || undefined,
        selectedTeacher === "all" ? undefined : selectedTeacher || undefined
      );
    } catch (error) {
      console.error("Erreur lors de la création du planning:", error);
      toast("Erreur lors de la création du planning");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gestion des événements du calendrier
  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventDetailsOpen(true);
  };

  // Formatage des données
  const formatTimeRange = (startTime: string, endTime: string) => {
    return `${startTime.substring(0, 5)} - ${endTime.substring(0, 5)}`;
  };

  const getRecurrenceLabel = (recurrence: string) => {
    switch (recurrence) {
      case "weekly":
        return "Hebdomadaire";
      case "biweekly":
        return "Bi-hebdomadaire";
      case "monthly":
        return "Mensuel";
      default:
        return recurrence;
    }
  };

  const dayNames = [
    { value: 1, label: "Lundi" },
    { value: 2, label: "Mardi" },
    { value: 3, label: "Mercredi" },
    { value: 4, label: "Jeudi" },
    { value: 5, label: "Vendredi" },
    { value: 6, label: "Samedi" },
    { value: 7, label: "Dimanche" },
  ];

  // Personnalisation du rendu des événements dans le calendrier
  const eventStyleGetter = (event: CalendarEvent) => {
    // Utiliser l'ID du cours pour générer une couleur différente
    const colors = [
      "#3b82f6", // blue-500
      "#10b981", // emerald-500
      "#f59e0b", // amber-500
      "#ef4444", // red-500
      "#8b5cf6", // violet-500
    ];

    // Utiliser le dernier caractère de l'ID pour choisir une couleur
    const colorIndex = parseInt(event.id.slice(-1), 16) % colors.length;

    const style = {
      backgroundColor: colors[colorIndex],
      borderRadius: "4px",
      opacity: 0.8,
      color: "white",
      border: "none",
      display: "block",
      overflow: "hidden", // Empêche le texte de déborder
      textOverflow: "ellipsis", // Ajoute des points de suspension
      whiteSpace: "nowrap", // Empêche le retour à la ligne
      maxWidth: "100%", // Limite la largeur maximale
      width: "100%", // Utilise toute la largeur disponible
    };
    return {
      style,
    };
  };

  // Personnalisation du rendu des cellules du calendrier
  const dayPropGetter = (date: Date) => {
    const today = new Date();
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return {
        className: "rbc-day-today",
        style: {
          backgroundColor: "rgba(59, 130, 246, 0.1)", // blue-500 avec opacité
        },
      };
    }
    return {};
  };

  // Rendu du composant
  return (
    <div>
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-xl font-bold">Planning des cours</h1>

          <div className="flex flex-wrap gap-2">
            <div className="flex gap-1 mr-2">
              <Button
                variant={selectedView === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedView("month")}
              >
                <CalendarIcon className="h-4 w-4 mr-1" />
                Mois
              </Button>
              <Button
                variant={selectedView === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedView("week")}
              >
                <CalendarIcon className="h-4 w-4 mr-1" />
                Semaine
              </Button>
              <Button
                variant={selectedView === "day" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedView("day")}
              >
                <CalendarIcon className="h-4 w-4 mr-1" />
                Jour
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={() => handleNavigate("PREV")}
              size="sm"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Précédent
            </Button>
            <Button
              variant="outline"
              onClick={() => handleNavigate("TODAY")}
              size="sm"
            >
              <CalendarIcon className="h-4 w-4 mr-1" />
              Aujourd'hui
            </Button>
            <Button
              variant="outline"
              onClick={() => handleNavigate("NEXT")}
              size="sm"
            >
              Suivant
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
            <Button
              variant={showFilters ? "default" : "outline"}
              onClick={toggleFilters}
              size="sm"
            >
              <Filter className="h-4 w-4 mr-1" />
              Filtres
              {(selectedFormation || selectedSession || selectedTeacher) && (
                <Badge variant="secondary" className="ml-2">
                  {
                    [
                      selectedFormation ? "1" : "",
                      selectedSession ? "1" : "",
                      selectedTeacher ? "1" : "",
                    ].filter(Boolean).length
                  }
                </Badge>
              )}
            </Button>

            {/* Bouton pour ajouter un nouvel horaire */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter un cours
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Ajouter un nouvel horaire de cours</DialogTitle>
                  <DialogDescription>
                    Remplissez les informations pour créer un nouvel horaire de
                    cours.
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh]">
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="formation">Formation</Label>
                      <Select
                        value={formationForNewSchedule || ""}
                        onValueChange={handleFormationForNewScheduleChange}
                      >
                        <SelectTrigger id="formation">
                          <SelectValue placeholder="Sélectionner une formation" />
                        </SelectTrigger>
                        <SelectContent>
                          {formations.map((formation) => (
                            <SelectItem key={formation.id} value={formation.id}>
                              {formation.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="session">Session</Label>
                      <Select
                        value={newSchedule.session_id}
                        onValueChange={(value) =>
                          handleNewScheduleChange("session_id", value)
                        }
                        disabled={
                          !formationForNewSchedule ||
                          sessionsForNewSchedule.length === 0
                        }
                      >
                        <SelectTrigger id="session">
                          <SelectValue placeholder="Sélectionner une session" />
                        </SelectTrigger>
                        <SelectContent>
                          {sessionsForNewSchedule.map((session) => (
                            <SelectItem key={session.id} value={session.id}>
                              {format(
                                new Date(session.start_date),
                                "dd/MM/yyyy"
                              )}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="start_time">Heure de début</Label>
                        <Input
                          id="start_time"
                          type="time"
                          value={newSchedule.start_time}
                          onChange={(e) =>
                            handleNewScheduleChange(
                              "start_time",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="end_time">Heure de fin</Label>
                        <Input
                          id="end_time"
                          type="time"
                          value={newSchedule.end_time}
                          onChange={(e) =>
                            handleNewScheduleChange("end_time", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="room">Salle</Label>
                      <Input
                        id="room"
                        placeholder="Numéro ou nom de la salle"
                        value={newSchedule.room}
                        onChange={(e) =>
                          handleNewScheduleChange("room", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="teacher">Professeur</Label>
                      <Select
                        value={newSchedule.teacher_id}
                        onValueChange={(value) =>
                          handleNewScheduleChange("teacher_id", value)
                        }
                      >
                        <SelectTrigger id="teacher">
                          <SelectValue placeholder="Sélectionner un professeur" />
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
                      <Label htmlFor="recurrence">Récurrence</Label>
                      <Select
                        value={newSchedule.recurrence}
                        onValueChange={(
                          value: "weekly" | "biweekly" | "monthly"
                        ) => handleNewScheduleChange("recurrence", value)}
                      >
                        <SelectTrigger id="recurrence">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Hebdomadaire</SelectItem>
                          <SelectItem value="biweekly">
                            Bi-hebdomadaire
                          </SelectItem>
                          <SelectItem value="monthly">Mensuel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label>Jours de la semaine</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {dayNames.map((day) => (
                          <div
                            key={day.value}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`day-${day.value}`}
                              checked={newSchedule.days_of_week.includes(
                                day.value
                              )}
                              onCheckedChange={() => handleDayToggle(day.value)}
                            />
                            <Label
                              htmlFor={`day-${day.value}`}
                              className="cursor-pointer"
                            >
                              {day.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                    disabled={isSubmitting}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleSubmitNewSchedule}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Enregistrement...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Save className="h-4 w-4 mr-1" />
                        Enregistrer
                      </span>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl">
            {format(currentDate, "MMMM yyyy", { locale: fr })}
          </h2>
        </div>

        {/* Panneau de filtres */}
        {showFilters && (
          <div className="bg-card p-4 rounded-md shadow-sm mb-6 border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Filtrer le planning</h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  disabled={
                    !selectedFormation && !selectedSession && !selectedTeacher
                  }
                >
                  <X className="h-4 w-4 mr-1" />
                  Réinitialiser
                </Button>
                <Button variant="ghost" size="sm" onClick={toggleFilters}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="formation-filter">Formation</Label>
                <Select
                  value={selectedFormation || ""}
                  onValueChange={handleFormationChange}
                >
                  <SelectTrigger id="formation-filter">
                    <SelectValue placeholder="Toutes les formations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les formations</SelectItem>
                    {formations.map((formation) => (
                      <SelectItem key={formation.id} value={formation.id}>
                        {formation.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="session-filter">Session</Label>
                <Select
                  value={selectedSession || ""}
                  onValueChange={handleSessionChange}
                  disabled={!selectedFormation || filteredSessions.length === 0}
                >
                  <SelectTrigger id="session-filter">
                    <SelectValue placeholder="Toutes les sessions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les sessions</SelectItem>
                    {filteredSessions.map((session) => (
                      <SelectItem key={session.id} value={session.id}>
                        {format(new Date(session.start_date), "dd/MM/yyyy")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="teacher-filter">Professeur</Label>
                <Select
                  value={selectedTeacher || ""}
                  onValueChange={handleTeacherChange}
                >
                  <SelectTrigger id="teacher-filter">
                    <SelectValue placeholder="Tous les professeurs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les professeurs</SelectItem>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Calendrier */}
        <div className="mb-6 bg-card rounded-md shadow-sm border p-4">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
          ) : (
            <div className="h-[700px] overflow-hidden">
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{
                  height: "100%",
                  width: "100%",
                  maxWidth: "100%",
                  overflow: "hidden",
                }}
                className="overflow-hidden"
                views={["month", "week", "day"]}
                view={selectedView}
                onView={(view) => setSelectedView(view as any)}
                date={currentDate}
                onNavigate={(date) => setCurrentDate(date)}
                onSelectEvent={handleSelectEvent}
                eventPropGetter={eventStyleGetter}
                dayPropGetter={dayPropGetter}
                messages={{
                  month: "Mois",
                  week: "Semaine",
                  day: "Jour",
                  today: "Aujourd'hui",
                  previous: "Précédent",
                  next: "Suivant",
                  agenda: "Agenda",
                  date: "Date",
                  time: "Heure",
                  event: "Événement",
                  noEventsInRange: "Aucun cours programmé dans cette période",
                }}
                formats={{
                  dayFormat: (date, culture, localizer) =>
                    localizer!.format(date, "dd", culture),
                  dayHeaderFormat: (date, culture, localizer) =>
                    localizer!.format(date, "dd MMMM", culture),
                  dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
                    `${localizer!.format(
                      start,
                      "dd MMMM",
                      culture
                    )} - ${localizer!.format(end, "dd MMMM", culture)}`,
                  monthHeaderFormat: (date, culture, localizer) =>
                    localizer!.format(date, "MMMM yyyy", culture),
                }}
              />
            </div>
          )}
        </div>

        {/* Dialogue de détails de l'événement */}
        <Dialog open={isEventDetailsOpen} onOpenChange={setIsEventDetailsOpen}>
          <DialogContent className="sm:max-w-[500px]">
            {selectedEvent && (
              <>
                <DialogHeader>
                  <DialogTitle>Détails du cours</DialogTitle>
                  <DialogDescription>
                    {format(selectedEvent.start, "EEEE dd MMMM yyyy", {
                      locale: fr,
                    })}
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div>
                    <h3 className="font-medium text-lg">
                      {selectedEvent.resource.session?.formation?.name ||
                        "Formation non spécifiée"}
                    </h3>
                    {/* <p className="text-primary">
                      {selectedEvent.resource.session?.course_type ||
                        "Session non spécifiée"}
                    </p> */}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Horaire</p>
                      <p className="font-medium">
                        {formatTimeRange(
                          selectedEvent.resource.start_time,
                          selectedEvent.resource.end_time
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Salle</p>
                      <p className="font-medium">
                        {selectedEvent.resource.room || "Non spécifiée"}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Professeur
                      </p>
                      <p className="font-medium">
                        {selectedEvent.resource.teacher?.fullName ||
                          "Non spécifié"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Récurrence
                      </p>
                      <p className="font-medium">
                        {getRecurrenceLabel(selectedEvent.resource.recurrence)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Jours de la semaine
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedEvent.resource.days.map((day) => (
                        <Badge key={day.id} variant="outline">
                          {day.day_name ||
                            dayNames.find((d) => d.value === day.day_of_week)
                              ?.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsEventDetailsOpen(false)}
                  >
                    Fermer
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Message si aucune donnée et pas en chargement */}
        {!isLoading &&
          (!weekSchedule || Object.keys(weekSchedule).length === 0) && (
            <div className="text-center py-10 border rounded-md">
              <h3 className="text-xl font-medium mb-2">Aucun horaire trouvé</h3>
              <p className="text-muted-foreground mb-6">
                Aucun horaire n'a été configuré pour cette période ou avec ces
                filtres.
              </p>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter un cours
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          )}

        {/* Vue mobile: aide à la navigation */}
        <div className="md:hidden mt-6 flex justify-center">
          <p className="text-sm text-muted-foreground">
            Faites glisser pour naviguer dans le calendrier
          </p>
        </div>
      </div>
    </div>
  );
}
