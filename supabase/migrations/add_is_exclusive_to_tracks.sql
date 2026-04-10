-- Add is_exclusive flag to tracks table
-- Run this in Supabase SQL Editor after unpausing the project

ALTER TABLE tracks
ADD COLUMN IF NOT EXISTS is_exclusive BOOLEAN NOT NULL DEFAULT false;

-- Index for filtering exclusive vs standard tracks
CREATE INDEX IF NOT EXISTS idx_tracks_is_exclusive ON tracks (is_exclusive);
