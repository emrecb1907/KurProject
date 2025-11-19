-- QuranLearn Database Schema - Initial Migration
-- Created: 2024
-- Description: Core tables for the Quran learning app

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================== USERS TABLE ====================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id TEXT UNIQUE NOT NULL,
  username TEXT,
  email TEXT UNIQUE,
  avatar_url TEXT,
  total_xp INTEGER DEFAULT 0 CHECK (total_xp >= 0),
  current_level INTEGER DEFAULT 1 CHECK (current_level >= 1),
  total_score INTEGER DEFAULT 0 CHECK (total_score >= 0),
  current_lives INTEGER DEFAULT 5 CHECK (current_lives >= 0),
  max_lives INTEGER DEFAULT 5 CHECK (max_lives >= 1),
  streak_count INTEGER DEFAULT 0 CHECK (streak_count >= 0),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_anonymous BOOLEAN DEFAULT TRUE,
  league TEXT DEFAULT 'Bronze' CHECK (league IN ('Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'))
);

-- Users indexes
CREATE INDEX idx_users_device_id ON users(device_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_league ON users(league);
CREATE INDEX idx_users_total_score ON users(total_score DESC);
CREATE INDEX idx_users_last_active ON users(last_active DESC);

-- ==================== LESSONS TABLE ====================
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('letters', 'vocabulary', 'verses', 'prayers', 'quick_quiz')),
  difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 10),
  order_index INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  unlock_level INTEGER DEFAULT 1 CHECK (unlock_level >= 1),
  xp_reward INTEGER DEFAULT 50 CHECK (xp_reward >= 0),
  icon_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lessons indexes
CREATE INDEX idx_lessons_category ON lessons(category);
CREATE INDEX idx_lessons_order ON lessons(order_index);
CREATE INDEX idx_lessons_unlock_level ON lessons(unlock_level);
CREATE INDEX idx_lessons_active ON lessons(is_active) WHERE is_active = TRUE;

-- ==================== QUESTIONS TABLE ====================
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  question_type TEXT NOT NULL CHECK (question_type IN ('audio_match', 'word_match', 'fill_blank', 'multiple_choice')),
  question_text TEXT,
  question_text_latin TEXT,
  audio_url TEXT,
  correct_answer TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of options
  explanation TEXT,
  difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
  xp_value INTEGER DEFAULT 10 CHECK (xp_value >= 0),
  time_limit_seconds INTEGER DEFAULT 10 CHECK (time_limit_seconds > 0),
  order_index INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Questions indexes
CREATE INDEX idx_questions_lesson_id ON questions(lesson_id);
CREATE INDEX idx_questions_type ON questions(question_type);
CREATE INDEX idx_questions_order ON questions(order_index);
CREATE INDEX idx_questions_active ON questions(is_active) WHERE is_active = TRUE;

-- ==================== USER_PROGRESS TABLE ====================
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT FALSE,
  is_mastered BOOLEAN DEFAULT FALSE,
  completion_rate DECIMAL(5,2) DEFAULT 0.00 CHECK (completion_rate BETWEEN 0 AND 100),
  correct_answers INTEGER DEFAULT 0 CHECK (correct_answers >= 0),
  total_attempts INTEGER DEFAULT 0 CHECK (total_attempts >= 0),
  last_attempted TIMESTAMP WITH TIME ZONE,
  mastered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- User progress indexes
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_lesson_id ON user_progress(lesson_id);
CREATE INDEX idx_user_progress_mastered ON user_progress(is_mastered) WHERE is_mastered = TRUE;
CREATE INDEX idx_user_progress_completed ON user_progress(is_completed) WHERE is_completed = TRUE;

-- ==================== USER_ANSWERS TABLE ====================
CREATE TABLE user_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  user_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_taken_seconds INTEGER CHECK (time_taken_seconds >= 0),
  xp_earned INTEGER DEFAULT 0 CHECK (xp_earned >= 0),
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User answers indexes
CREATE INDEX idx_user_answers_user_id ON user_answers(user_id);
CREATE INDEX idx_user_answers_question_id ON user_answers(question_id);
CREATE INDEX idx_user_answers_lesson_id ON user_answers(lesson_id);
CREATE INDEX idx_user_answers_date ON user_answers(answered_at DESC);

-- ==================== BADGES TABLE ====================
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  badge_type TEXT NOT NULL CHECK (badge_type IN ('achievement', 'milestone', 'streak', 'special')),
  icon_url TEXT,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL CHECK (requirement_value > 0),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Badges indexes
