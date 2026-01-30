-- Newsletter subscribers table
-- Run this in Supabase SQL Editor

CREATE TABLE newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'landing_page',
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);

-- Enable RLS (optional but recommended)
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow inserts from service role (API)
CREATE POLICY "Service role can insert" ON newsletter_subscribers
  FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "Service role can select" ON newsletter_subscribers
  FOR SELECT TO service_role USING (true);
