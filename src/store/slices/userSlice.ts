import { StateCreator } from 'zustand';
import { UserProgress, UserStreak } from '@types/user.types';

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
  resetUserData: () => void;
}

const initialState = {
  totalXP: 0,
  currentLevel: 1,
  totalScore: 0,
  currentLives: 5,
  maxLives: 5,
  streak: 0,
  progress: [],
  streakData: null,
};

export const createUserSlice: StateCreator<UserSlice> = (set) => ({
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
  
  resetUserData: () => set(initialState),
});

