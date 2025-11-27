import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useFonts, Amiri_400Regular, Amiri_700Bold } from '@expo-google-fonts/amiri';
import * as SplashScreen from 'expo-splash-screen';
import { LogBox, useColorScheme } from 'react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useUser } from '@/store';
import { queryClient } from '@/lib/queryClient';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '@/lib/i18n'; // Initialize i18n

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Ignore auth error logs in LogBox (these are expected user errors, not bugs)
LogBox.ignoreLogs([
  'SignIn Error',
  'SignUp Error',
  'AuthApiError',
  'Invalid login credentials',
]);

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    Amiri_400Regular,
    Amiri_700Bold,
  });

  const { checkLifeRegeneration } = useUser();

  useEffect(() => {
    checkLifeRegeneration();
  }, [fontsLoaded]);

  useEffect(() => {
    if (fontsLoaded) {
      // Hide Expo's splash screen as soon as fonts are loaded
      // Our custom splash will be shown in index.tsx
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'fade',
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)" />
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
  );
}
