// Enhanced Visual Effects and Animations
class FerengiVisualEffects {
  constructor() {
    this.particleSystem = null;
    this.hologramActive = false;
    this.init();
  }

  init() {
    this.createHolographicEffects();
    this.enhanceRuleReveals();
    this.addParticleSystem();
    this.create3DLatinumCoins();
    this.addNebulaDynamicBackground();
    this.enhanceButtonEffects();
    this.addTextGlitchEffects();
  }

  createHolographicEffects() {
    const style = document.createElement('style');
    style.id = 'holographic-effects';
    style.textContent = `
      .holographic {
        background: linear-gradient(45deg,
          transparent 30%,
          rgba(249, 217, 108, 0.1) 50%,
          transparent 70%);
        background-size: 200% 200%;
        animation: hologramScan 3s ease-in-out infinite;
        position: relative;
        overflow: hidden;
      }

      .holographic::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg,
          transparent,
          rgba(249, 217, 108, 0.3),
          transparent);
        animation: hologramSweep 2s ease-in-out infinite;
      }

      .holographic::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(249, 217, 108, 0.03) 2px,
          rgba(249, 217, 108, 0.03) 4px
        );
        pointer-events: none;
      }

      @keyframes hologramScan {
        0%, 100% { background-position: 0% 0%; }
        50% { background-position: 100% 100%; }
      }

      @keyframes hologramSweep {
        0% { left: -100%; }
        100% { left: 100%; }
      }

      .rule-card.enhanced-reveal {
        transform-style: preserve-3d;
        perspective: 1000px;
        animation: ruleRevealEnhanced 2s ease-out forwards;
      }

      @keyframes ruleRevealEnhanced {
        0% {
          opacity: 0;
          transform: rotateY(-90deg) scale(0.3);
          filter: blur(10px);
        }
        50% {
          opacity: 0.7;
          transform: rotateY(0deg) scale(1.1);
          filter: blur(2px);
        }
        100% {
          opacity: 1;
          transform: rotateY(0deg) scale(1);
          filter: blur(0);
        }
      }

      .latinum-coin-3d {
        width: 40px;
        height: 40px;
        background: radial-gradient(circle, #ffd700, #ffed4e, #ff8c00);
        border-radius: 50%;
        position: relative;
        display: inline-block;
        animation: coin3DRotate 3s ease-in-out infinite;
        box-shadow:
          0 0 10px rgba(255, 215, 0, 0.5),
          inset 0 0 10px rgba(255, 140, 0, 0.3);
      }

      .latinum-coin-3d::before {
        content: '₪';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 1.5rem;
        color: #8b4513;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
      }

      @keyframes coin3DRotate {
        0% { transform: rotateY(0deg); }
        25% { transform: rotateY(90deg) scale(1.1); }
        50% { transform: rotateY(180deg); }
        75% { transform: rotateY(270deg) scale(1.1); }
        100% { transform: rotateY(360deg); }
      }

      .nebula-background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: -2;
        opacity: 0.3;
        background:
          radial-gradient(ellipse at 20% 50%, #ff8a3d 0%, transparent 50%),
          radial-gradient(ellipse at 80% 20%, #5a2a2a 0%, transparent 50%),
          radial-gradient(ellipse at 40% 80%, #f9d96c 0%, transparent 50%);
        animation: nebulaFlow 20s ease-in-out infinite;
      }

      @keyframes nebulaFlow {
        0%, 100% {
          background:
            radial-gradient(ellipse at 20% 50%, #ff8a3d 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, #5a2a2a 0%, transparent 50%),
            radial-gradient(ellipse at 40% 80%, #f9d96c 0%, transparent 50%);
        }
        33% {
          background:
            radial-gradient(ellipse at 60% 30%, #ff8a3d 0%, transparent 50%),
            radial-gradient(ellipse at 10% 70%, #5a2a2a 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, #f9d96c 0%, transparent 50%);
        }
        66% {
          background:
            radial-gradient(ellipse at 80% 80%, #ff8a3d 0%, transparent 50%),
            radial-gradient(ellipse at 30% 10%, #5a2a2a 0%, transparent 50%),
            radial-gradient(ellipse at 10% 60%, #f9d96c 0%, transparent 50%);
        }
      }

      .enhanced-button {
        position: relative;
        overflow: hidden;
        transition: all 0.3s ease;
      }

      .enhanced-button::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: radial-gradient(circle, rgba(249, 217, 108, 0.3), transparent);
        transition: all 0.5s ease;
        transform: translate(-50%, -50%);
      }

      .enhanced-button:hover::before {
        width: 300px;
        height: 300px;
      }

      .enhanced-button:active {
        transform: scale(0.95);
      }

      .glitch-text {
        position: relative;
        animation: textGlitch 0.1s ease-in-out infinite alternate;
      }

      .glitch-text::before,
      .glitch-text::after {
        content: attr(data-text);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      .glitch-text::before {
        animation: glitchBefore 0.15s ease-in-out infinite alternate;
        color: #ff0000;
        z-index: -1;
      }

      .glitch-text::after {
        animation: glitchAfter 0.1s ease-in-out infinite alternate;
        color: #00ffff;
        z-index: -2;
      }

      @keyframes textGlitch {
        0% { transform: translate(0); }
        20% { transform: translate(-1px, 1px); }
        40% { transform: translate(-1px, -1px); }
        60% { transform: translate(1px, 1px); }
        80% { transform: translate(1px, -1px); }
        100% { transform: translate(0); }
      }

      @keyframes glitchBefore {
        0% { clip-path: inset(40% 0 61% 0); }
        20% { clip-path: inset(92% 0 1% 0); }
        40% { clip-path: inset(43% 0 1% 0); }
        60% { clip-path: inset(25% 0 58% 0); }
        80% { clip-path: inset(54% 0 7% 0); }
        100% { clip-path: inset(58% 0 43% 0); }
      }

      @keyframes glitchAfter {
        0% { clip-path: inset(25% 0 58% 0); }
        20% { clip-path: inset(54% 0 7% 0); }
        40% { clip-path: inset(58% 0 43% 0); }
        60% { clip-path: inset(40% 0 61% 0); }
        80% { clip-path: inset(92% 0 1% 0); }
        100% { clip-path: inset(43% 0 1% 0); }
      }

      .warp-effect {
        animation: warpDistortion 1s ease-out;
      }

      @keyframes warpDistortion {
        0% { transform: scale(1) skew(0deg); }
        25% { transform: scale(1.1) skew(2deg); }
        50% { transform: scale(0.9) skew(-2deg); }
        75% { transform: scale(1.05) skew(1deg); }
        100% { transform: scale(1) skew(0deg); }
      }

      .energy-pulse {
        position: relative;
      }

      .energy-pulse::before {
        content: '';
        position: absolute;
        top: -5px;
        left: -5px;
        right: -5px;
        bottom: -5px;
        background: linear-gradient(45deg, #f9d96c, #ff8a3d, #f9d96c);
        z-index: -1;
        filter: blur(10px);
        animation: energyPulse 2s ease-in-out infinite;
      }

      @keyframes energyPulse {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 0.8; transform: scale(1.1); }
      }

      .matrix-rain {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: -1;
        opacity: 0.1;
      }

      .matrix-char {
        position: absolute;
        color: #f9d96c;
        font-family: monospace;
        font-size: 14px;
        animation: matrixFall linear infinite;
      }

      @keyframes matrixFall {
        0% {
          transform: translateY(-100vh);
          opacity: 1;
        }
        100% {
          transform: translateY(100vh);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  enhanceRuleReveals() {
    // Enhanced rule reveal animation
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target.classList && mutation.target.classList.contains('rule-card')) {
          this.applyEnhancedReveal(mutation.target);
        }
      });
    });

    const resultPanel = document.getElementById('result-panel');
    if (resultPanel) {
      observer.observe(resultPanel, { childList: true, subtree: true });
    }
  }

  applyEnhancedReveal(ruleCard) {
    // Add holographic effect
    ruleCard.classList.add('holographic', 'enhanced-reveal');

    // Add particle burst effect
    this.createParticleBurst(ruleCard);

    // Add energy pulse to rule number
    const ruleNumber = ruleCard.querySelector('.rule-number');
    if (ruleNumber) {
      ruleNumber.classList.add('energy-pulse');
    }

    // Add glitch effect to rule text occasionally
    const ruleText = ruleCard.querySelector('.rule-text');
    if (ruleText && Math.random() < 0.1) {
      ruleText.classList.add('glitch-text');
      ruleText.setAttribute('data-text', ruleText.textContent);

      setTimeout(() => {
        ruleText.classList.remove('glitch-text');
      }, 2000);
    }
  }

  addParticleSystem() {
    // Reuse existing particle canvas if it exists (from particles.js)
    let canvas = document.getElementById('particle-canvas');
    if (canvas) {
      // Canvas already exists from particles.js, skip creating duplicate
      return;
    }

    // Create particle canvas only if one doesn't already exist
    canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: -1;
      opacity: 0.6;
    `;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 50;

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(this.createParticle(canvas));
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        this.updateParticle(particle, canvas);
        this.drawParticle(ctx, particle);

        if (particle.life <= 0) {
          particles[index] = this.createParticle(canvas);
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    // Resize handler
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }

  createParticle(canvas) {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
      life: Math.random() * 100 + 50,
      maxLife: 100,
      color: ['#f9d96c', '#ff8a3d', '#5a2a2a'][Math.floor(Math.random() * 3)],
      twinkle: Math.random() * Math.PI * 2
    };
  }

