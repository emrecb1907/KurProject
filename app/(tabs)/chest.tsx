import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/store';
import { Heart, WarningCircle, Lightbulb, Video, ArrowLeft } from 'phosphor-react-native';

import { useTranslation } from 'react-i18next';

export default function ChestScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { themeVersion } = useTheme();
  const { currentLives, maxLives, watchAd, adWatchTimes, lastReplenishTime, checkLifeRegeneration } = useUser();

  // Dynamic styles that update when theme changes
  const styles = useMemo(() => getStyles(), [themeVersion]);

  const [now, setNow] = useState(Date.now());

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

  const handleWatchAd = () => {
    const success = watchAd();
    if (success) {
      // In a real app, we would show the ad here
      alert(t('rewards.alerts.adWatched'));
    } else {
      alert(t('rewards.alerts.cantWatch'));
    }
  };

  const getSlotStatus = (index: number) => {
    // Sort watches descending (newest first)
    const sortedWatches = [...adWatchTimes].sort((a, b) => b - a);
    // Get the watch for this "slot" (0, 1, 2)
    // Since we want 3 slots, we check if there are active cooldowns
    // Actually, the requirement is "limit to 3 times per day".
    // So we just check if we have 3 valid watches in the last 24h.
    // But for UI, we want to show 3 slots.
    // If we have 0 watches in last 24h -> 3 open slots.
    // If we have 1 watch in last 24h -> 1 used slot (showing countdown), 2 open.

    // Let's map the last 3 watches to the slots.
    // But we need to know WHICH slot corresponds to which watch? 
    // Not necessarily. We can just say:
    // Slot 1: Shows oldest active watch (or open if < 1 active watch)
    // Slot 2: Shows 2nd oldest active watch (or open if < 2 active watches)
    // Slot 3: Shows newest active watch (or open if < 3 active watches)

    // Let's filter valid watches first
    const validWatches = sortedWatches.filter(t => now - t < 24 * 60 * 60 * 1000);

    // We want to display them. Let's say we fill from left to right or top to bottom.
    // If we have 1 valid watch, Slot 1 is used (countdown), Slot 2 & 3 are open.
    // Wait, usually you want the available ones first? Or used ones?
    // Let's say:
    // Slot 1: If validWatches[0] exists, show countdown. Else Open.
    // Slot 2: If validWatches[1] exists, show countdown. Else Open.
    // Slot 3: If validWatches[2] exists, show countdown. Else Open.

    // But validWatches are sorted Newest first.
    // So validWatches[0] is the one that will take the LONGEST to expire.
    // validWatches[2] is the one that will expire soonest.

    const watchTime = validWatches[index];

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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButtonContainer}>
          <ArrowLeft size={24} color={colors.secondary} weight="bold" />
        </Pressable>
        <Text style={styles.headerTitle}>{t('rewards.title')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Lives Status */}
        <View style={styles.statusCard}>
          <View style={styles.statusIconContainer}>
            <Heart size={48} color={colors.error} weight="fill" />
          </View>
          <Text style={styles.statusText}>
            {currentLives} / {maxLives}
          </Text>
          <Text style={styles.statusLabel}>{t('rewards.lives')}</Text>
          {currentLives >= maxLives ? (
            <Text style={styles.statusSubtext}>{t('rewards.livesMax')}</Text>
          ) : (
            <View style={styles.timerContainer}>
              <Text style={styles.statusSubtext}>
                {t('rewards.nextLife')}
              </Text>
              <Text style={styles.timerText}>
                {getNextLifeTime()}
              </Text>
            </View>
          )}
        </View>

        {/* Info Message */}
        <View style={styles.infoBanner}>
          <WarningCircle size={24} color={colors.backgroundDarker} weight="fill" />
          <Text style={styles.infoBannerText}>
            {t('rewards.infoBanner')}
          </Text>
        </View>

        {/* Ad Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoTitleContainer}>
            <Lightbulb size={24} color={colors.textPrimary} weight="fill" />
            <Text style={styles.infoTitle}>{t('rewards.howItWorks.title')}</Text>
          </View>
          <Text style={styles.infoText}>
            {t('rewards.howItWorks.text')}
          </Text>
        </View>

        {/* Ad Slots */}
        <Text style={styles.sectionTitle}>{t('rewards.adSlots')}</Text>

        {adSlots.map((index) => {
          const { status, timeLeft } = getSlotStatus(index);
          const isLocked = status === 'cooldown' || currentLives >= maxLives;

          return (
            <View key={index} style={styles.adCard}>
              <View style={styles.adCardIcon}>
                <Video size={24} color={colors.textPrimary} weight="fill" />
              </View>
              <View style={styles.adCardInfo}>
                <Text style={styles.adCardTitle}>
                  {status === 'cooldown' ? t('rewards.cooldown') : t('rewards.earnLife')}
                </Text>
                <Text style={styles.adCardDescription}>
                  {status === 'cooldown'
                    ? t('rewards.cooldownDesc', { time: timeLeft })
                    : t('rewards.watchAdDesc')}
                </Text>
              </View>
              <Pressable
                style={[styles.adButton, isLocked && styles.adButtonDisabled]}
                onPress={handleWatchAd}
                disabled={isLocked}
              >
                <Text style={styles.adButtonText}>
                  {status === 'cooldown' ? timeLeft : t('rewards.watchAd')}
                </Text>
              </Pressable>
            </View>
          );
        })}

        {/* Bottom Spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const getStyles = () => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 12,
    backgroundColor: colors.backgroundDarker,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButtonContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
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
  statusCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 32,
    marginBottom: 16,
    borderRadius: 16,
    borderBottomWidth: 4,
    borderBottomColor: colors.border,
  },
  statusIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.backgroundLighter,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  statusLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  statusSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    gap: 12,
    borderBottomWidth: 4,
    borderBottomColor: colors.warningDark,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.backgroundDarker,
  },
  infoCard: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    borderBottomWidth: 4,
    borderBottomColor: colors.border,
  },
  infoTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  adCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    gap: 12,
    borderBottomWidth: 4,
    borderBottomColor: colors.border,
  },
  adCardIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.backgroundLighter,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adCardInfo: {
    flex: 1,
  },
  adCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  adCardDescription: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  adButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderBottomWidth: 3,
    borderBottomColor: colors.buttonOrangeBorder,
  },
  adButtonDisabled: {
    backgroundColor: colors.locked,
    borderBottomColor: colors.lockedBorder,
  },
  adButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.textOnPrimary,
  },
  timerContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  timerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    fontFamily: 'monospace', // For fixed width numbers
  },
});
