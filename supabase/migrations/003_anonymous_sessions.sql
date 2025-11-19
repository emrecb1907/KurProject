-- ============================================
-- Anonymous Sessions Table for Analytics
-- ============================================
-- Purpose: Track anonymous user sessions without storing personal data
-- Privacy: Only device_id, timestamps, and conversion metrics

-- 1. Create Table
CREATE TABLE IF NOT EXISTS anonymous_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT UNIQUE NOT NULL,
  first_opened_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  session_count INTEGER DEFAULT 1,
  created_account BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  device_info JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Indexes for Performance
CREATE INDEX idx_anonymous_sessions_device ON anonymous_sessions(device_id);
CREATE INDEX idx_anonymous_sessions_active ON anonymous_sessions(last_active_at DESC);
CREATE INDEX idx_anonymous_sessions_conversion ON anonymous_sessions(created_account) WHERE created_account = true;

-- 3. Updated_at Trigger
CREATE OR REPLACE FUNCTION update_anonymous_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_anonymous_sessions_updated_at
BEFORE UPDATE ON anonymous_sessions
FOR EACH ROW
EXECUTE FUNCTION update_anonymous_sessions_updated_at();

-- 4. Session Count Increment Function
CREATE OR REPLACE FUNCTION increment_session_count()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.device_id = NEW.device_id THEN
    NEW.session_count = OLD.session_count + 1;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_session_count
BEFORE UPDATE ON anonymous_sessions
FOR EACH ROW
WHEN (OLD.last_active_at < NEW.last_active_at)
EXECUTE FUNCTION increment_session_count();

-- 5. Row Level Security (RLS)
ALTER TABLE anonymous_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (tracking new sessions)
CREATE POLICY "Anyone can track session"
ON anonymous_sessions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Policy: Anyone can update (upsert for tracking)
CREATE POLICY "Anyone can update session"
ON anonymous_sessions
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Policy: Anyone can select (for analytics)
CREATE POLICY "Anyone can view sessions"
ON anonymous_sessions
FOR SELECT
TO anon, authenticated
USING (true);

-- 6. Analytics Views (Optional - for dashboard)
CREATE OR REPLACE VIEW anonymous_analytics AS
SELECT
  COUNT(DISTINCT device_id) as total_devices,
  COUNT(*) FILTER (WHERE last_active_at > NOW() - INTERVAL '1 day') as active_today,
  COUNT(*) FILTER (WHERE last_active_at > NOW() - INTERVAL '7 days') as active_week,
  COUNT(*) FILTER (WHERE last_active_at > NOW() - INTERVAL '30 days') as active_month,
  COUNT(*) FILTER (WHERE created_account = true) as converted_users,
  ROUND(
    COUNT(*) FILTER (WHERE created_account = true)::NUMERIC / 
    NULLIF(COUNT(*), 0) * 100, 
    2
  ) as conversion_rate
FROM anonymous_sessions;

-- 7. Comments
COMMENT ON TABLE anonymous_sessions IS 'Analytics tracking for anonymous users (privacy-first, minimal data)';
COMMENT ON COLUMN anonymous_sessions.device_id IS 'Unique device identifier for tracking';
COMMENT ON COLUMN anonymous_sessions.session_count IS 'Auto-incremented on each app open';
COMMENT ON COLUMN anonymous_sessions.created_account IS 'TRUE when user registers/logs in';
COMMENT ON COLUMN anonymous_sessions.device_info IS 'Non-sensitive device info (OS, version)';

