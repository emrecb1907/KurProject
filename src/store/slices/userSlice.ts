import { StateCreator } from 'zustand';
import { User, UserProgress, UserStreak, LeaderboardEntry } from '@/types/user.types';
import { database } from '@/lib/supabase/database';

export interface UserSlice {
  // State
  totalXP: number;
  currentLevel: number;
  totalScore: number;
  currentLives: number;
  maxLives: number;
  streak: number;
  progress: UserProgress[];

  streakData: UserStreak | null;
  lastReplenishTime: number | null;
  adWatchTimes: number[];
  boundUserId: string | null;

  // Stats cache
  completedTests: number;
  successRate: number;

  // Daily Progress (Local Tracking)
  dailyProgress: {
    date: string;
    lessonsCompleted: number;
    testsCompleted: number;
    claimedTasks: string[];
  };

  completedLessons: string[];
  sessionToken: string | null;

  // Actions
  setTotalXP: (xp: number) => void;
  addXP: (xp: number) => void;
  setCurrentLevel: (level: number) => void;
  setTotalScore: (score: number) => void;
  setCurrentLives: (lives: number) => void;
  addLives: (lives: number) => Promise<void>;
  removeLives: (lives: number) => void;
  setStreak: (streak: number) => void;
  setProgress: (progress: UserProgress[]) => void;
  setStreakData: (streakData: UserStreak | null) => void;
  setUserStats: (completedTests: number, successRate: number) => void;
  updateGameStats: (xp: number, level: number, completedTests: number, successRate: number, streak?: number) => void;
  resetUserData: () => void;
  setBoundUserId: (id: string | null) => void;

  // Sync & Logic
  checkDailyReset: () => void;
  claimDailyTask: (taskType: 'lesson' | 'test', xpReward: number) => Promise<boolean>;

  completeLesson: (lessonId: string, skipSync?: boolean) => Promise<void>;
  syncCompletedLessons: () => Promise<void>;

  startTestSession: () => Promise<void>;

  consumeEnergy: () => Promise<{ success: boolean; error?: string }>;
  checkLifeRegeneration: () => Promise<void>;
  watchAd: () => Promise<boolean>;
}

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const initialState = {
  totalXP: 0,
  currentLevel: 1,
  totalScore: 0,
  currentLives: 6,
  maxLives: 6,
  streak: 0,
  progress: [],
  streakData: null,
  lastReplenishTime: Date.now(),
  adWatchTimes: [],
  boundUserId: null,
  completedTests: 0,
  successRate: 0,

  dailyProgress: {
    date: getTodayDateString(),
    lessonsCompleted: 0,
    testsCompleted: 0,
    claimedTasks: [],
  },
  completedLessons: [],
  sessionToken: null,
};

