/* engine.js - Pac-Man game engine (main loop, player, scoring, levels)
 * Exports: window.PacEngine
 *
 * Depends on: PacMaze, PacGhosts, PacAudio
 */
(function () {
    'use strict';

    const { COLS, ROWS, TILE } = window.PacMaze;
    const DIRS = {
        up:    { dx: 0, dy: -1 },
        down:  { dx: 0, dy: 1 },
        left:  { dx: -1, dy: 0 },
        right: { dx: 1, dy: 0 },
    };

    // Fruit types by level
    const FRUITS = [
        null,
        { name: 'cherry',      points: 100,  color: '#ff0044' },
        { name: 'strawberry',   points: 300,  color: '#ff3366' },
        { name: 'orange',       points: 500,  color: '#ff8800' },
        { name: 'apple',        points: 700,  color: '#ff2222' },
        { name: 'melon',        points: 1000, color: '#00cc44' },
        { name: 'galaxian',     points: 2000, color: '#0088ff' },
        { name: 'bell',         points: 3000, color: '#ffcc00' },
        { name: 'key',          points: 5000, color: '#88ccff' },
    ];

    let canvas, ctx;
    let scale = 1;
    let state = 'idle'; // 'idle', 'ready', 'playing', 'dying', 'levelcomplete', 'gameover'
    let animFrame = 0;

    // Player
    let pacman = {
        col: 14, row: 23,
        dir: 'left', nextDir: 'left',
        speed: 0.09,
        mouthAngle: 0, // animation
        mouthOpen: true,
    };

    // Game state
    let score = 0;
    let highScore = parseInt(localStorage.getItem('pacman-hi') || '0', 10);
    let lives = 3;
    let level = 1;
    let lastTime = 0;
    let stateTimer = 0;
    let sirenTimer = 0;

    // Fruit
    let fruit = null;
    let fruitTimer = 0;
    let fruitSpawned = false;
    let fruitPoints = []; // floating score text

    // Score popups
    let scorePopups = [];

    // Death animation
    let deathAngle = 0;

    // Pre-turn buffer
    let preTurnBuffer = null;
    let preTurnTimer = 0;
    const PRE_TURN_WINDOW = 0.15; // seconds

    // Callbacks for UI updates
    let onScoreUpdate = null;
    let onLivesUpdate = null;
    let onLevelUpdate = null;
    let onGameOver = null;
    let onGameStart = null;

    function setCallbacks(cbs) {
        onScoreUpdate = cbs.onScoreUpdate || null;
        onLivesUpdate = cbs.onLivesUpdate || null;
        onLevelUpdate = cbs.onLevelUpdate || null;
        onGameOver = cbs.onGameOver || null;
        onGameStart = cbs.onGameStart || null;
    }

    function initCanvas(canvasEl) {
        canvas = canvasEl;
        ctx = canvas.getContext('2d');
        resize();
        window.addEventListener('resize', resize);
    }

    function resize() {
        const maxW = Math.min(window.innerWidth - 20, 800);
        const maxH = window.innerHeight - 160;
        scale = Math.min(maxW / (COLS * TILE), maxH / (ROWS * TILE));
        scale = Math.max(0.5, Math.min(scale, 3));
        canvas.width = Math.floor(COLS * TILE * scale);
        canvas.height = Math.floor(ROWS * TILE * scale);
    }

    function startGame() {
        score = 0;
        lives = 3;
        level = 1;
        scorePopups = [];
        fruitPoints = [];

        PacAudio.init();
        PacMaze.init();
        resetPositions();
        PacGhosts.init(level);

        state = 'ready';
        stateTimer = 2;

        PacAudio.playGameStart();

        if (onScoreUpdate) onScoreUpdate(score, highScore);
        if (onLivesUpdate) onLivesUpdate(lives);
        if (onLevelUpdate) onLevelUpdate(level);
        if (onGameStart) onGameStart();

        if (!animFrame) gameLoop(performance.now());
    }

    function resetPositions() {
        pacman.col = 14;
        pacman.row = 23;
        pacman.dir = 'left';
        pacman.nextDir = 'left';
        pacman.mouthAngle = 0;
        pacman.mouthOpen = true;
        fruit = null;
        fruitTimer = 0;
        fruitSpawned = false;
    }

    function nextLevel() {
        level++;
        PacMaze.init();
        resetPositions();
        PacGhosts.init(level);
        state = 'ready';
        stateTimer = 2;
        fruitSpawned = false;

        PacAudio.playLevelComplete();

        if (onLevelUpdate) onLevelUpdate(level);
    }

    function loseLife() {
        lives--;
        if (onLivesUpdate) onLivesUpdate(lives);

        if (lives <= 0) {
            state = 'gameover';
            stateTimer = 3;
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('pacman-hi', highScore.toString());
            }
            if (onGameOver) onGameOver(score);
        } else {
            state = 'dying';
            stateTimer = 1.5;
            deathAngle = 0;
            PacAudio.playDeath();
        }
    }

    function addScore(pts) {
        score += pts;
        if (score > highScore) highScore = score;
        // Extra life at 10000
        if (score >= 10000 && (score - pts) < 10000) {
            lives++;
            PacAudio.playExtraLife();
            if (onLivesUpdate) onLivesUpdate(lives);
        }
        if (onScoreUpdate) onScoreUpdate(score, highScore);
    }

    function addScorePopup(col, row, text, color) {
        scorePopups.push({
            col, row, text, color: color || '#ffffff',
            timer: 1.5, y: 0,
        });
    }

    // Input handling
    function setDirection(dir) {
        pacman.nextDir = dir;
        preTurnBuffer = dir;
        preTurnTimer = PRE_TURN_WINDOW;
    }

    function canMove(col, row, dir) {
        const dv = DIRS[dir];
        if (!dv) return false;
        let nc = Math.round(col) + dv.dx;
        let nr = Math.round(row) + dv.dy;
        // Warp
        if (nc < 0) nc = COLS - 1;
        if (nc >= COLS) nc = 0;
        return PacMaze.isWalkable(nc, nr);
    }

    function tryTurn() {
        // Pre-turn: allow buffered input
        if (preTurnBuffer && preTurnTimer > 0) {
            if (canMove(pacman.col, pacman.row, preTurnBuffer)) {
                pacman.dir = preTurnBuffer;
                preTurnBuffer = null;
                preTurnTimer = 0;
                return;
            }
        }
        if (pacman.nextDir !== pacman.dir && canMove(pacman.col, pacman.row, pacman.nextDir)) {
            pacman.dir = pacman.nextDir;
        }
    }

    function movePacman(dt) {
        // Speed adjustment per level
        const speedMult = 1 + (level - 1) * 0.03;
        const speed = pacman.speed * speedMult * dt * 60;

        tryTurn();

        const dv = DIRS[pacman.dir];
        if (!dv) return;

        let newCol = pacman.col + dv.dx * speed;
        let newRow = pacman.row + dv.dy * speed;

        // Warp tunnel
        if (newCol < -1) newCol = COLS;
        if (newCol > COLS) newCol = -1;

        // Snap to grid on perpendicular axis
        if (dv.dx !== 0) {
            newRow = Math.round(newRow);
        } else {
            newCol = Math.round(newCol);
        }

        // Check wall collision
        const checkCol = Math.round(newCol + dv.dx * 0.4);
        const checkRow = Math.round(newRow + dv.dy * 0.4);
        const wrapCol = checkCol < 0 ? COLS - 1 : checkCol >= COLS ? 0 : checkCol;

        if (PacMaze.isWalkable(wrapCol, checkRow)) {
            pacman.col = newCol;
            pacman.row = newRow;
        } else {
            // Align to tile
            pacman.col = Math.round(pacman.col);
            pacman.row = Math.round(pacman.row);
        }

        // Eat dots
        const tileCol = Math.round(pacman.col);
        const tileRow = Math.round(pacman.row);
        const dc = Math.abs(pacman.col - tileCol);
        const dr = Math.abs(pacman.row - tileRow);

        if (dc < 0.3 && dr < 0.3) {
            const eaten = PacMaze.eatDot(tileCol, tileRow);
            if (eaten === 'dot') {
                addScore(10);
                PacAudio.playWaka();
            } else if (eaten === 'power') {
                addScore(50);
                PacGhosts.startFrightened();
                PacAudio.playPowerPellet();
            }
        }

        // Mouth animation
        pacman.mouthAngle += dt * 8;

        // Spawn fruit
        const dotsEaten = PacMaze.getDotsEaten();
        if (!fruitSpawned && (dotsEaten === 70 || dotsEaten === 170)) {
            spawnFruit();
            fruitSpawned = true;
        }

        // Fruit timer
        if (fruit) {
            fruitTimer -= dt;
            if (fruitTimer <= 0) {
                fruit = null;
            } else {
                // Check fruit collection
                const fd = Math.sqrt(
                    (pacman.col - fruit.col) * (pacman.col - fruit.col) +
                    (pacman.row - fruit.row) * (pacman.row - fruit.row)
                );
                if (fd < 1) {
                    addScore(fruit.points);
                    addScorePopup(fruit.col, fruit.row, fruit.points.toString(), fruit.color);
                    PacAudio.playEatFruit();
                    fruit = null;
                }
            }
        }
    }

    function spawnFruit() {
        const spawn = PacMaze.findFruitSpawn();
        const fruitIdx = Math.min(level, FRUITS.length - 1);
        const f = FRUITS[fruitIdx] || FRUITS[1];
        fruit = {
            col: spawn.col,
            row: spawn.row,
            name: f.name,
            points: f.points,
            color: f.color,
        };
        fruitTimer = 9 + Math.random() * 3;
    }

    function checkGhostCollisions() {
        const ghosts = PacGhosts.getGhosts();
        for (const g of ghosts) {
            if (g.mode === 'eaten' || g.mode === 'house') continue;

            const d = Math.sqrt(
                (pacman.col - g.col) * (pacman.col - g.col) +
                (pacman.row - g.row) * (pacman.row - g.row)
            );

            if (d < 0.8) {
                if (g.mode === 'frightened') {
                    const pts = PacGhosts.eatGhost(g);
                    addScore(pts);
                    addScorePopup(g.col, g.row, pts.toString(), '#00ffff');
                    PacAudio.playEatGhost();
                } else {
                    loseLife();
                    return;
                }
            }
        }
    }

    function gameLoop(timestamp) {
        const dt = Math.min((timestamp - (lastTime || timestamp)) / 1000, 0.05);
        lastTime = timestamp;

        // Update
        switch (state) {
            case 'ready':
                stateTimer -= dt;
                if (stateTimer <= 0) {
                    state = 'playing';
                }
                break;

            case 'playing':
                if (preTurnTimer > 0) preTurnTimer -= dt;
                movePacman(dt);
                PacGhosts.update(dt, pacman, PacMaze.getDotsEaten());
                checkGhostCollisions();

                // Siren sound
                sirenTimer -= dt;
                if (sirenTimer <= 0) {
                    PacAudio.playSiren(level);
                    sirenTimer = 0.3;
                }

                // Check level complete
                if (PacMaze.isCleared()) {
                    state = 'levelcomplete';
                    stateTimer = 2;
                    PacAudio.playLevelComplete();
                }
                break;

            case 'dying':
                stateTimer -= dt;
                deathAngle = Math.min(1, 1 - stateTimer / 1.5);
                if (stateTimer <= 0) {
                    resetPositions();
                    PacGhosts.init(level);
                    state = 'ready';
                    stateTimer = 1.5;
                }
                break;

            case 'levelcomplete':
                stateTimer -= dt;
                if (stateTimer <= 0) {
                    nextLevel();
                }
                break;

            case 'gameover':
                stateTimer -= dt;
                break;
        }

        // Update popups
        scorePopups = scorePopups.filter(p => {
            p.timer -= dt;
            p.y -= dt * 40;
            return p.timer > 0;
        });

        fruitPoints = fruitPoints.filter(p => {
            p.timer -= dt;
            p.y -= dt * 30;
            return p.timer > 0;
        });

        // Draw
        render(timestamp);

        animFrame = requestAnimationFrame(gameLoop);
    }

    function render(time) {
        if (!ctx) return;

        const w = canvas.width;
        const h = canvas.height;

        // Clear
        ctx.fillStyle = '#0a0a1a';
        ctx.fillRect(0, 0, w, h);

        // Draw maze
        PacMaze.draw(ctx, scale, time);

        // Draw fruit
        if (fruit) {
            drawFruit(time);
        }

        // Draw Pac-Man
        if (state !== 'dying') {
            drawPacman(time);
        } else {
            drawPacmanDeath(time);
        }

        // Draw ghosts
        if (state !== 'dying') {
            PacGhosts.draw(ctx, scale, time);
        }

        // Draw score popups
        const s = TILE * scale;
        ctx.font = `bold ${Math.floor(10 * scale)}px "Press Start 2P", monospace`;
        ctx.textAlign = 'center';
        scorePopups.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.min(1, p.timer * 2);
            ctx.fillText(p.text, p.col * s + s / 2, p.row * s + p.y * scale);
        });
        ctx.globalAlpha = 1;

        // State overlays
        if (state === 'ready') {
            ctx.fillStyle = '#ffff00';
            ctx.shadowColor = '#ffff00';
            ctx.shadowBlur = 10;
            ctx.font = `${Math.floor(14 * scale)}px "Press Start 2P", monospace`;
            ctx.textAlign = 'center';
            ctx.fillText('READY!', w / 2, ROWS * s * 0.57);
            ctx.shadowBlur = 0;
        }

        if (state === 'gameover') {
            ctx.fillStyle = '#ff0000';
            ctx.shadowColor = '#ff0000';
            ctx.shadowBlur = 15;
            ctx.font = `${Math.floor(16 * scale)}px "Press Start 2P", monospace`;
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER', w / 2, ROWS * s * 0.55);
            ctx.shadowBlur = 0;

            ctx.fillStyle = '#ffcc00';
            ctx.font = `${Math.floor(10 * scale)}px "Press Start 2P", monospace`;
            ctx.fillText('PRESS SPACE TO RESTART', w / 2, ROWS * s * 0.62);
        }

        if (state === 'levelcomplete') {
            // Flash maze
            if (Math.floor(time / 200) % 2 === 0) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.fillRect(0, 0, w, h);
            }
        }
    }

    function drawPacman(time) {
        const s = TILE * scale;
        const x = pacman.col * s + s / 2;
        const y = pacman.row * s + s / 2;
        const r = s * 0.55;

        // Mouth angle (0 to PI/4)
        const mouth = Math.abs(Math.sin(pacman.mouthAngle)) * Math.PI * 0.3;

        // Direction angle
        let angle = 0;
        if (pacman.dir === 'right') angle = 0;
        if (pacman.dir === 'down') angle = Math.PI / 2;
        if (pacman.dir === 'left') angle = Math.PI;
        if (pacman.dir === 'up') angle = -Math.PI / 2;

        ctx.save();
        ctx.fillStyle = '#ffff00';
        ctx.shadowColor = '#ffff00';
        ctx.shadowBlur = 15 * scale;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, r, angle + mouth, angle + Math.PI * 2 - mouth, false);
        ctx.closePath();
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.restore();
    }

    function drawPacmanDeath(time) {
        const s = TILE * scale;
        const x = pacman.col * s + s / 2;
        const y = pacman.row * s + s / 2;
        const r = s * 0.55;

        const openAngle = deathAngle * Math.PI;

        ctx.save();
        ctx.fillStyle = '#ffff00';
        ctx.shadowColor = '#ffff00';
        ctx.shadowBlur = 10 * scale;
        ctx.globalAlpha = 1 - deathAngle * 0.5;

        if (openAngle < Math.PI) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.arc(x, y, r, -Math.PI / 2 + openAngle, -Math.PI / 2 + Math.PI * 2 - openAngle, false);
            ctx.closePath();
            ctx.fill();
        }

        ctx.restore();
    }

    function drawFruit(time) {
        if (!fruit) return;
        const s = TILE * scale;
        const x = fruit.col * s + s / 2;
        const y = fruit.row * s + s / 2;
        const r = s * 0.4;

        // Pulsing glow
        const pulse = 0.8 + 0.2 * Math.sin(time * 0.006);

        ctx.save();
        ctx.fillStyle = fruit.color;
        ctx.shadowColor = fruit.color;
        ctx.shadowBlur = 12 * scale * pulse;

        // Simple fruit shape (circle with stem)
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();

        // Stem
        ctx.strokeStyle = '#44aa22';
        ctx.lineWidth = 2 * scale;
        ctx.beginPath();
        ctx.moveTo(x, y - r);
        ctx.quadraticCurveTo(x + r * 0.3, y - r - s * 0.15, x + r * 0.5, y - r + s * 0.05);
        ctx.stroke();

        ctx.shadowBlur = 0;

        // Fruit name
        ctx.fillStyle = '#ffffff';
        ctx.font = `${Math.floor(7 * scale)}px "Press Start 2P", monospace`;
        ctx.textAlign = 'center';
        ctx.globalAlpha = 0.7;
        ctx.fillText(fruit.points.toString(), x, y + r + 10 * scale);
        ctx.globalAlpha = 1;

        ctx.restore();
    }

    function getState() { return state; }
    function getScore() { return score; }
    function getHighScore() { return highScore; }
    function getLives() { return lives; }
    function getLevel() { return level; }
    function getPacman() { return pacman; }

    window.PacEngine = {
        initCanvas, startGame, setDirection,
        setCallbacks, resize,
        getState, getScore, getHighScore,
        getLives, getLevel, getPacman,
    };
})();
