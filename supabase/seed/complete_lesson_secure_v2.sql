-- ═══════════════════════════════════════════════════════════════════════════
-- complete_lesson_secure: Güncelleme v2 (Mission System Eklendi)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION complete_lesson_secure(
  p_user_id UUID,
  p_lesson_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_is_first_time BOOLEAN;
BEGIN
  -- 1. Check if first time completion
  SELECT NOT EXISTS (
    SELECT 1 FROM user_lessons
    WHERE user_id = p_user_id AND lesson_id = p_lesson_id AND is_completed = true
  ) INTO v_is_first_time;
  
  -- 2. Mark as completed (only if first time)
  IF v_is_first_time THEN
    INSERT INTO user_lessons (user_id, lesson_id, is_completed, completed_at)
    VALUES (p_user_id, p_lesson_id, true, now())
    ON CONFLICT (user_id, lesson_id) 
    DO UPDATE SET is_completed = true, completed_at = now();
  END IF;
  
  -- 3. ALWAYS increment lesson count (for daily tasks)
  UPDATE user_stats
  SET total_lessons_completed = COALESCE(total_lessons_completed, 0) + 1
  WHERE user_id = p_user_id;

  -- ══════════════════════════════════════════════════════════
  -- 🎯 TEKRARLANAN GÖREV SAYACI (Mission System)
  -- Sadece tüm non-repeatable görevler tamamlandıysa sayacı artır
  -- ══════════════════════════════════════════════════════════
  
  IF (
    SELECT COUNT(*) = SUM(CASE WHEN umc.milestone_id IS NOT NULL THEN 1 ELSE 0 END)
    FROM milestones m
    JOIN mission_groups mg ON m.mission_group_id = mg.id
    LEFT JOIN user_milestone_claims umc ON umc.milestone_id = m.id AND umc.user_id = p_user_id
    WHERE mg.type = 'lesson' AND mg.is_repeatable = false
  ) THEN
    INSERT INTO user_repeatable_progress (user_id, mission_group_id, incremental_count)
    SELECT p_user_id, id, 1
    FROM mission_groups
    WHERE type = 'lesson' AND is_repeatable = true
    ON CONFLICT (user_id, mission_group_id)
    DO UPDATE SET incremental_count = user_repeatable_progress.incremental_count + 1;
  END IF;

  RETURN jsonb_build_object(
    'success', true, 
    'xp_awarded', 0,
    'is_first_time', v_is_first_time
  );
END;
$$;
