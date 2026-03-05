/* Simon Audio Engine — WebAudio tones for each color quadrant */
'use strict';

window.SimonAudio = (function () {
  let ctx = null;

  /* Each quadrant has a distinct frequency (classic Simon tones) */
  const TONES = {
    green:  329.63,  // E4
    red:    261.63,  // C4
    yellow: 220.00,  // A3
    blue:   164.81   // E3
  };

  const FAIL_FREQ = 82.41; // E2 — low buzz for wrong press

  function init() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
  }

  /**
   * Play a tone for a given color.
   * @param {string} color — 'green', 'red', 'yellow', 'blue'
   * @param {number} duration — seconds (default 0.4)
   */
  function playTone(color, duration) {
    if (!ctx) init();
    duration = duration || 0.4;
    const freq = TONES[color];
    if (!freq) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = freq;

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }

  /** Play a buzzer sound for wrong input */
  function playFail() {
    if (!ctx) init();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.value = FAIL_FREQ;

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.8);
  }

  /** Play a rising arpeggio for level-up / success */
  function playSuccess() {
    if (!ctx) init();
    const freqs = [329.63, 392.00, 493.88, 659.26];
    freqs.forEach(function (f, i) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = f;
      const t = ctx.currentTime + i * 0.1;
      gain.gain.setValueAtTime(0.14, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.2);
    });
  }

  /** Play a descending game-over melody */
  function playGameOver() {
    if (!ctx) init();
    const freqs = [392.00, 329.63, 261.63, 196.00];
    freqs.forEach(function (f, i) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = f;
      const t = ctx.currentTime + i * 0.2;
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.35);
    });
  }

  return { init: init, playTone: playTone, playFail: playFail, playSuccess: playSuccess, playGameOver: playGameOver };
})();
