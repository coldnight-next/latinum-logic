// Mini-Games Suite for Ferengi Rule Oracle

class GameManager {
  constructor() {
    this.currentGame = null;
    try {
      this.gamesPlayed = JSON.parse(localStorage.getItem('gamesPlayed') || '0');
      this.highScores = JSON.parse(localStorage.getItem('gameHighScores') || '{}');
    } catch (e) {
      console.warn('Failed to load game data from localStorage:', e);
      this.gamesPlayed = 0;
      this.highScores = {};
    }
    this.initializeGames();
  }

  initializeGames() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.createGamesUI();
        this.bindGameEvents();
        this.bindNavigationEvents();
      });
    } else {
      this.createGamesUI();
      this.bindGameEvents();
      this.bindNavigationEvents();
    }
  }

  createGamesUI() {
    // Check if games section already exists - be thorough
    const existingSections = document.querySelectorAll('.games-section');
    if (existingSections.length > 0) {
      console.log('Games section already exists, not creating duplicate');
      // Clean up any duplicates beyond the first
      existingSections.forEach((section, index) => {
        if (index > 0) section.remove();
      });
      return;
    }

    const gamesSection = document.createElement('section');
    gamesSection.className = 'panel games-section';
    gamesSection.id = 'games-section-dynamic';
    gamesSection.innerHTML = `
      <h2>🎮 Ferengi Games</h2>
      <p>Test your knowledge of the Rules of Acquisition with these engaging mini-games!</p>

      <div class="games-grid">
        <div class="game-card" data-game="matching">
          <div class="game-icon">🎯</div>
          <h3>Rule Matching</h3>
          <p>Drag rules to their correct categories. Test your knowledge!</p>
          <button class="game-btn" data-game="matching">Play Now</button>
        </div>

        <div class="game-card" data-game="calculator">
          <div class="game-icon">🧮</div>
          <h3>Profit Calculator</h3>
          <p>Calculate profits with Ferengi wisdom and advice.</p>
          <button class="game-btn" data-game="calculator">Calculate</button>
        </div>

        <div class="game-card" data-game="trivia">
          <div class="game-icon">🧠</div>
          <h3>Rule Trivia</h3>
          <p>Answer questions about the Rules of Acquisition.</p>
          <button class="game-btn" data-game="trivia">Start Quiz</button>
        </div>

        <div class="game-card" data-game="memory">
          <div class="game-icon">🧩</div>
          <h3>Memory Challenge</h3>
          <p>Match rule numbers to their texts in this memory game.</p>
          <button class="game-btn" data-game="memory">Challenge</button>
        </div>
      </div>

      <div id="game-container" style="display: none;"></div>

      <div class="game-controls" style="margin-top: 1rem;">
        <button id="games-back" class="action-btn secondary">← Back to Main</button>
      </div>
    `;

    // Insert games section into the main content area
    const resultPanel = document.getElementById('result-panel');
    const main = document.querySelector('main') || document.querySelector('.council');

    if (resultPanel && resultPanel.parentNode) {
      resultPanel.parentNode.insertBefore(gamesSection, resultPanel.nextSibling);
    } else if (main) {
      main.appendChild(gamesSection);
    } else {
      // Fallback: append to body
      document.body.appendChild(gamesSection);
    }

    // Initially hide the games section
    gamesSection.style.display = 'none';
  }

  bindGameEvents() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('game-btn')) {
        const gameType = e.target.dataset.game;
        this.startGame(gameType);
      }
    });
  }

  bindNavigationEvents() {
    const gamesToggle = document.getElementById('games-toggle');
    if (gamesToggle) {
      gamesToggle.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Games toggle clicked');
        this.showGamesSection();
      });
    } else {
      console.error('Games toggle button not found!');
    }

    const gamesBack = document.getElementById('games-back');
    if (gamesBack) {
      gamesBack.addEventListener('click', () => {
        this.hideGamesSection();
      });
    }
  }

  hideGamesSection() {
    const sections = document.querySelectorAll('.panel');
    sections.forEach(section => {
      if (section.classList.contains('games-section')) {
        section.style.display = 'none';
      } else {
        section.style.display = '';
      }
    });
  }

  showGamesSection() {
    console.log('Showing games section...');

    // Hide other sections first
    const sections = document.querySelectorAll('.panel');
    sections.forEach(section => {
      if (!section.classList.contains('games-section')) {
        section.style.display = 'none';
      }
    });

    // Find existing games section
    let gamesSection = document.querySelector('.games-section');

    // If no section exists, show loading and create one
    if (!gamesSection) {
      console.log('No games section found, creating new one...');
      
      // Show temporary loading state
      const main = document.querySelector('main') || document.querySelector('.council');
      if (main) {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'games-loading-temp';
        loadingDiv.className = 'panel games-loading';
        loadingDiv.innerHTML = '<div class="spinner"></div><p>Loading games...</p>';
        main.appendChild(loadingDiv);
      }
      
      this.createGamesUI();
      gamesSection = document.querySelector('.games-section');
      
      // Remove loading state
      const loadingTemp = document.getElementById('games-loading-temp');
      if (loadingTemp) loadingTemp.remove();
    }

    // Show the first games section only (in case there are duplicates)
    if (gamesSection) {
      console.log('Showing games section');
      gamesSection.style.display = 'block';

      // Hide any other games sections (cleanup duplicates)
      const allGamesSections = document.querySelectorAll('.games-section');
      allGamesSections.forEach((section, index) => {
        if (index === 0) {
          section.style.display = 'block';
        } else {
          console.log('Removing duplicate games section');
          section.remove();
        }
      });

      setTimeout(() => {
        gamesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      console.error('Could not create or find games section');
      if (window.showToast) window.showToast('Games are loading... Please try again in a moment.');
      else alert('Games are loading... Please try again in a moment.');
    }
  }

  startGame(gameType) {
    this.gamesPlayed++;
    try {
      localStorage.setItem('gamesPlayed', this.gamesPlayed.toString());
    } catch (e) {
      console.warn('Failed to save games played to localStorage:', e);
    }

    const gamesSection = document.querySelector('.games-section');
    const gameContainer = gamesSection ? gamesSection.querySelector('#game-container') : document.getElementById('game-container');

    // Hide section children except game container and back button
    if (gamesSection) {
      Array.from(gamesSection.children).forEach(child => {
        if (child.id !== 'game-container' && !child.querySelector('#games-back')) {
          child.style.display = 'none';
        }
      });
    }
    gameContainer.style.display = 'block';

    switch(gameType) {
      case 'matching':
        this.currentGame = new RuleMatchingGame(gameContainer);
        break;
      case 'calculator':
        this.currentGame = new ProfitCalculatorGame(gameContainer);
        break;
      case 'trivia':
        this.currentGame = new RuleTriviaGame(gameContainer);
        break;
      case 'memory':
        this.currentGame = new MemoryChallengeGame(gameContainer);
        break;
    }
  }

  endGame(force = false) {
    // Confirm if game is in progress and not forced
    if (this.currentGame && !force) {
      const confirmed = confirm('Are you sure you want to leave? Your game progress will be lost.');
      if (!confirmed) return;
    }
    
    const gamesSection = document.querySelector('.games-section');
    const gameContainer = gamesSection ? gamesSection.querySelector('#game-container') : document.getElementById('game-container');

    // Restore section children visibility
    if (gamesSection) {
      Array.from(gamesSection.children).forEach(child => {
        if (child.id !== 'game-container') {
          child.style.display = '';
        }
      });
    }
    if (gameContainer) {
      gameContainer.style.display = 'none';
      gameContainer.innerHTML = '';
    }
    this.currentGame = null;
  }

  updateHighScore(gameType, score) {
    const currentHigh = this.highScores[gameType] || 0;
    if (score > currentHigh) {
      this.highScores[gameType] = score;
      try {
        localStorage.setItem('gameHighScores', JSON.stringify(this.highScores));
      } catch (e) {
        console.warn('Failed to save high scores to localStorage:', e);
      }
      return true; // New high score
    }
    return false;
  }
}

// Rule Matching Game
class RuleMatchingGame {
  constructor(container) {
    this.container = container;
    this.score = 0;
    this.correctMatches = 0;
    this.totalRules = 10;
    this.timeLeft = 120; // 2 minutes
    this.timer = null;
    this.draggedElement = null;
    this.initializeGame();
  }

  initializeGame() {
    this.container.innerHTML = `
      <div class="game-header">
        <h3>🎯 Rule Matching Challenge</h3>
        <div class="game-stats">
          <span>Score: <strong id="matching-score">0</strong></span>
          <span>Time: <strong id="matching-timer">2:00</strong></span>
          <span>Progress: <strong id="matching-progress">0/10</strong></span>
        </div>
      </div>

      <div class="matching-game">
        <div class="rules-pool">
          <h4>Drag rules to categories:</h4>
          <div id="rules-container" class="rules-container"></div>
        </div>

        <div class="categories-grid">
          <div class="category-zone" data-category="profit">
            <h4>💰 Profit & Finance</h4>
            <div class="drop-zone" data-category="profit"></div>
          </div>
          <div class="category-zone" data-category="business">
            <h4>🏪 Business & Commerce</h4>
            <div class="drop-zone" data-category="business"></div>
          </div>
          <div class="category-zone" data-category="negotiation">
            <h4>⚖️ Negotiation & Deals</h4>
            <div class="drop-zone" data-category="negotiation"></div>
          </div>
          <div class="category-zone" data-category="ethics">
            <h4>🤔 Ethics & Morality</h4>
            <div class="drop-zone" data-category="ethics"></div>
          </div>
          <div class="category-zone" data-category="personal">
            <h4>👨‍👩‍👧‍👦 Personal Life</h4>
            <div class="drop-zone" data-category="personal"></div>
          </div>
          <div class="category-zone" data-category="wisdom">
            <h4>🧠 General Wisdom</h4>
            <div class="drop-zone" data-category="wisdom"></div>
          </div>
        </div>
      </div>

      <div class="game-controls">
        <button id="matching-hint" class="action-btn">💡 Hint (-50pts)</button>
        <button id="matching-reset" class="action-btn secondary">🔄 Reset Game</button>
        <button id="matching-end" class="action-btn secondary">🏁 End Game</button>
      </div>
    `;

    this.loadRules();
    this.bindEvents();
    this.startTimer();
  }

  loadRules() {
    // Get 10 random rules - check if rules variable exists
    const rulesData = window.rules || window.ferengiRules || [];
    console.log('Rule Matching Game - Rules found:', rulesData.length, 'rules');

    if (rulesData.length === 0) {
      console.error('No rules data found for game');
      // Add fallback rules for testing
      const fallbackRules = [
        { number: 1, text: "Once you have their money, never give it back", category: 'profit' },
        { number: 7, text: "Always keep your ears open", category: 'wisdom' },
        { number: 9, text: "Opportunity plus instinct equals profit", category: 'business' }
      ];
      this.gameRules = fallbackRules;
    } else {
      const shuffled = window.shuffleArray ? window.shuffleArray(rulesData) : [...rulesData].sort(() => Math.random() - 0.5);
      this.gameRules = shuffled.slice(0, this.totalRules);
    }

    const rulesContainer = document.getElementById('rules-container');
    if (!rulesContainer) {
      console.error('Rules container not found!');
      return;
    }

    console.log('Loading', this.gameRules.length, 'rules into game');
    this.gameRules.forEach((rule, index) => {
      const ruleElement = document.createElement('div');
      ruleElement.className = 'rule-card-draggable';
      ruleElement.draggable = true;
      ruleElement.dataset.ruleId = rule.number;
      ruleElement.dataset.category = rule.category;
      ruleElement.innerHTML = `
        <div class="rule-number">Rule ${rule.number}</div>
        <div class="rule-text">${rule.text}</div>
      `;
      rulesContainer.appendChild(ruleElement);
    });
  }

  bindEvents() {
    // Drag and drop events
    const draggables = document.querySelectorAll('.rule-card-draggable');
    const dropZones = document.querySelectorAll('.drop-zone');

    draggables.forEach(draggable => {
      draggable.addEventListener('dragstart', (e) => {
        this.draggedElement = e.target;
        e.target.classList.add('dragging');
      });

      draggable.addEventListener('dragend', (e) => {
        e.target.classList.remove('dragging');
        this.draggedElement = null;
      });
    });

    dropZones.forEach(zone => {
      zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('drag-over');
      });

      zone.addEventListener('dragleave', (e) => {
        zone.classList.remove('drag-over');
      });

      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        this.handleDrop(zone);
      });
    });

    // Control buttons
    const hintBtn = document.getElementById('matching-hint');
    const resetBtn = document.getElementById('matching-reset');
    const endBtn = document.getElementById('matching-end');

    if (hintBtn) hintBtn.addEventListener('click', () => this.showHint());
    if (resetBtn) resetBtn.addEventListener('click', () => this.resetGame());
    if (endBtn) endBtn.addEventListener('click', () => this.endGame());
  }

  handleDrop(dropZone) {
    if (!this.draggedElement) return;

    const ruleCategory = this.draggedElement.dataset.category;
    const targetCategory = dropZone.dataset.category;

    if (ruleCategory === targetCategory) {
      // Correct match
      this.score += Math.max(10, Math.floor(this.timeLeft / 12)); // Bonus for speed
      this.correctMatches++;
      this.draggedElement.classList.add('correct-match');
      dropZone.appendChild(this.draggedElement);
      this.draggedElement.draggable = false;

      // Visual feedback
      dropZone.classList.add('success');
      setTimeout(() => dropZone.classList.remove('success'), 500);

      this.updateUI();
      this.checkWinCondition();
    } else {
      // Incorrect match
      this.score = Math.max(0, this.score - 5);
      this.draggedElement.classList.add('wrong-match');
      setTimeout(() => this.draggedElement.classList.remove('wrong-match'), 500);

      // Visual feedback
      dropZone.classList.add('error');
      setTimeout(() => dropZone.classList.remove('error'), 500);

      this.updateUI();
    }
  }

  showHint() {
    if (this.score < 50) return;

    this.score -= 50;
    const remainingRules = document.querySelectorAll('.rule-card-draggable[draggable="true"]');
    if (remainingRules.length > 0) {
      const randomRule = remainingRules[Math.floor(Math.random() * remainingRules.length)];
      const category = randomRule.dataset.category;
      const categoryNames = {
        'profit': 'Profit & Finance',
        'business': 'Business & Commerce',
        'negotiation': 'Negotiation & Deals',
        'ethics': 'Ethics & Morality',
        'personal': 'Personal Life',
        'wisdom': 'General Wisdom'
      };
      const hintMsg = `Hint: Rule ${randomRule.dataset.ruleId} belongs in the ${categoryNames[category] || category} category!`;
      if (window.showToast) window.showToast(hintMsg, 4000);
      else alert(hintMsg);
    }
    this.updateUI();
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.timeLeft--;
      this.updateTimer();

      if (this.timeLeft <= 0) {
        this.endGame();
      }
    }, 1000);
  }

  updateTimer() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    const timerEl = document.getElementById('matching-timer');
    if (timerEl) {
      timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  }

  updateUI() {
    const scoreEl = document.getElementById('matching-score');
    const progressEl = document.getElementById('matching-progress');

    if (scoreEl) scoreEl.textContent = this.score;
    if (progressEl) progressEl.textContent = `${this.correctMatches}/${this.totalRules}`;
  }

  checkWinCondition() {
    if (this.correctMatches >= this.totalRules) {
      this.endGame(true);
    }
  }

  resetGame() {
    clearInterval(this.timer);
    gameManager.endGame();
    gameManager.startGame('matching');
  }

  endGame(won = false) {
    clearInterval(this.timer);

    const finalScore = won ? this.score + Math.floor(this.timeLeft / 6) : this.score;
    const isHighScore = gameManager.updateHighScore('matching', finalScore);

    this.container.innerHTML = `
      <div class="game-results">
        <h3>${won ? '🎉 Victory!' : '⏰ Time\'s Up!'}</h3>
        <div class="final-score">
          <div class="score-display">Final Score: <strong>${finalScore}</strong></div>
          ${isHighScore ? '<div class="high-score">🏆 New High Score!</div>' : ''}
          <div class="stats-breakdown">
            <p>Correct Matches: ${this.correctMatches}/${this.totalRules}</p>
            <p>Time Bonus: ${Math.floor(this.timeLeft / 6)} points</p>
          </div>
        </div>
        <div class="game-controls">
          <button onclick="gameManager.startGame('matching')" class="action-btn">🔄 Play Again</button>
          <button onclick="gameManager.endGame(true)" class="action-btn secondary">🏠 Back to Games</button>
        </div>
      </div>
    `;
  }
}

