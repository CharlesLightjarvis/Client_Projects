import { useModuleStore, type ModuleStore } from '@/stores/module-store'

const modulesSelector = (state: ModuleStore) => state.modules
const currentModuleSelector = (state: ModuleStore) => state.currentModule
const loadingSelector = (state: ModuleStore) => state.loading
const errorSelector = (state: ModuleStore) => state.error

export const useModules = () => {
  const modules = useModuleStore(modulesSelector)
  const currentModule = useModuleStore(currentModuleSelector)
  const loading = useModuleStore(loadingSelector)
  const error = useModuleStore(errorSelector)

  const {
    fetchModules,
    fetchModule,
    createModule,
    updateModule,
    deleteModule,
    setCurrentModule,
    clearError,
  } = useModuleStore.getState()

  return {
    modules,
    currentModule,
    loading,
    error,
    fetchModules,
    fetchModule,
    createModule,
    updateModule,
    deleteModule,
    setCurrentModule,
    clearError,
  }
}
