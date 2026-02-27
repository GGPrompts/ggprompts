/**
 * Sunburst Elevator Renderer
 * Gold Art Deco sunburst with rotating rays, shimmering particles, warm glow.
 * Designed for the Lobby — the grand entrance to the elevator.
 */
(function() {
    "use strict";
    var W = 0, H = 0, time = 0;
    var GOLD = '#d4af37', GOLD_LIGHT = '#f4d03f', BRASS = '#b5882a';
    var CREAM = '#f5f0e1', BG = '#0d0a04';

    var RAY_COUNT = 24;
    var rays = [];
    var particles = [];
    var PARTICLE_COUNT = 60;
    var rings = [];

    function buildRays() {
        rays = [];
        for (var i = 0; i < RAY_COUNT; i++) {
            var angle = (i / RAY_COUNT) * Math.PI * 2;
            rays.push({
                angle: angle,
                width: 0.03 + Math.random() * 0.04,
                length: 0.6 + Math.random() * 0.4,
                brightness: 0.3 + Math.random() * 0.5,
                pulseSpeed: 0.3 + Math.random() * 0.8,
                pulseOffset: Math.random() * Math.PI * 2
            });
        }
    }

    function buildParticles() {
        particles = [];
        for (var i = 0; i < PARTICLE_COUNT; i++) {
            spawnParticle(true);
        }
    }

    function spawnParticle(randomLife) {
        var angle = Math.random() * Math.PI * 2;
        var dist = 0.15 + Math.random() * 0.45;
        particles.push({
            angle: angle,
            dist: dist,
            size: 0.5 + Math.random() * 2,
            drift: (Math.random() - 0.5) * 0.15,
            radialSpeed: 0.02 + Math.random() * 0.06,
            life: randomLife ? Math.random() * 4 : 3 + Math.random() * 2,
            maxLife: 3 + Math.random() * 2,
            brightness: 0.3 + Math.random() * 0.7
        });
    }

    function buildRings() {
        rings = [];
        for (var i = 0; i < 3; i++) {
            rings.push({
                radius: 0.15 + i * 0.15,
                width: 1 + (2 - i) * 0.5,
                alpha: 0.12 - i * 0.03,
                speed: 0.1 + i * 0.05
            });
        }
    }

    window.ElevatorRenderers = window.ElevatorRenderers || {};
    window.ElevatorRenderers['sunburst'] = {
        init: function(ctx, w, h) {
            W = w; H = h; time = 0;
            buildRays();
            buildParticles();
            buildRings();
        },
        resize: function(w, h) {
            W = w; H = h;
        },
        render: function(ctx, w, h, dt, elapsed) {
            W = w; H = h; time = elapsed;
            var cx = W * 0.5, cy = H * 0.5;
            var maxR = Math.sqrt(cx * cx + cy * cy);

            // Background
            ctx.fillStyle = BG;
            ctx.fillRect(0, 0, W, H);

            // Central warm glow
            var glowR = maxR * 0.7;
            var glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
            glow.addColorStop(0, 'rgba(212,175,55,0.08)');
            glow.addColorStop(0.3, 'rgba(184,136,42,0.04)');
            glow.addColorStop(0.7, 'rgba(128,90,20,0.015)');
            glow.addColorStop(1, 'rgba(13,10,4,0)');
            ctx.fillStyle = glow;
            ctx.fillRect(0, 0, W, H);

            // Rotating rays
            var rotBase = time * 0.08;
            ctx.save();
            ctx.translate(cx, cy);
            ctx.globalCompositeOperation = 'lighter';

            for (var i = 0; i < rays.length; i++) {
                var r = rays[i];
                var pulse = 0.6 + 0.4 * Math.sin(time * r.pulseSpeed + r.pulseOffset);
                var alpha = r.brightness * pulse * 0.18;
                var a = r.angle + rotBase;
                var halfW = r.width * Math.PI;
                var len = maxR * r.length;

                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.arc(0, 0, len, a - halfW, a + halfW);
                ctx.closePath();

                var rayGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, len);
                rayGrad.addColorStop(0, 'rgba(244,208,63,' + (alpha * 1.5) + ')');
                rayGrad.addColorStop(0.3, 'rgba(212,175,55,' + alpha + ')');
                rayGrad.addColorStop(0.7, 'rgba(181,136,42,' + (alpha * 0.4) + ')');
                rayGrad.addColorStop(1, 'rgba(128,90,20,0)');
                ctx.fillStyle = rayGrad;
                ctx.fill();
            }

            ctx.restore();

            // Concentric Deco rings
            ctx.save();
            for (var ri = 0; ri < rings.length; ri++) {
                var ring = rings[ri];
                var rr = maxR * ring.radius;
                var breathe = 1 + Math.sin(time * ring.speed) * 0.03;
                rr *= breathe;
                ctx.beginPath();
                ctx.arc(cx, cy, rr, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(212,175,55,' + ring.alpha + ')';
                ctx.lineWidth = ring.width;
                ctx.stroke();
            }
            ctx.restore();

            // Deco diamond accents on outer ring
            ctx.save();
            var outerR = maxR * rings[2].radius * (1 + Math.sin(time * rings[2].speed) * 0.03);
            var diamondCount = 8;
            var diamRot = time * 0.06;
            ctx.translate(cx, cy);
            for (var di = 0; di < diamondCount; di++) {
                var da = (di / diamondCount) * Math.PI * 2 + diamRot;
                var dx = Math.cos(da) * outerR;
                var dy = Math.sin(da) * outerR;
                var ds = Math.min(W, H) * 0.012;
                ctx.save();
                ctx.translate(dx, dy);
                ctx.rotate(da + Math.PI / 4);
                ctx.fillStyle = 'rgba(244,208,63,0.25)';
                ctx.fillRect(-ds, -ds, ds * 2, ds * 2);
                ctx.restore();
            }
            ctx.restore();

            // Shimmering particles
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            for (var pi = particles.length - 1; pi >= 0; pi--) {
                var p = particles[pi];
                p.angle += p.drift * dt;
                p.dist += p.radialSpeed * dt;
                p.life -= dt;

                if (p.life <= 0 || p.dist > 0.75) {
                    particles.splice(pi, 1);
                    spawnParticle(false);
                    continue;
                }

                var lifeRatio = p.life / p.maxLife;
                var fadeIn = lifeRatio > 0.8 ? (1 - lifeRatio) / 0.2 : 1;
                var fadeOut = lifeRatio < 0.3 ? lifeRatio / 0.3 : 1;
                var pa = p.brightness * fadeIn * fadeOut * 0.6;

                var px = cx + Math.cos(p.angle) * p.dist * maxR;
                var py = cy + Math.sin(p.angle) * p.dist * maxR;

                ctx.beginPath();
                ctx.arc(px, py, p.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(244,208,63,' + pa + ')';
                ctx.fill();

                // Glow halo on brighter particles
                if (p.brightness > 0.5) {
                    ctx.beginPath();
                    ctx.arc(px, py, p.size * 3, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(212,175,55,' + (pa * 0.15) + ')';
                    ctx.fill();
                }
            }
            ctx.restore();

            // Central jewel
            var jewlR = Math.min(W, H) * 0.02;
            var jewlPulse = 0.7 + 0.3 * Math.sin(time * 1.5);
            var jewlGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, jewlR * 3);
            jewlGrad.addColorStop(0, 'rgba(244,208,63,' + (0.5 * jewlPulse) + ')');
            jewlGrad.addColorStop(0.4, 'rgba(212,175,55,' + (0.2 * jewlPulse) + ')');
            jewlGrad.addColorStop(1, 'rgba(181,136,42,0)');
            ctx.fillStyle = jewlGrad;
            ctx.fillRect(cx - jewlR * 3, cy - jewlR * 3, jewlR * 6, jewlR * 6);

            ctx.beginPath();
            ctx.arc(cx, cy, jewlR, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(244,208,63,' + (0.8 * jewlPulse) + ')';
            ctx.fill();

            // Vignette
            var vGrad = ctx.createRadialGradient(cx, cy, maxR * 0.4, cx, cy, maxR);
            vGrad.addColorStop(0, 'rgba(13,10,4,0)');
            vGrad.addColorStop(1, 'rgba(13,10,4,0.55)');
            ctx.fillStyle = vGrad;
            ctx.fillRect(0, 0, W, H);
        }
    };
})();
