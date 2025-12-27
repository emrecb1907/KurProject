import { View, Text, StyleSheet, ScrollView, Pressable, DeviceEventEmitter, Image, Animated } from 'react-native';
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
  Target,
  Medal,
  Lightbulb,
  Gear,
  PencilSimple,
  UserCircle,
  Camera,
  Crown
} from 'phosphor-react-native';
import { getXPProgress, formatXP } from '@/lib/utils/levelCalculations';
import { useUser, useAuth } from '@/store';
import { useUserStats } from '@hooks';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { getAvatarSource } from '@/constants/avatars';
import { useBadges } from '@/hooks/useBadges';
import { BadgeItem } from '@/components/profile/BadgeItem';
import { usePremium } from '@/contexts/AdaptyProvider';
import { useUserTitles } from '@/hooks/queries';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  // Get UI state from Zustand (only persisted UI preferences)
  const { selectedAvatar, lastSeenTitleCount, setLastSeenTitleCount } = useUser();
  const { isAuthenticated, isAnonymous, user } = useAuth();
  const { themeVersion } = useTheme();
  const { isPremium } = usePremium();

  // Get user's earned titles for new title notification
  const { data: userTitles } = useUserTitles(user?.id);

  // Initialize lastSeenTitleCount on first load (if it's 0 and user has titles)
  useEffect(() => {
    if (lastSeenTitleCount === 0 && userTitles && userTitles.length > 0) {
      // First time user - don't show all as new, just future ones
      setLastSeenTitleCount(userTitles.length);
    }
  }, [userTitles, lastSeenTitleCount, setLastSeenTitleCount]);

  const hasNewTitle = useMemo(() => {
    const earnedCount = userTitles?.length || 0;
    return earnedCount > lastSeenTitleCount && lastSeenTitleCount > 0;
  }, [userTitles, lastSeenTitleCount]);

  // 🚀 React Query: Fetch user data with auto-cache and retry
  const { data: userStats, userData, isLoading: isLoadingStats } = useUserStats(user?.id);

  // Get totalXP from React Query data with fallback
  const totalXP = userData?.total_xp ?? 0;
  const streak = userData?.streak ?? userData?.streak_count ?? 0;

  // Calculate XP progress using the formula
  const xpProgress = getXPProgress(totalXP);

  // ScrollView ref for resetting scroll position
  const scrollViewRef = useRef<ScrollView>(null);

  // Edit menu dropdown state
  const [showEditMenu, setShowEditMenu] = useState(false);

  // Use custom hook to get badges status
  const { badges } = useBadges(userStats, xpProgress.currentLevel);

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
  const completedTests = userStats?.total_tests_completed ?? userStats?.completedTests ?? 0;
  const successRate = userStats?.successRate ?? 0;
  const currentStreak = streak;

  // Get username
  const username = user?.username || user?.email?.split('@')[0] || t('profile.anonymous');



  const stats = [
    { icon: Diamond, value: formatXP(totalXP), label: t('profile.stats.totalXP'), color: colors.secondary },
    { icon: Fire, value: currentStreak.toString(), label: t('profile.stats.streak'), color: colors.primary },
    { icon: Check, value: `${successRate}%`, label: t('profile.stats.successRate'), color: colors.success },
    { icon: BookBookmark, value: completedTests.toString(), label: t('profile.stats.completedTests'), color: colors.pink },
  ];

  // Memoize badge elements to avoid hook nesting issues
  const badgeElements = useMemo(() => {
    // Function to get top 2 earned or next locked
    const getBadgesByType = (type: string, limit: number) => {
      const typeBadges = badges.filter(b => b.requirement_type === type);
      const earned = typeBadges.filter(b => b.user_progress?.is_claimed)
        .sort((a, b) => b.requirement_value - a.requirement_value); // Descending for earned (highest first)

      const locked = typeBadges.filter(b => !b.user_progress?.is_claimed)
        .sort((a, b) => a.requirement_value - b.requirement_value); // Ascending for locked (easiest first)

      let result = [...earned];
      if (result.length < limit) {
        result = [...result, ...locked.slice(0, limit - result.length)];
      }
      return result.slice(0, limit);
    };

    // 1. Level Badges (Top 2)
    const levelBadges = getBadgesByType('level_reached', 2);

    // 2. Lesson Badges (Top 2)
    const lessonBadges = getBadgesByType('lessons_completed', 2);

    // 3. Test Badges (Top 2)
    const testBadges = getBadgesByType('tests_completed', 2);

    // Collect IDs to exclude for "Extra"
    const usedIds = new Set([
      ...levelBadges.map(b => b.id),
      ...lessonBadges.map(b => b.id),
      ...testBadges.map(b => b.id)
    ]);

    // 4. Extra Locked Badges (Next 2 available from any category)
    const extraBadges = badges
      .filter(b => !usedIds.has(b.id) && !b.user_progress?.is_claimed)
      .sort((a, b) => (b.user_progress?.progress_percentage || 0) - (a.user_progress?.progress_percentage || 0))
      .slice(0, 2);

    // Combine all
    const finalBadges = [
      ...levelBadges,
      ...lessonBadges,
      ...testBadges,
      ...extraBadges
    ];

    return finalBadges.map((badge) => (
      <BadgeItem key={badge.id} badge={badge} />
    ));
  }, [badges]);

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
    headerBar: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 12,
      backgroundColor: colors.backgroundDarker,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.textPrimary,
      textAlign: 'center',
      position: 'absolute',
      left: 0,
      right: 0,
      zIndex: -1,
    },
    userInfo: {
      alignItems: 'center',
      paddingHorizontal: 0,
      paddingBottom: 24,
      paddingTop: 0,
      width: '100%',
      backgroundColor: colors.backgroundDarker,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    avatarContainer: {
      position: 'relative',
      marginBottom: 12,
      marginTop: -12,
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
      overflow: 'hidden',
    },
    avatarImage: {
      width: '108%',
      height: '100%',
      transform: [{ translateX: -3 }],
    },
    levelBadge: {
      position: 'absolute',
      bottom: -10,
      right: -10,
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
      justifyContent: 'space-between',
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
      gap: 0,
      justifyContent: 'center', // Center badges in the container
    },
    badgeHint: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 12,
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
      fontSize: 20,
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
    headerButton: {
      width: 46,
      height: 46,
      borderRadius: 23,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
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

    editMenuDropdown: {
      position: 'absolute',
      top: 56,
      left: 16,
      zIndex: 30,
      backgroundColor: colors.surface,
      borderRadius: 12,
      paddingVertical: 8,
      minWidth: 180,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    editMenuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      gap: 12,
    },
    editMenuItemText: {
      fontSize: 15,
      color: colors.textPrimary,
      fontWeight: '500',
    },
    editMenuOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 15,
    },
    menuDivider: {
      height: 1,
      backgroundColor: colors.border,
      marginHorizontal: 16,
    },
    premiumBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.success,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      gap: 6,
      marginTop: 8,
      marginBottom: 4,
    },
    premiumBadgeText: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '600',
    },
    editMenuItemWithBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flex: 1,
    },
    pulseDotContainer: {
      width: 12,
      height: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pulseDot: {
      position: 'absolute',
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#FF9600',
    },
    pulseRing: {
      position: 'absolute',
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: '#FF9600',
    },
    headerDotContainer: {
      position: 'absolute',
      top: -7,
      right: -7,
    },
  }), [themeVersion]); // Re-create styles when theme changes

  // Pulsing Dot Component for new title notification
  const PulsingDot = useCallback(() => {
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.8,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }, []);

    return (
      <View style={styles.pulseDotContainer}>
        <Animated.View
          style={[
            styles.pulseRing,
            {
              transform: [{ scale: pulseAnim }],
              opacity: pulseAnim.interpolate({
                inputRange: [1, 1.8],
                outputRange: [0.6, 0],
              }),
            },
          ]}
        />
        <View style={styles.pulseDot} />
      </View>
    );
  }, [styles]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>






        <ScrollView
          ref={scrollViewRef}
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
        >
          {/* User Info Section */}
          <View style={styles.userInfo}>
            {/* Header Bar */}
            <View style={styles.headerBar}>
              {/* Edit Profile Button */}
              <Pressable
                style={styles.headerButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowEditMenu(!showEditMenu);
                }}
              >
                <View style={{ position: 'relative' }}>
                  <PencilSimple size={24} color={colors.textPrimary} weight="fill" />
                  {hasNewTitle && (
                    <View style={styles.headerDotContainer}>
                      <PulsingDot />
                    </View>
                  )}
                </View>
              </Pressable>

              <Text style={styles.headerTitle}>{t('profile.screenTitle')}</Text>

              {/* Settings Button */}
              <Pressable
                style={styles.headerButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push('/settings');
                }}
              >
                <Gear size={24} color={colors.textPrimary} weight="fill" />
              </Pressable>
            </View>

            {/* Edit Menu Overlay */}
            {showEditMenu && (
              <Pressable
                style={styles.editMenuOverlay}
                onPress={() => setShowEditMenu(false)}
              />
            )}

            {/* Edit Menu Dropdown */}
            {showEditMenu && (
              <View style={styles.editMenuDropdown}>
                {/* Change Username - Only for non-anonymous users */}
                {!isAnonymous && (
                  <>
                    <Pressable
                      style={styles.editMenuItem}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setShowEditMenu(false);
                        router.push('/edit-profile');
                      }}
                    >
                      <UserCircle size={22} color={colors.textPrimary} weight="fill" />
                      <Text style={styles.editMenuItemText}>{t('profile.editProfile.changeUsername', 'Kullanıcı Adı Değiştir')}</Text>
                    </Pressable>
                    <View style={styles.menuDivider} />
                  </>
                )}
                {/* Change Title - Available for all users */}
                <Pressable
                  style={styles.editMenuItem}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setShowEditMenu(false);
                    router.push('/title-select');
                  }}
                >
                  <Crown size={22} color={colors.textPrimary} weight="fill" />
                  <View style={styles.editMenuItemWithBadge}>
                    <Text style={styles.editMenuItemText}>{t('profile.editProfile.changeTitle')}</Text>
                    {hasNewTitle && <PulsingDot />}
                  </View>
                </Pressable>
                <View style={styles.menuDivider} />
                {/* Change Avatar */}
                <Pressable
                  style={styles.editMenuItem}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setShowEditMenu(false);
                    router.push('/avatar-select' as any);
                  }}
                >
                  <Camera size={22} color={colors.textPrimary} weight="fill" />
                  <Text style={styles.editMenuItemText}>{t('profile.editProfile.changeAvatar')}</Text>
                </Pressable>
              </View>
            )}


            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Image
                  source={getAvatarSource(selectedAvatar)}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              </View>


              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>{xpProgress.currentLevel}</Text>
              </View>
            </View>
            <Text style={styles.username}>{username}</Text>

            {/* Premium Badge */}
            {isPremium && (
              <View style={styles.premiumBadge}>
                <Diamond size={14} color="#FFFFFF" weight="fill" />
                <Text style={styles.premiumBadgeText}>{t('profile.premiumMember', 'Premium Üye')}</Text>
              </View>
            )}

            <Text style={styles.subtitle}>
              {userData?.active_title && !isAnonymous
                ? t(`rewards.titles.${userData.active_title}`, { defaultValue: userData.active_title }) as string
                : (isAuthenticated ? t('profile.student') : t('profile.anonymous'))}
            </Text>
          </View>



          {/* Login Prompt - Show if not authenticated OR is anonymous */}
          {(!isAuthenticated || isAnonymous) && (
            <View style={styles.loginPrompt}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Lightbulb size={28} color={colors.textOnPrimary} weight="fill" />
                <Text style={styles.promptTitle}>{t('profile.loginPrompt.title')}</Text>
              </View>
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
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Trophy size={24} color={colors.textPrimary} weight="fill" />
                <Text style={styles.sectionTitle}>{t('profile.sections.badges')}</Text>
              </View>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push('/badges' as any);
                }}
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              >
                <Text style={{ color: colors.primary, fontWeight: '600', fontSize: 14 }}>
                  {t('profile.seeAll', 'Tümünü Gör')}
                </Text>
              </Pressable>
            </View>

            <View style={styles.badgesContainer}>
              {badgeElements}
            </View>
            <Text style={styles.badgeHint}>
              {t('profile.badgesHint')}
            </Text>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
