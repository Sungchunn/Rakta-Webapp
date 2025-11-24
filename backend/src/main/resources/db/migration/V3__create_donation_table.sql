CREATE TABLE donations (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    donation_date DATE NOT NULL,
    donation_type VARCHAR(50) NOT NULL,
    location_id BIGINT REFERENCES donation_locations(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
