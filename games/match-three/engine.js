/* Match-Three Engine — grid logic, matching, gravity, specials, scoring */
'use strict';

window.MatchEngine = (function () {
  const COLS = 8;
  const ROWS = 8;
  const GEM_TYPES = ['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst', 'diamond'];

  /* --- State --- */
  let grid = [];          // grid[row][col] = { type, special, id }
  let nextId = 0;
  let score = 0;
  let combo = 0;          // current cascade depth
  let movesLeft = 0;
  let level = 1;
  let targetScore = 0;
  let gameOver = false;
  let onUpdate = null;    // callback(event, data)
  let animQueue = [];     // queued animation events

  /* --- Helpers --- */
  function uid() { return nextId++; }

  function randomType() {
    return GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)];
  }

  function gem(type, special) {
    return { type, special: special || null, id: uid() };
  }

  function inBounds(r, c) {
    return r >= 0 && r < ROWS && c >= 0 && c < COLS;
  }

  function cloneGrid() {
    return grid.map(row => row.map(cell => cell ? { ...cell } : null));
  }

  /* --- Level config --- */
  function levelConfig(lvl) {
    return {
      moves: Math.max(15, 30 - (lvl - 1) * 2),
      target: 800 + (lvl - 1) * 600
    };
  }

  /* --- Init --- */
  function init(cb) {
    onUpdate = cb;
    startLevel(1);
  }

  function startLevel(lvl) {
    level = lvl;
    const cfg = levelConfig(lvl);
    movesLeft = cfg.moves;
    targetScore = cfg.target;
    score = 0;
    combo = 0;
    gameOver = false;
    grid = [];
    for (let r = 0; r < ROWS; r++) {
      grid[r] = [];
      for (let c = 0; c < COLS; c++) {
        grid[r][c] = gem(randomType());
      }
    }
    // Remove initial matches
    removeInitialMatches();
    emit('levelStart', { level, moves: movesLeft, target: targetScore });
    emit('gridUpdate', { grid: cloneGrid(), score, moves: movesLeft });
  }

  function removeInitialMatches() {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        let attempts = 0;
        while (attempts < 20 && hasMatchAt(r, c)) {
          grid[r][c] = gem(randomType());
          attempts++;
        }
      }
    }
  }

  function hasMatchAt(r, c) {
    const t = grid[r][c].type;
    // horizontal
    if (c >= 2 && grid[r][c - 1].type === t && grid[r][c - 2].type === t) return true;
    // vertical
    if (r >= 2 && grid[r - 1][c].type === t && grid[r - 2][c].type === t) return true;
    return false;
  }

  /* --- Matching --- */
  function findAllMatches() {
    const matched = new Set(); // "r,c" strings
    const specials = [];       // { row, col, special } to create

    // Horizontal
    for (let r = 0; r < ROWS; r++) {
      let run = 1;
      for (let c = 1; c <= COLS; c++) {
        if (c < COLS && grid[r][c] && grid[r][c - 1] && grid[r][c].type === grid[r][c - 1].type) {
          run++;
        } else {
          if (run >= 3) {
            for (let k = c - run; k < c; k++) {
              matched.add(r + ',' + k);
            }
            if (run === 4) {
              // Line clear — horizontal
              const midC = c - run + Math.floor(run / 2);
              specials.push({ row: r, col: midC, special: 'line-h', type: grid[r][midC].type });
            } else if (run >= 5) {
              // Bomb
              const midC = c - run + Math.floor(run / 2);
              specials.push({ row: r, col: midC, special: 'bomb', type: grid[r][midC].type });
            }
          }
          run = 1;
        }
      }
    }

    // Vertical
    for (let c = 0; c < COLS; c++) {
      let run = 1;
      for (let r = 1; r <= ROWS; r++) {
        if (r < ROWS && grid[r][c] && grid[r - 1][c] && grid[r][c].type === grid[r - 1][c].type) {
          run++;
        } else {
          if (run >= 3) {
            for (let k = r - run; k < r; k++) {
              matched.add(k + ',' + c);
            }
            if (run === 4) {
              const midR = r - run + Math.floor(run / 2);
              specials.push({ row: midR, col: c, special: 'line-v', type: grid[midR][c].type });
            } else if (run >= 5) {
              const midR = r - run + Math.floor(run / 2);
              specials.push({ row: midR, col: c, special: 'bomb', type: grid[midR][c].type });
            }
          }
          run = 1;
        }
      }
    }

    return { matched, specials };
  }

  /* --- Special gem activation --- */
  function activateSpecial(r, c, destroyed) {
    const cell = grid[r][c];
    if (!cell || !cell.special) return;

    if (cell.special === 'line-h') {
      for (let cc = 0; cc < COLS; cc++) {
        destroyed.add(r + ',' + cc);
      }
    } else if (cell.special === 'line-v') {
      for (let rr = 0; rr < ROWS; rr++) {
        destroyed.add(rr + ',' + c);
      }
    } else if (cell.special === 'bomb') {
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          if (inBounds(r + dr, c + dc)) {
            destroyed.add((r + dr) + ',' + (c + dc));
          }
        }
      }
    }
  }

  /* --- Process matches: clear, trigger specials, score --- */
  function processMatches() {
    const { matched, specials } = findAllMatches();
    if (matched.size === 0) return false;

    combo++;

    // Collect all destroyed cells (including special chain reactions)
    const destroyed = new Set(matched);

    // Activate specials that are in the matched set
    for (const key of matched) {
      const [r, c] = key.split(',').map(Number);
      if (grid[r][c] && grid[r][c].special) {
        activateSpecial(r, c, destroyed);
      }
    }

    // Score
    const basePoints = destroyed.size * 10;
    const comboMultiplier = combo;
    const points = basePoints * comboMultiplier;
    score += points;

    // Emit match event with positions
    const cells = [];
    for (const key of destroyed) {
      const [r, c] = key.split(',').map(Number);
      cells.push({ row: r, col: c, gem: grid[r][c] ? { ...grid[r][c] } : null });
    }
    emit('match', { cells, points, combo, score });

    // Clear matched cells (but place specials first)
    for (const key of destroyed) {
      const [r, c] = key.split(',').map(Number);
      grid[r][c] = null;
    }

    // Place special gems
    for (const sp of specials) {
      if (grid[sp.row][sp.col] === null) {
        grid[sp.row][sp.col] = gem(sp.type, sp.special);
        emit('specialCreated', { row: sp.row, col: sp.col, special: sp.special, type: sp.type });
      }
    }

    return true;
  }

  /* --- Gravity --- */
  function applyGravity() {
    const falls = [];
    for (let c = 0; c < COLS; c++) {
      let writeRow = ROWS - 1;
      for (let r = ROWS - 1; r >= 0; r--) {
        if (grid[r][c] !== null) {
          if (r !== writeRow) {
            falls.push({ gem: { ...grid[r][c] }, fromRow: r, toRow: writeRow, col: c });
            grid[writeRow][c] = grid[r][c];
            grid[r][c] = null;
          }
          writeRow--;
        }
      }
      // Fill from top
      for (let r = writeRow; r >= 0; r--) {
        const newGem = gem(randomType());
        grid[r][c] = newGem;
        falls.push({ gem: { ...newGem }, fromRow: r - (writeRow + 1), toRow: r, col: c, isNew: true });
      }
    }
    if (falls.length > 0) {
      emit('fall', { falls });
    }
    return falls.length > 0;
  }

  /* --- Swap --- */
  function isAdjacent(r1, c1, r2, c2) {
    return Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;
  }

  function swap(r1, c1, r2, c2) {
    if (gameOver) return false;
    if (!isAdjacent(r1, c1, r2, c2)) return false;
    if (!inBounds(r1, c1) || !inBounds(r2, c2)) return false;

    // Do swap
    const tmp = grid[r1][c1];
    grid[r1][c1] = grid[r2][c2];
    grid[r2][c2] = tmp;

    // Check if it creates a match
    const { matched } = findAllMatches();
    if (matched.size === 0) {
      // Swap back
      const tmp2 = grid[r1][c1];
      grid[r1][c1] = grid[r2][c2];
      grid[r2][c2] = tmp2;
      emit('invalidSwap', { r1, c1, r2, c2 });
      return false;
    }

    movesLeft--;
    combo = 0;
    emit('swap', { r1, c1, r2, c2 });
    return true;
  }

  /* --- Cascade loop (called after swap) --- */
  async function cascade() {
    let hadMatch = true;
    while (hadMatch) {
      hadMatch = processMatches();
      if (hadMatch) {
        await delay(300);
        applyGravity();
        emit('gridUpdate', { grid: cloneGrid(), score, moves: movesLeft });
        await delay(350);
      }
    }
    combo = 0;

    // Check win / lose
    if (score >= targetScore) {
      emit('levelComplete', { level, score, target: targetScore });
    } else if (movesLeft <= 0) {
      gameOver = true;
      emit('gameOver', { level, score, target: targetScore });
    } else {
      // Check if any moves possible
      if (!hasValidMoves()) {
        shuffleBoard();
        emit('shuffle', {});
        emit('gridUpdate', { grid: cloneGrid(), score, moves: movesLeft });
      }
      emit('idle', { score, moves: movesLeft });
    }
  }

  /* --- Valid move check --- */
  function hasValidMoves() {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        // Try swap right
        if (c < COLS - 1) {
          swapCells(r, c, r, c + 1);
          const { matched } = findAllMatches();
          swapCells(r, c, r, c + 1);
          if (matched.size > 0) return true;
        }
        // Try swap down
        if (r < ROWS - 1) {
          swapCells(r, c, r + 1, c);
          const { matched } = findAllMatches();
          swapCells(r, c, r + 1, c);
          if (matched.size > 0) return true;
        }
      }
    }
    return false;
  }

  function swapCells(r1, c1, r2, c2) {
    const tmp = grid[r1][c1];
    grid[r1][c1] = grid[r2][c2];
    grid[r2][c2] = tmp;
  }

  function shuffleBoard() {
    const allGems = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        allGems.push(grid[r][c]);
      }
    }
    // Fisher-Yates shuffle
    for (let i = allGems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allGems[i], allGems[j]] = [allGems[j], allGems[i]];
    }
    let idx = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        grid[r][c] = allGems[idx++];
      }
    }
    // If still no valid moves, recurse
    if (!hasValidMoves()) shuffleBoard();
  }

  /* --- Utility --- */
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function emit(event, data) {
    if (onUpdate) onUpdate(event, data);
  }

  function getState() {
    return {
      grid: cloneGrid(),
      score,
      moves: movesLeft,
      level,
      target: targetScore,
      gameOver,
      combo
    };
  }

  function nextLevel() {
    startLevel(level + 1);
  }

  function restart() {
    startLevel(level);
  }

  return {
    COLS,
    ROWS,
    GEM_TYPES,
    init,
    swap,
    cascade,
    getState,
    nextLevel,
    restart,
    startLevel
  };
})();
