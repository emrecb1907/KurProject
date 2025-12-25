-- ═══════════════════════════════════════════════════════════════════════════
-- set_active_title: Kullanıcının aktif ünvanını değiştir
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION set_active_title(
  p_user_id UUID,
  p_title_name TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_title_exists BOOLEAN;
BEGIN
  -- NULL kontrolü - ünvanı kaldırmak için
  IF p_title_name IS NULL THEN
    UPDATE users SET active_title = NULL WHERE id = p_user_id;
    RETURN jsonb_build_object('success', true, 'active_title', NULL);
  END IF;

  -- Ünvan kazanılmış mı kontrol et
  SELECT EXISTS(
    SELECT 1 FROM user_titles 
    WHERE user_id = p_user_id AND title_name = p_title_name
  ) INTO v_title_exists;

  IF NOT v_title_exists THEN
    RETURN jsonb_build_object('success', false, 'error', 'TITLE_NOT_EARNED');
  END IF;

  -- Aktif ünvanı güncelle
  UPDATE users SET active_title = p_title_name WHERE id = p_user_id;

  RETURN jsonb_build_object('success', true, 'active_title', p_title_name);

EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- ═══════════════════════════════════════════════════════════════════════════
-- submit_test_result_secure GÜNCELLEME
-- Mevcut fonksiyonun SONUNA eklenecek (RETURN'den önce)
-- ═══════════════════════════════════════════════════════════════════════════

-- NOT: Aşağıdaki kodu mevcut submit_test_result_secure fonksiyonuna ekle
-- Session silmeden hemen önce:

/*
  -- ══════════════════════════════════════════════════════════
  -- 🎯 TEKRARLANAN GÖREV SAYACI
  -- ══════════════════════════════════════════════════════════
  
  INSERT INTO user_repeatable_progress (user_id, mission_group_id, incremental_count)
  SELECT p_user_id, id, 1
  FROM mission_groups
  WHERE type = 'test' AND is_repeatable = true
  ON CONFLICT (user_id, mission_group_id)
  DO UPDATE SET incremental_count = user_repeatable_progress.incremental_count + 1;
*/

-- ═══════════════════════════════════════════════════════════════════════════
-- complete_lesson_secure GÜNCELLEME
-- Mevcut fonksiyonun SONUNA eklenecek (RETURN'den önce)
-- ═══════════════════════════════════════════════════════════════════════════

-- NOT: Aşağıdaki kodu mevcut complete_lesson_secure fonksiyonuna ekle:

/*
  -- ══════════════════════════════════════════════════════════
  -- 🎯 TEKRARLANAN GÖREV SAYACI
  -- ══════════════════════════════════════════════════════════
  
  INSERT INTO user_repeatable_progress (user_id, mission_group_id, incremental_count)
  SELECT p_user_id, id, 1
  FROM mission_groups
  WHERE type = 'lesson' AND is_repeatable = true
  ON CONFLICT (user_id, mission_group_id)
  DO UPDATE SET incremental_count = user_repeatable_progress.incremental_count + 1;
*/
