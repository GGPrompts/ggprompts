/* ============================================================
   Chess Engine — full rules, move generation, validation
   ============================================================ */
window.ChessEngine = (function () {
    'use strict';

    // Piece constants
    const EMPTY = 0;
    const PAWN = 1, KNIGHT = 2, BISHOP = 3, ROOK = 4, QUEEN = 5, KING = 6;
    const WHITE = 8, BLACK = 16;
    const PIECE_MASK = 7, COLOR_MASK = 24;

    const PIECE_CHARS = { 1: 'P', 2: 'N', 3: 'B', 4: 'R', 5: 'Q', 6: 'K' };
    const UNICODE_PIECES = {
        [WHITE | KING]: '\u2654', [WHITE | QUEEN]: '\u2655', [WHITE | ROOK]: '\u2656',
        [WHITE | BISHOP]: '\u2657', [WHITE | KNIGHT]: '\u2658', [WHITE | PAWN]: '\u2659',
        [BLACK | KING]: '\u265A', [BLACK | QUEEN]: '\u265B', [BLACK | ROOK]: '\u265C',
        [BLACK | BISHOP]: '\u265D', [BLACK | KNIGHT]: '\u265E', [BLACK | PAWN]: '\u265F',
    };

    const FILES = 'abcdefgh';

    function pieceType(p) { return p & PIECE_MASK; }
    function pieceColor(p) { return p & COLOR_MASK; }
    function opponent(color) { return color === WHITE ? BLACK : WHITE; }
    function coordToAlg(r, c) { return FILES[c] + (8 - r); }
    function algToCoord(s) { return [8 - parseInt(s[1]), FILES.indexOf(s[0])]; }

    // ── Board State ──────────────────────────────────────────
    function createInitialBoard() {
        const b = new Array(64).fill(EMPTY);
        const backRank = [ROOK, KNIGHT, BISHOP, QUEEN, KING, BISHOP, KNIGHT, ROOK];
        for (let c = 0; c < 8; c++) {
            b[c] = BLACK | backRank[c];
            b[8 + c] = BLACK | PAWN;
            b[48 + c] = WHITE | PAWN;
            b[56 + c] = WHITE | backRank[c];
        }
        return b;
    }

    function createState() {
        return {
            board: createInitialBoard(),
            turn: WHITE,
            castling: { wk: true, wq: true, bk: true, bq: true },
            enPassant: null,   // target square index or null
            halfMoveClock: 0,
            fullMoveNumber: 1,
            history: [],       // array of move records for undo
        };
    }

    function cloneState(s) {
        return {
            board: s.board.slice(),
            turn: s.turn,
            castling: { ...s.castling },
            enPassant: s.enPassant,
            halfMoveClock: s.halfMoveClock,
            fullMoveNumber: s.fullMoveNumber,
            history: s.history.map(h => ({ ...h, castling: { ...h.castling } })),
        };
    }

    function idx(r, c) { return r * 8 + c; }
    function row(i) { return (i >> 3); }
    function col(i) { return i & 7; }
    function onBoard(r, c) { return r >= 0 && r < 8 && c >= 0 && c < 8; }
    function at(board, r, c) { return board[idx(r, c)]; }

    // ── Move Generation ──────────────────────────────────────

    const KNIGHT_OFFSETS = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
    const BISHOP_DIRS = [[-1,-1],[-1,1],[1,-1],[1,1]];
    const ROOK_DIRS = [[-1,0],[1,0],[0,-1],[0,1]];
    const QUEEN_DIRS = [...BISHOP_DIRS, ...ROOK_DIRS];
    const KING_OFFSETS = QUEEN_DIRS;

    function generatePseudoLegalMoves(state) {
        const moves = [];
        const { board, turn, castling, enPassant } = state;
        const opp = opponent(turn);

        for (let i = 0; i < 64; i++) {
            const p = board[i];
            if (!p || pieceColor(p) !== turn) continue;
            const r = row(i), c = col(i);
            const pt = pieceType(p);

            if (pt === PAWN) {
                const dir = turn === WHITE ? -1 : 1;
                const startRank = turn === WHITE ? 6 : 1;
                const promoRank = turn === WHITE ? 0 : 7;
                // Forward 1
                const fr = r + dir;
                if (onBoard(fr, c) && !board[idx(fr, c)]) {
                    if (fr === promoRank) {
                        for (const pp of [QUEEN, ROOK, BISHOP, KNIGHT])
                            moves.push({ from: i, to: idx(fr, c), promotion: pp });
                    } else {
                        moves.push({ from: i, to: idx(fr, c) });
                    }
                    // Forward 2 from start
                    if (r === startRank) {
                        const fr2 = r + dir * 2;
                        if (!board[idx(fr2, c)])
                            moves.push({ from: i, to: idx(fr2, c) });
                    }
                }
                // Captures
                for (const dc of [-1, 1]) {
                    const nc = c + dc;
                    if (!onBoard(fr, nc)) continue;
                    const target = board[idx(fr, nc)];
                    if (target && pieceColor(target) === opp) {
                        if (fr === promoRank) {
                            for (const pp of [QUEEN, ROOK, BISHOP, KNIGHT])
                                moves.push({ from: i, to: idx(fr, nc), promotion: pp });
                        } else {
                            moves.push({ from: i, to: idx(fr, nc) });
                        }
                    }
                    // En passant
                    if (enPassant === idx(fr, nc)) {
                        moves.push({ from: i, to: idx(fr, nc), enPassant: true });
                    }
                }
            }
            else if (pt === KNIGHT) {
                for (const [dr, dc] of KNIGHT_OFFSETS) {
                    const nr = r + dr, nc = c + dc;
                    if (!onBoard(nr, nc)) continue;
                    const t = board[idx(nr, nc)];
                    if (!t || pieceColor(t) === opp)
                        moves.push({ from: i, to: idx(nr, nc) });
                }
            }
            else if (pt === BISHOP || pt === ROOK || pt === QUEEN) {
                const dirs = pt === BISHOP ? BISHOP_DIRS : pt === ROOK ? ROOK_DIRS : QUEEN_DIRS;
                for (const [dr, dc] of dirs) {
                    let nr = r + dr, nc = c + dc;
                    while (onBoard(nr, nc)) {
                        const t = board[idx(nr, nc)];
                        if (t) {
                            if (pieceColor(t) === opp) moves.push({ from: i, to: idx(nr, nc) });
                            break;
                        }
                        moves.push({ from: i, to: idx(nr, nc) });
                        nr += dr; nc += dc;
                    }
                }
            }
            else if (pt === KING) {
                for (const [dr, dc] of KING_OFFSETS) {
                    const nr = r + dr, nc = c + dc;
                    if (!onBoard(nr, nc)) continue;
                    const t = board[idx(nr, nc)];
                    if (!t || pieceColor(t) === opp)
                        moves.push({ from: i, to: idx(nr, nc) });
                }
                // Castling
                if (turn === WHITE) {
                    if (castling.wk && board[61] === EMPTY && board[62] === EMPTY &&
                        pieceType(board[63]) === ROOK && pieceColor(board[63]) === WHITE)
                        moves.push({ from: i, to: 62, castle: 'K' });
                    if (castling.wq && board[59] === EMPTY && board[58] === EMPTY && board[57] === EMPTY &&
                        pieceType(board[56]) === ROOK && pieceColor(board[56]) === WHITE)
                        moves.push({ from: i, to: 58, castle: 'Q' });
                } else {
                    if (castling.bk && board[5] === EMPTY && board[6] === EMPTY &&
                        pieceType(board[7]) === ROOK && pieceColor(board[7]) === BLACK)
                        moves.push({ from: i, to: 6, castle: 'k' });
                    if (castling.bq && board[3] === EMPTY && board[2] === EMPTY && board[1] === EMPTY &&
                        pieceType(board[0]) === ROOK && pieceColor(board[0]) === BLACK)
                        moves.push({ from: i, to: 2, castle: 'q' });
                }
            }
        }
        return moves;
    }

    // ── Attack Detection ─────────────────────────────────────

    function isSquareAttackedBy(board, sq, byColor) {
        const r = row(sq), c = col(sq);
        // Knight attacks
        for (const [dr, dc] of KNIGHT_OFFSETS) {
            const nr = r + dr, nc = c + dc;
            if (onBoard(nr, nc)) {
                const p = board[idx(nr, nc)];
                if (p && pieceColor(p) === byColor && pieceType(p) === KNIGHT) return true;
            }
        }
        // Pawn attacks
        const pawnDir = byColor === WHITE ? 1 : -1; // pawns of byColor attack towards us
        for (const dc of [-1, 1]) {
            const pr = r + pawnDir, pc = c + dc;
            if (onBoard(pr, pc)) {
                const p = board[idx(pr, pc)];
                if (p && pieceColor(p) === byColor && pieceType(p) === PAWN) return true;
            }
        }
        // King attacks
        for (const [dr, dc] of KING_OFFSETS) {
            const nr = r + dr, nc = c + dc;
            if (onBoard(nr, nc)) {
                const p = board[idx(nr, nc)];
                if (p && pieceColor(p) === byColor && pieceType(p) === KING) return true;
            }
        }
        // Sliding pieces (bishop/rook/queen)
        for (const [dr, dc] of QUEEN_DIRS) {
            let nr = r + dr, nc = c + dc;
            while (onBoard(nr, nc)) {
                const p = board[idx(nr, nc)];
                if (p) {
                    if (pieceColor(p) === byColor) {
                        const pt = pieceType(p);
                        const isDiag = dr !== 0 && dc !== 0;
                        if (pt === QUEEN) return true;
                        if (isDiag && pt === BISHOP) return true;
                        if (!isDiag && pt === ROOK) return true;
                    }
                    break;
                }
                nr += dr; nc += dc;
            }
        }
        return false;
    }

    function findKing(board, color) {
        for (let i = 0; i < 64; i++) {
            if (board[i] === (color | KING)) return i;
        }
        return -1;
    }

    function isInCheck(board, color) {
        const kSq = findKing(board, color);
        return kSq >= 0 && isSquareAttackedBy(board, kSq, opponent(color));
    }

    // ── Legal Move Generation ────────────────────────────────

    function isLegalMove(state, move) {
        const { board, turn } = state;
        const testBoard = board.slice();

        // Handle castling — king must not be in check, pass through check, or land in check
        if (move.castle) {
            const opp = opponent(turn);
            const kingSq = move.from;
            if (isSquareAttackedBy(board, kingSq, opp)) return false;
            if (move.castle === 'K' || move.castle === 'k') {
                if (isSquareAttackedBy(board, kingSq + 1, opp)) return false;
                if (isSquareAttackedBy(board, kingSq + 2, opp)) return false;
            } else {
                if (isSquareAttackedBy(board, kingSq - 1, opp)) return false;
                if (isSquareAttackedBy(board, kingSq - 2, opp)) return false;
            }
        }

        // Apply move on test board
        applyMoveToBoard(testBoard, move, turn);
        return !isInCheck(testBoard, turn);
    }

    function applyMoveToBoard(board, move, turn) {
        const p = board[move.from];
        board[move.to] = move.promotion ? (turn | move.promotion) : p;
        board[move.from] = EMPTY;
        // En passant capture
        if (move.enPassant) {
            const capRow = turn === WHITE ? row(move.to) + 1 : row(move.to) - 1;
            board[idx(capRow, col(move.to))] = EMPTY;
        }
        // Castling rook move
        if (move.castle) {
            if (move.castle === 'K') { board[61] = board[63]; board[63] = EMPTY; }
            if (move.castle === 'Q') { board[59] = board[56]; board[56] = EMPTY; }
            if (move.castle === 'k') { board[5] = board[7]; board[7] = EMPTY; }
            if (move.castle === 'q') { board[3] = board[0]; board[0] = EMPTY; }
        }
    }

    function generateLegalMoves(state) {
        return generatePseudoLegalMoves(state).filter(m => isLegalMove(state, m));
    }

    // ── Make / Unmake Move ───────────────────────────────────

    function makeMove(state, move) {
        const record = {
            from: move.from,
            to: move.to,
            captured: state.board[move.to],
            promotion: move.promotion || null,
            enPassant: move.enPassant || false,
            castle: move.castle || null,
            prevEnPassant: state.enPassant,
            castling: { ...state.castling },
            halfMoveClock: state.halfMoveClock,
            notation: '',   // filled in below
            epCaptured: null,
        };

        const p = state.board[move.from];
        const pt = pieceType(p);

        // En passant captured pawn
        if (move.enPassant) {
            const capRow = state.turn === WHITE ? row(move.to) + 1 : row(move.to) - 1;
            const capIdx = idx(capRow, col(move.to));
            record.epCaptured = state.board[capIdx];
            state.board[capIdx] = EMPTY;
        }

        // Apply to board
        state.board[move.to] = move.promotion ? (state.turn | move.promotion) : p;
        state.board[move.from] = EMPTY;

        // Castling rook move
        if (move.castle) {
            if (move.castle === 'K') { state.board[61] = state.board[63]; state.board[63] = EMPTY; }
            if (move.castle === 'Q') { state.board[59] = state.board[56]; state.board[56] = EMPTY; }
            if (move.castle === 'k') { state.board[5] = state.board[7]; state.board[7] = EMPTY; }
            if (move.castle === 'q') { state.board[3] = state.board[0]; state.board[0] = EMPTY; }
        }

        // Update en passant square
        if (pt === PAWN && Math.abs(row(move.from) - row(move.to)) === 2) {
            state.enPassant = idx((row(move.from) + row(move.to)) / 2, col(move.from));
        } else {
            state.enPassant = null;
        }

        // Update castling rights
        if (pt === KING) {
            if (state.turn === WHITE) { state.castling.wk = false; state.castling.wq = false; }
            else { state.castling.bk = false; state.castling.bq = false; }
        }
        if (move.from === 56 || move.to === 56) state.castling.wq = false;
        if (move.from === 63 || move.to === 63) state.castling.wk = false;
        if (move.from === 0 || move.to === 0) state.castling.bq = false;
        if (move.from === 7 || move.to === 7) state.castling.bk = false;

        // Half-move clock
        if (pt === PAWN || record.captured || move.enPassant) {
            state.halfMoveClock = 0;
        } else {
            state.halfMoveClock++;
        }

        // Build algebraic notation
        record.notation = buildNotation(state, move, record, p);

        if (state.turn === BLACK) state.fullMoveNumber++;
        state.turn = opponent(state.turn);
        state.history.push(record);

        return record;
    }

    function unmakeMove(state) {
        if (!state.history.length) return null;
        const record = state.history.pop();

        state.turn = opponent(state.turn);
        if (state.turn === BLACK) state.fullMoveNumber--;

        state.enPassant = record.prevEnPassant;
        state.castling = { ...record.castling };
        state.halfMoveClock = record.halfMoveClock;

        const p = state.board[record.to];
        // Undo promotion
        const origPiece = record.promotion ? (state.turn | PAWN) : p;
        state.board[record.from] = origPiece;
        state.board[record.to] = record.captured;

        // Undo en passant capture
        if (record.enPassant && record.epCaptured !== null) {
            const capRow = state.turn === WHITE ? row(record.to) + 1 : row(record.to) - 1;
            state.board[idx(capRow, col(record.to))] = record.epCaptured;
            state.board[record.to] = EMPTY; // the ep square was empty
        }

        // Undo castling
        if (record.castle) {
            if (record.castle === 'K') { state.board[63] = state.board[61]; state.board[61] = EMPTY; }
            if (record.castle === 'Q') { state.board[56] = state.board[59]; state.board[59] = EMPTY; }
            if (record.castle === 'k') { state.board[7] = state.board[5]; state.board[5] = EMPTY; }
            if (record.castle === 'q') { state.board[0] = state.board[3]; state.board[3] = EMPTY; }
        }

        return record;
    }

    // ── Algebraic Notation ───────────────────────────────────

    function buildNotation(state, move, record, piece) {
        if (move.castle) return move.castle === 'K' || move.castle === 'k' ? 'O-O' : 'O-O-O';

        const pt = pieceType(piece);
        let nota = '';
        const isCapture = record.captured || move.enPassant;

        if (pt === PAWN) {
            if (isCapture) nota += FILES[col(move.from)];
        } else {
            nota += PIECE_CHARS[pt];
            // Disambiguation
            const others = generatePseudoLegalMoves(state).filter(m =>
                m.to === move.to && m.from !== move.from &&
                state.board[m.from] === piece && isLegalMove(state, m)
            );
            if (others.length) {
                const sameFile = others.some(m => col(m.from) === col(move.from));
                const sameRank = others.some(m => row(m.from) === row(move.from));
                if (!sameFile) nota += FILES[col(move.from)];
                else if (!sameRank) nota += (8 - row(move.from));
                else nota += coordToAlg(row(move.from), col(move.from));
            }
        }

        if (isCapture) nota += 'x';
        nota += coordToAlg(row(move.to), col(move.to));

        if (move.promotion) nota += '=' + PIECE_CHARS[move.promotion];

        // Check / checkmate markers added after move is applied
        const oppColor = state.turn; // state.turn hasn't flipped yet when we call this before the turn flip
        // Actually we need to check the board as-is (move already applied to board)
        const opp = opponent(state.turn);
        if (isInCheck(state.board, opp)) {
            const oppMoves = generateLegalMovesForColor(state, opp);
            nota += oppMoves.length === 0 ? '#' : '+';
        }

        return nota;
    }

    // Helper: generate legal moves for a specific color without changing state.turn
    function generateLegalMovesForColor(state, color) {
        const saved = state.turn;
        state.turn = color;
        const moves = generateLegalMoves(state);
        state.turn = saved;
        return moves;
    }

    // ── Game Status ──────────────────────────────────────────

    function getGameStatus(state) {
        const legal = generateLegalMoves(state);
        if (legal.length === 0) {
            if (isInCheck(state.board, state.turn)) {
                return { over: true, result: state.turn === WHITE ? 'black' : 'white', reason: 'checkmate' };
            }
            return { over: true, result: 'draw', reason: 'stalemate' };
        }
        if (state.halfMoveClock >= 100) {
            return { over: true, result: 'draw', reason: '50-move rule' };
        }
        if (isInsufficientMaterial(state.board)) {
            return { over: true, result: 'draw', reason: 'insufficient material' };
        }
        if (isThreefoldRepetition(state)) {
            return { over: true, result: 'draw', reason: 'threefold repetition' };
        }
        return { over: false, inCheck: isInCheck(state.board, state.turn) };
    }

    function isInsufficientMaterial(board) {
        const pieces = { w: [], b: [] };
        for (let i = 0; i < 64; i++) {
            if (!board[i]) continue;
            const color = pieceColor(board[i]) === WHITE ? 'w' : 'b';
            const pt = pieceType(board[i]);
            if (pt !== KING) pieces[color].push({ type: pt, sq: i });
        }
        // K vs K
        if (pieces.w.length === 0 && pieces.b.length === 0) return true;
        // K+B vs K or K+N vs K
        if (pieces.w.length === 0 && pieces.b.length === 1 &&
            (pieces.b[0].type === BISHOP || pieces.b[0].type === KNIGHT)) return true;
        if (pieces.b.length === 0 && pieces.w.length === 1 &&
            (pieces.w[0].type === BISHOP || pieces.w[0].type === KNIGHT)) return true;
        // K+B vs K+B same color bishops
        if (pieces.w.length === 1 && pieces.b.length === 1 &&
            pieces.w[0].type === BISHOP && pieces.b[0].type === BISHOP) {
            const wSq = pieces.w[0].sq, bSq = pieces.b[0].sq;
            if ((row(wSq) + col(wSq)) % 2 === (row(bSq) + col(bSq)) % 2) return true;
        }
        return false;
    }

    function boardHash(board) {
        return board.join(',');
    }

    function isThreefoldRepetition(state) {
        // Simple approach: compare current board to historical positions
        const current = boardHash(state.board);
        let count = 1;
        const tempState = cloneState(state);
        for (let i = state.history.length - 1; i >= 0; i--) {
            unmakeMove(tempState);
            if (boardHash(tempState.board) === current) {
                count++;
                if (count >= 3) return true;
            }
        }
        return false;
    }

    // ── Public API ───────────────────────────────────────────

    return {
        EMPTY, PAWN, KNIGHT, BISHOP, ROOK, QUEEN, KING,
        WHITE, BLACK, PIECE_MASK, COLOR_MASK,
        UNICODE_PIECES, FILES, PIECE_CHARS,
        pieceType, pieceColor, opponent,
        row, col, idx, coordToAlg, algToCoord, onBoard,
        createState, cloneState,
        generateLegalMoves, isInCheck, isSquareAttackedBy, findKing,
        makeMove, unmakeMove,
        getGameStatus,
        applyMoveToBoard,
        generatePseudoLegalMoves,
        isLegalMove,
    };
})();
