# Engine: add locomotion layer (gait, foot-plant, pelvis sway)

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-8vb` |
| **Status** | closed |
| **Priority** | 1 |
| **Labels** | ready |
| **Created** | 2026-02-22 02:16:16 |
| **Updated** | 2026-02-22 02:22:33 |

## Description

Add velocity-driven gait phase with foot-plant windows and anti-slide, pelvis sway, and shoulder counter-rotation to stick-fight-engine.js. This eliminates the foot-sliding problem and gives figures believable walking/running motion.

## Worker Prompt & Notes

## prepared.prompt

## Context
Stick figures currently have no foot planting or gait cycle. When videos move figures laterally (updating fig.x), feet slide across the ground with no walking animation. This is the single highest-leverage improvement for visual believability.

## Task
Add a locomotion layer to `stick-fight-engine.js` that activates when a figure has lateral velocity.

### Requirements
1. **Gait phase** - Track a `gaitPhase` (0-1 cycle) on each figure, driven by `abs(velocity)`. Phase advances proportional to distance traveled per frame.
2. **Foot-plant windows** - During each half-cycle, one foot stays planted (ankle x stays fixed relative to ground) while the other swings forward. The `kneeL`/`kneeR` and `ankleL`/`ankleR` targets should be driven by gait phase.
3. **Anti-slide** - When a foot is in its plant window, its world-x should not drift. This may require tracking `lastPlantX` per foot and correcting ankle position.
4. **Pelvis sway** - Add subtle lateral hip offset that oscillates with gait (shift weight over planted foot).
5. **Shoulder counter-rotation** - Shoulders twist opposite to pelvis (natural walking motion). Add a `shoulderTwist` derived value that offsets shoulderL/shoulderR y-positions slightly.

### Implementation approach
- Add `fig.velocity` tracking (computed from frame-to-frame `fig.x` delta in `updateFigure`)
- Add `fig.gaitPhase`, `fig.lastX`, `fig.plantFootL`, `fig.plantFootR` state
- In `updateFigure`, before the lerp loop: if `abs(velocity) > threshold`, advance gait and override leg/hip targets
- The locomotion should blend smoothly with posed motion (when velocity is near zero, gait influence fades out)
- Expose `fig.velocity` so videos can read it

### Backward compatibility
- Figures with zero lateral movement must look identical to current behavior
- All existing video files must work without changes
- New gait params should have sensible defaults that produce no visible change when velocity = 0

## Key Files
- `music/visualizer/stick-fight-engine.js` (computeJoints, updateFigure, create)

## Reference
- System Infection video moves figures with direct `fig.x +=` updates
- Fencing video has fencers advance/retreat by updating `fig.x`

## When Done
Close issue: `bd close 8vb --reason "Added locomotion layer with gait cycle, foot-plant, pelvis sway, shoulder counter-rotation"`
