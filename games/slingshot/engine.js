/**
 * engine.js — Game engine for Slingshot Siege
 * State machine, slingshot mechanics, bird abilities, scoring
 */
'use strict';

const Engine = (() => {
    // Constants
    const SLINGSHOT_X = 200;
    const SLINGSHOT_Y = Levels.GROUND;
    const BAND_ORIGIN_Y = SLINGSHOT_Y - 65;
    const MAX_PULL = 120;
    const LAUNCH_POWER = 8;
    const SETTLE_TIME = 3.0;
    const ENEMY_HP = 80;
    const ENEMY_RADIUS = 18;

    // State
    let world;
    let state = 'menu'; // menu, aiming, flying, settling, complete, failed
    let currentLevel = 0;
    let currentBirdIndex = 0;
    let birds = [];
    let activeBird = null;
    let activeBirdType = '';
    let abilityUsed = false;
    let settleTimer = 0;
    let score = 0;
    let totalScore = 0;
    let levelScores = [];
    let levelStars = [];
    let time = 0;
    let shakeAmount = 0;

    // Slingshot drag state
    let dragging = false;
    let pullX = SLINGSHOT_X;
    let pullY = BAND_ORIGIN_Y;
    let trajectoryPoints = [];

    // Audio
    let audioCtx = null;

    function initAudio() {
        if (audioCtx) return;
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    function playSound(type) {
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        switch (type) {
            case 'launch':
                osc.frequency.setValueAtTime(300, now);
                osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
                break;
            case 'hit':
                osc.type = 'square';
                osc.frequency.setValueAtTime(200, now);
                osc.frequency.exponentialRampToValueAtTime(60, now + 0.1);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                osc.start(now);
                osc.stop(now + 0.15);
                break;
            case 'break':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(50, now + 0.2);
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
                osc.start(now);
                osc.stop(now + 0.25);
                break;
            case 'explode':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(100, now);
                osc.frequency.exponentialRampToValueAtTime(30, now + 0.4);
                gain.gain.setValueAtTime(0.25, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
                osc.start(now);
                osc.stop(now + 0.5);
                break;
            case 'win':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(523, now);
                osc.frequency.setValueAtTime(659, now + 0.15);
                osc.frequency.setValueAtTime(784, now + 0.3);
                osc.frequency.setValueAtTime(1047, now + 0.45);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
                osc.start(now);
                osc.stop(now + 0.7);
                break;
            case 'fail':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(300, now);
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.5);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
                osc.start(now);
                osc.stop(now + 0.6);
                break;
            case 'ability':
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                osc.start(now);
                osc.stop(now + 0.15);
                break;
        }
    }

    function loadLevel(index) {
        const level = Levels.getLevel(index);
        if (!level) return;

        currentLevel = index;
        currentBirdIndex = 0;
        birds = [...level.birds];
        activeBird = null;
        activeBirdType = '';
        abilityUsed = false;
        score = 0;
        settleTimer = 0;
        dragging = false;
        pullX = SLINGSHOT_X;
        pullY = BAND_ORIGIN_Y;
        trajectoryPoints = [];
        shakeAmount = 0;

        world = new Physics.World(1600, 900);

        // Build structures
        for (const block of level.structures) {
            const dims = Levels.SIZES[block.size];
            const mat = Levels.MATERIALS[block.material];
            const body = new Physics.Body(block.x, block.y, dims.w, dims.h, {
                mass: dims.w * dims.h * mat.density * 0.001,
                hp: mat.hp,
                restitution: mat.restitution,
                friction: mat.friction,
                material: block.material,
            });
            body.userData = { tnt: block.tnt || false };
            world.addBody(body);
        }

        // Place enemies
        for (const enemy of level.enemies) {
            const body = new Physics.Body(enemy.x, enemy.y, ENEMY_RADIUS * 2, ENEMY_RADIUS * 2, {
                mass: 3,
                hp: ENEMY_HP,
                restitution: 0.2,
                friction: 0.5,
                isCircle: true,
                radius: ENEMY_RADIUS,
                isEnemy: true,
            });
            body.userData = {};
            world.addBody(body);
        }

        // Event handlers
        world.on('destroy', (body) => {
            world.spawnDebris(body, body.isEnemy ? 12 : 8);
            playSound('break');

            if (body.userData.tnt) {
                world.explode(body.x, body.y, 150, 600);
                playSound('explode');
                shakeAmount = 10;
            }

            if (body.isEnemy) {
                score += 5000;
            } else if (!body.isProjectile) {
                score += 500;
            }
        });

        world.on('collision', (a, b, speed) => {
            if (speed > 50) {
                playSound('hit');
                shakeAmount = Math.min(5, speed * 0.02);
            }
        });

        state = 'aiming';
        loadNextBird();
        Renderer.setCameraTarget(0);
    }

    function loadNextBird() {
        if (currentBirdIndex >= birds.length) return;
        activeBirdType = birds[currentBirdIndex];
        abilityUsed = false;
        pullX = SLINGSHOT_X;
        pullY = BAND_ORIGIN_Y;
    }

    function launchBird() {
        const info = Levels.BIRDS[activeBirdType];
        const dx = SLINGSHOT_X - pullX;
        const dy = BAND_ORIGIN_Y - pullY;

        const body = new Physics.Body(pullX, pullY, info.radius * 2, info.radius * 2, {
            mass: info.mass,
            isCircle: true,
            radius: info.radius,
            isProjectile: true,
            restitution: 0.3,
            hp: 9999,
        });
        body.vx = dx * LAUNCH_POWER;
        body.vy = dy * LAUNCH_POWER;
        body.userData = { birdType: activeBirdType };

        world.addBody(body);
        activeBird = body;
        currentBirdIndex++;
        state = 'flying';
        playSound('launch');

        // Camera follows bird
        Renderer.setCameraTarget(pullX + dx * 2);
    }

    function useAbility() {
        if (!activeBird || abilityUsed || state !== 'flying') return;
        abilityUsed = true;
        const type = activeBirdType;
        playSound('ability');

        if (type === 'explosive') {
            // Explode at current position
            world.explode(activeBird.x, activeBird.y, 180, 800);
            playSound('explode');
            shakeAmount = 12;
            activeBird.alive = false;
        } else if (type === 'splitter') {
            // Split into 3
            const baseVX = activeBird.vx;
            const baseVY = activeBird.vy;
            const spread = 200;
            for (let i = -1; i <= 1; i++) {
                const clone = new Physics.Body(activeBird.x, activeBird.y, 20, 20, {
                    mass: 3,
                    isCircle: true,
                    radius: 10,
                    isProjectile: true,
                    restitution: 0.3,
                    hp: 9999,
                });
                clone.vx = baseVX + i * spread * 0.3;
                clone.vy = baseVY + i * spread;
                clone.userData = { birdType: 'normal' };
                world.addBody(clone);
            }
            activeBird.alive = false;
        } else if (type === 'heavy') {
            // Drop straight down with force
            activeBird.vx *= 0.2;
            activeBird.vy = 800;
            activeBird.mass = 25;
            activeBird.invMass = 1 / 25;
        } else if (type === 'speedy') {
            // Speed boost in current direction
            const speed = Math.sqrt(activeBird.vx ** 2 + activeBird.vy ** 2);
            if (speed > 0) {
                const factor = 2.5;
                activeBird.vx *= factor;
                activeBird.vy *= factor;
            }
        }
    }

    function getEnemiesAlive() {
        return world.bodies.filter(b => b.isEnemy && b.alive).length;
    }

    function getProjectilesAlive() {
        return world.bodies.filter(b => b.isProjectile && b.alive).length;
    }

    function calculateStars() {
        const level = Levels.getLevel(currentLevel);
        const birdsUsed = currentBirdIndex;
        const par = level.par;
        if (birdsUsed <= par) return 3;
        if (birdsUsed <= par + 1) return 2;
        return 1;
    }

    function update(dt) {
        time += dt;

        if (state === 'menu') return;

        // Shake decay
        if (shakeAmount > 0) shakeAmount *= 0.9;
        if (shakeAmount < 0.1) shakeAmount = 0;

        if (state === 'aiming') {
            Renderer.setCameraTarget(0);
        }

        if (state === 'flying' || state === 'settling') {
            world.step(dt);
            Renderer.updateCamera(dt);

            // Track active bird with camera
            if (activeBird && activeBird.alive) {
                Renderer.setCameraTarget(activeBird.x);
            }

            // Check if all projectiles settled
            const projectiles = world.bodies.filter(b => b.isProjectile);
            const allSettled = projectiles.length === 0 || projectiles.every(b => b.sleeping || !b.alive);

            if (state === 'flying' && allSettled) {
                state = 'settling';
                settleTimer = 0;
            }

            if (state === 'settling') {
                settleTimer += dt;
                // Check all blocks settled too
                const allBlocksSettled = world.bodies.every(b => b.isStatic || b.sleeping || !b.alive);

                if (settleTimer > SETTLE_TIME || (allBlocksSettled && settleTimer > 0.5)) {
                    // Check win/lose
                    if (getEnemiesAlive() === 0) {
                        // Win!
                        const stars = calculateStars();
                        const birdsLeft = birds.length - currentBirdIndex;
                        score += birdsLeft * 10000;
                        levelScores[currentLevel] = Math.max(levelScores[currentLevel] || 0, score);
                        levelStars[currentLevel] = Math.max(levelStars[currentLevel] || 0, stars);
                        state = 'complete';
                        playSound('win');
                    } else if (currentBirdIndex >= birds.length) {
                        // No birds left, enemies remain
                        state = 'failed';
                        playSound('fail');
                    } else if (currentBirdIndex < birds.length) {
                        // Next bird
                        state = 'aiming';
                        loadNextBird();
                        // Remove old projectiles
                        for (const b of world.bodies.filter(b => b.isProjectile)) {
                            b.alive = false;
                        }
                        Renderer.setCameraTarget(0);
                    } else {
                        // No birds left, enemies remain — fail
                        state = 'failed';
                        playSound('fail');
                    }
                }
            }
        }
    }

    function render() {
        Renderer.clear();

        if (state === 'menu') {
            renderMenu();
            return;
        }

        const level = Levels.getLevel(currentLevel);

        // Shake offset
        const sx = shakeAmount * (Math.random() - 0.5) * 2;
        const sy = shakeAmount * (Math.random() - 0.5) * 2;

        const cvs = document.getElementById('game-canvas');
        const ctx = cvs.getContext('2d');
        ctx.save();
        ctx.translate(sx, sy);

        Renderer.drawBackground(level.bg, time);

        // Draw slingshot (back)
        Renderer.drawSlingshot(SLINGSHOT_X, SLINGSHOT_Y);

        // Draw band and bird on slingshot
        if (state === 'aiming') {
            Renderer.drawBand(SLINGSHOT_X, SLINGSHOT_Y, pullX, pullY, true);
            Renderer.drawProjectile({ x: pullX, y: pullY, radius: Levels.BIRDS[activeBirdType].radius, angle: 0 }, activeBirdType);
            Renderer.drawBandFront(SLINGSHOT_X, SLINGSHOT_Y, pullX, pullY, true);

            if (dragging) {
                Renderer.drawTrajectory(trajectoryPoints);
            }
        }

        // Draw blocks
        for (const body of world.bodies) {
            if (body.isProjectile) continue;
            if (body.isEnemy) {
                Renderer.drawEnemy(body);
            } else {
                Renderer.drawBlock(body);
            }
        }

        // Draw active projectiles
        for (const body of world.bodies) {
            if (!body.isProjectile) continue;
            Renderer.drawProjectile(body, body.userData.birdType || 'normal');
        }

        // Particles
        Renderer.drawParticles(world.particles);

        ctx.restore();

        // UI
        const stars = (state === 'complete') ? calculateStars() : 0;
        Renderer.drawScore(score, stars, `${currentLevel + 1}. ${level.name}`);
        Renderer.drawBirdQueue(birds, currentBirdIndex);

        // Ability hint
        if (state === 'flying' && !abilityUsed && activeBird && activeBird.alive) {
            const info = Levels.BIRDS[activeBirdType];
            if (info.ability) {
                const ctx2 = cvs.getContext('2d');
                ctx2.font = '14px "Fredoka", sans-serif';
                ctx2.fillStyle = 'rgba(255,255,255,0.7)';
                ctx2.textAlign = 'center';
                ctx2.fillText(`Tap/Click to activate: ${info.desc}`, Renderer.canvasW / 2, Renderer.canvasH - 20);
            }
        }

        if (state === 'complete') {
            Renderer.drawLevelComplete(score, calculateStars(), birds.length - currentBirdIndex);
        }

        if (state === 'failed') {
            Renderer.drawLevelFailed();
        }
    }

    function renderMenu() {
        const cvs = document.getElementById('game-canvas');
        const ctx = cvs.getContext('2d');

        // Background
        Renderer.drawBackground('meadow', time);

        // Title
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.font = 'bold 56px "Fredoka", sans-serif';
        ctx.fillStyle = '#2c3e50';
        ctx.fillText('Slingshot Siege', Renderer.canvasW / 2 + 2, 82);
        ctx.fillStyle = '#e74c3c';
        ctx.fillText('Slingshot Siege', Renderer.canvasW / 2, 80);

        ctx.font = '20px "Fredoka", sans-serif';
        ctx.fillStyle = '#555';
        ctx.fillText('Fling birds, destroy structures, defeat the pigs!', Renderer.canvasW / 2, 130);

        // Level select grid
        const cols = 5;
        const cellW = 80;
        const cellH = 80;
        const gap = 12;
        const totalW = cols * cellW + (cols - 1) * gap;
        const startX = (Renderer.canvasW - totalW) / 2;
        const startY = 180;

        for (let i = 0; i < Levels.count(); i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = startX + col * (cellW + gap);
            const y = startY + row * (cellH + gap);
            const level = Levels.getLevel(i);
            const unlocked = i === 0 || (levelStars[i - 1] && levelStars[i - 1] > 0);

            // Card background
            ctx.fillStyle = unlocked ? '#fff' : '#ccc';
            ctx.strokeStyle = unlocked ? '#e74c3c' : '#999';
            ctx.lineWidth = 2;
            _roundRect(ctx, x, y, cellW, cellH, 8);

            // Level number
            ctx.font = 'bold 24px "Fredoka", sans-serif';
            ctx.fillStyle = unlocked ? '#2c3e50' : '#999';
            ctx.fillText(`${i + 1}`, x + cellW / 2, y + 28);

            // Level name
            ctx.font = '10px "Fredoka", sans-serif';
            ctx.fillStyle = unlocked ? '#666' : '#aaa';
            ctx.fillText(level.name, x + cellW / 2, y + 48);

            // Stars
            if (levelStars[i]) {
                for (let s = 0; s < 3; s++) {
                    ctx.fillStyle = s < levelStars[i] ? '#FFD700' : '#ddd';
                    _drawStarSmall(ctx, x + cellW / 2 - 18 + s * 18, y + 66, 7, 3);
                }
            }

            if (!unlocked) {
                ctx.font = '20px sans-serif';
                ctx.fillStyle = '#999';
                ctx.fillText('\u{1F512}', x + cellW / 2, y + 66);
            }
        }

        // Instructions
        ctx.font = '16px "Fredoka", sans-serif';
        ctx.fillStyle = '#777';
        const instrY = startY + Math.ceil(Levels.count() / cols) * (cellH + gap) + 20;
        ctx.fillText('Click a level to play. Drag to aim, release to fire.', Renderer.canvasW / 2, instrY);

        // Bird legend
        const legendY = instrY + 40;
        const birdTypes = ['normal', 'explosive', 'splitter', 'heavy', 'speedy'];
        const legendW = birdTypes.length * 140;
        const lx = (Renderer.canvasW - legendW) / 2;
        ctx.font = '12px "Fredoka", sans-serif';
        ctx.textAlign = 'center';
        birdTypes.forEach((type, i) => {
            const info = Levels.BIRDS[type];
            const bx = lx + i * 140 + 70;

            ctx.fillStyle = info.color;
            ctx.beginPath();
            ctx.arc(bx, legendY, 10, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#555';
            ctx.fillText(info.name, bx, legendY + 22);
        });
    }

    function _roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    function _drawStarSmall(ctx, cx, cy, outerR, innerR) {
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
            const r = i % 2 === 0 ? outerR : innerR;
            const a = (i * Math.PI / 5) - Math.PI / 2;
            if (i === 0) ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
            else ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
        }
        ctx.closePath();
        ctx.fill();
    }

    // Input handlers
    function onPointerDown(wx, wy) {
        initAudio();

        if (state === 'menu') {
            handleMenuClick(wx, wy);
            return;
        }

        if (state === 'complete') {
            // Next level
            if (currentLevel + 1 < Levels.count()) {
                loadLevel(currentLevel + 1);
            } else {
                state = 'menu';
            }
            return;
        }

        if (state === 'failed') {
            loadLevel(currentLevel);
            return;
        }

        if (state === 'flying') {
            useAbility();
            return;
        }

        if (state === 'aiming') {
            const dx = wx - SLINGSHOT_X;
            const dy = wy - BAND_ORIGIN_Y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 80) {
                dragging = true;
            }
        }
    }

    function onPointerMove(wx, wy) {
        if (state !== 'aiming' || !dragging) return;

        const dx = wx - SLINGSHOT_X;
        const dy = wy - BAND_ORIGIN_Y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > MAX_PULL) {
            pullX = SLINGSHOT_X + dx / dist * MAX_PULL;
            pullY = BAND_ORIGIN_Y + dy / dist * MAX_PULL;
        } else {
            pullX = wx;
            pullY = wy;
        }

        // Trajectory preview
        const launchVX = (SLINGSHOT_X - pullX) * LAUNCH_POWER;
        const launchVY = (BAND_ORIGIN_Y - pullY) * LAUNCH_POWER;
        trajectoryPoints = world.predictTrajectory(pullX, pullY, launchVX, launchVY, 50);
    }

    function onPointerUp() {
        if (state !== 'aiming' || !dragging) return;
        dragging = false;

        const dx = SLINGSHOT_X - pullX;
        const dy = BAND_ORIGIN_Y - pullY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 10) {
            launchBird();
        } else {
            // Reset position - not enough pull
            pullX = SLINGSHOT_X;
            pullY = BAND_ORIGIN_Y;
        }
        trajectoryPoints = [];
    }

    function handleMenuClick(wx, wy) {
        // Map screen coords to level grid
        const cvs = document.getElementById('game-canvas');
        const rect = cvs.getBoundingClientRect();
        const sx = wx; // already in world coords from menu render
        // Convert world click to screen for menu
        const sp = Renderer.worldToScreen(wx, wy);

        const cols = 5;
        const cellW = 80;
        const cellH = 80;
        const gap = 12;
        const totalW = cols * cellW + (cols - 1) * gap;
        const startX = (Renderer.canvasW - totalW) / 2;
        const startY = 180;

        for (let i = 0; i < Levels.count(); i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = startX + col * (cellW + gap);
            const y = startY + row * (cellH + gap);
            const unlocked = i === 0 || (levelStars[i - 1] && levelStars[i - 1] > 0);

            if (unlocked && sp.x >= x && sp.x <= x + cellW && sp.y >= y && sp.y <= y + cellH) {
                loadLevel(i);
                return;
            }
        }
    }

    function getState() { return state; }
    function getCurrentLevel() { return currentLevel; }
    function goToMenu() { state = 'menu'; }

    return {
        update,
        render,
        loadLevel,
        onPointerDown,
        onPointerMove,
        onPointerUp,
        getState,
        getCurrentLevel,
        goToMenu,
        get time() { return time; },
    };
})();
