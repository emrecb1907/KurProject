import { View, Text, StyleSheet, ScrollView, Pressable, DeviceEventEmitter } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { colors } from '@constants/colors';
import * as Haptics from 'expo-haptics';
import {
  Diamond,
  Fire,
  Check,
  BookBookmark,
  Trophy,
  Star,
  Target,
  Rocket,
  User,
  Medal,
  Lightbulb,
  Lock,
  PencilSimple,
  Gear
} from 'phosphor-react-native';
import { getXPProgress, formatXP } from '@/lib/utils/levelCalculations';
import { useUser, useAuth } from '@/store';
import { database } from '@/lib/supabase/database';
import { useUserStats } from '@hooks';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  // Get user data from Zustand store (UI state)
  const { totalXP, streak, setStreak, setUserStats } = useUser();
  const { isAuthenticated, isAnonymous, user } = useAuth();
  const { themeVersion } = useTheme();

  // 🚀 React Query: Fetch user data with auto-cache and retry
  const { data: userStats, userData, isLoading: isLoadingStats } = useUserStats(user?.id);

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
    const subscription = DeviceEventEmitter.addListener('scrollToTopProfile', () => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    });
    return () => subscription.remove();
  }, []);

  // Use React Query data if available, fallback to Zustand cache
  // Use total_tests_completed from DB stats if available, otherwise fallback to completedTests
  const completedTests = userStats?.total_tests_completed ?? userStats?.completedTests ?? 0;
  const successRate = userStats?.successRate ?? 0;
  const currentStreak = streak;

  // 🔄 Sync streak to Zustand store when data changes
  useEffect(() => {
    if (userData) {

      // Update streak in store
      if (userData.streak !== undefined) {
        // Calculate displayed streak based on last activity
        let lastActivityDate = userData.last_activity_date;
        const weeklyActivity = (userData.weekly_activity as string[]) || [];

        // Fallback: If last_activity_date is missing (legacy data), try to get it from weekly_activity
        if (!lastActivityDate && weeklyActivity.length > 0) {
          const sortedDates = [...weeklyActivity].sort();
          lastActivityDate = sortedDates[sortedDates.length - 1];
        }

        let displayedStreak = userData.streak || 0;

        if (lastActivityDate) {
          const lastDate = new Date(lastActivityDate);
          const todayDate = new Date();
          todayDate.setHours(0, 0, 0, 0);
          lastDate.setHours(0, 0, 0, 0);

          const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          // If last activity was more than 1 day ago (yesterday), streak is broken
          if (diffDays > 1) {
            displayedStreak = 0;
          }
        } else {
          displayedStreak = 0;
        }

        // Only update if different to prevent infinite loop
        if (displayedStreak !== streak) {
          setStreak(displayedStreak);
        }
      } else if (userData.streak_count !== undefined) {
        if (userData.streak_count !== streak) {
          setStreak(userData.streak_count);
        }
      }

      // Update stats cache in store
      if (userStats?.completedTests !== undefined && userStats?.successRate !== undefined) {
        setUserStats(userStats.completedTests, userStats.successRate);
      }
    }
  }, [userData?.streak, userData?.last_activity_date, userData?.streak_count, userStats?.completedTests, userStats?.successRate, streak]);

  // Get username
  const username = user?.username || user?.email?.split('@')[0] || t('profile.anonymous');

  // Calculate XP progress using the formula
  const xpProgress = getXPProgress(totalXP);

  const stats = [
    { icon: Diamond, value: formatXP(totalXP), label: t('profile.stats.totalXP'), color: colors.secondary },
    { icon: Fire, value: currentStreak.toString(), label: t('profile.stats.streak'), color: colors.primary },
    { icon: Check, value: `${successRate}%`, label: t('profile.stats.successRate'), color: colors.success },
    { icon: BookBookmark, value: completedTests.toString(), label: t('profile.stats.completedTests'), color: colors.pink },
  ];

  const badges = [
    { icon: Trophy, color: colors.warning },
    { icon: Star, color: colors.warning },
    { icon: Target, color: colors.error },
    { icon: Rocket, color: colors.secondary },
    { icon: Medal, color: colors.success },
    { icon: Medal, color: colors.pink },
  ];

  // Dynamic styles that update when theme changes
  const styles = useMemo(() => StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.backgroundDarker,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      paddingTop: 0,
    },
    header: {
      alignItems: 'center',
      padding: 24,
      backgroundColor: colors.backgroundDarker,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    avatarContainer: {
      position: 'relative',
      marginBottom: 12,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 4,
      borderColor: colors.warning,
    },
    levelBadge: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: colors.warning,
      borderRadius: 15,
      width: 35,
      height: 35,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: colors.backgroundDarker,
    },
    levelText: {
      color: colors.textOnPrimary,
      fontSize: 14,
      fontWeight: 'bold',
    },
    username: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    statsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      padding: 12,
      gap: 12,
    },
    statCard: {
      flex: 1,
      minWidth: '45%',
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      alignItems: 'center',
      gap: 8,
      borderBottomWidth: 4,
    },
    statValue: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    statLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    section: {
      padding: 16,
      marginTop: 8,
    },
    sectionTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    badgesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    badgeSlot: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.border,
    },
    badgeHint: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 12,
    },
    achievementCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      gap: 12,
    },
    achievementInfo: {
      flex: 1,
    },
    achievementTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    achievementDesc: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    achievementProgress: {
      backgroundColor: colors.backgroundLighter,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    progressText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    loginPrompt: {
      margin: 16,
      padding: 24,
      backgroundColor: colors.primary,
      borderRadius: 20,
      alignItems: 'center',
      gap: 12,
    },
    promptTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: colors.textOnPrimary,
    },
    promptText: {
      fontSize: 14,
      color: colors.textOnPrimary,
      textAlign: 'center',
      lineHeight: 20,
    },
    loginButton: {
      backgroundColor: colors.backgroundDarker,
      paddingVertical: 14,
      paddingHorizontal: 32,
      borderRadius: 12,
      marginTop: 8,
    },
    loginButtonText: {
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: 'bold',
    },
    settingsButton: {
      position: 'absolute',
      top: 16,
      right: 16,
      zIndex: 10,
      padding: 8,
      backgroundColor: colors.surface,
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    editBadge: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      backgroundColor: colors.surface,
      borderRadius: 15,
      width: 35,
      height: 35,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: colors.backgroundDarker,
    },
    editButton: {
      position: 'absolute',
      top: 16,
      left: 16,
      zIndex: 10,
      padding: 8,
      backgroundColor: colors.surface,
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
  }), [themeVersion]); // Re-create styles when theme changes

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>


        <ScrollView
          ref={scrollViewRef}
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            {/* Settings Button */}
            <Pressable
              style={styles.settingsButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/settings');
              }}
            >
              <Gear size={24} color={colors.textPrimary} weight="fill" />
            </Pressable>

            {/* Edit Profile Button (Top Left) */}
            <Pressable
              style={styles.editButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/edit-profile');
              }}
            >
              <PencilSimple size={24} color={colors.textPrimary} weight="fill" />
            </Pressable>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <User size={50} color={colors.textPrimary} weight="fill" />
              </View>


              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>{xpProgress.currentLevel}</Text>
              </View>
            </View>
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.subtitle}>
              {isAuthenticated ? t('profile.student') : t('profile.anonymous')}
            </Text>
          </View>




          {/* Stats Grid */}
          <View style={styles.statsContainer}>
            {stats.map((stat, index) => (
              <View key={index} style={[styles.statCard, { borderBottomColor: stat.color }]}>
                <stat.icon size={32} color={stat.color} weight="fill" />
                <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Badges Section */}
          <View style={styles.section}>
            <View style={styles.sectionTitleContainer}>
              <Trophy size={24} color={colors.textPrimary} weight="fill" />
              <Text style={styles.sectionTitle}>{t('profile.sections.badges')}</Text>
            </View>
            <View style={styles.badgesContainer}>
              {badges.map((badge, index) => (
                <View key={index} style={styles.badgeSlot}>
                  <Lock size={32} color={colors.textDisabled} weight="fill" />
                </View>
              ))}
            </View>
            <Text style={styles.badgeHint}>
              {t('profile.badgesHint')}
            </Text>
          </View>


          {/* Achievements Section */}
          <View style={styles.section}>
            <View style={styles.sectionTitleContainer}>
              <Target size={24} color={colors.textPrimary} weight="fill" />
              <Text style={styles.sectionTitle}>{t('profile.sections.achievements')}</Text>
            </View>
            <View style={styles.achievementCard}>
              <Medal size={36} color={colors.warning} weight="fill" />
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>{t('profile.achievements.firstStep.title')}</Text>
                <Text style={styles.achievementDesc}>{t('profile.achievements.firstStep.description')}</Text>
              </View>
              <View style={styles.achievementProgress}>
                <Text style={styles.progressText}>0/1</Text>
              </View>
            </View>

            <View style={styles.achievementCard}>
              <Fire size={36} color={colors.primary} weight="fill" />
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>{t('profile.achievements.streakStarter.title')}</Text>
                <Text style={styles.achievementDesc}>{t('profile.achievements.streakStarter.description')}</Text>
              </View>
              <View style={styles.achievementProgress}>
                <Text style={styles.progressText}>0/7</Text>
              </View>
            </View>
          </View>

          {/* Login Prompt - Show if not authenticated OR is anonymous */}
          {(!isAuthenticated || isAnonymous) && (
            <View style={styles.loginPrompt}>
              <Lightbulb size={40} color={colors.textOnPrimary} weight="fill" />
              <Text style={styles.promptTitle}>{t('profile.loginPrompt.title')}</Text>
              <Text style={styles.promptText}>
                {t('profile.loginPrompt.description')}
              </Text>
              <Pressable
                style={styles.loginButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push('/(auth)/login');
                }}
              >
                <Text style={styles.loginButtonText}>{t('profile.loginPrompt.button')}</Text>
              </Pressable>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
