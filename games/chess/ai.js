/* ============================================================
   Chess AI — Minimax with alpha-beta pruning + piece-square tables
   ============================================================ */
window.ChessAI = (function () {
    'use strict';

    const E = window.ChessEngine;
    const { PAWN, KNIGHT, BISHOP, ROOK, QUEEN, KING, WHITE, BLACK,
            pieceType, pieceColor, opponent,
            row, col, generateLegalMoves, makeMove, unmakeMove,
            isInCheck, cloneState, getGameStatus } = E;

    // ── Piece Values ─────────────────────────────────────────
    const PIECE_VALUES = {
        [PAWN]: 100, [KNIGHT]: 320, [BISHOP]: 330,
        [ROOK]: 500, [QUEEN]: 900, [KING]: 20000,
    };

    // ── Piece-Square Tables (from white's perspective, index 0 = a8) ──
    // These are mirrored for black
    const PST = {};

    PST[PAWN] = [
         0,  0,  0,  0,  0,  0,  0,  0,
        50, 50, 50, 50, 50, 50, 50, 50,
        10, 10, 20, 30, 30, 20, 10, 10,
         5,  5, 10, 25, 25, 10,  5,  5,
         0,  0,  0, 20, 20,  0,  0,  0,
         5, -5,-10,  0,  0,-10, -5,  5,
         5, 10, 10,-20,-20, 10, 10,  5,
         0,  0,  0,  0,  0,  0,  0,  0,
    ];

    PST[KNIGHT] = [
        -50,-40,-30,-30,-30,-30,-40,-50,
        -40,-20,  0,  0,  0,  0,-20,-40,
        -30,  0, 10, 15, 15, 10,  0,-30,
        -30,  5, 15, 20, 20, 15,  5,-30,
        -30,  0, 15, 20, 20, 15,  0,-30,
        -30,  5, 10, 15, 15, 10,  5,-30,
        -40,-20,  0,  5,  5,  0,-20,-40,
        -50,-40,-30,-30,-30,-30,-40,-50,
    ];

    PST[BISHOP] = [
        -20,-10,-10,-10,-10,-10,-10,-20,
        -10,  0,  0,  0,  0,  0,  0,-10,
        -10,  0,  5, 10, 10,  5,  0,-10,
        -10,  5,  5, 10, 10,  5,  5,-10,
        -10,  0, 10, 10, 10, 10,  0,-10,
        -10, 10, 10, 10, 10, 10, 10,-10,
        -10,  5,  0,  0,  0,  0,  5,-10,
        -20,-10,-10,-10,-10,-10,-10,-20,
    ];

    PST[ROOK] = [
         0,  0,  0,  0,  0,  0,  0,  0,
         5, 10, 10, 10, 10, 10, 10,  5,
        -5,  0,  0,  0,  0,  0,  0, -5,
        -5,  0,  0,  0,  0,  0,  0, -5,
        -5,  0,  0,  0,  0,  0,  0, -5,
        -5,  0,  0,  0,  0,  0,  0, -5,
        -5,  0,  0,  0,  0,  0,  0, -5,
         0,  0,  0,  5,  5,  0,  0,  0,
    ];

    PST[QUEEN] = [
        -20,-10,-10, -5, -5,-10,-10,-20,
        -10,  0,  0,  0,  0,  0,  0,-10,
        -10,  0,  5,  5,  5,  5,  0,-10,
         -5,  0,  5,  5,  5,  5,  0, -5,
          0,  0,  5,  5,  5,  5,  0, -5,
        -10,  5,  5,  5,  5,  5,  0,-10,
        -10,  0,  5,  0,  0,  0,  0,-10,
        -20,-10,-10, -5, -5,-10,-10,-20,
    ];

    PST[KING] = [
        -30,-40,-40,-50,-50,-40,-40,-30,
        -30,-40,-40,-50,-50,-40,-40,-30,
        -30,-40,-40,-50,-50,-40,-40,-30,
        -30,-40,-40,-50,-50,-40,-40,-30,
        -20,-30,-30,-40,-40,-30,-30,-20,
        -10,-20,-20,-20,-20,-20,-20,-10,
         20, 20,  0,  0,  0,  0, 20, 20,
         20, 30, 10,  0,  0, 10, 30, 20,
    ];

    const PST_KING_ENDGAME = [
        -50,-40,-30,-20,-20,-30,-40,-50,
        -30,-20,-10,  0,  0,-10,-20,-30,
        -30,-10, 20, 30, 30, 20,-10,-30,
        -30,-10, 30, 40, 40, 30,-10,-30,
        -30,-10, 30, 40, 40, 30,-10,-30,
        -30,-10, 20, 30, 30, 20,-10,-30,
        -30,-30,  0,  0,  0,  0,-30,-30,
        -50,-30,-30,-30,-30,-30,-30,-50,
    ];

    // Mirror index for black (flip vertically)
    function mirror(i) { return (7 - row(i)) * 8 + col(i); }

    // ── Evaluation ───────────────────────────────────────────

    function evaluate(state) {
        const board = state.board;
        let score = 0;
        let totalMaterial = 0;

        // Count material for endgame detection
        for (let i = 0; i < 64; i++) {
            if (!board[i]) continue;
            const pt = pieceType(board[i]);
            if (pt !== KING && pt !== PAWN) {
                totalMaterial += PIECE_VALUES[pt];
            }
        }
        const isEndgame = totalMaterial < 1400; // roughly 2 rooks or less per side

        for (let i = 0; i < 64; i++) {
            if (!board[i]) continue;
            const pc = pieceColor(board[i]);
            const pt = pieceType(board[i]);
            const sign = pc === WHITE ? 1 : -1;
            const pstIdx = pc === WHITE ? mirror(i) : i;

            let pstValue;
            if (pt === KING && isEndgame) {
                pstValue = PST_KING_ENDGAME[pstIdx];
            } else {
                pstValue = PST[pt][pstIdx];
            }

            score += sign * (PIECE_VALUES[pt] + pstValue);
        }

        // Mobility bonus (lightweight)
        const savedTurn = state.turn;
        state.turn = WHITE;
        const wMoves = generateLegalMoves(state).length;
        state.turn = BLACK;
        const bMoves = generateLegalMoves(state).length;
        state.turn = savedTurn;
        score += (wMoves - bMoves) * 3;

        return score;
    }

    // ── Move Ordering (improves alpha-beta pruning) ──────────

    function scoreMoveForOrdering(state, move) {
        let score = 0;
        const board = state.board;
        const captured = board[move.to];
        if (captured) {
            // MVV-LVA: capture high value piece with low value piece
            score += PIECE_VALUES[pieceType(captured)] * 10 - PIECE_VALUES[pieceType(board[move.from])];
        }
        if (move.promotion) score += PIECE_VALUES[move.promotion];
        if (move.enPassant) score += 100;
        return score;
    }

    function orderMoves(state, moves) {
        return moves.map(m => ({ move: m, score: scoreMoveForOrdering(state, m) }))
            .sort((a, b) => b.score - a.score)
            .map(x => x.move);
    }

    // ── Minimax with Alpha-Beta ──────────────────────────────

    let nodesSearched = 0;

    function minimax(state, depth, alpha, beta, maximizing) {
        nodesSearched++;

        if (depth === 0) return evaluate(state);

        const status = getGameStatus(state);
        if (status.over) {
            if (status.result === 'draw') return 0;
            if (status.result === 'white') return 99999 + depth;
            return -99999 - depth;
        }

        const moves = orderMoves(state, generateLegalMoves(state));

        if (maximizing) {
            let best = -Infinity;
            for (const move of moves) {
                makeMove(state, move);
                const val = minimax(state, depth - 1, alpha, beta, false);
                unmakeMove(state);
                best = Math.max(best, val);
                alpha = Math.max(alpha, val);
                if (beta <= alpha) break;
            }
            return best;
        } else {
            let best = Infinity;
            for (const move of moves) {
                makeMove(state, move);
                const val = minimax(state, depth - 1, alpha, beta, true);
                unmakeMove(state);
                best = Math.min(best, val);
                beta = Math.min(beta, val);
                if (beta <= alpha) break;
            }
            return best;
        }
    }

    // ── Public: Find Best Move ───────────────────────────────

    function findBestMove(state, depth) {
        depth = depth || 3;
        nodesSearched = 0;
        const isMaximizing = state.turn === WHITE;
        const moves = orderMoves(state, generateLegalMoves(state));
        if (moves.length === 0) return null;

        let bestMove = moves[0];
        let bestVal = isMaximizing ? -Infinity : Infinity;

        for (const move of moves) {
            makeMove(state, move);
            const val = minimax(state, depth - 1, -Infinity, Infinity, !isMaximizing);
            unmakeMove(state);

            if (isMaximizing) {
                if (val > bestVal) { bestVal = val; bestMove = move; }
            } else {
                if (val < bestVal) { bestVal = val; bestMove = move; }
            }
        }

        return { move: bestMove, eval: bestVal, nodes: nodesSearched };
    }

    return { findBestMove, evaluate, PIECE_VALUES };
})();
