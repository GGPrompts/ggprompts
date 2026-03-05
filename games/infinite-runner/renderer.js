/**
 * renderer.js — Canvas renderer for Infinite Runner
 * Parallax backgrounds, terrain drawing, player animation, particles, HUD
 */
'use strict';

const Renderer = (() => {
    let canvas, ctx;
    let W, H;
    let shakeX = 0, shakeY = 0;
    let shakeAmount = 0;
    let flashAlpha = 0;

    // Parallax layers
    const BG_COLORS = {
        sky: '#1a0a2e',
        horizon: '#2d1b4e',
        mid: '#1e1238',
        front: '#120a24'
    };

    // Star field
    let stars = [];

    // City silhouette layers
    let buildings = [[], [], []];

    function init(c) {
        canvas = c;
        ctx = canvas.getContext('2d');
        resize();
        generateStars();
        generateBuildings();
    }

    function resize() {
        W = canvas.width = canvas.clientWidth;
        H = canvas.height = canvas.clientHeight;
        generateBuildings();
    }

    function generateStars() {
        stars = [];
        for (let i = 0; i < 80; i++) {
            stars.push({
                x: Math.random() * 2000,
                y: Math.random() * H * 0.6,
                size: 0.5 + Math.random() * 2,
                twinkle: Math.random() * Math.PI * 2,
                speed: 0.1 + Math.random() * 0.3
            });
        }
    }

    function generateBuildings() {
        buildings = [[], [], []];
        // 3 layers of buildings at different depths
        const layerConfigs = [
            { count: 12, minH: 60, maxH: 180, minW: 60, maxW: 140, color: '#0d0820' },
            { count: 16, minH: 40, maxH: 140, minW: 40, maxW: 100, color: '#150e2a' },
            { count: 20, minH: 30, maxH: 100, minW: 30, maxW: 80, color: '#1a1030' }
        ];

        for (let layer = 0; layer < 3; layer++) {
            const cfg = layerConfigs[layer];
            let bx = 0;
            for (let i = 0; i < cfg.count; i++) {
                const w = cfg.minW + Math.random() * (cfg.maxW - cfg.minW);
                const h = cfg.minH + Math.random() * (cfg.maxH - cfg.minH);
                buildings[layer].push({
                    x: bx,
                    width: w,
                    height: h,
                    color: cfg.color,
                    windows: Math.random() > 0.3,
                    antenna: Math.random() > 0.7
                });
                bx += w + Math.random() * 30;
            }
        }
    }

    function drawSky(cameraX) {
        // Gradient sky
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, BG_COLORS.sky);
        grad.addColorStop(0.5, BG_COLORS.horizon);
        grad.addColorStop(1, BG_COLORS.front);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        // Moon
        const moonX = W * 0.8 - (cameraX * 0.01) % W;
        const moonY = H * 0.15;
        ctx.fillStyle = '#e8dcc8';
        ctx.beginPath();
        ctx.arc(moonX, moonY, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = BG_COLORS.sky;
        ctx.beginPath();
        ctx.arc(moonX + 8, moonY - 5, 25, 0, Math.PI * 2);
        ctx.fill();

        // Stars
        const time = Date.now() * 0.001;
        for (const star of stars) {
            const sx = ((star.x - cameraX * star.speed * 0.02) % 2000 + 2000) % 2000;
            if (sx > W) continue;
            const alpha = 0.4 + 0.6 * Math.sin(time * 2 + star.twinkle);
            ctx.fillStyle = `rgba(255, 255, 240, ${alpha})`;
            ctx.fillRect(sx, star.y, star.size, star.size);
        }
    }

    function drawBuildings(cameraX, groundY) {
        const parallaxSpeeds = [0.05, 0.1, 0.15];

        for (let layer = 0; layer < 3; layer++) {
            const speed = parallaxSpeeds[layer];
            const offsetX = -(cameraX * speed) % 2000;

            for (const b of buildings[layer]) {
                const bx = b.x + offsetX;
                const wrappedX = ((bx % 2000) + 2000) % 2000 - 200;
                if (wrappedX > W + 200 || wrappedX + b.width < -200) continue;

                const by = groundY - b.height;
                ctx.fillStyle = b.color;
                ctx.fillRect(wrappedX, by, b.width, b.height);

                // Windows
                if (b.windows) {
                    const winSize = 4;
                    const spacing = 12;
                    for (let wy = by + 10; wy < groundY - 15; wy += spacing) {
                        for (let wx = wrappedX + 8; wx < wrappedX + b.width - 8; wx += spacing) {
                            const lit = Math.sin(wx * 13.7 + wy * 7.3) > 0.2;
                            ctx.fillStyle = lit ? 'rgba(255, 220, 120, 0.6)' : 'rgba(40, 30, 60, 0.5)';
                            ctx.fillRect(wx, wy, winSize, winSize);
                        }
                    }
                }

                // Antenna
                if (b.antenna) {
                    ctx.strokeStyle = b.color;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(wrappedX + b.width / 2, by);
                    ctx.lineTo(wrappedX + b.width / 2, by - 20);
                    ctx.stroke();

                    // Blinking light
                    if (Math.sin(Date.now() * 0.003 + wrappedX) > 0) {
                        ctx.fillStyle = '#ff3344';
                        ctx.beginPath();
                        ctx.arc(wrappedX + b.width / 2, by - 20, 2, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }
        }
    }

    function drawTerrain(segments, cameraX, groundY) {
        for (const seg of segments) {
            const sx = seg.x - cameraX;
            if (sx > W + 50 || sx + seg.width < -50) continue;

            if (seg.type === Terrain.GROUND) {
                // Ground surface
                ctx.fillStyle = '#2a1a3e';
                ctx.fillRect(sx, groundY, seg.width, H - groundY);

                // Surface line
                ctx.fillStyle = '#6b3fa0';
                ctx.fillRect(sx, groundY, seg.width, 3);

                // Surface detail
                ctx.fillStyle = '#3d2560';
                ctx.fillRect(sx, groundY + 3, seg.width, 6);
            } else if (seg.type === Terrain.GAP) {
                // Draw danger zone at bottom of gap
                const grad = ctx.createLinearGradient(0, groundY, 0, groundY + 60);
                grad.addColorStop(0, 'rgba(255, 50, 50, 0.2)');
                grad.addColorStop(1, 'transparent');
                ctx.fillStyle = grad;
                ctx.fillRect(sx, groundY, seg.width, 60);
            } else if (seg.type === Terrain.BARRIER) {
                const bh = seg.extra.height;
                const by = groundY - bh;

                // Barrier body
                ctx.fillStyle = '#cc2244';
                ctx.fillRect(sx, by, seg.width, bh);

                // Barrier stripe pattern
                ctx.fillStyle = '#ff4466';
                for (let sy = by; sy < groundY; sy += 16) {
                    ctx.fillRect(sx, sy, seg.width, 4);
                }

                // Barrier glow
                ctx.shadowColor = '#ff2244';
                ctx.shadowBlur = 10;
                ctx.fillStyle = '#ff4466';
                ctx.fillRect(sx, by, seg.width, 3);
                ctx.shadowBlur = 0;

                // Warning triangle
                ctx.fillStyle = '#ffcc00';
                const cx = sx + seg.width / 2;
                const cy = by + bh / 2;
                ctx.beginPath();
                ctx.moveTo(cx, cy - 8);
                ctx.lineTo(cx + 7, cy + 5);
                ctx.lineTo(cx - 7, cy + 5);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#cc2244';
                ctx.font = 'bold 8px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('!', cx, cy + 4);
            } else if (seg.type === Terrain.LOW_CEILING) {
                const ceilY = seg.extra.ceilingY;
                const ch = seg.extra.height;

                // Ceiling
                ctx.fillStyle = '#882200';
                ctx.fillRect(sx, ceilY - 20, seg.width, 20);

                // Warning stripes on ceiling underside
                ctx.fillStyle = '#aa4400';
                ctx.fillRect(sx, ceilY - 5, seg.width, 5);

                // Slide indicator arrows
                ctx.fillStyle = 'rgba(255, 200, 0, 0.4)';
                ctx.font = '16px sans-serif';
                ctx.textAlign = 'center';
                const arrowX = sx + seg.width / 2;
                ctx.fillText('\u2193', arrowX, ceilY + ch / 2 + 6);
            }
        }
    }

    function drawCollectibles(collectibles, cameraX, time) {
        for (const c of collectibles) {
            if (c.collected) continue;
            const cx = c.x - cameraX;
            if (cx < -20 || cx > W + 20) continue;

            const bob = Math.sin(time * 4 + c.bobPhase) * 4;
            const cy = c.y + bob;

            if (c.type === 'gem') {
                // Diamond shape - score multiplier
                ctx.fillStyle = '#00ffaa';
                ctx.shadowColor = '#00ffaa';
                ctx.shadowBlur = 12;
                ctx.beginPath();
                ctx.moveTo(cx, cy - 10);
                ctx.lineTo(cx + 8, cy);
                ctx.lineTo(cx, cy + 10);
                ctx.lineTo(cx - 8, cy);
                ctx.closePath();
                ctx.fill();
                ctx.shadowBlur = 0;

                // Inner shine
                ctx.fillStyle = '#88ffcc';
                ctx.beginPath();
                ctx.moveTo(cx, cy - 5);
                ctx.lineTo(cx + 4, cy);
                ctx.lineTo(cx, cy + 5);
                ctx.lineTo(cx - 4, cy);
                ctx.closePath();
                ctx.fill();
            } else {
                // Coin
                ctx.fillStyle = '#ffd700';
                ctx.shadowColor = '#ffd700';
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.arc(cx, cy, c.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;

                // Inner circle
                ctx.fillStyle = '#ffea70';
                ctx.beginPath();
                ctx.arc(cx, cy, c.radius - 3, 0, Math.PI * 2);
                ctx.fill();

                // Dollar sign
                ctx.fillStyle = '#c8a000';
                ctx.font = 'bold 10px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('$', cx, cy);
            }
        }
    }

    function drawPlayer(state, cameraX) {
        const px = state.x - cameraX;
        let py = state.dead ? state.deathY : state.y;

        ctx.save();
        ctx.translate(px + shakeX, py + shakeY);

        // Invincibility flash
        if (state.invincibleTimer > 0 && Math.sin(Date.now() * 0.02) > 0) {
            ctx.globalAlpha = 0.5;
        }

        // Trail particles
        for (const p of state.trailParticles) {
            const ppx = p.x - cameraX;
            ctx.fillStyle = `rgba(120, 80, 255, ${p.life * 0.6})`;
            ctx.fillRect(ppx - px, p.y - py, p.size, p.size);
        }

        if (state.dead) {
            // Death tumble
            const rot = Date.now() * 0.01;
            ctx.translate(state.width / 2, state.height / 2);
            ctx.rotate(rot);
            ctx.translate(-state.width / 2, -state.height / 2);
        }

        if (state.sliding) {
            // Sliding pose - low rectangle
            const slideY = state.height - state.slideHeight;
            ctx.fillStyle = '#7c4dff';
            ctx.fillRect(-state.width / 2, slideY, state.width, state.slideHeight);

            // Visor
            ctx.fillStyle = '#b388ff';
            ctx.fillRect(-state.width / 2 + 4, slideY + 4, state.width - 8, 6);

            // Slide sparks
            ctx.fillStyle = '#ffcc00';
            for (let i = 0; i < 3; i++) {
                const sx = -state.width / 2 + Math.random() * state.width;
                const sy = slideY + state.slideHeight - 2;
                ctx.fillRect(sx, sy, 2 + Math.random() * 4, 2);
            }
        } else {
            // Body
            ctx.fillStyle = '#7c4dff';
            ctx.fillRect(-state.width / 2, 0, state.width, state.height);

            // Head
            ctx.fillStyle = '#9c6fff';
            ctx.fillRect(-state.width / 2 + 2, 2, state.width - 4, 14);

            // Visor/eyes
            ctx.fillStyle = '#b388ff';
            ctx.fillRect(-state.width / 2 + 6, 5, state.width - 10, 6);

            // Eye dots
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(2, 6, 3, 4);
            ctx.fillRect(8, 6, 3, 4);

            // Legs animation
            if (state.onGround && !state.dead) {
                const legOffset = Math.sin(state.animFrame * Math.PI / 2) * 4;
                ctx.fillStyle = '#5c35cc';
                // Left leg
                ctx.fillRect(-state.width / 2 + 2, state.height - 12, 10, 12);
                // Right leg
                ctx.fillRect(state.width / 2 - 12, state.height - 12, 10, 12);

                // Running motion lines
                if (state.animFrame % 2 === 0) {
                    ctx.fillStyle = 'rgba(124, 77, 255, 0.3)';
                    ctx.fillRect(-state.width / 2 - 8, 10, 6, 2);
                    ctx.fillRect(-state.width / 2 - 12, 20, 8, 2);
                    ctx.fillRect(-state.width / 2 - 6, 30, 4, 2);
                }
            } else if (!state.onGround) {
                // Air pose - legs together
                ctx.fillStyle = '#5c35cc';
                ctx.fillRect(-4, state.height - 14, 8, 14);

                // Jump indicator
                if (state.jumpsLeft === 0) {
                    // Double jump ring
                    ctx.strokeStyle = 'rgba(124, 77, 255, 0.4)';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(0, state.height / 2, state.width, 0, Math.PI * 2);
                    ctx.stroke();
                }
            }

            // Jetpack/backpack
            ctx.fillStyle = '#5c35cc';
            ctx.fillRect(-state.width / 2 - 4, 16, 6, 16);

            // Backpack glow when in air
            if (!state.onGround && state.vy < 0) {
                ctx.fillStyle = '#ff6600';
                ctx.shadowColor = '#ff6600';
                ctx.shadowBlur = 8;
                ctx.fillRect(-state.width / 2 - 3, 32, 4, 4);
                ctx.shadowBlur = 0;
            }
        }

        ctx.restore();
    }

    function drawHUD(score, multiplier, distance, speed, highScore) {
        ctx.save();

        // Score
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px "Inter", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(score.toLocaleString(), 16, 16);

        // Multiplier
        if (multiplier > 1) {
            ctx.fillStyle = '#00ffaa';
            ctx.font = 'bold 16px "Inter", sans-serif';
            ctx.fillText('x' + multiplier.toFixed(1), 16, 46);
        }

        // Distance
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '14px "Inter", sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(Math.floor(distance) + 'm', W - 16, 16);

        // Speed indicator
        const speedPct = Math.min(1, speed / 15);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(W - 120, 38, 104, 8);
        const speedColor = speedPct < 0.5 ? '#00ff88' : speedPct < 0.8 ? '#ffcc00' : '#ff4444';
        ctx.fillStyle = speedColor;
        ctx.fillRect(W - 120, 38, 104 * speedPct, 8);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = '10px "Inter", sans-serif';
        ctx.fillText('SPEED', W - 16, 52);

        // High score
        if (highScore > 0) {
            ctx.fillStyle = 'rgba(255, 215, 0, 0.5)';
            ctx.font = '12px "Inter", sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('BEST: ' + highScore.toLocaleString(), 16, 68);
        }

        ctx.restore();
    }

    function drawGameOver(score, highScore, isNewHigh, distance) {
        // Overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, W, H);

        ctx.textAlign = 'center';

        // Title
        ctx.fillStyle = '#ff4466';
        ctx.font = 'bold 48px "Inter", sans-serif';
        ctx.fillText('GAME OVER', W / 2, H / 2 - 80);

        // Score
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px "Inter", sans-serif';
        ctx.fillText(score.toLocaleString(), W / 2, H / 2 - 20);

        // Distance
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '18px "Inter", sans-serif';
        ctx.fillText(Math.floor(distance) + ' meters', W / 2, H / 2 + 15);

        // New high score
        if (isNewHigh) {
            ctx.fillStyle = '#ffd700';
            ctx.font = 'bold 20px "Inter", sans-serif';
            ctx.fillText('NEW HIGH SCORE!', W / 2, H / 2 + 50);
        } else {
            ctx.fillStyle = 'rgba(255, 215, 0, 0.5)';
            ctx.font = '16px "Inter", sans-serif';
            ctx.fillText('Best: ' + highScore.toLocaleString(), W / 2, H / 2 + 50);
        }

        // Restart prompt
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '16px "Inter", sans-serif';
        const isMobile = 'ontouchstart' in window;
        ctx.fillText(isMobile ? 'Tap to restart' : 'Press SPACE or click to restart', W / 2, H / 2 + 100);
    }

    function drawStartScreen(highScore) {
        // Overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, W, H);

        ctx.textAlign = 'center';

        // Title
        ctx.fillStyle = '#7c4dff';
        ctx.font = 'bold 52px "Inter", sans-serif';
        ctx.fillText('NEON DASH', W / 2, H / 2 - 60);

        // Subtitle
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '18px "Inter", sans-serif';
        ctx.fillText('Infinite Runner', W / 2, H / 2 - 20);

        // Controls
        const isMobile = 'ontouchstart' in window;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '14px "Inter", sans-serif';

        if (isMobile) {
            ctx.fillText('Tap: Jump / Double-Jump', W / 2, H / 2 + 20);
            ctx.fillText('Swipe Down: Slide', W / 2, H / 2 + 42);
        } else {
            ctx.fillText('SPACE / UP / W / Click: Jump', W / 2, H / 2 + 20);
            ctx.fillText('DOWN / S: Slide', W / 2, H / 2 + 42);
        }

        // High score
        if (highScore > 0) {
            ctx.fillStyle = '#ffd700';
            ctx.font = '16px "Inter", sans-serif';
            ctx.fillText('High Score: ' + highScore.toLocaleString(), W / 2, H / 2 + 80);
        }

        // Start prompt
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px "Inter", sans-serif';
        const pulse = 0.6 + 0.4 * Math.sin(Date.now() * 0.004);
        ctx.globalAlpha = pulse;
        ctx.fillText(isMobile ? 'TAP TO START' : 'PRESS SPACE TO START', W / 2, H / 2 + 130);
        ctx.globalAlpha = 1;
    }

    function setShake(amount) {
        shakeAmount = amount;
    }

    function updateShake() {
        if (shakeAmount > 0.1) {
            shakeX = (Math.random() - 0.5) * shakeAmount;
            shakeY = (Math.random() - 0.5) * shakeAmount;
            shakeAmount *= 0.9;
        } else {
            shakeX = 0;
            shakeY = 0;
            shakeAmount = 0;
        }
    }

    function setFlash(alpha) {
        flashAlpha = alpha;
    }

    function drawFlash() {
        if (flashAlpha > 0.01) {
            ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`;
            ctx.fillRect(0, 0, W, H);
            flashAlpha *= 0.85;
        }
    }

    function clear() {
        ctx.clearRect(0, 0, W, H);
    }

    function getWidth() { return W; }
    function getHeight() { return H; }

    return {
        init,
        resize,
        clear,
        drawSky,
        drawBuildings,
        drawTerrain,
        drawCollectibles,
        drawPlayer,
        drawHUD,
        drawGameOver,
        drawStartScreen,
        drawFlash,
        setShake,
        updateShake,
        setFlash,
        getWidth,
        getHeight
    };
})();
