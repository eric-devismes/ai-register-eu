// ============================================================
// AEONS OF DUAT — Core Engine
// SNES-resolution pixel engine with scaling
// ============================================================

const G = window.G = {};

// SNES internal resolution
G.IW = 256;
G.IH = 224;
G.TILE = 16;

// Canvas & scaling
const cv = document.getElementById('c');
const cx = cv.getContext('2d');
G.cx = cx;
G.cv = cv;
G.scale = 1;
G.time = 0;
G.dt = 0;
G.frame = 0;
G.fps = 60;

function resize() {
  const maxW = window.innerWidth;
  const maxH = window.innerHeight - 60; // leave room for mobile controls
  G.scale = Math.max(1, Math.floor(Math.min(maxW / G.IW, maxH / G.IH)));
  cv.width = G.IW * G.scale;
  cv.height = G.IH * G.scale;
  cx.imageSmoothingEnabled = false;
  cx.setTransform(G.scale, 0, 0, G.scale, 0, 0);
}
window.addEventListener('resize', resize);
resize();

// ---- Input ----
G.keys = {};
G.justPressed = {};
G.held = {};

const KEY_MAP = {
  ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
  KeyW: 'up', KeyS: 'down', KeyA: 'left', KeyD: 'right',
  KeyZ: 'confirm', KeyX: 'cancel', Enter: 'confirm', Escape: 'menu',
  Space: 'confirm', KeyC: 'menu', Backspace: 'cancel'
};

document.addEventListener('keydown', e => {
  const k = KEY_MAP[e.code];
  if (k) {
    e.preventDefault();
    if (!G.keys[k]) G.justPressed[k] = true;
    G.keys[k] = true;
  }
});
document.addEventListener('keyup', e => {
  const k = KEY_MAP[e.code];
  if (k) G.keys[k] = false;
});

// Mobile controls
document.querySelectorAll('[data-dir]').forEach(el => {
  const dir = el.dataset.dir;
  const start = () => { if (!G.keys[dir]) G.justPressed[dir] = true; G.keys[dir] = true; };
  const end = () => { G.keys[dir] = false; };
  el.addEventListener('touchstart', e => { e.preventDefault(); start(); }, { passive: false });
  el.addEventListener('touchend', e => { e.preventDefault(); end(); }, { passive: false });
});
document.querySelectorAll('[data-act]').forEach(el => {
  const act = el.dataset.act;
  el.addEventListener('touchstart', e => {
    e.preventDefault();
    G.justPressed[act] = true;
    G.keys[act] = true;
    setTimeout(() => { G.keys[act] = false; }, 100);
  }, { passive: false });
});

// ---- Drawing helpers ----
G.cls = function(color) {
  cx.fillStyle = color || '#000';
  cx.fillRect(0, 0, G.IW, G.IH);
};

G.rect = function(x, y, w, h, color) {
  cx.fillStyle = color;
  cx.fillRect(Math.round(x), Math.round(y), w, h);
};

G.rectOutline = function(x, y, w, h, color) {
  cx.strokeStyle = color;
  cx.lineWidth = 1;
  cx.strokeRect(Math.round(x) + 0.5, Math.round(y) + 0.5, w - 1, h - 1);
};

// Pixel text renderer (built-in, no font needed)
const FONT_W = 5, FONT_H = 7, FONT_GAP = 1;
const CHARS = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,!?:;\'-/+()%"=*#><[]{}@~_&^|\\';

