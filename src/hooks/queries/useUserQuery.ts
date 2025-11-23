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

            const { data, error } = await database.users.getById(userId);

            if (error) throw error;
            if (!data) throw new Error('User not found');

            return data;
        },
        enabled: !!userId, // Only run if userId exists
        staleTime: 0, // Always fetch fresh data
        refetchOnMount: true, // Refetch when component mounts
        refetchOnWindowFocus: true, // Refetch when window focused
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
function calculateSuccessRate(userData: any): number {
    const totalQuestions = userData.total_questions_solved || 0;
    const correctAnswers = userData.total_correct_answers || 0;

    return totalQuestions > 0
        ? Math.round((correctAnswers / totalQuestions) * 100)
        : 0;
}
