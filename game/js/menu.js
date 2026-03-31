// ============================================================
// AEONS OF DUAT — Menu System (FF-style pause menu)
// ============================================================

G.menuSystem = (function() {
  let cursor = 0;
  let subMenu = null; // null, 'status', 'equip', 'save'
  let charCursor = 0;

  const ITEMS = ['STATUS', 'ITEMS', 'EQUIP', 'SAVE', 'CLOSE'];

  function enter() {
    cursor = 0;
    subMenu = null;
    charCursor = 0;
  }

  function update() {
    if (subMenu === 'status') {
      if (G.justPressed.cancel || G.justPressed.confirm) {
        subMenu = null;
        G.audio.sfx('cancel');
      }
      return;
    }

    if (G.justPressed.up) { cursor = (cursor - 1 + ITEMS.length) % ITEMS.length; G.audio.sfx('cursor'); }
    if (G.justPressed.down) { cursor = (cursor + 1) % ITEMS.length; G.audio.sfx('cursor'); }

    if (G.justPressed.confirm) {
      G.audio.sfx('confirm');
      if (ITEMS[cursor] === 'STATUS') {
        subMenu = 'status';
        charCursor = 0;
      } else if (ITEMS[cursor] === 'SAVE') {
        saveGame();
      } else if (ITEMS[cursor] === 'CLOSE') {
        G.goScene('explore');
      }
    }

    if (G.justPressed.cancel || G.justPressed.menu) {
      G.audio.sfx('cancel');
      G.goScene('explore');
    }
  }

  function draw() {
    G.cls('#0a0a2e');

    // Stars bg
    for (let i = 0; i < 30; i++) {
      G.rect((i * 137) % G.IW, (i * 73) % G.IH, 1, 1, '#333');
    }

    // Main menu window
    G.window(4, 4, 60, 60);
    ITEMS.forEach((item, i) => {
      const col = i === cursor ? '#ff0' : '#aaa';
      G.text(item, 16, 10 + i * 11, col);
      if (i === cursor) G.text('>', 9, 10 + i * 11, '#ff0');
    });

    // Party overview (right side)
    G.window(68, 4, G.IW - 72, 110);
    G.party.forEach((p, i) => {
      const y = 10 + i * 34;
      G.text(p.name, 76, y, '#fff');
      G.text('LV ' + p.level, 76, y + 9, '#aaa');
      G.text(p.title, 140, y, '#888');

      const hpCol = p.hp < p.maxHp * 0.25 ? '#f44' : '#0f0';
      G.text('HP ' + p.hp + '/' + p.maxHp, 76, y + 18, hpCol);
      G.text('MP ' + p.mp + '/' + p.maxMp, 160, y + 18, '#4af');
    });

    // Gold & playtime
    G.window(4, 68, 60, 24);
    G.text('GOLD', 10, 73, '#ffd700');
    G.text(String(G.gold), 10, 83, '#fff');

    G.window(4, 96, 60, 20);
    const mins = Math.floor(G.playtime / 60);
    const secs = Math.floor(G.playtime % 60);
    G.text(mins + ':' + String(secs).padStart(2, '0'), 10, 101, '#aaa');

    // Status sub-menu
    if (subMenu === 'status') {
      drawStatus();
    }
  }

  function drawStatus() {
    G.window(20, 20, G.IW - 40, G.IH - 40);
    const p = G.party[charCursor] || G.party[0];
    if (!p) return;

    const x = 30, y = 28;
    G.text(p.name + ' - ' + p.title, x, y, '#ffd700');
    G.text('LEVEL  ' + p.level, x, y + 14, '#fff');
    G.text('EXP    ' + p.xp + '/' + p.xpNext, x, y + 24, '#aaa');
    G.text('HP     ' + p.hp + '/' + p.maxHp, x, y + 38, '#0f0');
    G.text('MP     ' + p.mp + '/' + p.maxMp, x, y + 48, '#4af');
    G.text('ATK    ' + p.atk, x, y + 62, '#f84');
    G.text('DEF    ' + p.def, x, y + 72, '#48f');
    G.text('MAG    ' + p.mag, x, y + 82, '#a4f');
    G.text('SPD    ' + p.spd, x, y + 92, '#4f8');

    G.text('SKILLS:', x + 110, y + 14, '#aaa');
    (p.skills || []).forEach((s, i) => {
      const cost = s.mpCost ? ' (' + s.mpCost + 'MP)' : '';
      G.text(s.name + cost, x + 110, y + 26 + i * 10, '#fff');
    });

    G.text('PRESS A/B TO CLOSE', 70, G.IH - 36, '#666');
  }

  function saveGame() {
    G.save('party', G.party.map(p => ({
      charId: p.charId, name: p.name, title: p.title, level: p.level,
      hp: p.hp, maxHp: p.maxHp, mp: p.mp, maxMp: p.maxMp,
      atk: p.atk, def: p.def, mag: p.mag, spd: p.spd,
      xp: p.xp, xpNext: p.xpNext, skills: p.skills,
    })));
    G.save('gold', G.gold);
    G.save('flags', G.flags);
    G.save('playtime', G.playtime);
    G.audio.sfx('save');
  }

  return { enter, update, draw };
})();
