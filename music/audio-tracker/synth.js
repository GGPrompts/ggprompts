/**
 * Synth — Web Audio API synthesis engine for a chiptune tracker.
 * Global IIFE. No DOM access.
 */
var Synth = (function () {
  "use strict";

  var ctx = null;
  var masterGain = null;
  var channelGains = [null, null, null, null];
  var activeVoices = [];
  var pulseWaves = {};

  // ---- Helpers ----

  function midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  function buildPulseWave(duty, harmonics) {
    var real = new Float32Array(harmonics + 1);
    var imag = new Float32Array(harmonics + 1);
    real[0] = 0;
    imag[0] = 0;
    for (var n = 1; n <= harmonics; n++) {
      // Fourier series for a pulse wave with given duty cycle:
      // b_n = (2 / (n * pi)) * sin(n * pi * duty)
      imag[n] = (2 / (n * Math.PI)) * Math.sin(n * Math.PI * duty);
      real[n] = 0;
    }
    return ctx.createPeriodicWave(real, imag, { disableNormalization: false });
  }

  function createNoiseBuffer(duration) {
    var sampleRate = ctx.sampleRate;
    var length = Math.ceil(sampleRate * duration);
    var buffer = ctx.createBuffer(1, length, sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  function removeVoice(handle) {
    var idx = activeVoices.indexOf(handle);
    if (idx !== -1) {
      activeVoices.splice(idx, 1);
    }
  }

  function clampChannel(ch) {
    return Math.max(0, Math.min(3, ch | 0));
  }

  function getChannelVoice(channel) {
    var ch = clampChannel(channel);
    for (var i = activeVoices.length - 1; i >= 0; i--) {
      var v = activeVoices[i];
      if (v.channel === ch && !v.released) return v;
    }
    return null;
  }

  // ---- Public API ----

  function init() {
    if (ctx) return;

    var AC = window.AudioContext || window.webkitAudioContext;
    ctx = new AC();

    // Resume on user gesture if suspended
    if (ctx.state === "suspended") {
      var resume = function () {
        ctx.resume();
        document.removeEventListener("click", resume);
        document.removeEventListener("keydown", resume);
        document.removeEventListener("touchstart", resume);
      };
      document.addEventListener("click", resume);
      document.addEventListener("keydown", resume);
      document.addEventListener("touchstart", resume);
    }

    masterGain = ctx.createGain();
    masterGain.gain.value = 0.7;
    masterGain.connect(ctx.destination);

    for (var i = 0; i < 4; i++) {
      channelGains[i] = ctx.createGain();
      channelGains[i].gain.value = 1.0;
      channelGains[i].connect(masterGain);
    }

    // Cache pulse PeriodicWaves (32 harmonics)
    pulseWaves.pulse25 = buildPulseWave(0.25, 32);
    pulseWaves.pulse12 = buildPulseWave(0.125, 32);
  }

  function createOscillator(freq, wave, detuneCents, time) {
    var osc = ctx.createOscillator();

    if (wave === "pulse25") {
      osc.setPeriodicWave(pulseWaves.pulse25);
    } else if (wave === "pulse12") {
      osc.setPeriodicWave(pulseWaves.pulse12);
    } else {
      osc.type = wave; // square, triangle, sawtooth, sine
    }

    osc.frequency.setValueAtTime(freq, time);
    if (detuneCents) {
      osc.detune.setValueAtTime(detuneCents, time);
    }
    return osc;
  }

  function applyADSR(gainNode, instrument, time) {
    var a = instrument.attack || 0.01;
    var d = instrument.decay || 0.1;
    var s = instrument.sustain !== undefined ? instrument.sustain : 0.6;
    var vol = instrument.volume !== undefined ? instrument.volume : 0.8;
    var peak = vol;

    var g = gainNode.gain;
    g.setValueAtTime(0, time);
    g.linearRampToValueAtTime(peak, time + a);
    g.linearRampToValueAtTime(s * peak, time + a + d);
  }

  function applyRelease(gainNode, instrument, time) {
    var r = instrument.release || 0.1;
    var s = instrument.sustain !== undefined ? instrument.sustain : 0.6;
    var vol = instrument.volume !== undefined ? instrument.volume : 0.8;
    var g = gainNode.gain;
    // Cancel future ramps and ramp to zero.
    // Use the instrument's sustain level rather than g.value, which only
    // reflects the gain at JS-execution time — not at the scheduled time.
    g.cancelScheduledValues(time);
    g.setValueAtTime(s * vol, time);
    g.linearRampToValueAtTime(0, time + r);
    return r;
  }

  function createFilter(instrument, time) {
    if (!instrument.filterType || instrument.filterType === "none") {
      return null;
    }
    var filter = ctx.createBiquadFilter();
    filter.type = instrument.filterType;
    filter.frequency.setValueAtTime(
      instrument.filterFreq || 2000,
      time
    );
    filter.Q.setValueAtTime(instrument.filterQ || 1, time);
    return filter;
  }

  /**
   * noteOn — start a pitched voice.
   * Returns a voice handle for use with noteOff.
   */
  function noteOn(channel, midiNote, instrument, time) {
    if (!ctx) return null;

    var ch = clampChannel(channel);
    var t = time || ctx.currentTime;
    var freq = midiToFreq(midiNote);
    var wave = instrument.wave || "square";

    // Dispatch to specialized synth engines
    if (wave === "noise") {
      return triggerNoise(ch, instrument, t);
    }
    if (wave === "pluck") {
      if (instrument.legato) {
        var prev = getChannelVoice(ch);
        if (prev && prev.type === "pluck" && !prev.released) {
          return retunePluck(prev, midiNote, instrument, t);
        }
      }
      return triggerPluck(ch, midiNote, instrument, t);
    }
    if (wave === "fm") {
      return triggerFM(ch, midiNote, instrument, t);
    }

    // ADSR gain node
    var envGain = ctx.createGain();
    applyADSR(envGain, instrument, t);

    // Optional filter
    var filter = createFilter(instrument, t);

    // Primary oscillator
    var osc1 = createOscillator(freq, wave, instrument.detune || 0, t);

    // Optional detuned 2nd oscillator
    var osc2 = null;
    if (instrument.detuneOsc) {
      var d2 = instrument.detuneAmount || 7;
      osc2 = createOscillator(freq, wave, (instrument.detune || 0) + d2, t);
    }

    // Routing: osc(s) -> filter? -> envGain -> channelGain
    var target = filter || envGain;

    osc1.connect(target);
    if (osc2) {
      osc2.connect(target);
    }

    if (filter) {
      filter.connect(envGain);
    }

    envGain.connect(channelGains[ch]);

    osc1.start(t);
    if (osc2) {
      osc2.start(t);
    }

    var handle = {
      type: "tone",
      osc1: osc1,
      osc2: osc2,
      filter: filter,
      envGain: envGain,
      instrument: instrument,
      channel: ch,
      startTime: t,
      released: false
    };

    activeVoices.push(handle);
    return handle;
  }

  /**
   * noteOff — schedule release envelope, then stop oscillators.
   * If quickCut is true, use a very short fade-out (~3ms) instead of the
   * instrument's release time. This avoids overlapping tails when a new
   * note retriggers on the same channel immediately.
   */
  function noteOff(handle, time, quickCut) {
    if (!handle || handle.released) return;
    handle.released = true;

    var t = time || ctx.currentTime;

    // --- Pluck voices: kill the feedback loop, then disconnect ---
    if (handle.type === "pluck") {
      var fadeTime = quickCut ? 0.003 : 0.05;
      handle.feedbackGain.gain.cancelScheduledValues(t);
      handle.feedbackGain.gain.setValueAtTime(handle.feedbackGain.gain.value, t);
      handle.feedbackGain.gain.linearRampToValueAtTime(0, t + fadeTime);
      if (handle.feedbackGain2) {
        handle.feedbackGain2.gain.cancelScheduledValues(t);
        handle.feedbackGain2.gain.setValueAtTime(handle.feedbackGain2.gain.value, t);
        handle.feedbackGain2.gain.linearRampToValueAtTime(0, t + fadeTime);
      }
      handle.envGain.gain.cancelScheduledValues(t);
      handle.envGain.gain.setValueAtTime(handle.envGain.gain.value, t);
      handle.envGain.gain.linearRampToValueAtTime(0, t + fadeTime + 0.01);

      // Disconnect nodes shortly after fade completes to free resources.
      // Without this, zombie delay lines accumulate until the original
      // auto-cleanup timeout fires (~2.5s), causing distortion in
      // pluck-heavy songs.
      var pluckCleanup = (t + fadeTime + 0.06 - ctx.currentTime) * 1000;
      if (pluckCleanup < 50) pluckCleanup = 50;
      setTimeout(function () {
        try {
          handle.delay.disconnect();
          if (handle.delay2) handle.delay2.disconnect();
          handle.feedbackGain.disconnect();
          if (handle.feedbackGain2) handle.feedbackGain2.disconnect();
          handle.feedbackFilter.disconnect();
          if (handle.feedbackFilter2) handle.feedbackFilter2.disconnect();
          if (handle.filter) handle.filter.disconnect();
          handle.envGain.disconnect();
        } catch (e) {}
        removeVoice(handle);
      }, pluckCleanup);
      return;
    }

    // --- FM voices: release envelope then stop oscillators ---
    if (handle.type === "fm") {
      var releaseDur;
      if (quickCut) {
        var gf = handle.envGain.gain;
        gf.cancelScheduledValues(t);
        gf.setValueAtTime(gf.value, t);
        gf.linearRampToValueAtTime(0, t + 0.003);
        releaseDur = 0.003;
      } else {
        releaseDur = applyRelease(handle.envGain, handle.instrument, t);
      }
      var fmStopTime = t + releaseDur + 0.01;

      handle.carrier.stop(fmStopTime);
      handle.modulator.stop(fmStopTime);
      if (handle.carrier2) handle.carrier2.stop(fmStopTime);
      if (handle.modulator2) handle.modulator2.stop(fmStopTime);

      var fmCleanup = (fmStopTime - ctx.currentTime + 0.05) * 1000;
      if (fmCleanup < 50) fmCleanup = 50;
      setTimeout(function () {
        try {
          handle.carrier.disconnect();
          handle.modulator.disconnect();
          handle.modGain.disconnect();
          if (handle.carrier2) handle.carrier2.disconnect();
          if (handle.modulator2) handle.modulator2.disconnect();
          if (handle.modGain2) handle.modGain2.disconnect();
          if (handle.filter) handle.filter.disconnect();
          handle.envGain.disconnect();
        } catch (e) {}
        removeVoice(handle);
      }, fmCleanup);
      return;
    }

    // --- Tone voices (original behavior) ---
    var releaseDur;
    if (quickCut) {
      var g = handle.envGain.gain;
      g.cancelScheduledValues(t);
      g.setValueAtTime(g.value, t);
      g.linearRampToValueAtTime(0, t + 0.003);
      releaseDur = 0.003;
    } else {
      releaseDur = applyRelease(handle.envGain, handle.instrument, t);
    }
    var stopTime = t + releaseDur + 0.01;

    handle.osc1.stop(stopTime);
    if (handle.osc2) {
      handle.osc2.stop(stopTime);
    }

    // Clean up after stop — delay must account for the scheduled stop time
    // being in the future, not just the release envelope duration.
    var cleanupDelay = (stopTime - ctx.currentTime + 0.05) * 1000;
    if (cleanupDelay < 50) cleanupDelay = 50;
    setTimeout(function () {
      try {
        handle.osc1.disconnect();
        if (handle.osc2) handle.osc2.disconnect();
        if (handle.filter) handle.filter.disconnect();
        handle.envGain.disconnect();
      } catch (e) {
        // already disconnected
      }
      removeVoice(handle);
    }, cleanupDelay);
  }

  /**
   * triggerNoise — create buffer noise source for percussion.
   * Instrument params control character:
   *   - kick:  lowpass filter, low filterFreq (~150), high Q, short decay
   *   - snare: highpass filter, mid filterFreq (~1000), short decay
   *   - hat:   highpass filter, high filterFreq (~6000), very short decay
   */
  function triggerNoise(channel, instrument, time) {
    if (!ctx) return null;

    var ch = clampChannel(channel);
    var t = time || ctx.currentTime;

    var a = instrument.attack || 0.001;
    var d = instrument.decay || 0.1;
    var s = instrument.sustain !== undefined ? instrument.sustain : 0.0;
    var r = instrument.release || 0.05;
    var vol = instrument.volume !== undefined ? instrument.volume : 0.8;

    // Total duration of the noise burst
    var totalDur = a + d + r + 0.2;

    var buffer = createNoiseBuffer(totalDur);
    var source = ctx.createBufferSource();
    source.buffer = buffer;

    // Envelope
    var envGain = ctx.createGain();
    var g = envGain.gain;
    g.setValueAtTime(0, t);
    g.linearRampToValueAtTime(vol, t + a);
    g.linearRampToValueAtTime(s * vol, t + a + d);
    g.linearRampToValueAtTime(0, t + a + d + r);

    // Optional filter
    var filter = createFilter(instrument, t);

    var target = filter || envGain;
    source.connect(target);
    if (filter) {
      filter.connect(envGain);
    }
    envGain.connect(channelGains[ch]);

    source.start(t);
    source.stop(t + totalDur);

    var handle = {
      type: "noise",
      source: source,
      filter: filter,
      envGain: envGain,
      instrument: instrument,
      channel: ch,
      startTime: t,
      released: true // noise is fire-and-forget
    };

    activeVoices.push(handle);

    // Auto-cleanup
    setTimeout(function () {
      try {
        source.disconnect();
        if (filter) filter.disconnect();
        envGain.disconnect();
      } catch (e) {
        // already disconnected
      }
      removeVoice(handle);
    }, (totalDur + 0.05) * 1000);

    return handle;
  }

  /**
   * retunePluck — retune an existing pluck voice for legato (hammer-on/pull-off).
   * Slides the delay line(s) to the new pitch over ~20ms and resets the decay.
   */
  function retunePluck(handle, midiNote, instrument, time) {
    var freq = midiToFreq(midiNote);
    var brightness = instrument.filterFreq || 4000;
    var period = 1 / freq - 1 / (2 * Math.PI * brightness);
    if (period < 1 / ctx.sampleRate) period = 1 / ctx.sampleRate;
    var t = time || ctx.currentTime;
    var slideTime = 0.02; // 20ms pitch slide

    // Retune primary delay line
    handle.delay.delayTime.cancelScheduledValues(t);
    handle.delay.delayTime.setValueAtTime(handle.delay.delayTime.value, t);
    handle.delay.delayTime.exponentialRampToValueAtTime(period, t + slideTime);

    // Retune secondary delay line (detuneOsc) if present
    if (handle.delay2) {
      var d2 = instrument.detuneAmount || 7;
      var freq2 = freq * Math.pow(2, d2 / 1200);
      var period2 = 1 / freq2 - 1 / (2 * Math.PI * brightness);
      if (period2 < 1 / ctx.sampleRate) period2 = 1 / ctx.sampleRate;
      handle.delay2.delayTime.cancelScheduledValues(t);
      handle.delay2.delayTime.setValueAtTime(handle.delay2.delayTime.value, t);
      handle.delay2.delayTime.exponentialRampToValueAtTime(period2, t + slideTime);
    }

    // Reset feedback decay: cancel pending ramp, restart from current value
    var decayTime = (instrument.decay || 0.1) + (instrument.release || 0.15) + 1.5;
    var fg = handle.feedbackGain.gain;
    fg.cancelScheduledValues(t);
    fg.setValueAtTime(fg.value, t);
    fg.linearRampToValueAtTime(0, t + decayTime);

    if (handle.feedbackGain2) {
      var fg2 = handle.feedbackGain2.gain;
      fg2.cancelScheduledValues(t);
      fg2.setValueAtTime(fg2.value, t);
      fg2.linearRampToValueAtTime(0, t + decayTime);
    }

    // Update handle metadata
    handle.decayTime = decayTime;
    handle.instrument = instrument;

    return handle;
  }

  /**
   * triggerPluck — Karplus-Strong plucked string synthesis.
   * Noise burst → delay line (tuned to pitch) → lowpass → feedback loop.
   */
  function triggerPluck(channel, midiNote, instrument, time) {
    if (!ctx) return null;

    var ch = clampChannel(channel);
    var t = time || ctx.currentTime;
    var freq = midiToFreq(midiNote);
    var vol = instrument.volume !== undefined ? instrument.volume : 0.8;

    // Feedback filter cutoff controls brightness (reuse filterFreq)
    var brightness = instrument.filterFreq || 4000;

    // Delay period = 1/freq, compensated for the lowpass filter's group delay.
    // The feedback filter introduces a phase shift that lengthens the effective
    // loop, making the pitch flat. Subtract the approximate group delay of a
    // first-order lowpass: 1 / (2π × cutoff).
    var period = 1 / freq - 1 / (2 * Math.PI * brightness);
    if (period < 1 / ctx.sampleRate) period = 1 / ctx.sampleRate;

    // Noise burst duration — short excitation
    var burstDur = 0.02;

    // ADSR-derived total sustain time (pluck decays naturally, but we
    // use release as a rough guide for how long the feedback sustains)
    var decayTime = (instrument.decay || 0.1) + (instrument.release || 0.15) + 1.5;
    var totalDur = burstDur + decayTime + 0.5;

    // Envelope gain
    var envGain = ctx.createGain();
    envGain.gain.setValueAtTime(vol, t);

    // Noise burst source
    var burstBuffer = createNoiseBuffer(burstDur + 0.01);
    var burstSource = ctx.createBufferSource();
    burstSource.buffer = burstBuffer;

    // Delay line (tuned to pitch)
    var delay = ctx.createDelay(1);
    delay.delayTime.setValueAtTime(period, t);

    // Feedback gain (controls sustain length)
    var feedbackGain = ctx.createGain();
    feedbackGain.gain.setValueAtTime(0.996, t);

    // Feedback lowpass filter (controls brightness/damping)
    var feedbackFilter = ctx.createBiquadFilter();
    feedbackFilter.type = "lowpass";
    feedbackFilter.frequency.setValueAtTime(brightness, t);
    feedbackFilter.Q.setValueAtTime(0.5, t);

    // Signal chain: burst → delay → feedbackFilter → feedbackGain → delay (loop)
    //                                                            └→ envGain → output
    burstSource.connect(delay);
    delay.connect(feedbackFilter);
    feedbackFilter.connect(feedbackGain);
    feedbackGain.connect(delay);       // feedback loop
    feedbackGain.connect(envGain);     // output tap

    // Optional detuned 2nd pluck for chorus/12-string effect
    var delay2 = null, feedbackGain2 = null, feedbackFilter2 = null, burstSource2 = null;
    if (instrument.detuneOsc) {
      var d2 = instrument.detuneAmount || 7;
      var freq2 = freq * Math.pow(2, d2 / 1200);
      var period2 = 1 / freq2 - 1 / (2 * Math.PI * brightness);
      if (period2 < 1 / ctx.sampleRate) period2 = 1 / ctx.sampleRate;

      var burstBuffer2 = createNoiseBuffer(burstDur + 0.01);
      burstSource2 = ctx.createBufferSource();
      burstSource2.buffer = burstBuffer2;

      delay2 = ctx.createDelay(1);
      delay2.delayTime.setValueAtTime(period2, t);

      feedbackGain2 = ctx.createGain();
      feedbackGain2.gain.setValueAtTime(0.996, t);

      feedbackFilter2 = ctx.createBiquadFilter();
      feedbackFilter2.type = "lowpass";
      feedbackFilter2.frequency.setValueAtTime(brightness, t);
      feedbackFilter2.Q.setValueAtTime(0.5, t);

      burstSource2.connect(delay2);
      delay2.connect(feedbackFilter2);
      feedbackFilter2.connect(feedbackGain2);
      feedbackGain2.connect(delay2);
      feedbackGain2.connect(envGain);

      burstSource2.start(t);
      burstSource2.stop(t + burstDur);
    }

    // Optional instrument filter (on the output)
    var filter = null;
    if (instrument.filterType && instrument.filterType !== "none") {
      filter = createFilter(instrument, t);
      envGain.connect(filter);
      filter.connect(channelGains[ch]);
    } else {
      envGain.connect(channelGains[ch]);
    }

    burstSource.start(t);
    burstSource.stop(t + burstDur);

    // Schedule natural decay: ramp feedback to 0
    feedbackGain.gain.linearRampToValueAtTime(0, t + decayTime);
    if (feedbackGain2) {
      feedbackGain2.gain.linearRampToValueAtTime(0, t + decayTime);
    }

    var handle = {
      type: "pluck",
      burstSource: burstSource,
      burstSource2: burstSource2,
      delay: delay,
      delay2: delay2,
      feedbackGain: feedbackGain,
      feedbackGain2: feedbackGain2,
      feedbackFilter: feedbackFilter,
      feedbackFilter2: feedbackFilter2,
      filter: filter,
      envGain: envGain,
      instrument: instrument,
      channel: ch,
      startTime: t,
      released: false,
      decayTime: decayTime
    };

    activeVoices.push(handle);

    // Auto-cleanup after decay
    setTimeout(function () {
      try {
        burstSource.disconnect();
        if (burstSource2) burstSource2.disconnect();
        delay.disconnect();
        if (delay2) delay2.disconnect();
        feedbackGain.disconnect();
        if (feedbackGain2) feedbackGain2.disconnect();
        feedbackFilter.disconnect();
        if (feedbackFilter2) feedbackFilter2.disconnect();
        if (filter) filter.disconnect();
        envGain.disconnect();
      } catch (e) {}
      removeVoice(handle);
    }, (totalDur + 0.1) * 1000);

    return handle;
  }

  /**
   * triggerFM — FM (Frequency Modulation) synthesis.
   * Modulator oscillator modulates carrier frequency at audio rate.
   */
  function triggerFM(channel, midiNote, instrument, time) {
    if (!ctx) return null;

    var ch = clampChannel(channel);
    var t = time || ctx.currentTime;
    var freq = midiToFreq(midiNote);

    var fmRatio = instrument.fmRatio !== undefined ? instrument.fmRatio : 2;
    var fmDepth = instrument.fmDepth !== undefined ? instrument.fmDepth : 200;
    var fmWave = instrument.fmWave || "sine";

    // ADSR gain node
    var envGain = ctx.createGain();
    applyADSR(envGain, instrument, t);

    // Carrier oscillator (always sine for clean FM)
    var carrier = ctx.createOscillator();
    carrier.type = "sine";
    carrier.frequency.setValueAtTime(freq, t);

    // Modulator oscillator
    var modulator = ctx.createOscillator();
    modulator.type = fmWave;
    modulator.frequency.setValueAtTime(freq * fmRatio, t);

    // Modulation depth gain (Hz of frequency deviation)
    var modGain = ctx.createGain();
    modGain.gain.setValueAtTime(fmDepth, t);

    // FM routing: modulator → modGain → carrier.frequency
    modulator.connect(modGain);
    modGain.connect(carrier.frequency);

    // Optional detuned 2nd FM voice for chorus
    var carrier2 = null, modulator2 = null, modGain2 = null;
    if (instrument.detuneOsc) {
      var d2 = instrument.detuneAmount || 7;

      carrier2 = ctx.createOscillator();
      carrier2.type = "sine";
      carrier2.frequency.setValueAtTime(freq, t);
      carrier2.detune.setValueAtTime(d2, t);

      modulator2 = ctx.createOscillator();
      modulator2.type = fmWave;
      modulator2.frequency.setValueAtTime(freq * fmRatio, t);
      modulator2.detune.setValueAtTime(d2, t);

      modGain2 = ctx.createGain();
      modGain2.gain.setValueAtTime(fmDepth, t);

      modulator2.connect(modGain2);
      modGain2.connect(carrier2.frequency);
    }

    // Optional filter
    var filter = createFilter(instrument, t);
    var target = filter || envGain;

    carrier.connect(target);
    if (carrier2) carrier2.connect(target);

    if (filter) {
      filter.connect(envGain);
    }

    envGain.connect(channelGains[ch]);

    carrier.start(t);
    modulator.start(t);
    if (carrier2) carrier2.start(t);
    if (modulator2) modulator2.start(t);

    var handle = {
      type: "fm",
      carrier: carrier,
      modulator: modulator,
      modGain: modGain,
      carrier2: carrier2,
      modulator2: modulator2,
      modGain2: modGain2,
      filter: filter,
      envGain: envGain,
      instrument: instrument,
      channel: ch,
      startTime: t,
      released: false
    };

    activeVoices.push(handle);
    return handle;
  }

  function setMasterVolume(v) {
    if (masterGain) {
      masterGain.gain.setValueAtTime(
        Math.max(0, Math.min(1, v)),
        ctx.currentTime
      );
    }
  }

  function setChannelVolume(ch, v) {
    var c = clampChannel(ch);
    if (channelGains[c]) {
      channelGains[c].gain.setValueAtTime(
        Math.max(0, Math.min(1, v)),
        ctx.currentTime
      );
    }
  }

  function dispose() {
    // Stop and disconnect all active voices
    for (var i = activeVoices.length - 1; i >= 0; i--) {
      var h = activeVoices[i];
      try {
        if (h.type === "tone") {
          h.osc1.stop();
          h.osc1.disconnect();
          if (h.osc2) {
            h.osc2.stop();
            h.osc2.disconnect();
          }
        } else if (h.type === "noise") {
          h.source.stop();
          h.source.disconnect();
        } else if (h.type === "pluck") {
          h.burstSource.disconnect();
          if (h.burstSource2) h.burstSource2.disconnect();
          h.delay.disconnect();
          if (h.delay2) h.delay2.disconnect();
          h.feedbackGain.disconnect();
          if (h.feedbackGain2) h.feedbackGain2.disconnect();
          h.feedbackFilter.disconnect();
          if (h.feedbackFilter2) h.feedbackFilter2.disconnect();
        } else if (h.type === "fm") {
          h.carrier.stop();
          h.carrier.disconnect();
          h.modulator.stop();
          h.modulator.disconnect();
          h.modGain.disconnect();
          if (h.carrier2) { h.carrier2.stop(); h.carrier2.disconnect(); }
          if (h.modulator2) { h.modulator2.stop(); h.modulator2.disconnect(); }
          if (h.modGain2) h.modGain2.disconnect();
        }
        if (h.filter) h.filter.disconnect();
        h.envGain.disconnect();
      } catch (e) {
        // already stopped/disconnected
      }
    }
    activeVoices.length = 0;

    // Close context
    if (ctx) {
      ctx.close().catch(function () {});
      ctx = null;
    }

    masterGain = null;
    channelGains = [null, null, null, null];
    pulseWaves = {};
  }

  function getContext() {
    return ctx;
  }

  function getTime() {
    return ctx ? ctx.currentTime : 0;
  }

  // ---- Public interface ----

  return {
    init: init,
    noteOn: noteOn,
    noteOff: noteOff,
    triggerNoise: triggerNoise,
    triggerPluck: triggerPluck,
    triggerFM: triggerFM,
    retunePluck: retunePluck,
    getChannelVoice: getChannelVoice,
    setMasterVolume: setMasterVolume,
    setChannelVolume: setChannelVolume,
    dispose: dispose,
    getContext: getContext,
    getTime: getTime
  };
})();
