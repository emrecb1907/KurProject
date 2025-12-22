import { StateCreator } from 'zustand';
import type { Question } from '@/types/question.types';
import type { GameState, QuestionResult } from '@/types/game.types';

export interface GameSlice {
  // State
  gameState: GameState | null;
  currentQuestion: Question | null;
  questions: Question[];
  isGameActive: boolean;

  // Actions
  startGame: (questions: Question[]) => void;
  setCurrentQuestion: (question: Question) => void;
  submitAnswer: (result: QuestionResult) => void;
  endGame: () => void;
  resetGame: () => void;
}

const initialGameState: GameState = {
  currentQuestion: 0,
  totalQuestions: 0,
  correctAnswers: 0,
  incorrectAnswers: 0,
  totalXP: 0,
  isComplete: false,
  results: [],
};

export const createGameSlice: StateCreator<GameSlice> = (set) => ({
  // Initial state
  gameState: null,
  currentQuestion: null,
  questions: [],
  isGameActive: false,

  // Actions
  startGame: (questions) => set({
    gameState: {
      ...initialGameState,
      totalQuestions: questions.length,
    },
    questions,
    currentQuestion: questions[0] || null,
    isGameActive: true,
  }),

  setCurrentQuestion: (question) => set({ currentQuestion: question }),

  submitAnswer: (result) => set((state) => {
    if (!state.gameState) return state;

    const newResults = [...state.gameState.results, result];
    const newCorrectAnswers = state.gameState.correctAnswers + (result.is_correct ? 1 : 0);
    const newIncorrectAnswers = state.gameState.incorrectAnswers + (result.is_correct ? 0 : 1);
    const newTotalXP = state.gameState.totalXP + result.xp_earned;
    const newCurrentQuestion = state.gameState.currentQuestion + 1;
    const isComplete = newCurrentQuestion >= state.gameState.totalQuestions;

    return {
      gameState: {
        ...state.gameState,
        currentQuestion: newCurrentQuestion,
        correctAnswers: newCorrectAnswers,
        incorrectAnswers: newIncorrectAnswers,
        totalXP: newTotalXP,
        isComplete,
        results: newResults,
      },
      currentQuestion: isComplete ? null : (state.questions[newCurrentQuestion] || null),
    };
  }),

  endGame: () => set((state) => ({
    gameState: state.gameState ? { ...state.gameState, isComplete: true } : null,
    isGameActive: false,
  })),

  resetGame: () => set({
    gameState: null,
    currentQuestion: null,
    questions: [],
    isGameActive: false,
  }),
});

