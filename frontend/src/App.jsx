import React, { useState } from 'react';
import Leaderboard from './components/Leaderboard';
import Settings from './components/Settings';

function App() {
  const [activeTab, setActiveTab] = useState('leaderboard');

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎮 NYT Games Weekly Competition</h1>
        <p className="subtitle">Compete with friends on Wordle, Connections, Strands, and Mini Crossword</p>
      </header>

      <nav className="nav-tabs">
        <button
          className={`tab ${activeTab === 'leaderboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaderboard')}
        >
          🏆 Leaderboard
        </button>
        <button
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Settings
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'leaderboard' && <Leaderboard />}
        {activeTab === 'settings' && <Settings />}
      </main>

      <footer className="app-footer">
        <p>Track your NYT Games scores and compete with friends!</p>
      </footer>
    </div>
  );
}

export default App;
