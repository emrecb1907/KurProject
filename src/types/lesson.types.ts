import { GameCategory } from './game.types';

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  category: GameCategory;
  difficulty_level: number;
  order_index: number;
  is_active: boolean;
  unlock_level: number;
  xp_reward: number;
  icon_url?: string;
  created_at: string;
  updated_at: string;
}

export interface LessonWithProgress extends Lesson {
  progress?: {
    is_completed: boolean;
    is_mastered: boolean;
    completion_rate: number;
  };
}

