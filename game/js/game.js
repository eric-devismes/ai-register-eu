// ============================================================
// NEO-DUAT — Main Game Loop
// ============================================================

(function() {
  'use strict';

  // --- Initialize systems ---
  ND.renderer.initBackground();
  ND.secretSystem.init();
  ND.secretSystem.plantDataminerBait();

  // --- Main game loop ---
  let lastTime = performance.now();

  function gameLoop(timestamp) {
    const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
    lastTime = timestamp;
    ND.time += dt;
    ND.dt = dt;
    ND.frameCount++;

    // Track total play time (for secrets)
    ND.totalPlayTime += dt;
    if (ND.frameCount % 300 === 0) {
      ND.save('playTime', Math.floor(ND.totalPlayTime));
    }

    const ctx = ND.ctx;

    // --- UPDATE ---
    ND.secretSystem.update(ND.state);

    if (ND.state === 'fight') {
      ND.combat.update();

      // Check for round end / match end transitions
      if (!ND.combat.isRoundActive() && ND.combat.getRoundResult()) {
        if (ND.combat.isMatchOver()) {
          if (!ND._matchEndShown) {
            ND._matchEndShown = true;
            ND.uiSystem.showMatchEnd(ND.combat.getRoundResult());
          }
        } else {
          // Auto-advance to next round
          if (!ND._roundTransition) {
            ND._roundTransition = true;
            setTimeout(() => {
              if (ND.combat.nextRound()) {
                ND.uiSystem.showRoundAnnounce(ND.combat.getRoundNum(), () => {
                  ND.uiSystem.showTouchControls();
                });
              }
              ND._roundTransition = false;
            }, 2000);
          }
        }
      } else {
        ND._matchEndShown = false;
        ND._roundTransition = false;
      }
    }

    // --- DRAW ---
    ctx.clearRect(0, 0, ND.W, ND.H);
    ND.renderer.drawBackground(ND.state);

    if (ND.state === 'fight') {
      ND.combat.draw();
    }

    requestAnimationFrame(gameLoop);
  }

  // --- Handle round transition clicks ---
  ND.canvas.addEventListener('click', () => {
    if (ND.state === 'fight' && !ND.combat.isRoundActive() && !ND.combat.isMatchOver() && !ND._roundTransition) {
      ND._roundTransition = true;
      if (ND.combat.nextRound()) {
        ND.uiSystem.showRoundAnnounce(ND.combat.getRoundNum(), () => {
          ND.uiSystem.showTouchControls();
        });
      }
      setTimeout(() => { ND._roundTransition = false; }, 500);
    }
  });

  // --- Boot sequence ---
  function boot() {
    // Quick boot animation
    const ctx = ND.ctx;
    let bootFrame = 0;

    function bootAnim() {
      bootFrame++;
      ctx.clearRect(0, 0, ND.W, ND.H);
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, ND.W, ND.H);

      const progress = bootFrame / 60;

      // Glitch text
      if (bootFrame < 30) {
        ctx.font = '12px monospace';
        ctx.fillStyle = ND.rgba(72, 219, 251, progress);
        const lines = [
          '> INITIALIZING NEO-DUAT PROTOCOL...',
          '> LOADING DIVINE MATRICES...',
          '> CALIBRATING HEART WEIGHING SYSTEM...',
          '> CONNECTING TO THE DUAT NETWORK...',
          `> FOUND ${42} FRAGMENTS IN MEMORY`,
          '> WARNING: SLOT_9 STATUS UNKNOWN',
          '> SYSTEM READY'
        ];
        lines.forEach((line, i) => {
          if (bootFrame > i * 4) {
            ctx.fillText(line, 20, 30 + i * 18);
          }
        });
      }

      if (bootFrame < 40) {
        // Scanline
        ctx.fillStyle = ND.rgba(72, 219, 251, 0.05);
        const scanY = (bootFrame * 12) % ND.H;
        ctx.fillRect(0, scanY, ND.W, 2);
      }

      // Eye of Horus fade in
      if (bootFrame > 30) {
        const eyeAlpha = (bootFrame - 30) / 30;
        ctx.font = `${40 + bootFrame}px serif`;
        ctx.textAlign = 'center';
        ctx.fillStyle = ND.rgba(255, 215, 0, Math.min(eyeAlpha, 1));
        ctx.fillText('𓂀', ND.centerX, ND.H / 2);
        ctx.textAlign = 'left';
      }

      if (bootFrame >= 70) {
        // Boot done — show title
        ND.uiSystem.showTitle();
        requestAnimationFrame(gameLoop);
        return;
      }

      requestAnimationFrame(bootAnim);
    }

    bootAnim();
  }

  // --- Start ---
  boot();

})();
