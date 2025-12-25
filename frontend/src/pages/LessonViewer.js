// frontend/src/pages/LessonViewer.js
import React, { useState, useEffect } from 'react';
import { getLessonContent } from '../utils/LessonContent';
import InteractiveQuestion from '../components/InteractiveQuestion';

const LessonViewer = ({ lesson, onCompleteLesson, onBack, getTranslation }) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState({});
  const [quizScore, setQuizScore] = useState(0);
  const [lessonStartTime] = useState(Date.now());

  // Reset when lesson changes
  useEffect(() => {
    setCurrentSectionIndex(0);
    setAnsweredQuestions({});
    setQuizScore(0);
  }, [lesson?.id]);

  // Guard against undefined lesson
  if (!lesson || !lesson.id) {
    return (
      <div className="page-container">
        <div className="error-message">
          <h2>⚠️ {getTranslation ? getTranslation('lessonNotAvailable') : 'Lesson Not Available'}</h2>
          <p>{getTranslation ? getTranslation('lessonDataNotAvailable') : 'The lesson data is not available.'}</p>
          <button onClick={onBack} className="action-button secondary">
            ← {getTranslation ? getTranslation('backToLessons') : 'Back to Lessons'}
          </button>
        </div>
      </div>
    );
  }

  const lessonContent = getLessonContent(lesson);

  // Guard against missing lesson content
  if (!lessonContent || !lessonContent.sections || lessonContent.sections.length === 0) {
    return (
      <div className="page-container">
        <div className="error-message">
          <h2>🚧 {getTranslation ? getTranslation('contentNotAvailable') : 'Content Not Available'}</h2>
          <p>{getTranslation ? getTranslation('lessonContentBeingDeveloped') : 'This lesson content is being developed.'}</p>
          <button onClick={onBack} className="action-button secondary">
            ← {getTranslation ? getTranslation('backToLessons') : 'Back to Lessons'}
          </button>
        </div>
      </div>
    );
  }

  const sections = lessonContent.sections;
  const currentSection = sections[currentSectionIndex];
  const isLastSection = currentSectionIndex === sections.length - 1;

  const handleNext = () => {
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  const handleAnswer = (questionId, isCorrect, selectedText) => {
    if (!answeredQuestions[questionId]) {
      setAnsweredQuestions(prev => ({ 
        ...prev, 
        [questionId]: { isCorrect, selectedText } 
      }));
      
      if (isCorrect) {
        setQuizScore(prev => prev + 1);
      }
    }
  };

  const calculateTotalQuestions = () => {
    return sections.reduce((total, section) => {
      if (section.type === 'practice' && section.questions) {
        return total + section.questions.length;
      }
      return total;
    }, 0);
  };

  const handleCompleteLesson = () => {
    const timeSpent = Math.floor((Date.now() - lessonStartTime) / 1000);
    const totalQuestions = calculateTotalQuestions();
    const score = totalQuestions > 0 
      ? Math.round((quizScore / totalQuestions) * 100)
      : 100;
    
    onCompleteLesson(lesson.id, score, timeSpent);
  };

  // Render Practice Section (Quiz)
  if (currentSection.type === 'practice') {
    const questions = currentSection.questions || [];
    const answeredInThisSection = questions.filter(q => answeredQuestions[q.id]).length;
    const allAnsweredInSection = answeredInThisSection === questions.length;

    return (
      <div className="page-container lesson-viewer">
        <div className="lesson-header">
          <button className="back-button" onClick={onBack}>
            ← {getTranslation ? getTranslation('backToLessons') : 'Back to Lessons'}
          </button>
          <h2 className="page-title">
            📝 {currentSection.title || (getTranslation ? getTranslation('practice') : 'Practice')}
          </h2>
        </div>

        <div className="lesson-progress-bar">
          <div className="progress-info">
            <span>
              {getTranslation ? getTranslation('section') : 'Section'} {currentSectionIndex + 1} / {sections.length}
            </span>
            <span>
              {getTranslation ? getTranslation('questionsAnswered') : 'Answered'}: {answeredInThisSection} / {questions.length}
            </span>
          </div>
        </div>

        <div className="quiz-section">
          <div className="quiz-questions">
            {questions.map((question, index) => (
              <InteractiveQuestion
                key={question.id || index}
                question={{
                  id: question.id,
                  question: question.questionText,
                  options: question.options.map(opt => opt.text),
                  correctAnswer: question.options.findIndex(opt => opt.isCorrect),
                  explanation: question.explanation
                }}
                onAnswer={handleAnswer}
                showFeedback={true}
                disabled={!!answeredQuestions[question.id]}
                getTranslation={getTranslation}
              />
            ))}
          </div>

          {allAnsweredInSection && (
            <div className="section-complete-notice">
              <p>✅ {getTranslation ? getTranslation('sectionComplete') : 'Section Complete!'}</p>
            </div>
          )}
        </div>

        <div className="lesson-navigation">
          <button 
            className="nav-button secondary"
            onClick={handlePrevious}
            disabled={currentSectionIndex === 0}
          >
            ← {getTranslation ? getTranslation('previous') : 'Previous'}
          </button>
          
          {!isLastSection ? (
            <button 
              className="nav-button primary"
              onClick={handleNext}
            >
              {getTranslation ? getTranslation('next') : 'Next'} →
            </button>
          ) : (
            <button 
              className="nav-button primary complete-button"
              onClick={handleCompleteLesson}
            >
              {getTranslation ? getTranslation('completeLesson') : 'Complete Lesson'} ✓
            </button>
          )}
        </div>
      </div>
    );
  }

  // Render Regular Content Section (introduction, lesson, summary)
  return (
    <div className="page-container lesson-viewer">
      <div className="lesson-header">
        <button className="back-button" onClick={onBack}>
          ← {getTranslation ? getTranslation('backToLessons') : 'Back to Lessons'}
        </button>
        <h2 className="page-title">
          📚 {getTranslation ? getTranslation(lesson.title) : lesson.title}
        </h2>
        <div className="lesson-meta">
          <span className="subject-badge">
            {getTranslation ? getTranslation(lesson.subject) : lesson.subject}
          </span>
          <span className="grade-badge">
            {getTranslation ? getTranslation('grade') : 'Grade'} {lesson.grade}
          </span>
        </div>
      </div>

      <div className="lesson-progress-bar">
        <div className="progress-info">
          <span>
            {getTranslation ? getTranslation('section') : 'Section'} {currentSectionIndex + 1} / {sections.length}
          </span>
          <span>{Math.round(((currentSectionIndex + 1) / sections.length) * 100)}% {getTranslation ? getTranslation('complete') : 'Complete'}</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentSectionIndex + 1) / sections.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="lesson-content-card">
        <div className="section-type-badge">
          {currentSection.type === 'introduction' && '👋 Introduction'}
          {currentSection.type === 'lesson' && '📖 Lesson'}
          {currentSection.type === 'summary' && '📝 Summary'}
        </div>
        
        <h3 className="section-title">{currentSection.title}</h3>
        
        <div 
          className="section-content" 
          dangerouslySetInnerHTML={{ __html: currentSection.content }}
        />
      </div>

      <div className="lesson-navigation">
        <button 
          className="nav-button secondary"
          onClick={handlePrevious}
          disabled={currentSectionIndex === 0}
        >
          ← {getTranslation ? getTranslation('previous') : 'Previous'}
        </button>
        
        <div className="slide-indicators">
          {sections.map((section, index) => (
            <div 
              key={index}
              className={`slide-dot ${index === currentSectionIndex ? 'active' : ''} ${index < currentSectionIndex ? 'completed' : ''}`}
              onClick={() => setCurrentSectionIndex(index)}
              title={section.title}
            />
          ))}
        </div>
        
        {!isLastSection ? (
          <button 
            className="nav-button primary"
            onClick={handleNext}
          >
            {getTranslation ? getTranslation('next') : 'Next'} →
          </button>
        ) : (
          <button 
            className="nav-button primary complete-button"
            onClick={handleCompleteLesson}
          >
            {getTranslation ? getTranslation('completeLesson') : 'Complete Lesson'} ✓
          </button>
        )}
      </div>
    </div>
  );
};

export default LessonViewer;