# Survivors: Enemy AI needs more aggression and variety

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-23d` |
| **Status** | closed |
| **Priority** | 2 |
| **Labels** | — |
| **Created** | 2026-02-16 16:17:22 |
| **Updated** | 2026-02-16 16:53:03 |

## Description

Enemies mostly circle the player passively, especially in the cosmic level endgame. The density ramps up but since enemies dont move toward the player much, theres no pressure to dodge or reposition — sitting still works fine.

Needs:
- More enemy types that actively chase/charge the player
- Enemies that punish standing still (AoE telegraphs, converging patterns)
- Varied movement behaviors beyond circling (flanking, pincer, dive-bombers)
- Late-game elites with dangerous approach patterns
- Consider enemies that counter specific weapon types (dodge projectiles, resist area)

## Worker Prompt & Notes

## Retro
- What worked: Clean separation of movement handlers made adding new types straightforward. The Pool/SpatialHash architecture supported the new behaviors without modification.
- What was unclear: Whether elite glow should be rendered by the engine or delegated to themes. Chose engine-side since it applies uniformly across all themes.
