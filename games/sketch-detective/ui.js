/* ui.js — Menu, guess input, score display, streak counter for Sketch Detective
   Wires together SketchEngine and SketchRenderer to drive the full game UI. */

window.SketchUI = (function () {
    'use strict';

    // --- DOM refs ---
    var screens = {};
    var els = {};

    // --- State ---
    var currentDrawing = null;
    var drawingFinished = false;
    var resultTimeout = null;

    function init() {
        // Cache screens
        screens.menu = document.getElementById('screen-menu');
        screens.game = document.getElementById('screen-game');
        screens.result = document.getElementById('screen-result');
        screens.summary = document.getElementById('screen-summary');

        // Cache elements
        els.startBtn = document.getElementById('btn-start');
        els.canvas = document.getElementById('sketch-canvas');
        els.guessInput = document.getElementById('guess-input');
        els.hintBtn = document.getElementById('btn-hint');
        els.skipBtn = document.getElementById('btn-skip');
        els.scoreDisplay = document.getElementById('score-display');
        els.streakDisplay = document.getElementById('streak-display');
        els.timerBar = document.getElementById('timer-bar');
        els.timerText = document.getElementById('timer-text');
        els.progressText = document.getElementById('progress-text');
        els.hintText = document.getElementById('hint-text');

        // Result screen
        els.resultIcon = document.getElementById('result-icon');
        els.resultWord = document.getElementById('result-word');
        els.resultPoints = document.getElementById('result-points');
        els.resultMessage = document.getElementById('result-message');
        els.nextBtn = document.getElementById('btn-next');

        // Summary screen
        els.summaryScore = document.getElementById('summary-score');
        els.summaryCorrect = document.getElementById('summary-correct');
        els.summaryStreak = document.getElementById('summary-streak');
        els.summaryHints = document.getElementById('summary-hints');
        els.playAgainBtn = document.getElementById('btn-play-again');

        // Drawing count on menu
        var countEl = document.getElementById('drawing-count');
        if (countEl) countEl.textContent = window.SketchDrawings.count();

        // Init renderer
        window.SketchRenderer.init(els.canvas);

        // Bind events
        els.startBtn.addEventListener('click', startGame);
        els.guessInput.addEventListener('input', handleInput);
        els.guessInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                // Submit current value
                var result = window.SketchEngine.submitGuess(els.guessInput.value);
                if (!result) {
                    shakeInput();
                }
            }
        });
        els.hintBtn.addEventListener('click', handleHint);
        els.skipBtn.addEventListener('click', handleSkip);
        els.nextBtn.addEventListener('click', handleNext);
        els.playAgainBtn.addEventListener('click', startGame);

        // Resize handler
        window.addEventListener('resize', function () {
            window.SketchRenderer.resize();
        });

        showScreen('menu');
    }

    function showScreen(name) {
        Object.keys(screens).forEach(function (key) {
            screens[key].classList.toggle('active', key === name);
        });
    }

    function startGame() {
        window.SketchEngine.resetScore();
        showScreen('game');

        var drawing = window.SketchEngine.startRound({
            onTick: updateTimer,
            onRoundEnd: showSummary,
            onDrawingEnd: showResult
        });

        if (drawing) {
            loadDrawing(drawing);
        }
    }

    function loadDrawing(drawing) {
        currentDrawing = drawing;
        drawingFinished = false;

        // Reset UI
        els.guessInput.value = '';
        els.guessInput.disabled = false;
        els.guessInput.focus();
        els.hintText.textContent = '';
        els.hintText.className = 'hint-text';
        els.hintBtn.disabled = false;
        els.skipBtn.disabled = false;

        updateScore();
        updateStreak();
        updateProgress();

        // Load and play drawing
        window.SketchRenderer.load(drawing, 1);
        window.SketchRenderer.play(function () {
            drawingFinished = true;
        });
    }

    function handleInput() {
        // Only submit on Enter keypress, not on live input
    }

    function shakeInput() {
        els.guessInput.classList.add('shake');
        setTimeout(function () {
            els.guessInput.classList.remove('shake');
        }, 500);
    }

    function handleHint() {
        var hint = window.SketchEngine.requestHint();
        if (!hint) return;

        els.hintText.textContent = hint.type === 'category'
            ? 'Category: ' + hint.text
            : hint.text;
        els.hintText.className = 'hint-text hint-level-' + hint.level;

        if (hint.level >= 3) {
            els.hintBtn.disabled = true;
        }

        updateScore(); // score display might change visual
    }

    function handleSkip() {
        window.SketchRenderer.stop();
        window.SketchEngine.skip();
    }

    function handleNext() {
        clearTimeout(resultTimeout);
        showScreen('game');
        // Drawing already advanced by engine after submitGuess/skip/timeout
        var drawing = window.SketchEngine.getCurrentDrawing();
        if (drawing) {
            loadDrawing(drawing);
        }
    }

    function showResult(result) {
        window.SketchRenderer.stop();
        els.guessInput.disabled = true;

        // Show the completed drawing
        window.SketchRenderer.drawComplete();

        if (result.correct) {
            els.resultIcon.textContent = 'Correct!';
            els.resultIcon.className = 'result-icon correct';
            els.resultPoints.textContent = '+' + result.points + ' pts';
            els.resultMessage.textContent = result.streak > 1
                ? result.streak + 'x streak bonus!'
                : 'Nice guess!';
        } else {
            els.resultIcon.textContent = result.timeout ? 'Time\'s Up!' : 'Skipped';
            els.resultIcon.className = 'result-icon wrong';
            els.resultPoints.textContent = '+0 pts';
            els.resultMessage.textContent = '';
        }

        els.resultWord.textContent = 'It was: ' + result.word;
        updateScore();
        updateStreak();

        showScreen('result');
    }

    function showSummary(summary) {
        // Delay slightly so last result is seen
        setTimeout(function () {
            els.summaryScore.textContent = summary.totalScore;
            els.summaryCorrect.textContent = summary.correct + ' / ' + summary.total;
            els.summaryStreak.textContent = summary.bestStreak;
            els.summaryHints.textContent = summary.hintsUsed;
            showScreen('summary');
        }, 200);
    }

    function updateTimer(timeLeft, timeLimit) {
        var pct = (timeLeft / timeLimit) * 100;
        els.timerBar.style.width = pct + '%';

        if (pct < 20) {
            els.timerBar.className = 'timer-bar danger';
        } else if (pct < 50) {
            els.timerBar.className = 'timer-bar warning';
        } else {
            els.timerBar.className = 'timer-bar';
        }

        els.timerText.textContent = Math.ceil(timeLeft) + 's';
    }

    function updateScore() {
        els.scoreDisplay.textContent = window.SketchEngine.getScore();
    }

    function updateStreak() {
        var streak = window.SketchEngine.getStreak();
        if (streak > 1) {
            els.streakDisplay.textContent = streak + 'x';
            els.streakDisplay.classList.add('active');
        } else {
            els.streakDisplay.textContent = '';
            els.streakDisplay.classList.remove('active');
        }
    }

    function updateProgress() {
        var idx = window.SketchEngine.getCurrentIndex() + 1;
        var total = window.SketchEngine.getTotalDrawings();
        els.progressText.textContent = idx + ' / ' + total;
    }

    return {
        init: init
    };
})();

// Boot
document.addEventListener('DOMContentLoaded', function () {
    window.SketchUI.init();
});
