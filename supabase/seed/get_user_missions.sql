-- ═══════════════════════════════════════════════════════════════════════════
-- get_user_missions: Kullanıcının görev ve milestone durumunu getir
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION get_user_missions(
  p_user_id UUID,
  p_type TEXT -- 'test' veya 'lesson'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total_count INTEGER;
  v_result JSONB;
  v_groups JSONB;
  v_repeatable_count INTEGER;
BEGIN
  -- Kullanıcının toplam sayısını al
  IF p_type = 'test' THEN
    SELECT COALESCE(total_tests_completed, 0) INTO v_total_count
    FROM user_stats WHERE user_id = p_user_id;
  ELSE
    SELECT COALESCE(total_lessons_completed, 0) INTO v_total_count
    FROM user_stats WHERE user_id = p_user_id;
  END IF;

  v_total_count := COALESCE(v_total_count, 0);

  -- Tekrarlanan grup için incremental count al
  SELECT COALESCE(urp.incremental_count, 0) INTO v_repeatable_count
  FROM user_repeatable_progress urp
  JOIN mission_groups mg ON mg.id = urp.mission_group_id
  WHERE urp.user_id = p_user_id AND mg.type = p_type AND mg.is_repeatable = true;

  v_repeatable_count := COALESCE(v_repeatable_count, 0);

  -- Tüm grupları ve milestone'ları getir
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', mg.id,
      'name', mg.name,
      'order_number', mg.order_number,
      'is_repeatable', mg.is_repeatable,
      'current_count', CASE 
        WHEN mg.is_repeatable THEN v_repeatable_count
        ELSE v_total_count
      END,
      'milestones', (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', m.id,
            'target_count', m.target_count,
            'xp_reward', m.xp_reward,
            'title_reward', m.title_reward,
            'order_in_group', m.order_in_group,
            'is_reached', CASE
              WHEN mg.is_repeatable THEN v_repeatable_count >= m.target_count
              ELSE v_total_count >= m.target_count
            END,
            'is_claimed', EXISTS(
              SELECT 1 FROM user_milestone_claims umc 
              WHERE umc.user_id = p_user_id AND umc.milestone_id = m.id
            )
          )
          ORDER BY m.order_in_group
        )
        FROM milestones m
        WHERE m.mission_group_id = mg.id
      )
    )
    ORDER BY mg.order_number
  ) INTO v_groups
  FROM mission_groups mg
  WHERE mg.type = p_type;

  RETURN jsonb_build_object(
    'success', true,
    'total_count', v_total_count,
    'repeatable_count', v_repeatable_count,
    'groups', COALESCE(v_groups, '[]'::jsonb)
  );

EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'error', SQLERRM
  );
END;
$$;
