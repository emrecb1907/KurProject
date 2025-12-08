import { useCompleteGameMutation } from './mutations/useGameMutations';
import { GameType } from '@/types/game.types';

interface CompleteGameParams {
    lessonId: string;
    gameType: GameType;
    correctAnswers: number;
    totalQuestions: number;
    source?: 'lesson' | 'test';
    duration?: number;
    timestamp?: string;
}

/**
 * Game Completion Hook (Backward Compatible Wrapper)
 * 
 * This is a wrapper around useCompleteGameMutation for backward compatibility.
 * New code should use useCompleteGameMutation directly.
 * 
 * @deprecated Use useCompleteGameMutation instead
 * @returns Game completion function and loading state
 */
export function useGameCompletion() {
    const mutation = useCompleteGameMutation();

    async function completeGame(params: CompleteGameParams) {
        try {
            const result = await mutation.mutateAsync(params);
            return { success: result.success, error: null };
        } catch (error) {
            return { success: false, error: error as Error };
        }
    }

    return {
        completeGame,
        isSubmitting: mutation.isPending,
    };
}
