import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { database } from '@/lib/supabase/database';

export interface UserTitle {
    id: string;
    user_id: string;
    title_name: string;
    earned_at: string;
}

/**
 * Fetch user's earned titles
 */
export function useUserTitles(userId: string | undefined) {
    return useQuery({
        queryKey: ['user-titles', userId],
        queryFn: async (): Promise<UserTitle[]> => {
            if (!userId) throw new Error('User ID required');

            const { data, error } = await database.missions.getUserTitles(userId);

            if (error) throw error;

            return (data as UserTitle[]) || [];
        },
        enabled: !!userId,
        staleTime: 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}

/**
 * Set active title mutation
 */
export function useSetActiveTitle() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ userId, titleName }: { userId: string; titleName: string | null }) => {
            const { data, error } = await database.missions.setActiveTitle(userId, titleName);
            if (error) throw error;
            if (!data?.success) throw new Error(data?.error || 'Set title failed');
            return data;
        },
        onSuccess: (_, variables) => {
            // Invalidate user query to update active_title
            queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
        },
    });
}
