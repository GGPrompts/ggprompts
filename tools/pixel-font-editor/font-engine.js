/* ================================================================
   PIXEL FONT ENGINE — Core data model, drawing, import/export
   Manages character bitmaps, font metadata, kerning, and serialization.
   No DOM — pure data logic.
================================================================ */
window.FontEngine = (function () {
  'use strict';

  /* ── Default character set ──────────────────────────────── */
  const CHAR_RANGES = [
    { label: 'A-Z', start: 65, end: 90 },
    { label: 'a-z', start: 97, end: 122 },
    { label: '0-9', start: 48, end: 57 },
    { label: 'Symbols', chars: ' !"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~' },
  ];

  function buildCharList() {
    const list = [];
    for (const r of CHAR_RANGES) {
      if (r.chars) {
        for (const ch of r.chars) list.push(ch);
      } else {
        for (let c = r.start; c <= r.end; c++) list.push(String.fromCharCode(c));
      }
    }
    return list;
  }

  const ALL_CHARS = buildCharList();

  /* ── Font constructor ──────────────────────────────────── */
  function createFont(opts) {
    opts = opts || {};
    const w = opts.gridWidth || 8;
    const h = opts.gridHeight || 8;
    const font = {
      name: opts.name || 'Untitled',
      gridWidth: w,
      gridHeight: h,
      baseline: opts.baseline || Math.floor(h * 0.8),
      letterSpacing: opts.letterSpacing || 1,
      lineHeight: opts.lineHeight || h + 2,
      glyphs: {},   // char -> { bitmap: Uint8Array(w*h), advance: number, offsetX: 0, offsetY: 0 }
      kerning: {},   // "AB" -> number (pixel offset adjustment)
    };
    // Initialize all chars with empty bitmaps
    for (const ch of ALL_CHARS) {
      font.glyphs[ch] = createGlyph(w, h);
    }
    return font;
  }

  function createGlyph(w, h) {
    return {
      bitmap: new Uint8Array(w * h),
      advance: w,
      offsetX: 0,
      offsetY: 0,
    };
  }

  /* ── Pixel access ──────────────────────────────────────── */
  function getPixel(glyph, x, y, w) {
    if (x < 0 || x >= w || y < 0 || y >= (glyph.bitmap.length / w)) return 0;
    return glyph.bitmap[y * w + x];
  }

  function setPixel(glyph, x, y, w, val) {
    const h = glyph.bitmap.length / w;
    if (x < 0 || x >= w || y < 0 || y >= h) return;
    glyph.bitmap[y * w + x] = val ? 1 : 0;
  }

  /* ── Drawing tools ─────────────────────────────────────── */
  function floodFill(glyph, sx, sy, w, targetVal) {
    const h = glyph.bitmap.length / w;
    const currentVal = getPixel(glyph, sx, sy, w);
    if (currentVal === targetVal) return;
    const stack = [[sx, sy]];
    while (stack.length) {
      const [x, y] = stack.pop();
      if (x < 0 || x >= w || y < 0 || y >= h) continue;
      if (glyph.bitmap[y * w + x] !== currentVal) continue;
      glyph.bitmap[y * w + x] = targetVal;
      stack.push([x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]);
    }
  }

  function drawLine(glyph, x0, y0, x1, y1, w, val) {
    // Bresenham
    let dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
    let dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    while (true) {
      setPixel(glyph, x0, y0, w, val);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
    }
  }

  function drawRect(glyph, x0, y0, x1, y1, w, val, filled) {
    const minX = Math.min(x0, x1), maxX = Math.max(x0, x1);
    const minY = Math.min(y0, y1), maxY = Math.max(y0, y1);
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        if (filled || x === minX || x === maxX || y === minY || y === maxY) {
          setPixel(glyph, x, y, w, val);
        }
      }
    }
  }

  /* ── Mirror helper ─────────────────────────────────────── */
  function mirrorHorizontal(glyph, w) {
    const h = glyph.bitmap.length / w;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < Math.floor(w / 2); x++) {
        const left = y * w + x;
        const right = y * w + (w - 1 - x);
        const tmp = glyph.bitmap[left];
        glyph.bitmap[left] = glyph.bitmap[right];
        glyph.bitmap[right] = tmp;
      }
    }
  }

  function mirrorVertical(glyph, w) {
    const h = glyph.bitmap.length / w;
    for (let x = 0; x < w; x++) {
      for (let y = 0; y < Math.floor(h / 2); y++) {
        const top = y * w + x;
        const bot = (h - 1 - y) * w + x;
        const tmp = glyph.bitmap[top];
        glyph.bitmap[top] = glyph.bitmap[bot];
        glyph.bitmap[bot] = tmp;
      }
    }
  }

  /* ── Shift glyph bitmap ────────────────────────────────── */
  function shiftBitmap(glyph, dx, dy, w) {
    const h = glyph.bitmap.length / w;
    const copy = new Uint8Array(w * h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const sx = x - dx, sy = y - dy;
        if (sx >= 0 && sx < w && sy >= 0 && sy < h) {
          copy[y * w + x] = glyph.bitmap[sy * w + sx];
        }
      }
    }
    glyph.bitmap.set(copy);
  }

  /* ── Auto-detect advance width ─────────────────────────── */
  function autoAdvance(glyph, w) {
    const h = glyph.bitmap.length / w;
    let maxX = -1;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (glyph.bitmap[y * w + x]) maxX = Math.max(maxX, x);
      }
    }
    return maxX < 0 ? Math.max(2, Math.floor(w / 2)) : maxX + 2;
  }

  /* ── Render text to canvas ─────────────────────────────── */
  function renderText(ctx, font, text, startX, startY, scale, fgColor) {
    scale = scale || 1;
    fgColor = fgColor || '#ffffff';
    const w = font.gridWidth;
    const h = font.gridHeight;
    let cx = startX;
    let cy = startY;
    const prevFill = ctx.fillStyle;

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (ch === '\n') {
        cx = startX;
        cy += font.lineHeight * scale;
        continue;
      }
      const glyph = font.glyphs[ch];
      if (!glyph) {
        cx += (w + font.letterSpacing) * scale;
        continue;
      }
      // Kerning
      if (i > 0) {
        const pair = text[i - 1] + ch;
        if (font.kerning[pair]) cx += font.kerning[pair] * scale;
      }
      // Draw pixels
      ctx.fillStyle = fgColor;
      for (let py = 0; py < h; py++) {
        for (let px = 0; px < w; px++) {
          if (glyph.bitmap[py * w + px]) {
            ctx.fillRect(
              cx + (px + glyph.offsetX) * scale,
              cy + (py + glyph.offsetY) * scale,
              scale, scale
            );
          }
        }
      }
      cx += (glyph.advance + font.letterSpacing) * scale;
    }
    ctx.fillStyle = prevFill;
    return { endX: cx, endY: cy };
  }

  /* ── Serialize / Deserialize ───────────────────────────── */
  function toJSON(font) {
    const glyphs = {};
    for (const ch in font.glyphs) {
      const g = font.glyphs[ch];
      // Only save non-empty glyphs
      const hasPixels = g.bitmap.some(v => v);
      if (hasPixels) {
        glyphs[ch] = {
          bitmap: Array.from(g.bitmap),
          advance: g.advance,
          offsetX: g.offsetX,
          offsetY: g.offsetY,
        };
      }
    }
    return {
      version: 1,
      name: font.name,
      gridWidth: font.gridWidth,
      gridHeight: font.gridHeight,
      baseline: font.baseline,
      letterSpacing: font.letterSpacing,
      lineHeight: font.lineHeight,
      glyphs: glyphs,
      kerning: font.kerning,
    };
  }

  function fromJSON(data) {
    const font = createFont({
      name: data.name,
      gridWidth: data.gridWidth,
      gridHeight: data.gridHeight,
      baseline: data.baseline,
      letterSpacing: data.letterSpacing,
      lineHeight: data.lineHeight,
    });
    for (const ch in data.glyphs) {
      const gd = data.glyphs[ch];
      if (!font.glyphs[ch]) font.glyphs[ch] = createGlyph(data.gridWidth, data.gridHeight);
      font.glyphs[ch].bitmap = new Uint8Array(gd.bitmap);
      font.glyphs[ch].advance = gd.advance;
      font.glyphs[ch].offsetX = gd.offsetX || 0;
      font.glyphs[ch].offsetY = gd.offsetY || 0;
    }
    font.kerning = data.kerning || {};
    return font;
  }

  /* ── Export PNG sprite sheet ────────────────────────────── */
  function exportSpriteSheet(font, scale, fgColor, bgColor) {
    scale = scale || 1;
    fgColor = fgColor || '#ffffff';
    bgColor = bgColor || 'transparent';
    const w = font.gridWidth;
    const h = font.gridHeight;
    const cols = 16;
    const chars = ALL_CHARS.filter(ch => {
      const g = font.glyphs[ch];
      return g && g.bitmap.some(v => v);
    });
    if (chars.length === 0) return null;
    const rows = Math.ceil(chars.length / cols);
    const cellW = (w + 1) * scale;
    const cellH = (h + 1) * scale;
    const canvas = document.createElement('canvas');
    canvas.width = cols * cellW;
    canvas.height = rows * cellH;
    const ctx = canvas.getContext('2d');
    if (bgColor !== 'transparent') {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    chars.forEach((ch, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const glyph = font.glyphs[ch];
      ctx.fillStyle = fgColor;
      for (let py = 0; py < h; py++) {
        for (let px = 0; px < w; px++) {
          if (glyph.bitmap[py * w + px]) {
            ctx.fillRect(
              col * cellW + px * scale,
              row * cellH + py * scale,
              scale, scale
            );
          }
        }
      }
    });
    return canvas;
  }

  /* ── Undo/Redo ─────────────────────────────────────────── */
  const history = [];
  let historyIndex = -1;
  const MAX_HISTORY = 60;

  function pushHistory(charCode, bitmapCopy) {
    // Trim future
    history.length = historyIndex + 1;
    history.push({ char: charCode, bitmap: bitmapCopy });
    if (history.length > MAX_HISTORY) history.shift();
    historyIndex = history.length - 1;
  }

  function undo(font) {
    if (historyIndex < 0) return null;
    const entry = history[historyIndex];
    historyIndex--;
    const g = font.glyphs[entry.char];
    if (g) {
      const current = new Uint8Array(g.bitmap);
      g.bitmap.set(entry.bitmap);
      entry.bitmap = current; // swap for redo
    }
    return entry.char;
  }

  function redo(font) {
    if (historyIndex >= history.length - 1) return null;
    historyIndex++;
    const entry = history[historyIndex];
    const g = font.glyphs[entry.char];
    if (g) {
      const current = new Uint8Array(g.bitmap);
      g.bitmap.set(entry.bitmap);
      entry.bitmap = current;
    }
    return entry.char;
  }

  function clearHistory() {
    history.length = 0;
    historyIndex = -1;
  }

  /* ── Autosave ──────────────────────────────────────────── */
  const AUTOSAVE_KEY = 'pixelFontEditor_autosave';

  function autosave(font) {
    try {
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(toJSON(font)));
    } catch (e) { /* quota */ }
  }

  function loadAutosave() {
    try {
      const data = localStorage.getItem(AUTOSAVE_KEY);
      if (data) return fromJSON(JSON.parse(data));
    } catch (e) { /* corrupt */ }
    return null;
  }

  /* ── Copy/Paste glyph ─────────────────────────────────── */
  let clipboard = null;

  function copyGlyph(glyph) {
    clipboard = {
      bitmap: new Uint8Array(glyph.bitmap),
      advance: glyph.advance,
      offsetX: glyph.offsetX,
      offsetY: glyph.offsetY,
    };
  }

  function pasteGlyph(glyph) {
    if (!clipboard) return false;
    glyph.bitmap.set(clipboard.bitmap);
    glyph.advance = clipboard.advance;
    glyph.offsetX = clipboard.offsetX;
    glyph.offsetY = clipboard.offsetY;
    return true;
  }

  function hasClipboard() { return !!clipboard; }

  /* ── Public API ────────────────────────────────────────── */
  return {
    ALL_CHARS,
    CHAR_RANGES,
    createFont,
    createGlyph,
    getPixel,
    setPixel,
    floodFill,
    drawLine,
    drawRect,
    mirrorHorizontal,
    mirrorVertical,
    shiftBitmap,
    autoAdvance,
    renderText,
    toJSON,
    fromJSON,
    exportSpriteSheet,
    pushHistory,
    undo,
    redo,
    clearHistory,
    autosave,
    loadAutosave,
    copyGlyph,
    pasteGlyph,
    hasClipboard,
  };
})();
