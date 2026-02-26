/* maze.js - Classic Pac-Man maze layout and rendering
 * Exports: window.PacMaze
 *
 * Tile types:
 *   0 = empty (path)
 *   1 = wall
 *   2 = dot
 *   3 = power pellet
 *   4 = ghost house door
 *   5 = ghost house interior
 *   6 = warp tunnel
 *   7 = fruit spawn point (empty path marker)
 */
(function () {
    'use strict';

    const COLS = 28;
    const ROWS = 31;
    const TILE = 16; // pixels per tile at 1x scale

    // Classic Pac-Man maze layout (28x31)
    // Mirrors the original arcade layout
    const MAZE_TEMPLATE = [
        // Row 0-2: top border + first dot corridor
        '1111111111111111111111111111',
        '1222222222222112222222222221',
        '1211112111112112111121111121',
        // Row 3-4
        '1311112111112112111121111131',
        '1211112111112112111121111121',
        // Row 5-8
        '1222222222222222222222222221',
        '1211112112111111121121111121',
        '1211112112111111121121111121',
        '1222222112222112222212222221',
        // Row 9-11
        '1111112111110110111121111111',
        '0000012111110110111121000000',
        '0000012110000000001121000000',
        // Row 12-14: ghost house
        '0000012110111451110121000000',
        '6000002000155555100200000006',
        '0000012110155555100121000000',
        // Row 15-17
        '0000012110100000010121000000',
        '0000012110111111110121000000',
        '1111112110000000001121111111',
        // Row 18-20
        '1222222222222112222222222221',
        '1211112111112112111121111121',
        '1211112111112112111121111121',
        // Row 21-23
        '1322112222222072222222112231',
        '1112112112111111121121121121',
        '1112112112111111121121121121',
        // Row 24-28
        '1222222212222112222212222221',
        '1211111111112112111111111121',
        '1211111111112112111111111121',
        '1222222222222222222222222221',
        // Row 28-30: bottom border
        '1111111111111111111111111111',
        '0000000000000000000000000000',
        '0000000000000000000000000000',
    ];

    let maze = [];
    let totalDots = 0;
    let dotsEaten = 0;

    function init() {
        maze = [];
        totalDots = 0;
        dotsEaten = 0;
        for (let r = 0; r < ROWS; r++) {
            const row = [];
            const tpl = MAZE_TEMPLATE[r] || '';
            for (let c = 0; c < COLS; c++) {
                const v = parseInt(tpl[c] || '0', 10);
                row.push(v);
                if (v === 2 || v === 3) totalDots++;
            }
            maze.push(row);
        }
    }

    function getTile(col, row) {
        if (row < 0 || row >= ROWS) return 1;
        // Wrap columns for tunnel
        if (col < 0) col += COLS;
        if (col >= COLS) col %= COLS;
        return maze[row][col];
    }

    function setTile(col, row, val) {
        if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
            maze[row][col] = val;
        }
    }

    function isWalkable(col, row) {
        const t = getTile(col, row);
        return t !== 1 && t !== 4 && t !== 5;
    }

    function isWalkableForGhost(col, row, canEnterHouse) {
        const t = getTile(col, row);
        if (t === 1) return false;
        if ((t === 4 || t === 5) && !canEnterHouse) return false;
        return true;
    }

    function eatDot(col, row) {
        const t = getTile(col, row);
        if (t === 2) {
            setTile(col, row, 0);
            dotsEaten++;
            return 'dot';
        }
        if (t === 3) {
            setTile(col, row, 0);
            dotsEaten++;
            return 'power';
        }
        return null;
    }

    function isCleared() {
        return dotsEaten >= totalDots;
    }

    function getDotsEaten() { return dotsEaten; }
    function getTotalDots() { return totalDots; }

    // Neon-glow maze rendering
    function draw(ctx, scale, time) {
        const s = TILE * scale;

        // Draw walls with neon glow
        ctx.save();
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const t = maze[r][c];
                const x = c * s;
                const y = r * s;

                if (t === 1) {
                    drawWallTile(ctx, c, r, x, y, s, time);
                } else if (t === 2) {
                    // Dot
                    ctx.fillStyle = '#ffcc00';
                    ctx.shadowColor = '#ffcc00';
                    ctx.shadowBlur = 3 * scale;
                    ctx.beginPath();
                    ctx.arc(x + s / 2, y + s / 2, s * 0.12, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;
                } else if (t === 3) {
                    // Power pellet (pulsing)
                    const pulse = 0.7 + 0.3 * Math.sin(time * 0.005);
                    ctx.fillStyle = `rgba(255, 204, 0, ${pulse})`;
                    ctx.shadowColor = '#ffcc00';
                    ctx.shadowBlur = 10 * scale * pulse;
                    ctx.beginPath();
                    ctx.arc(x + s / 2, y + s / 2, s * 0.3, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;
                } else if (t === 4) {
                    // Ghost house door
                    ctx.fillStyle = '#ff88cc';
                    ctx.shadowColor = '#ff88cc';
                    ctx.shadowBlur = 6 * scale;
                    ctx.fillRect(x + s * 0.1, y + s * 0.35, s * 0.8, s * 0.3);
                    ctx.shadowBlur = 0;
                }
            }
        }
        ctx.restore();
    }

    function drawWallTile(ctx, col, row, x, y, s, time) {
        // Check neighbors to determine wall edges
        const up = getTile(col, row - 1) === 1;
        const dn = getTile(col, row + 1) === 1;
        const lt = getTile(col - 1, row) === 1;
        const rt = getTile(col + 1, row) === 1;

        const neonBlue = '#0088ff';
        const pulse = 0.85 + 0.15 * Math.sin(time * 0.002 + col * 0.3 + row * 0.2);

        ctx.strokeStyle = neonBlue;
        ctx.lineWidth = 2 * (s / TILE);
        ctx.shadowColor = neonBlue;
        ctx.shadowBlur = 8 * (s / TILE) * pulse;
        ctx.globalAlpha = pulse;

        const pad = s * 0.1;
        const cx = x + s / 2;
        const cy = y + s / 2;

        // Draw border edges where wall meets non-wall
        ctx.beginPath();
        if (!up) {
            ctx.moveTo(x + (lt ? 0 : pad), y + pad);
            ctx.lineTo(x + s - (rt ? 0 : pad), y + pad);
        }
        if (!dn) {
            ctx.moveTo(x + (lt ? 0 : pad), y + s - pad);
            ctx.lineTo(x + s - (rt ? 0 : pad), y + s - pad);
        }
        if (!lt) {
            ctx.moveTo(x + pad, y + (up ? 0 : pad));
            ctx.lineTo(x + pad, y + s - (dn ? 0 : pad));
        }
        if (!rt) {
            ctx.moveTo(x + s - pad, y + (up ? 0 : pad));
            ctx.lineTo(x + s - pad, y + s - (dn ? 0 : pad));
        }

        // Draw corner curves
        if (!up && !lt && getTile(col - 1, row - 1) !== 1) {
            ctx.moveTo(x + pad, y + pad + s * 0.15);
            ctx.quadraticCurveTo(x + pad, y + pad, x + pad + s * 0.15, y + pad);
        }
        if (!up && !rt && getTile(col + 1, row - 1) !== 1) {
            ctx.moveTo(x + s - pad - s * 0.15, y + pad);
            ctx.quadraticCurveTo(x + s - pad, y + pad, x + s - pad, y + pad + s * 0.15);
        }
        if (!dn && !lt && getTile(col - 1, row + 1) !== 1) {
            ctx.moveTo(x + pad, y + s - pad - s * 0.15);
            ctx.quadraticCurveTo(x + pad, y + s - pad, x + pad + s * 0.15, y + s - pad);
        }
        if (!dn && !rt && getTile(col + 1, row + 1) !== 1) {
            ctx.moveTo(x + s - pad - s * 0.15, y + s - pad);
            ctx.quadraticCurveTo(x + s - pad, y + s - pad, x + s - pad, y + s - pad - s * 0.15);
        }

        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;

        // Subtle dark fill for wall interior
        ctx.fillStyle = 'rgba(0, 20, 60, 0.4)';
        ctx.fillRect(x, y, s, s);
    }

    // Find positions
    function findFruitSpawn() {
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (maze[r][c] === 7) return { col: c, row: r };
            }
        }
        return { col: 14, row: 21 }; // fallback center
    }

    function getGhostHouseCenter() {
        return { col: 13.5, row: 14 };
    }

    function getGhostHouseDoor() {
        return { col: 13.5, row: 12 };
    }

    window.PacMaze = {
        COLS, ROWS, TILE,
        init, getTile, setTile,
        isWalkable, isWalkableForGhost,
        eatDot, isCleared,
        getDotsEaten, getTotalDots,
        draw,
        findFruitSpawn,
        getGhostHouseCenter,
        getGhostHouseDoor,
    };
})();
