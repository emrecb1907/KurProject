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
    const { setUserStats, updateGameStats, incrementDailyLessons, incrementDailyTests, completeLesson } = useUser();

    return useMutation({
        mutationFn: async ({
            lessonId,
            gameType,
            correctAnswers,
            totalQuestions,
            source = 'lesson', // Default to lesson for backward compatibility
            duration
        }: CompleteGameParams): Promise<CompleteGameResult> => {
            let leveledUp = false;
            let newLevel = 0;

            // Save progress if authenticated and NOT anonymous
            if (isAuthenticated && user?.id && !user.is_anonymous) {
                let dbError = null;

                if (source === 'test') {
                    // Call Secure RPC for Test
                    const { error } = await database.tests.saveResult(user.id, {
                        test_id: lessonId,
                        correct_answer: correctAnswers,
                        total_question: totalQuestions,
                        percent: Math.round((correctAnswers / totalQuestions) * 100),
                        duration: duration
                    });
                    dbError = error;

                    if (!error) {
                        incrementDailyTests();
                        logger.info(`Daily test count incremented (Test ID: ${lessonId})`);
                    }
                } else {
                    // Call RPC for Lesson (Idempotent)
                    const { error } = await database.lessons.complete(user.id, lessonId);
                    dbError = error;

                    if (!error) {
                        incrementDailyLessons();
                        completeLesson(lessonId, true); // Update local store ONLY (Skip sync to avoid double RPC)
                        logger.info(`Daily lesson count incremented (Lesson ID: ${lessonId})`);
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
                    updateGameStats(
                        userProfile.stats.total_score || 0, // XP
                        userProfile.stats.current_level || 1,
                        newCompletedTests,
                        newSuccessRate
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
