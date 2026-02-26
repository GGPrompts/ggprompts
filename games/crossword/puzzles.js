/**
 * Crossword Puzzle Data
 * Each puzzle: { id, title, difficulty, size, grid[][], clues: { across[], down[] } }
 * grid[row][col] = '#' for black cells, uppercase letter for answer cells
 * Each clue: { number, clue, answer, row, col, length }
 */
window.Puzzles = [

  // ====== PUZZLE 1 (5x5, Easy) ======
  // Grid:
  //   0 1 2 3 4
  // 0 S P A R E
  // 1 H O N E #
  // 2 A R E A #
  // 3 R E # T O
  // 4 E D # E N
  {
    id: 1, title: "Quick Sketch", difficulty: "easy", size: 5,
    grid: [
      ["S","P","A","R","E"],
      ["H","O","N","E","#"],
      ["A","R","E","A","#"],
      ["R","E","#","T","O"],
      ["E","D","#","E","N"]
    ],
    clues: {
      across: [
        { number: 1, clue: "Extra; leftover", answer: "SPARE", row: 0, col: 0, length: 5 },
        { number: 6, clue: "Sharpen on a stone", answer: "HONE", row: 1, col: 0, length: 4 },
        { number: 7, clue: "Region; zone", answer: "AREA", row: 2, col: 0, length: 4 },
        { number: 8, clue: "Preposition: ___ the house", answer: "TO", row: 3, col: 3, length: 2 },
        { number: 9, clue: "Short for editor", answer: "ED", row: 4, col: 0, length: 2 },
        { number: 10, clue: "Numeral after nine", answer: "TEN", row: 4, col: 3, length: 2 }
      ],
      down: [
        { number: 1, clue: "Divide; portion", answer: "SHARE", row: 0, col: 0, length: 5 },
        { number: 2, clue: "Preyed upon", answer: "PORED", row: 0, col: 1, length: 5 },
        { number: 3, clue: "Single; by itself", answer: "ALONE", row: 0, col: 2, length: 3 },
        { number: 4, clue: "Lease; payment", answer: "RENT", row: 0, col: 3, length: 4 },
        { number: 5, clue: "Conclude; finish", answer: "E", row: 0, col: 4, length: 1 }
      ]
    }
  },

  // ====== PUZZLE 2 (7x7, Easy) ======
  // Grid:
  //   0 1 2 3 4 5 6
  // 0 C A B # A D D
  // 1 U S E # R E W
  // 2 B # A I M # #
  // 3 # S E A # # #
  // 4 # T E N D # #
  // 5 O N E # O D D
  // 6 N E W # R E D
  {
    id: 2, title: "Coffee Break", difficulty: "easy", size: 7,
    grid: [
      ["C","A","B","#","A","D","D"],
      ["U","S","E","#","R","E","W"],
      ["B","#","A","I","M","#","#"],
      ["#","S","E","A","#","#","#"],
      ["#","T","E","N","D","#","#"],
      ["O","N","E","#","O","D","D"],
      ["N","E","W","#","R","E","D"]
    ],
    clues: {
      across: [
        { number: 1, clue: "Taxi vehicle", answer: "CAB", row: 0, col: 0, length: 3 },
        { number: 4, clue: "Sum up", answer: "ADD", row: 0, col: 4, length: 3 },
        { number: 7, clue: "Employ; utilize", answer: "USE", row: 1, col: 0, length: 3 },
        { number: 8, clue: "Reward; prize", answer: "AREW", row: 1, col: 4, length: 3 },
        { number: 9, clue: "Target; point at", answer: "AIM", row: 2, col: 2, length: 3 },
        { number: 10, clue: "Ocean body", answer: "SEA", row: 3, col: 1, length: 3 },
        { number: 11, clue: "Lean; incline", answer: "TEND", row: 4, col: 1, length: 4 },
        { number: 12, clue: "Single unit", answer: "ONE", row: 5, col: 0, length: 3 },
        { number: 13, clue: "Strange; peculiar", answer: "ODD", row: 5, col: 4, length: 3 },
        { number: 14, clue: "Recently made", answer: "NEW", row: 6, col: 0, length: 3 },
        { number: 15, clue: "Color of roses", answer: "RED", row: 6, col: 4, length: 3 }
      ],
      down: [
        { number: 1, clue: "Young bear", answer: "CUB", row: 0, col: 0, length: 3 },
        { number: 2, clue: "Donkey", answer: "ASS", row: 0, col: 1, length: 3 },
        { number: 3, clue: "Grain; cereal", answer: "BEATEN", row: 0, col: 2, length: 3 },
        { number: 4, clue: "Curved shape", answer: "ARMOR", row: 0, col: 4, length: 3 },
        { number: 5, clue: "Action; feat", answer: "DEED", row: 0, col: 5, length: 3 },
        { number: 6, clue: "Moisture; precipitation", answer: "DW", row: 0, col: 6, length: 2 },
        { number: 9, clue: "Every single one", answer: "AEEW", row: 2, col: 2, length: 5 },
        { number: 10, clue: "Set; place down", answer: "STNE", row: 3, col: 1, length: 4 },
        { number: 11, clue: "Period of years", answer: "TEN", row: 4, col: 1, length: 3 }
      ]
    }
  }
];
