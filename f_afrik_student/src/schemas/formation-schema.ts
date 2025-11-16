import { z } from 'zod'
import { FormationLevel } from '@/types/formation'

// Zod schema pour CREATE FORMATION
export const createFormationSchema = z.object({
  title: z
    .string()
    .min(3, 'Le titre requiert au moins 3 caractères')
    .max(255, 'Le titre ne doit pas dépasser 255 caractères'),
  description: z.string().optional().nullable(),
  learning_objectives: z.string().optional().nullable(),
  target_skills: z.array(z.string()).optional().nullable(),
  level: z.nativeEnum(FormationLevel, 'Veuillez sélectionner un niveau'),
  duration: z
    .number()
    .int()
    .min(1, 'La durée doit être au moins 1 heure')
    .max(10000, 'La durée ne peut pas dépasser 10000 heures'),
  image: z.string().url('L\'image doit être une URL valide').optional().nullable(),
  price: z
    .number()
    .min(0, 'Le prix ne peut pas être négatif')
    .max(1000000, 'Le prix est trop élevé')
    .optional()
    .nullable(),
})

// Zod schema pour UPDATE FORMATION (tous les champs optionnels)
export const updateFormationSchema = z.object({
  title: z
    .string()
    .min(3, 'Le titre requiert au moins 3 caractères')
    .max(255, 'Le titre ne doit pas dépasser 255 caractères')
    .optional(),
  description: z.string().optional().nullable(),
  learning_objectives: z.string().optional().nullable(),
  target_skills: z.array(z.string()).optional().nullable(),
  level: z.nativeEnum(FormationLevel).optional(),
  duration: z
    .number()
    .int()
    .min(1, 'La durée doit être au moins 1 heure')
    .max(10000, 'La durée ne peut pas dépasser 10000 heures')
    .optional(),
  image: z.string().url('L\'image doit être une URL valide').optional().nullable(),
  price: z
    .number()
    .min(0, 'Le prix ne peut pas être négatif')
    .max(1000000, 'Le prix est trop élevé')
    .optional()
    .nullable(),
})

// Inférer les types depuis les schémas
export type CreateFormationFormData = z.infer<typeof createFormationSchema>
export type UpdateFormationFormData = z.infer<typeof updateFormationSchema>

// Valeurs par défaut pour le formulaire de création
export const createFormationDefaultValues: CreateFormationFormData = {
  title: '',
  description: null,
  learning_objectives: null,
  target_skills: null,
  level: FormationLevel.EASY,
  duration: 1,
  image: null,
  price: null,
}

// Fonction pour obtenir les valeurs par défaut pour la mise à jour
export const getUpdateFormationDefaultValues = (formation: {
  title: string
  description: string | null
  learning_objectives: string | null
  target_skills: string[] | null
  level: { value: FormationLevel; label: string }
  duration: number
  image: string | null
  price: number | null
}): UpdateFormationFormData => ({
  title: formation.title,
  description: formation.description,
  learning_objectives: formation.learning_objectives,
  target_skills: formation.target_skills,
  level: formation.level.value,
  duration: formation.duration,
  image: formation.image,
  price: formation.price,
})
