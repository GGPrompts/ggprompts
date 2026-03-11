# Engine: add richer kinematic controls (torso twist, hip shift, head tilt)

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-yv0` |
| **Status** | closed |
| **Priority** | 1 |
| **Labels** | ready |
| **Created** | 2026-02-22 02:16:18 |
| **Updated** | 2026-02-22 02:30:40 |

## Description

Extend the pose parameter system in stick-fight-engine.js with torso twist, hip shift, head tilt/bob, and optional per-limb phase offsets. These give videos much more expressive figure posing beyond the current lean/bounce/knee/arm model.

## Worker Prompt & Notes

## prepared.prompt

## Context
The current pose parameter system only has bounce, lean, arm angles, elbow bends, leg spread, and knee offsets. This limits expressiveness — figures cannot twist their torso, shift their hips laterally, or tilt their heads. These controls make the difference between a puppet and a character.

## Task
Extend the pose parameter system in `stick-fight-engine.js` with new kinematic controls.

### New parameters to add to defaultParams() and the targets system
1. **`torsoTwist`** (-1..1) - Rotates the torso around the spine axis. Visually: shoulders shift left/right relative to hips, creating a twist effect. Implement by offsetting shoulderL/shoulderR x-positions based on twist value.
2. **`hipShift`** (-1..1) - Lateral hip displacement. Shifts the hip joint left/right independent of lean. Useful for weight shifts, sway, dance.
3. **`headTilt`** (-1..1) - Tilts the head left/right (offset head x relative to neck).
4. **`headBob`** (-1..1) - Nods the head up/down (offset head y relative to default).

### Implementation
- Add all 4 params to `defaultParams()` with value 0
- Modify `computeJoints()` to apply each:
  - `torsoTwist`: offset shoulderL.x and shoulderR.x by `twist * shouldW * 0.5` (one forward, one back)
  - `hipShift`: offset hip.x by `hipShift * fH * 0.05`
  - `headTilt`: offset head.x by `headTilt * fH * 0.04`
  - `headBob`: offset head.y by `headBob * fH * 0.03`
- These should compose with existing lean/bounce — they are additive offsets
- Update relevant POSES entries if any benefit from defaults (probably not needed — keep existing poses unchanged)

### Backward compatibility
- All new params default to 0 = no visual change
- Existing videos work without modification
- New params are available via `setTarget(fig, 'torsoTwist', 0.3)` etc.

## Key Files
- `music/visualizer/stick-fight-engine.js` (defaultParams, computeJoints)

## When Done
Close issue: `bd close yv0 --reason "Added torsoTwist, hipShift, headTilt, headBob kinematic controls"`
