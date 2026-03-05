/**
 * Sudoku Puzzle Generator
 * Backtracking solver + puzzle generation with difficulty levels.
 * Exports: window.SudokuGenerator
 */
(function () {
    'use strict';

    /* ---------- helpers ---------- */

    function createEmptyGrid() {
        const g = [];
        for (let i = 0; i < 9; i++) g.push(new Array(9).fill(0));
        return g;
    }

    function copyGrid(g) {
        return g.map(r => r.slice());
    }

    function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    /* ---------- validation ---------- */

    function isValid(grid, row, col, num) {
        for (let c = 0; c < 9; c++) {
            if (grid[row][c] === num) return false;
        }
        for (let r = 0; r < 9; r++) {
            if (grid[r][col] === num) return false;
        }
        const br = Math.floor(row / 3) * 3;
        const bc = Math.floor(col / 3) * 3;
        for (let r = br; r < br + 3; r++) {
            for (let c = bc; c < bc + 3; c++) {
                if (grid[r][c] === num) return false;
            }
        }
        return true;
    }

    /* ---------- solver (backtracking) ---------- */

    function findEmpty(grid) {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (grid[r][c] === 0) return [r, c];
            }
        }
        return null;
    }

    function solve(grid) {
        const cell = findEmpty(grid);
        if (!cell) return true;
        const [r, c] = cell;
        for (let n = 1; n <= 9; n++) {
            if (isValid(grid, r, c, n)) {
                grid[r][c] = n;
                if (solve(grid)) return true;
                grid[r][c] = 0;
            }
        }
        return false;
    }

    /** Count solutions (stops at 2 to check uniqueness). */
    function countSolutions(grid, limit) {
        limit = limit || 2;
        let count = 0;
        function _solve(g) {
            if (count >= limit) return;
            const cell = findEmpty(g);
            if (!cell) { count++; return; }
            const [r, c] = cell;
            for (let n = 1; n <= 9; n++) {
                if (isValid(g, r, c, n)) {
                    g[r][c] = n;
                    _solve(g);
                    g[r][c] = 0;
                }
            }
        }
        _solve(grid);
        return count;
    }

    /* ---------- generate filled board ---------- */

    function generateFilled() {
        const grid = createEmptyGrid();
        function _fill(pos) {
            if (pos === 81) return true;
            const r = Math.floor(pos / 9);
            const c = pos % 9;
            const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
            for (const n of nums) {
                if (isValid(grid, r, c, n)) {
                    grid[r][c] = n;
                    if (_fill(pos + 1)) return true;
                    grid[r][c] = 0;
                }
            }
            return false;
        }
        _fill(0);
        return grid;
    }

    /* ---------- difficulty ---------- */

    /**
     * Difficulty presets: how many cells to remove.
     * Easy ~36 removed, Medium ~46, Hard ~52, Expert ~56
     */
    const DIFFICULTY = {
        easy:   { remove: 36, label: 'Easy' },
        medium: { remove: 46, label: 'Medium' },
        hard:   { remove: 52, label: 'Hard' },
        expert: { remove: 56, label: 'Expert' }
    };

    /* ---------- create puzzle ---------- */

    function generatePuzzle(difficulty) {
        difficulty = difficulty || 'medium';
        const solution = generateFilled();
        const puzzle = copyGrid(solution);
        const target = DIFFICULTY[difficulty].remove;

        // Build list of all cell positions, shuffled
        const positions = shuffle(
            Array.from({ length: 81 }, (_, i) => [Math.floor(i / 9), i % 9])
        );

        let removed = 0;
        for (const [r, c] of positions) {
            if (removed >= target) break;
            const backup = puzzle[r][c];
            puzzle[r][c] = 0;

            // Ensure unique solution
            if (countSolutions(copyGrid(puzzle), 2) === 1) {
                removed++;
            } else {
                puzzle[r][c] = backup;
            }
        }

        return {
            puzzle: puzzle,
            solution: solution,
            difficulty: difficulty,
            label: DIFFICULTY[difficulty].label,
            clues: 81 - removed
        };
    }

    /* ---------- public API ---------- */

    window.SudokuGenerator = {
        generate: generatePuzzle,
        solve: function (grid) {
            const g = copyGrid(grid);
            return solve(g) ? g : null;
        },
        isValid: isValid,
        copyGrid: copyGrid,
        DIFFICULTY: DIFFICULTY
    };
})();
