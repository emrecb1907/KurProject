-- Migration: Add completion_count to user_progress table
-- This tracks how many times a user has completed a lesson

ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS completion_count INTEGER DEFAULT 0;

-- Update existing records to have at least 1 completion if they are marked as completed
UPDATE user_progress SET completion_count = 1 WHERE is_completed = true AND completion_count = 0;
