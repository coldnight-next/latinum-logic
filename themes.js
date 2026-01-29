// Theme Management for Ferengi Rule Oracle

class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('ferengiTheme') || 'classic';
    this.soundEnabled = JSON.parse(localStorage.getItem('soundEnabled') || 'true');
    this.initializeThemeSwitcher();
    this.initializeSoundToggle();
    this.applyTheme(this.currentTheme);
  }

  initializeThemeSwitcher() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.createThemeSwitcher();
      });
    } else {
      this.createThemeSwitcher();
    }
  }

  createThemeSwitcher() {
    const themeSwitcher = document.createElement('div');
    themeSwitcher.className = 'theme-switcher';
    themeSwitcher.innerHTML = `
      <select class="theme-select" id="theme-select">
        <option value="classic">Classic Gold</option>
        <option value="deep-space">Deep Space</option>
        <option value="crimson-profit">Crimson Profit</option>
        <option value="mystic-purple">Mystic Purple</option>
      </select>
    `;

    // Position the theme selector on the right side of the header
    themeSwitcher.style.cssText = `
      position: absolute;
      top: 1rem;
      right: 2rem;
      z-index: 3000;
    `;

    // Use the masthead as the positioning context
    const masthead = document.querySelector('.masthead');
    if (masthead) {
      masthead.appendChild(themeSwitcher);
    } else {
      // Fallback to body if masthead not found
      themeSwitcher.style.position = 'fixed';
      document.body.appendChild(themeSwitcher);
    }

    const select = document.getElementById('theme-select');
    if (select) {
      select.value = this.currentTheme;
      select.addEventListener('change', (e) => {
        this.setTheme(e.target.value);
      });
    }
  }

  initializeSoundToggle() {
    // Check if sound toggle button already exists
    const existingBtn = document.getElementById('sound-toggle');
    if (existingBtn) {
      // Use existing button but ensure it has proper event listener
      this.updateSoundButton();
      existingBtn.addEventListener('click', () => {
        this.toggleSound();
      });
      return;
    }

    const soundToggle = document.createElement('div');
    soundToggle.className = 'sound-toggle';
    soundToggle.innerHTML = `
      <button class="sound-btn" id="sound-toggle" title="Toggle Sound Effects">
        🔊
      </button>
    `;

    // Find the best place to put the sound toggle
    let targetElement = document.querySelector('.floating-controls');
    if (!targetElement) {
      targetElement = document.querySelector('.header-controls');
    }
    if (!targetElement) {
      targetElement = document.querySelector('header');
    }
    if (!targetElement) {
      targetElement = document.body;
    }

    if (targetElement) {
      targetElement.appendChild(soundToggle);
    } else {
      console.warn('Could not find suitable location for sound toggle');
      return;
    }

    const btn = document.getElementById('sound-toggle');
    this.updateSoundButton();
    btn.addEventListener('click', () => {
      this.toggleSound();
    });
  }

  setTheme(themeName) {
    this.currentTheme = themeName;
    localStorage.setItem('ferengiTheme', themeName);
    this.applyTheme(themeName);
  }

  applyTheme(themeName) {
    // Remove all theme classes
    document.documentElement.className = document.documentElement.className
      .replace(/theme-\w+/g, '')
      .trim();

    // Apply new theme if not classic
    if (themeName !== 'classic') {
      document.documentElement.classList.add(`theme-${themeName}`);
    }

    // Update theme-specific background
    const themeVars = {
      'classic': 'radial-gradient(circle at top, #3c2f4f 0%, #120b1f 45%, #040208 100%)',
      'deep-space': 'radial-gradient(circle at top, #1a202c 0%, #0a0a0a 45%, #000000 100%)',
      'crimson-profit': 'radial-gradient(circle at top, #4a1c1c 0%, #2d1b1b 45%, #1a0a0a 100%)',
      'mystic-purple': 'radial-gradient(circle at top, #2d1b69 0%, #1a0a2e 45%, #0a0515 100%)'
    };

    document.body.style.background = themeVars[themeName] || themeVars['classic'];
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    localStorage.setItem('soundEnabled', JSON.stringify(this.soundEnabled));
    this.updateSoundButton();
  }

  updateSoundButton() {
    const btn = document.getElementById('sound-toggle');
    if (this.soundEnabled) {
      btn.textContent = '🔊';
      btn.classList.remove('muted');
      btn.title = 'Sound Effects: On';
    } else {
      btn.textContent = '🔇';
      btn.classList.add('muted');
      btn.title = 'Sound Effects: Off';
    }
  }

  isSoundEnabled() {
    return this.soundEnabled;
  }

  // Play sound effect if enabled - delegates to canonical sound system
  playSound(soundName) {
    if (!this.soundEnabled) return;

    // Delegate to canonical FerengiSoundSystem if available
    if (window.ferengiSounds) {
      window.ferengiSounds.playSound(soundName);
      return;
    }

    // Fallback: basic tone generation
    this.playTone(soundName);
  }

  // Simple tone generation fallback
  playTone(type) {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      const frequencies = {
        'rule-reveal': 523, // C5
        'coin-clink': 784,  // G5
        'favorite': 659,    // E5
        'achievement': 880  // A5
      };

      oscillator.frequency.setValueAtTime(frequencies[type] || 440, audioContext.currentTime);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
      // Fallback: no sound if Web Audio API not supported
    }
  }
}

// Initialize theme manager
const themeManager = new ThemeManager();

// Export for global use
window.themeManager = themeManager;