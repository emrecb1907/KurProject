// XP and Level System Constants

// XP Rewards
export const XP_REWARDS = {
  CORRECT_ANSWER: 10,
  DIFFICULT_QUESTION: 15,
  VERY_DIFFICULT_QUESTION: 20,
  QUICK_QUIZ_BONUS: 25,
  LESSON_COMPLETION: 50,
  PERFECT_SCORE: 100,
  STREAK_BONUS: 5, // Per day
} as const;

// Level Up Formula: Gerekli XP = Level × 100 + (Level - 1) × 50
export const calculateRequiredXP = (level: number): number => {
  return level * 100 + (level - 1) * 50;
};

// Calculate level from total XP
export const calculateLevel = (totalXP: number): number => {
  // Using quadratic formula: Level = FLOOR((-100 + SQRT(10000 + 400 * XP)) / 100) + 1
  return Math.floor((-100 + Math.sqrt(10000 + 400 * totalXP)) / 100) + 1;
};

// Calculate XP progress to next level
export const calculateXPProgress = (totalXP: number): {
  currentLevel: number;
  xpInCurrentLevel: number;
  xpRequiredForNextLevel: number;
  progressPercentage: number;
} => {
  const currentLevel = calculateLevel(totalXP);
  const xpForCurrentLevel = calculateRequiredXP(currentLevel - 1);
  const xpForNextLevel = calculateRequiredXP(currentLevel);
  
  const xpInCurrentLevel = totalXP - xpForCurrentLevel;
  const xpRequiredForNextLevel = xpForNextLevel - xpForCurrentLevel;
  const progressPercentage = (xpInCurrentLevel / xpRequiredForNextLevel) * 100;
  
  return {
    currentLevel,
    xpInCurrentLevel,
    xpRequiredForNextLevel,
    progressPercentage,
  };
};

// Score System
export const SCORE_MULTIPLIERS = {
  PERFECT_TIMING: 2.0,
  FAST_ANSWER: 1.5,
  NORMAL: 1.0,
  SLOW: 0.8,
} as const;

// Leaderboard
export const LEAGUE_THRESHOLDS = {
  BRONZE: 0,
  SILVER: 1000,
  GOLD: 5000,
  PLATINUM: 15000,
  DIAMOND: 50000,
} as const;

