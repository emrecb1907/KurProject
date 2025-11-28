import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomSplashScreen from '@/components/CustomSplashScreen';

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

      // Wait for custom splash to finish
      setTimeout(() => {
        setShowCustomSplash(false);

        if (hasSeenOnboarding === 'true') {
          // User has seen onboarding, go to tabs
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
