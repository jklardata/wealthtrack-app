-- Migration: Add checklist_progress to user_settings
-- Stores the freelance checklist checked items as a JSONB array of string keys

ALTER TABLE user_settings
ADD COLUMN IF NOT EXISTS checklist_progress JSONB DEFAULT '[]'::jsonb;
