# Engine: add stance/handedness model (weaponHand, leadSide)

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-5hz` |
| **Status** | closed |
| **Priority** | 1 |
| **Labels** | ready |
| **Created** | 2026-02-22 02:16:23 |
| **Updated** | 2026-02-22 02:25:38 |

## Description

Add weaponHand and leadSide properties to figures with mirror-safe attack definitions. Current weapon logic is effectively left-hand centric and looks wrong depending on facing/pose. Attacks should be definable as lead-hand or rear-hand and auto-mirror based on stance.

## Worker Prompt & Notes

## prepared.prompt

## Context
Weapon logic is effectively left-hand centric (sword always drawn from handL). Attacks like slash and lunge animate the left arm regardless of which hand should hold the weapon based on facing or stance. This looks wrong when figures face certain directions or when you want a right-handed fighter.

## Task
Add a stance/handedness model to `stick-fight-engine.js`.

### Requirements
1. **`weaponHand`** property on figures - 'left' or 'right' (default: 'left' for backward compat). Determines which hand holds/draws the weapon.
2. **`leadSide`** property - 'left' or 'right' (default: 'left'). Determines the forward foot in stance. Affects which leg leads in lunges.
3. **Mirror-safe move definitions** - Moves in MOVES should reference 'lead' and 'rear' arms/legs instead of hardcoded L/R. Add a resolution step in `updateAttack` that maps 'leadArm'→'armL' or 'armR' based on the figure's `leadSide`.
4. **Weapon drawing** - In `drawFigure`, draw sword from `handL` or `handR` based on `weaponHand`.
5. **Hit detection** - In `checkHit`, use the correct hand (weapon hand) for sword tip calculation.

### Implementation approach
- Add `weaponHand` and `leadSide` to `create()` opts with defaults
- Create a mapping function: `resolveHand(fig, 'lead') → 'L' or 'R'`
- For MOVES: keep existing keyframes as-is (they work for left-lead). Add a `mirrorKeyframes(keyframes, fig)` function that swaps L↔R references when leadSide is 'right'
- In `drawFigure`: check `fig.weaponHand` to pick which hand draws the sword
- In `checkHit`: check `fig.weaponHand` for sword tip position

### Backward compatibility
- Default `weaponHand: 'left'` and `leadSide: 'left'` = identical to current behavior
- All existing videos work without changes

## Key Files
- `music/visualizer/stick-fight-engine.js` (create, drawFigure, checkHit, updateAttack, MOVES)

## When Done
Close issue: `bd close 5hz --reason "Added weaponHand and leadSide with mirror-safe attack definitions"`
