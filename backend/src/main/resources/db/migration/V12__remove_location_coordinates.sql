-- Remove latitude and longitude columns from donation_locations table
-- These columns are no longer needed as we're not displaying maps in post feeds

ALTER TABLE donation_locations DROP COLUMN IF EXISTS latitude;
ALTER TABLE donation_locations DROP COLUMN IF EXISTS longitude;
