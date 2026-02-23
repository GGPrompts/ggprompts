/**
 * SFXEngine — Web Audio API synthesis engine for sfxr-style sound effects.
 * DOM-free. Generates sounds from parameter objects and exports WAV/JSON.
 *
 * Global IIFE: window.SFXEngine
 */
var SFXEngine = (function () {
  "use strict";

  var ctx = null;
  var sampleRate = 44100;

  // ── Default parameter template ─────────────────────────────────────
  var DEFAULTS = {
    waveform: "square",     // sine, square, sawtooth, triangle, noise, pulse
    pulseWidth: 0.5,        // duty cycle for pulse wave (0.1 - 0.9)

    // Envelope
    attackTime: 0.0,        // 0 - 1 seconds
    sustainTime: 0.3,       // 0 - 1 seconds
    decayTime: 0.2,         // 0 - 1 seconds
    releaseTime: 0.1,       // 0 - 1 seconds
    sustainPunch: 0.0,      // 0 - 1 extra volume at sustain start

    // Frequency
    startFreq: 440,         // 20 - 8000 Hz
    minFreq: 0,             // 0 - 8000 Hz (cutoff: stop sound if freq drops below)
    freqSlide: 0.0,         // -1 to 1 (octaves/sec, negative = slide down)
    freqDeltaSlide: 0.0,    // -1 to 1 (acceleration of slide)

    // Vibrato
    vibratoDepth: 0.0,      // 0 - 1
    vibratoSpeed: 0.0,      // 0 - 40 Hz

    // Arpeggiation
    arpMultiplier: 1.0,     // 0.1 - 4.0 (freq multiplier at arp time)
    arpSpeed: 0.0,          // 0 - 1 seconds (time to apply arp change)

    // Filters
    lpfFreq: 20000,         // 20 - 20000 Hz
    lpfResonance: 0.0,      // 0 - 20
    hpfFreq: 0,             // 0 - 20000 Hz

    // Phaser
    phaserOffset: 0.0,      // -1 to 1
    phaserSweep: 0.0,       // -1 to 1

    // Output
    volume: 0.5,            // 0 - 1
    compression: 0.0        // 0 - 1 (soft clipping amount)
  };

  // ── Parameter metadata for UI ──────────────────────────────────────
  var PARAM_META = {
    waveform:       { type: "enum", values: ["sine","square","sawtooth","triangle","noise","pulse"], group: "Waveform", label: "Waveform" },
    pulseWidth:     { type: "range", min: 0.1, max: 0.9, step: 0.01, group: "Waveform", label: "Pulse Width" },

    attackTime:     { type: "range", min: 0, max: 1, step: 0.001, group: "Envelope", label: "Attack" },
    sustainTime:    { type: "range", min: 0, max: 1, step: 0.001, group: "Envelope", label: "Sustain" },
    decayTime:      { type: "range", min: 0, max: 1, step: 0.001, group: "Envelope", label: "Decay" },
    releaseTime:    { type: "range", min: 0, max: 1, step: 0.001, group: "Envelope", label: "Release" },
    sustainPunch:   { type: "range", min: 0, max: 1, step: 0.01, group: "Envelope", label: "Sustain Punch" },

    startFreq:      { type: "range", min: 20, max: 8000, step: 1, group: "Frequency", label: "Start Freq" },
    minFreq:        { type: "range", min: 0, max: 8000, step: 1, group: "Frequency", label: "Min Freq" },
    freqSlide:      { type: "range", min: -1, max: 1, step: 0.001, group: "Frequency", label: "Slide" },
    freqDeltaSlide: { type: "range", min: -1, max: 1, step: 0.001, group: "Frequency", label: "Delta Slide" },

    vibratoDepth:   { type: "range", min: 0, max: 1, step: 0.01, group: "Vibrato", label: "Depth" },
    vibratoSpeed:   { type: "range", min: 0, max: 40, step: 0.1, group: "Vibrato", label: "Speed" },

    arpMultiplier:  { type: "range", min: 0.1, max: 4.0, step: 0.01, group: "Arpeggiation", label: "Multiplier" },
    arpSpeed:       { type: "range", min: 0, max: 1, step: 0.001, group: "Arpeggiation", label: "Speed" },

    lpfFreq:        { type: "range", min: 20, max: 20000, step: 1, group: "Filters", label: "Lowpass Freq" },
    lpfResonance:   { type: "range", min: 0, max: 20, step: 0.1, group: "Filters", label: "LP Resonance" },
    hpfFreq:        { type: "range", min: 0, max: 20000, step: 1, group: "Filters", label: "Highpass Freq" },

    phaserOffset:   { type: "range", min: -1, max: 1, step: 0.01, group: "Phaser", label: "Offset" },
    phaserSweep:    { type: "range", min: -1, max: 1, step: 0.01, group: "Phaser", label: "Sweep" },

    volume:         { type: "range", min: 0, max: 1, step: 0.01, group: "Output", label: "Volume" },
    compression:    { type: "range", min: 0, max: 1, step: 0.01, group: "Output", label: "Compression" }
  };

  // ── Ensure AudioContext ────────────────────────────────────────────
  function ensureCtx() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      ctx = new AC();
      sampleRate = ctx.sampleRate;
    }
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    return ctx;
  }

  // ── Get defaults ───────────────────────────────────────────────────
  function getDefaults() {
    return JSON.parse(JSON.stringify(DEFAULTS));
  }

  function getParamMeta() {
    return PARAM_META;
  }

  // ── Synthesize samples from params ─────────────────────────────────
  function synthesize(params) {
    var p = {};
    var k;
    for (k in DEFAULTS) {
      if (DEFAULTS.hasOwnProperty(k)) {
        p[k] = params[k] !== undefined ? params[k] : DEFAULTS[k];
      }
    }

    var sr = sampleRate || 44100;
    var totalTime = p.attackTime + p.sustainTime + p.decayTime + p.releaseTime;
    if (totalTime < 0.01) totalTime = 0.01;
    var numSamples = Math.ceil(sr * totalTime);
    var samples = new Float32Array(numSamples);

    var freq = p.startFreq;
    var freqSlide = p.freqSlide;
    var phase = 0;
    var noiseBuffer = null;
    var noiseBufferLen = 0;

    if (p.waveform === "noise") {
      noiseBufferLen = 1024;
      noiseBuffer = new Float32Array(noiseBufferLen);
      for (var nb = 0; nb < noiseBufferLen; nb++) {
        noiseBuffer[nb] = Math.random() * 2 - 1;
      }
    }

    // Phaser
    var phaserBufLen = 1024;
    var phaserBuffer = new Float32Array(phaserBufLen);
    var phaserPos = 0;
    var phaserOffset = Math.abs(p.phaserOffset) * 100;
    var phaserDelta = p.phaserSweep * 10;
    var phaserEnabled = p.phaserOffset !== 0 || p.phaserSweep !== 0;

    // Filter state (simple one-pole lowpass + highpass)
    var lpfW = 1.0;
    var lpfDamp = 0.0;
    var lpfPrev = 0;
    var hpfW = 0.0;
    var hpfPrev = 0;
    var hpfPrevOut = 0;

    if (p.lpfFreq < 19999) {
      lpfW = Math.min(1.0, p.lpfFreq / sr * 2 * Math.PI);
      lpfDamp = p.lpfResonance > 0 ? (1 - p.lpfResonance / 25) : 1.0;
      if (lpfDamp < 0.1) lpfDamp = 0.1;
    }
    if (p.hpfFreq > 1) {
      hpfW = p.hpfFreq / sr * 2 * Math.PI;
      if (hpfW > 0.99) hpfW = 0.99;
    }

    var arpTime = p.arpSpeed > 0 ? Math.floor(p.arpSpeed * sr) : 0;
    var arpApplied = false;

    for (var i = 0; i < numSamples; i++) {
      var t = i / sr;

      // Envelope
      var env = 0;
      if (t < p.attackTime) {
        env = p.attackTime > 0 ? t / p.attackTime : 1;
      } else if (t < p.attackTime + p.sustainTime) {
        env = 1.0;
        var sustainElapsed = t - p.attackTime;
        if (p.sustainPunch > 0 && sustainElapsed < 0.05) {
          env += p.sustainPunch * (1 - sustainElapsed / 0.05);
        }
      } else if (t < p.attackTime + p.sustainTime + p.decayTime) {
        var decayElapsed = t - p.attackTime - p.sustainTime;
        env = p.decayTime > 0 ? 1.0 - decayElapsed / p.decayTime : 0;
      } else {
        var relElapsed = t - p.attackTime - p.sustainTime - p.decayTime;
        env = p.releaseTime > 0 ? Math.max(0, 1.0 - relElapsed / p.releaseTime) : 0;
        // Decay envelope continues from where decay left off (which is 0)
        // so release ramps from ~0 to 0, effectively no sound
        // Fix: release ramps from sustain-end level
      }
      // Corrected envelope: attack -> peak, sustain -> hold at 1, decay -> ramp to 0.3-ish, release -> ramp to 0
      // Actually let's do standard sfxr envelope: attack ramps up, sustain holds, then sustain+decay drop
      // Recompute with simpler model
      var envTime = t;
      if (envTime < p.attackTime) {
        env = p.attackTime > 0 ? envTime / p.attackTime : 1.0;
      } else {
        envTime -= p.attackTime;
        if (envTime < p.sustainTime) {
          env = 1.0;
          if (p.sustainPunch > 0) {
            env += p.sustainPunch * Math.max(0, 1.0 - envTime / 0.05);
          }
        } else {
          envTime -= p.sustainTime;
          var decayRelease = p.decayTime + p.releaseTime;
          if (decayRelease > 0) {
            env = Math.max(0, 1.0 - envTime / decayRelease);
          } else {
            env = 0;
          }
        }
      }

      // Frequency slide
      freqSlide += p.freqDeltaSlide * (1.0 / sr);
      freq += freqSlide * freq * (1.0 / sr) * 500;

      // Arpeggiation
      if (arpTime > 0 && !arpApplied && i >= arpTime) {
        freq *= p.arpMultiplier;
        arpApplied = true;
      }

      // Min freq cutoff
      if (p.minFreq > 0 && freq < p.minFreq) {
        freq = p.minFreq;
        env = 0;
      }
      if (freq < 1) freq = 1;
      if (freq > sr / 2) freq = sr / 2;

      // Vibrato
      var vibratoMod = 0;
      if (p.vibratoDepth > 0 && p.vibratoSpeed > 0) {
        vibratoMod = p.vibratoDepth * 0.5 * Math.sin(2 * Math.PI * p.vibratoSpeed * t);
      }
      var actualFreq = freq * (1 + vibratoMod);

      // Generate sample
      var sample = 0;
      var phaseInc = actualFreq / sr;
      phase += phaseInc;
      if (phase > 1) phase -= Math.floor(phase);

      switch (p.waveform) {
        case "sine":
          sample = Math.sin(2 * Math.PI * phase);
          break;
        case "square":
          sample = phase < 0.5 ? 1 : -1;
          break;
        case "sawtooth":
          sample = 2 * phase - 1;
          break;
        case "triangle":
          sample = phase < 0.5 ? (4 * phase - 1) : (3 - 4 * phase);
          break;
        case "noise":
          sample = noiseBuffer[Math.floor(phase * noiseBufferLen) % noiseBufferLen];
          // Refresh noise periodically
          if (i % 100 === 0) {
            for (var rn = 0; rn < noiseBufferLen; rn++) {
              noiseBuffer[rn] = Math.random() * 2 - 1;
            }
          }
          break;
        case "pulse":
          sample = phase < p.pulseWidth ? 1 : -1;
          break;
        default:
          sample = phase < 0.5 ? 1 : -1;
      }

      // Lowpass filter
      if (p.lpfFreq < 19999) {
        lpfPrev += lpfW * (sample - lpfPrev);
        sample = lpfPrev;
      }

      // Highpass filter
      if (p.hpfFreq > 1) {
        hpfPrevOut = (1 - hpfW) * (hpfPrevOut + sample - hpfPrev);
        hpfPrev = sample;
        sample = hpfPrevOut;
      }

      // Phaser
      if (phaserEnabled) {
        phaserBuffer[phaserPos % phaserBufLen] = sample;
        var readPos = (phaserPos - Math.floor(phaserOffset) + phaserBufLen * 10) % phaserBufLen;
        sample += phaserBuffer[readPos];
        sample *= 0.5;
        phaserOffset += phaserDelta / sr;
        if (phaserOffset < 0) phaserOffset = 0;
        if (phaserOffset > phaserBufLen - 1) phaserOffset = phaserBufLen - 1;
        phaserPos++;
      }

      // Apply envelope and volume
      sample *= env * p.volume;

      // Compression (soft clip)
      if (p.compression > 0) {
        var c = p.compression;
        sample = sample * (1 - c) + Math.tanh(sample * 3) * c;
      }

      // Hard clip
      if (sample > 1) sample = 1;
      if (sample < -1) sample = -1;

      samples[i] = sample;
    }

    return { samples: samples, sampleRate: sr };
  }

  // ── Play sound via Web Audio ───────────────────────────────────────
  function play(params) {
    var ac = ensureCtx();
    var result = synthesize(params);
    var buffer = ac.createBuffer(1, result.samples.length, result.sampleRate);
    buffer.getChannelData(0).set(result.samples);

    var source = ac.createBufferSource();
    source.buffer = buffer;
    source.connect(ac.destination);
    source.start();
    return source;
  }

  // ── WAV encoding ───────────────────────────────────────────────────
  function encodeWAV(samples, sr) {
    var numSamples = samples.length;
    var bytesPerSample = 2; // 16-bit
    var blockAlign = bytesPerSample;
    var byteRate = sr * blockAlign;
    var dataSize = numSamples * bytesPerSample;
    var headerSize = 44;
    var totalSize = headerSize + dataSize;

    var buffer = new ArrayBuffer(totalSize);
    var view = new DataView(buffer);

    // RIFF header
    writeString(view, 0, "RIFF");
    view.setUint32(4, totalSize - 8, true);
    writeString(view, 8, "WAVE");

    // fmt chunk
    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true);           // chunk size
    view.setUint16(20, 1, true);            // PCM format
    view.setUint16(22, 1, true);            // mono
    view.setUint32(24, sr, true);           // sample rate
    view.setUint32(28, byteRate, true);     // byte rate
    view.setUint16(32, blockAlign, true);   // block align
    view.setUint16(34, 16, true);           // bits per sample

    // data chunk
    writeString(view, 36, "data");
    view.setUint32(40, dataSize, true);

    // PCM samples
    var offset = 44;
    for (var i = 0; i < numSamples; i++) {
      var s = Math.max(-1, Math.min(1, samples[i]));
      var val = s < 0 ? s * 0x8000 : s * 0x7FFF;
      view.setInt16(offset, val | 0, true);
      offset += 2;
    }

    return new Blob([buffer], { type: "audio/wav" });
  }

  function writeString(view, offset, str) {
    for (var i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  // ── Export WAV blob ────────────────────────────────────────────────
  function exportWAV(params) {
    ensureCtx();
    var result = synthesize(params);
    return encodeWAV(result.samples, result.sampleRate);
  }

  // ── Download helper ────────────────────────────────────────────────
  function downloadWAV(params, filename) {
    var blob = exportWAV(params);
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename || "sfx.wav";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  // ── Export as tracker instrument JSON ──────────────────────────────
  function toTrackerInstrument(params, name) {
    var p = {};
    var k;
    for (k in DEFAULTS) {
      if (DEFAULTS.hasOwnProperty(k)) {
        p[k] = params[k] !== undefined ? params[k] : DEFAULTS[k];
      }
    }

    // Map waveform
    var wave = p.waveform;
    if (wave === "pulse") wave = "pulse25";
    if (wave === "noise") wave = "noise";

    var inst = {
      name: name || "SFX",
      wave: wave,
      attack: p.attackTime || 0.01,
      decay: p.decayTime || 0.1,
      sustain: p.sustainTime > 0 ? 0.6 : 0,
      release: p.releaseTime || 0.1,
      volume: p.volume || 0.8
    };

    // Filter
    if (p.lpfFreq < 19999) {
      inst.filterType = "lowpass";
      inst.filterFreq = Math.round(p.lpfFreq);
      inst.filterQ = p.lpfResonance || 1;
    } else if (p.hpfFreq > 1) {
      inst.filterType = "highpass";
      inst.filterFreq = Math.round(p.hpfFreq);
      inst.filterQ = 1;
    }

    // Detune for vibrato-esque effect
    if (p.vibratoDepth > 0.1) {
      inst.detuneOsc = true;
      inst.detuneAmount = Math.round(p.vibratoDepth * 15);
    }

    return inst;
  }

  // ── Presets ────────────────────────────────────────────────────────
  var PRESETS = {
    laser: function () {
      var p = getDefaults();
      p.waveform = pickRandom(["square", "sawtooth", "pulse"]);
      p.startFreq = randRange(800, 3000);
      p.minFreq = randRange(100, 400);
      p.freqSlide = randRange(-0.8, -0.3);
      p.attackTime = 0;
      p.sustainTime = randRange(0.05, 0.2);
      p.decayTime = randRange(0.05, 0.15);
      p.releaseTime = randRange(0.01, 0.05);
      p.volume = randRange(0.3, 0.6);
      return p;
    },
    explosion: function () {
      var p = getDefaults();
      p.waveform = "noise";
      p.startFreq = randRange(100, 600);
      p.freqSlide = randRange(-0.3, -0.05);
      p.attackTime = 0;
      p.sustainTime = randRange(0.1, 0.3);
      p.decayTime = randRange(0.2, 0.6);
      p.releaseTime = randRange(0.1, 0.4);
      p.sustainPunch = randRange(0.2, 0.6);
      p.lpfFreq = randRange(1000, 6000);
      p.lpfResonance = randRange(0, 3);
      p.volume = randRange(0.4, 0.7);
      p.compression = randRange(0.1, 0.4);
      return p;
    },
    powerup: function () {
      var p = getDefaults();
      p.waveform = pickRandom(["square", "sawtooth", "sine"]);
      p.startFreq = randRange(300, 600);
      p.freqSlide = randRange(0.2, 0.6);
      p.attackTime = 0;
      p.sustainTime = randRange(0.15, 0.4);
      p.decayTime = randRange(0.1, 0.3);
      p.releaseTime = randRange(0.05, 0.15);
      p.vibratoDepth = randRange(0, 0.3);
      p.vibratoSpeed = randRange(5, 15);
      p.volume = randRange(0.3, 0.5);
      return p;
    },
    coin: function () {
      var p = getDefaults();
      p.waveform = pickRandom(["square", "sine"]);
      p.startFreq = randRange(800, 1800);
      p.attackTime = 0;
      p.sustainTime = randRange(0.02, 0.08);
      p.decayTime = randRange(0.05, 0.15);
      p.releaseTime = randRange(0.05, 0.1);
      p.arpMultiplier = randRange(1.2, 2.0);
      p.arpSpeed = randRange(0.03, 0.1);
      p.volume = randRange(0.3, 0.5);
      return p;
    },
    jump: function () {
      var p = getDefaults();
      p.waveform = pickRandom(["square", "sine", "triangle"]);
      p.startFreq = randRange(200, 500);
      p.freqSlide = randRange(0.15, 0.5);
      p.attackTime = 0;
      p.sustainTime = randRange(0.05, 0.15);
      p.decayTime = randRange(0.1, 0.25);
      p.releaseTime = randRange(0.02, 0.08);
      p.volume = randRange(0.3, 0.5);
      return p;
    },
    hit: function () {
      var p = getDefaults();
      p.waveform = pickRandom(["noise", "square", "sawtooth"]);
      p.startFreq = randRange(200, 800);
      p.freqSlide = randRange(-0.4, -0.1);
      p.attackTime = 0;
      p.sustainTime = randRange(0.01, 0.05);
      p.decayTime = randRange(0.05, 0.2);
      p.releaseTime = randRange(0.02, 0.1);
      p.sustainPunch = randRange(0.1, 0.5);
      p.hpfFreq = randRange(100, 1000);
      p.volume = randRange(0.4, 0.6);
      p.compression = randRange(0, 0.3);
      return p;
    },
    blip: function () {
      var p = getDefaults();
      p.waveform = pickRandom(["sine", "square", "triangle"]);
      p.startFreq = randRange(600, 2000);
      p.attackTime = 0;
      p.sustainTime = randRange(0.01, 0.04);
      p.decayTime = randRange(0.02, 0.08);
      p.releaseTime = randRange(0.01, 0.03);
      p.volume = randRange(0.25, 0.45);
      return p;
    },
    random: function () {
      var p = getDefaults();
      p.waveform = pickRandom(["sine", "square", "sawtooth", "triangle", "noise", "pulse"]);
      p.pulseWidth = randRange(0.1, 0.9);
      p.startFreq = randRange(50, 4000);
      p.minFreq = Math.random() > 0.5 ? randRange(0, p.startFreq * 0.5) : 0;
      p.freqSlide = randRange(-1, 1);
      p.freqDeltaSlide = randRange(-0.5, 0.5);
      p.attackTime = randRange(0, 0.3);
      p.sustainTime = randRange(0.01, 0.5);
      p.decayTime = randRange(0.01, 0.5);
      p.releaseTime = randRange(0.01, 0.4);
      p.sustainPunch = randRange(0, 0.5);
      p.vibratoDepth = Math.random() > 0.5 ? randRange(0, 0.5) : 0;
      p.vibratoSpeed = randRange(0, 20);
      p.arpMultiplier = Math.random() > 0.6 ? randRange(0.5, 2.5) : 1;
      p.arpSpeed = p.arpMultiplier !== 1 ? randRange(0.02, 0.2) : 0;
      p.lpfFreq = Math.random() > 0.4 ? randRange(500, 15000) : 20000;
      p.lpfResonance = randRange(0, 8);
      p.hpfFreq = Math.random() > 0.6 ? randRange(20, 2000) : 0;
      p.phaserOffset = Math.random() > 0.6 ? randRange(-0.5, 0.5) : 0;
      p.phaserSweep = Math.random() > 0.7 ? randRange(-0.3, 0.3) : 0;
      p.volume = randRange(0.3, 0.6);
      p.compression = randRange(0, 0.4);
      return p;
    }
  };

  // ── Mutate: small variations on existing params ────────────────────
  function mutate(params, amount) {
    amount = amount || 0.1;
    var p = JSON.parse(JSON.stringify(params));
    var meta = PARAM_META;

    for (var key in meta) {
      if (!meta.hasOwnProperty(key)) continue;
      var m = meta[key];
      if (m.type !== "range") continue;
      if (key === "volume") continue; // don't mutate volume

      if (Math.random() < 0.6) { // mutate ~60% of params
        var range = m.max - m.min;
        var delta = (Math.random() * 2 - 1) * range * amount;
        var val = (p[key] || 0) + delta;
        val = Math.max(m.min, Math.min(m.max, val));

        // Round to step
        if (m.step >= 1) {
          val = Math.round(val);
        } else {
          var prec = Math.ceil(-Math.log10(m.step));
          val = parseFloat(val.toFixed(prec));
        }
        p[key] = val;
      }
    }
    return p;
  }

  // ── Helpers ────────────────────────────────────────────────────────
  function randRange(min, max) {
    return min + Math.random() * (max - min);
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function getPresetNames() {
    return Object.keys(PRESETS);
  }

  function generatePreset(name) {
    if (PRESETS[name]) {
      return PRESETS[name]();
    }
    return getDefaults();
  }

  // ── Public API ─────────────────────────────────────────────────────
  return {
    getDefaults: getDefaults,
    getParamMeta: getParamMeta,
    getPresetNames: getPresetNames,
    generatePreset: generatePreset,
    synthesize: synthesize,
    play: play,
    exportWAV: exportWAV,
    downloadWAV: downloadWAV,
    toTrackerInstrument: toTrackerInstrument,
    mutate: mutate,
    ensureCtx: ensureCtx
  };
})();
