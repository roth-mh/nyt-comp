const express = require('express');
const router = express.Router();
const db = require('../db');

// Get current week's leaderboard
router.get('/', async (req, res) => {
  try {
    const { week, year } = req.query;
    
    let query = `
      SELECT 
        user_id,
        user_name,
        year,
        week_number,
        total_score,
        games_played,
        game_details
      FROM weekly_leaderboard
    `;
    
    const params = [];
    
    if (year && week) {
      query += ' WHERE year = $1 AND week_number = $2';
      params.push(parseInt(year), parseInt(week));
    } else {
      // Get current week
      query += ` 
        WHERE year = EXTRACT(YEAR FROM CURRENT_DATE)
        AND week_number = EXTRACT(WEEK FROM CURRENT_DATE)
      `;
    }
    
    query += ' ORDER BY total_score DESC NULLS LAST';
    
    const result = await db.query(query, params);
    
    res.json({
      leaderboard: result.rows,
      week: week || null,
      year: year || null,
    });
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Get historical leaderboards
router.get('/history', async (req, res) => {
  try {
    const query = `
      SELECT DISTINCT year, week_number
      FROM weekly_leaderboard
      WHERE year IS NOT NULL AND week_number IS NOT NULL
      ORDER BY year DESC, week_number DESC
      LIMIT 20
    `;
    
    const result = await db.query(query);
    
    res.json({
      weeks: result.rows,
    });
  } catch (err) {
    console.error('Error fetching history:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

module.exports = router;
