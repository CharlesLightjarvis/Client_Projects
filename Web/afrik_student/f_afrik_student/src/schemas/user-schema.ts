import { z } from 'zod'

// Zod schema pour CREATE USER
export const createUserSchema = z.object({
  first_name: z
    .string()
    .min(2, 'Le prénom requiert au moins 2 caractères')
    .max(255, 'Le prénom ne doit pas dépasser 255 caractères'),
  last_name: z
    .string()
    .min(2, 'Le nom requiert au moins 2 caractères')
    .max(255, 'Le nom ne doit pas dépasser 255 caractères'),
  email: z
    .string()
    .email('Veuillez entrer une adresse email valide')
    .max(255, "L'email ne doit pas dépasser 255 caractères"),
  role: z.enum(['admin', 'instructor', 'student'], {
    message: 'Veuillez sélectionner un rôle valide',
  }),
})

// Zod schema pour UPDATE USER (tous les champs optionnels)
export const updateUserSchema = z.object({
  first_name: z
    .string()
    .min(2, 'Le prénom requiert au moins 2 caractères')
    .max(255, 'Le prénom ne doit pas dépasser 255 caractères')
    .optional(),
  last_name: z
    .string()
    .min(2, 'Le nom requiert au moins 2 caractères')
    .max(255, 'Le nom ne doit pas dépasser 255 caractères')
    .optional(),
  email: z
    .string()
    .email('Veuillez entrer une adresse email valide')
    .max(255, "L'email ne doit pas dépasser 255 caractères")
    .optional(),
  role: z
    .enum(['admin', 'instructor', 'student'], {
      message: 'Veuillez sélectionner un rôle valide',
    })
    .optional(),
})

// Inférer les types depuis les schémas
export type CreateUserFormData = z.infer<typeof createUserSchema>
export type UpdateUserFormData = z.infer<typeof updateUserSchema>

// Valeurs par défaut pour le formulaire de création
export const createUserDefaultValues: CreateUserFormData = {
  first_name: '',
  last_name: '',
  email: '',
  role: 'student',
}

// Fonction pour obtenir les valeurs par défaut pour la mise à jour
export const getUpdateUserDefaultValues = (user: {
  first_name: string
  last_name: string
  email: string
  role: 'admin' | 'instructor' | 'student'
}): UpdateUserFormData => ({
  first_name: user.first_name,
  last_name: user.last_name,
  email: user.email,
  role: user.role,
})