// Profit Calculator Game
class ProfitCalculatorGame {
  constructor(container) {
    this.container = container;
    this.currentValue = '0';
    this.previousValue = null;
    this.operation = null;
    this.waitingForOperand = false;
    this.calculationHistory = [];
    this.initializeGame();
  }

  initializeGame() {
    this.container.innerHTML = `
      <div class="game-header">
        <h3>🧮 Ferengi Profit Calculator</h3>
        <p>Calculate with wisdom from the Rules of Acquisition!</p>
      </div>

      <div class="calculator-game">
        <div class="calculator-display">
          <div id="calc-display" class="calc-display">0</div>
          <div id="ferengi-advice" class="ferengi-advice"></div>
        </div>

        <div class="calculator-buttons">
          <button class="calc-btn number" data-value="7">7</button>
          <button class="calc-btn number" data-value="8">8</button>
          <button class="calc-btn number" data-value="9">9</button>
          <button class="calc-btn operation" data-operation="/">÷</button>

          <button class="calc-btn number" data-value="4">4</button>
          <button class="calc-btn number" data-value="5">5</button>
          <button class="calc-btn number" data-value="6">6</button>
          <button class="calc-btn operation" data-operation="*">×</button>

          <button class="calc-btn number" data-value="1">1</button>
          <button class="calc-btn number" data-value="2">2</button>
          <button class="calc-btn number" data-value="3">3</button>
          <button class="calc-btn operation" data-operation="-">-</button>

          <button class="calc-btn number" data-value="0">0</button>
          <button class="calc-btn decimal" data-value=".">.</button>
          <button class="calc-btn equals" data-operation="=">=</button>
          <button class="calc-btn operation" data-operation="+">+</button>
        </div>

        <div class="profit-analysis">
          <h4>💡 Profit Analysis</h4>
          <button id="analyze-profit" class="action-btn">Analyze My Calculation</button>
          <div id="profit-insight" class="profit-insight" style="display: none;"></div>
        </div>

        <div class="calculation-history">
          <h4>📊 Recent Calculations</h4>
          <div id="history-list" class="history-list"></div>
        </div>
      </div>

      <div class="game-controls">
        <button onclick="gameManager.endGame()" class="action-btn secondary">🏠 Back to Games</button>
      </div>
    `;

    this.bindEvents();
    this.updateDisplay();
  }

