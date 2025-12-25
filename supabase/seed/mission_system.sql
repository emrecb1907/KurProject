-- ═══════════════════════════════════════════════════════════════════════════
-- Mission System Migration
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Görev Grupları
CREATE TABLE IF NOT EXISTS mission_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('test', 'lesson')),
  name TEXT NOT NULL,
  order_number INTEGER NOT NULL,
  is_repeatable BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Kilometre Taşları
CREATE TABLE IF NOT EXISTS milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_group_id UUID REFERENCES mission_groups(id) ON DELETE CASCADE,
  target_count INTEGER NOT NULL,
  xp_reward INTEGER NOT NULL,
  title_reward TEXT,
  order_in_group INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Ödül Talepleri
CREATE TABLE IF NOT EXISTS user_milestone_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  milestone_id UUID REFERENCES milestones(id) ON DELETE CASCADE,
  claimed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, milestone_id)
);

-- 4. Tekrarlanan Grup Sayacı
CREATE TABLE IF NOT EXISTS user_repeatable_progress (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  mission_group_id UUID REFERENCES mission_groups(id) ON DELETE CASCADE,
  incremental_count INTEGER DEFAULT 0,
  cycle_number INTEGER DEFAULT 1,
  PRIMARY KEY (user_id, mission_group_id)
);

-- 5. Kazanılan Ünvanlar
CREATE TABLE IF NOT EXISTS user_titles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title_name TEXT NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. users tablosuna aktif ünvan
ALTER TABLE users ADD COLUMN IF NOT EXISTS active_title TEXT;

-- ═══════════════════════════════════════════════════════════════════════════
-- RLS Policies
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE mission_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_milestone_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_repeatable_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_titles ENABLE ROW LEVEL SECURITY;

-- Public read for mission_groups and milestones
CREATE POLICY "Anyone can read mission_groups" ON mission_groups FOR SELECT USING (true);
CREATE POLICY "Anyone can read milestones" ON milestones FOR SELECT USING (true);

-- User-specific policies
CREATE POLICY "Users can read own claims" ON user_milestone_claims FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own claims" ON user_milestone_claims FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own progress" ON user_repeatable_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own progress" ON user_repeatable_progress FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can read own titles" ON user_titles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own titles" ON user_titles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- SEED DATA: TEST GÖREVLERI
-- ═══════════════════════════════════════════════════════════════════════════

-- Test Görev 1
INSERT INTO mission_groups (id, type, name, order_number, is_repeatable) VALUES 
('11111111-1111-1111-1111-111111111101', 'test', 'test_quest_1', 1, false);

INSERT INTO milestones (mission_group_id, target_count, xp_reward, title_reward, order_in_group) VALUES
('11111111-1111-1111-1111-111111111101', 1, 5, NULL, 1),
('11111111-1111-1111-1111-111111111101', 5, 10, NULL, 2),
('11111111-1111-1111-1111-111111111101', 10, 15, 'test_title_1', 3);

-- Test Görev 2
INSERT INTO mission_groups (id, type, name, order_number, is_repeatable) VALUES 
('11111111-1111-1111-1111-111111111102', 'test', 'test_quest_2', 2, false);

INSERT INTO milestones (mission_group_id, target_count, xp_reward, title_reward, order_in_group) VALUES
('11111111-1111-1111-1111-111111111102', 20, 10, NULL, 1),
('11111111-1111-1111-1111-111111111102', 30, 15, NULL, 2),
('11111111-1111-1111-1111-111111111102', 50, 20, 'test_title_2', 3);

-- Test Görev 3
INSERT INTO mission_groups (id, type, name, order_number, is_repeatable) VALUES 
('11111111-1111-1111-1111-111111111103', 'test', 'test_quest_3', 3, false);

INSERT INTO milestones (mission_group_id, target_count, xp_reward, title_reward, order_in_group) VALUES
('11111111-1111-1111-1111-111111111103', 60, 30, NULL, 1),
('11111111-1111-1111-1111-111111111103', 80, 45, NULL, 2),
('11111111-1111-1111-1111-111111111103', 100, 60, 'test_title_3', 3);

