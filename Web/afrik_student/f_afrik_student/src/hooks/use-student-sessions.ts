import { useCallback } from 'react'
import { useSessionStore } from '@/stores/session-store'
import { useAuthStore } from '@/stores/auth-store'

export const useStudentSessions = () => {
  const studentSessions = useSessionStore((state) => state.studentSessions)
  const loading = useSessionStore((state) => state.loading)
  const error = useSessionStore((state) => state.error)
  const fetchStudentSessions = useSessionStore((state) => state.fetchStudentSessions)
  const user = useAuthStore((state) => state.user)

  const fetchSessions = useCallback(() => {
    if (user?.id) {
      return fetchStudentSessions(String(user.id))
    }
  }, [user?.id, fetchStudentSessions])

  return {
    sessions: studentSessions,
    loading,
    error,
    fetchSessions,
  }
}
