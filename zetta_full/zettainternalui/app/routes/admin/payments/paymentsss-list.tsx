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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Check, ChevronsUpDown, Eye, Pencil } from "lucide-react";
import { cn } from "~/lib/utils";
import { api } from "~/api";

interface User {
  id: number;
  fullName: string;
  email: string;
  status: string;
  imageUrl?: string;
  phone?: string;
  role: string;
}

interface Formation {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  level?: string;
  duration?: string;
  price?: number;
}

interface Payment {
  id: number;
  amount: number;
  remaining_amount: number;
  payment_method: string;
  status: string;
  notes?: string;
  payment_date: string;
  created_at: string;
  updated_at: string;
  student: User;
  formation: Formation;
}

export default function PaymentsList() {
  const [payments, setPayments] = React.useState<Payment[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [detailsDialog, setDetailsDialog] = React.useState(false);
  const [selectedPayment, setSelectedPayment] = React.useState<Payment | null>(
    null
  );
  const [students, setStudents] = React.useState<User[]>([]);
  const [formations, setFormations] = React.useState<Formation[]>([]);
  const [openStudentCombobox, setOpenStudentCombobox] = React.useState(false);
  const [openFormationCombobox, setOpenFormationCombobox] =
    React.useState(false);

  // États pour le formulaire
  const [selectedStudent, setSelectedStudent] = React.useState<number>(0);
  const [selectedFormation, setSelectedFormation] = React.useState<number>(0);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>(
    {}
  );

  React.useEffect(() => {
    fetchPayments();
    fetchStudents();
    fetchFormations();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/v1/admin/payments");
      setPayments(response.data.payments);
      console.log(response.data.payments);
    } catch (error) {
      toast.error("Erreur lors de la récupération des paiements");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await api.get("/api/v1/admin/students");
      setStudents(response.data.students);
    } catch (error) {
      toast.error("Erreur lors de la récupération des étudiants");
    }
  };

  const fetchFormations = async () => {
    try {
      const response = await api.get("/api/v1/admin/formations");
      setFormations(response.data.formations);
    } catch (error) {
      toast.error("Erreur lors de la récupération des formations");
    }
  };

  const validateForm = (formData: FormData) => {
    const errors: Record<string, string> = {};

    if (!selectedStudent) {
      errors.student_id = "Veuillez sélectionner un étudiant";
    }
    if (!selectedFormation) {
      errors.formation_id = "Veuillez sélectionner une formation";
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
    const formData = new FormData(e.currentTarget);

    // Ajouter les valeurs des combobox
    formData.set("student_id", selectedStudent.toString());
    formData.set("formation_id", selectedFormation.toString());

    const errors = validateForm(formData);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      const values = {
        student_id: selectedStudent,
        formation_id: selectedFormation,
        amount: Number(formData.get("amount")),
        payment_method: formData.get("payment_method"),
        payment_date: formData.get("payment_date"),
        notes: formData.get("notes"),
      };

      await api.post("/api/v1/admin/payments", values);
      toast.success("Paiement créé avec succès");
      setOpenDialog(false);
      e.currentTarget.reset();
      setSelectedStudent(0);
      setSelectedFormation(0);
      fetchPayments();
    } catch (error) {
      toast.error("Erreur lors de la création du paiement");
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Liste des Paiements</h1>
        <Button onClick={() => setOpenDialog(true)}>Nouveau Paiement</Button>
      </div>

      {/* DataTable */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Formation</TableHead>
              <TableHead>Étudiant</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Restant</TableHead>
              <TableHead>Méthode</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>État</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Aucun paiement trouvé
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">
                    {payment.formation.name}
                  </TableCell>
                  <TableCell>{payment.student.fullName}</TableCell>
                  <TableCell>{payment.amount} €</TableCell>
                  <TableCell>{payment.remaining_amount} €</TableCell>
                  <TableCell>{payment.payment_method}</TableCell>
                  <TableCell>{payment.payment_date}</TableCell>
                  <TableCell>{payment.status}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelectedPayment(payment);
                          setDetailsDialog(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          // Implémentation de l'édition à venir
                          toast.info("Fonction d'édition à implémenter");
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Formulaire de création */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nouveau Paiement</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Étudiant</Label>
              <Popover
                open={openStudentCombobox}
                onOpenChange={setOpenStudentCombobox}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between",
                      !selectedStudent && "text-muted-foreground"
                    )}
                  >
                    {selectedStudent
                      ? students.find(
                          (student) => student.id === selectedStudent
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
                      {students.map((student) => (
                        <CommandItem
                          key={student.id}
                          value={student.fullName}
                          onSelect={() => {
                            setSelectedStudent(student.id);
                            setOpenStudentCombobox(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              student.id === selectedStudent
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
              {formErrors.student_id && (
                <p className="text-sm text-red-500 mt-1">
                  {formErrors.student_id}
                </p>
              )}
            </div>

            <div>
              <Label>Formation</Label>
              <Popover
                open={openFormationCombobox}
                onOpenChange={setOpenFormationCombobox}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between",
                      !selectedFormation && "text-muted-foreground"
                    )}
                  >
                    {selectedFormation
                      ? formations.find(
                          (formation) => formation.id === selectedFormation
                        )?.name
                      : "Sélectionner une formation"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <Command>
                    <CommandInput placeholder="Rechercher une formation..." />
                    <CommandEmpty>Aucune formation trouvée.</CommandEmpty>
                    <CommandGroup className="max-h-[200px] overflow-y-auto">
                      {formations.map((formation) => (
                        <CommandItem
                          key={formation.id}
                          value={formation.name}
                          onSelect={() => {
                            setSelectedFormation(formation.id);
                            setOpenFormationCombobox(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              formation.id === selectedFormation
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {formation.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              {formErrors.formation_id && (
                <p className="text-sm text-red-500 mt-1">
                  {formErrors.formation_id}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="amount">Montant</Label>
              <Input id="amount" name="amount" type="number" defaultValue={0} />
              {formErrors.amount && (
                <p className="text-sm text-red-500 mt-1">{formErrors.amount}</p>
              )}
            </div>

            <div>
              <Label htmlFor="payment_method">Méthode de paiement</Label>
              <Input id="payment_method" name="payment_method" type="text" />
              {formErrors.payment_method && (
                <p className="text-sm text-red-500 mt-1">
                  {formErrors.payment_method}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="payment_date">Date de paiement</Label>
              <Input
                id="payment_date"
                name="payment_date"
                type="date"
                defaultValue={new Date().toISOString().split("T")[0]}
              />
              {formErrors.payment_date && (
                <p className="text-sm text-red-500 mt-1">
                  {formErrors.payment_date}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" />
            </div>

            <DialogFooter>
              <Button type="submit">Créer le paiement</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog des détails */}
      <Dialog open={detailsDialog} onOpenChange={setDetailsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails du paiement</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Formation</Label>
                  <p>{selectedPayment.formation.name}</p>
                </div>
                <div>
                  <Label>Étudiant</Label>
                  <p>{selectedPayment.student.fullName}</p>
                </div>
                <div>
                  <Label>Montant</Label>
                  <p>{selectedPayment.amount} €</p>
                </div>
                <div>
                  <Label>Restant</Label>
                  <p>{selectedPayment.remaining_amount} €</p>
                </div>
                <div>
                  <Label>Méthode</Label>
                  <p>{selectedPayment.payment_method}</p>
                </div>
                <div>
                  <Label>Date</Label>
                  <p>{selectedPayment.payment_date}</p>
                </div>
                <div>
                  <Label>Créé le</Label>
                  <p>{selectedPayment.created_at}</p>
                </div>
                <div>
                  <Label>Mis à jour le</Label>
                  <p>{selectedPayment.updated_at}</p>
                </div>
              </div>
              {selectedPayment.notes && (
                <div>
                  <Label>Notes</Label>
                  <p>{selectedPayment.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
