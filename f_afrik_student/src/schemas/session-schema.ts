import { z } from 'zod'

// Schema pour l'étape 1 : Informations de base de la session
export const sessionBasicInfoSchema = z
  .object({
    formation_id: z
      .string()
      .min(1, 'Veuillez sélectionner une formation')
      .uuid('Veuillez sélectionner une formation valide'),
    start_date: z.string().min(1, 'La date de début est requise'),
    end_date: z.string().min(1, 'La date de fin est requise'),
    status: z
      .enum(['scheduled', 'ongoing', 'completed', 'cancelled'])
      .optional()
      .nullable(),
    max_students: z
      .number()
      .int('Le nombre maximum doit être un entier')
      .min(1, 'Le nombre minimum est 1')
      .max(100, 'Le nombre maximum est 100')
      .optional()
      .nullable(),
    location: z
      .string()
      .max(255, 'La localisation ne peut pas dépasser 255 caractères')
      .optional()
      .nullable(),
  })
  .refine(
    (data) => {
      const start = new Date(data.start_date)
      const end = new Date(data.end_date)
      return end > start
    },
    {
      message: 'La date de fin doit être après la date de début',
      path: ['end_date'],
    },
  )

// Schema pour l'étape 2 : Affectation des instructeurs aux modules
export const moduleInstructorSchema = z.object({
  module_id: z.string().uuid(),
  instructor_id: z.string().uuid(),
})

export const sessionInstructorsSchema = z.object({
  module_instructors: z.array(moduleInstructorSchema).optional(),
})

// Schema complet pour la création d'une session
export const createSessionSchema = z
  .object({
    formation_id: z
      .string()
      .min(1, 'Veuillez sélectionner une formation')
      .uuid('Veuillez sélectionner une formation valide'),
    start_date: z.string().min(1, 'La date de début est requise'),
    end_date: z.string().min(1, 'La date de fin est requise'),
    status: z
      .enum(['scheduled', 'ongoing', 'completed', 'cancelled'])
      .optional()
      .nullable(),
    max_students: z
      .number()
      .int('Le nombre maximum doit être un entier')
      .min(1, 'Le nombre minimum est 1')
      .max(100, 'Le nombre maximum est 100')
      .optional()
      .nullable(),
    location: z
      .string()
      .max(255, 'La localisation ne peut pas dépasser 255 caractères')
      .optional()
      .nullable(),
    module_instructors: z.array(moduleInstructorSchema).optional(),
  })
  .refine(
    (data) => {
      const start = new Date(data.start_date)
      const end = new Date(data.end_date)
      return end > start
    },
    {
      message: 'La date de fin doit être après la date de début',
      path: ['end_date'],
    },
  )

export const updateSessionSchema = z
  .object({
    formation_id: z
      .string()
      .min(1, 'Veuillez sélectionner une formation')
      .uuid('Veuillez sélectionner une formation valide')
      .optional()
      .or(z.literal('')),
    start_date: z.string().min(1, 'La date de début est requise').optional(),
    end_date: z.string().min(1, 'La date de fin est requise').optional(),
    status: z
      .enum(['scheduled', 'ongoing', 'completed', 'cancelled'])
      .optional()
      .nullable(),
    max_students: z
      .number()
      .int('Le nombre maximum doit être un entier')
      .min(1, 'Le nombre minimum est 1')
      .max(100, 'Le nombre maximum est 100')
      .optional()
      .nullable(),
    location: z
      .string()
      .max(255, 'La localisation ne peut pas dépasser 255 caractères')
      .optional()
      .nullable(),
  })
  .refine(
    (data) => {
      if (data.start_date && data.end_date) {
        const start = new Date(data.start_date)
        const end = new Date(data.end_date)
        return end > start
      }
      return true
    },
    {
      message: 'La date de fin doit être après la date de début',
      path: ['end_date'],
    },
  )

export type SessionBasicInfoSchema = z.infer<typeof sessionBasicInfoSchema>
export type SessionInstructorsSchema = z.infer<typeof sessionInstructorsSchema>
export type CreateSessionSchema = z.infer<typeof createSessionSchema>
export type UpdateSessionSchema = z.infer<typeof updateSessionSchema>