-- Test Görev 4
INSERT INTO mission_groups (id, type, name, order_number, is_repeatable) VALUES 
('11111111-1111-1111-1111-111111111104', 'test', 'test_quest_4', 4, false);

INSERT INTO milestones (mission_group_id, target_count, xp_reward, title_reward, order_in_group) VALUES
('11111111-1111-1111-1111-111111111104', 130, 50, NULL, 1),
('11111111-1111-1111-1111-111111111104', 160, 70, NULL, 2),
('11111111-1111-1111-1111-111111111104', 200, 100, 'test_title_4', 3);

-- Test Görev 5
INSERT INTO mission_groups (id, type, name, order_number, is_repeatable) VALUES 
('11111111-1111-1111-1111-111111111105', 'test', 'test_quest_5', 5, false);

INSERT INTO milestones (mission_group_id, target_count, xp_reward, title_reward, order_in_group) VALUES
('11111111-1111-1111-1111-111111111105', 240, 70, NULL, 1),
('11111111-1111-1111-1111-111111111105', 300, 100, NULL, 2),
('11111111-1111-1111-1111-111111111105', 380, 140, 'test_title_5', 3);

-- Test Görev 6
INSERT INTO mission_groups (id, type, name, order_number, is_repeatable) VALUES 
('11111111-1111-1111-1111-111111111106', 'test', 'test_quest_6', 6, false);

INSERT INTO milestones (mission_group_id, target_count, xp_reward, title_reward, order_in_group) VALUES
('11111111-1111-1111-1111-111111111106', 450, 100, NULL, 1),
('11111111-1111-1111-1111-111111111106', 550, 140, NULL, 2),
('11111111-1111-1111-1111-111111111106', 700, 200, 'test_title_6', 3);

-- Test Görev 7
INSERT INTO mission_groups (id, type, name, order_number, is_repeatable) VALUES 
('11111111-1111-1111-1111-111111111107', 'test', 'test_quest_7', 7, false);

INSERT INTO milestones (mission_group_id, target_count, xp_reward, title_reward, order_in_group) VALUES
('11111111-1111-1111-1111-111111111107', 850, 140, NULL, 1),
('11111111-1111-1111-1111-111111111107', 1000, 200, NULL, 2),
('11111111-1111-1111-1111-111111111107', 1200, 280, 'test_title_7', 3);

-- Test Görev 8 (TEKRARLANAN)
INSERT INTO mission_groups (id, type, name, order_number, is_repeatable) VALUES 
('11111111-1111-1111-1111-111111111108', 'test', 'test_quest_8', 8, true);

INSERT INTO milestones (mission_group_id, target_count, xp_reward, title_reward, order_in_group) VALUES
('11111111-1111-1111-1111-111111111108', 25, 50, NULL, 1),
('11111111-1111-1111-1111-111111111108', 50, 75, NULL, 2),
('11111111-1111-1111-1111-111111111108', 100, 100, 'test_title_8', 3);

-- ═══════════════════════════════════════════════════════════════════════════
-- SEED DATA: DERS GÖREVLERI
-- ═══════════════════════════════════════════════════════════════════════════

-- Ders Görev 1
INSERT INTO mission_groups (id, type, name, order_number, is_repeatable) VALUES 
('22222222-2222-2222-2222-222222222201', 'lesson', 'lesson_quest_1', 1, false);

INSERT INTO milestones (mission_group_id, target_count, xp_reward, title_reward, order_in_group) VALUES
('22222222-2222-2222-2222-222222222201', 1, 1, NULL, 1),
('22222222-2222-2222-2222-222222222201', 5, 3, NULL, 2),
('22222222-2222-2222-2222-222222222201', 10, 6, 'lesson_title_1', 3);

-- Ders Görev 2
INSERT INTO mission_groups (id, type, name, order_number, is_repeatable) VALUES 
('22222222-2222-2222-2222-222222222202', 'lesson', 'lesson_quest_2', 2, false);

INSERT INTO milestones (mission_group_id, target_count, xp_reward, title_reward, order_in_group) VALUES
('22222222-2222-2222-2222-222222222202', 15, 3, NULL, 1),
('22222222-2222-2222-2222-222222222202', 20, 6, NULL, 2),
('22222222-2222-2222-2222-222222222202', 25, 9, 'lesson_title_2', 3);

