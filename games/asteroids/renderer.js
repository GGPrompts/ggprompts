/* asteroids/renderer.js -- Vector-style line drawing, HUD, screens */
'use strict';

window.AsteroidsRenderer = (function () {
    let canvas, ctx;
    let W, H;
    const GLOW_COLOR = 'rgba(100, 200, 255, 0.12)';

    function init(canvasEl) {
        canvas = canvasEl;
        ctx = canvas.getContext('2d');
        resize();
    }

    function resize() {
        W = canvas.width = canvas.clientWidth;
        H = canvas.height = canvas.clientHeight;
    }

    function clear() {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, W, H);
        // subtle scanlines
        ctx.fillStyle = 'rgba(255,255,255,0.012)';
        for (let y = 0; y < H; y += 3) {
            ctx.fillRect(0, y, W, 1);
        }
    }

    function setStroke(color, width) {
        ctx.strokeStyle = color;
        ctx.lineWidth = width || 1.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }

    function drawPoly(verts, close) {
        if (verts.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(verts[0].x, verts[0].y);
        for (let i = 1; i < verts.length; i++) {
            ctx.lineTo(verts[i].x, verts[i].y);
        }
        if (close !== false) ctx.closePath();
        ctx.stroke();
    }

    /* --- Ship --- */
    function drawShip(ship) {
        if (ship.dead) return;
        // blink when invulnerable
        if (ship.invulnerable > 0 && Math.floor(ship.invulnerable * 10) % 2 === 0) return;

        const verts = ship.getVertices();
        // glow
        ctx.save();
        ctx.shadowColor = '#66ccff';
        ctx.shadowBlur = 8;
        setStroke('#ffffff', 1.8);
        drawPoly(verts);
        ctx.restore();

        // thrust flame
        if (ship.thrusting && Math.random() > 0.2) {
            const a = ship.angle + Math.PI;
            const base = ship.radius * 0.5;
            const tip = ship.radius * (0.8 + Math.random() * 0.6);
            const backX = ship.x + Math.cos(a) * base;
            const backY = ship.y + Math.sin(a) * base;
            ctx.save();
            ctx.shadowColor = '#ff6622';
            ctx.shadowBlur = 12;
            setStroke('#ff8844', 1.5);
            ctx.beginPath();
            ctx.moveTo(ship.x + Math.cos(a + 0.4) * base, ship.y + Math.sin(a + 0.4) * base);
            ctx.lineTo(ship.x + Math.cos(a) * tip, ship.y + Math.sin(a) * tip);
            ctx.lineTo(ship.x + Math.cos(a - 0.4) * base, ship.y + Math.sin(a - 0.4) * base);
            ctx.stroke();
            ctx.restore();
        }
    }

    /* --- Asteroid --- */
    function drawAsteroid(asteroid) {
        const verts = asteroid.getWorldVertices();
        ctx.save();
        ctx.shadowColor = 'rgba(180,180,200,0.3)';
        ctx.shadowBlur = 4;
        setStroke('#aaaacc', 1.5);
        drawPoly(verts);
        ctx.restore();
    }

    /* --- Bullet --- */
    function drawBullet(bullet) {
        ctx.save();
        const color = bullet.isEnemy ? '#ff4444' : '#ffffff';
        ctx.shadowColor = bullet.isEnemy ? '#ff2222' : '#66ccff';
        ctx.shadowBlur = 10;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    /* --- UFO --- */
    function drawUFO(ufo) {
        const { body, dome } = ufo.getVertices();
        ctx.save();
        ctx.shadowColor = '#44ff44';
        ctx.shadowBlur = 8;
        setStroke('#44ff88', 1.8);
        drawPoly(body);
        drawPoly(dome, false);
        // center line
        ctx.beginPath();
        ctx.moveTo(body[0].x, body[0].y);
        ctx.lineTo(body[3].x, body[3].y);
        ctx.stroke();
        ctx.restore();
    }

    /* --- Particle --- */
    function drawParticle(p) {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    /* --- HUD --- */
    function drawHUD(score, lives, wave, highScore) {
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px "Share Tech Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText(score.toString().padStart(6, '0'), 20, 36);

        ctx.font = '14px "Share Tech Mono", monospace';
        ctx.fillStyle = '#888888';
        ctx.fillText('HI ' + highScore.toString().padStart(6, '0'), 20, 56);

        // lives as tiny ships
        for (let i = 0; i < lives; i++) {
            const lx = 20 + i * 24;
            const ly = 74;
            ctx.save();
            ctx.translate(lx, ly);
            ctx.rotate(-Math.PI / 2);
            setStroke('#ffffff', 1.2);
            ctx.beginPath();
            ctx.moveTo(0, -8);
            ctx.lineTo(-5, 5);
            ctx.lineTo(0, 3);
            ctx.lineTo(5, 5);
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
        }

        // wave
        ctx.textAlign = 'right';
        ctx.fillStyle = '#666666';
        ctx.font = '14px "Share Tech Mono", monospace';
        ctx.fillText('WAVE ' + wave, W - 20, 36);

        ctx.restore();
    }

    /* --- Screens --- */
    function drawTitleScreen(highScore) {
        ctx.save();

        // title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 48px "Share Tech Mono", monospace';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#66ccff';
        ctx.shadowBlur = 20;
        ctx.fillText('ASTEROIDS', W / 2, H * 0.3);
        ctx.shadowBlur = 0;

        // decorative asteroid
        ctx.save();
        ctx.translate(W / 2, H * 0.48);
        setStroke('#aaaacc', 1.5);
        ctx.beginPath();
        const pts = 10;
        for (let i = 0; i <= pts; i++) {
            const a = (Math.PI * 2 / pts) * i;
            const r = 30 + Math.sin(a * 3) * 8;
            if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
            else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.stroke();
        ctx.restore();

        // instructions
        ctx.fillStyle = '#888888';
        ctx.font = '16px "Share Tech Mono", monospace';
        ctx.fillText('ARROW KEYS / WASD TO MOVE', W / 2, H * 0.62);
        ctx.fillText('SPACE TO SHOOT', W / 2, H * 0.67);
        ctx.fillText('M TO MUTE', W / 2, H * 0.72);

        ctx.fillStyle = '#66ccff';
        ctx.font = '18px "Share Tech Mono", monospace';
        const blink = Math.floor(Date.now() / 600) % 2;
        if (blink) ctx.fillText('PRESS ENTER TO START', W / 2, H * 0.82);

        if (highScore > 0) {
            ctx.fillStyle = '#666666';
            ctx.font = '14px "Share Tech Mono", monospace';
            ctx.fillText('HIGH SCORE: ' + highScore.toString().padStart(6, '0'), W / 2, H * 0.9);
        }

        ctx.restore();
    }

    function drawGameOverScreen(score, highScore, isNewHighScore) {
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, W, H);

        ctx.fillStyle = '#ff4444';
        ctx.font = 'bold 48px "Share Tech Mono", monospace';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#ff2222';
        ctx.shadowBlur = 20;
        ctx.fillText('GAME OVER', W / 2, H * 0.35);
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#ffffff';
        ctx.font = '24px "Share Tech Mono", monospace';
        ctx.fillText('SCORE: ' + score.toString().padStart(6, '0'), W / 2, H * 0.48);

        if (isNewHighScore) {
            ctx.fillStyle = '#ffcc00';
            ctx.font = '18px "Share Tech Mono", monospace';
            ctx.fillText('NEW HIGH SCORE!', W / 2, H * 0.56);
        }

        ctx.fillStyle = '#888888';
        ctx.font = '14px "Share Tech Mono", monospace';
        ctx.fillText('HIGH SCORE: ' + highScore.toString().padStart(6, '0'), W / 2, H * 0.64);

        ctx.fillStyle = '#66ccff';
        ctx.font = '18px "Share Tech Mono", monospace';
        const blink = Math.floor(Date.now() / 600) % 2;
        if (blink) ctx.fillText('PRESS ENTER TO PLAY AGAIN', W / 2, H * 0.78);

        ctx.restore();
    }

    function drawPausedOverlay() {
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px "Share Tech Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', W / 2, H / 2);
        ctx.font = '16px "Share Tech Mono", monospace';
        ctx.fillStyle = '#888888';
        ctx.fillText('PRESS P TO RESUME', W / 2, H / 2 + 40);
        ctx.restore();
    }

    function drawWaveText(wave) {
        ctx.save();
        ctx.fillStyle = '#66ccff';
        ctx.font = 'bold 28px "Share Tech Mono", monospace';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#66ccff';
        ctx.shadowBlur = 15;
        ctx.fillText('WAVE ' + wave, W / 2, H / 2);
        ctx.restore();
    }

    function getSize() { return { w: W, h: H }; }

    return {
        init, resize, clear, getSize,
        drawShip, drawAsteroid, drawBullet, drawUFO, drawParticle,
        drawHUD, drawTitleScreen, drawGameOverScreen, drawPausedOverlay, drawWaveText,
    };
})();
