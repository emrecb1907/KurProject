-- QuranLearn Database - Functions and Triggers
-- Created: 2024
-- Description: Database functions, triggers, and RLS policies

-- ==================== FUNCTIONS ====================

-- Function to calculate required XP for a specific level
-- Formula: required_xp = round(10 * (level ** 1.4))
-- Example: Level 1 = 10 XP, Level 10 = 251 XP, Level 50 = 3,311 XP
CREATE OR REPLACE FUNCTION calculate_required_xp(target_level INTEGER)
RETURNS INTEGER AS $$
BEGIN
  IF target_level < 1 THEN
    RETURN 0;
  END IF;
  RETURN ROUND(10 * POWER(target_level, 1.4))::INTEGER;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to calculate user level from total XP
-- Uses the formula: required_xp = round(10 * (level ** 1.4))
-- Returns the highest level the user has reached (minimum level 1)
CREATE OR REPLACE FUNCTION calculate_user_level(xp INTEGER)
RETURNS INTEGER AS $$
DECLARE
  current_level INTEGER := 1;
  required_xp INTEGER;
  cumulative_xp INTEGER := 0;
BEGIN
  -- Start from level 1, iterate until we find the current level
  LOOP
    -- Calculate XP required for next level
    required_xp := calculate_required_xp(current_level);
    
    -- Check if user has enough XP for next level
    IF cumulative_xp + required_xp > xp THEN
      EXIT;
    END IF;
    
    -- Add to cumulative and increment level
    cumulative_xp := cumulative_xp + required_xp;
    current_level := current_level + 1;
    
    -- Safety check to prevent infinite loops (max level 10000)
    IF current_level > 10000 THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN current_level;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to get XP progress for current level
-- Returns: current_level, current_level_xp, required_xp, progress_percentage
-- This is useful for displaying progress bars
CREATE OR REPLACE FUNCTION get_xp_progress(user_xp INTEGER)
RETURNS TABLE(
  current_level INTEGER,
  current_level_xp INTEGER,
  required_xp INTEGER,
  progress_percentage NUMERIC,
  total_xp_for_current_level INTEGER,
  xp_to_next_level INTEGER
) AS $$
DECLARE
  level INTEGER := 1;
  cumulative_xp INTEGER := 0;
  level_xp INTEGER;
  req_xp INTEGER;
BEGIN
  -- Calculate current level
  level := calculate_user_level(user_xp);
  
  -- Calculate cumulative XP up to current level (start of current level)
  FOR i IN 1..(level - 1) LOOP
    cumulative_xp := cumulative_xp + calculate_required_xp(i);
  END LOOP;
  
  -- Calculate XP within current level
  level_xp := user_xp - cumulative_xp;
  
  -- Calculate required XP for current level to reach next level
  req_xp := calculate_required_xp(level);
  
  RETURN QUERY SELECT 
    level,
    level_xp,
    req_xp,
    ROUND((level_xp::NUMERIC / req_xp::NUMERIC) * 100, 2),
    cumulative_xp,
    req_xp - level_xp;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to update leaderboard ranks
CREATE OR REPLACE FUNCTION update_leaderboard_ranks()
RETURNS VOID AS $$
BEGIN
  UPDATE leaderboard
  SET rank = subquery.new_rank
  FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY league ORDER BY total_score DESC) as new_rank
    FROM leaderboard
  ) AS subquery
  WHERE leaderboard.id = subquery.id;
END;
$$ LANGUAGE plpgsql;

