# Update Rhythm Hero to use shortEndSeq for game length

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-c02` |
| **Status** | closed |
| **Priority** | 2 |
| **Labels** | ready |
| **Created** | 2026-02-22 21:55:07 |
| **Updated** | 2026-02-22 22:14:42 |

## Description

Rhythm Hero currently uses analysis.timeline.length as totalRows to determine when the song ends (games/rhythm-hero/index.html). When the song has shortEndSeq, the game should only generate notes up to that point and end the round there. The check 'if (cursor.totalFracRow >= totalRows + 2)' should use the trimmed totalRows. If the visualizer engine issue is done first and trims the analysis, this may already work. Verify and adjust if needed. Key file: games/rhythm-hero/index.html

## Worker Prompt & Notes

## prepared.prompt

## Context
Rhythm Hero games can be 3+ minutes for long songs, which is too long. With shortEndSeq support in the engine, games should respect the shorter version.

## Task
Verify and update Rhythm Hero (games/rhythm-hero/index.html) to work with shortEndSeq:
1. Check if the visualizer engine trimming (htmlstyleguides-aa6) already handles this by trimming analysis.timeline
2. If Rhythm Hero uses its own analysis or loads songs independently, add shortEndSeq support
3. The end-of-song check (cursor.totalFracRow >= totalRows + 2) should use the trimmed totalRows
4. Test that the game ends at the short version length, not the full song length

## Key Files
- games/rhythm-hero/index.html (song loading, totalRows usage, end-of-song detection)

## When Done
Close issue: bd close htmlstyleguides-c02 --reason "Rhythm Hero respects shortEndSeq"
