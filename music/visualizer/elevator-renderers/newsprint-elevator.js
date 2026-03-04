/**
 * Newsprint Elevator Renderer
 * Dark-mode newspaper — scrolling headlines, column rules, and ink dots on aged dark paper.
 */
(function() {
    "use strict";
    var W = 0, H = 0, time = 0;

    var PAPER = '#1a1812';
    var TEXT = '#ddd5b8';
    var RULE = '#3a3528';
    var RED = '#cc4433';
    var GOLD = '#d4af37';

    var headlines = [
        'BREAKING: AI ADVANCES CONTINUE',
        'NEW MODELS RELEASED TODAY',
        'OPEN SOURCE MOMENTUM GROWS',
        'RESEARCH PAPER SETS RECORD',
        'INDUSTRY LEADERS RESPOND',
        'DEVELOPER TOOLS EVOLVE',
        'BENCHMARK SCORES SHATTERED',
        'COMMUNITY BUILDS FORWARD',
        'POLICY FRAMEWORKS DEBATED',
        'FRONTIER LABS PUSH LIMITS'
    ];

    var scrollLines = [];
    var inkDots = [];
    var columnX = [];

    function initLines() {
        scrollLines = [];
        var lineH = 18;
        var count = Math.ceil(H / lineH) + 6;
        for (var i = 0; i < count; i++) {
            scrollLines.push({
                y: i * lineH,
                text: headlines[Math.floor(Math.random() * headlines.length)],
                speed: 20 + Math.random() * 15,
                alpha: 0.12 + Math.random() * 0.16,
                size: 10 + Math.floor(Math.random() * 4),
                isHeadline: Math.random() < 0.15
            });
        }

        // Column dividers
        columnX = [];
        var cols = 3 + Math.floor(Math.random() * 2);
        for (var c = 1; c < cols; c++) {
            columnX.push(W * c / cols);
        }

        // Ink splatter dots
        inkDots = [];
        for (var d = 0; d < 30; d++) {
            inkDots.push({
                x: Math.random() * W,
                y: Math.random() * H,
                r: 0.5 + Math.random() * 2,
                alpha: 0.04 + Math.random() * 0.1,
                drift: (Math.random() - 0.5) * 5
            });
        }
    }

    window.ElevatorRenderers = window.ElevatorRenderers || {};
    window.ElevatorRenderers['newsprint'] = {
        init: function(ctx, w, h) {
            W = w; H = h; time = 0;
            initLines();
        },
        resize: function(w, h) { W = w; H = h; initLines(); },
        render: function(ctx, w, h, dt, elapsed) {
            W = w; H = h; time = elapsed;

            // Dark paper background
            ctx.fillStyle = PAPER;
            ctx.fillRect(0, 0, W, H);

            // Subtle paper grain
            ctx.globalAlpha = 0.03;
            for (var gy = 0; gy < H; gy += 3) {
                ctx.fillStyle = Math.random() > 0.5 ? TEXT : RULE;
                ctx.fillRect(0, gy, W, 1);
            }
            ctx.globalAlpha = 1;

            // Column rules
            ctx.strokeStyle = RULE;
            ctx.lineWidth = 1;
            for (var ci = 0; ci < columnX.length; ci++) {
                ctx.globalAlpha = 0.4;
                ctx.beginPath();
                ctx.moveTo(columnX[ci], 0);
                ctx.lineTo(columnX[ci], H);
                ctx.stroke();
            }
            ctx.globalAlpha = 1;

            // Scrolling text lines
            for (var i = 0; i < scrollLines.length; i++) {
                var line = scrollLines[i];
                line.y -= line.speed * dt;
                if (line.y < -30) {
                    line.y = H + 10;
                    line.text = headlines[Math.floor(Math.random() * headlines.length)];
                    line.isHeadline = Math.random() < 0.15;
                }

                ctx.globalAlpha = line.alpha;
                if (line.isHeadline) {
                    ctx.font = 'bold ' + (line.size + 4) + 'px Georgia, serif';
                    ctx.fillStyle = RED;
                    ctx.globalAlpha = line.alpha * 1.5;
                } else {
                    ctx.font = line.size + 'px Georgia, serif';
                    ctx.fillStyle = TEXT;
                }
                ctx.fillText(line.text, 8 + Math.sin(time * 0.3 + i) * 2, line.y);
            }
            ctx.globalAlpha = 1;

            // Ink dots drifting
            for (var di = 0; di < inkDots.length; di++) {
                var dot = inkDots[di];
                dot.y -= 8 * dt;
                dot.x += dot.drift * dt;
                if (dot.y < -5) { dot.y = H + 5; dot.x = Math.random() * W; }
                ctx.globalAlpha = dot.alpha;
                ctx.fillStyle = GOLD;
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;

            // Oxford rule at top
            ctx.fillStyle = GOLD;
            ctx.globalAlpha = 0.15;
            ctx.fillRect(0, 0, W, 3);
            ctx.fillRect(0, 5, W, 1);

            // Oxford rule at bottom
            ctx.fillRect(0, H - 3, W, 3);
            ctx.fillRect(0, H - 6, W, 1);
            ctx.globalAlpha = 1;

            // Vignette — darken edges
            var vGrad = ctx.createRadialGradient(W / 2, H / 2, W * 0.25, W / 2, H / 2, W * 0.7);
            vGrad.addColorStop(0, 'rgba(26,24,18,0)');
            vGrad.addColorStop(1, 'rgba(10,10,8,0.5)');
            ctx.fillStyle = vGrad;
            ctx.fillRect(0, 0, W, H);
        }
    };
})();
