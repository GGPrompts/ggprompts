/* Sokoban Renderer — canvas-based tile rendering with smooth animation */

window.SokobanRenderer = (function () {
  const TILE = window.SokobanEngine.TILE;

  let canvas, ctx;
  let tileSize = 64;
  let offsetX = 0, offsetY = 0;
  let animQueue = [];
  let animating = false;
  const ANIM_DURATION = 100; // ms per move

  // Sprite colors / drawing
  const COLORS = {
    void: '#0a0a0f',
    floor: '#3a3530',
    floorAlt: '#36312c',
    wall: '#6b5c4d',
    wallTop: '#7d6e5d',
    wallEdge: '#4a3f34',
    target: '#2a5a2a',
    targetGlow: '#44dd44',
    crate: '#a07030',
    crateTop: '#b88040',
    crateEdge: '#7a5020',
    crateOnTarget: '#70a030',
    crateOnTargetTop: '#88b840',
    player: '#4488cc',
    playerHighlight: '#66aaee',
    playerDark: '#2266aa'
  };

  function init(canvasEl) {
    canvas = canvasEl;
    ctx = canvas.getContext('2d');
  }

  function resize(state) {
    if (!state) return;
    const maxW = canvas.parentElement.clientWidth;
    const maxH = canvas.parentElement.clientHeight;
    const cols = state.width;
    const rows = state.height;

    tileSize = Math.floor(Math.min(maxW / cols, maxH / rows));
    tileSize = Math.max(24, Math.min(tileSize, 80));

    canvas.width = cols * tileSize;
    canvas.height = rows * tileSize;
    offsetX = 0;
    offsetY = 0;
  }

  function drawTile(x, y, type, progress) {
    const px = offsetX + x * tileSize;
    const py = offsetY + y * tileSize;
    const s = tileSize;
    const p = s * 0.08; // padding

    switch (type) {
      case TILE.VOID:
        ctx.fillStyle = COLORS.void;
        ctx.fillRect(px, py, s, s);
        break;

      case TILE.FLOOR:
        drawFloor(px, py, s, x, y);
        break;

      case TILE.WALL:
        drawWall(px, py, s);
        break;

      case TILE.TARGET:
        drawFloor(px, py, s, x, y);
        drawTarget(px, py, s);
        break;

      case TILE.CRATE:
        drawFloor(px, py, s, x, y);
        drawCrate(px, py, s, false);
        break;

      case TILE.CRATE_ON_TARGET:
        drawFloor(px, py, s, x, y);
        drawTarget(px, py, s);
        drawCrate(px, py, s, true);
        break;

      case TILE.PLAYER:
        drawFloor(px, py, s, x, y);
        drawPlayer(px, py, s);
        break;

      case TILE.PLAYER_ON_TARGET:
        drawFloor(px, py, s, x, y);
        drawTarget(px, py, s);
        drawPlayer(px, py, s);
        break;
    }
  }

  function drawFloor(px, py, s, gx, gy) {
    ctx.fillStyle = (gx + gy) % 2 === 0 ? COLORS.floor : COLORS.floorAlt;
    ctx.fillRect(px, py, s, s);

    // Subtle stone texture lines
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(px + 0.5, py + 0.5, s - 1, s - 1);

    // Small cracks for texture
    ctx.strokeStyle = 'rgba(0,0,0,0.08)';
    ctx.beginPath();
    ctx.moveTo(px + s * 0.3, py + s * 0.2);
    ctx.lineTo(px + s * 0.5, py + s * 0.4);
    ctx.stroke();
  }

  function drawWall(px, py, s) {
    // Main wall body
    ctx.fillStyle = COLORS.wall;
    ctx.fillRect(px, py, s, s);

    // Top face (lighter)
    ctx.fillStyle = COLORS.wallTop;
    ctx.fillRect(px, py, s, s * 0.3);

    // Left edge shadow
    ctx.fillStyle = COLORS.wallEdge;
    ctx.fillRect(px, py + s * 0.3, s * 0.08, s * 0.7);

    // Brick pattern
    ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    ctx.lineWidth = 1;
    ctx.strokeRect(px + 1, py + 1, s - 2, s - 2);
    // Horizontal mortar
    ctx.beginPath();
    ctx.moveTo(px, py + s * 0.5);
    ctx.lineTo(px + s, py + s * 0.5);
    ctx.stroke();
    // Vertical mortar offset
    ctx.beginPath();
    ctx.moveTo(px + s * 0.5, py);
    ctx.lineTo(px + s * 0.5, py + s * 0.5);
    ctx.moveTo(px + s * 0.25, py + s * 0.5);
    ctx.lineTo(px + s * 0.25, py + s);
    ctx.moveTo(px + s * 0.75, py + s * 0.5);
    ctx.lineTo(px + s * 0.75, py + s);
    ctx.stroke();

    // Top highlight
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.beginPath();
    ctx.moveTo(px + 2, py + 2);
    ctx.lineTo(px + s - 2, py + 2);
    ctx.stroke();
  }

  function drawTarget(px, py, s) {
    const cx = px + s / 2;
    const cy = py + s / 2;
    const r = s * 0.25;
    const time = Date.now() * 0.003;
    const pulse = 0.7 + 0.3 * Math.sin(time);

    // Glow
    const grad = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r * 1.8);
    grad.addColorStop(0, `rgba(68, 221, 68, ${0.4 * pulse})`);
    grad.addColorStop(1, 'rgba(68, 221, 68, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Diamond shape
    ctx.fillStyle = `rgba(68, 221, 68, ${0.6 + 0.3 * pulse})`;
    ctx.beginPath();
    ctx.moveTo(cx, cy - r);
    ctx.lineTo(cx + r, cy);
    ctx.lineTo(cx, cy + r);
    ctx.lineTo(cx - r, cy);
    ctx.closePath();
    ctx.fill();

    // Inner diamond
    ctx.fillStyle = `rgba(100, 255, 100, ${0.5 + 0.3 * pulse})`;
    const ri = r * 0.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy - ri);
    ctx.lineTo(cx + ri, cy);
    ctx.lineTo(cx, cy + ri);
    ctx.lineTo(cx - ri, cy);
    ctx.closePath();
    ctx.fill();
  }

  function drawCrate(px, py, s, onTarget) {
    const p = s * 0.1;
    const bx = px + p;
    const by = py + p;
    const bs = s - p * 2;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(bx + 3, by + 3, bs, bs);

    // Main body
    ctx.fillStyle = onTarget ? COLORS.crateOnTarget : COLORS.crate;
    ctx.fillRect(bx, by, bs, bs);

    // Top highlight
    ctx.fillStyle = onTarget ? COLORS.crateOnTargetTop : COLORS.crateTop;
    ctx.fillRect(bx, by, bs, bs * 0.15);
    ctx.fillRect(bx, by, bs * 0.08, bs);

    // Bottom/right edge
    ctx.fillStyle = onTarget ? '#5a8a20' : COLORS.crateEdge;
    ctx.fillRect(bx, by + bs * 0.85, bs, bs * 0.15);
    ctx.fillRect(bx + bs * 0.92, by, bs * 0.08, bs);

    // X marks
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bx + bs * 0.2, by + bs * 0.2);
    ctx.lineTo(bx + bs * 0.8, by + bs * 0.8);
    ctx.moveTo(bx + bs * 0.8, by + bs * 0.2);
    ctx.lineTo(bx + bs * 0.2, by + bs * 0.8);
    ctx.stroke();

    // Border
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(bx, by, bs, bs);

    // Glow if on target
    if (onTarget) {
      ctx.shadowColor = '#44dd44';
      ctx.shadowBlur = 8;
      ctx.strokeStyle = 'rgba(68,221,68,0.5)';
      ctx.lineWidth = 2;
      ctx.strokeRect(bx - 1, by - 1, bs + 2, bs + 2);
      ctx.shadowBlur = 0;
    }
  }

  function drawPlayer(px, py, s) {
    const cx = px + s / 2;
    const cy = py + s / 2;
    const r = s * 0.32;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.arc(cx + 2, cy + 2, r, 0, Math.PI * 2);
    ctx.fill();

    // Body
    const grad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 0, cx, cy, r);
    grad.addColorStop(0, COLORS.playerHighlight);
    grad.addColorStop(0.7, COLORS.player);
    grad.addColorStop(1, COLORS.playerDark);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // Outline
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    // Eyes
    const eyeR = r * 0.15;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(cx - r * 0.3, cy - r * 0.15, eyeR, 0, Math.PI * 2);
    ctx.arc(cx + r * 0.3, cy - r * 0.15, eyeR, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(cx - r * 0.25, cy - r * 0.1, eyeR * 0.5, 0, Math.PI * 2);
    ctx.arc(cx + r * 0.35, cy - r * 0.1, eyeR * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- Animation system ---
  function animateMove(moveData, state, callback) {
    if (!moveData) { render(state); if (callback) callback(); return; }

    const startTime = performance.now();
    const pFrom = moveData.playerFrom;
    const pTo = moveData.playerTo;
    const cFrom = moveData.crateFrom;
    const cTo = moveData.crateTo;

    function frame(now) {
      let t = (now - startTime) / ANIM_DURATION;
      if (t > 1) t = 1;

      // Ease out
      const ease = 1 - (1 - t) * (1 - t);

      // Draw static map
      renderBase(state);

      // Draw animated player
      const ppx = offsetX + (pFrom.x + (pTo.x - pFrom.x) * ease) * tileSize;
      const ppy = offsetY + (pFrom.y + (pTo.y - pFrom.y) * ease) * tileSize;
      drawPlayer(ppx, ppy, tileSize);

      // Draw animated crate
      if (moveData.pushed && cFrom && cTo) {
        const cpx = offsetX + (cFrom.x + (cTo.x - cFrom.x) * ease) * tileSize;
        const cpy = offsetY + (cFrom.y + (cTo.y - cFrom.y) * ease) * tileSize;
        const onTarget = state.targets.some(t => t.x === cTo.x && t.y === cTo.y) && ease > 0.9;
        drawCrate(cpx, cpy, tileSize, onTarget);
      }

      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        render(state);
        if (callback) callback();
      }
    }

    requestAnimationFrame(frame);
  }

  function renderBase(state) {
    const map = state.baseMap;
    ctx.fillStyle = COLORS.void;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < (map[y] ? map[y].length : 0); x++) {
        const tile = map[y][x];
        if (tile === TILE.WALL) {
          drawTile(x, y, TILE.WALL);
        } else if (tile === TILE.TARGET) {
          drawTile(x, y, TILE.TARGET);
        } else if (tile === TILE.FLOOR) {
          drawTile(x, y, TILE.FLOOR);
        } else {
          drawTile(x, y, TILE.VOID);
        }
      }
    }

    // Draw non-animated crates
    for (const c of state.crates) {
      const onTarget = state.targets.some(t => t.x === c.x && t.y === c.y);
      drawCrate(offsetX + c.x * tileSize, offsetY + c.y * tileSize, tileSize, onTarget);
    }
  }

  function render(state) {
    if (!state || !ctx) return;
    renderBase(state);
    drawPlayer(offsetX + state.playerX * tileSize, offsetY + state.playerY * tileSize, tileSize);
  }

  return { init, resize, render, animateMove, drawTarget };
})();
