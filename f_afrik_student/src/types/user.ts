import { Shield, GraduationCap, BookOpen, type LucideIcon } from 'lucide-react'

// Type pour le rôle venant du backend
export interface RoleObject {
  value: 'admin' | 'instructor' | 'student'
  label: string
}

// Type pour le rôle utilisé dans le front (juste la value)
export type RoleValue = 'admin' | 'instructor' | 'student' | null

// Tableau des rôles avec icônes et couleurs pour l'affichage
export const roles = [
  {
    value: 'admin',
    label: 'Administrateur',
    icon: Shield,
    color: 'text-red-600',
  },
  {
    value: 'instructor',
    label: 'Instructeur',
    icon: GraduationCap,
    color: 'text-blue-600',
  },
  {
    value: 'student',
    label: 'Étudiant',
    icon: BookOpen,
    color: 'text-green-600',
  },
] as const

export type RoleConfig = {
  value: 'admin' | 'instructor' | 'student'
  label: string
  icon: LucideIcon
  color: string
  bgColor: string
  borderColor: string
}

// Interface pour l'utilisateur venant du backend (avec role en objet)
export interface UserFromBackend {
  id: number
  first_name: string
  last_name: string
  email: string
  email_verified_at: string | null
  role: RoleObject | null
  permissions: string[]
  created_at: string
  updated_at: string
}

// Interface pour l'utilisateur utilisé dans le front (avec role en string)
export interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  email_verified_at: string | null
  role: RoleValue
  roleLabel?: string // Optionnel : le label du rôle pour l'affichage
  permissions: string[]
  created_at: string
  updated_at: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  two_factor: boolean
  user: UserFromBackend
}

// Helper pour transformer UserFromBackend en User
export function transformUser(userFromBackend: UserFromBackend): User {
  return {
    ...userFromBackend,
    role: userFromBackend.role?.value || null,
    roleLabel: userFromBackend.role?.label,
  }
}

// Types pour la gestion des utilisateurs (CRUD)
export interface CreateUserData {
  first_name: string
  last_name: string
  email: string
  role: 'admin' | 'instructor' | 'student'
}

export interface UpdateUserData {
  first_name?: string
  last_name?: string
  email?: string
  role?: 'admin' | 'instructor' | 'student'
  permissions?: string[]
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  errors?: Record<string, string[]>
}
