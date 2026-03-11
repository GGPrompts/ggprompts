# Engine: improve hit model (swept segments, target zones, contact events)

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-7aq` |
| **Status** | closed |
| **Priority** | 1 |
| **Labels** | ready |
| **Created** | 2026-02-22 02:16:20 |
| **Updated** | 2026-02-22 02:29:56 |

## Description

Replace the current single-point-vs-torso-center hit detection with swept segment tests for fist/weapon over active hit frames, multiple target zones (head/torso/limbs), and a deterministic contact event payload (point, normal, strength, moveName). This makes hits feel precise and enables contact-driven FX.

## Worker Prompt & Notes

## prepared.prompt

## Context
Current hit detection uses a single point (weapon tip or fist) vs a torso-center radius check. This gives mushy timing and no spatial feedback. For stickdeath-style fights, hits need to feel precise — you should see the fist connect with the head, not just "be near the torso."

## Task
Improve the hit detection system in `stick-fight-engine.js`.

### Requirements
1. **Swept segment test** - Instead of a point-vs-radius check, test the attacking limb segment (e.g., elbow→hand for punches, hand→swordTip for slashes) against target body segments. Use segment-vs-segment closest-point distance.
2. **Multiple target zones** - Define hit zones on the target:
   - `head`: neck→head segment + head radius
   - `torso`: hip→neck segment
   - `armL`/`armR`: shoulder→elbow→hand chains
   - `legL`/`legR`: hip→knee→ankle chains
   Each zone can have a damage multiplier (head: 1.5x, limbs: 0.7x).
3. **Contact event payload** - When a hit connects, return/emit a contact event object:
   ```
   { point: {x, y},           // world-space contact point
     normal: {x, y},          // impact direction (normalized)
     strength: 0-1,           // based on attack progress (peak at hitAt timing)
     moveName: 'punch_r',     // which move connected
     zone: 'head',            // which target zone was hit
     damage: 22 }             // final damage after zone multiplier
   ```
4. **Return contact from attack()** - Modify the attack/checkHit/applyHit chain so that `checkHit` returns the contact event (or null for miss). Store the last contact on `fig.lastContact` so videos can read it for FX placement.

### Implementation notes
- Segment-vs-segment distance: find closest points on two line segments, return distance and the closest point pair
- The swept test should use the attacking limb position at the current frame (not interpolated across frames — keep it simple)
- Add a `segmentDistance(a1, a2, b1, b2)` helper function
- Keep the existing `hitRange` as a max distance threshold for the segment test

### Backward compatibility
- Existing `attack()` calls continue to work
- If no zone is hit, fall back to the current torso-center check (graceful degradation)
- `fig.lastContact` is null by default, set on successful hits

## Key Files
- `music/visualizer/stick-fight-engine.js` (checkHit, applyHit, attack, computeJoints)

## When Done
Close issue: `bd close 7aq --reason "Improved hit model with swept segments, target zones, and contact event payload"`
