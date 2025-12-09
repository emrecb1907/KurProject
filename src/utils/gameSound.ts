import { createAudioPlayer, AudioPlayer } from 'expo-audio';

/**
 * Game Sound Manager - Separate from lesson audio (audio.ts)
 * Uses a pool of pre-created players for instant, reliable playback.
 * 
 * Key insight: Creating a new player each time can cause delays.
 * Instead, we pre-load the common sounds and just call play() on them.
 */

// Sound effect files - pre-load these
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

// Track which player is currently active (for cleanup function)
let activePlayer: AudioPlayer | null = null;

/**
 * Initialize all game sound players. Call this once when game starts.
 */
export const initGameSounds = () => {
    try {
        if (!correctPlayer) correctPlayer = createAudioPlayer(CORRECT_CHOICE_SOUND);
        if (!wrongPlayer) wrongPlayer = createAudioPlayer(WRONG_CHOICE_SOUND);
        if (!tickingPlayer) tickingPlayer = createAudioPlayer(CLOCK_TICKING_SOUND);
        if (!completePlayer) completePlayer = createAudioPlayer(GAME_COMPLETE_SOUND);
        if (!levelUpPlayer) levelUpPlayer = createAudioPlayer(LEVEL_UP_SOUND);
    } catch (error) {
        console.error('Error initializing game sounds:', error);
    }
};

/**
 * Helper to play a pre-loaded player reliably
 */
const playPlayer = (player: AudioPlayer | null) => {
    if (!player) return () => { };

    try {
        // Stop and seek to start for instant replay
        player.seekTo(0);
        player.play();
        activePlayer = player;

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
 * This ensures instant, reliable playback for consecutive sounds.
 * 
 * @param source The audio source (require(...))
 * @returns A cleanup function to pause playback
 */
export const playGameSound = (source: any) => {
    // Initialize players if not already done
    if (!correctPlayer) {
        initGameSounds();
    }

    // Match source to pre-loaded player
    if (source === CORRECT_CHOICE_SOUND) {
        return playPlayer(correctPlayer);
    } else if (source === WRONG_CHOICE_SOUND) {
        return playPlayer(wrongPlayer);
    } else if (source === CLOCK_TICKING_SOUND) {
        return playPlayer(tickingPlayer);
    } else if (source === GAME_COMPLETE_SOUND) {
        return playPlayer(completePlayer);
    } else if (source === LEVEL_UP_SOUND) {
        return playPlayer(levelUpPlayer);
    } else {
        // Fallback: create player on-the-fly for unknown sources
        try {
            const player = createAudioPlayer(source);
            player.play();
            return () => {
                try {
                    player.pause();
                    player.remove();
                } catch (e) {
                    // Ignore
                }
            };
        } catch (error) {
            console.error('Error playing unknown game sound:', error);
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
    activePlayer = null;
};

// Export sound constants for use in other files
export {
    CORRECT_CHOICE_SOUND,
    WRONG_CHOICE_SOUND,
    CLOCK_TICKING_SOUND,
    GAME_COMPLETE_SOUND,
    LEVEL_UP_SOUND
};
