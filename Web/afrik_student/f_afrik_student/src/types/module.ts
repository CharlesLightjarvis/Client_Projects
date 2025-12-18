import type { Formation } from './formation'
import type { Lesson, CreateLessonData, UpdateLessonData } from './lesson'

// Interface pour le module
export interface Module {
  id?: string
  formation_id: string
  formation: Formation
  title: string
  description: string | null
  instructor_id: string | null
  order: number
  lessons?: Lesson[]
}

// Types pour la gestion des modules (CRUD)
export interface CreateModuleData {
  formation_id: string
  title: string
  description?: string | null
  order: number
  lessons?: CreateLessonData[]
}

export interface UpdateModuleData {
  title?: string
  description?: string | null
  order?: number
  lessons?: UpdateLessonData[]
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  errors?: Record<string, string[]>
}
