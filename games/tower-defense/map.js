/**
 * Arcane Bastion — Map Module
 *
 * Grid-based map system for the tower defense game.
 * Handles map layout, A* pathfinding, cell management, and all map rendering.
 *
 * Public API: window.ArcaneMap
 */
(function() {
  'use strict';

  // ───────────────────────── Constants ─────────────────────────
  const CELL_SIZE = 48;
  const MAP_COLS  = 25;
  const MAP_ROWS  = 16;
  const MAP_W     = MAP_COLS * CELL_SIZE; // 1200
  const MAP_H     = MAP_ROWS * CELL_SIZE; // 768

  // Cell type enum strings
  const TYPE_PATH    = 'path';
  const TYPE_BUILD   = 'build';
  const TYPE_BLOCKED = 'blocked';
  const TYPE_NEXUS   = 'nexus';
  const TYPE_SPAWN   = 'spawn';

  // ───────────────────────── State ─────────────────────────────
  let grid = [];          // 2D array [row][col]
  let cachedPaths = [];   // Precomputed waypoint arrays per spawn
  let spawnCells = [];    // {col, row} for each spawn point
  let nexusCell = null;   // {col, row}
  let animTime = 0;       // Updated each draw() call
  let spawnParticles = []; // Persistent spawn portal particles

  // ───────────────────────── Nexus Object ──────────────────────
  const nexus = {
    col: 12, row: 8,
    hp: 100, maxHp: 100,
    x: 0, y: 0
  };

  // ─────────────────────── Map 1 Layout ────────────────────────
  //
  // Legend used in the template below:
  //   '.' = build       'P' = path       '#' = blocked
  //   'N' = nexus       'S' = spawn
  //
  // The map has 4 spawn portals (top, bottom, left, right) with
  // winding paths that converge on the central nexus crystal.
  // Blocked cells add visual variety (rocks, water, ruins).

  const MAP_TEMPLATE = [
    // Row 0  (top edge)
    '####.....##S##.....####',
    // Row 1
    '##...... .PPP. ......##',
    // Row 2
    '#.......  .P.  .......#',
    // Row 3
    '.........PPPP..........',
    // Row 4
    '....#..PP....PP..#.....',
    // Row 5
    '....#.PP......PP.#.....',
    // Row 6
    '...#..P.........P..#...',
    // Row 7
    'SPPPPPP....N....PPPPPP#',
    // Row 8
    'SPPPPPP...NNN...PPPPPPS',
    // Row 9
    '#PPPPPP....N....PPPPPPS',
    // Row 10
    '...#..P.........P..#...',
    // Row 11
    '....#.PP......PP.#.....',
    // Row 12
    '....#..PP....PP..#.....',
    // Row 13
    '..........PPPP..........',
    // Row 14
    '#.......  .P.  .......#',
    // Row 15
    '##...... .PPP. ......##',
  ];

  // Since the hand-drawn template above is tricky to keep aligned at
  // exactly 25 columns, we build the grid programmatically instead.
  // This guarantees correct dimensions and a well-balanced layout.

  function buildMap1() {
    grid = [];
    spawnCells = [];

    for (let r = 0; r < MAP_ROWS; r++) {
      grid[r] = [];
      for (let c = 0; c < MAP_COLS; c++) {
        grid[r][c] = makeCell(TYPE_BUILD);
      }
    }

    // Helper to set cell type
    function set(r, c, type) {
      if (r >= 0 && r < MAP_ROWS && c >= 0 && c < MAP_COLS) {
        grid[r][c] = makeCell(type);
      }
    }

    // Helper to set a horizontal run of path cells
    function hPath(row, c1, c2) {
      const lo = Math.min(c1, c2), hi = Math.max(c1, c2);
      for (let c = lo; c <= hi; c++) set(row, c, TYPE_PATH);
    }

    // Helper to set a vertical run of path cells
    function vPath(col, r1, r2) {
      const lo = Math.min(r1, r2), hi = Math.max(r1, r2);
      for (let r = lo; r <= hi; r++) set(r, col, TYPE_PATH);
    }

    // ── Nexus (3x3 block centered at col 12, row 8) ──
    nexusCell = { col: 12, row: 8 };
    // We use a single nexus cell but draw it large
    set(7, 12, TYPE_NEXUS);
    set(8, 12, TYPE_NEXUS);
    set(8, 11, TYPE_NEXUS);
    set(8, 13, TYPE_NEXUS);

    nexus.col = 12;
    nexus.row = 8;
    nexus.x = 12 * CELL_SIZE + CELL_SIZE / 2;
    nexus.y = 8 * CELL_SIZE + CELL_SIZE / 2;

    // ── Spawn 0: TOP (col 12, row 0) ──
    set(0, 12, TYPE_SPAWN);
    spawnCells.push({ col: 12, row: 0 });

    // Path from top spawn down to nexus — S-curve
    vPath(12, 1, 3);       // straight down
    hPath(3, 12, 15);      // jog right
    vPath(15, 3, 5);       // down
    hPath(5, 15, 10);      // jog left
    vPath(10, 5, 7);       // down toward nexus
    hPath(7, 10, 11);      // connect to nexus row

    // ── Spawn 1: BOTTOM (col 12, row 15) ──
    set(15, 12, TYPE_SPAWN);
    spawnCells.push({ col: 12, row: 15 });

    // Path from bottom spawn up to nexus — S-curve (mirrors top)
    vPath(12, 12, 14);     // straight up from row 15
    hPath(12, 12, 9);      // jog left
    vPath(9, 10, 12);      // up
    hPath(10, 9, 14);      // jog right
    vPath(14, 9, 10);      // up toward nexus
    hPath(9, 13, 14);      // connect to nexus row

    // ── Spawn 2: LEFT (col 0, row 8) ──
    set(8, 0, TYPE_SPAWN);
    spawnCells.push({ col: 0, row: 8 });

    // Path from left spawn to nexus — winding
    hPath(8, 1, 3);        // straight right
    vPath(3, 8, 11);       // jog down
    hPath(11, 3, 6);       // right
    vPath(6, 8, 11);       // up
    hPath(8, 6, 11);       // connect to nexus

    // ── Spawn 3: RIGHT (col 24, row 8) ──
    set(8, 24, TYPE_SPAWN);
    spawnCells.push({ col: 24, row: 8 });

    // Path from right spawn to nexus — winding (mirrors left)
    hPath(8, 21, 23);      // straight left
    vPath(21, 5, 8);       // jog up
    hPath(5, 18, 21);      // left
    vPath(18, 5, 8);       // down
    hPath(8, 13, 18);      // connect to nexus

    // ── Blocked / decorative areas (rocks, water, ruins) ──
    // Clusters of blocked cells scattered in corners and between paths

    // Top-left rocky cluster
    const blockedTopLeft = [
      [0,0],[0,1],[0,2],[0,3],[1,0],[1,1],[2,0],
      [0,22],[0,23],[0,24],[1,23],[1,24],[2,24],
    ];
    // Bottom corners
    const blockedBottomLeft = [
      [15,0],[15,1],[15,2],[14,0],[14,1],[13,0],
      [15,22],[15,23],[15,24],[14,23],[14,24],[13,24],
    ];
    // Water / ruin patches between paths
    const blockedMiddle = [
      // Left interior patch
      [5,4],[5,5],[6,4],
      [10,4],[10,5],[11,4],
      // Right interior patch
      [5,19],[5,20],[6,20],
      [10,19],[10,20],[11,20],
      // Small rocks near nexus
      [6,11],[6,13],
      [10,11],[10,13],
    ];

    [...blockedTopLeft, ...blockedBottomLeft, ...blockedMiddle].forEach(([r,c]) => {
      // Don't overwrite paths, spawns, or nexus
      if (grid[r] && grid[r][c] && grid[r][c].type === TYPE_BUILD) {
        set(r, c, TYPE_BLOCKED);
      }
    });

    // Top/bottom edge blocked for walls
    for (let c = 0; c < MAP_COLS; c++) {
      if (grid[0][c].type === TYPE_BUILD) set(0, c, TYPE_BLOCKED);
      if (grid[15][c].type === TYPE_BUILD) set(15, c, TYPE_BLOCKED);
    }
    // Left/right edge blocked
    for (let r = 0; r < MAP_ROWS; r++) {
      if (grid[r][0].type === TYPE_BUILD) set(r, 0, TYPE_BLOCKED);
      if (grid[r][24].type === TYPE_BUILD) set(r, 24, TYPE_BLOCKED);
    }

    // Initialize spawn portal particles
    initSpawnParticles();
  }

  function makeCell(type) {
    return {
      type: type,
      tower: null,
      walkable: type === TYPE_PATH || type === TYPE_SPAWN || type === TYPE_NEXUS,
      buildable: type === TYPE_BUILD
    };
  }

  // ───────────────── Spawn Portal Particles ────────────────────

  function initSpawnParticles() {
    spawnParticles = [];
    spawnCells.forEach((sp, idx) => {
      for (let i = 0; i < 12; i++) {
        spawnParticles.push({
          spawnIdx: idx,
          angle: Math.random() * Math.PI * 2,
          radius: 8 + Math.random() * 16,
          speed: 0.5 + Math.random() * 1.5,
          size: 1 + Math.random() * 2.5,
          phase: Math.random() * Math.PI * 2
        });
      }
    });
  }

  // ──────────────── Coordinate Conversion ──────────────────────

  function worldToGrid(x, y) {
    return {
      col: Math.floor(x / CELL_SIZE),
      row: Math.floor(y / CELL_SIZE)
    };
  }

  function gridToWorld(col, row) {
    return {
      x: col * CELL_SIZE + CELL_SIZE / 2,
      y: row * CELL_SIZE + CELL_SIZE / 2
    };
  }

  // ──────────────── Placement Validation ───────────────────────

  function canBuild(col, row) {
    if (col < 0 || col >= MAP_COLS || row < 0 || row >= MAP_ROWS) return false;
    const cell = grid[row][col];
    return cell.type === TYPE_BUILD && cell.tower === null;
  }

  function placeTower(col, row, towerType) {
    if (!canBuild(col, row)) return null;
    const cell = grid[row][col];
    cell.tower = towerType;
    cell.buildable = false;
    const pos = gridToWorld(col, row);
    return { col, row, x: pos.x, y: pos.y };
  }

  function removeTower(col, row) {
    if (col < 0 || col >= MAP_COLS || row < 0 || row >= MAP_ROWS) return false;
    const cell = grid[row][col];
    if (cell.type !== TYPE_BUILD || cell.tower === null) return false;
    cell.tower = null;
    cell.buildable = true;
    return true;
  }

  // ──────────────────── A* Pathfinding ─────────────────────────
  //
  // Since towers are only placed on 'build' cells and never on paths,
  // paths are static. We precompute them once on init and cache them.
  // The A* still supports recomputation if needed in the future.

  function aStar(startCol, startRow, goalCol, goalRow) {
    const key = (c, r) => r * MAP_COLS + c;

    // Open set as a simple sorted array (sufficient for our small grid)
    const open = [];
    const closed = new Set();
    const gScore = {};
    const fScore = {};
    const cameFrom = {};

    const startKey = key(startCol, startRow);
    gScore[startKey] = 0;
    fScore[startKey] = heuristic(startCol, startRow, goalCol, goalRow);
    open.push({ col: startCol, row: startRow, f: fScore[startKey] });

    while (open.length > 0) {
      // Pop lowest f-score node
      open.sort((a, b) => a.f - b.f);
      const current = open.shift();
      const ck = key(current.col, current.row);

      if (current.col === goalCol && current.row === goalRow) {
        return reconstructPath(cameFrom, current.col, current.row);
      }

      closed.add(ck);

      // 4-directional neighbors
      const neighbors = [
        { col: current.col - 1, row: current.row },
        { col: current.col + 1, row: current.row },
        { col: current.col, row: current.row - 1 },
        { col: current.col, row: current.row + 1 },
      ];

      for (const nb of neighbors) {
        if (nb.col < 0 || nb.col >= MAP_COLS || nb.row < 0 || nb.row >= MAP_ROWS) continue;

        const cell = grid[nb.row][nb.col];
        if (!cell.walkable) continue;

        const nk = key(nb.col, nb.row);
        if (closed.has(nk)) continue;

        const tentG = gScore[ck] + 1;
        if (tentG < (gScore[nk] ?? Infinity)) {
          cameFrom[nk] = ck;
          gScore[nk] = tentG;
          fScore[nk] = tentG + heuristic(nb.col, nb.row, goalCol, goalRow);

          if (!open.some(n => key(n.col, n.row) === nk)) {
            open.push({ col: nb.col, row: nb.row, f: fScore[nk] });
          }
        }
      }
    }

    // No path found — return empty
    return [];
  }

  function heuristic(c1, r1, c2, r2) {
    // Manhattan distance
    return Math.abs(c1 - c2) + Math.abs(r1 - r2);
  }

  function reconstructPath(cameFrom, goalCol, goalRow) {
    const path = [];
    let ck = goalRow * MAP_COLS + goalCol;
    while (ck !== undefined) {
      const r = Math.floor(ck / MAP_COLS);
      const c = ck % MAP_COLS;
      const world = gridToWorld(c, r);
      path.unshift(world);
      ck = cameFrom[ck];
    }
    return path;
  }

  /**
   * Get cached path from a spawn index to the nexus.
   * Returns array of {x, y} world-coordinate waypoints.
   */
  function getPath(spawnIndex) {
    if (spawnIndex < 0 || spawnIndex >= cachedPaths.length) return [];
    return cachedPaths[spawnIndex];
  }

  function computeAllPaths() {
    cachedPaths = [];
    for (const sp of spawnCells) {
      const path = aStar(sp.col, sp.row, nexus.col, nexus.row);
      cachedPaths.push(path);
    }
  }

  // ────────────────────── Drawing ──────────────────────────────

  // Pre-generate a subtle stone texture pattern (offscreen canvas)
  let stonePattern = null;
  let pathPattern = null;

  function createPatterns() {
    // Dark stone floor pattern
    const sc = document.createElement('canvas');
    sc.width = 48; sc.height = 48;
    const sctx = sc.getContext('2d');

    // Base dark stone
    sctx.fillStyle = '#1a1520';
    sctx.fillRect(0, 0, 48, 48);

    // Subtle tile lines
    sctx.strokeStyle = 'rgba(255,255,255,0.04)';
    sctx.lineWidth = 1;
    sctx.strokeRect(0.5, 0.5, 47, 47);

    // Random subtle color variation (stone grain)
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * 48;
      const y = Math.random() * 48;
      const s = 1 + Math.random() * 3;
      const a = 0.02 + Math.random() * 0.04;
      sctx.fillStyle = `rgba(${Math.random() > 0.5 ? 180 : 60}, ${Math.random() > 0.5 ? 140 : 50}, ${Math.random() > 0.5 ? 200 : 80}, ${a})`;
      sctx.fillRect(x, y, s, s);
    }

    stonePattern = sc;

    // Path texture
    const pc = document.createElement('canvas');
    pc.width = 48; pc.height = 48;
    const pctx = pc.getContext('2d');

    pctx.fillStyle = '#2e2520';
    pctx.fillRect(0, 0, 48, 48);

    // Worn stone texture
    pctx.strokeStyle = 'rgba(200, 170, 100, 0.08)';
    pctx.lineWidth = 1;
    pctx.strokeRect(1.5, 1.5, 45, 45);

    // Subtle cracks and grain
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * 48;
      const y = Math.random() * 48;
      const s = 1 + Math.random() * 2;
      pctx.fillStyle = `rgba(180, 150, 90, ${0.03 + Math.random() * 0.05})`;
      pctx.fillRect(x, y, s, s);
    }

    pathPattern = pc;
  }

  /**
   * Main map draw function.
   * ctx.translate(-cam.x, -cam.y) is already applied before this call.
   */
  function draw(ctx, cam, time) {
    animTime = time || 0;

    if (!stonePattern) createPatterns();

    const t = animTime / 1000; // seconds

    // Determine visible cell range for culling
    const startCol = Math.max(0, Math.floor(cam.x / CELL_SIZE));
    const startRow = Math.max(0, Math.floor(cam.y / CELL_SIZE));
    const endCol   = Math.min(MAP_COLS - 1, Math.floor((cam.x + (cam.w || MAP_W)) / CELL_SIZE));
    const endRow   = Math.min(MAP_ROWS - 1, Math.floor((cam.y + (cam.h || MAP_H)) / CELL_SIZE));

    // ── Layer 1: Floor tiles ──
    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        const cell = grid[r][c];
        const x = c * CELL_SIZE;
        const y = r * CELL_SIZE;

        switch (cell.type) {
          case TYPE_BLOCKED:
            drawBlockedCell(ctx, x, y, c, r, t);
            break;
          case TYPE_BUILD:
            drawBuildCell(ctx, x, y, c, r, t, cell);
            break;
          case TYPE_PATH:
            drawPathCell(ctx, x, y, c, r, t);
            break;
          case TYPE_SPAWN:
            drawPathCell(ctx, x, y, c, r, t); // base is path
            break;
          case TYPE_NEXUS:
            drawPathCell(ctx, x, y, c, r, t); // base is path, nexus drawn on top
            break;
        }
      }
    }

    // ── Layer 2: Path border glow ──
    ctx.save();
    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        if (grid[r][c].type === TYPE_PATH || grid[r][c].type === TYPE_SPAWN) {
          drawPathGlow(ctx, c, r, t);
        }
      }
    }
    ctx.restore();

    // ── Layer 3: Nexus crystal ──
    drawNexusCrystal(ctx, t);

    // ── Layer 4: Spawn portals ──
    for (let i = 0; i < spawnCells.length; i++) {
      drawSpawnPortal(ctx, spawnCells[i], i, t);
    }
  }

  // ── Cell Drawing Helpers ──

  function drawBlockedCell(ctx, x, y, col, row, t) {
    // Dark stone base
    ctx.drawImage(stonePattern, x, y);

    // Darken further
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);

    // Decorative rocks — deterministic from position
    const seed = (col * 31 + row * 17) % 100;

    if (seed < 40) {
      // Rock formation
      ctx.fillStyle = '#0f0c14';
      const rx = x + 8 + (seed % 12);
      const ry = y + 8 + ((seed * 3) % 12);
      ctx.beginPath();
      ctx.ellipse(rx + 12, ry + 10, 10 + (seed % 6), 7 + (seed % 5), 0, 0, Math.PI * 2);
      ctx.fill();
      // Highlight
      ctx.fillStyle = 'rgba(80, 60, 100, 0.3)';
      ctx.beginPath();
      ctx.ellipse(rx + 10, ry + 7, 6, 3, -0.3, 0, Math.PI * 2);
      ctx.fill();
    } else if (seed < 60) {
      // Water puddle
      const pulse = Math.sin(t * 1.5 + seed) * 0.1 + 0.4;
      ctx.fillStyle = `rgba(30, 50, 90, ${pulse})`;
      ctx.beginPath();
      ctx.ellipse(x + 24, y + 24, 14, 10, seed * 0.1, 0, Math.PI * 2);
      ctx.fill();
      // Shimmer highlight
      ctx.fillStyle = `rgba(80, 120, 200, ${pulse * 0.4})`;
      ctx.beginPath();
      ctx.ellipse(x + 20, y + 20, 5, 3, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Cracks in stone
      ctx.strokeStyle = 'rgba(40, 30, 50, 0.6)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + 10, y + 5);
      ctx.lineTo(x + 24 + (seed % 10), y + 20);
      ctx.lineTo(x + 38, y + 40);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + 24 + (seed % 10), y + 20);
      ctx.lineTo(x + 14, y + 36);
      ctx.stroke();
    }
  }

  function drawBuildCell(ctx, x, y, col, row, t, cell) {
    // Slightly lighter stone
    ctx.drawImage(stonePattern, x, y);

    // Lighter tint for buildable
    ctx.fillStyle = 'rgba(60, 50, 80, 0.15)';
    ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);

    // Faint grid lines to show buildable zone
    ctx.strokeStyle = 'rgba(120, 100, 160, 0.1)';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(x + 2, y + 2, CELL_SIZE - 4, CELL_SIZE - 4);

    // Corner markers
    const cm = 5;
    ctx.strokeStyle = 'rgba(120, 100, 160, 0.15)';
    ctx.lineWidth = 1;
    // Top-left
    ctx.beginPath();
    ctx.moveTo(x + 2, y + 2 + cm); ctx.lineTo(x + 2, y + 2); ctx.lineTo(x + 2 + cm, y + 2);
    ctx.stroke();
    // Top-right
    ctx.beginPath();
    ctx.moveTo(x + CELL_SIZE - 2 - cm, y + 2); ctx.lineTo(x + CELL_SIZE - 2, y + 2); ctx.lineTo(x + CELL_SIZE - 2, y + 2 + cm);
    ctx.stroke();
    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(x + 2, y + CELL_SIZE - 2 - cm); ctx.lineTo(x + 2, y + CELL_SIZE - 2); ctx.lineTo(x + 2 + cm, y + CELL_SIZE - 2);
    ctx.stroke();
    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(x + CELL_SIZE - 2 - cm, y + CELL_SIZE - 2); ctx.lineTo(x + CELL_SIZE - 2, y + CELL_SIZE - 2); ctx.lineTo(x + CELL_SIZE - 2, y + CELL_SIZE - 2 - cm);
    ctx.stroke();

    // If cell has a tower, don't draw the build markers (tower draws itself)
  }

  function drawPathCell(ctx, x, y, col, row, t) {
    // Worn stone path
    ctx.drawImage(pathPattern, x, y);

    // Subtle warmth
    ctx.fillStyle = 'rgba(180, 140, 60, 0.04)';
    ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
  }

  function drawPathGlow(ctx, col, row, t) {
    // Only draw glow on edges adjacent to non-path cells
    const x = col * CELL_SIZE;
    const y = row * CELL_SIZE;

    const pulse = 0.3 + Math.sin(t * 2 + col * 0.5 + row * 0.3) * 0.1;

    // Check each neighbor — draw glow border on sides adjacent to non-path
    const dirs = [
      { dc: -1, dr: 0, x1: x, y1: y, x2: x, y2: y + CELL_SIZE },      // left
      { dc: 1, dr: 0, x1: x + CELL_SIZE, y1: y, x2: x + CELL_SIZE, y2: y + CELL_SIZE }, // right
      { dc: 0, dr: -1, x1: x, y1: y, x2: x + CELL_SIZE, y2: y },       // top
      { dc: 0, dr: 1, x1: x, y1: y + CELL_SIZE, x2: x + CELL_SIZE, y2: y + CELL_SIZE }, // bottom
    ];

    for (const d of dirs) {
      const nc = col + d.dc;
      const nr = row + d.dr;
      if (nc < 0 || nc >= MAP_COLS || nr < 0 || nr >= MAP_ROWS) continue;
      const neighbor = grid[nr][nc];
      if (neighbor.type !== TYPE_PATH && neighbor.type !== TYPE_SPAWN && neighbor.type !== TYPE_NEXUS) {
        ctx.save();
        ctx.strokeStyle = `rgba(210, 170, 60, ${pulse})`;
        ctx.shadowColor = 'rgba(210, 170, 60, 0.5)';
        ctx.shadowBlur = 6;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(d.x1, d.y1);
        ctx.lineTo(d.x2, d.y2);
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  // ── Nexus Crystal Drawing ──

  function drawNexusCrystal(ctx, t) {
    const cx = nexus.x;
    const cy = nexus.y;
    const pulse = Math.sin(t * 2) * 0.2 + 0.8;
    const slowPulse = Math.sin(t * 0.8) * 0.15 + 0.85;

    ctx.save();

    // Outer glow — large diffuse
    const outerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, CELL_SIZE * 2.5);
    outerGlow.addColorStop(0, `rgba(120, 80, 220, ${0.25 * slowPulse})`);
    outerGlow.addColorStop(0.4, `rgba(80, 40, 180, ${0.12 * slowPulse})`);
    outerGlow.addColorStop(1, 'rgba(80, 40, 180, 0)');
    ctx.fillStyle = outerGlow;
    ctx.fillRect(cx - CELL_SIZE * 3, cy - CELL_SIZE * 3, CELL_SIZE * 6, CELL_SIZE * 6);

    // Middle glow ring
    const midGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, CELL_SIZE * 1.5);
    midGlow.addColorStop(0, `rgba(160, 120, 255, ${0.3 * pulse})`);
    midGlow.addColorStop(0.5, `rgba(120, 60, 230, ${0.15 * pulse})`);
    midGlow.addColorStop(1, 'rgba(100, 40, 200, 0)');
    ctx.fillStyle = midGlow;
    ctx.fillRect(cx - CELL_SIZE * 2, cy - CELL_SIZE * 2, CELL_SIZE * 4, CELL_SIZE * 4);

    // Crystal body — main diamond shape
    ctx.shadowColor = 'rgba(150, 100, 255, 0.8)';
    ctx.shadowBlur = 20 * pulse;

    const crystalH = 32 * slowPulse;
    const crystalW = 18;

    // Back facet (darker)
    ctx.fillStyle = 'rgba(60, 30, 120, 0.9)';
    ctx.beginPath();
    ctx.moveTo(cx, cy - crystalH);
    ctx.lineTo(cx + crystalW, cy);
    ctx.lineTo(cx, cy + crystalH * 0.4);
    ctx.lineTo(cx - crystalW, cy);
    ctx.closePath();
    ctx.fill();

    // Front left facet
    const leftGrad = ctx.createLinearGradient(cx - crystalW, cy, cx, cy - crystalH);
    leftGrad.addColorStop(0, 'rgba(100, 60, 200, 0.9)');
    leftGrad.addColorStop(1, 'rgba(180, 140, 255, 0.95)');
    ctx.fillStyle = leftGrad;
    ctx.beginPath();
    ctx.moveTo(cx, cy - crystalH);
    ctx.lineTo(cx - crystalW, cy);
    ctx.lineTo(cx, cy + crystalH * 0.4);
    ctx.closePath();
    ctx.fill();

    // Front right facet
    const rightGrad = ctx.createLinearGradient(cx + crystalW, cy, cx, cy - crystalH);
    rightGrad.addColorStop(0, 'rgba(80, 50, 180, 0.9)');
    rightGrad.addColorStop(1, 'rgba(200, 160, 255, 0.95)');
    ctx.fillStyle = rightGrad;
    ctx.beginPath();
    ctx.moveTo(cx, cy - crystalH);
    ctx.lineTo(cx + crystalW, cy);
    ctx.lineTo(cx, cy + crystalH * 0.4);
    ctx.closePath();
    ctx.fill();

    // Inner highlight
    ctx.fillStyle = `rgba(220, 200, 255, ${0.3 * pulse})`;
    ctx.beginPath();
    ctx.moveTo(cx, cy - crystalH * 0.6);
    ctx.lineTo(cx - 6, cy - 4);
    ctx.lineTo(cx, cy + 4);
    ctx.lineTo(cx + 6, cy - 4);
    ctx.closePath();
    ctx.fill();

    // Bright core point
    ctx.shadowBlur = 30 * pulse;
    ctx.shadowColor = 'rgba(200, 180, 255, 1)';
    ctx.fillStyle = `rgba(255, 240, 255, ${0.6 + pulse * 0.4})`;
    ctx.beginPath();
    ctx.arc(cx, cy - 6, 3 * pulse, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;

    // Sparkle particles orbiting the crystal
    for (let i = 0; i < 8; i++) {
      const angle = t * (0.8 + i * 0.15) + i * (Math.PI * 2 / 8);
      const dist = 20 + Math.sin(t * 2 + i) * 10;
      const px = cx + Math.cos(angle) * dist;
      const py = cy + Math.sin(angle) * dist * 0.6 - 4;
      const alpha = 0.3 + Math.sin(t * 3 + i * 1.2) * 0.3;
      const size = 1 + Math.sin(t * 4 + i) * 0.8;

      ctx.fillStyle = `rgba(200, 180, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Rising motes
    for (let i = 0; i < 5; i++) {
      const phase = (t * 0.6 + i * 1.3) % 3;
      const moX = cx + Math.sin(t * 0.5 + i * 2) * 15;
      const moY = cy - phase * 20;
      const alpha = Math.max(0, 0.5 - phase * 0.17);

      ctx.fillStyle = `rgba(180, 150, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(moX, moY, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // ── Spawn Portal Drawing ──

  function drawSpawnPortal(ctx, spawn, index, t) {
    const cx = spawn.col * CELL_SIZE + CELL_SIZE / 2;
    const cy = spawn.row * CELL_SIZE + CELL_SIZE / 2;

    ctx.save();

    // Ominous glow
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, CELL_SIZE * 1.5);
    const pulseA = 0.25 + Math.sin(t * 2.5 + index) * 0.1;
    glow.addColorStop(0, `rgba(200, 50, 50, ${pulseA})`);
    glow.addColorStop(0.5, `rgba(150, 20, 60, ${pulseA * 0.5})`);
    glow.addColorStop(1, 'rgba(100, 10, 30, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(cx - CELL_SIZE * 2, cy - CELL_SIZE * 2, CELL_SIZE * 4, CELL_SIZE * 4);

    // Swirling ring
    ctx.strokeStyle = `rgba(220, 60, 60, ${0.4 + Math.sin(t * 3 + index) * 0.15})`;
    ctx.lineWidth = 2;
    ctx.shadowColor = 'rgba(220, 60, 60, 0.6)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(cx, cy, 16, 0, Math.PI * 2);
    ctx.stroke();

    // Inner swirl arcs
    for (let i = 0; i < 3; i++) {
      const startAngle = t * (1.5 + i * 0.3) + i * (Math.PI * 2 / 3);
      const alpha = 0.3 + Math.sin(t * 2 + i) * 0.15;
      ctx.strokeStyle = `rgba(255, 100, 80, ${alpha})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, 10 + i * 3, startAngle, startAngle + Math.PI * 0.8);
      ctx.stroke();
    }

    ctx.shadowBlur = 0;

    // Portal particles
    const myParticles = spawnParticles.filter(p => p.spawnIdx === index);
    for (const p of myParticles) {
      const a = p.angle + t * p.speed;
      const r = p.radius + Math.sin(t * 2 + p.phase) * 4;
      const px = cx + Math.cos(a) * r;
      const py = cy + Math.sin(a) * r;
      const alpha = 0.3 + Math.sin(t * 3 + p.phase) * 0.25;

      ctx.fillStyle = `rgba(255, 80, 60, ${alpha})`;
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Center bright spot
    ctx.fillStyle = `rgba(255, 120, 80, ${0.4 + Math.sin(t * 4 + index * 2) * 0.2})`;
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // ── Build Highlight (placement mode hover) ──

  function drawBuildHighlight(ctx, cam, col, row, valid) {
    const x = col * CELL_SIZE;
    const y = row * CELL_SIZE;
    const t = animTime / 1000;
    const pulse = 0.3 + Math.sin(t * 5) * 0.15;

    ctx.save();

    if (valid) {
      // Green highlight — can build here
      ctx.fillStyle = `rgba(50, 200, 80, ${pulse})`;
      ctx.fillRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2);

      ctx.strokeStyle = `rgba(80, 255, 120, ${pulse + 0.2})`;
      ctx.shadowColor = 'rgba(80, 255, 120, 0.4)';
      ctx.shadowBlur = 8;
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 2, y + 2, CELL_SIZE - 4, CELL_SIZE - 4);
    } else {
      // Red highlight — cannot build here
      ctx.fillStyle = `rgba(200, 50, 50, ${pulse})`;
      ctx.fillRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2);

      ctx.strokeStyle = `rgba(255, 80, 80, ${pulse + 0.2})`;
      ctx.shadowColor = 'rgba(255, 80, 80, 0.4)';
      ctx.shadowBlur = 8;
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 2, y + 2, CELL_SIZE - 4, CELL_SIZE - 4);

      // X mark
      ctx.strokeStyle = `rgba(255, 80, 80, ${pulse + 0.1})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + 10, y + 10);
      ctx.lineTo(x + CELL_SIZE - 10, y + CELL_SIZE - 10);
      ctx.moveTo(x + CELL_SIZE - 10, y + 10);
      ctx.lineTo(x + 10, y + CELL_SIZE - 10);
      ctx.stroke();
    }

    ctx.restore();
  }

  // ── Nexus HP Bar ──

  function drawNexusHP(ctx, cam, nexusObj) {
    const hp = nexusObj || nexus;
    const cx = nexus.x;
    const cy = nexus.y;

    const barW = 60;
    const barH = 8;
    const barX = cx - barW / 2;
    const barY = cy - 52; // above the crystal

    const ratio = Math.max(0, hp.hp / hp.maxHp);

    ctx.save();

    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.beginPath();
    ctx.roundRect(barX - 1, barY - 1, barW + 2, barH + 2, 3);
    ctx.fill();

    // HP fill — gradient from green to red based on HP
    const r = Math.floor(255 * (1 - ratio));
    const g = Math.floor(200 * ratio);
    const hpGrad = ctx.createLinearGradient(barX, barY, barX + barW * ratio, barY);
    hpGrad.addColorStop(0, `rgba(${r}, ${g}, 60, 0.9)`);
    hpGrad.addColorStop(1, `rgba(${Math.min(255, r + 30)}, ${Math.max(0, g - 20)}, 40, 0.9)`);
    ctx.fillStyle = hpGrad;
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW * ratio, barH, 2);
    ctx.fill();

    // Highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(barX + 1, barY + 1, barW * ratio - 2, barH / 2 - 1);

    // Border
    ctx.strokeStyle = 'rgba(160, 140, 200, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(barX - 1, barY - 1, barW + 2, barH + 2, 3);
    ctx.stroke();

    // HP text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.ceil(hp.hp)}/${hp.maxHp}`, cx, barY + barH / 2);

    ctx.restore();
  }

  // ─────────────────── Map 2: Serpent's Path (Easy) ────────────
  //
  // Single long winding S-curve from top-left to bottom-right.
  // Lots of buildable space along curves.
  // 2 spawn points: top-left, bottom-left. Nexus at bottom-right.

  function buildSerpentsPath() {
    grid = [];
    spawnCells = [];

    for (let r = 0; r < MAP_ROWS; r++) {
      grid[r] = [];
      for (let c = 0; c < MAP_COLS; c++) {
        grid[r][c] = makeCell(TYPE_BUILD);
      }
    }

    function set(r, c, type) {
      if (r >= 0 && r < MAP_ROWS && c >= 0 && c < MAP_COLS) {
        grid[r][c] = makeCell(type);
      }
    }
    function hPath(row, c1, c2) {
      const lo = Math.min(c1, c2), hi = Math.max(c1, c2);
      for (let c = lo; c <= hi; c++) set(row, c, TYPE_PATH);
    }
    function vPath(col, r1, r2) {
      const lo = Math.min(r1, r2), hi = Math.max(r1, r2);
      for (let r = lo; r <= hi; r++) set(r, col, TYPE_PATH);
    }

    // Nexus at bottom-right area (col 22, row 13)
    nexusCell = { col: 22, row: 13 };
    set(12, 22, TYPE_NEXUS);
    set(13, 22, TYPE_NEXUS);
    set(13, 21, TYPE_NEXUS);
    set(13, 23, TYPE_NEXUS);
    nexus.col = 22; nexus.row = 13;
    nexus.x = 22 * CELL_SIZE + CELL_SIZE / 2;
    nexus.y = 13 * CELL_SIZE + CELL_SIZE / 2;

    // Spawn 0: top-left (col 1, row 1)
    set(1, 1, TYPE_SPAWN);
    spawnCells.push({ col: 1, row: 1 });

    // Spawn 1: bottom-left (col 1, row 14)
    set(14, 1, TYPE_SPAWN);
    spawnCells.push({ col: 1, row: 14 });

    // ── Path from Spawn 0 (top-left): long S-curve ──
    // Right along top
    hPath(1, 2, 10);
    // Down
    vPath(10, 1, 5);
    // Left (first curve)
    hPath(5, 4, 10);
    // Down
    vPath(4, 5, 9);
    // Right (second curve)
    hPath(9, 4, 14);
    // Down
    vPath(14, 9, 13);
    // Right toward nexus
    hPath(13, 14, 21);

    // ── Path from Spawn 1 (bottom-left): merges into main path ──
    hPath(14, 2, 8);
    vPath(8, 9, 14);
    // Merges at (9, 8) into the main horizontal
    hPath(9, 8, 14); // extends the existing path segment

    // ── Blocked / decorative areas ──
    // Top-right rocky area
    const blocked = [
      [0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],[0,9],[0,10],[0,11],[0,12],[0,13],[0,14],[0,15],[0,16],[0,17],[0,18],[0,19],[0,20],[0,21],[0,22],[0,23],[0,24],
      [15,0],[15,1],[15,2],[15,3],[15,4],[15,5],[15,6],[15,7],[15,8],[15,9],[15,10],[15,11],[15,12],[15,13],[15,14],[15,15],[15,16],[15,17],[15,18],[15,19],[15,20],[15,21],[15,22],[15,23],[15,24],
      // Decorative rocks
      [3,1],[3,2],[4,1],
      [2,16],[2,17],[3,17],
      [7,6],[7,7],
      [11,10],[11,11],[12,11],
      [6,20],[6,21],[7,21],
      [11,18],[12,18],
    ];

    blocked.forEach(([r,c]) => {
      if (grid[r] && grid[r][c] && grid[r][c].type === TYPE_BUILD) {
        set(r, c, TYPE_BLOCKED);
      }
    });

    // Left/right edge blocked
    for (let r = 0; r < MAP_ROWS; r++) {
      if (grid[r][0].type === TYPE_BUILD) set(r, 0, TYPE_BLOCKED);
      if (grid[r][24].type === TYPE_BUILD) set(r, 24, TYPE_BLOCKED);
    }

    initSpawnParticles();
  }

  // ─────────────────── Map 3: The Crossroads (Hard) ──────────
  //
  // 4 short paths converging on center nexus from each edge.
  // Very limited build space near nexus.
  // 4 spawn points (all edges).

  function buildCrossroads() {
    grid = [];
    spawnCells = [];

    for (let r = 0; r < MAP_ROWS; r++) {
      grid[r] = [];
      for (let c = 0; c < MAP_COLS; c++) {
        grid[r][c] = makeCell(TYPE_BUILD);
      }
    }

    function set(r, c, type) {
      if (r >= 0 && r < MAP_ROWS && c >= 0 && c < MAP_COLS) {
        grid[r][c] = makeCell(type);
      }
    }
    function hPath(row, c1, c2) {
      const lo = Math.min(c1, c2), hi = Math.max(c1, c2);
      for (let c = lo; c <= hi; c++) set(row, c, TYPE_PATH);
    }
    function vPath(col, r1, r2) {
      const lo = Math.min(r1, r2), hi = Math.max(r1, r2);
      for (let r = lo; r <= hi; r++) set(r, col, TYPE_PATH);
    }

    // Nexus at center (col 12, row 8)
    nexusCell = { col: 12, row: 8 };
    set(7, 12, TYPE_NEXUS);
    set(8, 12, TYPE_NEXUS);
    set(8, 11, TYPE_NEXUS);
    set(8, 13, TYPE_NEXUS);
    nexus.col = 12; nexus.row = 8;
    nexus.x = 12 * CELL_SIZE + CELL_SIZE / 2;
    nexus.y = 8 * CELL_SIZE + CELL_SIZE / 2;

    // Spawn 0: TOP (col 12, row 0)
    set(0, 12, TYPE_SPAWN);
    spawnCells.push({ col: 12, row: 0 });
    // Short direct path down — slight zigzag
    vPath(12, 1, 3);
    hPath(3, 12, 14);
    vPath(14, 3, 5);
    hPath(5, 11, 14);
    vPath(11, 5, 7);
    hPath(7, 11, 12); // reaches nexus

    // Spawn 1: BOTTOM (col 12, row 15)
    set(15, 12, TYPE_SPAWN);
    spawnCells.push({ col: 12, row: 15 });
    // Short direct path up — slight zigzag
    vPath(12, 12, 14);
    hPath(12, 10, 12);
    vPath(10, 10, 12);
    hPath(10, 10, 13);
    vPath(13, 9, 10);
    hPath(9, 12, 13); // reaches nexus

    // Spawn 2: LEFT (col 0, row 8)
    set(8, 0, TYPE_SPAWN);
    spawnCells.push({ col: 0, row: 8 });
    // Short path right — slight zigzag
    hPath(8, 1, 4);
    vPath(4, 6, 8);
    hPath(6, 4, 7);
    vPath(7, 6, 8);
    hPath(8, 7, 11); // reaches nexus

    // Spawn 3: RIGHT (col 24, row 8)
    set(8, 24, TYPE_SPAWN);
    spawnCells.push({ col: 24, row: 8 });
    // Short path left — slight zigzag
    hPath(8, 20, 23);
    vPath(20, 8, 10);
    hPath(10, 17, 20);
    vPath(17, 8, 10);
    hPath(8, 13, 17); // reaches nexus

    // ── Heavy blocking around nexus — very tight build space ──
    const blocked = [];

    // Top and bottom edges
    for (let c = 0; c < MAP_COLS; c++) {
      if (c !== 12) { blocked.push([0, c]); blocked.push([15, c]); }
    }
    // Left/right edges
    for (let r = 0; r < MAP_ROWS; r++) {
      if (r !== 8) { blocked.push([r, 0]); blocked.push([r, 24]); }
    }

    // Dense blocked zones in the quadrants
    // Top-left quadrant
    const quadBlocked = [
      [1,0],[1,1],[1,2],[1,3],[2,0],[2,1],[2,2],[3,0],[3,1],
      [1,21],[1,22],[1,23],[1,24],[2,22],[2,23],[2,24],[3,23],[3,24],
      [12,0],[12,1],[12,2],[13,0],[13,1],[13,2],[14,0],[14,1],
      [12,22],[12,23],[12,24],[13,22],[13,23],[13,24],[14,23],[14,24],
      // Inner blocked zones limiting build space near nexus
      [5,9],[5,10],[6,8],[6,9],
      [5,14],[5,15],[6,15],[6,16],
      [10,8],[10,9],[11,9],[11,10],
      [10,15],[10,16],[11,15],[11,16],
      // Additional blocked to narrow approaches
      [3,6],[3,7],[3,17],[3,18],
      [4,4],[4,5],[4,19],[4,20],
      [11,4],[11,5],[11,19],[11,20],
      [12,6],[12,7],[12,17],[12,18],
    ];

    [...blocked, ...quadBlocked].forEach(([r,c]) => {
      if (grid[r] && grid[r][c] && grid[r][c].type === TYPE_BUILD) {
        set(r, c, TYPE_BLOCKED);
      }
    });

    initSpawnParticles();
  }

  // ─────────────────── Map 4: Fortress Isle (Medium) ─────────
  //
  // Central island with nexus, connected by 2 bridge chokepoints.
  // Water/void tiles surround the island (unbuildable, impassable).
  // 2 spawn points on opposite shores.

  function buildFortressIsle() {
    grid = [];
    spawnCells = [];

    for (let r = 0; r < MAP_ROWS; r++) {
      grid[r] = [];
      for (let c = 0; c < MAP_COLS; c++) {
        grid[r][c] = makeCell(TYPE_BUILD);
      }
    }

    function set(r, c, type) {
      if (r >= 0 && r < MAP_ROWS && c >= 0 && c < MAP_COLS) {
        grid[r][c] = makeCell(type);
      }
    }
    function hPath(row, c1, c2) {
      const lo = Math.min(c1, c2), hi = Math.max(c1, c2);
      for (let c = lo; c <= hi; c++) set(row, c, TYPE_PATH);
    }
    function vPath(col, r1, r2) {
      const lo = Math.min(r1, r2), hi = Math.max(r1, r2);
      for (let r = lo; r <= hi; r++) set(r, col, TYPE_PATH);
    }

    // Nexus at center of island (col 12, row 8)
    nexusCell = { col: 12, row: 8 };
    set(7, 12, TYPE_NEXUS);
    set(8, 12, TYPE_NEXUS);
    set(8, 11, TYPE_NEXUS);
    set(8, 13, TYPE_NEXUS);
    nexus.col = 12; nexus.row = 8;
    nexus.x = 12 * CELL_SIZE + CELL_SIZE / 2;
    nexus.y = 8 * CELL_SIZE + CELL_SIZE / 2;

    // ── Water / void tiles ──
    // Everything outside the island and shores is water (blocked)
    // Island is roughly col 8-16, row 4-12
    // Shores: col 0-6 (left) and col 18-24 (right)
    // Bridges connect at row 8 (horizontal bridges)

    // First: set the WATER zones (the moat/channel areas)
    // Water fills col 6-8 and col 16-18 (except the bridge rows)
    for (let r = 0; r < MAP_ROWS; r++) {
      for (let c = 6; c <= 8; c++) {
        set(r, c, TYPE_BLOCKED);
      }
      for (let c = 16; c <= 18; c++) {
        set(r, c, TYPE_BLOCKED);
      }
    }
    // Also water above and below the island
    for (let c = 9; c <= 15; c++) {
      for (let r = 0; r <= 3; r++) set(r, c, TYPE_BLOCKED);
      for (let r = 13; r <= 15; r++) set(r, c, TYPE_BLOCKED);
    }

    // ── Spawn 0: LEFT shore (col 1, row 8) ──
    set(8, 1, TYPE_SPAWN);
    spawnCells.push({ col: 1, row: 8 });

    // Path across left shore and bridge
    hPath(8, 2, 5);    // across left shore
    // Bridge: clear the water at row 7-9, col 6-8
    hPath(7, 6, 8);
    hPath(8, 6, 8);
    hPath(9, 6, 8);
    // Path on island toward nexus — winding
    hPath(8, 9, 10);
    vPath(10, 6, 8);
    hPath(6, 10, 12);
    vPath(12, 6, 7);   // up to nexus

    // ── Spawn 1: RIGHT shore (col 23, row 8) ──
    set(8, 23, TYPE_SPAWN);
    spawnCells.push({ col: 23, row: 8 });

    // Path across right shore and bridge
    hPath(8, 19, 22);  // across right shore
    // Bridge: clear the water at row 7-9, col 16-18
    hPath(7, 16, 18);
    hPath(8, 16, 18);
    hPath(9, 16, 18);
    // Path on island toward nexus — winding
    hPath(8, 14, 15);
    vPath(14, 8, 10);
    hPath(10, 12, 14);
    vPath(12, 9, 10);  // down to nexus (actually already nexus adj)
    // Connect nexus: path at row 9, col 11-13
    hPath(9, 11, 13);

    // ── Shore buildable areas (cols 0-5 and 19-24) ──
    // Keep these as build cells (already set as default)

    // ── Island buildable interior ──
    // Already build by default; the paths and nexus are set

    // ── Edge blocking ──
    for (let c = 0; c < MAP_COLS; c++) {
      if (grid[0][c].type === TYPE_BUILD) set(0, c, TYPE_BLOCKED);
      if (grid[15][c].type === TYPE_BUILD) set(15, c, TYPE_BLOCKED);
    }
    for (let r = 0; r < MAP_ROWS; r++) {
      if (grid[r][0].type === TYPE_BUILD) set(r, 0, TYPE_BLOCKED);
      if (grid[r][24].type === TYPE_BUILD) set(r, 24, TYPE_BLOCKED);
    }

    // ── Additional decorative blocked cells ──
    const decor = [
      // Shore rocks
      [2,1],[2,2],[3,1],
      [13,1],[13,2],[14,1],
      [2,22],[2,23],[3,23],
      [13,22],[13,23],[14,23],
      // Island interior rocks
      [5,11],[5,13],
      [11,11],[11,13],
    ];
    decor.forEach(([r,c]) => {
      if (grid[r] && grid[r][c] && grid[r][c].type === TYPE_BUILD) {
        set(r, c, TYPE_BLOCKED);
      }
    });

    initSpawnParticles();
  }

  // ─────────────────── Map Definitions ───────────────────────
  const MAPS = {
    arcaneBastion: {
      id: 'arcaneBastion',
      name: 'Arcane Bastion',
      description: '4 winding paths converge on the central crystal. The classic.',
      difficulty: 'Medium',
      build: buildMap1
    },
    serpentsPath: {
      id: 'serpentsPath',
      name: "Serpent's Path",
      description: 'A long S-curve with ample build space. Good for beginners.',
      difficulty: 'Easy',
      build: buildSerpentsPath
    },
    crossroads: {
      id: 'crossroads',
      name: 'The Crossroads',
      description: '4 short paths from every edge. Relentless and claustrophobic.',
      difficulty: 'Hard',
      build: buildCrossroads
    },
    fortressIsle: {
      id: 'fortressIsle',
      name: 'Fortress Isle',
      description: 'A central island with 2 bridge chokepoints over water.',
      difficulty: 'Medium',
      build: buildFortressIsle
    }
  };

  const MAP_ORDER = ['arcaneBastion', 'serpentsPath', 'crossroads', 'fortressIsle'];
  let currentMapId = 'arcaneBastion';

  // ──────────────────── Init & Public API ──────────────────────

  function init(mapId) {
    currentMapId = mapId || currentMapId || 'arcaneBastion';
    const mapDef = MAPS[currentMapId];
    if (!mapDef) {
      currentMapId = 'arcaneBastion';
      MAPS.arcaneBastion.build();
    } else {
      mapDef.build();
    }
    // Reset nexus HP
    nexus.hp = nexus.maxHp;
    // Reset patterns so they regenerate
    stonePattern = null;
    pathPattern = null;
    computeAllPaths();
    // Update public API references (grid/spawnCells are reassigned in build fns)
    API.grid = grid;
    API.spawnCells = spawnCells;
  }

  // Auto-init when loaded
  init('arcaneBastion');

  // ── Expose Public API ──
  const API = {
    // Constants
    CELL_SIZE:  CELL_SIZE,
    MAP_COLS:   MAP_COLS,
    MAP_ROWS:   MAP_ROWS,
    MAP_W:      MAP_W,
    MAP_H:      MAP_H,

    // Grid access
    grid:       grid,
    nexus:      nexus,
    spawnCells: spawnCells,

    // Coordinate conversion
    worldToGrid: worldToGrid,
    gridToWorld: gridToWorld,

    // Placement
    canBuild:    canBuild,
    placeTower:  placeTower,
    removeTower: removeTower,

    // Pathfinding
    getPath:     getPath,
    recomputePaths: computeAllPaths,

    // Drawing
    draw:             draw,
    drawBuildHighlight: drawBuildHighlight,
    drawNexusHP:      drawNexusHP,

    // Maps
    MAPS:       MAPS,
    MAP_ORDER:  MAP_ORDER,
    currentMapId: function() { return currentMapId; },

    // Re-init (e.g. for level restart or map change)
    init: init
  };

  window.ArcaneMap = API;

})();
