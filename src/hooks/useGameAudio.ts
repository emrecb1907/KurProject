import { useRef, useEffect, useCallback } from 'react';
import { useAudioPlayer } from 'expo-audio';
import { LETTER_AUDIO_FILES } from '@/data/elifBaLetters';

// Sound effect files
const CORRECT_CHOICE_SOUND = require('../../assets/audio/effects/CorrectChoice.mp3');
const WRONG_CHOICE_SOUND = require('../../assets/audio/effects/WrongChoice.mp3');
const GAME_COMPLETE_SOUND = require('../../assets/audio/effects/GameComplete.mp3');
const LEVEL_UP_SOUND = require('../../assets/audio/effects/LevelUp.mp3');

/**
 * Game Audio Hook using expo-audio's useAudioPlayer hook.
 * Each sound type has its own dedicated player with a fixed source.
 */
export const useGameAudio = (gameType: string) => {
    // Create dedicated players for each sound type - dokümandaki önerilen yöntem
    const correctPlayer = useAudioPlayer(CORRECT_CHOICE_SOUND);
    const wrongPlayer = useAudioPlayer(WRONG_CHOICE_SOUND);
    const completePlayer = useAudioPlayer(GAME_COMPLETE_SOUND);
    const levelUpPlayer = useAudioPlayer(LEVEL_UP_SOUND);

    // For letter audio, we'll use replace() method
    // Start with a default letter audio
    const defaultLetterAudio = LETTER_AUDIO_FILES[1] || CORRECT_CHOICE_SOUND;
    const letterPlayer = useAudioPlayer(defaultLetterAudio);

    // Stop current question sound
    const stopCurrentSound = useCallback(() => {
        try {
            letterPlayer.pause();
        } catch (e) {
            // Ignore errors
        }
    }, [letterPlayer]);

    // Play feedback sound (correct/wrong)
    const playFeedbackSound = useCallback((isCorrect: boolean) => {
        try {
            const player = isCorrect ? correctPlayer : wrongPlayer;
            // Use replace to replay from start, then play
            player.replace(isCorrect ? CORRECT_CHOICE_SOUND : WRONG_CHOICE_SOUND);
            player.play();
        } catch (error) {
            console.warn('Error playing sound effect:', error);
        }
    }, [correctPlayer, wrongPlayer]);

    // Play completion sound (level up or finish)
    const playCompletionSound = useCallback((leveledUp: boolean) => {
        try {
            const player = leveledUp ? levelUpPlayer : completePlayer;
            const source = leveledUp ? LEVEL_UP_SOUND : GAME_COMPLETE_SOUND;
            player.replace(source);
            player.play();
        } catch (error) {
            console.warn('Error playing completion sound:', error);
        }
    }, [levelUpPlayer, completePlayer]);

    // Play letter audio (specific to letters game)
    const playLetterAudio = useCallback((audioFileId: number) => {
        try {
            const audioFile = LETTER_AUDIO_FILES[audioFileId];
            if (!audioFile) {
                console.warn(`Audio file not found for letter ${audioFileId}`);
                return;
            }

            // Stop previous and play new
            letterPlayer.pause();
            letterPlayer.replace(audioFile);
            letterPlayer.play();
        } catch (error) {
            console.warn('Error playing audio:', error);
        }
    }, [letterPlayer]);

    return {
        playFeedbackSound,
        playCompletionSound,
        playLetterAudio,
        stopCurrentSound
    };
};
