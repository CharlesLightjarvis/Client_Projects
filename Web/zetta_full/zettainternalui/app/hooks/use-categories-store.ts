import { create } from "zustand";
import { api } from "~/api";
import type {
  Categorie,
  CreateCategorieData,
  UpdateCategorieData,
} from "~/types/categorie";

interface SuccessResponse {
  success: boolean;
  message: string;
}

interface CategoriesState {
  categories: Categorie[];
  isLoading: boolean;
  error: string | null;
  selectedCategorie: Categorie | null;
  updateCategorie: (
    categorieId: string,
    categorieData: UpdateCategorieData
  ) => Promise<string>;

  // Actions
  getCategories: () => Promise<void>;
  deleteCategorie: (categorieId: string) => Promise<string>;
  createCategorie: (categorieData: CreateCategorieData) => Promise<string>;

  setSelectedCategorie: (categorie: Categorie | null) => void;
  clearError: () => void;
}

export const useCategoriesStore = create<CategoriesState>()((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,
  selectedCategorie: null,

  getCategories: async () => {
    set((state) => {
      if (state.isLoading) return state;
      return { ...state, isLoading: true, error: null };
    });

    try {
      const response = await api.get<{ categories: Categorie[] }>(
        "/api/v1/admin/categories"
      );
      set({
        categories: response.data.categories,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Erreur lors du chargement des categories:", error);
      set({
        error: "Erreur lors du chargement des categories",
        isLoading: false,
        categories: [],
      });
      throw error;
    }
  },

  deleteCategorie: async (categorieId: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.delete<SuccessResponse>(
        `/api/v1/admin/categories/${categorieId}`
      );
      set({ isLoading: false, error: null });
      await get().getCategories(); // Rafraîchir la liste après suppression
      return response.data.message;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete categorie";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  createCategorie: async (categorieData: CreateCategorieData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.post<SuccessResponse>(
        "/api/v1/admin/categories",
        categorieData
      );

      // Rafraîchir la liste des categories après création
      await get().getCategories(); // Rafraîchir la liste après création

      set({ isLoading: false, error: null });
      return response.data.message;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to create categorie";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  updateCategorie: async (
    categorieId: string,
    categorieData: UpdateCategorieData
  ) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.put<SuccessResponse>(
        `/api/v1/admin/categories/${categorieId}`,
        categorieData
      );
      set({ isLoading: false, error: null });
      await get().getCategories(); // Rafraîchir la liste après mise à jour
      return response.data.message;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update categorie";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  setSelectedCategorie: (categorie) => {
    set({ selectedCategorie: categorie });
  },

  clearError: () => {
    set({ error: null });
  },
}));
