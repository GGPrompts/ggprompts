# Add multi-phase boss encounters

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-j1q` |
| **Status** | closed |
| **Priority** | 2 |
| **Labels** | ready |
| **Created** | 2026-02-26 03:03:06 |
| **Updated** | 2026-02-26 03:50:05 |

## Description

Rework boss enemies to have 2-3 phases that trigger at HP thresholds (e.g. 66% and 33%). Each phase changes behavior: faster attacks, new abilities, speed changes, summon adds. Example: Infernal Lord phase 2 leaves fire trails, phase 3 enrages with 2x attack speed. Shadow Dragon phase 2 summons shade minions, phase 3 permanently phases in/out rapidly.

## Worker Prompt & Notes

## prepared.prompt

## Context
Arcane Bastion's 4 bosses each have a single ability on a timer. Multi-phase encounters make boss fights more dynamic — bosses change behavior at HP thresholds, requiring players to adapt mid-fight.

## Task
Rework boss encounters in `games/tower-defense/enemies.js` to have 2-3 phases:

### Phase System
- Add `phase` property to boss enemies (starts at 1)
- Check HP thresholds in updateBehavior() boss section:
  - Phase 2 triggers at 60% HP
  - Phase 3 triggers at 25% HP
- On phase transition: brief invulnerability (0.5s), visual pulse effect, play Audio.bossAbility()

### Boss Phase Designs

**Infernal Lord (Wave 5)**:
- Phase 1: Fire Nova every 8s (existing)
- Phase 2 (60% HP): Leaves fire trail on path (burn DoT zone, 8 DPS, 3s duration)
- Phase 3 (25% HP): Enrage — 50% faster, Fire Nova radius doubled

**Crystal Hydra (Wave 10)**:
- Phase 1: Summon 3 wisps every 10s (existing)
- Phase 2 (60% HP): Summons 5 wisps instead, gains +2 armor (crystal hardening)
- Phase 3 (25% HP): Regeneration (15 HP/s), summon includes 1 gargoyle

**Lich King (Wave 15)**:
- Phase 1: Mass Heal 15% every 12s (existing)
- Phase 2 (60% HP): Raises 2 skeletons from killed enemies every 10s
- Phase 3 (25% HP): Death aura — all nearby towers deal 20% less damage (debuff zone)

**Shadow Dragon (Wave 20)**:
- Phase 1: Phase ability every 8s (existing)
- Phase 2 (60% HP): Shadow breath — line AoE that damages towers in path? Or disables them for 2s
- Phase 3 (25% HP): Permanent phase shifting (flickers rapidly, 50% evasion chance), +50% speed

### Visual Indicators
- Phase number shown below boss health bar (I, II, III)
- Boss color/glow changes per phase (intensifies)
- Phase transition: brief white flash + expanding ring effect using ArcaneFX

## Key Files
- `games/tower-defense/enemies.js` — boss type definitions (~line 1015), executeBossAbility() (~line 1313), updateBehavior() boss section (~line 1231), createEnemy() (~line 1029)
- `games/tower-defense/effects.js` — for phase transition visual effects

## When Done
Close issue: bd close htmlstyleguides-j1q --reason="Added multi-phase boss encounters with 2-3 phases per boss"
