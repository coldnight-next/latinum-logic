// Easter Eggs and Hidden Features for Ferengi Rule Oracle
class FerengiEasterEggs {
  constructor() {
    this.konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    this.konamiInput = [];
    this.earsClickCount = 0;
    this.secretSequenceActive = false;
    this.hiddenFeatures = {
      grandNagusMode: false,
      quarkMode: false,
      rule287: false,
      debugMode: false
    };
    this.initializeEasterEggs();
  }

  initializeEasterEggs() {
    this.setupKonamiCode();
    this.setupEarClicking();
    this.setupSecretMenus();
    this.setupHiddenRules();
    this.setupCheatCodes();
    this.setupRandomQuotes();
    this.addSecretStyles();
  }

  setupKonamiCode() {
    document.addEventListener('keydown', (e) => {
      this.konamiInput.push(e.code);

      // Keep only the last 10 keypresses
      if (this.konamiInput.length > 10) {
        this.konamiInput.shift();
      }

      // Check if konami code is entered
      if (this.konamiInput.length === 10 &&
          this.konamiInput.every((key, index) => key === this.konamiCode[index])) {
        this.activateGrandNagusMode();
        this.konamiInput = [];
      }
    });
  }

  setupEarClicking() {
    // Add invisible Ferengi ears to the header
    const header = document.querySelector('header') || document.body;

    // Left ear - positioned lower to avoid floating controls
    const leftEar = document.createElement('div');
    leftEar.className = 'ferengi-ear left-ear';
    leftEar.innerHTML = '👂';
    leftEar.style.cssText = `
      position: fixed;
      top: 120px;
      left: 10px;
      font-size: 1.5rem;
      cursor: pointer;
      opacity: 0.08;
      transition: opacity 0.3s ease;
      z-index: 100;
      transform: scaleX(-1);
    `;

    // Right ear - positioned lower to avoid floating controls
    const rightEar = document.createElement('div');
    rightEar.className = 'ferengi-ear right-ear';
    rightEar.innerHTML = '👂';
    rightEar.style.cssText = `
      position: fixed;
      top: 120px;
      right: 10px;
      font-size: 1.5rem;
      cursor: pointer;
      opacity: 0.08;
      transition: opacity 0.3s ease;
      z-index: 100;
    `;

    document.body.appendChild(leftEar);
    document.body.appendChild(rightEar);

    // Ear clicking logic
    [leftEar, rightEar].forEach(ear => {
      ear.addEventListener('click', () => {
        this.earsClickCount++;
        ear.style.opacity = '0.3';

        setTimeout(() => {
          ear.style.opacity = '0.1';
        }, 200);

        if (this.earsClickCount === 10) {
          this.unlockQuarkMode();
          this.earsClickCount = 0;
        }

        // Play ear sound
        if (window.ferengiSounds) {
          ferengiSounds.playSound('click');
        }
      });

      ear.addEventListener('mouseover', () => {
        ear.style.opacity = '0.5';
      });

      ear.addEventListener('mouseout', () => {
        ear.style.opacity = '0.1';
      });
    });
  }

  setupSecretMenus() {
    // Add secret debug menu accessible via triple-click on logo
    const logo = document.querySelector('h1') || document.querySelector('.logo');
    if (logo) {
      let clickCount = 0;
      let clickTimer = null;

      logo.addEventListener('click', () => {
        clickCount++;

        if (clickTimer) clearTimeout(clickTimer);

        clickTimer = setTimeout(() => {
          if (clickCount === 3) {
            this.showDebugMenu();
          }
          clickCount = 0;
        }, 500);
      });
    }
  }

  setupHiddenRules() {
    // Add Rule 287 (fan-created) that appears after viewing all 286 rules
    this.hiddenRule287 = {
      number: 287,
      text: "When in doubt, consult the Oracle... but trust your lobes.",
      category: "wisdom",
      context: "The secret rule discovered by true devotees of the Rules of Acquisition."
    };
  }

