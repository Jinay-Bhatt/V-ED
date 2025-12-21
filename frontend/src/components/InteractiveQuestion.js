// frontend/src/components/InteractiveQuestion.js
import React, { useState, useEffect } from 'react';

const InteractiveQuestion = ({ question, onAnswer, showFeedback, disabled, getTranslation }) => {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    // Reset state when question changes
    setSelectedOptionIndex(null);
    setFeedbackMessage('');
    setIsAnswered(false);
  }, [question]);

  const handleOptionClick = (option, index) => {
    if (disabled || isAnswered) return;

    setSelectedOptionIndex(index);
    setIsAnswered(true);

    if (option.isCorrect) {
      setFeedbackMessage(getTranslation('correctAnswer') || 'Correct!');
      onAnswer(question.id, true, option.text);
    } else {
      setFeedbackMessage(getTranslation('incorrectAnswer') || 'Not quite right. Try again!');
      onAnswer(question.id, false, option.text);
    }
  };

  // Render counting blocks for math questions
  const renderCountingBlocks = (visual) => {
    if (!visual || visual.type !== 'counting_blocks') return null;
    
    const { first, second } = visual;
    const totalBlocks = first + second;
    
    return (
      <div className="counting-blocks-container">
        <div className="blocks-section">
          <div className="blocks-group first-group">
            <span className="group-label">{first}</span>
            <div className="blocks-row">
              {Array.from({ length: first }, (_, i) => (
                <div key={`first-${i}`} className="counting-block first-color"></div>
              ))}
            </div>
          </div>
          
          <div className="plus-sign">+</div>
          
          <div className="blocks-group second-group">
            <span className="group-label">{second}</span>
            <div className="blocks-row">
              {Array.from({ length: second }, (_, i) => (
                <div key={`second-${i}`} className="counting-block second-color"></div>
              ))}
            </div>
          </div>
          
          <div className="equals-sign">=</div>
          
          <div className="blocks-group total-group">
            <span className="group-label">?</span>
            <div className="blocks-row">
              {Array.from({ length: totalBlocks }, (_, i) => (
                <div 
                  key={`total-${i}`} 
                  className={`counting-block ${i < first ? 'first-color' : 'second-color'}`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render fraction circle visual
  const renderFractionCircle = (visual) => {
    if (!visual || visual.type !== 'circle') return null;
    
    const { shaded, total } = visual;
    const sliceAngle = 360 / total;
    
    return (
      <div className="fraction-circle-container">
        <svg viewBox="0 0 200 200" className="fraction-circle-svg">
          <circle cx="100" cy="100" r="80" fill="#f0f0f0" stroke="#ccc" strokeWidth="2"/>
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
                  fill={i < shaded ? "#4285f4" : "#f0f0f0"}
                  stroke="#ccc"
                  strokeWidth="1"
                />
                <line x1="100" y1="100" x2={x1} y2={y1} stroke="#ccc" strokeWidth="1"/>
              </g>
            );
          })}
        </svg>
        <div className="fraction-label">
          {shaded}/{total} shaded
        </div>
      </div>
    );
  };

  // Main render function
  return (
    <div className={`practice-question interactive-question ${isAnswered ? 'answered' : ''}`}>
      <h4 className="question-title">{getTranslation(question.questionText)}</h4>
      
      {/* Render visual elements if present */}
      {question.visual && (
        <div className="question-visual">
          {question.visual.type === 'counting_blocks' && renderCountingBlocks(question.visual)}
          {question.visual.type === 'circle' && renderFractionCircle(question.visual)}
        </div>
      )}
      
      <div className="options-container">
        <div className="options-grid">
          {question.options.map((option, index) => {
            const isSelected = selectedOptionIndex === index;
            const isCorrectOption = option.isCorrect;
            
            let buttonClass = 'option-button enhanced-option';
            if (isAnswered) {
              if (isSelected) {
                buttonClass += isCorrectOption ? ' correct' : ' incorrect';
              } else if (isCorrectOption) {
                buttonClass += ' correct-unselected';
              }
            }

            return (
              <button
                key={index}
                className={buttonClass}
                onClick={() => handleOptionClick(option, index)}
                disabled={disabled || isAnswered}
              >
                <span className="option-text">{getTranslation(option.text)}</span>
                {isAnswered && isSelected && (
                  <span className="option-result">
                    {isCorrectOption ? ' ✅' : ' ❌'}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      {showFeedback && isAnswered && feedbackMessage && (
        <div className={`feedback-message enhanced-feedback ${
          selectedOptionIndex !== null && question.options[selectedOptionIndex].isCorrect ? 'correct' : 'incorrect'
        }`}>
          <div className="feedback-icon">
            {selectedOptionIndex !== null && question.options[selectedOptionIndex].isCorrect ? '🎉' : '💡'}
          </div>
          <div className="feedback-text">
            {feedbackMessage}
            {selectedOptionIndex !== null && !question.options[selectedOptionIndex].isCorrect && (
              <div className="hint-text">
                {question.hint || "Think about the visual clue above and try to count or identify the correct answer."}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveQuestion;