  bindEvents() {
    const buttons = document.querySelectorAll('.calc-btn');
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const value = button.dataset.value;
        const operation = button.dataset.operation;

        if (value) {
          this.inputDigit(value);
        } else if (operation) {
          this.performOperation(operation);
        }
      });
    });

    document.getElementById('analyze-profit').addEventListener('click', () => this.analyzeProfit());
  }

  inputDigit(digit) {
    if (this.waitingForOperand) {
      this.currentValue = digit;
      this.waitingForOperand = false;
    } else {
      this.currentValue = this.currentValue === '0' ? digit : this.currentValue + digit;
    }

    this.updateDisplay();
  }

  performOperation(nextOperation) {
    const inputValue = parseFloat(this.currentValue);

    if (this.previousValue === null) {
      this.previousValue = inputValue;
    } else if (this.operation) {
      const currentValue = this.previousValue || 0;
      const newValue = this.calculate(currentValue, inputValue, this.operation);

      this.currentValue = String(newValue);
      this.previousValue = newValue;
    }

    this.waitingForOperand = true;
    this.operation = nextOperation;

    if (nextOperation === '=') {
      this.operation = null;
      this.waitingForOperand = false;
      this.addToHistory(this.currentValue);
      this.showFerengiAdvice(this.currentValue);
    }

    this.updateDisplay();
  }

  calculate(firstValue, secondValue, operation) {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '*':
        return firstValue * secondValue;
      case '/':
        return firstValue / secondValue;
      default:
        return secondValue;
    }
  }

  updateDisplay() {
    document.getElementById('calc-display').textContent = this.currentValue;
  }

  showFerengiAdvice(result) {
    const resultNum = parseFloat(result);
    let advice = '';

    // Generate Ferengi advice based on the result
    if (resultNum > 1000) {
      advice = "Rule 1: Once you have their money, never give it back. You've calculated a substantial profit!";
    } else if (resultNum > 100) {
      advice = "Rule 9: Instinct plus opportunity equals profit. Your calculation shows promising returns!";
    } else if (resultNum > 0) {
      advice = "Rule 18: A Ferengi without profit is no Ferengi at all. Every latinum counts!";
    } else if (resultNum < 0) {
      advice = "Rule 45: Profit has limits. Loss has none. Time to reassess your business strategy!";
    } else {
      advice = "Rule 283: Rules are always subject to change. Sometimes breaking even is the best deal!";
    }

    document.getElementById('ferengi-advice').textContent = advice;
    document.getElementById('ferengi-advice').style.display = 'block';

    setTimeout(() => {
      document.getElementById('ferengi-advice').style.display = 'none';
    }, 5000);
  }

  analyzeProfit() {
    const result = parseFloat(this.currentValue);
    const insightDiv = document.getElementById('profit-insight');

    let insight = '';

    if (isNaN(result)) {
      insight = "🤔 Enter a calculation first to receive Ferengi wisdom!";
    } else if (result > 10000) {
      insight = "💰 <strong>Magnificent Profit!</strong> This calculation shows true Ferengi genius. Rule 62: The riskier the road, the greater the profit. Your numbers reflect bold entrepreneurship!";
    } else if (result > 1000) {
      insight = "💎 <strong>Substantial Gain!</strong> Rule 3: Never spend more for an acquisition than you have to. Your calculation demonstrates prudent profit-making!";
    } else if (result > 100) {
      insight = "🪙 <strong>Respectable Profit!</strong> Rule 8: Keep count of your change. Every latinum adds up to eventual wealth!";
    } else if (result > 0) {
      insight = "✨ <strong>Modest Gain!</strong> Rule 13: Anything worth doing is worth doing for money. Small profits today, grand Nagus tomorrow!";
    } else if (result === 0) {
      insight = "⚖️ <strong>Break Even!</strong> Rule 57: Good customers are almost as rare as Latinum - treasure them. Sometimes maintaining relationships is profit enough!";
    } else {
      insight = "⚠️ <strong>Loss Detected!</strong> Rule 59: Free advice is never cheap. Consider Rule 62: The riskier the road, the greater the profit - but only when you can afford the risk!";
    }

    insightDiv.innerHTML = insight;
    insightDiv.style.display = 'block';

    // Hide after 8 seconds
    setTimeout(() => {
      insightDiv.style.display = 'none';
    }, 8000);
  }

  addToHistory(result) {
    const historyEntry = {
      calculation: `${this.previousValue || 0} ${this.operation || ''} ${this.currentValue}`,
      result: result,
      timestamp: new Date().toLocaleTimeString()
    };

    this.calculationHistory.unshift(historyEntry);
    if (this.calculationHistory.length > 5) {
      this.calculationHistory.pop();
    }

    this.updateHistoryDisplay();
  }

  updateHistoryDisplay() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = this.calculationHistory.map(entry => `
      <div class="history-item">
        <span class="calculation">${entry.calculation} = ${entry.result}</span>
        <span class="timestamp">${entry.timestamp}</span>
      </div>
    `).join('');
  }
}

