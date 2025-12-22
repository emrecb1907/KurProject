-- ═══════════════════════════════════════════════════════════════════════════
-- get_user_streak: Timezone-Aware Streak Görüntüleme
-- ═══════════════════════════════════════════════════════════════════════════
-- Bu fonksiyon kullanıcının timezone'una göre doğru streak değerini döndürür.
-- Eğer son aktiviteden bu yana 1 günden fazla geçtiyse, streak = 0 döner.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION get_user_streak(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_last_activity DATE;
  v_streak INTEGER;
  v_activity_days TEXT[];
  v_user_tz TEXT;
  v_user_today DATE;
  v_days_since_activity INTEGER;
BEGIN
  -- 1. Kullanıcının timezone'ını al (yoksa UTC)
  SELECT timezone INTO v_user_tz 
  FROM users 
  WHERE id = p_user_id;
  
  v_user_tz := COALESCE(v_user_tz, 'UTC');
  
  -- 2. Kullanıcının yerel bugün tarihi
  v_user_today := (NOW() AT TIME ZONE v_user_tz)::DATE;
  
  -- 3. Streak bilgilerini al
  SELECT last_activity_date, streak, activity_days
  INTO v_last_activity, v_streak, v_activity_days
  FROM user_streaks 
  WHERE user_id = p_user_id;
  
  -- 4. Streak kaydı yoksa
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'streak', 0,
      'last_activity_date', NULL,
      'activity_days', '[]'::jsonb,
      'is_active_today', false,
      'user_today', v_user_today
    );
  END IF;
  
  -- 5. Son aktiviteden bu yana kaç gün geçti?
  IF v_last_activity IS NULL THEN
    v_days_since_activity := 999; -- Hiç aktivite yok
  ELSE
    v_days_since_activity := v_user_today - v_last_activity;
  END IF;
  
  -- 6. Streak değerini hesapla
  -- - Bugün veya dün aktivite varsa: gerçek streak değeri
  -- - 1 günden fazla boşluk varsa: 0
  IF v_days_since_activity > 1 THEN
    RETURN jsonb_build_object(
      'streak', 0,  -- Seri kırılmış
      'last_activity_date', v_last_activity,
      'activity_days', to_jsonb(COALESCE(v_activity_days, ARRAY[]::TEXT[])),
      'is_active_today', false,
      'user_today', v_user_today,
      'days_since_activity', v_days_since_activity
    );
  ELSE
    RETURN jsonb_build_object(
      'streak', v_streak,  -- Gerçek seri değeri
      'last_activity_date', v_last_activity,
      'activity_days', to_jsonb(COALESCE(v_activity_days, ARRAY[]::TEXT[])),
      'is_active_today', v_last_activity = v_user_today,
      'user_today', v_user_today,
      'days_since_activity', v_days_since_activity
    );
  END IF;
  
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'error', SQLERRM,
    'streak', 0
  );
END;
$$;

-- ═══════════════════════════════════════════════════════════════════════════
-- Yetkilendirme
-- ═══════════════════════════════════════════════════════════════════════════
GRANT EXECUTE ON FUNCTION get_user_streak(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_streak(UUID) TO anon;
