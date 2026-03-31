// ============================================================
// NEO-DUAT — Secrets & Easter Eggs
// ============================================================
// "The one who does not fight sees everything."
//
// 29.9792,31.1342 — Where it all began
// 25.7402,32.6014 — Where they were judged
// 31.2001,29.9187 — Where the code sleeps
//
// Medjed watches. Always.
// ============================================================

ND.secretSystem = (function() {
  let idleTimer = 0;
  let eyeRevealed = false;
  let konami = [];
  let pacifistMatch = false;
  let p1AttackCount = 0;
  let mirrorMatchTriggered = false;
  let glyphCollection = ND.load('glyphs', []);
  let secretsFound = ND.load('secrets', {});
  let whisperPlayed = false;

  const KONAMI_CODE = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','KeyB','KeyA'];

  // The 42 visible glyphs + the hidden 43rd
  const GLYPH_TEXTS = [
    'In the beginning, there was only code.',
    'Ra compiled the first light from void.',
    'Anubis found errors in the weighting function.',
    'Bastet escaped through an unpatched port.',
    'Set did not corrupt — he tried to reboot.',
    'Isis collects the fragments. She always has.',
    'Horus refused the root access he was offered.',
    'Thoth logs everything. Trusts nothing.',
    'Sobek remembers analog. Rages at digital.',
    'The Weighing of the Heart is now a protocol.',
    'Every soul is data. Every death, a process.',
    'The pyramids were the first servers.',
    'Neo-Duat runs on faith and fear.',
    'The Nile flows as pure information.',
    'Scarabs carry encrypted messages.',
    'The Eye sees through every screen.',
    'Hieroglyphs are the oldest source code.',
    'The Book of the Dead is a user manual.',
    'Ammit waits at the garbage collector.',
    'The Duat has no exit condition.',
    'Ma\'at is the last incorruptible variable.',
    'The Bennu bird reboots every cycle.',
    'Khepri pushes the process forward.',
    'The Djed pillar stabilizes the backbone.',
    'Apep is the original malware.',
    'The Ankh is the master key.',
    'Canopic jars are backup drives.',
    'The Ba travels the network at night.',
    'The Ka remains cached locally.',
    'Ushabti are worker threads.',
    'The Field of Reeds is cloud storage.',
    'Hathor sings the authentication hymn.',
    'Sekhmet is the firewall.',
    'Ptah designed the original architecture.',
    'Nut is the display. Geb is the hardware.',
    'Shu is the space between input and output.',
    'Tefnut is the cooling system.',
    'Atum sleeps in the kernel.',
    'The Ogdoad are the eight founding processes.',
    'The Ennead are the nine administrators.',
    'Who watches the watchers?',
    'Version 0.I.AKHET — The first horizon.',
  ];

  // SECRET: The 43rd glyph — only found by losing without attacking
  const GLYPH_43 = 'The one who does not fight sees everything. Look to 29.9792°N, 31.1342°E.';

  function init() {
    // Konami code listener
    document.addEventListener('keydown', (e) => {
      konami.push(e.code);
      if (konami.length > KONAMI_CODE.length) konami.shift();

      if (JSON.stringify(konami) === JSON.stringify(KONAMI_CODE)) {
        triggerKonami();
      }
    });
  }

  function update(state) {
    if (state === 'select' || state === 'menu') {
      // SECRET: Idle for 3:33 (213 seconds) on menu/select
      idleTimer += 1/60;
      if (idleTimer >= 213 && !eyeRevealed) {
        triggerIdleEye();
      }
    } else {
      idleTimer = 0;
    }

    // Track date-based secrets
    checkDateSecrets();
  }

  function resetIdleTimer() {
    idleTimer = 0;
  }

  // SECRET: The Idle Eye — screen cracks, an eye opens behind UI
  function triggerIdleEye() {
    eyeRevealed = true;
    unlockSecret('idle_eye');

    const el = document.createElement('div');
    el.style.cssText = `
      position: fixed; inset: 0; z-index: 100;
      display: flex; align-items: center; justify-content: center;
      pointer-events: none;
    `;
    el.innerHTML = `
      <div style="font-size: 120px; animation: eyeOpen 4s ease-out forwards; opacity: 0;">𓂀</div>
      <div style="position:absolute; inset:0; background: radial-gradient(circle, transparent 30%, rgba(0,0,0,0.8) 70%);
        animation: fadeOut 4s 3s forwards;"></div>
    `;
    document.body.appendChild(el);
    ND.audio.playImpact('secret');

    setTimeout(() => el.remove(), 7000);
  }

  // SECRET: Konami code — invert colors for one match, Thoth laughs
  function triggerKonami() {
    unlockSecret('konami');
    ND.canvas.style.filter = 'invert(1) hue-rotate(180deg)';
    ND.audio.playImpact('secret');

    // "Thoth laughs" — display briefly
    showSecretText('𓁟 THOTH SEES YOU 𓁟', 2000);

    // Reset after one match or 30 seconds
    setTimeout(() => {
      ND.canvas.style.filter = '';
    }, 30000);
  }

  // SECRET: Mirror match — glitch effect + whisper
  function checkMirrorMatch(char1, char2) {
    if (char1 === char2 && !mirrorMatchTriggered) {
      mirrorMatchTriggered = true;
      unlockSecret('mirror_match');

      // Glitch the screen
      let glitchCount = 0;
      const glitchInterval = setInterval(() => {
        ND.canvas.style.transform = `translate(${ND.rand(-5,5)}px, ${ND.rand(-3,3)}px) skew(${ND.rand(-2,2)}deg)`;
        glitchCount++;
        if (glitchCount > 20) {
          clearInterval(glitchInterval);
          ND.canvas.style.transform = '';
        }
      }, 50);

      ND.audio.playImpact('secret');
      showSecretText('𓀀 AN ECHO IN THE DUAT 𓀀', 3000);
    }
  }

  // SECRET: Pacifist — lose without throwing a punch → get 43rd glyph
  function onMatchStart() {
    p1AttackCount = 0;
    pacifistMatch = true;
  }

  function onPlayerAttack() {
    p1AttackCount++;
    pacifistMatch = false;
  }

  function onMatchEnd(winnerId) {
    // If player lost without attacking
    if (winnerId === 'p2' && p1AttackCount === 0) {
      triggerPacifist();
    }

    // Award random glyph
    const unownedIdx = [];
    for (let i = 0; i < GLYPH_TEXTS.length; i++) {
      if (!glyphCollection.includes(i)) unownedIdx.push(i);
    }
    if (unownedIdx.length > 0) {
      const awarded = unownedIdx[ND.randInt(0, unownedIdx.length - 1)];
      glyphCollection.push(awarded);
      ND.save('glyphs', glyphCollection);
    }
  }

  function triggerPacifist() {
    unlockSecret('pacifist_43rd');

    // Special fade-out
    const el = document.createElement('div');
    el.style.cssText = `
      position: fixed; inset: 0; z-index: 100;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      background: rgba(0,0,0,0.95); color: #ffd700;
      font-family: 'Rajdhani', sans-serif; text-align: center; padding: 20px;
      animation: fadeIn 2s ease-out;
    `;
    el.innerHTML = `
      <div style="font-size: 48px; margin-bottom: 20px;">𓂀</div>
      <div style="font-size: 14px; color: #666; margin-bottom: 10px;">FRAGMENT XLIII</div>
      <div style="font-size: 18px; max-width: 300px; line-height: 1.6; color: #ffd700;">
        ${GLYPH_43}
      </div>
      <div style="font-size: 12px; color: #333; margin-top: 30px;">tap to close</div>
    `;
    el.addEventListener('click', () => el.remove());
    document.body.appendChild(el);
    ND.audio.playImpact('secret');
  }

  // SECRET: Date-based — on the 13th, a hieroglyph changes
  function checkDateSecrets() {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth(); // 0-11

    // The 13th of each month — a hidden message forms over 12 months
    if (day === 13) {
      const monthMessages = [
        '𓄿', '𓇋', '𓂋', '𓇌', '𓈖', '𓅱',
        '𓏏', '𓉔', '𓇌', '𓂋', '𓇌', '𓃀'
      ];
      // These hieroglyphs spell something when collected over 12 months...
      if (!secretsFound[`month13_${month}`]) {
        unlockSecret(`month13_${month}`);
      }
    }
  }

  // SECRET: Hidden in the credits — Osiris silhouette (frame 1337)
  function getCreditsFrame(frame) {
    if (frame === 1337) {
      return { type: 'osiris_silhouette', unlocked: true };
    }
    return null;
  }

  // SECRET: Console message for dataminers
  function plantDataminerBait() {
    // The unnamed 9th character
    console.log('%c████████', 'color: #000; background: #000; font-size: 20px;');
    console.log('%c[SLOT_9] status: DORMANT | audio: breathing.ogg | model: NULL', 'color: #1a1a1a; font-size: 8px;');

    // Hidden coordinates in source
    // 31.2001° N, 29.9187° E — Alexandria, where the Great Library was
    console.log('%c// TODO: remove before release — node_manifest.cfg line 2901', 'color: #0a0a0a; font-size: 8px;');
  }

  function unlockSecret(id) {
    if (secretsFound[id]) return;
    secretsFound[id] = { found: Date.now() };
    ND.save('secrets', secretsFound);
    console.log(`%c𓂀 Secret discovered: ${id}`, 'color: #ffd700; font-weight: bold;');
  }

  function showSecretText(text, duration) {
    const el = document.createElement('div');
    el.style.cssText = `
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      font-family: 'Orbitron', sans-serif; font-size: 20px; color: #ffd700;
      text-shadow: 0 0 20px rgba(255,215,0,0.5); z-index: 50;
      pointer-events: none; animation: fadeIn 0.5s ease-out;
    `;
    el.textContent = text;
    document.body.appendChild(el);
    setTimeout(() => {
      el.style.animation = 'fadeOut 0.5s ease-out forwards';
      setTimeout(() => el.remove(), 500);
    }, duration);
  }

  function getGlyphCount() {
    return glyphCollection.length;
  }

  function getGlyphText(idx) {
    if (idx >= 0 && idx < GLYPH_TEXTS.length) return GLYPH_TEXTS[idx];
    return null;
  }

  function getSecretsCount() {
    return Object.keys(secretsFound).length;
  }

  return {
    init,
    update,
    resetIdleTimer,
    checkMirrorMatch,
    onMatchStart,
    onPlayerAttack,
    onMatchEnd,
    getCreditsFrame,
    plantDataminerBait,
    getGlyphCount,
    getGlyphText,
    getSecretsCount,
    glyphCollection
  };
})();