// 5x7 pixel font bitmaps — each char is an array of 7 numbers (each 5 bits wide)
const FONT_DATA = {
  ' ': [0,0,0,0,0,0,0],
  'A': [0b01110,0b10001,0b10001,0b11111,0b10001,0b10001,0b10001],
  'B': [0b11110,0b10001,0b10001,0b11110,0b10001,0b10001,0b11110],
  'C': [0b01110,0b10001,0b10000,0b10000,0b10000,0b10001,0b01110],
  'D': [0b11110,0b10001,0b10001,0b10001,0b10001,0b10001,0b11110],
  'E': [0b11111,0b10000,0b10000,0b11110,0b10000,0b10000,0b11111],
  'F': [0b11111,0b10000,0b10000,0b11110,0b10000,0b10000,0b10000],
  'G': [0b01110,0b10001,0b10000,0b10111,0b10001,0b10001,0b01110],
  'H': [0b10001,0b10001,0b10001,0b11111,0b10001,0b10001,0b10001],
  'I': [0b01110,0b00100,0b00100,0b00100,0b00100,0b00100,0b01110],
  'J': [0b00111,0b00010,0b00010,0b00010,0b00010,0b10010,0b01100],
  'K': [0b10001,0b10010,0b10100,0b11000,0b10100,0b10010,0b10001],
  'L': [0b10000,0b10000,0b10000,0b10000,0b10000,0b10000,0b11111],
  'M': [0b10001,0b11011,0b10101,0b10101,0b10001,0b10001,0b10001],
  'N': [0b10001,0b11001,0b10101,0b10011,0b10001,0b10001,0b10001],
  'O': [0b01110,0b10001,0b10001,0b10001,0b10001,0b10001,0b01110],
  'P': [0b11110,0b10001,0b10001,0b11110,0b10000,0b10000,0b10000],
  'Q': [0b01110,0b10001,0b10001,0b10001,0b10101,0b10010,0b01101],
  'R': [0b11110,0b10001,0b10001,0b11110,0b10100,0b10010,0b10001],
  'S': [0b01110,0b10001,0b10000,0b01110,0b00001,0b10001,0b01110],
  'T': [0b11111,0b00100,0b00100,0b00100,0b00100,0b00100,0b00100],
  'U': [0b10001,0b10001,0b10001,0b10001,0b10001,0b10001,0b01110],
  'V': [0b10001,0b10001,0b10001,0b10001,0b10001,0b01010,0b00100],
  'W': [0b10001,0b10001,0b10001,0b10101,0b10101,0b11011,0b10001],
  'X': [0b10001,0b10001,0b01010,0b00100,0b01010,0b10001,0b10001],
  'Y': [0b10001,0b10001,0b01010,0b00100,0b00100,0b00100,0b00100],
  'Z': [0b11111,0b00001,0b00010,0b00100,0b01000,0b10000,0b11111],
  '0': [0b01110,0b10011,0b10101,0b10101,0b11001,0b10001,0b01110],
  '1': [0b00100,0b01100,0b00100,0b00100,0b00100,0b00100,0b01110],
  '2': [0b01110,0b10001,0b00001,0b00110,0b01000,0b10000,0b11111],
  '3': [0b01110,0b10001,0b00001,0b00110,0b00001,0b10001,0b01110],
  '4': [0b00010,0b00110,0b01010,0b10010,0b11111,0b00010,0b00010],
  '5': [0b11111,0b10000,0b11110,0b00001,0b00001,0b10001,0b01110],
  '6': [0b01110,0b10000,0b10000,0b11110,0b10001,0b10001,0b01110],
  '7': [0b11111,0b00001,0b00010,0b00100,0b01000,0b01000,0b01000],
  '8': [0b01110,0b10001,0b10001,0b01110,0b10001,0b10001,0b01110],
  '9': [0b01110,0b10001,0b10001,0b01111,0b00001,0b00001,0b01110],
  '.': [0,0,0,0,0,0,0b00100],
  ',': [0,0,0,0,0,0b00100,0b01000],
  '!': [0b00100,0b00100,0b00100,0b00100,0b00100,0,0b00100],
  '?': [0b01110,0b10001,0b00001,0b00110,0b00100,0,0b00100],
  ':': [0,0,0b00100,0,0b00100,0,0],
  ';': [0,0,0b00100,0,0b00100,0b01000,0],
  "'": [0b00100,0b00100,0,0,0,0,0],
  '-': [0,0,0,0b11111,0,0,0],
  '/': [0b00001,0b00010,0b00010,0b00100,0b01000,0b01000,0b10000],
  '+': [0,0,0b00100,0b01110,0b00100,0,0],
  '(': [0b00010,0b00100,0b01000,0b01000,0b01000,0b00100,0b00010],
  ')': [0b01000,0b00100,0b00010,0b00010,0b00010,0b00100,0b01000],
  '%': [0b10001,0b00010,0b00010,0b00100,0b01000,0b01000,0b10001],
  '"': [0b01010,0b01010,0,0,0,0,0],
  '=': [0,0,0b11111,0,0b11111,0,0],
  '*': [0,0b10101,0b01110,0b11111,0b01110,0b10101,0],
  '#': [0b01010,0b11111,0b01010,0b01010,0b11111,0b01010,0],
  '>': [0b01000,0b00100,0b00010,0b00001,0b00010,0b00100,0b01000],
  '<': [0b00010,0b00100,0b01000,0b10000,0b01000,0b00100,0b00010],
};

