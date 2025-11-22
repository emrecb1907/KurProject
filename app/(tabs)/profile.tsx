import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useMemo, useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { colors } from '@constants/colors';
import { HugeiconsIcon } from '@hugeicons/react-native';
import * as Haptics from 'expo-haptics';
import {
  DiamondIcon,
  FireIcon,
  Tick01Icon,
  Book02Icon,
  Award01Icon,
  StarIcon,
  Target01Icon,
  Rocket01Icon,
  UserAccountIcon,
  Medal01Icon,
  BulbIcon,
  LockIcon,
  Sun03Icon,
  Moon02Icon,
  ComputerIcon
} from '@hugeicons/core-free-icons';
import { getXPProgress, formatXP } from '@/lib/utils/levelCalculations';
import { useUser, useAuth } from '@/store';
import { database } from '@/lib/supabase/database';
import { useAuthHook } from '@hooks';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  // Get user data from Zustand store
  const { totalXP, streak, setStreak, completedTests, successRate, setUserStats } = useUser();
  const { isAuthenticated, user } = useAuth();
  const { signOut } = useAuthHook();
  const { themeMode, activeTheme, themeVersion, setThemeMode } = useTheme();
  const currentStreak = streak;

  // 🔄 Sync User Data (Streak & Stats) from database in background
  useFocusEffect(
    useCallback(() => {
      async function syncUserData() {
        if (isAuthenticated && user?.id) {
          try {
            // Fetch user data for streak and stats
            const { data: userData } = await database.users.getById(user.id);
            if (userData) {
              // Update streak in store
              if (userData.streak !== undefined) {
                setStreak(userData.streak);
              } else if (userData.streak_count !== undefined) {
                setStreak(userData.streak_count);
              }

              // Update stats from user table
              const newCompletedTests = userData.total_lessons_completed || 0;

              // Calculate success rate
              const totalQuestions = userData.total_questions_solved || 0;
              const correctAnswers = userData.total_correct_answers || 0;
              const newSuccessRate = totalQuestions > 0
                ? Math.round((correctAnswers / totalQuestions) * 100)
                : 0;

              // Update stats in store (cache for next time)
              setUserStats(newCompletedTests, newSuccessRate);
            }
          } catch (error) {
            console.error('❌ Failed to sync user data:', error);
          }
        }
      }

      syncUserData();
    }, [isAuthenticated, user?.id])
  );

  // Get username
  const username = user?.username || user?.email?.split('@')[0] || t('profile.anonymous');

  // Calculate XP progress using the formula
  const xpProgress = getXPProgress(totalXP);

  const stats = [
    { icon: DiamondIcon, value: formatXP(totalXP), label: t('profile.stats.totalXP'), color: colors.secondary },
    { icon: FireIcon, value: currentStreak.toString(), label: t('profile.stats.streak'), color: colors.primary },
    { icon: Tick01Icon, value: `${successRate}%`, label: t('profile.stats.successRate'), color: colors.success },
    { icon: Book02Icon, value: completedTests.toString(), label: t('profile.stats.completedTests'), color: colors.pink },
  ];

  const badges = [
    { icon: Award01Icon, color: colors.warning },
    { icon: StarIcon, color: colors.warning },
    { icon: Target01Icon, color: colors.error },
    { icon: Rocket01Icon, color: colors.secondary },
    { icon: Medal01Icon, color: colors.success },
    { icon: Medal01Icon, color: colors.pink },
  ];

  // Dynamic styles that update when theme changes
  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      paddingTop: 60,
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
      borderColor: colors.primary,
    },
    levelBadge: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: colors.primary,
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
    themeContainer: {
      marginTop: 8,
    },
    themeLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 12,
    },
    themeButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    themeButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      backgroundColor: colors.surface,
      borderWidth: 2,
      borderColor: colors.border,
    },
    themeButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.buttonOrangeBorder,
    },
    themeButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    themeButtonTextActive: {
      color: colors.textOnPrimary,
    },
    themeHint: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 8,
      textAlign: 'center',
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
    logoutButton: {
      backgroundColor: colors.error,
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 12,
      alignItems: 'center',
      borderBottomWidth: 4,
      borderBottomColor: colors.errorDark,
    },
    logoutButtonText: {
      color: colors.textOnPrimary,
      fontSize: 16,
      fontWeight: 'bold',
    },
  }), [themeVersion]); // Re-create styles when theme changes

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <HugeiconsIcon icon={UserAccountIcon} size={50} color={colors.textPrimary} />
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
              <HugeiconsIcon icon={stat.icon} size={32} color={stat.color} />
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Badges Section */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <HugeiconsIcon icon={Award01Icon} size={24} color={colors.textPrimary} />
            <Text style={styles.sectionTitle}>{t('profile.sections.badges')}</Text>
          </View>
          <View style={styles.badgesContainer}>
            {badges.map((badge, index) => (
              <View key={index} style={styles.badgeSlot}>
                <HugeiconsIcon icon={LockIcon} size={32} color={colors.textDisabled} />
              </View>
            ))}
          </View>
          <Text style={styles.badgeHint}>
            {t('profile.badgesHint')}
          </Text>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <HugeiconsIcon icon={BulbIcon} size={24} color={colors.textPrimary} />
            <Text style={styles.sectionTitle}>{t('profile.sections.settings')}</Text>
          </View>

          {/* Theme Selector */}
          <View style={styles.themeContainer}>
            <Text style={styles.themeLabel}>{t('profile.theme.label')}</Text>
            <View style={styles.themeButtons}>
              <Pressable
                style={[
                  styles.themeButton,
                  themeMode === 'light' && styles.themeButtonActive
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setThemeMode('light');
                }}
              >
                <HugeiconsIcon
                  icon={Sun03Icon}
                  size={20}
                  color={themeMode === 'light' ? colors.textOnPrimary : colors.textSecondary}
                />
                <Text style={[
                  styles.themeButtonText,
                  themeMode === 'light' && styles.themeButtonTextActive
                ]}>
                  {t('profile.theme.light')}
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.themeButton,
                  themeMode === 'dark' && styles.themeButtonActive
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setThemeMode('dark');
                }}
              >
                <HugeiconsIcon
                  icon={Moon02Icon}
                  size={20}
                  color={themeMode === 'dark' ? colors.textOnPrimary : colors.textSecondary}
                />
                <Text style={[
                  styles.themeButtonText,
                  themeMode === 'dark' && styles.themeButtonTextActive
                ]}>
                  {t('profile.theme.dark')}
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.themeButton,
                  themeMode === 'system' && styles.themeButtonActive
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setThemeMode('system');
                }}
              >
                <HugeiconsIcon
                  icon={ComputerIcon}
                  size={20}
                  color={themeMode === 'system' ? colors.textOnPrimary : colors.textSecondary}
                />
                <Text style={[
                  styles.themeButtonText,
                  themeMode === 'system' && styles.themeButtonTextActive
                ]}>
                  {t('profile.theme.system')}
                </Text>
              </Pressable>
            </View>
            <Text style={styles.themeHint}>
              {themeMode === 'system'
                ? `${t('profile.theme.activeTheme')}: ${activeTheme === 'light' ? t('profile.theme.light') : t('profile.theme.dark')} (${t('profile.theme.systemSettings')})`
                : `${t('profile.theme.activeTheme')}: ${themeMode === 'light' ? t('profile.theme.light') : t('profile.theme.dark')}`}
            </Text>
          </View>

          {/* Logout Button - Only show if authenticated */}
          {isAuthenticated && (
            <View style={{ marginTop: 24 }}>
              <Pressable
                style={styles.logoutButton}
                onPress={async () => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  await signOut();
                  router.replace('/(auth)/login');
                }}
              >
                <Text style={styles.logoutButtonText}>{t('profile.logout')}</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Achievements Section */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <HugeiconsIcon icon={Target01Icon} size={24} color={colors.textPrimary} />
            <Text style={styles.sectionTitle}>{t('profile.sections.achievements')}</Text>
          </View>
          <View style={styles.achievementCard}>
            <HugeiconsIcon icon={Medal01Icon} size={36} color={colors.warning} />
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>{t('profile.achievements.firstStep.title')}</Text>
              <Text style={styles.achievementDesc}>{t('profile.achievements.firstStep.description')}</Text>
            </View>
            <View style={styles.achievementProgress}>
              <Text style={styles.progressText}>0/1</Text>
            </View>
          </View>

          <View style={styles.achievementCard}>
            <HugeiconsIcon icon={FireIcon} size={36} color={colors.primary} />
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>{t('profile.achievements.streakStarter.title')}</Text>
              <Text style={styles.achievementDesc}>{t('profile.achievements.streakStarter.description')}</Text>
            </View>
            <View style={styles.achievementProgress}>
              <Text style={styles.progressText}>0/7</Text>
            </View>
          </View>
        </View>

        {/* Login Prompt - Only show if not authenticated */}
        {!isAuthenticated && (
          <View style={styles.loginPrompt}>
            <HugeiconsIcon icon={BulbIcon} size={40} color={colors.textOnPrimary} />
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
  );
}

