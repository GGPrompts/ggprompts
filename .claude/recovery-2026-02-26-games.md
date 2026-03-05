# Game Agent Recovery Snapshot

Captured: 2026-02-26
Base branch: `main` at `2caab6e`

Purpose: preserve outputs from the 20 parallel game agents after session limits interrupted merge flow.

## What was preserved

All discovered game artifacts were copied from `.claude/worktrees/agent-*` into main repo `games/` paths.
`games/index.html` was intentionally not merged from agent branches in this pass.

## Recovery table

| Game | Issue | Beads status | Source worktree | Recovered target | State |
|---|---|---|---|---|---|
| Blackjack | `htmlstyleguides-zozo` | closed | `agent-a76e4e6f` | `games/casino-blackjack.html` | playable file present |
| Slay the Spire-lite | `htmlstyleguides-rurr` | open | `agent-aaa56441` | `games/spire/` | playable (`index.html`) |
| ASCII Dungeon | `htmlstyleguides-mwcy` | closed | `agent-a1fc237a` | `games/ascii-dungeon/` | playable (`index.html`) |
| Pinball Machine | `htmlstyleguides-lkg1` | closed | `agent-ae738ac4` | `games/pinball/` | playable (`index.html`) |
| Rhythm Roguelike | `htmlstyleguides-h0ad` | open | `agent-afa8ec5f` | `games/rhythm-rogue/` | playable (`index.html`) |
| Crossword Generator | `htmlstyleguides-l6sw` | open | `agent-a3ad57f4` | `games/crossword/` | partial (scripts only, no HTML entry) |
| Word Chain Duel | `htmlstyleguides-l48n` | closed | `agent-ad2ec804` | `games/word-chain.html` | playable file present |
| Codebreaker | `htmlstyleguides-56su` | closed | `agent-a84dbd19` | `games/codebreaker.html` | playable file present |
| Mahjong Solitaire | `htmlstyleguides-qpme` | open | `agent-adba366f` | `games/mahjong/` | playable (`index.html`) |
| Checkers/Draughts | `htmlstyleguides-liv9` | closed | `agent-a5fb1b9a` | `games/checkers.html` | playable file present |
| Angry Birds/Slingshot | `htmlstyleguides-6t96` | open | `agent-ad7a18e4` | `games/slingshot/` | playable (`index.html`) |
| Sokoban | `htmlstyleguides-zace` | open | `agent-af666a08` | `games/sokoban/` | playable (`index.html`) |
| 2048 Poker Chips | `htmlstyleguides-9yiv` | closed | `agent-a91f646f` | `games/2048-chips.html` | playable file present |
| Pipe Dream | `htmlstyleguides-okn0` | open | `agent-af6951be` | `games/pipe-dream.html` | playable file present |
| Idle Mine Clicker | `htmlstyleguides-8veg` | open | `agent-a529b731` | `games/idle-mine/` | playable (`index.html`) |
| Tetris | `htmlstyleguides-97k0` | closed | `agent-a3b705a5` | `games/tetris.html` | playable file present |
| Pac-Man | `htmlstyleguides-ik6m` | open | `agent-a7fa6b61` | `games/pacman/` | playable (`index.html`) |
| Sketch Detective | `htmlstyleguides-0l6q` | open | `agent-ae34af24` | `games/sketch-detective/` | partial (drawings data only, no HTML entry) |
| Lights Out | `htmlstyleguides-b9fx` | closed | `agent-a93e451d` | `games/lights-out.html` | playable file present |
| Snake | `htmlstyleguides-3b3w` | closed | `agent-aae479b6` | `games/snake.html` | playable file present |

## Quick resume checklist

1. Review/play each recovered game directly from `games/` paths above.
2. For partial outputs, finish `Crossword` and `Sketch Detective` first.
3. Merge/update `games/index.html` entries for all new games.
4. Update beads issue statuses (`open` -> `in_progress`/`closed`) after verification.

