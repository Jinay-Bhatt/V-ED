// frontend/src/pages/GamesPage.js
import React, { useState, useEffect, useCallback } from 'react';

const GamesPage = ({ currentUser, appData, playGame, language, getTranslation }) => {
  const [filteredGames, setFilteredGames] = useState([]);
  const [subjectFilter, setSubjectFilter] = useState('');

  const getGameIcon = useCallback((game) => {
    const iconMap = {
      'math_quiz_8': '🚀',
      'science_experiment_8': '💡',
      'english_word_game_8': '📝',
      'hindi_story_game_8': '📚',
      'social_history_game_8': '🏛️',
      'math_puzzle_8': '🧩',
      'science_lab_8': '🔬',
      'english_story_8': '📖',
      'hindi_vocab_8': '✍️',
      'social_map_game_8': '🗺️'
    };
    return iconMap[game.id] || game.icon || '🎮'; 
  }, []);

  const filterAndSortGames = useCallback(() => {
    if (!currentUser || !appData?.games) {
      setFilteredGames([]);
      return;
    }

    // Map for translations
    let gamesToDisplay = appData.games.map(game => ({
      ...game,
      title: getTranslation(game.title),
      description: getTranslation(game.description)
    }));

    // Apply subject filter
    if (subjectFilter) {
      gamesToDisplay = gamesToDisplay.filter(
        game => game.subject.toLowerCase() === subjectFilter.toLowerCase()
      );
    }

    // Sort games: developed ones (math AND science) first
    gamesToDisplay.sort((a, b) => {
      const aDeveloped = a.subject === 'math' || a.subject === 'science';
      const bDeveloped = b.subject === 'math' || b.subject === 'science';
      
      if (aDeveloped && !bDeveloped) return -1;
      if (!aDeveloped && bDeveloped) return 1;
      return 0;
    });

    setFilteredGames(gamesToDisplay);
  }, [currentUser, appData?.games, subjectFilter, getTranslation]);

  useEffect(() => {
    filterAndSortGames();
  }, [filterAndSortGames]);

  if (!currentUser) {
    return (
      <div className="loading-overlay">
        <div className="loading-content">
          <h1>🎮 {getTranslation('platform')}</h1>
          <p>{getTranslation('loading')}</p>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">
          🎮 {getTranslation('educationalGamesForClass')} {currentUser.grade}
        </h2>
        <div className="filters">
          <select 
            className="select"
            value={currentUser.grade}
            disabled
            style={{ marginRight: '10px' }}
          >
            <option value={currentUser.grade}>
              {getTranslation('grade')} {currentUser.grade}
            </option>
          </select>
          <select 
            className="select"
            onChange={(e) => setSubjectFilter(e.target.value)} 
            value={subjectFilter}
          >
            <option value="">{getTranslation('allSubjects')}</option>
            <option value="math">{getTranslation('math')}</option>
            <option value="science">{getTranslation('science')}</option>
            <option value="english">{getTranslation('english')}</option>
            <option value="hindi">{getTranslation('hindi')}</option>
            <option value="social">{getTranslation('social')}</option>
          </select>
        </div>
      </div>
      
      <div className="games-grid">
        {filteredGames.length === 0 ? (
          <div className="no-results">
            <h3>{getTranslation('noGamesFound')}</h3>
            <p>{getTranslation('noGamesAvailable')}</p>
          </div>
        ) : (
          filteredGames.map(game => {
            const isPlayed = (currentUser.gamesPlayed || []).includes(game.id);
            const isDeveloped = game.subject === 'math' || game.subject === 'science'; 
            
            return (
              <div 
                key={game.id} 
                className={`game-card ${isPlayed ? 'played' : ''} ${isDeveloped ? 'developed' : 'coming-soon'}`}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onClick={() => isDeveloped && playGame && playGame(game.id)} 
              >
                <div className="game-icon">
                  {getGameIcon(game)}
                </div>
                
                {isDeveloped && (
                  <div className="developed-badge">
                    ✨ {getTranslation('developed')}
                  </div>
                )}
                
                <div className="difficulty-badge">
                  {getTranslation(game.difficulty.toLowerCase())}
                </div>
                
                <span className="game-points-badge">
                  +{game.points} {getTranslation('points')}
                </span>
                
                <h3 className="game-title">
                  {game.title} {isPlayed ? '✅' : ''}
                </h3>
                
                <p className="game-info">
                  <strong>{getTranslation('subject')}:</strong> {getTranslation(game.subject)}
                </p>
                
                <p className="game-description">{game.description}</p>
                
                <button 
                  className={`play-game-button ${!isDeveloped ? 'disabled' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    isDeveloped && playGame && playGame(game.id);
                  }}
                  disabled={!isDeveloped}
                  onMouseEnter={(e) => isDeveloped && (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => isDeveloped && (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  {isDeveloped ? 
                    `🎮 ${getTranslation('playGame')}` : 
                    `🚧 ${getTranslation('comingSoon')}`
                  }
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default GamesPage;