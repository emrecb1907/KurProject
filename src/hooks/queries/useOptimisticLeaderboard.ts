import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { database } from '@/lib/supabase/database';
import { useAuth, useUser } from '@/store';

interface LeaderboardEntry {
    id: string;
    username: string | null;
    email: string | null;
    total_xp: number;
    league: string;
}

interface OptimisticLeaderboardResult {
    leaderboard: LeaderboardEntry[];
    isLoading: boolean;
    error: Error | null;
    yourOptimisticRank: number | null;
}

/**
 * Optimistic Leaderboard Hook
 * 
 * Features:
 * - Fetches leaderboard every 5 minutes
 * - Reorders list based on user's current XP (optimistic)
 * - No background refetch (battery friendly)
 * 
 * @param limit - Number of top users to fetch (default: 50)
 * @returns Leaderboard data with optimistic reordering
 */
export function useOptimisticLeaderboard(limit: number = 50): OptimisticLeaderboardResult {
    const { user } = useAuth();
    const { totalXP } = useUser();

    // Fetch leaderboard every 5 minutes
    const { data: leaderboard, isLoading, error } = useQuery({
        queryKey: ['leaderboard', limit],
        queryFn: async () => {
            const { data, error } = await database.users.getLeaderboard(limit);

            if (error) throw error;
            if (!data) return [];

            return data as LeaderboardEntry[];
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
        refetchIntervalInBackground: false, // Don't refetch in background
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    });

    // Reorder leaderboard with user's current XP (optimistic)
    const { reorderedLeaderboard, yourOptimisticRank } = useMemo(() => {
        if (!leaderboard || !user || leaderboard.length === 0) {
            return { reorderedLeaderboard: leaderboard || [], yourOptimisticRank: null };
        }

        // Check if user is in top 50
        const userIndex = leaderboard.findIndex(entry => entry.id === user.id);
        if (userIndex === -1) {
            return { reorderedLeaderboard: leaderboard, yourOptimisticRank: null };
        }

        // Create a copy of leaderboard
        const updatedLeaderboard = [...leaderboard];

        // Update user's XP in the list
        updatedLeaderboard[userIndex] = {
            ...updatedLeaderboard[userIndex],
            total_xp: totalXP,
        };

        // Re-sort by XP (descending)
        updatedLeaderboard.sort((a, b) => b.total_xp - a.total_xp);

        // Find user's new position
        const newUserIndex = updatedLeaderboard.findIndex(entry => entry.id === user.id);
        const optimisticRank = newUserIndex + 1;

        return {
            reorderedLeaderboard: updatedLeaderboard,
            yourOptimisticRank: optimisticRank
        };
    }, [leaderboard, totalXP, user]);

    return {
        leaderboard: reorderedLeaderboard,
        isLoading,
        error: error as Error | null,
        yourOptimisticRank,
    };
}
