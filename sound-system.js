// Advanced Sound System for Ferengi Rule Oracle
class FerengiSoundSystem {
  constructor() {
    this.audioContext = null;
    this.sounds = {};
    this.isEnabled = JSON.parse(localStorage.getItem('soundEnabled') || 'true');
    this.masterVolume = parseFloat(localStorage.getItem('masterVolume') || '0.7');
    this.initializeAudioContext();
    this.createSounds();
  }

  async initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

      // Handle browser audio policy - require user interaction
      if (this.audioContext.state === 'suspended') {
        document.addEventListener('click', () => {
          this.audioContext.resume();
        }, { once: true });
      }
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  createSounds() {
    // Define Ferengi-themed sounds using Web Audio API synthesis
    this.sounds = {
      ruleReveal: () => this.createRuleRevealSound(),
      profit: () => this.createProfitSound(),
      latinum: () => this.createLatinumSound(),
      success: () => this.createSuccessSound(),
      error: () => this.createErrorSound(),
      click: () => this.createClickSound(),
      whoosh: () => this.createWhooshSound(),
      achievement: () => this.createAchievementSound(),
      gameStart: () => this.createGameStartSound(),
      timer: () => this.createTimerSound(),
      celebration: () => this.createCelebrationSound(),
      ambient: () => this.createAmbientSound()
    };
  }

