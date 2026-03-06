/**
 * Trivia Arena Game Engine
 * Handles game state, timer, scoring, lifelines, streaks, and rounds
 */
(function() {
  'use strict';

  /* ===== CONSTANTS ===== */
  const ROUND_TIME = 15;           // seconds per question
  const STREAK_BONUS_THRESHOLD = 3; // streak count to get bonus
  const STREAK_BONUS_POINTS = 50;   // bonus per streak milestone
  const BASE_POINTS = 100;          // base points per correct answer
  const TIME_BONUS_MULTIPLIER = 10; // points per second remaining
  const QUESTIONS_PER_ROUND = 10;

  /* ===== DOM REFS ===== */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  /* ===== AUDIO ===== */
  const Audio = {
    ctx: null,
    init() {
      if (this.ctx) return;
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    },
    play(type) {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      switch(type) {
        case 'correct':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(523, now);
          osc.frequency.setValueAtTime(659, now + 0.08);
          osc.frequency.setValueAtTime(784, now + 0.16);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialDecayToValueAtTime?.(0.001, now + 0.4) ||
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
          osc.start(now);
          osc.stop(now + 0.4);
          break;
        case 'wrong':
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(200, now);
          osc.frequency.setValueAtTime(150, now + 0.15);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          osc.start(now);
          osc.stop(now + 0.35);
          break;
        case 'tick':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, now);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
          osc.start(now);
          osc.stop(now + 0.05);
          break;
        case 'streak':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(660, now);
          osc.frequency.setValueAtTime(880, now + 0.1);
          osc.frequency.setValueAtTime(1100, now + 0.2);
          osc.frequency.setValueAtTime(1320, now + 0.3);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
          osc.start(now);
          osc.stop(now + 0.5);
          break;
        case 'timeup':
          osc.type = 'square';
          osc.frequency.setValueAtTime(300, now);
          osc.frequency.setValueAtTime(200, now + 0.15);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
          osc.start(now);
          osc.stop(now + 0.3);
          break;
        case 'fanfare':
          osc.type = 'sine';
          [523,659,784,1047].forEach((f, i) => {
            osc.frequency.setValueAtTime(f, now + i * 0.15);
          });
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
          osc.start(now);
          osc.stop(now + 0.8);
          break;
        case 'select':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(600, now);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          osc.start(now);
          osc.stop(now + 0.08);
          break;
      }
    }
  };

  /* ===== STATE ===== */
  let state = {
    category: null,
    questions: [],
    currentIndex: 0,
    score: 0,
    streak: 0,
    bestStreak: 0,
    correct: 0,
    wrong: 0,
    skipped: 0,
    timeLeft: ROUND_TIME,
    timer: null,
    status: 'menu',      // menu | playing | answered | paused | results
    lifelines: { fiftyFifty: 1, skip: 1 },
    eliminated: [],       // indices of 50/50 eliminated answers
    answered: false,
    stats: loadStats(),
  };

  function loadStats() {
    try {
      const s = JSON.parse(localStorage.getItem('trivia-arena-stats'));
      return s || { played: 0, totalScore: 0, totalCorrect: 0, totalWrong: 0, bestScore: 0, bestStreak: 0 };
    } catch(e) {
      return { played: 0, totalScore: 0, totalCorrect: 0, totalWrong: 0, bestScore: 0, bestStreak: 0 };
    }
  }

  function saveStats() {
    localStorage.setItem('trivia-arena-stats', JSON.stringify(state.stats));
  }

  /* ===== SHUFFLE ===== */
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /* ===== GAME FLOW ===== */
  function startGame(categoryKey) {
    Audio.init();
    const cat = window.TriviaQuestions[categoryKey];
    if (!cat) return;

    state.category = cat;
    state.questions = shuffle(cat.questions).slice(0, QUESTIONS_PER_ROUND);
    state.currentIndex = 0;
    state.score = 0;
    state.streak = 0;
    state.bestStreak = 0;
    state.correct = 0;
    state.wrong = 0;
    state.skipped = 0;
    state.lifelines = { fiftyFifty: 1, skip: 1 };
    state.eliminated = [];
    state.answered = false;
    state.status = 'playing';

    document.body.style.setProperty('--cat-color', cat.color);
    showGame();
    loadQuestion();
  }

  function loadQuestion() {
    if (state.currentIndex >= state.questions.length) {
      endGame();
      return;
    }

    state.answered = false;
    state.eliminated = [];
    state.timeLeft = ROUND_TIME;

    const q = state.questions[state.currentIndex];
    renderQuestion(q);
    startTimer();
    updateHUD();
    updateLifelineButtons();
  }

  function startTimer() {
    clearInterval(state.timer);
    updateTimerDisplay();
    state.timer = setInterval(() => {
      state.timeLeft--;
      updateTimerDisplay();
      if (state.timeLeft <= 5 && state.timeLeft > 0) {
        Audio.play('tick');
        $('.timer-ring').classList.add('urgent');
      }
      if (state.timeLeft <= 0) {
        clearInterval(state.timer);
        timeUp();
      }
    }, 1000);
  }

  function timeUp() {
    if (state.answered) return;
    state.answered = true;
    state.wrong++;
    state.streak = 0;
    Audio.play('timeup');

    const q = state.questions[state.currentIndex];
    revealAnswer(q.c, -1);
    showFeedback('Time\'s up!', false);

    setTimeout(() => nextQuestion(), 1800);
  }

  function selectAnswer(index) {
    if (state.answered) return;
    state.answered = true;
    clearInterval(state.timer);
    Audio.play('select');

    const q = state.questions[state.currentIndex];
    const isCorrect = index === q.c;

    if (isCorrect) {
      const timeBonus = state.timeLeft * TIME_BONUS_MULTIPLIER;
      let points = BASE_POINTS + timeBonus;
      state.streak++;
      if (state.streak > state.bestStreak) state.bestStreak = state.streak;
      state.correct++;

      let streakBonus = 0;
      if (state.streak >= STREAK_BONUS_THRESHOLD && state.streak % STREAK_BONUS_THRESHOLD === 0) {
        streakBonus = STREAK_BONUS_POINTS * (state.streak / STREAK_BONUS_THRESHOLD);
        setTimeout(() => Audio.play('streak'), 300);
      } else {
        setTimeout(() => Audio.play('correct'), 150);
      }

      points += streakBonus;
      state.score += points;
      showFeedback(`+${points} pts${streakBonus ? ' (streak x' + Math.floor(state.streak / STREAK_BONUS_THRESHOLD) + '!)' : ''}`, true);
    } else {
      state.wrong++;
      state.streak = 0;
      setTimeout(() => Audio.play('wrong'), 150);
      showFeedback('Wrong!', false);
    }

    revealAnswer(q.c, index);
    updateHUD();

    setTimeout(() => nextQuestion(), 1800);
  }

  function nextQuestion() {
    state.currentIndex++;
    hideFeedback();
    loadQuestion();
  }

  function endGame() {
    clearInterval(state.timer);
    state.status = 'results';

    // Update stats
    state.stats.played++;
    state.stats.totalScore += state.score;
    state.stats.totalCorrect += state.correct;
    state.stats.totalWrong += state.wrong;
    if (state.score > state.stats.bestScore) state.stats.bestScore = state.score;
    if (state.bestStreak > state.stats.bestStreak) state.stats.bestStreak = state.bestStreak;
    saveStats();

    Audio.play('fanfare');
    renderResults();
  }

  /* ===== LIFELINES ===== */
  function useFiftyFifty() {
    if (state.answered || state.lifelines.fiftyFifty <= 0) return;
    state.lifelines.fiftyFifty--;
    Audio.play('select');

    const q = state.questions[state.currentIndex];
    const wrongIndices = [0,1,2,3].filter(i => i !== q.c);
    const toEliminate = shuffle(wrongIndices).slice(0, 2);
    state.eliminated = toEliminate;

    toEliminate.forEach(i => {
      const btn = $$('.answer-btn')[i];
      if (btn) {
        btn.classList.add('eliminated');
        btn.disabled = true;
      }
    });

    updateLifelineButtons();
  }

  function useSkip() {
    if (state.answered || state.lifelines.skip <= 0) return;
    state.lifelines.skip--;
    state.answered = true;
    state.skipped++;
    clearInterval(state.timer);
    Audio.play('select');

    showFeedback('Skipped!', null);
    updateLifelineButtons();

    setTimeout(() => nextQuestion(), 800);
  }

  /* ===== RENDERING ===== */
  function showMenu() {
    state.status = 'menu';
    $('.screen-menu').classList.add('active');
    $('.screen-game').classList.remove('active');
    $('.screen-results').classList.remove('active');
    renderStats();
  }

  function showGame() {
    $('.screen-menu').classList.remove('active');
    $('.screen-game').classList.add('active');
    $('.screen-results').classList.remove('active');
  }

  function renderQuestion(q) {
    $('.question-text').textContent = q.q;
    $('.question-counter').textContent = `${state.currentIndex + 1} / ${state.questions.length}`;
    $('.category-badge').textContent = `${state.category.icon} ${state.category.name}`;

    const grid = $('.answers-grid');
    grid.innerHTML = '';
    const labels = ['A', 'B', 'C', 'D'];
    q.a.forEach((answer, i) => {
      const btn = document.createElement('button');
      btn.className = 'answer-btn';
      btn.innerHTML = `<span class="answer-label">${labels[i]}</span><span class="answer-text">${answer}</span>`;
      btn.addEventListener('click', () => selectAnswer(i));
      grid.appendChild(btn);
    });

    // Reset timer ring
    const ring = $('.timer-ring');
    ring.classList.remove('urgent');
    ring.style.setProperty('--progress', '1');
  }

  function revealAnswer(correctIdx, selectedIdx) {
    const btns = $$('.answer-btn');
    btns.forEach((btn, i) => {
      btn.disabled = true;
      if (i === correctIdx) btn.classList.add('correct');
      if (i === selectedIdx && selectedIdx !== correctIdx) btn.classList.add('wrong');
    });
  }

  function showFeedback(text, isCorrect) {
    const fb = $('.feedback');
    fb.textContent = text;
    fb.className = 'feedback visible';
    if (isCorrect === true) fb.classList.add('correct');
    else if (isCorrect === false) fb.classList.add('wrong');
    else fb.classList.add('neutral');
  }

  function hideFeedback() {
    $('.feedback').className = 'feedback';
  }

  function updateTimerDisplay() {
    const progress = state.timeLeft / ROUND_TIME;
    $('.timer-ring').style.setProperty('--progress', progress);
    $('.timer-text').textContent = state.timeLeft;

    if (state.timeLeft <= 5) {
      $('.timer-text').classList.add('urgent');
    } else {
      $('.timer-text').classList.remove('urgent');
    }
  }

  function updateHUD() {
    $('.hud-score').textContent = state.score;
    const streakEl = $('.hud-streak');
    streakEl.textContent = state.streak;
    if (state.streak >= STREAK_BONUS_THRESHOLD) {
      streakEl.classList.add('on-fire');
    } else {
      streakEl.classList.remove('on-fire');
    }
  }

  function updateLifelineButtons() {
    const ff = $('.lifeline-5050');
    const sk = $('.lifeline-skip');
    if (ff) {
      ff.disabled = state.lifelines.fiftyFifty <= 0 || state.answered;
      if (state.lifelines.fiftyFifty <= 0) ff.classList.add('used');
    }
    if (sk) {
      sk.disabled = state.lifelines.skip <= 0 || state.answered;
      if (state.lifelines.skip <= 0) sk.classList.add('used');
    }
  }

  function renderResults() {
    $('.screen-game').classList.remove('active');
    $('.screen-results').classList.add('active');

    const pct = state.questions.length > 0 ? Math.round((state.correct / state.questions.length) * 100) : 0;
    let grade, gradeClass;
    if (pct >= 90) { grade = 'S'; gradeClass = 'grade-s'; }
    else if (pct >= 80) { grade = 'A'; gradeClass = 'grade-a'; }
    else if (pct >= 70) { grade = 'B'; gradeClass = 'grade-b'; }
    else if (pct >= 60) { grade = 'C'; gradeClass = 'grade-c'; }
    else if (pct >= 50) { grade = 'D'; gradeClass = 'grade-d'; }
    else { grade = 'F'; gradeClass = 'grade-f'; }

    $('.result-grade').textContent = grade;
    $('.result-grade').className = 'result-grade ' + gradeClass;
    $('.result-score').textContent = state.score;
    $('.result-correct').textContent = state.correct;
    $('.result-wrong').textContent = state.wrong;
    $('.result-skipped').textContent = state.skipped;
    $('.result-streak').textContent = state.bestStreak;
    $('.result-accuracy').textContent = pct + '%';
    $('.result-category').textContent = `${state.category.icon} ${state.category.name}`;
  }

  function renderStats() {
    const s = state.stats;
    const el = $('.stats-display');
    if (!el) return;
    if (s.played === 0) {
      el.innerHTML = '<p class="stats-empty">No games played yet. Pick a category to begin!</p>';
      return;
    }
    el.innerHTML = `
      <div class="stat-item"><span class="stat-val">${s.played}</span><span class="stat-lbl">Played</span></div>
      <div class="stat-item"><span class="stat-val">${s.bestScore.toLocaleString()}</span><span class="stat-lbl">Best Score</span></div>
      <div class="stat-item"><span class="stat-val">${s.bestStreak}</span><span class="stat-lbl">Best Streak</span></div>
      <div class="stat-item"><span class="stat-val">${s.played > 0 ? Math.round(s.totalCorrect / (s.totalCorrect + s.totalWrong) * 100) : 0}%</span><span class="stat-lbl">Accuracy</span></div>
    `;
  }

  /* ===== KEYBOARD SUPPORT ===== */
  document.addEventListener('keydown', (e) => {
    if (state.status !== 'playing') return;
    if (state.answered) return;

    const key = e.key.toLowerCase();
    if (key === '1' || key === 'a') selectAnswer(0);
    else if (key === '2' || key === 'b') selectAnswer(1);
    else if (key === '3' || key === 'c') selectAnswer(2);
    else if (key === '4' || key === 'd') selectAnswer(3);
    else if (key === 'f') useFiftyFifty();
    else if (key === 's') useSkip();
  });

  /* ===== INIT ===== */
  function init() {
    // Category cards
    const grid = $('.category-grid');
    if (grid) {
      Object.entries(window.TriviaQuestions).forEach(([key, cat]) => {
        const card = document.createElement('button');
        card.className = 'category-card';
        card.style.setProperty('--cat-color', cat.color);
        card.innerHTML = `
          <span class="cat-icon">${cat.icon}</span>
          <span class="cat-name">${cat.name}</span>
          <span class="cat-count">${cat.questions.length} questions</span>
        `;
        card.addEventListener('click', () => startGame(key));
        grid.appendChild(card);
      });
    }

    // Lifeline buttons
    const ff = $('.lifeline-5050');
    const sk = $('.lifeline-skip');
    if (ff) ff.addEventListener('click', useFiftyFifty);
    if (sk) sk.addEventListener('click', useSkip);

    // Results buttons
    const playAgain = $('.btn-play-again');
    const backMenu = $('.btn-back-menu');
    if (playAgain) playAgain.addEventListener('click', () => {
      if (state.category) {
        const key = Object.keys(window.TriviaQuestions).find(k => window.TriviaQuestions[k] === state.category);
        if (key) startGame(key);
      }
    });
    if (backMenu) backMenu.addEventListener('click', showMenu);

    // Back link from game
    const backLink = $('.game-back');
    if (backLink) backLink.addEventListener('click', (e) => {
      e.preventDefault();
      clearInterval(state.timer);
      showMenu();
    });

    showMenu();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
