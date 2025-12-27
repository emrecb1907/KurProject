-- ═══════════════════════════════════════════════════════════════════════════
-- submit_test_result_secure: v4 (Auth Check Added)
-- ═══════════════════════════════════════════════════════════════════════════
-- Güvenlik Güncellemeleri:
-- 1. auth.uid() kontrolü eklendi
-- 2. Session doğrulama
-- 3. Rate limiting (15s)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION submit_test_result_secure(
  p_user_id UUID,
  p_test_id TEXT,
  p_correct INTEGER,
  p_total INTEGER,
  p_duration INTEGER DEFAULT 10,
  p_client_timestamp TIMESTAMPTZ DEFAULT NOW(),
  p_session_id TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_xp_earned INTEGER;
  v_new_total_score INTEGER;
  v_new_level INTEGER;
  v_stored_session_id TEXT;
  v_user_tz TEXT;
  v_today DATE;
  v_last_activity DATE;
  v_current_streak INTEGER;
  v_activity_days TEXT[];
  v_new_streak INTEGER;
  v_user_exists BOOLEAN;
  v_last_submit TIMESTAMP;
BEGIN

  -- ══════════════════════════════════════════════════════════
  -- 🔐 AUTH KONTROLU (EN BAŞTA!)
  -- ══════════════════════════════════════════════════════════
  IF p_user_id != auth.uid() THEN
    RETURN jsonb_build_object('success', false, 'error', 'UNAUTHORIZED');
  END IF;

  -- ══════════════════════════════════════════════════════════
  -- 🌍 TIMEZONE-AWARE BUGÜN TARİHİ
  -- ══════════════════════════════════════════════════════════
  
  SELECT timezone INTO v_user_tz FROM users WHERE id = p_user_id;
  v_user_tz := COALESCE(v_user_tz, 'UTC');
  
  -- Kullanıcının yerel bugününü hesapla
  v_today := (p_client_timestamp AT TIME ZONE v_user_tz)::DATE;

  -- ══════════════════════════════════════════════════════════
  -- 🛡️ GÜVENLİK KONTROLLERİ
  -- ══════════════════════════════════════════════════════════
  
  -- 1. Soru sayısı kontrolü (1-10 arası)
  IF p_total > 10 OR p_total < 1 THEN
    RETURN jsonb_build_object(
      'success', false, 
      'error', 'INVALID_QUESTION_COUNT', 
      'message', 'Soru sayısı 1-10 arasında olmalıdır.'
    );
  END IF;
  
  -- 2. Doğru sayısı kontrolü (0 ile toplam soru arasında olmalı)
  IF p_correct > p_total OR p_correct < 0 THEN
    RETURN jsonb_build_object(
      'success', false, 
      'error', 'INVALID_CORRECT_COUNT', 
      'message', 'Doğru sayısı geçersiz.'
    );
  END IF;

  -- 3. 🔐 SESSION KONTROLü (ZORUNLU - NULL olamaz!)
  IF p_session_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false, 
      'error', 'SESSION_REQUIRED', 
      'message', 'Oturum bilgisi gerekli.'
    );
  END IF;
  
  SELECT session_id INTO v_stored_session_id 
  FROM user_sessions 
  WHERE user_id = p_user_id;
  
  IF v_stored_session_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false, 
      'error', 'SESSION_NOT_FOUND', 
      'message', 'Aktif oturum bulunamadı. Önce teste başlayın.'
    );
  END IF;
  
  IF v_stored_session_id IS DISTINCT FROM p_session_id THEN
    RETURN jsonb_build_object(
      'success', false, 
      'error', 'SESSION_MISMATCH', 
      'message', 'Oturum eşleşmiyor.'
    );
  END IF;

  -- 4. Kullanıcı var mı?
  SELECT EXISTS(SELECT 1 FROM users WHERE id = p_user_id) INTO v_user_exists;
  IF NOT v_user_exists THEN
     RETURN jsonb_build_object('success', false, 'error', 'USER_NOT_FOUND', 'detail', p_user_id);
  END IF;

  -- 5. ⏱️ RATE LIMIT - Son 15 saniyede submit yapıldı mı?
  SELECT MAX(created_at) INTO v_last_submit 
  FROM user_test_results 
  WHERE user_id = p_user_id;
  
  IF v_last_submit IS NOT NULL AND (now() - v_last_submit) < INTERVAL '15 seconds' THEN
    RETURN jsonb_build_object(
      'success', false, 
      'error', 'RATE_LIMITED', 
      'message', 'Çok hızlı! Lütfen birkaç saniye bekleyin.'
    );
  END IF;

  -- ══════════════════════════════════════════════════════════
  -- 📊 İŞLEM MANTIĞI
  -- ══════════════════════════════════════════════════════════

  v_xp_earned := p_correct;

  -- Test sonucu kaydet
  INSERT INTO user_test_results (user_id, test_id, correct_answer, total_question, test_count, created_at)
  VALUES (p_user_id, p_test_id, p_correct, p_total, 1, now()) 
  ON CONFLICT ON CONSTRAINT user_test_results_user_id_test_id_key
  DO UPDATE SET
    correct_answer = user_test_results.correct_answer + EXCLUDED.correct_answer,
    total_question = user_test_results.total_question + EXCLUDED.total_question,
    test_count     = COALESCE(user_test_results.test_count, 1) + 1,
    created_at     = now();

  -- İstatistik güncelle
  UPDATE user_stats
  SET 
    total_score = total_score + v_xp_earned,
    total_questions_solved = total_questions_solved + p_total,
    total_correct_answers = total_correct_answers + p_correct,
    total_tests_completed = total_tests_completed + 1
  WHERE user_id = p_user_id
  RETURNING total_score INTO v_new_total_score;

  IF v_new_total_score IS NULL THEN
     INSERT INTO user_stats (user_id, total_score, total_questions_solved, total_correct_answers, total_tests_completed, current_level, current_lives)
     VALUES (p_user_id, v_xp_earned, p_total, p_correct, 1, 1, 5)
     RETURNING total_score INTO v_new_total_score;
     v_new_level := 1;
  ELSE
     v_new_level := calculate_level_from_xp(v_new_total_score); 
     UPDATE user_stats SET current_level = v_new_level WHERE user_id = p_user_id;
  END IF;

  -- ══════════════════════════════════════════════════════════
  -- 📊 DAILY LOG (Premium Analytics)
  -- ══════════════════════════════════════════════════════════
  
  INSERT INTO user_daily_logs (
    user_id, log_date, tests_completed, questions_solved, correct_answers, xp_earned
  )
  VALUES (
    p_user_id, v_today, 1, p_total, p_correct, v_xp_earned
  )
  ON CONFLICT (user_id, log_date) DO UPDATE SET
    tests_completed = user_daily_logs.tests_completed + 1,
    questions_solved = user_daily_logs.questions_solved + EXCLUDED.questions_solved,
    correct_answers = user_daily_logs.correct_answers + EXCLUDED.correct_answers,
    xp_earned = user_daily_logs.xp_earned + EXCLUDED.xp_earned,
    updated_at = NOW();

  -- ══════════════════════════════════════════════════════════
  -- 🔥 STREAK MANTIĞI (Timezone-Aware + 7 Gün Limit)
  -- ══════════════════════════════════════════════════════════

  SELECT last_activity_date, streak, activity_days
  INTO v_last_activity, v_current_streak, v_activity_days
  FROM user_streaks
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    -- İlk kayıt
    INSERT INTO user_streaks (user_id, streak, last_activity_date, activity_days, created_at, updated_at)
    VALUES (p_user_id, 1, v_today, ARRAY[TO_CHAR(v_today, 'YYYY-MM-DD')], now(), now());
    v_new_streak := 1;
  ELSE
    v_activity_days := COALESCE(v_activity_days, ARRAY[]::TEXT[]);
    
    -- 📅 SON 7 GÜNÜ FİLTRELE (Eski günleri temizle)
    v_activity_days := ARRAY(
      SELECT unnest 
      FROM unnest(v_activity_days) 
      WHERE unnest::DATE >= v_today - 6
    );
    
    IF v_last_activity = v_today THEN
       -- Bugün zaten aktivite var
       v_new_streak := v_current_streak;
       IF NOT (TO_CHAR(v_today, 'YYYY-MM-DD') = ANY(v_activity_days)) THEN
          v_activity_days := array_append(v_activity_days, TO_CHAR(v_today, 'YYYY-MM-DD'));
          UPDATE user_streaks 
          SET activity_days = v_activity_days, updated_at = now() 
          WHERE user_id = p_user_id;
       END IF;
       
    ELSIF v_last_activity = v_today - 1 THEN
       -- Dün aktivite vardı, streak devam
       v_new_streak := v_current_streak + 1;
       v_activity_days := array_append(v_activity_days, TO_CHAR(v_today, 'YYYY-MM-DD'));
       UPDATE user_streaks 
       SET streak = v_new_streak, 
           last_activity_date = v_today, 
           activity_days = v_activity_days, 
           updated_at = now() 
       WHERE user_id = p_user_id;
       
    ELSE
       -- 1 günden fazla boşluk, streak sıfırlan
       v_new_streak := 1;
       v_activity_days := ARRAY[TO_CHAR(v_today, 'YYYY-MM-DD')];
       UPDATE user_streaks 
       SET streak = 1, 
           last_activity_date = v_today, 
           activity_days = v_activity_days, 
           updated_at = now() 
       WHERE user_id = p_user_id;
    END IF;
  END IF;

  -- ══════════════════════════════════════════════════════════
  -- 🎯 TEKRARLANAN GÖREV SAYACI (Mission System)
  -- ══════════════════════════════════════════════════════════
  
  IF (
    SELECT COUNT(*) = SUM(CASE WHEN umc.milestone_id IS NOT NULL THEN 1 ELSE 0 END)
    FROM milestones m
    JOIN mission_groups mg ON m.mission_group_id = mg.id
    LEFT JOIN user_milestone_claims umc ON umc.milestone_id = m.id AND umc.user_id = p_user_id
    WHERE mg.type = 'test' AND mg.is_repeatable = false
  ) THEN
    INSERT INTO user_repeatable_progress (user_id, mission_group_id, incremental_count)
    SELECT p_user_id, id, 1
    FROM mission_groups
    WHERE type = 'test' AND is_repeatable = true
    ON CONFLICT (user_id, mission_group_id)
    DO UPDATE SET incremental_count = user_repeatable_progress.incremental_count + 1;
  END IF;

  -- ══════════════════════════════════════════════════════════
  -- 🗑️ SESSION SİL (Tek kullanımlık)
  -- ══════════════════════════════════════════════════════════
  DELETE FROM user_sessions WHERE user_id = p_user_id;

  -- ══════════════════════════════════════════════════════════
  -- ✅ SONUÇ
  -- ══════════════════════════════════════════════════════════

  RETURN jsonb_build_object(
    'success', true, 
    'xp_earned', v_xp_earned,
    'new_streak', v_new_streak,
    'new_level', v_new_level,
    'total_score', v_new_total_score,
    'user_today', v_today,
    'user_timezone', v_user_tz
  );

EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'error', SQLERRM,
    'code', SQLSTATE
  );
END;
$$;
