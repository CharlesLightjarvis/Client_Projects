import { create } from "zustand";
import { api } from "~/api";
import type {
  CreateSessionData,
  Session,
  UpdateSessionData,
} from "~/types/session";

interface SuccessResponse {
  success: boolean;
  message: string;
}

interface SessionsState {
  sessions: Session[];
  isLoading: boolean;
  error: string | null;
  selectedSession: Session | null;
  updateSession: (
    sessionId: string,
    sessionData: UpdateSessionData
  ) => Promise<string>;

  // Actions
  getSessions: () => Promise<void>;
  getTeacherSessions: () => Promise<void>;
  deleteSession: (sessionId: string) => Promise<string>;
  createSession: (sessionData: CreateSessionData) => Promise<string>;

  setSelectedSession: (session: Session | null) => void;
  clearError: () => void;

  // New methods for student management
  getSessionStudents: (sessionId: string) => Promise<any[]>;
  enrollStudent: (sessionId: string, userId: string) => Promise<any>;
  unenrollStudent: (sessionId: string, userId: string) => Promise<any>;
}

export const useSessionsStore = create<SessionsState>()((set, get) => ({
  sessions: [],
  isLoading: false,
  error: null,
  selectedSession: null,

  getSessions: async () => {
    set((state) => {
      if (state.isLoading) return state;
      return { ...state, isLoading: true, error: null };
    });

    try {
      const response = await api.get<{ sessions: Session[] }>(
        "/api/v1/admin/sessions"
      );
      set({
        sessions: response.data.sessions,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Erreur lors du chargement des sessions:", error);
      set({
        error: "Erreur lors du chargement des sessions",
        isLoading: false,
        sessions: [],
      });
      throw error;
    }
  },

  getTeacherSessions: async () => {
    set((state) => {
      if (state.isLoading) return state;
      return { ...state, isLoading: true, error: null };
    });

    try {
      const response = await api.get<{ sessions: Session[] }>(
        "/api/v1/teacher/sessions"
      );
      set({
        sessions: response.data.sessions,
        isLoading: false,
        error: null,
      });
      console.log(response.data.sessions);
    } catch (error) {
      console.error("Erreur lors du chargement des sessions:", error);
      set({
        error: "Erreur lors du chargement des sessions",
        isLoading: false,
        sessions: [],
      });
      throw error;
    }
  },

  deleteSession: async (sessionId: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.delete<SuccessResponse>(
        `/api/v1/admin/sessions/${sessionId}`
      );
      set({ isLoading: false, error: null });
      await get().getSessions(); // Rafraîchir la liste après suppression
      return response.data.message;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete session";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  createSession: async (sessionData: CreateSessionData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.post<SuccessResponse>(
        "/api/v1/admin/sessions",
        sessionData
      );

      // Rafraîchir la liste des categories après création
      await get().getSessions(); // Rafraîchir la liste après création

      set({ isLoading: false, error: null });
      return response.data.message;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to create session";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  updateSession: async (sessionId: string, sessionData: UpdateSessionData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.put<SuccessResponse>(
        `/api/v1/admin/sessions/${sessionId}`,
        sessionData
      );
      set({ isLoading: false, error: null });
      await get().getSessions(); // Rafraîchir la liste après mise à jour
      return response.data.message;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update session";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  getSessionStudents: async (sessionId: string) => {
    try {
      const response = await api.get(
        `/api/v1/admin/sessions/${sessionId}/students`
      );
      return response.data.students;
    } catch (error) {
      throw error;
    }
  },

  enrollStudent: async (sessionId: string, userId: string) => {
    try {
      const response = await api.post<SuccessResponse>(
        `/api/v1/admin/sessions/${sessionId}/students/${userId}`
      );
      await get().getSessions(); // Rafraîchir la liste après suppression
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  unenrollStudent: async (sessionId: string, userId: string) => {
    try {
      const response = await api.delete<SuccessResponse>(
        `/api/v1/admin/sessions/${sessionId}/students/${userId}`
      );
      await get().getSessions(); // Rafraîchir la liste après suppression
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  setSelectedSession: (session) => {
    set({ selectedSession: session });
  },

  clearError: () => {
    set({ error: null });
  },
}));