// Rule Trivia Game
class RuleTriviaGame {
  constructor(container) {
    this.container = container;
    this.questions = this.generateQuestions();
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.correctAnswers = 0;
    this.timeLeft = 30; // 30 seconds per question
    this.timer = null;
    this.lifelines = { fiftyFifty: true, hint: true };
    this.initializeGame();
  }

  generateQuestions() {
    const questions = [];
    const rulesData = window.rules || window.ferengiRules || [];
    if (rulesData.length === 0) {
      console.error('No rules data found for trivia game');
      // Return fallback questions
      return [{
        type: 'identify',
        question: 'Which rule says: "Once you have their money, never give it back"?',
        options: [1, 3, 7, 15],
        correct: 1,
        rule: { number: 1, text: "Once you have their money, never give it back", category: 'profit' }
      }];
    }

    // Question type 1: Which rule says X?
    rulesData.slice(0, 50).forEach(rule => {
      questions.push({
        type: 'identify',
        question: `Which rule says: "${rule.text}"?`,
        options: this.generateOptions(rule.number),
        correct: rule.number,
        rule: rule
      });
    });

    // Question type 2: Complete the rule
    rulesData.slice(0, 30).forEach(rule => {
      const words = rule.text.split(' ');
      if (words.length > 6) {
        const blankIndex = Math.floor(words.length / 2);
        const blankWord = words[blankIndex];
        words[blankIndex] = '_____';
        const question = `Complete the rule: "${words.join(' ')}"`;
        questions.push({
          type: 'complete',
          question: question,
          options: [blankWord, this.getRandomWord(), this.getRandomWord(), this.getRandomWord()],
          correct: blankWord,
          rule: rule
        });
      }
    });

    // Question type 3: Which category?
    rulesData.slice(0, 40).forEach(rule => {
      questions.push({
        type: 'category',
        question: `Which category does Rule ${rule.number} belong to?`,
        options: ['Profit & Finance', 'Business & Commerce', 'Negotiation & Deals', 'Ethics & Morality', 'Personal Life', 'General Wisdom'],
        correct: categories[rule.category],
        rule: rule
      });
    });

    return (window.shuffleArray ? window.shuffleArray(questions) : questions.sort(() => Math.random() - 0.5)).slice(0, 10);
  }

