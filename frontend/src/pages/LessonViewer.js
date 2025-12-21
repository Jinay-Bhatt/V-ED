// frontend/src/pages/LessonViewer.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getLessonContent } from '../utils/LessonContent';
import { showNotification } from '../utils/Languages';
import InteractiveQuestion from '../components/InteractiveQuestion';

// Interactive Pizza Component for Fractions
const InteractivePizza = ({ slices = 8, onSliceClick }) => {
  const [selectedSlices, setSelectedSlices] = useState([]);
  
  const handleSliceClick = (sliceIndex) => {
    const newSelected = selectedSlices.includes(sliceIndex)
      ? selectedSlices.filter(i => i !== sliceIndex)
      : [...selectedSlices, sliceIndex];
    setSelectedSlices(newSelected);
    if (onSliceClick) onSliceClick(newSelected.length, slices);
  };

  const sliceAngle = 360 / slices;
  
  return (
    <div className="interactive-pizza-container">
      <svg viewBox="0 0 200 200" className="interactive-pizza-svg">
        <circle cx="100" cy="100" r="90" fill="#f4e4bc" stroke="#d4a574" strokeWidth="2"/>
        {Array.from({ length: slices }, (_, i) => {
          const angle1 = (i * sliceAngle - 90) * Math.PI / 180;
          const angle2 = ((i + 1) * sliceAngle - 90) * Math.PI / 180;
          const x1 = 100 + 85 * Math.cos(angle1);
          const y1 = 100 + 85 * Math.sin(angle1);
          const x2 = 100 + 85 * Math.cos(angle2);
          const y2 = 100 + 85 * Math.sin(angle2);
          
          const isSelected = selectedSlices.includes(i);
          
          return (
            <g key={i}>
              <path
                d={`M 100 100 L ${x1} ${y1} A 85 85 0 0 1 ${x2} ${y2} Z`}
                fill={isSelected ? "#ff6b6b" : "#ffd93d"}
                stroke="#d4a574"
                strokeWidth="1"
                className="pizza-slice"
                onClick={() => handleSliceClick(i)}
                style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              />
              <line x1="100" y1="100" x2={x1} y2={y1} stroke="#d4a574" strokeWidth="2"/>
            </g>
          );
        })}
      </svg>
      <div className="pizza-fraction-display">
        <p className="fraction-text">
          Selected: {selectedSlices.length}/{slices}
        </p>
        <p className="fraction-result">
          Fraction: {selectedSlices.length}/{slices}
        </p>
      </div>
    </div>
  );
};

