// Dashboard and Progress Tracking for Ferengi Rule Oracle

class DashboardManager {
  constructor() {
    this.stats = this.loadStats();
    this.achievements = this.loadAchievements();
    this.initializeDashboard();
  }

  loadStats() {
    const defaultStats = {
      totalViews: 0,
      rulesViewed: new Set(),
      favorites: [],
      shares: 0,
      lastVisit: new Date().toISOString(),
      gamesPlayed: 0,
      gameHighScores: {}
    };

    try {
      const saved = JSON.parse(localStorage.getItem('ferengiStats') || JSON.stringify(defaultStats));

      // Ensure all required properties exist with proper defaults
      const result = { ...defaultStats, ...saved };

      // Convert rulesViewed back to Set (handles array, plain object from JSON.stringify(Set), or missing)
      if (result.rulesViewed instanceof Set) {
        // Already a Set, no conversion needed
      } else if (Array.isArray(result.rulesViewed)) {
        result.rulesViewed = new Set(result.rulesViewed);
      } else {
        result.rulesViewed = new Set();
      }

      // Ensure favorites is always an array
      if (!Array.isArray(result.favorites)) {
        result.favorites = [];
      }

      // Ensure other properties have safe defaults
      result.totalViews = result.totalViews || 0;
      result.shares = result.shares || 0;
      result.gamesPlayed = result.gamesPlayed || 0;
      result.gameHighScores = result.gameHighScores || {};

      return result;
    } catch (e) {
      console.warn('Error loading stats, using defaults:', e);
      return defaultStats;
    }
  }

  saveStats() {
    // Convert Set to Array for JSON storage
    const statsToSave = { ...this.stats };
    statsToSave.rulesViewed = Array.from(this.stats.rulesViewed);
    localStorage.setItem('ferengiStats', JSON.stringify(statsToSave));
  }

  loadAchievements() {
    return JSON.parse(localStorage.getItem('ferengiAchievements') || JSON.stringify({
      profitMaster: false, // 100 rules viewed
      ruleScholar: false,  // All categories explored
      socialSharer: false, // 10 shares
      wisdomSeeker: false, // 50 unique rules
      latinumCollector: false // 25 favorites
    }));
  }

  saveAchievements() {
    localStorage.setItem('ferengiAchievements', JSON.stringify(this.achievements));
  }

  // Track rule view
  trackRuleView(ruleNumber) {
    this.stats.totalViews++;
    this.stats.rulesViewed.add(ruleNumber);
    this.checkAchievements();
    this.saveStats();
    this.updateWisdomMeter();
  }

  // Track favorite
  trackFavorite(ruleNumber) {
    if (!this.stats.favorites.includes(ruleNumber)) {
      this.stats.favorites.push(ruleNumber);
      this.checkAchievements();
      this.saveStats();
    }
  }

  // Track share
  trackShare() {
    this.stats.shares++;
    this.checkAchievements();
    this.saveStats();
  }

  // Check and unlock achievements
  checkAchievements() {
    const rulesViewed = this.stats.rulesViewed.size;
    const categoriesExplored = this.getCategoriesExplored();

    // Profit Master: 100 rules viewed
    if (rulesViewed >= 100 && !this.achievements.profitMaster) {
      this.unlockAchievement('profitMaster');
    }

    // Rule Scholar: All categories explored
    if (categoriesExplored >= 6 && !this.achievements.ruleScholar) {
      this.unlockAchievement('ruleScholar');
    }

    // Social Sharer: 10 shares
    if (this.stats.shares >= 10 && !this.achievements.socialSharer) {
      this.unlockAchievement('socialSharer');
    }

    // Wisdom Seeker: 50 unique rules
    if (rulesViewed >= 50 && !this.achievements.wisdomSeeker) {
      this.unlockAchievement('wisdomSeeker');
    }

    // Latinum Collector: 25 favorites
    if (this.stats.favorites && this.stats.favorites.length >= 25 && !this.achievements.latinumCollector) {
      this.unlockAchievement('latinumCollector');
    }
  }

  unlockAchievement(achievement) {
    this.achievements[achievement] = true;
    this.saveAchievements();
    this.showAchievementNotification(achievement);
  }

