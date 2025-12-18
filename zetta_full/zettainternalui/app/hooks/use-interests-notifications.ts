import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "~/api";
import echo from "~/echo";
import { useAuth } from "~/hooks/use-auth";
import type {
  FormationInterest,
  FormationInterestPayload,
} from "~/types/formation-interest";

const NOTIFICATION_SOUNDS = {
  admin: "/sounds/notification.mp3",
  teacher: "/sounds/teacher-notification.mp3",
  student: "/sounds/student-notification.mp3",
} as const;

const notificationSounds: Record<string, HTMLAudioElement | null> = {
  admin: null,
  teacher: null,
  student: null,
};

const initializeSound = (role: keyof typeof NOTIFICATION_SOUNDS) => {
  if (typeof window === "undefined" || notificationSounds[role]) return;

  const audio = new Audio(NOTIFICATION_SOUNDS[role]);
  audio.load();
  audio.volume = 0.5;
  notificationSounds[role] = audio;
};

if (typeof window !== "undefined") {
  Object.keys(NOTIFICATION_SOUNDS).forEach((role) => {
    initializeSound(role as keyof typeof NOTIFICATION_SOUNDS);
  });
}

export interface ApproveInterestResponse {
  success: boolean;
  message: string;
}

interface InterestNotificationStore {
  notifications: FormationInterest[];
  interests: FormationInterest[];
  unreadCount: number;
  channel: any | null;
  soundEnabled: boolean;
  selectedNotification: FormationInterest | null;
  isLoading: boolean;
  readNotifications: string[];

  initializeChannel: () => void;
  addNotification: (notification: FormationInterest) => void;
  markAllAsRead: () => void;
  removeNotification: (index: number) => void;
  cleanup: () => void;
  toggleSound: () => void;
  setSelectedNotification: (notification: FormationInterest | null) => void;
  fetchInterests: () => Promise<void>;
  markAsRead: (id: string) => void;
  getUnreadNotifications: () => FormationInterest[];
  approveInterest: (id: string) => Promise<ApproveInterestResponse>;
}

