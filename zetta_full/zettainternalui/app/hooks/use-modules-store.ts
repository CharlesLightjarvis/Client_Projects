import { create } from "zustand";
import { api } from "~/api";
import type {
  CreateModuleData,
  Module,
  UpdateModuleData,
} from "~/types/module";

interface SuccessResponse {
  success: boolean;
  message: string;
}

interface ModulesState {
  modules: Module[];
  isLoading: boolean;
  error: string | null;
  selectedModule: Module | null;
  updateModule: (
    moduleId: string,
    moduleData: UpdateModuleData
  ) => Promise<string>;

  // Actions
  getModules: () => Promise<void>;
  deleteModule: (moduleId: string) => Promise<string>;
  createModule: (moduleData: CreateModuleData) => Promise<string>;

  setSelectedModule: (module: Module | null) => void;
  clearError: () => void;
}

export const useModulesStore = create<ModulesState>()((set, get) => ({
  modules: [],
  isLoading: false,
  error: null,
  selectedModule: null,

  getModules: async () => {
    set((state) => {
      if (state.isLoading) return state;
      return { ...state, isLoading: true, error: null };
    });

    try {
      const response = await api.get<{ modules: Module[] }>(
        "/api/v1/admin/modules"
      );
      set({
        modules: response.data.modules,
        isLoading: false,
        error: null,
      });
      console.log(response.data.modules);
    } catch (error) {
      console.error("Erreur lors du chargement des sessions:", error);
      set({
        error: "Erreur lors du chargement des sessions",
        isLoading: false,
        modules: [],
      });
      throw error;
    }
  },

  deleteModule: async (moduleId: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.delete<SuccessResponse>(
        `/api/v1/admin/modules/${moduleId}`
      );
      set({ isLoading: false, error: null });
      await get().getModules(); // Rafraîchir la liste après suppression
      return response.data.message;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete session";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  createModule: async (moduleData: CreateModuleData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.post<SuccessResponse>(
        "/api/v1/admin/modules",
        moduleData
      );

      // Rafraîchir la liste des categories après création
      await get().getModules(); // Rafraîchir la liste après création

      set({ isLoading: false, error: null });
      return response.data.message;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to create session";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  updateModule: async (moduleId: string, moduleData: UpdateModuleData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.put<SuccessResponse>(
        `/api/v1/admin/modules/${moduleId}`,
        moduleData
      );
      set({ isLoading: false, error: null });
      await get().getModules(); // Rafraîchir la liste après mise à jour
      return response.data.message;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update session";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  setSelectedModule: (module) => {
    set({ selectedModule: module });
  },

  clearError: () => {
    set({ error: null });
  },
}));
