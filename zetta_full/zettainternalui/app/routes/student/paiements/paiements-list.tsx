import React, { useEffect, useState } from "react";
import { api } from "~/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { format } from "date-fns";
import type { Payment } from "~/types/payment";

// Définir les types de statut explicitement pour éviter les erreurs
type PaymentStatus =
  | "pending"
  | "completed"
  | "failed"
  | "refunded"
  | "partial";

const PaymentList: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtres
  const [selectedFormation, setSelectedFormation] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedMethod, setSelectedMethod] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Liste unique des formations pour le filtre
  const formations = [
    ...new Set(payments.map((p) => p.session.formation?.name).filter(Boolean)),
  ];
  const methods = [...new Set(payments.map((p) => p.payment_method))];
  const statuses: PaymentStatus[] = [
    "partial",
    "completed",
    "failed",
    "refunded",
  ];

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    filterPayments();
  }, [
    selectedFormation,
    selectedStatus,
    selectedMethod,
    selectedDate,
    payments,
  ]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/v1/student/payments");
      setPayments(response.data.payments);
      setFilteredPayments(response.data.payments);
      setError(null);
    } catch (err) {
      setError("Failed to load payments");
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterPayments = () => {
    let filtered = [...payments];

    if (selectedFormation && selectedFormation !== "all") {
      filtered = filtered.filter(
        (p) => p.session.formation?.name === selectedFormation
      );
    }

    if (selectedStatus && selectedStatus !== "all") {
      filtered = filtered.filter((p) => p.status === selectedStatus);
    }

    if (selectedMethod && selectedMethod !== "all") {
      filtered = filtered.filter((p) => p.payment_method === selectedMethod);
    }

    if (selectedDate) {
      filtered = filtered.filter(
        (p) =>
          format(new Date(p.payment_date), "yyyy-MM-dd") ===
          format(selectedDate, "yyyy-MM-dd")
      );
    }

    setFilteredPayments(filtered);
  };

  // Fonction pour obtenir la traduction du statut
  const getStatusLabel = (status: string): string => {
    switch (status) {
      case "completed":
        return "Complété";
      case "partial":
        return "Partiel";
      case "failed":
        return "Échoué";
      case "refunded":
        return "Remboursé";
      case "pending":
        return "En attente";
      default:
        return status;
    }
  };

  // Fonction pour obtenir la classe CSS du badge selon le statut
  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case "completed":
        return "bg-green-500 text-white";
      case "partial":
        return "bg-yellow-500 text-white";
      case "failed":
        return "bg-red-500 text-white";
      case "refunded":
        return "bg-gray-500 text-white";
      case "pending":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Fonction pour obtenir la variante du badge selon le statut
  const getStatusBadgeVariant = (
    status: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "completed":
        return "default";
      case "partial":
        return "secondary";
      case "failed":
        return "destructive";
      case "refunded":
        return "outline";
      case "pending":
        return "secondary";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg p-4 bg-destructive/10 text-destructive">
        {error}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mes Paiements</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filtres */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Select
            value={selectedFormation}
            onValueChange={setSelectedFormation}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Formation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les formations</SelectItem>
              {formations.map(
                (formation) =>
                  formation && (
                    <SelectItem key={formation} value={formation}>
                      {formation}
                    </SelectItem>
                  )
              )}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {getStatusLabel(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedMethod} onValueChange={setSelectedMethod}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Méthode de paiement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les méthodes</SelectItem>
              {methods.map((method) => (
                <SelectItem key={method} value={method}>
                  {method === "cash" ? "Espèces" : "Banque"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filteredPayments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Aucun paiement trouvé
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Formation</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Restant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Méthode</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">
                    {payment.session.formation?.name || "N/A"}
                  </TableCell>
                  <TableCell>{payment.amount} DT</TableCell>
                  <TableCell>{payment.remaining_amount} DT</TableCell>
                  <TableCell>
                    <Badge
                      variant={getStatusBadgeVariant(payment.status)}
                      className={getStatusBadgeClass(payment.status)}
                    >
                      {getStatusLabel(payment.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(payment.payment_date), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>
                    {payment.payment_method === "cash" ? "Espèces" : "Banque"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentList;