  generateOptions(correctNumber) {
    const options = [correctNumber];
    while (options.length < 4) {
      const randomNum = Math.floor(Math.random() * 286) + 1;
      if (!options.includes(randomNum)) {
        options.push(randomNum);
      }
    }
    return window.shuffleArray ? window.shuffleArray(options) : options.sort(() => Math.random() - 0.5);
  }

  getRandomWord() {
    const words = ['profit', 'latinum', 'business', 'deal', 'money', 'trade', 'customer', 'negotiation', 'ethics', 'wisdom'];
    return words[Math.floor(Math.random() * words.length)];
  }

  initializeGame() {
    this.container.innerHTML = `
      <div class="game-header">
        <h3>🧠 Rule Trivia Challenge</h3>
        <div class="game-stats">
          <span>Score: <strong id="trivia-score">0</strong></span>
          <span>Question: <strong id="trivia-progress">1/10</strong></span>
          <span>Time: <strong id="trivia-timer">30</strong></span>
        </div>
      </div>

      <div class="trivia-game">
        <div class="question-card">
          <div id="question-text" class="question-text"></div>
          <div id="question-category" class="question-category"></div>
        </div>

        <div class="options-grid">
          <button class="option-btn" data-option="0"></button>
          <button class="option-btn" data-option="1"></button>
          <button class="option-btn" data-option="2"></button>
          <button class="option-btn" data-option="3"></button>
        </div>

        <div class="lifelines">
          <button id="fifty-fifty" class="lifeline-btn ${this.lifelines.fiftyFifty ? '' : 'used'}" ${this.lifelines.fiftyFifty ? '' : 'disabled'}>
            50/50
          </button>
          <button id="hint" class="lifeline-btn ${this.lifelines.hint ? '' : 'used'}" ${this.lifelines.hint ? '' : 'disabled'}>
            💡 Hint
          </button>
        </div>
      </div>

      <div class="game-controls">
        <button onclick="gameManager.endGame()" class="action-btn secondary">🏠 Back to Games</button>
      </div>
    `;

    this.bindEvents();
    this.showQuestion();
    this.startTimer();
  }

