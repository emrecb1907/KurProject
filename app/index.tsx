import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomSplashScreen from '@/components/CustomSplashScreen';
import { useStore } from '@/store';

export default function Index() {
  const router = useRouter();
  const [showCustomSplash, setShowCustomSplash] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
      const explicitLogout = await AsyncStorage.getItem('explicitLogout');

      // Wait for custom splash to finish
      setTimeout(async () => {
        setShowCustomSplash(false);

        if (hasSeenOnboarding === 'true') {
          // If user logged out explicitly, go to Gate (Welcome)
          if (explicitLogout === 'true') {
            console.log('🔒 Explicit logout detected. Redirecting to Gate.');
            router.replace('/(auth)/welcome');
            return;
          }

          // If user has seen onboarding but is not authenticated, sign in anonymously
          const state = useStore.getState();
          if (!state.isAuthenticated) {
            console.log('👻 No user found, signing in anonymously...');
            await state.signInAnonymously();
          }

          // Go to tabs
          router.replace('/(tabs)');
        } else {
          // First time user, show onboarding
          router.replace('/onboarding');
        }
      }, 2000); // 2 second splash screen
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      // On error, show onboarding to be safe
      setTimeout(() => {
        setShowCustomSplash(false);
        router.replace('/onboarding');
      }, 2000);
    }
  };

  const handleSplashFinish = () => {
    // Splash finish is handled by the timeout in checkOnboardingStatus
  };

  if (showCustomSplash) {
    return <CustomSplashScreen onFinish={handleSplashFinish} />;
  }

  return null;
}
