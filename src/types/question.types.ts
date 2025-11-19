import { QuestionType } from './game.types';

export interface Question {
  id: string;
  lesson_id: string;
  question_type: QuestionType;
  question_text?: string;
  question_text_latin?: string;
  audio_url?: string;
  correct_answer: string;
  options: string[];
  explanation?: string;
  difficulty_level: number;
  xp_value: number;
  time_limit_seconds: number;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserAnswer {
  id: string;
  user_id: string;
  question_id: string;
  lesson_id: string;
  user_answer: string;
  is_correct: boolean;
  time_taken_seconds: number;
  xp_earned: number;
  answered_at: string;
}

