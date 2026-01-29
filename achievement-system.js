// Enhanced Achievement System with Celebrations
class FerengiAchievementSystem {
  constructor() {
    this.achievements = this.defineAchievements();
    this.userProgress = this.loadProgress();
    this.celebrationQueue = [];
    this.isShowingCelebration = false;
    this.initializeSystem();
  }

  defineAchievements() {
    return {
      // Discovery Achievements
      'first-rule': {
        id: 'first-rule',
        name: 'Ferengi Apprentice',
        description: 'Consult your first Rule of Acquisition',
        icon: '🌟',
        category: 'discovery',
        requirement: 1,
        property: 'rulesViewed',
        rarity: 'common',
        reward: 'profit'
      },
      'rule-explorer': {
        id: 'rule-explorer',
        name: 'Rule Explorer',
        description: 'View 25 different Rules of Acquisition',
        icon: '🧭',
        category: 'discovery',
        requirement: 25,
        property: 'rulesViewed',
        rarity: 'uncommon',
        reward: 'latinum'
      },
      'rule-scholar': {
        id: 'rule-scholar',
        name: 'Rule Scholar',
        description: 'Study 100 Rules of Acquisition',
        icon: '📚',
        category: 'discovery',
        requirement: 100,
        property: 'rulesViewed',
        rarity: 'rare',
        reward: 'wisdom'
      },
      'rule-master': {
        id: 'rule-master',
        name: 'Rule Master',
        description: 'Discover all 286 Rules of Acquisition',
        icon: '👑',
        category: 'discovery',
        requirement: 286,
        property: 'rulesViewed',
        rarity: 'legendary',
        reward: 'grand-nagus'
      },

      // Gaming Achievements
      'game-starter': {
        id: 'game-starter',
        name: 'Profit Trainee',
        description: 'Play your first mini-game',
        icon: '🎮',
        category: 'gaming',
        requirement: 1,
        property: 'gamesPlayed',
        rarity: 'common',
        reward: 'profit'
      },
      'game-enthusiast': {
        id: 'game-enthusiast',
        name: 'Profit Enthusiast',
        description: 'Play 10 mini-games',
        icon: '🎯',
        category: 'gaming',
        requirement: 10,
        property: 'gamesPlayed',
        rarity: 'uncommon',
        reward: 'latinum'
      },
      'high-scorer': {
        id: 'high-scorer',
        name: 'High Profit Scorer',
        description: 'Achieve a high score in any game',
        icon: '🏆',
        category: 'gaming',
        requirement: 1,
        property: 'highScores',
        rarity: 'rare',
        reward: 'celebration'
      },

      // Collection Achievements
      'favorite-collector': {
        id: 'favorite-collector',
        name: 'Rule Collector',
        description: 'Save 10 favorite rules',
        icon: '💖',
        category: 'collection',
        requirement: 10,
        property: 'favorites',
        rarity: 'uncommon',
        reward: 'latinum'
      },
      'sharing-master': {
        id: 'sharing-master',
        name: 'Wisdom Spreader',
        description: 'Share 5 rules with others',
        icon: '🌍',
        category: 'collection',
        requirement: 5,
        property: 'shares',
        rarity: 'rare',
        reward: 'wisdom'
      },

      // Streak Achievements
      'streak-starter': {
        id: 'streak-starter',
        name: 'Daily Devotee',
        description: 'Complete a 3-day challenge streak',
        icon: '🔥',
        category: 'streak',
        requirement: 3,
        property: 'maxStreak',
        rarity: 'common',
        reward: 'profit'
      },
      'streak-champion': {
        id: 'streak-champion',
        name: 'Streak Champion',
        description: 'Achieve a 30-day challenge streak',
        icon: '⚡',
        category: 'streak',
        requirement: 30,
        property: 'maxStreak',
        rarity: 'legendary',
        reward: 'grand-nagus'
      },

      // Special Achievements
      'easter-egg-hunter': {
        id: 'easter-egg-hunter',
        name: 'Secret Seeker',
        description: 'Discover a hidden easter egg',
        icon: '🥚',
        category: 'special',
        requirement: 1,
        property: 'easterEggs',
        rarity: 'rare',
        reward: 'celebration'
      },
      'theme-explorer': {
        id: 'theme-explorer',
        name: 'Style Master',
        description: 'Try all available themes',
        icon: '🎨',
        category: 'special',
        requirement: 4,
        property: 'themesUsed',
        rarity: 'uncommon',
        reward: 'latinum'
      },
      'grand-nagus': {
        id: 'grand-nagus',
        name: 'Grand Nagus',
        description: 'Achieve mastery in all areas of the Oracle',
        icon: '👑✨',
        category: 'ultimate',
        requirement: 1,
        property: 'grandNagusUnlocked',
        rarity: 'mythic',
        reward: 'ultimate'
      }
    };
  }

