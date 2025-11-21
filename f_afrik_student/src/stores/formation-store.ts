import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import type {
  Formation,
  CreateFormationData,
  UpdateFormationData,
} from '@/types/formation'
import { formationService } from '@/services/formation-service'

interface FormationState {
  formations: Formation[]
  currentFormation: Formation | null
  loading: boolean
  error: string | null
}

interface FormationActions {
  fetchFormations: () => Promise<void>
  fetchFormation: (id: string) => Promise<void>
  createFormation: (data: CreateFormationData) => Promise<{
    success: boolean
    message?: string
    errors?: Record<string, string[]>
  }>
  updateFormation: (
    id: string,
    data: UpdateFormationData,
  ) => Promise<{
    success: boolean
    message?: string
    errors?: Record<string, string[]>
  }>
  deleteFormation: (id: string) => Promise<{
    success: boolean
    message?: string
    errors?: Record<string, string[]>
  }>
  setCurrentFormation: (formation: Formation | null) => void
  clearError: () => void
}

export type FormationStore = FormationState & FormationActions

export const useFormationStore = create<FormationStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // Initial state
      formations: [],
      currentFormation: null,
      loading: false,
      error: null,

      // Fetch all formations from API
      fetchFormations: async () => {
        // Prevent duplicate calls
        if (get().loading) return

        set({ loading: true, error: null })
        try {
          const formations = await formationService.getAllFormations()
          console.log('Formations fetched:', formations)

          set({
            formations,
            loading: false,
            error: null,
          })
          console.log('✅ Formations fetched:', formations.length)
        } catch (error: any) {
          console.error('❌ Failed to fetch formations:', error.message)
          set({
            formations: [],
            loading: false,
            error: error.message || 'Erreur lors du chargement des formations',
          })
        }
      },

      // Fetch single formation from API
      fetchFormation: async (id: string) => {
        set({ loading: true, error: null })
        try {
          const formation = await formationService.getFormationById(id)
          set({
            currentFormation: formation,
            loading: false,
            error: null,
          })
          console.log('✅ Formation fetched:', formation.title)
        } catch (error: any) {
          console.error('❌ Failed to fetch formation:', error.message)
          set({
            currentFormation: null,
            loading: false,
            error: error.message || 'Erreur lors du chargement de la formation',
          })
        }
      },

      // Create new formation
      createFormation: async (data: CreateFormationData) => {
        set({ loading: true, error: null })
        try {
          const { formation, message } =
            await formationService.createFormation(data)

          // Add new formation to the beginning of the list (backend uses DESC order)
          set((state) => ({
            formations: [formation, ...state.formations],
            loading: false,
            error: null,
          }))

          console.log('✅ Formation created:', formation.title)
          return { success: true, message }
        } catch (error: any) {
          console.error('❌ Failed to create formation:', error.message)
          set({
            loading: false,
            error:
              error.message || 'Erreur lors de la création de la formation',
          })

          return {
            success: false,
            message: error.message,
            errors: error.errors,
          }
        }
      },

      // Update existing formation
      updateFormation: async (id: string, data: UpdateFormationData) => {
        set({ loading: true, error: null })
        try {
          const { formation, message } = await formationService.updateFormation(
            id,
            data,
          )

          // Move updated formation to the beginning of the list (backend uses DESC order)
          set((state) => ({
            formations: [
              formation,
              ...state.formations.filter((f) => f.id !== id),
            ],
            currentFormation:
              state.currentFormation?.id === id
                ? formation
                : state.currentFormation,
            loading: false,
            error: null,
          }))

          console.log('✅ Formation updated:', formation.title)
          return { success: true, message }
        } catch (error: any) {
          console.error('❌ Failed to update formation:', error.message)
          set({
            loading: false,
            error:
              error.message || 'Erreur lors de la mise à jour de la formation',
          })

          return {
            success: false,
            message: error.message,
            errors: error.errors,
          }
        }
      },

      // Delete formation
      deleteFormation: async (id: string) => {
        set({ loading: true, error: null })
        try {
          const { message } = await formationService.deleteFormation(id)

          // Remove formation from the list
          set((state) => ({
            formations: state.formations.filter((f) => f.id !== id),
            currentFormation:
              state.currentFormation?.id === id ? null : state.currentFormation,
            loading: false,
            error: null,
          }))

          console.log('✅ Formation deleted')
          return { success: true, message }
        } catch (error: any) {
          console.error('❌ Failed to delete formation:', error.message)
          set({
            loading: false,
            error:
              error.message || 'Erreur lors de la suppression de la formation',
          })

          return {
            success: false,
            message: error.message,
            errors: error.errors,
          }
        }
      },

      // Set current formation manually
      setCurrentFormation: (formation: Formation | null) => {
        set({ currentFormation: formation })
      },

      // Clear error
      clearError: () => {
        set({ error: null })
      },
    })),
    { name: 'formation-store' },
  ),
)
