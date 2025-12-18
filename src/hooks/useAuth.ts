import { useEffect, useState } from 'react';
import { useStore } from '@store';
import { authService } from '@lib/supabase/auth';
import { database } from '@lib/supabase/database';
import { supabase } from '@lib/supabase/client';

import { migrateLocalDataToDatabase } from '@lib/utils/dataMigration';
import { User } from '@types/user.types';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 🌍 Get device timezone
function getDeviceTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

// 🌍 Detect and save timezone if not already set
async function ensureTimezoneSet(userId: string): Promise<void> {
  try {
    const { data } = await database.timezone.get(userId);
    const currentTz = data?.timezone;

    // If timezone is NULL or still default 'UTC', set it to device timezone
    if (!currentTz || currentTz === 'UTC') {
      const deviceTz = getDeviceTimezone();
      console.log('🌍 Setting user timezone:', deviceTz);
      await database.timezone.set(userId, deviceTz);
    }
  } catch (error) {
    console.error('Failed to set timezone:', error);
  }
}

// 🔒 Global flag to prevent re-initialization across all hook instances
let hasInitialized = false;

export function useAuthHook() {
  const [isInitialized, setIsInitialized] = useState(false);
  const { user, setUser, setIsAuthenticated, setIsAnonymous, setIsLoading, logout } = useStore();

  // Initialize auth state - only ONCE per app session
  useEffect(() => {
    if (!hasInitialized) {
      hasInitialized = true;
      initializeAuth();
    } else {
      // Already initialized, just mark local state
      setIsInitialized(true);
    }
  }, []);

  async function initializeAuth() {
    try {
      setIsLoading(true);
      console.log('🔄 Initializing auth...');

      // 2. Check for existing session
      const { session } = await authService.getSession();
      console.log('📋 Session:', session ? `User ${session.user.id}` : 'No session');

      if (session?.user) {
        // User is logged in - fetch from database
        const { data: userProfile, error: profileError } = await database.users.getProfile(session.user.id);
        console.log('👤 User data from DB:', userProfile ? 'Found' : 'Not found');
        if (profileError) console.error('❌ Profile Fetch Error:', profileError);

        if (!userProfile) {
          // DEBUG: Check if user exists bypassing RLS
          const { data: debugUser } = await supabase.rpc('debug_get_user', { user_id_input: session.user.id });
          console.log('🕵️ DEBUG: User exists in DB (RLS bypassed)?', debugUser ? 'YES' : 'NO');
          if (debugUser) console.log('🕵️ DEBUG User Data:', debugUser);
        }

        // SECURITY: Check Bound User ID
        const { boundUserId, setBoundUserId, resetUserData } = useStore.getState();

        if (boundUserId && boundUserId !== session.user.id) {
          console.log('🔒 Security: Different user logged in. Wiping local data to prevent merge.');
          resetUserData();
          setBoundUserId(session.user.id);
        } else if (!boundUserId) {
          console.log('🔒 Security: First time auth (or Anon). Binding local data to user:', session.user.id);
          setBoundUserId(session.user.id);
        }

        if (userProfile) {
          // Flatten the profile structure for the store
          // The store expects a single User object with stats merged in
          const fullUser = {
            ...userProfile,
            ...userProfile.stats, // Merge stats (total_xp, level, etc.)
            streak_count: userProfile.streak?.streak || 0, // Merge streak
          };

          console.log('🔄 Setting user in store:', fullUser.id, fullUser.username);
          setUser(fullUser as unknown as User); // Type assertion needed until types are fully aligned

          // CRITICAL FIX: Robust check for anonymous user
          // 1. Check direct 'is_anonymous' property
          // 2. Check identities for 'anonymous' provider
          // 3. Check app_metadata for 'anonymous' provider
          const isAnon =
            session.user.is_anonymous ||
            session.user.identities?.some((id) => id.provider === 'anonymous') ||
            session.user.app_metadata?.provider === 'anonymous' ||
            false;

          setIsAuthenticated(true); // Technically authenticated with Supabase
          setIsAnonymous(isAnon); // But check if anonymous

          console.log(`✅ Authenticated user set: ${fullUser.username || fullUser.email} (Anonymous: ${isAnon})`);

          // Auto-sync: If local XP > database XP, update database
          const localXP = useStore.getState().totalXP;
          const dbXP = fullUser.total_xp || 0;

          if (localXP > dbXP) {
            console.log('🔄 Auto-syncing XP: local', localXP, '> db', dbXP);

            // Update stats
            await database.users.updateStats(fullUser.id, {
              total_score: localXP,
              // We might want to sync level here too if local calculation is trusted
            });
          } else if (dbXP > localXP) {
            console.log('🔄 Database XP higher, updating local:', dbXP);
            useStore.getState().setTotalXP(dbXP);
          }

          // 🌍 Ensure user timezone is set
          await ensureTimezoneSet(fullUser.id);
        } else {
          console.log('ℹ️ User authenticated but no DB record found yet (Trigger might be slow)');
          // Ideally we should retry or show a loading state, but for now we wait
        }
      } else {
        // No session - user is anonymous
        // Data is stored locally in AsyncStorage (via Zustand persist)
        // No database record for anonymous users
        console.log('👤 Anonymous user - using local storage only');
        setIsAuthenticated(false);
        setIsAnonymous(true);

        // Ensure user object in store reflects anonymous state if it exists
        // or create a temporary anonymous user object if missing
        if (user) {
          setUser({ ...user, is_anonymous: true });
        } else {
          // Create a default anonymous user so local XP/Lives work
          setUser({
            id: 'anon_' + Date.now(),
            is_anonymous: true,
            total_xp: 0,
            current_level: 1,
            total_score: 0,
            current_lives: 5,
            max_lives: 5,
            streak_count: 0,
            league: 'Bronze',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            device_id: 'unknown'
          } as User);
        }
      }

      setIsInitialized(true);
      console.log('✅ Auth initialization complete');
    } catch (error) {
      console.error('❌ Auth initialization error:', error);
      setIsInitialized(true); // Still mark as initialized to prevent infinite loading
    } finally {
      setIsLoading(false);
    }
  }

  // Sign up
  async function signUp(email: string, password: string, username?: string) {
    console.log('🔵 useAuth.signUp called with:', email);
    try {
      setIsLoading(true);

      const currentState = useStore.getState();
      const isAnon = currentState.isAnonymous;

      // SECURITY: If we are already bound to a different user AND NOT ANONYMOUS
      // we must WIPE local data before creating a NEW account.
      if (currentState.boundUserId && !isAnon) {
        // Check if the current session matches the bound ID. 
        // If we are currently anonymous, boundUserId IS the anon ID.
        // Effectively: Only wipe if we are switching from one REAL user to another.
        // BUT: here we are signing up.

        // Logic: 
        // 1. If Anonymous -> Convert (Keep Data)
        // 2. If Not Anonymous (Logged out or other user) -> Wipe & Create New
      }

      let authUser;
      let error;

      if (isAnon && currentState.user?.id) {
        console.log('👻 Converting Anonymous User to Permanent:', currentState.user.id);

        try {
          const result = await authService.convertAnonymousUser(email, password, username);

          if (result.error && result.error.name === 'AuthSessionMissingError') {
            throw result.error; // Throw to catch block below to trigger fallback
          }

          authUser = result.user;
          error = result.error;
        } catch (conversionError: any) {
          console.warn('⚠️ Conversion failed (likely session missing), falling back to fresh signup:', conversionError.message);

          // Fallback to fresh signup
          // If session is missing, we can't convert, so we just create a new user.
          // We might lose local data if it wasn't synced, but we have no choice if session is gone.

          if (currentState.boundUserId) {
            console.log('🔒 Security: Wiping previous local data (fallback).');
            currentState.resetUserData();
          }

          const result = await authService.signUp(email, password, username);
          authUser = result.user;
          error = result.error;
        }
      } else {
        // Regular Sign Up (Fresh Account)
        console.log('🆕 Creating Fresh Account');
        if (currentState.boundUserId) {
          console.log('🔒 Security: Wiping previous local data.');
          currentState.resetUserData();
        }
        const result = await authService.signUp(email, password, username);
        authUser = result.user;
        error = result.error;
      }

      if (error) throw error;

      if (authUser) {
        console.log('✅ SignUp/Conversion Success! User:', authUser.id);

        // Clear explicit logout flag so next time we might auto-login if session persists
        await AsyncStorage.removeItem('explicitLogout');

        if (!isAnon) {
          // Only migrate if it was a FRESH signup (conversion handles data retention automatically via DB)
          await migrateLocalDataToDatabase(authUser.id);
        }

        // Re-initialize to load new user data
        await initializeAuth();

        console.log('✅ Auth initialized after signup');
      }

      return { error: null };
    } catch (error) {
      console.error('❌ SignUp Error:', error);
      return { error: error as Error };
    } finally {
      setIsLoading(false);
    }
  }

  // Sign in
  async function signIn(email: string, password: string) {
    console.log('🔵 useAuth.signIn called with:', email);
    try {
      setIsLoading(true);
      const { user: authUser, error } = await authService.signIn(email, password);

      if (error) throw error;

      if (authUser) {
        console.log('✅ SignIn Success! User:', authUser.id);

        // Clear explicit logout flag
        await AsyncStorage.removeItem('explicitLogout');

        // Re-initialize to load user data from database
        await initializeAuth();
        console.log('✅ Auth initialized after signin');
      }

      return { error: null };
    } catch (error) {
      console.error('❌ SignIn Error:', error);
      return { error: error as Error };
    } finally {
      setIsLoading(false);
    }
  }

  // Sign in with email or username
  async function signInWithEmailOrUsername(emailOrUsername: string, password: string) {
    console.log('🔵 useAuth.signInWithEmailOrUsername called with:', emailOrUsername);
    try {
      setIsLoading(true);
      const { user: authUser, error } = await authService.signInWithEmailOrUsername(emailOrUsername, password);

      if (error) throw error;

      if (authUser) {
        console.log('✅ SignIn Success! User:', authUser.id);

        // Clear explicit logout flag
        await AsyncStorage.removeItem('explicitLogout');

        // Re-initialize to load user data from database
        await initializeAuth();
        console.log('✅ Auth initialized after signin');
      }

      return { error: null };
    } catch (error) {
      console.error('❌ SignIn Error:', error);
      return { error: error as Error };
    } finally {
      setIsLoading(false);
    }
  }

  // Social Sign In Helper
  async function handleSocialLogin(loginPromise: Promise<{ user: User | null; error: Error | null }>) {
    try {
      setIsLoading(true);
      const { user: authUser, error } = await loginPromise;

      if (error) throw error;

      if (authUser) {
        console.log('✅ Social Login Success! User:', authUser.id);

        // Clear explicit logout flag
        await AsyncStorage.removeItem('explicitLogout');

        // Check if user exists in DB
        const { data: userProfile } = await database.users.getProfile(authUser.id);

        if (userProfile) {
          // User exists, proceed as normal
          await initializeAuth();
          return { error: null, isNew: false };
        } else {
          // New user (or no DB record) -> Redirect to set-username
          // Do NOT initializeAuth yet (it would fail to find user and do nothing)
          return { error: null, isNew: true };
        }
      }

      return { error: new Error('Login failed'), isNew: false };
    } catch (error) {
      console.error('❌ Social Login Error:', error);
      return { error: error as Error, isNew: false };
    } finally {
      setIsLoading(false);
    }
  }

  async function signInWithGoogle() {
    return handleSocialLogin(authService.signInWithGoogle());
  }

  async function signInWithApple() {
    return handleSocialLogin(authService.signInWithApple());
  }

  // Sign out
  async function signOut() {
    try {
      setIsLoading(true);
      const { error } = await authService.signOut();

      if (error) throw error;

      // PROPER LOGOUT GATE:
      // 2. Do NOT initializeAuth() which would create a new anon user.
      await AsyncStorage.setItem('explicitLogout', 'true');
      console.log('🔒 Explicit logout flag set.');

      logout(); // Clear Zustand store

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    } finally {
      setIsLoading(false);
    }
  }

  return {
    user,
    isInitialized,
    signUp,
    signIn,
    signInWithEmailOrUsername,
    signInWithGoogle,
    signInWithApple,
    signOut,
    initializeAuth,
  };
}
