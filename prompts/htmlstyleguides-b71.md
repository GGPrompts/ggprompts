# Design 4 unique skill trees (one per class)

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-b71` |
| **Status** | closed |
| **Priority** | 1 |
| **Labels** | — |
| **Created** | 2026-02-16 17:36:56 |
| **Updated** | 2026-02-16 18:17:03 |

## Description

Replace the single shared SKILL_TREE_DEF with per-class skill trees. Each class gets 3 branches x 4 nodes = 12 unique skills.

GUNNER (Cyberpunk):
- Precision: Crit chance → Crit damage → Headshot (instant kill <15% HP) → Overdrive (2x fire rate for 5s on kill streak)
- Arsenal: Multi-projectile → Piercing → Explosive rounds (AoE on hit) → Turret deploy (stationary auto-gun)
- Tech: Drone companion → Drone upgrade → Shield generator → EMP burst (stun all nearby)

DARK KNIGHT (Gothic):
- Blood: Lifesteal → Blood frenzy (attack speed on kill) → Thorns (reflect damage) → Death aura (constant AoE drain)
- Shadow: Summon skeleton → More summons → Skeleton mage → Army of darkness (mass summon burst)
- Undying: Regen → Damage reduction → Second life → Vampiric nova (heal burst when hit low HP)

RANGER (Forest):
- Nature: Poison DoT on hit → Spread poison → Root snare (slow enemies) → Overgrowth (poison zones on ground)
- Agility: Move speed → Evasion chance → Double dash → Phantom step (brief clone decoy on dash)
- Trapper: Bear trap (place on ground) → More traps → Trap damage up → Net launcher (AoE slow)

WARLOCK (Cosmic):
- Gravity: Pull enemies closer → Gravity well (vortex ability) → Mass increase (slow enemies) → Black hole (massive pull + damage)
- Time: CDR on abilities → Time slow bubble → Rewind (undo last 3s damage taken) → Temporal loop (repeat last ability free)
- Void: Ability power up → Void bolt (bonus magic projectile) → Void armor (DR scaling with ability power) → Singularity (ultimate AoE)

Files: engine.js (SKILL_TREE_DEF → CLASS_SKILL_TREES[classId]), all 4 shop pages (skill tree rendering), pause menu skill tab

## Worker Prompt & Notes

## Retro
- What worked: The Proxy pattern for SKILL_TREE_DEF backwards compatibility was clean and avoided touching any shop HTML files. The apply() function pattern on each node made the dynamic system straightforward.
- What was unclear: Nothing major - the task spec was very detailed and clear about which skills to implement and where they should hook in.
