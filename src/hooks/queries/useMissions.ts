import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { database } from '@/lib/supabase/database';

// Types for Mission data
export interface Milestone {
    id: string;
    target_count: number;
    xp_reward: number;
    title_reward: string | null;
    order_in_group: number;
    is_reached: boolean;
    is_claimed: boolean;
}

export interface MissionGroup {
    id: string;
    name: string;
    order_number: number;
    is_repeatable: boolean;
    current_count: number;
    milestones: Milestone[];
}

export interface MissionsResponse {
    success: boolean;
    total_count: number;
    repeatable_count: number;
    groups: MissionGroup[];
    error?: string;
}

/**
 * Fetch user's missions and milestones
 */
export function useMissions(userId: string | undefined, type: 'test' | 'lesson') {
    return useQuery({
        queryKey: ['missions', userId, type],
        queryFn: async (): Promise<MissionsResponse> => {
            if (!userId) throw new Error('User ID required');

            const { data, error } = await database.missions.getMissions(userId, type);

            if (error) throw error;

            return data as MissionsResponse;
        },
        enabled: !!userId,
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnMount: true,
    });
}

/**
 * Claim milestone reward mutation
 */
export function useClaimMilestone() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ userId, milestoneId }: { userId: string; milestoneId: string }) => {
            const { data, error } = await database.missions.claimReward(userId, milestoneId);
            if (error) throw error;
            if (!data?.success) throw new Error(data?.error || 'Claim failed');
            return data;
        },
        onSuccess: (_, variables) => {
            // Invalidate missions to refetch
            queryClient.invalidateQueries({ queryKey: ['missions', variables.userId] });
            // Invalidate user stats (XP changed)
            queryClient.invalidateQueries({ queryKey: ['user-stats', variables.userId] });
            queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
            // Invalidate titles (new title might be earned)
            queryClient.invalidateQueries({ queryKey: ['user-titles', variables.userId] });
        },
    });
}
