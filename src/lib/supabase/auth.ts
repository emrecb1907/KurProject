import { supabase } from './client';
import { database } from './database';
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
        const { data: exists, error: checkError } = await supabase.rpc('check_username', {
          username_to_check: username
        });

        if (checkError) {
          console.error('❌ Error checking username:', checkError);
        } else if (exists) {
          return {
            user: null,
            error: new Error('Bu kullanıcı adı zaten kullanılıyor. Lütfen farklı bir kullanıcı adı seçin.'),
          };
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
        console.log('📝 User created in Auth. Database trigger should handle public.users creation.');
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

  // Convert anonymous user to permanent via email/password
  async convertAnonymousUser(email: string, password: string, username?: string): Promise<AuthResponse> {
    try {
      // Check if username already exists
      if (username) {
        const { data: exists, error: checkError } = await supabase.rpc('check_username', {
          username_to_check: username
        });

        if (checkError) {
          console.error('❌ Error checking username:', checkError);
        } else if (exists) {
          return {
            user: null,
            error: new Error('Bu kullanıcı adı zaten kullanılıyor. Lütfen farklı bir kullanıcı adı seçin.'),
          };
        }
      }

      // updateUser converts the anonymous user to a permanent one
      const { data, error } = await supabase.auth.updateUser({
        email,
        password,
        data: {
          username,
        }
      });

      if (error) throw error;

      console.log('✅ Anonymous user converted successfully:', data.user.id);

      // CRITICAL: Manually sync public.users profile since trigger only runs on INSERT
      if (email || username) {
        console.log('🔄 Syncing public profile...');
        await database.users.updateProfile(data.user.id, {
          email: email,
          username: username
        });
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
        // Use RPC to bypass RLS for unauthenticated users
        const { data: email, error: dbError } = await supabase.rpc('get_email_by_username', {
          username_input: input
        });

        if (dbError || !email) {
          console.error('❌ Error looking up username:', input, dbError);
          return {
            user: null,
            error: new Error('Kullanıcı adı bulunamadı.'),
          };
        }

        console.log('✅ Found email for username:', input);

        // Now sign in with the found email
        return await this.signIn(email, password);
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

  /**
   * Link Apple identity to the current anonymous user
   * This preserves the user_id and all associated data
   * Returns error if Apple email already has an account (fallback to signIn)
   */
  async linkAppleToAnonymous(): Promise<AuthResponse & { appleEmail?: string; identityToken?: string }> {
    try {
      const AppleAuth = require('expo-apple-authentication');

      // Get Apple credentials
      const credential = await AppleAuth.signInAsync({
        requestedScopes: [
          AppleAuth.AppleAuthenticationScope.FULL_NAME,
          AppleAuth.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        throw new Error('No identity token present!');
      }

      console.log('📱 Apple credentials received, email:', credential.email);

      // Get Apple email from JWT token if not directly provided
      let appleEmail = credential.email;
      if (!appleEmail && credential.identityToken) {
        // Decode JWT to get email
        const tokenParts = credential.identityToken.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          appleEmail = payload.email;
          console.log('📧 Email from token:', appleEmail);
        }
      }

      if (!appleEmail) {
        throw new Error('Could not get email from Apple');
      }

      // Check if this email already exists in users table (server-side for security)
      const { data: emailExists } = await supabase.rpc('check_email_exists', {
        email_to_check: appleEmail
      });

      if (emailExists) {
        console.log('📧 Email already registered, need to use signIn + migration');
        // Return special error to trigger fallback to signInWithApple + migration
        return {
          user: null,
          error: new Error('EMAIL_EXISTS'),
          appleEmail,
          identityToken: credential.identityToken
        };
      }

      // Update the current anonymous user with Apple email
      // This converts anonymous user to permanent without changing user_id
      const { data, error } = await supabase.auth.updateUser({
        email: appleEmail,
        data: {
          provider: 'apple',
          apple_user_id: credential.user,
          full_name: credential.fullName ?
            `${credential.fullName.givenName || ''} ${credential.fullName.familyName || ''}`.trim() : null
        }
      });

      if (error) throw error;

      console.log('✅ Anonymous user linked to Apple:', data.user.id);

      // IMPORTANT: Also sync email to public.users table
      await database.users.updateProfile(data.user.id, { email: appleEmail });
      console.log('📧 Email synced to public.users');

      return { user: data.user as unknown as User, error: null };
    } catch (error: any) {
      console.error('❌ Link Apple Error:', error);
      return { user: null, error: error as Error };
    }
  },
};

