import { useStore } from '@store';
import { database } from '@lib/supabase/database';
import { calculateUserLevel, getXPProgress } from '@/lib/utils/levelCalculations';

export function useUserData() {
  const {
    totalXP,
    currentLevel,
    totalScore,
    currentLives,
    maxLives,
    streak,
    progress,
    setTotalXP,
    addXP,
    setCurrentLevel,
    setTotalScore,
    setCurrentLives,
    addLives,
    removeLives,
    setStreak,
    setProgress,
  } = useStore();

  const { user } = useStore();

  // Earn XP and update level
  async function earnXP(xp: number) {
    if (!user) return;

    const newTotalXP = totalXP + xp;
    const newLevel = calculateUserLevel(newTotalXP);
    const leveledUp = newLevel > currentLevel;

    // Update local state
    addXP(xp);
    setCurrentLevel(newLevel);

    // Update database - ONLY if not anonymous
    if (!user.is_anonymous) {
      const { error } = await database.users.update(user.id, {
        total_xp: newTotalXP,
        total_score: newTotalXP,
        current_level: newLevel,
      });

      if (error) {
        console.error('❌ Failed to update XP in database:', error);
      }
    }

    return {
      leveledUp,
      newLevel,
      xpProgress: getXPProgress(newTotalXP),
    };
  }

  // Add lives
  async function gainLives(amount: number) {
    if (!user) return;

    addLives(amount);

    // Update database - ONLY if not anonymous
    if (!user.is_anonymous) {
      const { error } = await database.users.update(user.id, {
        current_lives: Math.min(currentLives + amount, maxLives)
      });

      if (error) {
        console.error('❌ Failed to update lives in database:', error);
      }
    }
  }

  // Get XP progress to next level
  function getXPProgressResult() {
    return getXPProgress(totalXP);
  }

  // Check if lesson is unlocked
  function isLessonUnlocked(requiredLevel: number): boolean {
    return currentLevel >= requiredLevel;
  }

  // Get completion rate for a lesson
  function getLessonCompletion(lessonId: string): number {
    const lessonProgress = progress.find((p) => p.lesson_id === lessonId);
    return lessonProgress?.completion_rate || 0;
  }

  // Check if lesson is completed
  function isLessonCompleted(lessonId: string): boolean {
    const lessonProgress = progress.find((p) => p.lesson_id === lessonId);
    return lessonProgress?.is_completed || false;
  }

  // Check if lesson is mastered
  function isLessonMastered(lessonId: string): boolean {
    const lessonProgress = progress.find((p) => p.lesson_id === lessonId);
    return lessonProgress?.is_mastered || false;
  }

  return {
    // State
    totalXP,
    currentLevel,
    totalScore,
    currentLives,
    maxLives,
    streak,
    progress,

    // Actions
    earnXP,
    gainLives,
    getXPProgress: getXPProgressResult,
    isLessonUnlocked,
    getLessonCompletion,
    isLessonCompleted,
    isLessonMastered,
  };
}
