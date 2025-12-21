// pages/ProgressPage.js (Part 6 - ProgressPage with class-based styling)
import React from 'react';

const ProgressPage = ({ currentUser, appData, language, getTranslation }) => {
  // Safety check for appData
  const safeAppData = appData || { lessons: [], games: [] };
  
  // Calculate progress data dynamically
  const progressData = {
    lessonsCompleted: (currentUser.completedLessons || []).length,
    totalLessons: safeAppData.lessons.filter(lesson => lesson.grade === currentUser.grade).length,
    gamesPlayed: (currentUser.gamesPlayed || []).length,
    totalGames: safeAppData.games.filter(game => game.grade === currentUser.grade).length,
    totalPoints: currentUser.points || 0,
    badgesEarned: (currentUser.badges || []).length,
    learningStreak: currentUser.streak || 1,
    totalLearningTime: Math.floor((currentUser.totalTimeSpent || 0) / 60)
  };

  const allBadges = [
    { 
      id: 'first_lesson', 
      name: getTranslation('firstSteps'), 
      icon: '🎯', 
      description: getTranslation('firstStepsDesc') 
    },
    { 
      id: 'point_collector', 
      name: getTranslation('pointCollector'), 
      icon: '⭐', 
      description: getTranslation('pointCollectorDesc') 
    },
    { 
      id: 'dedicated_learner', 
      name: getTranslation('dedicatedLearner'), 
      icon: '📚', 
      description: getTranslation('dedicatedLearnerDesc') 
    },
    { 
      id: 'game_master', 
      name: getTranslation('gameMaster'), 
      icon: '🎮', 
      description: getTranslation('gameMasterDesc') 
    },
    { 
      id: 'math_wizard', 
      name: getTranslation('mathWizard'), 
      icon: '🧙‍♂️', 
      description: getTranslation('mathWizardDesc') 
    },
    { 
      id: 'science_explorer', 
      name: getTranslation('scienceExplorer'), 
      icon: '🔭', 
      description: getTranslation('scienceExplorerDesc') 
    },
    { 
      id: 'language_expert', 
      name: getTranslation('languageExpert'), 
      icon: '🗣️', 
      description: getTranslation('languageExpertDesc') 
    }
  ];

  return (
    <div className="page-container">
      <h2 className="page-title">📊 {getTranslation('progressTitle')}</h2>
      
      <div className="progress-stats-grid">
        <div 
          className="progress-item-card"
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <h3 className="progress-item-title">📚 {getTranslation('lessonsCompleted')}</h3>
          <p className="progress-stat-number">{progressData.lessonsCompleted}</p>
          <p className="progress-stat-description">{getTranslation('outOf')} {progressData.totalLessons}</p>
        </div>
        
        <div 
          className="progress-item-card"
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <h3 className="progress-item-title">🎮 {getTranslation('gamesPlayed')}</h3>
          <p className="progress-stat-number">{progressData.gamesPlayed}</p>
          <p className="progress-stat-description">{getTranslation('outOf')} {progressData.totalGames}</p>
        </div>
        
        <div 
          className="progress-item-card"
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <h3 className="progress-item-title">⭐ {getTranslation('totalPoints')}</h3>
          <p className="progress-stat-number">{progressData.totalPoints}</p>
          <p className="progress-stat-description">{getTranslation('pointsEarned')}</p>
        </div>
        
        <div 
          className="progress-item-card"
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <h3 className="progress-item-title">🏆 {getTranslation('badgesEarned')}</h3>
          <p className="progress-stat-number">{progressData.badgesEarned}</p>
          <p className="progress-stat-description">{getTranslation('achievements')}</p>
        </div>
        
        <div 
          className="progress-item-card"
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <h3 className="progress-item-title">🔥 {getTranslation('learningStreak')}</h3>
          <p className="progress-stat-number">{progressData.learningStreak}</p>
          <p className="progress-stat-description">{getTranslation('daysInRow')}</p>
        </div>
        
        <div 
          className="progress-item-card"
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <h3 className="progress-item-title">⏱️ {getTranslation('totalLearningTime')}</h3>
          <p className="progress-stat-number">{progressData.totalLearningTime}</p>
          <p className="progress-stat-description">{getTranslation('minutesSpent')}</p>
        </div>
      </div>

      <div className="summary-section">
        <h3 className="section-title">{getTranslation('learningSummary')}</h3>
        <div className="summary-card">
          <div className="summary-row">
            <span className="summary-label">{getTranslation('name')}:</span>
            <span className="summary-value">{currentUser.name}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">{getTranslation('rollNumber')}:</span>
            <span className="summary-value">{currentUser.rollNumber}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">{getTranslation('class')}:</span>
            <span className="summary-value">{currentUser.grade}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">{getTranslation('school')}:</span>
            <span className="summary-value">{currentUser.school}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">{getTranslation('preferredLanguage')}:</span>
            <span className="summary-value">{(currentUser.language || 'en').toUpperCase()}</span>
          </div>
        </div>
      </div>

      <div className="badges-section">
        <h3 className="section-title">{getTranslation('yourBadges')}</h3>
        <div className="badges-grid">
          {allBadges.map(badge => {
            const isEarned = (currentUser.badges || []).includes(badge.id);
            return (
              <div 
                key={badge.id} 
                className={`badge-item-card ${isEarned ? 'earned' : ''}`}
                title={badge.description}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span className="badge-icon">{badge.icon}</span>
                <span className="badge-name">{badge.name}</span>
                <div className="badge-status">
                  {isEarned ? '✅' : '🔒'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
