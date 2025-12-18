import { create } from "zustand";
import { api } from "~/api";

interface Role {
  id: string;
  name: string;
  description?: string;
}

interface RolesState {
  roles: Role[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchRoles: () => Promise<void>;
  clearError: () => void;
}

export const useRolesStore = create<RolesState>()((set) => ({
  roles: [],
  isLoading: false,
  error: null,

  fetchRoles: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get<{ roles: Role[] }>("/api/v1/admin/roles");
      set({
        roles: response.data.roles,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching roles:", error);
      set({
        error: "Failed to load roles",
        isLoading: false,
        roles: [],
      });
    }
  },

  clearError: () => set({ error: null }),
}));
