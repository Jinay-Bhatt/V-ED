// frontend/src/pages/LessonsPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { languages as allLanguages } from '../utils/Languages'; // <-- ENSURE THIS LINE IS PRESENT AND UNCOMMENTED

const LessonsPage = ({ currentUser, appData, startLesson, language, getTranslation }) => {
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [subjectFilter, setSubjectFilter] = useState('');

  const getDisplayLessons = useCallback(() => {
    // This function prepares lessons for display, applying translations if necessary.
    // The lesson.title and lesson.description are passed to getTranslation,
    // which handles finding the correct translation based on the current language.
    return (appData?.lessons || []).map(lesson => ({
      ...lesson,
      title: getTranslation(lesson.title),
      description: getTranslation(lesson.description),
    }));
  }, [appData.lessons, getTranslation]);

  const filterLessons = useCallback(() => {
    if (!currentUser) {
      setFilteredLessons([]);
      return;
    }

    let relevantLessons = getDisplayLessons();

    // Always filter by the current user's grade
    relevantLessons = relevantLessons.filter(lesson => lesson.grade === currentUser.grade);

    // Apply subject filter if selected
    if (subjectFilter) {
      relevantLessons = relevantLessons.filter(lesson => lesson.subject === subjectFilter);
    }

    // Sort lessons to show developed ones first (science and math), then others
    relevantLessons.sort((a, b) => {
      const aDeveloped = a.subject === 'science' || a.subject === 'math';
      const bDeveloped = b.subject === 'science' || b.subject === 'math';
      
      if (aDeveloped && !bDeveloped) return -1;
      if (!aDeveloped && bDeveloped) return 1;
      return 0; // Keep original order for same category
    });
    
    setFilteredLessons(relevantLessons);
  }, [currentUser, subjectFilter, getDisplayLessons]);

  useEffect(() => {
    filterLessons();
  }, [filterLessons]);

  // Loading state for when currentUser is not yet available
  if (!currentUser) {
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

  // Main component render
  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">
          📚 {getTranslation('lessonsForClass')} {currentUser.grade}
        </h2>
        <div className="filters">
          {/* Grade Filter - Now fixed to currentUser.grade and translated */}
          <select 
            className="select"
            value={currentUser.grade} // Display current user's grade
            disabled // Disable to enforce current user's grade
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
      
      <div className="lessons-grid">
        {filteredLessons.length === 0 ? (
          <div className="no-results">
            <h3>{getTranslation('noLessonsFound')}</h3>
            <p>{getTranslation('tryDifferentSubject')}</p>
          </div>
        ) : (
          filteredLessons.map(lesson => {
            const isCompleted = (currentUser.completedLessons || []).includes(lesson.id);
            const isDeveloped = lesson.subject === 'science' || lesson.subject === 'math';
            
            return (
              <div 
                key={lesson.id} 
                className={`lesson-card ${isCompleted ? 'completed' : ''} ${isDeveloped ? 'developed' : 'coming-soon'}`}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="lesson-header">
                  <h3 className="lesson-title">
                    {lesson.title} {isCompleted ? '✅' : ''}
                  </h3>
                  <span className="grade-tag">
                    {getTranslation('grade')} {lesson.grade}
                  </span>
                  {isDeveloped && (
                    <span className="developed-badge">
                      ✨ Developed
                    </span>
                  )}
                </div>
                
                <div className="lesson-info">
                  <p>
                    <strong>{getTranslation('subject')}:</strong> {getTranslation(lesson.subject)}
                  </p>
                  <p>
                    <strong>{getTranslation('duration')}:</strong> {lesson.duration} {getTranslation('minutes')}
                  </p>
                </div>
                
                <p className="lesson-description">{lesson.description}</p>
                
                <button 
                  className={`lesson-button ${isCompleted ? 'secondary' : 'primary'} ${!isDeveloped ? 'disabled' : ''}`}
                  onClick={() => isDeveloped ? startLesson(lesson.id) : null}
                  disabled={!isDeveloped}
                  onMouseEnter={(e) => isDeveloped && (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => isDeveloped && (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  {!isDeveloped ? 
                    `🚧 Coming Soon` :
                    isCompleted ? 
                      `📖 ${getTranslation('reviewLesson')}` : 
                      `🚀 ${getTranslation('startLesson')}`
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

export default LessonsPage;
