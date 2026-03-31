// ============================================================
// AEONS OF DUAT — Main Game / Scene Definitions
// ============================================================

(function() {
  'use strict';

  // ---- Party character definitions ----
  const PARTY_DEFS = {
    ra: {
      charId: 'ra', name: 'RA', title: 'Commander',
      level: 1, hp: 120, maxHp: 120, mp: 30, maxMp: 30,
      atk: 14, def: 10, mag: 12, spd: 9,
      xp: 0, xpNext: 50, side: 'party', alive: true, atb: 0, defending: false,
      skills: [
        { name: 'Solar Flare', type: 'mag', power: 1.4, mpCost: 8, element: 'fire' },
        { name: 'Radiance', type: 'heal', power: 1.2, mpCost: 10, target: 'ally' },
      ],
    },
    anubis: {
      charId: 'anubis', name: 'ANUBIS', title: 'Judge',
      level: 1, hp: 140, maxHp: 140, mp: 20, maxMp: 20,
      atk: 18, def: 14, mag: 8, spd: 7,
      xp: 0, xpNext: 50, side: 'party', alive: true, atb: 0, defending: false,
      skills: [
        { name: 'Death Strike', type: 'phys', power: 1.6, mpCost: 6 },
        { name: 'Judgment', type: 'mag', power: 1.8, mpCost: 12, element: 'dark' },
      ],
    },
  };

  // =====================
  // SCENE: Title Screen
  // =====================
  G.addScene('title', {
    timer: 0,
    cursor: 0,

    enter() {
      this.timer = 0;
      this.cursor = 0;
      G.audio.play('title');
    },

    update() {
      this.timer++;

      if (this.timer > 60) {
        if (G.justPressed.up) { this.cursor = 0; G.audio.sfx('cursor'); }
        if (G.justPressed.down) { this.cursor = 1; G.audio.sfx('cursor'); }

        if (G.justPressed.confirm) {
          G.audio.sfx('confirm');
          if (this.cursor === 0) {
            G.goScene('intro', null, 'fade');
          } else {
            // Load game
            const saved = G.load('party');
            if (saved) {
              G.party = saved.map(p => ({ ...p }));
              G.gold = G.load('gold', 0);
              G.flags = G.load('flags', {});
              G.playtime = G.load('playtime', 0);
              G.goScene('explore', { map: 'bridge', x: 9, y: 9 }, 'fade');
            } else {
              G.goScene('intro', null, 'fade');
            }
          }
        }
      }
    },

    draw() {
      G.cls('#000');

      // Animated starfield
      for (let i = 0; i < 60; i++) {
        const speed = (i % 3 + 1) * 0.5;
        const sx = ((i * 137 + G.frame * speed) % (G.IW + 20)) - 10;
        const sy = (i * 73 + i * i * 3) % G.IH;
        const bright = i % 4 === 0 ? '#fff' : i % 3 === 0 ? '#aaa' : '#555';
        G.rect(sx, sy, 1, 1, bright);
      }

      // Nebula effect
      const cx = G.cx;
      cx.fillStyle = `rgba(80, 20, 120, ${0.06 + Math.sin(G.time * 0.5) * 0.02})`;
      cx.fillRect(0, 30, G.IW, 80);
      cx.fillStyle = `rgba(20, 60, 120, ${0.04 + Math.sin(G.time * 0.7) * 0.02})`;
      cx.fillRect(0, 60, G.IW, 60);

      // Title
      if (this.timer > 10) {
        G.textCenter('AEONS OF DUAT', 50, '#ffd700', '#4a3500');
      }
      if (this.timer > 30) {
        G.textCenter('A SPACE OPERA', 64, '#8888cc', '#222');
      }

      // Menu
      if (this.timer > 60) {
        const items = ['NEW GAME', 'CONTINUE'];
        items.forEach((item, i) => {
          const y = 110 + i * 14;
          const col = i === this.cursor ? '#fff' : '#666';
          G.textCenter(item, y, col);
          if (i === this.cursor) {
            const arrowX = (G.IW - G.textWidth(item)) / 2 - 10;
            G.text('>', arrowX, y, '#ffd700');
          }
        });
      }

      // Bottom text
      if (this.timer > 80) {
        G.textCenter('V0.I.AKHET', G.IH - 16, '#333');
      }
    },

    exit() {}
  });

  // =====================
  // SCENE: Story Intro
  // =====================
  G.addScene('intro', {
    timer: 0,
    textLines: [
      '',
      'THE YEAR IS 12,000 AFTER ASCENSION.',
      '',
      'HUMANITY HAS SPREAD ACROSS THE STARS,',
      'GUIDED BY THE DIVINE PROTOCOLS --',
      'ANCIENT AI SYSTEMS MODELED AFTER',
      'THE GODS OF OLD EGYPT.',
      '',
      'ABOARD THE STARSHIP ANKH ASCENDING,',
      'COMMANDER RA AND HIS CREW PATROL',
      'THE OUTER RIM OF KNOWN SPACE.',
      '',
      'A DISTRESS SIGNAL HAS BEEN DETECTED',
      'FROM SECTOR 7-DUAT -- THE REGION',
      'KNOWN AS THE DIGITAL AFTERLIFE.',
      '',
      'THE SIGNAL COMES FROM THE OSIRIS,',
      'A COLONY SHIP LOST 3,000 CYCLES AGO.',
      '',
      'SOMEONE -- OR SOMETHING --',
      'IS STILL ALIVE.',
      '',
      '',
      'AND THE APEP SWARM IS CLOSING IN...',
    ],
    scrollY: 0,

    enter() {
      this.timer = 0;
      this.scrollY = G.IH;
      G.audio.play('title');
    },

    update() {
      this.timer++;
      this.scrollY -= 0.4;

      if (G.justPressed.confirm || G.justPressed.cancel) {
        // Skip intro
        startNewGame();
      }

      // Auto-advance after all text scrolled
      if (this.scrollY < -(this.textLines.length * 12 + 40)) {
        startNewGame();
      }
    },

    draw() {
      G.cls('#000');

      // Stars
      for (let i = 0; i < 30; i++) {
        const sx = (i * 137) % G.IW;
        const sy = (i * 73) % G.IH;
        G.rect(sx, sy, 1, 1, '#333');
      }

      // Scrolling text
      this.textLines.forEach((line, i) => {
        const y = this.scrollY + i * 12;
        if (y > -10 && y < G.IH + 10) {
          // Fade at edges
          let alpha = 1;
          if (y < 20) alpha = y / 20;
          if (y > G.IH - 30) alpha = (G.IH - y) / 30;
          alpha = Math.max(0, Math.min(1, alpha));

          const col = line === '' ? 'transparent' : `rgba(180,200,255,${alpha})`;
          G.textCenter(line, y, col);
        }
      });

      // Skip hint
      if (this.timer > 60) {
        G.text('PRESS A TO SKIP', 4, G.IH - 10, '#444');
      }
    },

    exit() {}
  });

  function startNewGame() {
    G.party = [
      { ...PARTY_DEFS.ra },
      { ...PARTY_DEFS.anubis },
    ];
    G.gold = 100;
    G.flags = {};
    G.inventory = [];
    G.goScene('explore', { map: 'bridge', x: 9, y: 9 }, 'fade');
  }

  // =====================
  // SCENE: Exploration
  // =====================
  G.addScene('explore', {
    enter(data) {
      if (data && data.map) {
        G.maps.loadMap(data.map, data.x, data.y);
      }
    },
    update() {
      G.maps.update();
      G.dialogue.update();
    },
    draw() {
      G.maps.draw();
    },
    exit() {}
  });

  // =====================
  // SCENE: Battle
  // =====================
  G.addScene('battle', {
    enter(data) {
      G.battleSystem.init(data || {});
    },
    update() {
      G.battleSystem.update();
    },
    draw() {
      G.battleSystem.draw();
    },
    exit() {}
  });

  // =====================
  // SCENE: Menu
  // =====================
  G.addScene('menu', {
    enter() {
      G.menuSystem.enter();
    },
    update() {
      G.menuSystem.update();
    },
    draw() {
      G.menuSystem.draw();
    },
    exit() {}
  });

  // =====================
  // Boot
  // =====================
  G.goScene('title');

})();
