-- ============================================
-- Fix: Make device_id NULLABLE for authenticated users
-- ============================================
-- Issue: Authenticated users don't have device_id, but column is NOT NULL
-- Solution: Make device_id nullable, add check constraint

-- 1. Remove NOT NULL constraint from device_id
ALTER TABLE users 
ALTER COLUMN device_id DROP NOT NULL;

-- 2. Add constraint: Either is_anonymous = true with device_id, OR is_anonymous = false without device_id
ALTER TABLE users
ADD CONSTRAINT check_device_id_for_anonymous
CHECK (
  (is_anonymous = true AND device_id IS NOT NULL) OR
  (is_anonymous = false)
);

-- 3. Update existing users if any
-- Set device_id to NULL for non-anonymous users
UPDATE users
SET device_id = NULL
WHERE is_anonymous = false AND device_id IS NOT NULL;

-- 4. Comment
COMMENT ON COLUMN users.device_id IS 'Device ID for anonymous users only. NULL for authenticated users.';

