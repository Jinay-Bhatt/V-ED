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
import { languages as allLanguages, showNotification, getTranslation } from './utils/Languages';
import './App.css';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [appData, setAppData] = useState({ lessons: [], games: [], badges: [] }); // Initialize with empty arrays
  const [activeLesson, setActiveLesson] = useState(null);
  const [activeGame, setActiveGame] = useState(null);

  // Log appData changes for debugging
  useEffect(() => {
    console.log('App.js - appData updated:', appData);
  }, [appData]);

  // Function to fetch all global app data
  const fetchAppData = useCallback(async (user) => {
    if (!user || !user.grade) {
      console.warn("Skipping fetchAppData: User or grade missing", user);
      setAppData({ lessons: [], games: [], badges: [] });
      return;
    }

    try {
      console.log(`Fetching app data for grade ${user.grade}...`);
      
      const [lessonsResponse, gamesResponse, badgesResponse] = await Promise.all([
        ApiService.getLessons({ grade: user.grade }).catch(err => {
          console.error('Failed to fetch lessons:', err);
          return { data: [] };
        }),
        ApiService.getGames({ grade: user.grade }).catch(err => {
          console.error('Failed to fetch games:', err);
          return { data: [] };
        }),
        ApiService.getBadges().catch(err => {
          console.error('Failed to fetch badges:', err);
          return { data: [] };
        })
      ]);

      // Handle both response formats: {success: true, data: [...]} or just [...]
      const lessonsData = Array.isArray(lessonsResponse) ? lessonsResponse : (lessonsResponse.data || []);
      const gamesData = Array.isArray(gamesResponse) ? gamesResponse : (gamesResponse.data || []);
      const badgesData = Array.isArray(badgesResponse) ? badgesResponse : (badgesResponse.data || []);

      console.log('Extracted data:', { 
        lessons: lessonsData.length, 
        games: gamesData.length, 
        badges: badgesData.length 
      });

      const newAppData = {
        lessons: lessonsData,
        games: gamesData,
        badges: badgesData.map(badge => ({
          ...badge,
          id: badge.badge_id || badge.id
        }))
      };

      console.log('Setting appData to:', newAppData);
      setAppData(newAppData);

      console.log('App data set successfully');
    } catch (error) {
      console.error('Failed to fetch app data:', error);
      showNotification('Failed to load data: ' + (error.message || 'Unknown error'), 'error');
      setAppData({ lessons: [], games: [], badges: [] });
    }
  }, []);

  useEffect(() => {
    const initializeApp = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        ApiService.setAuthToken(storedToken);
        try {
          const response = await ApiService.verifyToken();
          const user = response.user || response;

          if (!user || !user.id) {
            throw new Error("Invalid user data returned from token verification");
          }
          
          const fullUser = {
            ...user,
            completedLessons: user.completedLessons || [],
            gamesPlayed: user.gamesPlayed || [],
            badges: user.badges || []
          };
          
          setCurrentUser(fullUser);
          setCurrentLanguage(fullUser.language || 'en');
          
          if (fullUser.grade) {
            await fetchAppData(fullUser);
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          ApiService.setAuthToken(null);
          localStorage.removeItem('authToken');
          setCurrentUser(null);
          setCurrentPage('home');
          showNotification('Session expired. Please login again.', 'error');
        }
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
      showNotification('You are offline. Some features may be unavailable.', 'warning', 5000);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [fetchAppData]);

  const handleLanguageChange = async (langCode) => {
    if (currentUser) {
      try {
        const updatedUserResponse = await ApiService.updateProfile({ language: langCode });
        const updatedUser = updatedUserResponse.user || updatedUserResponse;

        if (!updatedUser || !updatedUser.id) {
          throw new Error("Invalid user data returned from profile update");
        }

        setCurrentUser(prevUser => ({
          ...prevUser,
          ...updatedUser,
          completedLessons: updatedUser.completedLessons || prevUser.completedLessons || [],
          gamesPlayed: updatedUser.gamesPlayed || prevUser.gamesPlayed || [],
          badges: updatedUser.badges || prevUser.badges || []
        }));

        if (langCode !== currentLanguage) {
          setCurrentLanguage(updatedUser.language);
          showNotification(`Language changed to ${allLanguages[updatedUser.language].nativeName}!`, 'success');
          await fetchAppData(updatedUser);
        } else {
          showNotification('Profile updated successfully!', 'success');
        }
      } catch (error) {
        console.error('Failed to update language:', error);
        showNotification(error.message || 'Failed to change language', 'error');
      }
    }
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
    setActiveLesson(null);
    setActiveGame(null);
  };

  const handleLogout = () => {
    ApiService.setAuthToken(null);
    localStorage.removeItem('authToken');
    setCurrentUser(null);
    setActiveLesson(null);
    setActiveGame(null);
    setCurrentPage('home');
    setAppData({ lessons: [], games: [], badges: [] });
    showNotification('Logged out successfully! 👋', 'info');
  };

  const handleLogin = async (userData, token) => {
    try {
      ApiService.setAuthToken(token);
      localStorage.setItem('authToken', token);

      if (!userData || !userData.id) {
        throw new Error("Invalid user data provided to handleLogin");
      }
      
      const fullUser = {
        ...userData,
        completedLessons: userData.completedLessons || [],
        gamesPlayed: userData.gamesPlayed || [],
        badges: userData.badges || []
      };

      setCurrentUser(fullUser);
      setCurrentLanguage(fullUser.language || 'en');
      
      if (fullUser.grade) {
        await fetchAppData(fullUser);
      }
      
      setCurrentPage('home');
      showNotification('Login successful! Welcome back! 🎉', 'success');
    } catch (error) {
      console.error('Error in handleLogin:', error);
      showNotification(error.message || 'Login failed', 'error');
      ApiService.setAuthToken(null);
      localStorage.removeItem('authToken');
      setCurrentUser(null);
      setCurrentPage('home');
      setAppData({ lessons: [], games: [], badges: [] });
    }
  };

const startLesson = (lesson) => {
  // Accept the full lesson object instead of just the ID
  if (lesson && lesson.id) {
    console.log('Starting lesson:', lesson);
    setActiveLesson(lesson);
    setCurrentPage('lessons');
  } else {
    console.error('Invalid lesson data:', lesson);
    showNotification('Lesson not found!', 'error');
  }
};
  const handleLessonCompletion = async (lessonId, score, timeSpent) => {
    if (!currentUser) return;

    try {
      const lesson = appData.lessons.find(l => l.id === lessonId);
      if (!lesson) {
        showNotification('Lesson not found!', 'error');
        return;
      }

      const completionResponse = await ApiService.completeLesson(lessonId, score, timeSpent);
      const pointsEarned = completionResponse.data?.pointsEarned || completionResponse.pointsEarned || 0;
      const isFirstCompletion = completionResponse.data?.isFirstCompletion || completionResponse.isFirstCompletion || false;

      // Refresh user profile
      const updatedUserResponse = await ApiService.getProfile();
      const updatedUser = updatedUserResponse.user || updatedUserResponse;

      if (updatedUser && updatedUser.id) {
        setCurrentUser({
          ...updatedUser,
          completedLessons: updatedUser.completedLessons || [],
          gamesPlayed: updatedUser.gamesPlayed || [],
          badges: updatedUser.badges || []
        });
      }

      if (pointsEarned > 0) {
        showNotification(`Lesson completed! +${pointsEarned} points earned! 🎉`, 'success');
      } else {
        showNotification('Lesson updated!', 'info');
      }

      setActiveLesson(null);
      setCurrentPage('lessons');
      
      if (updatedUser) {
        await fetchAppData(updatedUser);
      }
    } catch (error) {
      console.error('Failed to complete lesson:', error);
      showNotification(error.message || 'Failed to complete lesson', 'error');
    }
  };

  const playGame = (gameId) => {
    const gameToView = appData.games.find(g => g.id === gameId);
    if (gameToView) {
      setActiveGame(gameToView);
      setCurrentPage('games');
    } else {
      console.error('Game not found:', gameId);
      showNotification('Game not found!', 'error');
    }
  };

  const handleGameCompletion = async (gameId, score, timeSpent) => {
    if (!currentUser) return;

    try {
      const game = appData.games.find(g => g.id === gameId);
      if (!game) {
        showNotification('Game not found!', 'error');
        return;
      }

      const completionResponse = await ApiService.playGame(gameId, score, timeSpent);
      const pointsEarned = completionResponse.data?.pointsEarned || completionResponse.pointsEarned || 0;
      const isFirstTime = completionResponse.data?.isFirstTime || completionResponse.isFirstTime || false;

      // Refresh user profile
      const updatedUserResponse = await ApiService.getProfile();
      const updatedUser = updatedUserResponse.user || updatedUserResponse;

      if (updatedUser && updatedUser.id) {
        setCurrentUser({
          ...updatedUser,
          completedLessons: updatedUser.completedLessons || [],
          gamesPlayed: updatedUser.gamesPlayed || [],
          badges: updatedUser.badges || []
        });
      }

      if (pointsEarned > 0) {
        showNotification(`Game completed! +${pointsEarned} points earned! 🎮`, 'success');
      } else {
        showNotification('Game played!', 'info');
      }

      setActiveGame(null);
      setCurrentPage('games');
      
      if (updatedUser) {
        await fetchAppData(updatedUser);
      }
    } catch (error) {
      console.error('Failed to complete game:', error);
      showNotification(error.message || 'Failed to complete game', 'error');
    }
  };

  const updateProfile = async (updates) => {
    if (!currentUser) return;

    try {
      const updatedUserResponse = await ApiService.updateProfile(updates);
      const updatedUser = updatedUserResponse.user || updatedUserResponse;

      if (!updatedUser || !updatedUser.id) {
        throw new Error("Invalid user data returned from profile update");
      }

      setCurrentUser(prevUser => ({
        ...prevUser,
        ...updatedUser,
        completedLessons: updatedUser.completedLessons || prevUser.completedLessons || [],
        gamesPlayed: updatedUser.gamesPlayed || prevUser.gamesPlayed || [],
        badges: updatedUser.badges || prevUser.badges || []
      }));

      if (updates.language && updates.language !== currentLanguage) {
        setCurrentLanguage(updatedUser.language);
        showNotification(`Language changed to ${allLanguages[updatedUser.language].nativeName}!`, 'success');
        await fetchAppData(updatedUser);
      } else {
        showNotification('Profile updated successfully!', 'success');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      showNotification(error.message || 'Failed to update profile', 'error');
    }
  };

  if (!currentUser && !loading) {
    return <LoginPage onLogin={handleLogin} getTranslation={getTranslation} language={currentLanguage} />;
  }

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="loading-content">
          <h1>🎓 V-Ed Platform</h1>
          <p>Loading...</p>
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
          📱 You are offline
        </div>
      )}
    </div>
  );
};

export default App;