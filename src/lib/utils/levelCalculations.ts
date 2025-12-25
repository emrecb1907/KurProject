/**
 * Level Calculation Utilities
 * Formula: Required XP = 10 * Level
 * 
 * Level 1 starts at 0 XP
 * No level cap - infinite progression
 */

export interface XPProgress {
  currentLevel: number;
  currentLevelXP: number;
  requiredXP: number;
  progressPercentage: number;
  totalXPForCurrentLevel: number;
  xpToNextLevel: number;
}

/**
 * Calculate required XP for a specific level
 * Formula: Required XP = 10 * Level
 * Example: Level 1 needs 10 XP, Level 2 needs 20 XP...
 */
export function calculateRequiredXP(level: number): number {
  if (level < 1) return 0;
  return 10 * level;
}

/**
 * Calculate user's current level based on total XP
 * Inverse Formula derived from Sum = 5 * n * (n-1)
 * n = (1 + sqrt(1 + 4 * (TotalXP / 5))) / 2
 */
export function calculateUserLevel(totalXP: number): number {
  if (totalXP <= 0) return 1;
  // Using quadratic formula solution for TotalXP = 5 * (L^2 - L)
  // L^2 - L - (TotalXP/5) = 0
  // L = (1 + sqrt(1 + 4*(TotalXP/5))) / 2
  const level = Math.floor((1 + Math.sqrt(1 + 4 * (totalXP / 5))) / 2);
  return Math.max(1, level);
}

/**
 * Get detailed XP progress information for UI
 */
export function getXPProgress(totalXP: number): XPProgress {
  const currentLevel = calculateUserLevel(totalXP);

  // Calculate cumulative XP required to REACH the START of this current level
  // Formula: Sum(10*i) for i=1 to level-1
  // Sum = 10 * (L-1)*L / 2 = 5 * L * (L-1)
  const cumulativeXP = 5 * currentLevel * (currentLevel - 1);

  // XP gained WITHIN this current level
  const currentLevelXP = Math.max(0, totalXP - cumulativeXP);

  // XP required to finish this current level
  const requiredXP = calculateRequiredXP(currentLevel);

  // Progress percentage
  const progressPercentage = Math.min(100, Math.round((currentLevelXP / requiredXP) * 100));

  // XP remaining for next level
  const xpToNextLevel = Math.max(0, requiredXP - currentLevelXP);

  return {
    currentLevel,
    currentLevelXP,
    requiredXP,
    progressPercentage,
    totalXPForCurrentLevel: cumulativeXP,
    xpToNextLevel,
  };
}

/**
 * Get cumulative XP needed to reach a specific level
 */
export function getCumulativeXP(targetLevel: number): number {
  // Sum of required XP up to targetLevel-1
  return 5 * targetLevel * (targetLevel - 1);
}

/**
 * Format XP number with thousands separator
 * @param xp - XP value
 * @returns Formatted string (e.g., "1,000")
 */
export function formatXP(xp: number): string {
  return xp.toLocaleString('tr-TR');
}

/**
 * Get level milestone info (useful for achievements/badges)
 * @param level - Level to check
 * @returns Whether this is a milestone level and milestone type
 */
export function getLevelMilestone(level: number): {
  isMilestone: boolean;
  type?: 'major' | 'minor';
  message?: string;
} {
  if (level % 100 === 0) {
    return {
      isMilestone: true,
      type: 'major',
      message: `Seviye ${level}! Efsane bir başarı! 🎉`
    };
  }

  if (level % 50 === 0) {
    return {
      isMilestone: true,
      type: 'major',
      message: `Seviye ${level}! Harika bir ilerleme! 🌟`
    };
  }

  if (level % 10 === 0) {
    return {
      isMilestone: true,
      type: 'minor',
      message: `Seviye ${level}! Devam et! 🔥`
    };
  }

  return { isMilestone: false };
}

// Example level progression for reference:
// Level 1: 0-10 XP (10 XP needed)
// Level 2: 10-37 XP (27 XP needed)
// Level 5: 70-141 XP (71 XP needed)
// Level 10: 280-531 XP (251 XP needed)
// Level 20: 1,519-2,318 XP (799 XP needed)
// Level 50: 18,232-21,543 XP (3,311 XP needed)
// Level 100: 100,000-110,000 XP (10,000 XP needed)

