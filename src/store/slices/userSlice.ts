import { StateCreator } from 'zustand';
import { DEFAULT_AVATAR_ID } from '@/constants/avatars';

/**
 * UserSlice - UI State Only
 * 
 * Server state has been moved to React Query hooks:
 * - useUserData() for XP, level, streak, stats
 * - useEnergy() for energy/lives
 * - useDailyProgress() for daily task progress
 * - useCompletedLessons() for completed lessons list
 */
export interface UserSlice {
  // UI State (persisted locally)
  selectedAvatar: string;
  hapticsEnabled: boolean;
  soundsEnabled: boolean;

  // Auth references (needed for queries)
  boundUserId: string | null;
  sessionToken: string | null;

  // Local tracking (rate limiting)
  adWatchTimes: number[];

  // Actions
  setSelectedAvatar: (avatarId: string) => void;
  setHapticsEnabled: (enabled: boolean) => void;
  setSoundsEnabled: (enabled: boolean) => void;
  setBoundUserId: (id: string | null) => void;
  setSessionToken: (token: string | null) => void;
  resetUserData: () => void;
  watchAd: () => Promise<boolean>;
}

const initialState = {
  selectedAvatar: DEFAULT_AVATAR_ID,
  boundUserId: null,
  sessionToken: null,
  adWatchTimes: [],
  hapticsEnabled: true,
  soundsEnabled: true,
};

export const createUserSlice: StateCreator<UserSlice> = (set, get) => ({
  ...initialState,

  setSelectedAvatar: (avatarId) => set({ selectedAvatar: avatarId }),

  setHapticsEnabled: (enabled) => set({ hapticsEnabled: enabled }),

  setSoundsEnabled: (enabled) => set({ soundsEnabled: enabled }),

  setBoundUserId: (id) => set({ boundUserId: id }),

  setSessionToken: (token) => set({ sessionToken: token }),

  resetUserData: () => set(initialState),

  watchAd: async () => {
    const state = get();
    const now = Date.now();
    const validWatches = state.adWatchTimes.filter(time => now - time < 24 * 60 * 60 * 1000);

    if (validWatches.length >= 3) return false;

    set({ adWatchTimes: [...validWatches, now] });
    return true;
  },
});
