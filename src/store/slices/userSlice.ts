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
  boundUserId: string | null;

  // Stats cache (for profile page performance)
  completedTests: number;
  successRate: number;

  // Daily Progress
  dailyProgress: {
    date: string;
    lessonsCompleted: number;
    testsCompleted: number;
    claimedTasks: string[];
  };

  // Lesson Tracking
  completedLessons: string[];

  // Session Security
  sessionToken: string | null;

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
  updateGameStats: (xp: number, level: number, completedTests: number, successRate: number, streak?: number) => void;
  resetUserData: () => void;
  setBoundUserId: (id: string | null) => void;

  // Sync & Logic
  checkDailyReset: () => void;
  incrementDailyLessons: () => void;
  incrementDailyTests: () => void;
  claimDailyTask: (taskId: string, xpReward: number) => Promise<void>;

  // Lesson Completion
  completeLesson: (lessonId: string, skipSync?: boolean) => Promise<void>;
  syncCompletedLessons: () => Promise<void>;

  // Session Security Action
  startTestSession: () => Promise<void>;

  // Energy & Ads
  consumeEnergy: () => Promise<{ success: boolean; error?: string }>;
  checkLifeRegeneration: () => Promise<void>;
  watchAd: () => Promise<boolean>;
}

// ... (initialState)
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

  // Actions
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
    // 1. Local Optimistic Update
    const newLives = Math.min(state.currentLives + lives, state.maxLives);
    set({ currentLives: newLives });

    // 2. Server Sync
    if (state.boundUserId) {
      try {
        const { data, error } = await database.energy.add(state.boundUserId, lives);
        if (data && (data as any).current_energy !== undefined) {
          // Ensure local state matches server state (in case we exceeded max or logic differed)
          set({ currentLives: (data as any).current_energy });
        }
      } catch (err) {
        console.error('Failed to add energy to server:', err);
      }
    }
  },

  // Deprecated/Internal: Use consumeEnergy instead
  removeLives: (lives) => set((state) => ({
    currentLives: Math.max(state.currentLives - lives, 0)
  })),

  setStreak: (streak) => set({ streak }),

  setProgress: (progress) => set({ progress }),

  setStreakData: (streakData) => set({ streakData }),

  setUserStats: (completedTests, successRate) => set({ completedTests, successRate }),

  updateGameStats: (xp, level, completedTests, successRate, streak) => set((state) => ({
    totalXP: xp, // Fix: Replace with new total from DB, do not add!
    totalScore: xp, // Fix: Replace with new total from DB
    currentLevel: level,
    completedTests,
    successRate,
    streak: streak !== undefined ? streak : state.streak // Update streak if provided
  })),

  resetUserData: () => set(initialState),

  // ...

  checkLifeRegeneration: async () => {
    const state = get();

    // 1. Local Timer (Optimistic Update) allows UI to show "Refilling..."
    // We keep a simple logic: if 4 hours passed locally since LAST CONFIRMED time, show +1.
    // However, for strict syncing, we rely on the Server.

    // If we have a user, try to Sync with DB
    if (state.boundUserId) {
      try {
        const { data, error } = await database.energy.sync(state.boundUserId);
        if (data) {
          // data should contain { current_energy, last_update }
          // We need to type cast or ensure Supabase returns correct shape.
          // Assuming RPC returns valid JSON as per plan.
          const { current_energy, last_update } = data as any;

          if (typeof current_energy === 'number') {
            set({
              currentLives: current_energy,
              lastReplenishTime: new Date(last_update).getTime()
            });
          }
        }
      } catch (err) {
        console.log('Energy sync failed (offline?), using local logic');
      }
    }

    // 2. Local Fallback / Guest Logic
    // Runs if sync failed OR if user is guest (no boundUserId)
    // ... (Existing logic below, but using 6)

    const maxLives = 6;
    if (state.currentLives >= maxLives) {
      // If full, just update time to now so timer doesn't accumulate
      // unless we want to track 'time since full'? No, standard regens start on use.
      // set({ lastReplenishTime: Date.now() }); 
      return;
    }

    const now = Date.now();
    const lastTime = state.lastReplenishTime || now;
    const timeDiff = now - lastTime;
    const hoursPassed = timeDiff / (1000 * 60 * 60);
    const livesToRestore = Math.floor(hoursPassed / 4);

    if (livesToRestore > 0) {
      const newLives = Math.min(state.currentLives + livesToRestore, maxLives);
      const timeUsed = livesToRestore * 4 * 60 * 60 * 1000;
      set({
        currentLives: newLives,
        lastReplenishTime: lastTime + timeUsed
      });
    }
  },

  consumeEnergy: async () => {
    const state = get();
    const { boundUserId, currentLives } = state;

    // 1. Check Local State First
    if (currentLives <= 0) {
      return { success: false, error: 'Yetersiz Enerji' };
    }

    // 2. If Guest (no ID), just local
    if (!boundUserId) {
      set({ currentLives: currentLives - 1 });
      return { success: true };
    }

    // 3. Authenticated User -> Server Authority
    try {
      // Optimistic Update?
      // User requested "Online Only". So we should Wait for Server?
      // Or Optimistic + Rollback?
      // "testler offline modda çalışmayacaklar".
      // This implies we should wait for server response.

      const { data, error } = await database.energy.consume(boundUserId);

      if (error || !data) {
        // Network error or DB error
        return { success: false, error: 'Bağlantı hatası veya yetersiz enerji' };
      }

      // RPC returns { success: true, current_energy: 5 }
      const result = data as any;

      if (result.success) {
        set({
          currentLives: result.current_energy,
          // Update timestamp too if provided? 
          // RPC might return last_update? If so update it. 
          // For now, trust the energy value.
        });
        return { success: true };
      } else {
        // Logic Error (e.g. DB says 0 lives even if Local said 1)
        // Sync with DB truth
        if (result.current_energy !== undefined) {
          set({ currentLives: result.current_energy });
        }
        return { success: false, error: result.error || 'Yetersiz Enerji' };
      }

    } catch (err) {
      return { success: false, error: 'Sunucuya ulaşılamadı' };
    }
  },

  watchAd: async () => {
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

    // Use server-aware addLives
    await state.addLives(1);

    // Update local watch times
    set({
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

  incrementDailyLessons: async () => {
    get().checkDailyReset();

    // 1. Optimistic
    set((state) => ({
      dailyProgress: {
        ...state.dailyProgress,
        lessonsCompleted: state.dailyProgress.lessonsCompleted + 1
      }
    }));

    // 2. DB Sync
    const { boundUserId } = get();
    if (boundUserId) {
      await database.dailyTasks.updateProgress(boundUserId, 'lesson', 1);
    }
  },

  incrementDailyTests: async () => {
    get().checkDailyReset();

    // 1. Optimistic
    set((state) => ({
      dailyProgress: {
        ...state.dailyProgress,
        testsCompleted: state.dailyProgress.testsCompleted + 1
      }
    }));

    // 2. DB Sync
    const { boundUserId } = get();
    if (boundUserId) {
      await database.dailyTasks.updateProgress(boundUserId, 'test', 1);
    }
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
        // Sync XP
        const { error: xpError } = await database.users.updateStats(boundUserId, {
          total_score: newTotalXP
        });

        // Mark as claimed in daily_tasks table
        // We need to find the progress_id. Since we don't have it easily here without fetching,
        // we might rely on the 'getDailyTasks' logic to have set it, or fetch it.
        // For now, let's assume we can re-fetch or just update by task ID if we knew it.
        // Actually, database.ts `dailyTasks.claim` takes a progressId (number).
        // But here `taskId` is string (like '1', '2' from hardcoded).
        // The new DB structure uses proper IDs.
        // We will update `DailyTasks.tsx` to pass the correct ID.
        // If passed ID is numeric string, we can try to use it.

        if (!isNaN(Number(taskId))) {
          await database.dailyTasks.claim(Number(taskId));
        }

        if (xpError) {
          console.error('❌ Failed to sync daily task XP to DB:', xpError);
        } else {
          console.log('✅ Daily task XP synced to DB:', xpReward);
        }
      } catch (err) {
        console.error('❌ Error syncing daily task XP:', err);
      }
    }
  },

  setBoundUserId: (id) => set({ boundUserId: id }),

  completeLesson: async (lessonId, skipSync = false) => {
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

  syncCompletedLessons: async () => {
    const state = get();
    const { boundUserId } = state;

    if (boundUserId) {
      try {
        const { data, error } = await database.lessons.getCompleted(boundUserId);
        if (error) {
          console.error('❌ Failed to sync completed lessons from DB:', error);
        } else if (data) {
          const currentLessons = state.completedLessons;
          const dbLessons = data;
          const mergedLessons = Array.from(new Set([...currentLessons, ...dbLessons]));

          if (mergedLessons.length !== currentLessons.length || !dbLessons.every(id => currentLessons.includes(id))) {
            set({ completedLessons: mergedLessons });
            console.log('✅ Synced completed lessons from DB:', dbLessons.length);
          }
        }
      } catch (err) {
        console.error('❌ Error syncing completed lessons:', err);
      }
    }
  },

  startTestSession: async () => {
    const { boundUserId } = get();
    if (!boundUserId) return;

    const sessionToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
    set({ sessionToken });

    try {
      // Verify database.startSession location from previous steps (it was database.users.startSession? No, database.startSession based on grep? 
      // Step 76 showed: startSession under users object (lines 145).
      // So it is database.users.startSession
      await database.users.startSession(boundUserId, sessionToken);
      console.log('🔐 Session started:', sessionToken);
    } catch (error) {
      console.error('Failed to start session:', error);
    }
  }
});
