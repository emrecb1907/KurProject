import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '@constants/colors';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Award01Icon, CrownIcon, Medal01Icon, StarIcon, UserAccountIcon, BulbIcon, Refresh01Icon } from '@hugeicons/core-free-icons';
import { useAuth, useUser } from '@/store';
import { Skeleton } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useOptimisticLeaderboard, useUserRank } from '@hooks';

interface LeaderboardItem {
  rank: number;
  id: string;
  username: string;
  totalXP: number;
  league: string;
  isYou: boolean;
  isGold?: boolean;
  isSilver?: boolean;
  isBronze?: boolean;
}

export default function LeaderboardScreen() {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth();
  const { totalXP } = useUser();
  const { activeTheme, themeVersion } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);

  // 🚀 Optimistic Leaderboard: 5dk cache + optimistic rank
  const {
    leaderboard: leaderboardRawData,
    isLoading: loading,
    error: queryError,
    yourOptimisticRank
  } = useOptimisticLeaderboard(50);

  // Transform raw data to LeaderboardItem format
  const leaderboardData = useMemo(() => {
    if (!leaderboardRawData) return [];

    return leaderboardRawData.map((entry, index) => ({
      rank: index + 1,
      id: entry.id,
      username: entry.username || entry.email?.split('@')[0] || t('common.user'),
      totalXP: entry.total_xp,
      league: entry.league,
      isYou: entry.id === user?.id,
      isGold: index === 0,
      isSilver: index === 1,
      isBronze: index === 2,
    }));
  }, [leaderboardRawData, user?.id, t]);

  // Check if user is in top 50
  const userInTop50 = leaderboardData.some(i => i.isYou);

  // 🚀 Fetch user rank if not in top 50 (for display at bottom)
  const { data: userRankData } = useUserRank(!userInTop50 && user?.id ? user.id : undefined);

  // Transform user rank data
  const userRankItem = useMemo(() => {
    if (!userRankData) return null;

    return {
      rank: yourOptimisticRank || userRankData.rank, // Use optimistic rank
      item: {
        rank: yourOptimisticRank || userRankData.rank,
        id: userRankData.user.id,
        username: userRankData.user.username || userRankData.user.email?.split('@')[0] || t('common.user'),
        totalXP: totalXP, // Use current XP (optimistic)
        league: userRankData.user.league,
        isYou: true,
        isGold: false,
        isSilver: false,
        isBronze: false,
      }
    };
  }, [userRankData, yourOptimisticRank, totalXP, t]);

  const error = queryError ? t('leaderboard.errors.loadFailed') : null;

  // Dynamic styles that update when theme changes
  const styles = useMemo(() => getStyles(), [themeVersion]);

  // Auto-scroll to user position when data loads
  useEffect(() => {
    if (!loading && leaderboardData.length > 0) {
      setTimeout(() => {
        scrollToUserPosition(leaderboardData, userInTop50);
      }, 300);
    }
  }, [loading, leaderboardData, userInTop50]);

  const scrollToUserPosition = (items: LeaderboardItem[], userInTop50: boolean) => {
    if (!scrollViewRef.current || !user?.id) return;

    const userIndex = items.findIndex(i => i.isYou);

    if (userIndex !== -1) {
      const itemHeight = 76;
      const scrollPosition = userIndex * itemHeight;
      scrollViewRef.current.scrollTo({
        y: scrollPosition,
        animated: true,
      });
    } else if (!userInTop50) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return colors.xpGold;
    if (rank === 2) return colors.textSecondary;
    if (rank === 3) return colors.primary;
    return colors.textDisabled;
  };

  // Skeleton loading component for leaderboard items
  const LeaderboardSkeleton = () => (
    <View style={styles.skeletonItem}>
      {/* Rank */}
      <View style={styles.rankContainer}>
        <Skeleton width={24} height={24} borderRadius={4} />
      </View>

      {/* Avatar */}
      <Skeleton variant="circular" height={44} style={styles.skeletonAvatar} />

      {/* Username */}
      <View style={styles.skeletonUserInfo}>
        <Skeleton width="70%" height={16} borderRadius={8} />
      </View>

      {/* Score */}
      <View style={styles.skeletonScore}>
        <Skeleton width={60} height={20} borderRadius={8} />
        <Skeleton width={30} height={12} borderRadius={6} style={{ marginTop: 4 }} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <HugeiconsIcon icon={Award01Icon} size={32} color={colors.warning} />
          <Text style={styles.title}>{t('leaderboard.title')}</Text>

        </View>
        <View style={styles.leagueCard}>
          <HugeiconsIcon icon={Medal01Icon} size={20} color={colors.primary} />
          <Text style={styles.leagueText}>{t('leaderboard.league')}</Text>
        </View>
      </View>

      {/* Leaderboard List */}
      <ScrollView ref={scrollViewRef} style={styles.list} contentContainerStyle={styles.listContent}>
        {/* Loading State - Skeleton */}
        {loading && (
          <>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
              <LeaderboardSkeleton key={`skeleton-${index}`} />
            ))}
          </>
        )}

        {/* Error State */}
        {error && !loading && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>❌ {error}</Text>
            <Text style={styles.errorSubtext}>{t('errors.tryAgainLater')}</Text>
          </View>
        )}

        {/* Empty State */}
        {!loading && !error && leaderboardData.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🏆</Text>
            <Text style={styles.emptyText}>{t('leaderboard.empty.title')}</Text>
            <Text style={styles.emptySubtext}>{t('leaderboard.empty.subtitle')}</Text>
          </View>
        )}

        {/* Leaderboard Data */}
        {!loading && !error && leaderboardData.map((item) => (
          <View
            key={item.rank}
            style={[
              styles.item,
              item.isYou && styles.itemYou,
              item.rank <= 3 && styles.itemTop,
            ]}
          >
            {/* Rank */}
            <View style={styles.rankContainer}>
              <Text style={[styles.rank, { color: getRankColor(item.rank) }]}>
                {item.isYou && yourOptimisticRank ? yourOptimisticRank : item.rank}
              </Text>
            </View>

            {/* Avatar */}
            <View style={styles.avatar}>
              {item.isGold && <HugeiconsIcon icon={CrownIcon} size={24} color={colors.warning} />}
              {item.isSilver && <HugeiconsIcon icon={Medal01Icon} size={24} color={colors.textSecondary} />}
              {item.isBronze && <HugeiconsIcon icon={Medal01Icon} size={24} color={colors.primary} />}
              {!item.isGold && !item.isSilver && !item.isBronze && !item.isYou && (
                <HugeiconsIcon icon={StarIcon} size={24} color={colors.textDisabled} />
              )}
              {item.isYou && <HugeiconsIcon icon={UserAccountIcon} size={24} color={colors.secondary} />}
            </View>

            {/* Username */}
            <View style={styles.userInfo}>
              <Text style={[styles.username, item.isYou && styles.usernameYou]}>
                {item.username}
              </Text>
            </View>

            {/* Total XP */}
            <View style={styles.scoreContainer}>
              <Text style={styles.score}>
                {item.isYou ? totalXP.toLocaleString() : item.totalXP.toLocaleString()}
              </Text>
              <Text style={styles.scoreLabel}>XP</Text>
            </View>
          </View>
        ))}

        {/* User's Rank (if not in top 50) */}
        {!loading && !error && userRankItem && (
          <>
            <View style={styles.separator}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>{t('leaderboard.yourRank')}</Text>
              <View style={styles.separatorLine} />
            </View>

            <View
              style={[
                styles.item,
                styles.itemYou,
                styles.userRankCard,
              ]}
            >
              {/* Rank */}
              <View style={styles.rankContainer}>
                <Text style={[styles.rank, { color: colors.secondary }]}>
                  {userRankItem.rank}
                </Text>
              </View>

              {/* Avatar */}
              <View style={styles.avatar}>
                <HugeiconsIcon icon={UserAccountIcon} size={24} color={colors.secondary} />
              </View>

              {/* Username */}
              <View style={styles.userInfo}>
                <Text style={[styles.username, styles.usernameYou]}>
                  {userRankItem.item.username}
                </Text>
              </View>

              {/* Total XP */}
              <View style={styles.scoreContainer}>
                <Text style={styles.score}>{userRankItem.item.totalXP.toLocaleString()}</Text>
                <Text style={styles.scoreLabel}>XP</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Info Banner - Only show if not authenticated */}
      {!isAuthenticated && (
        <View style={styles.infoBox}>
          <HugeiconsIcon icon={BulbIcon} size={24} color={colors.textOnPrimary} />
          <Text style={styles.infoText}>
            Giriş yaparak asıl liderlik tablosunu gör!
          </Text>
        </View>
      )}
    </View>
  );
}

// Force re-create styles when theme changes by making them a function
const getStyles = () => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.backgroundDarker,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 12,
    position: 'relative',
  },
  refreshButton: {
    position: 'absolute',
    right: 0,
    padding: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  leagueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'center',
    gap: 8,
  },
  leagueText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  itemTop: {
    borderColor: colors.border,
    shadowColor: colors.shadowStrong,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  itemYou: {
    backgroundColor: colors.surfaceLight,
    borderColor: colors.secondary,
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
  },
  rank: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.backgroundLighter,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  usernameYou: {
    color: colors.secondary,
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.xpGold,
  },
  scoreLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  infoBox: {
    position: 'absolute',
    bottom: 90,
    left: 16,
    right: 16,
    backgroundColor: colors.secondary,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 4,
    borderBottomColor: colors.buttonBlueBorder,
  },
  infoText: {
    flex: 1,
    color: colors.textOnPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  errorContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  skeletonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  skeletonAvatar: {
    marginRight: 12,
  },
  skeletonUserInfo: {
    flex: 1,
  },
  skeletonScore: {
    alignItems: 'flex-end',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 12,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  separatorText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  userRankCard: {
    shadowColor: colors.shadowStrong,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});