export const createUserSlice: StateCreator<UserSlice> = (set, get) => ({
  ...initialState,

  setTotalXP: (xp) => set({ totalXP: xp }),

  addXP: (xp) => set((state) => ({
    totalXP: state.totalXP + xp,
    totalScore: state.totalScore + xp
  })),

  setCurrentLevel: (level) => set({ currentLevel: level }),
  setTotalScore: (score) => set({ totalScore: score }),
  setCurrentLives: (lives) => set({ currentLives: lives }),

  addLives: async (lives) => {
    const state = get();
    const newLives = Math.min(state.currentLives + lives, state.maxLives);
    set({ currentLives: newLives });

    if (state.boundUserId) {
      try {
        const { data, error } = await database.energy.add(state.boundUserId, lives);
        if (data && (data as any).current_energy !== undefined) {
          set({ currentLives: (data as any).current_energy });
        }
      } catch (err) {
        console.error('Failed to add energy to server:', err);
      }
    }
  },

  removeLives: (lives) => set((state) => ({
    currentLives: Math.max(state.currentLives - lives, 0)
  })),

  setStreak: (streak) => set({ streak }),
  setProgress: (progress) => set({ progress }),
  setStreakData: (streakData) => set({ streakData }),
  setUserStats: (completedTests, successRate) => set({ completedTests, successRate }),

  updateGameStats: (xp, level, completedTests, successRate, streak) => set((state) => {
    // REVERTED LOGIC: Simple Increment

    // Check Date Check
    const today = getTodayDateString();
    let currentDaily = { ...state.dailyProgress };

    if (currentDaily.date !== today) {
      currentDaily = { date: today, lessonsCompleted: 0, testsCompleted: 0, claimedTasks: [] };
    }

    // Increment Tests
    const newTests = currentDaily.testsCompleted + 1;

    return {
      totalXP: xp,
      totalScore: xp,
      currentLevel: level,
      completedTests,
      successRate,
      streak: streak !== undefined ? streak : state.streak,
      dailyProgress: {
        ...currentDaily,
        testsCompleted: newTests
      }
    };
  }),

  resetUserData: () => set(initialState),

  setBoundUserId: (id) => {
    set({ boundUserId: id });
    if (id) {
      // Force energy sync on login
      get().checkLifeRegeneration();
    }
  },

  checkDailyReset: () => {
    const state = get();
    const today = getTodayDateString();
    if (state.dailyProgress.date !== today) {
      set({
        dailyProgress: {
          date: today,
          lessonsCompleted: 0,
          testsCompleted: 0,
          claimedTasks: []
        }
      });
    }
  },

  claimDailyTask: async (taskType, xpReward) => {
    const state = get();
    const { boundUserId } = state;

    // 🛡️ SERVER-FIRST: Only proceed with server validation
    if (!boundUserId) {
      // Anonymous user without DB - still allow local (but vulnerable)
      set((currentState) => ({
        totalXP: currentState.totalXP + xpReward,
        totalScore: currentState.totalScore + xpReward,
        dailyProgress: {
          ...currentState.dailyProgress,
          claimedTasks: [...currentState.dailyProgress.claimedTasks, taskType]
        }
      }));
      return true;
    }

    // Server-side claim (validates eligibility + grants XP atomically)
    try {
      const { data, error } = await database.dailySnapshots.claim(boundUserId, taskType);

      if (error) {
        console.error('Daily task claim failed:', error);
        return false;
      }

      const result = data as { success: boolean; xp_awarded?: number; error?: string };

      if (result?.success) {
        // Only update local state on server success
        set((currentState) => ({
          totalXP: currentState.totalXP + (result.xp_awarded || xpReward),
          totalScore: currentState.totalScore + (result.xp_awarded || xpReward),
          dailyProgress: {
            ...currentState.dailyProgress,
            claimedTasks: [...currentState.dailyProgress.claimedTasks, taskType]
          }
        }));
        return true;
      } else {
        console.warn('Claim rejected by server:', result?.error);
        return false;
      }
    } catch (err) {
      console.error('Daily task claim error:', err);
      return false;
    }
  },

  completeLesson: async (lessonId, skipSync = false) => {
    const state = get();

    // Date Check
    const today = getTodayDateString();
    let currentDaily = { ...state.dailyProgress };
    if (currentDaily.date !== today) {
      currentDaily = { date: today, lessonsCompleted: 0, testsCompleted: 0, claimedTasks: [] };
    }

    if (!state.completedLessons.includes(lessonId)) {
      set({
        completedLessons: [...state.completedLessons, lessonId],
        dailyProgress: {
          ...currentDaily,
          lessonsCompleted: currentDaily.lessonsCompleted + 1
        }
      });
    }

    // Database Sync
    const { boundUserId } = state;
    if (boundUserId) {
      try {
        await database.lessons.complete(boundUserId, lessonId);
      } catch (err) {
        console.error('Error syncing lesson completion:', err);
      }
    }
  },

  syncCompletedLessons: async () => {
    const state = get();
    const { boundUserId } = state;

    if (boundUserId) {
      try {
        const { data, error } = await database.lessons.getCompleted(boundUserId);
        if (data) {
          const currentLessons = state.completedLessons;
          const dbLessons = data;
          const mergedLessons = Array.from(new Set([...currentLessons, ...dbLessons]));

          if (mergedLessons.length !== currentLessons.length) {
            set({ completedLessons: mergedLessons });
          }
        }
      } catch (err) {
        console.error('Error syncing completed lessons:', err);
      }
    }
  },

  startTestSession: async () => {
    const { boundUserId } = get();
    if (!boundUserId) return;

    const sessionToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
    set({ sessionToken });

    try {
      await database.users.startSession(boundUserId, sessionToken);
    } catch (error) {
      console.error('Failed to start session:', error);
    }
  },

  checkLifeRegeneration: async () => {
    const state = get();

    // 🛡️ SERVER-ONLY SYNC: No local fallback to prevent time manipulation
    if (!state.boundUserId) {
      // Anonymous user without DB - no regeneration
      return;
    }

    try {
      const { data } = await database.energy.sync(state.boundUserId);
      if (data && (data as any).current_energy !== undefined) {
        const serverEnergy = (data as any).current_energy;
        const serverReplenishTime = (data as any).last_update;

        // Update energy
        const updates: { currentLives: number; lastReplenishTime?: number } = {
          currentLives: serverEnergy
        };

        // Update lastReplenishTime if server provides it, or if energy increased (regenerated)
        if (serverReplenishTime) {
          updates.lastReplenishTime = new Date(serverReplenishTime).getTime();
        } else if (serverEnergy > state.currentLives && serverEnergy < state.maxLives) {
          // Energy increased but not full, so regeneration just happened
          updates.lastReplenishTime = Date.now();
        }

        set(updates);
      }
    } catch (e) {
      // Server sync failed - keep current value, DON'T regenerate locally
      console.warn('Energy sync failed, keeping current value');
    }
  },

  consumeEnergy: async () => {
    const state = get();
    const { boundUserId, currentLives } = state;

    if (currentLives <= 0) {
      return { success: false, error: 'Yetersiz Enerji' };
    }

    if (!boundUserId) {
      set({ currentLives: currentLives - 1 });
      return { success: true };
    }

    try {
      const { data, error } = await database.energy.consume(boundUserId);
      if (error || !data) return { success: false, error: 'Hata' };

      const result = data as any;
      if (result.success) {
        // 🔐 Session ID'yi kaydet (sunucu artık bunu dönüyor)
        set({
          currentLives: result.current_energy,
          sessionToken: result.session_id || null
        });
        return { success: true };
      } else {
        if (result.current_energy !== undefined) set({ currentLives: result.current_energy });
        return { success: false, error: result.error };
      }
    } catch (err) {
      return { success: false, error: 'Sunucu hatası' };
    }
  },

  watchAd: async () => {
    const state = get();
    const now = Date.now();
    const validWatches = state.adWatchTimes.filter(time => now - time < 24 * 60 * 60 * 1000);

    if (validWatches.length >= 3) return false;
    if (state.currentLives >= state.maxLives) return false;

    await state.addLives(1);
    set({ adWatchTimes: [...validWatches, now] });
    return true;
  }
});
