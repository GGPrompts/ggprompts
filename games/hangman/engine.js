/**
 * Hangman / Wheel of Fortune Game Engine
 * Handles game state, drawing, keyboard, wheel spin, stats
 */
(function() {
  'use strict';

  /* ===== CONSTANTS ===== */
  const MAX_WRONG = 7; // head, body, L arm, R arm, L leg, R leg, face
  const WHEEL_SEGMENTS = [
    { label: '100',  value: 100,  color: '#e74c3c' },
    { label: '200',  value: 200,  color: '#3498db' },
    { label: '300',  value: 300,  color: '#2ecc71' },
    { label: '500',  value: 500,  color: '#f39c12' },
    { label: '700',  value: 700,  color: '#9b59b6' },
    { label: '1000', value: 1000, color: '#e91e63' },
    { label: '150',  value: 150,  color: '#00bcd4' },
    { label: '250',  value: 250,  color: '#ff9800' },
    { label: '400',  value: 400,  color: '#4caf50' },
    { label: '600',  value: 600,  color: '#795548' },
    { label: '800',  value: 800,  color: '#607d8b' },
    { label: '50',   value: 50,   color: '#8bc34a' },
    { label: 'LOSE', value: -1,   color: '#1a1a2e' },
    { label: '350',  value: 350,  color: '#ff5722' },
    { label: '450',  value: 450,  color: '#673ab7' },
    { label: '550',  value: 550,  color: '#009688' },
  ];

  /* ===== STATE ===== */
  let state = {
    word: '',
    category: '',
    categoryLabel: '',
    categoryIcon: '',
    guessed: new Set(),
    wrongCount: 0,
    status: 'playing', // playing | won | lost
    mode: 'classic',   // classic | wheel
    score: 0,
    roundScore: 0,
    currentSpinValue: 0,
    streak: 0,
    stats: loadStats(),
    wheelAngle: 0,
    wheelSpinning: false,
    wheelResult: null,
    mustSpin: false, // wheel mode: must spin before guessing consonant
  };

  function loadStats() {
    try {
      const s = JSON.parse(localStorage.getItem('hangman-stats'));
      return s || { played: 0, won: 0, lost: 0, streak: 0, best: 0, totalScore: 0 };
    } catch(e) {
      return { played: 0, won: 0, lost: 0, streak: 0, best: 0, totalScore: 0 };
    }
  }

  function saveStats() {
    localStorage.setItem('hangman-stats', JSON.stringify(state.stats));
  }

  /* ===== AUDIO ===== */
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  let audioCtx = null;

  function ensureAudio() {
    if (!audioCtx) audioCtx = new AudioCtx();
    return audioCtx;
  }

  function playTone(freq, dur, type, vol) {
    const ctx = ensureAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    gain.gain.value = vol || 0.15;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + dur);
  }

  function sfxCorrect() { playTone(880, 0.12, 'sine', 0.12); setTimeout(() => playTone(1100, 0.15, 'sine', 0.12), 80); }
  function sfxWrong() { playTone(200, 0.25, 'sawtooth', 0.08); }
  function sfxWin() {
    [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playTone(f, 0.2, 'sine', 0.12), i * 120));
  }
  function sfxLose() {
    [400, 350, 300, 200].forEach((f, i) => setTimeout(() => playTone(f, 0.3, 'sawtooth', 0.06), i * 150));
  }
  function sfxSpin() { playTone(600, 0.08, 'square', 0.05); }
  function sfxBankrupt() { playTone(100, 0.6, 'sawtooth', 0.1); }

  /* ===== GALLOWS DRAWING (Canvas) ===== */
  function drawGallows(canvas) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Scale for different sizes
    const s = Math.min(w, h) / 260;
    ctx.save();
    ctx.translate(w * 0.1, h * 0.05);
    ctx.scale(s, s);

    ctx.strokeStyle = '#c9a84c';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Base
    ctx.beginPath();
    ctx.moveTo(10, 230);
    ctx.lineTo(160, 230);
    ctx.stroke();

    // Pole
    ctx.beginPath();
    ctx.moveTo(40, 230);
    ctx.lineTo(40, 20);
    ctx.stroke();

    // Top beam
    ctx.beginPath();
    ctx.moveTo(40, 20);
    ctx.lineTo(140, 20);
    ctx.stroke();

    // Brace
    ctx.beginPath();
    ctx.moveTo(40, 50);
    ctx.lineTo(70, 20);
    ctx.stroke();

    // Rope
    ctx.beginPath();
    ctx.moveTo(140, 20);
    ctx.lineTo(140, 45);
    ctx.stroke();

    const wc = state.wrongCount;
    ctx.strokeStyle = '#e8e0d4';
    ctx.lineWidth = 2.5;

    // 1. Head
    if (wc >= 1) {
      ctx.beginPath();
      ctx.arc(140, 62, 17, 0, Math.PI * 2);
      ctx.stroke();
    }
    // 2. Body
    if (wc >= 2) {
      ctx.beginPath();
      ctx.moveTo(140, 79);
      ctx.lineTo(140, 145);
      ctx.stroke();
    }
    // 3. Left arm
    if (wc >= 3) {
      ctx.beginPath();
      ctx.moveTo(140, 95);
      ctx.lineTo(110, 125);
      ctx.stroke();
    }
    // 4. Right arm
    if (wc >= 4) {
      ctx.beginPath();
      ctx.moveTo(140, 95);
      ctx.lineTo(170, 125);
      ctx.stroke();
    }
    // 5. Left leg
    if (wc >= 5) {
      ctx.beginPath();
      ctx.moveTo(140, 145);
      ctx.lineTo(115, 190);
      ctx.stroke();
    }
    // 6. Right leg
    if (wc >= 6) {
      ctx.beginPath();
      ctx.moveTo(140, 145);
      ctx.lineTo(165, 190);
      ctx.stroke();
    }
    // 7. Face (X_X) - dead
    if (wc >= 7) {
      ctx.lineWidth = 2;
      // Left eye X
      ctx.beginPath(); ctx.moveTo(131, 56); ctx.lineTo(137, 62); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(137, 56); ctx.lineTo(131, 62); ctx.stroke();
      // Right eye X
      ctx.beginPath(); ctx.moveTo(143, 56); ctx.lineTo(149, 62); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(149, 56); ctx.lineTo(143, 62); ctx.stroke();
      // Mouth
      ctx.beginPath(); ctx.moveTo(133, 71); ctx.lineTo(147, 71); ctx.stroke();
    }

    ctx.restore();
  }

  /* ===== WHEEL DRAWING (Canvas) ===== */
  function drawWheel(canvas) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(cx, cy) - 10;
    const count = WHEEL_SEGMENTS.length;
    const arc = (2 * Math.PI) / count;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(state.wheelAngle);

    for (let i = 0; i < count; i++) {
      const seg = WHEEL_SEGMENTS[i];
      const startAngle = i * arc;
      const endAngle = startAngle + arc;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, r, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();
      ctx.strokeStyle = '#2a2a3e';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      ctx.save();
      ctx.rotate(startAngle + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${Math.max(10, r * 0.11)}px Inter, sans-serif`;
      ctx.fillText(seg.label, r - 8, 4);
      ctx.restore();
    }
    ctx.restore();

    // Pointer triangle at top
    ctx.fillStyle = '#d4a017';
    ctx.beginPath();
    ctx.moveTo(cx, 4);
    ctx.lineTo(cx - 10, -6);
    ctx.lineTo(cx + 10, -6);
    ctx.closePath();
    ctx.fill();

    // Center hub
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.12, 0, Math.PI * 2);
    ctx.fillStyle = '#1a1a2e';
    ctx.fill();
    ctx.strokeStyle = '#d4a017';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function getWheelResult() {
    const count = WHEEL_SEGMENTS.length;
    const arc = (2 * Math.PI) / count;
    // Pointer is at top (angle = -PI/2 from right)
    // Normalize angle
    let angle = (-state.wheelAngle - Math.PI / 2) % (2 * Math.PI);
    if (angle < 0) angle += 2 * Math.PI;
    const idx = Math.floor(angle / arc) % count;
    return WHEEL_SEGMENTS[idx];
  }

  function spinWheel(callback) {
    if (state.wheelSpinning) return;
    state.wheelSpinning = true;
    state.wheelResult = null;

    const spinAmount = Math.PI * 6 + Math.random() * Math.PI * 8; // 3-7 full rotations
    const startAngle = state.wheelAngle;
    const endAngle = startAngle + spinAmount;
    const duration = 3000 + Math.random() * 1500;
    const startTime = performance.now();

    let tickTime = 0;

    function animate(now) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - t, 3);
      state.wheelAngle = startAngle + spinAmount * ease;

      // Tick sound
      if (now - tickTime > 80 && t < 0.9) {
        sfxSpin();
        tickTime = now;
      }

      const wheelCanvas = document.getElementById('wheel-canvas');
      if (wheelCanvas) drawWheel(wheelCanvas);

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        state.wheelSpinning = false;
        state.wheelResult = getWheelResult();
        if (state.wheelResult.value === -1) {
          sfxBankrupt();
          state.roundScore = 0;
          state.currentSpinValue = 0;
          state.mustSpin = true;
        } else {
          state.currentSpinValue = state.wheelResult.value;
          state.mustSpin = false;
        }
        if (callback) callback(state.wheelResult);
        render();
      }
    }

    requestAnimationFrame(animate);
  }

  /* ===== GAME LOGIC ===== */
  function newGame(category, mode) {
    const pick = window.WordBank.getRandomWord(category);
    state.word = pick.word;
    state.category = pick.category;
    state.categoryLabel = pick.label;
    state.categoryIcon = pick.icon;
    state.guessed = new Set();
    state.wrongCount = 0;
    state.status = 'playing';
    state.mode = mode || state.mode;
    state.roundScore = 0;
    state.currentSpinValue = 0;
    state.wheelResult = null;
    state.mustSpin = state.mode === 'wheel';
    render();
  }

  function isVowel(ch) {
    return 'AEIOU'.includes(ch);
  }

  function guess(letter) {
    if (state.status !== 'playing') return;
    if (state.guessed.has(letter)) return;
    if (state.mode === 'wheel' && state.mustSpin && !isVowel(letter)) return; // must spin first

    // In wheel mode, vowels cost 250 points (free to guess anytime)
    if (state.mode === 'wheel' && isVowel(letter)) {
      if (state.roundScore < 250) return; // can't afford
      state.roundScore -= 250;
    }

    state.guessed.add(letter);

    if (state.word.includes(letter)) {
      sfxCorrect();
      // Count occurrences for wheel mode
      if (state.mode === 'wheel' && !isVowel(letter)) {
        const count = state.word.split('').filter(c => c === letter).length;
        state.roundScore += state.currentSpinValue * count;
        state.mustSpin = true; // must spin again for next consonant
      }
      // Check win
      const allRevealed = state.word.split('').every(c => state.guessed.has(c));
      if (allRevealed) {
        state.status = 'won';
        state.streak++;
        state.stats.played++;
        state.stats.won++;
        state.stats.streak = state.streak;
        if (state.streak > state.stats.best) state.stats.best = state.streak;
        if (state.mode === 'wheel') {
          state.score += state.roundScore;
          state.stats.totalScore += state.roundScore;
        }
        saveStats();
        sfxWin();
      }
    } else {
      sfxWrong();
      state.wrongCount++;
      if (state.mode === 'wheel') {
        state.mustSpin = true;
      }
      if (state.wrongCount >= MAX_WRONG) {
        state.status = 'lost';
        state.streak = 0;
        state.stats.played++;
        state.stats.lost++;
        state.stats.streak = 0;
        saveStats();
        sfxLose();
      }
    }

    render();
  }

  /* ===== RENDER ===== */
  function render() {
    renderWord();
    renderKeyboard();
    renderGallows();
    renderStatus();
    renderStats();
    if (state.mode === 'wheel') {
      renderWheelUI();
    }
  }

  function renderWord() {
    const el = document.getElementById('word-display');
    if (!el) return;
    el.innerHTML = '';
    state.word.split('').forEach((ch, i) => {
      const span = document.createElement('span');
      span.className = 'letter-tile';
      if (ch === ' ') {
        span.classList.add('space');
        span.textContent = '';
      } else if (state.guessed.has(ch) || state.status === 'lost') {
        span.textContent = ch;
        span.classList.add('revealed');
        if (state.status === 'lost' && !state.guessed.has(ch)) {
          span.classList.add('missed');
        }
        if (state.status === 'won') {
          span.classList.add('won');
          span.style.animationDelay = (i * 0.06) + 's';
        }
      } else {
        span.textContent = '_';
        span.classList.add('hidden-letter');
      }
      el.appendChild(span);
    });

    const catEl = document.getElementById('category-display');
    if (catEl) {
      catEl.textContent = state.categoryIcon + ' ' + state.categoryLabel;
    }
  }

  function renderKeyboard() {
    const rows = [
      'QWERTYUIOP',
      'ASDFGHJKL',
      'ZXCVBNM'
    ];
    const el = document.getElementById('keyboard');
    if (!el) return;
    el.innerHTML = '';
    rows.forEach(row => {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'kb-row';
      row.split('').forEach(ch => {
        const btn = document.createElement('button');
        btn.className = 'kb-key';
        btn.textContent = ch;
        btn.dataset.letter = ch;
        if (state.guessed.has(ch)) {
          btn.disabled = true;
          btn.classList.add(state.word.includes(ch) ? 'correct' : 'wrong');
        }
        if (state.status !== 'playing') btn.disabled = true;
        // In wheel mode, mark vowels differently
        if (state.mode === 'wheel' && isVowel(ch) && !state.guessed.has(ch)) {
          btn.classList.add('vowel');
        }
        if (state.mode === 'wheel' && !isVowel(ch) && state.mustSpin && !state.guessed.has(ch)) {
          btn.classList.add('locked');
        }
        btn.addEventListener('click', () => guess(ch));
        rowDiv.appendChild(btn);
      });
      el.appendChild(rowDiv);
    });
  }

  function renderGallows() {
    const canvas = document.getElementById('gallows-canvas');
    if (canvas) {
      canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1);
      canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
      canvas.getContext('2d').scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
      drawGallows(canvas);
    }
  }

  function renderStatus() {
    const el = document.getElementById('game-message');
    if (!el) return;

    const wrongEl = document.getElementById('wrong-count');
    if (wrongEl) wrongEl.textContent = `${state.wrongCount} / ${MAX_WRONG}`;

    if (state.status === 'won') {
      el.className = 'game-message win';
      el.innerHTML = '<span class="msg-icon">&#9733;</span> You won!' +
        (state.mode === 'wheel' ? ` Round: $${state.roundScore.toLocaleString()}` : '') +
        ' <button class="btn-new" onclick="HangmanEngine.newRound()">Next Word</button>';
      el.style.display = 'block';
    } else if (state.status === 'lost') {
      el.className = 'game-message lose';
      el.innerHTML = '<span class="msg-icon">&#9760;</span> Game over! The word was <strong>' + state.word + '</strong>' +
        ' <button class="btn-new" onclick="HangmanEngine.newRound()">Try Again</button>';
      el.style.display = 'block';
    } else {
      el.style.display = 'none';
    }
  }

  function renderStats() {
    const el = document.getElementById('stats-panel');
    if (!el) return;
    const s = state.stats;
    document.getElementById('stat-played').textContent = s.played;
    document.getElementById('stat-won').textContent = s.won;
    document.getElementById('stat-streak').textContent = state.streak;
    document.getElementById('stat-best').textContent = s.best;
    if (state.mode === 'wheel') {
      document.getElementById('stat-score').textContent = '$' + state.score.toLocaleString();
      document.getElementById('stat-score-row').style.display = '';
    } else {
      document.getElementById('stat-score-row').style.display = 'none';
    }
  }

  function renderWheelUI() {
    const panel = document.getElementById('wheel-panel');
    if (!panel) return;
    panel.style.display = 'flex';

    const wheelCanvas = document.getElementById('wheel-canvas');
    if (wheelCanvas) {
      wheelCanvas.width = wheelCanvas.offsetWidth * (window.devicePixelRatio || 1);
      wheelCanvas.height = wheelCanvas.offsetHeight * (window.devicePixelRatio || 1);
      wheelCanvas.getContext('2d').scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
      drawWheel(wheelCanvas);
    }

    const spinBtn = document.getElementById('btn-spin');
    if (spinBtn) {
      spinBtn.disabled = state.wheelSpinning || state.status !== 'playing' || !state.mustSpin;
    }

    const infoEl = document.getElementById('wheel-info');
    if (infoEl) {
      if (state.wheelSpinning) {
        infoEl.textContent = 'Spinning...';
      } else if (state.wheelResult && state.wheelResult.value === -1) {
        infoEl.textContent = 'BANKRUPT! Spin again.';
        infoEl.className = 'wheel-info bankrupt';
      } else if (state.mustSpin && state.status === 'playing') {
        infoEl.textContent = 'Spin the wheel to guess a consonant!';
        infoEl.className = 'wheel-info';
      } else if (state.currentSpinValue > 0) {
        infoEl.textContent = `$${state.currentSpinValue} per consonant. Vowels cost $250.`;
        infoEl.className = 'wheel-info active';
      } else {
        infoEl.textContent = '';
        infoEl.className = 'wheel-info';
      }
    }

    const scoreEl = document.getElementById('round-score');
    if (scoreEl) scoreEl.textContent = '$' + state.roundScore.toLocaleString();
  }

  /* ===== KEYBOARD INPUT ===== */
  document.addEventListener('keydown', (e) => {
    if (state.status !== 'playing') {
      if (e.key === 'Enter') {
        newRound();
        return;
      }
    }
    const key = e.key.toUpperCase();
    if (/^[A-Z]$/.test(key)) {
      guess(key);
    }
  });

  function newRound() {
    newGame(null, state.mode);
  }

  function setMode(mode) {
    state.mode = mode;
    state.score = 0;
    state.streak = 0;

    // Toggle UI
    const wheelPanel = document.getElementById('wheel-panel');
    if (wheelPanel) wheelPanel.style.display = mode === 'wheel' ? 'flex' : 'none';

    const modeClassic = document.getElementById('btn-mode-classic');
    const modeWheel = document.getElementById('btn-mode-wheel');
    if (modeClassic) modeClassic.classList.toggle('active', mode === 'classic');
    if (modeWheel) modeWheel.classList.toggle('active', mode === 'wheel');

    document.body.classList.toggle('wheel-mode', mode === 'wheel');

    newGame(null, mode);
  }

  function setCategory(cat) {
    newGame(cat || null, state.mode);
  }

  function doSpin() {
    if (state.status !== 'playing' || !state.mustSpin) return;
    spinWheel(() => {
      render();
    });
  }

  /* ===== INIT ===== */
  function init() {
    newGame(null, 'classic');
  }

  /* ===== PUBLIC API ===== */
  window.HangmanEngine = {
    init,
    newGame,
    newRound,
    guess,
    setMode,
    setCategory,
    spinWheel: doSpin,
    getState: () => state,
  };
})();
