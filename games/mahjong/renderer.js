/* renderer.js — Mahjong Solitaire tile renderer
 * Renders the board into the DOM, handles tile clicks, hint/win animations.
 */

window.MahjongRenderer = (() => {
  'use strict';

  const engine = MahjongEngine;
  let boardEl = null;
  let timerEl = null;
  let movesEl = null;
  let remainingEl = null;
  let hintPair = null;
  let hintTimeout = null;

  // Tile sizing — computed dynamically
  let tileW = 48;
  let tileH = 60;
  let layerOffX = 4;
  let layerOffY = 4;

  /**
   * Initialize the renderer.
   */
  function init(boardElement, timerElement, movesElement, remainingElement) {
    boardEl = boardElement;
    timerEl = timerElement;
    movesEl = movesElement;
    remainingEl = remainingElement;

    engine.setCallbacks(render, updateTimer, handleGameEnd);
    window.addEventListener('resize', computeTileSize);
  }

  /**
   * Compute tile size based on the board layout extents and viewport.
   */
  function computeTileSize() {
    const board = engine.getBoard();
    if (board.length === 0) return;

    const maxCol = Math.max(...board.map(t => t.col)) + 2;
    const maxRow = Math.max(...board.map(t => t.row)) + 2;
    const maxLayer = Math.max(...board.map(t => t.layer));

    const containerW = boardEl.clientWidth - 20;
    const containerH = boardEl.clientHeight - 20;

    // Account for layer offsets
    const totalLayerOffX = maxLayer * layerOffX;
    const totalLayerOffY = maxLayer * layerOffY;

    const availW = containerW - totalLayerOffX;
    const availH = containerH - totalLayerOffY;

    // Each tile position is 2 units wide, 2 units tall in col/row space
    // But col/row are in half-tile units, so a tile at col=c occupies c..c+2
    const cellW = availW / maxCol;
    const cellH = availH / maxRow;

    // Maintain aspect ratio (tiles are taller than wide, roughly 4:5)
    const ratio = 0.8;
    if (cellW / cellH > ratio) {
      tileW = Math.floor(cellH * ratio * 2);
      tileH = Math.floor(cellH * 2);
    } else {
      tileW = Math.floor(cellW * 2);
      tileH = Math.floor(cellW / ratio * 2);
    }

    // Clamp
    tileW = Math.min(tileW, 64);
    tileH = Math.min(tileH, 80);
    tileW = Math.max(tileW, 28);
    tileH = Math.max(tileH, 35);

    layerOffX = Math.max(2, Math.floor(tileW * 0.08));
    layerOffY = Math.max(2, Math.floor(tileH * 0.06));

    render();
  }

  /**
   * Build a CSS-rendered tile face.
   */
  function buildTileFace(tile) {
    const face = document.createElement('div');
    face.className = 'tile-face';

    if (tile.type === 'suit') {
      if (tile.suit === 'circle') {
        // Draw circles/dots
        face.innerHTML = `<span class="tile-rank" style="color:${tile.color}">${tile.rank}</span>
          <span class="tile-suit-char" style="color:${tile.color}">${tile.suitChar}</span>`;
        face.classList.add('suit-circle');
      } else {
        face.innerHTML = `<span class="tile-char" style="color:${tile.color}">${tile.char}</span>
          <span class="tile-suit-char" style="color:${tile.color}">${tile.suitChar}</span>`;
      }
    } else if (tile.type === 'wind') {
      face.innerHTML = `<span class="tile-char tile-char-large" style="color:${tile.color}">${tile.char}</span>`;
    } else if (tile.type === 'dragon') {
      face.innerHTML = `<span class="tile-char tile-char-large" style="color:${tile.color}">${tile.char}</span>`;
    } else if (tile.type === 'flower') {
      face.innerHTML = `<span class="tile-char tile-char-large" style="color:${tile.color}">${tile.char}</span>
        <span class="tile-bonus-label">花</span>`;
    } else if (tile.type === 'season') {
      face.innerHTML = `<span class="tile-char tile-char-large" style="color:${tile.color}">${tile.char}</span>
        <span class="tile-bonus-label">季</span>`;
    }

    return face;
  }

  /**
   * Full render of the board.
   */
  function render() {
    if (!boardEl) return;
    const board = engine.getBoard();
    const selectedUid = engine.getSelected();
    const freeTiles = new Set(engine.getFreeTiles().map(t => t.uid));

    // Compute board extents for centering
    const alive = board.filter(t => !t.removed);
    if (alive.length === 0) {
      boardEl.innerHTML = '';
      updateStats();
      return;
    }

    const maxCol = Math.max(...board.map(t => t.col)) + 2;
    const maxRow = Math.max(...board.map(t => t.row)) + 2;
    const maxLayer = Math.max(...board.map(t => t.layer));

    const boardPixelW = maxCol * (tileW / 2) + maxLayer * layerOffX + tileW;
    const boardPixelH = maxRow * (tileH / 2) + maxLayer * layerOffY + tileH;

    const offsetX = Math.max(0, (boardEl.clientWidth - boardPixelW) / 2);
    const offsetY = Math.max(0, (boardEl.clientHeight - boardPixelH) / 2);

    boardEl.innerHTML = '';

    // Sort: draw bottom layers first, then by row (top to bottom), then by col
    const sorted = [...alive].sort((a, b) => {
      if (a.layer !== b.layer) return a.layer - b.layer;
      if (a.row !== b.row) return a.row - b.row;
      return a.col - b.col;
    });

    for (const tile of sorted) {
      const el = document.createElement('div');
      el.className = 'tile';
      el.dataset.uid = tile.uid;

      const x = offsetX + tile.col * (tileW / 2) + tile.layer * layerOffX;
      const y = offsetY + tile.row * (tileH / 2) + tile.layer * layerOffY;

      el.style.left = x + 'px';
      el.style.top = y + 'px';
      el.style.width = tileW + 'px';
      el.style.height = tileH + 'px';
      el.style.zIndex = tile.layer * 100 + tile.row;

      const isFree = freeTiles.has(tile.uid);
      if (isFree) el.classList.add('free');
      if (tile.uid === selectedUid) el.classList.add('selected');

      // Hint highlight
      if (hintPair && (tile.uid === hintPair[0].uid || tile.uid === hintPair[1].uid)) {
        el.classList.add('hint');
      }

      // 3D tile effect: side + shadow via CSS classes
      el.classList.add('layer-' + Math.min(tile.layer, 4));

      const face = buildTileFace(tile);
      el.appendChild(face);

      el.addEventListener('click', () => onTileClick(tile.uid));

      boardEl.appendChild(el);
    }

    updateStats();
  }

  function onTileClick(uid) {
    clearHint();
    const result = engine.selectTile(uid);
    if (result === 'matched') {
      // Brief flash animation handled by CSS transition on removal
    }
  }

  function updateTimer(seconds) {
    if (timerEl) {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      timerEl.textContent = `${m}:${s.toString().padStart(2, '0')}`;
    }
  }

  function updateStats() {
    if (movesEl) movesEl.textContent = engine.getMoveCount();
    if (remainingEl) remainingEl.textContent = engine.getRemainingCount();
  }

  function handleGameEnd(won) {
    if (won) {
      setTimeout(() => {
        showMessage('Congratulations! You cleared the board!', true);
      }, 300);
    } else {
      showMessage('No more moves available. Try shuffle or undo.', false);
    }
  }

  function showMessage(text, isWin) {
    const msg = document.createElement('div');
    msg.className = 'game-message ' + (isWin ? 'win' : 'stuck');
    msg.innerHTML = `<div class="game-message-content">
      <p>${text}</p>
      <div class="game-message-stats">
        Time: ${formatTime(engine.getElapsedSeconds())} | Moves: ${engine.getMoveCount()}
      </div>
      <button class="btn-jade" onclick="this.closest('.game-message').remove()">OK</button>
    </div>`;
    boardEl.parentElement.appendChild(msg);
  }

  function formatTime(s) {
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  }

  /**
   * Show hint (highlight a matching pair for 3 seconds).
   */
  function showHint() {
    clearHint();
    const pair = engine.getHint();
    if (!pair) return;
    hintPair = pair;
    render();
    hintTimeout = setTimeout(() => {
      hintPair = null;
      render();
    }, 3000);
  }

  function clearHint() {
    if (hintTimeout) clearTimeout(hintTimeout);
    hintPair = null;
  }

  function destroy() {
    window.removeEventListener('resize', computeTileSize);
    clearHint();
  }

  return { init, render, computeTileSize, showHint, destroy };
})();
