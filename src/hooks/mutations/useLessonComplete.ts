import { useMutation, useQueryClient } from '@tanstack/react-query';
import { database } from '@/lib/supabase/database';
import { useAuth } from '@/store';

/**
 * Mutation hook for completing a lesson
 * 
 * Replaces the removed Zustand completeLesson function.
 * Uses server-side RPC for secure completion and XP granting.
 */
export function useLessonComplete() {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (lessonId: string) => {
            if (!user?.id) throw new Error('User not authenticated');

            const { data, error } = await database.lessons.complete(user.id, lessonId);
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            // Invalidate related queries to refresh data
            if (user?.id) {
                queryClient.invalidateQueries({ queryKey: ['completedLessons', user.id] });
                queryClient.invalidateQueries({ queryKey: ['user', user.id] });
                queryClient.invalidateQueries({ queryKey: ['dailyProgress', user.id] });
            }
        },
    });
}