  loadProgress() {
    return JSON.parse(localStorage.getItem('achievementProgress') || JSON.stringify({
      unlockedAchievements: [],
      notificationShown: [],
      totalScore: 0,
      lastChecked: Date.now()
    }));
  }

  saveProgress() {
    localStorage.setItem('achievementProgress', JSON.stringify(this.userProgress));
  }

  initializeSystem() {
    this.createAchievementUI();
    this.createCelebrationOverlay();
    this.bindEvents();
    this.startProgressWatcher();
  }

  createAchievementUI() {
    // Add achievement button to header
    const headerControls = document.querySelector('.header-controls');
    if (headerControls && !document.getElementById('achievements-toggle')) {
      const achievementBtn = document.createElement('button');
      achievementBtn.id = 'achievements-toggle';
      achievementBtn.className = 'theme-btn';
      achievementBtn.innerHTML = '🏆';
      achievementBtn.title = 'View Achievements';
      achievementBtn.setAttribute('aria-label', 'View Achievements');
      headerControls.appendChild(achievementBtn);
    }

    // Create achievements modal
    if (!document.getElementById('achievements-modal')) {
      const modal = document.createElement('div');
      modal.id = 'achievements-modal';
      modal.className = 'modal achievement-modal';
      modal.innerHTML = `
        <div class="modal-content achievement-content">
          <div class="modal-header">
            <h2>🏆 Ferengi Achievements</h2>
            <button class="close-btn" onclick="this.parentElement.parentElement.parentElement.style.display='none'">&times;</button>
          </div>
          <div class="achievement-stats">
            <div class="stat-item">
              <span class="stat-value" id="total-achievements">0</span>
              <span class="stat-label">Unlocked</span>
            </div>
            <div class="stat-item">
              <span class="stat-value" id="achievement-score">0</span>
              <span class="stat-label">Score</span>
            </div>
            <div class="stat-item">
              <span class="stat-value" id="completion-percentage">0%</span>
              <span class="stat-label">Complete</span>
            </div>
          </div>
          <div class="achievement-categories">
            <button class="category-filter active" data-category="all">All</button>
            <button class="category-filter" data-category="discovery">Discovery</button>
            <button class="category-filter" data-category="gaming">Gaming</button>
            <button class="category-filter" data-category="collection">Collection</button>
            <button class="category-filter" data-category="special">Special</button>
          </div>
          <div id="achievements-grid" class="achievements-grid"></div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    this.updateAchievementDisplay();
  }

  createCelebrationOverlay() {
    if (!document.getElementById('celebration-overlay')) {
      const overlay = document.createElement('div');
      overlay.id = 'celebration-overlay';
      overlay.className = 'celebration-overlay';
      overlay.innerHTML = `
        <div class="celebration-content">
          <button class="celebration-close-btn" onclick="window.achievementSystem.closeCelebration()" title="Close">&times;</button>
          <div class="celebration-icon"></div>
          <div class="celebration-title"></div>
          <div class="celebration-description"></div>
          <div class="celebration-reward"></div>
          <div class="celebration-confetti"></div>
        </div>
      `;

      // Close on overlay click
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          this.closeCelebration();
        }
      });
      document.body.appendChild(overlay);

      // Add celebration styles
      const style = document.createElement('style');
      style.textContent = `
        .celebration-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.8);
          display: none;
          justify-content: center;
          align-items: center;
          z-index: 10000;
          animation: celebrationFadeIn 0.5s ease-out;
        }

        .celebration-content {
          background: linear-gradient(145deg, var(--latinum), var(--ferengi-orange));
          padding: 3rem;
          border-radius: 20px;
          text-align: center;
          max-width: 500px;
          animation: celebrationBounce 0.6s ease-out;
          position: relative;
          overflow: hidden;
        }

