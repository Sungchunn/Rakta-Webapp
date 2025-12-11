-- V7: Add indexes for daily metrics queries
-- Optimizes range queries on user's historical health data

-- Composite index for range queries (date-based filtering)
CREATE INDEX IF NOT EXISTS idx_daily_metrics_user_date 
    ON daily_metrics (user_id, date DESC);

-- Index for health_logs table as well (similar pattern)
CREATE INDEX IF NOT EXISTS idx_health_logs_user_date 
    ON health_logs (user_id, date DESC);

-- Index for supplement logs (recent supplements lookup)
CREATE INDEX IF NOT EXISTS idx_supplement_logs_user_logged_at
    ON supplement_logs (user_id, logged_at DESC);

-- Note: The unique constraint on (user_id, date) already creates an implicit index,
-- but this explicit index with DESC ordering optimizes the common "last N days" query pattern.
