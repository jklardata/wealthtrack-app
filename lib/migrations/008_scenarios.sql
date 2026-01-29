-- Migration: Scenarios Table
-- Run this in Supabase SQL Editor
-- Scenarios provide a unified abstraction for financial planning across all tools

CREATE TABLE scenarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_baseline BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT FALSE,

  -- Location Data
  location_city_id TEXT NOT NULL,
  location_city_name TEXT,
  location_country TEXT,
  effective_col_index DECIMAL(6,4),  -- 0.45 to 1.50 (NYC = 1.0)

  -- Income Streams
  primary_income DECIMAL(15,2) DEFAULT 0,           -- Annual gross primary income
  consulting_income DECIMAL(15,2) DEFAULT 0,        -- Annual gross consulting income
  consulting_years INTEGER DEFAULT 0,               -- Bridge years for semi-retirement
  consulting_tax_rate DECIMAL(5,4) DEFAULT 0.25,    -- Tax rate on consulting (0-1)

  -- Expenses
  annual_expenses DECIMAL(15,2) NOT NULL,           -- Location-adjusted annual expenses
  spending_weights JSONB DEFAULT '{"housing":0.35,"food":0.15,"transport":0.10,"healthcare":0.10,"utilities":0.10,"lifestyle":0.20}',

  -- FI Parameters
  withdrawal_rate DECIMAL(5,4) DEFAULT 0.04,        -- Safe withdrawal rate (4% default)
  expected_return DECIMAL(5,4) DEFAULT 0.05,        -- Expected real return (5% default)
  current_net_worth DECIMAL(15,2),                  -- Current portfolio value
  annual_savings DECIMAL(15,2),                     -- Annual savings amount

  -- Derived/Calculated Fields (denormalized for performance)
  annual_withdrawal_requirement DECIMAL(15,2),      -- expenses - net consulting income
  required_net_worth DECIMAL(15,2),                 -- Portfolio needed for FI
  years_to_fi DECIMAL(10,2),                        -- Years until financial independence
  savings_rate DECIMAL(5,4),                        -- Savings as % of income
  fi_score DECIMAL(5,2),                            -- Geo FI Score (0-100)

  -- Portfolio Assumptions (link to portfolio optimizer)
  risk_tolerance TEXT CHECK (risk_tolerance IN ('conservative', 'moderate', 'aggressive')),
  time_horizon INTEGER,                             -- Years until retirement

  -- Metadata
  cloned_from_id UUID REFERENCES scenarios(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own scenarios"
  ON scenarios FOR SELECT
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert own scenarios"
  ON scenarios FOR INSERT
  WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own scenarios"
  ON scenarios FOR UPDATE
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can delete own scenarios"
  ON scenarios FOR DELETE
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Indexes for common queries
CREATE INDEX idx_scenarios_user_id ON scenarios(user_id);
CREATE INDEX idx_scenarios_baseline ON scenarios(user_id) WHERE is_baseline = TRUE;
CREATE INDEX idx_scenarios_active ON scenarios(user_id) WHERE is_active = TRUE;
CREATE INDEX idx_scenarios_city ON scenarios(location_city_id);
CREATE INDEX idx_scenarios_updated ON scenarios(updated_at DESC);

-- Constraint: Only one baseline scenario per user
CREATE UNIQUE INDEX idx_scenarios_unique_baseline
  ON scenarios(user_id)
  WHERE is_baseline = TRUE;

-- Constraint: Only one active scenario per user
CREATE UNIQUE INDEX idx_scenarios_unique_active
  ON scenarios(user_id)
  WHERE is_active = TRUE;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_scenarios_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER scenarios_updated_at
  BEFORE UPDATE ON scenarios
  FOR EACH ROW
  EXECUTE FUNCTION update_scenarios_updated_at();