  updateParticle(particle, canvas) {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.life -= 0.5;
    particle.twinkle += 0.1;

    // Wrap around screen
    if (particle.x < 0) particle.x = canvas.width;
    if (particle.x > canvas.width) particle.x = 0;
    if (particle.y < 0) particle.y = canvas.height;
    if (particle.y > canvas.height) particle.y = 0;
  }

  drawParticle(ctx, particle) {
    const alpha = particle.life / particle.maxLife;
    const twinkleAlpha = (Math.sin(particle.twinkle) + 1) / 2;

    ctx.save();
    ctx.globalAlpha = alpha * twinkleAlpha * 0.8;
    ctx.fillStyle = particle.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = particle.color;

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  createParticleBurst(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Create temporary burst particles
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: #f9d96c;
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        left: ${centerX}px;
        top: ${centerY}px;
      `;

      document.body.appendChild(particle);

      const angle = (i / 20) * Math.PI * 2;
      const velocity = 100 + Math.random() * 50;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;

      particle.animate([
        {
          transform: 'translate(0, 0) scale(1)',
          opacity: 1
        },
        {
          transform: `translate(${vx}px, ${vy}px) scale(0)`,
          opacity: 0
        }
      ], {
        duration: 1000,
        easing: 'ease-out'
      }).onfinish = () => particle.remove();
    }
  }

  create3DLatinumCoins() {
    // Add 3D rotating latinum coins to various elements
    document.addEventListener('click', (e) => {
      if (e.target.matches('#random-button, .game-btn, #favorite-btn')) {
        this.spawn3DCoin(e.target);
      }
    });
  }

  spawn3DCoin(element) {
    const coin = document.createElement('div');
    coin.className = 'latinum-coin-3d';
    coin.style.cssText += `
      position: absolute;
      top: -20px;
      right: -20px;
      z-index: 1000;
    `;

    element.style.position = 'relative';
    element.appendChild(coin);

    setTimeout(() => {
      coin.remove();
    }, 3000);
  }

  addNebulaDynamicBackground() {
    if (!document.querySelector('.nebula-background')) {
      const nebula = document.createElement('div');
      nebula.className = 'nebula-background';
      document.body.appendChild(nebula);
    }
  }

  enhanceButtonEffects() {
    // Add enhanced effects to all buttons
    document.addEventListener('mouseover', (e) => {
      if (e.target.matches('button, .btn, .game-btn, .action-btn')) {
        e.target.classList.add('enhanced-button');
      }
    });

    // Add warp effect on certain interactions
    document.addEventListener('click', (e) => {
      if (e.target.matches('#random-button')) {
        document.body.classList.add('warp-effect');
        setTimeout(() => {
          document.body.classList.remove('warp-effect');
        }, 1000);
      }
    });
  }

  addTextGlitchEffects() {
    // Randomly add glitch effects to text
    this.glitchInterval = setInterval(() => {
      const textElements = document.querySelectorAll('.rule-text, h1, h2');
      if (textElements.length === 0) return;
      const randomElement = textElements[Math.floor(Math.random() * textElements.length)];

      if (randomElement && Math.random() < 0.05) { // 5% chance
        randomElement.classList.add('glitch-text');
        randomElement.setAttribute('data-text', randomElement.textContent);

        setTimeout(() => {
          randomElement.classList.remove('glitch-text');
        }, 200);
      }
    }, 5000);
  }

  createMatrixRain() {
    const matrixContainer = document.createElement('div');
    matrixContainer.className = 'matrix-rain';
    document.body.appendChild(matrixContainer);

    const characters = '₪¤£¥€$₹₽₩₪01234567890ABCDEF';

    for (let i = 0; i < 20; i++) {
      const char = document.createElement('div');
      char.className = 'matrix-char';
      char.textContent = characters[Math.floor(Math.random() * characters.length)];
      char.style.left = Math.random() * 100 + 'vw';
      char.style.animationDuration = (Math.random() * 3 + 2) + 's';
      char.style.animationDelay = Math.random() * 2 + 's';

      matrixContainer.appendChild(char);

      // Remove and recreate after animation
      setTimeout(() => {
        char.remove();
        // Create new character
        const newChar = document.createElement('div');
        newChar.className = 'matrix-char';
        newChar.textContent = characters[Math.floor(Math.random() * characters.length)];
        newChar.style.left = Math.random() * 100 + 'vw';
        newChar.style.animationDuration = (Math.random() * 3 + 2) + 's';
        matrixContainer.appendChild(newChar);
      }, parseFloat(char.style.animationDuration) * 1000);
    }
  }

  // Public methods for triggering special effects
  triggerHologramMode() {
    document.body.classList.add('holographic');
    setTimeout(() => {
      document.body.classList.remove('holographic');
    }, 10000);
  }

  triggerMatrixMode() {
    this.createMatrixRain();
  }

  triggerEnergyPulse(element) {
    element.classList.add('energy-pulse');
    setTimeout(() => {
      element.classList.remove('energy-pulse');
    }, 5000);
  }
}

// Initialize enhanced visuals
const visualEffects = new FerengiVisualEffects();

// Make it globally accessible
window.visualEffects = visualEffects;

// Bind to theme changes for extra effects
document.addEventListener('DOMContentLoaded', () => {
  const themeSelect = document.getElementById('theme-select');
  if (themeSelect) {
    themeSelect.addEventListener('change', () => {
      visualEffects.triggerHologramMode();
      if (window.achievementSystem) {
        achievementSystem.triggerThemeUsed();
      }
    });
  }
});