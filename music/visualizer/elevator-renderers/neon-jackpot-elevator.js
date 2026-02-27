/**
 * Neon Jackpot Elevator Renderer
 * Vegas strip skyline, neon signs, stars, coin, sparkle particles.
 * Extracted from neon-jackpot-video.html — simplified for ambient use.
 */
(function() {
    "use strict";
    var W = 0, H = 0, time = 0;
    var NEON_PINK = '#ff2d78', NEON_BLUE = '#00ccff', GOLD = '#ffd700';
    var GOLD_DIM = '#b8960f', AMBER = '#d4a04a', PURPLE_GLOW = '#6b2fa0';

    var stars = [], particles = [];
    var MAX_PARTICLES = 80;
    var coinAngle = 0, sparkTimer = 0;

    var neonSigns = [
        { text: 'CASINO',  x: 0.12, y: 0.38, size: 0.035, color: NEON_PINK },
        { text: 'JACKPOT', x: 0.35, y: 0.32, size: 0.030, color: GOLD },
        { text: '777',     x: 0.55, y: 0.42, size: 0.045, color: NEON_BLUE },
        { text: 'SLOTS',   x: 0.78, y: 0.35, size: 0.028, color: NEON_PINK },
        { text: 'LUCKY',   x: 0.22, y: 0.48, size: 0.024, color: NEON_BLUE },
        { text: 'BAR',     x: 0.65, y: 0.50, size: 0.032, color: PURPLE_GLOW }
    ];

    var buildings = [
        { x: 0.00, w: 0.08, h: 0.22 }, { x: 0.07, w: 0.06, h: 0.30 },
        { x: 0.12, w: 0.10, h: 0.26 }, { x: 0.25, w: 0.08, h: 0.35 },
        { x: 0.32, w: 0.12, h: 0.28 }, { x: 0.48, w: 0.10, h: 0.38 },
        { x: 0.57, w: 0.08, h: 0.24 }, { x: 0.64, w: 0.11, h: 0.32 },
        { x: 0.74, w: 0.06, h: 0.26 }, { x: 0.87, w: 0.07, h: 0.30 },
        { x: 0.93, w: 0.08, h: 0.20 }
    ];

    function initStars() {
        stars = [];
        for (var i = 0; i < 80; i++) {
            stars.push({
                x: Math.random(), y: Math.random() * 0.55,
                size: 0.5 + Math.random() * 1.5,
                bright: 0.3 + Math.random() * 0.7,
                speed: 1.5 + Math.random() * 3,
                phase: Math.random() * Math.PI * 2
            });
        }
    }

    function rgba(hex, a) {
        var r = parseInt(hex.slice(1, 3), 16);
        var g = parseInt(hex.slice(3, 5), 16);
        var b = parseInt(hex.slice(5, 7), 16);
        return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
    }

    window.ElevatorRenderers = window.ElevatorRenderers || {};
    window.ElevatorRenderers['neon-jackpot'] = {
        init: function(ctx, w, h) {
            W = w; H = h; time = 0; coinAngle = 0; sparkTimer = 0;
            particles = [];
            initStars();
        },
        resize: function(w, h) { W = w; H = h; initStars(); },
        render: function(ctx, w, h, dt, elapsed) {
            W = w; H = h; time = elapsed;
            coinAngle += 0.5 * dt;

            // Sky gradient
            var skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.6);
            skyGrad.addColorStop(0, '#050210');
            skyGrad.addColorStop(0.4, '#0a0614');
            skyGrad.addColorStop(0.7, '#120a24');
            skyGrad.addColorStop(1, '#1a0e30');
            ctx.fillStyle = skyGrad; ctx.fillRect(0, 0, W, H);

            // Stars
            for (var i = 0; i < stars.length; i++) {
                var s = stars[i];
                var twinkle = 0.5 + 0.5 * Math.sin(time * s.speed + s.phase);
                var bright = s.bright * twinkle * 0.7;
                if (bright < 0.02) continue;
                ctx.globalAlpha = bright;
                ctx.fillStyle = '#e8e0ff';
                ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.size, 0, Math.PI * 2); ctx.fill();
            }
            ctx.globalAlpha = 1;

            // Purple haze
            var hazeGrad = ctx.createLinearGradient(0, H * 0.35, 0, H * 0.65);
            hazeGrad.addColorStop(0, 'rgba(107,47,160,0)');
            hazeGrad.addColorStop(0.5, rgba(PURPLE_GLOW, 0.06));
            hazeGrad.addColorStop(1, 'rgba(107,47,160,0)');
            ctx.fillStyle = hazeGrad; ctx.fillRect(0, H * 0.35, W, H * 0.3);

            // Building silhouettes
            var groundY = H * 0.72;
            for (var bi = 0; bi < buildings.length; bi++) {
                var b = buildings[bi];
                var bx = b.x * W, bw = b.w * W, bh = b.h * H;
                var by = groundY - bh;
                var bGrad = ctx.createLinearGradient(bx, by, bx, groundY);
                bGrad.addColorStop(0, '#0e0820');
                bGrad.addColorStop(1, '#080412');
                ctx.fillStyle = bGrad;
                ctx.fillRect(bx, by, bw, bh);
                // Window lights
                for (var wy = 0; wy < Math.floor(bh / 18); wy++) {
                    for (var wx = 0; wx < Math.floor(bw / 14); wx++) {
                        var hash = (bi * 17 + wy * 7 + wx * 31) % 10;
                        if (hash < 4) continue;
                        var winX = bx + 5 + wx * (bw - 10) / Math.max(1, Math.floor(bw / 14));
                        var winY = by + 8 + wy * (bh - 12) / Math.max(1, Math.floor(bh / 18));
                        var winA = 0.08 + Math.sin(time * 0.5 + hash) * 0.04;
                        var winC = hash > 7 ? NEON_PINK : hash > 5 ? NEON_BLUE : AMBER;
                        ctx.fillStyle = rgba(winC, winA);
                        ctx.fillRect(winX, winY, 3, 4);
                    }
                }
                ctx.strokeStyle = rgba(PURPLE_GLOW, 0.08);
                ctx.lineWidth = 1; ctx.strokeRect(bx, by, bw, bh);
            }

            // Neon signs
            var pulse = 0.5 + 0.5 * Math.sin(time * 2);
            for (var ni = 0; ni < neonSigns.length; ni++) {
                var sign = neonSigns[ni];
                var flicker = Math.random() < 0.005 ? 0.4 : 0;
                var intensity = (0.7 + pulse * 0.3) * (1 - flicker);
                var sx = sign.x * W, sy = sign.y * H;
                var fontSize = sign.size * Math.min(W, H);

                ctx.save();
                ctx.font = '700 ' + fontSize + 'px monospace';
                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                ctx.shadowColor = sign.color;
                ctx.shadowBlur = 18 * intensity;
                ctx.fillStyle = rgba(sign.color, 0.4 * intensity);
                ctx.fillText(sign.text, sx, sy);
                ctx.shadowBlur = 8 * intensity;
                ctx.fillStyle = rgba(sign.color, 0.7 * intensity + 0.3);
                ctx.fillText(sign.text, sx, sy);
                ctx.restore();
            }

            // Ground
            var gGrad = ctx.createLinearGradient(0, groundY, 0, H);
            gGrad.addColorStop(0, '#0c0818');
            gGrad.addColorStop(1, '#040208');
            ctx.fillStyle = gGrad; ctx.fillRect(0, groundY, W, H - groundY);

            // Road center line
            ctx.strokeStyle = rgba(GOLD_DIM, 0.12);
            ctx.lineWidth = 2; ctx.setLineDash([15, 12]);
            ctx.beginPath();
            ctx.moveTo(0, groundY + (H - groundY) * 0.5);
            ctx.lineTo(W, groundY + (H - groundY) * 0.5);
            ctx.stroke(); ctx.setLineDash([]);

            // Ground reflections
            for (var ri = 0; ri < neonSigns.length; ri++) {
                var rs = neonSigns[ri];
                var rx = rs.x * W;
                var rGrad = ctx.createRadialGradient(rx, groundY, 0, rx, groundY + 20, 30);
                rGrad.addColorStop(0, rgba(rs.color, 0.08));
                rGrad.addColorStop(1, rgba(rs.color, 0));
                ctx.fillStyle = rGrad;
                ctx.fillRect(rx - 30, groundY, 60, 40);
            }

            // Gold coin
            var coinR = Math.min(W, H) * 0.035;
            var coinX = W * 0.5, coinY = H * 0.16 + Math.sin(time * 0.7) * 5;
            var scaleX = Math.abs(Math.cos(coinAngle));
            if (scaleX < 0.1) scaleX = 0.1;
            ctx.save(); ctx.translate(coinX, coinY); ctx.scale(scaleX, 1);
            var cGrad = ctx.createRadialGradient(0, -coinR * 0.3, coinR * 0.1, 0, 0, coinR);
            cGrad.addColorStop(0, '#fff0a0'); cGrad.addColorStop(0.4, GOLD);
            cGrad.addColorStop(0.75, GOLD_DIM); cGrad.addColorStop(1, '#7a6008');
            ctx.beginPath(); ctx.arc(0, 0, coinR, 0, Math.PI * 2);
            ctx.fillStyle = cGrad; ctx.shadowColor = GOLD; ctx.shadowBlur = 12; ctx.fill();
            ctx.shadowBlur = 0;
            ctx.fillStyle = rgba('#7a6008', 0.5);
            ctx.font = 'bold ' + Math.floor(coinR * 1.2) + 'px serif';
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText('$', 0, 1);
            ctx.restore();

            // Sparkle particles
            sparkTimer -= dt;
            if (sparkTimer <= 0) {
                sparkTimer = 0.3 + Math.random() * 0.8;
                var spSign = neonSigns[Math.floor(Math.random() * neonSigns.length)];
                for (var pi = 0; pi < 2 && particles.length < MAX_PARTICLES; pi++) {
                    var a = Math.random() * Math.PI * 2;
                    particles.push({
                        x: spSign.x * W + (Math.random() - 0.5) * 20,
                        y: spSign.y * H + (Math.random() - 0.5) * 15,
                        vx: Math.cos(a) * 15, vy: Math.sin(a) * 15 - 10,
                        size: 1 + Math.random() * 2, life: 1,
                        decay: 0.5 + Math.random() * 0.5, color: spSign.color
                    });
                }
            }
            ctx.save();
            for (var pj = particles.length - 1; pj >= 0; pj--) {
                var p = particles[pj];
                p.x += p.vx * dt; p.y += p.vy * dt; p.life -= p.decay * dt;
                if (p.life <= 0) { particles.splice(pj, 1); continue; }
                ctx.globalAlpha = p.life * 0.7;
                ctx.fillStyle = p.color; ctx.shadowColor = p.color; ctx.shadowBlur = p.size * 2;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2); ctx.fill();
            }
            ctx.shadowBlur = 0; ctx.globalAlpha = 1;
            ctx.restore();
        }
    };
})();
