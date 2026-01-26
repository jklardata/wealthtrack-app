-- Migration: Add credit cards sheet support to user_settings
-- Run this in Supabase SQL Editor

-- Add credit cards sheet columns to user_settings
ALTER TABLE user_settings
ADD COLUMN IF NOT EXISTS credit_cards_sheet_id TEXT,
ADD COLUMN IF NOT EXISTS credit_cards_last_sync_at TIMESTAMP WITH TIME ZONE;

-- Add comment for documentation
COMMENT ON COLUMN user_settings.credit_cards_sheet_id IS 'Google Sheets ID for credit cards tracking';
COMMENT ON COLUMN user_settings.credit_cards_last_sync_at IS 'Last sync timestamp for credit cards data';
