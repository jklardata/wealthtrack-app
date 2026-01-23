-- Run this in your Supabase SQL Editor
-- Migration: Create net_worth_entries table

-- Net Worth Entries table
CREATE TABLE net_worth_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,  -- Clerk user ID
  date DATE NOT NULL,
  stocks DECIMAL(15, 2) DEFAULT 0,
  bonds DECIMAL(15, 2) DEFAULT 0,
  cash DECIMAL(15, 2) DEFAULT 0,
  real_estate DECIMAL(15, 2) DEFAULT 0,
  points_value DECIMAL(15, 2) DEFAULT 0,
  other_assets DECIMAL(15, 2) DEFAULT 0,
  total_assets DECIMAL(15, 2) GENERATED ALWAYS AS (stocks + bonds + cash + real_estate + points_value + other_assets) STORED,
  total_debts DECIMAL(15, 2) DEFAULT 0,
  net_worth DECIMAL(15, 2) GENERATED ALWAYS AS (stocks + bonds + cash + real_estate + points_value + other_assets - total_debts) STORED,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)  -- One entry per user per date
);

-- Enable Row Level Security
ALTER TABLE net_worth_entries ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only access their own entries
CREATE POLICY "Users can view own net worth entries" ON net_worth_entries
  FOR SELECT USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert own net worth entries" ON net_worth_entries
  FOR INSERT WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own net worth entries" ON net_worth_entries
  FOR UPDATE USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can delete own net worth entries" ON net_worth_entries
  FOR DELETE USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Create indexes for performance
CREATE INDEX idx_net_worth_entries_user_id ON net_worth_entries(user_id);
CREATE INDEX idx_net_worth_entries_date ON net_worth_entries(date DESC);
CREATE INDEX idx_net_worth_entries_user_date ON net_worth_entries(user_id, date DESC);
