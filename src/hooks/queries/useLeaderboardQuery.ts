import { useQuery } from '@tanstack/react-query';
import { database } from '@/lib/supabase/database';

interface LeaderboardEntry {
    id: string;
    username: string | null;
    email: string | null;
    total_xp: number;
    league: string;
}

/**
 * Fetch leaderboard data
 * 
 * Features:
 * - Auto-refetches every 30 seconds
 * - Auto-refetches on window focus
 * - Auto-retries on failure
 * 
 * @param limit - Number of top users to fetch (default: 50)
 * @returns React Query result with leaderboard data
 */
export function useLeaderboard(limit: number = 50) {
    return useQuery({
        queryKey: ['leaderboard', limit],
        queryFn: async () => {
            const { data, error } = await database.users.getLeaderboard(limit);

            if (error) throw error;
            if (!data) return [];

            return data as LeaderboardEntry[];
        },
        staleTime: 30 * 1000, // 30 seconds
        refetchInterval: 30 * 1000, // Auto-refetch every 30 seconds
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    });
}

/**
 * Fetch user's rank (if not in top N)
 * 
 * @param userId - User ID
 * @returns React Query result with user rank data
 */
export function useUserRank(userId: string | undefined) {
    return useQuery({
        queryKey: ['userRank', userId],
        queryFn: async () => {
            if (!userId) return null;

            const { data, error } = await database.users.getUserRank(userId);

            if (error) throw error;
            return data;
        },
        enabled: !!userId,
        staleTime: 30 * 1000,
        refetchOnMount: true,
    });
}
