import { create } from "zustand";
import { api } from "~/api";
import { toast } from "sonner";
import type {
  CreatePaymentData,
  PaymentSchema,
  UpdatePaymentData,
} from "~/types/payment";

interface PaymentsState {
  payments: PaymentSchema[];
  isLoading: boolean;
  error: string | null;
  selectedPayment: PaymentSchema | null;

  // Actions
  getPayments: () => Promise<void>;
  createPayment: (paymentData: CreatePaymentData) => Promise<void>;
  updatePayment: (
    paymentId: string,
    paymentData: UpdatePaymentData
  ) => Promise<void>;
  deletePayment: (paymentId: string) => Promise<void>;
  setSelectedPayment: (payment: PaymentSchema | null) => void;
}

export const usePaymentsStore = create<PaymentsState>()((set, get) => ({
  payments: [],
  isLoading: false,
  error: null,
  selectedPayment: null,

  getPayments: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<{ payments: PaymentSchema[] }>(
        "/api/v1/admin/payments"
      );
      set({
        payments: response.data.payments,
        isLoading: false,
        error: null,
      });
      console.log(response.data.payments);
    } catch (error) {
      console.error("Erreur lors du chargement des paiements:", error);
      set({
        error: "Erreur lors du chargement des paiements",
        isLoading: false,
        payments: [],
      });
      throw error;
    }
  },

  createPayment: async (paymentData: CreatePaymentData) => {
    set({ isLoading: true, error: null });
    try {
      await api.post("/api/v1/admin/payments", paymentData);
      toast.success("Paiement créé avec succès"); // Premier toast
      await get().getPayments();
    } catch (error) {
      console.error("Erreur lors de la création du paiement:", error);
      set({
        error: "Erreur lors de la création du paiement",
        isLoading: false,
      });
      toast.error("Erreur lors de la création du paiement"); // Premier toast d'erreur
      throw error;
    }
  },

  updatePayment: async (paymentId: string, paymentData: UpdatePaymentData) => {
    set({ isLoading: true, error: null });
    try {
      await api.put(`/api/v1/admin/payments/${paymentId}`, paymentData);
      toast.success("Paiement mis à jour avec succès");
      await get().getPayments();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du paiement:", error);
      set({
        error: "Erreur lors de la mise à jour du paiement",
        isLoading: false,
      });
      toast.error("Erreur lors de la mise à jour du paiement");
      throw error;
    }
  },

  deletePayment: async (paymentId: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/api/v1/admin/payments/${paymentId}`);
      toast.success("Paiement supprimé avec succès");
      await get().getPayments();
    } catch (error) {
      console.error("Erreur lors de la suppression du paiement:", error);
      set({
        error: "Erreur lors de la suppression du paiement",
        isLoading: false,
      });
      toast.error("Erreur lors de la suppression du paiement");
      throw error;
    }
  },

  setSelectedPayment: (payment: PaymentSchema | null) => {
    set({ selectedPayment: payment });
  },
}));
