import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '@constants/colors';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Award01Icon, CrownIcon, Medal01Icon, StarIcon, UserAccountIcon, BulbIcon, Refresh01Icon } from '@hugeicons/core-free-icons';
import { useAuth, useUser } from '@/store';
import { database } from '@/lib/supabase/database';
import { Skeleton } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { isAuthenticated, user } = useAuth();
  const { totalXP } = useUser();
  const { activeTheme, themeVersion } = useTheme(); // Force re-render on theme change

  const [leaderboardData, setLeaderboardData] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Dynamic styles that update when theme changes
  const styles = useMemo(() => getStyles(), [themeVersion]);

  // Fetch leaderboard when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('🔄 Leaderboard focused, refreshing...');
      fetchLeaderboard();
    }, [user?.id])
  );

  async function fetchLeaderboard(isManualRefresh = false) {
    try {
      if (isManualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      console.log('📊 Fetching leaderboard from database...');

      const { data, error: fetchError } = await database.users.getLeaderboard(50);

      if (fetchError) {
        console.error('❌ Leaderboard fetch error:', fetchError);
        setError('Liderlik tablosu yüklenemedi');
        return;
      }

      if (!data || data.length === 0) {
        console.log('ℹ️ No leaderboard data yet');
        setLeaderboardData([]);
        return;
      }

      // Map data to leaderboard items with ranks
      const items: LeaderboardItem[] = data.map((entry, index) => ({
        rank: index + 1,
        id: entry.id,
        username: entry.username || entry.email?.split('@')[0] || 'Kullanıcı',
        totalXP: entry.total_xp,
        league: entry.league,
        isYou: entry.id === user?.id,
        isGold: index === 0,
        isSilver: index === 1,
        isBronze: index === 2,
      }));

      console.log('✅ Leaderboard loaded:', items.length, 'users');
      console.log('📊 Your XP in leaderboard:', items.find(i => i.isYou)?.totalXP || 'N/A');
      setLeaderboardData(items);
    } catch (err) {
      console.error('❌ Unexpected leaderboard error:', err);
      setError('Bir hata oluştu');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

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
          <Text style={styles.title}>Liderlik Tablosu</Text>

        </View>
        <View style={styles.leagueCard}>
          <HugeiconsIcon icon={Medal01Icon} size={20} color={colors.primary} />
          <Text style={styles.leagueText}>Bronz Ligi</Text>
        </View>
      </View>

      {/* Leaderboard List */}
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
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
            <Text style={styles.errorSubtext}>Lütfen daha sonra tekrar deneyin</Text>
          </View>
        )}

        {/* Empty State */}
        {!loading && !error && leaderboardData.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🏆</Text>
            <Text style={styles.emptyText}>Henüz liderlik tablosunda kimse yok</Text>
            <Text style={styles.emptySubtext}>İlk sen ol!</Text>
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
                {item.rank}
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
              <Text style={styles.score}>{item.totalXP.toLocaleString()}</Text>
              <Text style={styles.scoreLabel}>XP</Text>
            </View>
          </View>
        ))}
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
});

