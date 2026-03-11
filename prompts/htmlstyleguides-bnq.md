# Fix TTFAF finale kill trigger (unreachable beat threshold)

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-bnq` |
| **Status** | closed |
| **Priority** | 1 |
| **Labels** | ready |
| **Created** | 2026-02-22 02:16:13 |
| **Updated** | 2026-02-22 02:20:50 |

## Description

The finale kill trigger in through-the-fire-and-flames-video.html uses finaleBeats >= 280 but the finale section only spans ~80 beats, making the climax unreachable. Fix to use section-relative progress (~85-90% of actual finale duration).

## Worker Prompt & Notes

## prepared.prompt

## Context
The TTFAF finale kill trigger is unreachable. The comment says "~beat 280 of 320" but the finale section (seqIndex 120+) only spans ~10 patterns = ~80 beats max. The climax never fires.

## Task
Fix the finale kill threshold in `through-the-fire-and-flames-video.html` line 837.

Change `duel.finaleBeats >= 280` to use a realistic threshold relative to the actual finale duration. The finale spans seqIndex 120-129 (10 patterns). At standard 16 rows/pattern with 4 rows/beat, that is ~40 beats. Trigger at ~85-90% through = around beat 34-36.

Also verify the `finaleBeats` counter (line 834) increments correctly per beat (not per row).

## Key Files
- `music/visualizer/through-the-fire-and-flames-video.html` (lines 834-844)

## Verification
- Play the song to the finale section and confirm the kill sequence triggers
- The triggerFinaleKill() function should fire in the last 10-15% of the finale

## When Done
Close issue: `bd close bnq --reason "Fixed unreachable finale kill threshold"`
