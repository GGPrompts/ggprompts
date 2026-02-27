// Pinball Game Engine
// Main game loop, rendering, input handling, scoring
(function() {
    'use strict';

    var Ball = PinballPhysics.Ball;
    var Vec2 = PinballPhysics.Vec2;

    // ========== Game State ==========
    var canvas, ctx;
    var table;
    var ball;
    var gameState = 'idle'; // idle, plunger, playing, draining, ballSave, gameOver
    var score = 0;
    var highScore = parseInt(localStorage.getItem('pinball_high') || '0', 10);
    var ballsRemaining = 3;
    var currentBall = 0;
    var multiplier = 1;
    var comboCount = 0;
    var comboTimer = 0;
    var lastTime = 0;
    var scale = 1;
    var offsetX = 0, offsetY = 0;
    var plungerPower = 0;
    var plungerCharging = false;
    var ballSaveTimer = 0;
    var ballSaveActive = false;
    var tiltWarnings = 0;
    var tiltLocked = false;
    var tiltShake = 0;
    var messageText = '';
    var messageTimer = 0;
    var drainTimer = 0;
    var allDropTargetsCleared = false;
    var dropTargetResetTimer = 0;
    var neonPulse = 0;

    // Input state
    var keys = {};
    var touchLeft = false, touchRight = false, touchPlunger = false;

    // Colors from casino theme
    var COLORS = {
        bg: '#0c0612',
        bgGradTop: '#1a0a2e',
        bgGradBot: '#0c0612',
        neonPink: '#ff2d7b',
        neonBlue: '#00d4ff',
        neonYellow: '#ffe234',
        neonGreen: '#39ff14',
        gold: '#d4a017',
        goldLight: '#f0c84d',
        chrome: '#c0c0c0',
        velvetRed: '#8b1a2b',
        velvetDeep: '#5c0e1a',
        textLight: '#e8e0d4',
        dimText: 'rgba(232, 224, 212, 0.4)',
        wall: '#4a3a6a',
        wallBright: '#7a6a9a',
        flipper: '#c0c0c0',
        flipperGlow: 'rgba(0, 212, 255, 0.6)',
        bumperRing: '#2a1a4a',
        ballCore: '#ffffff',
        ballGlow: 'rgba(0, 212, 255, 0.8)',
        trail: 'rgba(0, 212, 255, 0.3)',
        plunger: '#d4a017',
        drainZone: 'rgba(139, 26, 43, 0.3)'
    };

    var BUMPER_COLORS = {
        neonPink: { fill: '#ff2d7b', glow: 'rgba(255, 45, 123, 0.6)', ring: '#cc1a60' },
        neonBlue: { fill: '#00d4ff', glow: 'rgba(0, 212, 255, 0.6)', ring: '#0099bb' },
        neonYellow: { fill: '#ffe234', glow: 'rgba(255, 226, 52, 0.6)', ring: '#ccb020' },
        neonGreen: { fill: '#39ff14', glow: 'rgba(57, 255, 20, 0.6)', ring: '#2acc10' }
    };

    // ========== Initialization ==========
    function init() {
        canvas = document.getElementById('pinball-canvas');
        ctx = canvas.getContext('2d');

        table = PinballTable.create();
        ball = new Ball(table.ballStartX, table.ballStartY, table.ballRadius);

        resize();
        window.addEventListener('resize', resize);
        setupInput();

        gameState = 'idle';
        lastTime = performance.now();
        requestAnimationFrame(loop);
    }

    function resize() {
        var dpr = window.devicePixelRatio || 1;
        var maxW = window.innerWidth;
        var maxH = window.innerHeight;

        // Leave space for HUD at top
        var hudH = 60;
        var availH = maxH - hudH;

        // Calculate scale to fit table in available space
        var scaleX = maxW / table.width;
        var scaleY = availH / table.height;
        scale = Math.min(scaleX, scaleY, 2.0); // cap at 2x

        canvas.style.width = Math.floor(table.width * scale) + 'px';
        canvas.style.height = Math.floor(table.height * scale) + 'px';
        canvas.width = Math.floor(table.width * scale * dpr);
        canvas.height = Math.floor(table.height * scale * dpr);
        ctx.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0);
    }

    // ========== Input ==========
    function setupInput() {
        document.addEventListener('keydown', function(e) {
            keys[e.code] = true;

            if (e.code === 'Space') {
                e.preventDefault();
                if (gameState === 'idle' || gameState === 'gameOver') {
                    startGame();
                } else if (gameState === 'playing' && !ball.active) {
                    gameState = 'plunger';
                    plungerCharging = true;
                    plungerPower = 0;
                }
            }

            if (e.code === 'KeyZ' || e.code === 'KeyA' || e.code === 'ShiftLeft') {
                if (table.flippers[0]) table.flippers[0].pressed = true;
                PinballAudio.play('flipper');
            }
            if (e.code === 'KeyX' || e.code === 'KeyD' || e.code === 'ShiftRight') {
                if (table.flippers[1]) table.flippers[1].pressed = true;
                PinballAudio.play('flipper');
            }

            // Tilt / nudge
            if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
                nudge(e.code === 'ArrowLeft' ? -1 : 1);
            }
        });

        document.addEventListener('keyup', function(e) {
            keys[e.code] = false;

            if (e.code === 'Space') {
                if (gameState === 'plunger' && plungerCharging) {
                    launchBall();
                }
            }

            if (e.code === 'KeyZ' || e.code === 'KeyA' || e.code === 'ShiftLeft') {
                if (table.flippers[0]) table.flippers[0].pressed = false;
            }
            if (e.code === 'KeyX' || e.code === 'KeyD' || e.code === 'ShiftRight') {
                if (table.flippers[1]) table.flippers[1].pressed = false;
            }
        });

        // Touch controls
        canvas.addEventListener('touchstart', handleTouch, { passive: false });
        canvas.addEventListener('touchmove', handleTouch, { passive: false });
        canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
    }

    function handleTouch(e) {
        e.preventDefault();
        PinballAudio.init();

        var rect = canvas.getBoundingClientRect();
        var touches = e.touches;
        touchLeft = false;
        touchRight = false;
        touchPlunger = false;

        for (var i = 0; i < touches.length; i++) {
            var tx = (touches[i].clientX - rect.left) / rect.width;
            var ty = (touches[i].clientY - rect.top) / rect.height;

            if (ty > 0.75) {
                // Bottom zone - flippers or plunger
                if (tx < 0.4) {
                    touchLeft = true;
                    if (table.flippers[0] && !table.flippers[0].pressed) {
                        table.flippers[0].pressed = true;
                        PinballAudio.play('flipper');
                    }
                } else if (tx > 0.85) {
                    touchPlunger = true;
                    if (gameState === 'idle' || gameState === 'gameOver') {
                        startGame();
                    } else if (gameState === 'playing' && !ball.active) {
                        gameState = 'plunger';
                        plungerCharging = true;
                    }
                } else {
                    touchRight = true;
                    if (table.flippers[1] && !table.flippers[1].pressed) {
                        table.flippers[1].pressed = true;
                        PinballAudio.play('flipper');
                    }
                }
            } else if (ty < 0.3) {
                // Top tap - nudge
                if (tx < 0.5) nudge(-1);
                else nudge(1);
            }
        }
    }

    function handleTouchEnd(e) {
        e.preventDefault();
        var rect = canvas.getBoundingClientRect();
        var remaining = e.touches;

        // Check what's still being touched
        touchLeft = false;
        touchRight = false;

        for (var i = 0; i < remaining.length; i++) {
            var tx = (remaining[i].clientX - rect.left) / rect.width;
            if (tx < 0.4) touchLeft = true;
            else if (tx > 0.6) touchRight = true;
        }

        if (!touchLeft && table.flippers[0]) table.flippers[0].pressed = false;
        if (!touchRight && table.flippers[1]) table.flippers[1].pressed = false;

        if (gameState === 'plunger' && plungerCharging) {
            launchBall();
        }
        touchPlunger = false;
    }

    // ========== Game Logic ==========
    function startGame() {
        score = 0;
        ballsRemaining = 3;
        currentBall = 0;
        multiplier = 1;
        comboCount = 0;
        comboTimer = 0;
        tiltWarnings = 0;
        tiltLocked = false;
        allDropTargetsCleared = false;

        // Reset targets
        for (var i = 0; i < table.dropTargets.length; i++) {
            table.dropTargets[i].active = true;
        }
        for (var j = 0; j < table.rollovers.length; j++) {
            table.rollovers[j].lit = false;
        }

        resetBall();
        gameState = 'plunger';
        plungerCharging = true;
        plungerPower = 0;
        showMessage('BALL 1');
        PinballAudio.init();
    }

    function resetBall() {
        ball.pos.x = table.ballStartX;
        ball.pos.y = table.ballStartY;
        ball.vel.x = 0;
        ball.vel.y = 0;
        ball.active = false;
        ball.trail = [];
        plungerPower = 0;
        plungerCharging = false;
        ballSaveTimer = 10; // 10 seconds of ball save at start
        ballSaveActive = true;
    }

    function launchBall() {
        plungerCharging = false;
        var power = Math.max(0.2, Math.min(1, plungerPower));
        ball.vel.y = -(600 + power * 1200);
        ball.vel.x = -20 - Math.random() * 30;
        ball.active = true;
        gameState = 'playing';
        PinballAudio.play('plunger', power);
    }

    function nudge(dir) {
        if (tiltLocked || gameState !== 'playing' || !ball.active) return;

        ball.vel.x += dir * 80;
        ball.vel.y -= 20;
        tiltShake = 5;
        tiltWarnings++;

        if (tiltWarnings >= 3) {
            tiltLocked = true;
            showMessage('TILT!');
            PinballAudio.play('tilt');
            // Disable flippers
            table.flippers[0].pressed = false;
            table.flippers[1].pressed = false;
        }
    }

    function addScore(points) {
        var gained = points * multiplier;
        score += gained;

        // Combo system
        comboCount++;
        comboTimer = 3; // 3 seconds to keep combo

        if (comboCount >= 5) {
            multiplier = Math.min(multiplier + 1, 10);
            showMessage(multiplier + 'x MULTIPLIER!');
            PinballAudio.play('combo', multiplier);
            comboCount = 0;
        }
    }

    function showMessage(text) {
        messageText = text;
        messageTimer = 2;
    }

    function handleDrain() {
        ball.active = false;
        drainTimer = 1;

        if (ballSaveActive) {
            showMessage('BALL SAVED!');
            PinballAudio.play('ballSave');
            gameState = 'ballSave';
            return;
        }

        ballsRemaining--;
        PinballAudio.play('drain');

        if (ballsRemaining <= 0) {
            gameState = 'gameOver';
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('pinball_high', String(highScore));
                showMessage('NEW HIGH SCORE!');
            } else {
                showMessage('GAME OVER');
            }
            PinballAudio.play('gameOver');
        } else {
            currentBall++;
            showMessage('BALL ' + (currentBall + 1));
            gameState = 'draining';
        }
    }

    // ========== Main Loop ==========
    function loop(timestamp) {
        var dt = Math.min((timestamp - lastTime) / 1000, 0.033); // cap at ~30fps worth of physics
        lastTime = timestamp;

        update(dt);
        render();
        requestAnimationFrame(loop);
    }

    function update(dt) {
        neonPulse += dt * 3;

        // Timers
        if (messageTimer > 0) messageTimer -= dt;
        if (comboTimer > 0) {
            comboTimer -= dt;
            if (comboTimer <= 0) {
                comboCount = 0;
                multiplier = Math.max(1, multiplier - 1);
            }
        }

        if (ballSaveTimer > 0) {
            ballSaveTimer -= dt;
            if (ballSaveTimer <= 0) ballSaveActive = false;
        }

        if (tiltShake > 0) tiltShake -= dt * 20;

        // Drop target reset timer
        if (dropTargetResetTimer > 0) {
            dropTargetResetTimer -= dt;
            if (dropTargetResetTimer <= 0) {
                for (var d = 0; d < table.dropTargets.length; d++) {
                    table.dropTargets[d].active = true;
                }
                allDropTargetsCleared = false;
            }
        }

        // Bumper hit flash timers
        for (var b = 0; b < table.bumpers.length; b++) {
            if (table.bumpers[b].hitTimer > 0) table.bumpers[b].hitTimer -= dt;
        }
        for (var dt2 = 0; dt2 < table.dropTargets.length; dt2++) {
            if (table.dropTargets[dt2].hitTimer > 0) table.dropTargets[dt2].hitTimer -= dt;
        }
        for (var ss = 0; ss < table.slingshots.length; ss++) {
            if (table.slingshots[ss].hitTimer > 0) table.slingshots[ss].hitTimer -= dt;
        }

        // Spinner decay
        for (var sp = 0; sp < table.spinners.length; sp++) {
            var spinner = table.spinners[sp];
            if (spinner.spinSpeed > 0) {
                spinner.angle += spinner.spinSpeed * dt;
                spinner.spinSpeed *= 0.97;
                if (spinner.spinSpeed > 0.5) {
                    // Score while spinning
                    if (Math.floor(spinner.angle / (Math.PI / 4)) !== Math.floor((spinner.angle - spinner.spinSpeed * dt) / (Math.PI / 4))) {
                        addScore(spinner.points);
                    }
                } else {
                    spinner.spinSpeed = 0;
                }
            }
        }

        // Plunger charging
        if (gameState === 'plunger' && plungerCharging) {
            plungerPower = Math.min(1, plungerPower + dt * 1.2);
        }

        // Ball save return
        if (gameState === 'ballSave') {
            drainTimer -= dt;
            if (drainTimer <= 0) {
                resetBall();
                gameState = 'playing';
            }
            return;
        }

        // Drain pause
        if (gameState === 'draining') {
            drainTimer -= dt;
            if (drainTimer <= 0) {
                resetBall();
                gameState = 'playing';
            }
            return;
        }

        if (gameState !== 'playing' || !ball.active) return;

        // Update flippers
        if (!tiltLocked) {
            for (var f = 0; f < table.flippers.length; f++) {
                table.flippers[f].update(dt);
            }
        }

        // Update ball physics
        ball.update(dt, table.width, table.height, table.walls);

        // Bumper collisions
        for (var i = 0; i < table.bumpers.length; i++) {
            if (ball.collideBumper(table.bumpers[i])) {
                table.bumpers[i].hitTimer = 0.15;
                addScore(table.bumpers[i].points);
                PinballAudio.play('bumper');
            }
        }

        // Flipper collisions
        for (var j = 0; j < table.flippers.length; j++) {
            if (ball.collideFlipper(table.flippers[j])) {
                // flipper hit sound is played on key press
            }
        }

        // Drop target collisions
        var dropHits = 0;
        for (var k = 0; k < table.dropTargets.length; k++) {
            if (ball.collideRect(table.dropTargets[k])) {
                table.dropTargets[k].active = false;
                table.dropTargets[k].hitTimer = 0.3;
                addScore(table.dropTargets[k].points);
                PinballAudio.play('dropTarget');
                dropHits++;
            }
        }

        // Check if all drop targets in a bank are cleared
        if (dropHits > 0) {
            var neonCleared = true, jptCleared = true;
            for (var dc = 0; dc < 4; dc++) {
                if (table.dropTargets[dc].active) neonCleared = false;
            }
            for (var dc2 = 4; dc2 < 7; dc2++) {
                if (table.dropTargets[dc2].active) jptCleared = false;
            }

            if ((neonCleared || jptCleared) && !allDropTargetsCleared) {
                allDropTargetsCleared = true;
                addScore(5000);
                showMessage('TARGET BANK CLEARED! +5000');
                PinballAudio.play('bonus');
                dropTargetResetTimer = 5;
            }
        }

        // Rollover lanes
        var rollHits = PinballTable.checkRollovers(ball, table.rollovers);
        for (var r = 0; r < rollHits.length; r++) {
            addScore(rollHits[r].points);
            PinballAudio.play('rollover');
        }

        // Check if all top lanes lit
        var allTopLit = true;
        for (var tl = 0; tl < 3; tl++) {
            if (!table.rollovers[tl].lit) allTopLit = false;
        }
        if (allTopLit) {
            // Reset and award bonus
            for (var tr = 0; tr < 3; tr++) table.rollovers[tr].lit = false;
            addScore(2000);
            multiplier = Math.min(multiplier + 1, 10);
            showMessage('ALL LANES LIT! ' + multiplier + 'x');
            PinballAudio.play('bonus');
        }

        // Spinners
        PinballTable.checkSpinners(ball, table.spinners);

        // Slingshot detection (check velocity change near slingshot walls)
        for (var sl = 0; sl < table.slingshots.length; sl++) {
            var sling = table.slingshots[sl];
            var sdx = ball.pos.x - (sling.x1 + sling.x2 + sling.x3) / 3;
            var sdy = ball.pos.y - (sling.y1 + sling.y2 + sling.y3) / 3;
            if (Math.sqrt(sdx * sdx + sdy * sdy) < 50 && ball.vel.len() > 200) {
                if (sling.hitTimer <= 0) {
                    sling.hitTimer = 0.15;
                    addScore(50);
                    PinballAudio.play('slingshot');
                }
            }
        }

        // Drain check
        if (PinballTable.isDrained(ball, table)) {
            handleDrain();
        }

        // Off-screen safety
        if (ball.active && (ball.pos.y > table.height + 50 || ball.pos.x < -50 || ball.pos.x > table.width + 50)) {
            handleDrain();
        }
    }

    // ========== Rendering ==========
    function render() {
        var w = table.width;
        var h = table.height;
        var pulse = Math.sin(neonPulse) * 0.5 + 0.5;

        // Tilt shake offset
        var shakeX = tiltShake > 0 ? (Math.random() - 0.5) * tiltShake : 0;
        var shakeY = tiltShake > 0 ? (Math.random() - 0.5) * tiltShake : 0;

        ctx.save();
        ctx.translate(shakeX, shakeY);

        // Background
        var bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, COLORS.bgGradTop);
        bgGrad.addColorStop(1, COLORS.bgGradBot);
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Playing field subtle pattern
        ctx.fillStyle = 'rgba(30, 15, 50, 0.3)';
        for (var py = 0; py < h; py += 20) {
            ctx.fillRect(20, py, w - 25, 1);
        }

        // Drain zone glow
        ctx.fillStyle = COLORS.drainZone;
        ctx.fillRect(140, h - 20, 110, 20);

        // ---- Walls ----
        ctx.strokeStyle = COLORS.wall;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        for (var wi = 0; wi < table.walls.length; wi++) {
            var wall = table.walls[wi];
            if (wall.type === 'segment') {
                ctx.beginPath();
                ctx.moveTo(wall.x1, wall.y1);
                ctx.lineTo(wall.x2, wall.y2);

                // Slingshot walls glow differently
                if (wall.restitution && wall.restitution > 1) {
                    ctx.strokeStyle = COLORS.neonYellow;
                    ctx.lineWidth = 2;
                    ctx.shadowColor = COLORS.neonYellow;
                    ctx.shadowBlur = 8;
                } else {
                    ctx.strokeStyle = COLORS.wall;
                    ctx.lineWidth = 3;
                    ctx.shadowColor = 'transparent';
                    ctx.shadowBlur = 0;
                }
                ctx.stroke();
            }
        }
        ctx.shadowBlur = 0;

        // ---- Slingshots ----
        for (var si = 0; si < table.slingshots.length; si++) {
            var sling = table.slingshots[si];
            var slingLit = sling.hitTimer > 0;
            ctx.fillStyle = slingLit ? 'rgba(255, 226, 52, 0.3)' : 'rgba(255, 226, 52, 0.08)';
            ctx.beginPath();
            ctx.moveTo(sling.x1, sling.y1);
            ctx.lineTo(sling.x2, sling.y2);
            ctx.lineTo(sling.x3, sling.y3);
            ctx.closePath();
            ctx.fill();
        }

        // ---- Drop Targets ----
        for (var di = 0; di < table.dropTargets.length; di++) {
            var dt = table.dropTargets[di];
            if (dt.active) {
                var dtLit = dt.hitTimer > 0;
                ctx.fillStyle = dtLit ? COLORS.neonGreen : COLORS.velvetRed;
                ctx.shadowColor = dtLit ? COLORS.neonGreen : 'transparent';
                ctx.shadowBlur = dtLit ? 12 : 0;
                ctx.fillRect(dt.x, dt.y, dt.w, dt.h);

                // Label
                ctx.fillStyle = COLORS.textLight;
                ctx.font = 'bold 10px Inter, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(dt.label, dt.x + dt.w / 2, dt.y + dt.h / 2 + 3);
            } else {
                // Knocked down - dim ghost
                ctx.fillStyle = 'rgba(139, 26, 43, 0.2)';
                ctx.fillRect(dt.x, dt.y, dt.w, dt.h);
            }
        }
        ctx.shadowBlur = 0;

        // ---- Rollover Lanes ----
        for (var ri = 0; ri < table.rollovers.length; ri++) {
            var ro = table.rollovers[ri];
            ctx.beginPath();
            ctx.arc(ro.x, ro.y, ro.radius, 0, Math.PI * 2);
            if (ro.lit) {
                ctx.fillStyle = COLORS.neonGreen;
                ctx.shadowColor = COLORS.neonGreen;
                ctx.shadowBlur = 10;
            } else {
                ctx.fillStyle = 'rgba(57, 255, 20, 0.15)';
                ctx.shadowBlur = 0;
            }
            ctx.fill();

            ctx.fillStyle = ro.lit ? '#000' : COLORS.dimText;
            ctx.font = 'bold 9px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(ro.label, ro.x, ro.y + 3);
        }
        ctx.shadowBlur = 0;

        // ---- Spinners ----
        for (var spi = 0; spi < table.spinners.length; spi++) {
            var sp = table.spinners[spi];
            ctx.save();
            ctx.translate(sp.x, sp.y);
            ctx.rotate(sp.angle);
            ctx.strokeStyle = COLORS.chrome;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-sp.width / 2, 0);
            ctx.lineTo(sp.width / 2, 0);
            ctx.stroke();
            // Spinner disc visual
            ctx.strokeStyle = 'rgba(192, 192, 192, 0.4)';
            ctx.beginPath();
            ctx.moveTo(0, -6);
            ctx.lineTo(0, 6);
            ctx.stroke();
            ctx.restore();
        }

        // ---- Bumpers ----
        for (var bi = 0; bi < table.bumpers.length; bi++) {
            var bumper = table.bumpers[bi];
            var bc = BUMPER_COLORS[bumper.color] || BUMPER_COLORS.neonPink;
            var hit = bumper.hitTimer > 0;
            var glow = hit ? 20 : 6 + pulse * 4;

            // Outer glow
            ctx.beginPath();
            ctx.arc(bumper.x, bumper.y, bumper.radius + 4, 0, Math.PI * 2);
            ctx.fillStyle = hit ? bc.glow : 'rgba(0,0,0,0)';
            ctx.shadowColor = bc.fill;
            ctx.shadowBlur = glow;
            ctx.fill();

            // Ring
            ctx.beginPath();
            ctx.arc(bumper.x, bumper.y, bumper.radius, 0, Math.PI * 2);
            ctx.strokeStyle = bc.ring;
            ctx.lineWidth = 3;
            ctx.stroke();

            // Inner fill
            ctx.beginPath();
            ctx.arc(bumper.x, bumper.y, bumper.radius - 3, 0, Math.PI * 2);
            ctx.fillStyle = hit ? bc.fill : COLORS.bumperRing;
            ctx.fill();

            // Center dot
            ctx.beginPath();
            ctx.arc(bumper.x, bumper.y, 5, 0, Math.PI * 2);
            ctx.fillStyle = bc.fill;
            ctx.fill();

            // Score text
            ctx.fillStyle = COLORS.dimText;
            ctx.font = '8px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(bumper.points, bumper.x, bumper.y + bumper.radius + 14);
        }
        ctx.shadowBlur = 0;

        // ---- Flippers ----
        for (var fi = 0; fi < table.flippers.length; fi++) {
            var flip = table.flippers[fi];
            var fAngle = flip.currentAngle;
            var fx2 = flip.x + Math.cos(fAngle) * flip.length;
            var fy2 = flip.y + Math.sin(fAngle) * flip.length;

            // Glow
            ctx.shadowColor = COLORS.flipperGlow;
            ctx.shadowBlur = flip.pressed ? 15 : 5;

            ctx.strokeStyle = COLORS.flipper;
            ctx.lineWidth = flip.width;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(flip.x, flip.y);
            ctx.lineTo(fx2, fy2);
            ctx.stroke();

            // Pivot
            ctx.beginPath();
            ctx.arc(flip.x, flip.y, 6, 0, Math.PI * 2);
            ctx.fillStyle = COLORS.chrome;
            ctx.fill();
        }
        ctx.shadowBlur = 0;

        // ---- Plunger ----
        if (gameState === 'plunger' || (gameState === 'playing' && !ball.active)) {
            var plungerY = table.height - 30;
            var plungerH = 40;
            var pullBack = plungerPower * 30;

            ctx.fillStyle = COLORS.plunger;
            ctx.shadowColor = COLORS.gold;
            ctx.shadowBlur = 5 + plungerPower * 15;
            ctx.fillRect(table.plungerX - 8, plungerY + pullBack, 16, plungerH);

            // Spring
            ctx.strokeStyle = COLORS.chrome;
            ctx.lineWidth = 2;
            for (var sp2 = 0; sp2 < 5; sp2++) {
                var sy = plungerY + plungerH + pullBack + sp2 * (6 + pullBack * 0.4);
                ctx.beginPath();
                ctx.moveTo(table.plungerX - 6, sy);
                ctx.lineTo(table.plungerX + 6, sy + 3);
                ctx.stroke();
            }
            ctx.shadowBlur = 0;

            // Power indicator
            if (plungerPower > 0) {
                ctx.fillStyle = plungerPower > 0.8 ? COLORS.neonPink : COLORS.neonBlue;
                ctx.fillRect(table.plungerX - 12, plungerY - 10, 24 * plungerPower, 4);
            }
        }

        // ---- Ball Trail ----
        if (ball.active && ball.trail.length > 1) {
            for (var ti = 1; ti < ball.trail.length; ti++) {
                var alpha = 1 - ti / ball.trail.length;
                ctx.beginPath();
                ctx.arc(ball.trail[ti].x, ball.trail[ti].y, ball.radius * alpha * 0.8, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 212, 255, ' + (alpha * 0.3) + ')';
                ctx.fill();
            }
        }

        // ---- Ball ----
        if (ball.active) {
            // Outer glow
            ctx.beginPath();
            ctx.arc(ball.pos.x, ball.pos.y, ball.radius + 6, 0, Math.PI * 2);
            ctx.fillStyle = COLORS.ballGlow;
            ctx.shadowColor = COLORS.neonBlue;
            ctx.shadowBlur = 15;
            ctx.fill();

            // Ball
            ctx.beginPath();
            ctx.arc(ball.pos.x, ball.pos.y, ball.radius, 0, Math.PI * 2);
            var ballGrad = ctx.createRadialGradient(
                ball.pos.x - 2, ball.pos.y - 2, 1,
                ball.pos.x, ball.pos.y, ball.radius
            );
            ballGrad.addColorStop(0, '#ffffff');
            ballGrad.addColorStop(0.6, '#d0e8ff');
            ballGrad.addColorStop(1, '#80c0ff');
            ctx.fillStyle = ballGrad;
            ctx.fill();
            ctx.shadowBlur = 0;

            // Specular highlight
            ctx.beginPath();
            ctx.arc(ball.pos.x - 2, ball.pos.y - 2, ball.radius * 0.35, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fill();
        }

        // ---- Ball Save Indicator ----
        if (ballSaveActive && ballSaveTimer > 0) {
            var saveAlpha = ballSaveTimer < 3 ? (0.3 + Math.sin(neonPulse * 4) * 0.3) : 0.5;
            ctx.fillStyle = 'rgba(57, 255, 20, ' + saveAlpha + ')';
            ctx.fillRect(140, h - 8, 110, 6);
            ctx.fillStyle = COLORS.neonGreen;
            ctx.font = '8px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('BALL SAVE', 195, h - 12);
        }

        // ---- HUD Overlay ----
        renderHUD(w, h, pulse);

        // ---- Messages ----
        if (messageTimer > 0) {
            var msgAlpha = Math.min(1, messageTimer);
            ctx.fillStyle = 'rgba(0, 0, 0, ' + (msgAlpha * 0.5) + ')';
            ctx.fillRect(w * 0.1, h * 0.42, w * 0.8, 50);

            ctx.fillStyle = 'rgba(255, 226, 52, ' + msgAlpha + ')';
            ctx.font = 'bold 22px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.shadowColor = COLORS.neonYellow;
            ctx.shadowBlur = 15;
            ctx.fillText(messageText, w / 2, h * 0.42 + 32);
            ctx.shadowBlur = 0;
        }

        // ---- Idle / Game Over Screen ----
        if (gameState === 'idle' || gameState === 'gameOver') {
            ctx.fillStyle = 'rgba(12, 6, 18, 0.7)';
            ctx.fillRect(0, 0, w, h);

            ctx.fillStyle = COLORS.neonPink;
            ctx.font = 'bold 32px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.shadowColor = COLORS.neonPink;
            ctx.shadowBlur = 20;
            ctx.fillText('NEON', w / 2, h * 0.3);
            ctx.fillStyle = COLORS.neonBlue;
            ctx.shadowColor = COLORS.neonBlue;
            ctx.fillText('PINBALL', w / 2, h * 0.3 + 40);
            ctx.shadowBlur = 0;

            if (gameState === 'gameOver') {
                ctx.fillStyle = COLORS.gold;
                ctx.font = '18px Inter, sans-serif';
                ctx.fillText('SCORE: ' + formatScore(score), w / 2, h * 0.5);

                if (score >= highScore && score > 0) {
                    ctx.fillStyle = COLORS.neonYellow;
                    ctx.font = 'bold 14px Inter, sans-serif';
                    ctx.fillText('NEW HIGH SCORE!', w / 2, h * 0.5 + 25);
                }
            }

            ctx.fillStyle = COLORS.textLight;
            ctx.font = '14px Inter, sans-serif';
            var startText = 'ontouchstart' in window ? 'TAP TO START' : 'PRESS SPACE TO START';
            ctx.fillText(startText, w / 2, h * 0.62);

            // Controls help
            ctx.fillStyle = COLORS.dimText;
            ctx.font = '11px Inter, sans-serif';
            if ('ontouchstart' in window) {
                ctx.fillText('Left side = Left flipper', w / 2, h * 0.72);
                ctx.fillText('Right side = Right flipper', w / 2, h * 0.72 + 18);
                ctx.fillText('Bottom right = Plunger', w / 2, h * 0.72 + 36);
            } else {
                ctx.fillText('Z/A/LShift = Left    X/D/RShift = Right', w / 2, h * 0.72);
                ctx.fillText('SPACE = Plunger    Arrows = Nudge', w / 2, h * 0.72 + 18);
            }

            if (highScore > 0) {
                ctx.fillStyle = COLORS.gold;
                ctx.font = '12px Inter, sans-serif';
                ctx.fillText('HIGH SCORE: ' + formatScore(highScore), w / 2, h * 0.88);
            }
        }

        ctx.restore();
    }

    function renderHUD(w, h, pulse) {
        if (gameState === 'idle' || gameState === 'gameOver') return;

        // Score
        ctx.fillStyle = COLORS.gold;
        ctx.font = 'bold 16px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.shadowColor = COLORS.gold;
        ctx.shadowBlur = 5;
        ctx.fillText(formatScore(score), 30, 15);
        ctx.shadowBlur = 0;

        // Multiplier
        if (multiplier > 1) {
            ctx.fillStyle = COLORS.neonYellow;
            ctx.font = 'bold 12px Inter, sans-serif';
            ctx.fillText(multiplier + 'x', 30 + (String(score).length + 1) * 10, 15);
        }

        // Balls remaining
        ctx.fillStyle = COLORS.textLight;
        ctx.textAlign = 'right';
        ctx.font = '11px Inter, sans-serif';
        for (var bi = 0; bi < ballsRemaining; bi++) {
            ctx.beginPath();
            ctx.arc(w - 40 + bi * 14, 12, 4, 0, Math.PI * 2);
            ctx.fillStyle = COLORS.neonBlue;
            ctx.fill();
        }

        // Ball save indicator in HUD
        if (ballSaveActive && ballSaveTimer > 0) {
            ctx.fillStyle = COLORS.neonGreen;
            ctx.font = '9px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('SAVE ' + Math.ceil(ballSaveTimer) + 's', w / 2, 14);
        }

        // Combo indicator
        if (comboCount > 0 && comboTimer > 0) {
            ctx.fillStyle = COLORS.neonPink;
            ctx.font = '10px Inter, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('COMBO x' + comboCount, 30, 30);
        }
    }

    function formatScore(s) {
        return String(s).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // ========== Public API ==========
    window.PinballEngine = {
        init: init
    };
})();
