-- V10: Donation performance index
-- Critical for eligibility calculation queries ("last donation" lookups)

-- Composite index for fast "last donation by user" queries
-- DESC ordering optimizes the common pattern: ORDER BY donation_date DESC LIMIT 1
CREATE INDEX IF NOT EXISTS idx_donations_user_date 
    ON donations (user_id, donation_date DESC);

-- Index on donation type for filtering queries
CREATE INDEX IF NOT EXISTS idx_donations_type
    ON donations (donation_type);
