-- Migration: Scenario Comparisons Table
-- Run this in Supabase SQL Editor
-- Stores cached comparison results between two scenarios (Move vs Stay analysis)

CREATE TABLE scenario_comparisons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  baseline_scenario_id UUID NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
  compare_scenario_id UUID NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,

  -- Comparison Metrics (deltas: compare - baseline)
  delta_years_to_fi DECIMAL(10,2),                  -- Positive = takes longer, Negative = faster
  delta_required_net_worth DECIMAL(15,2),           -- Positive = need more, Negative = need less
  delta_annual_expenses DECIMAL(15,2),              -- Positive = costs more, Negative = costs less
  delta_savings_rate DECIMAL(5,4),                  -- Positive = higher rate, Negative = lower rate
  delta_fi_score DECIMAL(5,2),                      -- Positive = better score, Negative = worse score

  -- Semi-retirement feasibility analysis
  semi_retirement_feasible BOOLEAN,                 -- Can consulting cover expenses?
  consulting_covers_percentage DECIMAL(5,4),        -- What % of expenses consulting covers

  -- Generated insight text
  insight_text TEXT,                                -- e.g., "This move buys you ~5 years of FI"

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure unique comparison pairs
  UNIQUE(baseline_scenario_id, compare_scenario_id)
);

-- Enable Row Level Security
ALTER TABLE scenario_comparisons ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own comparisons"
  ON scenario_comparisons FOR SELECT
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert own comparisons"
  ON scenario_comparisons FOR INSERT
  WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own comparisons"
  ON scenario_comparisons FOR UPDATE
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can delete own comparisons"
  ON scenario_comparisons FOR DELETE
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Indexes for common queries
CREATE INDEX idx_scenario_comparisons_user_id ON scenario_comparisons(user_id);
CREATE INDEX idx_scenario_comparisons_baseline ON scenario_comparisons(baseline_scenario_id);
CREATE INDEX idx_scenario_comparisons_compare ON scenario_comparisons(compare_scenario_id);
