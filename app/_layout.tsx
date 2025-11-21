import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { LogBox } from 'react-native';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useUser } from '@/store';
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
  const [fontsLoaded] = useFonts({
    // Add your custom fonts here
    // 'Arabic-Regular': require('../assets/fonts/Arabic-Regular.ttf'),
  });

  const { checkLifeRegeneration } = useUser();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
    checkLifeRegeneration();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
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
        <Stack.Screen name="auth/callback" />
        <Stack.Screen name="games" />
      </Stack>
    </ThemeProvider>
  );
}

