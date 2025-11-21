-- Add stats columns to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS total_lessons_completed INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_questions_solved INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_correct_answers INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_wrong_answers INTEGER DEFAULT 0;

-- Function to atomically increment user stats
CREATE OR REPLACE FUNCTION increment_user_stats(
  p_user_id UUID,
  p_lessons_completed INTEGER DEFAULT 0,
  p_questions_solved INTEGER DEFAULT 0,
  p_correct_answers INTEGER DEFAULT 0,
  p_wrong_answers INTEGER DEFAULT 0
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.users
  SET
    total_lessons_completed = COALESCE(total_lessons_completed, 0) + p_lessons_completed,
    total_questions_solved = COALESCE(total_questions_solved, 0) + p_questions_solved,
    total_correct_answers = COALESCE(total_correct_answers, 0) + p_correct_answers,
    total_wrong_answers = COALESCE(total_wrong_answers, 0) + p_wrong_answers,
    updated_at = NOW()
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
