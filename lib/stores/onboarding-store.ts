import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface OnboardingState {
  currentStep: number;
  language: string;
  location: {
    state: string;
    district: string;
    constituency: string;
    pinCode: string;
  };
  profile: {
    ageRange: string;
    voterStatus: string;
    interests: string[];
    voterIdImage?: string;
    voterIdNumber?: string;
  };
  notifications: {
    electionReminders: boolean;
    voterGuides: boolean;
    dailyQuiz: boolean;
    localNews: boolean;
    weeklyDigest: boolean;
    pushEnabled: boolean;
  };
}

interface OnboardingActions {
  setLanguage: (lang: string) => void;
  setLocation: (loc: Partial<OnboardingState["location"]>) => void;
  setProfile: (profile: Partial<OnboardingState["profile"]>) => void;
  setNotifications: (notifs: Partial<OnboardingState["notifications"]>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  skipStep: () => void;
  complete: () => void;
  reset: () => void;
}

const initialState: OnboardingState = {
  currentStep: 1,
  language: "en",
  location: {
    state: "",
    district: "",
    constituency: "",
    pinCode: "",
  },
  profile: {
    ageRange: "",
    voterStatus: "",
    interests: [],
  },
  notifications: {
    electionReminders: true,
    voterGuides: true,
    dailyQuiz: false,
    localNews: true,
    weeklyDigest: false,
    pushEnabled: false,
  },
};

export const useOnboardingStore = create<OnboardingState & OnboardingActions>()(
  persist(
    (set) => ({
      ...initialState,

      setLanguage: (lang) => set({ language: lang }),

      setLocation: (loc) =>
        set((state) => ({
          location: { ...state.location, ...loc },
        })),

      setProfile: (profile) =>
        set((state) => ({
          profile: { ...state.profile, ...profile },
        })),

      setNotifications: (notifs) =>
        set((state) => ({
          notifications: { ...state.notifications, ...notifs },
        })),

      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, 5),
        })),

      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 1),
        })),

      goToStep: (step) => set({ currentStep: step }),

      skipStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, 5),
        })),

      complete: () => set({ currentStep: 6 }), // 6 = completed

      reset: () => set(initialState),
    }),
    {
      name: "electionguide-onboarding",
    }
  )
);
