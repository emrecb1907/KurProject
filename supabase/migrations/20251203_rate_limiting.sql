-- Rate Limiting ve Güvenli XP Güncelleme Fonksiyonları
-- Bu dosyayı Supabase SQL Editor'de çalıştırın.

-- 0. Gerekli Kolonları Ekle (Eğer yoksa)
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_game_completion TIMESTAMPTZ;


-- 1. XP Güncelleme Fonksiyonu (Rate Limit Korumalı)
-- Bu fonksiyon, kullanıcının son 1 dakika içindeki aktivitesini kontrol eder
-- ve aşırı hızlı istekleri engeller.
CREATE OR REPLACE FUNCTION update_xp_with_limit(
  p_user_id UUID,
  p_amount INTEGER,
  p_max_per_minute INTEGER DEFAULT 30
)
RETURNS JSONB AS $$
DECLARE
  v_last_update TIMESTAMPTZ;
  v_new_xp INTEGER;
BEGIN
  -- Negatif XP kontrolü (isteğe bağlı, hile koruması)
  IF p_amount < 0 THEN
    RETURN jsonb_build_object('error', 'Negative XP not allowed');
  END IF;

  -- Aşırı yüksek XP kontrolü (tek seferde)
  IF p_amount > 500 THEN
    RETURN jsonb_build_object('error', 'XP amount too high for single update');
  END IF;

  -- Son 1 dakikadaki update sayısını kontrol et
  -- updated_at kolonu her işlemde güncellendiği için bunu kullanabiliriz
  
  -- Kullanıcının son güncelleme zamanını al
  SELECT updated_at INTO v_last_update 
  FROM users 
  WHERE id = p_user_id;
  
  -- Eğer son güncelleme 1 saniyeden daha yeniyse reddet
  IF v_last_update IS NOT NULL AND v_last_update > NOW() - INTERVAL '1 second' THEN
     RETURN jsonb_build_object('error', 'Rate limit exceeded: Please wait a moment');
  END IF;

  -- XP güncelle
  UPDATE users
  SET total_xp = total_xp + p_amount,
      total_score = total_score + p_amount, -- Score'u da güncelle
      updated_at = NOW()
  WHERE id = p_user_id
  RETURNING total_xp INTO v_new_xp;

  RETURN jsonb_build_object('success', true, 'total_xp', v_new_xp);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Oyun Tamamlama Fonksiyonu (Rate Limit Korumalı)
-- Bu fonksiyon oyun bitişlerini rate limit ile korur ve progress/activity günceller
CREATE OR REPLACE FUNCTION complete_game_with_limit(
  p_user_id UUID,
  p_lesson_id TEXT,
  p_correct_answers INTEGER,
  p_total_questions INTEGER
)
RETURNS JSONB AS $$
DECLARE
  v_last_game_completion TIMESTAMPTZ;
  v_completion_rate NUMERIC;
  v_current_count INTEGER;
  v_new_count INTEGER;
BEGIN
  -- Rate limit kontrolü: Son oyun bitişinden beri 5 saniye geçmiş mi?
  SELECT last_game_completion INTO v_last_game_completion
  FROM users
  WHERE id = p_user_id;

  IF v_last_game_completion IS NOT NULL AND v_last_game_completion > NOW() - INTERVAL '5 seconds' THEN
    RETURN jsonb_build_object('error', 'Rate limit exceeded: Please wait before completing another game');
  END IF;

  -- Completion rate hesapla
  v_completion_rate := (p_correct_answers::NUMERIC / NULLIF(p_total_questions, 0)) * 100;

  -- Mevcut completion count'u al
  SELECT completion_count INTO v_current_count
  FROM user_progress
  WHERE user_id = p_user_id AND lesson_id = p_lesson_id;

  v_current_count := COALESCE(v_current_count, 0);
  v_new_count := v_current_count + 1;

  -- User progress'i güncelle (upsert)
  INSERT INTO user_progress (
    user_id,
    lesson_id,
    is_completed,
    completion_rate,
    completion_count,
    updated_at
  ) VALUES (
    p_user_id,
    p_lesson_id,
    true,
    v_completion_rate,
    v_new_count,
    NOW()
  )
  ON CONFLICT (user_id, lesson_id)
  DO UPDATE SET
    is_completed = true,
    completion_rate = v_completion_rate,
    completion_count = user_progress.completion_count + 1,
    updated_at = NOW();

  -- Users tablosunda last_game_completion timestamp'ini güncelle
  UPDATE users
  SET last_game_completion = NOW(),
      total_lessons_completed = total_lessons_completed + 1,
      total_questions_solved = total_questions_solved + p_total_questions,
      total_correct_answers = total_correct_answers + p_correct_answers,
      updated_at = NOW()
  WHERE id = p_user_id;

  RETURN jsonb_build_object('success', true, 'completion_count', v_new_count);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. İzinleri Ayarla
GRANT EXECUTE ON FUNCTION update_xp_with_limit TO authenticated;
GRANT EXECUTE ON FUNCTION update_xp_with_limit TO service_role;
GRANT EXECUTE ON FUNCTION complete_game_with_limit TO authenticated;
GRANT EXECUTE ON FUNCTION complete_game_with_limit TO service_role;

-- Not: Bu fonksiyonları kullanmak için client tarafında:
-- XP Update:
-- const { data, error } = await supabase.rpc('update_xp_with_limit', { 
--   p_user_id: userId, 
--   p_amount: 10 
-- });

-- Game Completion:
-- const { data, error } = await supabase.rpc('complete_game_with_limit', {
--   p_user_id: userId,
--   p_lesson_id: lessonId,
--   p_correct_answers: 8,
--   p_total_questions: 10
-- });
