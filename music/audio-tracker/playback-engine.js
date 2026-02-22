/**
 * ChipPlayer — Minimal chiptune playback engine.
 * Standalone IIFE. Plays compact song JSON exported by the tracker.
 * No DOM access, no editing, no UI. Just audio playback.
 */
var ChipPlayer = (function () {
  "use strict";

  var ctx = null;
  var masterGain = null;
  var noiseBuffer = null;
  var pulseWaves = {};
  var playing = false;
  var song = null;
  var timerID = null;
  var nextNoteTime = 0;
  var seqIndex = 0;
  var rowIndex = 0;
  var shortMode = false;
  var onEndCallback = null;

  var SCHEDULE_AHEAD = 0.1;   // seconds to schedule ahead
  var TIMER_INTERVAL = 25;    // ms between scheduler ticks

  // ---- Helpers ----

  function midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  function buildPulseWave(duty) {
    var harmonics = 64;
    var real = new Float32Array(harmonics + 1);
    var imag = new Float32Array(harmonics + 1);
    for (var n = 1; n <= harmonics; n++) {
      imag[n] = (2 / (n * Math.PI)) * Math.sin(n * Math.PI * duty);
    }
    return ctx.createPeriodicWave(real, imag, { disableNormalization: false });
  }

  function createNoiseBuffer() {
    var len = Math.ceil(ctx.sampleRate * 2);
    var buf = ctx.createBuffer(1, len, ctx.sampleRate);
    var data = buf.getChannelData(0);
    for (var i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  function secondsPerRow() {
    return 60 / (song.bpm * (song.rpb || 4));
  }

  // ---- Playback note ----

  function playNote(midi, inst, time, durationRows, velocity) {
    var vol = inst.vol !== undefined ? inst.vol : 0.8;
    if (velocity != null) vol *= velocity / 15;
    var a = inst.a || 0.01, d = inst.d || 0.1;
    var s = inst.s !== undefined ? inst.s : 0.6, r = inst.r || 0.1;
    var rows = durationRows || 1;

    var gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(vol, time + a);
    gainNode.gain.linearRampToValueAtTime(vol * s, time + a + d);
    // Sustain holds until release; schedule release at end of note duration
    var releaseAt = time + secondsPerRow() * rows - 0.005;
    gainNode.gain.setValueAtTime(vol * s, releaseAt);
    gainNode.gain.linearRampToValueAtTime(0, releaseAt + r);

    var endTime = releaseAt + r + 0.05;
    var dest = gainNode;

    // Optional filter
    if (inst.filterType && inst.filterType !== "none") {
      var filter = ctx.createBiquadFilter();
      filter.type = inst.filterType;
      filter.frequency.setValueAtTime(inst.filterFreq || 2000, time);
      filter.Q.setValueAtTime(inst.filterQ || 1, time);
      filter.connect(gainNode);
      dest = filter;
    }

    var freq = midiToFreq(midi);
    var wave = inst.wave || "square";

    if (wave === "noise") {
      var src = ctx.createBufferSource();
      src.buffer = noiseBuffer;
      src.loop = true;
      src.connect(dest);
      src.start(time);
      src.stop(endTime);
    } else if (wave === "pluck") {
      // Karplus-Strong plucked string (self-contained, fire-and-forget)
      var period = 1 / freq;
      var burstDur = 0.02;
      var brightness = inst.filterFreq || 4000;

      var burstLen = Math.ceil(ctx.sampleRate * (burstDur + 0.01));
      var burstBuf = ctx.createBuffer(1, burstLen, ctx.sampleRate);
      var burstData = burstBuf.getChannelData(0);
      for (var bi = 0; bi < burstLen; bi++) burstData[bi] = Math.random() * 2 - 1;

      var burstSrc = ctx.createBufferSource();
      burstSrc.buffer = burstBuf;

      var pluckDelay = ctx.createDelay(1);
      pluckDelay.delayTime.setValueAtTime(period, time);

      var fbGain = ctx.createGain();
      fbGain.gain.setValueAtTime(0.996, time);
      fbGain.gain.linearRampToValueAtTime(0, endTime);

      var fbFilter = ctx.createBiquadFilter();
      fbFilter.type = "lowpass";
      fbFilter.frequency.setValueAtTime(brightness, time);
      fbFilter.Q.setValueAtTime(0.5, time);

      // Body resonance filters for warmth
      // Scale air boost down for bright instruments to avoid screechiness
      var airGain = brightness > 5000 ? 0.5 : brightness > 3500 ? 1.0 : 1.5;

      var bodyLow = ctx.createBiquadFilter();
      bodyLow.type = "peaking";
      bodyLow.frequency.setValueAtTime(190, time);
      bodyLow.Q.setValueAtTime(0.8, time);
      bodyLow.gain.setValueAtTime(3, time);

      var bodyMid = ctx.createBiquadFilter();
      bodyMid.type = "peaking";
      bodyMid.frequency.setValueAtTime(820, time);
      bodyMid.Q.setValueAtTime(0.7, time);
      bodyMid.gain.setValueAtTime(2, time);

      var bodyAir = ctx.createBiquadFilter();
      bodyAir.type = "peaking";
      bodyAir.frequency.setValueAtTime(2800, time);
      bodyAir.Q.setValueAtTime(0.6, time);
      bodyAir.gain.setValueAtTime(airGain, time);

      burstSrc.connect(pluckDelay);
      pluckDelay.connect(fbFilter);
      fbFilter.connect(fbGain);
      fbGain.connect(pluckDelay);
      fbGain.connect(bodyLow);
      bodyLow.connect(bodyMid);
      bodyMid.connect(bodyAir);
      bodyAir.connect(dest);

      burstSrc.start(time);
      burstSrc.stop(time + burstDur);

      // Optional detuned 2nd pluck
      if (inst.detuneOsc && inst.detuneAmount) {
        var freq2p = freq * Math.pow(2, inst.detuneAmount / 1200);
        var burstBuf2 = ctx.createBuffer(1, burstLen, ctx.sampleRate);
        var bd2 = burstBuf2.getChannelData(0);
        for (var bi2 = 0; bi2 < burstLen; bi2++) bd2[bi2] = Math.random() * 2 - 1;

        var burstSrc2 = ctx.createBufferSource();
        burstSrc2.buffer = burstBuf2;

        var pluckDelay2 = ctx.createDelay(1);
        pluckDelay2.delayTime.setValueAtTime(1 / freq2p, time);

        var fbGain2 = ctx.createGain();
        fbGain2.gain.setValueAtTime(0.996, time);
        fbGain2.gain.linearRampToValueAtTime(0, endTime);

        var fbFilter2 = ctx.createBiquadFilter();
        fbFilter2.type = "lowpass";
        fbFilter2.frequency.setValueAtTime(brightness, time);
        fbFilter2.Q.setValueAtTime(0.5, time);

        burstSrc2.connect(pluckDelay2);
        pluckDelay2.connect(fbFilter2);
        fbFilter2.connect(fbGain2);
        fbGain2.connect(pluckDelay2);
        fbGain2.connect(bodyLow);

        burstSrc2.start(time);
        burstSrc2.stop(time + burstDur);
      }
    } else if (wave === "fm") {
      // FM synthesis (carrier + modulator, fire-and-forget)
      var fmRatio = inst.fmRatio !== undefined ? inst.fmRatio : 2;
      var fmDepth = inst.fmDepth !== undefined ? inst.fmDepth : 200;
      var fmWave = inst.fmWave || "sine";

      var fmCarrier = ctx.createOscillator();
      fmCarrier.type = "sine";
      fmCarrier.frequency.setValueAtTime(freq, time);

      var fmMod = ctx.createOscillator();
      fmMod.type = fmWave;
      fmMod.frequency.setValueAtTime(freq * fmRatio, time);

      var fmModGain = ctx.createGain();
      fmModGain.gain.setValueAtTime(fmDepth, time);

      fmMod.connect(fmModGain);
      fmModGain.connect(fmCarrier.frequency);
      fmCarrier.connect(dest);

      fmCarrier.start(time);
      fmCarrier.stop(endTime);
      fmMod.start(time);
      fmMod.stop(endTime);

      // Optional detuned 2nd FM voice
      if (inst.detuneOsc && inst.detuneAmount) {
        var fmCarrier2 = ctx.createOscillator();
        fmCarrier2.type = "sine";
        fmCarrier2.frequency.setValueAtTime(freq, time);
        fmCarrier2.detune.setValueAtTime(inst.detuneAmount, time);

        var fmMod2 = ctx.createOscillator();
        fmMod2.type = fmWave;
        fmMod2.frequency.setValueAtTime(freq * fmRatio, time);
        fmMod2.detune.setValueAtTime(inst.detuneAmount, time);

        var fmModGain2 = ctx.createGain();
        fmModGain2.gain.setValueAtTime(fmDepth, time);

        fmMod2.connect(fmModGain2);
        fmModGain2.connect(fmCarrier2.frequency);
        fmCarrier2.connect(dest);

        fmCarrier2.start(time);
        fmCarrier2.stop(endTime);
        fmMod2.start(time);
        fmMod2.stop(endTime);
      }
    } else {
      // Primary oscillator
      var osc = ctx.createOscillator();
      if (wave === "pulse25") {
        if (!pulseWaves["25"]) pulseWaves["25"] = buildPulseWave(0.25);
        osc.setPeriodicWave(pulseWaves["25"]);
      } else if (wave === "pulse12") {
        if (!pulseWaves["12"]) pulseWaves["12"] = buildPulseWave(0.125);
        osc.setPeriodicWave(pulseWaves["12"]);
      } else {
        osc.type = wave;
      }
      osc.frequency.setValueAtTime(freq, time);
      if (inst.detune) osc.detune.setValueAtTime(inst.detune, time);
      osc.connect(dest);
      osc.start(time);
      osc.stop(endTime);

      // Optional detuned second oscillator
      if (inst.detuneOsc && inst.detuneAmount) {
        var osc2 = ctx.createOscillator();
        if (wave === "pulse25") {
          osc2.setPeriodicWave(pulseWaves["25"]);
        } else if (wave === "pulse12") {
          osc2.setPeriodicWave(pulseWaves["12"]);
        } else {
          osc2.type = wave;
        }
        osc2.frequency.setValueAtTime(freq, time);
        osc2.detune.setValueAtTime((inst.detune || 0) + inst.detuneAmount, time);
        osc2.connect(dest);
        osc2.start(time);
        osc2.stop(endTime);
      }
    }

    gainNode.connect(masterGain);
  }

  // ---- Scheduler ----

  function scheduleRow(time) {
    var seqRow = song.seq[seqIndex];
    for (var ch = 0; ch < seqRow.length; ch++) {
      var patIdx = seqRow[ch];
      var pat = song.patterns[patIdx];
      if (!pat || !pat.ch || !pat.ch[ch]) continue;
      var cell = pat.ch[ch][rowIndex];
      if (!cell || cell[0] < 0) continue;
      var midi = cell[0];
      var inst = song.instruments[cell[1]] || song.instruments[0];
      var dur = cell[2] || 1;
      var vel = cell[3];
      playNote(midi, inst, time, dur, vel);
    }
  }

  function advanceRow() {
    rowIndex++;
    var seqRow = song.seq[seqIndex];
    var patIdx = seqRow[0];
    var patLen = song.patterns[patIdx] ? song.patterns[patIdx].len : 16;
    if (rowIndex >= patLen) {
      rowIndex = 0;
      seqIndex++;
      if (seqIndex >= song.seq.length) seqIndex = 0;
    }
  }

  function scheduler() {
    while (nextNoteTime < ctx.currentTime + SCHEDULE_AHEAD) {
      scheduleRow(nextNoteTime);
      advanceWithLoop();
      nextNoteTime += secondsPerRow();
    }
  }

  function stopInternal() {
    if (!playing) return;
    playing = false;
    if (timerID) { clearInterval(timerID); timerID = null; }
  }

  function advanceWithLoop() {
    rowIndex++;
    var seqRow = song.seq[seqIndex];
    var patIdx = seqRow[0];
    var patLen = song.patterns[patIdx] ? song.patterns[patIdx].len : 16;
    if (rowIndex >= patLen) {
      rowIndex = 0;
      seqIndex++;
      // Check shortEndSeq BEFORE normal loop logic
      if (shortMode && song.shortEndSeq != null && seqIndex >= song.shortEndSeq) {
        stopInternal();
        if (onEndCallback) onEndCallback();
        return;
      }
      var loopEnd = song.loopEndSeq != null ? song.loopEndSeq : song.seq.length;
      var loopStart = song.loopStartSeq || 0;
      if (seqIndex >= loopEnd) {
        seqIndex = loopStart;
      }
    }
  }

  // ---- Public API ----

  return {
    init: function () {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain();
      masterGain.connect(ctx.destination);
      noiseBuffer = createNoiseBuffer();
      pulseWaves = {};
    },

    /** Init with an external AudioContext and gain node (for embedding in another audio engine). */
    initExternal: function (externalCtx, externalGainNode) {
      ctx = externalCtx;
      masterGain = externalGainNode;
      noiseBuffer = createNoiseBuffer();
      pulseWaves = {};
    },

    load: function (songJSON) {
      song = songJSON;
      // Normalize tracker-native format to compact format
      if (song.sequence && !song.seq) {
        song.seq = song.sequence;
        for (var p = 0; p < song.patterns.length; p++) {
          var pat = song.patterns[p];
          if (pat.channels && !pat.ch) {
            var len = pat.len || 16;
            pat.ch = [];
            for (var c = 0; c < pat.channels.length; c++) {
              var dense = new Array(len);
              for (var r = 0; r < len; r++) dense[r] = null;
              var events = pat.channels[c];
              for (var e = 0; e < events.length; e++) {
                var ev = events[e];
                var cell = [ev.n, ev.i, ev.d || 1];
                if (ev.v != null) cell.push(ev.v);
                dense[ev.r] = cell;
              }
              pat.ch.push(dense);
            }
          }
        }
      }
      seqIndex = 0;
      rowIndex = 0;
    },

    play: function () {
      if (playing || !song) return;
      if (!ctx) this.init();
      if (ctx.state === "suspended") ctx.resume();
      playing = true;
      seqIndex = 0;
      rowIndex = 0;
      nextNoteTime = ctx.currentTime + 0.05;
      timerID = setInterval(function () {
        while (nextNoteTime < ctx.currentTime + SCHEDULE_AHEAD) {
          scheduleRow(nextNoteTime);
          advanceWithLoop();
          nextNoteTime += secondsPerRow();
        }
      }, TIMER_INTERVAL);
    },

    stop: function () {
      stopInternal();
    },

    setVolume: function (v) {
      if (masterGain) masterGain.gain.setValueAtTime(v, ctx.currentTime);
    },

    isPlaying: function () {
      return playing;
    },

    setShortMode: function (enabled) { shortMode = !!enabled; },

    onEnd: function (cb) { onEndCallback = cb; }
  };
})();
