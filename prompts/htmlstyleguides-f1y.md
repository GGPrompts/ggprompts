# Compose background loop tracks for survivors themes

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-f1y` |
| **Status** | closed |
| **Priority** | 2 |
| **Labels** | — |
| **Created** | 2026-02-16 18:57:37 |
| **Updated** | 2026-02-16 19:10:54 |

## Description

Create looping background music tracks for each survivors theme (forest, gothic, cosmic, cyberpunk) using the chiptune audio tracker format and the Haiku relay pattern.

Each track should:
- Match the visual theme and mood of its arena
- Loop seamlessly (use loopStartSeq/loopEndSeq)
- Be 2-3 minutes before looping
- Have appropriate energy for gameplay (not too calm, not overwhelming)
- Use the compact event JSON format from AI-SONG-FORMAT.md

Themes to compose:
1. **Forest** - Organic, earthy, pentatonic/Dorian, moderate tempo (~100 BPM)
2. **Gothic** - Dark, Phrygian/harmonic minor, pipe organ-like tones (~90 BPM)
3. **Cosmic** - Ethereal, whole-tone/Lydian, spacey synth pads (~110 BPM)
4. **Cyberpunk** - Driving synthwave, detuned sawtooth, four-on-floor (~128 BPM)

Use the Haiku relay method from the chiptune-composer skill (Phase 1b) if tracks need to be longer, or parallel Opus subagents for 4 independent tracks.

## Worker Prompt & Notes

## Retro
- What worked: Composing all 4 tracks directly without relay mode since they are 2-3 min loops (not 5+ min epics). Used consistent 9-pattern/17-sequence structure across all tracks. Each has a distinct tonal identity: D Dorian pentatonic for forest, E Phrygian organ for gothic, F# Lydian sine pads for cosmic, A minor detuned sawtooth for cyberpunk.
- What was unclear: Nothing significant - the task was well-specified with clear theme requirements and format references.
