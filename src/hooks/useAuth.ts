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
      sessionTracker.trackSession().catch(() => {});

      // 2. Check for existing session
      const { session } = await authService.getSession();
      console.log('📋 Session:', session ? `User ${session.user.id}` : 'No session');

      if (session?.user) {
        // User is logged in - fetch from database
        let { data: userData } = await database.users.getById(session.user.id);
        console.log('👤 User data from DB:', userData ? 'Found' : 'Not found');
        
        // If user exists in Auth but not in DB, create DB record
        if (!userData) {
          console.log('⚠️ User in Auth but not in DB, creating record...');
          const { data: newUser, error: createError } = await database.users.create({
            id: session.user.id,
            email: session.user.email || '',
            username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'User',
            is_anonymous: false,
            device_id: null,
            current_lives: 5,
            max_lives: 5,
            total_xp: 0,
            current_level: 1,
            total_score: 0,
            streak_count: 0,
            league: 'Bronze',
          });
          
          if (createError) {
            console.error('❌ Failed to create user in DB:', createError);
          } else if (newUser) {
            userData = newUser;
            console.log('✅ User record created in DB:', newUser.id);
          } else {
            console.error('❌ No user data returned after create');
          }
        }
        
        if (userData) {
          console.log('🔄 Setting user in store:', userData.id, userData.username);
          setUser(userData);
          setIsAuthenticated(true);
          setIsAnonymous(false);
          console.log('✅ Authenticated user set:', userData.username || userData.email);
          
          // Auto-sync: If local XP > database XP, update database
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
          console.error('❌ userData is null, cannot set user in store');
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
    try {
      setIsLoading(true);
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

  // Sign out
  async function signOut() {
    try {
      setIsLoading(true);
      const { error } = await authService.signOut();

      if (error) throw error;

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
    signOut,
    initializeAuth,
  };
}
