export interface Categorie {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCategorieData {
  name: string;
  description?: string;
}

export interface UpdateCategorieData {
  name: string;
  description?: string;
}

import { z } from "zod";

export const categorieSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Type dérivé du schéma
export type CategorieSchema = z.infer<typeof categorieSchema>;
