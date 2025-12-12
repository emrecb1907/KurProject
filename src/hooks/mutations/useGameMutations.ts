import { useMutation } from '@tanstack/react-query';
import { useAuth, useUser } from '@/store';
import { database } from '@/lib/supabase/database';
import { GameType } from '@/types/game.types';
import { useUserData } from '../useUserData';
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
    const { isAuthenticated, user } = useAuth();
    const { setUserStats, updateGameStats, completeLesson, sessionToken } = useUser();

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
                        // Check for application-level error returned in data
                        if (data && (data as any).success === false) {
                            const errorCode = (data as any).error || 'UNKNOWN_ERROR';
                            const errorMessage = (data as any).message || 'Bir hata oluştu';

                            // 🛡️ Güvenlik hatalarını özel olarak işle
                            const securityError = new Error(errorMessage) as any;
                            securityError.code = errorCode;
                            securityError.isSecurityError = true;
                            dbError = securityError;
                        } else {
                            // Capture streak from response if available
                            if (data && (data as any).new_streak) {
                                newStreak = (data as any).new_streak;
                            }
                            // incrementDailyTests(); Removed - Handled by updateGameStats in userSlice
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
                    // Use total_tests_completed if available (DB source of truth)
                    const newCompletedTests = userProfile.stats.total_tests_completed || userProfile.stats.total_lessons_completed || 0;
                    const totalQuestionsDB = userProfile.stats.total_questions_solved || 0;
                    const correctAnswersDB = userProfile.stats.total_correct_answers || 0;
                    const newSuccessRate = totalQuestionsDB > 0
                        ? Math.round((correctAnswersDB / totalQuestionsDB) * 100)
                        : 0;

                    // Update local state with fresh DB data
                    // Update local state with fresh DB data


                    updateGameStats(
                        userProfile.stats.total_score || 0, // XP
                        userProfile.stats.current_level || 1,
                        newCompletedTests,
                        newSuccessRate,
                        newStreak // Pass new streak
                    );

                    // Check for level up based on DB response
                    if (userProfile.stats.current_level > (user.current_level || 0)) {
                        leveledUp = true;
                        newLevel = userProfile.stats.current_level;
                        logger.levelUp(newLevel);
                    }
                }

                // 🚀 CRITICAL: Invalidate React Query caches
                queryClient.invalidateQueries({ queryKey: ['user', user.id] });
                queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
                logger.info('React Query caches invalidated');

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
