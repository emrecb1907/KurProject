import { createAudioPlayer } from 'expo-audio';

/**
 * Plays a sound from a local asset.
 * @param source The source of the audio (require(...) or URI).
 * @returns A function to stop and unload the sound.
 */
export const playSound = async (source: any) => {
    try {
        const player = createAudioPlayer(source);
        player.play();

        // Return a cleanup function
        return async () => {
            try {
                player.remove();
                // The remove() method properly disposes of the player
            } catch (e) {
                console.warn('Error stopping sound:', e);
            }
        };
    } catch (error) {
        console.error('Error playing sound:', error);
        return async () => { };
    }
};

/**
 * Configures the audio mode for the app.
 * Note: expo-audio handles audio mode automatically, so this is a no-op.
 */
export const configureAudioMode = async () => {
    // expo-audio handles audio mode configuration automatically
};
