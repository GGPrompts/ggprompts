# Survivors: Difficulty balance — skills + dash make it too easy

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-1fe` |
| **Status** | closed |
| **Priority** | 2 |
| **Labels** | — |
| **Created** | 2026-02-16 16:17:24 |
| **Updated** | 2026-02-16 16:59:39 |

## Description

Once you have a few permanent upgrades and the short-cooldown dash, the game becomes very easy. The cosmic level final boss area was the first time density felt meaningful, but by then the player is overpowered.

Areas to address:
- Dash cooldown may be too short, especially with utility_2 reduction
- Permanent upgrade scaling compounds too much (crit + lifesteal + multi-projectile + piercing)
- Early/mid game could use more pressure — enemies scale too slowly
- Consider difficulty tiers or NG+ scaling based on permanent upgrades owned
- Boss HP/damage may need scaling with player power level

## Worker Prompt & Notes

## Retro
- What worked: Reading the full engine.js first gave a clear picture of all interconnected systems (dash, stats, spawning, boss attacks, save/progression). Surgical edits rather than rewrites kept changes contained.
- What was unclear: The exact balance feel is hard to judge without playtesting. The HP curve steepness and power-level scaling percentages may need further tuning based on player feedback.
