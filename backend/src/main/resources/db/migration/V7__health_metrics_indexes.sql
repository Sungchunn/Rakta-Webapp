-- V7: Add indexes for health_logs queries
-- Optimizes range queries on user's historical health data

-- Index for health_logs table (date-based filtering)
CREATE INDEX IF NOT EXISTS idx_health_logs_user_date
    ON health_logs (user_id, date DESC);

-- Note: The unique constraint on (user_id, date) already creates an implicit index,
-- but this explicit index with DESC ordering optimizes the common "last N days" query pattern.
--
-- NOTE: Indexes for daily_metrics and supplement_logs are not included here
-- because those tables are currently managed by Hibernate auto-update, not Flyway.
-- If/when those tables are migrated to Flyway, add their indexes in a new migration.
