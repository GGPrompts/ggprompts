# Add tower activated abilities on cooldown

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-58f` |
| **Status** | closed |
| **Priority** | 3 |
| **Labels** | ready |
| **Created** | 2026-02-26 03:03:01 |
| **Updated** | 2026-02-26 03:50:31 |

## Description

Give each tower type a unique activated ability that triggers on a cooldown when the tower is selected and the player presses a hotkey. Examples: Fire tower eruption (big AoE burst), Ice tower flash freeze (freeze all in range), Lightning overload (chain to all enemies in range once), Earth tower earthquake (stun + damage in wide area). Abilities unlock at tier 2 upgrades. Show cooldown indicator on tower.

## Worker Prompt & Notes

## prepared.prompt

## Context
Arcane Bastion towers auto-attack passively. Adding activated abilities gives players more tactical control and rewards active play. This builds on the mana system (htmlstyleguides-ia8) which provides the resource for ability costs.

## Task
Add one unique activated ability per tower type in `games/tower-defense/towers.js`:

### Ability Definitions
Add an `ability` property to each tower type definition:
- **Fire — Eruption** (10 mana, 8s cooldown): AoE burst dealing 3x tower damage in radius 2. All enemies hit get burn DoT.
- **Ice — Flash Freeze** (12 mana, 10s cooldown): All enemies in range instantly frozen for 2s.
- **Lightning — Overload** (15 mana, 12s cooldown): Chain to ALL enemies in range once for full damage (no falloff).
- **Earth — Earthquake** (12 mana, 10s cooldown): Stun all enemies in radius 3 for 1.5s + 50% tower damage.
- **Arcane — Disintegrate** (20 mana, 15s cooldown): Single target beam dealing 5x damage, ignores armor.
- **Nature — Entangle** (10 mana, 8s cooldown): Root all enemies in range for 2.5s, apply poison.
- **Shadow — Soul Drain** (15 mana, 12s cooldown): Damage all enemies in range for 2x damage, heal nexus for 10% of damage dealt.
- **Light — Divine Judgment** (18 mana, 14s cooldown): Smite target for 4x damage. If it kills, refund 50% mana cost.

### Unlock Condition
Abilities unlock at Tier 2 (either upgrade path). Show ability button grayed out for Tier 1 towers.

### UI
- When a placed tower is selected, show ability button in the tower info panel
- Show mana cost and cooldown timer
- Hotkey: Space bar to activate selected tower's ability
- Ability targets the tower's current target (or nearest enemy if no target)

### Visual Feedback
- Bright element-colored flash on ability cast
- Unique particle effect per ability using ArcaneFX
- Play Audio.abilitycast() (or existing tower fire sound at higher volume)

## Key Files
- `games/tower-defense/towers.js` — tower type definitions, tower instance creation, tower stats
- `games/tower-defense/engine.js` — tower selection, input handling, mana deduction, ability hotkey
- `games/tower-defense/index.html` — tower info panel, add ability button UI
- `games/tower-defense/effects.js` — ability visual effects

## When Done
Close issue: bd close htmlstyleguides-58f --reason="Added 8 unique tower activated abilities with mana costs and cooldowns"