  showAchievementNotification(achievement) {
    const names = {
      profitMaster: 'Profit Master',
      ruleScholar: 'Rule Scholar',
      socialSharer: 'Social Sharer',
      wisdomSeeker: 'Wisdom Seeker',
      latinumCollector: 'Latinum Collector'
    };

    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #ffe795, #ff8a3d);
      color: #0b090e;
      padding: 1rem 1.5rem;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(255, 138, 61, 0.4);
      z-index: 1000;
      font-weight: bold;
      animation: slideIn 0.5s ease;
    `;
    notification.innerHTML = `🏆 Achievement Unlocked: ${names[achievement]}!`;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.5s ease';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 500);
    }, 3000);
  }

  getCategoriesExplored() {
    // This would need to be implemented based on viewed rules
    // For now, return a mock value
    return Math.min(6, Math.floor(this.stats.rulesViewed.size / 10));
  }

  // Update wisdom meter
  updateWisdomMeter() {
    const meter = document.querySelector('.wisdom-progress');
    if (meter) {
      const progress = Math.min(100, (this.stats.rulesViewed.size / 286) * 100);
      meter.style.width = progress + '%';
    }
  }

  // Initialize dashboard
  initializeDashboard() {
    this.createDashboardHTML();
    this.updateDashboard();
    this.updateWisdomMeter();
    this.updateAchievementBadges();
  }

  createDashboardHTML() {
    const dashboard = document.createElement('section');
    dashboard.className = 'dashboard panel';
    dashboard.innerHTML = `
      <h3>Personal Dashboard</h3>

      <div class="wisdom-meter">
        <div class="wisdom-progress" style="width: 0%"></div>
      </div>
      <p style="text-align: center; font-size: 0.9rem; color: var(--latinum);">
        Wisdom Progress: <span id="wisdom-count">0</span>/286 Rules Explored
      </p>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value" id="total-views">0</div>
          <div class="stat-label">Total Views</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" id="unique-rules">0</div>
          <div class="stat-label">Unique Rules</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" id="favorites-count">0</div>
          <div class="stat-label">Favorites</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" id="shares-count">0</div>
          <div class="stat-label">Shares</div>
        </div>
      </div>

      <h4>🎮 Gaming Stats</h4>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value" id="games-played">0</div>
          <div class="stat-label">Games Played</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" id="matching-high">0</div>
          <div class="stat-label">Matching High</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" id="trivia-high">0</div>
          <div class="stat-label">Trivia High</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" id="memory-high">0</div>
          <div class="stat-label">Memory High</div>
        </div>
      </div>

      <h4>Achievement Badges</h4>
      <div class="achievement-badges">
        <div class="badge" data-achievement="profitMaster">
          <span>💰</span> Profit Master
        </div>
        <div class="badge" data-achievement="ruleScholar">
          <span>📚</span> Rule Scholar
        </div>
        <div class="badge" data-achievement="socialSharer">
          <span>📢</span> Social Sharer
        </div>
        <div class="badge" data-achievement="wisdomSeeker">
          <span>🧠</span> Wisdom Seeker
        </div>
        <div class="badge" data-achievement="latinumCollector">
          <span>💎</span> Latinum Collector
        </div>
      </div>

      <div style="margin-top: 1.5rem; text-align: center;">
        <button id="toggle-dashboard" class="action-btn">Hide Dashboard</button>
      </div>
    `;

    // Insert after the result panel
    const resultPanel = document.getElementById('result-panel');
    if (resultPanel && resultPanel.parentNode) {
      resultPanel.parentNode.insertBefore(dashboard, resultPanel.nextSibling);
    } else {
      const main = document.querySelector('main') || document.querySelector('.council');
      if (main) {
        main.appendChild(dashboard);
      } else {
        document.body.appendChild(dashboard);
      }
    }

    // Add toggle functionality
    document.getElementById('toggle-dashboard').addEventListener('click', () => {
      dashboard.classList.toggle('show');
      const btn = document.getElementById('toggle-dashboard');
      btn.textContent = dashboard.classList.contains('show') ? 'Hide Dashboard' : 'Show Dashboard';
    });
  }

  updateDashboard() {
    // Safely update dashboard with error checking
    const safeUpdate = (id, value) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value;
      }
    };

    safeUpdate('total-views', this.stats.totalViews || 0);
    safeUpdate('unique-rules', this.stats.rulesViewed ? this.stats.rulesViewed.size : 0);
    safeUpdate('favorites-count', this.stats.favorites ? this.stats.favorites.length : 0);
    safeUpdate('shares-count', this.stats.shares || 0);
    safeUpdate('wisdom-count', this.stats.rulesViewed ? this.stats.rulesViewed.size : 0);

    // Update games stats
    const gamesPlayed = parseInt(localStorage.getItem('gamesPlayed') || '0', 10);
    let gameHighScores = {};
    try {
      gameHighScores = JSON.parse(localStorage.getItem('gameHighScores') || '{}');
    } catch (e) {
      gameHighScores = {};
    }

    safeUpdate('games-played', gamesPlayed);
    safeUpdate('matching-high', gameHighScores.matching || '0');
    safeUpdate('trivia-high', gameHighScores.trivia || '0');
    safeUpdate('memory-high', gameHighScores.memory || '0');
  }

  updateAchievementBadges() {
    Object.keys(this.achievements).forEach(achievement => {
      const badge = document.querySelector(`[data-achievement="${achievement}"]`);
      if (badge) {
        badge.classList.toggle('unlocked', this.achievements[achievement]);
      }
    });
  }

  // Show dashboard
  showDashboard() {
    const dashboard = document.querySelector('.dashboard');
    if (dashboard) {
      dashboard.classList.add('show');
      document.getElementById('toggle-dashboard').textContent = 'Hide Dashboard';
    }
  }
}

// Initialize dashboard manager
const dashboardManager = new DashboardManager();

// Export for global use
window.dashboardManager = dashboardManager;