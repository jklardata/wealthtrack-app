-- Migration: Add age and retirement age to user settings
-- Description: Adds current_age and desired_retirement_age fields to user_settings table

ALTER TABLE user_settings
ADD COLUMN IF NOT EXISTS current_age INTEGER, -- Age in years
ADD COLUMN IF NOT EXISTS desired_retirement_age INTEGER; -- Desired retirement age in years

-- Add defaults
UPDATE user_settings SET current_age = 35 WHERE current_age IS NULL;
UPDATE user_settings SET desired_retirement_age = 65 WHERE desired_retirement_age IS NULL;
