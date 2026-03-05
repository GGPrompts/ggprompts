/* Simon Game Engine — pattern generation, playback, input, scoring */
'use strict';

window.SimonEngine = (function () {
  var COLORS = ['green', 'red', 'yellow', 'blue'];
  var HIGH_SCORE_KEY = 'simon-high-score';

  var state = {
    pattern: [],
    playerIndex: 0,
    round: 0,
    highScore: 0,
    phase: 'idle',       // idle | playback | input | gameover
    strict: false,
    speed: 600           // ms per step (decreases with difficulty)
  };

  var callbacks = {
    onLightUp: null,     // (color, duration) => void
    onRoundUpdate: null, // (round) => void
    onHighScore: null,   // (score) => void
    onGameOver: null,    // (round) => void
    onPhaseChange: null  // (phase) => void
  };

  function init(cbs) {
    Object.assign(callbacks, cbs);
    state.highScore = parseInt(localStorage.getItem(HIGH_SCORE_KEY) || '0', 10);
    if (callbacks.onHighScore) callbacks.onHighScore(state.highScore);
  }

  function setStrict(val) {
    state.strict = !!val;
  }

  function getPhase() { return state.phase; }
  function getRound() { return state.round; }

  /** Calculate step timing based on round (progressive difficulty) */
  function getStepTiming() {
    /* Rounds 1-4: 600ms, 5-8: 500ms, 9-12: 400ms, 13+: 300ms */
    if (state.round <= 4) return 600;
    if (state.round <= 8) return 500;
    if (state.round <= 12) return 400;
    return 300;
  }

  /** Start a new game */
  function startGame() {
    state.pattern = [];
    state.playerIndex = 0;
    state.round = 0;
    state.phase = 'idle';
    nextRound();
  }

  /** Advance to the next round */
  function nextRound() {
    state.round++;
    state.playerIndex = 0;
    state.speed = getStepTiming();

    /* Add a random color to the pattern */
    state.pattern.push(COLORS[Math.floor(Math.random() * 4)]);

    if (callbacks.onRoundUpdate) callbacks.onRoundUpdate(state.round);
    setPhase('playback');

    /* Small delay before playback starts */
    setTimeout(function () { playbackSequence(); }, 500);
  }

  /** Play the entire pattern sequence with lighting + tones */
  function playbackSequence() {
    var i = 0;
    var toneDuration = Math.max(state.speed * 0.6, 200) / 1000;

    function playNext() {
      if (i >= state.pattern.length) {
        /* Done showing pattern, switch to input phase */
        setTimeout(function () { setPhase('input'); }, 300);
        return;
      }
      var color = state.pattern[i];
      SimonAudio.playTone(color, toneDuration);
      if (callbacks.onLightUp) callbacks.onLightUp(color, state.speed * 0.7);
      i++;
      setTimeout(playNext, state.speed);
    }
    playNext();
  }

  /** Handle player pressing a color pad */
  function playerInput(color) {
    if (state.phase !== 'input') return;

    var expected = state.pattern[state.playerIndex];
    var toneDuration = 0.3;

    if (color === expected) {
      /* Correct */
      SimonAudio.playTone(color, toneDuration);
      if (callbacks.onLightUp) callbacks.onLightUp(color, 250);
      state.playerIndex++;

      if (state.playerIndex >= state.pattern.length) {
        /* Completed the round */
        setPhase('playback');
        SimonAudio.playSuccess();

        /* Update high score */
        if (state.round > state.highScore) {
          state.highScore = state.round;
          localStorage.setItem(HIGH_SCORE_KEY, String(state.highScore));
          if (callbacks.onHighScore) callbacks.onHighScore(state.highScore);
        }

        setTimeout(function () { nextRound(); }, 1000);
      }
    } else {
      /* Wrong */
      handleWrong();
    }
  }

  function handleWrong() {
    SimonAudio.playFail();
    if (state.strict) {
      gameOver();
    } else {
      /* Replay the pattern (forgiving mode) */
      state.playerIndex = 0;
      setPhase('playback');
      /* Flash all pads red briefly */
      COLORS.forEach(function (c) {
        if (callbacks.onLightUp) callbacks.onLightUp(c, 300);
      });
      setTimeout(function () { playbackSequence(); }, 1200);
    }
  }

  function gameOver() {
    setPhase('gameover');
    SimonAudio.playGameOver();
    if (callbacks.onGameOver) callbacks.onGameOver(state.round);
  }

  function setPhase(p) {
    state.phase = p;
    if (callbacks.onPhaseChange) callbacks.onPhaseChange(p);
  }

  return {
    init: init,
    startGame: startGame,
    playerInput: playerInput,
    setStrict: setStrict,
    getPhase: getPhase,
    getRound: getRound
  };
})();
