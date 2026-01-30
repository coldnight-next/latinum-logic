// Daily Challenges System for Ferengi Rule Oracle

const categoryKeys = ['profit', 'business', 'negotiation', 'ethics', 'personal', 'wisdom'];

class DailyChallengeManager {
  constructor() {
    this.challenges = [];
    this.currentChallenge = null;
    this.streakData = this.loadStreakData();
    this.challengeHistory = this.loadChallengeHistory();
    this.initializeChallenges();
  }

  loadStreakData() {
    try {
      return JSON.parse(localStorage.getItem('ferengiStreak') || JSON.stringify({
        currentStreak: 0,
        longestStreak: 0,
        lastCompletedDate: null,
        gracePeriodUsed: false,
        totalCompletions: 0,
        rewards: []
      }));
    } catch (e) {
      console.warn('Failed to load streak data from localStorage:', e);
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastCompletedDate: null,
        gracePeriodUsed: false,
        totalCompletions: 0,
        rewards: []
      };
    }
  }

  saveStreakData() {
    try {
      localStorage.setItem('ferengiStreak', JSON.stringify(this.streakData));
    } catch (e) {
      console.warn('Failed to save streak data to localStorage:', e);
    }
  }

  loadChallengeHistory() {
    try {
      return JSON.parse(localStorage.getItem('challengeHistory') || '[]');
    } catch (e) {
      console.warn('Failed to load challenge history from localStorage:', e);
      return [];
    }
  }

  saveChallengeHistory() {
    try {
      localStorage.setItem('challengeHistory', JSON.stringify(this.challengeHistory));
    } catch (e) {
      console.warn('Failed to save challenge history to localStorage:', e);
    }
  }

  initializeChallenges() {
    this.createChallengeUI();
    this.checkDailyChallenge();
    this.updateStreakDisplay();
  }

  createChallengeUI() {
    const challengeCard = document.createElement('section');
    challengeCard.className = 'panel daily-challenge-card';
    challengeCard.innerHTML = `
      <h2>📅 Daily Challenge</h2>
      <div class="streak-display">
        <div class="streak-flame" id="streak-flame">🔥</div>
        <div class="streak-info">
          <div class="streak-count" id="streak-count">0</div>
          <div class="streak-label">Day Streak</div>
        </div>
      </div>
      <div id="challenge-content">
        <div class="challenge-loading">
          <p>Loading today's challenge...</p>
        </div>
      </div>
    `;

    // Insert after the rule-of-day section
    const ruleOfDay = document.getElementById('rule-of-day');
    if (ruleOfDay && ruleOfDay.parentNode) {
      ruleOfDay.parentNode.insertBefore(challengeCard, ruleOfDay.nextSibling);
    } else {
      const masthead = document.querySelector('.masthead') || document.querySelector('header');
      if (masthead) {
        masthead.appendChild(challengeCard);
      }
    }
  }

  checkDailyChallenge() {
    const today = this.getTodayString();
    const lastCompleted = this.streakData.lastCompletedDate;

    // Check if challenge was already completed today
    if (lastCompleted === today) {
      this.showCompletedChallenge();
      return;
    }

    // Check if we need to reset streak
    this.updateStreakStatus();

    // Generate or load today's challenge
    this.generateDailyChallenge(today);
  }

  getTodayString() {
    return new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  }

  updateStreakStatus() {
    const today = this.getTodayString();
    const lastCompleted = this.streakData.lastCompletedDate;

    if (!lastCompleted) return; // First time user

    const lastDate = new Date(lastCompleted);
    const todayDate = new Date(today);
    const daysDiff = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

    if (daysDiff === 1) {
      // Consecutive day - streak continues
      return;
    } else if (daysDiff === 2 && !this.streakData.gracePeriodUsed) {
      // Missed one day - use grace period
      this.streakData.gracePeriodUsed = true;
      this.saveStreakData();
      return;
    } else {
      // Streak broken
      this.streakData.longestStreak = Math.max(this.streakData.longestStreak, this.streakData.currentStreak);
      this.streakData.currentStreak = 0;
      this.streakData.gracePeriodUsed = false;
      this.saveStreakData();
    }
  }

  generateDailyChallenge(dateString) {
    // Use date as seed for consistent daily challenges
    const seed = this.simpleHash(dateString);
    const seededRandom = this.seededRandom(seed);

    const challengeTypes = ['rule-quiz', 'category-match', 'speed-round', 'rule-of-day'];
    const challengeType = challengeTypes[Math.floor(seededRandom() * challengeTypes.length)];

    let challenge;
    switch (challengeType) {
      case 'rule-quiz':
        challenge = this.generateRuleQuizChallenge(seededRandom);
        break;
      case 'category-match':
        challenge = this.generateCategoryMatchChallenge(seededRandom);
        break;
      case 'speed-round':
        challenge = this.generateSpeedRoundChallenge(seededRandom);
        break;
      case 'rule-of-day':
        challenge = this.generateRuleOfDayChallenge(seededRandom);
        break;
    }

    challenge.date = dateString;
    challenge.type = challengeType;
    this.currentChallenge = challenge;
    this.displayChallenge(challenge);
  }

  generateRuleQuizChallenge(randomFn = Math.random) {
    const rulesData = window.rules || window.ferengiRules || [];
    const shuffledRules = window.shuffleArray ? window.shuffleArray(rulesData, randomFn) : [...rulesData].sort(() => 0.5 - randomFn());
    const selectedRules = shuffledRules.slice(0, 5);
    const questions = selectedRules.map(rule => ({
      question: `Which rule says: "${rule.text}"?`,
      options: this.generateRuleOptions(rule.number, randomFn),
      correct: rule.number,
      rule: rule
    }));

    return {
      title: 'Rule Identification Quiz',
      description: 'Identify the correct rule numbers for these famous Ferengi sayings.',
      questions: questions,
      timeLimit: 60,
      pointsPerQuestion: 20
    };
  }

  generateCategoryMatchChallenge(randomFn = Math.random) {
    const selectedCategory = categoryKeys[Math.floor(randomFn() * categoryKeys.length)];
    const rulesData = window.rules || window.ferengiRules || [];
    const categoryRules = rulesData.filter(rule => rule.category === selectedCategory).slice(0, 5);

    const questions = categoryRules.map(rule => ({
      question: `Which category does Rule ${rule.number} belong to?`,
      options: ['Profit & Finance', 'Business & Commerce', 'Negotiation & Deals', 'Ethics & Morality', 'Personal Life', 'General Wisdom'],
      correct: categories[selectedCategory],
      rule: rule
    }));

    return {
      title: `${categories[selectedCategory]} Category Challenge`,
      description: `Test your knowledge of ${categories[selectedCategory].toLowerCase()} rules!`,
      questions: questions,
      timeLimit: 45,
      pointsPerQuestion: 25
    };
  }

  generateSpeedRoundChallenge(randomFn = Math.random) {
    const rulesData = window.rules || window.ferengiRules || [];
    const shuffledRules = window.shuffleArray ? window.shuffleArray(rulesData, randomFn) : [...rulesData].sort(() => 0.5 - randomFn());
    const selectedRules = shuffledRules.slice(0, 8);
    const questions = selectedRules.map(rule => ({
      question: `Rule ${rule.number}: True or False?`,
      options: ['True', 'False'],
      correct: 'True', // All presented rules are real
      rule: rule
    }));

    return {
      title: 'Speed Round: True or False',
      description: 'Quick-fire questions! All rules shown are real Ferengi rules.',
      questions: questions,
      timeLimit: 40,
      pointsPerQuestion: 15
    };
  }

  generateRuleOfDayChallenge(randomFn = Math.random) {
    const rulesData = window.rules || window.ferengiRules || [];
    const ruleOfDay = rulesData[Math.floor(randomFn() * rulesData.length)];
    const questions = [
      {
        question: `What is the number of the Rule of the Day: "${ruleOfDay.text}"?`,
        options: this.generateRuleOptions(ruleOfDay.number, randomFn),
        correct: ruleOfDay.number,
        rule: ruleOfDay
      },
      {
        question: `Which category does the Rule of the Day belong to?`,
        options: ['Profit & Finance', 'Business & Commerce', 'Negotiation & Deals', 'Ethics & Morality', 'Personal Life', 'General Wisdom'],
        correct: categories[ruleOfDay.category],
        rule: ruleOfDay
      }
    ];

    return {
      title: 'Rule of the Day Challenge',
      description: 'Special focus on today\'s featured Ferengi rule!',
      questions: questions,
      timeLimit: 50,
      pointsPerQuestion: 30,
      featuredRule: ruleOfDay
    };
  }

  generateRuleOptions(correctNumber, randomFn = Math.random) {
    const options = [correctNumber];
    while (options.length < 4) {
      const randomNum = Math.floor(randomFn() * 286) + 1;
      if (!options.includes(randomNum)) {
        options.push(randomNum);
      }
    }
    return window.shuffleArray ? window.shuffleArray(options, randomFn) : options.sort(() => 0.5 - randomFn());
  }

  seededRandom(seed) {
    let currentSeed = seed;
    return function() {
      const x = Math.sin(currentSeed++) * 10000;
      return x - Math.floor(x);
    };
  }

  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  getChallengeContent() {
    const challengeCard = document.querySelector('.daily-challenge-card');
    return challengeCard ? challengeCard.querySelector('#challenge-content') : document.getElementById('challenge-content');
  }

  displayChallenge(challenge) {
    const content = this.getChallengeContent();
    if (!content) return;
    content.innerHTML = `
      <div class="challenge-info">
        <h3>${challenge.title}</h3>
        <p>${challenge.description}</p>
        <div class="challenge-meta">
          <span>${challenge.questions.length} questions</span>
          <span>${challenge.timeLimit}s time limit</span>
          <span>${challenge.pointsPerQuestion * challenge.questions.length} max points</span>
        </div>
      </div>
      <button id="start-challenge-btn" class="action-btn">🚀 Start Challenge</button>
    `;

    const startBtn = content.querySelector('#start-challenge-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        this.startChallenge(challenge);
      });
    }
  }

  startChallenge(challenge) {
    const content = this.getChallengeContent();
    content.innerHTML = `
      <div class="challenge-quiz">
        <div class="quiz-header">
          <div class="question-counter">Question <span id="current-q">1</span>/<span id="total-q">${challenge.questions.length}</span></div>
          <div class="quiz-timer" id="quiz-timer">${challenge.timeLimit}</div>
        </div>
        <div class="question-display" id="question-display"></div>
        <div class="options-display" id="options-display"></div>
      </div>
    `;

    this.currentQuestionIndex = 0;
    this.quizScore = 0;
    this.timeLeft = challenge.timeLimit;
    this.timer = setInterval(() => this.updateTimer(), 1000);

    this.showQuestion(challenge.questions[0]);
  }

  showQuestion(question) {
    const challengeCard = document.querySelector('.daily-challenge-card');
    const questionEl = challengeCard ? challengeCard.querySelector('#question-display') : document.getElementById('question-display');
    const optionsEl = challengeCard ? challengeCard.querySelector('#options-display') : document.getElementById('options-display');

    if (questionEl) questionEl.textContent = question.question;

    const optionsHtml = question.options.map((option, index) =>
      `<button class="quiz-option" data-option="${index}">${option}</button>`
    ).join('');

    if (optionsEl) {
      optionsEl.innerHTML = optionsHtml;
      optionsEl.querySelectorAll('.quiz-option').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const selectedIndex = parseInt(e.target.dataset.option);
          this.answerQuestion(question, selectedIndex, e.target);
        });
      });
    }
  }

  answerQuestion(question, selectedIndex, clickedBtn) {
    const selectedAnswer = question.options[selectedIndex];
    const correctValue = String(question.correct);
    const isCorrect = String(selectedAnswer) === correctValue;

    if (isCorrect) {
      this.quizScore += this.currentChallenge.pointsPerQuestion;
      clickedBtn.classList.add('correct');
      if (window.themeManager && window.themeManager.isSoundEnabled()) {
        window.themeManager.playSound('rule-reveal');
      }
    } else {
      clickedBtn.classList.add('incorrect');
    }

    // Disable all options and highlight the correct answer
    const challengeCard = document.querySelector('.daily-challenge-card');
    const optionsContainer = challengeCard ? challengeCard.querySelector('#options-display') : document.getElementById('options-display');
    const allOptions = optionsContainer ? optionsContainer.querySelectorAll('.quiz-option') : document.querySelectorAll('.quiz-option');
    allOptions.forEach(btn => {
      btn.disabled = true;
      if (String(btn.textContent).trim() === correctValue) {
        btn.classList.add('correct');
      }
    });

    setTimeout(() => {
      this.nextQuestion();
    }, 1500);
  }

  nextQuestion() {
    this.currentQuestionIndex++;

    if (this.currentQuestionIndex >= this.currentChallenge.questions.length) {
      this.completeChallenge();
    } else {
      const challengeCard = document.querySelector('.daily-challenge-card');
      const counterEl = challengeCard ? challengeCard.querySelector('#current-q') : document.getElementById('current-q');
      if (counterEl) counterEl.textContent = this.currentQuestionIndex + 1;
      this.showQuestion(this.currentChallenge.questions[this.currentQuestionIndex]);
    }
  }

  updateTimer() {
    this.timeLeft--;
    const challengeCard = document.querySelector('.daily-challenge-card');
    const timerEl = challengeCard ? challengeCard.querySelector('#quiz-timer') : document.getElementById('quiz-timer');
    if (timerEl) {
      timerEl.textContent = this.timeLeft;
      if (this.timeLeft <= 10) timerEl.classList.add('low-time');
    }

    if (this.timeLeft <= 0) {
      this.completeChallenge();
    }
  }

  completeChallenge() {
    clearInterval(this.timer);

    // Calculate final score with time bonus
    const timeBonus = Math.floor(this.timeLeft / 6);
    const finalScore = this.quizScore + timeBonus;

    // Update streak
    this.streakData.currentStreak++;
    this.streakData.lastCompletedDate = this.getTodayString();
    this.streakData.totalCompletions++;
    this.streakData.longestStreak = Math.max(this.streakData.longestStreak, this.streakData.currentStreak);

    // Check for rewards
    this.checkStreakRewards();

    this.saveStreakData();

    // Save challenge result
    const result = {
      date: this.currentChallenge.date,
      type: this.currentChallenge.type,
      score: finalScore,
      questions: this.currentChallenge.questions.length,
      timeLeft: this.timeLeft,
      completed: true
    };
    this.challengeHistory.push(result);
    this.saveChallengeHistory();

    // Update dashboard
    if (window.dashboardManager) {
      window.dashboardManager.updateDashboard();
    }

    this.showCompletionScreen(finalScore, timeBonus);
  }

  checkStreakRewards() {
    const streak = this.streakData.currentStreak;
    const rewards = [7, 14, 30, 50, 100];

    if (rewards.includes(streak) && !this.streakData.rewards.includes(streak)) {
      this.streakData.rewards.push(streak);
      this.showStreakReward(streak);
    }
  }

  showStreakReward(streak) {
    const rewardNames = {
      7: 'Dedicated Trader',
      14: 'Profit Seeker',
      30: 'Ferengi Apprentice',
      50: 'Commerce Master',
      100: 'Grand Nagus'
    };

    setTimeout(() => {
      const notification = document.createElement('div');
      notification.className = 'streak-reward-notification';
      notification.innerHTML = `
        <div class="reward-content">
          <h3>🏆 Streak Milestone!</h3>
          <p>You've reached a ${streak}-day streak!</p>
          <p><strong>${rewardNames[streak]}</strong> achievement unlocked!</p>
        </div>
      `;

      document.body.appendChild(notification);

      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 5000);
    }, 1000);
  }

  showCompletionScreen(score, timeBonus) {
    const content = this.getChallengeContent();
    if (!content) return;
    content.innerHTML = `
      <div class="challenge-complete">
        <h3>🎉 Challenge Complete!</h3>
        <div class="completion-stats">
          <div class="stat-item">
            <span class="stat-value">${score - timeBonus}</span>
            <span class="stat-label">Base Points</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">+${timeBonus}</span>
            <span class="stat-label">Time Bonus</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">${score}</span>
            <span class="stat-label">Total Score</span>
          </div>
        </div>
        <div class="streak-update">
          <p>🔥 Streak: <strong>${this.streakData.currentStreak} days</strong></p>
          <p>📊 Total Challenges: <strong>${this.streakData.totalCompletions}</strong></p>
        </div>
        <button id="challenge-continue-btn" class="action-btn">Continue Your Journey</button>
      </div>
    `;

    const continueBtn = content.querySelector('#challenge-continue-btn');
    if (continueBtn) {
      continueBtn.addEventListener('click', () => {
        location.reload();
      });
    }
  }

  showCompletedChallenge() {
    const content = this.getChallengeContent();
    if (!content) return;
    content.innerHTML = `
      <div class="challenge-completed-today">
        <h3>✅ Challenge Completed!</h3>
        <p>You've already completed today's daily challenge.</p>
        <p>Come back tomorrow for a new challenge!</p>
        <div class="next-challenge">
          <p>Next challenge available in: <span id="countdown">calculating...</span></p>
        </div>
      </div>
    `;

    this.startCountdown();
  }

  startCountdown() {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const diff = tomorrow - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const challengeCard = document.querySelector('.daily-challenge-card');
      const countdownEl = challengeCard ? challengeCard.querySelector('#countdown') : document.getElementById('countdown');
      if (countdownEl) {
        countdownEl.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }

      if (diff > 0) {
        setTimeout(updateCountdown, 1000);
      } else {
        location.reload(); // Refresh for new challenge
      }
    };

    updateCountdown();
  }

  updateStreakDisplay() {
    const streakCount = document.getElementById('streak-count');
    const streakFlame = document.getElementById('streak-flame');

    if (streakCount) {
      streakCount.textContent = this.streakData.currentStreak;
    }

    if (streakFlame) {
      if (this.streakData.currentStreak >= 7) {
        streakFlame.textContent = '🔥';
        streakFlame.classList.add('big-flame');
      } else if (this.streakData.currentStreak >= 3) {
        streakFlame.textContent = '🔥';
      } else {
        streakFlame.textContent = '✨';
      }
    }
  }
}

// Initialize daily challenge manager
const dailyChallengeManager = new DailyChallengeManager();

// Export for global use
window.dailyChallengeManager = dailyChallengeManager;