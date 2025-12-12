import { StateCreator } from 'zustand';
import { User } from '@/types/user.types';
import { supabase } from '@/lib/supabase/client';
import { database } from '@/lib/supabase/database';

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
  refreshUser: () => Promise<void>;
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

  refreshUser: async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data: profile } = await database.users.getProfile(authUser.id);

      if (profile) {
        set((state) => ({
          user: {
            ...state.user,
            ...profile,
            id: authUser.id,
            email: authUser.email,
            is_anonymous: authUser.is_anonymous || false,
          } as User
        }));
      }
    } catch (error) {
      console.error('Failed to refresh user profile:', error);
    }
  },

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
        // Initial set with basic info
        set({
          user: user as any,
          isAuthenticated: true,
          isAnonymous: true,
          isLoading: false
        });

        // Immediately fetch FULL profile (username etc.) from DB
        // Wait a bit for trigger to complete
        setTimeout(async () => {
          const { data: profile } = await database.users.getProfile(user.id);
          if (profile) {
            set((state) => ({
              user: {
                ...state.user, // keep existing
                ...profile,    // overwrite with DB data (username)
                id: user.id,
                is_anonymous: true
              } as User
            }));
          }
        }, 1000);
      }
      return { success: true };
    } catch (error) {
      console.error('Anonymous sign-in failed:', error);
      set({ isLoading: false });
      return { success: false, error };
    }
  },
});

