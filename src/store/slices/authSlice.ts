import { StateCreator } from 'zustand';
import { User } from '@types/user.types';

export interface AuthSlice {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isAnonymous: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsAnonymous: (isAnonymous: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  logout: () => void;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isAnonymous: true,
  isLoading: true,
  
  // Actions
  setUser: (user) => set({ user }),
  
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  
  setIsAnonymous: (isAnonymous) => set({ isAnonymous }),
  
  setIsLoading: (isLoading) => set({ isLoading }),
  
  logout: () => set({
    user: null,
    isAuthenticated: false,
    isAnonymous: true,
  }),
});

