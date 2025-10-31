export interface User {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  role: 'admin' | 'client'
  permissions: string[] // Array of permission names like 'post.create', 'post.read', etc.
  created_at: string
  updated_at: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  two_factor: boolean
  user: User
}
