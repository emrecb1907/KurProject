import { createAudioPlayer, AudioPlayer } from 'expo-audio';

/**
 * Game Sound Manager - Separate from lesson audio (audio.ts)
 * Uses pre-created players for each sound type with proper replay handling.
 */

// Sound effect files
const CORRECT_CHOICE_SOUND = require('../../assets/audio/effects/CorrectChoice.mp3');
const WRONG_CHOICE_SOUND = require('../../assets/audio/effects/WrongChoice.mp3');
const CLOCK_TICKING_SOUND = require('../../assets/audio/effects/clockTicking.mp3');
const GAME_COMPLETE_SOUND = require('../../assets/audio/effects/GameComplete.mp3');
const LEVEL_UP_SOUND = require('../../assets/audio/effects/LevelUp.mp3');

// Pre-created players for each sound type
let correctPlayer: AudioPlayer | null = null;
let wrongPlayer: AudioPlayer | null = null;
let tickingPlayer: AudioPlayer | null = null;
let completePlayer: AudioPlayer | null = null;
let levelUpPlayer: AudioPlayer | null = null;

// Track if sounds are initialized
let isInitialized = false;

/**
 * Initialize all game sound players. Call this once when game starts.
 */
export const initGameSounds = () => {
    if (isInitialized) return;

    try {
        correctPlayer = createAudioPlayer(CORRECT_CHOICE_SOUND);
        wrongPlayer = createAudioPlayer(WRONG_CHOICE_SOUND);
        tickingPlayer = createAudioPlayer(CLOCK_TICKING_SOUND);
        completePlayer = createAudioPlayer(GAME_COMPLETE_SOUND);
        levelUpPlayer = createAudioPlayer(LEVEL_UP_SOUND);
        isInitialized = true;
    } catch (error) {
        console.error('Error initializing game sounds:', error);
    }
};

/**
 * Helper to play a pre-loaded player with proper replay handling.
 * Uses the expo-audio recommended pattern: seekTo(0) then play()
 */
const playPreloadedPlayer = (player: AudioPlayer | null) => {
    if (!player) {
        console.warn('Player not initialized');
        return () => { };
    }

    try {
        // Reset to beginning and play - this is the expo-audio recommended pattern
        player.seekTo(0);
        player.play();

        return () => {
            try {
                player.pause();
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
 * Plays a game sound effect using pre-loaded players.
 * 
 * @param source The audio source (require(...))
 * @returns A cleanup function to pause playback
 */
export const playGameSound = (source: any) => {
    // Initialize players if not already done
    if (!isInitialized) {
        initGameSounds();
    }

    // Match source to pre-loaded player
    if (source === CORRECT_CHOICE_SOUND) {
        return playPreloadedPlayer(correctPlayer);
    } else if (source === WRONG_CHOICE_SOUND) {
        return playPreloadedPlayer(wrongPlayer);
    } else if (source === CLOCK_TICKING_SOUND) {
        return playPreloadedPlayer(tickingPlayer);
    } else if (source === GAME_COMPLETE_SOUND) {
        return playPreloadedPlayer(completePlayer);
    } else if (source === LEVEL_UP_SOUND) {
        return playPreloadedPlayer(levelUpPlayer);
    } else {
        // Fallback for unknown sources
        console.warn('Unknown sound source, creating temporary player');
        try {
            const tempPlayer = createAudioPlayer(source);
            tempPlayer.play();
            return () => {
                try {
                    tempPlayer.pause();
                    tempPlayer.remove();
                } catch (e) {
                    // Ignore
                }
            };
        } catch (error) {
            console.error('Error playing unknown sound:', error);
            return () => { };
        }
    }
};

/**
 * Releases all game audio players. Call this when leaving game screens.
 */
export const releaseGameAudioPlayer = () => {
    const players = [correctPlayer, wrongPlayer, tickingPlayer, completePlayer, levelUpPlayer];

    players.forEach(player => {
        if (player) {
            try {
                player.pause();
                player.remove();
            } catch (e) {
                // Ignore cleanup errors
            }
        }
    });

    correctPlayer = null;
    wrongPlayer = null;
    tickingPlayer = null;
    completePlayer = null;
    levelUpPlayer = null;
    isInitialized = false;
};

// Export sound constants for use in other files
export {
    CORRECT_CHOICE_SOUND,
    WRONG_CHOICE_SOUND,
    CLOCK_TICKING_SOUND,
    GAME_COMPLETE_SOUND,
    LEVEL_UP_SOUND
};