  bindEvents() {
    document.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const optionIndex = parseInt(e.target.dataset.option);
        this.selectAnswer(optionIndex);
      });
    });

    document.getElementById('fifty-fifty').addEventListener('click', () => this.useFiftyFifty());
    document.getElementById('hint').addEventListener('click', () => this.showHint());
  }

  showQuestion() {
    const question = this.questions[this.currentQuestionIndex];
    document.getElementById('question-text').textContent = question.question;

    const categoryEl = document.getElementById('question-category');
    categoryEl.textContent = `Category: ${categories[question.rule.category]}`;
    categoryEl.style.display = 'block';

    const optionBtns = document.querySelectorAll('.option-btn');
    question.options.forEach((option, index) => {
      optionBtns[index].textContent = option;
      optionBtns[index].classList.remove('disabled', 'correct', 'incorrect');
      optionBtns[index].disabled = false;
    });

    this.timeLeft = 30;
    this.updateTimer();
  }

  selectAnswer(optionIndex) {
    clearInterval(this.timer);
    const question = this.questions[this.currentQuestionIndex];
    const selectedAnswer = question.options[optionIndex];
    const isCorrect = selectedAnswer === question.correct;

    const optionBtns = document.querySelectorAll('.option-btn');
    optionBtns.forEach(btn => btn.disabled = true);

    if (isCorrect) {
      this.score += Math.max(10, this.timeLeft * 2); // Bonus for speed
      this.correctAnswers++;
      optionBtns[optionIndex].classList.add('correct');

      // Play success sound
      if (window.themeManager && window.themeManager.isSoundEnabled()) {
        window.themeManager.playSound('rule-reveal');
      }
    } else {
      this.score = Math.max(0, this.score - 5);
      optionBtns[optionIndex].classList.add('incorrect');

      // Show correct answer
      question.options.forEach((option, index) => {
        if (option === question.correct) {
          optionBtns[index].classList.add('correct');
        }
      });
    }

    this.updateUI();

    setTimeout(() => {
      this.nextQuestion();
    }, 2000);
  }

  useFiftyFifty() {
    if (!this.lifelines.fiftyFifty) return;

    this.lifelines.fiftyFifty = false;
    document.getElementById('fifty-fifty').classList.add('used');
    document.getElementById('fifty-fifty').disabled = true;

    const question = this.questions[this.currentQuestionIndex];
    const optionBtns = document.querySelectorAll('.option-btn');
    const correctIndex = question.options.findIndex(option =>
      option === question.correct
    );

    // Remove two wrong answers
    const wrongIndices = [];
    optionBtns.forEach((btn, index) => {
      if (index !== correctIndex) {
        wrongIndices.push(index);
      }
    });

    // Randomly remove 2 wrong answers
    const shuffledWrong = window.shuffleArray ? window.shuffleArray(wrongIndices) : wrongIndices.sort(() => Math.random() - 0.5);
    wrongIndices.length = 0;
    wrongIndices.push(...shuffledWrong);
    for (let i = 0; i < 2; i++) {
      optionBtns[wrongIndices[i]].classList.add('disabled');
      optionBtns[wrongIndices[i]].disabled = true;
    }
  }

  showHint() {
    if (!this.lifelines.hint) return;

    this.lifelines.hint = false;
    document.getElementById('hint').classList.add('used');
    document.getElementById('hint').disabled = true;

    const question = this.questions[this.currentQuestionIndex];
    let hint = '';

    switch (question.type) {
      case 'identify':
        hint = `This rule is about ${categories[question.rule.category].toLowerCase()}`;
        break;
      case 'complete':
        hint = `The missing word relates to ${categories[question.rule.category].toLowerCase()}`;
        break;
      case 'category':
        hint = `Look at the rule's focus on ${question.rule.text.substring(0, 30)}...`;
        break;
    }

    if (window.showToast) window.showToast(`Hint: ${hint}`, 4000);
    else alert(`Hint: ${hint}`);
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.timeLeft--;
      this.updateTimer();

      if (this.timeLeft <= 0) {
        this.selectAnswer(-1); // Time out
      }
    }, 1000);
  }

  updateTimer() {
    const timerEl = document.getElementById('trivia-timer');
    if (!timerEl) return;
    timerEl.textContent = this.timeLeft;

    if (this.timeLeft <= 5) {
      timerEl.style.color = '#e74c3c';
      timerEl.style.animation = 'pulse 0.5s infinite';
    } else if (this.timeLeft <= 10) {
      timerEl.style.color = '#f39c12';
    } else {
      timerEl.style.color = '';
      timerEl.style.animation = '';
    }
  }

  updateUI() {
    const scoreEl = document.getElementById('trivia-score');
    const progressEl = document.getElementById('trivia-progress');
    if (scoreEl) scoreEl.textContent = this.score;
    if (progressEl) progressEl.textContent = `${this.currentQuestionIndex + 1}/10`;
  }

  nextQuestion() {
    this.currentQuestionIndex++;

    if (this.currentQuestionIndex >= this.questions.length) {
      this.endGame();
    } else {
      this.showQuestion();
      this.startTimer();
    }
  }

  endGame() {
    clearInterval(this.timer);

    const finalScore = this.score;
    const isHighScore = gameManager.updateHighScore('trivia', finalScore);
    const percentage = Math.round((this.correctAnswers / this.questions.length) * 100);

    this.container.innerHTML = `
      <div class="game-results">
        <h3>🎉 Trivia Complete!</h3>
        <div class="final-score">
          <div class="score-display">Final Score: <strong>${finalScore}</strong></div>
          ${isHighScore ? '<div class="high-score">🏆 New High Score!</div>' : ''}
          <div class="stats-breakdown">
            <p>Correct Answers: ${this.correctAnswers}/10 (${percentage}%)</p>
            <p>Average Time Bonus: ${Math.round(finalScore / Math.max(1, this.correctAnswers))} points per correct answer</p>
          </div>
        </div>

        <div class="trivia-feedback">
          ${percentage >= 80 ? '🧠 Ferengi Scholar! Your knowledge of the Rules is impressive!' :
            percentage >= 60 ? '💰 Profit Seeker! You\'re on your way to mastering the Rules!' :
            '📚 Keep studying! The Rules hold great wisdom for your business endeavors.'}
        </div>

        <div class="game-controls">
          <button onclick="gameManager.startGame('trivia')" class="action-btn">🔄 Play Again</button>
          <button onclick="gameManager.endGame(true)" class="action-btn secondary">🏠 Back to Games</button>
        </div>
      </div>
    `;
  }
}

