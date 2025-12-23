import { createAudioPlayer, AudioPlayer } from 'expo-audio';

/**
 * Game Sound Manager - Uses replace() instead of seekTo() to avoid native crash.
 * Each sound type has its own player that is completely recreated for each play.
 */

// Sound effect files
const CORRECT_CHOICE_SOUND = require('../../assets/audio/effects/CorrectChoice.mp3');
const WRONG_CHOICE_SOUND = require('../../assets/audio/effects/WrongChoice.mp3');
const CLOCK_TICKING_SOUND = require('../../assets/audio/effects/clockTicking.mp3');
const GAME_COMPLETE_SOUND = require('../../assets/audio/effects/GameComplete.mp3');
const LEVEL_UP_SOUND = require('../../assets/audio/effects/LevelUp.mp3');

// Single player instance - recreated for each sound
let activePlayer: AudioPlayer | null = null;

/**
 * Initialize game sounds - no-op since we create on demand
 */
export const initGameSounds = () => {
    // No initialization needed - we create players on demand
};

/**
 * Plays a game sound effect.
 * Creates a fresh player for each sound to avoid seekTo crash.
 * 
 * @param source The audio source (require(...))
 * @returns A cleanup function to pause playback
 */
export const playGameSound = (source: any) => {
    try {
        // Don't clean up immediately - let it play
        // Just create a new player for this sound
        const player = createAudioPlayer(source);
        player.play();

        // Track this as active for cleanup
        activePlayer = player;

        return () => {
            try {
                player.pause();
                // Don't remove immediately - defer it
                setTimeout(() => {
                    try {
                        player.remove();
                    } catch (e) {
                        // Ignore
                    }
                }, 500);
            } catch (e) {
                // Ignore
            }
        };
    } catch (error) {
        console.error('Error playing sound:', error);
        return () => { };
    }
};

/**
 * Releases all game audio players. Call this when leaving game screens.
 */
export const releaseGameAudioPlayer = () => {
    if (activePlayer) {
        try {
            activePlayer.pause();
        } catch (e) { }

        // Defer removal to avoid crash
        const playerToRemove = activePlayer;
        setTimeout(() => {
            try {
                playerToRemove.remove();
            } catch (e) { }
        }, 500);

        activePlayer = null;
    }
};

// Export sound constants for use in other files
export {
    CORRECT_CHOICE_SOUND,
    WRONG_CHOICE_SOUND,
    CLOCK_TICKING_SOUND,
    GAME_COMPLETE_SOUND,
    LEVEL_UP_SOUND
};
