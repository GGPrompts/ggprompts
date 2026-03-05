/* Connect Four — Renderer
   Canvas-based board rendering with animated disc drops and win highlighting.
   Depends on: engine.js (window.ConnectFour) */

'use strict';

window.ConnectFourRenderer = (() => {
    const { ROWS, COLS, EMPTY, P1, P2 } = window.ConnectFour;

    const CELL_SIZE = 80;
    const DISC_RADIUS = 32;
    const BOARD_PAD = 10;
    const HEADER_HEIGHT = CELL_SIZE; // space for drop preview

    const WIDTH = COLS * CELL_SIZE + BOARD_PAD * 2;
    const HEIGHT = ROWS * CELL_SIZE + BOARD_PAD * 2 + HEADER_HEIGHT;

    const COLORS = {
        boardFace: '#1a56c4',
        boardEdge: '#0f3d8c',
        boardShadow: 'rgba(0,0,0,0.25)',
        cellHole: '#0a1628',
        p1Fill: '#e63946',
        p1Stroke: '#b5202c',
        p1Shine: 'rgba(255,200,200,0.5)',
        p2Fill: '#f4d03f',
        p2Stroke: '#c9a800',
        p2Shine: 'rgba(255,255,220,0.6)',
        winGlow: '#39ff14',
        hoverCol: 'rgba(255,255,255,0.08)',
        bg: '#0a1628',
    };

    let canvas, ctx;
    let animQueue = [];
    let animating = false;
    let hoverCol = -1;
    let winCells = null;
    let winPulse = 0;

    function init(canvasEl) {
        canvas = canvasEl;
        ctx = canvas.getContext('2d');
        canvas.width = WIDTH;
        canvas.height = HEIGHT;
        canvas.style.maxWidth = '100%';
        canvas.style.height = 'auto';
    }

    function cellCenter(row, col) {
        const x = BOARD_PAD + col * CELL_SIZE + CELL_SIZE / 2;
        const y = HEADER_HEIGHT + BOARD_PAD + row * CELL_SIZE + CELL_SIZE / 2;
        return { x, y };
    }

    function getColFromX(canvasX) {
        const rect = canvas.getBoundingClientRect();
        const scale = WIDTH / rect.width;
        const x = canvasX * scale;
        const col = Math.floor((x - BOARD_PAD) / CELL_SIZE);
        return col >= 0 && col < COLS ? col : -1;
    }

    /* ── Drawing ──────────────────────────────────────────── */

    function drawBoard(board) {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        // Background
        ctx.fillStyle = COLORS.bg;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        // Hover column highlight in header
        if (hoverCol >= 0) {
            const hx = BOARD_PAD + hoverCol * CELL_SIZE;
            ctx.fillStyle = COLORS.hoverCol;
            ctx.fillRect(hx, 0, CELL_SIZE, HEIGHT);
        }

        // Board face
        const bx = BOARD_PAD - 4;
        const by = HEADER_HEIGHT + BOARD_PAD - 4;
        const bw = COLS * CELL_SIZE + 8;
        const bh = ROWS * CELL_SIZE + 8;

        // Board shadow
        ctx.fillStyle = COLORS.boardShadow;
        ctx.beginPath();
        ctx.roundRect(bx + 4, by + 4, bw, bh, 12);
        ctx.fill();

        // Board body
        ctx.fillStyle = COLORS.boardFace;
        ctx.beginPath();
        ctx.roundRect(bx, by, bw, bh, 12);
        ctx.fill();

        // Board edge
        ctx.strokeStyle = COLORS.boardEdge;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(bx, by, bw, bh, 12);
        ctx.stroke();

        // Cells
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const { x, y } = cellCenter(r, c);
                // Hole
                ctx.beginPath();
                ctx.arc(x, y, DISC_RADIUS + 2, 0, Math.PI * 2);
                ctx.fillStyle = COLORS.cellHole;
                ctx.fill();

                const piece = board[r][c];
                if (piece !== EMPTY) {
                    drawDisc(x, y, piece);
                }
            }
        }

        // Win glow overlay
        if (winCells) {
            winPulse += 0.05;
            const glowAlpha = 0.4 + 0.3 * Math.sin(winPulse);
            for (const [wr, wc] of winCells) {
                const { x, y } = cellCenter(wr, wc);
                ctx.beginPath();
                ctx.arc(x, y, DISC_RADIUS + 6, 0, Math.PI * 2);
                ctx.strokeStyle = COLORS.winGlow;
                ctx.lineWidth = 4;
                ctx.globalAlpha = glowAlpha;
                ctx.shadowColor = COLORS.winGlow;
                ctx.shadowBlur = 16;
                ctx.stroke();
                ctx.globalAlpha = 1;
                ctx.shadowBlur = 0;
            }
        }
    }

    function drawDisc(x, y, player, alpha) {
        if (alpha !== undefined) ctx.globalAlpha = alpha;
        const fill = player === P1 ? COLORS.p1Fill : COLORS.p2Fill;
        const stroke = player === P1 ? COLORS.p1Stroke : COLORS.p2Stroke;
        const shine = player === P1 ? COLORS.p1Shine : COLORS.p2Shine;

        // Disc body
        ctx.beginPath();
        ctx.arc(x, y, DISC_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Shine highlight
        ctx.beginPath();
        ctx.arc(x - 8, y - 8, DISC_RADIUS * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = shine;
        ctx.fill();

        if (alpha !== undefined) ctx.globalAlpha = 1;
    }

    /* ── Hover preview disc ───────────────────────────────── */

    function drawHoverDisc(board, col, player) {
        if (col < 0 || window.ConnectFour.isColumnFull(board, col)) return;
        const { x } = cellCenter(0, col);
        const y = HEADER_HEIGHT / 2;
        drawDisc(x, y, player, 0.7);
    }

    /* ── Drop animation ──────────────────────────────────── */

    function animateDrop(board, col, targetRow, player, onDone) {
        const { x } = cellCenter(0, col);
        const startY = HEADER_HEIGHT / 2;
        const { y: endY } = cellCenter(targetRow, col);
        const duration = 250 + targetRow * 40; // longer for lower rows
        const startTime = performance.now();

        // Temporarily clear the piece so we draw it via animation
        board[targetRow][col] = EMPTY;

        function frame(now) {
            const elapsed = now - startTime;
            let t = Math.min(elapsed / duration, 1);
            // Ease-in (gravity feel) with bounce
            t = easeOutBounce(t);
            const cy = startY + (endY - startY) * t;

            drawBoard(board);
            drawDisc(x, cy, player);

            if (elapsed < duration) {
                requestAnimationFrame(frame);
            } else {
                board[targetRow][col] = player;
                drawBoard(board);
                onDone();
            }
        }
        requestAnimationFrame(frame);
    }

    function easeOutBounce(t) {
        if (t < 1 / 2.75) {
            return 7.5625 * t * t;
        } else if (t < 2 / 2.75) {
            t -= 1.5 / 2.75;
            return 7.5625 * t * t + 0.75;
        } else if (t < 2.5 / 2.75) {
            t -= 2.25 / 2.75;
            return 7.5625 * t * t + 0.9375;
        } else {
            t -= 2.625 / 2.75;
            return 7.5625 * t * t + 0.984375;
        }
    }

    /* ── Win animation loop ──────────────────────────────── */

    let winAnimId = null;

    function startWinAnimation(board, cells) {
        winCells = cells;
        winPulse = 0;
        function loop() {
            drawBoard(board);
            winAnimId = requestAnimationFrame(loop);
        }
        loop();
    }

    function stopWinAnimation() {
        if (winAnimId) {
            cancelAnimationFrame(winAnimId);
            winAnimId = null;
        }
        winCells = null;
    }

    /* ── Public ───────────────────────────────────────────── */

    return {
        CELL_SIZE, WIDTH, HEIGHT,
        init,
        drawBoard,
        drawHoverDisc,
        animateDrop,
        startWinAnimation,
        stopWinAnimation,
        getColFromX,
        setHoverCol(c) { hoverCol = c; },
    };
})();
