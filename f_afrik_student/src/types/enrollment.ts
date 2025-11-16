import type { User } from './user'

// Interface pour un enrollment (inscription d'un étudiant à une session)
export interface Enrollment {
  id: string
  student_id: string
  course_session_id: string
  enrolled_at: string
  status: 'active' | 'completed' | 'dropped'
  student?: User
  created_at: string
  updated_at: string
}

// Type pour la création d'un enrollment (un seul étudiant)
export interface CreateEnrollmentData {
  student_id: string
  course_session_id: string
}

// Type pour la création en masse d'enrollments (plusieurs étudiants)
export interface BulkEnrollmentData {
  student_ids: string[]
  course_session_id: string
}

// Type pour la suppression d'un enrollment (un seul)
export interface DeleteEnrollmentData {
  enrollment_id: string
}

// Type pour la suppression en masse d'enrollments (plusieurs)
export interface BulkDeleteEnrollmentData {
  enrollment_ids: string[]
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  errors?: Record<string, string[]>
}

// Type pour un étudiant avec son enrollment_id (utilisé pour l'affichage des étudiants inscrits)
export interface EnrolledStudent extends User {
  enrollment_id: string
}
