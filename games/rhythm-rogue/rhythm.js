/**
 * Rhythm Rogue — Rhythm System
 * Manages beat tracking, combo multiplier, and beat-reactive visual state.
 * Exposes RhythmSystem global.
 */
var RhythmSystem = (function () {
  'use strict';

  var lastBeat = -1;
  var beatPulse = 0;      // 1.0 on beat, decays to 0
  var screenShake = 0;     // shake intensity
  var comboMultiplier = 1;
  var moveOnThisBeat = false;
  var enemiesMovedThisBeat = false;

  // Beat timing feedback
  var feedback = { text: '', timer: 0, color: '#fff' };

  // Colors that pulse on beat
  var beatHue = 0;

  function update(dt) {
    var currentBeat = RhythmAudio.getCurrentBeat();

    // Detect new beat
    if (currentBeat > lastBeat && lastBeat >= 0) {
      onNewBeat(currentBeat);
    }
    lastBeat = currentBeat;

    // Decay beat pulse
    beatPulse *= Math.pow(0.02, dt);
    if (beatPulse < 0.01) beatPulse = 0;

    // Decay screen shake
    screenShake *= Math.pow(0.01, dt);
    if (screenShake < 0.5) screenShake = 0;

    // Feedback timer
    if (feedback.timer > 0) {
      feedback.timer -= dt;
      if (feedback.timer <= 0) feedback.text = '';
    }

    // Beat hue rotation
    beatHue = (beatHue + dt * 30) % 360;
  }

  function onNewBeat(beatNum) {
    beatPulse = 1.0;
    moveOnThisBeat = false;
    enemiesMovedThisBeat = false;
  }

  function registerMove(timing) {
    moveOnThisBeat = true;

    if (timing.rating === 'perfect') {
      RhythmEntities.player.combo++;
      RhythmEntities.player.beatHits++;
      showFeedback('PERFECT', '#ffdd44');
    } else if (timing.rating === 'good') {
      RhythmEntities.player.combo++;
      RhythmEntities.player.beatHits++;
      showFeedback('GOOD', '#66ff88');
    } else if (timing.rating === 'ok') {
      RhythmEntities.player.combo++;
      RhythmEntities.player.beatHits++;
      showFeedback('OK', '#88aaff');
    } else {
      // Off-beat - break combo unless player has speed boots
      if (RhythmEntities.player.speed > 0) {
        RhythmEntities.player.combo++;
        showFeedback('SPEEDY', '#ffcc44');
      } else {
        if (RhythmEntities.player.combo > 0) {
          RhythmAudio.playSfx('combo-break');
        }
        RhythmEntities.player.combo = 0;
        RhythmEntities.player.beatMisses++;
        showFeedback('OFF-BEAT', '#ff4444');
        screenShake = 4;
      }
    }

    // Update max combo
    if (RhythmEntities.player.combo > RhythmEntities.player.maxCombo) {
      RhythmEntities.player.maxCombo = RhythmEntities.player.combo;
    }

    // Compute multiplier
    var c = RhythmEntities.player.combo;
    if (c >= 50) comboMultiplier = 4;
    else if (c >= 25) comboMultiplier = 3;
    else if (c >= 10) comboMultiplier = 2;
    else comboMultiplier = 1;
  }

  function showFeedback(text, color) {
    feedback.text = text;
    feedback.color = color;
    feedback.timer = 0.6;
  }

  function shouldEnemiesMove() {
    if (enemiesMovedThisBeat) return false;
    // Enemies move when a new beat fires
    var phase = RhythmAudio.getBeatPhase();
    if (phase < 0.05 && !enemiesMovedThisBeat) {
      return true;
    }
    return false;
  }

  function markEnemiesMoved() {
    enemiesMovedThisBeat = true;
  }

  return {
    update: update,
    registerMove: registerMove,
    showFeedback: showFeedback,
    shouldEnemiesMove: shouldEnemiesMove,
    markEnemiesMoved: markEnemiesMoved,
    getBeatPulse: function () { return beatPulse; },
    getScreenShake: function () { return screenShake; },
    getComboMultiplier: function () { return comboMultiplier; },
    getFeedback: function () { return feedback; },
    getBeatHue: function () { return beatHue; },
    getLastBeat: function () { return lastBeat; },
    reset: function () {
      lastBeat = -1;
      beatPulse = 0;
      screenShake = 0;
      comboMultiplier = 1;
      feedback = { text: '', timer: 0, color: '#fff' };
    }
  };
})();
