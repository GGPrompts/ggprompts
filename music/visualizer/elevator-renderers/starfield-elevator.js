/**
 * Starfield Elevator Renderer
 * Ambient twinkling stars, shooting stars on timer, nebula clouds.
 * Extracted from renderers/starfield.js — simplified for standalone use.
 */
(function() {
    "use strict";
    var W = 0, H = 0, time = 0;
    var stars = [], shootingStars = [], nebulae = [];
    var STAR_COUNT = 120;
    var STAR_COLOR = { r: 232, g: 224, b: 208 };
    var NEBULA_COLORS = [
        { r: 138, g: 92, b: 246, a: 0.015 },
        { r: 201, g: 168, b: 76, a: 0.012 },
        { r: 42, g: 26, b: 62, a: 0.025 },
        { r: 57, g: 255, b: 20, a: 0.006 }
    ];
    var shootTimer = 0;

    function createStars(w, h) {
        stars = [];
        for (var i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: Math.random() * w, y: Math.random() * h,
                size: 0.3 + Math.random() * 1.2,
                baseBright: 0.2 + Math.random() * 0.6,
                speed: 0.3 + Math.random() * 1.5,
                offset: Math.random() * Math.PI * 2,
                drift: 0.01 + Math.random() * 0.04
            });
        }
    }

    function createNebulae(w, h) {
        nebulae = [];
        for (var i = 0; i < 4; i++) {
            var c = NEBULA_COLORS[i];
            nebulae.push({
                x: Math.random() * w, y: Math.random() * h,
                radius: 60 + Math.random() * 120, color: c,
                breatheSpeed: 0.15 + Math.random() * 0.3,
                breatheOffset: Math.random() * Math.PI * 2,
                driftX: (Math.random() - 0.5) * 0.06,
                driftY: (Math.random() - 0.5) * 0.03
            });
        }
    }

    function spawnShootingStar() {
        var angle = -0.15 - Math.random() * 0.5;
        var speed = 200 + Math.random() * 300;
        shootingStars.push({
            x: Math.random() * W * 0.8, y: Math.random() * H * 0.4,
            vx: Math.cos(angle) * speed, vy: -Math.sin(angle) * speed,
            life: 1, decay: 0.8 + Math.random() * 0.6,
            length: 20 + Math.random() * 35, bright: 0.7 + Math.random() * 0.3
        });
    }

    window.ElevatorRenderers = window.ElevatorRenderers || {};
    window.ElevatorRenderers['starfield'] = {
        init: function(ctx, w, h) {
            W = w; H = h; time = 0; shootTimer = 0;
            shootingStars = [];
            createStars(w, h);
            createNebulae(w, h);
        },
        resize: function(w, h) {
            W = w; H = h;
            createStars(w, h);
            createNebulae(w, h);
        },
        render: function(ctx, w, h, dt, elapsed) {
            W = w; H = h; time = elapsed;
            ctx.fillStyle = '#0a0a0f';
            ctx.fillRect(0, 0, W, H);

            // Nebulae
            for (var i = 0; i < nebulae.length; i++) {
                var n = nebulae[i];
                n.x += n.driftX * dt * 60;
                n.y += n.driftY * dt * 60;
                if (n.x < -n.radius) n.x = W + n.radius;
                if (n.x > W + n.radius) n.x = -n.radius;
                if (n.y < -n.radius) n.y = H + n.radius;
                if (n.y > H + n.radius) n.y = -n.radius;
                var breathe = Math.sin(time * n.breatheSpeed + n.breatheOffset);
                var scale = 1 + breathe * 0.08;
                var alpha = n.color.a * (1 + breathe * 0.3);
                var r = n.radius * scale;
                var grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r);
                grad.addColorStop(0, 'rgba(' + n.color.r + ',' + n.color.g + ',' + n.color.b + ',' + alpha + ')');
                grad.addColorStop(0.6, 'rgba(' + n.color.r + ',' + n.color.g + ',' + n.color.b + ',' + (alpha * 0.3) + ')');
                grad.addColorStop(1, 'rgba(' + n.color.r + ',' + n.color.g + ',' + n.color.b + ',0)');
                ctx.fillStyle = grad;
                ctx.fillRect(n.x - r, n.y - r, r * 2, r * 2);
            }

            // Stars
            for (var j = 0; j < stars.length; j++) {
                var s = stars[j];
                s.x += s.drift * dt * 60;
                if (s.x > W) s.x -= W;
                var bright = s.baseBright + Math.sin(time * s.speed + s.offset) * 0.25;
                if (bright < 0.05) bright = 0.05;
                if (bright > 1) bright = 1;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(' + STAR_COLOR.r + ',' + STAR_COLOR.g + ',' + STAR_COLOR.b + ',' + bright + ')';
                ctx.fill();
                if (bright > 0.7 && s.size > 0.8) {
                    ctx.beginPath();
                    ctx.arc(s.x, s.y, s.size * 3, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(' + STAR_COLOR.r + ',' + STAR_COLOR.g + ',' + STAR_COLOR.b + ',' + ((bright - 0.7) * 0.15) + ')';
                    ctx.fill();
                }
            }

            // Shooting stars on timer
            shootTimer -= dt;
            if (shootTimer <= 0) { spawnShootingStar(); shootTimer = 3 + Math.random() * 6; }

            for (var k = shootingStars.length - 1; k >= 0; k--) {
                var ss = shootingStars[k];
                ss.x += ss.vx * dt; ss.y += ss.vy * dt; ss.life -= ss.decay * dt;
                if (ss.life <= 0 || ss.x > W + 50 || ss.y > H + 50) { shootingStars.splice(k, 1); continue; }
                var mag = Math.sqrt(ss.vx * ss.vx + ss.vy * ss.vy);
                var tx = ss.x - (ss.vx / mag) * ss.length * ss.life;
                var ty = ss.y - (ss.vy / mag) * ss.length * ss.life;
                var g = ctx.createLinearGradient(tx, ty, ss.x, ss.y);
                g.addColorStop(0, 'rgba(232,224,208,0)');
                g.addColorStop(1, 'rgba(232,224,208,' + (ss.life * ss.bright * 0.8) + ')');
                ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(ss.x, ss.y);
                ctx.strokeStyle = g; ctx.lineWidth = 1.5; ctx.stroke();
                ctx.beginPath(); ctx.arc(ss.x, ss.y, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255,255,240,' + (ss.life * 0.6) + ')'; ctx.fill();
            }
        }
    };
})();
