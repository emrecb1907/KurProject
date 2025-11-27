import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { useAuthHook } from '@/hooks';
import CustomSplashScreen from '@/components/CustomSplashScreen';

export default function Index() {
  const router = useRouter();
  const { isInitialized } = useAuthHook();
  const [showCustomSplash, setShowCustomSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowCustomSplash(false);
    // Navigate to onboarding after custom splash
    router.replace('/onboarding');
  };

  if (!isInitialized || showCustomSplash) {
    return <CustomSplashScreen onFinish={handleSplashFinish} />;
  }

  return null;
}
