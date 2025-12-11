-- V8: Add check constraint to prevent self-follows at database level
-- Defense in depth: service layer already prevents this, but DB constraint ensures data integrity

ALTER TABLE user_follows
ADD CONSTRAINT chk_no_self_follow CHECK (follower_id <> following_id);

-- Add index for efficient follower/following lookups
CREATE INDEX IF NOT EXISTS idx_user_follows_follower ON user_follows (follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following ON user_follows (following_id);