// Memory Challenge Game
class MemoryChallengeGame {
  constructor(container) {
    this.container = container;
    this.difficulty = 'medium'; // easy: 4x4, medium: 6x6, hard: 8x8
    this.gridSize = 6;
    this.totalCards = this.gridSize * this.gridSize;
    this.cards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.moves = 0;
    this.score = 0;
    this.timeLeft = 180; // 3 minutes
    this.timer = null;
    this.gameStarted = false;
    this.isProcessing = false; // Lock to prevent race conditions
    this.initializeGame();
  }

  initializeGame() {
    this.container.innerHTML = `
      <div class="game-header">
        <h3>🧩 Memory Challenge</h3>
        <div class="game-stats">
          <span>Score: <strong id="memory-score">0</strong></span>
          <span>Moves: <strong id="memory-moves">0</strong></span>
          <span>Time: <strong id="memory-timer">3:00</strong></span>
        </div>
      </div>

      <div class="memory-game">
        <div class="difficulty-selector">
          <label>Difficulty:</label>
          <select id="difficulty-select">
            <option value="easy">Easy (4x4)</option>
            <option value="medium" selected>Medium (6x6)</option>
            <option value="hard">Hard (8x8)</option>
          </select>
          <button id="start-memory-game" class="action-btn">Start Game</button>
        </div>

        <div id="memory-grid" class="memory-grid" style="display: none;"></div>

        <div class="memory-instructions">
          <p>🔍 <strong>How to Play:</strong> Click cards to flip them. Match rule numbers with their corresponding rule texts. Find all pairs to win!</p>
          <p>💡 <strong>Hint:</strong> Use the hint button to peek at a card for 3 seconds (costs 10 points).</p>
        </div>
      </div>

      <div class="game-controls">
        <button id="memory-hint" class="action-btn" style="display: none;">💡 Hint (-10pts)</button>
        <button onclick="gameManager.endGame()" class="action-btn secondary">🏠 Back to Games</button>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    document.getElementById('difficulty-select').addEventListener('change', (e) => {
      this.difficulty = e.target.value;
      this.setGridSize();
    });

    document.getElementById('start-memory-game').addEventListener('click', () => this.startGame());
    document.getElementById('memory-hint').addEventListener('click', () => this.showHint());
  }

  setGridSize() {
    switch (this.difficulty) {
      case 'easy':
        this.gridSize = 4;
        break;
      case 'medium':
        this.gridSize = 6;
        break;
      case 'hard':
        this.gridSize = 8;
        break;
    }
    this.totalCards = this.gridSize * this.gridSize;
  }

  startGame() {
    this.setGridSize();
    this.gameStarted = true;
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.moves = 0;
    this.score = 1000; // Starting score
    this.timeLeft = 300; // 5 minutes

    document.querySelector('.difficulty-selector').style.display = 'none';
    document.getElementById('memory-grid').style.display = 'grid';
    document.getElementById('memory-hint').style.display = 'inline-block';
    document.querySelector('.memory-instructions').style.display = 'none';

    this.createGrid();
    this.startTimer();
    this.updateUI();
  }

  createGrid() {
    const grid = document.getElementById('memory-grid');
    grid.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;
    grid.innerHTML = '';

    // Get random rules for the game
    const rulesData = window.rules || window.ferengiRules || [];
    if (rulesData.length === 0) {
      console.error('No rules data found for memory game');
      return;
    }
    const selectedRules = (window.shuffleArray ? window.shuffleArray(rulesData) : [...rulesData].sort(() => Math.random() - 0.5)).slice(0, this.totalCards / 2);

    // Create card pairs
    const cardData = [];
    selectedRules.forEach(rule => {
      cardData.push({ type: 'number', value: rule.number, rule: rule });
      cardData.push({ type: 'text', value: rule.text, rule: rule });
    });

    // Shuffle cards
    this.cards = window.shuffleArray ? window.shuffleArray(cardData) : cardData.sort(() => Math.random() - 0.5);

    // Create card elements
    this.cards.forEach((cardData, index) => {
      const card = document.createElement('div');
      card.className = 'memory-card';
      card.dataset.index = index;
      card.innerHTML = `
        <div class="card-inner">
          <div class="card-front">?</div>
          <div class="card-back">
            ${cardData.type === 'number' ?
              `<div class="card-number">Rule ${cardData.value}</div>` :
              `<div class="card-text">${cardData.value}</div>`
            }
          </div>
        </div>
      `;
      card.addEventListener('click', () => this.flipCard(index));
      grid.appendChild(card);
    });
  }

  flipCard(index) {
    if (!this.gameStarted || this.flippedCards.length >= 2 || this.isProcessing) return;

    const card = document.querySelector(`[data-index="${index}"]`);
    if (!card || card.classList.contains('flipped') || card.classList.contains('matched')) return;

    card.classList.add('flipped');
    this.flippedCards.push(index);

    // Play flip sound
    if (window.themeManager && window.themeManager.isSoundEnabled()) {
      window.themeManager.playSound('coin-clink');
    }

    if (this.flippedCards.length === 2) {
      this.moves++;
      this.isProcessing = true; // Lock during match check
      this.checkMatch();
    }

    this.updateUI();
  }

  checkMatch() {
    const [index1, index2] = this.flippedCards;
    const card1 = this.cards[index1];
    const card2 = this.cards[index2];

    const isMatch = card1.rule.number === card2.rule.number && card1.type !== card2.type;

    setTimeout(() => {
      if (isMatch) {
        // Match found
        document.querySelector(`[data-index="${index1}"]`).classList.add('matched');
        document.querySelector(`[data-index="${index2}"]`).classList.add('matched');
        this.matchedPairs++;
        this.score += 50; // Bonus for match

        // Play success sound
        if (window.themeManager && window.themeManager.isSoundEnabled()) {
          window.themeManager.playSound('rule-reveal');
        }

        // Check win condition
        if (this.matchedPairs >= this.totalCards / 2) {
          this.endGame(true);
        }
      } else {
        // No match
        document.querySelector(`[data-index="${index1}"]`).classList.remove('flipped');
        document.querySelector(`[data-index="${index2}"]`).classList.remove('flipped');
        this.score = Math.max(0, this.score - 10); // Penalty for wrong match
      }

      this.flippedCards = [];
      this.isProcessing = false; // Unlock after processing
      this.updateUI();
    }, 1000);
  }

  showHint() {
    if (this.score < 10) return;

    this.score -= 10;
    const unflippedCards = Array.from(document.querySelectorAll('.memory-card:not(.flipped):not(.matched)'));

    if (unflippedCards.length > 0) {
      const randomCard = unflippedCards[Math.floor(Math.random() * unflippedCards.length)];
      randomCard.classList.add('hint');

      setTimeout(() => {
        randomCard.classList.remove('hint');
      }, 3000);
    }

    this.updateUI();
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.timeLeft--;
      this.updateTimer();

      if (this.timeLeft <= 0) {
        this.endGame(false);
      }
    }, 1000);
  }

  updateTimer() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    const timerEl = document.getElementById('memory-timer');
    if (timerEl) timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  updateUI() {
    const scoreEl = document.getElementById('memory-score');
    const movesEl = document.getElementById('memory-moves');
    if (scoreEl) scoreEl.textContent = this.score;
    if (movesEl) movesEl.textContent = this.moves;
  }

  endGame(won = false) {
    clearInterval(this.timer);

    if (won) {
      // Time bonus
      const timeBonus = Math.floor(this.timeLeft / 6);
      this.score += timeBonus;

      // Efficiency bonus (fewer moves = higher bonus)
      const perfectMoves = this.totalCards / 2;
      const efficiencyBonus = Math.max(0, (perfectMoves - this.moves) * 20);
      this.score += efficiencyBonus;
    }

    const finalScore = this.score;
    const isHighScore = gameManager.updateHighScore('memory', finalScore);

    this.container.innerHTML = `
      <div class="game-results">
        <h3>${won ? '🎉 Memory Master!' : '⏰ Time\'s Up!'}</h3>
        <div class="final-score">
          <div class="score-display">Final Score: <strong>${finalScore}</strong></div>
          ${isHighScore ? '<div class="high-score">🏆 New High Score!</div>' : ''}
          <div class="stats-breakdown">
            <p>Moves Made: ${this.moves}</p>
            <p>Pairs Matched: ${this.matchedPairs}/${this.totalCards / 2}</p>
            ${won ? `<p>Time Bonus: ${Math.floor(this.timeLeft / 6)} points</p>` : ''}
            ${won ? `<p>Efficiency Bonus: ${Math.max(0, (this.totalCards / 2 - this.moves) * 20)} points</p>` : ''}
          </div>
        </div>

        <div class="memory-feedback">
          ${won ?
            (this.moves <= this.totalCards / 2 + 2 ? '🧠 Perfect Memory! You\'re a Ferengi savant!' :
             this.moves <= this.totalCards / 2 + 5 ? '💎 Excellent Memory! Your lobes are well-developed!' :
             '🤑 Good Job! Keep practicing to improve your memory!') :
            '📚 Keep trying! Memory games help you internalize the Rules of Acquisition.'
          }
        </div>

        <div class="game-controls">
          <button onclick="gameManager.startGame('memory')" class="action-btn">🔄 Play Again</button>
          <button onclick="gameManager.endGame(true)" class="action-btn secondary">🏠 Back to Games</button>
        </div>
      </div>
    `;
  }
}

// Initialize game manager
const gameManager = new GameManager();

// Export for global use
window.gameManager = gameManager;