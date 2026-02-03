// Enhanced Animations for Ferengi Rule Oracle

class AnimationController {
  constructor() {
    this.observers = [];
  }

  // Typewriter effect for text (O(n) - builds with local string)
  async typewriterEffect(element, text, speed = 50) {
    element.textContent = '';
    element.classList.add('typewriter');

    let built = '';
    for (let i = 0; i < text.length; i++) {
      built += text[i];
      element.textContent = built;
      await this.delay(speed);
    }

    element.classList.remove('typewriter');
  }

  // 3D flip animation for rule cards
  flipCard(card) {
    card.style.transform = 'rotateY(180deg) scale(0.9)';
    card.style.opacity = '0';

    setTimeout(() => {
      card.style.transition = 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.6s ease';
      card.style.transform = 'rotateY(0deg) scale(1)';
      card.style.opacity = '1';
    }, 100);
  }

  // Enhanced rule reveal with multiple effects
  async revealRule(ruleCard, ruleText, ruleNumber) {
    const numberElement = ruleCard.querySelector('.rule-number');
    const textElement = ruleCard.querySelector('.rule-text');

    // Add enhanced animation class
    ruleCard.classList.add('rule-card-enhanced');

    // Animate number first
    await this.typewriterEffect(numberElement, `Rule of Acquisition #${ruleNumber}`);

    // Small delay
    await this.delay(300);

    // Animate text
    await this.typewriterEffect(textElement, ruleText, 30);

    // Trigger confetti
    const rect = ruleCard.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    window.createConfetti(centerX, centerY);
  }

  // Button press animation
  buttonPress(button) {
    button.classList.add('btn-enhanced');
    // Animation is handled by CSS
  }

  // Glow effect for hover
  addGlowEffect(element) {
    element.classList.add('glow-hover');
  }

  // Loading spinner
  showSpinner(button) {
    const originalText = button.textContent;
    button.innerHTML = '<div class="spinner"></div> Loading...';
    button.disabled = true;

    return () => {
      button.innerHTML = originalText;
      button.disabled = false;
    };
  }

  // Utility delay function
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Initialize dynamic background
  initDynamicBackground() {
    const starfield = document.querySelector('.starfield');

    // Create stars
    for (let i = 0; i < 100; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.width = Math.random() * 3 + 1 + 'px';
      star.style.height = star.style.width;
      star.style.animationDelay = Math.random() * 3 + 's';
      starfield.appendChild(star);
    }

    // Occasional ship flyby
    this.shipFlybyInterval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance every 30 seconds
        const ship = document.createElement('div');
        ship.className = 'ship-flyby';
        ship.style.top = Math.random() * 60 + 10 + '%';
        starfield.appendChild(ship);

        setTimeout(() => {
          if (ship.parentNode) {
            ship.parentNode.removeChild(ship);
          }
        }, 15000);
      }
    }, 30000);
  }
}

// Initialize animation controller
const animationController = new AnimationController();

// Export for global use
window.animationController = animationController;

// Cleanup on page unload to prevent memory leaks
window.addEventListener('beforeunload', () => {
  if (animationController && animationController.shipFlybyInterval) {
    clearInterval(animationController.shipFlybyInterval);
  }
});