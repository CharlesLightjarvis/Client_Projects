import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { lessonService } from '@/services/lesson-service'
import type { Lesson, CreateLessonData, UpdateLessonData } from '@/types/lesson'

interface LessonState {
  lessons: Lesson[]
  loading: boolean
  error: string | null
  fetchLessons: () => Promise<void>
  fetchInstructorLessons: () => Promise<void>
  createLesson: (
    data: CreateLessonData,
  ) => Promise<{
    success: boolean
    message: string
    errors?: Record<string, string[]>
  }>
  updateLesson: (
    id: string,
    data: UpdateLessonData,
  ) => Promise<{
    success: boolean
    message: string
    errors?: Record<string, string[]>
  }>
  deleteLesson: (id: string) => Promise<{ success: boolean; message: string }>
}

export const useLessonStore = create<LessonState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      lessons: [],
      loading: false,
      error: null,

      fetchLessons: async () => {
        // Prevent duplicate calls
        if (get().loading) return

        set({ loading: true, error: null })
        try {
          const lessons = await lessonService.getLessons()
          console.log(lessons)
          set({ lessons, loading: false })
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : 'Erreur lors du chargement des leçons'
          set({ error: message, loading: false })
        }
      },

      fetchInstructorLessons: async () => {
        // Prevent duplicate calls
        if (get().loading) return

        set({ loading: true, error: null })
        try {
          const lessons = await lessonService.getInstructorLessons()
          console.log(lessons)
          set({ lessons, loading: false })
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : 'Erreur lors du chargement des leçons de l\'instructeur'
          set({ error: message, loading: false })
        }
      },

      createLesson: async (data: CreateLessonData) => {
        set({ loading: true, error: null })
        try {
          const { lesson, message } = await lessonService.createLesson(data)
          set((state) => ({
            lessons: [lesson, ...state.lessons],
            loading: false,
          }))
          return { success: true, message }
        } catch (error: any) {
          const message =
            error instanceof Error
              ? error.message
              : 'Erreur lors de la création de la leçon'
          set({ error: message, loading: false })
          return {
            success: false,
            message,
            errors: error?.errors,
          }
        }
      },

      updateLesson: async (id: string, data: UpdateLessonData) => {
        set({ loading: true, error: null })
        try {
          const { lesson, message } = await lessonService.updateLesson(id, data)
          set((state) => ({
            lessons: state.lessons.map((l) => (l.id === id ? lesson : l)),
            loading: false,
          }))
          return { success: true, message }
        } catch (error: any) {
          const message =
            error instanceof Error
              ? error.message
              : 'Erreur lors de la mise à jour de la leçon'
          set({ error: message, loading: false })
          return {
            success: false,
            message,
            errors: error?.errors,
          }
        }
      },

      deleteLesson: async (id: string) => {
        set({ loading: true, error: null })
        try {
          const { message } = await lessonService.deleteLesson(id)
          set((state) => ({
            lessons: state.lessons.filter((l) => l.id !== id),
            loading: false,
          }))
          return { success: true, message }
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : 'Erreur lors de la suppression de la leçon'
          set({ error: message, loading: false })
          return { success: false, message }
        }
      },
    })),
    { name: 'lesson-store' },
  ),
)
