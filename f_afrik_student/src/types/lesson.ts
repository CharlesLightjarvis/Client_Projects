// Type pour les liens externes
export type ExternalLinkType =
  | 'youtube'
  | 'google_drive'
  | 'tiktok'
  | 'vimeo'
  | 'dropbox'
  | 'onedrive'
  | 'other'

// Interface pour un lien externe
export interface ExternalLink {
  url: string
  name: string
  type?: ExternalLinkType
}

// Interface pour un attachement (fichier ou lien)
export interface Attachment {
  id: string
  name: string
  url: string
  type: string // Type de fichier (video, pdf, etc.) ou type de lien
  is_external: boolean
  created_at: string
}

// Interface pour Lesson (données du frontend)
export interface Lesson {
  id: string
  title: string
  content: string | null
  order: number
  module_id: string
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
  module_id: string
  attachments: Attachment[]
  created_at: string
  updated_at: string
}

// Types pour la gestion des leçons (CRUD)
export interface CreateLessonData {
  title: string
  content?: string | null
  order?: number
  module_id?: string // Optionnel car peut être fourni lors de la création du module
  attachments?: File[] | null // Fichiers à uploader
  external_links?: ExternalLink[] | null // Liens externes
}

export interface UpdateLessonData {
  title?: string
  content?: string | null
  order?: number
  module_id?: string
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
