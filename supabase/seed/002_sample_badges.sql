-- QuranLearn - Sample Badges Seed Data
-- This file populates the badges table with sample achievements

-- ==================== ACHIEVEMENT BADGES ====================
INSERT INTO badges (name, description, badge_type, requirement_type, requirement_value, is_active) VALUES
('İlk Adım', 'İlk dersini tamamla', 'achievement', 'lessons_completed', 1, true),
('Öğrenmeye Başladım', '5 ders tamamla', 'achievement', 'lessons_completed', 5, true),
('Bilgin Geniş', '10 ders tamamla', 'achievement', 'lessons_completed', 10, true),
('Ders Uzmanı', '20 ders tamamla', 'achievement', 'lessons_completed', 20, true),
('Kuran Bilgini', 'Tüm dersleri tamamla', 'achievement', 'lessons_completed', 23, true);

-- ==================== MILESTONE BADGES ====================
INSERT INTO badges (name, description, badge_type, requirement_type, requirement_value, is_active) VALUES
('İlk Doğru Cevap', '1 soruyu doğru cevapla', 'milestone', 'questions_correct', 1, true),
('Soru Ustası', '50 soruyu doğru cevapla', 'milestone', 'questions_correct', 50, true),
('Yüz Tam', '100 soruyu doğru cevapla', 'milestone', 'questions_correct', 100, true),
('Bilge Kişi', '500 soruyu doğru cevapla', 'milestone', 'questions_correct', 500, true),
('Kuran Bilgesi', '1000 soruyu doğru cevapla', 'milestone', 'questions_correct', 1000, true);

-- ==================== STREAK BADGES ====================
INSERT INTO badges (name, description, badge_type, requirement_type, requirement_value, is_active) VALUES
('Kararlı Başlangıç', '3 gün üst üste oyna', 'streak', 'streak_days', 3, true),
('Bir Hafta Tam', '7 gün üst üste oyna', 'streak', 'streak_days', 7, true),
('Azimli', '14 gün üst üste oyna', 'streak', 'streak_days', 14, true),
('Devamlı', '30 gün üst üste oyna', 'streak', 'streak_days', 30, true),
('Efsane Seri', '100 gün üst üste oyna', 'streak', 'streak_days', 100, true);

-- ==================== LEVEL BADGES ====================
INSERT INTO badges (name, description, badge_type, requirement_type, requirement_value, is_active) VALUES
('Seviye 5', '5. seviyeye ulaş', 'milestone', 'level_reached', 5, true),
('Seviye 10', '10. seviyeye ulaş', 'milestone', 'level_reached', 10, true),
('Seviye 25', '25. seviyeye ulaş', 'milestone', 'level_reached', 25, true),
('Seviye 50', '50. seviyeye ulaş', 'milestone', 'level_reached', 50, true),
('Seviye 100', '100. seviyeye ulaş', 'milestone', 'level_reached', 100, true);

-- ==================== XP BADGES ====================
INSERT INTO badges (name, description, badge_type, requirement_type, requirement_value, is_active) VALUES
('İlk XP', '100 XP topla', 'milestone', 'xp_earned', 100, true),
('XP Kollektörü', '1000 XP topla', 'milestone', 'xp_earned', 1000, true),
('XP Uzmanı', '5000 XP topla', 'milestone', 'xp_earned', 5000, true),
('XP Dehası', '10000 XP topla', 'milestone', 'xp_earned', 10000, true),
('XP Efsanesi', '50000 XP topla', 'milestone', 'xp_earned', 50000, true);

-- ==================== SPECIAL BADGES ====================
INSERT INTO badges (name, description, badge_type, requirement_type, requirement_value, is_active) VALUES
('Erken Kuş', 'Uygulamayı sabah 6''dan önce aç', 'special', 'special_condition', 1, false),
('Gece Kuşu', 'Uygulamayı gece 12''den sonra aç', 'special', 'special_condition', 1, false),
('Hafta Sonu Şampiyonu', 'Hafta sonu 10 ders tamamla', 'special', 'special_condition', 1, false),
('Mükemmeliyetçi', 'Bir dersi %100 doğrulukla bitir', 'special', 'special_condition', 1, false),
('Hızlı Öğrenen', 'Bir dersi 5 dakikadan kısa sürede bitir', 'special', 'special_condition', 1, false);

-- Verify the insert
SELECT 
  badge_type, 
  COUNT(*) as badge_count,
  SUM(CASE WHEN is_active THEN 1 ELSE 0 END) as active_count
FROM badges
GROUP BY badge_type
ORDER BY badge_type;

-- Show sample badges
SELECT name, description, badge_type, requirement_type, requirement_value
FROM badges
WHERE is_active = true
ORDER BY 
  CASE badge_type
    WHEN 'achievement' THEN 1
    WHEN 'milestone' THEN 2
    WHEN 'streak' THEN 3
    WHEN 'special' THEN 4
  END,
  requirement_value
LIMIT 10;

