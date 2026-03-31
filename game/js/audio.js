// ============================================================
// NEO-DUAT — Procedural Dark Minimal Techno Audio Engine
// Boris Brejcha-inspired: minimal, dark, melodic, hypnotic
// ============================================================

ND.audio = (function() {
  let actx = null;
  let master = null;
  let compressor = null;
  let playing = false;
  let bpm = 128;
  let beatTime = 60 / bpm;
  let barTime = beatTime * 4;
  let nextBeatTime = 0;
  let beatCount = 0;
  let intensity = 0.3; // 0-1, ramps with fight intensity
  let schedulerTimer = null;

  // --- Synth nodes ---
  let kickGain, bassGain, hihatGain, padGain, leadGain, fxGain;

  // Egyptian scale: D E F A Bb (Phrygian-ish, dark & mysterious)
  const SCALE = [62, 64, 65, 69, 70, 74, 76, 77]; // MIDI notes
  const midiToFreq = (n) => 440 * Math.pow(2, (n - 69) / 12);

  function init() {
    if (actx) return;
    actx = new (window.AudioContext || window.webkitAudioContext)();

    // Master chain: compressor -> gain -> destination
    compressor = actx.createDynamicsCompressor();
    compressor.threshold.value = -12;
    compressor.ratio.value = 4;

    master = actx.createGain();
    master.gain.value = 0.7;
    master.connect(compressor);
    compressor.connect(actx.destination);

    // Sub-buses
    kickGain = createBus(0.8);
    bassGain = createBus(0.35);
    hihatGain = createBus(0.15);
    padGain = createBus(0.2);
    leadGain = createBus(0.12);
    fxGain = createBus(0.3);
  }

  function createBus(vol) {
    const g = actx.createGain();
    g.gain.value = vol;
    g.connect(master);
    return g;
  }

  // --- KICK (deep, punchy 909-style) ---
  function scheduleKick(time) {
    const osc = actx.createOscillator();
    const g = actx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(30, time + 0.12);
    g.gain.setValueAtTime(1, time);
    g.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
    osc.connect(g);
    g.connect(kickGain);
    osc.start(time);
    osc.stop(time + 0.4);

    // Click layer
    const click = actx.createOscillator();
    const cg = actx.createGain();
    click.type = 'square';
    click.frequency.setValueAtTime(1200, time);
    click.frequency.exponentialRampToValueAtTime(100, time + 0.02);
    cg.gain.setValueAtTime(0.3, time);
    cg.gain.exponentialRampToValueAtTime(0.001, time + 0.03);
    click.connect(cg);
    cg.connect(kickGain);
    click.start(time);
    click.stop(time + 0.05);
  }

  // --- BASS (dark, pulsing sub) ---
  function scheduleBass(time, note) {
    const freq = midiToFreq(note - 12); // One octave down
    const osc = actx.createOscillator();
    const g = actx.createGain();
    const filter = actx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.value = freq;

    filter.type = 'lowpass';
    filter.frequency.value = 200 + intensity * 600;
    filter.Q.value = 5;

    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(0.6, time + 0.05);
    g.gain.linearRampToValueAtTime(0.3, time + beatTime * 0.8);
    g.gain.linearRampToValueAtTime(0, time + beatTime);

    osc.connect(filter);
    filter.connect(g);
    g.connect(bassGain);
    osc.start(time);
    osc.stop(time + beatTime + 0.1);
  }

  // --- HI-HAT (metallic, tight) ---
  function scheduleHihat(time, open) {
    const bufferSize = actx.sampleRate * (open ? 0.15 : 0.05);
    const buffer = actx.createBuffer(1, bufferSize, actx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, open ? 2 : 8);
    }

    const src = actx.createBufferSource();
    const g = actx.createGain();
    const filter = actx.createBiquadFilter();

    src.buffer = buffer;
    filter.type = 'highpass';
    filter.frequency.value = 7000;
    g.gain.value = open ? 0.4 : 0.6;

    src.connect(filter);
    filter.connect(g);
    g.connect(hihatGain);
    src.start(time);
  }

  // --- PAD (dark atmospheric, reverb-like) ---
  function schedulePad(time, notes, duration) {
    notes.forEach(note => {
      const freq = midiToFreq(note);
      const osc = actx.createOscillator();
      const osc2 = actx.createOscillator();
      const g = actx.createGain();
      const filter = actx.createBiquadFilter();

      osc.type = 'sine';
      osc2.type = 'triangle';
      osc.frequency.value = freq;
      osc2.frequency.value = freq * 1.002; // Slight detune for width

      filter.type = 'lowpass';
      filter.frequency.value = 1000 + intensity * 2000;

      g.gain.setValueAtTime(0, time);
      g.gain.linearRampToValueAtTime(0.15, time + duration * 0.3);
      g.gain.linearRampToValueAtTime(0.1, time + duration * 0.7);
      g.gain.linearRampToValueAtTime(0, time + duration);

      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(g);
      g.connect(padGain);
      osc.start(time);
      osc2.start(time);
      osc.stop(time + duration + 0.1);
      osc2.stop(time + duration + 0.1);
    });
  }

  // --- LEAD (ney flute simulation — filtered sine with vibrato) ---
  function scheduleLead(time, note, duration) {
    const freq = midiToFreq(note);
    const osc = actx.createOscillator();
    const vibrato = actx.createOscillator();
    const vibratoGain = actx.createGain();
    const g = actx.createGain();
    const filter = actx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.value = freq;

    vibrato.type = 'sine';
    vibrato.frequency.value = 5;
    vibratoGain.gain.value = 3;
    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc.frequency);

    filter.type = 'bandpass';
    filter.frequency.value = freq * 2;
    filter.Q.value = 2;

    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(0.3, time + 0.1);
    g.gain.setValueAtTime(0.25, time + duration * 0.5);
    g.gain.linearRampToValueAtTime(0, time + duration);

    osc.connect(filter);
    filter.connect(g);
    g.connect(leadGain);
    vibrato.start(time);
    osc.start(time);
    osc.stop(time + duration + 0.1);
    vibrato.stop(time + duration + 0.1);
  }

  // --- FX: Impact hit ---
  function playImpact(type) {
    if (!actx) return;
    const now = actx.currentTime;

    if (type === 'hit') {
      const osc = actx.createOscillator();
      const g = actx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.1);
      g.gain.setValueAtTime(0.4, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(g);
      g.connect(fxGain);
      osc.start(now);
      osc.stop(now + 0.2);
    }

    if (type === 'heavy') {
      const osc = actx.createOscillator();
      const g = actx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);
      g.gain.setValueAtTime(0.5, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(g);
      g.connect(fxGain);
      osc.start(now);
      osc.stop(now + 0.35);

      // Sub rumble
      const sub = actx.createOscillator();
      const sg = actx.createGain();
      sub.type = 'sine';
      sub.frequency.value = 35;
      sg.gain.setValueAtTime(0.6, now);
      sg.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      sub.connect(sg);
      sg.connect(fxGain);
      sub.start(now);
      sub.stop(now + 0.5);
    }

    if (type === 'special') {
      // Reversed reverb whoosh
      for (let i = 0; i < 5; i++) {
        const osc = actx.createOscillator();
        const g = actx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 200 + i * 300;
        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(0.15, now + 0.3);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.connect(g);
        g.connect(fxGain);
        osc.start(now);
        osc.stop(now + 0.6);
      }
    }

    if (type === 'ko') {
      // Bass drop + silence
      const osc = actx.createOscillator();
      const g = actx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.exponentialRampToValueAtTime(20, now + 1);
      g.gain.setValueAtTime(0.8, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
      osc.connect(g);
      g.connect(fxGain);
      osc.start(now);
      osc.stop(now + 1.5);
    }

    if (type === 'block') {
      const bufferSize = actx.sampleRate * 0.08;
      const buffer = actx.createBuffer(1, bufferSize, actx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 4);
      }
      const src = actx.createBufferSource();
      const g = actx.createGain();
      src.buffer = buffer;
      g.gain.value = 0.3;
      src.connect(g);
      g.connect(fxGain);
      src.start(now);
    }

    if (type === 'secret') {
      // Eerie chime
      [523, 659, 784, 1047].forEach((f, i) => {
        const osc = actx.createOscillator();
        const g = actx.createGain();
        osc.type = 'sine';
        osc.frequency.value = f;
        g.gain.setValueAtTime(0, now + i * 0.15);
        g.gain.linearRampToValueAtTime(0.2, now + i * 0.15 + 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.8);
        osc.connect(g);
        g.connect(fxGain);
        osc.start(now + i * 0.15);
        osc.stop(now + i * 0.15 + 1);
      });
    }
  }

  // --- SEQUENCER ---
  let melodyPattern = [];
  let currentBar = 0;

  function generateMelody() {
    melodyPattern = [];
    const len = 8;
    for (let i = 0; i < len; i++) {
      if (Math.random() < 0.6) {
        melodyPattern.push(SCALE[ND.randInt(0, SCALE.length - 1)]);
      } else {
        melodyPattern.push(null); // rest
      }
    }
  }

  function scheduleBeat(beatNum, time) {
    const bar = Math.floor(beatNum / 4);
    const beat = beatNum % 4;
    const eighth = beatNum % 2;

    // Kick: every beat, sometimes skip beat 3 for groove
    if (beat !== 3 || Math.random() < 0.3 + intensity * 0.5) {
      scheduleKick(time);
    }

    // Hi-hat: every 8th note when intensity > 0.3
    if (intensity > 0.3) {
      scheduleHihat(time, beat === 2);
      if (intensity > 0.6) {
        scheduleHihat(time + beatTime / 2, false); // 16th note
      }
    }

    // Bass: beats 0 and 2
    if (beat === 0 || beat === 2) {
      const bassNote = SCALE[bar % SCALE.length];
      scheduleBass(time, bassNote);
    }

    // Pad: every 4 bars, play chord
    if (beat === 0 && bar % 4 === 0) {
      const root = SCALE[bar % SCALE.length];
      schedulePad(time, [root, root + 5, root + 7], barTime * 4);
    }

    // Lead melody: when intensity > 0.5
    if (intensity > 0.5 && beat % 2 === 0) {
      const noteIdx = beatNum % melodyPattern.length;
      const note = melodyPattern[noteIdx];
      if (note) {
        scheduleLead(time, note + 12, beatTime * 0.8);
      }
    }

    // Regenerate melody every 8 bars
    if (beat === 0 && bar % 8 === 0) {
      generateMelody();
    }

    currentBar = bar;
  }

  function scheduler() {
    if (!playing || !actx) return;
    const now = actx.currentTime;

    while (nextBeatTime < now + 0.2) {
      scheduleBeat(beatCount, nextBeatTime);
      nextBeatTime += beatTime;
      beatCount++;
    }

    schedulerTimer = setTimeout(scheduler, 25);
  }

  // --- Public API ---
  return {
    init,

    start(startBpm) {
      init();
      if (actx.state === 'suspended') actx.resume();
      bpm = startBpm || 128;
      beatTime = 60 / bpm;
      barTime = beatTime * 4;
      beatCount = 0;
      nextBeatTime = actx.currentTime + 0.1;
      playing = true;
      generateMelody();
      scheduler();
    },

    stop() {
      playing = false;
      if (schedulerTimer) clearTimeout(schedulerTimer);
    },

    setIntensity(v) {
      intensity = ND.clamp(v, 0, 1);
    },

    setBpm(newBpm) {
      bpm = newBpm;
      beatTime = 60 / bpm;
      barTime = beatTime * 4;
    },

    playImpact,

    // Menu ambient drone
    startAmbient() {
      init();
      if (actx.state === 'suspended') actx.resume();
      const now = actx.currentTime;
      schedulePad(now, [50, 57, 62], 20);
      // Subtle kick every 2 seconds
      let t = now;
      for (let i = 0; i < 10; i++) {
        scheduleKick(t);
        t += 2;
      }
    },

    getContext() { return actx; },
    isPlaying() { return playing; }
  };
})();
