import { useState } from 'react';
import { useAuth, useUser } from '@/store';
import { database } from '@/lib/supabase/database';
import { GameType } from '@/types/game.types';
import { useUserData } from './useUserData';
import { logger } from '@/lib/logger';
import { handleError } from '@/lib/errorHandler';

interface CompleteGameParams {
    lessonId: string;
    gameType: GameType;
    correctAnswers: number;
    totalQuestions: number;
}

export function useGameCompletion() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { isAuthenticated, user } = useAuth();
    const { earnXP } = useUserData();
    const { setUserStats } = useUser();

    async function completeGame({
        lessonId,
        gameType,
        correctAnswers,
        totalQuestions,
    }: CompleteGameParams) {
        if (isSubmitting) return { success: false, error: 'Already submitting' };

        setIsSubmitting(true);

        try {
            // Earn XP (includes level up, leaderboard update, DB sync)
            if (correctAnswers > 0 && user) {
                const result = await earnXP(correctAnswers);

                if (result?.leveledUp) {
                    logger.levelUp(result.newLevel);
                }
            }

            // Save progress if authenticated
            if (isAuthenticated && user?.id) {
                try {
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

                    logger.game(`${gameType} game completed successfully`);
                } catch (dbError) {
                    handleError(dbError, {
                        context: `${gameType} game completion`,
                        logToConsole: true,
                    });
                    // Don't throw - we already added XP locally
                }
            }

            setIsSubmitting(false);
            return { success: true, error: null };
        } catch (error) {
            setIsSubmitting(false);
            handleError(error, {
                context: `${gameType} game completion`,
                logToConsole: true,
            });
            return { success: false, error: error as Error };
        }
    }

    return {
        completeGame,
        isSubmitting,
    };
}
