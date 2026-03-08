/**
 * Carnival Elevator Renderer
 * Colorful floating balloons drifting upward with gentle sway,
 * confetti particles drifting down, warm carnival atmosphere.
 * Designed for the Kids' Corner floor.
 */
(function() {
    "use strict";
    var W = 0, H = 0, time = 0;

    var COLORS = [
        '#FFB3D9', // cotton candy pink
        '#E53935', // balloon red
        '#42A5F5', // balloon blue
        '#66BB6A', // balloon green
        '#FFE066', // popcorn yellow
        '#B07CC6'  // taffy purple
    ];

    var HIGHLIGHT_COLORS = [
        '#FFD6EC', // pink highlight
        '#FF6F61', // red highlight
        '#90CAF9', // blue highlight
        '#A5D6A7', // green highlight
        '#FFF3B0', // yellow highlight
        '#D4A8E0'  // purple highlight
    ];

    var BG = '#0c0814';
    var BALLOON_COUNT = 18;
    var CONFETTI_COUNT = 40;

    var balloons = [];
    var confetti = [];

    function buildBalloons(randomY) {
        balloons = [];
        for (var i = 0; i < BALLOON_COUNT; i++) {
            spawnBalloon(randomY);
        }
    }

    function spawnBalloon(randomY) {
        var colorIdx = Math.floor(Math.random() * COLORS.length);
        balloons.push({
            x: Math.random() * W,
            y: randomY ? Math.random() * H : H + 20 + Math.random() * 60,
            size: 14 + Math.random() * 18,
            colorIdx: colorIdx,
            speed: 15 + Math.random() * 25,
            swayAmp: 8 + Math.random() * 16,
            swaySpeed: 0.5 + Math.random() * 1.2,
            swayOffset: Math.random() * Math.PI * 2,
            wobble: Math.random() * 0.15,
            stringLen: 20 + Math.random() * 20
        });
    }

    function buildConfetti() {
        confetti = [];
        for (var i = 0; i < CONFETTI_COUNT; i++) {
            spawnConfetti(true);
        }
    }

    function spawnConfetti(randomY) {
        var colorIdx = Math.floor(Math.random() * COLORS.length);
        confetti.push({
            x: Math.random() * W,
            y: randomY ? Math.random() * H : -5 - Math.random() * 20,
            w: 3 + Math.random() * 5,
            h: 2 + Math.random() * 3,
            colorIdx: colorIdx,
            speed: 12 + Math.random() * 20,
            drift: (Math.random() - 0.5) * 30,
            spin: Math.random() * Math.PI * 2,
            spinSpeed: 2 + Math.random() * 4,
            flipSpeed: 1.5 + Math.random() * 3,
            flipOffset: Math.random() * Math.PI * 2
        });
    }

    window.ElevatorRenderers = window.ElevatorRenderers || {};
    window.ElevatorRenderers['carnival'] = {
        init: function(ctx, w, h) {
            W = w; H = h; time = 0;
            buildBalloons(true);
            buildConfetti();
        },
        resize: function(w, h) {
            W = w; H = h;
        },
        render: function(ctx, w, h, dt, elapsed) {
            W = w; H = h; time = elapsed;

            // Background — dark with warm carnival glow
            ctx.fillStyle = BG;
            ctx.fillRect(0, 0, W, H);

            // Warm ambient glow from center-bottom
            var cx = W * 0.5, cy = H * 0.7;
            var glowR = Math.max(W, H) * 0.6;
            var glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
            glow.addColorStop(0, 'rgba(255,179,217,0.04)');
            glow.addColorStop(0.3, 'rgba(176,124,198,0.025)');
            glow.addColorStop(0.6, 'rgba(66,165,245,0.015)');
            glow.addColorStop(1, 'rgba(12,8,20,0)');
            ctx.fillStyle = glow;
            ctx.fillRect(0, 0, W, H);

            // Confetti (behind balloons)
            for (var ci = confetti.length - 1; ci >= 0; ci--) {
                var c = confetti[ci];
                c.y += c.speed * dt;
                c.x += c.drift * dt;
                c.spin += c.spinSpeed * dt;

                if (c.y > H + 10 || c.x < -20 || c.x > W + 20) {
                    confetti.splice(ci, 1);
                    spawnConfetti(false);
                    continue;
                }

                // Flip effect — confetti tumbles as it falls
                var flip = Math.sin(time * c.flipSpeed + c.flipOffset);
                var scaleY = Math.abs(flip);
                var alpha = 0.4 + scaleY * 0.4;

                ctx.save();
                ctx.translate(c.x, c.y);
                ctx.rotate(c.spin);
                ctx.scale(1, scaleY * 0.6 + 0.4);
                ctx.globalAlpha = alpha;
                ctx.fillStyle = COLORS[c.colorIdx];
                ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
                ctx.restore();
            }

            // Balloons
            for (var bi = balloons.length - 1; bi >= 0; bi--) {
                var b = balloons[bi];
                b.y -= b.speed * dt;
                var sway = Math.sin(time * b.swaySpeed + b.swayOffset) * b.swayAmp;
                var drawX = b.x + sway;
                var wobbleAngle = Math.sin(time * b.swaySpeed * 0.7 + b.swayOffset) * b.wobble;

                // Remove and respawn if off top
                if (b.y < -b.size * 2 - b.stringLen) {
                    balloons.splice(bi, 1);
                    spawnBalloon(false);
                    continue;
                }

                var r = b.size;
                var color = COLORS[b.colorIdx];
                var highlight = HIGHLIGHT_COLORS[b.colorIdx];

                ctx.save();
                ctx.translate(drawX, b.y);
                ctx.rotate(wobbleAngle);

                // String
                ctx.beginPath();
                ctx.moveTo(0, r * 0.9);
                var stringEndX = Math.sin(time * b.swaySpeed * 0.5 + b.swayOffset + 1) * 6;
                ctx.quadraticCurveTo(stringEndX * 0.5, r + b.stringLen * 0.5, stringEndX, r + b.stringLen);
                ctx.strokeStyle = 'rgba(255,255,255,0.2)';
                ctx.lineWidth = 1;
                ctx.stroke();

                // Balloon body — oval
                ctx.beginPath();
                ctx.ellipse(0, 0, r * 0.8, r, 0, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();

                // Balloon body gradient overlay for depth
                var bGrad = ctx.createRadialGradient(-r * 0.25, -r * 0.3, r * 0.1, 0, 0, r);
                bGrad.addColorStop(0, 'rgba(255,255,255,0.15)');
                bGrad.addColorStop(0.4, 'rgba(255,255,255,0.03)');
                bGrad.addColorStop(0.7, 'rgba(0,0,0,0.05)');
                bGrad.addColorStop(1, 'rgba(0,0,0,0.15)');
                ctx.fillStyle = bGrad;
                ctx.fill();

                // Shine highlight — small bright spot
                ctx.beginPath();
                ctx.ellipse(-r * 0.2, -r * 0.35, r * 0.2, r * 0.3, -0.3, 0, Math.PI * 2);
                ctx.fillStyle = highlight;
                ctx.globalAlpha = 0.35;
                ctx.fill();
                ctx.globalAlpha = 1;

                // Balloon knot
                ctx.beginPath();
                ctx.moveTo(-3, r * 0.85);
                ctx.lineTo(0, r * 1.0);
                ctx.lineTo(3, r * 0.85);
                ctx.closePath();
                ctx.fillStyle = color;
                ctx.fill();

                // Soft glow around balloon
                var bGlow = ctx.createRadialGradient(0, 0, r * 0.5, 0, 0, r * 2);
                bGlow.addColorStop(0, 'rgba(0,0,0,0)');
                bGlow.addColorStop(0.5, 'rgba(0,0,0,0)');
                var rgb = hexToRgb(color);
                bGlow.addColorStop(0.5, 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',0.02)');
                bGlow.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = bGlow;
                ctx.fillRect(-r * 2, -r * 2, r * 4, r * 4);

                ctx.restore();
            }

            // Vignette
            var vGrad = ctx.createRadialGradient(W * 0.5, H * 0.5, Math.min(W, H) * 0.3, W * 0.5, H * 0.5, Math.max(W, H) * 0.7);
            vGrad.addColorStop(0, 'rgba(12,8,20,0)');
            vGrad.addColorStop(1, 'rgba(12,8,20,0.5)');
            ctx.fillStyle = vGrad;
            ctx.fillRect(0, 0, W, H);
        }
    };

    function hexToRgb(hex) {
        var r = parseInt(hex.slice(1, 3), 16);
        var g = parseInt(hex.slice(3, 5), 16);
        var b = parseInt(hex.slice(5, 7), 16);
        return { r: r, g: g, b: b };
    }
})();
