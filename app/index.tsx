import { useRouter } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomSplashScreen from '@/components/CustomSplashScreen';
import { useStore } from '@/store';

export default function Index() {
  const router = useRouter();
  const [showCustomSplash, setShowCustomSplash] = useState(true);
  const navigationDone = useRef(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
      const explicitLogout = await AsyncStorage.getItem('explicitLogout');

      // Minimum splash duration (for animation)
      const minSplashTime = new Promise(resolve => setTimeout(resolve, 2000));

      if (hasSeenOnboarding === 'true') {
        // If user logged out explicitly, go to Gate (Welcome)
        if (explicitLogout === 'true') {
          await minSplashTime; // Wait for minimum splash duration
          if (navigationDone.current) return;
          navigationDone.current = true;
          console.log('🔒 Explicit logout detected. Redirecting to Gate.');
          setShowCustomSplash(false);
          router.replace('/(auth)/welcome');
          return;
        }

        // If user has seen onboarding but is not authenticated, sign in anonymously
        const state = useStore.getState();
        if (!state.isAuthenticated) {
          console.log('👻 No user found, signing in anonymously...');
          // signInAnonymously now waits for profile to be ready (BLOCKING)
          await state.signInAnonymously();
        } else if (!state.isProfileReady) {
          // User is authenticated but profile might not be ready (app restart)
          console.log('🔄 User authenticated, refreshing profile...');
          await state.refreshUser();
        }

        // Wait for minimum splash duration
        await minSplashTime;

        // Double-check profile is ready (with timeout safety)
        const profileReadyPromise = new Promise<void>((resolve) => {
          const checkInterval = setInterval(() => {
            const currentState = useStore.getState();
            if (currentState.isProfileReady) {
              clearInterval(checkInterval);
              resolve();
            }
          }, 100);
          // Safety timeout: proceed after 5 seconds even if profile isn't ready
          setTimeout(() => {
            clearInterval(checkInterval);
            resolve();
          }, 5000);
        });

        await profileReadyPromise;

        if (navigationDone.current) return;
        navigationDone.current = true;

        console.log('✅ Profile ready, navigating to tabs');
        setShowCustomSplash(false);
        router.replace('/(tabs)');
      } else {
        // First time user, show onboarding
        await minSplashTime;
        if (navigationDone.current) return;
        navigationDone.current = true;
        setShowCustomSplash(false);
        router.replace('/onboarding');
      }
    } catch (error) {
      console.error('Error during app initialization:', error);
      // On error, show onboarding to be safe
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (navigationDone.current) return;
      navigationDone.current = true;
      setShowCustomSplash(false);
      router.replace('/onboarding');
    }
  };

  const handleSplashFinish = () => {
    // Splash animation finished - actual navigation is handled by initializeApp
  };

  if (showCustomSplash) {
    return <CustomSplashScreen onFinish={handleSplashFinish} />;
  }

  return null;
}
