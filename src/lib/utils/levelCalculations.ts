/**
 * Level Calculation Utilities
 * Formula: XP_required(level) = round( (10 * level) + (0.4 * level^2) / 10 ) * 10
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
 * Formula: XP_required(level) = round( (10 * level) + (0.4 * level^2) / 10 ) * 10
 * @param level - Target level (must be >= 1)
 * @returns Required XP to complete that level
 */
export function calculateRequiredXP(level: number): number {
  if (level < 1) return 0;
  return Math.round((10 * level + 0.4 * Math.pow(level, 2)) / 10) * 10;
}

/**
 * Calculate user's current level based on total XP
 * @param totalXP - User's total XP
 * @returns Current level (minimum 1)
 */
export function calculateUserLevel(totalXP: number): number {
  let currentLevel = 1;
  let cumulativeXP = 0;

  // Safety limit to prevent infinite loops (max level 10000)
  const MAX_LEVEL = 10000;

  while (currentLevel <= MAX_LEVEL) {
    const requiredXP = calculateRequiredXP(currentLevel);

    // Check if user has enough XP for next level
    if (cumulativeXP + requiredXP > totalXP) {
      break;
    }

    cumulativeXP += requiredXP;
    currentLevel++;
  }

  return currentLevel;
}

/**
 * Get detailed XP progress information for UI
 * @param totalXP - User's total XP
 * @returns XPProgress object with all progression details
 */
export function getXPProgress(totalXP: number): XPProgress {
  // Calculate current level
  const currentLevel = calculateUserLevel(totalXP);

  // Calculate cumulative XP up to current level (start of current level)
  let cumulativeXP = 0;
  for (let i = 1; i < currentLevel; i++) {
    cumulativeXP += calculateRequiredXP(i);
  }

  // Calculate XP within current level
  const currentLevelXP = totalXP - cumulativeXP;

  // Calculate required XP for current level to reach next level
  const requiredXP = calculateRequiredXP(currentLevel);

  // Calculate progress percentage
  const progressPercentage = Math.round((currentLevelXP / requiredXP) * 100);

  // Calculate XP needed to reach next level
  const xpToNextLevel = requiredXP - currentLevelXP;

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
 * @param targetLevel - Target level
 * @returns Total XP needed from level 1 to reach that level
 */
export function getCumulativeXP(targetLevel: number): number {
  let cumulativeXP = 0;
  for (let i = 1; i < targetLevel; i++) {
    cumulativeXP += calculateRequiredXP(i);
  }
  return cumulativeXP;
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

