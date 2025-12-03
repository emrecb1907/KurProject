import { supabase } from './client';
import { User } from '../../types/user.types';

export interface AuthResponse {
  user: User | null;
  error: Error | null;
}

export const authService = {
  // Sign up with email
  async signUp(email: string, password: string, username?: string): Promise<AuthResponse> {
    try {
      // Check if username already exists
      if (username) {
        const { data: existingUser, error: checkError } = await supabase
          .from('users')
          .select('username')
          .eq('username', username)
          .single();

        if (existingUser) {
          return {
            user: null,
            error: new Error('Bu kullanıcı adı zaten kullanılıyor. Lütfen farklı bir kullanıcı adı seçin.'),
          };
        }

        // Ignore error if no user found (that's what we want)
        if (checkError && checkError.code !== 'PGRST116') {
          console.error('❌ Error checking username:', checkError);
        }
      }

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

  // Sign in with email or username
  async signInWithEmailOrUsername(emailOrUsername: string, password: string): Promise<AuthResponse> {
    try {
      // Trim and validate input
      const input = emailOrUsername.trim();

      if (!input || !password) {
        return {
          user: null,
          error: new Error('Email/kullanıcı adı ve şifre gereklidir.'),
        };
      }

      // Check if input is an email (contains @)
      const isEmail = input.includes('@');

      if (isEmail) {
        // Direct email login
        return await this.signIn(input, password);
      } else {
        // Username login - need to find the email first
        console.log('🔍 Looking up email for username:', input);

        // Query database for user with this username (case-insensitive)
        const { data: userData, error: dbError } = await supabase
          .from('users')
          .select('email')
          .ilike('username', input) // Case-insensitive match
          .single();

        if (dbError || !userData?.email) {
          // PGRST116: The result contains 0 rows (User not found)
          if (dbError?.code === 'PGRST116') {
            console.log('ℹ️ Username not found:', input);
          } else {
            console.error('❌ Error looking up username:', input, dbError);
          }

          return {
            user: null,
            error: new Error('Kullanıcı adı bulunamadı.'),
          };
        }

        console.log('✅ Found email for username:', input);

        // Now sign in with the found email
        return await this.signIn(userData.email, password);
      }
    } catch (error) {
      console.error('❌ SignIn Error:', error);
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

  async signInWithGoogle() {
    try {
      // This will be imported dynamically to avoid issues in Expo Go if not available
      // but since we installed it, we can try to use it.
      // However, for safety in this environment, we'll assume the user will build the app.
      const { GoogleSignin, statusCodes } = require('@react-native-google-signin/google-signin');

      // Configure Google Sign-In
      // You need to get these IDs from Google Cloud Console
      GoogleSignin.configure({
        scopes: ['email', 'profile'],
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID, // From .env
        iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID, // Optional
      });

      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      if (userInfo.idToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: userInfo.idToken,
        });

        if (error) throw error;
        return { user: data.user as unknown as User, error: null };
      } else {
        throw new Error('No ID token present!');
      }
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      return { user: null, error: error as Error };
    }
  },

  async signInWithApple() {
    try {
      const AppleAuth = require('expo-apple-authentication');

      const credential = await AppleAuth.signInAsync({
        requestedScopes: [
          AppleAuth.AppleAuthenticationScope.FULL_NAME,
          AppleAuth.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential.identityToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'apple',
          token: credential.identityToken,
        });

        if (error) throw error;
        return { user: data.user as unknown as User, error: null };
      } else {
        throw new Error('No identity token present!');
      }
    } catch (error: any) {
      console.error('Apple Sign-In Error:', error);
      return { user: null, error: error as Error };
    }
  },
};

