/**
 * Clockwork Elevator Renderer
 * Rotating gears, pendulum, mainspring, sparks, dust motes.
 * Extracted from clockwork-requiem-video.html — simplified for ambient use.
 */
(function() {
    "use strict";
    var W = 0, H = 0, time = 0;
    var BRASS = '#d4a044', COPPER = '#b87333', GOLD = '#ffd700';
    var DARK_STEEL = '#3a3a4a', WARM_WHITE = '#fff8e7', PATINA = '#5a8a6a';
    var BG = '#0a0804';

    var gears = [], sparks = [], dustMotes = [];
    var pendulum = { angle: 0, vel: 0, length: 0 };
    var mainspring = { coils: 8, tension: 1 };
    var sparkTimer = 0, dustTimer = 0;

    function buildGears() {
        gears = [];
        var cx = W * 0.5, cy = H * 0.45;
        var baseR = Math.min(W, H) * 0.06;
        var defs = [
            [0, 0, 2, 24, 0.5, 0, 0], [3.6, -1.2, 1.5, 18, -0.7, 1, 0],
            [-3.2, -1.5, 1.3, 16, 0.6, 2, 0], [1.2, 3.2, 0.9, 12, -1.2, 3, 0],
            [-1.5, 2.8, 1.1, 14, 0.8, 0, 1], [4.5, 1.5, 0.7, 10, -1.5, 1, 1],
            [-4.8, 0.5, 1.0, 12, 0.9, 2, 1], [2.5, -3.5, 0.5, 8, 1.8, 3, 2],
            [-2.0, -3.2, 0.6, 10, -1.4, 0, 2]
        ];
        for (var i = 0; i < defs.length; i++) {
            var d = defs[i];
            gears.push({
                x: cx + baseR * d[0], y: cy + baseR * d[1],
                radius: baseR * d[2], teeth: d[3], speed: d[4],
                channel: d[5], depth: d[6],
                angle: Math.random() * Math.PI * 2
            });
        }
        pendulum.length = H * 0.28;
    }

    function drawGear(ctx, g) {
        var r = g.radius, teeth = g.teeth, toothH = r * 0.15;
        var alpha = g.depth === 2 ? 0.25 : g.depth === 1 ? 0.5 : 0.9;
        var sw = g.depth === 2 ? 1 : g.depth === 1 ? 1.5 : 2;
        var colors = [GOLD, PATINA, COPPER, BRASS];
        var color = colors[g.channel % 4];

        ctx.save();
        ctx.translate(g.x, g.y);
        ctx.rotate(g.angle);
        ctx.globalAlpha = alpha * 0.18;
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();

        ctx.globalAlpha = alpha;
        ctx.strokeStyle = color; ctx.lineWidth = sw;
        ctx.beginPath();
        for (var i = 0; i < teeth; i++) {
            var a1 = (i / teeth) * Math.PI * 2;
            var a2 = ((i + 0.35) / teeth) * Math.PI * 2;
            var a3 = ((i + 0.65) / teeth) * Math.PI * 2;
            var a4 = ((i + 1) / teeth) * Math.PI * 2;
            var ir = r - toothH * 0.3, or = r + toothH;
            if (i === 0) ctx.moveTo(Math.cos(a1) * ir, Math.sin(a1) * ir);
            ctx.lineTo(Math.cos(a2) * or, Math.sin(a2) * or);
            ctx.lineTo(Math.cos(a3) * or, Math.sin(a3) * or);
            ctx.lineTo(Math.cos(a4) * ir, Math.sin(a4) * ir);
        }
        ctx.closePath(); ctx.stroke();

        ctx.beginPath(); ctx.arc(0, 0, r * 0.25, 0, Math.PI * 2); ctx.stroke();
        var spokeCount = Math.max(3, Math.floor(teeth / 4));
        for (var s = 0; s < spokeCount; s++) {
            var sa = (s / spokeCount) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(Math.cos(sa) * r * 0.25, Math.sin(sa) * r * 0.25);
            ctx.lineTo(Math.cos(sa) * r * 0.8, Math.sin(sa) * r * 0.8);
            ctx.stroke();
        }
        ctx.fillStyle = color; ctx.globalAlpha = alpha * 0.8;
        ctx.beginPath(); ctx.arc(0, 0, r * 0.08, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
    }

    window.ElevatorRenderers = window.ElevatorRenderers || {};
    window.ElevatorRenderers['clockwork'] = {
        init: function(ctx, w, h) {
            W = w; H = h; time = 0;
            sparks = []; dustMotes = [];
            sparkTimer = 0; dustTimer = 0;
            pendulum.angle = 0; pendulum.vel = 0;
            buildGears();
        },
        resize: function(w, h) { W = w; H = h; buildGears(); },
        render: function(ctx, w, h, dt, elapsed) {
            W = w; H = h; time = elapsed;
            ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);

            // Ambient warm glow
            var cx = W * 0.5, cy = H * 0.45;
            ctx.save(); ctx.globalCompositeOperation = 'lighter';
            var grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.5);
            grad.addColorStop(0, 'rgba(212,160,68,0.04)');
            grad.addColorStop(0.4, 'rgba(184,115,51,0.02)');
            grad.addColorStop(1, 'rgba(10,8,4,0)');
            ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
            ctx.restore();

            // Casing frame
            var margin = Math.min(W, H) * 0.03;
            ctx.save(); ctx.strokeStyle = DARK_STEEL; ctx.lineWidth = 2; ctx.globalAlpha = 0.3;
            ctx.strokeRect(margin, margin, W - margin * 2, H - margin * 2);
            ctx.restore();

            // Rotate gears steadily
            var pulse = 0.5 + 0.5 * Math.sin(time * 2);
            for (var gi = 0; gi < gears.length; gi++) {
                var g = gears[gi];
                g.angle += g.speed * (0.4 + pulse * 0.2) * dt;
            }

            // Draw gears by depth
            for (var d = 2; d >= 0; d--) {
                for (var di = 0; di < gears.length; di++) {
                    if (gears[di].depth === d) drawGear(ctx, gears[di]);
                }
            }

            // Pendulum
            var pendDrive = 0.12;
            var pendTarget = Math.sin(time * 1.8) * pendDrive;
            pendulum.vel += (-9.8 / pendulum.length * Math.sin(pendulum.angle) + (pendTarget - pendulum.angle) * 5) * dt;
            pendulum.vel *= Math.exp(-1.5 * dt);
            pendulum.angle += pendulum.vel * dt;

            var px = W * 0.5, py = H * 0.08;
            var bobX = px + Math.sin(pendulum.angle) * pendulum.length;
            var bobY = py + Math.cos(pendulum.angle) * pendulum.length;
            var bobR = Math.min(W, H) * 0.02;
            ctx.save();
            ctx.strokeStyle = BRASS; ctx.lineWidth = 2; ctx.globalAlpha = 0.6;
            ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(bobX, bobY); ctx.stroke();
            ctx.fillStyle = GOLD; ctx.globalAlpha = 0.7;
            ctx.beginPath(); ctx.arc(bobX, bobY, bobR, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = COPPER; ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2); ctx.fill();
            ctx.restore();

            // Mainspring
            var mCx = W * 0.12, mCy = H * 0.5, maxR = Math.min(W, H) * 0.06;
            ctx.save(); ctx.strokeStyle = COPPER; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.5;
            ctx.beginPath();
            var steps = mainspring.coils * 40;
            for (var si = 0; si <= steps; si++) {
                var t = si / steps;
                var coilT = t * mainspring.coils * Math.PI * 2;
                var r = maxR * (1 - t * 0.7);
                var x = mCx + Math.cos(coilT) * r, y = mCy + Math.sin(coilT) * r;
                if (si === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.stroke();
            ctx.fillStyle = BRASS; ctx.globalAlpha = 0.6;
            ctx.beginPath(); ctx.arc(mCx, mCy, 4, 0, Math.PI * 2); ctx.fill();
            ctx.restore();

            // Escapement
            var eCx = W * 0.88, eCy = H * 0.4, eSize = Math.min(W, H) * 0.04;
            ctx.save(); ctx.translate(eCx, eCy);
            ctx.strokeStyle = BRASS; ctx.lineWidth = 1; ctx.globalAlpha = 0.5;
            ctx.beginPath();
            for (var ei = 0; ei < 15; ei++) {
                var ea = time * 1.5 + (ei / 15) * Math.PI * 2;
                ctx.moveTo(Math.cos(ea) * eSize * 0.6, Math.sin(ea) * eSize * 0.6);
                ctx.lineTo(Math.cos(ea) * eSize, Math.sin(ea) * eSize);
            }
            ctx.stroke();
            ctx.beginPath(); ctx.arc(0, 0, eSize * 0.6, 0, Math.PI * 2); ctx.stroke();
            var pa = Math.sin(time * 3) * 0.3;
            ctx.rotate(pa); ctx.strokeStyle = GOLD; ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(-eSize * 0.7, -eSize * 0.25);
            ctx.lineTo(0, eSize * 0.08);
            ctx.lineTo(eSize * 0.7, -eSize * 0.25);
            ctx.stroke();
            ctx.restore();

            // Sparks on timer
            sparkTimer -= dt;
            if (sparkTimer <= 0) {
                sparkTimer = 0.8 + Math.random() * 1.5;
                var sg = gears[Math.floor(Math.random() * Math.min(4, gears.length))];
                for (var sp = 0; sp < 3; sp++) {
                    var sa = Math.random() * Math.PI * 2, spd = 30 + Math.random() * 80;
                    sparks.push({
                        x: sg.x, y: sg.y,
                        vx: Math.cos(sa) * spd, vy: Math.sin(sa) * spd - 30,
                        life: 0.3 + Math.random() * 0.4, maxLife: 0.3 + Math.random() * 0.4,
                        size: 1 + Math.random() * 2
                    });
                }
            }

            ctx.save(); ctx.globalCompositeOperation = 'lighter';
            for (var ski = sparks.length - 1; ski >= 0; ski--) {
                var sk = sparks[ski];
                sk.x += sk.vx * dt; sk.y += sk.vy * dt; sk.vy += 150 * dt; sk.life -= dt;
                if (sk.life <= 0) { sparks.splice(ski, 1); continue; }
                var lr = sk.life / sk.maxLife;
                ctx.globalAlpha = lr * 0.8;
                ctx.fillStyle = lr > 0.5 ? WARM_WHITE : GOLD;
                ctx.fillRect(sk.x - sk.size * 0.5, sk.y - sk.size * 0.5, sk.size, sk.size);
            }
            ctx.restore();

            // Dust motes on timer
            dustTimer -= dt;
            if (dustTimer <= 0) {
                dustTimer = 1 + Math.random() * 2;
                dustMotes.push({
                    x: Math.random() * W, y: Math.random() * H,
                    vx: (Math.random() - 0.5) * 10, vy: -3 - Math.random() * 8,
                    life: 2 + Math.random() * 2, maxLife: 2 + Math.random() * 2,
                    size: 1 + Math.random() * 1.5
                });
            }
            ctx.save();
            for (var mi = dustMotes.length - 1; mi >= 0; mi--) {
                var m = dustMotes[mi];
                m.x += m.vx * dt; m.y += m.vy * dt; m.life -= dt;
                if (m.life <= 0) { dustMotes.splice(mi, 1); continue; }
                ctx.globalAlpha = (m.life / m.maxLife) * 0.25;
                ctx.fillStyle = WARM_WHITE;
                ctx.beginPath(); ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2); ctx.fill();
            }
            ctx.restore();

            // Vignette
            ctx.save();
            var vGrad = ctx.createRadialGradient(W * 0.5, H * 0.5, Math.max(W, H) * 0.3, W * 0.5, H * 0.5, Math.max(W, H) * 0.7);
            vGrad.addColorStop(0, 'rgba(10,8,4,0)');
            vGrad.addColorStop(1, 'rgba(10,8,4,0.5)');
            ctx.fillStyle = vGrad; ctx.fillRect(0, 0, W, H);
            ctx.restore();
        }
    };
})();
