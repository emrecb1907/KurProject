import { useMutation, useQueryClient } from '@tanstack/react-query';
import { database } from '@/lib/supabase/database';
import { ClaimDailyRewardResponse } from '@/types/rpc.types';

interface ClaimResult {
    success: boolean;
    xp_awarded?: number;
    error?: string;
}

/**
 * Mutation hook for claiming daily task rewards
 * 
 * Features:
 * - Server-side validation (prevents cheating)
 * - Invalidates user and dailyProgress queries on success
 */
export function useClaimDailyTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            userId,
            taskType,
        }: {
            userId: string;
            taskType: 'lesson' | 'test';
        }): Promise<ClaimResult> => {
            const { data, error } = await database.dailySnapshots.claim(userId, taskType);

            if (error) {
                throw error;
            }

            const result = data as ClaimDailyRewardResponse | null;

            if (!result?.success) {
                return {
                    success: false,
                    error: result?.error || 'Ödül alınamadı',
                };
            }

            return {
                success: true,
                xp_awarded: result.xp_awarded,
            };
        },

        // Invalidate related queries on success
        onSuccess: (data, variables) => {
            if (data.success) {
                // Refetch user data (XP updated)
                queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
                // Refetch daily progress (claim status updated)
                queryClient.invalidateQueries({ queryKey: ['dailyProgress', variables.userId] });
                // Refetch leaderboard (XP changed)
                queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
            }
        },
    });
}
