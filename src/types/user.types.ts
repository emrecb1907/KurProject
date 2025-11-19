export interface User {
  id: string;
  device_id: string;
  username?: string;
  email?: string;
  avatar_url?: string;
  total_xp: number;
  current_level: number;
  total_score: number;
  current_lives: number;
  max_lives: number;
  streak_count: number;
  last_active: string;
  created_at: string;
  updated_at: string;
  is_anonymous: boolean;
  league: League;
}

export type League = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';

export interface UserProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  is_completed: boolean;
  is_mastered: boolean;
  completion_rate: number;
  correct_answers: number;
  total_attempts: number;
  last_attempted?: string;
  mastered_at?: string;
  created_at: string;
  updated_at: string;
}

export interface UserStreak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
  streak_freeze_count: number;
  created_at: string;
  updated_at: string;
}

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  username: string;
  total_score: number;
  current_level: number;
  league: League;
  rank: number;
  weekly_score: number;
  monthly_score: number;
  last_updated: string;
}

