import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import type { User, CreateUserData, UpdateUserData } from '@/types/user'
import { userService } from '@/services/user-service'

interface UserState {
  users: User[]
  currentUser: User | null
  loading: boolean
  error: string | null
}

interface UserActions {
  fetchUsers: () => Promise<void>
  fetchUser: (id: string) => Promise<void>
  createUser: (data: CreateUserData) => Promise<{
    success: boolean
    message?: string
    errors?: Record<string, string[]>
  }>
  updateUser: (
    id: string,
    data: UpdateUserData,
  ) => Promise<{
    success: boolean
    message?: string
    errors?: Record<string, string[]>
  }>
  deleteUser: (id: string) => Promise<{
    success: boolean
    message?: string
    errors?: Record<string, string[]>
  }>
  setCurrentUser: (user: User | null) => void
  clearError: () => void
}

export type UserStore = UserState & UserActions

export const useUserStore = create<UserStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // Initial state
      users: [],
      currentUser: null,
      loading: false,
      error: null,

      // Fetch all users from API
      fetchUsers: async () => {
        // Prevent duplicate calls
        if (get().loading) return

        set({ loading: true, error: null })
        try {
          const users = await userService.getAllUsers()
          set({
            users,
            loading: false,
            error: null,
          })
          console.log('✅ Users fetched:', users.length)
        } catch (error: any) {
          console.error('❌ Failed to fetch users:', error.message)
          set({
            users: [],
            loading: false,
            error:
              error.message || 'Erreur lors du chargement des utilisateurs',
          })
        }
      },

      // Fetch single user from API
      fetchUser: async (id: string) => {
        set({ loading: true, error: null })
        try {
          const user = await userService.getUserById(id)
          set({
            currentUser: user,
            loading: false,
            error: null,
          })
          console.log('✅ User fetched:', user.email)
        } catch (error: any) {
          console.error('❌ Failed to fetch user:', error.message)
          set({
            currentUser: null,
            loading: false,
            error:
              error.message || "Erreur lors du chargement de l'utilisateur",
          })
        }
      },

      // Create new user
      createUser: async (data: CreateUserData) => {
        set({ loading: true, error: null })
        try {
          const { message } = await userService.createUser(data)

          // After creating a post, refetch all posts to ensure policies are included
          const users = await userService.getAllUsers()
          set({
            users,
            loading: false,
          })
          return { success: true, message }
        } catch (error: any) {
          console.error('❌ Failed to create user:', error.message)
          set({
            loading: false,
            error:
              error.message || "Erreur lors de la création de l'utilisateur",
          })

          return {
            success: false,
            message: error.message,
            errors: error.errors,
          }
        }
      },

      // Update existing user
      updateUser: async (id: string, data: UpdateUserData) => {
        set({ loading: true, error: null })
        try {
          const { user, message } = await userService.updateUser(id, data)

          // Update user in the list
          set((state) => ({
            users: state.users.map((u) => (u.id.toString() === id ? user : u)),
            currentUser:
              state.currentUser?.id.toString() === id
                ? user
                : state.currentUser,
            loading: false,
            error: null,
          }))

          console.log('✅ User updated:', user.email)
          return { success: true, message }
        } catch (error: any) {
          console.error('❌ Failed to update user:', error.message)
          set({
            loading: false,
            error:
              error.message || "Erreur lors de la mise à jour de l'utilisateur",
          })

          return {
            success: false,
            message: error.message,
            errors: error.errors,
          }
        }
      },

      // Delete user
      deleteUser: async (id: string) => {
        set({ loading: true, error: null })
        try {
          const { message } = await userService.deleteUser(id)

          // Remove user from the list
          set((state) => ({
            users: state.users.filter((u) => u.id.toString() !== id),
            currentUser:
              state.currentUser?.id.toString() === id
                ? null
                : state.currentUser,
            loading: false,
            error: null,
          }))

          console.log('✅ User deleted')
          return { success: true, message }
        } catch (error: any) {
          console.error('❌ Failed to delete user:', error.message)
          set({
            loading: false,
            error:
              error.message || "Erreur lors de la suppression de l'utilisateur",
          })

          return {
            success: false,
            message: error.message,
            errors: error.errors,
          }
        }
      },

      // Set current user manually
      setCurrentUser: (user: User | null) => {
        set({ currentUser: user })
      },

      // Clear error
      clearError: () => {
        set({ error: null })
      },
    })),
    { name: 'user-store' },
  ),
)
