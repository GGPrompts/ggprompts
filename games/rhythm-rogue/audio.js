/**
 * Rhythm Rogue — Audio Module
 * Wraps ChipPlayer for song loading/playback and provides beat timing.
 * Exposes RhythmAudio global.
 */
var RhythmAudio = (function () {
  'use strict';

  var SONG_BASE = '../../music/audio-tracker/songs/';
  var MANIFEST_URL = SONG_BASE + 'index.json';

  var songManifest = [];
  var currentSong = null;
  var songStartTime = 0;
  var bpm = 120;
  var beatInterval = 0.5; // seconds per beat
  var beatCount = 0;
  var audioCtx = null;

  // Sound effects
  var sfxCtx = null;
  var sfxGain = null;

  function init() {
    ChipPlayer.init();
    // Create a separate context for SFX or reuse
    sfxCtx = new (window.AudioContext || window.webkitAudioContext)();
    sfxGain = sfxCtx.createGain();
    sfxGain.gain.value = 0.3;
    sfxGain.connect(sfxCtx.destination);
  }

  function loadManifest(cb) {
    fetch(MANIFEST_URL)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        songManifest = data.songs || [];
        cb(songManifest);
      })
      .catch(function () { cb([]); });
  }

  function loadSong(filename, cb) {
    fetch(SONG_BASE + filename)
      .then(function (r) { return r.json(); })
      .then(function (songData) {
        currentSong = songData;
        bpm = songData.bpm || 120;
        beatInterval = 60 / bpm;
        ChipPlayer.load(songData);
        cb(songData);
      })
      .catch(function (e) { console.error('Failed to load song:', e); });
  }

  function playSong() {
    if (!currentSong) return;
    ChipPlayer.setVolume(0.45);
    ChipPlayer.play();
    songStartTime = performance.now() / 1000;
    beatCount = 0;
  }

  function stopSong() {
    ChipPlayer.stop();
    currentSong = null;
  }

  function getSongTime() {
    return performance.now() / 1000 - songStartTime;
  }

  /** Returns how close we are to the nearest beat (0 = perfect, 0.5 = worst). */
  function getBeatPhase() {
    var t = getSongTime();
    var phase = (t % beatInterval) / beatInterval;
    // Normalize so 0 = on beat, 0.5 = furthest from beat
    return phase <= 0.5 ? phase : 1 - phase;
  }

  /** Returns the current beat number (floored). */
  function getCurrentBeat() {
    return Math.floor(getSongTime() / beatInterval);
  }

  /** Returns fractional beat position. */
  function getBeatPosition() {
    return getSongTime() / beatInterval;
  }

  /** Check if an action at current time is "on beat". Returns rating or null. */
  function checkBeatTiming() {
    var phase = getBeatPhase();
    if (phase < 0.12) return { rating: 'perfect', phase: phase, score: 3 };
    if (phase < 0.22) return { rating: 'good', phase: phase, score: 2 };
    if (phase < 0.32) return { rating: 'ok', phase: phase, score: 1 };
    return { rating: 'miss', phase: phase, score: 0 };
  }

  // Simple SFX via oscillator
  function playSfx(type) {
    if (!sfxCtx) return;
    if (sfxCtx.state === 'suspended') sfxCtx.resume();
    var now = sfxCtx.currentTime;
    var osc = sfxCtx.createOscillator();
    var g = sfxCtx.createGain();
    osc.connect(g);
    g.connect(sfxGain);

    switch (type) {
      case 'step':
        osc.type = 'square';
        osc.frequency.setValueAtTime(220, now);
        g.gain.setValueAtTime(0.15, now);
        g.gain.linearRampToValueAtTime(0, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
        break;
      case 'hit':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.linearRampToValueAtTime(110, now + 0.1);
        g.gain.setValueAtTime(0.25, now);
        g.gain.linearRampToValueAtTime(0, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      case 'hurt':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(60, now + 0.2);
        g.gain.setValueAtTime(0.3, now);
        g.gain.linearRampToValueAtTime(0, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
      case 'coin':
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.setValueAtTime(1320, now + 0.06);
        g.gain.setValueAtTime(0.2, now);
        g.gain.linearRampToValueAtTime(0, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
        break;
      case 'stairs':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.linearRampToValueAtTime(880, now + 0.3);
        g.gain.setValueAtTime(0.2, now);
        g.gain.linearRampToValueAtTime(0, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
      case 'miss':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(100, now);
        g.gain.setValueAtTime(0.12, now);
        g.gain.linearRampToValueAtTime(0, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
        break;
      case 'combo-break':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.linearRampToValueAtTime(50, now + 0.3);
        g.gain.setValueAtTime(0.25, now);
        g.gain.linearRampToValueAtTime(0, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
    }
  }

  return {
    init: init,
    loadManifest: loadManifest,
    loadSong: loadSong,
    playSong: playSong,
    stopSong: stopSong,
    getSongTime: getSongTime,
    getBeatPhase: getBeatPhase,
    getCurrentBeat: getCurrentBeat,
    getBeatPosition: getBeatPosition,
    checkBeatTiming: checkBeatTiming,
    playSfx: playSfx,
    getBpm: function () { return bpm; },
    getBeatInterval: function () { return beatInterval; },
    getManifest: function () { return songManifest; },
    isPlaying: function () { return ChipPlayer.isPlaying(); }
  };
})();
