// frontend/src/pages/HomePage.js
import React from 'react';

const HomePage = ({ currentUser, onNavigate, language, getTranslation }) => {
  // This check is good and should prevent most errors if currentUser is null
  if (!currentUser) {
    return <div className="loading-overlay"><div className="loading-content"><h1>🎓 {getTranslation('platform')}</h1><p>{getTranslation('loading')}</p><div className="loading-spinner"></div></div></div>;
  }

  return (
    <div className="home-page-container"> {/* Main container for HomePage */}
      <div className="home-welcome-section">
        <h1 className="home-welcome-title">
          {getTranslation('welcomeBack')}, {currentUser.name}! 🎉
        </h1>
        
        <p className="home-welcome-subtitle">
          {getTranslation('readyToContinue')}
        </p>
        
        <p className="home-user-details">
          {getTranslation('class')} {currentUser.grade} • {currentUser.school}
        </p>
      </div>

      <div className="home-action-buttons">
        <button 
          className="home-action-button primary"
          onClick={() => onNavigate('lessons')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          🚀 {getTranslation('continueLearning')}
        </button>
        
        <button 
          className="home-action-button secondary"
          onClick={() => onNavigate('games')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          🎮 {getTranslation('playGames')}
        </button>
      </div>

      <div className="home-stats-grid">
        <div 
          className="home-stat-card"
          onClick={() => onNavigate('progress')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <span className="home-stat-icon">📊</span>
          <h3 className="home-stat-title">
            {getTranslation('yourProgress')}
          </h3>
          <div className="home-stat-value">
            {(currentUser?.completedLessons || []).length} {/* ADDED OPTIONAL CHAINING HERE */}
          </div>
          <p className="home-stat-description">
            {getTranslation('lessonsCompleted')}
          </p>
          <p className="home-stat-description">
            {getTranslation('points')}: {currentUser?.points || 0} {/* ADDED OPTIONAL CHAINING HERE */}
          </p>
        </div>
        
        <div 
          className="home-stat-card"
          onClick={() => onNavigate('games')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <span className="home-stat-icon">🎮</span>
          <h3 className="home-stat-title">
            {getTranslation('gamesPlayed')}
          </h3>
          <div className="home-stat-value">
            {(currentUser?.gamesPlayed || []).length} {/* ADDED OPTIONAL CHAINING HERE */}
          </div>
          <p className="home-stat-description">
            {getTranslation('totalGames')}
          </p>
          <p className="home-stat-description">
            {getTranslation('streak')}: {currentUser?.streak || 1} {getTranslation('days')} 🔥 {/* ADDED OPTIONAL CHAINING HERE */}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
