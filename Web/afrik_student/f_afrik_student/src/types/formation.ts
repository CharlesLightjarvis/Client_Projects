import type { Module } from './module'

// Enum pour les niveaux de formation
export enum FormationLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

// Type pour le level avec value et label (venant du backend)
export interface LevelType {
  value: FormationLevel
  label: string
}

// Interface pour la formation (affichage)
export interface Formation {
  id: string
  title: string
  description: string | null
  learning_objectives: string | null
  target_skills: string[] | null
  level: LevelType
  duration: number
  image_url: string | null
  price: number | null
  modules?: Module[]
  created_at: string
  updated_at: string
}

// Types pour la création de formation
export interface CreateFormationData {
  title: string
  description?: string | null
  learning_objectives?: string | null
  target_skills?: string[] | null
  level: FormationLevel
  duration: number
  image_url?: File | null // Changed from string to File for upload
  price?: number | null
  module_ids?: string[]
}

// Types pour la mise à jour de formation
export interface UpdateFormationData {
  title?: string
  description?: string | null
  learning_objectives?: string | null
  target_skills?: string[] | null
  level?: FormationLevel
  duration?: number
  image_url?: File | null // Changed from string to File for upload
  price?: number | null
  module_ids?: string[]
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  errors?: Record<string, string[]>
}
