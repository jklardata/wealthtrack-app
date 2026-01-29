-- Migration: Add scenario references to user_settings
-- Run this in Supabase SQL Editor
-- Links active and baseline scenarios to user settings for cross-tool persistence

-- Add scenario reference columns
ALTER TABLE user_settings
ADD COLUMN IF NOT EXISTS active_scenario_id UUID REFERENCES scenarios(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS baseline_scenario_id UUID REFERENCES scenarios(id) ON DELETE SET NULL;

-- Index for scenario lookups
CREATE INDEX IF NOT EXISTS idx_user_settings_active_scenario ON user_settings(active_scenario_id);
CREATE INDEX IF NOT EXISTS idx_user_settings_baseline_scenario ON user_settings(baseline_scenario_id);

-- Link portfolio optimizations to scenarios (optional: run after portfolio optimizer uses scenarios)
ALTER TABLE portfolio_optimizations
ADD COLUMN IF NOT EXISTS scenario_id UUID REFERENCES scenarios(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_portfolio_optimizations_scenario ON portfolio_optimizations(scenario_id);
