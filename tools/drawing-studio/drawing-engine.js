/* ============================================================
   Drawing Studio Engine — Layers, tools, history, color picker
   ============================================================ */
(function () {
  'use strict';

  /* ---- Layer System ---- */
  class Layer {
    constructor(width, height, name) {
      this.id = 'layer-' + Math.random().toString(36).slice(2, 8);
      this.name = name || 'Layer';
      this.canvas = document.createElement('canvas');
      this.canvas.width = width;
      this.canvas.height = height;
      this.ctx = this.canvas.getContext('2d');
      this.visible = true;
      this.opacity = 1;
      this.blendMode = 'source-over';
      this.locked = false;
    }

    resize(w, h) {
      const imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      this.canvas.width = w;
      this.canvas.height = h;
      this.ctx.putImageData(imgData, 0, 0);
    }

    clear() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    clone() {
      const l = new Layer(this.canvas.width, this.canvas.height, this.name + ' copy');
      l.ctx.drawImage(this.canvas, 0, 0);
      l.visible = this.visible;
      l.opacity = this.opacity;
      l.blendMode = this.blendMode;
      return l;
    }

    toDataURL() {
      return this.canvas.toDataURL();
    }

    fromDataURL(url) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          this.ctx.drawImage(img, 0, 0);
          resolve();
        };
        img.src = url;
      });
    }
  }

  /* ---- History (Undo/Redo) ---- */
  const MAX_HISTORY = 40;
  let historyStack = [];
  let redoStack = [];
  let layersRef = null;

  function captureState(layers) {
    return layers.map(l => ({
      id: l.id,
      name: l.name,
      data: l.toDataURL(),
      visible: l.visible,
      opacity: l.opacity,
      blendMode: l.blendMode,
      locked: l.locked
    }));
  }

  function pushHistory(layers) {
    layersRef = layers;
    historyStack.push(captureState(layers));
    if (historyStack.length > MAX_HISTORY) historyStack.shift();
    redoStack.length = 0;
  }

  async function restoreState(state, layers, width, height) {
    layers.length = 0;
    for (const s of state) {
      const l = new Layer(width, height, s.name);
      l.id = s.id;
      l.visible = s.visible;
      l.opacity = s.opacity;
      l.blendMode = s.blendMode;
      l.locked = s.locked;
      await l.fromDataURL(s.data);
      layers.push(l);
    }
  }

  async function undo(layers, width, height) {
    if (historyStack.length === 0) return false;
    redoStack.push(captureState(layers));
    const state = historyStack.pop();
    await restoreState(state, layers, width, height);
    return true;
  }

  async function redo(layers, width, height) {
    if (redoStack.length === 0) return false;
    historyStack.push(captureState(layers));
    const state = redoStack.pop();
    await restoreState(state, layers, width, height);
    return true;
  }

  /* ---- Color Utilities ---- */
  function hslToRgb(h, s, l) {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  }

  function hslToHex(h, s, l) {
    const [r, g, b] = hslToRgb(h, s, l);
    return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
  }

  function hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
  }

  function hexToHsl(hex) {
    const [r, g, b] = hexToRgb(hex);
    return rgbToHsl(r, g, b);
  }

  /* ---- Brush Engines ---- */
  const Brushes = {
    pencil(ctx, x, y, size, color, opacity, pressure) {
      ctx.globalAlpha = opacity * pressure;
      ctx.fillStyle = color;
      const r = Math.max(0.5, size * 0.5 * (0.3 + pressure * 0.7));
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    },

    pencilStroke(ctx, x1, y1, x2, y2, size, color, opacity, pressure) {
      ctx.globalAlpha = opacity * pressure;
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(1, size * (0.3 + pressure * 0.7));
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    },

    pen(ctx, x1, y1, x2, y2, size, color, opacity, pressure) {
      ctx.globalAlpha = opacity;
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(0.5, size * (0.5 + pressure * 0.5));
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    },

    marker(ctx, x1, y1, x2, y2, size, color, opacity, pressure) {
      ctx.globalAlpha = opacity * 0.4;
      ctx.strokeStyle = color;
      ctx.lineWidth = size * 2;
      ctx.lineCap = 'square';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    },

    airbrush(ctx, x, y, size, color, opacity, pressure) {
      const density = Math.floor(size * 3 * pressure);
      const [r, g, b] = hexToRgb(color);
      for (let i = 0; i < density; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * size * 2;
        const a = opacity * 0.15 * (1 - dist / (size * 2)) * pressure;
        ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
        ctx.fillRect(x + Math.cos(angle) * dist, y + Math.sin(angle) * dist, 1, 1);
      }
    },

    eraser(ctx, x1, y1, x2, y2, size, opacity, pressure) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.globalAlpha = opacity * pressure;
      ctx.strokeStyle = 'rgba(0,0,0,1)';
      ctx.lineWidth = size * 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }
  };

  /* ---- Compositing / Rendering ---- */
  function compositeLayersToCanvas(layers, targetCanvas) {
    const ctx = targetCanvas.getContext('2d');
    ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
    // Draw white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, targetCanvas.width, targetCanvas.height);
    for (const layer of layers) {
      if (!layer.visible) continue;
      ctx.globalAlpha = layer.opacity;
      ctx.globalCompositeOperation = layer.blendMode;
      ctx.drawImage(layer.canvas, 0, 0);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  function exportPNG(layers, width, height) {
    const c = document.createElement('canvas');
    c.width = width;
    c.height = height;
    compositeLayersToCanvas(layers, c);
    return c.toDataURL('image/png');
  }

  /* ---- Smoothing (Catmull-Rom) ---- */
  function smoothPoints(points) {
    if (points.length < 3) return points;
    const result = [points[0]];
    for (let i = 1; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[Math.min(points.length - 1, i + 1)];
      result.push({
        x: p1.x * 0.7 + (p0.x + p2.x) * 0.15,
        y: p1.y * 0.7 + (p0.y + p2.y) * 0.15,
        pressure: p1.pressure
      });
    }
    result.push(points[points.length - 1]);
    return result;
  }

  /* ---- Export ---- */
  window.DrawingEngine = {
    Layer,
    Brushes,
    pushHistory,
    undo,
    redo,
    compositeLayersToCanvas,
    exportPNG,
    smoothPoints,
    hslToRgb,
    rgbToHsl,
    hslToHex,
    hexToRgb,
    hexToHsl
  };
})();
