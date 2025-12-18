import { z } from 'zod'

// Schéma pour un lien externe
export const externalLinkSchema = z.object({
  url: z.string().url('URL invalide'),
  name: z.string().min(1, 'Le nom est requis').max(255, 'Le nom ne doit pas dépasser 255 caractères'),
  type: z.enum(['youtube', 'google_drive', 'tiktok', 'vimeo', 'dropbox', 'onedrive', 'other']).optional(),
})

// Zod schema pour CREATE LESSON
export const createLessonSchema = z.object({
  title: z
    .string()
    .min(3, 'Le titre requiert au moins 3 caractères')
    .max(255, 'Le titre ne doit pas dépasser 255 caractères'),
  content: z.string().optional().nullable(),
  order: z
    .number()
    .int()
    .min(1, "L'ordre doit être au moins 1")
    .optional(),
  module_id: z.string().uuid('ID de module invalide').optional().nullable(),
  attachments: z.array(z.instanceof(File)).optional().nullable(),
  external_links: z.array(externalLinkSchema).optional().nullable(),
})

// Zod schema pour UPDATE LESSON (tous les champs optionnels)
export const updateLessonSchema = z.object({
  title: z
    .string()
    .min(3, 'Le titre requiert au moins 3 caractères')
    .max(255, 'Le titre ne doit pas dépasser 255 caractères')
    .optional(),
  content: z.string().optional().nullable(),
  order: z
    .number()
    .int()
    .min(1, "L'ordre doit être au moins 1")
    .optional(),
  module_id: z.string().uuid('ID de module invalide').optional().nullable(),
  attachments: z.array(z.instanceof(File)).optional().nullable(),
  external_links: z.array(externalLinkSchema).optional().nullable(),
  delete_attachments: z.array(z.string().uuid()).optional(),
})

// Inférer les types depuis les schémas
export type CreateLessonFormData = z.infer<typeof createLessonSchema>
export type UpdateLessonFormData = z.infer<typeof updateLessonSchema>
export type ExternalLinkFormData = z.infer<typeof externalLinkSchema>

// Valeurs par défaut pour le formulaire de création
export const createLessonDefaultValues: CreateLessonFormData = {
  title: '',
  content: null,
  order: 1,
  module_id: null,
  attachments: [],
  external_links: [],
}

// Fonction pour obtenir les valeurs par défaut pour la mise à jour
export const getUpdateLessonDefaultValues = (lesson: {
  title: string
  content: string | null
  order: number
  module_id: string | null
}): UpdateLessonFormData => ({
  title: lesson.title,
  content: lesson.content,
  order: lesson.order,
  module_id: lesson.module_id,
  attachments: [],
  external_links: [],
})
