// frontend/src/pages/GameViewer.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getGameContent } from '../utils/GameContent';
import { showNotification, getTranslation } from '../utils/Languages';
import InteractiveQuestion from '../components/InteractiveQuestion';

const GameViewer = ({ game, onCompleteGame, onBack, getTranslation }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [gameStartedTime, setGameStartedTime] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const gameDetails = getGameContent(game);
  const gameType = gameDetails.type || 'quiz';
  const questions = gameDetails.questions || [];
  const totalQuestions = questions.length;

  // Move useMemo to top level - always called
  const shuffledQuestions = useMemo(() => {
    if (questions.length > 0) {
      return [...questions].sort(() => Math.random() - 0.5);
    }
    return [];
  }, [game.id, questions]);

  // Reset state when a new game is loaded
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnsweredCount(0);
    setUserAnswers({});
    setGameStartedTime(Date.now());
    setGameOver(false);
  }, [game]);

  // Handle game completion for interactive games
  const handleInteractiveGameComplete = useCallback((finalScore, timeSpent) => {
    const scorePercentage = Math.min(100, Math.max(0, finalScore));
    onCompleteGame(game.id, scorePercentage, timeSpent);
  }, [game.id, onCompleteGame]);

  // Listen for messages from HTML games
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'gameComplete') {
        handleInteractiveGameComplete(event.data.score, event.data.timeSpent);
      } else if (event.data.type === 'exitGame') {
        onBack();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handleInteractiveGameComplete, onBack]);

  const handleAnswer = useCallback((questionId, isCorrect, selectedText) => {
    if (userAnswers[questionId] || gameOver) return;
    setUserAnswers(prev => ({ ...prev, [questionId]: { isCorrect, selectedText } }));
    setAnsweredCount(prev => prev + 1);
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  }, [userAnswers, gameOver]);

  const handleNextQuestion = useCallback(() => {
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    if (!userAnswers[currentQuestion?.id] && !gameOver) {
      showNotification(getTranslation('pleaseAnswerQuestion'), 'warning');
      return;
    }

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setGameOver(true);
      const timeSpent = gameStartedTime ? Math.floor((Date.now() - gameStartedTime) / 1000) : 0;
      const finalScorePercentage = Math.round((score / totalQuestions) * 100);
      onCompleteGame(game.id, finalScorePercentage, timeSpent);
    }
  }, [currentQuestionIndex, totalQuestions, userAnswers, gameOver, shuffledQuestions, gameStartedTime, score, game.id, onCompleteGame, getTranslation]);

  if (!gameDetails) {
    return (
      <div className="page-container">
        <h2 className="page-title">{getTranslation('gameContentUnavailable')}</h2>
        <p>{getTranslation('gameContentBeingDeveloped')}</p>
        <button className="action-button secondary mt-20" onClick={onBack}>
          {getTranslation('backToGames')}
        </button>
      </div>
    );
  }

  // Render HTML games
  if (gameType === 'html_game') {
    return (
      <div className="page-container game-viewer-container">
        <h2 className="page-title">🎮 {getTranslation(gameDetails.title)}</h2>
        <p className="game-description-text">{getTranslation(gameDetails.description)}</p>
        
        <div className="html-game-container">
          <iframe
            srcDoc={gameDetails.gameHtml}
            style={{
              width: '100%',
              height: '600px',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}
            title={gameDetails.title}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
        
        <button className="action-button secondary mt-20" onClick={onBack}>
          {getTranslation('backToGames')}
        </button>
      </div>
    );
  }

  // Render quiz games
  if (gameType === 'quiz') {
    if (questions.length === 0) {
      return (
        <div className="page-container">
          <h2 className="page-title">{getTranslation('gameContentUnavailable')}</h2>
          <p>{getTranslation('gameContentBeingDeveloped')}</p>
          <button className="action-button secondary mt-20" onClick={onBack}>
            {getTranslation('backToGames')}
          </button>
        </div>
      );
    }

    const currentQuestion = shuffledQuestions[currentQuestionIndex];

    return (
      <div className="page-container game-viewer-container">
        <h2 className="page-title">🎮 {getTranslation(gameDetails.title)}</h2>
        <p className="game-description-text">{getTranslation(gameDetails.description)}</p>
        
        {!gameOver ? (
          <>
            <div className="game-stats">
              <p>{getTranslation('score')}: {score} / {answeredCount}</p>
              <p>{getTranslation('question')}: {currentQuestionIndex + 1} / {totalQuestions}</p>
            </div>

            {currentQuestion && (
              <InteractiveQuestion
                key={currentQuestion.id}
                question={currentQuestion}
                onAnswer={handleAnswer}
                showFeedback={true}
                disabled={userAnswers[currentQuestion.id] !== undefined}
                getTranslation={getTranslation}
              />
            )}

            <div className="game-navigation-buttons">
              <button
                className="action-button primary"
                onClick={handleNextQuestion}
                disabled={!userAnswers[currentQuestion?.id] && answeredCount > 0 && !gameOver}
              >
                {currentQuestionIndex < totalQuestions - 1 ? getTranslation('nextQuestion') : getTranslation('finishGame')} ➡️
              </button>
            </div>
          </>
        ) : (
          <div className="game-over-screen text-center">
            <h3>{getTranslation('gameOver')}!</h3>
            <p>{getTranslation('finalScore')}: {score} / {totalQuestions}</p>
            <p>{getTranslation('percentageScore')}: {Math.round((score / totalQuestions) * 100)}%</p>
            <p>{getTranslation('gameCompletedSuccessfully')}</p>
          </div>
        )}

        {!gameOver && (
          <button className="action-button secondary mt-20" onClick={onBack}>
            {getTranslation('backToGames')}
          </button>
        )}
      </div>
    );
  }

  // Fallback for unknown game types
  return (
    <div className="page-container">
      <h2 className="page-title">{getTranslation('gameContentUnavailable')}</h2>
      <p>{getTranslation('gameContentBeingDeveloped')}</p>
      <button className="action-button secondary mt-20" onClick={onBack}>
        {getTranslation('backToGames')}
      </button>
    </div>
  );
};

export default GameViewer;
