/* engine.js — Game loop, round management, scoring, and hints for Sketch Detective
   Manages 10-drawing rounds with timed scoring, streak multiplier, and 3 hint levels. */

window.SketchEngine = (function () {
    'use strict';

    // --- Config ---
    var DRAWINGS_PER_ROUND = 10;
    var BASE_POINTS = 1000;
    var TIME_LIMIT = 30;          // seconds per drawing
    var HINT_PENALTY = 0.15;      // fraction of remaining points lost per hint
    var STREAK_BONUS = 0.25;      // 25% extra per consecutive correct guess

    // --- State ---
    var drawings = [];
    var currentIndex = 0;
    var currentDrawing = null;
    var score = 0;
    var roundScore = 0;
    var streak = 0;
    var bestStreak = 0;
    var hintsUsed = 0;
    var hintLevel = 0;           // 0 = none, 1 = category, 2 = first letter, 3 = partial
    var timerStart = 0;
    var timerInterval = null;
    var timeLeft = TIME_LIMIT;
    var roundOver = false;
    var skipped = 0;

    var onTick = null;
    var onRoundEnd = null;
    var onDrawingEnd = null;

    function startRound(callbacks) {
        onTick = callbacks.onTick || null;
        onRoundEnd = callbacks.onRoundEnd || null;
        onDrawingEnd = callbacks.onDrawingEnd || null;

        drawings = window.SketchDrawings.getRandom(DRAWINGS_PER_ROUND);
        currentIndex = 0;
        roundScore = 0;
        streak = 0;
        bestStreak = 0;
        hintsUsed = 0;
        skipped = 0;
        roundOver = false;

        return nextDrawing();
    }

    function nextDrawing() {
        if (currentIndex >= drawings.length) {
            roundOver = true;
            if (onRoundEnd) {
                onRoundEnd(getRoundSummary());
            }
            return null;
        }

        currentDrawing = drawings[currentIndex];
        hintLevel = 0;
        timeLeft = TIME_LIMIT;
        startTimer();
        return currentDrawing;
    }

    function startTimer() {
        timerStart = Date.now();
        clearInterval(timerInterval);
        timerInterval = setInterval(function () {
            var elapsed = (Date.now() - timerStart) / 1000;
            timeLeft = Math.max(0, TIME_LIMIT - elapsed);
            if (onTick) onTick(timeLeft, TIME_LIMIT);
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                handleTimeout();
            }
        }, 100);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    function handleTimeout() {
        streak = 0;
        skipped++;
        if (onDrawingEnd) {
            onDrawingEnd({
                correct: false,
                timeout: true,
                word: currentDrawing.word,
                points: 0,
                streak: streak
            });
        }
        currentIndex++;
        nextDrawing();
    }

    function submitGuess(guess) {
        if (!currentDrawing || roundOver) return null;

        var normalized = guess.trim().toLowerCase();
        var answer = currentDrawing.word.toLowerCase();

        if (normalized === answer) {
            stopTimer();
            var elapsed = (Date.now() - timerStart) / 1000;
            var timeFraction = Math.max(0, (TIME_LIMIT - elapsed) / TIME_LIMIT);
            var points = Math.round(BASE_POINTS * timeFraction);

            // Apply hint penalty
            points = Math.round(points * (1 - hintLevel * HINT_PENALTY));
            points = Math.max(50, points); // minimum 50 for correct

            // Apply streak multiplier
            streak++;
            if (streak > 1) {
                var multiplier = 1 + (streak - 1) * STREAK_BONUS;
                points = Math.round(points * multiplier);
            }
            if (streak > bestStreak) bestStreak = streak;

            score += points;
            roundScore += points;

            var result = {
                correct: true,
                timeout: false,
                word: currentDrawing.word,
                points: points,
                streak: streak,
                timeLeft: timeLeft
            };

            if (onDrawingEnd) onDrawingEnd(result);
            currentIndex++;
            nextDrawing();
            return result;
        }

        return null; // wrong guess, keep trying
    }

    function skip() {
        if (!currentDrawing || roundOver) return;
        stopTimer();
        streak = 0;
        skipped++;
        if (onDrawingEnd) {
            onDrawingEnd({
                correct: false,
                timeout: false,
                word: currentDrawing.word,
                points: 0,
                streak: streak
            });
        }
        currentIndex++;
        nextDrawing();
    }

    function requestHint() {
        if (!currentDrawing || hintLevel >= 3) return null;
        hintLevel++;
        hintsUsed++;

        var word = currentDrawing.word;
        var hint = {};

        switch (hintLevel) {
            case 1:
                hint.type = 'category';
                hint.text = currentDrawing.category;
                break;
            case 2:
                hint.type = 'letter';
                var blanks = [];
                for (var i = 1; i < word.length; i++) {
                    blanks.push(word[i] === ' ' ? ' ' : '_');
                }
                hint.text = word.charAt(0).toUpperCase() + ' ' + blanks.join(' ');
                break;
            case 3:
                hint.type = 'partial';
                var revealed = '';
                for (var i = 0; i < word.length; i++) {
                    if (word[i] === ' ') {
                        revealed += '  ';
                    } else if (i === 0 || i === word.length - 1 || Math.random() < 0.4) {
                        revealed += word[i].toUpperCase();
                    } else {
                        revealed += '_';
                    }
                    if (i < word.length - 1) revealed += ' ';
                }
                hint.text = revealed;
                break;
        }

        hint.level = hintLevel;
        return hint;
    }

    function advance() {
        currentIndex++;
        return nextDrawing();
    }

    function getHintLevel() {
        return hintLevel;
    }

    function getTimeLeft() {
        return timeLeft;
    }

    function getScore() {
        return score;
    }

    function getStreak() {
        return streak;
    }

    function getCurrentIndex() {
        return currentIndex;
    }

    function getTotalDrawings() {
        return DRAWINGS_PER_ROUND;
    }

    function getCurrentDrawing() {
        return currentDrawing;
    }

    function getCurrentWord() {
        return currentDrawing ? currentDrawing.word : '';
    }

    function getRoundSummary() {
        return {
            score: roundScore,
            totalScore: score,
            correct: DRAWINGS_PER_ROUND - skipped,
            total: DRAWINGS_PER_ROUND,
            bestStreak: bestStreak,
            hintsUsed: hintsUsed,
            skipped: skipped
        };
    }

    function resetScore() {
        score = 0;
    }

    function destroy() {
        stopTimer();
        drawings = [];
        currentDrawing = null;
        roundOver = true;
    }

    return {
        startRound: startRound,
        submitGuess: submitGuess,
        requestHint: requestHint,
        skip: skip,
        advance: advance,
        getHintLevel: getHintLevel,
        getTimeLeft: getTimeLeft,
        getScore: getScore,
        getStreak: getStreak,
        getCurrentDrawing: getCurrentDrawing,
        getCurrentIndex: getCurrentIndex,
        getTotalDrawings: getTotalDrawings,
        getCurrentWord: getCurrentWord,
        getRoundSummary: getRoundSummary,
        resetScore: resetScore,
        destroy: destroy,
        TIME_LIMIT: TIME_LIMIT
    };
})();
