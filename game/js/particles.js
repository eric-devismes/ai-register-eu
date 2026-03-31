// ============================================================
// NEO-DUAT — Particle System
// ============================================================

ND.particles = (function() {
  const ctx = ND.ctx;
  let pool = [];
  const MAX = 300;

  function emit(config) {
    const count = config.count || 10;
    for (let i = 0; i < count; i++) {
      if (pool.length >= MAX) pool.shift();
      pool.push({
        x: config.x + ND.rand(-config.spread || 0, config.spread || 0),
        y: config.y + ND.rand(-config.spread || 0, config.spread || 0),
        vx: ND.rand(config.vxMin || -3, config.vxMax || 3),
        vy: ND.rand(config.vyMin || -5, config.vyMax || -1),
        size: ND.rand(config.sizeMin || 2, config.sizeMax || 6),
        color: config.color || '#ffd700',
        life: 1,
        decay: ND.rand(config.decayMin || 0.01, config.decayMax || 0.03),
        gravity: config.gravity || 0.1,
        type: config.type || 'square', // square, circle, glyph
        glyph: config.type === 'glyph' ? ND.randomHieroglyph() : null,
        rotation: ND.rand(0, Math.PI * 2),
        rotSpeed: ND.rand(-0.1, 0.1)
      });
    }
  }

  // --- Preset emitters ---
  function hitSpark(x, y, color) {
    emit({
      x, y, count: 15, spread: 5,
      vxMin: -6, vxMax: 6, vyMin: -6, vyMax: 2,
      sizeMin: 2, sizeMax: 5, color,
      decayMin: 0.02, decayMax: 0.05, gravity: 0.15
    });
  }

  function blockSpark(x, y) {
    emit({
      x, y, count: 8, spread: 3,
      vxMin: -4, vxMax: 4, vyMin: -3, vyMax: 1,
      sizeMin: 1, sizeMax: 3, color: '#48dbfb',
      decayMin: 0.03, decayMax: 0.06, gravity: 0.05
    });
  }

  function specialBurst(x, y, color) {
    emit({
      x, y, count: 30, spread: 10,
      vxMin: -8, vxMax: 8, vyMin: -8, vyMax: 4,
      sizeMin: 3, sizeMax: 8, color,
      decayMin: 0.01, decayMax: 0.03, gravity: 0.05
    });
    // Glyph particles
    emit({
      x, y, count: 6, spread: 20,
      vxMin: -2, vxMax: 2, vyMin: -4, vyMax: -1,
      sizeMin: 16, sizeMax: 28, color: '#ffd700',
      decayMin: 0.008, decayMax: 0.02, gravity: -0.02,
      type: 'glyph'
    });
  }

  function koBurst(x, y) {
    emit({
      x, y, count: 50, spread: 20,
      vxMin: -12, vxMax: 12, vyMin: -12, vyMax: 4,
      sizeMin: 3, sizeMax: 10, color: '#ff6b6b',
      decayMin: 0.005, decayMax: 0.02, gravity: 0.08
    });
    emit({
      x, y, count: 40, spread: 15,
      vxMin: -8, vxMax: 8, vyMin: -10, vyMax: 2,
      sizeMin: 2, sizeMax: 6, color: '#ffd700',
      decayMin: 0.008, decayMax: 0.025, gravity: 0.1
    });
    emit({
      x, y, count: 10, spread: 30,
      vxMin: -3, vxMax: 3, vyMin: -5, vyMax: -1,
      sizeMin: 20, sizeMax: 36, color: '#ffd700',
      decayMin: 0.005, decayMax: 0.015, gravity: -0.03,
      type: 'glyph'
    });
  }

  function update() {
    for (let i = pool.length - 1; i >= 0; i--) {
      const p = pool[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.life -= p.decay;
      p.rotation += p.rotSpeed;

      if (p.life <= 0) {
        pool.splice(i, 1);
      }
    }
  }

  function draw() {
    pool.forEach(p => {
      ctx.globalAlpha = p.life;

      if (p.type === 'glyph') {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.font = `${p.size}px serif`;
        ctx.fillStyle = p.color;
        ctx.textAlign = 'center';
        ctx.fillText(p.glyph, 0, 0);
        ctx.restore();
      } else if (p.type === 'circle') {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      } else {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });
    ctx.globalAlpha = 1;
  }

  function clear() {
    pool = [];
  }

  return { emit, hitSpark, blockSpark, specialBurst, koBurst, update, draw, clear };
})();
