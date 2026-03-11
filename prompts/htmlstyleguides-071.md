# Survivors: Chain weapon missing visual arc from player to first target

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-071` |
| **Status** | closed |
| **Priority** | 1 |
| **Labels** | — |
| **Created** | 2026-02-16 16:19:11 |
| **Updated** | 2026-02-16 16:36:41 |

## Description

The chain/arc weapon shows chain lines between bounced enemies but never renders the initial arc from the player to the first enemy hit. This makes it look like enemies are just dying randomly with no visual feedback connecting the player to the damage.

Also the chain weapon may be overtuned — it melts everything with the bounce scaling. Consider:
- Add visual arc/lightning line from player position to first enemy in chainHit()
- Review chain damage falloff (currently 0.8x per bounce) — may need steeper decay
- Review bounce count scaling (2 + level) — gets very high
- Review chain range scaling (150 + level*20) — covers huge area at high levels

File: games/survivors/engine.js, chainHit() function around line 861, and WEAPON_HANDLERS.chain around line 787

## Worker Prompt & Notes

## Retro
- What worked: The existing chainLine effect between bouncing enemies was already well-structured, so reusing the same pattern for the player-to-first-enemy arc was a clean 4-line addition.
- What was unclear: Nothing major; the issue description was precise and pointed to the right lines.
