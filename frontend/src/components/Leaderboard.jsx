import React, { useState, useEffect } from 'react';
import { fetchLeaderboard, fetchLeaderboardHistory } from '../api';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [weekHistory, setWeekHistory] = useState([]);

  useEffect(() => {
    loadLeaderboard();
    loadHistory();
  }, []);

  const loadLeaderboard = async (week = null, year = null) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchLeaderboard(week, year);
      setLeaderboard(data.leaderboard || []);
    } catch (err) {
      setError('Failed to load leaderboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      const data = await fetchLeaderboardHistory();
      setWeekHistory(data.weeks || []);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  const handleWeekChange = (e) => {
    const selected = weekHistory[e.target.value];
    if (selected) {
      setSelectedWeek(selected);
      loadLeaderboard(selected.week_number, selected.year);
    } else {
      setSelectedWeek(null);
      loadLeaderboard();
    }
  };

  if (loading) {
    return <div className="loading">Loading leaderboard...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h2>Weekly Leaderboard</h2>
        {weekHistory.length > 0 && (
          <div className="week-selector">
            <label htmlFor="week-select">Week: </label>
            <select id="week-select" onChange={handleWeekChange}>
              <option value="">Current Week</option>
              {weekHistory.map((week, idx) => (
                <option key={idx} value={idx}>
                  Week {week.week_number}, {week.year}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {leaderboard.length === 0 ? (
        <p className="no-data">No scores yet for this week. Start playing!</p>
      ) : (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Total Score</th>
              <th>Games Played</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, idx) => (
              <tr key={entry.user_id} className={idx === 0 ? 'winner' : ''}>
                <td className="rank">
                  {idx === 0 && '🥇'}
                  {idx === 1 && '🥈'}
                  {idx === 2 && '🥉'}
                  {idx > 2 && `#${idx + 1}`}
                </td>
                <td className="player-name">{entry.user_name}</td>
                <td className="score">{entry.total_score || 0}</td>
                <td className="games-count">{entry.games_played || 0}</td>
                <td className="game-details">
                  {entry.game_details && entry.game_details.length > 0 ? (
                    <details>
                      <summary>View games</summary>
                      <ul>
                        {entry.game_details.map((game, gIdx) => (
                          <li key={gIdx}>
                            {game.game}: {game.score} pts ({new Date(game.date).toLocaleDateString()})
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : (
                    <span className="no-games">No games</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Leaderboard;
