-- Migration: Create user_logins table
-- Tracks when users log in — user_id, timestamp, IP, and user agent

CREATE TABLE IF NOT EXISTS user_logins (
  id             UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        TEXT        NOT NULL,
  email          TEXT,
  logged_in_at   TIMESTAMPTZ DEFAULT NOW(),
  ip_address     TEXT,
  user_agent     TEXT
);

CREATE INDEX IF NOT EXISTS user_logins_user_id_idx     ON user_logins(user_id);
CREATE INDEX IF NOT EXISTS user_logins_logged_in_at_idx ON user_logins(logged_in_at DESC);

-- Admin-only access via service role key
ALTER TABLE user_logins ENABLE ROW LEVEL SECURITY;
