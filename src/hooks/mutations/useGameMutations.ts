import { useMutation } from '@tanstack/react-query';
import { useAuth, useUser } from '@/store';
import { database } from '@/lib/supabase/database';
import { GameType } from '@/types/game.types';
import { useUserData } from '../useUserData';
import { logger } from '@/lib/logger';
import { handleError } from '@/lib/errorHandler';
import { queryClient } from '@/lib/queryClient';

interface CompleteGameParams {
    lessonId: string;
    gameType: GameType;
    correctAnswers: number;
    totalQuestions: number;
}

interface CompleteGameResult {
    success: boolean;
    leveledUp?: boolean;
    newLevel?: number;
}

/**
 * Game Completion Mutation Hook
 * 
 * Features:
 * - Automatic loading state (isPending)
 * - Automatic error handling
 * - Automatic cache invalidation
 * - XP earning and progress tracking
 * 
 * @returns React Query mutation for game completion
 */
export function useCompleteGameMutation() {
    const { isAuthenticated, user } = useAuth();
    const { earnXP } = useUserData();
    const { setUserStats } = useUser();

    return useMutation({
        mutationFn: async ({
            lessonId,
            gameType,
            correctAnswers,
            totalQuestions,
        }: CompleteGameParams): Promise<CompleteGameResult> => {
            let leveledUp = false;
            let newLevel = 0;

            // Earn XP (includes level up, leaderboard update, DB sync)
            if (correctAnswers > 0 && user) {
                const result = await earnXP(correctAnswers);

                if (result?.leveledUp) {
                    leveledUp = true;
                    newLevel = result.newLevel;
                    logger.levelUp(result.newLevel);
                }
            }

            // Save progress if authenticated
            if (isAuthenticated && user?.id) {
                // Update completion
                const { error: completionError } = await database.progress.updateCompletion(
                    user.id,
                    lessonId,
                    correctAnswers,
                    totalQuestions
                );

                if (completionError) {
                    throw completionError;
                }

                // Record daily activity
                await database.dailyActivity.record(user.id);

                // Update stats cache immediately after game completion
                const { data: userData } = await database.users.getById(user.id);
                if (userData) {
                    const newCompletedTests = userData.total_lessons_completed || 0;
                    const totalQuestionsDB = userData.total_questions_solved || 0;
                    const correctAnswersDB = userData.total_correct_answers || 0;
                    const newSuccessRate = totalQuestionsDB > 0
                        ? Math.round((correctAnswersDB / totalQuestionsDB) * 100)
                        : 0;

                    setUserStats(newCompletedTests, newSuccessRate);
                    logger.info(`Stats updated: ${newCompletedTests} tests, ${newSuccessRate}% success rate`);
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
            handleError(error, {
                context: `${variables.gameType} game completion`,
                logToConsole: true,
            });
        },

        retry: 1, // Retry once on failure
    });
}