-- Ders Görev 3
INSERT INTO mission_groups (id, type, name, order_number, is_repeatable) VALUES 
('22222222-2222-2222-2222-222222222203', 'lesson', 'lesson_quest_3', 3, false);

INSERT INTO milestones (mission_group_id, target_count, xp_reward, title_reward, order_in_group) VALUES
('22222222-2222-2222-2222-222222222203', 30, 6, NULL, 1),
('22222222-2222-2222-2222-222222222203', 35, 10, NULL, 2),
('22222222-2222-2222-2222-222222222203', 40, 14, 'lesson_title_3', 3);

-- Ders Görev 4
INSERT INTO mission_groups (id, type, name, order_number, is_repeatable) VALUES 
('22222222-2222-2222-2222-222222222204', 'lesson', 'lesson_quest_4', 4, false);

INSERT INTO milestones (mission_group_id, target_count, xp_reward, title_reward, order_in_group) VALUES
('22222222-2222-2222-2222-222222222204', 50, 8, NULL, 1),
('22222222-2222-2222-2222-222222222204', 60, 12, NULL, 2),
('22222222-2222-2222-2222-222222222204', 70, 18, 'lesson_title_4', 3);

-- Ders Görev 5
INSERT INTO mission_groups (id, type, name, order_number, is_repeatable) VALUES 
('22222222-2222-2222-2222-222222222205', 'lesson', 'lesson_quest_5', 5, false);

INSERT INTO milestones (mission_group_id, target_count, xp_reward, title_reward, order_in_group) VALUES
('22222222-2222-2222-2222-222222222205', 80, 9, NULL, 1),
('22222222-2222-2222-2222-222222222205', 90, 14, NULL, 2),
('22222222-2222-2222-2222-222222222205', 100, 22, 'lesson_title_5', 3);

-- Ders Görev 6
INSERT INTO mission_groups (id, type, name, order_number, is_repeatable) VALUES 
('22222222-2222-2222-2222-222222222206', 'lesson', 'lesson_quest_6', 6, false);

INSERT INTO milestones (mission_group_id, target_count, xp_reward, title_reward, order_in_group) VALUES
('22222222-2222-2222-2222-222222222206', 110, 7, NULL, 1),
('22222222-2222-2222-2222-222222222206', 120, 11, NULL, 2),
('22222222-2222-2222-2222-222222222206', 130, 16, 'lesson_title_6', 3);

-- Ders Görev 7
INSERT INTO mission_groups (id, type, name, order_number, is_repeatable) VALUES 
('22222222-2222-2222-2222-222222222207', 'lesson', 'lesson_quest_7', 7, false);

INSERT INTO milestones (mission_group_id, target_count, xp_reward, title_reward, order_in_group) VALUES
('22222222-2222-2222-2222-222222222207', 140, 12, NULL, 1),
('22222222-2222-2222-2222-222222222207', 145, 16, NULL, 2),
('22222222-2222-2222-2222-222222222207', 150, 26, 'lesson_title_7', 3);

-- Ders Görev 8 (TEKRARLANAN)
INSERT INTO mission_groups (id, type, name, order_number, is_repeatable) VALUES 
('22222222-2222-2222-2222-222222222208', 'lesson', 'lesson_quest_8', 8, true);

INSERT INTO milestones (mission_group_id, target_count, xp_reward, title_reward, order_in_group) VALUES
('22222222-2222-2222-2222-222222222208', 1, 1, NULL, 1),
('22222222-2222-2222-2222-222222222208', 3, 3, NULL, 2),
('22222222-2222-2222-2222-222222222208', 5, 5, 'lesson_title_8', 3);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_milestones_group ON milestones(mission_group_id);
CREATE INDEX IF NOT EXISTS idx_user_claims_user ON user_milestone_claims(user_id);
CREATE INDEX IF NOT EXISTS idx_user_claims_milestone ON user_milestone_claims(milestone_id);
CREATE INDEX IF NOT EXISTS idx_user_titles_user ON user_titles(user_id);
