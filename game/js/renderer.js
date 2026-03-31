// ============================================================
// NEO-DUAT — Renderer (Neo-Egyptian Cyberpunk Aesthetic)
// ============================================================

ND.renderer = (function() {
  const ctx = ND.ctx;

  // Background elements
  let pyramidPoints = [];
  let gridLines = [];
  let bgHieroglyphs = [];

  function initBackground() {
    // Floating hieroglyphs
    bgHieroglyphs = [];
    for (let i = 0; i < 20; i++) {
      bgHieroglyphs.push({
        char: ND.randomHieroglyph(),
        x: ND.rand(0, ND.W),
        y: ND.rand(0, ND.H),
        speed: ND.rand(0.2, 0.8),
        size: ND.rand(14, 28),
        opacity: ND.rand(0.05, 0.15),
        phase: ND.rand(0, Math.PI * 2)
      });
    }
  }

  function drawBackground(state) {
    const W = ND.W, H = ND.H;

    // Deep space gradient
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#050510');
    grad.addColorStop(0.4, '#0a0a2e');
    grad.addColorStop(0.7, '#120828');
    grad.addColorStop(1, '#0d0d1a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Perspective grid floor
    drawGrid(W, H);

    // Central pyramid silhouette
    drawPyramid(W, H);

    // Floating hieroglyphs
    drawFloatingGlyphs();

    // Scanline effect
    drawScanlines(W, H);

    // Vignette
    drawVignette(W, H);
  }

  function drawGrid(W, H) {
    const groundY = ND.groundY;
    const horizon = H * 0.35;
    const vanishX = W / 2;

    ctx.strokeStyle = ND.rgba(72, 219, 251, 0.08);
    ctx.lineWidth = 1;

    // Horizontal lines
    for (let i = 0; i < 15; i++) {
      const t = i / 14;
      const y = horizon + (groundY - horizon) * Math.pow(t, 1.5);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    // Vertical perspective lines
    for (let i = -8; i <= 8; i++) {
      const x = vanishX + i * 80;
      ctx.beginPath();
      ctx.moveTo(vanishX, horizon);
      ctx.lineTo(x + (x - vanishX) * 2, groundY + 50);
      ctx.stroke();
    }
  }

  function drawPyramid(W, H) {
    const cx = W / 2;
    const baseY = H * 0.55;
    const topY = H * 0.15;
    const baseW = W * 0.35;

    ctx.beginPath();
    ctx.moveTo(cx, topY);
    ctx.lineTo(cx - baseW / 2, baseY);
    ctx.lineTo(cx + baseW / 2, baseY);
    ctx.closePath();

    const grad = ctx.createLinearGradient(cx, topY, cx, baseY);
    grad.addColorStop(0, ND.rgba(255, 215, 0, 0.06));
    grad.addColorStop(1, ND.rgba(255, 215, 0, 0.01));
    ctx.fillStyle = grad;
    ctx.fill();

    // Pyramid edge glow
    ctx.strokeStyle = ND.rgba(255, 215, 0, 0.12);
    ctx.lineWidth = 1;
    ctx.stroke();

    // Eye of Providence at top (pulsing)
    const pulse = 0.5 + Math.sin(ND.time * 2) * 0.3;
    ctx.beginPath();
    ctx.arc(cx, topY + 30, 8, 0, Math.PI * 2);
    ctx.fillStyle = ND.rgba(255, 215, 0, pulse * 0.3);
    ctx.fill();

    // Glow
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 20 * pulse;
    ctx.beginPath();
    ctx.arc(cx, topY + 30, 3, 0, Math.PI * 2);
    ctx.fillStyle = ND.rgba(255, 215, 0, pulse);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  function drawFloatingGlyphs() {
    bgHieroglyphs.forEach(g => {
      g.y -= g.speed;
      if (g.y < -30) {
        g.y = ND.H + 30;
        g.x = ND.rand(0, ND.W);
        g.char = ND.randomHieroglyph();
      }

      const wobble = Math.sin(ND.time * 1.5 + g.phase) * 10;
      ctx.font = `${g.size}px serif`;
      ctx.fillStyle = ND.rgba(255, 215, 0, g.opacity + Math.sin(ND.time + g.phase) * 0.03);
      ctx.fillText(g.char, g.x + wobble, g.y);
    });
  }

  function drawScanlines(W, H) {
    ctx.fillStyle = ND.rgba(0, 0, 0, 0.03);
    for (let y = 0; y < H; y += 3) {
      ctx.fillRect(0, y, W, 1);
    }
  }

  function drawVignette(W, H) {
    const grad = ctx.createRadialGradient(W / 2, H / 2, W * 0.3, W / 2, H / 2, W * 0.8);
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(1, ND.rgba(0, 0, 0, 0.6));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }

  // --- Stage/arena drawing ---
  function drawArena() {
    const W = ND.W, H = ND.H;
    const groundY = ND.groundY;

    // Ground line
    ctx.strokeStyle = ND.rgba(72, 219, 251, 0.3);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(W, groundY);
    ctx.stroke();

    // Ground glow
    const glow = ctx.createLinearGradient(0, groundY, 0, groundY + 30);
    glow.addColorStop(0, ND.rgba(72, 219, 251, 0.1));
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, groundY, W, 30);

    // Pillar decorations left & right
    drawPillar(W * 0.05, groundY);
    drawPillar(W * 0.95, groundY);
  }

  function drawPillar(x, groundY) {
    const h = 180;
    ctx.strokeStyle = ND.rgba(255, 215, 0, 0.15);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, groundY);
    ctx.lineTo(x, groundY - h);
    ctx.stroke();

    // Glyph on pillar
    ctx.font = '18px serif';
    ctx.fillStyle = ND.rgba(255, 215, 0, 0.2 + Math.sin(ND.time * 2) * 0.1);
    ctx.textAlign = 'center';
    ctx.fillText(ND.hieroglyphs[Math.floor(ND.time) % ND.hieroglyphs.length], x, groundY - h / 2);
    ctx.textAlign = 'left';
  }

  // --- Health bars ---
  function drawHealthBar(x, y, w, h, hp, maxHp, color, name, flipped) {
    const ratio = hp / maxHp;

    // Background
    ctx.fillStyle = ND.rgba(20, 20, 40, 0.8);
    ctx.fillRect(x, y, w, h);

    // Health fill
    const barX = flipped ? x + w * (1 - ratio) : x;
    const barW = w * ratio;

    const grad = ctx.createLinearGradient(barX, y, barX + barW, y);
    const c = ND.hexToRgb(color);
    grad.addColorStop(0, ND.rgba(c.r, c.g, c.b, 0.9));
    grad.addColorStop(1, ND.rgba(c.r, c.g, c.b, 0.6));
    ctx.fillStyle = grad;
    ctx.fillRect(barX, y, barW, h);

    // Glow when low
    if (ratio < 0.3) {
      ctx.shadowColor = '#ff0000';
      ctx.shadowBlur = 10 + Math.sin(ND.time * 8) * 5;
      ctx.fillStyle = ND.rgba(255, 0, 0, 0.3);
      ctx.fillRect(barX, y, barW, h);
      ctx.shadowBlur = 0;
    }

    // Border
    ctx.strokeStyle = ND.rgba(255, 255, 255, 0.2);
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);

    // Name
    ctx.font = '600 14px Rajdhani, sans-serif';
    ctx.fillStyle = ND.rgba(255, 255, 255, 0.8);
    ctx.textAlign = flipped ? 'right' : 'left';
    ctx.fillText(name.toUpperCase(), flipped ? x + w : x, y - 6);
    ctx.textAlign = 'left';
  }

  // --- Special meter ---
  function drawSpecialMeter(x, y, w, h, value, maxValue, color) {
    const ratio = value / maxValue;

    ctx.fillStyle = ND.rgba(20, 20, 40, 0.6);
    ctx.fillRect(x, y, w, h);

    const c = ND.hexToRgb(color);
    ctx.fillStyle = ND.rgba(c.r, c.g, c.b, 0.7);
    ctx.fillRect(x, y, w * ratio, h);

    if (ratio >= 1) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 8 + Math.sin(ND.time * 6) * 4;
      ctx.fillStyle = ND.rgba(c.r, c.g, c.b, 0.9);
      ctx.fillRect(x, y, w, h);
      ctx.shadowBlur = 0;
    }

    ctx.strokeStyle = ND.rgba(255, 255, 255, 0.15);
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);
  }

  // --- Combo counter ---
  function drawCombo(x, y, count) {
    if (count < 2) return;
    ctx.font = `900 ${24 + count * 2}px Orbitron, sans-serif`;
    ctx.textAlign = 'center';

    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#ffd700';
    ctx.fillText(`${count}x`, x, y);
    ctx.shadowBlur = 0;

    ctx.font = '600 12px Rajdhani, sans-serif';
    ctx.fillStyle = ND.rgba(255, 215, 0, 0.7);
    ctx.fillText('COMBO', x, y + 18);
    ctx.textAlign = 'left';
  }

  // --- Round indicator ---
  function drawRound(round, maxRounds) {
    ctx.font = '700 16px Orbitron, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = ND.rgba(255, 255, 255, 0.4);
    ctx.fillText(`ROUND ${round}/${maxRounds}`, ND.centerX, 30);
    ctx.textAlign = 'left';
  }

  // --- Timer ---
  function drawTimer(seconds) {
    ctx.font = '900 28px Orbitron, sans-serif';
    ctx.textAlign = 'center';
    const color = seconds <= 10 ? '#ff6b6b' : '#ffffff';
    ctx.fillStyle = color;
    if (seconds <= 10) {
      ctx.shadowColor = '#ff0000';
      ctx.shadowBlur = 10;
    }
    ctx.fillText(Math.ceil(seconds), ND.centerX, 62);
    ctx.shadowBlur = 0;
    ctx.textAlign = 'left';
  }

  return {
    initBackground,
    drawBackground,
    drawArena,
    drawHealthBar,
    drawSpecialMeter,
    drawCombo,
    drawRound,
    drawTimer
  };
})();
