import { useStore } from '@store';
import { database } from '@lib/supabase/database';
import { calculateLevel, calculateXPProgress } from '@constants/xp';

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
    const newLevel = calculateLevel(newTotalXP);
    const leveledUp = newLevel > currentLevel;

    // Update local state
    addXP(xp);
    setCurrentLevel(newLevel);

    // Update database
    await database.users.updateXP(user.id, xp);

    // Update leaderboard
    if (!user.is_anonymous) {
      await database.leaderboard.upsert(
        user.id,
        user.username || 'Anonim',
        newTotalXP,
        newLevel,
        user.league
      );
    }

    return {
      leveledUp,
      newLevel,
      xpProgress: calculateXPProgress(newTotalXP),
    };
  }

  // Use a life
  async function useLife() {
    if (!user || currentLives <= 0) return false;

    removeLives(1);
    await database.users.updateLives(user.id, -1);

    return true;
  }

  // Add lives
  async function gainLives(amount: number) {
    if (!user) return;

    addLives(amount);
    await database.users.updateLives(user.id, amount);
  }

  // Load user progress
  async function loadProgress() {
    if (!user) return;

    const { data } = await database.progress.getByUserId(user.id);
    if (data) {
      setProgress(data);
    }
  }

  // Update lesson progress
  async function updateLessonProgress(
    lessonId: string,
    correctAnswers: number,
    totalQuestions: number
  ) {
    if (!user) return;

    const { data } = await database.progress.updateCompletion(
      user.id,
      lessonId,
      correctAnswers,
      totalQuestions
    );

    if (data) {
      // Reload all progress
      await loadProgress();
    }

    return data;
  }

  // Get XP progress to next level
  function getXPProgress() {
    return calculateXPProgress(totalXP);
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
    useLife,
    gainLives,
    loadProgress,
    updateLessonProgress,
    getXPProgress,
    isLessonUnlocked,
    getLessonCompletion,
    isLessonCompleted,
    isLessonMastered,
  };
}

