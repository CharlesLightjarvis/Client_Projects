import { useCallback } from 'react'
import { useSessionStore } from '@/stores/session-store'
import { useAuthStore } from '@/stores/auth-store'

export const useInstructorSessions = () => {
  const instructorSessions = useSessionStore((state) => state.instructorSessions)
  const loading = useSessionStore((state) => state.loading)
  const error = useSessionStore((state) => state.error)
  const fetchInstructorSessions = useSessionStore((state) => state.fetchInstructorSessions)
  const user = useAuthStore((state) => state.user)

  const fetchSessions = useCallback(() => {
    if (user?.id) {
      return fetchInstructorSessions(String(user.id))
    }
  }, [user?.id, fetchInstructorSessions])

  return {
    sessions: instructorSessions,
    loading,
    error,
    fetchSessions,
  }
}
