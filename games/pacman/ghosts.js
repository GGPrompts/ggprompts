/* ghosts.js - Ghost AI with 4 authentic personalities
 * Exports: window.PacGhosts
 *
 * Ghost modes:
 *   'scatter'    - Each ghost goes to its corner
 *   'chase'      - Each ghost uses its unique targeting
 *   'frightened' - Ghosts turn blue, random movement
 *   'eaten'      - Eyes return to ghost house
 *
 * Blinky (red):   Directly targets Pac-Man's tile
 * Pinky  (pink):  Targets 4 tiles ahead of Pac-Man
 * Inky   (cyan):  Vector from Blinky to 2 tiles ahead of Pac-Man, doubled
 * Clyde  (orange): Chases if >8 tiles away, scatters if close
 */
(function () {
    'use strict';

    const { COLS, ROWS, isWalkableForGhost, getGhostHouseCenter, getGhostHouseDoor } = window.PacMaze;

    // Direction vectors
    const DIRS = {
        up:    { dx: 0, dy: -1 },
        down:  { dx: 0, dy: 1 },
        left:  { dx: -1, dy: 0 },
        right: { dx: 1, dy: 0 },
    };
    const DIR_NAMES = ['up', 'left', 'down', 'right'];
    const OPPOSITE = { up: 'down', down: 'up', left: 'right', right: 'left' };

    // Scatter corners (tile coordinates)
    const SCATTER_TARGETS = {
        blinky: { col: 25, row: 0 },
        pinky:  { col: 2, row: 0 },
        inky:   { col: 27, row: 30 },
        clyde:  { col: 0, row: 30 },
    };

    // Ghost colors
    const GHOST_COLORS = {
        blinky: '#ff0000',
        pinky:  '#ffb8ff',
        inky:   '#00ffff',
        clyde:  '#ffb852',
    };

    const GHOST_NEON = {
        blinky: '#ff3333',
        pinky:  '#ff77cc',
        inky:   '#33ffff',
        clyde:  '#ffaa33',
    };

    // Mode timing per level (in seconds) - scatter/chase alternation
    // Format: [scatter, chase, scatter, chase, scatter, chase, scatter, chase_forever]
    const MODE_TIMERS_L1 = [7, 20, 7, 20, 5, 20, 5, Infinity];
    const MODE_TIMERS_L2 = [7, 20, 7, 20, 5, 1033, 1, Infinity];
    const MODE_TIMERS_L5 = [5, 20, 5, 20, 5, 1037, 1, Infinity];

    function getModeTimers(level) {
        if (level <= 1) return MODE_TIMERS_L1;
        if (level <= 4) return MODE_TIMERS_L2;
        return MODE_TIMERS_L5;
    }

    // Frightened time per level (seconds)
    function getFrightenedTime(level) {
        const times = [0, 6, 5, 4, 3, 2, 5, 2, 2, 1, 5, 2, 1, 1, 3, 1, 1, 0, 1, 0];
        return times[Math.min(level, times.length - 1)] || 0;
    }

    let ghosts = [];
    let globalMode = 'scatter'; // 'scatter' or 'chase'
    let modeIndex = 0;
    let modeTimer = 0;
    let frightenedTimer = 0;
    let ghostsEatenThisRound = 0; // for scoring 200/400/800/1600
    let flashWarning = false;
    let level = 1;

    // Release timers for each ghost (dots eaten threshold)
    const RELEASE_DOTS = {
        blinky: 0,
        pinky: 0,
        inky: 30,
        clyde: 60,
    };

    function createGhost(name, col, row, inHouse) {
        return {
            name,
            col,
            row,
            pixelX: col * PacMaze.TILE,
            pixelY: row * PacMaze.TILE,
            dir: 'left',
            nextDir: 'left',
            mode: inHouse ? 'house' : 'scatter',
            speed: 0.075,
            color: GHOST_COLORS[name],
            neonColor: GHOST_NEON[name],
            inHouse,
            released: !inHouse,
            exitingHouse: false,
            // sub-tile movement
            moveProgress: 0,
            targetCol: col,
            targetRow: row,
        };
    }

    function init(lvl) {
        level = lvl;
        globalMode = 'scatter';
        modeIndex = 0;
        modeTimer = 0;
        frightenedTimer = 0;
        ghostsEatenThisRound = 0;
        flashWarning = false;

        const door = getGhostHouseDoor();
        const center = getGhostHouseCenter();

        ghosts = [
            createGhost('blinky', 13.5, 11, false),  // starts outside
            createGhost('pinky', 13.5, 14, true),
            createGhost('inky', 11.5, 14, true),
            createGhost('clyde', 15.5, 14, true),
        ];

        ghosts[0].dir = 'left';
        ghosts[0].mode = 'scatter';
        ghosts[0].released = true;
    }

    function getGhosts() { return ghosts; }
    function getGhostsEatenThisRound() { return ghostsEatenThisRound; }

    function startFrightened() {
        const duration = getFrightenedTime(level);
        if (duration <= 0) return;
        frightenedTimer = duration;
        ghostsEatenThisRound = 0;
        flashWarning = false;

        ghosts.forEach(g => {
            if (g.mode !== 'eaten' && g.mode !== 'house') {
                g.mode = 'frightened';
                // Reverse direction
                g.dir = OPPOSITE[g.dir] || g.dir;
            }
        });
    }

    function eatGhost(ghost) {
        ghost.mode = 'eaten';
        ghostsEatenThisRound++;
        return 200 * Math.pow(2, ghostsEatenThisRound - 1);
    }

    function dist(c1, r1, c2, r2) {
        const dc = c1 - c2;
        const dr = r1 - r2;
        return dc * dc + dr * dr; // squared distance for comparison
    }

    function getChaseTarget(ghost, pacman) {
        const px = pacman.col;
        const py = pacman.row;
        const pd = pacman.dir;
        const dirV = DIRS[pd] || DIRS.right;

        switch (ghost.name) {
            case 'blinky':
                // Direct chase
                return { col: px, row: py };

            case 'pinky':
                // 4 tiles ahead of Pac-Man
                // (Original bug: up direction also offsets 4 left)
                let targetCol = px + dirV.dx * 4;
                let targetRow = py + dirV.dy * 4;
                if (pd === 'up') {
                    targetCol -= 4; // reproduce overflow bug
                }
                return { col: targetCol, row: targetRow };

            case 'inky': {
                // 2 tiles ahead of pac-man, then double vector from blinky
                const ahead2Col = px + dirV.dx * 2;
                const ahead2Row = py + dirV.dy * 2;
                const blinky = ghosts.find(g => g.name === 'blinky') || ghosts[0];
                const vecCol = ahead2Col - blinky.col;
                const vecRow = ahead2Row - blinky.row;
                return { col: ahead2Col + vecCol, row: ahead2Row + vecRow };
            }

            case 'clyde': {
                // If >8 tiles away, chase directly. Otherwise scatter.
                const d = Math.sqrt(dist(ghost.col, ghost.row, px, py));
                if (d > 8) {
                    return { col: px, row: py };
                }
                return SCATTER_TARGETS.clyde;
            }

            default:
                return { col: px, row: py };
        }
    }

    function chooseDirection(ghost, targetCol, targetRow) {
        const col = Math.round(ghost.col);
        const row = Math.round(ghost.row);
        const canEnterHouse = ghost.mode === 'eaten' || ghost.mode === 'house' || ghost.exitingHouse;
        let bestDir = ghost.dir;
        let bestDist = Infinity;

        // Priority order: up, left, down, right (tie-breaking)
        const priority = ['up', 'left', 'down', 'right'];

        for (const dirName of priority) {
            // Can't reverse
            if (dirName === OPPOSITE[ghost.dir]) continue;

            const dv = DIRS[dirName];
            const nc = col + dv.dx;
            const nr = row + dv.dy;

            // Warp tunnel wrapping
            const wc = nc < 0 ? COLS - 1 : nc >= COLS ? 0 : nc;

            if (!isWalkableForGhost(wc, nr, canEnterHouse)) continue;

            // Ghosts can't go up in certain tiles (red zone) - simplified
            // In original, ghosts can't turn up at specific tiles near the ghost house
            if (dirName === 'up' && !canEnterHouse) {
                if ((row === 12 || row === 24) && (col === 12 || col === 15)) continue;
            }

            const d = dist(wc, nr, targetCol, targetRow);
            if (d < bestDist) {
                bestDist = d;
                bestDir = dirName;
            }
        }

        return bestDir;
    }

    function chooseRandomDirection(ghost) {
        const col = Math.round(ghost.col);
        const row = Math.round(ghost.row);
        const options = [];

        for (const dirName of DIR_NAMES) {
            if (dirName === OPPOSITE[ghost.dir]) continue;
            const dv = DIRS[dirName];
            const nc = col + dv.dx;
            const nr = row + dv.dy;
            const wc = nc < 0 ? COLS - 1 : nc >= COLS ? 0 : nc;
            if (isWalkableForGhost(wc, nr, false)) {
                options.push(dirName);
            }
        }

        if (options.length === 0) return OPPOSITE[ghost.dir]; // dead end, reverse
        return options[Math.floor(Math.random() * options.length)];
    }

    function update(dt, pacman, dotsEaten) {
        // Update mode timer
        if (frightenedTimer > 0) {
            frightenedTimer -= dt;
            flashWarning = frightenedTimer < 2;
            if (frightenedTimer <= 0) {
                frightenedTimer = 0;
                flashWarning = false;
                ghosts.forEach(g => {
                    if (g.mode === 'frightened') {
                        g.mode = globalMode;
                    }
                });
            }
        } else {
            // Normal scatter/chase timer
            const timers = getModeTimers(level);
            modeTimer += dt;
            if (modeIndex < timers.length - 1 && modeTimer >= timers[modeIndex]) {
                modeTimer = 0;
                modeIndex++;
                globalMode = (modeIndex % 2 === 0) ? 'scatter' : 'chase';
                // Switch all active ghosts and reverse direction
                ghosts.forEach(g => {
                    if (g.mode === 'scatter' || g.mode === 'chase') {
                        g.mode = globalMode;
                        g.dir = OPPOSITE[g.dir] || g.dir;
                    }
                });
            }
        }

        // Release ghosts from house based on dots eaten
        const releaseThresholds = {
            pinky: Math.max(0, RELEASE_DOTS.pinky - (level - 1) * 5),
            inky: Math.max(0, RELEASE_DOTS.inky - (level - 1) * 10),
            clyde: Math.max(0, RELEASE_DOTS.clyde - (level - 1) * 15),
        };

        ghosts.forEach(g => {
            if (g.inHouse && !g.released && releaseThresholds[g.name] !== undefined) {
                if (dotsEaten >= releaseThresholds[g.name]) {
                    g.released = true;
                    g.exitingHouse = true;
                }
            }
        });

        // Move each ghost
        ghosts.forEach(g => {
            if (g.mode === 'house' && !g.released) {
                // Bob up and down in house
                g.row = 14 + Math.sin(Date.now() * 0.005) * 0.3;
                g.pixelX = g.col * PacMaze.TILE;
                g.pixelY = g.row * PacMaze.TILE;
                return;
            }

            if (g.exitingHouse) {
                // Move up to door
                const door = getGhostHouseDoor();
                const targetCol = door.col;
                const targetRow = door.row;
                const dCol = targetCol - g.col;
                const dRow = targetRow - g.row;
                const d = Math.sqrt(dCol * dCol + dRow * dRow);

                if (d < 0.2) {
                    g.col = door.col;
                    g.row = door.row - 1;
                    g.exitingHouse = false;
                    g.inHouse = false;
                    g.mode = frightenedTimer > 0 ? 'frightened' : globalMode;
                    g.dir = 'left';
                } else {
                    // First center horizontally, then move up
                    if (Math.abs(dCol) > 0.1) {
                        g.col += Math.sign(dCol) * g.speed * dt * 60 * 0.5;
                    } else {
                        g.col = targetCol;
                        g.row -= g.speed * dt * 60 * 0.5;
                    }
                }
                g.pixelX = g.col * PacMaze.TILE;
                g.pixelY = g.row * PacMaze.TILE;
                return;
            }

            if (g.mode === 'eaten') {
                // Rush back to ghost house
                const door = getGhostHouseDoor();
                const center = getGhostHouseCenter();
                const d = Math.sqrt(dist(g.col, g.row, door.col, door.row));

                if (d < 1) {
                    // Enter house
                    const dc = center.col - g.col;
                    const dr = center.row - g.row;
                    const dd = Math.sqrt(dc * dc + dr * dr);
                    if (dd < 0.3) {
                        g.col = center.col;
                        g.row = center.row;
                        g.mode = frightenedTimer > 0 ? 'frightened' : globalMode;
                        g.exitingHouse = true;
                    } else {
                        g.col += (dc / dd) * g.speed * dt * 60 * 2;
                        g.row += (dr / dd) * g.speed * dt * 60 * 2;
                    }
                } else {
                    // Navigate to door at double speed
                    moveGhostOnGrid(g, door.col, door.row, dt, 2);
                }
                g.pixelX = g.col * PacMaze.TILE;
                g.pixelY = g.row * PacMaze.TILE;
                return;
            }

            // Normal movement: determine target
            let target;
            if (g.mode === 'frightened') {
                // Move at intersection, random choice
                moveGhostOnGridRandom(g, dt, 0.5);
                g.pixelX = g.col * PacMaze.TILE;
                g.pixelY = g.row * PacMaze.TILE;
                return;
            } else if (g.mode === 'scatter') {
                target = SCATTER_TARGETS[g.name];
            } else {
                target = getChaseTarget(g, pacman);
            }

            // Speed adjustments per level
            let speedMult = 1 + (level - 1) * 0.05;
            // Blinky speeds up as dots are eaten (Cruise Elroy)
            if (g.name === 'blinky') {
                const dotsLeft = PacMaze.getTotalDots() - dotsEaten;
                const elroyThreshold1 = Math.max(10, 20 - level * 2);
                const elroyThreshold2 = Math.max(5, 10 - level);
                if (dotsLeft <= elroyThreshold2) speedMult *= 1.1;
                else if (dotsLeft <= elroyThreshold1) speedMult *= 1.05;
            }

            moveGhostOnGrid(g, target.col, target.row, dt, speedMult);
            g.pixelX = g.col * PacMaze.TILE;
            g.pixelY = g.row * PacMaze.TILE;
        });
    }

    function moveGhostOnGrid(ghost, targetCol, targetRow, dt, speedMult) {
        const speed = ghost.speed * (speedMult || 1) * dt * 60;
        const dv = DIRS[ghost.dir];
        if (!dv) return;

        ghost.col += dv.dx * speed;
        ghost.row += dv.dy * speed;

        // Warp tunnel
        if (ghost.col < -1) ghost.col = COLS;
        if (ghost.col > COLS) ghost.col = -1;

        // Check if at tile center (decision point)
        const tileCol = Math.round(ghost.col);
        const tileRow = Math.round(ghost.row);
        const dc = Math.abs(ghost.col - tileCol);
        const dr = Math.abs(ghost.row - tileRow);

        if (dc < speed * 1.2 && dr < speed * 1.2) {
            ghost.col = tileCol;
            ghost.row = tileRow;
            ghost.dir = chooseDirection(ghost, targetCol, targetRow);
        }
    }

    function moveGhostOnGridRandom(ghost, dt, speedMult) {
        const speed = ghost.speed * (speedMult || 1) * dt * 60;
        const dv = DIRS[ghost.dir];
        if (!dv) { ghost.dir = 'left'; return; }

        ghost.col += dv.dx * speed;
        ghost.row += dv.dy * speed;

        // Warp tunnel
        if (ghost.col < -1) ghost.col = COLS;
        if (ghost.col > COLS) ghost.col = -1;

        const tileCol = Math.round(ghost.col);
        const tileRow = Math.round(ghost.row);
        const dc = Math.abs(ghost.col - tileCol);
        const dr = Math.abs(ghost.row - tileRow);

        if (dc < speed * 1.2 && dr < speed * 1.2) {
            ghost.col = tileCol;
            ghost.row = tileRow;
            ghost.dir = chooseRandomDirection(ghost);
        }
    }

    // Draw ghost with neon glow
    function draw(ctx, scale, time) {
        const s = PacMaze.TILE * scale;

        ghosts.forEach(g => {
            const x = g.col * s;
            const y = g.row * s;
            const cx = x + s / 2;
            const cy = y + s / 2;
            const r = s * 0.55;

            ctx.save();

            if (g.mode === 'eaten') {
                // Just eyes
                drawEyes(ctx, cx, cy, r, s, g.dir);
                ctx.restore();
                return;
            }

            let bodyColor = g.neonColor;
            let glowColor = g.neonColor;

            if (g.mode === 'frightened') {
                if (flashWarning && Math.floor(time / 150) % 2 === 0) {
                    bodyColor = '#ffffff';
                    glowColor = '#ffffff';
                } else {
                    bodyColor = '#2222ff';
                    glowColor = '#4444ff';
                }
            }

            // Glow
            ctx.shadowColor = glowColor;
            ctx.shadowBlur = 12 * scale;

            // Ghost body (rounded top, wavy bottom)
            ctx.fillStyle = bodyColor;
            ctx.beginPath();
            ctx.arc(cx, cy - r * 0.15, r, Math.PI, 0, false);
            // Wavy bottom
            const segments = 3;
            const segW = (r * 2) / segments;
            const baseY = cy + r * 0.6;
            const waveAmp = s * 0.12;
            const waveOff = Math.sin(time * 0.008) * waveAmp;

            ctx.lineTo(cx + r, baseY);
            for (let i = segments - 1; i >= 0; i--) {
                const sx1 = cx - r + (i + 0.5) * segW;
                const sx0 = cx - r + i * segW;
                const peak = (i % 2 === 0) ? waveOff : -waveOff;
                ctx.quadraticCurveTo(sx1, baseY + peak, sx0, baseY);
            }
            ctx.closePath();
            ctx.fill();

            ctx.shadowBlur = 0;

            // Eyes
            if (g.mode === 'frightened') {
                // Frightened eyes (simple)
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(cx - r * 0.3, cy - r * 0.15, r * 0.15, 0, Math.PI * 2);
                ctx.arc(cx + r * 0.3, cy - r * 0.15, r * 0.15, 0, Math.PI * 2);
                ctx.fill();
                // Wavy mouth
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1.5 * scale;
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const mx = cx - r * 0.5 + i * r * 0.25;
                    const my = cy + r * 0.2 + (i % 2 === 0 ? -s * 0.04 : s * 0.04);
                    if (i === 0) ctx.moveTo(mx, my);
                    else ctx.lineTo(mx, my);
                }
                ctx.stroke();
            } else {
                drawEyes(ctx, cx, cy, r, s, g.dir);
            }

            ctx.restore();
        });
    }

    function drawEyes(ctx, cx, cy, r, s, dir) {
        // Eye whites
        const eyeR = r * 0.22;
        const pupilR = r * 0.12;
        const eyeY = cy - r * 0.15;

        // Pupil offset based on direction
        let px = 0, py = 0;
        const off = eyeR * 0.4;
        if (dir === 'left') px = -off;
        if (dir === 'right') px = off;
        if (dir === 'up') py = -off;
        if (dir === 'down') py = off;

        // Left eye
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(cx - r * 0.3, eyeY, eyeR, eyeR * 1.3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0033aa';
        ctx.beginPath();
        ctx.arc(cx - r * 0.3 + px, eyeY + py, pupilR, 0, Math.PI * 2);
        ctx.fill();

        // Right eye
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(cx + r * 0.3, eyeY, eyeR, eyeR * 1.3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0033aa';
        ctx.beginPath();
        ctx.arc(cx + r * 0.3 + px, eyeY + py, pupilR, 0, Math.PI * 2);
        ctx.fill();
    }

    window.PacGhosts = {
        init, update, draw,
        getGhosts, startFrightened, eatGhost,
        getGhostsEatenThisRound,
        getFrightenedTime,
    };
})();
