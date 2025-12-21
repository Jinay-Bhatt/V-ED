import React, { useState, useEffect, useCallback } from 'react';
import HomePage from './pages/HomePage';
import LessonsPage from './pages/LessonsPage';
import GamesPage from './pages/GamesPage';
import ProgressPage from './pages/ProgressPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import LessonViewer from './pages/LessonViewer';
import GameViewer from './pages/GameViewer';
import ApiService from './services/api';
// CORRECTED: Changed 'Languages' to 'languages' (lowercase 'l')
import { languages as allLanguages, translations as allTranslations, showNotification, getTranslation } from './utils/Languages';
import './App.css';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [appData, setAppData] = useState({ lessons: [], games: [], badges: [] });
  const [activeLesson, setActiveLesson] = useState(null);
  const [activeGame, setActiveGame] = useState(null);

  // getTranslation is now directly imported from languages.js
  // No longer a useCallback defined here in App.js

  const fetchAppData = useCallback(async (user, lang) => {
    if (!user || !user.grade || !ApiService.token) {
      console.warn("Skipping fetchAppData: User, grade, or API token missing. User:", user);
      return;
    }

    try {
      const [lessonsResponse, gamesResponse, allBadgesResponse] = await Promise.all([
        ApiService.getLessons({ grade: user.grade }),
        ApiService.getGames({ grade: user.grade }),
        ApiService.getBadges(),
      ]);

      setAppData({
        lessons: lessonsResponse,
        games: gamesResponse,
        badges: allBadgesResponse.map(badge => ({
          ...badge,
          id: badge.badge_id 
        })), 
      });
    } catch (error) {
      console.error('Failed to fetch app data:', error);
      showNotification(getTranslation('dataFetchFailed') + ': ' + (error.message || 'Unknown error'), 'error');
    }
  }, []); // Dependencies now empty, as getTranslation is imported and currentLanguage is handled by App.js state

  useEffect(() => {
    const initializeApp = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        ApiService.setAuthToken(storedToken);
        try {
          const response = await ApiService.verifyToken();
          const user = response;

          if (!user || !user.id) {
            throw new Error("User data not returned from token verification or is invalid.");
          }
          
          const fullUser = {
            ...user,
            completedLessons: user.completedLessons || [],
            gamesPlayed: user.gamesPlayed || [],
            badges: user.badges || [],
          };
          
          setCurrentUser(fullUser);
          setCurrentLanguage(fullUser.language || 'en');
          
          if (fullUser.grade) {
            await fetchAppData(fullUser, fullUser.language || 'en');
          }
        } catch (error) {
          console.error('Initial token verification failed:', error);
          ApiService.setAuthToken(null);
          setCurrentUser(null);
          setCurrentPage('home');
          showNotification(getTranslation('loginFailed') + ': ' + (error.message || 'Please login again.'), 'error');
        }
      } else {
        setCurrentUser(null);
        setCurrentPage('home');
      }
      setLoading(false);
    };

    initializeApp();

    const handleOnline = () => {
      setIsOffline(false);
      showNotification('You are back online! 🌐', 'success');
    };
    const handleOffline = () => {
      setIsOffline(true);
      showNotification(getTranslation('offlineMessage'), 'warning', 5000);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [fetchAppData]); // fetchAppData is a dependency

  const handleLanguageChange = async (langCode) => {
    if (currentUser) {
      try {
        const updatedUserResponse = await ApiService.updateProfile({ language: langCode });
        const updatedUser = updatedUserResponse.user || updatedUserResponse;

        if (!updatedUser || !updatedUser.id) {
            throw new Error("User data not returned from profile update.");
        }

        setCurrentUser(prevUser => ({
          ...prevUser,
          ...updatedUser,
          completedLessons: updatedUser.completedLessons || [],
          gamesPlayed: updatedUser.gamesPlayed || [],
          badges: updatedUser.badges || [],
        }));
        if (langCode !== currentLanguage) {
            setCurrentLanguage(updatedUser.language);
            showNotification(`${getTranslation('languageChanged')} ${allLanguages[updatedUser.language].nativeName}!`, 'success');
        } else {
            showNotification(getTranslation('profileUpdated'), 'success');
        }
        
      } catch (error) {
        console.error('Failed to update language:', error);
        showNotification(error.message || getTranslation('languageChangeFailed'), 'error');
      }
    }
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
    setActiveLesson(null);
    setActiveGame(null);
    showNotification(`${getTranslation('navigatedTo')} ${getTranslation(page)}`, 'info', 1500);
  };

  const handleLogout = () => {
    ApiService.setAuthToken(null);
    setCurrentUser(null);
    setActiveLesson(null);
    setActiveGame(null);
    setCurrentPage('home');
    showNotification('Logged out successfully!', 'info');
  };

  const handleLogin = async (userData, token) => {
    ApiService.setAuthToken(token);
    try {
      const user = userData; 
      
      if (!user || !user.id) {
        throw new Error("User data not provided to handleLogin or is invalid.");
      }
      
      const fullUser = {
        ...user,
        completedLessons: user.completedLessons || [],
        gamesPlayed: user.gamesPlayed || [],
        badges: user.badges || [],
      };

      setCurrentUser(fullUser);
      setCurrentLanguage(fullUser.language || 'en');
      
      if (fullUser.grade) {
        await fetchAppData(fullUser, fullUser.language || 'en');
      }
      setCurrentPage('home');
    } catch (error) {
      console.error('Error in handleLogin (processing user data):', error); 
      showNotification(error.message || getTranslation('loginFailed'), 'error');
      ApiService.setAuthToken(null);
      setCurrentUser(null);
      setCurrentPage('home');
    }
  };

  const startLesson = (lessonId) => {
    const lessonToView = appData.lessons.find(l => l.id === lessonId);
    if (lessonToView) {
      setActiveLesson(lessonToView);
      setCurrentPage('lessons');
      showNotification(getTranslation('lessonStarted'), 'info');
    } else {
      showNotification('Lesson not found!', 'error');
    }
  };

  const handleLessonCompletion = async (lessonId, score, timeSpent) => {
    if (currentUser) {
      try {
        const lesson = appData.lessons.find(l => l.id === lessonId);
        if (!lesson) {
          showNotification('Lesson not found!', 'error');
          return;
        }

        const { pointsEarned, earnedBadges } = await ApiService.completeLesson(lessonId, score, timeSpent);
        
        const updatedUserResponse = await ApiService.getProfile();
        const updatedUserFromDb = updatedUserResponse.user || updatedUserResponse;

        if (!updatedUserFromDb || !updatedUserFromDb.id) {
            throw new Error("User data not returned after completing lesson.");
        }

        setCurrentUser({
            ...updatedUserFromDb,
            completedLessons: updatedUserFromDb.completedLessons || [],
            gamesPlayed: updatedUserFromDb.gamesPlayed || [],
            badges: updatedUserFromDb.badges || [],
        });

        if (pointsEarned > 0) {
          showNotification(`${getTranslation('lessonCompletedMsg')} +${pointsEarned} ${getTranslation('pointsEarnedMsg')}`, 'success');
        } else {
          showNotification(getTranslation('lessonAlreadyCompleted'), 'info');
        }

        if (earnedBadges && earnedBadges.length > 0) {
          earnedBadges.forEach(badgeId => {
            const badgeName = appData.badges.find(b => b.id === badgeId)?.name || badgeId;
            showNotification(`🏆 ${getTranslation('badgeEarned')} ${badgeName}!`, 'success');
          });
        }
        setActiveLesson(null);
        setCurrentPage('lessons');
      } catch (error) {
        console.error('Failed to complete lesson:', error);
        showNotification(error.message || getTranslation('lessonCompletionFailed'), 'error');
      }
    }
  };

  const playGame = (gameId) => {
    const gameToView = appData.games.find(g => g.id === gameId);
    if (gameToView) {
      setActiveGame(gameToView);
      setCurrentPage('games');
      showNotification(getTranslation('gameStarted'), 'info');
    } else {
      showNotification('Game not found!', 'error');
    }
  };

  const handleGameCompletion = async (gameId, score, timeSpent) => {
    if (currentUser) {
      try {
        const game = appData.games.find(g => g.id === gameId);
        if (!game) {
          showNotification('Game not found!', 'error');
          return;
        }

        const { pointsEarned, earnedBadges } = await ApiService.playGame(gameId, score, timeSpent);
        
        const updatedUserResponse = await ApiService.getProfile();
        const updatedUserFromDb = updatedUserResponse.user || updatedUserResponse;

        if (!updatedUserFromDb || !updatedUserFromDb.id) {
            throw new Error("User data not returned after playing game.");
        }

        setCurrentUser({
            ...updatedUserFromDb,
            completedLessons: updatedUserFromDb.completedLessons || [],
            gamesPlayed: updatedUserFromDb.gamesPlayed || [],
            badges: updatedUserFromDb.badges || [],
        });

        if (pointsEarned > 0) {
          showNotification(`${getTranslation('gameCompletedMsg')} +${pointsEarned} ${getTranslation('pointsEarnedMsg')}`, 'success');
        } else {
          showNotification(getTranslation('gameAlreadyPlayed'), 'info');
        }

        if (earnedBadges && earnedBadges.length > 0) {
          earnedBadges.forEach(badgeId => {
            const badgeName = appData.badges.find(b => b.id === badgeId)?.name || badgeId;
            showNotification(`🏆 ${getTranslation('badgeEarned')} ${badgeName}!`, 'success');
          });
        }
        setActiveGame(null);
        setCurrentPage('games');
      } catch (error) {
        console.error('Failed to complete game:', error);
        showNotification(error.message || getTranslation('gameCompletionFailed'), 'error');
      }
    }
  };

  const updateProfile = async (updates) => {
    if (currentUser) {
      try {
        const updatedUserResponse = await ApiService.updateProfile(updates);
        const updatedUser = updatedUserResponse.user || updatedUserResponse;

        if (!updatedUser || !updatedUser.id) {
            throw new Error("User data not returned from profile update.");
        }

        setCurrentUser(prevUser => ({
          ...prevUser,
          ...updatedUser,
          completedLessons: updatedUser.completedLessons || [],
          gamesPlayed: updatedUser.gamesPlayed || [],
          badges: updatedUser.badges || [],
        }));
        if (updates.language && updates.language !== currentLanguage) {
            setCurrentLanguage(updatedUser.language);
            showNotification(`${getTranslation('languageChanged')} ${allLanguages[updatedUser.language].nativeName}!`, 'success');
        } else {
            showNotification(getTranslation('profileUpdated'), 'success');
        }
        
      } catch (error) {
        console.error('Failed to update profile:', error);
        showNotification(error.message || getTranslation('profileUpdateFailed'), 'error');
      }
    }
  };

  if (!currentUser && !loading) {
    return <LoginPage onLogin={handleLogin} getTranslation={getTranslation} language={currentLanguage} />;
  }

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="loading-content">
          <h1>🎓 {getTranslation('platform')}</h1>
          <p>{getTranslation('loading')}</p>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">
          🎓 {getTranslation('platform')}
        </div>
        
        <nav className="main-nav">
          <button 
            className={`nav-button ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => handleNavigation('home')}
          >
            {getTranslation('home')}
          </button>
          <button 
            className={`nav-button ${currentPage === 'lessons' ? 'active' : ''}`}
            onClick={() => handleNavigation('lessons')}
          >
            {getTranslation('lessons')}
          </button>
          <button 
            className={`nav-button ${currentPage === 'games' ? 'active' : ''}`}
            onClick={() => handleNavigation('games')}
          >
            {getTranslation('games')}
          </button>
          <button 
            className={`nav-button ${currentPage === 'progress' ? 'active' : ''}`}
            onClick={() => handleNavigation('progress')}
          >
            {getTranslation('progress')}
          </button>
          <button 
            className={`nav-button ${currentPage === 'profile' ? 'active' : ''}`}
            onClick={() => handleNavigation('profile')}
          >
            {getTranslation('profile')}
          </button>
        </nav>
        
        <div className="user-info">
          
          <div className="user-profile">
            <span>👤 {currentUser?.name || 'Guest'}</span>
            <span>{getTranslation('class')} {currentUser?.grade || ''} • {currentUser?.rollNumber || ''}</span>
          </div>
          <div className="points-badge">
            ⭐ {currentUser?.points || 0}
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            {getTranslation('logout')}
          </button>
        </div>
      </header>

      <main className="main-content">
        {activeLesson ? (
          <LessonViewer
            lesson={activeLesson}
            onCompleteLesson={handleLessonCompletion}
            onBack={() => setActiveLesson(null)}
            getTranslation={getTranslation}
          />
        ) : activeGame ? (
          <GameViewer
            game={activeGame}
            onCompleteGame={handleGameCompletion}
            onBack={() => setActiveGame(null)}
            getTranslation={getTranslation}
          />
        ) : (
          <>
            {currentPage === 'home' && (
              <HomePage 
                currentUser={currentUser} 
                onNavigate={handleNavigation}
                language={currentLanguage}
                getTranslation={getTranslation}
              />
            )}
            {currentPage === 'lessons' && (
              <LessonsPage 
                currentUser={currentUser}
                appData={appData}
                startLesson={startLesson}
                language={currentLanguage}
                getTranslation={getTranslation}
              />
            )}
            {currentPage === 'games' && (
              <GamesPage 
                currentUser={currentUser}
                appData={appData}
                playGame={playGame}
                language={currentLanguage}
                getTranslation={getTranslation}
              />
            )}
            {currentPage === 'progress' && (
              <ProgressPage 
                currentUser={currentUser}
                appData={appData}
                language={currentLanguage}
                getTranslation={getTranslation}
              />
            )}
            {currentPage === 'profile' && (
              <ProfilePage 
                currentUser={currentUser}
                updateProfile={updateProfile}
                logoutStudent={handleLogout}
                language={currentLanguage}
                getTranslation={getTranslation}
              />
            )}
          </>
        )}
      </main>

      {isOffline && (
        <div className="offline-indicator">
          📱 {getTranslation('offlineMessage')}
        </div>
      )}
    </div>
  );
};

export default App;
