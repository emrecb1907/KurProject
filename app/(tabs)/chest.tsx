import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert, DeviceEventEmitter } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '@constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/store';
import { Heart, Lightbulb, Video, ArrowLeft, Play, Gift, Calendar, Star, CaretDown, CaretUp } from 'phosphor-react-native';

import { useTranslation } from 'react-i18next';
import { HeaderButton } from '@/components/ui/HeaderButton';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

export default function ChestScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { themeVersion, activeTheme } = useTheme();
  const { currentLives, maxLives, watchAd, adWatchTimes, lastReplenishTime, checkLifeRegeneration } = useUser();

  // Dynamic styles that update when theme changes
  const styles = useMemo(() => getStyles(activeTheme), [themeVersion, activeTheme]);

  const [now, setNow] = useState(Date.now());

  // ScrollView ref for resetting scroll position
  const scrollViewRef = useRef<ScrollView>(null);

  // Reset scroll position when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  // Scroll to top listener
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('scrollToTopChest', () => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    });
    return () => subscription.remove();
  }, []);

  // Update timer every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
      checkLifeRegeneration(); // Check for regeneration every minute
    }, 1000); // Update every second for smooth countdown
    return () => clearInterval(interval);
  }, []);

  const getNextLifeTime = () => {
    if (!lastReplenishTime || currentLives >= maxLives) return '';

    const nextReplenishTime = lastReplenishTime + (4 * 60 * 60 * 1000);
    const diff = nextReplenishTime - now;

    if (diff <= 0) return '00:00:00';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleWatchAd = async () => {
    const success = await watchAd();
    if (success) {
      // In a real app, we would show the ad here
      alert(t('rewards.alerts.adWatched'));
    } else {
      alert(t('rewards.alerts.cantWatch'));
    }
  };

  const getSlotStatus = (index: number) => {
    // Filter valid watches (within last 24 hours)
    const validWatches = [...adWatchTimes].filter(t => now - t < 24 * 60 * 60 * 1000);

    // Sort by oldest first (so slot 1 shows the one that will expire soonest)
    // This way: Slot 1 = oldest (expires soonest), Slot 3 = newest (expires latest)
    const sortedWatches = validWatches.sort((a, b) => a - b);

    // Map slots: index 0 = slot 1, index 1 = slot 2, index 2 = slot 3
    // Slot 1 should show the oldest watch (expires soonest)
    // Slot 3 should show the newest watch (expires latest)
    const watchTime = sortedWatches[index];

    if (watchTime) {
      const msRemaining = (watchTime + 24 * 60 * 60 * 1000) - now;
      const hours = Math.floor(msRemaining / (1000 * 60 * 60));
      const minutes = Math.floor((msRemaining % (1000 * 60 * 60)) / (1000 * 60));
      return {
        status: 'cooldown',
        timeLeft: `${hours}s ${minutes}dk`
      };
    }

    return { status: 'available' };
  };

  const adSlots = [0, 1, 2];
  const [isHowItWorksExpanded, setIsHowItWorksExpanded] = useState(false);

  // Calculate progress percentage for lives
  const livesProgress = (currentLives / maxLives) * 100;

  // Get all slot statuses once
  const allSlotStatuses = useMemo(() => {
    return adSlots.map(index => getSlotStatus(index));
  }, [adWatchTimes, now]);

  // Get ad slot renewal text
  const getAdSlotRenewalText = (index: number, slotStatus: { status: string; timeLeft?: string }) => {
    if (slotStatus.status === 'cooldown' && slotStatus.timeLeft) {
      return t('rewards.cooldownDesc', { time: slotStatus.timeLeft });
    }
    // If available, check if it's the first available slot
    const availableSlots = allSlotStatuses
      .map((status, i) => ({ status, index: i }))
      .filter(({ status }) => status.status === 'available')
      .map(({ index }) => index);

    // If this is the first available slot (lowest index), show "Hakkın mevcut"
    if (availableSlots.length > 0 && index === availableSlots[0]) {
      return t('rewards.available');
    }
    // Otherwise show "Yarın yenilenir" for other available slots
    return t('rewards.renewsTomorrow');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <HeaderButton
          title={t('common.back')}
          onPress={() => router.back()}
        />
        <Text style={styles.headerTitle}>{t('rewards.title')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Lives Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusCardHeader}>
            <Text style={styles.statusCardTitle}>{t('rewards.livesStatus')}</Text>
            <View style={styles.statusCardHeartIcon}>
              <Heart size={24} color={colors.error} weight="fill" />
            </View>
          </View>
          <Text style={styles.statusCardSubtitle}>
            {currentLives >= maxLives ? t('rewards.livesMax') : ''}
          </Text>
          <View style={styles.livesCountRow}>
            <Text style={styles.statusCardLivesCount}>
              {t('rewards.livesCount', { current: currentLives, max: maxLives })}
            </Text>
            {currentLives < maxLives && (
              <View style={styles.timerInline}>
                <Text style={styles.timerLabel}>
                  {t('rewards.nextLife')}
                </Text>
                <Text style={styles.timerText}>
                  {getNextLifeTime()}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${livesProgress}%` }]} />
            </View>
            {currentLives >= maxLives && (
              <View style={styles.fullBadge}>
                <Text style={styles.fullBadgeText}>Full</Text>
              </View>
            )}
          </View>
        </View>

        {/* Daily Free Lives Section */}
        <Text style={styles.sectionTitle}>{t('rewards.dailyFreeLives')}</Text>

        {adSlots.map((index) => {
          const slotStatus = allSlotStatuses[index];
          const isLocked = slotStatus.status === 'cooldown' || currentLives >= maxLives;
          const isUsed = slotStatus.status === 'cooldown';

          return (
            <View key={index} style={styles.adCard}>
              <View style={styles.adCardIcon}>
                <Play size={20} color={colors.textPrimary} weight="fill" />
              </View>
              <View style={styles.adCardInfo}>
                <Text style={styles.adCardTitle}>
                  {t('rewards.watchAdDesc')}
                </Text>
                <Text style={styles.adCardDescription}>
                  {getAdSlotRenewalText(index, slotStatus)}
                </Text>
              </View>
              <PrimaryButton
                title={isUsed ? t('rewards.used') : t('rewards.watchAd')}
                onPress={handleWatchAd}
                disabled={isLocked}
                style={[
                  { paddingVertical: 8, paddingHorizontal: 16, minWidth: 70, height: 36 },
                  isUsed && styles.adButtonUsed,
                  isLocked && !isUsed && styles.adButtonDisabled
                ]}
                textStyle={[
                  { fontSize: 13 },
                  isUsed && styles.adButtonUsedText
                ]}
              />
            </View>
          );
        })}

        {/* Bonus Tasks Section */}
        <Text style={styles.sectionTitle}>{t('rewards.bonusTasks')}</Text>

        {/* Invite Friend */}
        <View style={styles.bonusCard}>
          <View style={[styles.bonusCardIcon, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
            <Gift size={24} color="#3B82F6" weight="fill" />
          </View>
          <View style={styles.bonusCardInfo}>
            <Text style={styles.bonusCardTitle}>{t('rewards.inviteFriend.title')}</Text>
            <Text style={styles.bonusCardReward}>{t('rewards.inviteFriend.reward')}</Text>
          </View>
          <PrimaryButton
            title={t('rewards.inviteFriend.button')}
            style={{ paddingVertical: 8, paddingHorizontal: 16, minWidth: 90, height: 36 }}
            textStyle={{ fontSize: 13 }}
          />
        </View>

        {/* 3 Day Consecutive Login */}
        <View style={styles.bonusCard}>
          <View style={[styles.bonusCardIcon, { backgroundColor: 'rgba(168, 85, 247, 0.1)' }]}>
            <Calendar size={24} color="#A855F7" weight="fill" />
          </View>
          <View style={styles.bonusCardInfo}>
            <Text style={styles.bonusCardTitle}>{t('rewards.consecutiveLogin.title')}</Text>
            <Text style={styles.bonusCardReward}>{t('rewards.consecutiveLogin.reward')}</Text>
          </View>
          <Pressable style={styles.bonusButtonClaimed}>
            <Text style={styles.bonusButtonClaimedText}>{t('rewards.consecutiveLogin.claimed')}</Text>
          </Pressable>
        </View>

        {/* Daily Task */}
        <View style={styles.bonusCard}>
          <View style={[styles.bonusCardIcon, { backgroundColor: 'rgba(234, 179, 8, 0.1)' }]}>
            <Star size={24} color="#EAB308" weight="fill" />
          </View>
          <View style={styles.bonusCardInfo}>
            <Text style={styles.bonusCardTitle}>{t('rewards.dailyTask.title')}</Text>
            <Text style={styles.bonusCardReward}>{t('rewards.dailyTask.reward')}</Text>
          </View>
          <PrimaryButton
            title={t('rewards.dailyTask.button')}
            style={{ paddingVertical: 8, paddingHorizontal: 16, minWidth: 90, height: 36 }}
            textStyle={{ fontSize: 13 }}
          />
        </View>

        {/* How It Works - Collapsible */}
        <Pressable
          style={styles.howItWorksCard}
          onPress={() => setIsHowItWorksExpanded(!isHowItWorksExpanded)}
        >
          <View style={styles.howItWorksHeader}>
            <View style={styles.howItWorksHeaderLeft}>
              <View style={styles.howItWorksIcon}>
                <Lightbulb size={24} color="#EAB308" weight="fill" />
              </View>
              <Text style={styles.howItWorksTitle}>{t('rewards.howItWorks.title')}</Text>
            </View>
            {isHowItWorksExpanded ? (
              <CaretUp size={20} color={colors.textSecondary} />
            ) : (
              <CaretDown size={20} color={colors.textSecondary} />
            )}
          </View>
          {isHowItWorksExpanded && (
            <Text style={styles.howItWorksText}>
              {t('rewards.howItWorks.text')}
            </Text>
          )}
        </Pressable>

        {/* Bottom Spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const getStyles = (activeTheme?: string) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDarker,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 12,
    backgroundColor: colors.backgroundDarker,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  // Lives Status Card
  statusCard: {
    backgroundColor: colors.surface,
    padding: 16,
    marginBottom: 18,
    borderRadius: 16,
    // iOS 18 style shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: activeTheme === 'light' ? 0.2 : 0.2,
    borderColor: activeTheme === 'light' ? '#FF9600' : 'rgba(255, 255, 255, 0.1)',
  },
  statusCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  statusCardHeartIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusCardSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  livesCountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusCardLivesCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: colors.backgroundLighter,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#22C55E',
    borderRadius: 4,
  },
  fullBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  fullBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#22C55E',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
    marginTop: 8,
  },
  // Ad Cards
  adCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    gap: 12,
    // iOS 18 style shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: activeTheme === 'light' ? 0.2 : 0.2,
    borderColor: activeTheme === 'light' ? '#FF9600' : 'rgba(255, 255, 255, 0.1)',
  },
  adCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF9600',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adCardInfo: {
    flex: 1,
  },
  adCardTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  adCardDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  // Bonus Cards
  bonusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    gap: 12,
    // iOS 18 style shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: activeTheme === 'light' ? 0.2 : 0.2,
    borderColor: activeTheme === 'light' ? '#FF9600' : 'rgba(255, 255, 255, 0.1)',
  },
  bonusCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bonusCardInfo: {
    flex: 1,
  },
  bonusCardTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  bonusCardReward: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  bonusButtonClaimed: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 90,
    alignItems: 'center',
  },
  bonusButtonClaimedText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // How It Works
  howItWorksCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    marginTop: 8,
    // iOS 18 style shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: activeTheme === 'light' ? 0.2 : 0.2,
    borderColor: activeTheme === 'light' ? '#FF9600' : 'rgba(255, 255, 255, 0.1)',
  },
  howItWorksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  howItWorksHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  howItWorksIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 150, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  howItWorksTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  howItWorksText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: 12,
  },
  // Timer
  timerInline: {
    alignItems: 'flex-end',
  },
  timerLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  timerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    fontFamily: 'monospace', // For fixed width numbers
  },
});
