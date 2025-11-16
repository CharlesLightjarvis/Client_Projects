import api from '@/lib/api'
import type { User } from '@/types/user'
import type {
  CreateEnrollmentData,
  BulkEnrollmentData,
  DeleteEnrollmentData,
  BulkDeleteEnrollmentData,
  Enrollment,
  EnrolledStudent,
} from '@/types/enrollment'

/**
 * Service pour gérer les enrollments (inscriptions) des étudiants aux sessions
 */
export const enrollmentService = {
  /**
   * Récupère les étudiants inscrits à une session avec leur enrollment_id
   */
  async getSessionStudents(sessionId: string): Promise<EnrolledStudent[]> {
    const response = await api.get<{ data: EnrolledStudent[] }>(
      `/api/course-sessions/${sessionId}/students`,
    )
    return response.data.data
  },

  /**
   * Récupère les étudiants disponibles (non inscrits) pour une session
   */
  async getAvailableStudents(sessionId: string): Promise<User[]> {
    const response = await api.get<{ data: User[] }>(
      `/api/course-sessions/${sessionId}/available-students`,
    )
    return response.data.data
  },

  /**
   * Inscrit un seul étudiant à une session
   */
  async enrollStudent(
    data: CreateEnrollmentData,
  ): Promise<{ enrollment: Enrollment; message: string }> {
    console.log('📤 Enrolling student with data:', data)
    try {
      const response = await api.post<{
        data: Enrollment
        message: string
      }>('/api/enrollments', data)

      console.log('✅ Enrollment successful:', response.data)
      return {
        enrollment: response.data.data,
        message: response.data.message,
      }
    } catch (error: any) {
      console.error('❌ Enrollment failed')
      console.error('📋 Request data:', data)
      console.error('📋 Error response:', error.response?.data)
      console.error('📋 Error status:', error.response?.status)
      console.error('📋 Full error:', error)
      throw error
    }
  },

  /**
   * Inscrit plusieurs étudiants à une session
   */
  async bulkEnrollStudents(
    data: BulkEnrollmentData,
  ): Promise<{ enrollments: Enrollment[]; message: string }> {
    console.log('📤 Bulk enrolling students with data:', data)
    try {
      const response = await api.post<{
        data: Enrollment[]
        message: string
      }>('/api/enrollments', data)

      console.log('✅ Bulk enrollment successful:', response.data)
      return {
        enrollments: response.data.data,
        message: response.data.message,
      }
    } catch (error: any) {
      console.error('❌ Bulk enrollment failed')
      console.error('📋 Request data:', data)
      console.error('📋 Error response:', error.response?.data)
      console.error('📋 Error status:', error.response?.status)
      console.error('📋 Full error:', error)
      throw error
    }
  },

  /**
   * Désinscrit un ou plusieurs étudiants (unenroll)
   */
  async unenrollStudents(
    data: DeleteEnrollmentData | BulkDeleteEnrollmentData,
  ): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(
      '/api/enrollments/unenroll',
      { data },
    )
    return { message: response.data.message }
  },
}
