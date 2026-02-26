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
  // 2 A R E # #
  // 3 R E # T O
  // 4 E D # E N
  {
    id: 1, title: "Quick Sketch", difficulty: "easy", size: 5,
    grid: [
      ["S","P","A","R","E"],
      ["H","O","N","E","#"],
      ["A","R","E","#","#"],
      ["R","E","#","T","O"],
      ["E","D","#","E","N"]
    ],
    clues: {
      across: [
        { number: 1, clue: "Extra; leftover", answer: "SPARE", row: 0, col: 0, length: 5 },
        { number: 6, clue: "Sharpen on a stone", answer: "HONE", row: 1, col: 0, length: 4 },
        { number: 7, clue: "Exist; plural of 'is'", answer: "ARE", row: 2, col: 0, length: 3 },
        { number: 8, clue: "Preposition: ___ the house", answer: "TO", row: 3, col: 3, length: 2 },
        { number: 9, clue: "Short for editor", answer: "ED", row: 4, col: 0, length: 2 },
        { number: 10, clue: "Typographic half-em", answer: "EN", row: 4, col: 3, length: 2 }
      ],
      down: [
        { number: 1, clue: "Divide; portion", answer: "SHARE", row: 0, col: 0, length: 5 },
        { number: 2, clue: "Preyed upon", answer: "PORED", row: 0, col: 1, length: 5 },
        { number: 3, clue: "Dill-like plant", answer: "ANE", row: 0, col: 2, length: 3 },
        { number: 4, clue: "Concerning; about", answer: "RE", row: 0, col: 3, length: 2 },
        { number: 5, clue: "Conclude; finish", answer: "E", row: 0, col: 4, length: 1 },
        { number: 8, clue: "Musical note variant", answer: "TE", row: 3, col: 3, length: 2 }
      ]
    }
  },

  // ====== PUZZLE 2 (7x7, Easy) ======
  // Grid:
  //   0 1 2 3 4 5 6
  // 0 C A B # N E W
  // 1 U S E # A R E
  // 2 B # D I G # #
  // 3 # # # # # # #
  // 4 # T E N D # #
  // 5 O I L # O D E
  // 6 R E # # R E D
  {
    id: 2, title: "Coffee Break", difficulty: "easy", size: 7,
    grid: [
      ["C","A","B","#","N","E","W"],
      ["U","S","E","#","A","R","E"],
      ["B","#","D","I","G","#","#"],
      ["#","#","#","#","#","#","#"],
      ["#","T","E","N","D","#","#"],
      ["O","I","L","#","O","D","E"],
      ["R","E","#","#","R","E","D"]
    ],
    clues: {
      across: [
        { number: 1, clue: "Taxi vehicle", answer: "CAB", row: 0, col: 0, length: 3 },
        { number: 4, clue: "Recently made", answer: "NEW", row: 0, col: 4, length: 3 },
        { number: 7, clue: "Employ; utilize", answer: "USE", row: 1, col: 0, length: 3 },
        { number: 8, clue: "Plural of 'is'", answer: "ARE", row: 1, col: 4, length: 3 },
        { number: 9, clue: "Excavate; burrow", answer: "DIG", row: 2, col: 2, length: 3 },
        { number: 10, clue: "Care for; incline", answer: "TEND", row: 4, col: 1, length: 4 },
        { number: 11, clue: "Petroleum liquid", answer: "OIL", row: 5, col: 0, length: 3 },
        { number: 12, clue: "Lyric poem", answer: "ODE", row: 5, col: 4, length: 3 },
        { number: 13, clue: "Concerning; about", answer: "RE", row: 6, col: 0, length: 2 },
        { number: 14, clue: "Color of roses", answer: "RED", row: 6, col: 4, length: 3 }
      ],
      down: [
        { number: 1, clue: "Young bear", answer: "CUB", row: 0, col: 0, length: 3 },
        { number: 2, clue: "Similar to; like", answer: "AS", row: 0, col: 1, length: 2 },
        { number: 3, clue: "Sleeping furniture", answer: "BED", row: 0, col: 2, length: 3 },
        { number: 4, clue: "Pester constantly", answer: "NAG", row: 0, col: 4, length: 3 },
        { number: 5, clue: "Hesitation sound", answer: "ER", row: 0, col: 5, length: 2 },
        { number: 6, clue: "First person plural", answer: "WE", row: 0, col: 6, length: 2 },
        { number: 10, clue: "Necktie; a draw", answer: "TIE", row: 4, col: 1, length: 3 },
        { number: 9, clue: "Elevated railway", answer: "EL", row: 4, col: 2, length: 2 },
        { number: 11, clue: "Alternative conjunction", answer: "OR", row: 5, col: 0, length: 2 },
        { number: 12, clue: "Black dung beetle", answer: "DOR", row: 4, col: 4, length: 3 },
        { number: 14, clue: "Editor (abbr.)", answer: "ED", row: 5, col: 6, length: 2 }
      ]
    }
  }
];
