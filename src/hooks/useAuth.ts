import { useEffect, useState } from 'react';
import { useStore } from '@store';
import { authService } from '@lib/supabase/auth';
import { database } from '@lib/supabase/database';
import { supabase } from '@lib/supabase/client';

import { migrateLocalDataToDatabase } from '@lib/utils/dataMigration';
import type { User } from '@/types/user.types';
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
  const { user, isAnonymous, setUser, setIsAuthenticated, setIsAnonymous, setIsLoading, logout } = useStore();

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

          // XP is now handled by React Query - no Zustand sync needed

          // 🌍 Ensure user timezone is set
          await ensureTimezoneSet(fullUser.id);
        } else {
          console.log('ℹ️ User authenticated but no DB record found yet (Trigger might be slow)');
          // Ideally we should retry or show a loading state, but for now we wait
        }
      } else {
        // No session - user is not authenticated
        // All data is server-side via React Query, no local fallback needed
        console.log('👤 No session - user not authenticated');
        setUser(null);
        setIsAuthenticated(false);
        setIsAnonymous(true);
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
  async function handleSocialLogin(loginPromise: Promise<{ user: User | null; error: Error | null }>, anonymousUserId?: string) {
    try {
      setIsLoading(true);
      const { user: authUser, error } = await loginPromise;

      if (error) throw error;

      if (authUser) {
        console.log('✅ Social Login Success! User:', authUser.id);

        // Clear explicit logout flag
        await AsyncStorage.removeItem('explicitLogout');

        // Check if this is a NEW user by looking at created_at timestamp
        // If created within last 10 seconds, it's a new account
        const userCreatedAt = new Date((authUser as any).created_at);
        const now = new Date();
        const isNewlyCreatedUser = (now.getTime() - userCreatedAt.getTime()) < 10000; // 10 seconds

        console.log(`📅 User created_at: ${userCreatedAt.toISOString()}, isNewlyCreated: ${isNewlyCreatedUser}`);

        // If this is a newly created user AND we have anonymous data to migrate
        if (isNewlyCreatedUser && anonymousUserId && anonymousUserId !== authUser.id) {
          console.log('🔄 Migrating anonymous data to new Apple account...');
          const migrationResult = await database.migration.migrateAnonymousData(anonymousUserId, authUser.id);
          if (migrationResult.success) {
            console.log('✅ Anonymous data migrated successfully');
          } else {
            console.warn('⚠️ Migration failed:', migrationResult.error);
          }
        }

        // Check if user exists in DB
        const { data: userProfile } = await database.users.getProfile(authUser.id);

        if (userProfile) {
          // User exists - check if they have a valid username
          // Anonymous users have auto-generated usernames like "User-xxxxxxxx"
          const hasValidUsername = userProfile.username &&
            !userProfile.username.startsWith('User-') &&
            userProfile.username.length > 0;

          if (hasValidUsername) {
            // User has a proper username, proceed normally
            await initializeAuth();
            return { error: null, isNew: false };
          } else {
            // User exists but needs to set a username (e.g., converted from anonymous)
            console.log('📝 User exists but needs username');
            await initializeAuth();
            return { error: null, isNew: true };
          }
        } else {
          // No DB record yet - redirect to set-username
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
    try {
      setIsLoading(true);

      // Check if current user is anonymous
      const isCurrentlyAnonymous = isAnonymous;
      const currentUserId = user?.id;

      if (isCurrentlyAnonymous && currentUserId) {
        // Anonymous user - link Apple to current account (preserves user_id)
        console.log('🔗 Linking Apple to anonymous user:', currentUserId);

        const result = await authService.linkAppleToAnonymous();

        if (result.error) {
          if (result.error.message === 'EMAIL_EXISTS' && (result as any).identityToken) {
            // Apple email already has an account - sign in to that account
            console.log('📧 Apple email exists, signing in to existing account');

            // Delete the anonymous user safely via RPC
            await supabase.rpc('delete_anonymous_user_safe', {
              anonymous_user_id: currentUserId
            });
            console.log('🗑️ Deleted anonymous user record via RPC');

            // Sign in to existing Apple account
            const { data, error } = await supabase.auth.signInWithIdToken({
              provider: 'apple',
              token: (result as any).identityToken,
            });

            if (error) throw error;

            console.log('✅ Signed in to existing Apple account:', data.user.id);
            await initializeAuth();
            setIsLoading(false);
            return { error: null, isNew: false };
          }
          throw result.error;
        }

        if (result.user) {
          console.log('✅ Anonymous user converted to Apple user:', result.user.id);
          await initializeAuth();
          setIsLoading(false);
          return { error: null, isNew: true }; // Go to set-username
        }

        return { error: new Error('Link failed'), isNew: false };
      } else {
        // Not anonymous - use normal sign-in flow
        setIsLoading(false);
        return handleSocialLogin(authService.signInWithApple(), currentUserId);
      }
    } catch (error) {
      console.error('❌ signInWithApple Error:', error);
      setIsLoading(false);
      return { error: error as Error, isNew: false };
    }
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
