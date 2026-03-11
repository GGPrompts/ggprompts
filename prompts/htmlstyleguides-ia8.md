# Implement mana system with active abilities

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-ia8` |
| **Status** | closed |
| **Priority** | 2 |
| **Labels** | ready |
| **Created** | 2026-02-26 03:02:48 |
| **Updated** | 2026-02-26 03:39:45 |

## Description

Activate the unused mana system. Mana generates passively over time and from kills. Add 4-6 active abilities the player can cast: Meteor Strike (AoE damage at target), Blizzard (mass slow in area), Time Warp (slow all enemies temporarily), Nexus Heal (restore nexus HP), Lightning Storm (random chain hits), Fortify (temporary tower buff). Each ability has a mana cost and cooldown. Add ability bar to HUD with hotkeys.

## Worker Prompt & Notes

## prepared.prompt

## Context
Arcane Bastion declares a `mana` variable (engine.js line 38) and has mana HUD elements styled in index.html, but the system is completely unused. Activating it with castable abilities gives players more strategic depth beyond tower placement.

## Task
Implement the mana system with active player abilities in `games/tower-defense/engine.js`:

1. **Mana Economy**:
   - Start with 0 mana, max 100
   - Passive regen: 1 mana/sec during combat
   - Kill bonus: +2 mana per enemy kill, +15 per boss kill
   - Display in existing `#hud-mana` element (already in index.html)

2. **Define 4 Abilities** — Create an ABILITIES object:
   - **Meteor Strike** (30 mana, 15s cooldown): Click to target, deal 200 AoE damage in radius 2.5. Fire explosion visual.
   - **Blizzard** (25 mana, 12s cooldown): Click to target area, 60% slow to all enemies in radius 3 for 4 seconds. Ice particle effect.
   - **Nexus Heal** (40 mana, 30s cooldown): Instant, restore 15 nexus HP. Green glow on nexus.
   - **Lightning Storm** (35 mana, 20s cooldown): Global, 5 random lightning bolts hit random enemies for 80 damage each. Chain lightning visuals.

3. **Ability Bar UI** — Add ability buttons below the tower panel or in the HUD:
   - 4 buttons with hotkeys (Q, W, E, R)
   - Show mana cost, cooldown timer, grayed out when unavailable
   - Clicking an ability enters targeting mode (like tower placement but for ground target)
   - Style with existing CSS variables (--mana-blue, --mana-glow)

4. **Targeting Mode** — When ability is selected:
   - Show range circle following mouse cursor
   - Click to cast at location
   - Right-click or ESC to cancel
   - Cannot cast during build phase

5. **Integration**:
   - Update mana in game loop (passive regen)
   - Add mana reward in kill handler
   - Wire ability effects through ArcaneFX for visuals
   - Add Audio.abilitycast() synth sound (ascending chord)

## Key Files
- `games/tower-defense/engine.js` — mana variable (line 38), game loop, input handling, state machine
- `games/tower-defense/index.html` — #hud-mana display (line 627), .btn-mana CSS (line 146), add ability bar HTML
- `games/tower-defense/effects.js` — spawnParticles(), explosions, for ability visuals
- `games/tower-defense/enemies.js` — applyDamage(), applyStatus() for ability damage/effects

## When Done
Close issue: bd close htmlstyleguides-ia8 --reason="Implemented mana system with 4 active abilities (Meteor, Blizzard, Heal, Lightning Storm)"
