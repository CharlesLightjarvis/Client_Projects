import { z } from 'zod'

// Schéma Zod pour la création d'un post
export const createPostSchema = z.object({
  title: z
    .string()
    .min(5, 'Le titre requiert au moins 5 caractères')
    .max(255, 'Le titre ne doit pas dépasser 255 caractères'),
  description: z
    .string()
    .min(5, 'La description requiert au moins 5 caractères')
    .max(500, 'La description ne doit pas dépasser 500 caractères'),
})

// Schéma Zod pour la mise à jour d'un post (champs optionnels)
export const updatePostSchema = z.object({
  title: z
    .string()
    .max(255, 'Le titre ne doit pas dépasser 255 caractères')
    .optional(),
  description: z
    .string()
    .max(500, 'La description ne doit pas dépasser 500 caractères')
    .optional(),
})

// Types TypeScript inférés depuis les schémas Zod
export type CreatePostFormData = z.infer<typeof createPostSchema>
export type UpdatePostFormData = z.infer<typeof updatePostSchema>

// Valeurs par défaut pour le formulaire de création
export const createPostDefaultValues: CreatePostFormData = {
  title: '',
  description: '',
}

// Fonction utilitaire pour obtenir les valeurs par défaut d'un post existant
export const getUpdatePostDefaultValues = (post: {
  title: string
  description: string
}): UpdatePostFormData => ({
  title: post.title,
  description: post.description,
})
