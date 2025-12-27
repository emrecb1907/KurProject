import { StateCreator } from 'zustand';
import { User } from '@/types/user.types';
import { supabase } from '@/lib/supabase/client';
import { database } from '@/lib/supabase/database';
import { adapty } from 'react-native-adapty';

export interface AuthSlice {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isAnonymous: boolean;
  isLoading: boolean;
  isProfileReady: boolean; // NEW: Track if profile is fully loaded

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
  isProfileReady: false, // NEW: Initially false

  // Actions
  setUser: (user) => set({ user }),

  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

  setIsAnonymous: (isAnonymous) => set({ isAnonymous }),

  setIsLoading: (isLoading) => set({ isLoading }),

  logout: () => {
    // 🔐 Adapty: Kullanıcı profili sıfırla (anonim profile dön)
    adapty.logout()
      .then(() => console.log('✅ Adapty: Kullanıcı çıkışı yapıldı'))
      .catch((err) => console.warn('⚠️ Adapty logout hatası:', err));

    set({
      user: null,
      isAuthenticated: false,
      isAnonymous: true,
      isProfileReady: false, // Reset on logout
    });
  },

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
          } as User,
          isProfileReady: true, // Profile is ready
        }));
      }
    } catch (error) {
      console.error('Failed to refresh user profile:', error);
    }
  },

  // Anonymous Sign In - BLOCKING until profile is ready
  signInAnonymously: async () => {
    set({ isLoading: true, isProfileReady: false });
    try {
      const { data, error } = await supabase.auth.signInAnonymously();

      if (error) {
        console.error('Supabase anonymous sign-in error:', error);
        throw error;
      }

      const user = data.user;

      if (user) {
        // Initial set with basic info from Supabase Auth (profile not ready yet)
        // Map Supabase Auth user to our User type with defaults
        const initialUser: User = {
          id: user.id,
          device_id: 'unknown',
          email: user.email,
          is_anonymous: user.is_anonymous || true,
          // Default values until profile loads
          total_xp: 0,
          current_level: 1,
          total_score: 0,
          current_lives: 5,
          max_lives: 6,
          streak_count: 0,
          last_active: new Date().toISOString(),
          created_at: user.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
          league: 'Bronze',
        };

        set({
          user: initialUser,
          isAuthenticated: true,
          isAnonymous: true,
          isLoading: false,
          isProfileReady: false, // Not ready yet!
        });

        // Fetch profile with retry logic (BLOCKING - await result)
        const fetchProfileWithRetry = async (userId: string, maxRetries = 5): Promise<boolean> => {
          let delay = 500; // Start with 500ms

          for (let attempt = 1; attempt <= maxRetries; attempt++) {
            await new Promise(resolve => setTimeout(resolve, delay));

            const { data: profile } = await database.users.getProfile(userId);

            if (profile) {
              console.log(`✅ Profile fetched on attempt ${attempt}`);
              set((state) => ({
                user: {
                  ...state.user,
                  ...profile,
                  id: userId,
                  is_anonymous: true
                } as User,
                isProfileReady: true, // NOW it's ready!
              }));

              // 🌍 Set timezone immediately if not set (UTC or null)
              if (!profile.timezone || profile.timezone === 'UTC') {
                const deviceTz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
                console.log('🌍 Setting anonymous user timezone:', deviceTz);
                await database.timezone.set(userId, deviceTz);
              }

              return true;
            }

            console.log(`⏳ Profile not ready, attempt ${attempt}/${maxRetries}`);
            delay = Math.min(delay * 1.5, 3000); // Exponential backoff, max 3s
          }

          console.warn('⚠️ Profile fetch failed after max retries');
          return false;
        };

        // BLOCKING: Wait for profile before returning success
        const profileFetched = await fetchProfileWithRetry(user.id);

        if (!profileFetched) {
          // Profile couldn't be fetched - still allow auth but mark profile not ready
          console.error('❌ Could not fetch profile after all retries');
          return { success: true, error: 'Profile creation timeout - please try again' };
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Anonymous sign-in failed:', error);
      set({ isLoading: false, isProfileReady: false });
      return { success: false, error };
    }
  },
});

