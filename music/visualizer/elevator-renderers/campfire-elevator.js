/**
 * Campfire Elevator Renderer
 * Night sky, stars, hills, trees, campfire with flames, embers, firelight glow.
 * Extracted from survivors-campfire-video.html — no StickFight figures.
 */
(function() {
    "use strict";
    var W = 0, H = 0, time = 0;
    var SKY_TOP = '#030510', SKY_BOTTOM = '#0a0f1e';
    var GROUND_COLOR = '#0c0e08', SILHOUETTE = '#08090c';
    var FIRE_ORANGE = '#f5a623', FIRE_YELLOW = '#ffd566';
    var FIRE_RED = '#e85820', EMBER_COLOR = '#ff6a2a';

    var groundY = 0, fireX = 0, fireBaseY = 0;
    var stars = [], embers = [], shootingStars = [];
    var hills = [], trees = [];
    var shootTimer = 0;

    function rgba(hex, a) {
        var r = parseInt(hex.slice(1, 3), 16);
        var g = parseInt(hex.slice(3, 5), 16);
        var b = parseInt(hex.slice(5, 7), 16);
        return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
    }

    function initStars() {
        stars = [];
        for (var i = 0; i < 100; i++) {
            stars.push({
                x: Math.random() * W, y: Math.random() * groundY * 0.85,
                size: 0.5 + Math.random() * 1.5,
                baseAlpha: 0.2 + Math.random() * 0.6,
                phase: Math.random() * Math.PI * 2,
                speed: 0.5 + Math.random() * 2
            });
        }
    }

    function initLandscape() {
        hills = []; trees = [];
        for (var i = 0; i < 5; i++) {
            hills.push({
                cx: (i / 4) * W,
                w: W * (0.25 + Math.random() * 0.2),
                h: groundY * (0.08 + Math.random() * 0.1)
            });
        }
        for (var j = 0; j < 12; j++) {
            var tx = (j / 11) * W * 1.1 - W * 0.05;
            if (Math.abs(tx - fireX) / (W * 0.5) < 0.3) continue;
            trees.push({
                x: tx, h: H * (0.1 + Math.random() * 0.12),
                w: 6 + Math.random() * 8,
                crownW: 15 + Math.random() * 18,
                crownH: 22 + Math.random() * 28
            });
        }
    }

    window.ElevatorRenderers = window.ElevatorRenderers || {};
    window.ElevatorRenderers['campfire'] = {
        init: function(ctx, w, h) {
            W = w; H = h; time = 0;
            groundY = H * 0.72; fireX = W * 0.5; fireBaseY = groundY;
            embers = []; shootingStars = []; shootTimer = 0;
            initStars(); initLandscape();
        },
        resize: function(w, h) {
            W = w; H = h;
            groundY = H * 0.72; fireX = W * 0.5; fireBaseY = groundY;
            initStars(); initLandscape();
        },
        render: function(ctx, w, h, dt, elapsed) {
            W = w; H = h; time = elapsed;
            var energy = 0.35 + 0.15 * Math.sin(time * 0.5);
            var pulse = 0.5 + 0.5 * Math.sin(time * 2);

            // Sky
            var grad = ctx.createLinearGradient(0, 0, 0, groundY);
            grad.addColorStop(0, SKY_TOP); grad.addColorStop(1, SKY_BOTTOM);
            ctx.fillStyle = grad; ctx.fillRect(0, 0, W, groundY);

            // Stars
            for (var i = 0; i < stars.length; i++) {
                var s = stars[i];
                s.phase += s.speed * dt;
                var twinkle = 0.5 + 0.5 * Math.sin(s.phase);
                var alpha = s.baseAlpha * twinkle;
                ctx.save(); ctx.globalAlpha = alpha;
                ctx.fillStyle = '#ffffff'; ctx.shadowColor = '#ffffff'; ctx.shadowBlur = s.size * 2;
                ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2); ctx.fill();
                ctx.restore();
            }

            // Shooting stars
            shootTimer -= dt;
            if (shootTimer <= 0) {
                var startX = Math.random() * W * 0.6 + W * 0.2;
                var startY = Math.random() * groundY * 0.3;
                var angle = Math.PI * 0.15 + Math.random() * 0.3;
                var speed = 150 + Math.random() * 150;
                shootingStars.push({
                    x: startX, y: startY,
                    vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
                    life: 1
                });
                shootTimer = 6 + Math.random() * 12;
            }
            for (var ssi = shootingStars.length - 1; ssi >= 0; ssi--) {
                var ss = shootingStars[ssi];
                ss.x += ss.vx * dt; ss.y += ss.vy * dt; ss.life -= dt * 0.8;
                if (ss.life <= 0) { shootingStars.splice(ssi, 1); continue; }
                ctx.save(); ctx.globalAlpha = ss.life;
                var sGrad = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.vx * 0.06, ss.y - ss.vy * 0.06);
                sGrad.addColorStop(0, 'rgba(255,255,255,0.9)'); sGrad.addColorStop(1, 'rgba(255,255,255,0)');
                ctx.strokeStyle = sGrad; ctx.lineWidth = 2; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(ss.x, ss.y);
                ctx.lineTo(ss.x - ss.vx * 0.06, ss.y - ss.vy * 0.06); ctx.stroke();
                ctx.fillStyle = '#fff'; ctx.shadowColor = '#fff'; ctx.shadowBlur = 6;
                ctx.beginPath(); ctx.arc(ss.x, ss.y, 1.2, 0, Math.PI * 2); ctx.fill();
                ctx.restore();
            }

            // Hills
            ctx.save(); ctx.fillStyle = '#0a0d14';
            for (var hi = 0; hi < hills.length; hi++) {
                var hl = hills[hi];
                ctx.beginPath(); ctx.ellipse(hl.cx, groundY, hl.w, hl.h, 0, Math.PI, 0); ctx.fill();
            }
            ctx.restore();

            // Trees
            ctx.save(); ctx.fillStyle = SILHOUETTE;
            for (var ti = 0; ti < trees.length; ti++) {
                var t = trees[ti];
                ctx.fillRect(t.x - t.w / 2, groundY - t.h, t.w, t.h);
                ctx.beginPath();
                ctx.moveTo(t.x, groundY - t.h - t.crownH);
                ctx.lineTo(t.x - t.crownW, groundY - t.h + 8);
                ctx.lineTo(t.x + t.crownW, groundY - t.h + 8);
                ctx.closePath(); ctx.fill();
                ctx.beginPath();
                ctx.moveTo(t.x, groundY - t.h - t.crownH * 0.6);
                ctx.lineTo(t.x - t.crownW * 1.2, groundY - t.h + t.crownH * 0.3);
                ctx.lineTo(t.x + t.crownW * 1.2, groundY - t.h + t.crownH * 0.3);
                ctx.closePath(); ctx.fill();
            }
            ctx.restore();

            // Firelight ambient glow
            var radius = W * 0.3 * (0.8 + energy * 0.3 + pulse * 0.1);
            var fGrad = ctx.createRadialGradient(fireX, fireBaseY - H * 0.04, 0, fireX, fireBaseY - H * 0.04, radius);
            fGrad.addColorStop(0, rgba(FIRE_ORANGE, 0.04 + energy * 0.02));
            fGrad.addColorStop(0.4, rgba(FIRE_RED, 0.015));
            fGrad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.save(); ctx.globalCompositeOperation = 'lighter';
            ctx.fillStyle = fGrad; ctx.fillRect(0, 0, W, H);
            ctx.restore();

            // Ground
            ctx.fillStyle = GROUND_COLOR; ctx.fillRect(0, groundY, W, H - groundY);
            var gGrad = ctx.createRadialGradient(fireX, groundY, 0, fireX, groundY, W * 0.18);
            gGrad.addColorStop(0, rgba(FIRE_ORANGE, 0.06));
            gGrad.addColorStop(0.5, rgba(FIRE_RED, 0.02));
            gGrad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = gGrad; ctx.fillRect(0, groundY, W, H - groundY);

            // Campfire
            var baseW = W * 0.03;
            var flameH = H * 0.07 * (0.7 + energy * 0.5 + pulse * 0.2);

            // Log base
            ctx.save(); ctx.fillStyle = '#2a1a0a';
            ctx.beginPath();
            ctx.moveTo(fireX - baseW * 1.3, fireBaseY);
            ctx.lineTo(fireX + baseW * 0.5, fireBaseY - 5);
            ctx.lineTo(fireX + baseW * 0.6, fireBaseY - 1);
            ctx.lineTo(fireX - baseW * 1.1, fireBaseY + 3);
            ctx.closePath(); ctx.fill();
            ctx.beginPath();
            ctx.moveTo(fireX + baseW * 1.3, fireBaseY);
            ctx.lineTo(fireX - baseW * 0.5, fireBaseY - 5);
            ctx.lineTo(fireX - baseW * 0.6, fireBaseY - 1);
            ctx.lineTo(fireX + baseW * 1.1, fireBaseY + 3);
            ctx.closePath(); ctx.fill();
            ctx.restore();

            // Fire glow
            var glowR = flameH * 2.5;
            var fwGrad = ctx.createRadialGradient(fireX, fireBaseY - flameH * 0.4, 0, fireX, fireBaseY - flameH * 0.4, glowR);
            fwGrad.addColorStop(0, rgba(FIRE_YELLOW, 0.1 + pulse * 0.04));
            fwGrad.addColorStop(0.3, rgba(FIRE_ORANGE, 0.05));
            fwGrad.addColorStop(0.6, rgba(FIRE_RED, 0.015));
            fwGrad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.save(); ctx.globalCompositeOperation = 'lighter';
            ctx.fillStyle = fwGrad;
            ctx.fillRect(fireX - glowR, fireBaseY - flameH - glowR, glowR * 2, glowR * 2);
            ctx.restore();

            // Flames
            for (var fi = 0; fi < 5; fi++) {
                var ft = fi / 4;
                var fx = fireX + (ft - 0.5) * baseW * 1.6;
                var fh = flameH * (0.5 + 0.5 * Math.sin(time * 6 + fi * 1.3)) * (0.6 + ft * 0.4 * (1 - ft) * 4);
                var fw = baseW * (0.3 + 0.15 * Math.sin(time * 8 + fi * 2));
                var wobble = Math.sin(time * 5 + fi * 1.7) * fw * 0.4;

                ctx.save(); ctx.globalAlpha = 0.6 + pulse * 0.15;
                var flGrad = ctx.createLinearGradient(fx, fireBaseY, fx, fireBaseY - fh);
                flGrad.addColorStop(0, FIRE_RED); flGrad.addColorStop(0.4, FIRE_ORANGE);
                flGrad.addColorStop(0.8, FIRE_YELLOW);
                flGrad.addColorStop(1, rgba(FIRE_YELLOW, 0.2));
                ctx.fillStyle = flGrad;
                ctx.beginPath();
                ctx.moveTo(fx - fw, fireBaseY);
                ctx.quadraticCurveTo(fx - fw * 0.3 + wobble * 0.5, fireBaseY - fh * 0.5, fx + wobble, fireBaseY - fh);
                ctx.quadraticCurveTo(fx + fw * 0.3 + wobble * 0.5, fireBaseY - fh * 0.5, fx + fw, fireBaseY);
                ctx.closePath(); ctx.fill();

                if (fi % 2 === 0) {
                    ctx.globalAlpha = 0.4 + pulse * 0.2;
                    ctx.fillStyle = FIRE_YELLOW;
                    ctx.beginPath();
                    ctx.moveTo(fx - fw * 0.4, fireBaseY);
                    ctx.quadraticCurveTo(fx + wobble * 0.3, fireBaseY - fh * 0.4, fx + wobble * 0.5, fireBaseY - fh * 0.6);
                    ctx.quadraticCurveTo(fx + wobble * 0.3, fireBaseY - fh * 0.4, fx + fw * 0.4, fireBaseY);
                    ctx.closePath(); ctx.fill();
                }
                ctx.restore();
            }

            // Embers
            if (Math.random() < (0.3 + energy * 0.4) * dt * 60 && embers.length < 30) {
                embers.push({
                    x: fireX + (Math.random() - 0.5) * 15,
                    y: fireBaseY - 8,
                    vx: (Math.random() - 0.5) * 25,
                    vy: -(15 + Math.random() * 45),
                    life: 1, decay: 0.2 + Math.random() * 0.4,
                    size: 1 + Math.random() * 2
                });
            }
            for (var ei = embers.length - 1; ei >= 0; ei--) {
                var e = embers[ei];
                e.x += e.vx * dt; e.y += e.vy * dt;
                e.vy -= 4 * dt; e.vx += (Math.random() - 0.5) * 30 * dt;
                e.life -= e.decay * dt;
                if (e.life <= 0) { embers.splice(ei, 1); continue; }
                ctx.save(); ctx.globalAlpha = e.life * 0.7;
                ctx.fillStyle = e.life > 0.5 ? FIRE_YELLOW : EMBER_COLOR;
                ctx.shadowColor = EMBER_COLOR; ctx.shadowBlur = 3;
                ctx.beginPath(); ctx.arc(e.x, e.y, e.size * e.life, 0, Math.PI * 2); ctx.fill();
                ctx.restore();
            }
        }
    };
})();
