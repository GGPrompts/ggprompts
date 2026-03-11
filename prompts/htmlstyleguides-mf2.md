# Add weather and environment visual effects

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-mf2` |
| **Status** | closed |
| **Priority** | 3 |
| **Labels** | ready |
| **Created** | 2026-02-26 03:03:22 |
| **Updated** | 2026-02-26 03:30:53 |

## Description

Add atmospheric effects to the map: rain particles during certain waves, fog of war that reveals as towers are placed, subtle day/night tinting cycle across waves (dawn at wave 1, dusk by wave 10, night by wave 15 with reduced visibility). Night could reduce tower range slightly for gameplay impact or just be cosmetic. Add ambient particle effects around portals and nexus.

## Worker Prompt & Notes

## prepared.prompt

## Context
Arcane Bastion's map is visually static — the same stone tiles and glowing paths every wave. Adding atmospheric effects like weather, lighting changes, and ambient particles will make the game feel more immersive and give a sense of progression through the waves.

## Task
Add weather and environment visual effects to the tower defense game:

1. **Rain System** (waves 8-12, 16-18):
   - Spawn rain particles across visible map area
   - Angled streaks falling from top-right to bottom-left
   - Light blue semi-transparent lines
   - 50-100 particles active, recycled from a pool
   - Splashes on ground (tiny expanding circles at impact)
   - Render after map but before enemies in draw order

2. **Day/Night Cycle**:
   - Waves 1-5: Dawn (warm orange-yellow tint, light overlay)
   - Waves 6-10: Day (no tint, full brightness)
   - Waves 11-15: Dusk (purple-orange tint)
   - Waves 16-20: Night (dark blue overlay, reduced brightness)
   - Implement as a semi-transparent fullscreen rect drawn after everything
   - Nexus and portals glow brighter at night (increase emissive alpha)
   - Transition smoothly between phases during build phase

3. **Ambient Portal Particles**:
   - Each spawn portal emits slow-drifting particles in its element color
   - 5-10 particles per portal, lazy circular drift
   - Intensity increases during wave (more particles while enemies spawning)

4. **Nexus Ambient Effect**:
   - Soft pulsing light rings emanating from nexus
   - Pulse speed increases when nexus HP is low (<50%)
   - Color shifts from blue-white (healthy) to red (critical)

5. **Fog Wisps** (night waves only):
   - 3-5 slow-moving fog patches (large semi-transparent white ellipses)
   - Drift across map at ~10px/s
   - Purely cosmetic, do not affect gameplay

## Key Files
- `games/tower-defense/map.js` — draw() function (~line 460), portal rendering, nexus rendering
- `games/tower-defense/engine.js` — render loop, currentWave for day/night cycle
- `games/tower-defense/effects.js` — particle pool system for rain and ambient particles

## When Done
Close issue: bd close htmlstyleguides-mf2 --reason="Added rain, day/night cycle, portal particles, nexus ambiance, and fog wisps"
