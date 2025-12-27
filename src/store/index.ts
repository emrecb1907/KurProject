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
      // Only persist UI state - server state comes from React Query
      partialize: (state) => ({
        // Auth state
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isAnonymous: state.isAnonymous,

        // UI preferences
        selectedAvatar: state.selectedAvatar,
        hapticsEnabled: state.hapticsEnabled,
        soundsEnabled: state.soundsEnabled,

        // Auth references
        boundUserId: state.boundUserId,
        adWatchTimes: state.adWatchTimes,

        // Title notification tracking
        lastSeenTitleCount: state.lastSeenTitleCount,

        // Don't persist game state (should be ephemeral)
        // Don't persist UI state (should be ephemeral)
        // Don't persist server state (comes from React Query)
      }),
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
    isProfileReady: state.isProfileReady, // NEW: Track if profile is ready
    setUser: state.setUser,
    setIsAuthenticated: state.setIsAuthenticated,
    setIsAnonymous: state.setIsAnonymous,
    setIsLoading: state.setIsLoading,
    logout: state.logout,
    signInAnonymously: state.signInAnonymously,
    refreshUser: state.refreshUser,
  }))
);

/**
 * useUser - UI State Only
 * 
 * For server data, use React Query hooks:
 * - useUserData() for XP, level, streak, stats
 * - useEnergy() for energy/lives
 * - useDailyProgress() for daily task progress
 * - useCompletedLessons() for completed lessons list
 */
export const useUser = () => useStore(
  useShallow((state) => ({
    // UI preferences
    selectedAvatar: state.selectedAvatar,
    hapticsEnabled: state.hapticsEnabled,
    soundsEnabled: state.soundsEnabled,
    setSelectedAvatar: state.setSelectedAvatar,
    setHapticsEnabled: state.setHapticsEnabled,
    setSoundsEnabled: state.setSoundsEnabled,

    // Auth references
    boundUserId: state.boundUserId,
    sessionToken: state.sessionToken,
    setBoundUserId: state.setBoundUserId,
    setSessionToken: state.setSessionToken,

    // Title notification tracking
    lastSeenTitleCount: state.lastSeenTitleCount,
    setLastSeenTitleCount: state.setLastSeenTitleCount,

    // Reset
    resetUserData: state.resetUserData,
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
