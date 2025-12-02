import { useEffect, useState } from 'react';
import { useStore } from '@store';
import { authService } from '@lib/supabase/auth';
import { database } from '@lib/supabase/database';
import { sessionTracker } from '@lib/analytics/sessionTracker';
import { migrateLocalDataToDatabase } from '@lib/utils/dataMigration';
import { User } from '@types/user.types';

export function useAuthHook() {
  const [isInitialized, setIsInitialized] = useState(false);
  const { user, setUser, setIsAuthenticated, setIsAnonymous, setIsLoading, logout } = useStore();

  // Initialize auth state
  useEffect(() => {
    initializeAuth();
  }, []);

  async function initializeAuth() {
    try {
      setIsLoading(true);
      console.log('🔄 Initializing auth...');

      // 1. Track session for analytics (non-blocking, silent fail)
      sessionTracker.trackSession().catch(() => { });

      // 2. Check for existing session
      const { session } = await authService.getSession();
      console.log('📋 Session:', session ? `User ${session.user.id}` : 'No session');

      if (session?.user) {
        // User is logged in - fetch from database
        let { data: userData } = await database.users.getById(session.user.id);
        console.log('👤 User data from DB:', userData ? 'Found' : 'Not found');

        // SECURITY: Check Bound User ID
        const { boundUserId, setBoundUserId, resetUserData } = useStore.getState();

        if (boundUserId && boundUserId !== session.user.id) {
          console.log('🔒 Security: Different user logged in. Wiping local data to prevent merge.');
          console.log(`🔒 Bound: ${boundUserId}, Current: ${session.user.id}`);
          resetUserData();
          setBoundUserId(session.user.id);
          // After wipe, we must ensure we don't use stale local state for auto-sync below
        } else if (!boundUserId) {
          console.log('🔒 Security: First time auth (or Anon). Binding local data to user:', session.user.id);
          setBoundUserId(session.user.id);
        } else {
          console.log('🔒 Security: User matches bound ID. Allowing sync.');
        }

        // If user exists in Auth but not in DB, create DB record
        if (!userData) {
          console.log('⚠️ User in Auth but not in DB. Waiting for explicit creation (Social Login flow)...');
        }

        if (userData) {
          console.log('🔄 Setting user in store:', userData.id, userData.username);
          setUser(userData);
          setIsAuthenticated(true);
          setIsAnonymous(false);
          console.log('✅ Authenticated user set:', userData.username || userData.email);

          // Auto-sync: If local XP > database XP, update database
          // IMPORTANT: We fetch fresh state because resetUserData() might have been called above
          const localXP = useStore.getState().totalXP;
          const dbXP = userData.total_xp;

          if (localXP > dbXP) {
            console.log('🔄 Auto-syncing XP: local', localXP, '> db', dbXP);
            database.users.update(userData.id, {
              total_xp: localXP,
              total_score: localXP,
            }).then(({ error }) => {
              if (error) {
                console.error('❌ Auto-sync failed:', error);
              } else {
                console.log('✅ XP auto-synced to database');
              }
            });
          } else if (dbXP > localXP) {
            // Database has more XP, update local storage
            console.log('🔄 Database XP higher, updating local:', dbXP);
            useStore.getState().setTotalXP(dbXP);
          }
        } else {
          console.log('ℹ️ No user data found in DB, user remains unauthenticated in store (waiting for setup)');
        }
      } else {
        // No session - user is anonymous
        // Data is stored locally in AsyncStorage (via Zustand persist)
        // No database record for anonymous users
        console.log('👤 Anonymous user - using local storage only');
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

      // SECURITY: If we are already bound to a different user (e.g. previous logout),
      // we must WIPE local data before creating a NEW account.
      const { boundUserId, resetUserData } = useStore.getState();
      if (boundUserId) {
        console.log('🔒 Security: Signup with existing bound data. Wiping to prevent merge.');
        resetUserData();
      }

      const { user: authUser, error } = await authService.signUp(email, password, username);

      if (error) throw error;

      if (authUser) {
        console.log('✅ SignUp Success! User:', authUser.id);

        // Track conversion in analytics
        await sessionTracker.markAccountCreated(authUser.id);

        // Migrate local data to database
        await migrateLocalDataToDatabase(authUser.id);

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

        // Track conversion in analytics (in case this is first login after signup)
        await sessionTracker.markAccountCreated(authUser.id);

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

        // Track conversion in analytics (in case this is first login after signup)
        await sessionTracker.markAccountCreated(authUser.id);

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

        // Check if user exists in DB
        const { data: userData } = await database.users.getById(authUser.id);

        if (userData) {
          // User exists, proceed as normal
          await sessionTracker.markAccountCreated(authUser.id);
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

      // Clear local user data (XP, streak, lives, etc.)
      // const { resetUserData } = useStore.getState();
      // resetUserData();
      // CHANGED: We do NOT wipe local data on logout anymore.
      // This allows the "bound" user to log back in and keep their data.
      // If a DIFFERENT user logs in, initializeAuth will handle the wipe.

      logout();
      await initializeAuth(); // Reinitialize as anonymous

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
