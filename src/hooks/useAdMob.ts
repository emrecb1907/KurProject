import { useState, useEffect, useCallback } from 'react';
import { AdService } from '@services/admob';
import { useUserData } from './useUserData';
import { useStore } from '@store';

const MAX_LIVES = 5;
const LIVES_PER_AD = 1;

export function useAdMob() {
  const [isAdReady, setIsAdReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { gainLives } = useUserData();
  const { currentLives } = useStore();

  // Check if ad is ready
  useEffect(() => {
    const checkAdStatus = () => {
      setIsAdReady(AdService.isRewardedAdReady());
    };

    // Check immediately
    checkAdStatus();

    // Check every 2 seconds
    const interval = setInterval(checkAdStatus, 2000);

    return () => clearInterval(interval);
  }, []);

  // Load rewarded ad
  const loadAd = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await AdService.loadRewardedAd();
      setIsAdReady(true);
    } catch (err) {
      setError('Reklam yüklenemedi');
      setIsAdReady(false);
      console.error('Error loading ad:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Show rewarded ad and give lives
  const watchAdForLives = useCallback(async (): Promise<{
    success: boolean;
    livesGained: number;
  }> => {
    if (!isAdReady) {
      setError('Reklam henüz hazır değil');
      return { success: false, livesGained: 0 };
    }

    if (currentLives >= MAX_LIVES) {
      setError('Can sayın zaten maksimumda!');
      return { success: false, livesGained: 0 };
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await AdService.showRewardedAd();

      if (result.rewarded) {
        // Give lives to user
        await gainLives(LIVES_PER_AD);
        setIsAdReady(false);
        
        // Pre-load next ad
        loadAd();

        return { success: true, livesGained: LIVES_PER_AD };
      } else {
        setError('Reklam tamamlanmadı');
        return { success: false, livesGained: 0 };
      }
    } catch (err) {
      setError('Bir hata oluştu');
      console.error('Error showing ad:', err);
      return { success: false, livesGained: 0 };
    } finally {
      setIsLoading(false);
    }
  }, [isAdReady, currentLives, gainLives, loadAd]);

  // Can user watch ad?
  const canWatchAd = useCallback(() => {
    return currentLives < MAX_LIVES && isAdReady;
  }, [currentLives, isAdReady]);

  return {
    isAdReady,
    isLoading,
    error,
    loadAd,
    watchAdForLives,
    canWatchAd: canWatchAd(),
    livesPerAd: LIVES_PER_AD,
  };
}