-- Function to update user streak
CREATE OR REPLACE FUNCTION update_user_streak(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_last_activity DATE;
  v_current_streak INTEGER;
BEGIN
  -- Get current streak data
  SELECT last_activity_date, current_streak 
  INTO v_last_activity, v_current_streak
  FROM user_streaks 
  WHERE user_id = p_user_id;
  
  -- If no record exists, create one
  IF NOT FOUND THEN
    INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_activity_date)
    VALUES (p_user_id, 1, 1, CURRENT_DATE);
    RETURN;
  END IF;
  
  -- If activity is today, don't update
  IF v_last_activity = CURRENT_DATE THEN
    RETURN;
  -- If activity was yesterday, increment streak
  ELSIF v_last_activity = CURRENT_DATE - INTERVAL '1 day' THEN
    UPDATE user_streaks
    SET current_streak = current_streak + 1,
        longest_streak = GREATEST(longest_streak, current_streak + 1),
        last_activity_date = CURRENT_DATE,
        updated_at = NOW()
    WHERE user_id = p_user_id;
  -- Otherwise, streak is broken
  ELSE
    UPDATE user_streaks
    SET current_streak = 1,
        last_activity_date = CURRENT_DATE,
        updated_at = NOW()
    WHERE user_id = p_user_id;
  END IF;
  
  -- Update user's streak_count
  UPDATE users
  SET streak_count = (SELECT current_streak FROM user_streaks WHERE user_id = p_user_id)
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to check if lesson is unlocked for user
CREATE OR REPLACE FUNCTION is_lesson_unlocked(p_user_id UUID, p_lesson_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_user_level INTEGER;
  v_required_level INTEGER;
BEGIN
  -- Get user's current level
  SELECT current_level INTO v_user_level
  FROM users
  WHERE id = p_user_id;
  
  -- Get lesson's required level
  SELECT unlock_level INTO v_required_level
  FROM lessons
  WHERE id = p_lesson_id;
  
  -- Check if unlocked
  RETURN v_user_level >= v_required_level;
END;
$$ LANGUAGE plpgsql;

-- Function to award badge to user
CREATE OR REPLACE FUNCTION check_and_award_badges(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  badge_record RECORD;
  user_data RECORD;
  meets_requirement BOOLEAN;
BEGIN
  -- Get user data
  SELECT * INTO user_data FROM users WHERE id = p_user_id;
  
  -- Loop through all active badges
  FOR badge_record IN 
    SELECT * FROM badges WHERE is_active = TRUE
  LOOP
    -- Check if user already has this badge
    IF EXISTS (
      SELECT 1 FROM user_badges 
      WHERE user_id = p_user_id AND badge_id = badge_record.id
    ) THEN
      CONTINUE;
    END IF;
    
    -- Check requirement
    meets_requirement := FALSE;
    
    CASE badge_record.requirement_type
      WHEN 'lessons_completed' THEN
        SELECT COUNT(*) >= badge_record.requirement_value INTO meets_requirement
        FROM user_progress
        WHERE user_id = p_user_id AND is_completed = TRUE;
        
      WHEN 'questions_correct' THEN
        SELECT COUNT(*) >= badge_record.requirement_value INTO meets_requirement
        FROM user_answers
        WHERE user_id = p_user_id AND is_correct = TRUE;
        
      WHEN 'streak_days' THEN
        SELECT current_streak >= badge_record.requirement_value INTO meets_requirement
        FROM user_streaks
        WHERE user_id = p_user_id;
        
      WHEN 'level_reached' THEN
        meets_requirement := user_data.current_level >= badge_record.requirement_value;
        
      WHEN 'xp_earned' THEN
        meets_requirement := user_data.total_xp >= badge_record.requirement_value;
        
      ELSE
        meets_requirement := FALSE;
    END CASE;
    
    -- Award badge if requirements met
    IF meets_requirement THEN
      INSERT INTO user_badges (user_id, badge_id, progress_percentage, is_claimed)
      VALUES (p_user_id, badge_record.id, 100.00, FALSE);
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ==================== TRIGGERS ====================

-- Trigger to create user_streaks record when user is created
CREATE OR REPLACE FUNCTION create_user_streak()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_activity_date)
  VALUES (NEW.id, 0, 0, CURRENT_DATE);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_user_streak
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_streak();

-- Trigger to automatically update user level when XP changes
CREATE OR REPLACE FUNCTION update_user_level()
RETURNS TRIGGER AS $$
BEGIN
  NEW.current_level = calculate_user_level(NEW.total_xp);
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_level
  BEFORE UPDATE ON users
  FOR EACH ROW
  WHEN (OLD.total_xp IS DISTINCT FROM NEW.total_xp)
  EXECUTE FUNCTION update_user_level();

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_questions_updated_at
  BEFORE UPDATE ON questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_user_streaks_updated_at
  BEFORE UPDATE ON user_streaks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ==================== ROW LEVEL SECURITY ====================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_rewards ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id OR is_anonymous = true);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id OR is_anonymous = true);

-- User progress policies
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- User answers policies
CREATE POLICY "Users can view own answers" ON user_answers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own answers" ON user_answers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User badges policies
CREATE POLICY "Users can view own badges" ON user_badges
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own badges" ON user_badges
  FOR UPDATE USING (auth.uid() = user_id);

-- User streaks policies
CREATE POLICY "Users can view own streaks" ON user_streaks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own streaks" ON user_streaks
  FOR UPDATE USING (auth.uid() = user_id);

-- Ad rewards policies
CREATE POLICY "Users can view own ad rewards" ON ad_rewards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ad rewards" ON ad_rewards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User daily challenges policies
CREATE POLICY "Users can view own challenges" ON user_daily_challenges
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own challenges" ON user_daily_challenges
  FOR UPDATE USING (auth.uid() = user_id);

-- Public read policies for reference data
CREATE POLICY "Lessons are viewable by everyone" ON lessons
  FOR SELECT USING (is_active = true);

CREATE POLICY "Questions are viewable by everyone" ON questions
  FOR SELECT USING (is_active = true);

CREATE POLICY "Badges are viewable by everyone" ON badges
  FOR SELECT USING (is_active = true);

CREATE POLICY "Leaderboard is viewable by everyone" ON leaderboard
  FOR SELECT USING (true);

CREATE POLICY "Daily challenges are viewable by everyone" ON daily_challenges
  FOR SELECT USING (is_active = true);

-- ==================== COMMENTS ====================
COMMENT ON FUNCTION calculate_required_xp IS 'Calculates XP required for a specific level using formula: round(10 * level^1.4)';
COMMENT ON FUNCTION calculate_user_level IS 'Calculates user level based on total XP (no level cap)';
COMMENT ON FUNCTION get_xp_progress IS 'Returns detailed XP progress info for current level';
COMMENT ON FUNCTION update_leaderboard_ranks IS 'Updates rank for all users in leaderboard';
COMMENT ON FUNCTION update_user_streak IS 'Updates user daily streak';
COMMENT ON FUNCTION is_lesson_unlocked IS 'Checks if a lesson is unlocked for a user';
COMMENT ON FUNCTION check_and_award_badges IS 'Checks and awards badges to user based on achievements';

