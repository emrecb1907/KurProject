import { useQuery } from '@tanstack/react-query';
import { database } from '@/lib/supabase/database';

/**
 * Fetch user data by ID
 * 
 * Features:
 * - Auto-caches for 5 minutes
 * - Auto-refetches on window focus
 * - Auto-retries on failure
 * 
 * @param userId - User ID to fetch
 * @returns React Query result with user data
 */
export function useUserData(userId: string | undefined) {
    return useQuery({
        queryKey: ['user', userId],
        queryFn: async () => {
            if (!userId) throw new Error('User ID required');

            // Fetch user profile (includes stats and streaks)
            const { data: userProfile, error: userError } = await database.users.getProfile(userId);
            if (userError) throw userError;
            if (!userProfile) throw new Error('User not found');

            // Flatten structure for compatibility
            return {
                ...userProfile,
                ...userProfile.stats,
                // Map total_score to total_xp for XP calculations
                total_xp: userProfile.stats?.total_score ?? 0,
                streak: userProfile.streak?.streak || 0,
                streak_count: userProfile.streak?.streak || 0, // Alias for compatibility
                last_activity_date: userProfile.streak?.last_activity_date,
                weekly_activity: userProfile.streak?.activity_days || [],
            };
        },
        enabled: !!userId, // Only run if userId exists
        staleTime: 5 * 60 * 1000, // 5 minutes - show cached data, refetch in background
        gcTime: 10 * 60 * 1000, // Keep cache for 10 minutes
        refetchOnMount: true, // Refetch when component mounts (in background if cached)
        refetchOnWindowFocus: true, // Refetch when window focused
        placeholderData: (previousData) => previousData, // Keep showing old data while fetching new
    });
}

/**
 * Fetch user stats (optimized for profile page)
 * 
 * Returns calculated stats from user data
 */
export function useUserStats(userId: string | undefined) {
    const { data: userData, ...rest } = useUserData(userId);

    const stats = userData ? {
        completedTests: userData.total_lessons_completed || 0,
        total_tests_completed: userData.total_tests_completed || 0, // Add this line
        lessonsCompleted: userData.total_lessons_completed || 0,
        total_lessons_completed: userData.total_lessons_completed || 0, // Add this for useBadges strict check
        successRate: calculateSuccessRate(userData),
        totalQuestions: userData.total_questions_solved || 0,
        correctAnswers: userData.total_correct_answers || 0,
    } : null;

    return {
        data: stats,
        userData,
        ...rest,
    };
}

/**
 * Calculate success rate from user data
 */
/**
 * Calculate success rate from user data
 */
function calculateSuccessRate(userData: any): number {
    const totalQuestions = userData.total_questions_solved || 0;
    const correctAnswers = userData.total_correct_answers || 0;

    return totalQuestions > 0
        ? Math.round((correctAnswers / totalQuestions) * 100)
        : 0;
}

/**
 * Fetch completed lessons for a user
 */
export function useCompletedLessons(userId: string | undefined) {
    return useQuery({
        queryKey: ['completedLessons', userId],
        queryFn: async () => {
            if (!userId) return [];
            const { data, error } = await database.lessons.getCompleted(userId);
            if (error) throw error;
            return data || [];
        },
        enabled: !!userId,
    });
}
