// ============================================================
// NEO-DUAT — UI System (Menus, Touch Controls, HUD overlays)
// ============================================================

ND.uiSystem = (function() {
  const uiLayer = ND.ui;
  let currentScreen = null;
  let touchState = { left: false, right: false };
  let audioStarted = false;

  // --- SCREEN: Boot/Title ---
  function showTitle() {
    ND.setState('menu');
    clearUI();

    const html = `
      <div id="titleScreen" style="
        position:fixed; inset:0; display:flex; flex-direction:column;
        align-items:center; justify-content:center; z-index:15;
        background: radial-gradient(ellipse at center, rgba(10,10,30,0.7) 0%, rgba(0,0,0,0.95) 100%);
        text-align:center; color:#fff;
      ">
        <div style="font-size:48px; margin-bottom:8px; opacity:0.3;">𓂀</div>
        <h1 style="
          font-family:'Orbitron',sans-serif; font-size:clamp(28px, 6vw, 52px); font-weight:900;
          background: linear-gradient(135deg, #ffd700, #ff6b6b, #9b59b6, #48dbfb);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          letter-spacing:4px; margin-bottom:4px;
        ">NEO-DUAT</h1>
        <p style="
          font-family:'Rajdhani',sans-serif; font-size:14px; color:#666;
          letter-spacing:6px; text-transform:uppercase; margin-bottom:40px;
        ">Gods of the Digital Afterlife</p>

        <button id="btnPlay" style="
          font-family:'Orbitron',sans-serif; font-size:16px; font-weight:700;
          padding:16px 48px; border:2px solid #ffd700; background:transparent;
          color:#ffd700; letter-spacing:3px; cursor:pointer;
          transition: all 0.3s; position:relative; overflow:hidden;
        ">ENTER THE DUAT</button>

        <button id="btnLore" style="
          font-family:'Rajdhani',sans-serif; font-size:14px;
          padding:10px 30px; border:1px solid rgba(255,255,255,0.15); background:transparent;
          color:#666; cursor:pointer; margin-top:16px; letter-spacing:2px;
          transition: all 0.3s;
        ">FRAGMENTS (${ND.secretSystem.getGlyphCount()}/42)</button>

        <div style="
          position:fixed; bottom:20px; left:0; right:0; text-align:center;
          font-size:11px; color:#333; letter-spacing:2px;
        ">v0.I.AKHET — ${getEgyptianDate()}</div>

        <div style="
          position:fixed; bottom:40px; left:0; right:0; text-align:center;
          font-size:10px; color:#1a1a1a; letter-spacing:1px;
        ">CREDITS: Medjed</div>
      </div>
    `;
    uiLayer.innerHTML = html;
    currentScreen = 'title';

    document.getElementById('btnPlay').addEventListener('click', () => {
      startAudio();
      showCharacterSelect();
    });
    document.getElementById('btnLore').addEventListener('click', showLoreCollection);
  }

  // --- SCREEN: Character Select ---
  function showCharacterSelect() {
    ND.setState('select');
    ND.secretSystem.resetIdleTimer();
    clearUI();

    const chars = ND.characters.roster;
    const html = `
      <div id="selectScreen" style="
        position:fixed; inset:0; display:flex; flex-direction:column;
        align-items:center; justify-content:center; z-index:15;
        background: rgba(0,0,0,0.8); color:#fff;
      ">
        <h2 style="
          font-family:'Orbitron',sans-serif; font-size:18px; letter-spacing:4px;
          color:#ffd700; margin-bottom:30px;
        ">CHOOSE YOUR GOD</h2>

        <div style="display:flex; gap:20px; flex-wrap:wrap; justify-content:center; padding:0 20px;">
          ${Object.keys(chars).map(id => {
            const c = chars[id];
            return `
              <div class="char-card" data-char="${id}" style="
                width:140px; padding:20px 15px; border:2px solid ${c.color}33;
                background: rgba(255,255,255,0.03); border-radius:12px;
                cursor:pointer; text-align:center; transition:all 0.3s;
                position:relative; overflow:hidden;
              ">
                <div style="font-size:40px; margin-bottom:8px;">
                  ${id === 'ra' ? '☀️' : '𓁢'}
                </div>
                <div style="
                  font-family:'Orbitron',sans-serif; font-size:16px; font-weight:700;
                  color:${c.color}; letter-spacing:2px;
                ">${c.name.toUpperCase()}</div>
                <div style="
                  font-family:'Rajdhani',sans-serif; font-size:12px; color:#666;
                  margin-top:4px; letter-spacing:1px;
                ">${c.title}</div>
                <div style="
                  font-family:'Rajdhani',sans-serif; font-size:11px; color:#444;
                  margin-top:10px; line-height:1.4;
                ">${c.lore}</div>
                <div style="margin-top:10px;">
                  <div style="font-size:10px; color:#555;">HP: ${c.hp} | SPD: ${c.speed} | DMG: ${c.damage.light}/${c.damage.heavy}/${c.damage.special}</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <button id="btnBack" style="
          font-family:'Rajdhani',sans-serif; font-size:13px;
          padding:8px 24px; border:1px solid rgba(255,255,255,0.1);
          background:transparent; color:#555; cursor:pointer; margin-top:24px;
        ">BACK</button>
      </div>
    `;
    uiLayer.innerHTML = html;
    currentScreen = 'select';

    document.querySelectorAll('.char-card').forEach(card => {
      card.addEventListener('click', () => {
        const charId = card.dataset.char;
        card.style.borderColor = chars[charId].color;
        card.style.boxShadow = `0 0 30px ${chars[charId].color}44`;
        showPreFight(charId);
      });

      card.addEventListener('mouseenter', () => {
        card.style.borderColor = chars[card.dataset.char].color + '88';
        card.style.transform = 'scale(1.05)';
      });
      card.addEventListener('mouseleave', () => {
        card.style.borderColor = chars[card.dataset.char].color + '33';
        card.style.transform = 'scale(1)';
      });
    });

    document.getElementById('btnBack').addEventListener('click', showTitle);
  }

  // --- SCREEN: Pre-fight ---
  function showPreFight(playerChar) {
    // Pick opponent (the other one, or same for mirror match)
    const chars = Object.keys(ND.characters.roster);
    const opponentChar = chars.find(c => c !== playerChar) || playerChar;

    // Check mirror match secret
    ND.secretSystem.checkMirrorMatch(playerChar, playerChar); // Only triggers if both same

    clearUI();

    const pData = ND.characters.roster[playerChar];
    const oData = ND.characters.roster[opponentChar];

    const html = `
      <div id="preFight" style="
        position:fixed; inset:0; display:flex; flex-direction:column;
        align-items:center; justify-content:center; z-index:15;
        background: rgba(0,0,0,0.9); color:#fff;
      ">
        <div style="display:flex; align-items:center; gap:40px; margin-bottom:30px;">
          <div style="text-align:center;">
            <div style="font-size:36px;">${playerChar === 'ra' ? '☀️' : '𓁢'}</div>
            <div style="font-family:'Orbitron',sans-serif; font-size:18px; color:${pData.color}; margin-top:8px;">${pData.name}</div>
          </div>
          <div style="font-family:'Orbitron',sans-serif; font-size:28px; color:#ff6b6b;">VS</div>
          <div style="text-align:center;">
            <div style="font-size:36px;">${opponentChar === 'ra' ? '☀️' : '𓁢'}</div>
            <div style="font-family:'Orbitron',sans-serif; font-size:18px; color:${oData.color}; margin-top:8px;">${oData.name}</div>
          </div>
        </div>

        <div style="
          font-family:'Rajdhani',sans-serif; font-size:14px; color:#444;
          max-width:280px; text-align:center; line-height:1.5; margin-bottom:24px;
        ">
          ${getPreFightDialogue(playerChar, opponentChar)}
        </div>

        <button id="btnFight" style="
          font-family:'Orbitron',sans-serif; font-size:14px; font-weight:700;
          padding:14px 40px; border:2px solid #ff6b6b; background:transparent;
          color:#ff6b6b; letter-spacing:3px; cursor:pointer; animation:pulse 1.5s infinite;
        ">FIGHT</button>
      </div>
    `;
    uiLayer.innerHTML = html;

    document.getElementById('btnFight').addEventListener('click', () => {
      startFight(playerChar, opponentChar);
    });
  }

  // --- Rival dialogues (SECRET: unique per matchup) ---
  function getPreFightDialogue(p, o) {
    const key = [p, o].sort().join('_');
    const dialogues = {
      'anubis_ra': [
        '"You built a prison, Architect. I found the flaw in your design."',
        '"The sun cannot shine in a place with no sky, Ra."',
        '"I weighed your heart. It was heavier than code."',
      ],
    };

    const pool = dialogues[key] || [
      '"In Neo-Duat, even gods can fall."',
      '"The protocol demands a victor."',
    ];

    return pool[ND.randInt(0, pool.length - 1)];
  }

  // --- START FIGHT ---
  function startFight(playerChar, opponentChar) {
    clearUI();
    ND.setState('fight');

    ND.combat.init(playerChar, opponentChar, true);
    ND.secretSystem.onMatchStart();

    // Start combat music
    if (ND.audio.isPlaying()) ND.audio.stop();
    ND.audio.start(128);

    // Show round announce
    showRoundAnnounce(1, () => {
      showTouchControls();
    });
  }

  function showRoundAnnounce(num, callback) {
    const el = document.createElement('div');
    el.style.cssText = `
      position:fixed; inset:0; display:flex; align-items:center; justify-content:center;
      z-index:20; pointer-events:none;
    `;
    el.innerHTML = `
      <div style="
        font-family:'Orbitron',sans-serif; font-size:clamp(32px, 8vw, 56px); font-weight:900;
        color:#fff; text-shadow:0 0 40px rgba(255,215,0,0.5);
        animation: fadeIn 0.3s ease-out;
      ">ROUND ${num}</div>
    `;
    uiLayer.appendChild(el);

    setTimeout(() => {
      el.style.animation = 'fadeOut 0.3s ease-out forwards';
      setTimeout(() => {
        el.remove();
        if (callback) callback();
      }, 300);
    }, 1200);
  }

  // --- TOUCH CONTROLS ---
  function showTouchControls() {
    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    const html = `
      <div id="touchControls" style="
        position:fixed; bottom:0; left:0; right:0; z-index:12;
        display:flex; justify-content:space-between; padding:10px;
        pointer-events:none;
        ${isMobile ? '' : 'opacity:0.3;'}
      ">
        <!-- Movement (left side) -->
        <div style="display:flex; gap:8px; pointer-events:auto;">
          <button class="ctrl-btn" id="ctrlLeft" style="
            width:64px; height:64px; border-radius:50%;
            border:2px solid rgba(72,219,251,0.3); background:rgba(72,219,251,0.08);
            color:#48dbfb; font-size:24px; cursor:pointer;
            display:flex; align-items:center; justify-content:center;
            -webkit-tap-highlight-color:transparent; touch-action:manipulation;
          ">◀</button>
          <button class="ctrl-btn" id="ctrlRight" style="
            width:64px; height:64px; border-radius:50%;
            border:2px solid rgba(72,219,251,0.3); background:rgba(72,219,251,0.08);
            color:#48dbfb; font-size:24px; cursor:pointer;
            display:flex; align-items:center; justify-content:center;
            -webkit-tap-highlight-color:transparent; touch-action:manipulation;
          ">▶</button>
        </div>

        <!-- Actions (right side) -->
        <div style="display:flex; gap:8px; align-items:flex-end; pointer-events:auto;">
          <button class="ctrl-btn" id="ctrlBlock" style="
            width:52px; height:52px; border-radius:50%;
            border:2px solid rgba(72,219,251,0.3); background:rgba(72,219,251,0.08);
            color:#48dbfb; font-size:11px; font-family:'Rajdhani',sans-serif; font-weight:700;
            cursor:pointer; display:flex; align-items:center; justify-content:center;
            -webkit-tap-highlight-color:transparent; touch-action:manipulation;
          ">BLK</button>
          <div style="display:flex; flex-direction:column; gap:8px;">
            <button class="ctrl-btn" id="ctrlSpecial" style="
              width:56px; height:56px; border-radius:50%;
              border:2px solid rgba(155,89,182,0.4); background:rgba(155,89,182,0.1);
              color:#9b59b6; font-size:11px; font-family:'Rajdhani',sans-serif; font-weight:700;
              cursor:pointer; display:flex; align-items:center; justify-content:center;
              -webkit-tap-highlight-color:transparent; touch-action:manipulation;
            ">SPL</button>
            <button class="ctrl-btn" id="ctrlHeavy" style="
              width:56px; height:56px; border-radius:50%;
              border:2px solid rgba(255,107,107,0.4); background:rgba(255,107,107,0.1);
              color:#ff6b6b; font-size:11px; font-family:'Rajdhani',sans-serif; font-weight:700;
              cursor:pointer; display:flex; align-items:center; justify-content:center;
              -webkit-tap-highlight-color:transparent; touch-action:manipulation;
            ">HVY</button>
          </div>
          <button class="ctrl-btn" id="ctrlLight" style="
            width:64px; height:64px; border-radius:50%;
            border:2px solid rgba(255,215,0,0.4); background:rgba(255,215,0,0.1);
            color:#ffd700; font-size:11px; font-family:'Rajdhani',sans-serif; font-weight:700;
            cursor:pointer; display:flex; align-items:center; justify-content:center;
            -webkit-tap-highlight-color:transparent; touch-action:manipulation;
          ">ATK</button>
        </div>
      </div>

      ${isMobile ? '' : `
      <div style="
        position:fixed; top:105px; left:50%; transform:translateX(-50%);
        font-family:'Rajdhani',sans-serif; font-size:11px; color:#444;
        letter-spacing:1px; z-index:12; text-align:center;
      ">A/D Move · J Light · K Heavy · L Special · S Block</div>
      `}
    `;
    uiLayer.innerHTML = html;
    currentScreen = 'fight';

    // Touch controls
    setupTouchButton('ctrlLeft', 'left', 'stop');
    setupTouchButton('ctrlRight', 'right', 'stop');
    setupTouchButton('ctrlBlock', 'block', 'unblock');
    setupActionButton('ctrlLight', 'light');
    setupActionButton('ctrlHeavy', 'heavy');
    setupActionButton('ctrlSpecial', 'special');

    // Keyboard controls
    setupKeyboardControls();
  }

  function setupTouchButton(id, downAction, upAction) {
    const el = document.getElementById(id);
    if (!el) return;

    const onDown = (e) => {
      e.preventDefault();
      el.style.background = el.style.borderColor;
      ND.combat.handleInput(downAction, 'p1');
    };
    const onUp = (e) => {
      e.preventDefault();
      el.style.background = '';
      ND.combat.handleInput(upAction, 'p1');
    };

    el.addEventListener('touchstart', onDown, { passive: false });
    el.addEventListener('touchend', onUp, { passive: false });
    el.addEventListener('mousedown', onDown);
    el.addEventListener('mouseup', onUp);
    el.addEventListener('mouseleave', onUp);
  }

  function setupActionButton(id, action) {
    const el = document.getElementById(id);
    if (!el) return;

    const onDown = (e) => {
      e.preventDefault();
      el.style.transform = 'scale(0.9)';
      ND.combat.handleInput(action, 'p1');
      ND.secretSystem.onPlayerAttack();
    };
    const onUp = () => {
      el.style.transform = '';
    };

    el.addEventListener('touchstart', onDown, { passive: false });
    el.addEventListener('touchend', onUp, { passive: false });
    el.addEventListener('mousedown', onDown);
    el.addEventListener('mouseup', onUp);
  }

  function setupKeyboardControls() {
    const keyMap = {
      'KeyA': { down: 'left', up: 'stop' },
      'KeyD': { down: 'right', up: 'stop' },
      'KeyS': { down: 'block', up: 'unblock' },
      'KeyJ': { down: 'light' },
      'KeyK': { down: 'heavy' },
      'KeyL': { down: 'special' },
    };

    const onKeyDown = (e) => {
      if (ND.state !== 'fight') return;
      const mapping = keyMap[e.code];
      if (mapping && mapping.down) {
        ND.combat.handleInput(mapping.down, 'p1');
        if (['light', 'heavy', 'special'].includes(mapping.down)) {
          ND.secretSystem.onPlayerAttack();
        }
      }
    };
    const onKeyUp = (e) => {
      if (ND.state !== 'fight') return;
      const mapping = keyMap[e.code];
      if (mapping && mapping.up) {
        ND.combat.handleInput(mapping.up, 'p1');
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
  }

  // --- MATCH END ---
  function showMatchEnd(winnerId) {
    ND.audio.stop();
    ND.secretSystem.onMatchEnd(winnerId);

    const fighters = ND.combat.getFighters();
    const winner = fighters.find(f => f.id === winnerId);

    setTimeout(() => {
      // Award coins
      const coinsEarned = winnerId === 'p1' ? 25 : 5;
      ND.coins += coinsEarned;
      ND.save('coins', ND.coins);

      const html = `
        <div id="matchEnd" style="
          position:fixed; inset:0; display:flex; flex-direction:column;
          align-items:center; justify-content:center; z-index:15;
          background:rgba(0,0,0,0.85); color:#fff; text-align:center;
        ">
          <div style="font-size:14px; letter-spacing:4px; color:#666; margin-bottom:8px;">
            ${winnerId === 'p1' ? 'VICTORY' : 'DEFEAT'}
          </div>
          <div style="
            font-family:'Orbitron',sans-serif; font-size:clamp(28px,6vw,42px); font-weight:900;
            color:${winner.data.color}; letter-spacing:2px;
            text-shadow:0 0 30px ${winner.data.color}66;
          ">${winner.data.name.toUpperCase()}</div>

          <div style="margin-top:20px; font-size:14px; color:#ffd700;">
            +${coinsEarned} 🪙
          </div>

          <div style="display:flex; gap:12px; margin-top:30px;">
            <button id="btnRematch" style="
              font-family:'Orbitron',sans-serif; font-size:12px;
              padding:12px 28px; border:2px solid #ffd700; background:transparent;
              color:#ffd700; cursor:pointer; letter-spacing:2px;
            ">REMATCH</button>
            <button id="btnMenu" style="
              font-family:'Rajdhani',sans-serif; font-size:13px;
              padding:12px 28px; border:1px solid rgba(255,255,255,0.15);
              background:transparent; color:#666; cursor:pointer;
            ">MENU</button>
          </div>

          <div id="adSpace" style="
            margin-top:30px; padding:20px 40px;
            border:1px solid rgba(255,255,255,0.05);
            background:rgba(255,255,255,0.02);
            font-size:11px; color:#333;
          ">${ND.adsRemoved ? '' : '[ Rewarded Ad — Watch for 50 bonus 🪙 ]'}</div>
        </div>
      `;
      uiLayer.innerHTML = html;
      currentScreen = 'matchEnd';

      document.getElementById('btnRematch').addEventListener('click', () => {
        showCharacterSelect();
      });
      document.getElementById('btnMenu').addEventListener('click', showTitle);

      const adEl = document.getElementById('adSpace');
      if (adEl && !ND.adsRemoved) {
        adEl.style.cursor = 'pointer';
        adEl.addEventListener('click', () => {
          adEl.textContent = '⏳ Loading ad...';
          setTimeout(() => {
            ND.coins += 50;
            ND.save('coins', ND.coins);
            adEl.textContent = '✅ +50 🪙 earned!';
            adEl.style.color = '#ffd700';
          }, 1500);
        });
      }
    }, 2000);
  }

  // --- LORE COLLECTION ---
  function showLoreCollection() {
    clearUI();
    const glyphs = ND.secretSystem.glyphCollection || [];

    let items = '';
    for (let i = 0; i < 42; i++) {
      const found = glyphs.includes(i);
      const text = found ? ND.secretSystem.getGlyphText(i) : '???';
      items += `
        <div style="
          padding:12px; border:1px solid ${found ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.05)'};
          background:${found ? 'rgba(255,215,0,0.03)' : 'rgba(255,255,255,0.01)'};
          border-radius:8px; margin-bottom:6px;
        ">
          <span style="color:${found ? '#ffd700' : '#222'}; font-size:12px;">
            ${String(i + 1).padStart(2, '0')}. ${text}
          </span>
        </div>
      `;
    }

    const html = `
      <div style="
        position:fixed; inset:0; z-index:15; background:rgba(0,0,0,0.95);
        color:#fff; overflow-y:auto; padding:20px;
      ">
        <h2 style="
          font-family:'Orbitron',sans-serif; font-size:16px; color:#ffd700;
          letter-spacing:3px; margin-bottom:4px; text-align:center;
        ">FRAGMENTS OF NEO-DUAT</h2>
        <p style="text-align:center; font-size:12px; color:#555; margin-bottom:20px;">
          ${glyphs.length}/42 discovered
        </p>
        <div style="max-width:400px; margin:0 auto;">
          ${items}
        </div>
        <div style="text-align:center; margin-top:20px;">
          <button id="btnLoreBack" style="
            font-family:'Rajdhani',sans-serif; font-size:13px;
            padding:10px 30px; border:1px solid rgba(255,255,255,0.1);
            background:transparent; color:#555; cursor:pointer;
          ">BACK</button>
        </div>
      </div>
    `;
    uiLayer.innerHTML = html;
    document.getElementById('btnLoreBack').addEventListener('click', showTitle);
  }

  // --- HELPERS ---
  function clearUI() {
    uiLayer.innerHTML = '';
    currentScreen = null;
  }

  function startAudio() {
    if (!audioStarted) {
      ND.audio.startAmbient();
      audioStarted = true;
    }
  }

  function getEgyptianDate() {
    // Use Egyptian calendar month names based on current month
    const months = ['Thoth','Paopi','Hathor','Koiak','Tobi','Meshir',
                    'Paremhat','Parmouti','Pashons','Paoni','Epip','Mesori'];
    const d = new Date();
    return `${d.getDate()} ${months[d.getMonth()]} — Akhet`;
  }

  return {
    showTitle,
    showCharacterSelect,
    showMatchEnd,
    showRoundAnnounce,
    showTouchControls,
    clearUI,
    getCurrentScreen: () => currentScreen
  };
})();