// Virtual Lab Simulation for Science
const VirtualLabSimulation = ({ onComplete, getTranslation }) => {
  const [temperature, setTemperature] = useState(0);
  const [matterState, setMatterState] = useState("solid");
  const [isHeating, setIsHeating] = useState(false);
  const [experimentComplete, setExperimentComplete] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (temperature < 0) setMatterState("solid");
    else if (temperature >= 0 && temperature < 100) setMatterState("liquid");
    else {
      setMatterState("gas");
      if (!experimentComplete) {
        setExperimentComplete(true);
        showNotification('Experiment completed! You observed all three states of matter!', 'success');
        if (onComplete) onComplete();
      }
    }
  }, [temperature, experimentComplete, onComplete]);

  const startHeating = () => {
    setIsHeating(true);
    intervalRef.current = setInterval(() => {
      setTemperature(prev => Math.min(prev + 2, 150));
    }, 100);
  };

  const stopHeating = () => {
    setIsHeating(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const reset = () => {
    stopHeating();
    setTemperature(-20);
    setMatterState("solid");
    setExperimentComplete(false);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const getMatterEmoji = () => {
    switch (matterState) {
      case "solid": return "🧊";
      case "liquid": return "💧";
      case "gas": return "☁️";
      default: return "🧊";
    }
  };

  const getMatterAnimation = () => {
    switch (matterState) {
      case "solid": return "matter-solid";
      case "liquid": return "matter-liquid";
      case "gas": return "matter-gas";
      default: return "";
    }
  };

  return (
    <div className="virtual-lab-container">
      <h3 className="lab-title">🔬 Virtual Lab: States of Matter</h3>
      
      <div className="matter-display">
        <div className={`matter-emoji ${getMatterAnimation()}`}>
          {getMatterEmoji()}
        </div>
        <p className="matter-state">
          Current State: {matterState}
        </p>
        <p className="temperature-display">
          Temperature: {temperature}°C
        </p>
      </div>

      <div className="lab-controls">
        <button
          onClick={isHeating ? stopHeating : startHeating}
          className={`lab-button ${isHeating ? 'stop-button' : 'start-button'}`}
        >
          {isHeating ? '⏸️ Stop Heating' : '▶️ Start Heating'}
        </button>
        
        <button
          onClick={reset}
          className="lab-button reset-button"
        >
          🔄 Reset
        </button>
      </div>

      <div className="lab-observations">
        <h4 className="observations-title">Observations:</h4>
        <div className="observations-list">
          {temperature >= -20 && temperature < 0 && (
            <div className="observation-item solid">
              <div className="observation-dot"></div>
              Ice is solid - molecules are tightly packed
            </div>
          )}
          {temperature >= 0 && temperature < 100 && (
            <div className="observation-item liquid">
              <div className="observation-dot"></div>
              Water is liquid - molecules move freely
            </div>
          )}
          {temperature >= 100 && (
            <div className="observation-item gas">
              <div className="observation-dot"></div>
              Steam is gas - molecules spread out rapidly
            </div>
          )}
        </div>
      </div>

      {experimentComplete && (
        <div className="experiment-complete">
          <div className="complete-icon">✅</div>
          <div className="complete-text">
            <p className="complete-title">Experiment Complete!</p>
            <p className="complete-description">You successfully observed all three states of matter!</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced Visual Question Component
const VisualFractionQuestion = ({ question, onAnswer, getTranslation }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleAnswerClick = (option, index) => {
    setSelectedAnswer(index);
    setShowFeedback(true);
    onAnswer(question.id, option.isCorrect, option.text);
  };

  const renderVisual = () => {
    if (question.visual && question.visual.type === "circle") {
      const { shaded, total } = question.visual;
      const sliceAngle = 360 / total;
      
      return (
        <svg viewBox="0 0 200 200" className="fraction-visual-svg">
          <circle cx="100" cy="100" r="80" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2"/>
          {Array.from({ length: total }, (_, i) => {
            const angle1 = (i * sliceAngle - 90) * Math.PI / 180;
            const angle2 = ((i + 1) * sliceAngle - 90) * Math.PI / 180;
            const x1 = 100 + 75 * Math.cos(angle1);
            const y1 = 100 + 75 * Math.sin(angle1);
            const x2 = 100 + 75 * Math.cos(angle2);
            const y2 = 100 + 75 * Math.sin(angle2);
            
            return (
              <g key={i}>
                <path
                  d={`M 100 100 L ${x1} ${y1} A 75 75 0 0 1 ${x2} ${y2} Z`}
                  fill={i < shaded ? "#3b82f6" : "#e5e7eb"}
                  stroke="#9ca3af"
                  strokeWidth="1"
                />
                <line x1="100" y1="100" x2={x1} y2={y1} stroke="#9ca3af" strokeWidth="1"/>
              </g>
            );
          })}
        </svg>
      );
    }
    return null;
  };

  return (
    <div className="visual-fraction-question">
      <h4 className="question-text">{getTranslation(question.questionText)}</h4>
      <div className="visual-container">
        {renderVisual()}
      </div>
      <div className="visual-options-grid">
        {question.options.map((option, index) => {
          let buttonClass = "visual-option-button";
          
          if (showFeedback && selectedAnswer === index) {
            buttonClass += option.isCorrect 
              ? " correct-answer"
              : " incorrect-answer";
          }
          
          return (
            <button
              key={index}
              className={buttonClass}
              onClick={() => handleAnswerClick(option, index)}
              disabled={showFeedback}
            >
              {getTranslation(option.text)}
              {showFeedback && selectedAnswer === index && (
                <span className="answer-icon">
                  {option.isCorrect ? ' ✅' : ' ❌'}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {showFeedback && (
        <div className={`visual-feedback ${selectedAnswer !== null && question.options[selectedAnswer].isCorrect ? 'correct-feedback' : 'incorrect-feedback'}`}>
          {selectedAnswer !== null && question.options[selectedAnswer].isCorrect 
            ? "🎉 Excellent! You got it right!" 
            : "💡 Not quite right. The shaded area represents the numerator, and the total parts represent the denominator."}
        </div>
      )}
    </div>
  );
};

// Memory Card Game Component
const MemoryCardGame = ({ pairs, onComplete, getTranslation }) => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    // Create shuffled deck
    const deck = [];
    pairs.forEach((pair, index) => {
      deck.push({ id: index * 2, content: pair.word, type: 'word', pairId: index });
      deck.push({ id: index * 2 + 1, content: pair.translation, type: 'translation', pairId: index });
    });
    setCards(deck.sort(() => Math.random() - 0.5));
  }, [pairs]);

  const handleCardClick = (cardId) => {
    if (flippedCards.length === 2 || flippedCards.includes(cardId) || matchedCards.includes(cardId)) {
      return;
    }

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [firstCard, secondCard] = newFlipped.map(id => cards.find(card => card.id === id));
      
      if (firstCard.pairId === secondCard.pairId) {
        // Match found
        setTimeout(() => {
          setMatchedCards(prev => [...prev, ...newFlipped]);
          setFlippedCards([]);
          if (matchedCards.length + 2 === cards.length) {
            onComplete(moves + 1);
          }
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="memory-card-game">
      <div className="game-stats">
        <p>Moves: {moves}</p>
        <p>Matched: {matchedCards.length / 2}/{pairs.length}</p>
      </div>
      <div className="cards-grid">
        {cards.map(card => {
          const isFlipped = flippedCards.includes(card.id) || matchedCards.includes(card.id);
          return (
            <div
              key={card.id}
              className={`memory-card ${isFlipped ? 'flipped' : ''} ${matchedCards.includes(card.id) ? 'matched' : ''}`}
              onClick={() => handleCardClick(card.id)}
            >
              <div className="card-content">
                {isFlipped ? getTranslation(card.content) : '?'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const LessonViewer = ({ lesson, onCompleteLesson, onBack, getTranslation }) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState({});
  const [interactiveScore, setInteractiveScore] = useState(0);
  const lessonDetails = getLessonContent(lesson);

  useEffect(() => {
    setCurrentSectionIndex(0);
    setAnsweredQuestions({});
    setInteractiveScore(0);
  }, [lesson]);

  // Enhanced lesson content check
  const hasInteractiveContent = lessonDetails && lessonDetails.sections && 
    lessonDetails.sections.some(section => 
      section.type === 'interactive' || 
      section.interactive_elements || 
      section.type === 'simulation' ||
      section.type === 'game'
    );

  if (!lessonDetails || !lessonDetails.sections || lessonDetails.sections.length === 0) {
    return (
      <div className="lesson-viewer-container">
        <h2 className="page-title">{getTranslation('lessonContentUnavailable')}</h2>
        <p>{getTranslation('lessonContentBeingDeveloped')}</p>
        <button className="action-button secondary mt-20" onClick={onBack}>
          {getTranslation('backToLessons')}
        </button>
      </div>
    );
  }

  const currentSection = lessonDetails.sections[currentSectionIndex];

  const handleNextSection = () => {
    if (currentSectionIndex < lessonDetails.sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };

  const handlePrevSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  const handleCompleteLessonClick = () => {
    const finalScore = Math.max(80, Math.min(100, 80 + interactiveScore));
    onCompleteLesson(lesson.id, finalScore, lesson.duration * 60);
  };

  const handleQuestionAnswer = (questionId, isCorrect, selectedText) => {
    setAnsweredQuestions(prev => ({
      ...prev,
      [questionId]: { isCorrect, selectedText }
    }));
    
    if (isCorrect && !answeredQuestions[questionId]) {
      setInteractiveScore(prev => prev + 5);
      showNotification('Correct! +5 points', 'success');
    }
  };

  const handleInteractiveComplete = () => {
    setInteractiveScore(prev => prev + 10);
    showNotification('Interactive activity completed! +10 points', 'success');
  };

  const renderSectionContent = () => {
    // Handle interactive sections
    if (currentSection.type === 'interactive') {
      return (
        <div className="interactive-section">
          <div className="interactive-intro">
            <div className="intro-icon">🍕</div>
            <p className="intro-text">{getTranslation(currentSection.content)}</p>
          </div>
          <InteractivePizza 
            slices={8} 
            onSliceClick={(selected, total) => {
              if (selected === 4) { // Half pizza selected
                showNotification('Great! You selected 4/8 = 1/2 of the pizza!', 'success');
                handleInteractiveComplete();
              }
            }}
          />
          <div className="interactive-tip">
            <div className="tip-icon">💡</div>
            <div className="tip-content">
              <p className="tip-title">Try it out!</p>
              <p className="tip-text">Click on the pizza slices to see how fractions represent parts of a whole!</p>
            </div>
          </div>
        </div>
      );
    }

    // Handle simulation sections
    if (currentSection.type === 'simulation') {
      return (
        <VirtualLabSimulation 
          onComplete={handleInteractiveComplete}
          getTranslation={getTranslation}
        />
      );
    }

    // Handle game sections
    if (currentSection.type === 'game' && currentSection.gameType === 'memory') {
      return (
        <div className="game-section">
          <h3 className="game-title">Memory Match Game</h3>
          <p className="game-instructions">Match the words with their translations!</p>
          <MemoryCardGame
            pairs={currentSection.pairs || [
              { word: 'hello', translation: 'हैलो' },
              { word: 'goodbye', translation: 'अलविदा' },
              { word: 'please', translation: 'कृपया' },
              { word: 'thank you', translation: 'धन्यवाद' }
            ]}
            onComplete={(moves) => {
              showNotification(`Game completed in ${moves} moves! +15 points`, 'success');
              setInteractiveScore(prev => prev + 15);
            }}
            getTranslation={getTranslation}
          />
        </div>
      );
    }

    // Handle enhanced practice sections
    if (currentSection.type === 'practice' && currentSection.questions) {
      return (
        <div className="practice-section-content">
          {currentSection.questions.map(q => {
            // Check if it's a visual fraction question
            if (q.visual) {
              return (
                <VisualFractionQuestion
                  key={q.id}
                  question={q}
                  onAnswer={handleQuestionAnswer}
                  getTranslation={getTranslation}
                />
              );
            }
            // Use existing InteractiveQuestion component for regular questions
            return (
              <InteractiveQuestion
                key={q.id}
                question={q}
                onAnswer={handleQuestionAnswer}
                showFeedback={true}
                disabled={answeredQuestions[q.id] !== undefined}
                getTranslation={getTranslation}
              />
            );
          })}
        </div>
      );
    }

    // Default content rendering
    return (
      <div className="lesson-content-display" 
           dangerouslySetInnerHTML={{ __html: getTranslation(currentSection.content) }}>
      </div>
    );
  };

  return (
    <div className="lesson-viewer-container">
      {/* Enhanced Header with Progress */}
      <div className="lesson-header-enhanced">
        <h2 className="page-title">📖 {getTranslation(lesson.title)}</h2>
        <div className="lesson-progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${((currentSectionIndex + 1) / lessonDetails.sections.length) * 100}%` }}
          ></div>
        </div>
        <div className="lesson-stats">
          <div className="stat-item">
            <span className="stat-label">Section:</span>
            <span className="stat-value">{currentSectionIndex + 1}/{lessonDetails.sections.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Interactive Score:</span>
            <span className="stat-value">⭐ {interactiveScore}</span>
          </div>
        </div>
      </div>

      <h3 className="section-title">{getTranslation(currentSection.title)}</h3>
      
      {renderSectionContent()}

      <div className="lesson-navigation-buttons">
        <button 
          className="action-button secondary" 
          onClick={handlePrevSection} 
          disabled={currentSectionIndex === 0}
        >
          ⬅️ {getTranslation('previous')}
        </button>
        
        {currentSectionIndex < lessonDetails.sections.length - 1 ? (
          <button 
            className="action-button primary" 
            onClick={handleNextSection}
          >
            {getTranslation('next')} ➡️
          </button>
        ) : (
          <button 
            className="action-button success" 
            onClick={handleCompleteLessonClick}
          >
            🎉 {getTranslation('completeLesson')}
          </button>
        )}
      </div>

      <button className="action-button secondary mt-20" onClick={onBack}>
        {getTranslation('backToLessons')}
      </button>
    </div>
  );
};

export default LessonViewer;