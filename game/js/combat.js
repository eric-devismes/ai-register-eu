// ============================================================
// NEO-DUAT — Combat Engine
// ============================================================

ND.combat = (function() {
  let fighters = [];
  let roundTimer = 0;
  let roundNum = 1;
  let maxRounds = 3;
  let roundActive = false;
  let roundResult = null; // null, 'p1', 'p2', 'draw'
  let roundWins = { p1: 0, p2: 0 };
  let matchOver = false;
  let screenShake = 0;
  let slowMotion = 0;
  let hitStop = 0;
  let comboCounters = { p1: 0, p2: 0 };
  let comboTimers = { p1: 0, p2: 0 };
  let lastHitBy = null;

  const ROUND_TIME = 60; // seconds
  const COMBO_WINDOW = 30; // frames

  function createFighter(charId, playerId, x, facing) {
    const data = ND.characters.roster[charId];
    return {
      id: playerId,
      char: charId,
      x: x,
      y: ND.groundY,
      vx: 0,
      vy: 0,
      facing: facing,
      hp: data.hp,
      maxHp: data.hp,
      special: 0,
      maxSpecial: data.specCost,
      state: 'idle', // idle, walk, attack_light, attack_heavy, attack_special, block, hit, ko
      stateTimer: 0,
      attackHit: false,
      blockTimer: 0,
      invincible: 0,
      comboHits: 0,
      data: data,
      // AI fields
      aiTimer: 0,
      aiAction: null,
      aiDifficulty: 0.5
    };
  }

  function init(char1, char2, isVsAI) {
    const margin = ND.W * 0.25;
    fighters = [
      createFighter(char1, 'p1', margin, 1),
      createFighter(char2, 'p2', ND.W - margin, -1)
    ];
    roundNum = 1;
    roundWins = { p1: 0, p2: 0 };
    matchOver = false;
    roundResult = null;
    startRound();
  }

  function startRound() {
    const margin = ND.W * 0.25;
    fighters[0].x = margin;
    fighters[1].x = ND.W - margin;
    fighters.forEach(f => {
      f.hp = f.data.hp;
      f.maxHp = f.data.hp;
      f.special = 0;
      f.state = 'idle';
      f.stateTimer = 0;
      f.invincible = 0;
      f.vx = 0;
    });
    roundTimer = ROUND_TIME;
    roundActive = true;
    roundResult = null;
    comboCounters = { p1: 0, p2: 0 };
    comboTimers = { p1: 0, p2: 0 };
    ND.particles.clear();
    ND.audio.setIntensity(0.3);
  }

  // --- INPUT ---
  function handleInput(action, playerId) {
    if (!roundActive || hitStop > 0) return;
    const f = fighters.find(f => f.id === playerId);
    if (!f) return;
    if (f.state === 'hit' || f.state === 'ko') return;

    if (action === 'left') {
      if (f.state === 'idle' || f.state === 'walk') {
        f.vx = -f.data.speed;
        f.state = 'walk';
      }
    } else if (action === 'right') {
      if (f.state === 'idle' || f.state === 'walk') {
        f.vx = f.data.speed;
        f.state = 'walk';
      }
    } else if (action === 'stop') {
      f.vx = 0;
      if (f.state === 'walk') f.state = 'idle';
    } else if (action === 'light') {
      if (f.state === 'idle' || f.state === 'walk') {
        f.state = 'attack_light';
        f.stateTimer = 15;
        f.attackHit = false;
        f.vx = 0;
      }
    } else if (action === 'heavy') {
      if (f.state === 'idle' || f.state === 'walk') {
        f.state = 'attack_heavy';
        f.stateTimer = 25;
        f.attackHit = false;
        f.vx = 0;
      }
    } else if (action === 'special') {
      if ((f.state === 'idle' || f.state === 'walk') && f.special >= f.maxSpecial) {
        f.state = 'attack_special';
        f.stateTimer = 40;
        f.attackHit = false;
        f.special = 0;
        f.vx = 0;
        ND.audio.playImpact('special');
        ND.audio.setIntensity(0.9);
      }
    } else if (action === 'block') {
      if (f.state === 'idle' || f.state === 'walk') {
        f.state = 'block';
        f.vx = 0;
      }
    } else if (action === 'unblock') {
      if (f.state === 'block') {
        f.state = 'idle';
      }
    }
  }

  // --- AI ---
  function updateAI(ai, opponent) {
    if (!roundActive) return;
    if (ai.state === 'hit' || ai.state === 'ko') return;

    ai.aiTimer--;
    if (ai.aiTimer > 0) return;

    const dist = Math.abs(ai.x - opponent.x);
    const difficulty = ai.aiDifficulty;

    // React to opponent attacks
    if (opponent.state.startsWith('attack') && dist < 100 && Math.random() < difficulty) {
      handleInput('block', ai.id);
      ai.aiTimer = 15 + ND.randInt(5, 15);
      setTimeout(() => handleInput('unblock', ai.id), (200 + Math.random() * 300));
      return;
    }

    // Choose action
    const roll = Math.random();

    if (dist > ai.data.attackRange + 30) {
      // Approach
      const dir = opponent.x > ai.x ? 'right' : 'left';
      handleInput(dir, ai.id);
      ai.aiTimer = 10 + ND.randInt(5, 20);
      setTimeout(() => handleInput('stop', ai.id), (150 + Math.random() * 200));
    } else if (dist <= ai.data.attackRange) {
      // In range — attack
      if (ai.special >= ai.maxSpecial && Math.random() < 0.3 * difficulty) {
        handleInput('special', ai.id);
        ai.aiTimer = 50;
      } else if (roll < 0.5) {
        handleInput('light', ai.id);
        ai.aiTimer = 20 + ND.randInt(5, 15);
        // Follow up combo
        if (Math.random() < difficulty * 0.4) {
          setTimeout(() => handleInput('light', ai.id), 300);
          if (Math.random() < difficulty * 0.3) {
            setTimeout(() => handleInput('heavy', ai.id), 600);
          }
        }
      } else if (roll < 0.8) {
        handleInput('heavy', ai.id);
        ai.aiTimer = 30 + ND.randInt(5, 15);
      } else {
        handleInput('block', ai.id);
        ai.aiTimer = 20;
        setTimeout(() => handleInput('unblock', ai.id), 300 + Math.random() * 400);
      }
    } else {
      // Medium range — mix approach and ranged
      if (Math.random() < 0.6) {
        const dir = opponent.x > ai.x ? 'right' : 'left';
        handleInput(dir, ai.id);
        ai.aiTimer = 8;
        setTimeout(() => handleInput('stop', ai.id), 120);
      } else {
        // Feint: block briefly
        handleInput('block', ai.id);
        ai.aiTimer = 15;
        setTimeout(() => {
          handleInput('unblock', ai.id);
          const dir = opponent.x > ai.x ? 'right' : 'left';
          handleInput(dir, ai.id);
          setTimeout(() => {
            handleInput('stop', ai.id);
            handleInput('light', ai.id);
          }, 150);
        }, 200);
      }
    }
  }

  // --- HIT DETECTION ---
  function checkHit(attacker, defender) {
    if (attacker.attackHit) return;

    let range, damage, hitFrame;
    if (attacker.state === 'attack_light') {
      range = attacker.data.attackRange;
      damage = attacker.data.damage.light;
      hitFrame = 8; // Hit connects at this frame
    } else if (attacker.state === 'attack_heavy') {
      range = attacker.data.heavyRange;
      damage = attacker.data.damage.heavy;
      hitFrame = 15;
    } else if (attacker.state === 'attack_special') {
      range = attacker.data.specialRange;
      damage = attacker.data.damage.special;
      hitFrame = 20;
    } else return;

    const elapsed = (attacker.state === 'attack_light' ? 15 : attacker.state === 'attack_heavy' ? 25 : 40) - attacker.stateTimer;
    if (elapsed < hitFrame - 3 || elapsed > hitFrame + 3) return;

    const dist = Math.abs(attacker.x - defender.x);
    if (dist > range) return;

    // Check if defender is on the correct side
    const correctSide = (attacker.facing === 1 && defender.x > attacker.x) ||
                       (attacker.facing === -1 && defender.x < attacker.x);
    if (!correctSide) return;

    attacker.attackHit = true;

    // Blocked?
    if (defender.state === 'block' && defender.invincible <= 0) {
      const blockFacing = (defender.facing === 1 && attacker.x > defender.x) ||
                         (defender.facing === -1 && attacker.x < defender.x);
      if (blockFacing) {
        // Blocked! Chip damage
        const chipDmg = Math.floor(damage * 0.15);
        defender.hp = Math.max(0, defender.hp - chipDmg);
        defender.vx = attacker.facing * 3;
        ND.particles.blockSpark(defender.x - attacker.facing * 20, defender.y - 40);
        ND.audio.playImpact('block');
        screenShake = 3;
        attacker.special += attacker.data.specCharge * 0.5;
        defender.special += defender.data.specCharge * 0.7;
        comboCounters[attacker.id] = 0;
        return;
      }
    }

    // Hit!
    const actualDamage = damage;
    defender.hp = Math.max(0, defender.hp - actualDamage);
    defender.state = 'hit';
    defender.stateTimer = attacker.state === 'attack_special' ? 25 : 12;
    defender.vx = attacker.facing * (attacker.state === 'attack_special' ? 8 : attacker.state === 'attack_heavy' ? 5 : 3);
    defender.invincible = 8;

    // Combo tracking
    comboTimers[attacker.id] = COMBO_WINDOW;
    comboCounters[attacker.id]++;

    // Particles & sound
    const hitX = (attacker.x + defender.x) / 2;
    const hitY = defender.y - 45;

    if (attacker.state === 'attack_special') {
      ND.particles.specialBurst(hitX, hitY, attacker.data.color);
      ND.audio.playImpact('heavy');
      screenShake = 12;
      hitStop = 8;
      slowMotion = 20;
    } else if (attacker.state === 'attack_heavy') {
      ND.particles.hitSpark(hitX, hitY, attacker.data.color);
      ND.audio.playImpact('heavy');
      screenShake = 6;
      hitStop = 4;
    } else {
      ND.particles.hitSpark(hitX, hitY, attacker.data.color);
      ND.audio.playImpact('hit');
      screenShake = 3;
      hitStop = 2;
    }

    // Charge special
    attacker.special = Math.min(attacker.maxSpecial, attacker.special + attacker.data.specCharge);
    defender.special = Math.min(defender.maxSpecial, defender.special + defender.data.specCharge * 0.5);

    // Update music intensity based on HP
    const avgHpRatio = (fighters[0].hp / fighters[0].maxHp + fighters[1].hp / fighters[1].maxHp) / 2;
    ND.audio.setIntensity(1 - avgHpRatio * 0.7);

    lastHitBy = attacker.id;

    // Check KO
    if (defender.hp <= 0) {
      defender.state = 'ko';
      defender.stateTimer = 60;
      ND.particles.koBurst(defender.x, defender.y - 40);
      ND.audio.playImpact('ko');
      screenShake = 15;
      slowMotion = 40;
      endRound(attacker.id);
    }
  }

  function endRound(winnerId) {
    roundActive = false;
    roundResult = winnerId;
    roundWins[winnerId]++;

    if (roundWins[winnerId] >= 2) {
      matchOver = true;
      ND.matchesPlayed++;
      ND.save('matches', ND.matchesPlayed);
    }
  }

  // --- UPDATE ---
  function update() {
    if (hitStop > 0) { hitStop--; return; }

    const dtMult = slowMotion > 0 ? 0.3 : 1;
    if (slowMotion > 0) slowMotion--;

    // Shake decay
    if (screenShake > 0) screenShake *= 0.85;
    if (screenShake < 0.5) screenShake = 0;

    // Round timer
    if (roundActive) {
      roundTimer -= (1/60) * dtMult;
      if (roundTimer <= 0) {
        roundTimer = 0;
        // Time up — most HP wins
        if (fighters[0].hp > fighters[1].hp) endRound('p1');
        else if (fighters[1].hp > fighters[0].hp) endRound('p2');
        else endRound(lastHitBy || 'p1');
      }
    }

    // Combo timers
    ['p1', 'p2'].forEach(id => {
      if (comboTimers[id] > 0) {
        comboTimers[id]--;
        if (comboTimers[id] <= 0) comboCounters[id] = 0;
      }
    });

    // Update fighters
    fighters.forEach((f, i) => {
      const opp = fighters[1 - i];

      // Facing
      if (f.state !== 'hit' && f.state !== 'ko') {
        f.facing = opp.x > f.x ? 1 : -1;
      }

      // State timer
      if (f.stateTimer > 0) {
        f.stateTimer -= dtMult;
        if (f.stateTimer <= 0) {
          if (f.state === 'ko') {
            // Stay ko
          } else if (f.state.startsWith('attack') || f.state === 'hit') {
            f.state = 'idle';
          }
        }
      }

      // Invincibility
      if (f.invincible > 0) f.invincible--;

      // Movement
      f.x += f.vx * dtMult;

      // Friction
      if (f.state === 'hit') {
        f.vx *= 0.9;
      } else if (f.state !== 'walk') {
        f.vx *= 0.85;
      }

      // Boundaries
      f.x = ND.clamp(f.x, 30, ND.W - 30);

      // Push apart if overlapping
      const dist = Math.abs(f.x - opp.x);
      if (dist < 40) {
        const push = (40 - dist) / 2;
        f.x += f.x < opp.x ? -push : push;
      }

      // Hit detection
      if (f.state.startsWith('attack')) {
        checkHit(f, opp);
      }

      // AI
      if (f.id === 'p2') {
        updateAI(f, opp);
      }
    });
  }

  // --- DRAW ---
  function draw() {
    const ctx = ND.ctx;

    // Screen shake
    if (screenShake > 0) {
      ctx.save();
      ctx.translate(
        ND.rand(-screenShake, screenShake),
        ND.rand(-screenShake, screenShake)
      );
    }

    // Draw arena
    ND.renderer.drawArena();

    // Draw fighters (back to front based on Y)
    const sorted = [...fighters].sort((a, b) => a.y - b.y);
    sorted.forEach(f => ND.characters.drawCharacter(f));

    // Draw particles
    ND.particles.update();
    ND.particles.draw();

    if (screenShake > 0) ctx.restore();

    // --- HUD ---
    const barW = ND.W * 0.35;
    const barH = 14;
    const barY = 75;
    const gap = 10;

    // P1 health (left)
    ND.renderer.drawHealthBar(gap, barY, barW, barH, fighters[0].hp, fighters[0].maxHp, fighters[0].data.color, fighters[0].data.name, false);
    ND.renderer.drawSpecialMeter(gap, barY + barH + 4, barW, 5, fighters[0].special, fighters[0].maxSpecial, fighters[0].data.color);

    // P2 health (right)
    ND.renderer.drawHealthBar(ND.W - barW - gap, barY, barW, barH, fighters[1].hp, fighters[1].maxHp, fighters[1].data.color, fighters[1].data.name, true);
    ND.renderer.drawSpecialMeter(ND.W - barW - gap, barY + barH + 4, barW, 5, fighters[1].special, fighters[1].maxSpecial, fighters[1].data.color);

    // Round & timer
    ND.renderer.drawRound(roundNum, maxRounds);
    ND.renderer.drawTimer(roundTimer);

    // Combos
    if (comboCounters.p1 >= 2) ND.renderer.drawCombo(gap + 50, barY + 50, comboCounters.p1);
    if (comboCounters.p2 >= 2) ND.renderer.drawCombo(ND.W - gap - 50, barY + 50, comboCounters.p2);

    // Round wins (dots)
    [0, 1].forEach(i => {
      const f = fighters[i];
      const wins = roundWins[f.id];
      const baseX = i === 0 ? gap : ND.W - gap - 30;
      for (let w = 0; w < maxRounds - 1; w++) {
        ctx.beginPath();
        ctx.arc(baseX + w * 18, barY - 14, 5, 0, Math.PI * 2);
        ctx.fillStyle = w < wins ? f.data.color : ND.rgba(255, 255, 255, 0.15);
        ctx.fill();
      }
    });

    // Round result overlay
    if (!roundActive && roundResult) {
      drawRoundResult();
    }
  }

  function drawRoundResult() {
    const ctx = ND.ctx;
    ctx.fillStyle = ND.rgba(0, 0, 0, 0.5);
    ctx.fillRect(0, 0, ND.W, ND.H);

    ctx.textAlign = 'center';

    if (matchOver) {
      const winner = fighters.find(f => f.id === roundResult);
      ctx.font = '900 42px Orbitron, sans-serif';
      ctx.shadowColor = winner.data.color;
      ctx.shadowBlur = 20;
      ctx.fillStyle = winner.data.color;
      ctx.fillText(winner.data.name.toUpperCase() + ' WINS', ND.centerX, ND.H * 0.4);
      ctx.shadowBlur = 0;

      ctx.font = '600 18px Rajdhani, sans-serif';
      ctx.fillStyle = ND.rgba(255, 255, 255, 0.6);
      ctx.fillText('TAP TO CONTINUE', ND.centerX, ND.H * 0.5);
    } else {
      const winner = fighters.find(f => f.id === roundResult);
      ctx.font = '900 36px Orbitron, sans-serif';
      ctx.fillStyle = '#fff';
      ctx.fillText(`ROUND ${roundNum}`, ND.centerX, ND.H * 0.4);
      ctx.font = '700 24px Rajdhani, sans-serif';
      ctx.fillStyle = winner.data.color;
      ctx.fillText(winner.data.name.toUpperCase(), ND.centerX, ND.H * 0.46);
    }
    ctx.textAlign = 'left';
  }

  function nextRound() {
    if (matchOver) return false;
    roundNum++;
    startRound();
    return true;
  }

  return {
    init,
    update,
    draw,
    handleInput,
    getFighters: () => fighters,
    isRoundActive: () => roundActive,
    isMatchOver: () => matchOver,
    getRoundResult: () => roundResult,
    getRoundWins: () => roundWins,
    getRoundNum: () => roundNum,
    nextRound,
    startRound
  };
})();
