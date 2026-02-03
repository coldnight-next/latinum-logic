// Enhanced Rule Reveal Sequences for Ferengi Rule Oracle

class EnhancedRevealSystem {
  constructor() {
    this.revealPreferences = this.loadPreferences();
    this.currentReveal = null;
    this.initializeSystem();
  }

  loadPreferences() {
    return JSON.parse(localStorage.getItem('revealPreferences') || JSON.stringify({
      intensity: 'epic', // epic, standard, minimal
      soundEnabled: true,
      particlesEnabled: true,
      speed: 'normal' // fast, normal, slow
    }));
  }

  savePreferences() {
    localStorage.setItem('revealPreferences', JSON.stringify(this.revealPreferences));
  }

  initializeSystem() {
    this.createPreferenceControls();
    this.injectRevealStyles();
  }

  createPreferenceControls() {
    // Add reveal preference controls to the header
    const headerControls = document.querySelector('.floating-controls') || document.querySelector('.header-controls');
    if (headerControls) {
      const revealPrefs = document.createElement('div');
      revealPrefs.className = 'reveal-preferences';
      revealPrefs.innerHTML = `
        <button id="reveal-settings" class="theme-btn" title="Reveal Animation Settings">✨</button>
        <div id="reveal-settings-panel" class="reveal-settings-panel" style="display: none;">
          <h4>Reveal Settings</h4>
          <div class="setting-group">
            <label>Intensity:</label>
            <select id="reveal-intensity">
              <option value="epic">Epic</option>
              <option value="standard">Standard</option>
              <option value="minimal">Minimal</option>
            </select>
          </div>
          <div class="setting-group">
            <label>Speed:</label>
            <select id="reveal-speed">
              <option value="fast">Fast</option>
              <option value="normal">Normal</option>
              <option value="slow">Slow</option>
            </select>
          </div>
          <div class="setting-group">
            <label>
              <input type="checkbox" id="reveal-sound" checked> Sound Effects
            </label>
          </div>
          <div class="setting-group">
            <label>
              <input type="checkbox" id="reveal-particles" checked> Particles
            </label>
          </div>
        </div>
      `;

      // Insert before the theme toggle
      const themeToggle = document.getElementById('theme-toggle');
      headerControls.insertBefore(revealPrefs, themeToggle);

      this.bindPreferenceEvents();
    }
  }

