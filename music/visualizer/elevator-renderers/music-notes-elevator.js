/**
 * Music Notes Elevator Renderer
 * Floating music notes drifting upward with gentle sway.
 * Gold/cream tones against dark background. Subtle staff lines fade in/out.
 * Designed for Floor 3 — Mozart's Study (Music).
 */
(function() {
    "use strict";
    var W = 0, H = 0, time = 0;
    var GOLD = '#d4af37', GOLD_LIGHT = '#f4d03f', CREAM = '#f5f0e1';
    var BG = '#08060a';

    var notes = [];
    var staffLines = [];
    var NOTE_COUNT = 18;
    var STAFF_COUNT = 3;

    // Note shape drawing functions
    function drawQuarterNote(ctx, x, y, size, alpha) {
        ctx.save();
        ctx.globalAlpha = alpha;
        // Note head (filled ellipse)
        ctx.beginPath();
        ctx.ellipse(x, y, size * 0.55, size * 0.4, -0.3, 0, Math.PI * 2);
        ctx.fillStyle = GOLD;
        ctx.fill();
        // Stem
        ctx.beginPath();
        ctx.moveTo(x + size * 0.5, y);
        ctx.lineTo(x + size * 0.5, y - size * 2.2);
        ctx.strokeStyle = GOLD;
        ctx.lineWidth = size * 0.12;
        ctx.stroke();
        ctx.restore();
    }

    function drawEighthNote(ctx, x, y, size, alpha) {
        ctx.save();
        ctx.globalAlpha = alpha;
        // Note head
        ctx.beginPath();
        ctx.ellipse(x, y, size * 0.55, size * 0.4, -0.3, 0, Math.PI * 2);
        ctx.fillStyle = GOLD_LIGHT;
        ctx.fill();
        // Stem
        var stemTop = y - size * 2.2;
        ctx.beginPath();
        ctx.moveTo(x + size * 0.5, y);
        ctx.lineTo(x + size * 0.5, stemTop);
        ctx.strokeStyle = GOLD_LIGHT;
        ctx.lineWidth = size * 0.12;
        ctx.stroke();
        // Flag
        ctx.beginPath();
        ctx.moveTo(x + size * 0.5, stemTop);
        ctx.quadraticCurveTo(x + size * 1.4, stemTop + size * 0.6, x + size * 0.6, stemTop + size * 1.2);
        ctx.strokeStyle = GOLD_LIGHT;
        ctx.lineWidth = size * 0.1;
        ctx.stroke();
        ctx.restore();
    }

    function drawDoubleEighth(ctx, x, y, size, alpha) {
        ctx.save();
        ctx.globalAlpha = alpha;
        var gap = size * 1.1;
        // Two note heads
        for (var i = 0; i < 2; i++) {
            var nx = x + i * gap;
            ctx.beginPath();
            ctx.ellipse(nx, y, size * 0.45, size * 0.35, -0.3, 0, Math.PI * 2);
            ctx.fillStyle = CREAM;
            ctx.fill();
            // Stems
            ctx.beginPath();
            ctx.moveTo(nx + size * 0.4, y);
            ctx.lineTo(nx + size * 0.4, y - size * 2);
            ctx.strokeStyle = CREAM;
            ctx.lineWidth = size * 0.1;
            ctx.stroke();
        }
        // Beam connecting stems
        ctx.fillStyle = CREAM;
        ctx.fillRect(x + size * 0.35, y - size * 2, gap + size * 0.1, size * 0.15);
        ctx.restore();
    }

    function drawTrebleClef(ctx, x, y, size, alpha) {
        ctx.save();
        ctx.globalAlpha = alpha * 0.7;
        ctx.translate(x, y);
        var s = size * 0.08;
        ctx.strokeStyle = GOLD;
        ctx.lineWidth = s * 1.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        // Simplified treble clef shape
        ctx.moveTo(s * 2, s * 12);
        ctx.quadraticCurveTo(s * -6, s * 8, s * -2, s * 2);
        ctx.quadraticCurveTo(s * 2, s * -2, s * 6, s * 1);
        ctx.quadraticCurveTo(s * 10, s * 4, s * 4, s * 8);
        ctx.quadraticCurveTo(s * -2, s * 12, s * 0, s * 16);
        ctx.quadraticCurveTo(s * 1, s * 20, s * 3, s * 18);
        ctx.stroke();
        // Vertical line through
        ctx.beginPath();
        ctx.moveTo(s * 2, s * -4);
        ctx.lineTo(s * 2, s * 20);
        ctx.lineWidth = s * 1.2;
        ctx.stroke();
        ctx.restore();
    }

    var drawFns = [drawQuarterNote, drawEighthNote, drawDoubleEighth, drawTrebleClef];

    function spawnNote(randomY) {
        var type = Math.random() < 0.12 ? 3 : Math.floor(Math.random() * 3);
        var size = type === 3 ? 8 + Math.random() * 6 : 6 + Math.random() * 8;
        notes.push({
            x: Math.random() * W,
            y: randomY ? Math.random() * H : H + size * 3,
            size: size,
            type: type,
            vx: (Math.random() - 0.5) * 8,
            vy: -(12 + Math.random() * 25),
            swaySpeed: 0.5 + Math.random() * 1.5,
            swayAmp: 5 + Math.random() * 15,
            swayOffset: Math.random() * Math.PI * 2,
            rotation: (Math.random() - 0.5) * 0.3,
            brightness: 0.3 + Math.random() * 0.7
        });
    }

    function buildStaffLines() {
        staffLines = [];
        for (var i = 0; i < STAFF_COUNT; i++) {
            staffLines.push({
                y: H * (0.2 + i * 0.3),
                alpha: 0,
                targetAlpha: 0,
                fadeSpeed: 0.3 + Math.random() * 0.5,
                timer: 2 + Math.random() * 5,
                spacing: Math.min(W, H) * 0.015
            });
        }
    }

    window.ElevatorRenderers = window.ElevatorRenderers || {};
    window.ElevatorRenderers['music-notes'] = {
        init: function(ctx, w, h) {
            W = w; H = h; time = 0;
            notes = [];
            for (var i = 0; i < NOTE_COUNT; i++) {
                spawnNote(true);
            }
            buildStaffLines();
        },
        resize: function(w, h) {
            W = w; H = h;
            buildStaffLines();
        },
        render: function(ctx, w, h, dt, elapsed) {
            W = w; H = h; time = elapsed;

            // Background
            ctx.fillStyle = BG;
            ctx.fillRect(0, 0, W, H);

            // Warm ambient glow
            var cx = W * 0.5, cy = H * 0.5;
            var glowR = Math.max(W, H) * 0.6;
            var glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
            glow.addColorStop(0, 'rgba(212,175,55,0.03)');
            glow.addColorStop(0.5, 'rgba(128,90,20,0.015)');
            glow.addColorStop(1, 'rgba(8,6,10,0)');
            ctx.fillStyle = glow;
            ctx.fillRect(0, 0, W, H);

            // Staff lines (fade in/out periodically)
            for (var si = 0; si < staffLines.length; si++) {
                var staff = staffLines[si];
                staff.timer -= dt;
                if (staff.timer <= 0) {
                    staff.targetAlpha = staff.targetAlpha > 0.05 ? 0 : 0.08 + Math.random() * 0.06;
                    staff.timer = 3 + Math.random() * 6;
                }
                staff.alpha += (staff.targetAlpha - staff.alpha) * staff.fadeSpeed * dt;

                if (staff.alpha > 0.01) {
                    ctx.save();
                    ctx.strokeStyle = 'rgba(212,175,55,' + staff.alpha + ')';
                    ctx.lineWidth = 1;
                    for (var li = 0; li < 5; li++) {
                        var ly = staff.y + (li - 2) * staff.spacing;
                        ctx.beginPath();
                        ctx.moveTo(W * 0.05, ly);
                        ctx.lineTo(W * 0.95, ly);
                        ctx.stroke();
                    }
                    ctx.restore();
                }
            }

            // Update and draw notes
            for (var ni = notes.length - 1; ni >= 0; ni--) {
                var n = notes[ni];
                var sway = Math.sin(time * n.swaySpeed + n.swayOffset) * n.swayAmp;
                n.x += n.vx * dt + sway * dt;
                n.y += n.vy * dt;

                // Fade based on vertical position
                var yRatio = n.y / H;
                var fade = 1;
                if (yRatio < 0.1) fade = yRatio / 0.1;
                if (yRatio > 0.85) fade = (1 - yRatio) / 0.15;
                if (fade < 0) fade = 0;

                if (n.y < -n.size * 4) {
                    notes.splice(ni, 1);
                    spawnNote(false);
                    continue;
                }

                var alpha = n.brightness * fade;
                if (alpha < 0.01) continue;

                ctx.save();
                ctx.translate(n.x, n.y);
                ctx.rotate(n.rotation);
                ctx.translate(-n.x, -n.y);
                drawFns[n.type](ctx, n.x, n.y, n.size, alpha);
                ctx.restore();
            }

            // Vignette
            var vGrad = ctx.createRadialGradient(cx, cy, Math.max(W, H) * 0.35, cx, cy, Math.max(W, H) * 0.75);
            vGrad.addColorStop(0, 'rgba(8,6,10,0)');
            vGrad.addColorStop(1, 'rgba(8,6,10,0.5)');
            ctx.fillStyle = vGrad;
            ctx.fillRect(0, 0, W, H);
        }
    };
})();
