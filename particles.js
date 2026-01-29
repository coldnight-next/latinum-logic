// Particle Effects System for Ferengi Rule Oracle

class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById('particle-canvas');
    if (!this.canvas) {
      console.warn('Particle canvas not found');
      return;
    }
    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) {
      console.warn('Could not get 2D context for particle canvas');
      return;
    }
    this.particles = [];
    this.animating = false;
    this.resizeCanvas();

    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createConfetti(x, y, count = 50) {
    for (let i = 0; i < count; i++) {
      this.particles.push(new ConfettiParticle(x, y));
    }
    this.startAnimating();
  }

  createSparkles(x, y, count = 20) {
    for (let i = 0; i < count; i++) {
      this.particles.push(new SparkleParticle(x, y));
    }
    this.startAnimating();
  }

  startAnimating() {
    if (this.animating) return;
    this.animating = true;
    this.animate();
  }

  animate() {
    if (!this.ctx || !this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles = this.particles.filter(particle => {
      particle.update();
      particle.draw(this.ctx);
      return particle.isAlive();
    });

    if (this.particles.length > 0) {
      requestAnimationFrame(() => this.animate());
    } else {
      this.animating = false;
    }
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 10;
    this.vy = (Math.random() - 0.5) * 10;
    this.life = 1;
    this.maxLife = 60; // 1 second at 60fps
    this.size = Math.random() * 5 + 2;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.1; // gravity
    this.life--;
  }

  isAlive() {
    return this.life > 0;
  }
}

class ConfettiParticle extends Particle {
  constructor(x, y) {
    super(x, y);
    this.color = ['#f9d96c', '#ff8a3d', '#ffe795', '#ff4757'][Math.floor(Math.random() * 4)];
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.2;
  }

  update() {
    super.update();
    this.rotation += this.rotationSpeed;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.life / this.maxLife;
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    ctx.restore();
  }
}

class SparkleParticle extends Particle {
  constructor(x, y) {
    super(x, y);
    this.color = '#f9d96c';
    this.maxLife = 30;
    this.vx = (Math.random() - 0.5) * 4;
    this.vy = (Math.random() - 0.5) * 4 - 2; // upward bias
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.life / this.maxLife;
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 10;

    // Draw star shape
    ctx.beginPath();
    const spikes = 5;
    const outerRadius = this.size;
    const innerRadius = this.size * 0.5;

    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / spikes;
      const x = this.x + Math.cos(angle) * radius;
      const y = this.y + Math.sin(angle) * radius;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

// Initialize particle system
const particleSystem = new ParticleSystem();

// Export functions for use in main script (with null guards)
window.createConfetti = (x, y) => particleSystem && particleSystem.ctx && particleSystem.createConfetti(x, y);
window.createSparkles = (x, y) => particleSystem && particleSystem.ctx && particleSystem.createSparkles(x, y);