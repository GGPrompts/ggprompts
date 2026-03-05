/* Match-Three Renderer — Canvas drawing, animations, input handling */
'use strict';

window.MatchRenderer = (function () {
  const CELL = 64;
  const GAP = 2;
  const BOARD_PAD = 8;

  let canvas, ctx;
  let boardX, boardY;
  let grid = [];
  let animations = [];
  let selected = null;    // { row, col }
  let hovered = null;     // { row, col }
  let locked = false;     // prevent input during animations
  let particles = [];
  let floatingTexts = [];
  let shakeTimer = 0;
  let shakeIntensity = 0;

  /* --- Gem visuals --- */
  const GEM_COLORS = {
    ruby:     { fill: '#e63946', glow: '#ff1744', symbol: '\u25C6', accent: '#ff6b6b' },
    sapphire: { fill: '#2196f3', glow: '#448aff', symbol: '\u25B2', accent: '#64b5f6' },
    emerald:  { fill: '#2ecc71', glow: '#00e676', symbol: '\u25CF', accent: '#69f0ae' },
    topaz:    { fill: '#f39c12', glow: '#ffc107', symbol: '\u2605', accent: '#ffd54f' },
    amethyst: { fill: '#9b59b6', glow: '#e040fb', symbol: '\u25A0', accent: '#ce93d8' },
    diamond:  { fill: '#ecf0f1', glow: '#ffffff', symbol: '\u2666', accent: '#ffffff' }
  };

  const SPECIAL_COLORS = {
    'line-h': '#00e5ff',
    'line-v': '#00e5ff',
    'bomb':   '#ff9100'
  };

  /* --- Init --- */
  function init(canvasEl) {
    canvas = canvasEl;
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('click', onClick);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', () => { hovered = null; });
    canvas.addEventListener('touchstart', onTouch, { passive: false });
    requestAnimationFrame(loop);
  }

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    const w = Math.min(window.innerWidth - 32, 600);
    const h = w + 120;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const totalW = CELL * 8 + GAP * 7 + BOARD_PAD * 2;
    boardX = (w - totalW) / 2 + BOARD_PAD;
    boardY = 80;
  }

  function cellPos(row, col) {
    return {
      x: boardX + col * (CELL + GAP),
      y: boardY + row * (CELL + GAP)
    };
  }

  function cellFromPixel(px, py) {
    const col = Math.floor((px - boardX) / (CELL + GAP));
    const row = Math.floor((py - boardY) / (CELL + GAP));
    if (row >= 0 && row < 8 && col >= 0 && col < 8) {
      // Check within cell bounds (not in gap)
      const { x, y } = cellPos(row, col);
      if (px >= x && px < x + CELL && py >= y && py < y + CELL) {
        return { row, col };
      }
    }
    return null;
  }

  /* --- Input --- */
  function onClick(e) {
    if (locked) return;
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const cell = cellFromPixel(px, py);
    if (!cell) { selected = null; return; }

    if (selected) {
      if (selected.row === cell.row && selected.col === cell.col) {
        selected = null;
        return;
      }
      // Attempt swap
      trySwap(selected.row, selected.col, cell.row, cell.col);
      selected = null;
    } else {
      selected = cell;
    }
  }

  function onMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    hovered = cellFromPixel(px, py);
    canvas.style.cursor = hovered ? 'pointer' : 'default';
  }

  function onTouch(e) {
    e.preventDefault();
    if (locked) return;
    const t = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const px = t.clientX - rect.left;
    const py = t.clientY - rect.top;
    const cell = cellFromPixel(px, py);
    if (!cell) return;

    if (selected) {
      if (selected.row === cell.row && selected.col === cell.col) {
        selected = null;
        return;
      }
      trySwap(selected.row, selected.col, cell.row, cell.col);
      selected = null;
    } else {
      selected = cell;
    }
  }

  let onSwapCallback = null;

  function onSwap(cb) {
    onSwapCallback = cb;
  }

  function trySwap(r1, c1, r2, c2) {
    if (onSwapCallback) onSwapCallback(r1, c1, r2, c2);
  }

  /* --- Animation system --- */
  function addAnim(type, data, duration) {
    animations.push({ type, data, duration, elapsed: 0 });
  }

  function addParticles(x, y, color, count) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 80;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.6 + Math.random() * 0.4,
        maxLife: 0.6 + Math.random() * 0.4,
        color,
        size: 2 + Math.random() * 4
      });
    }
  }

  function addFloatingText(x, y, text, color) {
    floatingTexts.push({
      x, y, text, color,
      life: 1.2,
      maxLife: 1.2
    });
  }

  function setLocked(v) { locked = v; }
  function isLocked() { return locked; }

  /* --- Drawing --- */
  function loop(ts) {
    const dt = 1 / 60;
    update(dt);
    draw();
    requestAnimationFrame(loop);
  }

  function update(dt) {
    // Update animations
    for (let i = animations.length - 1; i >= 0; i--) {
      animations[i].elapsed += dt;
      if (animations[i].elapsed >= animations[i].duration) {
        animations.splice(i, 1);
      }
    }

    // Update particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 120 * dt; // gravity
      p.life -= dt;
      if (p.life <= 0) particles.splice(i, 1);
    }

    // Update floating texts
    for (let i = floatingTexts.length - 1; i >= 0; i--) {
      const ft = floatingTexts[i];
      ft.y -= 40 * dt;
      ft.life -= dt;
      if (ft.life <= 0) floatingTexts.splice(i, 1);
    }

    // Shake decay
    if (shakeTimer > 0) {
      shakeTimer -= dt;
      if (shakeTimer <= 0) shakeIntensity = 0;
    }
  }

  function draw() {
    const w = parseFloat(canvas.style.width);
    const h = parseFloat(canvas.style.height);
    ctx.clearRect(0, 0, w, h);

    ctx.save();
    if (shakeIntensity > 0) {
      const sx = (Math.random() - 0.5) * shakeIntensity;
      const sy = (Math.random() - 0.5) * shakeIntensity;
      ctx.translate(sx, sy);
    }

    // Board background
    const bw = CELL * 8 + GAP * 7 + BOARD_PAD * 2;
    const bh = bw;
    ctx.fillStyle = 'rgba(10, 10, 30, 0.5)';
    ctx.strokeStyle = 'rgba(100, 100, 200, 0.3)';
    ctx.lineWidth = 2;
    roundRect(ctx, boardX - BOARD_PAD, boardY - BOARD_PAD, bw, bh, 12);
    ctx.fill();
    ctx.stroke();

    // Draw grid cells
    drawGrid();

    // Particles
    for (const p of particles) {
      const alpha = p.life / p.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Floating texts
    for (const ft of floatingTexts) {
      const alpha = ft.life / ft.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = ft.color;
      ctx.font = 'bold 18px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(ft.text, ft.x, ft.y);
    }
    ctx.globalAlpha = 1;

    ctx.restore();
  }

  function drawGrid() {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const { x, y } = cellPos(r, c);

        // Cell background
        ctx.fillStyle = (r + c) % 2 === 0 ? 'rgba(30, 30, 60, 0.6)' : 'rgba(20, 20, 50, 0.6)';
        roundRect(ctx, x, y, CELL, CELL, 6);
        ctx.fill();

        // Selected highlight
        if (selected && selected.row === r && selected.col === c) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          roundRect(ctx, x + 1, y + 1, CELL - 2, CELL - 2, 6);
          ctx.stroke();
        }

        // Hover highlight
        if (hovered && hovered.row === r && hovered.col === c && !(selected && selected.row === r && selected.col === c)) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.lineWidth = 2;
          roundRect(ctx, x + 1, y + 1, CELL - 2, CELL - 2, 6);
          ctx.stroke();
        }

        // Gem
        const cell = grid[r] && grid[r][c];
        if (!cell) continue;

        const gemVis = GEM_COLORS[cell.type];
        if (!gemVis) continue;

        const cx = x + CELL / 2;
        const cy = y + CELL / 2;
        const gemSize = CELL * 0.35;

        // Glow
        ctx.shadowColor = gemVis.glow;
        ctx.shadowBlur = 12;

        // Gem body
        ctx.fillStyle = gemVis.fill;
        ctx.beginPath();
        ctx.arc(cx, cy, gemSize, 0, Math.PI * 2);
        ctx.fill();

        // Inner highlight
        const grad = ctx.createRadialGradient(cx - gemSize * 0.3, cy - gemSize * 0.3, 0, cx, cy, gemSize);
        grad.addColorStop(0, gemVis.accent);
        grad.addColorStop(1, gemVis.fill);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, gemSize * 0.85, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;

        // Symbol
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(gemVis.symbol, cx, cy + 1);

        // Special indicator
        if (cell.special) {
          ctx.strokeStyle = SPECIAL_COLORS[cell.special] || '#fff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(cx, cy, gemSize + 4, 0, Math.PI * 2);
          ctx.stroke();

          if (cell.special === 'bomb') {
            ctx.strokeStyle = SPECIAL_COLORS.bomb;
            ctx.lineWidth = 1.5;
            // Cross marker
            const s = gemSize + 6;
            ctx.beginPath();
            ctx.moveTo(cx - s, cy); ctx.lineTo(cx + s, cy);
            ctx.moveTo(cx, cy - s); ctx.lineTo(cx, cy + s);
            ctx.stroke();
          } else {
            // Line indicators
            ctx.lineWidth = 1.5;
            if (cell.special === 'line-h') {
              ctx.beginPath();
              ctx.moveTo(x + 4, cy);
              ctx.lineTo(x + CELL - 4, cy);
              ctx.stroke();
            } else if (cell.special === 'line-v') {
              ctx.beginPath();
              ctx.moveTo(cx, y + 4);
              ctx.lineTo(cx, y + CELL - 4);
              ctx.stroke();
            }
          }
        }
      }
    }
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function setGrid(g) {
    grid = g;
  }

  function triggerShake(intensity, duration) {
    shakeIntensity = intensity;
    shakeTimer = duration;
  }

  /* --- Public --- */
  return {
    init,
    setGrid,
    setLocked,
    isLocked,
    onSwap,
    addParticles,
    addFloatingText,
    triggerShake,
    cellPos,
    CELL
  };
})();
