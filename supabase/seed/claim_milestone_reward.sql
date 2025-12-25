-- ═══════════════════════════════════════════════════════════════════════════
-- claim_milestone_reward: Milestone ödülünü talep et (v2 - Sequential Check)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION claim_milestone_reward(
  p_user_id UUID,
  p_milestone_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_milestone RECORD;
  v_group RECORD;
  v_total_count INTEGER;
  v_repeatable_count INTEGER;
  v_is_reached BOOLEAN;
  v_already_claimed BOOLEAN;
  v_is_last_milestone BOOLEAN;
  v_title_already_earned BOOLEAN;
  v_cycle_number INTEGER;
  v_previous_claimed BOOLEAN;
BEGIN
  -- Milestone bilgilerini al
  SELECT m.*, mg.type, mg.is_repeatable, mg.id as group_id
  INTO v_milestone
  FROM milestones m
  JOIN mission_groups mg ON mg.id = m.mission_group_id
  WHERE m.id = p_milestone_id;

  IF v_milestone IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'MILESTONE_NOT_FOUND');
  END IF;

  -- Daha önce claim edildi mi?
  SELECT EXISTS(
    SELECT 1 FROM user_milestone_claims 
    WHERE user_id = p_user_id AND milestone_id = p_milestone_id
  ) INTO v_already_claimed;

  IF v_already_claimed THEN
    RETURN jsonb_build_object('success', false, 'error', 'ALREADY_CLAIMED');
  END IF;

  -- ══════════════════════════════════════════════════════════
  -- 🔒 SIRALI CLAIM KONTROLÜ (Sequential Check)
  -- ══════════════════════════════════════════════════════════
  -- İlk milestone değilse, önceki milestone claim edilmiş olmalı
  IF v_milestone.order_in_group > 1 THEN
    SELECT EXISTS(
      SELECT 1 FROM user_milestone_claims umc
      JOIN milestones m ON m.id = umc.milestone_id
      WHERE umc.user_id = p_user_id 
        AND m.mission_group_id = v_milestone.group_id
        AND m.order_in_group = v_milestone.order_in_group - 1
    ) INTO v_previous_claimed;

    IF NOT v_previous_claimed THEN
      RETURN jsonb_build_object('success', false, 'error', 'PREVIOUS_NOT_CLAIMED');
    END IF;
  END IF;

  -- Kullanıcının sayısını al
  IF v_milestone.type = 'test' THEN
    SELECT COALESCE(total_tests_completed, 0) INTO v_total_count
    FROM user_stats WHERE user_id = p_user_id;
  ELSE
    SELECT COALESCE(total_lessons_completed, 0) INTO v_total_count
    FROM user_stats WHERE user_id = p_user_id;
  END IF;

  v_total_count := COALESCE(v_total_count, 0);

  -- Tekrarlanan grup için incremental count
  IF v_milestone.is_repeatable THEN
    SELECT COALESCE(incremental_count, 0), COALESCE(cycle_number, 1)
    INTO v_repeatable_count, v_cycle_number
    FROM user_repeatable_progress
    WHERE user_id = p_user_id AND mission_group_id = v_milestone.group_id;

    v_repeatable_count := COALESCE(v_repeatable_count, 0);
    v_cycle_number := COALESCE(v_cycle_number, 1);
    v_is_reached := v_repeatable_count >= v_milestone.target_count;
  ELSE
    v_is_reached := v_total_count >= v_milestone.target_count;
  END IF;

  IF NOT v_is_reached THEN
    RETURN jsonb_build_object('success', false, 'error', 'NOT_REACHED');
  END IF;

  -- XP ekle
  UPDATE user_stats
  SET total_score = total_score + v_milestone.xp_reward
  WHERE user_id = p_user_id;

  -- Claim kaydı oluştur
  INSERT INTO user_milestone_claims (user_id, milestone_id)
  VALUES (p_user_id, p_milestone_id);

  -- Son milestone mı kontrol et
  SELECT v_milestone.order_in_group = MAX(order_in_group)
  INTO v_is_last_milestone
  FROM milestones
  WHERE mission_group_id = v_milestone.group_id;

  -- Ünvan varsa ve daha önce kazanılmadıysa ekle
  IF v_milestone.title_reward IS NOT NULL THEN
    SELECT EXISTS(
      SELECT 1 FROM user_titles 
      WHERE user_id = p_user_id AND title_name = v_milestone.title_reward
    ) INTO v_title_already_earned;

    IF NOT v_title_already_earned THEN
      INSERT INTO user_titles (user_id, title_name)
      VALUES (p_user_id, v_milestone.title_reward);

      -- İlk ünvansa aktif yap
      UPDATE users 
      SET active_title = v_milestone.title_reward
      WHERE id = p_user_id AND active_title IS NULL;
    END IF;
  END IF;

  -- Tekrarlanan grup + son milestone ise sayacı sıfırla
  IF v_milestone.is_repeatable AND v_is_last_milestone THEN
    UPDATE user_repeatable_progress
    SET incremental_count = 0, cycle_number = cycle_number + 1
    WHERE user_id = p_user_id AND mission_group_id = v_milestone.group_id;

    -- Claim kayıtlarını sil (tekrar claim edilebilsin)
    DELETE FROM user_milestone_claims
    WHERE user_id = p_user_id AND milestone_id IN (
      SELECT id FROM milestones WHERE mission_group_id = v_milestone.group_id
    );
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'xp_earned', v_milestone.xp_reward,
    'title_earned', v_milestone.title_reward
  );

EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'error', SQLERRM
  );
END;
$$;
