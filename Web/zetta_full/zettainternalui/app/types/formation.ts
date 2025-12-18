export interface Formation {
  id: string;
  slug: string;
  name: string;
  description?: string;
  image?: string;
  level: "beginner" | "intermediate" | "advanced";
  duration: number;
  price: number;
  discount_price: number;
  category: Categorie;
  prerequisites?: string[];
  sessions?: Session[];
  modules?: Module[];
  certifications?: Certification[];
  objectives?: string[];
  lesson_quizzes?: LessonQuiz[]; // Added for quiz functionality
  created_at: string;
  updated_at: string;
}

interface LessonQuiz {
  lesson_id: string;
  lesson_name: string;
  module_id: string;
  module_name: string;
  questions: QuizQuestion[];
}

interface QuizQuestion {
  id: string;
  question: string;
  answers: QuizAnswer[];
  difficulty: string;
  points: number;
  type: string;
}

interface QuizAnswer {
  id: number;
  text: string;
  correct: boolean;
}

interface Session {
  id: string;
  start_date: string;
  course_type?: "day course" | "night course";
  capacity?: number;
  end_date: string;
  teacher: Teacher;
}

interface Teacher {
  id: string;
  fullName: string;
  imageUrl?: string;
  email: string;
}

interface Module {
  id: string;
  name: string;
  description?: string;
  lessons: Lesson[];
}

interface Resource {
  id: string;
  lesson_id: string;
  title: string;
  description: string;
  file_path: string;
  type: "video" | "pdf" | "image" | "audio";
  size: number;
}

interface Lesson {
  id: string;
  name: string;
  resources: Resource[];
}

interface Certification {
  id: string;
  name: string;
}

export interface CreateFormationData {
  name: string;
  description?: string;
  image?: string;
  level: "beginner" | "intermediate" | "advanced";
  duration: number;
  price: number;
  discount_price: number;
  category_id: string;
  prerequisites?: string[];
  objectives?: string[];
  module_ids?: string[] | null;
  certification_ids?: string[] | null;
  sessions?: {
    teacher_id: string;
    course_type: "day course" | "night course";
    start_date: string;
    end_date: string;
    capacity: number;
  }[];
}

export interface UpdateFormationData {
  name: string;
  description?: string;
  image?: string;
  level: "beginner" | "intermediate" | "advanced";
  duration: number;
  price: number;
  discount_price: number;
  category_id: string;
  prerequisites?: string[];
  objectives?: string[];
  module_ids?: string[] | null;
  certification_ids?: string[] | null;
  sessions?: {
    teacher_id: string;
    course_type: "day course" | "night course";
    start_date: string;
    end_date: string;
    capacity: number;
  }[];
}

import { z } from "zod";
import type { Categorie } from "./categorie";

export const formationSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string().min(1, "Le nom est requis"),
  image: z.string().url("URL invalide").optional(),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  duration: z.number().min(1, "La durée est requise"),
  price: z.number().min(0, "Le prix est requis"),
  discount_price: z.number().min(0, "Le prix est requis"),
  category: z.object({
    id: z.string(),
    name: z.string(),
  }),
  modules: z.array(z.object({ id: z.string(), name: z.string() })).optional(), // Ajout de modules dans le schéma
  certifications: z
    .array(z.object({ id: z.string(), name: z.string() }))
    .optional(), // Ajout de certifications dans le schéma
  prerequisites: z.array(z.string()).optional(),
  objectives: z.array(z.string()).optional(),
  description: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Type dérivé du schéma
export type FormationSchema = z.infer<typeof formationSchema>;
