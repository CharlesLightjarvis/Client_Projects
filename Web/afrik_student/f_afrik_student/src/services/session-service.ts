import api from '@/lib/api'
import type {
  Session,
  SessionFromBackend,
  CreateSessionData,
  UpdateSessionData,
  InstructorSession,
  InstructorSessionFromBackend,
  StudentSession,
  StudentSessionFromBackend,
} from '@/types/session'
import { transformSession, transformInstructorSession, transformStudentSession } from '@/types/session'

interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
}

class SessionService {
  /**
   * GET - Retrieve all sessions
   */
  async getAllSessions(): Promise<Session[]> {
    const response = await api.get<ApiResponse<SessionFromBackend[]>>('/api/course-sessions')
    return response.data.data.map(transformSession)
  }

  /**
   * GET - Retrieve single session by ID
   */
  async getSessionById(id: string): Promise<Session> {
    const response = await api.get<ApiResponse<SessionFromBackend>>(
      `/api/course-sessions/${id}`,
    )
    return transformSession(response.data.data)
  }

  /**
   * POST - Create new session
   */
  async createSession(
    data: CreateSessionData,
  ): Promise<{ session: Session; message: string }> {
    try {
      console.log('📤 Sending create request with data:', data)

      const response = await api.post<ApiResponse<SessionFromBackend>>(
        '/api/course-sessions',
        data,
      )

      console.log('🔍 Backend response (CREATE):', response.data)

      if (!response.data.data) {
        throw new Error('Le backend n\'a pas retourné de données de session')
      }

      return {
        session: transformSession(response.data.data),
        message: response.data.message,
      }
    } catch (error: any) {
      console.error('🔴 Create error:', error)
      console.error('🔴 Error response:', error.response?.data)

      // Extract and rethrow errors with validation details
      if (error.response?.data) {
        const err: any = new Error(
          error.response.data.message || 'Erreur lors de la création',
        )
        err.errors = error.response.data.errors
        throw err
      }
      throw error
    }
  }

  /**
   * PUT - Update session
   */
  async updateSession(
    id: string,
    data: UpdateSessionData,
  ): Promise<{ session: Session; message: string }> {
    try {
      const response = await api.put<ApiResponse<SessionFromBackend>>(
        `/api/course-sessions/${id}`,
        data,
      )

      console.log('🔍 Backend response:', response.data)

      if (!response.data.data) {
        throw new Error('Le backend n\'a pas retourné de données de session')
      }

      return {
        session: transformSession(response.data.data),
        message: response.data.message,
      }
    } catch (error: any) {
      console.error('🔴 Update error:', error)
      // Extract and rethrow errors with validation details
      if (error.response?.data) {
        const err: any = new Error(
          error.response.data.message || 'Erreur lors de la mise à jour',
        )
        err.errors = error.response.data.errors
        throw err
      }
      throw error
    }
  }

  /**
   * DELETE - Delete session
   */
  async deleteSession(id: string): Promise<{ message: string }> {
    try {
      const response = await api.delete<ApiResponse<null>>(`/api/course-sessions/${id}`)

      return {
        message: response.data.message,
      }
    } catch (error: any) {
      // Extract and rethrow errors
      if (error.response?.data) {
        const err: any = new Error(
          error.response.data.message || 'Erreur lors de la suppression',
        )
        err.errors = error.response.data.errors
        throw err
      }
      throw error
    }
  }

  /**
   * GET - Retrieve sessions for the authenticated instructor
   */
  async getInstructorSessions(instructorId: string): Promise<InstructorSession[]> {
    const response = await api.get<ApiResponse<InstructorSessionFromBackend[]>>(
      `/api/instructors/${instructorId}/course-sessions`,
    )
    return response.data.data.map(transformInstructorSession)
  }

  /**
   * GET - Retrieve sessions for the authenticated student
   */
  async getStudentSessions(studentId: string): Promise<StudentSession[]> {
    console.log('📤 Fetching student sessions for studentId:', studentId)

    const response = await api.get<ApiResponse<StudentSessionFromBackend[]>>(
      `/api/students/${studentId}/course-sessions`,
    )

    console.log('🔍 Raw backend response (STUDENT):', response.data)
    console.log('🔍 Number of sessions received:', response.data.data?.length || 0)

    if (response.data.data && response.data.data.length > 0) {
      console.log('🔍 First session (before transform):', response.data.data[0])
      const transformed = response.data.data.map(transformStudentSession)
      console.log('✅ First session (after transform):', transformed[0])
      return transformed
    }

    return []
  }
}

export const sessionService = new SessionService()
