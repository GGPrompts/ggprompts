/**
 * Particle Field Elevator Renderer
 * Ambient particle bursts from rotating quadrants, shockwaves on timer.
 * Extracted from renderers/particle-field.js — simplified for standalone use.
 */
(function() {
    "use strict";
    var w = 0, h = 0, time = 0;
    var particles = [], shockwaves = [];
    var MAX_PARTICLES = 200;
    var burstTimer = 0, shockTimer = 0, burstChannel = 0;

    var COLORS = [
        ['#ff6b6b', '#ff4757', '#ee5a24'],
        ['#1dd1a1', '#2ed573', '#7bed9f'],
        ['#5f27cd', '#a55eea', '#cf6a87'],
        ['#48dbfb', '#0abde3', '#74b9ff'],
        ['#ffa502', '#ff9f43', '#f7b731']
    ];

    function channelOrigin(ch) {
        var cx = (ch % 2 === 0) ? w * 0.3 : w * 0.7;
        var cy = (ch < 2) ? h * 0.35 : h * 0.65;
        return { x: cx, y: cy };
    }

    function sc() { return Math.min(w, h) / 500; }

    function spawnBurst(ch) {
        var origin = channelOrigin(ch);
        var palette = COLORS[ch % COLORS.length];
        var s = sc();
        var count = 5 + Math.floor(Math.random() * 8);
        for (var i = 0; i < count && particles.length < MAX_PARTICLES; i++) {
            var angle = Math.random() * Math.PI * 2;
            var speed = (30 + Math.random() * 80) * s;
            particles.push({
                x: origin.x + (Math.random() - 0.5) * 30 * s,
                y: origin.y + (Math.random() - 0.5) * 30 * s,
                vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
                size: (2 + Math.random() * 6) * s,
                life: 1, decay: 0.3 + Math.random() * 0.5,
                color: palette[Math.floor(Math.random() * palette.length)],
                alpha: 0.7 + Math.random() * 0.3
            });
        }
    }

    function spawnShockwave() {
        var s = sc();
        shockwaves.push({
            x: w / 2, y: h / 2,
            radius: 8 * s, maxRadius: Math.min(w, h) * 0.45,
            speed: 250 * s, lineWidth: 2 + s,
            alpha: 0.25, color: Math.random() > 0.5 ? '#ff6b6b' : '#48dbfb'
        });
    }

    window.ElevatorRenderers = window.ElevatorRenderers || {};
    window.ElevatorRenderers['particle-field'] = {
        init: function(ctx, W, H) {
            w = W; h = H; time = 0;
            particles = []; shockwaves = [];
            burstTimer = 0; shockTimer = 0; burstChannel = 0;
        },
        resize: function(W, H) { w = W; h = H; },
        render: function(ctx, W, H, dt, elapsed) {
            w = W; h = H; time = elapsed;

            ctx.fillStyle = '#0a0a1a';
            ctx.fillRect(0, 0, w, h);

            // Subtle grid
            ctx.strokeStyle = 'rgba(255,255,255,0.03)';
            ctx.lineWidth = 1;
            for (var gx = 0; gx < w; gx += 40) {
                ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
            }
            for (var gy = 0; gy < h; gy += 40) {
                ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
            }

            // Timer-based bursts
            burstTimer -= dt;
            if (burstTimer <= 0) {
                spawnBurst(burstChannel);
                burstChannel = (burstChannel + 1) % 4;
                burstTimer = 0.4 + Math.random() * 0.6;
            }

            // Timer-based shockwaves
            shockTimer -= dt;
            if (shockTimer <= 0) { spawnShockwave(); shockTimer = 1.5 + Math.random() * 2; }

            // Center glow
            var pulse = 0.5 + 0.5 * Math.sin(time * 2);
            var grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.25);
            grad.addColorStop(0, 'rgba(255,100,100,' + (pulse * 0.08) + ')');
            grad.addColorStop(1, 'rgba(255,100,100,0)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);

            // Shockwaves
            for (var si = shockwaves.length - 1; si >= 0; si--) {
                var sw = shockwaves[si];
                sw.radius += sw.speed * dt; sw.alpha *= 0.96;
                if (sw.radius > sw.maxRadius || sw.alpha < 0.01) { shockwaves.splice(si, 1); continue; }
                ctx.beginPath(); ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
                ctx.globalAlpha = sw.alpha; ctx.strokeStyle = sw.color;
                ctx.lineWidth = sw.lineWidth; ctx.stroke(); ctx.globalAlpha = 1;
            }

            // Particles
            var s = sc();
            for (var pi = particles.length - 1; pi >= 0; pi--) {
                var p = particles[pi];
                p.x += p.vx * dt; p.y += p.vy * dt;
                p.vx *= 0.98; p.vy *= 0.98; p.life -= p.decay * dt;
                if (p.life <= 0) { particles.splice(pi, 1); continue; }
                ctx.globalAlpha = p.life * p.alpha;
                ctx.fillStyle = p.color;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2); ctx.fill();
                if (p.size > 3 * s) {
                    ctx.globalAlpha = p.life * p.alpha * 0.3;
                    ctx.beginPath(); ctx.arc(p.x, p.y, p.size * p.life * 2, 0, Math.PI * 2); ctx.fill();
                }
            }
            ctx.globalAlpha = 1;
        }
    };
})();
