interface Formation {
  id: string;
  name: string;
}

interface Teacher {
  id: string;
  fullName: string;
  imageUrl?: string;
}

export interface Session {
  id: string;
  course_type: "day course" | "night course";
  start_date: string;
  end_date: string;
  status: "active" | "cancelled" | "completed";
  capacity: number;
  enrolled_students: number;
  students?: Student[];
  formation: Formation;
  teacher: Teacher;
  created_at: string;
  updated_at: string;
}

interface Student {
  id: string;
  fullName: string;
  imageUrl?: string;
}

export interface CreateSessionData {
  formation_id: string;
  teacher_id: string;
  course_type: "day course" | "night course";
  start_date: string;
  end_date: string;
  capacity: number;
}

export interface UpdateSessionData {
  formation_id: string;
  teacher_id: string;
  status?: "active" | "cancelled" | "completed";
  course_type: "day course" | "night course";
  start_date: string;
  end_date: string;
  capacity: number;
}

import { z } from "zod";

export const sessionSchema = z.object({
  id: z.string(),
  formation: z.object({
    id: z.string(),
    name: z.string(),
  }),
  teacher: z.object({
    id: z.string(),
    imageUrl: z.string().url("URL invalide").optional(),
    fullName: z.string(),
  }),
  course_type: z.enum(["day course", "night course"]),
  start_date: z.string().datetime(),
  status: z.enum(["active", "cancelled", "completed"]),
  end_date: z.string().datetime(),
  capacity: z.number().min(1, "La capacité est requise"),
  enrolled_students: z.number().min(0, "Le nombre d'étudiants est requis"),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Type dérivé du schéma
export type SessionSchema = z.infer<typeof sessionSchema>;
