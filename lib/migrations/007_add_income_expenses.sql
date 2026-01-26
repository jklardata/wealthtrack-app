-- Migration: Add pre-tax income and monthly expenses columns to net_worth_entries
-- Run this in your Supabase SQL editor

-- Add pre_tax_income column
ALTER TABLE net_worth_entries
ADD COLUMN IF NOT EXISTS pre_tax_income DECIMAL(15,2) DEFAULT 0;

-- Add monthly_expenses column
ALTER TABLE net_worth_entries
ADD COLUMN IF NOT EXISTS monthly_expenses DECIMAL(15,2) DEFAULT 0;

-- Note: The calculated fields (monthly_net_profit, savings_rate, growth metrics)
-- will be computed in the application layer, not stored in the database,
-- since they depend on previous row comparisons.
