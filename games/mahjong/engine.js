/* engine.js — Mahjong Solitaire game engine
 * Manages game state: board, selection, matching, undo, hints, shuffle.
 */

window.MahjongEngine = (() => {
  'use strict';

  const { generateTileSet, canMatch, shuffle } = MahjongTiles;
  const { getLayout } = MahjongLayouts;

  let board = [];        // Array of { ...tile, col, row, layer, removed }
  let selected = null;   // Currently selected tile uid, or null
  let moveHistory = [];  // Stack of { pair: [uid1, uid2] } for undo
  let moveCount = 0;
  let startTime = 0;
  let timerInterval = null;
  let paused = false;
  let currentLayoutId = 'turtle';
  let onUpdate = null;   // Callback: () => void
  let onTimer = null;    // Callback: (seconds) => void
  let onGameEnd = null;  // Callback: (won: boolean) => void

  /**
   * Initialize a new game with the given layout.
   */
  function newGame(layoutId) {
    currentLayoutId = layoutId || 'turtle';
    const positions = getLayout(currentLayoutId);
    const tiles = generateTileSet();
    shuffle(tiles);

    board = positions.map((pos, i) => ({
      ...tiles[i],
      col: pos.col,
      row: pos.row,
      layer: pos.layer,
      removed: false,
    }));

    selected = null;
    moveHistory = [];
    moveCount = 0;
    startTime = Date.now();
    paused = false;

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (!paused && onTimer) {
        onTimer(getElapsedSeconds());
      }
    }, 1000);

    if (onUpdate) onUpdate();
  }

  function getElapsedSeconds() {
    return Math.floor((Date.now() - startTime) / 1000);
  }

  /**
   * Determine if a tile is "free" (can be selected).
   * A tile is free if:
   *   1. It is not covered by any tile on a higher layer
   *   2. It is not blocked on both left AND right by adjacent tiles on the same layer
   */
  function isFree(tile) {
    if (tile.removed) return false;

    const alive = board.filter(t => !t.removed && t.uid !== tile.uid);

    // Check if covered: any tile on a higher layer overlaps this tile's space
    // A tile occupies a 2x2 cell (col, col+1) x (row, row+1)
    const covered = alive.some(t =>
      t.layer > tile.layer &&
      t.col < tile.col + 2 && t.col + 2 > tile.col &&
      t.row < tile.row + 2 && t.row + 2 > tile.row
    );
    if (covered) return false;

    // Check left/right blocking on same layer
    // Blocked left: any tile at (col-2, row +/- 1) on same layer
    const blockedLeft = alive.some(t =>
      t.layer === tile.layer &&
      t.col === tile.col - 2 &&
      t.row > tile.row - 2 && t.row < tile.row + 2
    );
    const blockedRight = alive.some(t =>
      t.layer === tile.layer &&
      t.col === tile.col + 2 &&
      t.row > tile.row - 2 && t.row < tile.row + 2
    );

    return !(blockedLeft && blockedRight);
  }

  /**
   * Get all currently free tiles.
   */
  function getFreeTiles() {
    return board.filter(t => !t.removed && isFree(t));
  }

  /**
   * Get all available matching pairs from free tiles.
   */
  function getAvailablePairs() {
    const free = getFreeTiles();
    const pairs = [];
    for (let i = 0; i < free.length; i++) {
      for (let j = i + 1; j < free.length; j++) {
        if (canMatch(free[i], free[j])) {
          pairs.push([free[i], free[j]]);
        }
      }
    }
    return pairs;
  }

  /**
   * Select a tile. If it matches the previously selected tile, remove both.
   * Returns: 'selected' | 'matched' | 'mismatch' | 'blocked'
   */
  function selectTile(uid) {
    const tile = board.find(t => t.uid === uid);
    if (!tile || tile.removed) return 'blocked';
    if (!isFree(tile)) return 'blocked';

    if (selected === null) {
      selected = uid;
      if (onUpdate) onUpdate();
      return 'selected';
    }

    if (selected === uid) {
      // Deselect
      selected = null;
      if (onUpdate) onUpdate();
      return 'selected';
    }

    const prev = board.find(t => t.uid === selected);
    if (canMatch(prev, tile)) {
      // Remove both
      prev.removed = true;
      tile.removed = true;
      moveHistory.push({ pair: [prev.uid, tile.uid] });
      moveCount++;
      selected = null;
      if (onUpdate) onUpdate();

      // Check win/loss
      const remaining = board.filter(t => !t.removed);
      if (remaining.length === 0) {
        clearInterval(timerInterval);
        if (onGameEnd) onGameEnd(true);
      } else if (getAvailablePairs().length === 0) {
        // No more moves — game over (but can shuffle)
        if (onGameEnd) onGameEnd(false);
      }

      return 'matched';
    } else {
      selected = uid;
      if (onUpdate) onUpdate();
      return 'mismatch';
    }
  }

  /**
   * Undo the last move.
   */
  function undo() {
    if (moveHistory.length === 0) return false;
    const last = moveHistory.pop();
    for (const uid of last.pair) {
      const tile = board.find(t => t.uid === uid);
      if (tile) tile.removed = false;
    }
    moveCount--;
    selected = null;
    if (onUpdate) onUpdate();
    return true;
  }

  /**
   * Get one hint pair (first available).
   */
  function getHint() {
    const pairs = getAvailablePairs();
    return pairs.length > 0 ? pairs[0] : null;
  }

  /**
   * Shuffle remaining tiles in place (keeps positions, reassigns tile faces).
   * Only shuffles non-removed tiles. Ensures at least one pair exists.
   */
  function shuffleRemaining() {
    const remaining = board.filter(t => !t.removed);
    if (remaining.length === 0) return;

    // Face-related keys (everything except position and state)
    const FACE_KEYS = ['type','suit','rank','id','char','suitChar','label','color','matchGroup','copy'];

    // Extract tile face data from remaining tiles
    const faces = remaining.map(t => {
      const face = {};
      for (const k of FACE_KEYS) {
        if (k in t) face[k] = t[k];
      }
      return face;
    });

    shuffle(faces);

    // Reassign faces to positions — clear old face keys first to avoid stale props
    remaining.forEach((t, i) => {
      for (const k of FACE_KEYS) delete t[k];
      Object.assign(t, faces[i]);
    });

    selected = null;
    moveCount++;
    if (onUpdate) onUpdate();
  }

  /**
   * Get the current board state.
   */
  function getBoard() { return board; }
  function getSelected() { return selected; }
  function getMoveCount() { return moveCount; }
  function getLayoutId() { return currentLayoutId; }
  function getRemainingCount() { return board.filter(t => !t.removed).length; }

  function setCallbacks(update, timer, gameEnd) {
    onUpdate = update;
    onTimer = timer;
    onGameEnd = gameEnd;
  }

  function destroy() {
    if (timerInterval) clearInterval(timerInterval);
  }

  return {
    newGame, selectTile, undo, getHint, shuffleRemaining,
    getBoard, getSelected, getFreeTiles, getAvailablePairs,
    getMoveCount, getElapsedSeconds, getLayoutId, getRemainingCount,
    isFree, setCallbacks, destroy,
  };
})();
