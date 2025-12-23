import { useCallback, useRef } from 'react';
import { useAudioPlayer } from 'expo-audio';

/**
 * Custom hook for lesson audio playback using expo-audio's recommended pattern.
 * Uses useAudioPlayer with replace() for changing sounds.
 */
export const useLessonAudio = (initialSource?: any) => {
    // Use a dummy source initially, will be replaced when playing
    const dummySource = initialSource || null;
    const player = useAudioPlayer(dummySource);
    const isInitialized = useRef(false);

    const playAudio = useCallback((source: any) => {
        if (!source) return;

        try {
            // First time needs special handling
            if (!isInitialized.current && !initialSource) {
                isInitialized.current = true;
            }

            // Replace the source and play
            player.replace(source);
            player.play();
        } catch (error) {
            console.warn('Error playing lesson audio:', error);
        }
    }, [player, initialSource]);

    const stopAudio = useCallback(() => {
        try {
            player.pause();
        } catch (error) {
            // Ignore errors
        }
    }, [player]);

    return {
        playAudio,
        stopAudio,
        player
    };
};

/**
 * Legacy exports for backward compatibility
 */
export const playSound = (source: any) => {
    // This is now a no-op - components should use useLessonAudio hook instead
    console.warn('playSound is deprecated. Use useLessonAudio hook instead.');
    return () => { };
};

export const releaseAudioPlayer = () => {
    // No-op - useAudioPlayer handles cleanup automatically
};

export const configureAudioMode = async () => {
    // expo-audio handles audio mode configuration automatically
};
