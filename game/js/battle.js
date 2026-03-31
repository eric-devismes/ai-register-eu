// ============================================================
// AEONS OF DUAT — Turn-Based Battle System (FF6-style ATB)
// ============================================================

G.battleSystem = (function() {
  let enemies = [];
  let turnOrder = [];
  let activeUnit = null;
  let phase = 'intro'; // intro, atb, select, target, animate, victory, defeat
  let menuCursor = 0;
  let targetCursor = 0;
  let animTimer = 0;
  let animType = '';
  let animData = {};
  let introTimer = 0;
  let resultTimer = 0;
  let battleLog = [];
  let logTimer = 0;
  let xpReward = 0;
  let goldReward = 0;
  let isBoss = false;

  // --- Enemy definitions ---
  const ENEMY_DEFS = {
    scarab_drone: {
      name: 'Scarab Drone', sprite: 'scarab', palette: 'scarab',
      hp: 45, maxHp: 45, mp: 0, atk: 12, def: 5, spd: 8, mag: 3,
      xp: 15, gold: 8,
      skills: [
        { name: 'Sting', type: 'phys', power: 1.0 },
        { name: 'Acid Spit', type: 'mag', power: 0.8, element: 'poison' },
      ],
      ai: function(self, party) {
        return { skill: G.choice(self.skills), target: G.choice(party.filter(p => p.hp > 0)) };
      }
    },
    sentinel: {
      name: 'Sentinel', sprite: 'sentinel', palette: 'sentinel',
      hp: 80, maxHp: 80, mp: 10, atk: 16, def: 12, spd: 5, mag: 8,
      xp: 25, gold: 15,
      skills: [
        { name: 'Slam', type: 'phys', power: 1.2 },
        { name: 'Guard Beam', type: 'mag', power: 1.0, element: 'fire' },
      ],
      ai: function(self, party) {
        const lowHpTarget = party.filter(p => p.hp > 0).sort((a, b) => a.hp - b.hp)[0];
        return { skill: self.hp < self.maxHp * 0.5 ? self.skills[1] : self.skills[0], target: lowHpTarget };
      }
    },
    apep_fragment: {
      name: 'Apep Fragment', sprite: 'scarab', palette: 'apep',
      hp: 200, maxHp: 200, mp: 50, atk: 22, def: 15, spd: 10, mag: 18,
      xp: 100, gold: 60,
      skills: [
        { name: 'Chaos Bite', type: 'phys', power: 1.5 },
        { name: 'Void Beam', type: 'mag', power: 1.8, element: 'dark' },
        { name: 'Devour', type: 'phys', power: 2.0 }, // rare
      ],
      ai: function(self, party) {
        const alive = party.filter(p => p.hp > 0);
        if (self.hp < self.maxHp * 0.3) {
          return { skill: self.skills[2], target: G.choice(alive) };
        }
        return { skill: G.choice(self.skills.slice(0, 2)), target: G.choice(alive) };
      }
    },
  };

  // Random encounter groups
  const ENCOUNTER_GROUPS = [
    [{ type: 'scarab_drone' }, { type: 'scarab_drone' }],
    [{ type: 'scarab_drone' }, { type: 'scarab_drone' }, { type: 'scarab_drone' }],
    [{ type: 'sentinel' }],
    [{ type: 'sentinel' }, { type: 'scarab_drone' }],
  ];

  // --- Init battle ---
  function init(data) {
    phase = 'intro';
    introTimer = 60;
    menuCursor = 0;
    targetCursor = 0;
    battleLog = [];
    logTimer = 0;
    activeUnit = null;
    isBoss = data && data.type === 'boss';

    // Setup enemies
    enemies = [];
    let group;
    if (isBoss) {
      group = [{ type: 'apep_fragment' }];
    } else {
      group = G.choice(ENCOUNTER_GROUPS);
    }

    group.forEach((e, i) => {
      const def = ENEMY_DEFS[e.type];
      enemies.push({
        ...def,
        skills: [...def.skills],
        id: 'e' + i,
        side: 'enemy',
        hp: def.hp,
        maxHp: def.maxHp,
        atb: G.rand(0, 50),
        x: 170 + i * 30,
        y: 50 + i * 35,
        alive: true,
        flashTimer: 0,
      });
    });

    xpReward = enemies.reduce((s, e) => s + e.xp, 0);
    goldReward = enemies.reduce((s, e) => s + e.gold, 0);

    // Reset party ATB
    G.party.forEach(p => {
      p.atb = G.rand(0, 30);
      p.alive = p.hp > 0;
      p.flashTimer = 0;
      p.defending = false;
    });

    G.audio.play(isBoss ? 'boss' : 'battle');
  }

  // --- ATB update ---
  function updateATB() {
    const allUnits = [...G.party.filter(p => p.alive), ...enemies.filter(e => e.alive)];

    allUnits.forEach(u => {
      u.atb += u.spd * 0.5;
      if (u.atb >= 100 && !activeUnit) {
        u.atb = 100;
        if (u.side === 'enemy') {
          // Enemy turn
          const action = u.ai(u, G.party);
          executeAction(u, action.skill, action.target);
          u.atb = 0;
        } else {
          // Player turn
          activeUnit = u;
          phase = 'select';
          menuCursor = 0;
        }
      }
    });
  }

  // --- Player menu ---
  const MENU_ITEMS = ['ATTACK', 'SKILL', 'ITEM', 'DEFEND'];

  function updateMenu() {
    if (G.justPressed.up) { menuCursor = (menuCursor - 1 + MENU_ITEMS.length) % MENU_ITEMS.length; G.audio.sfx('cursor'); }
    if (G.justPressed.down) { menuCursor = (menuCursor + 1) % MENU_ITEMS.length; G.audio.sfx('cursor'); }

    if (G.justPressed.confirm) {
      G.audio.sfx('confirm');
      if (MENU_ITEMS[menuCursor] === 'ATTACK') {
        phase = 'target';
        targetCursor = 0;
      } else if (MENU_ITEMS[menuCursor] === 'SKILL') {
        if (activeUnit.skills && activeUnit.skills.length > 0) {
          phase = 'skill_select';
          menuCursor = 0;
        }
      } else if (MENU_ITEMS[menuCursor] === 'DEFEND') {
        activeUnit.defending = true;
        activeUnit.atb = 0;
        addLog(activeUnit.name + ' defends!');
        activeUnit = null;
        phase = 'atb';
      } else if (MENU_ITEMS[menuCursor] === 'ITEM') {
        // TODO: item menu
        addLog('No items yet!');
      }
    }
    if (G.justPressed.cancel) {
      // Can't cancel on first menu
    }
  }

  function updateSkillSelect() {
    const skills = activeUnit.skills;
    if (G.justPressed.up) { menuCursor = (menuCursor - 1 + skills.length) % skills.length; G.audio.sfx('cursor'); }
    if (G.justPressed.down) { menuCursor = (menuCursor + 1) % skills.length; G.audio.sfx('cursor'); }

    if (G.justPressed.confirm) {
      const skill = skills[menuCursor];
      if (skill.mpCost && activeUnit.mp < skill.mpCost) {
        addLog('Not enough MP!');
        return;
      }
      G.audio.sfx('confirm');
      if (skill.target === 'ally') {
        // Target ally
        phase = 'target_ally';
        targetCursor = 0;
      } else {
        phase = 'target';
        targetCursor = 0;
      }
    }
    if (G.justPressed.cancel) {
      phase = 'select';
      menuCursor = 0;
      G.audio.sfx('cancel');
    }
  }

  function updateTarget() {
    const targets = enemies.filter(e => e.alive);
    if (targets.length === 0) return;

    if (G.justPressed.up || G.justPressed.left) { targetCursor = (targetCursor - 1 + targets.length) % targets.length; G.audio.sfx('cursor'); }
    if (G.justPressed.down || G.justPressed.right) { targetCursor = (targetCursor + 1) % targets.length; G.audio.sfx('cursor'); }

    if (G.justPressed.confirm) {
      G.audio.sfx('confirm');
      const target = targets[targetCursor];

      if (phase === 'target') {
        let skill;
        if (MENU_ITEMS[menuCursor] === 'ATTACK' || phase === 'target') {
          // Check if we came from skill select
          const fromSkill = activeUnit._pendingSkill;
          skill = fromSkill || { name: 'Attack', type: 'phys', power: 1.0 };
        }
        if (activeUnit.skills && activeUnit._pendingSkillIdx !== undefined) {
          skill = activeUnit.skills[activeUnit._pendingSkillIdx];
          activeUnit._pendingSkillIdx = undefined;
        }
        if (!skill) skill = { name: 'Attack', type: 'phys', power: 1.0 };
        executeAction(activeUnit, skill, target);
      }
      activeUnit.atb = 0;
      activeUnit = null;
      phase = 'atb';
    }
    if (G.justPressed.cancel) {
      phase = 'select';
      menuCursor = 0;
      G.audio.sfx('cancel');
    }
  }

  function updateTargetAlly() {
    const allies = G.party.filter(p => p.alive);
    if (G.justPressed.up) { targetCursor = (targetCursor - 1 + allies.length) % allies.length; G.audio.sfx('cursor'); }
    if (G.justPressed.down) { targetCursor = (targetCursor + 1) % allies.length; G.audio.sfx('cursor'); }

    if (G.justPressed.confirm) {
      const target = allies[targetCursor];
      const skill = activeUnit.skills[activeUnit._pendingSkillIdx || 0];
      executeAction(activeUnit, skill, target);
      activeUnit.atb = 0;
      activeUnit = null;
      phase = 'atb';
    }
    if (G.justPressed.cancel) {
      phase = 'skill_select';
      G.audio.sfx('cancel');
    }
  }

  // --- Execute action ---
  function executeAction(user, skill, target) {
    if (!target || !target.alive) {
      // Retarget
      const pool = target && target.side === 'enemy'
        ? enemies.filter(e => e.alive)
        : G.party.filter(p => p.alive);
      if (pool.length === 0) return;
      target = G.choice(pool);
    }

    phase = 'animate';
    animTimer = 20;
    animType = skill.type;
    animData = { user, target, skill };

    // Calculate damage
    let dmg = 0;
    if (skill.type === 'phys') {
      dmg = Math.max(1, Math.floor(user.atk * skill.power - target.def * 0.5));
      dmg = Math.floor(dmg * (0.9 + Math.random() * 0.2));
    } else if (skill.type === 'mag') {
      dmg = Math.max(1, Math.floor(user.mag * skill.power * 2 - target.def * 0.3));
      dmg = Math.floor(dmg * (0.9 + Math.random() * 0.2));
    } else if (skill.type === 'heal') {
      dmg = -Math.floor(user.mag * skill.power * 2);
    }

    // Defending halves damage
    if (target.defending && dmg > 0) dmg = Math.floor(dmg / 2);

    // Critical hit (10% chance)
    let crit = false;
    if (dmg > 0 && Math.random() < 0.1) {
      dmg = Math.floor(dmg * 1.5);
      crit = true;
    }

    // Apply
    if (skill.type === 'heal') {
      target.hp = Math.min(target.maxHp, target.hp - dmg);
      addLog(user.name + ' heals ' + target.name + ' for ' + (-dmg) + ' HP!');
      G.audio.sfx('heal');
    } else {
      target.hp = Math.max(0, target.hp - dmg);
      target.flashTimer = 15;
      addLog(user.name + ': ' + skill.name + (crit ? ' CRIT!' : '') + ' ' + dmg + ' dmg!');
      G.audio.sfx(crit ? 'crit' : 'hit');

      // MP cost
      if (skill.mpCost) user.mp = Math.max(0, user.mp - skill.mpCost);

      // Charge target's special
      if (target.side !== 'enemy') {
        // Party members gain MP when hit
      }
    }

    // Check death
    if (target.hp <= 0) {
      target.alive = false;
      target.hp = 0;
      G.audio.sfx('death');
      addLog(target.name + ' is defeated!');
    }
  }

  function updateAnimate() {
    animTimer--;
    if (animData.target) animData.target.flashTimer--;

    if (animTimer <= 0) {
      // Check victory/defeat
      const enemiesAlive = enemies.filter(e => e.alive);
      const partyAlive = G.party.filter(p => p.alive);

      if (enemiesAlive.length === 0) {
        phase = 'victory';
        resultTimer = 0;
        G.audio.play('victory');
      } else if (partyAlive.length === 0) {
        phase = 'defeat';
        resultTimer = 0;
        G.audio.play('gameover');
      } else {
        phase = 'atb';
      }
    }
  }

  // --- Log ---
  function addLog(msg) {
    battleLog.unshift(msg);
    if (battleLog.length > 3) battleLog.pop();
    logTimer = 120;
  }

  // --- Main update ---
  function update() {
    if (phase === 'intro') {
      introTimer--;
      if (introTimer <= 0) phase = 'atb';
    } else if (phase === 'atb') {
      updateATB();
    } else if (phase === 'select') {
      updateMenu();
    } else if (phase === 'skill_select') {
      updateSkillSelect();
    } else if (phase === 'target') {
      updateTarget();
    } else if (phase === 'target_ally') {
      updateTargetAlly();
    } else if (phase === 'animate') {
      updateAnimate();
    } else if (phase === 'victory') {
      resultTimer++;
      if (resultTimer > 60 && G.justPressed.confirm) {
        // Award XP and gold
        G.party.forEach(p => {
          if (p.alive) {
            p.xp += xpReward;
            // Level up check
            while (p.xp >= p.xpNext) {
              p.level++;
              p.xp -= p.xpNext;
              p.xpNext = Math.floor(p.xpNext * 1.5);
              p.maxHp += G.randInt(5, 12);
              p.maxMp += G.randInt(2, 5);
              p.atk += G.randInt(1, 3);
              p.def += G.randInt(1, 3);
              p.mag += G.randInt(1, 3);
              p.spd += G.randInt(0, 2);
              p.hp = p.maxHp;
              p.mp = p.maxMp;
              addLog(p.name + ' reached level ' + p.level + '!');
            }
          }
        });
        G.gold += goldReward;

        G.goScene('explore', null, 'fade');
      }
    } else if (phase === 'defeat') {
      resultTimer++;
      if (resultTimer > 90 && G.justPressed.confirm) {
        G.goScene('title', null, 'fade');
      }
    }

    if (logTimer > 0) logTimer--;
  }

  // --- Draw ---
  function draw() {
    G.cls('#0a0a1a');

    // Battle background — starfield
    for (let i = 0; i < 40; i++) {
      const sx = ((i * 137 + G.frame * 0.3) % G.IW);
      const sy = ((i * 73) % (G.IH - 70));
      const brightness = ((i * 31) % 3 === 0) ? '#fff' : '#666';
      G.rect(sx, sy, 1, 1, brightness);
    }

    // Nebula glow
    const cx = G.cx;
    cx.fillStyle = `rgba(100, 50, 150, ${0.05 + Math.sin(G.time) * 0.02})`;
    cx.fillRect(0, 0, G.IW, G.IH / 2);

    // Draw enemies
    enemies.forEach((e, i) => {
      if (!e.alive) return;
      const flash = e.flashTimer > 0 && e.flashTimer % 4 < 2;
      if (flash) cx.globalAlpha = 0.3;
      G.sprites.drawBattleSprite(e.sprite, e.x, e.y, e.palette);
      cx.globalAlpha = 1;

      // Enemy name & HP
      const nameX = e.x - 10;
      const nameY = e.y - 8;
      G.text(e.name, nameX, nameY, '#ccc');

      // Target cursor
      if (phase === 'target') {
        const targets = enemies.filter(en => en.alive);
        if (targets[targetCursor] === e) {
          const blink = Math.sin(G.time * 8) > 0;
          if (blink) G.text('>', nameX - 8, nameY, '#ff0');
        }
      }
    });

    // Draw party status (bottom of screen, FF-style)
    const partyY = G.IH - 60;
    G.window(0, partyY - 4, G.IW, 64);

    G.party.forEach((p, i) => {
      const py = partyY + i * 18;
      const nameCol = p.alive ? (activeUnit === p ? '#ff0' : '#fff') : '#666';

      // Name
      G.text(p.name, 8, py, nameCol);
      // HP
      const hpCol = p.hp < p.maxHp * 0.25 ? '#f44' : p.hp < p.maxHp * 0.5 ? '#fa0' : '#0f0';
      G.text('HP', 80, py, '#aaa');
      G.text(String(p.hp).padStart(4, ' '), 94, py, hpCol);
      // MP
      G.text('MP', 130, py, '#aaa');
      G.text(String(p.mp).padStart(3, ' '), 144, py, '#4af');

      // ATB gauge
      const gaugeX = 175;
      const gaugeW = 40;
      G.rect(gaugeX, py + 1, gaugeW, 5, '#222');
      const fillW = Math.floor((p.atb / 100) * gaugeW);
      G.rect(gaugeX, py + 1, fillW, 5, p.atb >= 100 ? '#ff0' : '#48f');

      // ATB ready indicator
      if (activeUnit === p) {
        G.text('>', 220, py, '#ff0');
      }
    });

    // Command menu
    if (phase === 'select' && activeUnit) {
      G.window(180, partyY - 55, 70, 50);
      MENU_ITEMS.forEach((item, i) => {
        const col = i === menuCursor ? '#ff0' : '#aaa';
        G.text(item, 192, partyY - 50 + i * 11, col);
        if (i === menuCursor) G.text('>', 185, partyY - 50 + i * 11, '#ff0');
      });
    }

    // Skill menu
    if (phase === 'skill_select' && activeUnit && activeUnit.skills) {
      const skills = activeUnit.skills;
      G.window(120, partyY - 55, 130, 10 + skills.length * 11);
      skills.forEach((s, i) => {
        const col = i === menuCursor ? '#ff0' : '#aaa';
        const costStr = s.mpCost ? s.mpCost + 'MP' : '';
        G.text(s.name, 132, partyY - 50 + i * 11, col);
        G.text(costStr, 210, partyY - 50 + i * 11, '#4af');
        if (i === menuCursor) G.text('>', 125, partyY - 50 + i * 11, '#ff0');
      });
    }

    // Battle log
    if (logTimer > 0) {
      const logAlpha = Math.min(1, logTimer / 30);
      battleLog.forEach((msg, i) => {
        G.text(msg, 8, 8 + i * 10, `rgba(255,255,255,${logAlpha})`);
      });
    }

    // Intro overlay
    if (phase === 'intro') {
      const alpha = introTimer / 60;
      G.rect(0, 0, G.IW, G.IH, `rgba(255,255,255,${alpha * 0.3})`);
      if (introTimer > 30) {
        G.textCenter(isBoss ? 'BOSS ENCOUNTER!' : 'ENCOUNTER!', G.IH / 2 - 4, '#fff', '#000');
      }
    }

    // Victory
    if (phase === 'victory') {
      G.window(40, 40, 176, 80);
      G.textCenter('VICTORY!', 50, '#ffd700', '#000');
      G.text('EXP: +' + xpReward, 60, 70, '#fff');
      G.text('GOLD: +' + goldReward, 60, 82, '#ffd700');
      if (resultTimer > 60) {
        G.textCenter('PRESS A TO CONTINUE', 108, '#aaa');
      }
    }

    // Defeat
    if (phase === 'defeat') {
      G.rect(0, 0, G.IW, G.IH, 'rgba(100,0,0,0.3)');
      G.textCenter('DEFEAT...', G.IH / 2 - 10, '#f44', '#000');
      if (resultTimer > 90) {
        G.textCenter('PRESS A', G.IH / 2 + 10, '#aaa');
      }
    }
  }

  return { init, update, draw };
})();
