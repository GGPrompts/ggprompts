/**
 * Sudoku Game Engine
 * State management, undo/redo, notes, error checking, timer, auto-save.
 * Depends on: generator.js (window.SudokuGenerator)
 * Exports: window.SudokuEngine
 */
(function () {
    'use strict';

    const SAVE_KEY = 'sudoku-save-v1';

    /* ---------- state ---------- */

    let state = null;

    function createState(data) {
        return {
            puzzle:     data.puzzle,           // original clues (0 = blank)
            solution:   data.solution,         // full solution
            board:      SudokuGenerator.copyGrid(data.puzzle), // player's current board
            notes:      createNotes(),         // 9x9 array of Set<number>
            difficulty: data.difficulty,
            label:      data.label,
            clues:      data.clues,
            selected:   null,                  // {row, col} or null
            notesMode:  false,
            errors:     new Set(),             // "r,c" strings
            timer:      0,                     // seconds
            timerRunning: false,
            undoStack:  [],
            redoStack:  [],
            completed:  false
        };
    }

    function createNotes() {
        const n = [];
        for (let r = 0; r < 9; r++) {
            n.push([]);
            for (let c = 0; c < 9; c++) {
                n[r].push(new Set());
            }
        }
        return n;
    }

    /* ---------- game actions ---------- */

    function newGame(difficulty) {
        const data = SudokuGenerator.generate(difficulty);
        state = createState(data);
        state.timerRunning = true;
        save();
        notify();
    }

    function select(row, col) {
        if (!state) return;
        state.selected = { row: row, col: col };
        notify();
    }

    function deselect() {
        if (!state) return;
        state.selected = null;
        notify();
    }

    function isClue(row, col) {
        return state && state.puzzle[row][col] !== 0;
    }

    /* ---------- input ---------- */

    function enterNumber(num) {
        if (!state || !state.selected || state.completed) return;
        const { row, col } = state.selected;
        if (isClue(row, col)) return;

        if (state.notesMode) {
            _pushUndo(row, col);
            const notes = state.notes[row][col];
            if (notes.has(num)) {
                notes.delete(num);
            } else {
                notes.add(num);
            }
            // Clear cell value when entering notes
            state.board[row][col] = 0;
        } else {
            _pushUndo(row, col);
            // Toggle: if same number, erase it
            if (state.board[row][col] === num) {
                state.board[row][col] = 0;
            } else {
                state.board[row][col] = num;
                state.notes[row][col].clear();
                // Remove this number from notes in same row/col/box
                _clearRelatedNotes(row, col, num);
            }
        }

        state.redoStack = [];
        _checkErrors();
        _checkCompletion();
        save();
        notify();
    }

    function eraseCell() {
        if (!state || !state.selected || state.completed) return;
        const { row, col } = state.selected;
        if (isClue(row, col)) return;
        _pushUndo(row, col);
        state.board[row][col] = 0;
        state.notes[row][col].clear();
        state.redoStack = [];
        _checkErrors();
        save();
        notify();
    }

    function toggleNotesMode() {
        if (!state) return;
        state.notesMode = !state.notesMode;
        notify();
    }

    /* ---------- related notes removal ---------- */

    function _clearRelatedNotes(row, col, num) {
        // Row
        for (let c = 0; c < 9; c++) state.notes[row][c].delete(num);
        // Column
        for (let r = 0; r < 9; r++) state.notes[r][col].delete(num);
        // Box
        const br = Math.floor(row / 3) * 3;
        const bc = Math.floor(col / 3) * 3;
        for (let r = br; r < br + 3; r++) {
            for (let c = bc; c < bc + 3; c++) {
                state.notes[r][c].delete(num);
            }
        }
    }

    /* ---------- undo / redo ---------- */

    function _pushUndo(row, col) {
        state.undoStack.push({
            row: row,
            col: col,
            value: state.board[row][col],
            notes: new Set(state.notes[row][col])
        });
        if (state.undoStack.length > 200) state.undoStack.shift();
    }

    function undo() {
        if (!state || state.undoStack.length === 0) return;
        const action = state.undoStack.pop();
        // Save current for redo
        state.redoStack.push({
            row: action.row,
            col: action.col,
            value: state.board[action.row][action.col],
            notes: new Set(state.notes[action.row][action.col])
        });
        state.board[action.row][action.col] = action.value;
        state.notes[action.row][action.col] = action.notes;
        _checkErrors();
        save();
        notify();
    }

    function redo() {
        if (!state || state.redoStack.length === 0) return;
        const action = state.redoStack.pop();
        state.undoStack.push({
            row: action.row,
            col: action.col,
            value: state.board[action.row][action.col],
            notes: new Set(state.notes[action.row][action.col])
        });
        state.board[action.row][action.col] = action.value;
        state.notes[action.row][action.col] = action.notes;
        _checkErrors();
        save();
        notify();
    }

    /* ---------- error checking ---------- */

    function _checkErrors() {
        state.errors.clear();
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const v = state.board[r][c];
                if (v === 0) continue;
                if (v !== state.solution[r][c]) {
                    state.errors.add(r + ',' + c);
                }
            }
        }
    }

    function hasError(row, col) {
        return state ? state.errors.has(row + ',' + col) : false;
    }

    /* ---------- completion ---------- */

    function _checkCompletion() {
        if (!state) return;
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (state.board[r][c] !== state.solution[r][c]) return;
            }
        }
        state.completed = true;
        state.timerRunning = false;
    }

    /* ---------- highlighting ---------- */

    function getHighlight(row, col) {
        if (!state || !state.selected) return '';
        const sel = state.selected;
        const sameCell = sel.row === row && sel.col === col;
        if (sameCell) return 'selected';

        const sameRow = sel.row === row;
        const sameCol = sel.col === col;
        const sameBox =
            Math.floor(sel.row / 3) === Math.floor(row / 3) &&
            Math.floor(sel.col / 3) === Math.floor(col / 3);

        const selVal = state.board[sel.row][sel.col];
        const cellVal = state.board[row][col];
        const sameNum = selVal !== 0 && cellVal === selVal;

        if (sameNum) return 'same-number';
        if (sameRow || sameCol || sameBox) return 'related';
        return '';
    }

    /* ---------- number counts (for completion indicators) ---------- */

    function getNumberCounts() {
        const counts = {};
        for (let n = 1; n <= 9; n++) counts[n] = 0;
        if (!state) return counts;
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const v = state.board[r][c];
                if (v > 0) counts[v]++;
            }
        }
        return counts;
    }

    /* ---------- timer ---------- */

    let timerInterval = null;

    function startTimer() {
        if (timerInterval) return;
        timerInterval = setInterval(function () {
            if (state && state.timerRunning) {
                state.timer++;
                notifyTimer();
            }
        }, 1000);
    }

    function pauseTimer() {
        if (state) state.timerRunning = false;
    }

    function resumeTimer() {
        if (state && !state.completed) state.timerRunning = true;
    }

    function formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return m + ':' + (s < 10 ? '0' : '') + s;
    }

    /* ---------- save / load ---------- */

    function save() {
        if (!state) return;
        try {
            const data = {
                puzzle: state.puzzle,
                solution: state.solution,
                board: state.board,
                notes: state.notes.map(row =>
                    row.map(set => Array.from(set))
                ),
                difficulty: state.difficulty,
                label: state.label,
                clues: state.clues,
                timer: state.timer,
                notesMode: state.notesMode,
                completed: state.completed
            };
            localStorage.setItem(SAVE_KEY, JSON.stringify(data));
        } catch (e) { /* quota exceeded, ignore */ }
    }

    function load() {
        try {
            const raw = localStorage.getItem(SAVE_KEY);
            if (!raw) return false;
            const data = JSON.parse(raw);
            state = createState(data);
            state.board = data.board;
            state.timer = data.timer || 0;
            state.notesMode = data.notesMode || false;
            state.completed = data.completed || false;
            state.timerRunning = !state.completed;
            // Restore notes
            for (let r = 0; r < 9; r++) {
                for (let c = 0; c < 9; c++) {
                    state.notes[r][c] = new Set(data.notes[r][c]);
                }
            }
            _checkErrors();
            return true;
        } catch (e) {
            return false;
        }
    }

    function clearSave() {
        localStorage.removeItem(SAVE_KEY);
    }

    /* ---------- event system ---------- */

    let _listeners = [];
    let _timerListeners = [];

    function on(fn) { _listeners.push(fn); }
    function onTimer(fn) { _timerListeners.push(fn); }
    function notify() { _listeners.forEach(function (fn) { fn(state); }); }
    function notifyTimer() { _timerListeners.forEach(function (fn) { fn(state); }); }

    /* ---------- public API ---------- */

    window.SudokuEngine = {
        newGame: newGame,
        select: select,
        deselect: deselect,
        enterNumber: enterNumber,
        eraseCell: eraseCell,
        toggleNotesMode: toggleNotesMode,
        undo: undo,
        redo: redo,
        isClue: isClue,
        hasError: hasError,
        getHighlight: getHighlight,
        getNumberCounts: getNumberCounts,
        getState: function () { return state; },
        startTimer: startTimer,
        pauseTimer: pauseTimer,
        resumeTimer: resumeTimer,
        formatTime: formatTime,
        save: save,
        load: load,
        clearSave: clearSave,
        on: on,
        onTimer: onTimer
    };
})();
