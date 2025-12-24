-- Seed dummy data for testing

-- Insert games
INSERT INTO games (name, description, max_score, active) VALUES
    ('Wordle', 'Daily word puzzle', 6, true),
    ('Connections', 'Group words by theme', 4, true),
    ('Strands', 'Find themed words', 100, true),
    ('Mini Crossword', 'Quick crossword puzzle', 300, true)
ON CONFLICT (name) DO NOTHING;

-- Insert sample users
INSERT INTO users (name, email, active) VALUES
    ('Alice Johnson', 'alice@example.com', true),
    ('Bob Smith', 'bob@example.com', true),
    ('Charlie Davis', 'charlie@example.com', true),
    ('Diana Wilson', 'diana@example.com', true)
ON CONFLICT (name) DO NOTHING;

-- Insert sample scores for current week
-- Using current date for week calculation
WITH current_week AS (
    SELECT 
        EXTRACT(WEEK FROM CURRENT_DATE) as week_num,
        EXTRACT(YEAR FROM CURRENT_DATE) as year_num
)
INSERT INTO scores (user_id, game_id, score, completed_at, week_number, year) 
SELECT 
    u.id,
    g.id,
    CASE 
        WHEN g.name = 'Wordle' THEN (RANDOM() * 6)::INTEGER + 1
        WHEN g.name = 'Connections' THEN (RANDOM() * 4)::INTEGER
        WHEN g.name = 'Strands' THEN (RANDOM() * 50)::INTEGER + 50
        WHEN g.name = 'Mini Crossword' THEN (RANDOM() * 200)::INTEGER + 100
    END as score,
    CURRENT_DATE - (RANDOM() * 3)::INTEGER as completed,
    cw.week_num,
    cw.year_num
FROM users u
CROSS JOIN games g
CROSS JOIN current_week cw
WHERE RANDOM() > 0.2  -- 80% chance of having a score
ON CONFLICT (user_id, game_id, completed_at) DO NOTHING;