  bindPreferenceEvents() {
    const settingsBtn = document.getElementById('reveal-settings');
    const settingsPanel = document.getElementById('reveal-settings-panel');

    settingsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
    });

    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
      if (!settingsBtn.contains(e.target) && !settingsPanel.contains(e.target)) {
        settingsPanel.style.display = 'none';
      }
    });

    // Close panel with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && settingsPanel.style.display !== 'none') {
        settingsPanel.style.display = 'none';
        settingsBtn.focus();
      }
    });

    // Bind setting changes
    document.getElementById('reveal-intensity').addEventListener('change', (e) => {
      this.revealPreferences.intensity = e.target.value;
      this.savePreferences();
    });

    document.getElementById('reveal-speed').addEventListener('change', (e) => {
      this.revealPreferences.speed = e.target.value;
      this.savePreferences();
    });

    document.getElementById('reveal-sound').addEventListener('change', (e) => {
      this.revealPreferences.soundEnabled = e.target.checked;
      this.savePreferences();
    });

    document.getElementById('reveal-particles').addEventListener('change', (e) => {
      this.revealPreferences.particlesEnabled = e.target.checked;
      this.savePreferences();
    });

    // Set initial values
    document.getElementById('reveal-intensity').value = this.revealPreferences.intensity;
    document.getElementById('reveal-speed').value = this.revealPreferences.speed;
    document.getElementById('reveal-sound').checked = this.revealPreferences.soundEnabled;
    document.getElementById('reveal-particles').checked = this.revealPreferences.particlesEnabled;
  }

  injectRevealStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .reveal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.95) 100%);
        z-index: 2000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.5s ease;
      }

      .reveal-overlay.active {
        opacity: 1;
      }

      .reveal-stage {
        position: relative;
        max-width: 600px;
        width: 90%;
        text-align: center;
      }

      .reveal-anticipation {
        animation: anticipationPulse 2s ease-in-out infinite;
      }

      @keyframes anticipationPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }

      .reveal-mystical {
        position: relative;
      }

      .mystical-particles {
        position: absolute;
        top: -50px;
        left: -50px;
        right: -50px;
        bottom: -50px;
        pointer-events: none;
      }

      .mystical-particle {
        position: absolute;
        width: 4px;
        height: 4px;
        background: var(--latinum);
        border-radius: 50%;
        animation: mysticalFloat 3s ease-in-out infinite;
      }

      .mystical-particle:nth-child(odd) {
        animation-delay: -1s;
        background: var(--ferengi-orange);
      }

      .mystical-particle:nth-child(3n) {
        animation-delay: -2s;
        background: #ffe795;
      }

      @keyframes mysticalFloat {
        0%, 100% {
          transform: translateY(0) rotate(0deg);
          opacity: 0.3;
        }
        50% {
          transform: translateY(-20px) rotate(180deg);
          opacity: 1;
        }
      }

      .rule-tease {
        font-size: 1.5rem;
        color: var(--latinum);
        font-family: 'Orbitron', monospace;
        text-shadow: 0 0 10px var(--latinum);
        animation: teaseGlow 1.5s ease-in-out infinite alternate;
      }

      @keyframes teaseGlow {
        from { text-shadow: 0 0 10px var(--latinum); }
        to { text-shadow: 0 0 20px var(--latinum), 0 0 30px var(--latinum); }
      }

      .category-hint {
        margin-top: 1rem;
        font-size: 0.9rem;
        color: var(--ferengi-orange);
        opacity: 0.8;
      }

      .reveal-explosion {
        position: relative;
        overflow: hidden;
      }

      .explosion-particles {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
      }

      .explosion-particle {
        position: absolute;
        width: 8px;
        height: 8px;
        background: var(--latinum);
        border-radius: 50%;
        animation: explosionBurst 1s ease-out forwards;
      }

      .explosion-particle.gold { background: #ffe795; }
      .explosion-particle.orange { background: var(--ferengi-orange); }

      @keyframes explosionBurst {
        0% {
          transform: scale(0) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: scale(1) rotate(360deg) translate(
            calc(var(--tx) * 100px),
            calc(var(--ty) * 100px)
          );
          opacity: 0;
        }
      }

      .rule-card-3d {
        transform-style: preserve-3d;
        transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }

      .rule-card-3d.flipped {
        transform: rotateY(180deg) scale(1.05);
      }

      .rule-card-front, .rule-card-back {
        backface-visibility: hidden;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      .rule-card-back {
        transform: rotateY(180deg);
      }

      .celebration-effects {
        position: absolute;
        top: -50px;
        left: -50px;
        right: -50px;
        bottom: -50px;
        pointer-events: none;
        z-index: 10;
      }

      .confetti-piece {
        position: absolute;
        width: 6px;
        height: 12px;
        background: var(--latinum);
        animation: confettiFall 2s ease-out forwards;
      }

      .confetti-piece.gold { background: #ffe795; }
      .confetti-piece.orange { background: var(--ferengi-orange); }
      .confetti-piece.red { background: #e74c3c; }

      @keyframes confettiFall {
        0% {
          transform: translateY(-100px) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(100px) rotate(720deg);
          opacity: 0;
        }
      }

      .reveal-glow {
        position: absolute;
        top: -20px;
        left: -20px;
        right: -20px;
        bottom: -20px;
        border-radius: 25px;
        background: radial-gradient(circle, rgba(249, 217, 108, 0.3) 0%, transparent 70%);
        animation: revealGlowPulse 2s ease-in-out infinite;
        pointer-events: none;
      }

      @keyframes revealGlowPulse {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 0.6; transform: scale(1.1); }
      }

      .reveal-preferences {
        position: absolute;
        top: 1rem;
        right: 6rem;
        z-index: 3000;
      }

      @media (max-width: 768px) {
        .reveal-preferences {
          top: 3.5rem;
          right: 4rem;
        }
        
        .reveal-preferences .theme-btn {
          width: 40px;
          height: 40px;
          font-size: 0.9rem;
        }
      }

      .reveal-settings-panel {
        position: absolute;
        top: 100%;
        right: 0;
        background: rgba(12, 8, 18, 0.95);
        border: 1px solid rgba(255, 231, 149, 0.3);
        border-radius: 12px;
        padding: 1rem;
        min-width: 200px;
        z-index: 2000;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
      }

      .reveal-settings-panel h4 {
        margin: 0 0 1rem;
        color: var(--latinum-bright);
        font-size: 1rem;
      }

      .setting-group {
        margin-bottom: 0.75rem;
      }

      .setting-group label {
        display: block;
        color: var(--latinum);
        font-size: 0.9rem;
        margin-bottom: 0.25rem;
      }

      .setting-group select {
        width: 100%;
        background: rgba(255, 231, 149, 0.1);
        border: 1px solid rgba(255, 231, 149, 0.3);
        border-radius: 6px;
        color: var(--latinum);
        padding: 0.25rem;
        font-size: 0.8rem;
      }

      .setting-group input[type="checkbox"] {
        margin-right: 0.5rem;
      }

      /* Category-specific effects */
      .category-profit .explosion-particle { background: #ffe795; }
      .category-business .explosion-particle { background: var(--ferengi-orange); }
      .category-negotiation .explosion-particle { background: #3498db; }
      .category-ethics .explosion-particle { background: #e74c3c; }
      .category-personal .explosion-particle { background: #9b59b6; }
      .category-wisdom .explosion-particle { background: var(--latinum); }

      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        .reveal-anticipation,
        .mystical-particle,
        .explosion-particle,
        .rule-card-3d,
        .confetti-piece,
        .reveal-glow {
          animation: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  async revealRule(rule, targetElement) {
    if (this.revealPreferences.intensity === 'minimal') {
      return this.basicReveal(rule, targetElement);
    }

    // Create overlay for cinematic reveal
    const overlay = this.createRevealOverlay();
    document.body.appendChild(overlay);

    // Allow click-to-skip so users don't get stuck waiting
    let skipped = false;
    const skipHandler = () => { skipped = true; };
    overlay.addEventListener('click', skipHandler);
    overlay.style.cursor = 'pointer';

    try {
      // Phase 1: Anticipation
      if (!skipped) await this.phaseAnticipation(overlay, rule);

      // Phase 2: Dramatic Reveal
      if (!skipped) await this.phaseReveal(overlay, rule);

      // Phase 3: Celebration
      if (!skipped) await this.phaseCelebration(overlay, rule);

      // Transfer to target element
      this.transferToTarget(overlay, targetElement, rule);

    } finally {
      // Cleanup immediately
      overlay.removeEventListener('click', skipHandler);
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    }
  }

  createRevealOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'reveal-overlay';
    overlay.innerHTML = `
      <div class="reveal-stage">
        <div class="reveal-content"></div>
      </div>
    `;
    return overlay;
  }

  async phaseAnticipation(overlay, rule) {
    const content = overlay.querySelector('.reveal-content');
    const duration = this.getDuration(2);

    content.innerHTML = `
      <div class="reveal-anticipation">
        <div class="reveal-mystical">
          <div class="rule-tease">Rule of Acquisition</div>
          <div class="category-hint">${this.getCategoryHint(rule.category)}</div>
          <div class="mystical-particles" id="mystical-particles"></div>
        </div>
      </div>
    `;

    overlay.classList.add('active');

    // Create mystical particles
    if (this.revealPreferences.particlesEnabled) {
      this.createMysticalParticles(overlay.querySelector('#mystical-particles'));
    }

    // Play anticipation sound
    if (this.revealPreferences.soundEnabled) {
      this.playSound('anticipation');
    }

    await this.delay(duration);
  }

  async phaseReveal(overlay, rule) {
    const content = overlay.querySelector('.reveal-content');
    const duration = this.getDuration(3);

    content.innerHTML = `
      <div class="reveal-explosion category-${rule.category}">
        <div class="rule-card-3d" id="rule-card-3d">
          <div class="rule-card-front">
            <div class="rule-tease">Rule #${rule.number}</div>
          </div>
          <div class="rule-card-back">
            <div class="rule-number">Rule of Acquisition #${rule.number}</div>
            <div class="rule-text" id="reveal-rule-text"></div>
          </div>
        </div>
        <div class="explosion-particles" id="explosion-particles"></div>
        <div class="celebration-effects" id="celebration-effects"></div>
      </div>
    `;

    // Create explosion particles
    if (this.revealPreferences.particlesEnabled) {
      this.createExplosionParticles(overlay.querySelector('#explosion-particles'), rule.category);
    }

    // Play reveal sound
    if (this.revealPreferences.soundEnabled) {
      this.playSound('reveal', rule.category);
    }

    // Flip the card
    setTimeout(() => {
      overlay.querySelector('#rule-card-3d').classList.add('flipped');
    }, 500);

    // Typewriter effect for rule text
    await this.delay(1000);
    await this.typewriterEffect(overlay.querySelector('#reveal-rule-text'), rule.text);

    await this.delay(duration - 1000);
  }

  async phaseCelebration(overlay, rule) {
    const duration = this.getDuration(2);

    // Add celebration effects
    if (this.revealPreferences.particlesEnabled) {
      this.createConfetti(overlay.querySelector('#celebration-effects'));
    }

    // Add glow effect
    const ruleCard = overlay.querySelector('.reveal-explosion');
    if (ruleCard) {
      const glow = document.createElement('div');
      glow.className = 'reveal-glow';
      ruleCard.appendChild(glow);
    }

    // Play celebration sound
    if (this.revealPreferences.soundEnabled) {
      this.playSound('celebration');
    }

    await this.delay(duration);
  }

  transferToTarget(overlay, targetElement, rule) {
    if (!targetElement) {
      console.error('Target element not found for rule reveal');
      return;
    }
    // Update only the rule number and text, preserving other panel elements
    this.updateRuleDisplay(targetElement, rule);
    targetElement.classList.add('rule-revealed');
  }

  basicReveal(rule, targetElement) {
    if (!targetElement) return;
    this.updateRuleDisplay(targetElement, rule);
    targetElement.classList.add('rule-revealed');
  }

  updateRuleDisplay(targetElement, rule) {
    const ruleNumberEl = targetElement.querySelector('#rule-number') || targetElement.querySelector('.rule-number');
    const ruleTextEl = targetElement.querySelector('#rule-text') || targetElement.querySelector('.rule-text');

    if (ruleNumberEl) {
      ruleNumberEl.textContent = `Rule of Acquisition #${rule.number}`;
    }
    if (ruleTextEl) {
      ruleTextEl.textContent = rule.text;
    }
  }

  createMysticalParticles(container) {
    if (!container) return;
    for (let i = 0; i < 12; i++) {
      const particle = document.createElement('div');
      particle.className = 'mystical-particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 2 + 's';
      container.appendChild(particle);
    }
  }

  createExplosionParticles(container, category) {
    if (!container) return;
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = `explosion-particle ${this.getParticleColor(category)}`;
      particle.style.left = '50%';
      particle.style.top = '50%';
      particle.style.setProperty('--tx', (Math.random() - 0.5) * 2);
      particle.style.setProperty('--ty', (Math.random() - 0.5) * 2);
      particle.style.animationDelay = Math.random() * 0.5 + 's';
      container.appendChild(particle);
    }
  }

  createConfetti(container) {
    if (!container) return;
    for (let i = 0; i < 30; i++) {
      const confetti = document.createElement('div');
      confetti.className = `confetti-piece ${this.getConfettiColor()}`;
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.animationDelay = Math.random() * 1 + 's';
      container.appendChild(confetti);
    }
  }

  async typewriterEffect(element, text, speed = 50) {
    // Delegate to global animation controller if available
    if (window.animationController && window.animationController.typewriterEffect) {
      return window.animationController.typewriterEffect(element, text, speed);
    }
    element.textContent = '';
    for (let i = 0; i < text.length; i++) {
      element.textContent += text[i];
      await this.delay(speed);
    }
  }

  getCategoryHint(category) {
    const hints = {
      'profit': 'A rule about wealth and riches...',
      'business': 'A principle of commerce and trade...',
      'negotiation': 'A tactic for deals and bargaining...',
      'ethics': 'A guideline for conduct and morality...',
      'personal': 'A rule about relationships and family...',
      'wisdom': 'An insight for life and decision-making...'
    };
    return hints[category] || 'A Ferengi rule of great importance...';
  }

  getParticleColor(category) {
    const colors = {
      'profit': 'gold',
      'business': 'orange',
      'negotiation': '',
      'ethics': 'red',
      'personal': '',
      'wisdom': ''
    };
    return colors[category] || '';
  }

  getConfettiColor() {
    const colors = ['gold', 'orange', 'red'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  getDuration(baseDuration) {
    const multipliers = {
      'fast': 0.7,
      'normal': 1,
      'slow': 1.5
    };
    return baseDuration * multipliers[this.revealPreferences.speed];
  }

  playSound(type, category = null) {
    if (!this.revealPreferences.soundEnabled) return;

    // Delegate to canonical sound system if available
    if (window.ferengiSounds) {
      const soundMap = {
        'anticipation': 'rule-reveal',
        'reveal': 'rule-reveal',
        'celebration': 'achievement'
      };
      window.ferengiSounds.playSound(soundMap[type] || 'rule-reveal');
      return;
    }

    // Fallback: basic oscillator
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      const soundSettings = this.getSoundSettings(type, category);

      oscillator.frequency.setValueAtTime(soundSettings.frequency, audioContext.currentTime);
      oscillator.type = soundSettings.type;

      gainNode.gain.setValueAtTime(soundSettings.volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + soundSettings.duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + soundSettings.duration);
    } catch (e) {
      // Fallback: no sound
    }
  }

  getSoundSettings(type, category) {
    const settings = {
      'anticipation': { frequency: 220, type: 'sine', volume: 0.1, duration: 2 },
      'reveal': { frequency: 440, type: 'triangle', volume: 0.15, duration: 1 },
      'celebration': { frequency: 660, type: 'square', volume: 0.12, duration: 1.5 }
    };

    // Category-specific frequency adjustments
    if (type === 'reveal' && category) {
      const adjustments = {
        'profit': 1.2,
        'business': 1.1,
        'negotiation': 0.9,
        'ethics': 0.8,
        'personal': 1.3,
        'wisdom': 1.0
      };
      settings.reveal.frequency *= adjustments[category] || 1;
    }

    return settings[type] || settings.reveal;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Initialize enhanced reveal system
const enhancedRevealSystem = new EnhancedRevealSystem();

// Export for global use
window.enhancedRevealSystem = enhancedRevealSystem;