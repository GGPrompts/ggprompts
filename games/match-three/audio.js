/* Match-Three Audio — Web Audio API sound effects */
'use strict';

window.MatchAudio = (function () {
  let ctx = null;
  let initialized = false;

  function init() {
    if (initialized) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    initialized = true;
  }

  function ensureCtx() {
    if (!ctx) return false;
    if (ctx.state === 'suspended') ctx.resume();
    return true;
  }

  /* --- Synth helpers --- */
  function playTone(freq, duration, type, gain, detune) {
    if (!ensureCtx()) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    if (detune) osc.detune.value = detune;
    g.gain.setValueAtTime(gain || 0.15, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(g).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  function playNoise(duration, gain) {
    if (!ensureCtx()) return;
    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain || 0.08, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + duration);
    src.connect(g).connect(ctx.destination);
    src.start(now);
  }

  /* --- Sound effects --- */
  const sounds = {
    select() {
      playTone(600, 0.08, 'sine', 0.12);
    },

    swap() {
      playTone(400, 0.1, 'sine', 0.1);
      setTimeout(() => playTone(500, 0.1, 'sine', 0.1), 50);
    },

    invalidSwap() {
      playTone(200, 0.15, 'square', 0.08);
      setTimeout(() => playTone(160, 0.15, 'square', 0.08), 80);
    },

    match(combo) {
      const baseFreq = 500 + (combo || 1) * 80;
      playTone(baseFreq, 0.15, 'sine', 0.12);
      setTimeout(() => playTone(baseFreq * 1.25, 0.12, 'sine', 0.1), 60);
      setTimeout(() => playTone(baseFreq * 1.5, 0.1, 'sine', 0.08), 120);
    },

    specialCreate() {
      playTone(800, 0.2, 'sine', 0.12);
      playTone(1200, 0.3, 'sine', 0.08, 5);
    },

    bomb() {
      playNoise(0.3, 0.12);
      playTone(80, 0.4, 'sine', 0.15);
      playTone(60, 0.5, 'sine', 0.1);
    },

    lineClear() {
      playTone(600, 0.15, 'sawtooth', 0.06);
      setTimeout(() => playTone(900, 0.15, 'sawtooth', 0.06), 50);
      setTimeout(() => playTone(1200, 0.1, 'sawtooth', 0.04), 100);
    },

    fall() {
      playTone(300, 0.06, 'sine', 0.04);
    },

    levelComplete() {
      const notes = [523, 659, 784, 1047];
      notes.forEach((f, i) => {
        setTimeout(() => playTone(f, 0.3, 'sine', 0.1), i * 120);
      });
    },

    gameOver() {
      const notes = [400, 350, 300, 200];
      notes.forEach((f, i) => {
        setTimeout(() => playTone(f, 0.3, 'sine', 0.1), i * 200);
      });
    }
  };

  function play(name, ...args) {
    if (!initialized) return;
    if (sounds[name]) sounds[name](...args);
  }

  return { init, play };
})();
