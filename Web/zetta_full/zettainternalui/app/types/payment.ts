import { z } from "zod";

// Définition de l'interface FormationSession
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

export const paymentSchema = z.object({
  id: z.string(),
  amount: z.number().min(0, "Le montant doit être positif"),
  remaining_amount: z.number().min(0, "Le montant restant doit être positif"),
  payment_method: z.enum(["cash", "banque"], {
    errorMap: () => ({ message: "Méthode de paiement invalide" }),
  }),
  status: z.enum(["partial", "completed"], {
    errorMap: () => ({ message: "Statut invalide" }),
  }),
  notes: z.string().optional(),
  payment_date: z.string().datetime(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  student: z.object({
    id: z.string(),
    fullName: z.string(),
    email: z.string().email("Email invalide"),
    status: z.string(),
    imageUrl: z.string().url("URL invalide").optional(),
    phone: z.string().optional(),
    role: z.string(),
  }),
  session: z.object({
    id: z.string(),
    formation_id: z.string(),
    teacher_id: z.string(),
    course_type: z.string(),
    start_date: z.string(),
    end_date: z.string(),
    capacity: z.number(),
    status: z.string(),
    enrolled_students: z.number(),
    price: z.number().optional(),
    name: z.string().optional(),
    formation: z
      .object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
        description: z.string().optional(),
        image: z.string().url("URL invalide").optional(),
        level: z.string().optional(),
        duration: z.string().optional(),
        price: z.number().optional(),
      })
      .optional(),
  }),
});

// Type dérivé du schéma
export type PaymentSchema = z.infer<typeof paymentSchema>;

// Schéma pour la création d'un paiement
export const createPaymentSchema = z.object({
  student_id: z.string(),
  session_id: z.string(),
  amount: z.number().min(0, "Le montant doit être positif"),
  payment_method: z.enum(["cash", "banque"], {
    errorMap: () => ({ message: "Méthode de paiement invalide" }),
  }),
  payment_date: z.string().datetime(),
  notes: z.string().optional(),
});

// Type pour la création
export type CreatePaymentSchema = z.infer<typeof createPaymentSchema>;

// Schéma pour la mise à jour d'un paiement
export const updatePaymentSchema = createPaymentSchema.partial().extend({
  id: z.string(),
  status: z.enum(["partial", "completed"]).optional(),
});

// Type pour la mise à jour
export type UpdatePaymentSchema = z.infer<typeof updatePaymentSchema>;

// Types pour les requêtes
export interface CreatePaymentData {
  student_id: string;
  session_id: string;
  amount: number;
  payment_method: "cash" | "banque";
  payment_date: string;
  notes?: string;
}

export interface UpdatePaymentData {
  student_id?: string;
  session_id?: string;
  amount?: number;
  payment_method?: "cash" | "banque";
  payment_date?: string;
  status?: "pending" | "completed" | "failed" | "refunded";
  notes?: string;
}

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

export interface Payment {
  id: string;
  amount: number;
  remaining_amount: number;
  payment_method: "cash" | "banque";
  status: "partial" | "completed";
  notes?: string;
  payment_date: string;
  created_at: string;
  updated_at: string;
  student: User;
  session: FormationSession;
}