  createRuleRevealSound() {
    if (!this.audioContext || !this.isEnabled) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filterNode = this.audioContext.createBiquadFilter();

    // Mystical ascending tone
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.8);

    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(1000, this.audioContext.currentTime);
    filterNode.frequency.exponentialRampToValueAtTime(4000, this.audioContext.currentTime + 0.8);

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.3, this.audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.8);

    oscillator.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.8);
  }

  createProfitSound() {
    if (!this.audioContext || !this.isEnabled) return;

    // Golden coin-like chime
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
    frequencies.forEach((freq, index) => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime + index * 0.1);
      gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.4, this.audioContext.currentTime + index * 0.1 + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + index * 0.1 + 0.6);

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.start(this.audioContext.currentTime + index * 0.1);
      oscillator.stop(this.audioContext.currentTime + index * 0.1 + 0.6);
    });
  }

  createLatinumSound() {
    if (!this.audioContext || !this.isEnabled) return;

    // Metallic ring sound
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filterNode = this.audioContext.createBiquadFilter();

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(300, this.audioContext.currentTime + 0.3);

    filterNode.type = 'bandpass';
    filterNode.frequency.setValueAtTime(2000, this.audioContext.currentTime);

    gainNode.gain.setValueAtTime(this.masterVolume * 0.2, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);

    oscillator.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  createSuccessSound() {
    if (!this.audioContext || !this.isEnabled) return;

    // Triumphant ascending chord
    const chord = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    chord.forEach((freq, index) => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime + index * 0.05);
      gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.3, this.audioContext.currentTime + index * 0.05 + 0.1);
      gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.8);

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.start(this.audioContext.currentTime + index * 0.05);
      oscillator.stop(this.audioContext.currentTime + 0.8);
    });
  }

  createErrorSound() {
    if (!this.audioContext || !this.isEnabled) return;

    // Dissonant buzz
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(100, this.audioContext.currentTime + 0.3);

    gainNode.gain.setValueAtTime(this.masterVolume * 0.3, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.3);

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  createClickSound() {
    if (!this.audioContext || !this.isEnabled) return;

    // Short click
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);

    gainNode.gain.setValueAtTime(this.masterVolume * 0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }

  createWhooshSound() {
    if (!this.audioContext || !this.isEnabled) return;

    // Sweeping whoosh
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filterNode = this.audioContext.createBiquadFilter();

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(100, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(2000, this.audioContext.currentTime + 0.5);

    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(500, this.audioContext.currentTime);
    filterNode.frequency.exponentialRampToValueAtTime(5000, this.audioContext.currentTime + 0.5);

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.2, this.audioContext.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.5);

    oscillator.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.5);
  }

  createAchievementSound() {
    if (!this.audioContext || !this.isEnabled) return;

    // Epic achievement fanfare
    const melody = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    melody.forEach((freq, index) => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime + index * 0.2);

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime + index * 0.2);
      gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.4, this.audioContext.currentTime + index * 0.2 + 0.1);
      gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + index * 0.2 + 0.5);

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.start(this.audioContext.currentTime + index * 0.2);
      oscillator.stop(this.audioContext.currentTime + index * 0.2 + 0.5);
    });
  }

  createGameStartSound() {
    if (!this.audioContext || !this.isEnabled) return;

    // Game ready sound
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(880, this.audioContext.currentTime + 0.3);

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.3, this.audioContext.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.3);

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  createTimerSound() {
    if (!this.audioContext || !this.isEnabled) return;

    // Tick sound
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);

    gainNode.gain.setValueAtTime(this.masterVolume * 0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.05);

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.05);
  }

  createCelebrationSound() {
    if (!this.audioContext || !this.isEnabled) return;

    // Multi-layered celebration
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.createProfitSound();
      }, i * 100);
    }
  }

  createAmbientSound() {
    if (!this.audioContext || !this.isEnabled) return;

    // Subtle space ambience
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filterNode = this.audioContext.createBiquadFilter();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(60, this.audioContext.currentTime);

    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(200, this.audioContext.currentTime);

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.05, this.audioContext.currentTime + 2);

    oscillator.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 10);
  }

  // Public methods
  playSound(soundName) {
    if (this.sounds[soundName]) {
      this.sounds[soundName]();
    }
  }

  setVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    localStorage.setItem('masterVolume', this.masterVolume.toString());
  }

  toggleSound() {
    this.isEnabled = !this.isEnabled;
    localStorage.setItem('soundEnabled', JSON.stringify(this.isEnabled));
    return this.isEnabled;
  }

  // Add Ferengi voice quotes
  speakFerengiQuote(quoteType = 'profit') {
    if (!this.isEnabled) return;

    const quotes = {
      profit: ['Profit!', 'Gold-pressed latinum!', 'The sweet sound of profit!'],
      wisdom: ['Listen to the Rules!', 'Wisdom of the ages!', 'The Grand Nagus approves!'],
      error: ['Unprofitable!', 'Bad for business!', 'The Nagus would not approve!'],
      achievement: ['Extraordinary profit!', 'You honor the Rules!', 'The Great River flows through you!']
    };

    const quoteList = quotes[quoteType] || quotes.profit;
    const quote = quoteList[Math.floor(Math.random() * quoteList.length)];

    // Create a simple text-to-speech effect
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(quote);
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      utterance.volume = this.masterVolume;
      speechSynthesis.speak(utterance);
    }
  }

  // Initialize event listeners for the existing sound toggle
  bindToExistingToggle() {
    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle) {
      soundToggle.addEventListener('click', () => {
        const enabled = this.toggleSound();
        this.playSound(enabled ? 'success' : 'click');
      });
    }
  }
}

// Initialize the sound system
const ferengiSounds = new FerengiSoundSystem();

// Bind to existing theme manager's sound toggle
document.addEventListener('DOMContentLoaded', () => {
  ferengiSounds.bindToExistingToggle();

  // Add sound effects to existing buttons
  document.addEventListener('click', (e) => {
    if (e.target.matches('button, .btn, .game-btn, .action-btn')) {
      ferengiSounds.playSound('click');
    }

    if (e.target.id === 'random-button') {
      ferengiSounds.playSound('ruleReveal');
      setTimeout(() => ferengiSounds.playSound('profit'), 800);
    }

    if (e.target.classList.contains('game-btn')) {
      ferengiSounds.playSound('gameStart');
    }

    if (e.target.id === 'favorite-btn') {
      ferengiSounds.playSound('latinum');
    }
  });

  // Add whoosh sound to rule transitions
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.target.id === 'result-panel' && mutation.type === 'childList') {
        ferengiSounds.playSound('whoosh');
      }
    });
  });

  const resultPanel = document.getElementById('result-panel');
  if (resultPanel) {
    observer.observe(resultPanel, { childList: true, subtree: true });
  }
});