# Implement weapon affinity system in engine

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-bi2` |
| **Status** | closed |
| **Priority** | 1 |
| **Labels** | — |
| **Created** | 2026-02-16 17:37:03 |
| **Updated** | 2026-02-16 18:07:52 |

## Description

Modify getWeaponStats() and weapon offering logic to respect class affinities from THEME.class.weaponAffinities.

1. In getWeaponStats(): if weapon type is in primary list, multiply damage by 1.25. If in secondary, use 1.0x. If neither (off-class), use 0.75x.
2. In level-up weapon offering: weight primary weapons 3x, secondary 1.5x, off-class 0.5x in the random selection pool. This means you CAN get off-class weapons but rarely.
3. Starting weapon should always be the first primary weapon for the class.
4. Add visual indicator in weapon choice UI showing affinity tier (gold border = primary, silver = secondary, grey = off-class).
5. Weapon tooltip should show the affinity bonus/penalty.

This creates natural build diversity — a Ranger picking up a stray beam weapon can make it work, but it won't be as strong as their boomerang.

Files: engine.js (getWeaponStats, level-up weapon selection, weapon UI rendering)

## Worker Prompt & Notes

## Retro
- What worked: Clean separation - affinity check lives in getWeaponAffinityTier() helper, damage scaling in getWeaponStats(), weighted pick in weightedWeaponPick(). CSS injected from engine.js so no theme HTML modifications needed.
- What was unclear: Nothing major. The task spec was thorough and the codebase was well-organized.
