#!/usr/bin/env node
// Validates crossword puzzle data for consistency
// Run: node validate.js

// Mock window for loading puzzles.js
const window = {};
require('./puzzles.js');
const puzzles = window.Puzzles;

let errors = 0;
for (const p of puzzles) {
  console.log(`\n=== Puzzle ${p.id}: "${p.title}" (${p.size}x${p.size}, ${p.difficulty}) ===`);
  const g = p.grid;

  // Check grid dimensions
  if (g.length !== p.size) {
    console.error(`  ERROR: grid has ${g.length} rows, expected ${p.size}`);
    errors++;
  }
  for (let r = 0; r < g.length; r++) {
    if (g[r].length !== p.size) {
      console.error(`  ERROR: row ${r} has ${g[r].length} cols, expected ${p.size}`);
      errors++;
    }
  }

  // Validate each clue
  for (const dir of ['across', 'down']) {
    for (const c of p.clues[dir]) {
      const word = [];
      for (let i = 0; i < c.length; i++) {
        const r = dir === 'across' ? c.row : c.row + i;
        const col = dir === 'across' ? c.col + i : c.col;
        if (r >= p.size || col >= p.size) {
          console.error(`  ERROR: ${dir} #${c.number} "${c.answer}" goes out of bounds at (${r},${col})`);
          errors++;
          break;
        }
        word.push(g[r][col]);
      }
      const gridWord = word.join('');
      if (gridWord !== c.answer) {
        console.error(`  ERROR: ${dir} #${c.number} answer="${c.answer}" but grid reads "${gridWord}" at (${c.row},${c.col}) len=${c.length}`);
        errors++;
      }
    }
  }

  // Check numbering: verify cells that should be numbered
  // A cell gets a number if it starts an across or down word
  const numbered = {};
  for (const dir of ['across', 'down']) {
    for (const c of p.clues[dir]) {
      const key = `${c.row},${c.col}`;
      if (!numbered[key]) numbered[key] = c.number;
      else if (numbered[key] !== c.number) {
        console.error(`  ERROR: cell (${c.row},${c.col}) has conflicting numbers: ${numbered[key]} and ${c.number}`);
        errors++;
      }
    }
  }

  console.log(`  ${p.clues.across.length} across + ${p.clues.down.length} down clues`);
}

console.log(`\n${errors === 0 ? 'ALL VALID' : `${errors} ERRORS FOUND`}`);
process.exit(errors > 0 ? 1 : 0);
