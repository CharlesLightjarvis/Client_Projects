import api from '@/lib/api'
import type {
  User,
  UserFromBackend,
  CreateUserData,
  UpdateUserData,
  ApiResponse,
} from '@/types/user'
import { transformUser } from '@/types/user'

class UserService {
  /**
   * GET - Retrieve all users
   */
  async getAllUsers(): Promise<User[]> {
    const response = await api.get<ApiResponse<UserFromBackend[]>>('/api/users')
    // Transform all users from backend format to frontend format
    return response.data.data.map(transformUser)
  }

  /**
   * GET - Retrieve single user by ID
   */
  async getUserById(id: string): Promise<User> {
    const response = await api.get<ApiResponse<UserFromBackend>>(`/api/users/${id}`)
    // Transform user from backend format to frontend format
    return transformUser(response.data.data)
  }

  /**
   * POST - Create new user
   */
  async createUser(data: CreateUserData): Promise<{ user: User; message: string }> {
    try {
      const response = await api.post<ApiResponse<UserFromBackend>>('/api/users', data)

      return {
        user: transformUser(response.data.data),
        message: response.data.message,
      }
    } catch (error: any) {
      // Extract and rethrow errors with validation details
      if (error.response?.data) {
        const err: any = new Error(error.response.data.message || 'Erreur lors de la création')
        err.errors = error.response.data.errors
        throw err
      }
      throw error
    }
  }

  /**
   * PUT - Update user
   */
  async updateUser(
    id: string,
    data: UpdateUserData,
  ): Promise<{ user: User; message: string }> {
    try {
      // Include empty permissions array if not provided to avoid backend errors
      const payload = {
        ...data,
        permissions: data.permissions || [],
      }

      const response = await api.put<ApiResponse<UserFromBackend>>(
        `/api/users/${id}`,
        payload,
      )

      return {
        user: transformUser(response.data.data),
        message: response.data.message,
      }
    } catch (error: any) {
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
   * DELETE - Delete user
   */
  async deleteUser(id: string): Promise<{ message: string }> {
    try {
      const response = await api.delete<ApiResponse<null>>(`/api/users/${id}`)

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
}

export const userService = new UserService()
