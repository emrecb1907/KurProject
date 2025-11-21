import { useState } from 'react';
import { useStore } from '@store';
import { database } from '@lib/supabase/database';
import { Question } from '@types/question.types';
import { QuestionResult } from '@types/game.types';
import { XP_REWARDS } from '@constants/xp';

export function useGameSession() {
  const { gameState, startGame, submitAnswer, endGame, resetGame } = useStore();
  const { user } = useStore();
  const [isAnswering, setIsAnswering] = useState(false);

  // Start a new game session
  async function startGameSession(lessonId: string) {
    if (!user) return { error: 'User not found' };

    // Fetch questions for the lesson
    const { data: questions, error } = await database.questions.getByLessonId(lessonId);

    if (error || !questions || questions.length === 0) {
      return { error: 'Failed to load questions' };
    }

    // Shuffle questions for variety
    const shuffledQuestions = shuffleArray([...questions]);

    startGame(shuffledQuestions);

    return { error: null };
  }

  // Submit an answer
  async function answerQuestion(
    questionId: string,
    userAnswer: string,
    correctAnswer: string,
    timeTaken: number
  ) {
    if (!user || !gameState) return;

    setIsAnswering(true);

    try {
      const isCorrect = userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();

      // Calculate XP earned
      let xpEarned = 0;
      if (isCorrect) {
        xpEarned = XP_REWARDS.CORRECT_ANSWER;

        // Bonus for fast answers (under 5 seconds)
        if (timeTaken < 5) {
          xpEarned += 5;
        }
      }

      const result: QuestionResult = {
        question_id: questionId,
        user_answer: userAnswer,
        correct_answer: correctAnswer,
        is_correct: isCorrect,
        time_taken_seconds: timeTaken,
        xp_earned: xpEarned,
      };

      // Save answer to database
      await database.answers.create({
        user_id: user.id,
        question_id: questionId,
        lesson_id: gameState.questions?.[0]?.lesson_id || '',
        user_answer: userAnswer,
        is_correct: isCorrect,
        time_taken_seconds: timeTaken,
        xp_earned: xpEarned,
      });

      // Update game state
      submitAnswer(result);

      return { result, error: null };
    } catch (error) {
      return { result: null, error: error as Error };
    } finally {
      setIsAnswering(false);
    }
  }

  // Complete the game session
  async function completeGame(lessonId: string) {
    console.log('🏁 completeGame called for lesson:', lessonId);

    if (!user) {
      console.error('❌ completeGame: User is missing');
      return;
    }
    if (!gameState) {
      console.error('❌ completeGame: GameState is missing');
      return;
    }

    try {
      console.log('📝 Calling updateCompletion with:', {
        userId: user.id,
        lessonId,
        correct: gameState.correctAnswers,
        total: gameState.totalQuestions
      });

      // Update user progress
      const { error: completionError } = await database.progress.updateCompletion(
        user.id,
        lessonId,
        gameState.correctAnswers,
        gameState.totalQuestions
      );

      if (completionError) {
        console.error('❌ updateCompletion failed:', completionError);
      } else {
        console.log('✅ updateCompletion success');
      }

      // Update user XP
      if (gameState.totalXP > 0) {
        await database.users.updateXP(user.id, gameState.totalXP);
      }

      // Check for perfect score bonus
      if (gameState.correctAnswers === gameState.totalQuestions) {
        await database.users.updateXP(user.id, XP_REWARDS.LESSON_COMPLETION);
      }

      // Update streak
      await database.streaks.updateStreak(user.id);

      endGame();

      return {
        correctAnswers: gameState.correctAnswers,
        totalQuestions: gameState.totalQuestions,
        totalXP: gameState.totalXP,
        results: gameState.results,
        error: null,
      };
    } catch (error) {
      return { error: error as Error };
    }
  }

  // Abandon game (lose life)
  function abandonGame() {
    endGame();
    resetGame();
  }

  return {
    gameState,
    isAnswering,
    startGameSession,
    answerQuestion,
    completeGame,
    abandonGame,
    resetGame,
  };
}

// Utility function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

