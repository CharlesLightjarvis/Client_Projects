import api from '@/lib/api'
import type { LoginCredentials, LoginResponse, User, UserFromBackend } from '@/types/user'
import { transformUser } from '@/types/user'

class AuthService {
  /**
   * Get CSRF cookie from Sanctum before making authenticated requests
   */
  async getCsrfCookie(): Promise<void> {
    console.log('🔐 Getting CSRF cookie...')
    await api.get('/sanctum/csrf-cookie')
  }

  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<{ two_factor: boolean; user: User }> {
    console.log('🔑 Attempting login for:', credentials.email)

    // Get CSRF cookie first
    await this.getCsrfCookie()

    const response = await api.post<LoginResponse>('/api/login', credentials)

    // Transform user from backend format to frontend format
    const transformedUser = transformUser(response.data.user)

    console.log('✅ Login successful:', {
      user: transformedUser.email,
      role: transformedUser.role,
      roleLabel: transformedUser.roleLabel,
    })

    return {
      two_factor: response.data.two_factor,
      user: transformedUser,
    }
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    console.log('🚪 Logging out...')
    await api.post('/api/logout')
    console.log('✅ Logout successful')
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get<{ user: UserFromBackend }>('/api/user')
    // Transform user from backend format to frontend format
    return transformUser(response.data.user)
  }
}

export const authService = new AuthService()
