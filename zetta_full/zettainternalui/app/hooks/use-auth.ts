import { create } from "zustand";
import { api } from "~/api";

interface User {
  id: string;
  fullName: string;
  email: string;
  status: string;
  imageUrl: string | null;
  role: string;
  created_at: string;
  updated_at: string;
  bio?: string;
  title?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuth = create<AuthState>()((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isInitialized: false,

  // checkAuth: async () => {
  //   set({ isLoading: true });
  //   try {
  //     const response = await api.get<{ user: User }>("/api/v1/auth/me");
  //     set({
  //       user: response.data.user,
  //       isLoading: false,
  //       isInitialized: true,
  //       error: null,
  //     });
  //   } catch (error) {
  //     set({
  //       user: null,
  //       isLoading: false,
  //       isInitialized: true,
  //       error: null,
  //     });
  //   }
  // },

  checkAuth: async () => {
    // Si déjà en cours de chargement, ne pas réexécuter
    set((state) => {
      if (state.isLoading) return state;
      return { ...state, isLoading: true };
    });

    try {
      const response = await api.get<{ user: User }>("/api/v1/auth/me");
      set({
        user: response.data.user,
        isLoading: false,
        isInitialized: true,
        error: null,
      });
    } catch (error) {
      // Ne pas définir d'erreur pour les 401, c'est un état normal quand non authentifié
      set({
        user: null,
        isLoading: false,
        isInitialized: true,
        error: null,
      });
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      // Get CSRF cookie
      await api.get("sanctum/csrf-cookie");

      // Login request
      const res = await api.post<{ user: User }>("/api/login", {
        email,
        password,
      });

      const user = res.data.user;
      if (!user) {
        throw new Error("Données utilisateur invalides");
      }

      set({
        user,
        isLoading: false,
        error: null,
        isInitialized: true,
      });
    } catch (error) {
      const errorMessage =
        ((error as any).response?.data?.message as string) ||
        "Une erreur est survenue lors de la connexion";

      set({
        error: errorMessage,
        isLoading: false,
        user: null,
        isInitialized: true,
      });

      throw new Error(errorMessage);
    }
  },

  logout: async () => {
    try {
      await api.post("/api/logout");
      set({
        user: null,
        error: null,
        isInitialized: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
      set({
        user: null,
        error: null,
        isInitialized: true,
      });
    }
  },
}));