export const useInterestsNotifications = create<InterestNotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      interests: [],
      unreadCount: 0,
      channel: null,
      soundEnabled: true,
      selectedNotification: null,
      isLoading: false,
      readNotifications: [],

      // set selected notification
      setSelectedNotification: (notification) => {
        set({ selectedNotification: notification });
      },

      // get unread notifications
      getUnreadNotifications: () => {
        const state = get();
        return state.interests.filter(
          (interest) => !state.readNotifications.includes(interest.id)
        );
      },

      // mark as read
      markAsRead: (id: string) => {
        set((state) => {
          // Ensure the ID is not already in readNotifications
          const readNotifications = state.readNotifications.includes(id)
            ? state.readNotifications
            : [...state.readNotifications, id];

          return {
            unreadCount: Math.max(0, state.unreadCount - 1),
            notifications: state.notifications.filter((n) => n.id !== id),
            readNotifications,
          };
        });
      },

      // fetch interests
      fetchInterests: async () => {
        set({ isLoading: true });
        try {
          const response = await api.get("/api/v1/admin/interests");
          const interests = response.data.interests;
          const readNotifications = get().readNotifications;

          const unreadNotifications = interests.filter(
            (interest: FormationInterest) =>
              !readNotifications.includes(interest.id) &&
              interest.status === "pending"
          );

          set({
            interests,
            notifications: unreadNotifications,
            unreadCount: unreadNotifications.length,
          });
        } catch (error) {
          console.error("Error fetching interests:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      // approve interest
      approveInterest: async (id: string): Promise<ApproveInterestResponse> => {
        try {
          const response = await api.post<ApproveInterestResponse>(
            `/api/v1/admin/interests/${id}/approve`
          );

          if (!response.data.success) {
            throw new Error(response.data.message || "Échec de l'approbation");
          }

          // Mettre à jour l'état local immédiatement
          set((state) => ({
            interests: state.interests.map((interest) =>
              interest.id === id
                ? { ...interest, status: "approved" }
                : interest
            ),
            // Mettre à jour aussi la notification sélectionnée si elle existe
            selectedNotification:
              state.selectedNotification?.id === id
                ? { ...state.selectedNotification, status: "approved" }
                : state.selectedNotification,
          }));

          // Rafraîchir les données
          await get().fetchInterests();

          return response.data;
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Échec de l'approbation";
          throw new Error(errorMessage);
        }
      },

      // initialize channel
      initializeChannel: () => {
        if (typeof window === "undefined" || !window.Pusher || !echo) return;
        if (get().channel) return;

        try {
          const channel = echo.channel("formation-interests");
          channel.subscribe();

          channel.listen(
            "NewFormationInterest",
            (e: FormationInterestPayload) => {
              const { interest } = e;
              const { user } = useAuth.getState();

              set((state) => ({
                notifications: [interest, ...state.notifications].slice(0, 5),
                unreadCount: state.unreadCount + 1,
              }));

              set((state) => ({
                interests: [interest, ...state.interests],
              }));

              // Ajoutez le toast ici
              if (user?.role === "admin") {
                toast.info(
                  `Nouvelle demande de pré-inscription de ${interest.fullName}`,
                  {
                    description: `Formation: ${interest.formation.name}`,
                    duration: 5000,
                  }
                );
              }

              if (window.location.pathname.includes("/notifications")) {
                get().fetchInterests();
              }

              if (get().soundEnabled) {
                const { user } = useAuth.getState();
                const role = user?.role as keyof typeof NOTIFICATION_SOUNDS;
                const sound = notificationSounds[role];

                if (sound) {
                  sound.currentTime = 0;
                  sound
                    .play()
                    .catch((e) => console.warn("Audio play failed:", e));
                }
              }
            }
          );

          channel.listen(
            "FormationInterestUpdated",
            (e: FormationInterestPayload) => {
              if (window.location.pathname.includes("/notifications")) {
                get().fetchInterests();
              }

              set((state) => ({
                interests: state.interests.map((item) =>
                  item.id === e.interest.id ? e.interest : item
                ),
                notifications: state.notifications.map((item) =>
                  item.id === e.interest.id ? e.interest : item
                ),
              }));

              if (get().selectedNotification?.id === e.interest.id) {
                set({ selectedNotification: e.interest });
              }
            }
          );

          set({ channel });
        } catch (error) {
          console.error("Error initializing Echo channel:", error);
        }
      },

      // add notification
      addNotification: (notification) => {
        const { user } = useAuth.getState();

        if (get().soundEnabled && user?.role && notificationSounds[user.role]) {
          try {
            const sound = notificationSounds[user.role];
            if (sound) {
              sound.currentTime = 0;
              const playPromise = sound.play();

              if (playPromise !== undefined) {
                playPromise
                  .then(() => {
                    console.log(`Sound ${user.role} played successfully`);
                  })
                  .catch((error) => {
                    console.warn(`Error playing ${user.role} sound:`, error);
                    sound.load();
                  });
              }
            }
          } catch (error) {
            console.error("Error attempting to play sound:", error);
          }
        }

        set((state) => ({
          notifications: [notification, ...state.notifications].slice(0, 5),
          unreadCount: state.unreadCount + 1,
        }));
      },

      // toggle sound
      toggleSound: () => {
        const { user } = useAuth.getState();
        if (user?.role && !notificationSounds[user.role]) {
          initializeSound(user.role as keyof typeof NOTIFICATION_SOUNDS);
        }
        set((state) => ({ soundEnabled: !state.soundEnabled }));
      },

      // mark all as read
      markAllAsRead: () => {
        set((state) => {
          const readIds = state.notifications.map((n) => n.id);
          return {
            unreadCount: 0,
            notifications: [],
            readNotifications: [...state.readNotifications, ...readIds],
          };
        });
      },

      // remove notification by index
      removeNotification: (index: number) => {
        set((state) => {
          const notification = state.notifications[index];
          const newNotifications = state.notifications.filter(
            (_, i) => i !== index
          );

          return {
            notifications: newNotifications,
            unreadCount: Math.max(0, state.unreadCount - 1),
            readNotifications: notification
              ? [...state.readNotifications, notification.id]
              : state.readNotifications,
          };
        });
      },

      // cleanup
      cleanup: () => {
        const channel = get().channel;
        if (channel) {
          channel.stopListening("NewFormationInterest");
          channel.stopListening("FormationInterestUpdated");
          channel.unsubscribe();
        }
        set({
          channel: null,
          notifications: [],
          unreadCount: 0,
          selectedNotification: null,
          interests: [],
        });
      },
    }),
    {
      name: "interests-notifications-storage", // unique name
      partialize: (state) => ({
        readNotifications: state.readNotifications,
        soundEnabled: state.soundEnabled,
      }), // only persist these fields
    }
  )
);
