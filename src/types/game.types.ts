export type QuestionType = 'audio_match' | 'word_match' | 'fill_blank' | 'multiple_choice';

export type GameCategory = 'letters' | 'vocabulary' | 'verses' | 'prayers' | 'quick_quiz';

export interface GameSession {
  id: string;
  user_id: string;
  lesson_id: string;
  category: GameCategory;
  total_questions: number;
  correct_answers: number;
  incorrect_answers: number;
  total_xp_earned: number;
  lives_used: number;
  completed_at?: string;
  started_at: string;
}

export interface QuestionResult {
  question_id: string;
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
  time_taken_seconds: number;
  xp_earned: number;
}

export interface GameState {
  currentQuestion: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  totalXP: number;
  isComplete: boolean;
  results: QuestionResult[];
}

// New types for generic game screen
export interface GameQuestion {
  id: string;
  question: string;
  questionLatin?: string; // For verses
  correctAnswer: string;
  correctAnswerLatin?: string; // For verses
  options: string[];
  optionsLatin?: string[]; // For verses
  audioFileId?: number; // For letters game - audio file number (1-29)
}

export type GameType = 'vocabulary' | 'letters' | 'verses' | 'quiz';
