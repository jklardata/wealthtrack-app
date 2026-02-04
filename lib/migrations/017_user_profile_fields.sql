-- Migration: Add comprehensive user profile fields
-- Description: Adds personal information fields for better financial planning

ALTER TABLE user_settings
-- Basic Demographics
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS marital_status TEXT CHECK (marital_status IN ('single', 'married', 'divorced', 'widowed', 'domestic_partner')),
ADD COLUMN IF NOT EXISTS number_of_dependents INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS state_of_residence TEXT,

-- Tax Information
ADD COLUMN IF NOT EXISTS tax_filing_status TEXT CHECK (tax_filing_status IN ('single', 'married_filing_jointly', 'married_filing_separately', 'head_of_household')),

-- Financial Planning
ADD COLUMN IF NOT EXISTS risk_tolerance TEXT CHECK (risk_tolerance IN ('conservative', 'moderate', 'aggressive')),
ADD COLUMN IF NOT EXISTS life_expectancy_assumption INTEGER DEFAULT 95,

-- Employment & Contact
ADD COLUMN IF NOT EXISTS employer_name TEXT,
ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- Add comments for clarity
COMMENT ON COLUMN user_settings.date_of_birth IS 'User date of birth (supplements current_age with more precision)';
COMMENT ON COLUMN user_settings.marital_status IS 'Marital status: single, married, divorced, widowed, domestic_partner';
COMMENT ON COLUMN user_settings.tax_filing_status IS 'IRS filing status: single, married_filing_jointly, married_filing_separately, head_of_household';
COMMENT ON COLUMN user_settings.risk_tolerance IS 'Investment risk tolerance: conservative, moderate, aggressive';
COMMENT ON COLUMN user_settings.life_expectancy_assumption IS 'Assumed life expectancy for retirement planning (default: 95)';
