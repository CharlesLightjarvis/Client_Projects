export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  errors?: Record<string, string[]>
}

export interface ApiErrorResponse {
  success: false
  message: string
  errors: Record<string, string[]>
}
