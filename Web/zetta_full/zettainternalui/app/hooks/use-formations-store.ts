import { create } from "zustand";
import { api } from "~/api";
import type { UpdateCategorieData } from "~/types/categorie";
import type {
  CreateFormationData,
  Formation,
  UpdateFormationData,
} from "~/types/formation";

interface SuccessResponse {
  success: boolean;
  message: string;
}

interface FormationsState {
  formations: Formation[];
  isLoading: boolean;
  error: string | null;
  selectedFormation: Formation | null;
  updateFormation: (
    formationId: string,
    formationData: FormData | UpdateFormationData
  ) => Promise<string>;

  // Actions
  getFormations: () => Promise<void>;
  getStudentFormations: () => Promise<void>;
  deleteFormation: (formationId: string) => Promise<string>;
  createFormation: (formationData: FormData) => Promise<string>;

  setSelectedFormation: (formation: Formation | null) => void;
  clearError: () => void;
}

export const useFormationsStore = create<FormationsState>()((set, get) => ({
  formations: [],
  isLoading: false,
  error: null,
  selectedFormation: null,

  getFormations: async () => {
    const state = get();
    // Évite les appels multiples si déjà en cours
    if (state.isLoading) return;

    set({ isLoading: true, error: null });

    try {
      const response = await api.get<{ formations: Formation[] }>(
        "/api/v1/admin/formations"
      );
      set({
        formations: response.data.formations,
        isLoading: false,
        error: null,
      });
      console.log(response.data.formations);
    } catch (error) {
      console.error("Erreur lors du chargement des formations:", error);
      set({
        error: "Erreur lors du chargement des formations",
        isLoading: false,
        formations: [],
      });
    }
  },

  getStudentFormations: async () => {
    set((state) => {
      if (state.isLoading) return state;
      return { ...state, isLoading: true, error: null };
    });

    try {
      const response = await api.get<{ formations: Formation[] }>(
        "/api/v1/student/formations"
      );
      console.log("Student formations:", response.data.formations);
      set({
        formations: response.data.formations,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Erreur lors du chargement des formations:", error);
      set({
        error: "Erreur lors du chargement des formations",
        isLoading: false,
        formations: [],
      });
      throw error;
    }
  },

  deleteFormation: async (formationId: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.delete<SuccessResponse>(
        `/api/v1/admin/formations/${formationId}`
      );
      set({ isLoading: false, error: null });
      await get().getFormations(); // Rafraîchir la liste après suppression
      return response.data.message;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete formation";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  createFormation: async (formData: FormData) => {
    set({ isLoading: true, error: null });

    try {
      // Utiliser FormData avec le header approprié
      const response = await api.post<SuccessResponse>(
        "/api/v1/admin/formations",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Rafraîchir la liste des formations après création

      set({ isLoading: false, error: null });
      await get().getFormations();
      return response.data.message;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to create formation";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  updateFormation: async (
    formationId: string,
    formationData: FormData | UpdateFormationData
  ) => {
    set({ isLoading: true, error: null });

    try {
      let response;

      // Vérifier si formationData est une instance de FormData
      if (formationData instanceof FormData) {
        response = await api.post<SuccessResponse>(
          `/api/v1/admin/formations/${formationId}?_method=PUT`,
          formationData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await api.put<SuccessResponse>(
          `/api/v1/admin/formations/${formationId}`,
          formationData
        );
      }

      set({ isLoading: false, error: null });
      await get().getFormations(); // Rafraîchir la liste après mise à jour
      return response.data.message;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update formation";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  setSelectedFormation: (formation) => {
    set({ selectedFormation: formation });
  },

  clearError: () => {
    set({ error: null });
  },
}));
