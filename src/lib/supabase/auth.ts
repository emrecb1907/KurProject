import { supabase } from './client';
import { User } from '@types/user.types';

export interface AuthResponse {
  user: User | null;
  error: Error | null;
}

export const authService = {
  // Sign up with email
  async signUp(email: string, password: string, username?: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (error) throw error;

      // Create user record in users table
      if (data.user) {
        console.log('📝 Creating user record in users table...');
        
        const { error: dbError } = await supabase.from('users').insert({
          id: data.user.id,
          email: data.user.email,
          username: username || data.user.email?.split('@')[0] || 'User',
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

        if (dbError) {
          console.error('❌ Failed to create user in users table:', dbError);
          // Don't throw error, user is created in auth, just log it
        } else {
          console.log('✅ User record created successfully in users table');
        }
      }

      return {
        user: data.user as unknown as User,
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        error: error as Error,
      };
    }
  },

  // Sign in with email
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return {
        user: data.user as unknown as User,
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        error: error as Error,
      };
    }
  },

  // Sign out
  async signOut(): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  // Get current session
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return { session: data.session, error: null };
    } catch (error) {
      return { session: null, error: error as Error };
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return { user: user as unknown as User, error: null };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};

