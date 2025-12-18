export interface User {
  id: string;
  fullName: string;
  email: string;
  status: "active" | "inactive ";
  imageUrl?: string;
  phone?: string;
  role: "admin" | "teacher" | "student";
  bio?: string;
  title?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  fullName: string;
  email: string;
  role: string;
  phone?: string;
  title?: string;
  bio?: string;
}

export interface UpdateUserData {
  fullName: string;
  email: string;
  role: string;
  phone?: string;
  title?: string;
  bio?: string;
}

import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  fullName: z.string().min(1, "Le nom complet est requis"),
  email: z.string().email("Email invalide"),
  status: z.enum(["active", "inactive "]), // Notez l'espace dans "inactive "
  imageUrl: z.string().url("URL invalide").optional(),
  phone: z.string().optional(),
  role: z.enum(["admin", "teacher", "student"]),
  bio: z.string().optional(),
  title: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Type dérivé du schéma
export type UserSchema = z.infer<typeof userSchema>;

// Schéma pour la création d'un utilisateur (sans id et timestamps)
export const createUserSchema = userSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// Schéma pour la mise à jour d'un utilisateur (tous les champs optionnels sauf id)
export const updateUserSchema = userSchema
  .omit({ id: true, created_at: true, updated_at: true })
  .partial()
  .extend({
    id: z.string(),
  });
