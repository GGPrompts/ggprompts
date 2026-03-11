# Engine: add battle direction system (choreography + camera + contact FX)

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-lx7` |
| **Status** | closed |
| **Priority** | 2 |
| **Labels** | ready |
| **Created** | 2026-02-22 02:16:26 |
| **Updated** | 2026-02-22 02:32:37 |

## Description

Build a choreography layer (scripted attack/counter/recovery chains, intentional whiffs, spacing beats) and camera/director layer (hit-stop 2-3 frames, push-in on impact, recoil pullback, freeze-frames for kills). Make FX strictly contact-driven: sparks, blood, debris spawn at actual contact points only.

## Worker Prompt & Notes

## prepared.prompt

## Context
Battle videos lack a structured choreography system — they either spam random attacks on beats or use pure pose pantomime. For stickdeath-style fights, you need intentional exchanges: wind-up → attack → impact → recovery, with occasional whiffs and spacing beats to create rhythm.

## Task
Add a battle direction system to `stick-fight-engine.js` with choreography, camera, and contact-driven FX helpers.

### 1. Choreography layer
Add a `StickFight.choreograph(figA, figB, sequence)` function that plays a scripted exchange:
```
sequence = [
  { beat: 0, attacker: 'A', move: 'slash', defender: 'block' },
  { beat: 1, attacker: 'B', move: 'punch_r', defender: 'recoil' },
  { beat: 3, attacker: 'A', move: 'lunge', result: 'hit' },  // intentional hit
  { beat: 4, spacing: true },  // both return to guard, breathe
]
```
- Tracks current beat in the sequence
- Calls `attack()` for the attacker, `setPose()` for defender reactions
- Supports `result: 'whiff'` (attacker misses on purpose — target dodges)
- Returns state object that videos can query (currentBeat, isActive, lastContact)

### 2. Camera/director helpers
Add utility functions videos can call (not automatic — videos opt in):
- `StickFight.hitStop(fig, frames)` — freezes a figure's pose lerp for N frames (set poseSpeed to 0, restore after)
- `StickFight.screenShake(intensity, duration)` — returns a shake object that videos read for canvas translate offset. Decays over duration.
- `StickFight.freezeFrame(figs, duration)` — pauses all figures temporarily

### 3. Contact-driven FX helpers
- `StickFight.onContact(callback)` — register a callback that fires on every successful hit with the contact event payload (from the improved hit model). Videos use this to spawn sparks/blood at the exact contact point.
- Modify `applyHit` to fire registered contact callbacks with the contact event.

### Backward compatibility
- All new features are opt-in. Existing videos continue to work.
- Videos that want the new system call `choreograph()` instead of manual `setPose()` sequences.

## Key Files
- `music/visualizer/stick-fight-engine.js` (new section after combat system)
- Reference: `music/visualizer/system-infection-video.html` (current best practice for attack() usage)

## When Done
Close issue: `bd close lx7 --reason "Added choreography, camera/director, and contact-driven FX systems"`
