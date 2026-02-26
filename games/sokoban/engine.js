/* Sokoban Engine — game state, movement, undo, win detection, localStorage */

window.SokobanEngine = (function () {
  const TILE = { VOID: -1, FLOOR: 0, WALL: 1, TARGET: 2, CRATE: 3, PLAYER: 4, CRATE_ON_TARGET: 5, PLAYER_ON_TARGET: 6 };
  const DIR = { UP: [0, -1], DOWN: [0, 1], LEFT: [-1, 0], RIGHT: [1, 0] };
  const STORAGE_KEY = 'sokoban-progress-v1';

  let state = null; // { level, map[][], playerX, playerY, moves, history[], crates[], targets[] }
  let onUpdate = null;
  let onWin = null;

  function loadProgress() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch { return {}; }
  }

  function saveProgress() {
    const prog = loadProgress();
    if (!prog[state.level]) prog[state.level] = {};
    prog[state.level].completed = true;
    prog[state.level].bestMoves = Math.min(prog[state.level].bestMoves || Infinity, state.moves);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prog));
  }

  function getLevelProgress(idx) {
    const prog = loadProgress();
    return prog[idx] || { completed: false, bestMoves: null };
  }

  function isCompleted(idx) {
    return getLevelProgress(idx).completed;
  }

  function deepCopyMap(map) {
    return map.map(row => [...row]);
  }

  function initLevel(levelIdx) {
    const levelData = window.SokobanLevels[levelIdx];
    if (!levelData) return false;

    const map = deepCopyMap(levelData.map);
    let playerX = 0, playerY = 0;
    const crates = [];
    const targets = [];

    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        const t = map[y][x];
        if (t === TILE.PLAYER || t === TILE.PLAYER_ON_TARGET) {
          playerX = x;
          playerY = y;
          map[y][x] = t === TILE.PLAYER_ON_TARGET ? TILE.TARGET : TILE.FLOOR;
        }
        if (t === TILE.CRATE) {
          crates.push({ x, y });
          map[y][x] = TILE.FLOOR;
        }
        if (t === TILE.CRATE_ON_TARGET) {
          crates.push({ x, y });
          map[y][x] = TILE.TARGET;
        }
        if (t === TILE.TARGET) {
          targets.push({ x, y });
        }
      }
    }

    // Also add targets that were found under crate_on_target
    // targets already collected from TARGET tiles; CRATE_ON_TARGET tiles are now TARGET
    // Re-scan for targets after processing
    targets.length = 0;
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] === TILE.TARGET) targets.push({ x, y });
      }
    }

    state = {
      level: levelIdx,
      baseMap: map, // floor/wall/target only
      playerX,
      playerY,
      moves: 0,
      history: [],
      crates,
      targets,
      par: levelData.par,
      name: levelData.name,
      width: map[0] ? map[0].length : 0,
      height: map.length,
      won: false
    };

    if (onUpdate) onUpdate(state, null);
    return true;
  }

  function getCrateAt(x, y) {
    return state.crates.find(c => c.x === x && c.y === y);
  }

  function isWall(x, y) {
    if (y < 0 || y >= state.height || x < 0 || x >= state.baseMap[y].length) return true;
    return state.baseMap[y][x] === TILE.WALL;
  }

  function isVoid(x, y) {
    if (y < 0 || y >= state.height || x < 0 || x >= state.baseMap[y].length) return true;
    return state.baseMap[y][x] === TILE.VOID;
  }

  function isBlocked(x, y) {
    return isWall(x, y) || isVoid(x, y) || !!getCrateAt(x, y);
  }

  function move(dirName) {
    if (state.won) return null;
    const [dx, dy] = DIR[dirName];
    if (!dx && !dy) return null;

    const nx = state.playerX + dx;
    const ny = state.playerY + dy;

    if (isWall(nx, ny) || isVoid(nx, ny)) return null;

    const crate = getCrateAt(nx, ny);
    if (crate) {
      const cx = nx + dx;
      const cy = ny + dy;
      if (isBlocked(cx, cy)) return null;

      // Push crate
      const moveData = {
        playerFrom: { x: state.playerX, y: state.playerY },
        playerTo: { x: nx, y: ny },
        crateFrom: { x: crate.x, y: crate.y },
        crateTo: { x: cx, y: cy },
        pushed: true
      };

      state.history.push(moveData);
      crate.x = cx;
      crate.y = cy;
      state.playerX = nx;
      state.playerY = ny;
      state.moves++;

      checkWin();
      if (onUpdate) onUpdate(state, moveData);
      return moveData;
    }

    // Simple move
    const moveData = {
      playerFrom: { x: state.playerX, y: state.playerY },
      playerTo: { x: nx, y: ny },
      pushed: false
    };

    state.history.push(moveData);
    state.playerX = nx;
    state.playerY = ny;
    state.moves++;

    if (onUpdate) onUpdate(state, moveData);
    return moveData;
  }

  function undo() {
    if (state.won || state.history.length === 0) return false;
    const last = state.history.pop();

    state.playerX = last.playerFrom.x;
    state.playerY = last.playerFrom.y;
    state.moves--;

    if (last.pushed) {
      const crate = getCrateAt(last.crateTo.x, last.crateTo.y);
      if (crate) {
        crate.x = last.crateFrom.x;
        crate.y = last.crateFrom.y;
      }
    }

    if (onUpdate) onUpdate(state, null);
    return true;
  }

  function reset() {
    initLevel(state.level);
  }

  function checkWin() {
    const allOnTarget = state.targets.every(t =>
      state.crates.some(c => c.x === t.x && c.y === t.y)
    );
    if (allOnTarget && state.targets.length > 0) {
      state.won = true;
      saveProgress();
      if (onWin) onWin(state);
    }
  }

  function getState() { return state; }

  function setCallbacks(update, win) {
    onUpdate = update;
    onWin = win;
  }

  function getFullMap() {
    // Build a readable map with all entities placed
    const map = deepCopyMap(state.baseMap);
    for (const c of state.crates) {
      map[c.y][c.x] = map[c.y][c.x] === TILE.TARGET ? TILE.CRATE_ON_TARGET : TILE.CRATE;
    }
    const py = state.playerY, px = state.playerX;
    map[py][px] = map[py][px] === TILE.TARGET ? TILE.PLAYER_ON_TARGET : TILE.PLAYER;
    return map;
  }

  return {
    TILE, DIR, initLevel, move, undo, reset, getState, getFullMap,
    setCallbacks, isCompleted, getLevelProgress, loadProgress
  };
})();
