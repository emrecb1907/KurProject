import { useQuery } from '@tanstack/react-query';
import { database } from '@/lib/supabase/database';
import { DailyProgressResponse } from '@/types/rpc.types';

interface DailyProgressData {
    lessons_today: number;
    tests_today: number;
    lesson_claimed: boolean;
    test_claimed: boolean;
    date: string;
}

/**
 * Fetch user's daily progress from server
 * 
 * Features:
 * - Auto-caches for 2 minutes
 * - Server-side calculation (tamper-proof)
 * 
 * @param userId - User ID to fetch progress for
 * @returns React Query result with daily progress data
 */
export function useDailyProgress(userId: string | undefined) {
    return useQuery({
        queryKey: ['dailyProgress', userId],
        queryFn: async (): Promise<DailyProgressData> => {
            if (!userId) throw new Error('User ID required');

            const { data, error } = await database.dailySnapshots.getProgress(userId);

            if (error) throw error;

            const result = data as DailyProgressResponse | null;
            return {
                lessons_today: result?.lessons_today ?? 0,
                tests_today: result?.tests_today ?? 0,
                lesson_claimed: result?.lesson_claimed ?? false,
                test_claimed: result?.test_claimed ?? false,
                date: result?.date ?? new Date().toISOString().split('T')[0],
            };
        },
        enabled: !!userId,
        staleTime: 2 * 60 * 1000, // 2 minutes fresh
        gcTime: 10 * 60 * 1000, // 10 minutes cache
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        placeholderData: (previousData) => previousData,
    });
}
