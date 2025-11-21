// Interface pour Lesson (données du frontend)
export interface Lesson {
  id?: string
  title: string
  content: string | null
  link: string | null
  order: number
  module_id?: string
  image_url?: string | null
  created_at?: string
  updated_at?: string
}

// Interface pour les données reçues du backend
export interface LessonFromBackend {
  id: string
  title: string
  content: string | null
  link: string | null
  order: number
  module_id: string
  image_url?: string | null
  created_at: string
  updated_at: string
}

// Types pour la gestion des leçons (CRUD)
export interface CreateLessonData {
  title: string
  content?: string | null
  link?: string | null
  order?: number
  module_id?: string
  image_url?: File | null
}

export interface UpdateLessonData {
  title?: string
  content?: string | null
  link?: string | null
  order?: number
  module_id?: string
  image_url?: File | null
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  errors?: Record<string, string[]>
}
