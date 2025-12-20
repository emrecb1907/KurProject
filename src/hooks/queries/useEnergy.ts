import { useQuery } from '@tanstack/react-query';
import { database } from '@/lib/supabase/database';
import { SyncEnergyResponse } from '@/types/rpc.types';

interface EnergyData {
    current_energy: number;
    max_energy: number;
    last_update: string | null;
    last_replenish_time: string | null;
}

/**
 * Fetch user's energy (lives) data
 * 
 * Features:
 * - Auto-refetches every 60 seconds (for regeneration)
 * - Stale after 30 seconds
 * - Shows cached data while refetching
 * 
 * @param userId - User ID to fetch energy for
 * @returns React Query result with energy data
 */
export function useEnergy(userId: string | undefined) {
    return useQuery({
        queryKey: ['energy', userId],
        queryFn: async (): Promise<EnergyData> => {
            if (!userId) throw new Error('User ID required');

            const { data, error } = await database.energy.sync(userId);

            if (error) throw error;

            const result = data as SyncEnergyResponse | null;
            return {
                current_energy: result?.current_energy ?? 6,
                max_energy: result?.max_energy ?? 6,
                last_update: result?.last_update ?? null,
                last_replenish_time: result?.last_replenish_time ?? result?.last_update ?? null,
            };
        },
        enabled: !!userId,
        staleTime: 30 * 1000, // 30 seconds - data considered fresh
        gcTime: 5 * 60 * 1000, // 5 minutes cache
        refetchInterval: 60 * 1000, // Auto-refetch every minute for regeneration
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        placeholderData: (previousData) => previousData,
    });
}
