import React from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
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
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "~/lib/utils";
import { api } from "~/api";
import { usePaymentsStore } from "~/hooks/use-payments-store";
import type {
  FormationSession,
  Payment,
  UpdatePaymentData,
} from "~/types/payment";

// Interfaces pour les types
export interface User {
  id: string;
  fullName: string;
  email: string;
}

export interface Formation {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration?: number;
}

interface EditPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  payment: Payment | null;
}

const initialState = {
  students: [] as User[],
  studentFormations: [] as Formation[],
  studentSessions: [] as FormationSession[],
  filteredSessions: [] as FormationSession[],
  selectedStudent: "",
  selectedFormation: "",
  selectedSession: "",
  openStudentCombobox: false,
  openFormationCombobox: false,
  openSessionCombobox: false,
  formErrors: {} as Record<string, string>,
  isLoading: false,
};

export function EditPaymentDialog({
  open,
  onOpenChange,
  onSuccess,
  payment,
}: EditPaymentDialogProps) {
  const [state, setState] = React.useState(initialState);
  const formRef = React.useRef<HTMLFormElement>(null);

  const resetState = () => {
    setState(initialState);
    formRef.current?.reset();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetState();
    }
    onOpenChange(open);
  };

  React.useEffect(() => {
    if (open && payment) {
      setState((prev) => ({
        ...prev,
        selectedStudent: payment.student.id,
        selectedFormation: payment.session.formation?.id || "",
        selectedSession: payment.session.id,
      }));
      fetchStudents();
    }
  }, [open, payment]);

  // Effet pour charger les formations et sessions de l'étudiant quand un étudiant est sélectionné
  React.useEffect(() => {
    if (state.selectedStudent) {
      fetchStudentData(state.selectedStudent);
    } else {
      setState((prev) => ({
        ...prev,
        studentFormations: [],
        studentSessions: [],
        filteredSessions: [],
        selectedFormation: "",
        selectedSession: "",
      }));
    }
  }, [state.selectedStudent]);

  // Effet pour filtrer les sessions quand une formation est sélectionnée
  React.useEffect(() => {
    if (state.selectedFormation && state.studentSessions.length > 0) {
      const filtered = state.studentSessions.filter(
        (session) => session.formation_id === state.selectedFormation
      );
      setState((prev) => ({
        ...prev,
        filteredSessions: filtered,
        selectedSession: payment?.session.id || "",
      }));
    } else {
      setState((prev) => ({
        ...prev,
        filteredSessions: [],
        selectedSession: "",
      }));
    }
  }, [state.selectedFormation, state.studentSessions]);

  const fetchStudents = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const response = await api.get("/api/v1/admin/students");
      setState((prev) => ({
        ...prev,
        students: response.data.students,
        isLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      toast.error("Erreur lors du chargement des étudiants");
    }
  };

  const fetchStudentData = async (studentId: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const response = await api.get(
        `/api/v1/admin/students/${studentId}/sessions-formations`
      );
      setState((prev) => ({
        ...prev,
        studentFormations: response.data.formations,
        studentSessions: response.data.sessions,
        isLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      toast.error("Erreur lors du chargement des données de l'étudiant");
    }
  };

  const validateForm = (formData: FormData) => {
    const errors: Record<string, string> = {};

    if (!state.selectedStudent) {
      errors.student_id = "Veuillez sélectionner un étudiant";
    }
    if (!state.selectedFormation) {
      errors.formation_id = "Veuillez sélectionner une formation";
    }
    if (!state.selectedSession) {
      errors.session_id = "Veuillez sélectionner une session";
    }

    const amount = Number(formData.get("amount"));
    if (isNaN(amount) || amount <= 0) {
      errors.amount = "Le montant doit être positif";
    }

    const paymentMethod = formData.get("payment_method");
    if (!paymentMethod) {
      errors.payment_method = "Veuillez sélectionner une méthode de paiement";
    }

    const paymentDate = formData.get("payment_date");
    if (!paymentDate) {
      errors.payment_date = "Veuillez sélectionner une date";
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!payment) return;

    const formData = new FormData(e.currentTarget);
    formData.set("student_id", state.selectedStudent);
    formData.set("session_id", state.selectedSession);

    const errors = validateForm(formData);
    setState((prev) => ({ ...prev, formErrors: errors }));

    if (Object.keys(errors).length > 0) {
      return;
    }

    const paymentMethod = formData.get("payment_method");
    if (
      !paymentMethod ||
      !["cash", "banque"].includes(paymentMethod.toString())
    ) {
      setState((prev) => ({
        ...prev,
        formErrors: {
          ...prev.formErrors,
          payment_method: "Méthode de paiement invalide",
        },
      }));
      return;
    }

    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const values: UpdatePaymentData = {
        student_id: state.selectedStudent,
        session_id: state.selectedSession,
        amount: Number(formData.get("amount")),
        payment_method: paymentMethod as "cash" | "banque",
        payment_date: formData.get("payment_date") as string,
        notes: formData.get("notes")?.toString() || undefined,
      };

      const { updatePayment } = usePaymentsStore.getState();
      await updatePayment(payment.id, values);
      setState((prev) => ({ ...prev, isLoading: false }));
      handleOpenChange(false);
      onSuccess();
    } catch (error: any) {
      setState((prev) => ({ ...prev, isLoading: false }));
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Erreur lors de la modification du paiement");
      }
      console.error("Erreur dans le formulaire:", error);
    }
  };

  // Calcul du montant restant pour une session
  const getSessionPrice = (sessionId: string) => {
    const session = state.studentSessions.find((s) => s.id === sessionId);
    if (!session) return null;

    // Utiliser le prix de la session s'il existe, sinon celui de la formation
    return session.price ?? session.formation?.price ?? 0;
  };

  // Fonction pour suggérer un montant basé sur la session sélectionnée
  const suggestAmount = () => {
    if (state.selectedSession) {
      const price = getSessionPrice(state.selectedSession);
      if (price !== null) {
        const input = document.getElementById("amount") as HTMLInputElement;
        if (input) {
          input.value = price.toString();
        }
      }
    }
  };

  if (!payment) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le Paiement</DialogTitle>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          {/* Student Select */}
          <div>
            <Label>Étudiant</Label>
            <Popover
              open={state.openStudentCombobox}
              onOpenChange={(open) =>
                setState((prev) => ({ ...prev, openStudentCombobox: open }))
              }
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between",
                    !state.selectedStudent && "text-muted-foreground"
                  )}
                >
                  {state.selectedStudent
                    ? state.students.find(
                        (student) => student.id === state.selectedStudent
                      )?.fullName
                    : "Sélectionner un étudiant"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput placeholder="Rechercher un étudiant..." />
                  <CommandEmpty>Aucun étudiant trouvé.</CommandEmpty>
                  <CommandGroup className="max-h-[200px] overflow-y-auto">
                    {state.students.map((student) => (
                      <CommandItem
                        key={student.id}
                        value={student.fullName}
                        onSelect={() => {
                          setState((prev) => ({
                            ...prev,
                            selectedStudent: student.id,
                            openStudentCombobox: false,
                          }));
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            student.id === state.selectedStudent
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {student.fullName}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            {state.formErrors.student_id && (
              <p className="text-sm text-red-500 mt-1">
                {state.formErrors.student_id}
              </p>
            )}
          </div>

          {/* Formation Select - Uniquement les formations auxquelles l'étudiant est inscrit */}
          <div>
            <Label>Formation</Label>
            <Popover
              open={state.openFormationCombobox}
              onOpenChange={(open) =>
                setState((prev) => ({ ...prev, openFormationCombobox: open }))
              }
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  disabled={
                    !state.selectedStudent ||
                    state.studentFormations.length === 0
                  }
                  className={cn(
                    "w-full justify-between",
                    !state.selectedFormation && "text-muted-foreground"
                  )}
                >
                  {state.selectedFormation
                    ? state.studentFormations.find(
                        (formation) => formation.id === state.selectedFormation
                      )?.name
                    : state.selectedStudent
                    ? state.studentFormations.length === 0
                      ? "Aucune formation disponible"
                      : "Sélectionner une formation"
                    : "Sélectionnez d'abord un étudiant"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput placeholder="Rechercher une formation..." />
                  <CommandEmpty>Aucune formation trouvée.</CommandEmpty>
                  <CommandGroup className="max-h-[200px] overflow-y-auto">
                    {state.studentFormations.map((formation) => (
                      <CommandItem
                        key={formation.id}
                        value={formation.name}
                        onSelect={() => {
                          setState((prev) => ({
                            ...prev,
                            selectedFormation: formation.id,
                            openFormationCombobox: false,
                          }));
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            formation.id === state.selectedFormation
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {formation.name}
                        {formation.price && ` (${formation.price} €)`}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            {state.formErrors.formation_id && (
              <p className="text-sm text-red-500 mt-1">
                {state.formErrors.formation_id}
              </p>
            )}
          </div>

          {/* Session Select - Uniquement les sessions de la formation sélectionnée */}
          <div>
            <Label>Session de formation</Label>
            <Popover
              open={state.openSessionCombobox}
              onOpenChange={(open) =>
                setState((prev) => ({ ...prev, openSessionCombobox: open }))
              }
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  disabled={
                    !state.selectedFormation ||
                    state.filteredSessions.length === 0
                  }
                  className={cn(
                    "w-full justify-between",
                    !state.selectedSession && "text-muted-foreground"
                  )}
                >
                  {state.selectedSession
                    ? state.filteredSessions.find(
                        (session) => session.id === state.selectedSession
                      )?.name ||
                      `Session du ${new Date(
                        state.filteredSessions.find(
                          (session) => session.id === state.selectedSession
                        )?.start_date || ""
                      ).toLocaleDateString()}`
                    : state.selectedFormation
                    ? state.filteredSessions.length === 0
                      ? "Aucune session disponible"
                      : "Sélectionner une session"
                    : "Sélectionnez d'abord une formation"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput placeholder="Rechercher une session..." />
                  <CommandEmpty>Aucune session trouvée.</CommandEmpty>
                  <CommandGroup className="max-h-[200px] overflow-y-auto">
                    {state.filteredSessions.map((session) => (
                      <CommandItem
                        key={session.id}
                        value={
                          session.name ||
                          `Session du ${new Date(
                            session.start_date
                          ).toLocaleDateString()}`
                        }
                        onSelect={() => {
                          setState((prev) => ({
                            ...prev,
                            selectedSession: session.id,
                            openSessionCombobox: false,
                          }));
                          // Suggérer automatiquement le montant basé sur le prix de la session
                          setTimeout(suggestAmount, 100);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            session.id === state.selectedSession
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {session.name ||
                          `Session du ${new Date(
                            session.start_date
                          ).toLocaleDateString()}`}
                        {session.price
                          ? ` (${session.price} €)`
                          : session.formation?.price
                          ? ` (${session.formation.price} €)`
                          : ""}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            {state.formErrors.session_id && (
              <p className="text-sm text-red-500 mt-1">
                {state.formErrors.session_id}
              </p>
            )}
          </div>

          {/* Amount Input */}
          <div>
            <Label htmlFor="amount">Montant</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              defaultValue={Math.floor(payment.amount)}
            />
            {state.formErrors.amount && (
              <p className="text-sm text-red-500 mt-1">
                {state.formErrors.amount}
              </p>
            )}
          </div>

          {/* Payment Method Select */}
          <div>
            <Label htmlFor="payment_method">Méthode de paiement</Label>
            <select
              id="payment_method"
              name="payment_method"
              defaultValue={payment.payment_method}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Sélectionner une méthode</option>
              <option value="cash">Espèces</option>
              <option value="banque">Virement bancaire</option>
            </select>
            {state.formErrors.payment_method && (
              <p className="text-sm text-red-500 mt-1">
                {state.formErrors.payment_method}
              </p>
            )}
          </div>

          {/* Payment Date Input */}
          <div>
            <Label htmlFor="payment_date">Date de paiement</Label>
            <Input
              id="payment_date"
              name="payment_date"
              type="date"
              defaultValue={payment.payment_date.split("T")[0]}
            />
            {state.formErrors.payment_date && (
              <p className="text-sm text-red-500 mt-1">
                {state.formErrors.payment_date}
              </p>
            )}
          </div>

          {/* Notes Textarea */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              defaultValue={payment.notes || ""}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={state.isLoading}>
              {state.isLoading ? "Chargement..." : "Modifier le paiement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
