import { z } from "zod";

// Base interfaces
interface Formation {
  id: string;
  name: string;
}

export interface Lesson {
  id?: string;
  name: string;
  description?: string;
  duration?: number;
}

// Zod schemas
const lessonSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  duration: z.number().optional(), // Ajout de duration dans le schéma
});

export const moduleSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Le nom est requis"),
  slug: z.string(),
  formations: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .optional()
    .default([]),
  lessons: z.array(lessonSchema).optional().default([]),
  description: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Type dérivé du schéma
export type ModuleSchema = z.infer<typeof moduleSchema>;

// Interface Module alignée avec le schéma
export interface Module {
  id: string;
  name: string;
  slug: string;
  description?: string;
  formations: Formation[];
  lessons: z.infer<typeof lessonSchema>[];
  created_at: string;
  updated_at: string;
}

// Interfaces pour les requêtes
export interface CreateModuleData {
  name: string;
  description?: string;
  formation_ids?: string[] | null;
  existing_lesson_ids?: string[];
  new_lessons?: Lesson[];
}

export interface UpdateModuleData {
  name: string;
  description?: string;
  formation_ids?: string[] | null;
  existing_lesson_ids?: string[];
  new_lessons?: Lesson[];
}
