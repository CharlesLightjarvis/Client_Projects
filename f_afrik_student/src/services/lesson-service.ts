import api from '@/lib/api'
import type {
  Lesson,
  LessonFromBackend,
  CreateLessonData,
  UpdateLessonData,
} from '@/types/lesson'

interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
}

const transformLesson = (lesson: LessonFromBackend): Lesson => {
  return {
    id: lesson.id,
    title: lesson.title,
    content: lesson.content,
    link: lesson.link,
    order: lesson.order,
    module_id: lesson.module_id,
    created_at: lesson.created_at,
    updated_at: lesson.updated_at,
  }
}

export class LessonService {
  async getLessons(): Promise<Lesson[]> {
    try {
      const response =
        await api.get<ApiResponse<LessonFromBackend[]>>('/api/lessons')
      return response.data.data.map(transformLesson)
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(
          error.message || 'Erreur lors de la récupération des leçons',
        )
      }
      throw new Error('Erreur lors de la récupération des leçons')
    }
  }

  async getLesson(id: string): Promise<Lesson> {
    try {
      const response = await api.get<ApiResponse<LessonFromBackend>>(
        `/api/lessons/${id}`,
      )
      return transformLesson(response.data.data)
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(
          error.message || 'Erreur lors de la récupération de la leçon',
        )
      }
      throw new Error('Erreur lors de la récupération de la leçon')
    }
  }

  async createLesson(
    data: CreateLessonData,
  ): Promise<{ lesson: Lesson; message: string }> {
    try {
      const response = await api.post<ApiResponse<LessonFromBackend>>(
        '/api/lessons',
        data,
      )
      return {
        lesson: transformLesson(response.data.data),
        message: response.data.message,
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(
          error.message || 'Erreur lors de la création de la leçon',
        )
      }
      throw new Error('Erreur lors de la création de la leçon')
    }
  }

  async updateLesson(
    id: string,
    data: UpdateLessonData,
  ): Promise<{ lesson: Lesson; message: string }> {
    try {
      const response = await api.put<ApiResponse<LessonFromBackend>>(
        `/api/lessons/${id}`,
        data,
      )
      return {
        lesson: transformLesson(response.data.data),
        message: response.data.message,
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(
          error.message || 'Erreur lors de la mise à jour de la leçon',
        )
      }
      throw new Error('Erreur lors de la mise à jour de la leçon')
    }
  }

  async deleteLesson(
    id: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete<ApiResponse<null>>(`/api/lessons/${id}`)
      return {
        success: response.data.success,
        message: response.data.message,
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(
          error.message || 'Erreur lors de la suppression de la leçon',
        )
      }
      throw new Error('Erreur lors de la suppression de la leçon')
    }
  }
}

export const lessonService = new LessonService()
