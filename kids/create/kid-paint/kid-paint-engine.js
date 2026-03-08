/* ============================================================
   Kid Paint Engine — Drawing logic, stamps, shapes & sounds
   ============================================================ */
(function () {
  'use strict';

  /* ---- Audio context (lazy init on first interaction) ---- */
  let audioCtx = null;
  function ensureAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  /* ---- Procedural sound effects ---- */
  const SFX = {
    pop() {
      const ctx = ensureAudio();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(600, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.12);
      g.gain.setValueAtTime(0.25, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      o.connect(g).connect(ctx.destination);
      o.start(); o.stop(ctx.currentTime + 0.13);
    },
    swoosh() {
      const ctx = ensureAudio();
      const bufSize = ctx.sampleRate * 0.15;
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / bufSize);
      const src = ctx.createBufferSource();
      const flt = ctx.createBiquadFilter();
      const g = ctx.createGain();
      src.buffer = buf;
      flt.type = 'bandpass'; flt.frequency.value = 2000; flt.Q.value = 0.5;
      g.gain.setValueAtTime(0.15, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      src.connect(flt).connect(g).connect(ctx.destination);
      src.start(); src.stop(ctx.currentTime + 0.16);
    },
    sprinkle() {
      const ctx = ensureAudio();
      for (let i = 0; i < 3; i++) {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        const t = ctx.currentTime + i * 0.04;
        o.frequency.setValueAtTime(1200 + Math.random() * 1600, t);
        o.frequency.exponentialRampToValueAtTime(800 + Math.random() * 400, t + 0.06);
        g.gain.setValueAtTime(0.08, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
        o.connect(g).connect(ctx.destination);
        o.start(t); o.stop(t + 0.08);
      }
    },
    spray() {
      const ctx = ensureAudio();
      const bufSize = ctx.sampleRate * 0.08;
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) d[i] = (Math.random() * 2 - 1) * 0.4 * (1 - i / bufSize);
      const src = ctx.createBufferSource();
      const flt = ctx.createBiquadFilter();
      const g = ctx.createGain();
      src.buffer = buf;
      flt.type = 'highpass'; flt.frequency.value = 3000;
      g.gain.setValueAtTime(0.12, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      src.connect(flt).connect(g).connect(ctx.destination);
      src.start();
    },
    erase() {
      const ctx = ensureAudio();
      const bufSize = ctx.sampleRate * 0.06;
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) d[i] = (Math.random() * 2 - 1) * 0.15 * (1 - i / bufSize);
      const src = ctx.createBufferSource();
      const g = ctx.createGain();
      src.buffer = buf;
      g.gain.setValueAtTime(0.1, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      src.connect(g).connect(ctx.destination);
      src.start();
    },
    fill() {
      const ctx = ensureAudio();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(300, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.2);
      g.gain.setValueAtTime(0.2, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      o.connect(g).connect(ctx.destination);
      o.start(); o.stop(ctx.currentTime + 0.26);
    },
    line() {
      const ctx = ensureAudio();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'square';
      o.frequency.setValueAtTime(440, ctx.currentTime);
      o.frequency.linearRampToValueAtTime(660, ctx.currentTime + 0.08);
      g.gain.setValueAtTime(0.08, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      o.connect(g).connect(ctx.destination);
      o.start(); o.stop(ctx.currentTime + 0.11);
    },
    clear() {
      const ctx = ensureAudio();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(800, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.4);
      g.gain.setValueAtTime(0.15, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      o.connect(g).connect(ctx.destination);
      o.start(); o.stop(ctx.currentTime + 0.42);
    }
  };

  /* ---- Stamp drawing functions (all draw at origin, caller translates) ---- */
  const Stamps = {
    star(ctx, size, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? size : size * 0.4;
        const a = (Math.PI * 2 * i) / 10 - Math.PI / 2;
        ctx[i === 0 ? 'moveTo' : 'lineTo'](Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath(); ctx.fill();
    },
    heart(ctx, size, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      const s = size * 0.9;
      ctx.moveTo(0, s * 0.3);
      ctx.bezierCurveTo(-s, -s * 0.4, -s * 0.3, -s, 0, -s * 0.4);
      ctx.bezierCurveTo(s * 0.3, -s, s, -s * 0.4, 0, s * 0.3);
      ctx.fill();
    },
    smiley(ctx, size, color) {
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.arc(0, 0, size, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(-size * 0.3, -size * 0.2, size * 0.18, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(size * 0.3, -size * 0.2, size * 0.18, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#222';
      ctx.beginPath(); ctx.arc(-size * 0.3, -size * 0.15, size * 0.09, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(size * 0.3, -size * 0.15, size * 0.09, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#222'; ctx.lineWidth = size * 0.08; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(0, size * 0.05, size * 0.45, 0.2, Math.PI - 0.2); ctx.stroke();
    },
    flower(ctx, size, color) {
      const petalCount = 6;
      ctx.fillStyle = color;
      for (let i = 0; i < petalCount; i++) {
        const a = (Math.PI * 2 * i) / petalCount;
        ctx.beginPath();
        ctx.ellipse(Math.cos(a) * size * 0.4, Math.sin(a) * size * 0.4,
          size * 0.38, size * 0.22, a, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#FFD700';
      ctx.beginPath(); ctx.arc(0, 0, size * 0.25, 0, Math.PI * 2); ctx.fill();
    },
    lightning(ctx, size, color) {
      ctx.fillStyle = color;
      const s = size;
      ctx.beginPath();
      ctx.moveTo(s * 0.1, -s);
      ctx.lineTo(-s * 0.35, s * 0.05);
      ctx.lineTo(s * 0.05, s * 0.05);
      ctx.lineTo(-s * 0.15, s);
      ctx.lineTo(s * 0.45, -s * 0.15);
      ctx.lineTo(s * 0.05, -s * 0.15);
      ctx.closePath(); ctx.fill();
    },
    diamond(ctx, size, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, -size); ctx.lineTo(size * 0.6, 0);
      ctx.lineTo(0, size); ctx.lineTo(-size * 0.6, 0);
      ctx.closePath(); ctx.fill();
      // shine
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.8); ctx.lineTo(size * 0.15, -size * 0.2);
      ctx.lineTo(-size * 0.15, -size * 0.1); ctx.closePath(); ctx.fill();
    },
    moon(ctx, size, color) {
      // Draw crescent using an offscreen canvas to avoid compositing artifacts
      const off = document.createElement('canvas');
      const s2 = Math.ceil(size * 2.5);
      off.width = off.height = s2 * 2;
      const oc = off.getContext('2d');
      oc.translate(s2, s2);
      oc.fillStyle = color;
      oc.beginPath(); oc.arc(0, 0, size, 0, Math.PI * 2); oc.fill();
      oc.globalCompositeOperation = 'destination-out';
      oc.fillStyle = '#000';
      oc.beginPath(); oc.arc(size * 0.4, -size * 0.15, size * 0.75, 0, Math.PI * 2); oc.fill();
      ctx.drawImage(off, -s2, -s2);
    },
    cat(ctx, size, color) {
      // simple cat face
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.arc(0, 0, size * 0.8, 0, Math.PI * 2); ctx.fill();
      // ears
      ctx.beginPath();
      ctx.moveTo(-size * 0.65, -size * 0.5);
      ctx.lineTo(-size * 0.3, -size * 1.05);
      ctx.lineTo(-size * 0.05, -size * 0.55);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(size * 0.65, -size * 0.5);
      ctx.lineTo(size * 0.3, -size * 1.05);
      ctx.lineTo(size * 0.05, -size * 0.55);
      ctx.fill();
      // eyes
      ctx.fillStyle = '#222';
      ctx.beginPath(); ctx.ellipse(-size * 0.25, -size * 0.1, size * 0.1, size * 0.15, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(size * 0.25, -size * 0.1, size * 0.1, size * 0.15, 0, 0, Math.PI * 2); ctx.fill();
      // nose
      ctx.fillStyle = '#FF69B4';
      ctx.beginPath();
      ctx.moveTo(0, size * 0.05); ctx.lineTo(-size * 0.08, size * 0.15); ctx.lineTo(size * 0.08, size * 0.15);
      ctx.fill();
      // whiskers
      ctx.strokeStyle = '#222'; ctx.lineWidth = 1.5;
      [[-1, -0.05], [-1, 0.08], [1, -0.05], [1, 0.08]].forEach(([dx, dy]) => {
        ctx.beginPath();
        ctx.moveTo(dx * size * 0.15, size * 0.15 + dy * size);
        ctx.lineTo(dx * size * 0.7, size * 0.15 + dy * size * 2);
        ctx.stroke();
      });
    },
    rainbow(ctx, size, color) {
      const colors = ['#FF0000', '#FF8800', '#FFDD00', '#00CC44', '#0088FF', '#8833FF'];
      const bandW = size * 0.12;
      for (let i = 0; i < colors.length; i++) {
        ctx.strokeStyle = colors[i];
        ctx.lineWidth = bandW;
        ctx.beginPath();
        ctx.arc(0, size * 0.3, size * 0.9 - i * bandW, Math.PI, 0);
        ctx.stroke();
      }
    }
  };

  /* ---- Rainbow color cycling ---- */
  const RAINBOW = ['#FF0000', '#FF5500', '#FFAA00', '#FFFF00', '#88FF00',
    '#00DD44', '#00CCCC', '#0088FF', '#4400FF', '#9900FF', '#FF00AA', '#FF0066'];
  let rainbowIdx = 0;
  function nextRainbowColor() {
    const c = RAINBOW[rainbowIdx % RAINBOW.length];
    rainbowIdx++;
    return c;
  }

  /* ---- Glitter particles ---- */
  function drawGlitter(ctx, x, y, size, color) {
    const count = 6 + Math.floor(Math.random() * 6);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * size * 2;
      const px = x + Math.cos(angle) * dist;
      const py = y + Math.sin(angle) * dist;
      const r = 1 + Math.random() * 2.5;
      const sparkleColor = Math.random() > 0.4 ? color :
        (Math.random() > 0.5 ? '#FFFFFF' : '#FFD700');
      ctx.fillStyle = sparkleColor;
      ctx.globalAlpha = 0.5 + Math.random() * 0.5;
      // draw a tiny star or circle
      if (Math.random() > 0.5) {
        ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.fill();
      } else {
        // tiny 4-point star
        ctx.beginPath();
        for (let j = 0; j < 8; j++) {
          const sr = j % 2 === 0 ? r * 1.5 : r * 0.4;
          const sa = (Math.PI * 2 * j) / 8;
          ctx[j === 0 ? 'moveTo' : 'lineTo'](px + Math.cos(sa) * sr, py + Math.sin(sa) * sr);
        }
        ctx.closePath(); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  /* ---- Spray can effect ---- */
  function drawSpray(ctx, x, y, size, color) {
    const density = Math.floor(size * 2.5);
    ctx.fillStyle = color;
    for (let i = 0; i < density; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * size;
      ctx.globalAlpha = 0.2 + Math.random() * 0.5;
      ctx.fillRect(x + Math.cos(angle) * dist, y + Math.sin(angle) * dist, 1.5, 1.5);
    }
    ctx.globalAlpha = 1;
  }

  /* ---- Flood fill ---- */
  function floodFill(canvas, sx, sy, fillColor) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    sx = Math.floor(sx); sy = Math.floor(sy);
    if (sx < 0 || sx >= w || sy < 0 || sy >= h) return;

    // Parse fill color
    const tmp = document.createElement('canvas');
    tmp.width = tmp.height = 1;
    const tc = tmp.getContext('2d');
    tc.fillStyle = fillColor;
    tc.fillRect(0, 0, 1, 1);
    const fc = tc.getImageData(0, 0, 1, 1).data;

    const startIdx = (sy * w + sx) * 4;
    const sr = data[startIdx], sg = data[startIdx + 1], sb = data[startIdx + 2], sa = data[startIdx + 3];

    // Don't fill if same color
    if (sr === fc[0] && sg === fc[1] && sb === fc[2] && sa === fc[3]) return;

    const tolerance = 30;
    function match(i) {
      return Math.abs(data[i] - sr) + Math.abs(data[i + 1] - sg) +
        Math.abs(data[i + 2] - sb) + Math.abs(data[i + 3] - sa) <= tolerance;
    }

    const stack = [[sx, sy]];
    const visited = new Uint8Array(w * h);
    while (stack.length > 0) {
      const [cx, cy] = stack.pop();
      const pos = cy * w + cx;
      if (cx < 0 || cx >= w || cy < 0 || cy >= h || visited[pos]) continue;
      const idx = pos * 4;
      if (!match(idx)) continue;
      visited[pos] = 1;
      data[idx] = fc[0]; data[idx + 1] = fc[1]; data[idx + 2] = fc[2]; data[idx + 3] = fc[3];
      stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
    }
    ctx.putImageData(imgData, 0, 0);
  }

  /* ---- Undo stack (canvas snapshots) ---- */
  const undoStack = [];
  const redoStack = [];
  const MAX_UNDO = 30;
  let _canvas = null;

  function pushUndo(canvas) {
    _canvas = canvas;
    undoStack.push(canvas.toDataURL());
    if (undoStack.length > MAX_UNDO) undoStack.shift();
    redoStack.length = 0;
  }

  function undo(canvas) {
    if (undoStack.length === 0) return;
    redoStack.push(canvas.toDataURL());
    const data = undoStack.pop();
    const img = new Image();
    img.onload = () => {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = data;
  }

  function redo(canvas) {
    if (redoStack.length === 0) return;
    undoStack.push(canvas.toDataURL());
    const data = redoStack.pop();
    const img = new Image();
    img.onload = () => {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = data;
  }

  /* ---- Export ---- */
  window.KidPaint = {
    SFX, Stamps, RAINBOW,
    nextRainbowColor, drawGlitter, drawSpray, floodFill,
    pushUndo, undo, redo,
    STAMP_NAMES: Object.keys(Stamps)
  };
})();
