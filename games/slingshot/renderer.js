/**
 * renderer.js — Canvas rendering for Slingshot Siege
 * Parallax backgrounds, block drawing, particles, UI overlays
 */
'use strict';

const Renderer = (() => {
    let canvas, ctx;
    let cameraX = 0;
    let targetCameraX = 0;
    let canvasW, canvasH;
    let scaleX, scaleY, scale;

    const WORLD_W = 1600;
    const WORLD_H = 900;

    // Background palettes
    const BG = {
        meadow: {
            sky: ['#87CEEB', '#B0E0E6'],
            hills: ['#5dba5d', '#3d8b3d', '#2d6b2d'],
            ground: '#6abf6a',
            groundDark: '#4a9f4a',
            clouds: true,
            sunColor: '#FFF176',
        },
        desert: {
            sky: ['#fad390', '#e58e26'],
            hills: ['#d4a76a', '#c4955a', '#b4854a'],
            ground: '#d4b896',
            groundDark: '#b4986a',
            clouds: false,
            sunColor: '#FFE082',
        },
        winter: {
            sky: ['#b3cde0', '#6497b1'],
            hills: ['#dce6f0', '#c0d0e0', '#a8b8c8'],
            ground: '#e8f0f8',
            groundDark: '#c8d8e8',
            clouds: true,
            sunColor: '#E0E0E0',
        },
        sunset: {
            sky: ['#ff6b6b', '#c44569', '#574b90'],
            hills: ['#3c2a4a', '#2d1f3d', '#1e142e'],
            ground: '#3c2a4a',
            groundDark: '#2d1f3d',
            clouds: true,
            sunColor: '#FF8A65',
        },
    };

    // Cloud positions (generated once)
    let clouds = [];
    function generateClouds() {
        clouds = [];
        for (let i = 0; i < 8; i++) {
            clouds.push({
                x: Math.random() * WORLD_W * 1.5,
                y: 40 + Math.random() * 120,
                w: 60 + Math.random() * 100,
                h: 20 + Math.random() * 30,
                speed: 5 + Math.random() * 10,
            });
        }
    }
    generateClouds();

    function init(cvs) {
        canvas = cvs;
        ctx = canvas.getContext('2d');
        resize();
    }

    function resize() {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvasW = rect.width;
        canvasH = rect.height;
        canvas.width = canvasW * dpr;
        canvas.height = canvasH * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        scaleX = canvasW / WORLD_W;
        scaleY = canvasH / WORLD_H;
        scale = Math.min(scaleX, scaleY);
    }

    function worldToScreen(wx, wy) {
        return {
            x: (wx - cameraX) * scale + (canvasW - WORLD_W * scale) / 2,
            y: wy * scale + (canvasH - WORLD_H * scale) / 2,
        };
    }

    function screenToWorld(sx, sy) {
        return {
            x: (sx - (canvasW - WORLD_W * scale) / 2) / scale + cameraX,
            y: (sy - (canvasH - WORLD_H * scale) / 2) / scale,
        };
    }

    function setCameraTarget(x) {
        targetCameraX = Math.max(0, Math.min(x - WORLD_W * 0.3, WORLD_W * 0.3));
    }

    function updateCamera(dt) {
        cameraX += (targetCameraX - cameraX) * 3 * dt;
    }

    function clear() {
        ctx.clearRect(0, 0, canvasW, canvasH);
    }

    function drawBackground(bgName, time) {
        const bg = BG[bgName] || BG.meadow;

        // Sky gradient
        const grad = ctx.createLinearGradient(0, 0, 0, canvasH);
        bg.sky.forEach((c, i) => grad.addColorStop(i / (bg.sky.length - 1), c));
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvasW, canvasH);

        // Sun
        const sunPos = worldToScreen(WORLD_W * 0.8, 80);
        ctx.fillStyle = bg.sunColor;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(sunPos.x, sunPos.y, 40 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Clouds
        if (bg.clouds) {
            ctx.fillStyle = 'rgba(255,255,255,0.6)';
            for (const c of clouds) {
                const cx = ((c.x + time * c.speed) % (WORLD_W * 1.5)) - WORLD_W * 0.25;
                const p = worldToScreen(cx, c.y);
                _drawCloud(p.x, p.y, c.w * scale, c.h * scale);
            }
        }

        // Parallax hills
        bg.hills.forEach((color, i) => {
            const parallax = 0.3 + i * 0.2;
            const hillY = WORLD_H - 200 + i * 50;
            ctx.fillStyle = color;
            ctx.beginPath();
            const startP = worldToScreen(-100 - cameraX * parallax + cameraX, hillY);
            ctx.moveTo(-10, canvasH);
            for (let wx = -100; wx <= WORLD_W + 200; wx += 40) {
                const p = worldToScreen(wx - cameraX * parallax + cameraX, hillY + Math.sin(wx * 0.005 + i * 2) * (30 - i * 5));
                ctx.lineTo(p.x, p.y);
            }
            ctx.lineTo(canvasW + 10, canvasH);
            ctx.closePath();
            ctx.fill();
        });

        // Ground
        const gp = worldToScreen(0, Levels.GROUND);
        ctx.fillStyle = bg.ground;
        ctx.fillRect(0, gp.y, canvasW, canvasH - gp.y);

        // Ground stripe
        ctx.fillStyle = bg.groundDark;
        ctx.fillRect(0, gp.y, canvasW, 4 * scale);
    }

    function _drawCloud(x, y, w, h) {
        ctx.beginPath();
        ctx.ellipse(x, y, w * 0.5, h * 0.5, 0, 0, Math.PI * 2);
        ctx.ellipse(x - w * 0.25, y + h * 0.1, w * 0.35, h * 0.4, 0, 0, Math.PI * 2);
        ctx.ellipse(x + w * 0.25, y + h * 0.05, w * 0.3, h * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    // Material colors
    const MAT_COLORS = {
        wood:  { fill: '#c4883c', stroke: '#a06828', crack: '#8b5e3c' },
        glass: { fill: 'rgba(126,200,227,0.7)', stroke: '#5ba3c0', crack: '#b3e5fc' },
        stone: { fill: '#8a8a8a', stroke: '#5a5a5a', crack: '#444444' },
        ice:   { fill: 'rgba(179,229,252,0.8)', stroke: '#81d4fa', crack: '#e1f5fe' },
        metal: { fill: '#a0a0a0', stroke: '#707070', crack: '#555555' },
    };

    function drawBlock(body) {
        const p = worldToScreen(body.x, body.y);
        const w = body.w * scale;
        const h = body.h * scale;
        const mat = MAT_COLORS[body.material] || MAT_COLORS.wood;
        const dmgRatio = 1 - body.hp / body.maxHp;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(body.angle);

        // TNT blocks get special treatment
        if (body.userData.tnt) {
            ctx.fillStyle = '#cc3333';
            ctx.strokeStyle = '#881111';
            ctx.lineWidth = 2;
            ctx.fillRect(-w / 2, -h / 2, w, h);
            ctx.strokeRect(-w / 2, -h / 2, w, h);
            // TNT label
            ctx.fillStyle = '#fff';
            ctx.font = `bold ${Math.max(8, h * 0.5)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('TNT', 0, 0);
        } else {
            // Block body
            ctx.fillStyle = mat.fill;
            ctx.strokeStyle = mat.stroke;
            ctx.lineWidth = Math.max(1, 2 * scale);
            ctx.fillRect(-w / 2, -h / 2, w, h);
            ctx.strokeRect(-w / 2, -h / 2, w, h);

            // Wood grain
            if (body.material === 'wood') {
                ctx.strokeStyle = 'rgba(160,104,40,0.3)';
                ctx.lineWidth = 1;
                for (let i = 0; i < 3; i++) {
                    const ly = -h / 2 + (i + 1) * h / 4;
                    ctx.beginPath();
                    ctx.moveTo(-w / 2 + 2, ly);
                    ctx.lineTo(w / 2 - 2, ly);
                    ctx.stroke();
                }
            }

            // Glass shine
            if (body.material === 'glass' || body.material === 'ice') {
                ctx.fillStyle = 'rgba(255,255,255,0.3)';
                ctx.fillRect(-w / 2 + 2, -h / 2 + 2, w * 0.3, h * 0.4);
            }

            // Damage cracks
            if (dmgRatio > 0.2) {
                ctx.strokeStyle = mat.crack;
                ctx.lineWidth = 1;
                ctx.globalAlpha = dmgRatio;
                const numCracks = Math.floor(dmgRatio * 5) + 1;
                for (let i = 0; i < numCracks; i++) {
                    const sx = (Math.random() - 0.5) * w * 0.8;
                    const sy = (Math.random() - 0.5) * h * 0.8;
                    ctx.beginPath();
                    ctx.moveTo(sx, sy);
                    ctx.lineTo(sx + (Math.random() - 0.5) * w * 0.5, sy + (Math.random() - 0.5) * h * 0.5);
                    ctx.stroke();
                }
                ctx.globalAlpha = 1;
            }
        }

        ctx.restore();
    }

    function drawEnemy(body) {
        const p = worldToScreen(body.x, body.y);
        const r = body.radius * scale;

        // Green pig body
        ctx.fillStyle = '#6abf4b';
        ctx.strokeStyle = '#3d8b2e';
        ctx.lineWidth = 2 * scale;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Snout
        ctx.fillStyle = '#8bd46a';
        ctx.beginPath();
        ctx.ellipse(p.x, p.y + r * 0.15, r * 0.45, r * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#3d8b2e';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Nostrils
        ctx.fillStyle = '#3d8b2e';
        ctx.beginPath();
        ctx.arc(p.x - r * 0.12, p.y + r * 0.18, r * 0.08, 0, Math.PI * 2);
        ctx.arc(p.x + r * 0.12, p.y + r * 0.18, r * 0.08, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(p.x - r * 0.25, p.y - r * 0.2, r * 0.22, 0, Math.PI * 2);
        ctx.arc(p.x + r * 0.25, p.y - r * 0.2, r * 0.22, 0, Math.PI * 2);
        ctx.fill();

        // Pupils
        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.arc(p.x - r * 0.22, p.y - r * 0.18, r * 0.1, 0, Math.PI * 2);
        ctx.arc(p.x + r * 0.22, p.y - r * 0.18, r * 0.1, 0, Math.PI * 2);
        ctx.fill();

        // Damage indicator
        const dmgRatio = 1 - body.hp / body.maxHp;
        if (dmgRatio > 0.3) {
            ctx.fillStyle = `rgba(255,0,0,${dmgRatio * 0.3})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function drawProjectile(body, birdType) {
        const p = worldToScreen(body.x, body.y);
        const r = body.radius * scale;
        const info = Levels.BIRDS[birdType];

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(body.angle);

        // Body
        ctx.fillStyle = info.color;
        ctx.strokeStyle = _darken(info.color, 0.3);
        ctx.lineWidth = 2 * scale;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Eyes
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(-r * 0.2, -r * 0.15, r * 0.25, 0, Math.PI * 2);
        ctx.arc(r * 0.2, -r * 0.15, r * 0.25, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.arc(-r * 0.15, -r * 0.12, r * 0.12, 0, Math.PI * 2);
        ctx.arc(r * 0.15, -r * 0.12, r * 0.12, 0, Math.PI * 2);
        ctx.fill();

        // Beak
        ctx.fillStyle = '#f4a742';
        ctx.beginPath();
        ctx.moveTo(0, r * 0.05);
        ctx.lineTo(-r * 0.2, r * 0.35);
        ctx.lineTo(r * 0.2, r * 0.35);
        ctx.closePath();
        ctx.fill();

        // Type indicator on top (feathers/hat)
        if (birdType === 'explosive') {
            // Fuse
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, -r);
            ctx.lineTo(0, -r * 1.4);
            ctx.stroke();
            ctx.fillStyle = '#ff6600';
            ctx.beginPath();
            ctx.arc(0, -r * 1.5, 3 * scale, 0, Math.PI * 2);
            ctx.fill();
        } else if (birdType === 'splitter') {
            // Three feathers
            ctx.fillStyle = '#2980b9';
            for (let a = -1; a <= 1; a++) {
                ctx.beginPath();
                ctx.ellipse(a * r * 0.3, -r * 0.9, r * 0.1, r * 0.3, a * 0.3, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (birdType === 'heavy') {
            // Helmet
            ctx.fillStyle = '#666';
            ctx.beginPath();
            ctx.arc(0, -r * 0.2, r * 1.05, Math.PI, 0);
            ctx.fill();
        } else if (birdType === 'speedy') {
            // Tail streak
            ctx.fillStyle = '#e67e22';
            ctx.beginPath();
            ctx.moveTo(-r * 0.15, -r * 0.8);
            ctx.lineTo(r * 0.15, -r * 0.8);
            ctx.lineTo(0, -r * 1.3);
            ctx.closePath();
            ctx.fill();
        }

        ctx.restore();
    }

    function drawSlingshot(x, y) {
        const p = worldToScreen(x, y);
        const s = scale;

        // Back arm
        ctx.fillStyle = '#6b4226';
        ctx.strokeStyle = '#4a2d16';
        ctx.lineWidth = 3 * s;
        _roundRect(p.x + 12 * s, p.y - 70 * s, 8 * s, 80 * s, 4 * s);

        // Base
        ctx.fillStyle = '#8b5e3c';
        _roundRect(p.x - 8 * s, p.y - 10 * s, 16 * s, 20 * s, 3 * s);

        // Front arm
        ctx.fillStyle = '#6b4226';
        _roundRect(p.x - 20 * s, p.y - 70 * s, 8 * s, 80 * s, 4 * s);

        // Fork tips
        ctx.fillStyle = '#4a2d16';
        ctx.beginPath();
        ctx.arc(p.x - 16 * s, p.y - 72 * s, 5 * s, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x + 16 * s, p.y - 72 * s, 5 * s, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawBand(slingshotX, slingshotY, birdX, birdY, hasBird) {
        const sp = worldToScreen(slingshotX, slingshotY);
        const bp = hasBird ? worldToScreen(birdX, birdY) : sp;
        const s = scale;

        ctx.strokeStyle = '#3e2723';
        ctx.lineWidth = 4 * s;
        ctx.lineCap = 'round';

        // Back band (behind bird)
        ctx.beginPath();
        ctx.moveTo(sp.x + 16 * s, sp.y - 72 * s);
        ctx.lineTo(bp.x, bp.y);
        ctx.stroke();

        // Front band (in front of bird, drawn after bird)
    }

    function drawBandFront(slingshotX, slingshotY, birdX, birdY, hasBird) {
        const sp = worldToScreen(slingshotX, slingshotY);
        const bp = hasBird ? worldToScreen(birdX, birdY) : sp;
        const s = scale;

        ctx.strokeStyle = '#3e2723';
        ctx.lineWidth = 4 * s;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(sp.x - 16 * s, sp.y - 72 * s);
        ctx.lineTo(bp.x, bp.y);
        ctx.stroke();
    }

    function drawTrajectory(points) {
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        for (let i = 0; i < points.length; i++) {
            const p = worldToScreen(points[i].x, points[i].y);
            const r = Math.max(1, (3 - i * 0.1) * scale);
            ctx.beginPath();
            ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function drawParticles(particles) {
        for (const p of particles) {
            const sp = worldToScreen(p.x, p.y);
            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.translate(sp.x, sp.y);
            if (p.rotation !== undefined) ctx.rotate(p.rotation);
            ctx.fillStyle = p.color;
            const s = p.size * scale;
            ctx.fillRect(-s / 2, -s / 2, s, s);
            ctx.restore();
        }
    }

    function drawBirdQueue(birds, currentIndex) {
        const startX = 20;
        const startY = canvasH - 50;
        ctx.font = `${12}px "Fredoka", sans-serif`;
        ctx.textAlign = 'center';

        for (let i = currentIndex; i < birds.length; i++) {
            const bx = startX + (i - currentIndex) * 40;
            const by = startY;
            const info = Levels.BIRDS[birds[i]];
            const r = i === currentIndex ? 14 : 10;

            ctx.fillStyle = info.color;
            ctx.strokeStyle = _darken(info.color, 0.3);
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(bx, by, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            if (i === currentIndex) {
                ctx.fillStyle = '#fff';
                ctx.fillText(info.name, bx, by - 20);
            }
        }
    }

    function drawScore(score, stars, levelName) {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, canvasW, 40);

        ctx.font = `bold 16px "Fredoka", sans-serif`;
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(levelName, 10, 20);

        ctx.textAlign = 'right';
        ctx.fillText(`Score: ${score}`, canvasW - 10, 20);

        // Stars
        const starX = canvasW / 2;
        for (let i = 0; i < 3; i++) {
            ctx.fillStyle = i < stars ? '#FFD700' : '#555';
            _drawStar(starX - 30 + i * 30, 20, 10, 5);
        }
    }

    function drawLevelComplete(score, stars, birdsLeft) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, canvasW, canvasH);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.font = `bold 48px "Fredoka", sans-serif`;
        ctx.fillStyle = '#FFD700';
        ctx.fillText('Level Complete!', canvasW / 2, canvasH / 2 - 80);

        // Stars
        for (let i = 0; i < 3; i++) {
            ctx.fillStyle = i < stars ? '#FFD700' : '#555';
            _drawStar(canvasW / 2 - 50 + i * 50, canvasH / 2 - 20, 20, 10);
        }

        ctx.font = `24px "Fredoka", sans-serif`;
        ctx.fillStyle = '#fff';
        ctx.fillText(`Score: ${score}`, canvasW / 2, canvasH / 2 + 30);
        ctx.fillText(`Birds remaining: ${birdsLeft}`, canvasW / 2, canvasH / 2 + 60);

        ctx.font = `18px "Fredoka", sans-serif`;
        ctx.fillStyle = '#aaa';
        ctx.fillText('Click to continue', canvasW / 2, canvasH / 2 + 110);
    }

    function drawLevelFailed() {
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, canvasW, canvasH);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.font = `bold 48px "Fredoka", sans-serif`;
        ctx.fillStyle = '#e74c3c';
        ctx.fillText('Level Failed', canvasW / 2, canvasH / 2 - 40);

        ctx.font = `18px "Fredoka", sans-serif`;
        ctx.fillStyle = '#aaa';
        ctx.fillText('Click to retry', canvasW / 2, canvasH / 2 + 20);
    }

    function _drawStar(cx, cy, outerR, innerR) {
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

    function _roundRect(x, y, w, h, r) {
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

    function _darken(hex, amount) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgb(${Math.floor(r * (1 - amount))},${Math.floor(g * (1 - amount))},${Math.floor(b * (1 - amount))})`;
    }

    return {
        init,
        resize,
        worldToScreen,
        screenToWorld,
        setCameraTarget,
        updateCamera,
        clear,
        drawBackground,
        drawBlock,
        drawEnemy,
        drawProjectile,
        drawSlingshot,
        drawBand,
        drawBandFront,
        drawTrajectory,
        drawParticles,
        drawBirdQueue,
        drawScore,
        drawLevelComplete,
        drawLevelFailed,
        get scale() { return scale; },
        get canvasW() { return canvasW; },
        get canvasH() { return canvasH; },
    };
})();
