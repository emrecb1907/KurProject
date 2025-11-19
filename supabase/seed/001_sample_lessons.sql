-- QuranLearn - Sample Lessons Seed Data
-- This file populates the lessons table with sample data

-- ==================== LETTERS CATEGORY ====================
INSERT INTO lessons (title, description, category, difficulty_level, order_index, unlock_level, xp_reward, is_active) VALUES
('Temel Harfler 1', 'İlk 7 Arapça harfi öğren', 'letters', 1, 1, 1, 50, true),
('Temel Harfler 2', '8-14 arası harfleri öğren', 'letters', 1, 2, 1, 50, true),
('İleri Harfler 1', '15-21 arası harfleri öğren', 'letters', 2, 3, 2, 60, true),
('İleri Harfler 2', 'Son 7 harfi öğren', 'letters', 2, 4, 3, 60, true),
('Harfler Revizyon', 'Tüm harfleri tekrar et', 'letters', 3, 5, 4, 75, true);

-- ==================== VOCABULARY CATEGORY ====================
INSERT INTO lessons (title, description, category, difficulty_level, order_index, unlock_level, xp_reward, is_active) VALUES
('Temel Kelimeler', 'Günlük hayatta kullanılan 20 kelime', 'vocabulary', 1, 6, 1, 60, true),
('İslami Terimler 1', 'İbadet ile ilgili kelimeler', 'vocabulary', 2, 7, 2, 70, true),
('İslami Terimler 2', 'Dini kavramlar ve terimler', 'vocabulary', 3, 8, 3, 80, true),
('İleri Kelimeler', 'Kuran''da sık geçen kelimeler', 'vocabulary', 4, 9, 4, 90, true),
('Kelime Karması', 'Tüm öğrenilen kelimelerin karışımı', 'vocabulary', 5, 10, 5, 100, true);

-- ==================== VERSES CATEGORY ====================
INSERT INTO lessons (title, description, category, difficulty_level, order_index, unlock_level, xp_reward, is_active) VALUES
('Kısa Sureler 1', 'Fatiha ve İhlas sureleri', 'verses', 2, 11, 2, 80, true),
('Kısa Sureler 2', 'Felak ve Nas sureleri', 'verses', 2, 12, 3, 80, true),
('Kısa Sureler 3', 'Kevser ve Kafirun sureleri', 'verses', 3, 13, 3, 90, true),
('Namaz Duaları 1', 'Temel namaz duaları', 'verses', 2, 14, 2, 75, true),
('Namaz Duaları 2', 'İlave namaz duaları', 'verses', 3, 15, 3, 85, true);

-- ==================== PRAYERS CATEGORY ====================
INSERT INTO lessons (title, description, category, difficulty_level, order_index, unlock_level, xp_reward, is_active) VALUES
('Sabah Duaları', 'Sabah vakti okunan dualar', 'prayers', 2, 16, 2, 70, true),
('Akşam Duaları', 'Akşam vakti okunan dualar', 'prayers', 2, 17, 2, 70, true),
('Yemek Duaları', 'Yemek öncesi ve sonrası dualar', 'prayers', 1, 18, 1, 50, true),
('Yolculuk Duaları', 'Yolculukta okunan dualar', 'prayers', 3, 19, 3, 80, true),
('Tesbih ve Zikirler', 'Günlük tesbih ve zikirler', 'prayers', 3, 20, 3, 85, true);

-- ==================== QUICK QUIZ CATEGORY ====================
INSERT INTO lessons (title, description, category, difficulty_level, order_index, unlock_level, xp_reward, is_active) VALUES
('Hızlı Tur 1', 'Karışık harf ve kelime soruları', 'quick_quiz', 5, 21, 10, 150, true),
('Hızlı Tur 2', 'Karışık ayet ve dua soruları', 'quick_quiz', 6, 22, 12, 175, true),
('Mega Hızlı Tur', 'Tüm kategorilerden 50 soru', 'quick_quiz', 8, 23, 15, 250, true);

-- Verify the insert
SELECT 
  category, 
  COUNT(*) as lesson_count, 
  MIN(unlock_level) as min_level,
  MAX(unlock_level) as max_level
FROM lessons
GROUP BY category
ORDER BY category;

