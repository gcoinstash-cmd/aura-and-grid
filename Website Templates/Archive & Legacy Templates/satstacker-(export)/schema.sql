-- ====================================================================
-- SatStacker Relational Database Schema (PostgreSQL)
-- Optimized for high-throughput, precision storage and fast lookups.
-- ====================================================================

-- 1. Create Tier Enumeration
CREATE TYPE user_tier AS ENUM ('free', 'pro', 'whale');

-- 2. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    tier user_tier NOT NULL DEFAULT 'free',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 3. Streaks Stability & Freeze Tracker Table
CREATE TABLE user_streaks (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    current_streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    freeze_tokens_available INTEGER NOT NULL DEFAULT 0,
    last_stack_at TIMESTAMP WITH TIME ZONE,
    streak_frozen_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 4. High Precision Portfolios Table (NUMERIC to avoid floating-point limits)
CREATE TABLE portfolios (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    -- NUMERIC(16,8) allows up to 99,999,999.99999999 BTC cleanly
    total_btc NUMERIC(16,8) NOT NULL DEFAULT 0.00000000,
    -- NUMERIC(20,0) safely stores exact integer Satoshi counts without floating point issues
    total_sats NUMERIC(20,0) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 5. High-Performance B-Tree Indexes (Targeting <50ms Handshakes)
CREATE INDEX idx_users_id_tier ON users(id, tier);
CREATE INDEX idx_portfolios_user_id ON portfolios(user_id);

-- 6. PL/pgSQL Database Trigger for Multi-Threaded BTC/SATS Balance Symmetry
CREATE OR REPLACE FUNCTION sync_btc_to_sats()
RETURNS TRIGGER AS $$
BEGIN
    -- 1 BTC = 100,000,000 Satoshis (10^8 scaling ratio)
    NEW.total_sats := NEW.total_btc * 100000000;
    NEW.updated_at := CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_sync_btc_to_sats
BEFORE INSERT OR UPDATE OF total_btc ON portfolios
FOR EACH ROW
EXECUTE FUNCTION sync_btc_to_sats();

-- Simple trigger to automatically update updated_at timestamps on core users table
CREATE OR REPLACE FUNCTION update_modified_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_users_modified_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_modified_timestamp();

-- ====================================================================
-- 7. ADHD/OCD Streak Stability Automation & Novelty Protection Engine
-- ====================================================================

-- Streak Validation and Automatic Shield Token Mitigation Function
CREATE OR REPLACE FUNCTION validate_and_process_user_streak(target_user_id UUID)
RETURNS VOID AS $$
DECLARE
    v_last_stack_at TIMESTAMP WITH TIME ZONE;
    v_streak_frozen_until TIMESTAMP WITH TIME ZONE;
    v_tier user_tier;
    v_freeze_tokens INTEGER;
    v_delta INTERVAL;
BEGIN
    -- Retrieve target user tier and streak logs
    SELECT u.tier, s.last_stack_at, s.streak_frozen_until, s.freeze_tokens_available
    INTO v_tier, v_last_stack_at, v_streak_frozen_until, v_freeze_tokens
    FROM users u
    JOIN user_streaks s ON u.id = s.user_id
    WHERE u.id = target_user_id;

    -- If no metadata exists or user has never stacked, ignore evaluation
    IF NOT FOUND OR v_last_stack_at IS NULL THEN
        RETURN;
    END IF;

    -- If streak is currently frozen under an active safety duration, skip reset procedures
    IF v_streak_frozen_until IS NOT NULL AND v_streak_frozen_until > CURRENT_TIMESTAMP THEN
        RETURN;
    END IF;

    -- Calculate duration delta since last recorded stack event
    v_delta := CURRENT_TIMESTAMP - v_last_stack_at;

    -- 1. If time delta is within 24 hours, the streak is healthy and active.
    IF v_delta <= INTERVAL '24 hours' THEN
        RETURN;

    -- 2. If time delta is between 24 and 48 hours (user missed a daily window)
    ELSIF v_delta > INTERVAL '24 hours' AND v_delta <= INTERVAL '48 hours' THEN
        -- Check if premium tier has freeze safety options remaining
        IF (v_tier = 'pro' OR v_tier = 'whale') AND v_freeze_tokens > 0 THEN
            -- Consume 1 token to protect streak, extending lock window for next 24 hours
            UPDATE user_streaks
            SET freeze_tokens_available = freeze_tokens_available - 1,
                streak_frozen_until = CURRENT_TIMESTAMP + INTERVAL '24 hours',
                updated_at = CURRENT_TIMESTAMP
            WHERE user_id = target_user_id;
        ELSE
            -- Otherwise, break and hard reset streak back to 0
            UPDATE user_streaks
            SET current_streak = 0,
                updated_at = CURRENT_TIMESTAMP
            WHERE user_id = target_user_id;
        END IF;

    -- 3. If time delta exceeds 48 hours
    ELSIF v_delta > INTERVAL '48 hours' THEN
        -- Hard reset if no tokens exist to defend the delay
        IF v_freeze_tokens = 0 OR v_tier = 'free' THEN
            UPDATE user_streaks
            SET current_streak = 0,
                updated_at = CURRENT_TIMESTAMP
            WHERE user_id = target_user_id;
        END IF;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Worker routine to evaluate all active user streaks
CREATE OR REPLACE FUNCTION process_all_user_streaks()
RETURNS VOID AS $$
DECLARE
    user_rec RECORD;
BEGIN
    FOR user_rec IN SELECT user_id FROM user_streaks LOOP
        PERFORM validate_and_process_user_streak(user_rec.user_id);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 8. Register pg_cron Schedule Command (Runs nightly at 03:00 AM UTC)
-- Note: Requires active pg_cron extension on client cloud database
SELECT cron.schedule(
    'process-user-streaks-nightly',
    '0 3 * * *',
    'SELECT process_all_user_streaks();'
);
