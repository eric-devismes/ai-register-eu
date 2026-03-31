// ============================================================
// AEONS OF DUAT — SNES-Style Procedural Audio
// Chiptune + space synth + Egyptian scales
// ============================================================

G.audio = (function() {
  let ctx = null;
  let master = null;
  let playing = null;
  let loopTimer = null;

  // D Phrygian scale (dark, Egyptian feel): D Eb F G A Bb C
  const SCALE = [62, 63, 65, 67, 69, 70, 72]; // MIDI
  const freq = n => 440 * Math.pow(2, (n - 69) / 12);

  function init() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = 0.4;
    master.connect(ctx.destination);
  }

  function resume() {
    if (ctx && ctx.state === 'suspended') ctx.resume();
  }

  // --- Square wave (SNES-like) ---
  function square(f, start, dur, vol, dest) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'square';
    o.frequency.value = f;
    g.gain.setValueAtTime(vol, start);
    g.gain.linearRampToValueAtTime(0, start + dur);
    o.connect(g); g.connect(dest || master);
    o.start(start); o.stop(start + dur + 0.01);
  }

  // --- Triangle wave (bass) ---
  function tri(f, start, dur, vol, dest) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'triangle';
    o.frequency.value = f;
    g.gain.setValueAtTime(vol, start);
    g.gain.linearRampToValueAtTime(0, start + dur * 0.9);
    o.connect(g); g.connect(dest || master);
    o.start(start); o.stop(start + dur + 0.01);
  }

  // --- Noise (hi-hat/snare) ---
  function noise(start, dur, vol) {
    const bufLen = ctx.sampleRate * dur;
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i/bufLen, 3);
    const src = ctx.createBufferSource();
    const g = ctx.createGain();
    const hp = ctx.createBiquadFilter();
    src.buffer = buf;
    hp.type = 'highpass'; hp.frequency.value = 5000;
    g.gain.value = vol;
    src.connect(hp); hp.connect(g); g.connect(master);
    src.start(start);
  }

  // --- Music patterns ---
  const TRACKS = {
    title: { bpm: 90, loop: true, gen: genTitle },
    explore: { bpm: 110, loop: true, gen: genExplore },
    battle: { bpm: 140, loop: true, gen: genBattle },
    boss: { bpm: 155, loop: true, gen: genBoss },
    victory: { bpm: 120, loop: false, gen: genVictory },
    gameover: { bpm: 70, loop: false, gen: genGameover },
  };

  function genTitle(t, beat) {
    const bt = 60 / 90;
    // Slow, atmospheric pad
    const notes = [SCALE[0], SCALE[2], SCALE[4]]; // D F A (minor chord)
    notes.forEach(n => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = freq(n - 12);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.06, t + bt);
      g.gain.linearRampToValueAtTime(0.04, t + bt * 3);
      g.gain.linearRampToValueAtTime(0, t + bt * 4);
      o.connect(g); g.connect(master);
      o.start(t); o.stop(t + bt * 4 + 0.1);
    });

    // Melody every 2 beats
    if (beat % 2 === 0) {
      const n = SCALE[(beat / 2) % SCALE.length];
      square(freq(n + 12), t + bt * 0.5, bt * 1.5, 0.05);
    }

    // Gentle kick
    if (beat % 4 === 0) {
      tri(60, t, 0.3, 0.12);
    }
    return bt * 4;
  }

  function genExplore(t, beat) {
    const bt = 60 / 110;
    const bar = Math.floor(beat / 4);

    // Bass: root note every beat
    const bassNote = SCALE[bar % SCALE.length];
    tri(freq(bassNote - 24), t, bt * 0.8, 0.15);

    // Kick on 1 and 3
    if (beat % 4 === 0 || beat % 4 === 2) {
      tri(50, t, 0.15, 0.1);
    }

    // Hi-hat on every beat
    noise(t, 0.04, 0.04);
    // Off-beat hat
    noise(t + bt / 2, 0.03, 0.02);

    // Melody: arpeggiate scale
    if (beat % 2 === 0) {
      const n = SCALE[(beat + bar * 3) % SCALE.length];
      square(freq(n), t, bt * 0.6, 0.04);
    }
    if (beat % 4 === 1) {
      const n = SCALE[(beat + bar * 2 + 3) % SCALE.length];
      square(freq(n + 12), t, bt * 0.4, 0.03);
    }

    // Pad chord every 4 beats
    if (beat % 4 === 0) {
      [0, 2, 4].forEach(i => {
        const n = SCALE[(bar + i) % SCALE.length];
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.value = freq(n);
        g.gain.setValueAtTime(0.02, t);
        g.gain.linearRampToValueAtTime(0, t + bt * 4);
        o.connect(g); g.connect(master);
        o.start(t); o.stop(t + bt * 4 + 0.1);
      });
    }

    return bt;
  }

  function genBattle(t, beat) {
    const bt = 60 / 140;
    const bar = Math.floor(beat / 4);

    // Driving bass
    const bassNote = SCALE[bar % SCALE.length];
    tri(freq(bassNote - 24), t, bt * 0.5, 0.18);
    if (beat % 2 === 0) {
      tri(freq(bassNote - 12), t + bt * 0.5, bt * 0.3, 0.1);
    }

    // Kick every beat
    tri(45, t, 0.12, 0.15);

    // Snare on 2 and 4
    if (beat % 4 === 1 || beat % 4 === 3) {
      noise(t, 0.1, 0.12);
    }

    // Hi-hat
    noise(t, 0.03, 0.05);
    noise(t + bt/2, 0.02, 0.03);

    // Aggressive melody
    const melodySeq = [0,2,4,6,4,2,0,3];
    const noteIdx = melodySeq[beat % melodySeq.length];
    square(freq(SCALE[noteIdx] + 12), t, bt * 0.4, 0.06);

    // Counter melody every 2 beats
    if (beat % 2 === 1) {
      const n2 = SCALE[(noteIdx + 3) % SCALE.length];
      square(freq(n2 + 24), t, bt * 0.3, 0.03);
    }

    return bt;
  }

  function genBoss(t, beat) {
    const bt = 60 / 155;
    const bar = Math.floor(beat / 4);

    // Heavier bass
    const bassNote = SCALE[(bar * 2) % SCALE.length];
    tri(freq(bassNote - 24), t, bt * 0.7, 0.2);

    // Double kick
    tri(40, t, 0.1, 0.18);
    if (beat % 2 === 0) tri(40, t + bt * 0.5, 0.08, 0.12);

    // Snare on 2 and 4, with ghost notes
    if (beat % 4 === 1 || beat % 4 === 3) noise(t, 0.12, 0.15);
    if (beat % 4 === 0 && bar % 2 === 1) noise(t + bt * 0.75, 0.06, 0.06);

    // Fast hats
    noise(t, 0.025, 0.06);
    noise(t + bt/2, 0.02, 0.04);
    if (beat % 2 === 0) noise(t + bt/4, 0.015, 0.03);

    // Chaotic melody
    const mSeq = [0,6,3,5,1,4,2,6];
    const n = SCALE[mSeq[beat % 8]];
    square(freq(n + 12), t, bt * 0.3, 0.07);

    if (beat % 3 === 0) {
      square(freq(n + 24), t + bt * 0.25, bt * 0.2, 0.04);
    }

    return bt;
  }

  function genVictory(t, beat) {
    const bt = 60 / 120;
    if (beat < 8) {
      // Fanfare
      const fanfare = [0,0,2,2,4,4,6,4];
      const n = SCALE[fanfare[beat]];
      square(freq(n + 12), t, bt * 0.8, 0.08);
      if (beat % 2 === 0) tri(freq(n - 12), t, bt * 0.6, 0.1);
      if (beat === 0 || beat === 4) tri(50, t, 0.2, 0.12);
    }
    return bt;
  }

  function genGameover(t, beat) {
    const bt = 60 / 70;
    if (beat < 6) {
      const notes = [6,5,4,3,2,0];
      const n = SCALE[notes[beat]];
      square(freq(n), t, bt * 1.5, 0.05);
      tri(freq(n - 12), t, bt * 1.2, 0.06);
    }
    return bt;
  }

  // --- Playback ---
  function play(trackName) {
    init(); resume();
    if (playing === trackName) return;
    stop();
    playing = trackName;
    const track = TRACKS[trackName];
    if (!track) return;

    let beat = 0;
    let nextTime = ctx.currentTime + 0.1;

    function schedule() {
      if (playing !== trackName) return;
      const now = ctx.currentTime;
      while (nextTime < now + 0.3) {
        const dur = track.gen(nextTime, beat);
        nextTime += dur;
        beat++;
        if (!track.loop && beat > 32) { playing = null; return; }
        if (track.loop && beat > 128) beat = 0;
      }
      loopTimer = setTimeout(schedule, 50);
    }
    schedule();
  }

  function stop() {
    playing = null;
    if (loopTimer) { clearTimeout(loopTimer); loopTimer = null; }
  }

  // --- SFX ---
  function sfx(type) {
    init(); resume();
    const t = ctx.currentTime;

    switch(type) {
      case 'confirm':
        square(freq(72), t, 0.06, 0.08);
        square(freq(76), t + 0.06, 0.08, 0.08);
        break;
      case 'cancel':
        square(freq(65), t, 0.08, 0.06);
        square(freq(60), t + 0.06, 0.1, 0.06);
        break;
      case 'cursor':
        square(freq(80), t, 0.03, 0.04);
        break;
      case 'hit':
        noise(t, 0.08, 0.15);
        tri(100, t, 0.1, 0.12);
        break;
      case 'crit':
        noise(t, 0.12, 0.2);
        tri(60, t, 0.15, 0.18);
        square(freq(84), t + 0.05, 0.1, 0.06);
        break;
      case 'heal':
        square(freq(72), t, 0.1, 0.05);
        square(freq(76), t + 0.1, 0.1, 0.05);
        square(freq(79), t + 0.2, 0.15, 0.05);
        break;
      case 'magic':
        for (let i = 0; i < 5; i++) {
          square(freq(72 + i * 4), t + i * 0.04, 0.08, 0.04);
        }
        break;
      case 'death':
        tri(200, t, 0.3, 0.1);
        tri(100, t + 0.1, 0.3, 0.08);
        noise(t, 0.3, 0.08);
        break;
      case 'chest':
        for (let i = 0; i < 4; i++) {
          square(freq(60 + i * 5), t + i * 0.08, 0.12, 0.06);
        }
        break;
      case 'save':
        [0,2,4,6].forEach((n,i) => {
          square(freq(SCALE[n] + 12), t + i * 0.12, 0.15, 0.05);
        });
        break;
      case 'encounter':
        noise(t, 0.15, 0.12);
        square(freq(62), t, 0.08, 0.1);
        square(freq(65), t + 0.08, 0.08, 0.1);
        square(freq(69), t + 0.16, 0.15, 0.1);
        break;
    }
  }

  return { play, stop, sfx, init, resume };
})();
