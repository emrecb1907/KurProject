import { useCompleteGameMutation } from './mutations/useGameMutations';
import { GameType } from '@/types/game.types';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();

    async function completeGame(params: CompleteGameParams) {
        try {
            const result = await mutation.mutateAsync(params);
            return { success: result.success, error: null };
        } catch (error: any) {
            // 🛡️ Güvenlik hatalarını kullanıcıya göster (i18n ile)
            if (error?.isSecurityError) {
                const errorCode = error?.code || '';

                // Hata tipine göre doğru mesajı seç
                let title = t('errors.rateLimit.game.title');
                let message = error.message;

                if (errorCode === 'RATE_LIMITED') {
                    title = t('errors.rateLimit.game.title');
                    message = t('errors.rateLimit.game.message');
                } else if (errorCode === 'SESSION_REQUIRED' || errorCode === 'SESSION_NOT_FOUND' || errorCode === 'SESSION_MISMATCH') {
                    title = t('errors.rateLimit.session.title');
                    message = t('errors.rateLimit.session.message');
                }

                Alert.alert(title, message, [{ text: t('errors.action.retry') }]);
            }
            return { success: false, error: error as Error };
        }
    }

    return {
        completeGame,
        isSubmitting: mutation.isPending,
    };
}

