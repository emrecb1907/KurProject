import { createAudioPlayer, AudioPlayer } from 'expo-audio';

/**
 * Singleton Audio Player using the expo-audio recommended pattern.
 * Uses a single player instance and the `replace(source)` method to switch sounds.
 * This avoids creating multiple players which can cause playback issues.
 */

let player: AudioPlayer | null = null;
let currentSource: any = null;

/**
 * Plays a sound using a single, reused AudioPlayer instance.
 * Per expo-audio docs, we use `replace(source)` to switch sounds and
 * `seekTo(0); play()` to replay.
 * 
 * @param source The audio source (require(...) or URI)
 * @returns A cleanup function to pause playback
 */
export const playSound = (source: any) => {
    try {
        // Initialize player on first use
        if (!player) {
            player = createAudioPlayer(source);
            currentSource = source;
            player.play();
        } else if (currentSource !== source) {
            // Replace source if different (this is the documented way to switch sounds)
            player.replace(source);
            currentSource = source;
            player.play();
        } else {
            // Same source - just seek to start and play (replay pattern from docs)
            player.seekTo(0);
            player.play();
        }

        // Return a cleanup function
        return () => {
            try {
                if (player) {
                    player.pause();
                }
            } catch (e) {
                console.warn('Error pausing sound:', e);
            }
        };
    } catch (error) {
        console.error('Error playing sound:', error);
        return () => { };
    }
};

/**
 * Releases the audio player. Call this when leaving screens that use audio.
 * This prevents memory leaks as noted in expo-audio docs.
 */
export const releaseAudioPlayer = () => {
    if (player) {
        try {
            player.remove();
        } catch (e) {
            console.warn('Error releasing player:', e);
        }
        player = null;
        currentSource = null;
    }
};

/**
 * Configures the audio mode for the app.
 * Note: expo-audio handles audio mode automatically, so this is a no-op.
 */
export const configureAudioMode = async () => {
    // expo-audio handles audio mode configuration automatically
};
