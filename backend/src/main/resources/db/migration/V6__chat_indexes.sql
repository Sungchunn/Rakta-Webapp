-- V6: Add indexes for chat message queries
-- Optimizes retrieval of messages by session, ordered by creation time

CREATE INDEX IF NOT EXISTS idx_chat_messages_session_created 
    ON chat_messages (session_id, created_at ASC);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_created 
    ON chat_sessions (user_id, created_at DESC);

-- For idempotency lookups if we ever persist them to DB
-- Currently using Caffeine in-memory cache, but this is future-proofing
