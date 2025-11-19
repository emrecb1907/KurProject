-- ============================================
-- Fake Leaderboard Users for Testing
-- ============================================
-- Purpose: Add 20 fake users with random XP for testing leaderboard
-- Note: These are test users, not actual auth users

-- Clean up previous fake users (optional)
DELETE FROM users WHERE email LIKE 'fake%@test.com';

-- Insert 20 fake users with varying XP levels
INSERT INTO users (
  id,
  email,
  username,
  is_anonymous,
  device_id,
  total_xp,
  current_level,
  total_score,
  current_lives,
  max_lives,
  streak_count,
  league,
  created_at
) VALUES
  -- Top performers (10000-50000 XP)
  (gen_random_uuid(), 'fake1@test.com', 'Ahmet Yılmaz', false, null, 45230, 42, 45230, 5, 5, 28, 'Platinum', NOW() - INTERVAL '30 days'),
  (gen_random_uuid(), 'fake2@test.com', 'Ayşe Demir', false, null, 38750, 38, 38750, 5, 5, 21, 'Gold', NOW() - INTERVAL '25 days'),
  (gen_random_uuid(), 'fake3@test.com', 'Mehmet Kaya', false, null, 32100, 34, 32100, 5, 5, 19, 'Gold', NOW() - INTERVAL '20 days'),
  (gen_random_uuid(), 'fake4@test.com', 'Fatma Öztürk', false, null, 28640, 32, 28640, 4, 5, 15, 'Silver', NOW() - INTERVAL '18 days'),
  (gen_random_uuid(), 'fake5@test.com', 'Ali Çelik', false, null, 24890, 30, 24890, 5, 5, 12, 'Silver', NOW() - INTERVAL '15 days'),
  
  -- Mid-level users (5000-10000 XP)
  (gen_random_uuid(), 'fake6@test.com', 'Zeynep Aydın', false, null, 18420, 27, 18420, 3, 5, 10, 'Silver', NOW() - INTERVAL '12 days'),
  (gen_random_uuid(), 'fake7@test.com', 'Mustafa Şahin', false, null, 15780, 25, 15780, 5, 5, 8, 'Bronze', NOW() - INTERVAL '10 days'),
  (gen_random_uuid(), 'fake8@test.com', 'Elif Yıldız', false, null, 12350, 23, 12350, 4, 5, 7, 'Bronze', NOW() - INTERVAL '9 days'),
  (gen_random_uuid(), 'fake9@test.com', 'Can Arslan', false, null, 10890, 21, 10890, 5, 5, 6, 'Bronze', NOW() - INTERVAL '8 days'),
  (gen_random_uuid(), 'fake10@test.com', 'Selin Özkan', false, null, 9240, 20, 9240, 3, 5, 5, 'Bronze', NOW() - INTERVAL '7 days'),
  
  -- Lower level users (1000-5000 XP)
  (gen_random_uuid(), 'fake11@test.com', 'Emre Koç', false, null, 7650, 18, 7650, 5, 5, 4, 'Bronze', NOW() - INTERVAL '6 days'),
  (gen_random_uuid(), 'fake12@test.com', 'Deniz Kara', false, null, 6100, 17, 6100, 4, 5, 3, 'Bronze', NOW() - INTERVAL '5 days'),
  (gen_random_uuid(), 'fake13@test.com', 'Buse Yılmaz', false, null, 4780, 15, 4780, 5, 5, 2, 'Bronze', NOW() - INTERVAL '4 days'),
  (gen_random_uuid(), 'fake14@test.com', 'Cem Aksoy', false, null, 3920, 14, 3920, 3, 5, 1, 'Bronze', NOW() - INTERVAL '3 days'),
  (gen_random_uuid(), 'fake15@test.com', 'Gizem Polat', false, null, 2840, 12, 2840, 5, 5, 0, 'Bronze', NOW() - INTERVAL '2 days'),
  
  -- New users (100-1000 XP)
  (gen_random_uuid(), 'fake16@test.com', 'Burak Şen', false, null, 1750, 10, 1750, 4, 5, 0, 'Bronze', NOW() - INTERVAL '1 day'),
  (gen_random_uuid(), 'fake17@test.com', 'Merve Acar', false, null, 980, 8, 980, 5, 5, 0, 'Bronze', NOW() - INTERVAL '12 hours'),
  (gen_random_uuid(), 'fake18@test.com', 'Kaan Taş', false, null, 650, 6, 650, 3, 5, 0, 'Bronze', NOW() - INTERVAL '6 hours'),
  (gen_random_uuid(), 'fake19@test.com', 'Ceren Yurt', false, null, 420, 5, 420, 5, 5, 0, 'Bronze', NOW() - INTERVAL '3 hours'),
  (gen_random_uuid(), 'fake20@test.com', 'Onur Kılıç', false, null, 150, 3, 150, 4, 5, 0, 'Bronze', NOW() - INTERVAL '1 hour');

-- Verify insertion
SELECT 
  'Fake users added!' as status,
  COUNT(*) as total_fake_users
FROM users 
WHERE email LIKE 'fake%@test.com';

-- Show leaderboard preview (top 10)
SELECT 
  ROW_NUMBER() OVER (ORDER BY total_xp DESC) as rank,
  username,
  total_xp,
  current_level,
  league
FROM users
WHERE is_anonymous = false
ORDER BY total_xp DESC
LIMIT 10;

