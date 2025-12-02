// Import all Turkish translation modules
import common from './tr/common.json';
import home from './tr/home.json';
import auth from './tr/auth.json';
import profile from './tr/profile.json';
import leaderboard from './tr/leaderboard.json';
import rewards from './tr/rewards.json';
import games from './tr/games.json';
import gameUI from './tr/gameUI.json';
import lessons from './tr/lessons.json';
import errors from './tr/errors.json';

// Import all English translation modules
import enCommon from './en/common.json';
import enHome from './en/home.json';
import enAuth from './en/auth.json';
import enProfile from './en/profile.json';
import enLeaderboard from './en/leaderboard.json';
import enRewards from './en/rewards.json';
import enGames from './en/games.json';
import enGameUI from './en/gameUI.json';
import enLessons from './en/lessons.json';
import enErrors from './en/errors.json';

// Merge all Turkish translations into a single object
// home.json already contains home, tabs, weeklyActivity objects (spread them)
// Other files contain root-level content that needs to be wrapped in their namespace
export const tr = {
    common,
    ...home, // Spreads: home, tabs, weeklyActivity
    auth, // Contains: login, register, errors (wrapped as auth namespace)
    profile, // Contains root-level profile content (wrapped as profile namespace)
    leaderboard, // Contains root-level leaderboard content (wrapped as leaderboard namespace)
    rewards, // Contains root-level rewards content (wrapped as rewards namespace)
    games, // Contains root-level games content (wrapped as games namespace)
    gameUI, // Contains root-level gameUI content (wrapped as gameUI namespace)
    lessons, // Contains root-level lessons content (wrapped as lessons namespace)
    errors, // Contains root-level errors content (wrapped as errors namespace)
};

// Merge all English translations into a single object
const en = {
    common: enCommon,
    ...enHome, // Spreads: home, tabs, weeklyActivity
    auth: enAuth, // Contains: login, register, errors (wrapped as auth namespace)
    profile: enProfile, // Contains root-level profile content (wrapped as profile namespace)
    leaderboard: enLeaderboard, // Contains root-level leaderboard content (wrapped as leaderboard namespace)
    rewards: enRewards, // Contains root-level rewards content (wrapped as rewards namespace)
    games: enGames, // Contains root-level games content (wrapped as games namespace)
    gameUI: enGameUI, // Contains root-level gameUI content (wrapped as gameUI namespace)
    lessons: enLessons, // Contains root-level lessons content (wrapped as lessons namespace)
    errors: enErrors, // Contains root-level errors content (wrapped as errors namespace)
};

export { tr as default, en };

