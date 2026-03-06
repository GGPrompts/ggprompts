// Neon Breaker - Arkanoid Clone Engine
// Paddle, ball, destructible bricks, power-ups, level progression
(function() {
    'use strict';

    // ========== Constants ==========
    var FIELD_W = 480;
    var FIELD_H = 720;
    var PADDLE_W = 80;
    var PADDLE_H = 14;
    var PADDLE_Y_OFF = 50; // from bottom
    var PADDLE_SPEED = 600;
    var BALL_R = 6;
    var BALL_SPEED_BASE = 340;
    var BALL_SPEED_MAX = 560;
    var BALL_SPEED_INCREMENT = 8;
    var BRICK_COLS = 10;
    var BRICK_ROWS_MAX = 12;
    var BRICK_W = 42;
    var BRICK_H = 18;
    var BRICK_PAD = 4;
    var BRICK_OFFSET_X = 12;
    var BRICK_OFFSET_Y = 60;
    var LIVES_START = 3;
    var POWERUP_DROP_CHANCE = 0.18;
    var POWERUP_SPEED = 120;
    var POWERUP_DURATION = 12000; // ms
    var SLOW_FACTOR = 0.6;
    var WIDE_FACTOR = 1.6;
    var LASER_COOLDOWN = 200; // ms
    var LASER_SPEED = 500;

    // ========== Colors ==========
    var C = {
        bg: '#0a0014',
        bgTop: '#140028',
        bgBot: '#0a0014',
        cyan: '#00e5ff',
        pink: '#ff2d7b',
        yellow: '#ffe234',
        green: '#39ff14',
        purple: '#b24dff',
        orange: '#ff6e1a',
        blue: '#2d7bff',
        white: '#ffffff',
        chrome: '#c0c0c0',
        text: '#e8e0f0',
        dim: 'rgba(232, 224, 240, 0.4)',
        wall: '#1a0a3a',
        wallBright: '#3a2a6a'
    };

    var BRICK_COLORS = [
        { fill: '#ff2d7b', glow: 'rgba(255,45,123,0.5)', edge: '#cc1a60' },   // pink
        { fill: '#ff6e1a', glow: 'rgba(255,110,26,0.5)', edge: '#cc5510' },   // orange
        { fill: '#ffe234', glow: 'rgba(255,226,52,0.5)', edge: '#ccb020' },   // yellow
        { fill: '#39ff14', glow: 'rgba(57,255,20,0.5)',  edge: '#2acc10' },   // green
        { fill: '#00e5ff', glow: 'rgba(0,229,255,0.5)',  edge: '#00b8cc' },   // cyan
        { fill: '#2d7bff', glow: 'rgba(45,123,255,0.5)', edge: '#1a5ecc' },   // blue
        { fill: '#b24dff', glow: 'rgba(178,77,255,0.5)', edge: '#8a33cc' },   // purple
        { fill: '#ff2daa', glow: 'rgba(255,45,170,0.5)', edge: '#cc1a88' }    // magenta
    ];

    var SILVER_BRICK = { fill: '#a0a0b0', glow: 'rgba(160,160,176,0.4)', edge: '#707080' };
    var GOLD_BRICK = { fill: '#d4a017', glow: 'rgba(212,160,23,0.5)', edge: '#a07810' };

    // Power-up types
    var PU = {
        MULTIBALL: 0,
        LASER: 1,
        WIDEN: 2,
        SLOW: 3,
        EXTRA_LIFE: 4
    };

    var PU_COLORS = {};
    PU_COLORS[PU.MULTIBALL] = { fill: C.cyan, label: 'M', name: 'MULTI' };
    PU_COLORS[PU.LASER] = { fill: C.pink, label: 'L', name: 'LASER' };
    PU_COLORS[PU.WIDEN] = { fill: C.green, label: 'W', name: 'WIDE' };
    PU_COLORS[PU.SLOW] = { fill: C.yellow, label: 'S', name: 'SLOW' };
    PU_COLORS[PU.EXTRA_LIFE] = { fill: C.purple, label: '+', name: '+1 UP' };

    // ========== Game State ==========
    var canvas, ctx;
    var scale = 1, offsetX = 0, offsetY = 0;
    var gameState = 'title'; // title, playing, paused, levelClear, gameOver
    var score = 0;
    var highScore = parseInt(localStorage.getItem('neonbreaker_hi') || '0', 10);
    var lives = LIVES_START;
    var level = 1;
    var lastTime = 0;
    var neonPulse = 0;

    // Paddle
    var paddle = { x: FIELD_W / 2, w: PADDLE_W, h: PADDLE_H };
    var paddleY = FIELD_H - PADDLE_Y_OFF;

    // Balls
    var balls = [];

    // Bricks
    var bricks = [];
    var bricksTotal = 0;
    var bricksRemaining = 0;

    // Power-ups
    var powerups = [];
    var activePowerups = {}; // type -> expiry timestamp

    // Lasers
    var lasers = [];
    var lastLaserTime = 0;

    // Particles
    var particles = [];

    // Screen shake
    var shakeAmount = 0;
    var shakeDuration = 0;

    // Messages
    var messageText = '';
    var messageTimer = 0;

    // Level clear animation
    var levelClearTimer = 0;

    // Input
    var keys = {};
    var mouseX = FIELD_W / 2;
    var useMouseControl = false;
    var touchActive = false;

    // Audio
    var audioCtx = null;
    var soundEnabled = true;

    // ========== Audio ==========
    function initAudio() {
        if (audioCtx) return;
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        } catch(e) {
            soundEnabled = false;
        }
    }

    function playTone(freq, duration, type, vol) {
        if (!soundEnabled || !audioCtx) return;
        try {
            var osc = audioCtx.createOscillator();
            var gain = audioCtx.createGain();
            osc.type = type || 'square';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gain.gain.setValueAtTime(vol || 0.08, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + (duration || 0.1));
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + (duration || 0.1));
        } catch(e) {}
    }

    function sfxBounce() { playTone(440, 0.06, 'square', 0.06); }
    function sfxBrick(row) { playTone(300 + row * 40, 0.1, 'square', 0.08); }
    function sfxWall() { playTone(220, 0.04, 'triangle', 0.05); }
    function sfxPowerup() { playTone(660, 0.08, 'sine', 0.1); playTone(880, 0.12, 'sine', 0.08); }
    function sfxLaser() { playTone(1200, 0.05, 'sawtooth', 0.04); }
    function sfxLose() { playTone(200, 0.3, 'sawtooth', 0.1); playTone(150, 0.4, 'sawtooth', 0.08); }
    function sfxLevelClear() {
        for (var i = 0; i < 5; i++) {
            setTimeout(function(idx) { return function() { playTone(400 + idx * 100, 0.15, 'sine', 0.1); }; }(i), i * 80);
        }
    }

    // ========== Level Generation ==========
    function generateLevel(lvl) {
        bricks = [];
        bricksTotal = 0;
        bricksRemaining = 0;

        var rows = Math.min(4 + Math.floor(lvl * 0.8), BRICK_ROWS_MAX);
        var pattern = lvl % 6;

        for (var r = 0; r < rows; r++) {
            for (var c = 0; c < BRICK_COLS; c++) {
                var x = BRICK_OFFSET_X + c * (BRICK_W + BRICK_PAD);
                var y = BRICK_OFFSET_Y + r * (BRICK_H + BRICK_PAD);

                var skip = false;

                // Patterns for variety
                if (pattern === 1 && (r + c) % 3 === 0) skip = true;  // checkerboard gaps
                if (pattern === 2 && Math.abs(c - 4.5) > rows - r) skip = true;  // pyramid
                if (pattern === 3 && r % 2 === 0 && (c === 0 || c === BRICK_COLS - 1)) skip = true;  // corridors
                if (pattern === 4 && ((r === Math.floor(rows/2) && c > 2 && c < 7))) skip = true;  // hole in middle
                if (pattern === 5 && (r + c) % 2 === 0 && r < 3) skip = true;  // sparse top

                if (skip) continue;

                var hp = 1;
                var type = 'normal';
                var colorIdx = r % BRICK_COLORS.length;

                // Silver bricks (2 HP) appear from level 3
                if (lvl >= 3 && Math.random() < 0.1 + lvl * 0.02) {
                    hp = 2;
                    type = 'silver';
                }
                // Gold bricks (3 HP) appear from level 6
                if (lvl >= 6 && Math.random() < 0.05 + lvl * 0.01) {
                    hp = 3;
                    type = 'gold';
                }

                bricks.push({
                    x: x, y: y,
                    w: BRICK_W, h: BRICK_H,
                    hp: hp, maxHp: hp,
                    type: type,
                    colorIdx: colorIdx,
                    flash: 0
                });
                bricksTotal++;
                bricksRemaining++;
            }
        }
    }

    // ========== Ball Management ==========
    function createBall(x, y, dx, dy) {
        var speed = BALL_SPEED_BASE + (level - 1) * BALL_SPEED_INCREMENT;
        if (activePowerups[PU.SLOW] && activePowerups[PU.SLOW] > performance.now()) {
            speed *= SLOW_FACTOR;
        }
        speed = Math.min(speed, BALL_SPEED_MAX);

        if (dx === undefined) {
            // Launch angle: random slight offset from straight up
            var angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.6;
            dx = Math.cos(angle);
            dy = Math.sin(angle);
        }
        var len = Math.sqrt(dx * dx + dy * dy);
        dx = dx / len * speed;
        dy = dy / len * speed;

        balls.push({ x: x, y: y, dx: dx, dy: dy, speed: speed, trail: [] });
    }

    function resetBall() {
        balls = [];
        createBall(paddle.x, paddleY - BALL_R - 2);
        // Reset active powerups
        activePowerups = {};
        paddle.w = PADDLE_W;
        lasers = [];
    }

    // ========== Power-up Management ==========
    function spawnPowerup(x, y) {
        if (Math.random() > POWERUP_DROP_CHANCE) return;

        var types = [PU.MULTIBALL, PU.LASER, PU.WIDEN, PU.SLOW];
        // Extra life is rare
        if (Math.random() < 0.08) types.push(PU.EXTRA_LIFE);

        var type = types[Math.floor(Math.random() * types.length)];
        powerups.push({ x: x, y: y, type: type, w: 28, h: 14 });
    }

    function activatePowerup(type) {
        sfxPowerup();
        var now = performance.now();

        switch (type) {
            case PU.MULTIBALL:
                // Add 2 extra balls from paddle
                if (balls.length > 0) {
                    var b = balls[0];
                    createBall(b.x, b.y, b.dx + 80, b.dy);
                    createBall(b.x, b.y, b.dx - 80, b.dy);
                } else {
                    createBall(paddle.x - 20, paddleY - BALL_R - 2);
                    createBall(paddle.x + 20, paddleY - BALL_R - 2);
                }
                showMessage('MULTIBALL!');
                break;
            case PU.LASER:
                activePowerups[PU.LASER] = now + POWERUP_DURATION;
                showMessage('LASER!');
                break;
            case PU.WIDEN:
                activePowerups[PU.WIDEN] = now + POWERUP_DURATION;
                paddle.w = PADDLE_W * WIDE_FACTOR;
                showMessage('WIDE PADDLE!');
                break;
            case PU.SLOW:
                activePowerups[PU.SLOW] = now + POWERUP_DURATION;
                // Slow existing balls
                for (var i = 0; i < balls.length; i++) {
                    balls[i].speed *= SLOW_FACTOR;
                    var len = Math.sqrt(balls[i].dx * balls[i].dx + balls[i].dy * balls[i].dy);
                    if (len > 0) {
                        balls[i].dx = balls[i].dx / len * balls[i].speed;
                        balls[i].dy = balls[i].dy / len * balls[i].speed;
                    }
                }
                showMessage('SLOW!');
                break;
            case PU.EXTRA_LIFE:
                lives++;
                showMessage('+1 LIFE!');
                break;
        }
    }

    // ========== Particles ==========
    function spawnParticles(x, y, color, count) {
        for (var i = 0; i < count; i++) {
            var angle = Math.random() * Math.PI * 2;
            var speed = 40 + Math.random() * 160;
            particles.push({
                x: x, y: y,
                dx: Math.cos(angle) * speed,
                dy: Math.sin(angle) * speed,
                life: 0.4 + Math.random() * 0.4,
                maxLife: 0.4 + Math.random() * 0.4,
                color: color,
                size: 2 + Math.random() * 3
            });
        }
    }

    function addShake(amount, duration) {
        shakeAmount = Math.max(shakeAmount, amount);
        shakeDuration = Math.max(shakeDuration, duration);
    }

    function showMessage(text, dur) {
        messageText = text;
        messageTimer = dur || 1.5;
    }

    // ========== Update ==========
    function update(dt) {
        neonPulse += dt * 2;

        // Update message timer
        if (messageTimer > 0) messageTimer -= dt;

        // Update shake
        if (shakeDuration > 0) {
            shakeDuration -= dt;
            if (shakeDuration <= 0) { shakeAmount = 0; shakeDuration = 0; }
        }

        if (gameState === 'levelClear') {
            levelClearTimer -= dt;
            if (levelClearTimer <= 0) {
                level++;
                startLevel();
            }
            return;
        }

        if (gameState !== 'playing') return;

        var now = performance.now();

        // Check powerup expiry
        if (activePowerups[PU.WIDEN] && activePowerups[PU.WIDEN] < now) {
            paddle.w = PADDLE_W;
            delete activePowerups[PU.WIDEN];
        }
        if (activePowerups[PU.LASER] && activePowerups[PU.LASER] < now) {
            delete activePowerups[PU.LASER];
        }
        if (activePowerups[PU.SLOW] && activePowerups[PU.SLOW] < now) {
            // Restore ball speeds
            for (var i = 0; i < balls.length; i++) {
                var b = balls[i];
                var spd = BALL_SPEED_BASE + (level - 1) * BALL_SPEED_INCREMENT;
                spd = Math.min(spd, BALL_SPEED_MAX);
                var len = Math.sqrt(b.dx * b.dx + b.dy * b.dy);
                if (len > 0) {
                    b.dx = b.dx / len * spd;
                    b.dy = b.dy / len * spd;
                }
                b.speed = spd;
            }
            delete activePowerups[PU.SLOW];
        }

        // Move paddle
        updatePaddle(dt);

        // Shoot lasers
        if (activePowerups[PU.LASER] && activePowerups[PU.LASER] > now) {
            if ((keys['Space'] || keys['KeyZ']) && now - lastLaserTime > LASER_COOLDOWN) {
                lastLaserTime = now;
                lasers.push({ x: paddle.x - paddle.w / 2 + 4, y: paddleY - 6, w: 3, h: 10 });
                lasers.push({ x: paddle.x + paddle.w / 2 - 7, y: paddleY - 6, w: 3, h: 10 });
                sfxLaser();
            }
        }

        // Update lasers
        for (var li = lasers.length - 1; li >= 0; li--) {
            lasers[li].y -= LASER_SPEED * dt;
            if (lasers[li].y < 0) { lasers.splice(li, 1); continue; }

            // Laser-brick collision
            for (var bi = bricks.length - 1; bi >= 0; bi--) {
                var br = bricks[bi];
                var lz = lasers[li];
                if (!lz) break;
                if (lz.x < br.x + br.w && lz.x + lz.w > br.x &&
                    lz.y < br.y + br.h && lz.y + lz.h > br.y) {
                    hitBrick(bi);
                    lasers.splice(li, 1);
                    break;
                }
            }
        }

        // Update balls
        for (var i = balls.length - 1; i >= 0; i--) {
            var ball = balls[i];
            updateBall(ball, dt);

            // Store trail
            ball.trail.push({ x: ball.x, y: ball.y });
            if (ball.trail.length > 12) ball.trail.shift();

            // Ball lost below screen
            if (ball.y > FIELD_H + BALL_R * 2) {
                balls.splice(i, 1);
            }
        }

        // All balls lost
        if (balls.length === 0) {
            lives--;
            sfxLose();
            addShake(6, 0.3);
            if (lives <= 0) {
                gameState = 'gameOver';
                if (score > highScore) {
                    highScore = score;
                    localStorage.setItem('neonbreaker_hi', highScore.toString());
                    showMessage('NEW HIGH SCORE!', 3);
                }
            } else {
                showMessage('BALL LOST', 1.5);
                resetBall();
            }
        }

        // Update powerups (falling)
        for (var pi = powerups.length - 1; pi >= 0; pi--) {
            var pu = powerups[pi];
            pu.y += POWERUP_SPEED * dt;

            // Catch with paddle
            if (pu.y + pu.h > paddleY && pu.y < paddleY + paddle.h &&
                pu.x + pu.w > paddle.x - paddle.w / 2 && pu.x < paddle.x + paddle.w / 2) {
                activatePowerup(pu.type);
                spawnParticles(pu.x + pu.w / 2, pu.y, PU_COLORS[pu.type].fill, 8);
                powerups.splice(pi, 1);
                continue;
            }

            // Off screen
            if (pu.y > FIELD_H + 20) {
                powerups.splice(pi, 1);
            }
        }

        // Update particles
        for (var pi = particles.length - 1; pi >= 0; pi--) {
            var p = particles[pi];
            p.x += p.dx * dt;
            p.y += p.dy * dt;
            p.dy += 200 * dt; // gravity
            p.life -= dt;
            if (p.life <= 0) particles.splice(pi, 1);
        }

        // Check level clear
        if (bricksRemaining <= 0) {
            gameState = 'levelClear';
            levelClearTimer = 2;
            sfxLevelClear();
            // Bonus points
            var bonus = level * 100 + lives * 50;
            score += bonus;
            showMessage('LEVEL ' + level + ' CLEAR! +' + bonus, 2);
        }
    }

    function updatePaddle(dt) {
        var targetX = paddle.x;
        var halfW = paddle.w / 2;

        if (useMouseControl || touchActive) {
            targetX = mouseX;
        } else {
            if (keys['ArrowLeft'] || keys['KeyA']) targetX -= PADDLE_SPEED * dt;
            if (keys['ArrowRight'] || keys['KeyD']) targetX += PADDLE_SPEED * dt;
        }

        // Clamp to field
        paddle.x = Math.max(halfW, Math.min(FIELD_W - halfW, targetX));
    }

    function updateBall(ball, dt) {
        ball.x += ball.dx * dt;
        ball.y += ball.dy * dt;

        // Wall collisions
        // Left wall
        if (ball.x - BALL_R < 0) {
            ball.x = BALL_R;
            ball.dx = Math.abs(ball.dx);
            sfxWall();
        }
        // Right wall
        if (ball.x + BALL_R > FIELD_W) {
            ball.x = FIELD_W - BALL_R;
            ball.dx = -Math.abs(ball.dx);
            sfxWall();
        }
        // Top wall
        if (ball.y - BALL_R < 0) {
            ball.y = BALL_R;
            ball.dy = Math.abs(ball.dy);
            sfxWall();
        }

        // Paddle collision
        var halfPW = paddle.w / 2;
        if (ball.dy > 0 &&
            ball.y + BALL_R >= paddleY && ball.y + BALL_R <= paddleY + paddle.h + 4 &&
            ball.x >= paddle.x - halfPW - BALL_R && ball.x <= paddle.x + halfPW + BALL_R) {

            ball.y = paddleY - BALL_R;

            // Reflect angle based on where it hit the paddle
            var hitPos = (ball.x - paddle.x) / halfPW; // -1 to 1
            hitPos = Math.max(-1, Math.min(1, hitPos));

            var angle = hitPos * (Math.PI / 3); // max 60 degrees
            angle = angle - Math.PI / 2; // offset to go upward

            ball.dx = Math.cos(angle) * ball.speed;
            ball.dy = Math.sin(angle) * ball.speed;

            // Ensure ball goes upward
            if (ball.dy > -30) ball.dy = -30;

            sfxBounce();
        }

        // Brick collisions
        for (var i = bricks.length - 1; i >= 0; i--) {
            var br = bricks[i];
            if (rectCircle(br.x, br.y, br.w, br.h, ball.x, ball.y, BALL_R)) {
                // Determine reflection side
                var cx = ball.x, cy = ball.y;
                var bx = br.x, by = br.y, bw = br.w, bh = br.h;

                var overlapLeft = (cx + BALL_R) - bx;
                var overlapRight = (bx + bw) - (cx - BALL_R);
                var overlapTop = (cy + BALL_R) - by;
                var overlapBottom = (by + bh) - (cy - BALL_R);

                var minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

                if (minOverlap === overlapLeft || minOverlap === overlapRight) {
                    ball.dx = -ball.dx;
                } else {
                    ball.dy = -ball.dy;
                }

                hitBrick(i);
                break; // Only hit one brick per frame
            }
        }
    }

    function hitBrick(idx) {
        var br = bricks[idx];
        br.hp--;
        br.flash = 0.15;

        var brickColor;
        if (br.type === 'gold') brickColor = GOLD_BRICK.fill;
        else if (br.type === 'silver') brickColor = SILVER_BRICK.fill;
        else brickColor = BRICK_COLORS[br.colorIdx].fill;

        if (br.hp <= 0) {
            // Destroy brick
            var cx = br.x + br.w / 2;
            var cy = br.y + br.h / 2;
            spawnParticles(cx, cy, brickColor, 10);
            addShake(2, 0.1);
            sfxBrick(Math.floor((br.y - BRICK_OFFSET_Y) / (BRICK_H + BRICK_PAD)));

            // Score: higher rows worth more
            var row = Math.floor((br.y - BRICK_OFFSET_Y) / (BRICK_H + BRICK_PAD));
            var points = (row + 1) * 10;
            if (br.type === 'silver') points *= 2;
            if (br.type === 'gold') points *= 3;
            score += points;

            spawnPowerup(cx - 14, cy);
            bricks.splice(idx, 1);
            bricksRemaining--;
        } else {
            // Just damaged
            addShake(1, 0.05);
            spawnParticles(br.x + br.w / 2, br.y + br.h / 2, brickColor, 4);
            sfxBrick(Math.floor((br.y - BRICK_OFFSET_Y) / (BRICK_H + BRICK_PAD)));
        }
    }

    function rectCircle(rx, ry, rw, rh, cx, cy, cr) {
        var nearX = Math.max(rx, Math.min(cx, rx + rw));
        var nearY = Math.max(ry, Math.min(cy, ry + rh));
        var dx = cx - nearX;
        var dy = cy - nearY;
        return dx * dx + dy * dy < cr * cr;
    }

    // ========== Rendering ==========
    function render() {
        ctx.save();

        // Screen shake
        var sx = 0, sy = 0;
        if (shakeAmount > 0 && shakeDuration > 0) {
            sx = (Math.random() - 0.5) * shakeAmount * 2;
            sy = (Math.random() - 0.5) * shakeAmount * 2;
        }

        ctx.setTransform(scale, 0, 0, scale, offsetX + sx * scale, offsetY + sy * scale);

        // Background
        var bgGrad = ctx.createLinearGradient(0, 0, 0, FIELD_H);
        bgGrad.addColorStop(0, C.bgTop);
        bgGrad.addColorStop(1, C.bgBot);
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, FIELD_W, FIELD_H);

        // Grid lines for depth
        ctx.strokeStyle = 'rgba(100, 60, 180, 0.06)';
        ctx.lineWidth = 1;
        for (var gx = 0; gx < FIELD_W; gx += 48) {
            ctx.beginPath();
            ctx.moveTo(gx, 0);
            ctx.lineTo(gx, FIELD_H);
            ctx.stroke();
        }
        for (var gy = 0; gy < FIELD_H; gy += 48) {
            ctx.beginPath();
            ctx.moveTo(0, gy);
            ctx.lineTo(FIELD_W, gy);
            ctx.stroke();
        }

        // Side walls
        var wallGlow = 0.3 + Math.sin(neonPulse) * 0.1;
        ctx.fillStyle = 'rgba(100, 60, 200, ' + wallGlow * 0.2 + ')';
        ctx.fillRect(0, 0, 3, FIELD_H);
        ctx.fillRect(FIELD_W - 3, 0, 3, FIELD_H);
        ctx.fillRect(0, 0, FIELD_W, 3);

        // Render bricks
        renderBricks();

        // Render powerups
        renderPowerups();

        // Render lasers
        renderLasers();

        // Render particles
        renderParticles();

        // Render balls
        renderBalls();

        // Render paddle
        renderPaddle();

        // HUD
        renderHUD();

        // Messages
        if (messageTimer > 0) {
            var alpha = Math.min(1, messageTimer);
            ctx.globalAlpha = alpha;
            ctx.font = '600 22px Orbitron';
            ctx.textAlign = 'center';
            ctx.fillStyle = C.cyan;
            ctx.shadowColor = C.cyan;
            ctx.shadowBlur = 16;
            ctx.fillText(messageText, FIELD_W / 2, FIELD_H / 2);
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
        }

        // Title screen
        if (gameState === 'title') {
            renderTitle();
        }

        // Game over screen
        if (gameState === 'gameOver') {
            renderGameOver();
        }

        // Paused
        if (gameState === 'paused') {
            ctx.fillStyle = 'rgba(10, 0, 20, 0.7)';
            ctx.fillRect(0, 0, FIELD_W, FIELD_H);
            ctx.font = '700 32px Orbitron';
            ctx.textAlign = 'center';
            ctx.fillStyle = C.cyan;
            ctx.shadowColor = C.cyan;
            ctx.shadowBlur = 20;
            ctx.fillText('PAUSED', FIELD_W / 2, FIELD_H / 2 - 10);
            ctx.shadowBlur = 0;
            ctx.font = '14px "Share Tech Mono"';
            ctx.fillStyle = C.dim;
            ctx.fillText('Press P or ESC to resume', FIELD_W / 2, FIELD_H / 2 + 25);
        }

        ctx.restore();
    }

    function renderBricks() {
        for (var i = 0; i < bricks.length; i++) {
            var br = bricks[i];
            var col;
            if (br.type === 'gold') col = GOLD_BRICK;
            else if (br.type === 'silver') col = SILVER_BRICK;
            else col = BRICK_COLORS[br.colorIdx];

            // Flash on hit
            if (br.flash > 0) {
                br.flash -= 0.016;
                ctx.fillStyle = C.white;
            } else {
                ctx.fillStyle = col.fill;
            }

            // Glow
            ctx.shadowColor = col.glow;
            ctx.shadowBlur = 8;

            // Draw brick body
            ctx.beginPath();
            roundRect(ctx, br.x, br.y, br.w, br.h, 3);
            ctx.fill();

            ctx.shadowBlur = 0;

            // Edge highlight (top)
            ctx.fillStyle = 'rgba(255,255,255,0.2)';
            ctx.fillRect(br.x + 1, br.y + 1, br.w - 2, 3);

            // Edge shadow (bottom)
            ctx.fillStyle = col.edge;
            ctx.fillRect(br.x + 1, br.y + br.h - 3, br.w - 2, 2);

            // HP indicator for multi-hit bricks
            if (br.maxHp > 1) {
                ctx.font = '9px "Share Tech Mono"';
                ctx.textAlign = 'center';
                ctx.fillStyle = 'rgba(0,0,0,0.6)';
                ctx.fillText(br.hp.toString(), br.x + br.w / 2, br.y + br.h / 2 + 3);
            }
        }
    }

    function renderPaddle() {
        var px = paddle.x - paddle.w / 2;
        var py = paddleY;
        var pw = paddle.w;
        var ph = paddle.h;

        // Paddle glow
        ctx.shadowColor = C.cyan;
        ctx.shadowBlur = 16 + Math.sin(neonPulse * 1.5) * 4;

        // Main body
        var pGrad = ctx.createLinearGradient(px, py, px, py + ph);
        pGrad.addColorStop(0, '#00c8e8');
        pGrad.addColorStop(0.5, '#0090a8');
        pGrad.addColorStop(1, '#006878');
        ctx.fillStyle = pGrad;
        ctx.beginPath();
        roundRect(ctx, px, py, pw, ph, 5);
        ctx.fill();

        ctx.shadowBlur = 0;

        // Top edge highlight
        ctx.fillStyle = 'rgba(0, 229, 255, 0.5)';
        ctx.fillRect(px + 4, py + 1, pw - 8, 2);

        // Laser indicators
        if (activePowerups[PU.LASER] && activePowerups[PU.LASER] > performance.now()) {
            ctx.fillStyle = C.pink;
            ctx.shadowColor = C.pink;
            ctx.shadowBlur = 8;
            ctx.fillRect(px + 2, py - 4, 3, 6);
            ctx.fillRect(px + pw - 5, py - 4, 3, 6);
            ctx.shadowBlur = 0;
        }
    }

    function renderBalls() {
        for (var i = 0; i < balls.length; i++) {
            var b = balls[i];

            // Trail
            ctx.globalAlpha = 0.3;
            for (var t = 0; t < b.trail.length; t++) {
                var tAlpha = t / b.trail.length * 0.3;
                var tSize = BALL_R * (t / b.trail.length) * 0.8;
                ctx.beginPath();
                ctx.arc(b.trail[t].x, b.trail[t].y, tSize, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 229, 255, ' + tAlpha + ')';
                ctx.fill();
            }
            ctx.globalAlpha = 1;

            // Ball glow
            ctx.shadowColor = C.cyan;
            ctx.shadowBlur = 12;

            // Ball body
            ctx.beginPath();
            ctx.arc(b.x, b.y, BALL_R, 0, Math.PI * 2);
            ctx.fillStyle = C.white;
            ctx.fill();

            ctx.shadowBlur = 0;

            // Inner shine
            ctx.beginPath();
            ctx.arc(b.x - 1.5, b.y - 1.5, BALL_R * 0.4, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,0.8)';
            ctx.fill();
        }
    }

    function renderPowerups() {
        var now = performance.now();
        for (var i = 0; i < powerups.length; i++) {
            var pu = powerups[i];
            var info = PU_COLORS[pu.type];

            // Pulsing glow
            var pulse = 0.6 + Math.sin(now * 0.006 + i) * 0.3;
            ctx.shadowColor = info.fill;
            ctx.shadowBlur = 10 * pulse;

            ctx.fillStyle = info.fill;
            ctx.beginPath();
            roundRect(ctx, pu.x, pu.y, pu.w, pu.h, 4);
            ctx.fill();

            ctx.shadowBlur = 0;

            // Label
            ctx.font = 'bold 9px "Share Tech Mono"';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#000';
            ctx.fillText(info.label, pu.x + pu.w / 2, pu.y + pu.h / 2 + 3);
        }
    }

    function renderLasers() {
        ctx.shadowColor = C.pink;
        ctx.shadowBlur = 8;
        ctx.fillStyle = C.pink;
        for (var i = 0; i < lasers.length; i++) {
            var lz = lasers[i];
            ctx.fillRect(lz.x, lz.y, lz.w, lz.h);
        }
        ctx.shadowBlur = 0;
    }

    function renderParticles() {
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            var alpha = p.life / p.maxLife;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 4;
            ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        }
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
    }

    function renderHUD() {
        // Score
        ctx.font = '600 16px Orbitron';
        ctx.textAlign = 'left';
        ctx.fillStyle = C.text;
        ctx.fillText('SCORE', 10, 22);
        ctx.font = '700 20px Orbitron';
        ctx.fillStyle = C.yellow;
        ctx.fillText(score.toString(), 10, 46);

        // High score
        ctx.font = '12px "Share Tech Mono"';
        ctx.textAlign = 'center';
        ctx.fillStyle = C.dim;
        ctx.fillText('HI ' + highScore, FIELD_W / 2, 20);

        // Level
        ctx.font = '600 14px Orbitron';
        ctx.fillStyle = C.cyan;
        ctx.fillText('LV ' + level, FIELD_W / 2, 40);

        // Lives
        ctx.textAlign = 'right';
        ctx.font = '600 14px Orbitron';
        ctx.fillStyle = C.text;
        for (var i = 0; i < lives; i++) {
            ctx.fillStyle = C.pink;
            ctx.beginPath();
            ctx.arc(FIELD_W - 18 - i * 22, 34, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.beginPath();
            ctx.arc(FIELD_W - 19.5 - i * 22, 32.5, 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Active powerup indicators
        var now = performance.now();
        var puY = FIELD_H - 20;
        ctx.textAlign = 'left';
        ctx.font = '10px "Share Tech Mono"';
        var puX = 6;
        for (var type in activePowerups) {
            if (activePowerups.hasOwnProperty(type) && activePowerups[type] > now) {
                var remaining = Math.ceil((activePowerups[type] - now) / 1000);
                var info = PU_COLORS[type];
                ctx.fillStyle = info.fill;
                ctx.globalAlpha = 0.7 + Math.sin(now * 0.005) * 0.3;
                ctx.fillText(info.name + ' ' + remaining + 's', puX, puY);
                ctx.globalAlpha = 1;
                puX += 80;
            }
        }
    }

    function renderTitle() {
        ctx.fillStyle = 'rgba(10, 0, 20, 0.85)';
        ctx.fillRect(0, 0, FIELD_W, FIELD_H);

        var cy = FIELD_H / 2;

        // Title
        ctx.font = '900 36px Orbitron';
        ctx.textAlign = 'center';
        ctx.fillStyle = C.cyan;
        ctx.shadowColor = C.cyan;
        ctx.shadowBlur = 30;
        ctx.fillText('NEON', FIELD_W / 2, cy - 50);
        ctx.fillStyle = C.pink;
        ctx.shadowColor = C.pink;
        ctx.fillText('BREAKER', FIELD_W / 2, cy - 8);
        ctx.shadowBlur = 0;

        // Subtitle
        ctx.font = '14px "Share Tech Mono"';
        ctx.fillStyle = C.dim;
        ctx.fillText('Destroy all bricks to advance', FIELD_W / 2, cy + 30);

        // Controls
        ctx.font = '13px "Share Tech Mono"';
        ctx.fillStyle = C.text;
        ctx.fillText('Arrow Keys / Mouse to move', FIELD_W / 2, cy + 70);
        ctx.fillText('Space / Z to shoot lasers', FIELD_W / 2, cy + 90);
        ctx.fillText('P / ESC to pause', FIELD_W / 2, cy + 110);

        // Start prompt
        var blink = Math.sin(neonPulse * 3) > 0 ? 1 : 0.3;
        ctx.globalAlpha = blink;
        ctx.font = '600 18px Orbitron';
        ctx.fillStyle = C.yellow;
        ctx.shadowColor = C.yellow;
        ctx.shadowBlur = 12;
        ctx.fillText('CLICK OR PRESS ENTER', FIELD_W / 2, cy + 155);
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;

        // High score
        if (highScore > 0) {
            ctx.font = '12px "Share Tech Mono"';
            ctx.fillStyle = C.dim;
            ctx.fillText('HIGH SCORE: ' + highScore, FIELD_W / 2, cy + 190);
        }
    }

    function renderGameOver() {
        ctx.fillStyle = 'rgba(10, 0, 20, 0.8)';
        ctx.fillRect(0, 0, FIELD_W, FIELD_H);

        var cy = FIELD_H / 2;

        ctx.font = '700 36px Orbitron';
        ctx.textAlign = 'center';
        ctx.fillStyle = C.pink;
        ctx.shadowColor = C.pink;
        ctx.shadowBlur = 20;
        ctx.fillText('GAME OVER', FIELD_W / 2, cy - 30);
        ctx.shadowBlur = 0;

        ctx.font = '600 20px Orbitron';
        ctx.fillStyle = C.yellow;
        ctx.fillText('SCORE: ' + score, FIELD_W / 2, cy + 15);

        ctx.font = '14px "Share Tech Mono"';
        ctx.fillStyle = C.dim;
        ctx.fillText('Level reached: ' + level, FIELD_W / 2, cy + 45);

        if (score >= highScore && score > 0) {
            ctx.font = '600 16px Orbitron';
            ctx.fillStyle = C.green;
            ctx.shadowColor = C.green;
            ctx.shadowBlur = 12;
            ctx.fillText('NEW HIGH SCORE!', FIELD_W / 2, cy + 75);
            ctx.shadowBlur = 0;
        }

        var blink = Math.sin(neonPulse * 3) > 0 ? 1 : 0.3;
        ctx.globalAlpha = blink;
        ctx.font = '14px "Share Tech Mono"';
        ctx.fillStyle = C.text;
        ctx.fillText('Click or press Enter to restart', FIELD_W / 2, cy + 110);
        ctx.globalAlpha = 1;
    }

    function roundRect(ctx, x, y, w, h, r) {
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.arcTo(x + w, y, x + w, y + r, r);
        ctx.lineTo(x + w, y + h - r);
        ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
        ctx.lineTo(x + r, y + h);
        ctx.arcTo(x, y + h, x, y + h - r, r);
        ctx.lineTo(x, y + r);
        ctx.arcTo(x, y, x + r, y, r);
    }

    // ========== Game Flow ==========
    function startGame() {
        initAudio();
        score = 0;
        lives = LIVES_START;
        level = 1;
        activePowerups = {};
        paddle.w = PADDLE_W;
        balls = [];
        powerups = [];
        lasers = [];
        particles = [];
        startLevel();
    }

    function startLevel() {
        generateLevel(level);
        resetBall();
        powerups = [];
        lasers = [];
        gameState = 'playing';
        showMessage('LEVEL ' + level, 1.5);
    }

    // ========== Input ==========
    function setupInput() {
        window.addEventListener('keydown', function(e) {
            keys[e.code] = true;

            if (e.code === 'Enter' || e.code === 'Space') {
                e.preventDefault();
                if (gameState === 'title' || gameState === 'gameOver') {
                    startGame();
                }
            }

            if (e.code === 'KeyP' || e.code === 'Escape') {
                if (gameState === 'playing') {
                    gameState = 'paused';
                } else if (gameState === 'paused') {
                    gameState = 'playing';
                }
            }
        });

        window.addEventListener('keyup', function(e) {
            keys[e.code] = false;
        });

        // Mouse control
        canvas.addEventListener('mousemove', function(e) {
            useMouseControl = true;
            var rect = canvas.getBoundingClientRect();
            mouseX = (e.clientX - rect.left) / scale;
            // Keep within [0, FIELD_W] but updatePaddle clamps further
        });

        canvas.addEventListener('click', function(e) {
            initAudio();
            if (gameState === 'title' || gameState === 'gameOver') {
                startGame();
            }
        });

        // Touch support
        canvas.addEventListener('touchstart', function(e) {
            e.preventDefault();
            initAudio();
            touchActive = true;
            handleTouch(e);
            if (gameState === 'title' || gameState === 'gameOver') {
                startGame();
            }
        }, { passive: false });

        canvas.addEventListener('touchmove', function(e) {
            e.preventDefault();
            handleTouch(e);
        }, { passive: false });

        canvas.addEventListener('touchend', function(e) {
            touchActive = false;
        });

        // Mute button
        var muteBtn = document.getElementById('mute-btn');
        muteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            soundEnabled = !soundEnabled;
            muteBtn.textContent = 'Sound: ' + (soundEnabled ? 'ON' : 'OFF');
        });
    }

    function handleTouch(e) {
        if (e.touches.length > 0) {
            var rect = canvas.getBoundingClientRect();
            mouseX = (e.touches[0].clientX - rect.left - offsetX / scale) / scale;
        }
    }

    // ========== Resize ==========
    function resize() {
        var dpr = window.devicePixelRatio || 1;
        var maxW = window.innerWidth;
        var maxH = window.innerHeight;

        var scaleX = maxW / FIELD_W;
        var scaleY = maxH / FIELD_H;
        scale = Math.min(scaleX, scaleY);

        var cw = FIELD_W * scale;
        var ch = FIELD_H * scale;

        canvas.width = cw * dpr;
        canvas.height = ch * dpr;
        canvas.style.width = cw + 'px';
        canvas.style.height = ch + 'px';

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        offsetX = (maxW - cw) / 2;
        offsetY = (maxH - ch) / 2;
        canvas.style.position = 'absolute';
        canvas.style.left = offsetX + 'px';
        canvas.style.top = offsetY + 'px';

        offsetX = 0;
        offsetY = 0;
    }

    // ========== Game Loop ==========
    function loop(timestamp) {
        var dt = (timestamp - lastTime) / 1000;
        lastTime = timestamp;

        // Cap dt to prevent spiral of death
        if (dt > 0.05) dt = 0.05;

        update(dt);
        render();

        requestAnimationFrame(loop);
    }

    // ========== Init ==========
    function init() {
        canvas = document.getElementById('game-canvas');
        ctx = canvas.getContext('2d');

        resize();
        window.addEventListener('resize', resize);
        setupInput();

        lastTime = performance.now();
        requestAnimationFrame(loop);
    }

    // Export
    window.BrickBreaker = { init: init };
})();
