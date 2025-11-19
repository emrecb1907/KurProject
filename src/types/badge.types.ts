export type BadgeType = 'achievement' | 'milestone' | 'streak' | 'special';

export type RequirementType = 
  | 'lessons_completed'
  | 'questions_correct'
  | 'streak_days'
  | 'level_reached'
  | 'xp_earned'
  | 'perfect_scores';

export interface Badge {
  id: string;
  name: string;
  description?: string;
  badge_type: BadgeType;
  icon_url?: string;
  requirement_type: RequirementType;
  requirement_value: number;
  is_active: boolean;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  progress_percentage: number;
  is_claimed: boolean;
}

export interface BadgeWithProgress extends Badge {
  user_progress?: {
    progress_percentage: number;
    is_claimed: boolean;
    earned_at?: string;
  };
}

