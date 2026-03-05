/* asteroids/engine.js -- Core game loop, state, collision, waves */
'use strict';

(function () {
    const E = window.AsteroidsEntities;
    const R = window.AsteroidsRenderer;
    const A = window.AsteroidsAudio;
    const { Ship, Asteroid, UFO, makeExplosion, makeShipExplosion, makeThrustParticle, dist, randRange, TWO_PI } = E;

    /* ---------- state ---------- */
    const LS_KEY = 'asteroids-highscore';
    let state = 'title'; // title | playing | gameover | paused
    let ship, asteroids, bullets, particles, ufos;
    let score, lives, wave;
    let highScore = parseInt(localStorage.getItem(LS_KEY)) || 0;
    let isNewHighScore = false;
    let extraLifeThreshold;
    let waveTextTimer;
    let ufoSpawnTimer;
    let beatTimer, beatToggle, beatInterval;
    let thrustSoundTimer;
    let lastTime;

    const keys = {};

    /* ---------- init ---------- */
    function resetGame() {
        const { w, h } = R.getSize();
        ship = new Ship(w / 2, h / 2);
        ship.invulnerable = 3;
        asteroids = [];
        bullets = [];
        particles = [];
        ufos = [];
        score = 0;
        lives = 3;
        wave = 0;
        isNewHighScore = false;
        extraLifeThreshold = 10000;
        waveTextTimer = 0;
        ufoSpawnTimer = randRange(15, 30);
        beatTimer = 0;
        beatToggle = false;
        beatInterval = 0.8;
        thrustSoundTimer = 0;
        spawnWave();
    }

    function spawnWave() {
        wave++;
        waveTextTimer = 2.0;
        const { w, h } = R.getSize();
        const count = Math.min(3 + wave, 12);
        for (let i = 0; i < count; i++) {
            let x, y;
            // spawn away from ship
            do {
                x = Math.random() * w;
                y = Math.random() * h;
            } while (dist({ x, y }, ship) < 150);
            asteroids.push(new Asteroid(x, y, 'large', w, h));
        }
        // speed up the beat
        beatInterval = Math.max(0.25, 0.8 - wave * 0.05);
    }

    /* ---------- input ---------- */
    function setupInput() {
        window.addEventListener('keydown', e => {
            keys[e.code] = true;

            if (e.code === 'Enter' || e.code === 'Space') {
                if (state === 'title') {
                    A.init();
                    state = 'playing';
                    resetGame();
                    e.preventDefault();
                    return;
                }
                if (state === 'gameover' && e.code === 'Enter') {
                    state = 'playing';
                    resetGame();
                    e.preventDefault();
                    return;
                }
            }

            if (e.code === 'KeyP' && (state === 'playing' || state === 'paused')) {
                state = state === 'paused' ? 'playing' : 'paused';
                e.preventDefault();
            }

            if (e.code === 'KeyM') {
                A.toggleMute();
            }

            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) {
                e.preventDefault();
            }
        });

        window.addEventListener('keyup', e => {
            keys[e.code] = false;
        });

        // Touch controls for mobile
        let touchStartX = 0, touchStartY = 0;
        const canvas = document.getElementById('game-canvas');

        canvas.addEventListener('touchstart', e => {
            e.preventDefault();
            if (state === 'title') {
                A.init();
                state = 'playing';
                resetGame();
                return;
            }
            if (state === 'gameover') {
                state = 'playing';
                resetGame();
                return;
            }
            const t = e.touches[0];
            touchStartX = t.clientX;
            touchStartY = t.clientY;
            const { w, h } = R.getSize();
            // left half = thrust, right half = shoot
            if (t.clientX < w / 2) {
                keys['ArrowUp'] = true;
                keys['KeyW'] = true;
            } else {
                keys['Space'] = true;
            }
        }, { passive: false });

        canvas.addEventListener('touchmove', e => {
            e.preventDefault();
            if (state !== 'playing') return;
            const t = e.touches[0];
            const dx = t.clientX - touchStartX;
            const dy = t.clientY - touchStartY;
            keys['ArrowLeft'] = keys['KeyA'] = dx < -20;
            keys['ArrowRight'] = keys['KeyD'] = dx > 20;
        }, { passive: false });

        canvas.addEventListener('touchend', e => {
            keys['ArrowUp'] = keys['KeyW'] = false;
            keys['ArrowLeft'] = keys['KeyA'] = false;
            keys['ArrowRight'] = keys['KeyD'] = false;
            keys['Space'] = false;
        });
    }

    /* ---------- update ---------- */
    function update(dt) {
        if (state !== 'playing') return;
        const { w, h } = R.getSize();

        // input mapping
        ship.rotatingLeft = keys['ArrowLeft'] || keys['KeyA'];
        ship.rotatingRight = keys['ArrowRight'] || keys['KeyD'];
        ship.thrusting = keys['ArrowUp'] || keys['KeyW'];

        // ship
        ship.update(w, h, dt);

        // thrust particles + sound
        if (ship.thrusting && !ship.dead) {
            particles.push(makeThrustParticle(ship));
            thrustSoundTimer -= dt;
            if (thrustSoundTimer <= 0) {
                A.play('thrust');
                thrustSoundTimer = 0.08;
            }
        } else {
            thrustSoundTimer = 0;
        }

        // shooting
        if ((keys['Space']) && !ship.dead) {
            const b = ship.shoot();
            if (b) {
                bullets.push(b);
                A.play('shoot');
            }
        }

        // bullets
        bullets.forEach(b => b.update(w, h, dt));
        bullets = bullets.filter(b => b.alive);

        // asteroids
        asteroids.forEach(a => a.update(w, h, dt));

        // ufos
        ufos.forEach(u => {
            u.update(w, h, dt, ship.x, ship.y);
            if (u.soundTimer <= 0 && u.alive) {
                A.play('ufo');
                u.soundTimer = 0.5;
            }
            const b = u.tryShoot(ship.x, ship.y);
            if (b) {
                bullets.push(b);
                A.play('ufo-shoot');
            }
        });
        ufos = ufos.filter(u => u.alive);

        // particles
        particles.forEach(p => p.update(dt));
        particles = particles.filter(p => p.alive);

        // collisions
        checkCollisions(w, h);

        // wave complete
        if (asteroids.length === 0 && ufos.length === 0 && !ship.dead) {
            spawnWave();
        }

        // wave text timer
        if (waveTextTimer > 0) waveTextTimer -= dt;

        // UFO spawning
        ufoSpawnTimer -= dt;
        if (ufoSpawnTimer <= 0 && ufos.length === 0) {
            const small = wave >= 3 && Math.random() < 0.4 + wave * 0.05;
            ufos.push(new UFO(w, h, small));
            ufoSpawnTimer = randRange(20, 40);
        }

        // background beat
        beatTimer -= dt;
        if (beatTimer <= 0) {
            beatTimer = beatInterval;
            beatToggle = !beatToggle;
            A.play(beatToggle ? 'beat-high' : 'beat-low');
        }

        // ship respawn
        if (ship.dead) {
            ship.respawnTimer -= dt;
            if (ship.respawnTimer <= 0) {
                if (lives > 0) {
                    ship = new Ship(w / 2, h / 2);
                    ship.invulnerable = 3;
                } else {
                    // game over
                    if (score > highScore) {
                        highScore = score;
                        isNewHighScore = true;
                        localStorage.setItem(LS_KEY, highScore);
                    }
                    state = 'gameover';
                }
            }
        }

        // extra life
        if (score >= extraLifeThreshold) {
            lives++;
            extraLifeThreshold += 10000;
            A.play('extra-life');
        }
    }

    function checkCollisions(w, h) {
        // bullets vs asteroids
        for (let bi = bullets.length - 1; bi >= 0; bi--) {
            const b = bullets[bi];
            if (b.isEnemy) continue;
            for (let ai = asteroids.length - 1; ai >= 0; ai--) {
                const a = asteroids[ai];
                if (dist(b, a) < a.radius + b.radius) {
                    // hit
                    score += a.score;
                    const color = a.size === 'large' ? '#aaaacc' : a.size === 'medium' ? '#8888aa' : '#666688';
                    particles.push(...makeExplosion(a.x, a.y,
                        a.size === 'large' ? 15 : a.size === 'medium' ? 10 : 6,
                        a.size === 'large' ? 120 : 80,
                        color,
                        [0.3, 0.8]
                    ));
                    const snd = a.size === 'large' ? 'explode-large' : a.size === 'medium' ? 'explode-medium' : 'explode-small';
                    A.play(snd);
                    const children = a.split();
                    asteroids.splice(ai, 1);
                    asteroids.push(...children);
                    bullets.splice(bi, 1);
                    break;
                }
            }
        }

        // bullets vs ufos
        for (let bi = bullets.length - 1; bi >= 0; bi--) {
            const b = bullets[bi];
            if (b.isEnemy) continue;
            for (let ui = ufos.length - 1; ui >= 0; ui--) {
                const u = ufos[ui];
                if (dist(b, u) < u.radius + b.radius) {
                    score += u.score;
                    particles.push(...makeExplosion(u.x, u.y, 18, 150, '#44ff88', [0.3, 1.0]));
                    A.play('explode-large');
                    ufos.splice(ui, 1);
                    bullets.splice(bi, 1);
                    break;
                }
            }
        }

        // ship vs asteroids
        if (!ship.dead && ship.invulnerable <= 0) {
            for (let ai = asteroids.length - 1; ai >= 0; ai--) {
                const a = asteroids[ai];
                if (dist(ship, a) < ship.radius + a.radius * 0.8) {
                    killShip();
                    // also destroy the asteroid
                    particles.push(...makeExplosion(a.x, a.y, 10, 100, '#aaaacc', [0.3, 0.6]));
                    const children = a.split();
                    asteroids.splice(ai, 1);
                    asteroids.push(...children);
                    break;
                }
            }
        }

        // ship vs ufos
        if (!ship.dead && ship.invulnerable <= 0) {
            for (let ui = ufos.length - 1; ui >= 0; ui--) {
                const u = ufos[ui];
                if (dist(ship, u) < ship.radius + u.radius) {
                    killShip();
                    particles.push(...makeExplosion(u.x, u.y, 18, 150, '#44ff88', [0.3, 1.0]));
                    ufos.splice(ui, 1);
                    break;
                }
            }
        }

        // enemy bullets vs ship
        if (!ship.dead && ship.invulnerable <= 0) {
            for (let bi = bullets.length - 1; bi >= 0; bi--) {
                const b = bullets[bi];
                if (!b.isEnemy) continue;
                if (dist(ship, b) < ship.radius + b.radius) {
                    killShip();
                    bullets.splice(bi, 1);
                    break;
                }
            }
        }
    }

    function killShip() {
        particles.push(...makeShipExplosion(ship));
        A.play('ship-explode');
        ship.dead = true;
        ship.respawnTimer = 2.5;
        lives--;
    }

    /* ---------- draw ---------- */
    function draw() {
        R.clear();

        if (state === 'title') {
            // animate some floating asteroids on title
            R.drawTitleScreen(highScore);
            return;
        }

        // draw all entities
        asteroids.forEach(a => R.drawAsteroid(a));
        ufos.forEach(u => R.drawUFO(u));
        bullets.forEach(b => R.drawBullet(b));
        particles.forEach(p => R.drawParticle(p));
        R.drawShip(ship);

        R.drawHUD(score, lives, wave, highScore);

        if (waveTextTimer > 0) R.drawWaveText(wave);

        if (state === 'gameover') {
            R.drawGameOverScreen(score, highScore, isNewHighScore);
        }

        if (state === 'paused') {
            R.drawPausedOverlay();
        }
    }

    /* ---------- loop ---------- */
    function loop(timestamp) {
        if (!lastTime) lastTime = timestamp;
        let dt = (timestamp - lastTime) / 1000;
        lastTime = timestamp;

        // clamp dt to avoid spiral of death
        if (dt > 0.1) dt = 0.1;

        update(dt);
        draw();
        requestAnimationFrame(loop);
    }

    /* ---------- boot ---------- */
    function boot() {
        const canvas = document.getElementById('game-canvas');
        R.init(canvas);
        setupInput();

        window.addEventListener('resize', () => {
            R.resize();
        });

        // start
        state = 'title';
        requestAnimationFrame(loop);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
