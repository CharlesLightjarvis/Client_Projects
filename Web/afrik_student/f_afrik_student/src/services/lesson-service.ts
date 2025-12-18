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
    attachments: lesson.attachments,
    order: lesson.order,
    module_id: lesson.module_id,
    module: lesson.module,
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

  async getInstructorLessons(): Promise<Lesson[]> {
    try {
      const response = await api.get<ApiResponse<LessonFromBackend[]>>(
        '/api/instructor/lessons',
      )
      return response.data.data.map(transformLesson)
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(
          error.message ||
            "Erreur lors de la récupération des leçons de l'instructeur",
        )
      }
      throw new Error(
        "Erreur lors de la récupération des leçons de l'instructeur",
      )
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
      // Create FormData for file upload
      const formData = new FormData()

      // Append basic fields
      formData.append('title', data.title)
      if (data.content) formData.append('content', data.content)
      if (data.order) formData.append('order', data.order.toString())
      if (data.module_id) formData.append('module_id', data.module_id)

      // Append attachments (files)
      if (data.attachments && data.attachments.length > 0) {
        data.attachments.forEach((file) => {
          formData.append('attachments[]', file)
        })
      }

      // Append external_links as JSON
      if (data.external_links && data.external_links.length > 0) {
        data.external_links.forEach((link, index) => {
          formData.append(`external_links[${index}][url]`, link.url)
          formData.append(`external_links[${index}][name]`, link.name)
          if (link.type) {
            formData.append(`external_links[${index}][type]`, link.type)
          }
        })
      }

      const response = await api.post<ApiResponse<LessonFromBackend>>(
        '/api/lessons',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      return {
        lesson: transformLesson(response.data.data),
        message: response.data.message,
      }
    } catch (error: any) {
      if (error.response?.data) {
        const err: any = new Error(
          error.response.data.message ||
            'Erreur lors de la création de la leçon',
        )
        err.errors = error.response.data.errors
        throw err
      }
      throw new Error('Erreur lors de la création de la leçon')
    }
  }

  async updateLesson(
    id: string,
    data: UpdateLessonData,
  ): Promise<{ lesson: Lesson; message: string }> {
    try {
      // Create FormData for file upload
      const formData = new FormData()

      // Append basic fields only if they exist
      if (data.title) formData.append('title', data.title)
      if (data.content !== undefined)
        formData.append('content', data.content || '')
      if (data.order) formData.append('order', data.order.toString())
      if (data.module_id) formData.append('module_id', data.module_id)

      // Append IDs of attachments to delete
      if (data.delete_attachments && data.delete_attachments.length > 0) {
        data.delete_attachments.forEach((id) => {
          formData.append('delete_attachments[]', id)
        })
      }

      // Append new attachments (files)
      if (data.attachments && data.attachments.length > 0) {
        data.attachments.forEach((file) => {
          formData.append('attachments[]', file)
        })
      }

      // Append new external_links
      if (data.external_links && data.external_links.length > 0) {
        data.external_links.forEach((link, index) => {
          formData.append(`external_links[${index}][url]`, link.url)
          formData.append(`external_links[${index}][name]`, link.name)
          if (link.type) {
            formData.append(`external_links[${index}][type]`, link.type)
          }
        })
      }

      const response = await api.post<ApiResponse<LessonFromBackend>>(
        `/api/lessons/${id}?_method=PUT`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      return {
        lesson: transformLesson(response.data.data),
        message: response.data.message,
      }
    } catch (error: any) {
      if (error.response?.data) {
        const err: any = new Error(
          error.response.data.message ||
            'Erreur lors de la mise à jour de la leçon',
        )
        err.errors = error.response.data.errors
        throw err
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