G.text = function(str, x, y, color, shadow) {
  str = String(str).toUpperCase();
  const sx = Math.round(x);
  let px = sx;
  const py = Math.round(y);

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (ch === '\n') { px = sx; continue; }
    const bmp = FONT_DATA[ch];
    if (bmp) {
      for (let row = 0; row < 7; row++) {
        for (let col = 0; col < 5; col++) {
          if (bmp[row] & (1 << (4 - col))) {
            if (shadow) {
              cx.fillStyle = shadow;
              cx.fillRect(px + col + 1, py + row + 1, 1, 1);
            }
            cx.fillStyle = color || '#fff';
            cx.fillRect(px + col, py + row, 1, 1);
          }
        }
      }
    }
    px += FONT_W + FONT_GAP;
  }
};

G.textWidth = function(str) {
  return String(str).length * (FONT_W + FONT_GAP) - FONT_GAP;
};

G.textCenter = function(str, y, color, shadow) {
  const w = G.textWidth(str);
  G.text(str, Math.floor((G.IW - w) / 2), y, color, shadow);
};

// ---- Window / dialog box (FF-style blue gradient) ----
G.window = function(x, y, w, h) {
  x = Math.round(x); y = Math.round(y);
  // Dark blue fill
  cx.fillStyle = '#0a0a3a';
  cx.fillRect(x + 1, y + 1, w - 2, h - 2);
  // Gradient inner
  const grad = cx.createLinearGradient(x, y, x, y + h);
  grad.addColorStop(0, 'rgba(60,60,180,0.3)');
  grad.addColorStop(1, 'rgba(20,20,80,0.3)');
  cx.fillStyle = grad;
  cx.fillRect(x + 2, y + 2, w - 4, h - 4);
  // Border
  cx.strokeStyle = '#6666cc';
  cx.lineWidth = 1;
  cx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  cx.strokeStyle = '#3333aa';
  cx.strokeRect(x + 1.5, y + 1.5, w - 3, h - 3);
};

// ---- Scene manager ----
G.scenes = {};
G.scene = null;
G.sceneData = null;
G.transition = null; // { type, progress, duration, from, to, toData }

G.addScene = function(name, scene) {
  G.scenes[name] = scene;
};

G.goScene = function(name, data, transType) {
  if (transType === 'fade') {
    G.transition = {
      type: 'fade', progress: 0, duration: 30,
      from: G.scene, to: name, toData: data, phase: 'out'
    };
  } else {
    if (G.scene && G.scenes[G.scene].exit) G.scenes[G.scene].exit();
    G.scene = name;
    G.sceneData = data;
    if (G.scenes[name].enter) G.scenes[name].enter(data);
  }
};

// ---- Persistence ----
G.save = (k, v) => { try { localStorage.setItem('aod_' + k, JSON.stringify(v)); } catch(e) {} };
G.load = (k, fb) => { try { const v = localStorage.getItem('aod_' + k); return v ? JSON.parse(v) : fb; } catch(e) { return fb; } };

// ---- Util ----
G.rand = (a, b) => Math.random() * (b - a) + a;
G.randInt = (a, b) => Math.floor(G.rand(a, b + 1));
G.clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
G.lerp = (a, b, t) => a + (b - a) * t;
G.choice = (arr) => arr[G.randInt(0, arr.length - 1)];

// ---- Game state ----
G.party = [];
G.inventory = [];
G.gold = 0;
G.flags = {};
G.playtime = 0;

// ---- Main loop ----
let lastT = performance.now();

function loop(ts) {
  G.dt = Math.min((ts - lastT) / 1000, 0.05);
  lastT = ts;
  G.time += G.dt;
  G.frame++;
  G.playtime += G.dt;

  // Transition
  if (G.transition) {
    const t = G.transition;
    t.progress++;
    const half = Math.floor(t.duration / 2);

    if (t.phase === 'out' && t.progress >= half) {
      if (G.scene && G.scenes[G.scene].exit) G.scenes[G.scene].exit();
      G.scene = t.to;
      G.sceneData = t.toData;
      if (G.scenes[t.to].enter) G.scenes[t.to].enter(t.toData);
      t.phase = 'in';
    }

    // Draw current scene
    if (G.scene && G.scenes[G.scene]) {
      G.scenes[G.scene].update();
      G.scenes[G.scene].draw();
    }

    // Fade overlay
    const alpha = t.phase === 'out'
      ? t.progress / half
      : 1 - (t.progress - half) / half;
    G.rect(0, 0, G.IW, G.IH, `rgba(0,0,0,${G.clamp(alpha, 0, 1)})`);

    if (t.progress >= t.duration) G.transition = null;
  } else if (G.scene && G.scenes[G.scene]) {
    G.scenes[G.scene].update();
    G.scenes[G.scene].draw();
  }

  // Clear justPressed at end of frame
  G.justPressed = {};

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
