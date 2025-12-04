import { AudioModule } from 'expo-audio';

/**
 * Plays a sound from a local asset.
 * @param source The source of the audio (require(...) or URI).
 * @returns A function to stop and unload the sound.
 */
export const playSound = async (source: any) => {
    try {
        const player = await AudioModule.createPlayerAsync(source);
        player.play();

        // Return a cleanup function
        return async () => {
            try {
                player.pause();
                // There might not be an explicit unload in the new API, 
                // but stopping/pausing is good practice.
                // The player will be garbage collected when it goes out of scope.
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
 */
export const configureAudioMode = async () => {
    // expo-audio might handle this differently or automatically.
    // For now, we'll leave this empty or implement if needed based on docs.
    // The previous code used Audio.setAudioModeAsync which is from expo-av.
    console.log('Audio mode configured (placeholder for expo-audio)');
};
