-- Migration: Add commodities column to net_worth_entries
-- Run this in your Supabase SQL editor

-- Add commodities column
ALTER TABLE net_worth_entries
ADD COLUMN IF NOT EXISTS commodities DECIMAL(15,2) DEFAULT 0;

-- Note: total_assets is a generated column, so it will need to be recreated
-- to include commodities. Run these commands:

-- Step 1: Drop the generated column
ALTER TABLE net_worth_entries DROP COLUMN IF EXISTS total_assets;

-- Step 2: Recreate it with commodities included
ALTER TABLE net_worth_entries
ADD COLUMN total_assets DECIMAL(15,2) GENERATED ALWAYS AS (
  COALESCE(stocks, 0) + COALESCE(bonds, 0) + COALESCE(cash, 0) +
  COALESCE(real_estate, 0) + COALESCE(points_value, 0) +
  COALESCE(commodities, 0) + COALESCE(other_assets, 0)
) STORED;

-- Step 3: Recreate net_worth generated column if it also needs updating
ALTER TABLE net_worth_entries DROP COLUMN IF EXISTS net_worth;

ALTER TABLE net_worth_entries
ADD COLUMN net_worth DECIMAL(15,2) GENERATED ALWAYS AS (
  COALESCE(stocks, 0) + COALESCE(bonds, 0) + COALESCE(cash, 0) +
  COALESCE(real_estate, 0) + COALESCE(points_value, 0) +
  COALESCE(commodities, 0) + COALESCE(other_assets, 0) - COALESCE(total_debts, 0)
) STORED;
