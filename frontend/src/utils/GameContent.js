// frontend/src/utils/GameContent.js
// This holds the detailed content for your interactive games

export const getGameContent = (game) => {
    // Ensure game object is valid and has an ID
    if (!game || !game.id) {
        return {
            title: 'Game Content Unavailable',
            description: 'Game details are missing.',
            type: 'quiz',
            questions: []
        };
    }

    const contentDatabase = {
        'math_quiz_8': { // Math Space Adventure Game - MODIFIED FOR INVALID ANSWER POP-UP AND ESCAPING
            title: 'Math Space Adventure',
            description: 'Navigate your spaceship through space by solving algebra problems!',
            type: 'html_game',
            gameHtml: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Grade 8 Math Space Adventure</title>
  <style>
    /* General Styles */
    body {
      margin: 0;
      padding: 0;
      background: radial-gradient(circle, #081D58, #0A1128);
      overflow: hidden;
      font-family: 'Segoe UI', sans-serif;
      color: #fff;
      text-align: center;
    }
    canvas {
      background: #000;
      display: block;
      margin: 0 auto;
      border: 2px solid #00ffcc;
    }
    #score {
      position: absolute;
      top: 10px;
      width: 100%;
      text-align: center;
      font-size: 1.2rem;
    }
    #exitGameTop { /* Renamed to avoid conflict if other games use #exitGame */
      position: absolute;
      top: 10px;
      right: 10px;
      background: #ff4444;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
    }
    /* Modal Styles for Game Over, Ready, Invalid Answer, and Victory Screen */
    .modal {
      display: none;
      position: fixed;
      z-index: 100;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.85);
      justify-content: center;
      align-items: center;
      animation: fadeIn 0.5s;
    }
    .modal-content {
      background: linear-gradient(135deg, #222, #333);
      padding: 30px;
      border: 3px solid;
      border-radius: 12px;
      text-align: center;
      max-width: 500px;
      width: 90%;
      box-shadow: 0 0 30px rgba(0,0,0,0.8);
      animation: slideDown 0.5s ease-out;
    }
    .game-over .modal-content {
      border-color: #ff0000;
      box-shadow: 0 0 30px rgba(255,0,0,0.8);
    }
    .ready .modal-content, .victory .modal-content {
      border-color: #00ffcc;
      box-shadow: 0 0 30px rgba(0,255,204,0.8);
    }
    .invalid-answer .modal-content {
      border-color: #ffc107; /* Warning color */
      box-shadow: 0 0 30px rgba(255,193,7,0.8);
    }
    .modal-content h2 {
      margin-top: 0;
      font-size: 2rem;
    }
    .modal-content p {
      font-size: 1.2rem;
      margin: 20px 0;
    }
    .modal-content button {
      background: #00ffcc;
      color: #000;
      border: none;
      padding: 10px 20px;
      margin-top: 20px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      margin: 5px; /* Added margin for multiple buttons */
    }
    .game-over .modal-content button {
      background: #ff0000;
      color: #fff;
    }
    .invalid-answer .modal-content button.exit-btn {
      background: #ffc107; /* Warning color for exit */
      color: #000;
    }
    @keyframes slideDown {
      from { transform: translateY(-50px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  </style>
</head>
<body>
  <div id="score">Score: 0</div>
  <button id="exitGameTop" onclick="window.parent.postMessage({type: 'exitGame'}, '*')">❌ Exit</button>
  <canvas id="gameCanvas" width="800" height="400"></canvas>
  
  <!-- Ready Modal -->
  <div id="readyModal" class="modal ready">
    <div class="modal-content">
      <h2>🚀 Prepare to Solve</h2>
      <p id="readyQuestion">Question appears here</p>
      <button onclick="startProblem()">Ready to Launch!</button>
    </div>
  </div>
  
  <!-- Invalid Answer Modal -->
  <div id="invalidAnswerModal" class="modal invalid-answer">
    <div class="modal-content">
      <h2>⚠️ Invalid Answer!</h2>
      <p>That was not the correct solution. You can restart or exit.</p>
      <button onclick="restartGame()">Try Again</button>
      <button class="exit-btn" onclick="exitGame(0)">❌ Exit Game</button> <!-- Pass 0 score on exit -->
    </div>
  </div>

  <!-- Game Over Modal (for spaceship destroyed) -->
  <div id="gameOverModal" class="modal game-over">
    <div class="modal-content">
      <h2>💥 Mission Failed!</h2>
      <p id="gameOverMessage">Your spaceship was destroyed.</p>
      <button onclick="restartGame()">Restart Mission</button>
      <button class="exit-btn" onclick="exitGame(0)">❌ Exit Game</button> <!-- Pass 0 score on exit -->
    </div>
  </div>

  <!-- Victory Modal -->
  <div id="victoryModal" class="modal victory">
    <div class="modal-content">
      <h2>🎉 Mission Accomplished!</h2>
      <p>You\'ve successfully completed all math challenges!</p>
      <p id="finalScore">Final Score: 0/5</p>
      <button onclick="completeGame()">Continue</button>
    </div>
  </div>

  <script>
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const scoreEl = document.getElementById("score");
    const gameOverModal = document.getElementById("gameOverModal");
    const readyModal = document.getElementById("readyModal");
    const invalidAnswerModal = document.getElementById("invalidAnswerModal"); // NEW MODAL
    const victoryModal = document.getElementById("victoryModal");
    const readyQuestionEl = document.getElementById("readyQuestion");
    const gameOverMessageEl = document.getElementById("gameOverMessage");
    const finalScoreEl = document.getElementById("finalScore");

    // Game variables - DEFINED HERE
    let score = 0;
    let gamePaused = true;
    let gameOver = false;
    let gameLoopStarted = false;
    let gameStartTime = Date.now();
    let totalProblemsSolved = 0; // Track how many problems were correctly solved
    const PROBLEMS_TO_WIN = 5; // Number of correct answers to win

    // Spaceship properties
    const spaceship = { 
      x: 50, 
      y: canvas.height/2 - 20, 
      width: 40, 
      height: 20, 
      speed: 1.5 
    };
    
    let currentProblem = null;
    let answerTokens = [];

    // Define math problems based on NCERT Class 8 topics
    const mathProblems = [
      {
        question: "Simplify: 2(3x + 4) - 5x",
        correct: "x + 8",
        decoys: ["6x + 8", "x + 4", "x + 2"]
      },
      {
        question: "Solve: 3x - 5 = 10",
        correct: "x = 5",
        decoys: ["x = 3", "x = -5", "3x = 15"]
      },
      {
        question: "Find x: (2x)/3 = 8",
        correct: "x = 12",
        decoys: ["x = 10", "x = 8", "x = 16"]
      },
      {
        question: "Evaluate: a² + b², where a = 3, b = 4",
        correct: "25",
        decoys: ["5", "7", "9"]
      },
      {
        question: "Factorize: x² - 9",
        correct: "(x - 3)(x + 3)",
        decoys: ["(x - 9)(x + 1)", "(x - 3)²", "(x + 3)²"]
      },
      {
        question: "Solve: 4x + 7 = 23",
        correct: "x = 4",
        decoys: ["x = 6", "x = 8", "x = 2"]
      },
      {
        question: "Simplify: 5(2x - 3) + 4x",
        correct: "14x - 15",
        decoys: ["10x - 15", "14x + 15", "9x - 15"]
      },
      {
        question: "What is 3² + 4²?",
        correct: "25",
        decoys: ["49", "12", "7"]
      }
    ];

    function showReadyModal() {
      readyQuestionEl.innerText = currentProblem.question;
      readyModal.style.display = "flex";
      gamePaused = true;
    }

    function startProblem() {
      readyModal.style.display = "none";
      generateTokens();
      if (!gameLoopStarted) {
        gameLoopStarted = true;
        gamePaused = false;
        gameLoop();
      } else {
        gamePaused = false;
      }
    }

    function loadNewProblem() {
      currentProblem = mathProblems[Math.floor(Math.random() * mathProblems.length)];
      showReadyModal();
    }

    function generateTokens() {
      answerTokens = [];
      let answers = [currentProblem.correct, ...currentProblem.decoys.slice(0, 3)];
      answers = answers.slice(0, 4);
      answers.sort(() => Math.random() - 0.5);
      const gap = canvas.height / (answers.length + 1);
      answers.forEach((ans, i) => {
        ctx.font = "18px sans-serif";
        const textWidth = ctx.measureText(ans).width;
        const radius = Math.max(28, textWidth / 2 + 18);
        answerTokens.push({
          text: ans,
          x: canvas.width + Math.random() * 100,
          y: gap * (i + 1),
          radius: radius,
          speed: 1 + Math.random(),
          hover: false
        });
      });
    }

    function drawSpaceship() {
      ctx.save();
      ctx.shadowColor = "#00ffcc";
      ctx.shadowBlur = 20;
      ctx.fillStyle = "#00ffcc";
      ctx.fillRect(spaceship.x, spaceship.y, spaceship.width, spaceship.height);
      ctx.restore();
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.moveTo(spaceship.x + spaceship.width, spaceship.y);
      ctx.lineTo(spaceship.x + spaceship.width + 10, spaceship.y + spaceship.height/2);
      ctx.lineTo(spaceship.x + spaceship.width, spaceship.y + spaceship.height);
      ctx.closePath();
      ctx.fill();
      ctx.save();
      ctx.shadowColor = "#ff4500";
      ctx.shadowBlur = 15;
      ctx.fillStyle = "rgba(255, 69, 0, 0.7)";
      ctx.beginPath();
      ctx.moveTo(spaceship.x, spaceship.y + 5);
      ctx.lineTo(spaceship.x - 15, spaceship.y + spaceship.height/2);
      ctx.lineTo(spaceship.x, spaceship.y + spaceship.height - 5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function drawTokens() {
      answerTokens.forEach(token => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(token.x, token.y, token.radius, 0, Math.PI * 2);
        ctx.fillStyle = token.hover ? "#00ffcc" : "#ffcc00";
        ctx.shadowColor = token.hover ? "#00ffcc" : "#ffcc00";
        ctx.shadowBlur = token.hover ? 20 : 8;
        ctx.fill();
        ctx.restore();
        ctx.fillStyle = token.hover ? "#000" : "#222";
        ctx.font = "18px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.save();
        ctx.beginPath();
        ctx.arc(token.x, token.y, token.radius - 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.fillText(token.text, token.x, token.y);
        ctx.restore();
      });
    }

    function drawStars() {
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      for (let i = 0; i < 50; i++) {
        const x = (Date.now() * 0.01 + i * 37) % canvas.width;
        const y = (i * 67) % canvas.height;
        ctx.fillRect(x, y, 1, 1);
      }
    }

    function updateTokens() {
      answerTokens.forEach(token => {
        token.x -= token.speed;
      });
      answerTokens = answerTokens.filter(token => token.x + token.radius > -50);
    }

    function checkCollision(rect, circle) {
      const nearestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
      const nearestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
      const dx = circle.x - nearestX;
      const dy = circle.y - nearestY;
      return (dx * dx + dy * dy) < (circle.radius * circle.radius);
    }

    // NEW: Function to show invalid answer modal
    function showInvalidAnswerModal() {
      gamePaused = true;
      invalidAnswerModal.style.display = "flex";
      // No points awarded for incorrect answer
    }

    // Trigger game over (for spaceship destroyed or out of bounds)
    function triggerGameOver(message = "Your spaceship was destroyed.", scoreOnExit = 0) { // Added scoreOnExit parameter
      gamePaused = true;
      gameOver = true;
      gameOverMessageEl.innerText = message;
      
      const timeSpent = Math.floor((Date.now() - gameStartTime) / 1000);
      const finalScore = scoreOnExit; // Use scoreOnExit for game over
      
      flashMessage("Mission Failed!", () => {
        window.parent.postMessage({
          type: 'gameComplete',
          score: finalScore, // Send the explicit score (0 in this case)
          timeSpent: timeSpent
        }, '*');
        gameOverModal.style.display = "flex";
      });
    }

    function triggerVictory() {
      gamePaused = true;
      gameOver = true;
      finalScoreEl.innerText = \`Perfect Score: \${totalProblemsSolved}/\${PROBLEMS_TO_WIN} problems solved!\`;
      
      const timeSpent = Math.floor((Date.now() - gameStartTime) / 1000);
      const finalScore = 100; // Perfect score
      
      flashMessage("Mission Accomplished!", () => {
        window.parent.postMessage({
          type: 'gameComplete',
          score: finalScore,
          timeSpent: timeSpent
        }, '*');
        victoryModal.style.display = "flex";
      });
    }

    function updateGame() {
      if (!gamePaused) {
        spaceship.x += spaceship.speed / 2;
        updateTokens();
      }
      answerTokens.forEach(token => {
        if (checkCollision(spaceship, token)) {
          if (token.text === currentProblem.correct) {
            score++;
            totalProblemsSolved++; // Increment problems solved
            scoreEl.innerText = "Score: " + score;
            gamePaused = true;
            
            flashMessage("Correct! +1 Point", () => {
              spaceship.x = 50;
              if (totalProblemsSolved >= PROBLEMS_TO_WIN) { // Win condition
                triggerVictory();
              } else {
                loadNewProblem();
              }
            });
          } else {
            // Wrong answer: show invalid answer modal, no points awarded
            showInvalidAnswerModal();
          }
        }
      });
      if (spaceship.y < 0 || spaceship.y > canvas.height - spaceship.height) {
        triggerGameOver("Spaceship went out of bounds!", 0); // Pass 0 score
      }
      if (answerTokens.every(token => token.x + token.radius < 0) && !gamePaused) {
        generateTokens();
      }
    }

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawStars();
      drawSpaceship();
      drawTokens();
    }

    function gameLoop() {
      if (!gameOver) {
        updateGame();
        render();
        requestAnimationFrame(gameLoop);
      }
    }

    document.addEventListener("keydown", (e) => {
      if (gamePaused) return;
      if (e.key === "ArrowUp") {
        spaceship.y = Math.max(0, spaceship.y - 10);
      } else if (e.key === "ArrowDown") {
        spaceship.y = Math.min(canvas.height - spaceship.height, spaceship.y + 10);
      } else if (e.key === "ArrowLeft") {
        spaceship.x = Math.max(0, spaceship.x - 10);
      } else if (e.key === "ArrowRight") {
        spaceship.x = Math.min(canvas.width - spaceship.width, spaceship.x + 10);
      }
    });
    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      answerTokens.forEach(token => {
        const dist = Math.sqrt((mx - token.x) ** 2 + (my - token.y) ** 2);
        token.hover = dist < token.radius;
      });
    });

    function flashMessage(message, callback) {
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00ffcc";
      ctx.font = "40px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(message, canvas.width/2, canvas.height/2);
      setTimeout(callback, 1000);
    }

    function restartGame() {
      gameOver = false;
      gamePaused = true;
      gameLoopStarted = false;
      spaceship.x = 50;
      spaceship.y = canvas.height/2 - 20;
      score = 0;
      totalProblemsSolved = 0;
      scoreEl.innerText = "Score: " + score;
      gameOverModal.style.display = "none";
      invalidAnswerModal.style.display = "none"; // Hide invalid answer modal
      victoryModal.style.display = "none";
      gameStartTime = Date.now();
      loadNewProblem();
    }

    function exitGame(scoreToReport = 0) { // Added scoreToReport parameter
      const timeSpent = Math.floor((Date.now() - gameStartTime) / 1000);
      window.parent.postMessage({
        type: 'gameComplete',
        score: scoreToReport, // Send the explicit score (0 for invalid/game over exits)
        timeSpent: timeSpent
      }, '*');
      window.parent.postMessage({type: 'exitGame'}, '*');
    }

    // Initialize the game by loading the first problem (game loop starts when user clicks Ready)
    loadNewProblem();
  </script>
</body>
</html>`
        },

        'science_experiment_8': { // Light Reflection Game - CORRECTED ESCAPING
            title: 'Light Reflection Physics',
            description: 'Learn about light reflection by directing laser beams with mirrors!',
            type: 'html_game',
            gameHtml: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Light Reflection Game</title>
  <style>
    /* General Styles */
    body {
      background: linear-gradient(135deg, #000428, #004e92);
      color: #f0f0f0;
      text-align: center;
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
      overflow: hidden;
    }
    h1 {
      margin-top: 20px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
      animation: fadeIn 2s ease-in-out;
    }
    canvas {
      border: 3px solid #f0f0f0;
      background: #111;
      display: block;
      margin: 20px auto;
      box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
    }
    #info {
      margin-top: 10px;
      font-size: 1.1rem;
      line-height: 1.5;
    }
    #exitGame {
      position: absolute;
      top: 10px;
      right: 10px;
      background: #ff4444;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
    }
    /* Modal Styles */
    .modal {
      display: none;
      position: fixed;
      z-index: 99;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background: rgba(0, 0, 0, 0.85);
      justify-content: center;
      align-items: center;
      animation: fadeIn 0.5s;
    }
    .modal-content {
      background: linear-gradient(135deg, #222, #333);
      margin: auto;
      padding: 30px;
      border: 3px solid #00ffcc;
      width: 90%;
      max-width: 500px;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 0 30px rgba(0, 255, 204, 0.8);
      animation: slideDown 0.5s ease-out;
    }
    .modal-content h2 {
      margin-top: 0;
      font-size: 2rem;
      color: #00ffcc;
    }
    .modal-content p {
      font-size: 1.2rem;
    }
    .close-button {
      color: #00ffcc;
      float: right;
      font-size: 2rem;
      cursor: pointer;
    }
    .modal-content button {
      background: #00ffcc;
      color: #111;
      font-size: 1.1rem;
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      margin-top: 15px;
    }
    .modal-content button:hover {
      background: #00e6b8;
    }
    @keyframes slideDown {
      from { transform: translateY(-50px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  </style>
</head>
<body>
  <h1>💡 Light Reflection Game</h1>
  <button id="exitGame" onclick="window.parent.postMessage({type: 'exitGame'}, '*')">❌ Exit</button>
  <canvas id="gameCanvas" width="600" height="400"></canvas>
  <div id="info">
    Use ◀ and ▶ keys to rotate the mirror.<br>
    Understand the physics: <br>
    <span style="color:red;">Incident Ray</span> (red) and <span style="color:#00ffcc;">Reflected Ray</span> (highlighted on hit).
  </div>

  <!-- Victory Modal -->
  <div id="victoryModal" class="modal">
    <div class="modal-content">
      <span class="close-button" onclick="hideVictoryModal()">&times;</span>
      <h2>Excellent Reflection!</h2>
      <p>You successfully directed the beam!</p>
      <button onclick="completeGame()">Continue</button>
      <button onclick="resetGame()">Try Again</button>
    </div>
  </div>

  <script>
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    let hasWon = false;
    let attempts = 0;
    let gameStartTime = Date.now();

    let mirror = {
      x: 300,
      y: 300,
      length: 100,
      angle: 45 * Math.PI / 180
    };

    const target = { x: 500, y: 100, radius: 30 };
    const laserStart = { x: 100, y: 100 };

    document.addEventListener("keydown", (e) => {
      if (hasWon) return;
      if (e.key === "ArrowLeft") {
        mirror.angle -= 0.05;
        attempts++;
      }
      if (e.key === "ArrowRight") {
        mirror.angle += 0.05;
        attempts++;
      }
    });

    function drawMirror() {
      ctx.strokeStyle = "cyan";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(
        mirror.x - Math.cos(mirror.angle) * mirror.length / 2,
        mirror.y - Math.sin(mirror.angle) * mirror.length / 2
      );
      ctx.lineTo(
        mirror.x + Math.cos(mirror.angle) * mirror.length / 2,
        mirror.y + Math.sin(mirror.angle) * mirror.length / 2
      );
      ctx.stroke();
    }

    function drawTarget() {
      ctx.save();
      ctx.translate(target.x, target.y);
      const pulse = 1 + 0.1 * Math.sin(Date.now() / 200);
      ctx.scale(pulse, pulse);
      ctx.fillStyle = "yellow";
      ctx.beginPath();
      ctx.arc(0, 0, target.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function reflectRay(incident, normal) {
      const dot = incident.x * normal.x + incident.y * normal.y;
      return {
        x: incident.x - 2 * dot * normal.x,
        y: incident.y - 2 * dot * normal.y
      };
    }

    function distanceToSegment(px, py, x1, y1, x2, y2) {
      const A = px - x1;
      const B = py - y1;
      const C = x2 - x1;
      const D = y2 - y1;

      const dot = A * C + B * D;
      const lenSq = C * C + D * D;
      let param = -1;
      if (lenSq !== 0) {
        param = dot / lenSq;
      }
      let xx, yy;
      if (param < 0) {
        xx = x1;
        yy = y1;
      } else if (param > 1) {
        xx = x2;
        yy = y2;
      } else {
        xx = x1 + param * C;
        yy = y1 + param * D;
      }
      const dx = px - xx;
      const dy = py - yy;
      return Math.hypot(dx, dy);
    }

    function drawLaser() {
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(laserStart.x, laserStart.y);
      ctx.lineTo(mirror.x, mirror.y);
      ctx.stroke();
      
      ctx.fillStyle = "red";
      ctx.font = "14px sans-serif";
      const incidentMidX = (laserStart.x + mirror.x) / 2;
      const incidentMidY = (laserStart.y + mirror.y) / 2;
      ctx.fillText("Incident", incidentMidX + 5, incidentMidY - 5);

      const normal = {
        x: -Math.sin(mirror.angle),
        y: Math.cos(mirror.angle)
      };

      const incident = {
        x: mirror.x - laserStart.x,
        y: mirror.y - laserStart.y
      };
      const len = Math.hypot(incident.x, incident.y);
      incident.x /= len;
      incident.y /= len;

      const reflected = reflectRay(incident, normal);
      const beamLength = 500;
      const beamEndX = mirror.x + reflected.x * beamLength;
      const beamEndY = mirror.y + reflected.y * beamLength;

      const dist = distanceToSegment(target.x, target.y, mirror.x, mirror.y, beamEndX, beamEndY);
      if (dist <= target.radius && !hasWon) {
        hasWon = true;
        ctx.strokeStyle = "#00ffcc";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(mirror.x, mirror.y);
        ctx.lineTo(beamEndX, beamEndY);
        ctx.stroke();
        
        setTimeout(showVictoryModal, 100);
      } else {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(mirror.x, mirror.y);
        ctx.lineTo(beamEndX, beamEndY);
        ctx.stroke();
      }
      
      ctx.fillStyle = "#00ffcc";
      const reflectedMidX = (mirror.x + beamEndX) / 2;
      const reflectedMidY = (mirror.y + beamEndY) / 2;
      ctx.fillText("Reflected", reflectedMidX + 5, reflectedMidY - 5);

      const angleI = Math.atan2(incident.y, incident.x);
      const angleN = Math.atan2(normal.y, normal.x);
      const angleR = Math.atan2(reflected.y, reflected.x);
      
      let incDiff = Math.abs(angleI - angleN);
      if (incDiff > Math.PI / 2) {
        incDiff = Math.PI - incDiff;
      }
      let refDiff = Math.abs(angleR - angleN);
      if (refDiff > Math.PI / 2) {
        refDiff = Math.PI - refDiff;
      }
      const incDeg = (incDiff * 180 / Math.PI).toFixed(1);
      const refDeg = (refDiff * 180 / Math.PI).toFixed(1);

      ctx.fillStyle = "#ffffff";
      ctx.font = "16px sans-serif";
      ctx.fillText("Angle of Incidence: " + incDeg + "°", 10, canvas.height - 30);
      ctx.fillText("Angle of Reflection: " + refDeg + "°", 10, canvas.height - 10);
    }

    function showVictoryModal() {
      const modal = document.getElementById("victoryModal");
      modal.style.display = "flex";
    }

    function hideVictoryModal() {
      const modal = document.getElementById("victoryModal");
      modal.style.display = "none";
    }

    function completeGame() {
      const timeSpent = Math.floor((Date.now() - gameStartTime) / 1000);
      const efficiency = Math.max(0, 100 - attempts * 2);
      
      window.parent.postMessage({
        type: 'gameComplete',
        score: efficiency,
        timeSpent: timeSpent
      }, '*');
    }

    function resetGame() {
      hideVictoryModal();
      hasWon = false;
      attempts = 0;
      gameStartTime = Date.now();
      mirror.angle = 45 * Math.PI / 180;
      target.x = 400 + Math.random() * 150;
      target.y = 50 + Math.random() * 150;
    }

    function gameLoop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawTarget();
      drawMirror();
      drawLaser();
      requestAnimationFrame(gameLoop);
    }
    
    gameLoop();
  </script>
</body>
</html>`
        },

        // Other placeholder games remain the same...
        'english_word_game_8': {
            title: 'Word Builder Game',
            description: 'Build your vocabulary with fun word games',
            type: 'quiz',
            questions: [
                {
                    id: 'eng_q1',
                    questionText: 'What is the synonym of "Happy"?',
                    options: [
                        { text: 'Sad', isCorrect: false },
                        { text: 'Joyful', isCorrect: true },
                        { text: 'Angry', isCorrect: false },
                        { text: 'Tired', isCorrect: false }
                    ]
                }
            ]
        },

        'hindi_story_game_8': {
            title: 'Hindi Story Adventure',
            description: 'Interactive stories in Hindi',
            type: 'quiz',
            questions: [
                {
                    id: 'hindi_q1',
                    questionText: 'हिंदी में "पुस्तक" का अर्थ क्या है?',
                    options: [
                        { text: 'Book', isCorrect: true },
                        { text: 'Pen', isCorrect: false },
                        { text: 'Paper', isCorrect: false },
                        { text: 'Table', isCorrect: false }
                    ]
                }
            ]
        },

        'social_history_game_8': {
            title: 'History Timeline Game',
            description: 'Explore historical events through games',
            type: 'quiz',
            questions: [
                {
                    id: 'social_q1',
                    questionText: 'Who was the first Prime Minister of India?',
                    options: [
                        { text: 'Mahatma Gandhi', isCorrect: false },
                        { text: 'Jawaharlal Nehru', isCorrect: true },
                        { text: 'Sardar Patel', isCorrect: false },
                        { text: 'Dr. APJ Abdul Kalam', isCorrect: false }
                    ]
                }
            ]
        }
    };
    
    return contentDatabase[game.id] || {
        title: game.title,
        description: game.description,
        type: 'quiz',
        questions: []
    };
};
