import { useSessionStore } from '@/stores/session-store'
import { useCallback } from 'react'

export const useSessions = () => {
  const sessions = useSessionStore((state) => state.sessions)
  const loading = useSessionStore((state) => state.loading)
  const error = useSessionStore((state) => state.error)

  const fetchSessions = useCallback(() => {
    return useSessionStore.getState().fetchSessions()
  }, [])

  return {
    sessions,
    loading,
    error,
    fetchSessions,
  }
}