        .celebration-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          animation: iconSpin 1s ease-out;
        }

        .celebration-title {
          font-size: 2rem;
          font-weight: bold;
          color: var(--ferengi-ink);
          margin-bottom: 0.5rem;
        }

        .celebration-description {
          font-size: 1.2rem;
          color: var(--ferengi-deep);
          margin-bottom: 1rem;
        }

        .celebration-reward {
          font-size: 1rem;
          color: var(--ferengi-ink);
          font-weight: bold;
        }

        .celebration-confetti {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .celebration-close-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(255, 255, 255, 0.9);
          color: var(--ferengi-ink);
          border: none;
          border-radius: 50%;
          width: 35px;
          height: 35px;
          font-size: 1.8rem;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10001;
          transition: all 0.2s ease;
          line-height: 1;
        }

        .celebration-close-btn:hover {
          background: rgba(255, 255, 255, 1);
          transform: scale(1.1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .celebration-close-btn:active {
          transform: scale(0.95);
        }

        @keyframes celebrationFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes celebrationBounce {
          0% { transform: scale(0.3) rotateY(180deg); }
          50% { transform: scale(1.1) rotateY(0deg); }
          100% { transform: scale(1) rotateY(0deg); }
        }

        @keyframes iconSpin {
          0% { transform: rotateY(0deg) scale(0.5); }
          50% { transform: rotateY(180deg) scale(1.2); }
          100% { transform: rotateY(360deg) scale(1); }
        }

        .achievement-modal .modal-content {
          max-width: 800px;
          max-height: 80vh;
          overflow-y: auto;
        }

        .achievement-stats {
          display: flex;
          justify-content: space-around;
          margin: 1rem 0;
          padding: 1rem;
          background: rgba(249, 217, 108, 0.1);
          border-radius: 10px;
        }

        .stat-item {
          text-align: center;
        }

        .stat-value {
          display: block;
          font-size: 2rem;
          font-weight: bold;
          color: var(--latinum);
        }

        .stat-label {
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .achievement-categories {
          display: flex;
          gap: 0.5rem;
          margin: 1rem 0;
          flex-wrap: wrap;
        }

        .category-filter {
          padding: 0.5rem 1rem;
          border: 2px solid var(--latinum);
          background: transparent;
          color: var(--latinum);
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .category-filter.active,
        .category-filter:hover {
          background: var(--latinum);
          color: var(--ferengi-ink);
        }

        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .achievement-card {
          background: rgba(249, 217, 108, 0.1);
          border: 2px solid transparent;
          border-radius: 10px;
          padding: 1rem;
          text-align: center;
          transition: all 0.3s ease;
          position: relative;
        }

        .achievement-card.unlocked {
          border-color: var(--latinum);
          background: rgba(249, 217, 108, 0.2);
        }

        .achievement-card.locked {
          opacity: 0.6;
          filter: grayscale(50%);
        }

        .achievement-card.new {
          animation: newAchievementGlow 2s ease-out;
        }

        .achievement-icon {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }

        .achievement-name {
          font-weight: bold;
          color: var(--latinum);
          margin-bottom: 0.5rem;
        }

        .achievement-desc {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
        }

        .achievement-progress {
          background: rgba(0, 0, 0, 0.3);
          height: 4px;
          border-radius: 2px;
          overflow: hidden;
          margin-top: 0.5rem;
        }

        .achievement-progress-bar {
          height: 100%;
          background: var(--latinum);
          transition: width 0.3s ease;
        }

        .achievement-rarity {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          padding: 0.2rem 0.5rem;
          border-radius: 10px;
          font-size: 0.8rem;
          font-weight: bold;
        }

        .rarity-common { background: #8B7355; color: white; }
        .rarity-uncommon { background: #56A354; color: white; }
        .rarity-rare { background: #3F7CAC; color: white; }
        .rarity-epic { background: #9B3192; color: white; }
        .rarity-legendary { background: #FF8C00; color: white; }
        .rarity-mythic { background: linear-gradient(45deg, #FFD700, #FF1493); color: white; }

        @keyframes newAchievementGlow {
          0%, 100% { box-shadow: 0 0 5px var(--latinum); }
          50% { box-shadow: 0 0 20px var(--latinum), 0 0 30px var(--latinum); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  bindEvents() {
    // Achievement modal toggle
    document.addEventListener('click', (e) => {
      if (e.target.id === 'achievements-toggle') {
        document.getElementById('achievements-modal').style.display = 'flex';
        this.updateAchievementDisplay();
      }

      // Category filters
      if (e.target.classList.contains('category-filter')) {
        document.querySelectorAll('.category-filter').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        this.filterAchievements(e.target.dataset.category);
      }

      // Close celebration on click
      if (e.target.id === 'celebration-overlay') {
        this.closeCelebration();
      }
    });

    // Close modal on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.getElementById('achievements-modal').style.display = 'none';
        if (this.isShowingCelebration) {
          this.closeCelebration();
        }
      }
    });
  }

  startProgressWatcher() {
    // Check for achievements on user interactions (no polling needed)
    document.addEventListener('click', () => {
      setTimeout(() => this.checkAchievements(), 100);
    });
  }

  checkAchievements() {
    const currentStats = this.getCurrentStats();
    const newAchievements = [];

    Object.values(this.achievements).forEach(achievement => {
      if (!this.userProgress.unlockedAchievements.includes(achievement.id)) {
        if (this.isAchievementUnlocked(achievement, currentStats)) {
          newAchievements.push(achievement);
          this.userProgress.unlockedAchievements.push(achievement.id);
        }
      }
    });

    if (newAchievements.length > 0) {
      this.celebrationQueue.push(...newAchievements);
      this.processNextCelebration();
      this.saveProgress();
    }
  }

  getCurrentStats() {
    const ferengiStats = JSON.parse(localStorage.getItem('ferengiStats') || '{}');
    const streakData = JSON.parse(localStorage.getItem('ferengiStreak') || '{}');
    const gameHighScores = JSON.parse(localStorage.getItem('gameHighScores') || '{}');
    const gamesPlayed = parseInt(localStorage.getItem('gamesPlayed') || '0');

    return {
      rulesViewed: Array.isArray(ferengiStats.rulesViewed) ? ferengiStats.rulesViewed.length : 0,
      gamesPlayed: gamesPlayed,
      favorites: Array.isArray(ferengiStats.favorites) ? ferengiStats.favorites.length : 0,
      shares: ferengiStats.shares || 0,
      maxStreak: streakData.longestStreak || 0,
      highScores: Object.keys(gameHighScores).length,
      easterEggs: ferengiStats.easterEggs || 0,
      themesUsed: ferengiStats.themesUsed || 0
    };
  }

  isAchievementUnlocked(achievement, stats) {
    const value = stats[achievement.property] || 0;
    return value >= achievement.requirement;
  }

  processNextCelebration() {
    if (this.isShowingCelebration || this.celebrationQueue.length === 0) return;

    const achievement = this.celebrationQueue.shift();
    this.showCelebration(achievement);
  }

  showCelebration(achievement) {
    this.isShowingCelebration = true;
    const overlay = document.getElementById('celebration-overlay');
    const content = overlay.querySelector('.celebration-content');

    // Update content
    content.querySelector('.celebration-icon').textContent = achievement.icon;
    content.querySelector('.celebration-title').textContent = achievement.name;
    content.querySelector('.celebration-description').textContent = achievement.description;
    content.querySelector('.celebration-reward').textContent = this.getRewardText(achievement.reward);

    // Add confetti effect
    this.createConfetti(content.querySelector('.celebration-confetti'));

    // Show overlay
    overlay.style.display = 'flex';

    // Play sounds
    if (window.ferengiSounds) {
      ferengiSounds.playSound('achievement');
      ferengiSounds.speakFerengiQuote('achievement');
    }

    // Auto-close after 4 seconds
    setTimeout(() => {
      this.closeCelebration();
    }, 4000);

    // Update score
    this.userProgress.totalScore += this.getAchievementScore(achievement.rarity);
  }

  closeCelebration() {
    document.getElementById('celebration-overlay').style.display = 'none';
    this.isShowingCelebration = false;

    // Process next celebration if any
    setTimeout(() => {
      this.processNextCelebration();
    }, 500);
  }

  createConfetti(container) {
    container.innerHTML = '';
    const colors = ['#f9d96c', '#ff8a3d', '#5a2a2a', '#ffe795'];

    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: absolute;
        width: 10px;
        height: 10px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}%;
        animation: confettiFall ${2 + Math.random() * 3}s linear infinite;
        animation-delay: ${Math.random() * 2}s;
      `;
      container.appendChild(confetti);
    }

    // Add confetti animation if not exists
    if (!document.querySelector('#confetti-style')) {
      const style = document.createElement('style');
      style.id = 'confetti-style';
      style.textContent = `
        @keyframes confettiFall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  getRewardText(rewardType) {
    const rewards = {
      profit: '💰 Profit gained!',
      latinum: '✨ Gold-pressed latinum earned!',
      wisdom: '🧠 Wisdom increases!',
      celebration: '🎉 Special celebration unlocked!',
      'grand-nagus': '👑 Grand Nagus powers activated!',
      ultimate: '🌟 Ultimate mastery achieved!'
    };
    return rewards[rewardType] || '🎁 Reward unlocked!';
  }

  getAchievementScore(rarity) {
    const scores = {
      common: 10,
      uncommon: 25,
      rare: 50,
      epic: 100,
      legendary: 250,
      mythic: 500
    };
    return scores[rarity] || 10;
  }

  updateAchievementDisplay() {
    const grid = document.getElementById('achievements-grid');
    const totalAchievements = document.getElementById('total-achievements');
    const achievementScore = document.getElementById('achievement-score');
    const completionPercentage = document.getElementById('completion-percentage');

    if (!grid) return;

    const stats = this.getCurrentStats();
    const totalCount = Object.keys(this.achievements).length;
    const unlockedCount = this.userProgress.unlockedAchievements.length;

    // Update stats
    if (totalAchievements) totalAchievements.textContent = unlockedCount;
    if (achievementScore) achievementScore.textContent = this.userProgress.totalScore;
    if (completionPercentage) {
      completionPercentage.textContent = Math.round((unlockedCount / totalCount) * 100) + '%';
    }

    // Clear and rebuild grid
    grid.innerHTML = '';

    Object.values(this.achievements).forEach(achievement => {
      const isUnlocked = this.userProgress.unlockedAchievements.includes(achievement.id);
      const progress = this.getAchievementProgress(achievement, stats);

      const card = document.createElement('div');
      card.className = `achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`;
      card.innerHTML = `
        <div class="achievement-rarity rarity-${achievement.rarity}">${achievement.rarity}</div>
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-name">${achievement.name}</div>
        <div class="achievement-desc">${achievement.description}</div>
        <div class="achievement-progress">
          <div class="achievement-progress-bar" style="width: ${progress}%"></div>
        </div>
        <div class="achievement-progress-text">${Math.floor(progress)}%</div>
      `;

      grid.appendChild(card);
    });
  }

  getAchievementProgress(achievement, stats) {
    const currentValue = stats[achievement.property] || 0;
    return Math.min(100, (currentValue / achievement.requirement) * 100);
  }

  filterAchievements(category) {
    const cards = document.querySelectorAll('.achievement-card');
    const achievements = Object.values(this.achievements);

    cards.forEach((card, index) => {
      const achievement = achievements[index];
      if (category === 'all' || achievement.category === category) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // Public methods for manual achievement triggers
  triggerEasterEgg() {
    const stats = this.getCurrentStats();
    stats.easterEggs = (stats.easterEggs || 0) + 1;

    // Save to ferengiStats
    const ferengiStats = JSON.parse(localStorage.getItem('ferengiStats') || '{}');
    ferengiStats.easterEggs = stats.easterEggs;
    localStorage.setItem('ferengiStats', JSON.stringify(ferengiStats));

    this.checkAchievements();
  }

  triggerThemeUsed() {
    const stats = this.getCurrentStats();
    stats.themesUsed = (stats.themesUsed || 0) + 1;

    // Save to ferengiStats
    const ferengiStats = JSON.parse(localStorage.getItem('ferengiStats') || '{}');
    ferengiStats.themesUsed = Math.min(4, stats.themesUsed); // Max 4 themes
    localStorage.setItem('ferengiStats', JSON.stringify(ferengiStats));

    this.checkAchievements();
  }
}

// Initialize achievement system
const achievementSystem = new FerengiAchievementSystem();

// Make it globally accessible for other scripts
window.achievementSystem = achievementSystem;