import { useMutation } from '@tanstack/react-query';
import { useAuth, useUser } from '@/store';
import { database } from '@/lib/supabase/database';
import { GameType } from '@/types/game.types';
import { SubmitTestResultResponse } from '@/types/rpc.types';
import { logger } from '@/lib/logger';
import { queryClient } from '@/lib/queryClient';

interface CompleteGameParams {
    lessonId: string;
    gameType: GameType;
    correctAnswers: number;
    totalQuestions: number;
    source?: 'lesson' | 'test'; // Track where the game was started from
    duration?: number;
    timestamp?: string; // 🌍 Global Streak Support
}

// ... (Result interface)
interface CompleteGameResult {
    success: boolean;
    leveledUp?: boolean;
    newLevel?: number;
}

export function useCompleteGameMutation() {
    const { isAuthenticated, user, refreshUser } = useAuth();
    const { sessionToken } = useUser();

    return useMutation({
        mutationFn: async ({
            lessonId,
            gameType,
            correctAnswers,
            totalQuestions,
            source = 'lesson', // Default to lesson for backward compatibility
            duration,
            timestamp // New param
        }: CompleteGameParams): Promise<CompleteGameResult> => {
            let leveledUp = false;
            let newLevel = 0;
            let newStreak: number | undefined;

            // Save progress if authenticated (including anonymous users with DB records)
            if (isAuthenticated && user?.id) {
                let dbError = null;

                if (source === 'test') {
                    // Call Secure RPC for Test
                    console.log('🚀 Calling submit_test_result_secure with:', {
                        user_id: user.id,
                        test_id: lessonId,
                        correct: correctAnswers,
                        total: totalQuestions,
                        duration,
                        timestamp,
                        session_id: sessionToken // Log session
                    });

                    const { error, data } = await database.tests.saveResult(user.id, {
                        test_id: lessonId,
                        correct_answer: correctAnswers,
                        total_question: totalQuestions,
                        percent: Math.round((correctAnswers / totalQuestions) * 100),
                        duration: duration,
                        client_timestamp: timestamp, // Pass timestamp
                        session_id: sessionToken || undefined // Pass session ID
                    });

                    console.log('📡 RPC Response:', { data, error });

                    dbError = error;

                    if (!error) {
                        // Cast response to typed RPC response
                        const result = data as SubmitTestResultResponse | null;

                        // Check for application-level error returned in data
                        if (result && result.success === false) {
                            const errorCode = result.error || 'UNKNOWN_ERROR';
                            const errorMessage = result.message || 'Bir hata oluştu';

                            // 🛡️ Güvenlik hatalarını özel olarak işle
                            const securityError = new Error(errorMessage) as Error & { code: string; isSecurityError: boolean };
                            securityError.code = errorCode;
                            securityError.isSecurityError = true;
                            dbError = securityError;
                        } else if (result) {
                            // Capture streak from response if available
                            if (result.new_streak) {
                                newStreak = result.new_streak;
                            }
                            logger.info(`Daily test count handled by updateGameStats (Test ID: ${lessonId})`);
                        }
                    }
                } else {
                    // Call RPC for Lesson (Idempotent)
                    const { error } = await database.lessons.complete(user.id, lessonId);
                    dbError = error;

                    // Note: Server RPC already increments lessons_today in daily_progress table
                    // We only need to update local completedLessons list for UI (no duplicate daily count)
                    if (!error) {
                        logger.info(`Lesson completed on server (Lesson ID: ${lessonId})`);
                    }
                }

                if (dbError) {
                    throw dbError;
                }

                // Update stats cache immediately after game completion
                // We fetch the updated profile to get the new XP/Level calculated by the DB trigger/RPC
                const { data: userProfile } = await database.users.getProfile(user.id);
                console.log('🔄 Fetched Profile after update:', userProfile?.stats);

                if (userProfile && userProfile.stats) {
                    // Check for level up based on DB response
                    if (userProfile.stats.current_level > (user.current_level || 0)) {
                        leveledUp = true;
                        newLevel = userProfile.stats.current_level;
                        logger.levelUp(newLevel);
                    }
                }

                // 🚀 CRITICAL: Invalidate React Query caches - this is the ONLY state update needed
                // React Query will refetch and components will get fresh data automatically
                queryClient.invalidateQueries({ queryKey: ['user', user.id] });
                queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
                queryClient.invalidateQueries({ queryKey: ['dailyProgress', user.id] });
                queryClient.invalidateQueries({ queryKey: ['completedLessons', user.id] });
                logger.info('React Query caches invalidated');

                // Sync Zustand store with fresh data to prevent stale level checks in next run
                refreshUser();

                logger.game(`${gameType} game completed successfully`);
            }

            return { success: true, leveledUp, newLevel };
        },

        onError: (error, variables) => {
            console.error(`${variables.gameType} game completion error:`, error);
        },

        retry: 1, // Retry once on failure
    });
}
