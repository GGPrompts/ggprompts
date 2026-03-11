# Add elite/champion enemy modifier system

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-19u` |
| **Status** | closed |
| **Priority** | 2 |
| **Labels** | ready |
| **Created** | 2026-02-26 03:03:17 |
| **Updated** | 2026-02-26 03:29:35 |

## Description

Randomly apply elite modifiers to regular enemies starting around wave 8+. Modifiers: Armored (+3 armor, metallic tint), Swift (+40% speed, blur trail), Vampiric (heals on nexus damage), Thorned (reflects 10% damage), Giant (2x size, 2x HP, 2x gold), Resistant (immune to one status effect). Show modifier icon above enemy. Frequency increases with wave number.

## Worker Prompt & Notes

## prepared.prompt

## Context
Arcane Bastion's enemies currently have fixed stats per type. An elite modifier system adds replayability by giving random enemies bonus properties starting mid-game. This makes each run feel different and forces adaptive strategy.

## Task
Add an elite/champion modifier system to `games/tower-defense/enemies.js`:

1. **Define Modifiers** — Create a MODIFIERS object with 6 modifier types:
   - **Armored**: +3 armor, draw with metallic silver tint overlay
   - **Swift**: +40% speed, draw with motion blur trail (3 fading afterimages)
   - **Vampiric**: Heals 20% of nexus damage dealt, green health glow
   - **Thorned**: Reflects 10% damage as visual sparks (cosmetic only, no tower damage), spiky outline
   - **Giant**: 2x size, 2x HP, 2x gold reward, thick dark outline
   - **Resistant**: Immune to one random status effect (burn/slow/freeze), show immunity icon

2. **Apply Modifiers** — In `createEnemy()`, roll for elite status:
   - Wave 8-12: 5% chance, max 1 modifier
   - Wave 13-17: 10% chance, max 1 modifier
   - Wave 18+: 15% chance, max 2 modifiers
   - Bosses never get modifiers (they're already special)
   - Store as `enemy.modifiers = []` array

3. **Modifier Effects** — Apply stat changes in createEnemy() after base stats. Apply behavioral effects in updateBehavior() and applyDamage().

4. **Visual Indicators** — In the enemy draw wrapper function (~line 1654):
   - Draw modifier icons above health bar (small colored diamonds)
   - Apply tint/glow based on modifier type
   - Giant modifier scales the canvas before drawing

5. **Modifier Names on Hover** — If tower info panel shows targeted enemy info, include modifier names.

## Key Files
- `games/tower-defense/enemies.js` — createEnemy() (~line 1029), applyDamage() (~line 1064), updateBehavior() (~line 1231), drawEnemy wrapper (~line 1654), drawStatusIndicators() (~line 1606)

## When Done
Close issue: bd close htmlstyleguides-19u --reason="Added 6 elite modifiers with scaling probability and visual indicators"
