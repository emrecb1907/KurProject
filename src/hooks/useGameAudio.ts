import { useRef, useEffect, useCallback } from 'react';
import {
    playGameSound,
    releaseGameAudioPlayer,
    initGameSounds,
    CORRECT_CHOICE_SOUND,
    WRONG_CHOICE_SOUND,
    GAME_COMPLETE_SOUND,
    LEVEL_UP_SOUND
} from '@/utils/gameSound';
import { playSound, releaseAudioPlayer } from '@/utils/audio';
import { LETTER_AUDIO_FILES } from '@/data/elifBaLetters';
import { logger } from '@/lib/logger';

export const useGameAudio = (gameType: string) => {
    const stopSoundRef = useRef<(() => void) | null>(null);
    const stopEffectSoundRef = useRef<(() => void) | null>(null);
    const stopGameCompleteSoundRef = useRef<(() => void) | null>(null);

    // Initialize sounds on mount
    useEffect(() => {
        initGameSounds();
        return () => {
            // Cleanup all sounds on unmount
            if (stopSoundRef.current) stopSoundRef.current();
            if (stopEffectSoundRef.current) stopEffectSoundRef.current();
            if (stopGameCompleteSoundRef.current) stopGameCompleteSoundRef.current();

            releaseAudioPlayer();
            releaseGameAudioPlayer();
        };
    }, []);

    // Stop current question sound (e.g. letter audio)
    const stopCurrentSound = useCallback(() => {
        if (stopSoundRef.current) {
            stopSoundRef.current();
            stopSoundRef.current = null;
        }
    }, []);

    // Play feedback sound (correct/wrong)
    const playFeedbackSound = useCallback((isCorrect: boolean) => {
        try {
            const soundFile = isCorrect ? CORRECT_CHOICE_SOUND : WRONG_CHOICE_SOUND;
            const stop = playGameSound(soundFile);
            stopEffectSoundRef.current = stop;
        } catch (error) {
            console.error('Error playing sound effect:', error);
            stopEffectSoundRef.current = null;
        }
    }, []);

    // Play completion sound (level up or finish)
    const playCompletionSound = useCallback((leveledUp: boolean) => {
        try {
            if (stopGameCompleteSoundRef.current) {
                stopGameCompleteSoundRef.current();
                stopGameCompleteSoundRef.current = null;
            }

            const soundFile = leveledUp ? LEVEL_UP_SOUND : GAME_COMPLETE_SOUND;
            const stop = playGameSound(soundFile);
            stopGameCompleteSoundRef.current = stop;
        } catch (error) {
            console.error('Error playing completion sound:', error);
            stopGameCompleteSoundRef.current = null;
        }
    }, []);

    // Play letter audio (specific to letters game)
    const playLetterAudio = useCallback((audioFileId: number) => {
        try {
            // Stop previous sound first
            stopCurrentSound();

            const audioFile = LETTER_AUDIO_FILES[audioFileId];
            if (!audioFile) {
                console.warn(`Audio file not found for letter ${audioFileId}`);
                return;
            }

            const stop = playSound(audioFile);
            stopSoundRef.current = stop;
        } catch (error) {
            console.error('Error playing audio:', error);
            stopSoundRef.current = null;
        }
    }, [stopCurrentSound]);

    return {
        playFeedbackSound,
        playCompletionSound,
        playLetterAudio,
        stopCurrentSound
    };
};
