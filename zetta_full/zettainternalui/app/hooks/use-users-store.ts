import { create } from "zustand";
import { api } from "~/api";
import type { CreateUserData, UpdateUserData, User } from "~/types/user";

interface SuccessResponse {
  success: boolean;
  message: string;
}

interface UsersState {
  users: User[];
  isLoading: boolean;
  error: string | null;
  selectedUser: User | null;
  updateUser: (userId: string, userData: UpdateUserData) => Promise<string>;

  // Actions
  getUsers: () => Promise<void>;
  getStudents: () => Promise<User[]>; // Nouvelle action
  deleteUser: (userId: string) => Promise<string>;
  createUser: (userData: CreateUserData) => Promise<string>;

  setSelectedUser: (user: User | null) => void;
  clearError: () => void;
}

export const useUsersStore = create<UsersState>()((set, get) => ({
  users: [],
  isLoading: false,
  error: null,
  selectedUser: null,

  getStudents: async () => {
    set((state) => {
      if (state.isLoading) return state;
      return { ...state, isLoading: true, error: null };
    });

    try {
      const response = await api.get<{ students: User[] }>(
        "/api/v1/admin/students"
      );
      set({ isLoading: false, error: null });
      return response.data.students;
    } catch (error) {
      console.error("Erreur lors du chargement des étudiants:", error);
      set({
        error: "Erreur lors du chargement des étudiants",
        isLoading: false,
      });
      throw error;
    }
  },

  getUsers: async () => {
    set((state) => {
      if (state.isLoading) return state;
      return { ...state, isLoading: true, error: null };
    });

    try {
      const response = await api.get<{ users: User[] }>("/api/v1/admin/users");
      set({
        users: response.data.users,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
      set({
        error: "Erreur lors du chargement des utilisateurs",
        isLoading: false,
        users: [],
      });
      throw error;
    }
  },

  deleteUser: async (userId: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.delete<SuccessResponse>(
        `/api/v1/admin/users/${userId}`
      );
      set({ isLoading: false, error: null });
      await get().getUsers(); // Rafraîchir la liste après suppression
      return response.data.message;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete user";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  createUser: async (userData: CreateUserData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.post<SuccessResponse>(
        "/api/v1/admin/users",
        userData
      );

      // Rafraîchir la liste des utilisateurs après création
      await get().getUsers();

      set({ isLoading: false, error: null });
      return response.data.message;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to create user";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  updateUser: async (userId: string, userData: UpdateUserData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.put<SuccessResponse>(
        `/api/v1/admin/users/${userId}`,
        userData
      );
      set({ isLoading: false, error: null });
      await get().getUsers(); // Rafraîchir la liste après mise à jour
      return response.data.message;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update user";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  setSelectedUser: (user) => {
    set({ selectedUser: user });
  },

  clearError: () => {
    set({ error: null });
  },
}));
