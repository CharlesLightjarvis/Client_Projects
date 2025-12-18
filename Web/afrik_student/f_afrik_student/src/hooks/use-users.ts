import { useUserStore, type UserStore } from '@/stores/user-store'

// Selectors - prevent unnecessary re-renders
const usersSelector = (state: UserStore) => state.users
const currentUserSelector = (state: UserStore) => state.currentUser
const loadingSelector = (state: UserStore) => state.loading
const errorSelector = (state: UserStore) => state.error

export const useUsers = () => {
  // Use selectors for state (only triggers re-render if selector output changes)
  const users = useUserStore(usersSelector)
  const currentUser = useUserStore(currentUserSelector)
  const loading = useUserStore(loadingSelector)
  const error = useUserStore(errorSelector)

  // Get actions directly from store without creating new objects
  const {
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    deleteUser,
    setCurrentUser,
    clearError,
  } = useUserStore.getState()

  return {
    // State
    users,
    currentUser,
    loading,
    error,
    // Actions
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    deleteUser,
    setCurrentUser,
    clearError,
  }
}
