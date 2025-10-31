// types/post.ts
export interface Post {
  id: number
  title: string
  description: string
  user_id: number
  policies?: { can_update: boolean; can_delete: boolean }
  created_at: string
  updated_at: string
}

export interface CreatePostData {
  title: string
  description: string
}

export interface UpdatePostData extends Partial<CreatePostData> {}

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
