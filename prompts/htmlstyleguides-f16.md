# Add class identity config to THEME objects

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-f16` |
| **Status** | closed |
| **Priority** | 1 |
| **Labels** | — |
| **Created** | 2026-02-16 17:36:41 |
| **Updated** | 2026-02-16 18:02:51 |

## Description

Extend window.THEME in each level HTML with a new 'class' config block:
- classId: 'gunner'|'darkknight'|'ranger'|'warlock'
- startingStats: { hp, speed, damage, defense } (different per class)
- weaponAffinities: { primary: ['projectile','beam',...], secondary: ['orbit',...] }
- classPassive: { id, name, desc, effect }

Primary weapons get +25% damage scaling. Secondary get base scaling. Non-listed weapons can still drop but at reduced rate and no bonus.

This is the foundation — all other class features read from THEME.class config.

Files: cyberpunk.html, gothic.html, forest.html, cosmic.html, engine.js (getWeaponStats to apply affinity bonus)

## Worker Prompt & Notes

## Retro
- What worked: Reading all files upfront gave clear picture of THEME structure and all damage-taking locations. Applying class passives after all perm upgrades ensures proper stacking.
- What was unclear: Whether floating text system existed (used lootPickupTexts for DODGE display).
