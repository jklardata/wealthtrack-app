-- Migration: Add commodities column to net_worth_entries
-- Run this in your Supabase SQL editor

-- Add commodities column
ALTER TABLE net_worth_entries
ADD COLUMN IF NOT EXISTS commodities DECIMAL(15,2) DEFAULT 0;

-- Update total_assets to be a generated column that includes commodities
-- First drop the column if it exists as a generated column
-- Then recreate it

-- Note: If total_assets is a regular column, you'll need to update it manually
-- or set up a trigger. For now, we'll update existing rows:

UPDATE net_worth_entries
SET total_assets = COALESCE(stocks, 0) + COALESCE(bonds, 0) + COALESCE(cash, 0) +
                   COALESCE(real_estate, 0) + COALESCE(points_value, 0) +
                   COALESCE(other_assets, 0) + COALESCE(commodities, 0)
WHERE commodities IS NULL OR commodities = 0;

-- Set default for commodities
ALTER TABLE net_worth_entries
ALTER COLUMN commodities SET DEFAULT 0;
