import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useShallow } from 'zustand/react/shallow';

import { AuthSlice, createAuthSlice } from './slices/authSlice';
import { UserSlice, createUserSlice } from './slices/userSlice';
import { GameSlice, createGameSlice } from './slices/gameSlice';
import { UISlice, createUISlice } from './slices/uiSlice';

// Combined store type
export type StoreState = AuthSlice & UserSlice & GameSlice & UISlice;

// Create the store with persistence
export const useStore = create<StoreState>()(
  persist(
    (...args) => ({
      ...createAuthSlice(...args),
      ...createUserSlice(...args),
      ...createGameSlice(...args),
      ...createUISlice(...args),
    }),
    {
      name: 'quranlearn-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist certain slices
      partialize: (state) => ({
        // Auth state - MUST persist user object!
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isAnonymous: state.isAnonymous,

        // User state
        totalXP: state.totalXP,
        currentLevel: state.currentLevel,
        totalScore: state.totalScore,
        currentLives: state.currentLives,
        maxLives: state.maxLives,
        streak: state.streak,
        progress: state.progress,
        streakData: state.streakData,
        lastReplenishTime: state.lastReplenishTime,
        adWatchTimes: state.adWatchTimes,
        boundUserId: state.boundUserId,
        completedTests: state.completedTests,
        successRate: state.successRate,
        dailyProgress: state.dailyProgress,
        completedLessons: state.completedLessons,

        // Don't persist game state (should be ephemeral)
        // Don't persist UI state (should be ephemeral)
      }),
      onRehydrateStorage: () => (state) => {
        // Check daily reset when storage is rehydrated (app opens)
        if (state) {
          state.checkDailyReset();
          state.checkLifeRegeneration();
        }
      },
    }
  )
);

// Selectors for better performance (using shallow equality)
export const useAuth = () => useStore(
  useShallow((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isAnonymous: state.isAnonymous,
    isLoading: state.isLoading,
    setUser: state.setUser,
    setIsAuthenticated: state.setIsAuthenticated,
    setIsAnonymous: state.setIsAnonymous,
    setIsLoading: state.setIsLoading,
    logout: state.logout,
    signInAnonymously: state.signInAnonymously,
    refreshUser: state.refreshUser,
  }))
);

export const useUser = () => useStore(
  useShallow((state) => ({
    totalXP: state.totalXP,
    currentLevel: state.currentLevel,
    totalScore: state.totalScore,
    currentLives: state.currentLives,
    maxLives: state.maxLives,
    streak: state.streak,
    progress: state.progress,
    streakData: state.streakData,
    lastReplenishTime: state.lastReplenishTime,
    adWatchTimes: state.adWatchTimes,
    completedTests: state.completedTests,
    successRate: state.successRate,
    setTotalXP: state.setTotalXP,
    addXP: state.addXP,
    setCurrentLevel: state.setCurrentLevel,
    setTotalScore: state.setTotalScore,
    setCurrentLives: state.setCurrentLives,
    addLives: state.addLives,
    removeLives: state.removeLives,
    setStreak: state.setStreak,
    setProgress: state.setProgress,
    setStreakData: state.setStreakData,
    setUserStats: state.setUserStats,
    updateGameStats: state.updateGameStats,
    resetUserData: state.resetUserData,
    checkLifeRegeneration: state.checkLifeRegeneration,
    watchAd: state.watchAd,
    boundUserId: state.boundUserId,
    setBoundUserId: state.setBoundUserId,
    dailyProgress: state.dailyProgress,
    checkDailyReset: state.checkDailyReset,
    claimDailyTask: state.claimDailyTask,
    completedLessons: state.completedLessons,
    completeLesson: state.completeLesson,
    syncCompletedLessons: state.syncCompletedLessons,
    startTestSession: state.startTestSession,
    sessionToken: state.sessionToken,
  }))
);

export const useGame = () => useStore(
  useShallow((state) => ({
    gameState: state.gameState,
    currentQuestion: state.currentQuestion,
    questions: state.questions,
    isGameActive: state.isGameActive,
    startGame: state.startGame,
    setCurrentQuestion: state.setCurrentQuestion,
    submitAnswer: state.submitAnswer,
    endGame: state.endGame,
    resetGame: state.resetGame,
  }))
);

export const useUI = () => useStore(
  useShallow((state) => ({
    isLoading: state.isLoading,
    errorMessage: state.errorMessage,
    successMessage: state.successMessage,
    modalVisible: state.modalVisible,
    modalContent: state.modalContent,
    setIsLoading: state.setIsLoading,
    setErrorMessage: state.setErrorMessage,
    setSuccessMessage: state.setSuccessMessage,
    showModal: state.showModal,
    hideModal: state.hideModal,
    clearMessages: state.clearMessages,
  }))
);

