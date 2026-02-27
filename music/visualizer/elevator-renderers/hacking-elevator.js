/**
 * Hacking the Mainframe Elevator Renderer
 * Matrix code rain, network nodes, data packets, terminal aesthetic.
 * Extracted from hacking-the-mainframe-video.html — simplified for ambient use.
 */
(function() {
    "use strict";
    var W = 0, H = 0, time = 0;
    var GREEN = '#00ff00', DARK_GREEN = '#005500', CYAN = '#00ffff', AMBER = '#ffaa00';
    var RAIN_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*{}[]<>/\\|~^';

    var rainColumns = [], nodes = [], connections = [], packets = [];
    var nodeTimer = 0;

    function randChar() { return RAIN_CHARS[Math.floor(Math.random() * RAIN_CHARS.length)]; }

    function initRain() {
        rainColumns = [];
        var fontSize = 12;
        var cols = Math.ceil(W / fontSize);
        for (var i = 0; i < cols; i++) {
            var chars = [];
            var len = 6 + Math.floor(Math.random() * 14);
            for (var j = 0; j < len; j++) chars.push(randChar());
            rainColumns.push({
                x: i * fontSize, y: Math.random() * H,
                speed: 40 + Math.random() * 80, chars: chars,
                length: len, fontSize: fontSize
            });
        }
    }

    function initNodes() {
        nodes = []; connections = [];
        var count = 8 + Math.floor(Math.random() * 5);
        for (var i = 0; i < count; i++) {
            nodes.push({
                x: W * 0.15 + Math.random() * W * 0.7,
                y: H * 0.15 + Math.random() * H * 0.7,
                radius: 3 + Math.random() * 5,
                phase: Math.random() * Math.PI * 2,
                compromised: i < 3,
                type: i === 0 ? 'entry' : (i === count - 1 ? 'mainframe' : 'node')
            });
        }
        for (var ni = 1; ni < nodes.length; ni++) {
            var bestDist = Infinity, bestJ = 0;
            for (var nj = 0; nj < ni; nj++) {
                var dx = nodes[ni].x - nodes[nj].x;
                var dy = nodes[ni].y - nodes[nj].y;
                var d = Math.sqrt(dx * dx + dy * dy);
                if (d < bestDist) { bestDist = d; bestJ = nj; }
            }
            connections.push({ from: bestJ, to: ni, active: ni < 3, packet: Math.random() });
            if (Math.random() > 0.6 && ni > 2) {
                connections.push({ from: Math.floor(Math.random() * ni), to: ni, active: false, packet: Math.random() });
            }
        }
    }

    window.ElevatorRenderers = window.ElevatorRenderers || {};
    window.ElevatorRenderers['hacking'] = {
        init: function(ctx, w, h) {
            W = w; H = h; time = 0; packets = []; nodeTimer = 0;
            initRain(); initNodes();
        },
        resize: function(w, h) { W = w; H = h; initRain(); initNodes(); },
        render: function(ctx, w, h, dt, elapsed) {
            W = w; H = h; time = elapsed;

            ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);

            // Matrix rain
            var fontSize = 12;
            for (var i = 0; i < rainColumns.length; i++) {
                var col = rainColumns[i];
                col.y += col.speed * dt;
                if (col.y > H + col.length * fontSize) {
                    col.y = -col.length * fontSize;
                    col.length = 6 + Math.floor(Math.random() * 14);
                    col.chars = [];
                    for (var j = 0; j < col.length; j++) col.chars.push(randChar());
                }
                for (var ci = 0; ci < col.chars.length; ci++) {
                    var cy = col.y + ci * fontSize;
                    if (cy < -fontSize || cy > H + fontSize) continue;
                    var charAlpha = (ci / col.length) * 0.5;
                    if (ci === col.chars.length - 1) {
                        ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 0.6;
                    } else {
                        ctx.fillStyle = GREEN; ctx.globalAlpha = charAlpha;
                    }
                    ctx.font = fontSize + 'px monospace';
                    ctx.fillText(col.chars[ci], col.x, cy);
                    if (Math.random() < 0.015) col.chars[ci] = randChar();
                }
            }
            ctx.globalAlpha = 1;

            // Network nodes and connections (overlaid on rain)
            ctx.save();
            for (var cni = 0; cni < connections.length; cni++) {
                var conn = connections[cni];
                var from = nodes[conn.from], to = nodes[conn.to];
                ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(to.x, to.y);
                if (conn.active) {
                    ctx.strokeStyle = CYAN; ctx.lineWidth = 1.5;
                    ctx.shadowBlur = 6; ctx.shadowColor = CYAN;
                } else {
                    ctx.strokeStyle = DARK_GREEN; ctx.lineWidth = 1;
                    ctx.shadowBlur = 0;
                }
                ctx.globalAlpha = 0.4; ctx.stroke();

                // Traveling packet
                if (conn.active) {
                    conn.packet = (conn.packet + 0.3 * dt) % 1;
                    var px = from.x + (to.x - from.x) * conn.packet;
                    var py = from.y + (to.y - from.y) * conn.packet;
                    ctx.fillStyle = CYAN; ctx.shadowBlur = 8; ctx.shadowColor = CYAN;
                    ctx.globalAlpha = 0.8;
                    ctx.beginPath(); ctx.arc(px, py, 2, 0, Math.PI * 2); ctx.fill();
                }
            }

            for (var ndi = 0; ndi < nodes.length; ndi++) {
                var n = nodes[ndi];
                var pulse = Math.sin(n.phase + time * 3) * 0.3;
                var r = n.radius + pulse * 1.5;
                ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
                if (n.compromised) {
                    ctx.fillStyle = n.type === 'mainframe' ? '#ff2222' : CYAN;
                    ctx.shadowBlur = 10; ctx.shadowColor = n.compromised ? CYAN : GREEN;
                } else if (n.type === 'mainframe') {
                    ctx.fillStyle = AMBER; ctx.shadowBlur = 8; ctx.shadowColor = AMBER;
                } else {
                    ctx.fillStyle = DARK_GREEN; ctx.shadowBlur = 3; ctx.shadowColor = GREEN;
                }
                ctx.globalAlpha = 0.7; ctx.fill();
            }
            ctx.restore();

            // Progressively compromise nodes
            nodeTimer -= dt;
            if (nodeTimer <= 0) {
                nodeTimer = 2 + Math.random() * 4;
                for (var ci2 = 0; ci2 < nodes.length; ci2++) {
                    if (!nodes[ci2].compromised) {
                        nodes[ci2].compromised = true;
                        for (var cci = 0; cci < connections.length; cci++) {
                            if (connections[cci].to === ci2 || connections[cci].from === ci2) {
                                connections[cci].active = true;
                            }
                        }
                        break;
                    }
                }
                // Reset when all compromised
                var allDone = true;
                for (var chk = 0; chk < nodes.length; chk++) {
                    if (!nodes[chk].compromised) { allDone = false; break; }
                }
                if (allDone) {
                    for (var rst = 3; rst < nodes.length; rst++) nodes[rst].compromised = false;
                    for (var rci = 0; rci < connections.length; rci++) {
                        if (connections[rci].to >= 3) connections[rci].active = false;
                    }
                }
            }

            // Floating data packets
            for (var pi = packets.length - 1; pi >= 0; pi--) {
                var pk = packets[pi];
                pk.x += pk.vx * dt; pk.y += pk.vy * dt; pk.life -= dt;
                if (pk.life <= 0) { packets.splice(pi, 1); continue; }
                ctx.fillStyle = pk.color; ctx.globalAlpha = Math.min(1, pk.life * 2);
                ctx.fillRect(pk.x - 2, pk.y - 1, 4, 2);
            }
            ctx.globalAlpha = 1;

            // Spawn occasional packets
            if (Math.random() < dt * 2) {
                var src = nodes[Math.floor(Math.random() * nodes.length)];
                var dst = nodes[Math.floor(Math.random() * nodes.length)];
                var angle = Math.atan2(dst.y - src.y, dst.x - src.x) + (Math.random() - 0.5) * 0.5;
                var spd = 60 + Math.random() * 100;
                packets.push({
                    x: src.x, y: src.y,
                    vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd,
                    life: 0.5 + Math.random() * 1, color: Math.random() > 0.5 ? GREEN : CYAN
                });
            }

            // CRT scanlines
            ctx.fillStyle = 'rgba(0,0,0,0.06)';
            for (var sy = 0; sy < H; sy += 3) ctx.fillRect(0, sy, W, 1);

            // Vignette
            var vGrad = ctx.createRadialGradient(W / 2, H / 2, W * 0.2, W / 2, H / 2, W * 0.65);
            vGrad.addColorStop(0, 'rgba(0,0,0,0)');
            vGrad.addColorStop(1, 'rgba(0,0,0,0.5)');
            ctx.fillStyle = vGrad; ctx.fillRect(0, 0, W, H);
        }
    };
})();
