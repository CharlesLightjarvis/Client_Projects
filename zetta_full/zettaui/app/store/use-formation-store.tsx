import { create } from "zustand";
import axios from "axios";
import type { Formation } from "~/types/formation";
import type { FormationDetails } from "~/types/formation-details";
import api from "~/api";

interface FormationStore {
  formations: Formation[];
  formationDetails: FormationDetails | null; // Changed from Formation to Formation | null
  loading: boolean;
  error: string | null;
  fetchFormations: () => Promise<void>;
  fetchFormationDetails: (slug: string) => Promise<void>;
  //   addFormation: (formationData: FormationPayload) => Promise<boolean>;
  removeFormation: (id: string) => Promise<boolean>;
}

const useFormationStore = create<FormationStore>((set) => ({
  formations: [],
  formationDetails: null, // Initialize as null
  loading: false,
  error: null,

  fetchFormations: async () => {
    set({ loading: true, error: null, formations: [] });
    try {
      const response = await api.get<{ formations: Formation[] }>(
        "/guest/formations"
      );
      // Access the formations array from response.data.formations
      const formations = response.data.formations;
      set({ formations, loading: false, error: null });
    } catch (error: any) {
      set({ error: error.message, loading: false, formations: [] });
    }
  },

  fetchFormationDetails: async (slug: string) => {
    set({ loading: true, error: null }); // Don't reset formations here
    try {
      const response = await api.get<{ formation: FormationDetails }>( // Changed from Formation[] to Formation
        `/guest/formations/slug/${slug}`
      );

      const formationDetails = response.data.formation; // Changed from formations to formation
      set({ formationDetails, loading: false, error: null });
      console.log(formationDetails);
    } catch (error: any) {
      set({
        error: error.message,
        loading: false,
        formationDetails: null, // Set to null on error, not empty string
      });
    }
  },

  //   addFormation: async (formationData) => {
  //     try {
  //       const response = await axios.post<Formation>("https://api.talkenoo.click/api/formations", formationData);
  //       set((state) => ({ formations: [...state.formations, response.data] }));
  //       return true;
  //     } catch {
  //       return false;
  //     }
  //   },

  removeFormation: async (id) => {
    try {
      await axios.delete(`https://api.talkenoo.click/api/formations/${id}`);
      set((state) => ({
        formations: state.formations.filter((formation) => formation.id !== id),
      }));
      return true;
    } catch {
      return false;
    }
  },
}));

export default useFormationStore;
