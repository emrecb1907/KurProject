// AdMob Service for QuranLearn
// Handles rewarded ads for gaining lives

import {
  InterstitialAd,
  RewardedAd,
  RewardedAdEventType,
  TestIds,
  AdEventType,
} from 'react-native-google-mobile-ads';

// Ad Unit IDs - Use Test IDs for development
const REWARDED_AD_UNIT_ID = __DEV__
  ? TestIds.REWARDED
  : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyy'; // Replace with your actual Ad Unit ID

const INTERSTITIAL_AD_UNIT_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyy'; // Replace with your actual Ad Unit ID

// Initialize Rewarded Ad
const rewardedAd = RewardedAd.createForAdRequest(REWARDED_AD_UNIT_ID, {
  requestNonPersonalizedAdsOnly: false,
});

// Initialize Interstitial Ad
const interstitialAd = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID, {
  requestNonPersonalizedAdsOnly: false,
});

let isRewardedAdLoaded = false;
let isInterstitialAdLoaded = false;

// Load Rewarded Ad
export const loadRewardedAd = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const unsubscribeLoaded = rewardedAd.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        isRewardedAdLoaded = true;
        unsubscribeLoaded();
        resolve();
      }
    );

    const unsubscribeError = rewardedAd.addAdEventListener(
      AdEventType.ERROR,
      (error) => {
        isRewardedAdLoaded = false;
        unsubscribeError();
        reject(error);
      }
    );

    rewardedAd.load();
  });
};

// Show Rewarded Ad
export const showRewardedAd = (): Promise<{
  rewarded: boolean;
  rewardAmount: number;
}> => {
  return new Promise((resolve, reject) => {
    if (!isRewardedAdLoaded) {
      reject(new Error('Reklam henüz yüklenmedi'));
      return;
    }

    let rewarded = false;
    let rewardAmount = 0;

    // Listen for reward event
    const unsubscribeEarned = rewardedAd.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        rewarded = true;
        rewardAmount = reward.amount;
      }
    );

    // Listen for ad closed
    const unsubscribeClosed = rewardedAd.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        isRewardedAdLoaded = false;
        unsubscribeEarned();
        unsubscribeClosed();
        
        // Load next ad
        loadRewardedAd().catch(console.error);
        
        resolve({ rewarded, rewardAmount });
      }
    );

    // Show the ad
    rewardedAd.show();
  });
};

// Check if Rewarded Ad is ready
export const isRewardedAdReady = (): boolean => {
  return isRewardedAdLoaded;
};

// Load Interstitial Ad
export const loadInterstitialAd = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const unsubscribeLoaded = interstitialAd.addAdEventListener(
      AdEventType.LOADED,
      () => {
        isInterstitialAdLoaded = true;
        unsubscribeLoaded();
        resolve();
      }
    );

    const unsubscribeError = interstitialAd.addAdEventListener(
      AdEventType.ERROR,
      (error) => {
        isInterstitialAdLoaded = false;
        unsubscribeError();
        reject(error);
      }
    );

    interstitialAd.load();
  });
};

// Show Interstitial Ad
export const showInterstitialAd = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!isInterstitialAdLoaded) {
      reject(new Error('Reklam henüz yüklenmedi'));
      return;
    }

    const unsubscribeClosed = interstitialAd.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        isInterstitialAdLoaded = false;
        unsubscribeClosed();
        
        // Load next ad
        loadInterstitialAd().catch(console.error);
        
        resolve();
      }
    );

    interstitialAd.show();
  });
};

// Check if Interstitial Ad is ready
export const isInterstitialAdReady = (): boolean => {
  return isInterstitialAdLoaded;
};

// Initialize AdMob
export const initializeAdMob = async (): Promise<void> => {
  try {
    // Pre-load ads
    await Promise.all([
      loadRewardedAd(),
      loadInterstitialAd(),
    ]);
    console.log('AdMob initialized successfully');
  } catch (error) {
    console.error('Error initializing AdMob:', error);
  }
};

// Export ad service
export const AdService = {
  initialize: initializeAdMob,
  loadRewardedAd,
  showRewardedAd,
  isRewardedAdReady,
  loadInterstitialAd,
  showInterstitialAd,
  isInterstitialAdReady,
};

