-- Migration: Income & Expense Tracking for Projected Net Worth
-- Description: Creates tables for tracking income sources and expense categories

-- Income Sources Table
CREATE TABLE IF NOT EXISTS income_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('work', 'social_security', 'passive', 'windfall')),

  -- Common fields
  name TEXT NOT NULL,
  annual_amount DECIMAL(15,2) NOT NULL,

  -- Age/timing (stored as total months)
  start_age_months INTEGER,
  stop_age_months INTEGER,

  -- Work/Passive specific
  growth_rate DECIMAL(5,4), -- e.g., 0.03 = 3% annual
  pretax_deductions DECIMAL(15,2) DEFAULT 0, -- 401k, HSA, FSA, IRA

  -- Social Security specific
  claiming_age_months INTEGER,
  auto_estimate BOOLEAN DEFAULT false,
  estimated_benefit DECIMAL(15,2),

  -- Windfall specific
  windfall_year INTEGER,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_income_sources_user ON income_sources(user_id);
CREATE INDEX IF NOT EXISTS idx_income_sources_source_type ON income_sources(user_id, source_type);

-- Expense Categories Table
CREATE TABLE IF NOT EXISTS expense_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  category_type TEXT NOT NULL CHECK (category_type IN ('recurring', 'onetime', 'medical_pre65', 'medicare')),

  name TEXT NOT NULL,
  monthly_amount DECIMAL(15,2) NOT NULL,

  -- One-time expense age range
  start_age_months INTEGER,
  end_age_months INTEGER,

  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_expense_categories_user ON expense_categories(user_id);
CREATE INDEX IF NOT EXISTS idx_expense_categories_category_type ON expense_categories(user_id, category_type);

-- Add RLS (Row Level Security) policies
ALTER TABLE income_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;

-- Income sources policies
CREATE POLICY "Users can view their own income sources"
  ON income_sources FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own income sources"
  ON income_sources FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own income sources"
  ON income_sources FOR UPDATE
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own income sources"
  ON income_sources FOR DELETE
  USING (auth.uid()::text = user_id);

-- Expense categories policies
CREATE POLICY "Users can view their own expense categories"
  ON expense_categories FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own expense categories"
  ON expense_categories FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own expense categories"
  ON expense_categories FOR UPDATE
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own expense categories"
  ON expense_categories FOR DELETE
  USING (auth.uid()::text = user_id);