  setupCheatCodes() {
    // Type "PROFIT" anywhere to trigger special effect
    let typedSequence = '';
    document.addEventListener('keypress', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      typedSequence += e.key.toUpperCase();

      if (typedSequence.length > 10) {
        typedSequence = typedSequence.slice(-10);
      }

      if (typedSequence.includes('PROFIT')) {
        this.triggerProfitEffect();
        typedSequence = '';
      }

      if (typedSequence.includes('LATINUM')) {
        this.triggerLatinumRain();
        typedSequence = '';
      }

      if (typedSequence.includes('NAGUS')) {
        this.summonGrandNagus();
        typedSequence = '';
      }
    });
  }

  setupRandomQuotes() {
    // Hidden Quark quotes that appear randomly
    this.quarkQuotes = [
      "The way I see it, humans used to be a lot like Ferengi: greedy, acquisitive, interested only in profit.",
      "I love the ancient human saying: 'Greed is eternal.'",
      "Rule of Acquisition number 211: 'Employees are the rungs on the ladder of success. Don't hesitate to step on them.'",
      "You'd be surprised how far a little greed can take you.",
      "The Great Material Continuum flows through all things!",
      "Ah, the sweet sound of profit!",
      "A wise man can hear profit in the wind.",
      "Never place friendship above profit.",
      "The bigger the smile, the sharper the knife."
    ];

    // 1% chance to show a quote when revealing a rule
    const originalRandomRule = window.getRandomRule;
    if (typeof originalRandomRule === 'function') {
      window.getRandomRule = () => {
        const result = originalRandomRule();

        // Guard against null/undefined result
        if (result && Math.random() < 0.01) {
          setTimeout(() => {
            this.showQuarkQuote();
          }, 2000);
        }

        return result;
      };
    }
  }

  addSecretStyles() {
    const style = document.createElement('style');
    style.id = 'easter-egg-styles';
    style.textContent = `
      .grand-nagus-mode {
        filter: hue-rotate(60deg) saturate(1.5);
        animation: grandNagusGlow 3s ease-in-out infinite alternate;
      }

      .grand-nagus-mode .header {
        background: linear-gradient(45deg, gold, orange, red, gold);
        background-size: 400% 400%;
        animation: gradientShift 4s ease infinite;
      }

      .quark-mode {
        font-family: 'Comic Sans MS', cursive, sans-serif !important;
      }

      .quark-mode .rule-text {
        font-style: italic;
        color: #ff6b35;
      }

      .latinum-rain .latinum-coin {
        position: fixed;
        font-size: 2rem;
        color: gold;
        pointer-events: none;
        z-index: 9999;
        animation: coinFall 3s linear infinite;
      }

      .profit-explosion {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 4rem;
        color: gold;
        z-index: 9999;
        animation: profitExplode 2s ease-out forwards;
        pointer-events: none;
      }

      .debug-menu {
        position: fixed;
        top: 50px;
        right: 50px;
        background: rgba(0, 0, 0, 0.9);
        color: #00ff00;
        padding: 1rem;
        border: 1px solid #00ff00;
        border-radius: 5px;
        font-family: 'Courier New', monospace;
        font-size: 0.8rem;
        z-index: 10000;
        max-width: 300px;
      }

      .quark-quote {
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: linear-gradient(45deg, #ff8c00, #ffd700);
        color: #000;
        padding: 1rem;
        border-radius: 10px;
        max-width: 300px;
        z-index: 9999;
        animation: quarkSlideIn 0.5s ease-out;
        box-shadow: 0 4px 20px rgba(255, 140, 0, 0.3);
      }

      .quark-quote::before {
        content: "Quark says: ";
        font-weight: bold;
        font-style: italic;
      }

      .grand-nagus-crown {
        position: fixed;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 3rem;
        z-index: 9999;
        animation: crownFloat 2s ease-in-out infinite alternate;
      }

      @keyframes grandNagusGlow {
        0% { filter: hue-rotate(0deg) saturate(1) brightness(1); }
        100% { filter: hue-rotate(60deg) saturate(1.5) brightness(1.2); }
      }

      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }

      @keyframes coinFall {
        0% {
          transform: translateY(-100vh) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(100vh) rotate(360deg);
          opacity: 0;
        }
      }

      @keyframes profitExplode {
        0% {
          transform: translate(-50%, -50%) scale(0);
          opacity: 1;
        }
        50% {
          transform: translate(-50%, -50%) scale(1.5);
          opacity: 1;
        }
        100% {
          transform: translate(-50%, -50%) scale(2);
          opacity: 0;
        }
      }

      @keyframes quarkSlideIn {
        0% {
          transform: translateX(-100%);
          opacity: 0;
        }
        100% {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes crownFloat {
        0% { transform: translateX(-50%) translateY(0px); }
        100% { transform: translateX(-50%) translateY(-10px); }
      }

      .rule-287-special {
        background: linear-gradient(45deg, #ffd700, #ff1493, #00ff00, #ff8c00);
        background-size: 400% 400%;
        animation: rainbowShimmer 2s ease infinite;
        border: 3px solid gold;
      }

      @keyframes rainbowShimmer {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `;
    document.head.appendChild(style);
  }

  activateGrandNagusMode() {
    if (this.hiddenFeatures.grandNagusMode) return;

    this.hiddenFeatures.grandNagusMode = true;
    document.body.classList.add('grand-nagus-mode');

    // Add crown
    const crown = document.createElement('div');
    crown.className = 'grand-nagus-crown';
    crown.innerHTML = '👑';
    document.body.appendChild(crown);

    // Show notification
    this.showEasterEggNotification('🎉 GRAND NAGUS MODE ACTIVATED! 🎉', 'You have achieved ultimate Ferengi mastery!');

    // Play special sound
    if (window.ferengiSounds) {
      ferengiSounds.playSound('achievement');
      ferengiSounds.speakFerengiQuote('achievement');
    }

    // Trigger achievement
    if (window.achievementSystem) {
      achievementSystem.triggerEasterEgg();
    }

    // Auto-disable after 30 seconds
    setTimeout(() => {
      document.body.classList.remove('grand-nagus-mode');
      crown.remove();
    }, 30000);
  }

  unlockQuarkMode() {
    if (this.hiddenFeatures.quarkMode) return;

    this.hiddenFeatures.quarkMode = true;
    document.body.classList.add('quark-mode');

    this.showEasterEggNotification('🍺 Quark Mode Enabled! 🍺', 'Welcome to Quark\'s Bar! Everything is now more... Ferengi.');

    // Add Quark's personality to all text
    const originalTexts = document.querySelectorAll('.rule-text');
    originalTexts.forEach(text => {
      if (text.textContent && !text.textContent.includes('*chuckles in Ferengi*')) {
        text.textContent += ' *chuckles in Ferengi*';
      }
    });

    if (window.ferengiSounds) {
      ferengiSounds.playSound('profit');
    }

    if (window.achievementSystem) {
      achievementSystem.triggerEasterEgg();
    }

    // Auto-disable after 60 seconds
    setTimeout(() => {
      document.body.classList.remove('quark-mode');
      this.hiddenFeatures.quarkMode = false;
    }, 60000);
  }

  showDebugMenu() {
    if (document.getElementById('debug-menu')) return;

    const debugMenu = document.createElement('div');
    debugMenu.id = 'debug-menu';
    debugMenu.className = 'debug-menu';
    debugMenu.innerHTML = `
      <h3>🔧 DEBUG CONSOLE</h3>
      <p>Easter Eggs Status:</p>
      <ul>
        <li>Grand Nagus: ${this.hiddenFeatures.grandNagusMode ? 'ACTIVE' : 'INACTIVE'}</li>
        <li>Quark Mode: ${this.hiddenFeatures.quarkMode ? 'ACTIVE' : 'INACTIVE'}</li>
        <li>Ear Clicks: ${this.earsClickCount}/10</li>
      </ul>
      <p>Commands:</p>
      <button onclick="easterEggs.triggerProfitEffect()">Profit Effect</button>
      <button onclick="easterEggs.triggerLatinumRain()">Latinum Rain</button>
      <button onclick="easterEggs.revealRule287()">Show Rule 287</button>
      <button onclick="this.parentElement.remove()">Close</button>
    `;

    document.body.appendChild(debugMenu);

    if (window.achievementSystem) {
      achievementSystem.triggerEasterEgg();
    }

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (debugMenu.parentElement) {
        debugMenu.remove();
      }
    }, 10000);
  }

  triggerProfitEffect() {
    const explosion = document.createElement('div');
    explosion.className = 'profit-explosion';
    explosion.innerHTML = '💰 PROFIT! 💰';
    document.body.appendChild(explosion);

    if (window.ferengiSounds) {
      ferengiSounds.playSound('profit');
      ferengiSounds.speakFerengiQuote('profit');
    }

    setTimeout(() => {
      explosion.remove();
    }, 2000);
  }

  triggerLatinumRain() {
    const coins = ['💰', '🪙', '✨', '💎'];
    const coinElements = [];

    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const coin = document.createElement('div');
        coin.className = 'latinum-coin';
        coin.innerHTML = coins[Math.floor(Math.random() * coins.length)];
        coin.style.left = Math.random() * 100 + 'vw';
        coin.style.animationDelay = Math.random() * 2 + 's';
        document.body.appendChild(coin);
        coinElements.push(coin);

        setTimeout(() => {
          if (coin.parentNode) coin.remove();
        }, 3000);
      }, i * 100);
    }

    document.body.classList.add('latinum-rain');
    setTimeout(() => {
      document.body.classList.remove('latinum-rain');
      // Cleanup any remaining coins
      coinElements.forEach(coin => {
        if (coin.parentNode) coin.remove();
      });
    }, 4000);

    if (window.ferengiSounds) {
      ferengiSounds.playSound('latinum');
      ferengiSounds.playSound('celebration');
    }
  }

  summonGrandNagus() {
    this.showEasterEggNotification('🎭 The Grand Nagus Appears! 🎭', 'Zek himself blesses your pursuit of profit!');

    // Create floating Grand Nagus
    const nagus = document.createElement('div');
    nagus.style.cssText = `
      position: fixed;
      top: 20%;
      left: 50%;
      transform: translateX(-50%);
      font-size: 5rem;
      z-index: 9999;
      animation: crownFloat 2s ease-in-out infinite alternate;
    `;
    nagus.innerHTML = '👴👑';
    document.body.appendChild(nagus);

    if (window.ferengiSounds) {
      ferengiSounds.playSound('achievement');
      ferengiSounds.speakFerengiQuote('wisdom');
    }

    setTimeout(() => {
      nagus.remove();
    }, 5000);
  }

  revealRule287() {
    if (this.hiddenFeatures.rule287) return;

    // Check if user has viewed all 286 rules first
    let ferengiStats = {};
    try {
      ferengiStats = JSON.parse(localStorage.getItem('ferengiStats') || '{}');
    } catch (e) {
      console.warn('Failed to load ferengiStats:', e);
    }
    const rulesViewed = Array.isArray(ferengiStats.rulesViewed) ? ferengiStats.rulesViewed.length : 0;

    if (rulesViewed < 286) {
      this.showEasterEggNotification('🔒 Rule 287 Locked', `View all 286 rules first! (${rulesViewed}/286)`);
      return;
    }

    this.hiddenFeatures.rule287 = true;

    // Show Rule 287 in special format
    const resultPanel = document.getElementById('result-panel');
    if (resultPanel) {
      resultPanel.innerHTML = `
        <div class="rule-card rule-287-special">
          <div class="rule-number">RULE #287</div>
          <div class="rule-text">"${this.hiddenRule287.text}"</div>
          <div class="rule-context">${this.hiddenRule287.context}</div>
          <div class="special-message">🎉 CONGRATULATIONS! You've discovered the secret Rule 287! 🎉</div>
        </div>
      `;
    }

    this.showEasterEggNotification('🌟 SECRET RULE 287 UNLOCKED! 🌟', 'The ultimate rule for true devotees!');

    if (window.ferengiSounds) {
      ferengiSounds.playSound('achievement');
      ferengiSounds.speakFerengiQuote('achievement');
    }

    if (window.achievementSystem) {
      achievementSystem.triggerEasterEgg();
    }
  }

  showQuarkQuote() {
    const quote = this.quarkQuotes[Math.floor(Math.random() * this.quarkQuotes.length)];

    const quoteElement = document.createElement('div');
    quoteElement.className = 'quark-quote';
    quoteElement.textContent = quote;
    document.body.appendChild(quoteElement);

    setTimeout(() => {
      quoteElement.remove();
    }, 5000);

    if (window.ferengiSounds) {
      ferengiSounds.playSound('click');
    }
  }

  showEasterEggNotification(title, message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(45deg, #ffd700, #ff8c00);
      color: #000;
      padding: 1rem 2rem;
      border-radius: 10px;
      text-align: center;
      z-index: 10000;
      box-shadow: 0 4px 20px rgba(255, 215, 0, 0.5);
      animation: notificationSlide 0.5s ease-out;
      max-width: 400px;
    `;
    notification.innerHTML = `
      <div style="font-weight: bold; font-size: 1.2rem; margin-bottom: 0.5rem;">${title}</div>
      <div style="font-size: 0.9rem;">${message}</div>
    `;

    document.body.appendChild(notification);

    // Add slide animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes notificationSlide {
        0% { transform: translateX(-50%) translateY(-100px); opacity: 0; }
        100% { transform: translateX(-50%) translateY(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
      notification.remove();
      style.remove();
    }, 4000);
  }

  // Public method to check for Rule 287 eligibility
  checkRule287Eligibility() {
    let ferengiStats = {};
    try {
      ferengiStats = JSON.parse(localStorage.getItem('ferengiStats') || '{}');
    } catch (e) {
      console.warn('Failed to load ferengiStats:', e);
    }
    const rulesViewed = Array.isArray(ferengiStats.rulesViewed) ? ferengiStats.rulesViewed.length : 0;

    if (rulesViewed >= 286 && !this.hiddenFeatures.rule287) {
      setTimeout(() => {
        this.showEasterEggNotification('🔓 Secret Unlocked!', 'You can now access Rule 287! Try some easter eggs...');
      }, 2000);
    }
  }
}

// Initialize Easter Eggs
const easterEggs = new FerengiEasterEggs();

// Make it globally accessible
window.easterEggs = easterEggs;

// Check for Rule 287 eligibility on load
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    easterEggs.checkRule287Eligibility();
  }, 3000);
});