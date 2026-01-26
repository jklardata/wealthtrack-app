-- Migration: Portfolio Optimization Tables
-- Run this in Supabase SQL Editor

-- Portfolio optimization runs
CREATE TABLE portfolio_optimizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  run_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  risk_tolerance TEXT CHECK (risk_tolerance IN ('conservative', 'moderate', 'aggressive')),
  time_horizon INTEGER, -- years
  current_allocation JSONB, -- {"stocks": 0.76, "bonds": 0.16, ...}
  recommended_allocation JSONB,
  expected_return DECIMAL(5,2),
  expected_volatility DECIMAL(5,2),
  sharpe_ratio DECIMAL(5,2),
  rebalancing_trades JSONB,
  applied BOOLEAN DEFAULT FALSE,
  applied_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE portfolio_optimizations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own optimizations"
  ON portfolio_optimizations FOR SELECT
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert own optimizations"
  ON portfolio_optimizations FOR INSERT
  WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own optimizations"
  ON portfolio_optimizations FOR UPDATE
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Index for faster queries
CREATE INDEX idx_portfolio_optimizations_user_id ON portfolio_optimizations(user_id);
CREATE INDEX idx_portfolio_optimizations_run_date ON portfolio_optimizations(run_date DESC);

-- Optional: Detailed holdings (Phase 2)
CREATE TABLE holdings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  symbol TEXT NOT NULL, -- AAPL, VTSAX, etc.
  name TEXT,
  shares DECIMAL(12,6),
  cost_basis DECIMAL(12,2),
  current_price DECIMAL(12,2),
  purchase_date DATE,
  account_type TEXT CHECK (account_type IN ('taxable', '401k', 'ira', 'roth_ira', 'hsa', 'other')),
  asset_class TEXT CHECK (asset_class IN ('stocks', 'bonds', 'cash', 'real_estate', 'crypto', 'other')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE holdings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own holdings"
  ON holdings FOR SELECT
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert own holdings"
  ON holdings FOR INSERT
  WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own holdings"
  ON holdings FOR UPDATE
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can delete own holdings"
  ON holdings FOR DELETE
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Index for faster queries
CREATE INDEX idx_holdings_user_id ON holdings(user_id);

-- Historical optimization results (track performance)
CREATE TABLE optimization_performance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  optimization_id UUID REFERENCES portfolio_optimizations(id) ON DELETE CASCADE,
  as_of_date DATE NOT NULL,
  actual_return DECIMAL(5,2),
  expected_return DECIMAL(5,2),
  tracking_error DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE optimization_performance ENABLE ROW LEVEL SECURITY;

-- RLS Policy (join with optimizations to check user)
CREATE POLICY "Users can view own optimization performance"
  ON optimization_performance FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM portfolio_optimizations po
      WHERE po.id = optimization_performance.optimization_id
      AND po.user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

-- Index
CREATE INDEX idx_optimization_performance_optimization_id ON optimization_performance(optimization_id);

-- Add risk_tolerance to user preferences/settings if not exists
ALTER TABLE user_settings
ADD COLUMN IF NOT EXISTS risk_tolerance TEXT CHECK (risk_tolerance IN ('conservative', 'moderate', 'aggressive')),
ADD COLUMN IF NOT EXISTS risk_score INTEGER,
ADD COLUMN IF NOT EXISTS time_horizon INTEGER;
