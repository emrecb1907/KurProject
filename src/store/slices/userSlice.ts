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
  adWatchTimes: number[]; // Timestamps of ad watches in the last 24h

  // Stats cache (for profile page performance)
  completedTests: number;
  successRate: number;

  // Actions
  setTotalXP: (xp: number) => void;
  addXP: (xp: number) => void;
  setCurrentLevel: (level: number) => void;
  setTotalScore: (score: number) => void;
  setCurrentLives: (lives: number) => void;
  addLives: (lives: number) => void;
  removeLives: (lives: number) => void;
  setStreak: (streak: number) => void;
  setProgress: (progress: UserProgress[]) => void;
  setStreakData: (streakData: UserStreak | null) => void;
  setUserStats: (completedTests: number, successRate: number) => void;
  updateGameStats: (xp: number, level: number, completedTests: number, successRate: number) => void;
  resetUserData: () => void;

  // New Actions
  checkLifeRegeneration: () => void;
  watchAd: () => boolean; // Returns true if successful

  // Security
  // Daily Progress
  dailyProgress: {
    date: string;
    lessonsCompleted: number;
    testsCompleted: number;
    claimedTasks: number[]; // IDs of claimed tasks for the day
  };

  // Actions
  incrementDailyLessons: () => void;
  incrementDailyTests: () => void;
  claimDailyTask: (taskId: number, xpReward: number) => Promise<void>;
  checkDailyReset: () => void;

  boundUserId: string | null;
  setBoundUserId: (id: string | null) => void;

  // Lesson Completion
  completedLessons: string[];
  completeLesson: (lessonId: string) => void;
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
};

export const createUserSlice: StateCreator<UserSlice> = (set, get) => ({
  // Initial state
  ...initialState,

  // Actions
  setTotalXP: (xp) => set({ totalXP: xp }),

  addXP: (xp) => set((state) => ({
    totalXP: state.totalXP + xp,
    totalScore: state.totalScore + xp,
  })),

  setCurrentLevel: (level) => set({ currentLevel: level }),

  setTotalScore: (score) => set({ totalScore: score }),

  setCurrentLives: (lives) => set({ currentLives: lives }),

  addLives: (lives) => set((state) => ({
    currentLives: Math.min(state.currentLives + lives, state.maxLives)
  })),

  removeLives: (lives) => set((state) => ({
    currentLives: Math.max(state.currentLives - lives, 0)
  })),

  setStreak: (streak) => set({ streak }),

  setProgress: (progress) => set({ progress }),

  setStreakData: (streakData) => set({ streakData }),

  setUserStats: (completedTests, successRate) => set({ completedTests, successRate }),

  updateGameStats: (xp, level, completedTests, successRate) => set({
    totalXP: xp,
    totalScore: xp, // Assuming totalScore tracks XP for now
    currentLevel: level,
    completedTests,
    successRate
  }),

  resetUserData: () => set(initialState),

  checkLifeRegeneration: () => {
    const state = get();

    // Fix maxLives if it's wrong (migration)
    if (state.maxLives !== 6) {
      set({ maxLives: 6 });
    }

    const maxLives = 6; // Force use of 6

    if (state.currentLives >= maxLives) {
      set({ lastReplenishTime: Date.now() });
      return;
    }

    const now = Date.now();
    const lastTime = state.lastReplenishTime || now;
    const timeDiff = now - lastTime;
    const hoursPassed = timeDiff / (1000 * 60 * 60);

    // 4 hours per life
    const livesToRestore = Math.floor(hoursPassed / 4);

    if (livesToRestore > 0) {
      const newLives = Math.min(state.currentLives + livesToRestore, maxLives);
      // Update time: advance by the time used for restored lives
      // This keeps the remainder time for the next life
      const timeUsed = livesToRestore * 4 * 60 * 60 * 1000;

      set({
        currentLives: newLives,
        lastReplenishTime: lastTime + timeUsed
      });
    }
  },

  watchAd: () => {
    const state = get();
    const now = Date.now();

    // Filter out watches older than 24 hours
    const validWatches = state.adWatchTimes.filter(time => now - time < 24 * 60 * 60 * 1000);

    if (validWatches.length >= 3) {
      return false; // Limit reached
    }

    if (state.currentLives >= state.maxLives) {
      return false; // Already full
    }

    set({
      currentLives: state.currentLives + 1,
      adWatchTimes: [...validWatches, now]
    });

    return true;
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
          claimedTasks: [],
        }
      });
    }
  },

  incrementDailyLessons: () => {
    get().checkDailyReset();
    set((state) => ({
      dailyProgress: {
        ...state.dailyProgress,
        lessonsCompleted: state.dailyProgress.lessonsCompleted + 1
      }
    }));
  },

  incrementDailyTests: () => {
    get().checkDailyReset();
    set((state) => ({
      dailyProgress: {
        ...state.dailyProgress,
        testsCompleted: state.dailyProgress.testsCompleted + 1
      }
    }));
  },

  claimDailyTask: async (taskId, xpReward) => {
    const state = get();
    get().checkDailyReset();

    // 1. Local Update (Optimistic)
    const newTotalXP = state.totalXP + xpReward;
    const newTotalScore = state.totalScore + xpReward;

    set((state) => ({
      totalXP: newTotalXP,
      totalScore: newTotalScore,
      dailyProgress: {
        ...state.dailyProgress,
        claimedTasks: [...state.dailyProgress.claimedTasks, taskId]
      }
    }));

    // 2. Database Sync
    const { boundUserId } = state;
    if (boundUserId) {
      try {
        const { error } = await database.users.updateStats(boundUserId, {
          total_score: newTotalXP // Syncing XP as total_score for now, consistent with useAuth
        });

        if (error) {
          console.error('❌ Failed to sync daily task XP to DB:', error);
        } else {
          console.log('✅ Daily task XP synced to DB:', xpReward);
        }
      } catch (err) {
        console.error('❌ Error syncing daily task XP:', err);
      }
    }
  },

  setBoundUserId: (id) => set({ boundUserId: id }),

  completeLesson: async (lessonId) => {
    const state = get();

    // 1. Optimistic Update
    if (!state.completedLessons.includes(lessonId)) {
      set({
        completedLessons: [...state.completedLessons, lessonId]
      });
    }

    // 2. Database Sync
    const { boundUserId } = state;
    if (boundUserId) {
      try {
        const { error } = await database.lessons.complete(boundUserId, lessonId);
        if (error) {
          console.error('❌ Failed to sync lesson completion to DB:', error);
          // Optional: Revert state if critical, but for now we keep optimistic update
        } else {
          console.log('✅ Lesson completion synced to DB:', lessonId);
        }
      } catch (err) {
        console.error('❌ Error syncing lesson completion:', err);
      }
    }
  },
});
