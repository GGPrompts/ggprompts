/**
 * engine.js — Main game loop and state machine for Infinite Runner
 * Coordinates terrain, player, renderer, audio, scoring, input
 */
'use strict';

const Engine = (() => {
    // Game states
    const STATE_MENU = 'menu';
    const STATE_PLAYING = 'playing';
    const STATE_DEAD = 'dead';

    // Speed config
    const BASE_SPEED = 5;
    const MAX_SPEED = 14;
    const SPEED_INCREASE_RATE = 0.08; // per second
    const SCORE_PER_SECOND = 10;
    const COIN_SCORE = 50;
    const GEM_SCORE = 200;
    const GEM_MULTIPLIER_BONUS = 0.2;
    const MILESTONE_INTERVAL = 1000; // score milestones

    // localStorage key
    const HS_KEY = 'neonDashHighScore';

    let state = STATE_MENU;
    let speed = BASE_SPEED;
    let cameraX = 0;
    let score = 0;
    let multiplier = 1;
    let distance = 0;
    let highScore = 0;
    let isNewHigh = false;
    let lastMilestone = 0;
    let time = 0;
    let deathTimer = 0;
    let canRestart = false;

    // Input
    let jumpPressed = false;
    let slidePressed = false;
    let touchStartY = 0;
    let touchStartTime = 0;

    // Animation frame
    let raf = null;
    let lastTime = 0;

    function init() {
        const canvas = document.getElementById('game-canvas');
        Renderer.init(canvas);
        loadHighScore();

        // Input handlers
        setupInput(canvas);

        // Resize
        window.addEventListener('resize', () => {
            Renderer.resize();
        });

        // Start loop
        lastTime = performance.now();
        loop(lastTime);
    }

    function setupInput(canvas) {
        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (e.repeat) return;
            const key = e.key;

            if (key === ' ' || key === 'ArrowUp' || key === 'w' || key === 'W') {
                e.preventDefault();
                handleJump();
            } else if (key === 'ArrowDown' || key === 's' || key === 'S') {
                e.preventDefault();
                handleSlide();
            } else if (key === 'm' || key === 'M') {
                toggleMute();
            }
        });

        // Mouse click to jump
        canvas.addEventListener('click', (e) => {
            e.preventDefault();
            handleJump();
        });

        // Touch
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
        }, { passive: false });

        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const dt = Date.now() - touchStartTime;
            const dy = e.changedTouches[0].clientY - touchStartY;

            if (dy > 40 && dt < 400) {
                // Swipe down = slide
                handleSlide();
            } else {
                // Tap = jump
                handleJump();
            }
        }, { passive: false });
    }

    function handleJump() {
        SFX.init();
        SFX.resume();

        if (state === STATE_MENU) {
            startGame();
        } else if (state === STATE_PLAYING) {
            const jumped = Player.jump();
            if (jumped) {
                const pState = Player.getState();
                SFX.play(pState.jumpsLeft === 1 ? 'jump' : 'doubleJump');
            }
        } else if (state === STATE_DEAD && canRestart) {
            startGame();
        }
    }

    function handleSlide() {
        SFX.init();
        SFX.resume();

        if (state === STATE_MENU) {
            startGame();
        } else if (state === STATE_PLAYING) {
            const slid = Player.slide();
            if (slid) {
                SFX.play('slide');
            }
        } else if (state === STATE_DEAD && canRestart) {
            startGame();
        }
    }

    function toggleMute() {
        const muted = SFX.toggleMute();
        const btn = document.getElementById('btn-mute');
        if (btn) {
            btn.textContent = muted ? 'Unmute' : 'Mute';
        }
    }

    function startGame() {
        state = STATE_PLAYING;
        speed = BASE_SPEED;
        cameraX = 0;
        score = 0;
        multiplier = 1;
        distance = 0;
        isNewHigh = false;
        lastMilestone = 0;
        time = 0;
        deathTimer = 0;
        canRestart = false;

        const groundY = Renderer.getHeight() - 80;
        Terrain.init(Renderer.getHeight());
        Player.init(groundY);
        Terrain.generateAhead(cameraX, Renderer.getWidth());
    }

    function loadHighScore() {
        try {
            highScore = parseInt(localStorage.getItem(HS_KEY)) || 0;
        } catch (e) {
            highScore = 0;
        }
    }

    function saveHighScore() {
        try {
            localStorage.setItem(HS_KEY, String(highScore));
        } catch (e) {
            // Storage not available
        }
    }

    function loop(timestamp) {
        raf = requestAnimationFrame(loop);

        const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
        lastTime = timestamp;

        update(dt);
        render();
    }

    function update(dt) {
        time += dt;

        if (state === STATE_PLAYING) {
            // Increase speed over time
            speed = Math.min(MAX_SPEED, speed + SPEED_INCREASE_RATE * dt);

            // Move camera (player stays at fixed screen X, world scrolls)
            cameraX += speed * dt * 60;
            distance = cameraX / 10;

            // Keep player's world X in sync (screen X = 120)
            Player.setWorldX(cameraX + 120);

            // Difficulty based on distance
            Terrain.setDifficulty(Math.min(1, distance / 5000));

            // Generate terrain ahead and cleanup behind
            Terrain.generateAhead(cameraX, Renderer.getWidth());
            Terrain.cleanup(cameraX);

            // Update player
            Player.update(dt, speed, Terrain.getSegments());

            // Check collectibles
            checkCollectibles();

            // Score
            score += SCORE_PER_SECOND * multiplier * dt;

            // Milestones
            const milestone = Math.floor(score / MILESTONE_INTERVAL);
            if (milestone > lastMilestone) {
                lastMilestone = milestone;
                SFX.play('milestone');
                Renderer.setFlash(0.3);
            }

            // Multiplier decay
            if (multiplier > 1) {
                multiplier = Math.max(1, multiplier - 0.02 * dt);
            }

            // Check death
            if (!Player.isAlive()) {
                onDeath();
            }
        } else if (state === STATE_DEAD) {
            Player.updateDeath(dt);
            deathTimer += dt;
            if (deathTimer > 0.8) {
                canRestart = true;
            }
        }

        Renderer.updateShake();
    }

    function checkCollectibles() {
        const bounds = Player.getBounds();
        const collectibles = Terrain.getCollectibles();

        for (const c of collectibles) {
            if (c.collected) continue;

            // Both bounds and collectible coords are in world space
            const bx = bounds.x + bounds.width / 2;
            const by = bounds.y + bounds.height / 2;

            const dx = c.x - bx;
            const dy = c.y - by;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < c.radius + 20) {
                c.collected = true;
                if (c.type === 'gem') {
                    score += GEM_SCORE * multiplier;
                    multiplier += GEM_MULTIPLIER_BONUS;
                    SFX.play('gem');
                    Renderer.setFlash(0.15);
                } else {
                    score += COIN_SCORE * multiplier;
                    SFX.play('coin');
                }
            }
        }
    }

    function onDeath() {
        state = STATE_DEAD;
        deathTimer = 0;
        canRestart = false;

        const finalScore = Math.floor(score);
        if (finalScore > highScore) {
            highScore = finalScore;
            isNewHigh = true;
            saveHighScore();
        }

        SFX.play('death');
        Renderer.setShake(15);
    }

    function render() {
        const groundY = Terrain.getGroundY();

        Renderer.clear();
        Renderer.drawSky(cameraX);
        Renderer.drawBuildings(cameraX, groundY);
        Renderer.drawTerrain(Terrain.getSegments(), cameraX, groundY);
        Renderer.drawCollectibles(Terrain.getCollectibles(), cameraX, time);
        Renderer.drawPlayer(Player.getState(), cameraX);

        if (state === STATE_PLAYING || state === STATE_DEAD) {
            Renderer.drawHUD(Math.floor(score), multiplier, distance, speed, highScore);
        }

        if (state === STATE_DEAD && canRestart) {
            Renderer.drawGameOver(Math.floor(score), highScore, isNewHigh, distance);
        }

        if (state === STATE_MENU) {
            Renderer.drawSky(0);
            Renderer.drawBuildings(0, groundY);
            Renderer.drawStartScreen(highScore);
        }

        Renderer.drawFlash();
    }

    return { init };
})();
