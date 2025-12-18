import { useLessonStore } from '@/stores/lesson-store'
import { useCallback } from 'react'

export const useLessons = () => {
  const lessons = useLessonStore((state) => state.lessons)
  const loading = useLessonStore((state) => state.loading)
  const error = useLessonStore((state) => state.error)

  const fetchLessons = useCallback(() => {
    return useLessonStore.getState().fetchLessons()
  }, [])

  return {
    lessons,
    loading,
    error,
    fetchLessons,
  }
}
