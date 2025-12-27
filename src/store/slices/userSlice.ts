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

  // Title notification tracking
  lastSeenTitleCount: number;

  // Actions
  setSelectedAvatar: (avatarId: string) => void;
  setHapticsEnabled: (enabled: boolean) => void;
  setSoundsEnabled: (enabled: boolean) => void;
  setBoundUserId: (id: string | null) => void;
  setSessionToken: (token: string | null) => void;
  setLastSeenTitleCount: (count: number) => void;
  resetUserData: () => void;

}

const initialState = {
  selectedAvatar: DEFAULT_AVATAR_ID,
  boundUserId: null,
  sessionToken: null,
  lastSeenTitleCount: 0,
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

  setLastSeenTitleCount: (count) => set({ lastSeenTitleCount: count }),

  resetUserData: () => set(initialState),


});
