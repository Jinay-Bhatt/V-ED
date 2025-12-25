// frontend/src/pages/LessonsPage.js
import React, { useState, useEffect, useCallback } from 'react';

const LessonsPage = ({ currentUser, startLesson, getTranslation, appData }) => {
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [subjectFilter, setSubjectFilter] = useState('');

  const filterAndSortLessons = useCallback(() => {
    if (!currentUser || !appData?.lessons) {
      setFilteredLessons([]);
      return;
    }

    let lessonsToDisplay = appData.lessons.map(lesson => ({
      ...lesson,
      displayTitle: getTranslation(lesson.title),
      displayDescription: getTranslation(lesson.description),
    }));

    if (subjectFilter) {
      lessonsToDisplay = lessonsToDisplay.filter(
        lesson => lesson.subject.toLowerCase() === subjectFilter.toLowerCase()
      );
    }

    lessonsToDisplay.sort((a, b) => {
      const aDev = a.subject === 'science' || a.subject === 'math';
      const bDev = b.subject === 'science' || b.subject === 'math';
      if (aDev && !bDev) return -1;
      if (!aDev && bDev) return 1;
      return 0;
    });

    setFilteredLessons(lessonsToDisplay);
  }, [currentUser, appData?.lessons, subjectFilter, getTranslation]);

  useEffect(() => {
    filterAndSortLessons();
  }, [filterAndSortLessons]);

  if (!currentUser) return null;

  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">
          📚 {getTranslation('lessonsForClass')} {currentUser.grade}
        </h2>
        <div className="filters">
          <select className="select" value={currentUser.grade} disabled>
            <option value={currentUser.grade}>{getTranslation('grade')} {currentUser.grade}</option>
          </select>
          <select 
            className="select" 
            value={subjectFilter} 
            onChange={(e) => setSubjectFilter(e.target.value)}
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
          </div>
        ) : (
          filteredLessons.map(lesson => {
            const isCompleted = (currentUser.completedLessons || []).includes(lesson.id);
            const isDeveloped = ['science', 'math'].includes(lesson.subject.toLowerCase());
            
            return (
              <div key={lesson.id} className={`lesson-card ${isCompleted ? 'completed' : ''} ${isDeveloped ? 'developed' : 'coming-soon'}`}>
                <div className="lesson-header">
                  <h3 className="lesson-title">
                    {lesson.displayTitle} {isCompleted ? '✅' : ''}
                  </h3>
                  {isDeveloped && <span className="developed-badge">✨ Developed</span>}
                </div>
                <div className="lesson-info">
                  <p><strong>{getTranslation('subject')}:</strong> {getTranslation(lesson.subject)}</p>
                  <p><strong>{getTranslation('duration')}:</strong> {lesson.duration} {getTranslation('minutes')}</p>
                </div>
                <p className="lesson-description">{lesson.displayDescription}</p>
                <button 
                  className={`lesson-button ${isCompleted ? 'secondary' : 'primary'} ${!isDeveloped ? 'disabled' : ''}`}
                  onClick={() => isDeveloped && startLesson(lesson)}
                  disabled={!isDeveloped}
                >
                  {!isDeveloped ? `🚧 Coming Soon` : isCompleted ? `📖 ${getTranslation('reviewLesson')}` : `🚀 ${getTranslation('startLesson')}`}
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