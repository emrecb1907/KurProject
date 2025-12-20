import { useMutation, useQueryClient } from '@tanstack/react-query';
import { database } from '@/lib/supabase/database';
import { useStore } from '@/store';

interface ConsumeEnergyResult {
    success: boolean;
    current_energy: number;
    session_id?: string;
    error?: string;
}

/**
 * Mutation hook for consuming energy before starting a test
 * 
 * Features:
 * - Optimistic update: UI decrements immediately
 * - Rollback on error
 * - Invalidates energy query on success
 * - Returns session_id for secure test submission
 */
export function useConsumeEnergy() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userId: string): Promise<ConsumeEnergyResult> => {
            const { data, error } = await database.energy.consume(userId);

            if (error) {
                throw error;
            }

            const result = data as any;

            if (!result?.success) {
                return {
                    success: false,
                    current_energy: result?.current_energy ?? 0,
                    error: result?.error || 'Enerji tüketilemedi',
                };
            }

            return {
                success: true,
                current_energy: result.current_energy,
                session_id: result.session_id,
            };
        },

        // Optimistic update: decrement energy immediately
        onMutate: async (userId) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['energy', userId] });

            // Snapshot previous value
            const previousEnergy = queryClient.getQueryData(['energy', userId]);

            // Optimistically update
            queryClient.setQueryData(['energy', userId], (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    current_energy: Math.max((old.current_energy || 0) - 1, 0),
                };
            });

            return { previousEnergy };
        },

        // Rollback on error
        onError: (err, userId, context) => {
            if (context?.previousEnergy) {
                queryClient.setQueryData(['energy', userId], context.previousEnergy);
            }
        },

        // Always refetch after mutation
        onSettled: (data, error, userId) => {
            queryClient.invalidateQueries({ queryKey: ['energy', userId] });

            // Store session_id in Zustand for later use
            if (data?.success && data.session_id) {
                useStore.getState().setSessionToken(data.session_id);
            }
        },
    });
}
