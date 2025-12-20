import { useAuth } from '@/store';
import { database } from '@/lib/supabase/database';
import { calculateUserLevel, getXPProgress } from '@/lib/utils/levelCalculations';
import { useUserData as useUserDataQuery, useEnergy, useCompletedLessons } from './queries';
import { queryClient } from '@/lib/queryClient';

/**
 * useUserData - Convenience hook for user data and mutations
 * 
 * This hook combines React Query data with mutation helpers.
 * For direct data access, prefer using individual query hooks:
 * - useUserDataQuery() for XP, level, streak, stats
 * - useEnergy() for energy/lives
 * - useCompletedLessons() for completed lessons list
 */
export function useUserData() {
  const { user } = useAuth();

  // Get server data from React Query
  const { data: userData, isLoading: isUserLoading } = useUserDataQuery(user?.id);
  const { data: energyData, isLoading: isEnergyLoading } = useEnergy(user?.id);
  const { data: completedLessons = [] } = useCompletedLessons(user?.id);

  // Extract values with fallbacks
  const totalXP = userData?.total_xp ?? userData?.stats?.total_score ?? 0;
  const currentLevel = userData?.current_level ?? userData?.stats?.current_level ?? 1;
  const totalScore = userData?.total_score ?? userData?.stats?.total_score ?? 0;
  const currentLives = energyData?.current_energy ?? 6;
  const maxLives = energyData?.max_energy ?? 6;
  const streak = userData?.streak ?? 0;

  // Calculate XP progress
  const xpProgress = getXPProgress(totalXP);

  // Earn XP (updates database and invalidates cache)
  async function earnXP(xp: number) {
    if (!user) return;

    const newTotalXP = totalXP + xp;
    const newLevel = calculateUserLevel(newTotalXP);
    const leveledUp = newLevel > currentLevel;

    // Update database
    const { error } = await database.users.updateXP(user.id, xp);

    if (error) {
      console.error('❌ Failed to update XP in database:', error);
      return null;
    }

    // Invalidate cache to refetch
    queryClient.invalidateQueries({ queryKey: ['user', user.id] });
    queryClient.invalidateQueries({ queryKey: ['leaderboard'] });

    return {
      leveledUp,
      newLevel,
      xpProgress: getXPProgress(newTotalXP),
    };
  }

  // Add lives via database
  async function gainLives(amount: number) {
    if (!user) return;

    const { error } = await database.energy.add(user.id, amount);

    if (error) {
      console.error('❌ Failed to update lives in database:', error);
      return;
    }

    // Invalidate cache to refetch
    queryClient.invalidateQueries({ queryKey: ['energy', user.id] });
  }

  // Check if lesson is unlocked
  function isLessonUnlocked(requiredLevel: number): boolean {
    return currentLevel >= requiredLevel;
  }

  // Check if lesson is completed
  function isLessonCompleted(lessonId: string): boolean {
    return completedLessons.includes(lessonId);
  }

  return {
    // State (from React Query)
    totalXP,
    currentLevel,
    totalScore,
    currentLives,
    maxLives,
    streak,
    xpProgress,
    completedLessons,

    // Loading states
    isLoading: isUserLoading || isEnergyLoading,

    // Actions
    earnXP,
    gainLives,
    isLessonUnlocked,
    isLessonCompleted,
    getXPProgress: () => xpProgress,
  };
}
