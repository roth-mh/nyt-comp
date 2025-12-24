/**
 * ETL (Extract, Transform, Load) Pipeline for NYT Games
 * 
 * This module handles extracting game scores from NYT and loading them into the database.
 * It can be run as a standalone script or imported and called programmatically.
 */

const db = require('./db');
require('dotenv').config();

/**
 * Extract scores from NYT Games API
 * In a real implementation, this would:
 * 1. Use the NYT_COOKIE from environment
 * 2. Fetch data from NYT's internal APIs
 * 3. Parse the response and extract scores
 * 
 * For now, this is a stub that would need to be implemented with actual NYT API calls.
 */
async function extractScores() {
  console.log('ETL: Extracting scores from NYT...');
  
  // Stub: In production, this would fetch from NYT APIs
  // Example API endpoint: https://www.nytimes.com/svc/games/state/
  // Requires authentication via NYT_COOKIE
  
  if (!process.env.NYT_COOKIE) {
    console.warn('Warning: NYT_COOKIE not set. Cannot fetch real data.');
    console.log('To enable real data extraction, set NYT_COOKIE in your .env file');
    return [];
  }
  
  // Placeholder for actual API calls
  // const response = await fetch('https://www.nytimes.com/svc/games/state/', {
  //   headers: {
  //     'Cookie': process.env.NYT_COOKIE
  //   }
  // });
  
  return [];
}

/**
 * Transform raw NYT data into database format
 */
function transformScores(rawData) {
  console.log('ETL: Transforming data...');
  
  // Transform logic would go here
  // Convert NYT format to our database schema
  
  return rawData.map(item => ({
    user_id: item.userId,
    game_id: item.gameId,
    score: item.score,
    completed_at: item.date,
    week_number: getWeekNumber(new Date(item.date)),
    year: new Date(item.date).getFullYear(),
  }));
}

/**
 * Load scores into the database
 */
async function loadScores(scores) {
  console.log(`ETL: Loading ${scores.length} scores into database...`);
  
  if (scores.length === 0) {
    console.log('No scores to load.');
    return { inserted: 0, updated: 0 };
  }
  
  let inserted = 0;
  let updated = 0;
  
  for (const score of scores) {
    try {
      const query = `
        INSERT INTO scores (user_id, game_id, score, completed_at, week_number, year)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (user_id, game_id, completed_at) 
        DO UPDATE SET score = EXCLUDED.score
        RETURNING (xmax = 0) AS inserted
      `;
      
      const result = await db.query(query, [
        score.user_id,
        score.game_id,
        score.score,
        score.completed_at,
        score.week_number,
        score.year,
      ]);
      
      if (result.rows[0].inserted) {
        inserted++;
      } else {
        updated++;
      }
    } catch (err) {
      console.error('Error loading score:', err);
    }
  }
  
  return { inserted, updated };
}

/**
 * Get ISO week number for a date
 */
function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

/**
 * Run the complete ETL pipeline
 */
async function runOnce() {
  console.log('Starting ETL process...');
  console.log(`Timestamp: ${new Date().toISOString()}`);
  
  try {
    // Extract
    const rawData = await extractScores();
    
    // Transform
    const transformedScores = transformScores(rawData);
    
    // Load
    const result = await loadScores(transformedScores);
    
    console.log('ETL process completed successfully!');
    console.log(`Results: ${result.inserted} inserted, ${result.updated} updated`);
    
    return result;
  } catch (err) {
    console.error('ETL process failed:', err);
    throw err;
  }
}

// If running as a script (node src/etl.js)
if (require.main === module) {
  runOnce()
    .then(() => {
      console.log('ETL script finished.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('ETL script failed:', err);
      process.exit(1);
    });
}

// Export for use in other modules
module.exports = {
  runOnce,
  extractScores,
  transformScores,
  loadScores,
};
