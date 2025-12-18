import { create } from "zustand";
import { api } from "~/api";
import type {
  Certification,
  CreateCertificationData,
  UpdateCertificationData,
} from "~/types/certification";

interface SuccessResponse {
  success: boolean;
  message: string;
}

interface CertificationsState {
  certifications: Certification[];
  isLoading: boolean;
  error: string | null;
  selectedCertification: Certification | null;
  updateCertification: (
    id: string,
    data: FormData | UpdateCertificationData
  ) => Promise<string>;

  // New state for student certifications
  studentCertifications: Certification[];
  studentCertificationsLoading: boolean;
  studentCertificationsError: string | null;

  // Actions
  getCertifications: () => Promise<void>;
  deleteCertification: (certificationId: string) => Promise<string>;
  createCertification: (formData: FormData) => Promise<string>; // Update the type here
  // ... other properties

  getStudentCertifications: () => Promise<void>;

  setSelectedCertification: (certification: Certification | null) => void;
  clearError: () => void;
}

export const useCertificationsStore = create<CertificationsState>()(
  (set, get) => ({
    certifications: [],
    isLoading: false,
    error: null,
    selectedCertification: null,

    // New state
    studentCertifications: [],
    studentCertificationsLoading: false,
    studentCertificationsError: null,

    getCertifications: async () => {
      set((state) => {
        if (state.isLoading) return state;
        return { ...state, isLoading: true, error: null };
      });

      try {
        const response = await api.get<{ certifications: Certification[] }>(
          "/api/v1/admin/certifications"
        );
        set({
          certifications: response.data.certifications,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error("Erreur lors du chargement des categories:", error);
        set({
          error: "Erreur lors du chargement des categories",
          isLoading: false,
          certifications: [],
        });
        throw error;
      }
    },

    // New action
    getStudentCertifications: async () => {
      set({
        studentCertificationsLoading: true,
        studentCertificationsError: null,
      });

      try {
        const response = await api.get<{ certifications: Certification[] }>(
          "/api/v1/student/certifications"
        );
        console.log(response.data.certifications);

        set({
          studentCertifications: response.data.certifications,
          studentCertificationsLoading: false,
          studentCertificationsError: null,
        });
      } catch (error: any) {
        console.error("Erreur lors du chargement des certifications:", error);
        const errorMessage =
          error.response?.data?.message || "Failed to fetch certifications";
        set({
          studentCertificationsError: errorMessage,
          studentCertificationsLoading: false,
          studentCertifications: [],
        });
        throw error;
      }
    },

    deleteCertification: async (certificationId: string) => {
      set({ isLoading: true, error: null });

      try {
        const response = await api.delete<SuccessResponse>(
          `/api/v1/admin/certifications/${certificationId}`
        );
        set({ isLoading: false, error: null });
        await get().getCertifications(); // Rafraîchir la liste après suppression
        return response.data.message;
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "Failed to delete categorie";
        set({ error: errorMessage, isLoading: false });
        throw new Error(errorMessage);
      }
    },

    createCertification: async (formData: FormData) => {
      set({ isLoading: true, error: null });

      try {
        const response = await api.post<SuccessResponse>(
          "/api/v1/admin/certifications",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        await get().getCertifications();

        set({ isLoading: false, error: null });
        return response.data.message;
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "Failed to create certification";
        set({ error: errorMessage, isLoading: false });
        throw new Error(errorMessage);
      }
    },

    // Update the implementation as well
    updateCertification: async (
      certificationId: string,
      certificationData: FormData | UpdateCertificationData
    ) => {
      set({ isLoading: true, error: null });

      try {
        let response;

        if (certificationData instanceof FormData) {
          response = await api.post<SuccessResponse>(
            `/api/v1/admin/certifications/${certificationId}?_method=PUT`,
            certificationData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
        } else {
          response = await api.put<SuccessResponse>(
            `/api/v1/admin/certifications/${certificationId}`,
            certificationData
          );
        }

        set({ isLoading: false, error: null });
        await get().getCertifications();
        return response.data.message;
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "Failed to update certification";
        set({ error: errorMessage, isLoading: false });
        throw new Error(errorMessage);
      }
    },

    setSelectedCertification: (certification) => {
      set({ selectedCertification: certification });
    },

    clearError: () => {
      set({ error: null });
    },
  })
);
