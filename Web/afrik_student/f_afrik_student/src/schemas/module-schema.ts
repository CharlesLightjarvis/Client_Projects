import { z } from 'zod'

// Zod schema pour CREATE MODULE
export const createModuleSchema = z.object({
  title: z
    .string()
    .min(3, 'Le titre requiert au moins 3 caractères')
    .max(255, 'Le titre ne doit pas dépasser 255 caractères'),
  description: z
    .string()
    .min(10, 'La description requiert au moins 10 caractères')
    .max(1000, 'La description ne doit pas dépasser 1000 caractères'),
  formation_id: z.string().uuid('Veuillez sélectionner une formation valide'),
})

// Zod schema pour UPDATE MODULE (tous les champs optionnels)
export const updateModuleSchema = z.object({
  title: z
    .string()
    .min(3, 'Le titre requiert au moins 3 caractères')
    .max(255, 'Le titre ne doit pas dépasser 255 caractères')
    .optional(),
  description: z
    .string()
    .min(10, 'La description requiert au moins 10 caractères')
    .max(1000, 'La description ne doit pas dépasser 1000 caractères')
    .optional(),
  formation_id: z.string().uuid('Veuillez sélectionner une formation valide').optional(),
})

// Inférer les types depuis les schémas
export type CreateModuleFormData = z.infer<typeof createModuleSchema>
export type UpdateModuleFormData = z.infer<typeof updateModuleSchema>

// Valeurs par défaut pour le formulaire de création
export const createModuleDefaultValues: CreateModuleFormData = {
  title: '',
  description: '',
  formation_id: '',
}

// Fonction pour obtenir les valeurs par défaut pour la mise à jour
export const getUpdateModuleDefaultValues = (module: {
  title: string
  description: string
  formation_id: string
}): UpdateModuleFormData => ({
  title: module.title,
  description: module.description,
  formation_id: module.formation_id,
})
