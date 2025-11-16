import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import type { Session, CreateSessionData, UpdateSessionData, InstructorSession, StudentSession } from '@/types/session'
import { sessionService } from '@/services/session-service'

interface SessionState {
  sessions: Session[]
  instructorSessions: InstructorSession[]
  studentSessions: StudentSession[]
  currentSession: Session | null
  loading: boolean
  error: string | null
}

interface SessionActions {
  fetchSessions: () => Promise<void>
  fetchSession: (id: string) => Promise<void>
  fetchInstructorSessions: (instructorId: string) => Promise<void>
  fetchStudentSessions: (studentId: string) => Promise<void>
  createSession: (data: CreateSessionData) => Promise<{
    success: boolean
    message?: string
    errors?: Record<string, string[]>
  }>
  updateSession: (
    id: string,
    data: UpdateSessionData,
  ) => Promise<{
    success: boolean
    message?: string
    errors?: Record<string, string[]>
  }>
  deleteSession: (id: string) => Promise<{
    success: boolean
    message?: string
    errors?: Record<string, string[]>
  }>
  setCurrentSession: (session: Session | null) => void
  clearError: () => void
}

export type SessionStore = SessionState & SessionActions

export const useSessionStore = create<SessionStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // Initial state
      sessions: [],
      instructorSessions: [],
      studentSessions: [],
      currentSession: null,
      loading: false,
      error: null,

      // Fetch all sessions from API
      fetchSessions: async () => {
        // Prevent duplicate calls
        if (get().loading) return

        set({ loading: true, error: null })
        try {
          const sessions = await sessionService.getAllSessions()
          set({
            sessions,
            loading: false,
            error: null,
          })
          console.log('✅ Sessions fetched:', sessions.length)
        } catch (error: any) {
          console.error('❌ Failed to fetch sessions:', error.message)
          set({
            sessions: [],
            loading: false,
            error: error.message || 'Erreur lors du chargement des sessions',
          })
        }
      },

      // Fetch single session from API
      fetchSession: async (id: string) => {
        set({ loading: true, error: null })
        try {
          const session = await sessionService.getSessionById(id)
          set({
            currentSession: session,
            loading: false,
            error: null,
          })
          console.log('✅ Session fetched:', session.id)
        } catch (error: any) {
          console.error('❌ Failed to fetch session:', error.message)
          set({
            currentSession: null,
            loading: false,
            error: error.message || 'Erreur lors du chargement de la session',
          })
        }
      },

      // Fetch instructor sessions from API
      fetchInstructorSessions: async (instructorId: string) => {
        // Prevent duplicate calls
        if (get().loading) return

        set({ loading: true, error: null })
        try {
          const instructorSessions = await sessionService.getInstructorSessions(instructorId)
          set({
            instructorSessions,
            loading: false,
            error: null,
          })
          console.log('✅ Instructor sessions fetched:', instructorSessions.length)
        } catch (error: any) {
          console.error('❌ Failed to fetch instructor sessions:', error.message)
          set({
            instructorSessions: [],
            loading: false,
            error: error.message || 'Erreur lors du chargement des sessions',
          })
        }
      },

      // Fetch student sessions from API
      fetchStudentSessions: async (studentId: string) => {
        // Prevent duplicate calls
        if (get().loading) return

        set({ loading: true, error: null })
        try {
          const studentSessions = await sessionService.getStudentSessions(studentId)
          set({
            studentSessions,
            loading: false,
            error: null,
          })
          console.log('✅ Student sessions fetched:', studentSessions.length)
        } catch (error: any) {
          console.error('❌ Failed to fetch student sessions:', error.message)
          set({
            studentSessions: [],
            loading: false,
            error: error.message || 'Erreur lors du chargement des sessions',
          })
        }
      },

      // Create new session
      createSession: async (data: CreateSessionData) => {
        set({ loading: true, error: null })
        try {
          const { session, message } = await sessionService.createSession(data)

          // Add new session at the beginning (backend uses DESC order)
          set((state) => ({
            sessions: [session, ...state.sessions],
            loading: false,
            error: null,
          }))

          console.log('✅ Session created:', session.id)
          return { success: true, message }
        } catch (error: any) {
          console.error('❌ Failed to create session:', error.message)
          set({
            loading: false,
            error: error.message || 'Erreur lors de la création de la session',
          })

          return {
            success: false,
            message: error.message,
            errors: error.errors,
          }
        }
      },

      // Update existing session
      updateSession: async (id: string, data: UpdateSessionData) => {
        set({ loading: true, error: null })
        try {
          const { session, message } = await sessionService.updateSession(id, data)

          // Update session in the list
          set((state) => ({
            sessions: state.sessions.map((s) => (s.id === id ? session : s)),
            currentSession:
              state.currentSession?.id === id ? session : state.currentSession,
            loading: false,
            error: null,
          }))

          console.log('✅ Session updated:', session.id)
          return { success: true, message }
        } catch (error: any) {
          console.error('❌ Failed to update session:', error.message)
          set({
            loading: false,
            error: error.message || 'Erreur lors de la mise à jour de la session',
          })

          return {
            success: false,
            message: error.message,
            errors: error.errors,
          }
        }
      },

      // Delete session
      deleteSession: async (id: string) => {
        set({ loading: true, error: null })
        try {
          const { message } = await sessionService.deleteSession(id)

          // Remove session from the list
          set((state) => ({
            sessions: state.sessions.filter((s) => s.id !== id),
            currentSession:
              state.currentSession?.id === id ? null : state.currentSession,
            loading: false,
            error: null,
          }))

          console.log('✅ Session deleted')
          return { success: true, message }
        } catch (error: any) {
          console.error('❌ Failed to delete session:', error.message)
          set({
            loading: false,
            error: error.message || 'Erreur lors de la suppression de la session',
          })

          return {
            success: false,
            message: error.message,
            errors: error.errors,
          }
        }
      },

      // Set current session manually
      setCurrentSession: (session: Session | null) => {
        set({ currentSession: session })
      },

      // Clear error
      clearError: () => {
        set({ error: null })
      },
    })),
    { name: 'session-store' },
  ),
)
