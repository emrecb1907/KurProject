-- Migration: Change lesson_id from UUID to TEXT in user_progress table
-- This allows using simple string IDs like "1", "2" instead of UUIDs

-- Drop the foreign key constraint first
ALTER TABLE user_progress DROP CONSTRAINT IF EXISTS user_progress_lesson_id_fkey;

-- Change the column type to TEXT
ALTER TABLE user_progress ALTER COLUMN lesson_id TYPE TEXT;

-- Update the index
DROP INDEX IF EXISTS idx_user_progress_lesson_id;
CREATE INDEX idx_user_progress_lesson_id ON user_progress(lesson_id);

-- Note: We're not re-adding the foreign key constraint since lessons table uses UUID
-- and we're now using simple string IDs for lessons in the app
