/* Connect Four — Game Engine
   Board logic, win detection, undo, AI (minimax + alpha-beta pruning)
   No dependencies. */

'use strict';

window.ConnectFour = (() => {
    const ROWS = 6;
    const COLS = 7;
    const EMPTY = 0;
    const P1 = 1; // Red
    const P2 = 2; // Yellow

    /* ── Board helpers ────────────────────────────────────── */

    function createBoard() {
        const b = [];
        for (let r = 0; r < ROWS; r++) {
            b.push(new Array(COLS).fill(EMPTY));
        }
        return b;
    }

    function cloneBoard(board) {
        return board.map(row => row.slice());
    }

    /** Drop piece into column. Returns landing row or -1 if full. */
    function dropPiece(board, col, player) {
        for (let r = ROWS - 1; r >= 0; r--) {
            if (board[r][col] === EMPTY) {
                board[r][col] = player;
                return r;
            }
        }
        return -1;
    }

    function undoDrop(board, col) {
        for (let r = 0; r < ROWS; r++) {
            if (board[r][col] !== EMPTY) {
                board[r][col] = EMPTY;
                return r;
            }
        }
        return -1;
    }

    function isColumnFull(board, col) {
        return board[0][col] !== EMPTY;
    }

    function isBoardFull(board) {
        for (let c = 0; c < COLS; c++) {
            if (board[0][c] === EMPTY) return false;
        }
        return true;
    }

    function getValidColumns(board) {
        const cols = [];
        for (let c = 0; c < COLS; c++) {
            if (!isColumnFull(board, c)) cols.push(c);
        }
        return cols;
    }

    /* ── Win detection ────────────────────────────────────── */

    const DIRECTIONS = [
        [0, 1],   // horizontal
        [1, 0],   // vertical
        [1, 1],   // diagonal down-right
        [1, -1],  // diagonal down-left
    ];

    /**
     * Check if player has won. Returns winning cells array or null.
     * Each cell is [row, col].
     */
    function checkWin(board, player) {
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (board[r][c] !== player) continue;
                for (const [dr, dc] of DIRECTIONS) {
                    const cells = [[r, c]];
                    for (let i = 1; i < 4; i++) {
                        const nr = r + dr * i;
                        const nc = c + dc * i;
                        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) break;
                        if (board[nr][nc] !== player) break;
                        cells.push([nr, nc]);
                    }
                    if (cells.length === 4) return cells;
                }
            }
        }
        return null;
    }

    /* ── AI: Minimax with alpha-beta ─────────────────────── */

    // Positional weight table (center-column bias)
    const POS_WEIGHTS = [
        [3, 4,  5,  7,  5, 4, 3],
        [4, 6,  8, 10,  8, 6, 4],
        [5, 8, 11, 13, 11, 8, 5],
        [5, 8, 11, 13, 11, 8, 5],
        [4, 6,  8, 10,  8, 6, 4],
        [3, 4,  5,  7,  5, 4, 3],
    ];

    function evaluateWindow(window, player) {
        const opp = player === P1 ? P2 : P1;
        const mine = window.filter(v => v === player).length;
        const theirs = window.filter(v => v === opp).length;
        const empty = window.filter(v => v === EMPTY).length;

        if (mine === 4) return 100000;
        if (theirs === 4) return -100000;
        if (mine === 3 && empty === 1) return 50;
        if (theirs === 3 && empty === 1) return -40;
        if (mine === 2 && empty === 2) return 10;
        if (theirs === 2 && empty === 2) return -8;
        return 0;
    }

    function heuristic(board, player) {
        let score = 0;

        // Positional weighting
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (board[r][c] === player) score += POS_WEIGHTS[r][c];
                else if (board[r][c] !== EMPTY) score -= POS_WEIGHTS[r][c];
            }
        }

        // Evaluate all windows of 4
        // Horizontal
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c <= COLS - 4; c++) {
                const w = [board[r][c], board[r][c+1], board[r][c+2], board[r][c+3]];
                score += evaluateWindow(w, player);
            }
        }
        // Vertical
        for (let c = 0; c < COLS; c++) {
            for (let r = 0; r <= ROWS - 4; r++) {
                const w = [board[r][c], board[r+1][c], board[r+2][c], board[r+3][c]];
                score += evaluateWindow(w, player);
            }
        }
        // Diagonal down-right
        for (let r = 0; r <= ROWS - 4; r++) {
            for (let c = 0; c <= COLS - 4; c++) {
                const w = [board[r][c], board[r+1][c+1], board[r+2][c+2], board[r+3][c+3]];
                score += evaluateWindow(w, player);
            }
        }
        // Diagonal down-left
        for (let r = 0; r <= ROWS - 4; r++) {
            for (let c = 3; c < COLS; c++) {
                const w = [board[r][c], board[r+1][c-1], board[r+2][c-2], board[r+3][c-3]];
                score += evaluateWindow(w, player);
            }
        }

        return score;
    }

    function isTerminal(board) {
        return checkWin(board, P1) || checkWin(board, P2) || isBoardFull(board);
    }

    /**
     * Minimax with alpha-beta pruning.
     * Returns [bestCol, bestScore].
     */
    function minimax(board, depth, alpha, beta, maximizing, aiPlayer) {
        const opp = aiPlayer === P1 ? P2 : P1;

        if (depth === 0 || isTerminal(board)) {
            if (checkWin(board, aiPlayer)) return [-1, 1000000 + depth];
            if (checkWin(board, opp)) return [-1, -1000000 - depth];
            if (isBoardFull(board)) return [-1, 0];
            return [-1, heuristic(board, aiPlayer)];
        }

        const validCols = getValidColumns(board);
        // Evaluate center columns first for better pruning
        validCols.sort((a, b) => Math.abs(a - 3) - Math.abs(b - 3));

        if (maximizing) {
            let bestScore = -Infinity;
            let bestCol = validCols[0];
            for (const col of validCols) {
                dropPiece(board, col, aiPlayer);
                const [, score] = minimax(board, depth - 1, alpha, beta, false, aiPlayer);
                undoDrop(board, col);
                if (score > bestScore) {
                    bestScore = score;
                    bestCol = col;
                }
                alpha = Math.max(alpha, score);
                if (alpha >= beta) break;
            }
            return [bestCol, bestScore];
        } else {
            let bestScore = Infinity;
            let bestCol = validCols[0];
            for (const col of validCols) {
                dropPiece(board, col, opp);
                const [, score] = minimax(board, depth - 1, alpha, beta, true, aiPlayer);
                undoDrop(board, col);
                if (score < bestScore) {
                    bestScore = score;
                    bestCol = col;
                }
                beta = Math.min(beta, score);
                if (alpha >= beta) break;
            }
            return [bestCol, bestScore];
        }
    }

    /** AI difficulties */
    const DIFFICULTY = {
        easy:   { depth: 2, name: 'Easy' },
        medium: { depth: 5, name: 'Medium' },
        hard:   { depth: 8, name: 'Hard' },
    };

    function getAIMove(board, aiPlayer, difficulty) {
        const d = DIFFICULTY[difficulty] || DIFFICULTY.medium;

        // Check for immediate win
        const validCols = getValidColumns(board);
        for (const col of validCols) {
            const b2 = cloneBoard(board);
            dropPiece(b2, col, aiPlayer);
            if (checkWin(b2, aiPlayer)) return col;
        }

        // Check for immediate block
        const opp = aiPlayer === P1 ? P2 : P1;
        for (const col of validCols) {
            const b2 = cloneBoard(board);
            dropPiece(b2, col, opp);
            if (checkWin(b2, opp)) return col;
        }

        const [bestCol] = minimax(cloneBoard(board), d.depth, -Infinity, Infinity, true, aiPlayer);
        return bestCol;
    }

    /* ── Public API ───────────────────────────────────────── */

    return {
        ROWS, COLS, EMPTY, P1, P2,
        createBoard,
        cloneBoard,
        dropPiece,
        undoDrop,
        isColumnFull,
        isBoardFull,
        getValidColumns,
        checkWin,
        getAIMove,
        DIFFICULTY,
    };
})();
