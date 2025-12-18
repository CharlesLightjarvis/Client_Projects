import { z } from 'zod'

// Schema pour l'enrollment d'un seul étudiant
export const singleEnrollmentSchema = z.object({
  student_id: z.string().uuid('ID étudiant invalide'),
  course_session_id: z.string().uuid('ID session invalide'),
})

// Schema pour l'enrollment de plusieurs étudiants
export const bulkEnrollmentSchema = z.object({
  student_ids: z
    .array(z.string().uuid('ID étudiant invalide'))
    .min(1, 'Sélectionnez au moins un étudiant'),
  course_session_id: z.string().uuid('ID session invalide'),
})

export type SingleEnrollmentSchema = z.infer<typeof singleEnrollmentSchema>
export type BulkEnrollmentSchema = z.infer<typeof bulkEnrollmentSchema>
