import type { Attachment, ExternalLink } from './attachment'
import type { Module } from './module'

// Interface pour Lesson (données du frontend)
export interface Lesson {
  id: string
  title: string
  content: string | null
  order: number
  module_id: string | null
  module: Module
  attachments: Attachment[]
  created_at: string
  updated_at: string
}

// Interface pour les données reçues du backend
export interface LessonFromBackend {
  id: string
  title: string
  content: string | null
  order: number
  module_id: string | null
  module: Module
  attachments: Attachment[]
  created_at: string
  updated_at: string
}

// Types pour la gestion des leçons (CRUD)
export interface CreateLessonData {
  title: string
  content?: string | null
  order?: number
  module_id?: string | null // Optionnel et nullable
  attachments?: File[] | null // Fichiers à uploader
  external_links?: ExternalLink[] | null // Liens externes
}

export interface UpdateLessonData {
  title?: string
  content?: string | null
  order?: number
  module_id?: string | null // Optionnel et nullable
  attachments?: File[] | null // Nouveaux fichiers à uploader
  external_links?: ExternalLink[] | null // Nouveaux liens externes
  delete_attachments?: string[] // IDs des attachments à supprimer
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  errors?: Record<string, string[]>
}
