-- V9: Gamification schema - Badges and User Achievements
-- Enables milestone tracking feature from feature list

-- Badge definitions (what achievements exist)
CREATE TABLE badges (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url VARCHAR(255),
    category VARCHAR(50), -- 'DONATION', 'STREAK', 'COMMUNITY', 'HEALTH', 'SPECIAL'
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User earned badges (junction table)
CREATE TABLE user_badges (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id BIGINT NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    context VARCHAR(255),
    is_viewed BOOLEAN DEFAULT FALSE,
    UNIQUE(user_id, badge_id)
);

-- Indexes for efficient queries
CREATE INDEX idx_user_badges_user ON user_badges (user_id);
CREATE INDEX idx_user_badges_badge ON user_badges (badge_id);
CREATE INDEX idx_badges_category ON badges (category);

-- Seed initial badges
INSERT INTO badges (code, name, description, category, display_order) VALUES
    ('FIRST_DONATION', 'First Drop', 'Completed your first blood donation', 'DONATION', 1),
    ('DONATION_5', 'Regular Donor', 'Completed 5 donations', 'DONATION', 2),
    ('DONATION_10', 'Dedicated Donor', 'Completed 10 donations', 'DONATION', 3),
    ('DONATION_25', 'Silver Lifesaver', 'Completed 25 donations', 'DONATION', 4),
    ('DONATION_50', 'Gold Lifesaver', 'Completed 50 donations', 'DONATION', 5),
    ('STREAK_7', 'Week Warrior', 'Logged health data for 7 consecutive days', 'STREAK', 1),
    ('STREAK_30', 'Monthly Master', 'Logged health data for 30 consecutive days', 'STREAK', 2),
    ('PROFILE_COMPLETE', 'Ready to Give', 'Completed your health profile', 'HEALTH', 1),
    ('FIRST_FOLLOWER', 'Community Member', 'Gained your first follower', 'COMMUNITY', 1);
