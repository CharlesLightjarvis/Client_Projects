import { create } from "zustand";
import api from "~/api";
import type { Category } from "~/types/category";

interface CategoryStore {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  //   addFormation: (formationData: FormationPayload) => Promise<boolean>;
  //   removeCategory: (id: string) => Promise<boolean>;
}

const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null, categories: [] });
    try {
      const response = await api.get<{ categories: Category[] }>(
        "/guest/categories"
      );
      // Access the categories array from response.data.categories
      const categories = response.data.categories;
      set({ categories, loading: false, error: null });
    } catch (error: any) {
      set({ error: error.message, loading: false, categories: [] });
    }
  },
}));

export default useCategoryStore;
