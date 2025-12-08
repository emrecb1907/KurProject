import { StateCreator } from 'zustand';
import { User } from '@/types/user.types';
import { supabase } from '@/lib/supabase/client';

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
  signInAnonymously: () => Promise<{ success: boolean; error?: any }>;
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

  // Anonymous Sign In
  signInAnonymously: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signInAnonymously();

      if (error) {
        console.error('Supabase anonymous sign-in error:', error);
        throw error;
      }

      const user = data.user;

      if (user) {
        // Map Supabase user to App user type if needed, or just store essential info
        set({
          user: user as any,
          isAuthenticated: true,
          isAnonymous: true,
          isLoading: false
        });
      }
      return { success: true };
    } catch (error) {
      console.error('Anonymous sign-in failed:', error);
      set({ isLoading: false });
      return { success: false, error };
    }
  },
});
