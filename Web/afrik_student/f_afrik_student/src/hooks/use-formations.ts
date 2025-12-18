import { useFormationStore, type FormationStore } from '@/stores/formation-store'

// Selectors - prevent unnecessary re-renders
const formationsSelector = (state: FormationStore) => state.formations
const currentFormationSelector = (state: FormationStore) => state.currentFormation
const loadingSelector = (state: FormationStore) => state.loading
const errorSelector = (state: FormationStore) => state.error

export const useFormations = () => {
  // Use selectors for state (only triggers re-render if selector output changes)
  const formations = useFormationStore(formationsSelector)
  const currentFormation = useFormationStore(currentFormationSelector)
  const loading = useFormationStore(loadingSelector)
  const error = useFormationStore(errorSelector)

  // Get actions directly from store without creating new objects
  const {
    fetchFormations,
    fetchStudentFormations,
    fetchFormation,
    createFormation,
    updateFormation,
    deleteFormation,
    setCurrentFormation,
    clearError,
  } = useFormationStore.getState()

  return {
    // State
    formations,
    currentFormation,
    loading,
    error,
    // Actions
    fetchFormations,
    fetchStudentFormations,
    fetchFormation,
    createFormation,
    updateFormation,
    deleteFormation,
    setCurrentFormation,
    clearError,
  }
}
