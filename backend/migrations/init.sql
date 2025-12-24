-- Initialize NYT Competition Database

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Games table
CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    max_score INTEGER,
    active BOOLEAN DEFAULT true
);

-- Scores table
CREATE TABLE IF NOT EXISTS scores (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    completed_at DATE NOT NULL,
    week_number INTEGER NOT NULL,
    year INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, game_id, completed_at)
);

-- Weekly leaderboard view
CREATE OR REPLACE VIEW weekly_leaderboard AS
SELECT 
    u.id as user_id,
    u.name as user_name,
    s.year,
    s.week_number,
    SUM(s.score) as total_score,
    COUNT(DISTINCT s.game_id) as games_played,
    json_agg(
        json_build_object(
            'game', g.name,
            'score', s.score,
            'date', s.completed_at
        ) ORDER BY s.completed_at
    ) as game_details
FROM users u
LEFT JOIN scores s ON u.id = s.user_id
LEFT JOIN games g ON s.game_id = g.id
WHERE u.active = true
GROUP BY u.id, u.name, s.year, s.week_number
ORDER BY s.year DESC, s.week_number DESC, total_score DESC;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_scores_user_id ON scores(user_id);
CREATE INDEX IF NOT EXISTS idx_scores_game_id ON scores(game_id);
CREATE INDEX IF NOT EXISTS idx_scores_week ON scores(year, week_number);
CREATE INDEX IF NOT EXISTS idx_scores_date ON scores(completed_at);
