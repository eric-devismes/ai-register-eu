// ============================================================
// NEO-DUAT — Character Definitions & Drawing
// Stylized geometric vector art for Ra and Anubis
// ============================================================

ND.characters = (function() {
  const ctx = ND.ctx;

  // --- CHARACTER DATA ---
  const roster = {
    ra: {
      name: 'Ra',
      title: 'The Architect',
      color: '#ffd700',
      colorAlt: '#ff9f43',
      colorDark: '#b8860b',
      hp: 100,
      speed: 4.5,
      damage: { light: 8, heavy: 15, special: 28 },
      specCost: 100,
      specCharge: 12,
      hitboxW: 50,
      hitboxH: 90,
      attackRange: 70,
      heavyRange: 85,
      specialRange: 160,
      lore: 'The first god to enter Neo-Duat. He built this world, but now it has consumed him.',
      // Coordinates: Giza, Egypt — 29.9792° N, 31.1342° E (hidden in special animation)
    },
    anubis: {
      name: 'Anubis',
      title: 'The Judge',
      color: '#9b59b6',
      colorAlt: '#8e44ad',
      colorDark: '#4a235a',
      hp: 110,
      speed: 4,
      damage: { light: 7, heavy: 18, special: 32 },
      specCost: 100,
      specCharge: 10,
      hitboxW: 48,
      hitboxH: 95,
      attackRange: 65,
      heavyRange: 90,
      specialRange: 140,
      lore: 'He weighed the hearts. He found them all wanting. Even his own.',
      // Coordinates: Valley of the Kings — 25.7402° N, 32.6014° E (hidden in idle animation)
    }
  };

  // --- Draw character body ---
  function drawCharacter(fighter) {
    const { x, y, char, facing, state, stateTimer, hp, maxHp } = fighter;
    const data = roster[char];
    const s = facing; // 1 = right, -1 = left

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, 1);

    // Hit flash
    if (state === 'hit' && stateTimer % 4 < 2) {
      ctx.globalAlpha = 0.6;
    }

    // Shadow on ground
    ctx.fillStyle = ND.rgba(0, 0, 0, 0.3);
    ctx.beginPath();
    ctx.ellipse(0, 0, 30, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    if (char === 'ra') {
      drawRa(state, stateTimer, data);
    } else if (char === 'anubis') {
      drawAnubis(state, stateTimer, data);
    }

    ctx.restore();
  }

  function drawRa(state, timer, data) {
    const bob = Math.sin(ND.time * 3) * 2;
    let bodyY = -50 + bob;

    // Animation offsets
    let armAngle = 0;
    let lean = 0;

    if (state === 'attack_light') {
      armAngle = -Math.PI / 3 * (1 - timer / 15);
      lean = 5;
    } else if (state === 'attack_heavy') {
      armAngle = -Math.PI / 2.5 * (1 - timer / 25);
      lean = 10;
    } else if (state === 'attack_special') {
      armAngle = Math.sin(timer * 0.3) * 0.5;
    } else if (state === 'block') {
      lean = -3;
    } else if (state === 'hit') {
      lean = -8;
      bodyY += 3;
    }

    ctx.translate(lean, 0);

    // --- LEGS ---
    ctx.strokeStyle = data.colorDark;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';

    // Left leg
    const walkCycle = state === 'walk' ? Math.sin(ND.time * 8) * 8 : 0;
    ctx.beginPath();
    ctx.moveTo(-8, bodyY + 40);
    ctx.lineTo(-12 - walkCycle, 0);
    ctx.stroke();

    // Right leg
    ctx.beginPath();
    ctx.moveTo(8, bodyY + 40);
    ctx.lineTo(12 + walkCycle, 0);
    ctx.stroke();

    // --- BODY (geometric torso) ---
    ctx.fillStyle = data.color;
    ctx.beginPath();
    ctx.moveTo(0, bodyY - 10);
    ctx.lineTo(-18, bodyY + 20);
    ctx.lineTo(-14, bodyY + 42);
    ctx.lineTo(14, bodyY + 42);
    ctx.lineTo(18, bodyY + 20);
    ctx.closePath();
    ctx.fill();

    // Body glow lines
    ctx.strokeStyle = ND.rgba(255, 255, 255, 0.3);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, bodyY - 5);
    ctx.lineTo(0, bodyY + 40);
    ctx.stroke();

    // --- ARMS ---
    ctx.save();
    ctx.strokeStyle = data.color;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';

    // Right arm (attack arm)
    ctx.save();
    ctx.translate(16, bodyY + 10);
    ctx.rotate(armAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(25, 15);
    ctx.stroke();

    // Solar orb in hand during special
    if (state === 'attack_special') {
      const pulse = 0.5 + Math.sin(timer * 0.5) * 0.5;
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 20 + pulse * 20;
      ctx.fillStyle = ND.rgba(255, 215, 0, 0.8 + pulse * 0.2);
      ctx.beginPath();
      ctx.arc(30, 18, 10 + pulse * 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    ctx.restore();

    // Left arm
    ctx.beginPath();
    ctx.moveTo(-16, bodyY + 10);
    ctx.lineTo(-25, bodyY + 25 + (state === 'block' ? -10 : 0));
    ctx.stroke();
    ctx.restore();

    // --- HEAD (solar disc / falcon helm) ---
    const headY = bodyY - 25;

    // Falcon helmet
    ctx.fillStyle = data.colorDark;
    ctx.beginPath();
    ctx.moveTo(0, headY - 18);
    ctx.lineTo(-14, headY + 5);
    ctx.lineTo(14, headY + 5);
    ctx.closePath();
    ctx.fill();

    // Face
    ctx.fillStyle = data.color;
    ctx.beginPath();
    ctx.arc(0, headY, 12, 0, Math.PI * 2);
    ctx.fill();

    // Solar disc above head
    const solarPulse = 0.6 + Math.sin(ND.time * 4) * 0.4;
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 15 * solarPulse;
    ctx.fillStyle = ND.rgba(255, 200, 0, solarPulse);
    ctx.beginPath();
    ctx.arc(0, headY - 22, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Eyes (glowing)
    ctx.fillStyle = '#fff';
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 6;
    ctx.fillRect(-6, headY - 3, 4, 3);
    ctx.fillRect(2, headY - 3, 4, 3);
    ctx.shadowBlur = 0;

    // --- NEON GLOW OUTLINE ---
    ctx.strokeStyle = ND.rgba(255, 215, 0, 0.15 + Math.sin(ND.time * 2) * 0.05);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, headY - 30);
    ctx.lineTo(-20, bodyY + 20);
    ctx.lineTo(-14, bodyY + 42);
    ctx.lineTo(14, bodyY + 42);
    ctx.lineTo(20, bodyY + 20);
    ctx.closePath();
    ctx.stroke();
  }

  function drawAnubis(state, timer, data) {
    const bob = Math.sin(ND.time * 2.5) * 3;
    let bodyY = -55 + bob;

    let armAngle = 0;
    let lean = 0;

    if (state === 'attack_light') {
      armAngle = -Math.PI / 3 * (1 - timer / 15);
      lean = 5;
    } else if (state === 'attack_heavy') {
      armAngle = -Math.PI / 2 * (1 - timer / 25);
      lean = 10;
    } else if (state === 'attack_special') {
      armAngle = Math.sin(timer * 0.4) * 0.3;
    } else if (state === 'block') {
      lean = -3;
    } else if (state === 'hit') {
      lean = -8;
      bodyY += 5;
    }

    ctx.translate(lean, 0);

    // --- LEGS ---
    ctx.strokeStyle = data.colorDark;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';

    const walkCycle = state === 'walk' ? Math.sin(ND.time * 7) * 8 : 0;
    ctx.beginPath();
    ctx.moveTo(-8, bodyY + 45);
    ctx.lineTo(-10 - walkCycle, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(8, bodyY + 45);
    ctx.lineTo(10 + walkCycle, 0);
    ctx.stroke();

    // --- BODY (taller, sleeker) ---
    ctx.fillStyle = data.color;
    ctx.beginPath();
    ctx.moveTo(0, bodyY - 5);
    ctx.lineTo(-16, bodyY + 25);
    ctx.lineTo(-12, bodyY + 48);
    ctx.lineTo(12, bodyY + 48);
    ctx.lineTo(16, bodyY + 25);
    ctx.closePath();
    ctx.fill();

    // Purple energy lines
    ctx.strokeStyle = ND.rgba(155, 89, 182, 0.4);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-5, bodyY);
    ctx.lineTo(-5, bodyY + 45);
    ctx.moveTo(5, bodyY);
    ctx.lineTo(5, bodyY + 45);
    ctx.stroke();

    // --- ARMS ---
    ctx.strokeStyle = data.color;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';

    // Right arm — staff/ankh
    ctx.save();
    ctx.translate(14, bodyY + 12);
    ctx.rotate(armAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(20, 20);
    ctx.stroke();

    // Ankh staff
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(22, 22);
    ctx.lineTo(22, -10);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(22, -14, 4, 0, Math.PI * 2);
    ctx.stroke();
    // Cross of ankh
    ctx.beginPath();
    ctx.moveTo(18, -6);
    ctx.lineTo(26, -6);
    ctx.stroke();

    // Death energy during special
    if (state === 'attack_special') {
      const pulse = Math.sin(timer * 0.6) * 0.5 + 0.5;
      ctx.shadowColor = '#9b59b6';
      ctx.shadowBlur = 25 + pulse * 15;
      ctx.fillStyle = ND.rgba(155, 89, 182, 0.6 + pulse * 0.3);
      ctx.beginPath();
      ctx.arc(22, 5, 12 + pulse * 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    ctx.restore();

    // Left arm
    ctx.strokeStyle = data.color;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-14, bodyY + 12);
    ctx.lineTo(-22, bodyY + 28 + (state === 'block' ? -12 : 0));
    ctx.stroke();

    // --- HEAD (Jackal) ---
    const headY = bodyY - 20;

    // Jackal snout
    ctx.fillStyle = data.colorDark;
    ctx.beginPath();
    ctx.moveTo(0, headY);
    ctx.lineTo(18, headY + 5);
    ctx.lineTo(10, headY + 12);
    ctx.lineTo(-10, headY + 12);
    ctx.lineTo(-5, headY);
    ctx.closePath();
    ctx.fill();

    // Ears (tall, pointed)
    ctx.beginPath();
    ctx.moveTo(-8, headY - 5);
    ctx.lineTo(-12, headY - 28);
    ctx.lineTo(-3, headY - 8);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(4, headY - 5);
    ctx.lineTo(8, headY - 28);
    ctx.lineTo(12, headY - 8);
    ctx.closePath();
    ctx.fill();

    // Head
    ctx.fillStyle = data.color;
    ctx.beginPath();
    ctx.arc(0, headY, 13, 0, Math.PI * 2);
    ctx.fill();

    // Eyes (ominous purple glow)
    ctx.fillStyle = '#e0aaff';
    ctx.shadowColor = '#9b59b6';
    ctx.shadowBlur = 8;
    ctx.fillRect(-7, headY - 4, 5, 3);
    ctx.fillRect(2, headY - 4, 5, 3);
    ctx.shadowBlur = 0;

    // --- NEON OUTLINE ---
    ctx.strokeStyle = ND.rgba(155, 89, 182, 0.15 + Math.sin(ND.time * 2) * 0.05);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, headY - 30);
    ctx.lineTo(-18, bodyY + 25);
    ctx.lineTo(-12, bodyY + 48);
    ctx.lineTo(12, bodyY + 48);
    ctx.lineTo(18, bodyY + 25);
    ctx.closePath();
    ctx.stroke();
  }

  return { roster, drawCharacter };
})();
