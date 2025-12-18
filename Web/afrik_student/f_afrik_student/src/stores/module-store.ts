import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import type { Module, CreateModuleData, UpdateModuleData } from '@/types/module'
import { moduleService } from '@/services/module-service'

interface ModuleState {
  modules: Module[]
  currentModule: Module | null
  loading: boolean
  error: string | null
}

interface ModuleActions {
  fetchModules: () => Promise<void>
  fetchModule: (id: string) => Promise<void>
  createModule: (data: CreateModuleData) => Promise<{
    success: boolean
    message?: string
    errors?: Record<string, string[]>
  }>
  updateModule: (
    id: string,
    data: UpdateModuleData,
  ) => Promise<{
    success: boolean
    message?: string
    errors?: Record<string, string[]>
  }>
  deleteModule: (id: string) => Promise<{
    success: boolean
    message?: string
    errors?: Record<string, string[]>
  }>
  setCurrentModule: (module: Module | null) => void
  clearError: () => void
}

export type ModuleStore = ModuleState & ModuleActions

export const useModuleStore = create<ModuleStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      modules: [],
      currentModule: null,
      loading: false,
      error: null,

      fetchModules: async () => {
        if (get().loading) return
        set({ loading: true, error: null })
        try {
          const modules = await moduleService.getAllModules()
          set({ modules, loading: false, error: null })
          console.log('✅ Modules fetched:', modules)
        } catch (error: any) {
          console.error('❌ Failed to fetch modules:', error.message)
          set({
            modules: [],
            loading: false,
            error: error.message || 'Erreur lors du chargement des modules',
          })
        }
      },

      fetchModule: async (id: string) => {
        set({ loading: true, error: null })
        try {
          const module = await moduleService.getModuleById(id)
          set({ currentModule: module, loading: false, error: null })
          console.log('✅ Module fetched:', module.title)
        } catch (error: any) {
          console.error('❌ Failed to fetch module:', error.message)
          set({
            currentModule: null,
            loading: false,
            error: error.message || 'Erreur lors du chargement du module',
          })
        }
      },

      createModule: async (data: CreateModuleData) => {
        set({ loading: true, error: null })
        try {
          const { module, message } = await moduleService.createModule(data)
          // Add new module at the beginning (backend uses DESC order)
          set((state) => ({
            modules: [module, ...state.modules],
            loading: false,
            error: null,
          }))
          console.log('✅ Module created:', module.title)
          return { success: true, message }
        } catch (error: any) {
          console.error('❌ Failed to create module:', error.message)
          set({
            loading: false,
            error: error.message || 'Erreur lors de la création du module',
          })
          return {
            success: false,
            message: error.message,
            errors: error.errors,
          }
        }
      },

      updateModule: async (id: string, data: UpdateModuleData) => {
        set({ loading: true, error: null })
        try {
          const { module, message } = await moduleService.updateModule(id, data)
          set((state) => ({
            modules: state.modules.map((m) => (m.id === id ? module : m)),
            currentModule:
              state.currentModule?.id === id ? module : state.currentModule,
            loading: false,
            error: null,
          }))
          console.log('✅ Module updated:', module.title)
          return { success: true, message }
        } catch (error: any) {
          console.error('❌ Failed to update module:', error.message)
          set({
            loading: false,
            error: error.message || 'Erreur lors de la mise à jour du module',
          })
          return {
            success: false,
            message: error.message,
            errors: error.errors,
          }
        }
      },

      deleteModule: async (id: string) => {
        set({ loading: true, error: null })
        try {
          const { message } = await moduleService.deleteModule(id)
          set((state) => ({
            modules: state.modules.filter((m) => m.id !== id),
            currentModule:
              state.currentModule?.id === id ? null : state.currentModule,
            loading: false,
            error: null,
          }))
          console.log('✅ Module deleted')
          return { success: true, message }
        } catch (error: any) {
          console.error('❌ Failed to delete module:', error.message)
          set({
            loading: false,
            error: error.message || 'Erreur lors de la suppression du module',
          })
          return {
            success: false,
            message: error.message,
            errors: error.errors,
          }
        }
      },

      setCurrentModule: (module: Module | null) => {
        set({ currentModule: module })
      },

      clearError: () => {
        set({ error: null })
      },
    })),
    { name: 'module-store' },
  ),
)
