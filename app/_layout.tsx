import { Stack, useSegments, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useFonts, Amiri_400Regular, Amiri_700Bold } from '@expo-google-fonts/amiri';

import * as SplashScreen from 'expo-splash-screen';
import { LogBox, useColorScheme } from 'react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useUser, useAuth } from '@/store';
import { queryClient } from '@/lib/queryClient';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '@/lib/i18n'; // Initialize i18n
import { loadSavedLanguage } from '@/lib/i18n';

// Error Handling
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { OfflineBanner } from '@/components/ui/OfflineBanner';
import { errorHandler } from '@/lib/errorHandler';
import * as Sentry from '@sentry/react-native';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Ignore auth error logs in LogBox (these are expected user errors, not bugs)
LogBox.ignoreLogs([
  'SignIn Error',
  'SignUp Error',
  'AuthApiError',
  'Invalid login credentials',
]);

// Initialize Sentry/ErrorHandler
errorHandler.init();

function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    Amiri_400Regular,
    Amiri_700Bold,
  });

  const { checkLifeRegeneration, setBoundUserId } = useUser();

  useEffect(() => {
    checkLifeRegeneration();
    loadSavedLanguage();
  }, [fontsLoaded]);

  useEffect(() => {
    if (fontsLoaded) {
      // Hide Expo's splash screen as soon as fonts are loaded
      // Our custom splash will be shown in index.tsx
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Global Auth Guard
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated, user, refreshUser } = useAuth();

  // 🔄 Bind User ID to User Store whenever Auth state changes
  useEffect(() => {
    if (user?.id) {
      console.log('🔗 Binding User ID:', user.id);
      setBoundUserId(user.id);
      // Fetch fresh profile data (username, XP, etc.) from DB
      refreshUser();
    } else {
      setBoundUserId(null);
    }
  }, [user?.id]);


  useEffect(() => {
    const checkAuth = async () => {
      // If user is already authenticated (and state is updated), allow access
      if (isAuthenticated) return;

      try {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        const explicitLogout = await AsyncStorage.getItem('explicitLogout');

        // If user explicitly logged out, prevent access to protected areas
        if (explicitLogout === 'true') {
          const inAuthGroup = segments[0] === '(auth)';
          const inOnboarding = segments[0] === 'onboarding';
          const isIndex = segments.length === 0 || (segments[0] === 'index');

          // Allow access only to Auth screens, Onboarding, and Index
          if (!inAuthGroup && !inOnboarding && !isIndex) {
            console.log('🔒 Auth Guard: Redirecting to welcome screen');
            router.replace('/(auth)/welcome');
          }
        }
      } catch (error) {
        console.error('Auth Guard Error:', error);
      }
    };

    checkAuth();
  }, [segments, isAuthenticated]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <OfflineBanner />
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'fade',
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="onboarding" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="settings" />
              <Stack.Screen name="change-password" />
              <Stack.Screen
                name="games"
                options={{
                  gestureEnabled: false,
                  fullScreenGestureEnabled: false,
                }}
              />
            </Stack>
          </ThemeProvider>
        </QueryClientProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

export default Sentry.wrap(RootLayout);