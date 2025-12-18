import { useLessonStore } from '@/stores/lesson-store'
import { useCallback } from 'react'

export const useInstructorLessons = () => {
  const lessons = useLessonStore((state) => state.lessons)
  const loading = useLessonStore((state) => state.loading)
  const error = useLessonStore((state) => state.error)

  const fetchLessons = useCallback(() => {
    return useLessonStore.getState().fetchInstructorLessons()
  }, [])

  return {
    lessons,
    loading,
    error,
    fetchLessons,
  }
}
