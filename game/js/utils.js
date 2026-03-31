// ============================================================
// NEO-DUAT — Utility Functions
// ============================================================

const ND = window.ND || {};
window.ND = ND;

// --- Canvas setup ---
ND.canvas = document.getElementById('gameCanvas');
ND.ctx = ND.canvas.getContext('2d');
ND.ui = document.getElementById('uiLayer');
ND.dpr = 1;
ND.W = 0;
ND.H = 0;

ND.resize = function() {
  ND.dpr = Math.min(window.devicePixelRatio || 1, 2);
  ND.W = window.innerWidth;
  ND.H = window.innerHeight;
  ND.canvas.width = ND.W * ND.dpr;
  ND.canvas.height = ND.H * ND.dpr;
  ND.canvas.style.width = ND.W + 'px';
  ND.canvas.style.height = ND.H + 'px';
  ND.ctx.setTransform(ND.dpr, 0, 0, ND.dpr, 0, 0);
  ND.groundY = ND.H * 0.82;
  ND.centerX = ND.W / 2;
};

window.addEventListener('resize', ND.resize);
ND.resize();

// --- Timing ---
ND.time = 0;
ND.dt = 0;
ND.lastTime = 0;
ND.frameCount = 0;

// --- Math helpers ---
ND.lerp = (a, b, t) => a + (b - a) * t;
ND.clamp = (v, min, max) => Math.max(min, Math.min(max, v));
ND.rand = (min, max) => Math.random() * (max - min) + min;
ND.randInt = (min, max) => Math.floor(ND.rand(min, max + 1));
ND.dist = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);
ND.easeOut = (t) => 1 - Math.pow(1 - t, 3);
ND.easeInOut = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// --- Color helpers ---
ND.hsl = (h, s, l, a) => a !== undefined ? `hsla(${h},${s}%,${l}%,${a})` : `hsl(${h},${s}%,${l}%)`;
ND.rgba = (r, g, b, a) => `rgba(${r},${g},${b},${a})`;

ND.hexToRgb = function(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
};

// --- Egyptian hieroglyphs (Unicode) ---
ND.hieroglyphs = [
  '𓀀','𓀁','𓀂','𓀃','𓁀','𓁁','𓁂','𓁃',
  '𓂀','𓂁','𓂂','𓂃','𓂋','𓂧','𓃀','𓃁',
  '𓃭','𓃰','𓃱','𓃲','𓄀','𓄁','𓄂','𓄃',
  '𓅀','𓅁','𓅂','𓅃','𓆀','𓆁','𓆂','𓆃',
  '𓆣','𓆤','𓇋','𓇌','𓇯','𓈖','𓉐','𓊝',
  '𓋴','𓌳'
];

ND.randomHieroglyph = () => ND.hieroglyphs[ND.randInt(0, ND.hieroglyphs.length - 1)];

// --- Persistence ---
ND.save = function(key, val) {
  try { localStorage.setItem('nd_' + key, JSON.stringify(val)); } catch(e) {}
};

ND.load = function(key, fallback) {
  try {
    const v = localStorage.getItem('nd_' + key);
    return v !== null ? JSON.parse(v) : fallback;
  } catch(e) { return fallback; }
};

// --- Input state ---
ND.keys = {};
ND.touches = {};
ND.tapCallbacks = [];

document.addEventListener('keydown', e => { ND.keys[e.code] = true; });
document.addEventListener('keyup', e => { ND.keys[e.code] = false; });

// --- Global state ---
ND.state = 'boot'; // boot, menu, select, story, fight, gameover, shop
ND.prevState = null;

ND.setState = function(newState) {
  ND.prevState = ND.state;
  ND.state = newState;
  if (ND.onStateChange) ND.onStateChange(newState, ND.prevState);
};

// --- Secret tracking ---
ND.secrets = ND.load('secrets', {});
ND.glyphsFound = ND.load('glyphs', []);
ND.totalPlayTime = ND.load('playTime', 0);
ND.matchesPlayed = ND.load('matches', 0);
ND.idleTime = 0;

// --- Player data ---
ND.coins = ND.load('coins', 0);
ND.bestWins = ND.load('bestWins', 0);
ND.ownedSkins = ND.load('skins', {});
ND.adsRemoved = ND.load('adsRemoved', false);

console.log('%c𓂀 NEO-DUAT v0.I.AKHET %c The Digital Afterlife Awaits',
  'color: #ffd700; font-size: 16px; font-weight: bold; background: #000;',
  'color: #48dbfb; font-size: 12px; background: #000;');
