import { create } from "zustand";
import { api } from "~/api";
import type {
  CreateLessonData,
  Lesson,
  UpdateLessonData,
} from "~/types/lesson";

interface SuccessResponse {
  success: boolean;
  message: string;
}

interface LessonsState {
  lessons: Lesson[];
  isLoading: boolean;
  error: string | null;
  selectedLesson: Lesson | null;
  updateLesson: (
    lessonId: string,
    lessonData: UpdateLessonData
  ) => Promise<string>;

  // Actions
  getLessons: () => Promise<void>;
  deleteLesson: (lessonId: string) => Promise<string>;
  createLesson: (lessonData: CreateLessonData) => Promise<string>;

  setSelectedLesson: (lesson: Lesson | null) => void;
  clearError: () => void;
}

export const useLessonsStore = create<LessonsState>()((set, get) => ({
  lessons: [],
  isLoading: false,
  error: null,
  selectedLesson: null,

  getLessons: async () => {
    set((state) => {
      if (state.isLoading) return state;
      return { ...state, isLoading: true, error: null };
    });

    try {
      const response = await api.get<{ lessons: Lesson[] }>(
        "/api/v1/admin/lessons"
      );
      set({
        lessons: response.data.lessons,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Erreur lors du chargement des lessons:", error);
      set({
        error: "Erreur lors du chargement des lessons",
        isLoading: false,
        lessons: [],
      });
      throw error;
    }
  },

  deleteLesson: async (lessonId: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.delete<SuccessResponse>(
        `/api/v1/admin/lessons/${lessonId}`
      );
      set({ isLoading: false, error: null });
      await get().getLessons(); // Rafraîchir la liste après suppression
      return response.data.message;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete lesson";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  createLesson: async (lessonData: CreateLessonData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.post<SuccessResponse>(
        "/api/v1/admin/lessons",
        lessonData
      );

      // Rafraîchir la liste des categories après création
      await get().getLessons(); // Rafraîchir la liste après création

      set({ isLoading: false, error: null });
      return response.data.message;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to create lesson";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  updateLesson: async (lessonId: string, lessonData: UpdateLessonData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.put<SuccessResponse>(
        `/api/v1/admin/lessons/${lessonId}`,
        lessonData
      );
      set({ isLoading: false, error: null });
      await get().getLessons(); // Rafraîchir la liste après mise à jour
      return response.data.message;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update lesson";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  setSelectedLesson: (lesson) => {
    set({ selectedLesson: lesson });
  },

  clearError: () => {
    set({ error: null });
  },
}));