CREATE INDEX idx_badges_type ON badges(badge_type);
CREATE INDEX idx_badges_active ON badges(is_active) WHERE is_active = TRUE;

-- ==================== USER_BADGES TABLE ====================
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress_percentage DECIMAL(5,2) DEFAULT 0.00 CHECK (progress_percentage BETWEEN 0 AND 100),
  is_claimed BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, badge_id)
);

-- User badges indexes
CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX idx_user_badges_earned_at ON user_badges(earned_at DESC);

-- ==================== LEADERBOARD TABLE ====================
CREATE TABLE leaderboard (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  username TEXT NOT NULL,
  total_score INTEGER DEFAULT 0 CHECK (total_score >= 0),
  current_level INTEGER DEFAULT 1 CHECK (current_level >= 1),
  league TEXT DEFAULT 'Bronze' CHECK (league IN ('Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond')),
  rank INTEGER,
  weekly_score INTEGER DEFAULT 0 CHECK (weekly_score >= 0),
  monthly_score INTEGER DEFAULT 0 CHECK (monthly_score >= 0),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leaderboard indexes
CREATE INDEX idx_leaderboard_league ON leaderboard(league);
CREATE INDEX idx_leaderboard_total_score ON leaderboard(total_score DESC);
CREATE INDEX idx_leaderboard_weekly ON leaderboard(weekly_score DESC);
CREATE INDEX idx_leaderboard_monthly ON leaderboard(monthly_score DESC);
CREATE INDEX idx_leaderboard_rank ON leaderboard(rank);

-- ==================== USER_STREAKS TABLE ====================
CREATE TABLE user_streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  current_streak INTEGER DEFAULT 0 CHECK (current_streak >= 0),
  longest_streak INTEGER DEFAULT 0 CHECK (longest_streak >= 0),
  last_activity_date DATE DEFAULT CURRENT_DATE,
  streak_freeze_count INTEGER DEFAULT 0 CHECK (streak_freeze_count >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User streaks indexes
CREATE INDEX idx_user_streaks_user_id ON user_streaks(user_id);
CREATE INDEX idx_user_streaks_current ON user_streaks(current_streak DESC);
CREATE INDEX idx_user_streaks_longest ON user_streaks(longest_streak DESC);

-- ==================== AD_REWARDS TABLE ====================
CREATE TABLE ad_rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reward_type TEXT NOT NULL CHECK (reward_type IN ('life', 'xp', 'special')),
  reward_value INTEGER DEFAULT 1 CHECK (reward_value > 0),
  ad_slot INTEGER CHECK (ad_slot BETWEEN 1 AND 3),
  claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_expired BOOLEAN DEFAULT FALSE
);

-- Ad rewards indexes
CREATE INDEX idx_ad_rewards_user_id ON ad_rewards(user_id);
CREATE INDEX idx_ad_rewards_claimed_at ON ad_rewards(claimed_at DESC);
CREATE INDEX idx_ad_rewards_expires_at ON ad_rewards(expires_at);
CREATE INDEX idx_ad_rewards_expired ON ad_rewards(is_expired) WHERE is_expired = FALSE;

-- ==================== DAILY_CHALLENGES TABLE ====================
CREATE TABLE daily_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  challenge_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL CHECK (requirement_value > 0),
  xp_reward INTEGER DEFAULT 100 CHECK (xp_reward >= 0),
  life_reward INTEGER DEFAULT 0 CHECK (life_reward >= 0),
  is_active BOOLEAN DEFAULT TRUE,
  valid_from DATE NOT NULL,
  valid_to DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (valid_to >= valid_from)
);

-- Daily challenges indexes
CREATE INDEX idx_daily_challenges_active ON daily_challenges(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_daily_challenges_dates ON daily_challenges(valid_from, valid_to);

-- ==================== USER_DAILY_CHALLENGES TABLE ====================
CREATE TABLE user_daily_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES daily_challenges(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0),
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, challenge_id)
);

-- User daily challenges indexes
CREATE INDEX idx_user_daily_challenges_user_id ON user_daily_challenges(user_id);
CREATE INDEX idx_user_daily_challenges_completed ON user_daily_challenges(is_completed);

-- ==================== COMMENTS ====================
COMMENT ON TABLE users IS 'Main users table with anonymous and registered users';
COMMENT ON TABLE lessons IS 'Lesson categories and metadata';
COMMENT ON TABLE questions IS 'Questions for each lesson';
COMMENT ON TABLE user_progress IS 'User progress tracking for each lesson';
COMMENT ON TABLE leaderboard IS 'Global and league-based leaderboards';
COMMENT ON TABLE user_streaks IS 'Daily streak tracking';

