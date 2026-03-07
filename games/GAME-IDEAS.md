# Game Ideas

Each game is a single self-contained HTML file styled with one of the 103 style guide aesthetics. Same rules as the rest of the project: inline CSS/JS, Google Fonts only, no frameworks.

---

## Tier 1 — Strongest Pairings

### 1. retro-terminal — Typing Arena
Port of the existing typing game from model-arena. Hacker-green CRT aesthetic, scanlines, phosphor glow. Type words before they reach the bottom. Survival, time attack, and boss modes.

### 2. pixel-art — Space Invaders
Classic arcade shooter in 8-bit NES palette. Move left/right, shoot descending aliens. Pixel-perfect sprites drawn with CSS or canvas. Chiptune-style Web Audio bleeps.

### 3. windows31 — Minesweeper
Faithful minesweeper clone in the classic Windows 3.1 beveled gray UI. Right-click to flag, left-click to reveal. Smiley face button, digital counter, the works.

### 4. circuit-board — Wire Puzzle
Rotate tile pieces to connect circuits from source to destination on a PCB-green grid. Copper traces light up when connected. Progressively larger boards.

### 5. air-traffic-control — Flight Director
Guide planes to runways by drawing flight paths on a radar scope. Planes appear as blips, you click to set waypoints. Don't let them collide. Green-on-black radar aesthetic.

### 6. jrpg-menu — Turn-Based Battle
Classic JRPG encounter system. Blue dialog boxes, gold text, menu-driven combat (Attack/Magic/Item/Run). Fight pixel-art monsters with a party of heroes. Simple stat math under the hood.

---

## Tier 2 — Great Fits

### 7. op-art — Pattern Memory
Simon-says style memory game using op-art optical illusion patterns. Each round adds a pattern to the sequence. Bold black/white with color accents. Disorienting visual effects on mistakes.

### 8. cyberpunk — Hack the Mainframe
Code-breaking puzzle game. Decrypt passwords by selecting correct sequences from a grid of hex characters (Fallout terminal style). Neon pink/cyan glows, glitch effects on wrong guesses.

### 9. bauhaus — Tangram
Drag and rotate geometric shapes (circles, triangles, rectangles) in primary colors to fill a target silhouette. Clean grid layout, minimal UI. Difficulty scales with shape count.

### 10. blueprint — Tower Defense
Place turrets on a technical blueprint grid to stop waves of enemies following a marked path. Blueprint-cyan aesthetic with technical annotations. Upgrade trees shown as engineering specs.

### 11. synthwave — Rhythm Dodge
Obstacles scroll toward you in sync with a procedural beat. Tap arrow keys to dodge left/right/duck/jump. Combo meter builds the synthwave sunset backdrop. Miss and the sun sets.

### 12. rts-hud — Resource Commander
Simple resource management game in a StarCraft-style HUD. Collect minerals, build structures, train units. Top-down mini-map view. Metallic panel UI with amber status indicators.

---

## Tier 3 — Fun Concepts

### 13. dark-academia — Word Detective
Given a passage from classic literature with a word missing, pick the correct word from four choices. Moody burgundy/gold library aesthetic. Streak multiplier for consecutive correct answers.

### 14. astronomical — Asteroid Navigator
Fly a ship through an asteroid field using arrow keys. Procedurally generated rocks drift across a starfield. Survive as long as possible. Telescope/observatory UI frame.

### 15. aquarium — Fish Feeder
Click to drop food for fish swimming across the screen. Different fish need different food types. Fish physics with gentle drift. Bioluminescent deep-sea palette. Zen/casual gameplay.

### 16. moroccan — Tile Pattern Match
Match-3 style game using Moroccan geometric tile patterns instead of colored gems. Tiles rotate and lock into zellige mosaic patterns. Warm spice palette.

### 17. pop-art — Whack-a-Mole
Faces pop up from a grid, click them before they disappear. Bold primary colors, Ben-Day dots, comic-style "POW!" "BAM!" on hits. Speed increases over time.

### 18. chalkboard — Math Blitz
Rapid-fire arithmetic problems written in chalk. Answer before the timer erases them. Chalk dust particles on correct answers. Squeaky sound effects.

### 19. newspaper — Crossword
Mini crossword puzzle (5x5 grid) with clues styled as newspaper columns. Black and white newsprint aesthetic with serif typography. New puzzle each play.

### 20. celtic — Knot Untangler
Untangle overlapping lines by dragging nodes until no lines cross. Celtic knot decoration around the border. Green/gold palette. Knot complexity increases per level.

---

## Wild Cards

### 21. psychedelic — Color Trip
Avoid the walls of a winding, color-shifting tunnel. The deeper you go, the more the colors swirl and the controls drift. 60s poster aesthetic with melting text.

### 22. noir — Detective Noir
Text-adventure detective game. Investigate a crime scene by choosing actions from a menu. Film noir high-contrast aesthetic, rain effects, jazz piano Web Audio soundtrack.

### 23. stained-glass — Jigsaw
Assemble stained glass window pieces by dragging fragments into place. Pieces snap when close. Light shines through completed sections. Cathedral color palette.

### 24. cottagecore — Garden Sim
Plant seeds, water them, watch them grow in real-time (accelerated). Arrange your garden plot. Cozy cream/sage palette with hand-drawn flower sprites.

### 25. dos-bios — Boot Sequence
Fake computer boot sequence where you have to type the correct BIOS commands to "fix" the system before it crashes. Amber monochrome. Each level is a harder system failure.

### 26. pixel-art — Twisted System (Fusion Frenzy tribute)
Side-view of a spinning corkscrew track. Players run in place on top while obstacles scroll toward them — low barriers (jump) and high barriers (duck). Each hit pushes you back along the track; 4-5 hits and you fall off the edge. Corkscrew speeds up over time, obstacles get denser.

**2-player local multiplayer:**
- P1: W (jump) / S (duck)
- P2: Up arrow (jump) / Down arrow (duck)

**Solo survival mode** as an alternative — just see how long you last.

Round-based (best of 3 or 5), last one standing wins. Chunky pixel sprites, screen shake on hits, chiptune-style Web Audio. Could also work with the JRPG style guide for a more polished RPG-character look.

### 27. sketch / parchment — Dungeon Roguelike
Page-per-room roguelike where each HTML page is a different room/level. Navigate between rooms via links, fight enemies, collect loot. Inventory and stats persist via localStorage. Procedural generation possible with a seed in the URL (`room.html?floor=3&seed=42`). Permadeath uses sessionStorage so closing the tab ends the run. Could lean into a hand-drawn notebook aesthetic (sketch) or aged manuscript look (parchment).

### 28. marble / rts-hud — Marine Micro Survival
Tactical micro game: command 10 self-healing marines against endless enemy waves. Position units by dragging, rotate wounded marines to the back to regenerate. Rock-paper-scissors counter system (Blast > swarm, Pierce > armored, Shock > shielded) with ~20-25% damage bonus for correct matchups. Waves mix enemy types forcing constant repositioning. No menus, no upgrades — pure micro. High score is wave survived. Marble aesthetic for a Roman legion feel, or rts-hud for a StarCraft vibe.

---

## Meta Concept — RPG Overworld Hub

An RPG that uses the arcade games as contextual minigame encounters. Walk around a pixel-art overworld, and when you interact with things, you drop into the relevant game from the arcade.

### Encounter Examples
- **Fall into a lake** → Bubble Gauntlet (swim your way out)
- **Sit at a computer terminal** → Retro Typing Arena
- **Enter a cathedral** → Cathedral Breakout (shatter the windows)
- **Wander into a haunted forest** → Forest Survivors
- **Get abducted by aliens** → Cosmic Survivors
- **Jack into cyberspace** → Cyberpunk Survivors
- **Find a sewing kit** → Stitch Puzzle (solve to craft an item)

### RPG Integration
- **Score → Rewards**: Higher minigame score = more gold, XP, or better item drops
- **Threshold gates**: Need X score to "pass" an encounter and progress the story
- **Optional replays**: Revisit any encounter for farming, with scaling difficulty
- **Inventory tie-ins**: RPG items could grant starting powerups in minigames (e.g., "Coral Shield" = start Bubble Gauntlet with a shield bubble)

### Architecture
Overworld could be a separate HTML file with a simple tile-based map engine. Encounters launch the existing game files in an iframe or navigate to them with a return URL param. Score passes back via localStorage or URL hash. Each game stays self-contained — the RPG is just the glue.

---

## Standalone Concept — PvP Survivors

A multiplayer browser game that combines survivors-style PvE farming with PvP battle royale. Not tied to the single-file HTML constraint — this would be a proper client/server project.

### Core Loop
Survivors PvE farming meets PvP combat. All players farm mobs to level up, then fight each other. Mirror-class matches where everyone has the same kit, so skill expression comes from micro efficiency, positioning, and vision control.

### Mirror Matches Only
- Every player in a match plays the same class — completely sidesteps PvE/PvP balance problems
- Class rotates between matches to keep the meta fresh
- Class revealed at queue time so nobody can "main" anything
- Pure execution and decision-making, no "you picked the broken class" complaints
- Same philosophy as StarCraft mirror matches — identical tools, skill decides

### Fog of War + Peek Mechanics
- Top-down with StarCraft-style fog of war and vision radius
- Players in trees/cover see approaching enemies before being seen (detection advantage while stationary in cover)
- Audio cues of nearby fighting (weapon sounds, enemy deaths) create tension before visual contact
- "Someone's close — do I push or hide?"
- Inspired by the StarCraft custom map "Paintball" — all ghosts, tree-filled map, peek from behind cover

### Powerup-Forced Movement
- Randomly spawning powerups force players out of safe camping positions
- Creates natural convergence points without needing a shrinking circle
- Self-balancing: ahead players can skip risky pickups, behind players are incentivized to take risks
- Tiered spawns:
  - **Common** — frequent, small edges, low risk
  - **Rare** — announced to all with a map ping, worth fighting over
  - **Mega** — one mid-game event forcing a teamfight at a known location
- Same design as Halo power weapon spawns or battle royale care packages — the game says "here's something valuable, fight over it"

### Early Game PvE Farming Phase
- Players start spread out with breathing room to farm mobs
- Farming rewards pure micro — kiting efficiency, pickup routing, XP maximization
- Two players with the same class: one hits level 8 through efficient play, the other is level 6 from sloppy pathing
- That's a real but recoverable advantage, not a blowout

### Respawn System (Paintball Style)
- Quick respawns (~5 seconds), low friction
- Die, respawn, go again — no frustration spiral
- Keeps player count up and the map active
- High fun density, always something happening

### Why This Works (Genre Fusion)
The survivors genre has a scaling problem — once 200+ enemies are on screen, individual skill expression is meaningless (just kite in circles). Active aimed skills feel great early but become a liability when you can't stop moving. The PvP element solves this:
- Mobs are the economy/leveling system, not the challenge
- Other players create the real skill expression moments
- You save your big cooldown for the player fight, not the 200th zombie
- Build diversity from survivors (weapon/passive choices) creates "what did they pick" PvP mind-games

### Proven Ingredients
- Survivors farming loop (proven addictive)
- Battle royale convergence pressure (proven format)
- ARPG build variety (proven depth)
- PvPvE tension (proven in Hunt: Showdown, The Division Dark Zone)
- POE ran a survivors PvP event on April Fools — was extremely popular but never came back

### Technical Architecture

**Browser-based** — no download, no install, just a URL. Zero friction.

- **Client:** Canvas + vanilla JS for rendering, Web Audio for sound
- **Server:** Node.js with WebSockets, server-authoritative game state
- **Networking:** Clients send inputs (move direction, skill casts with coordinates), server validates and broadcasts. Client-side prediction + interpolation for responsive feel.
- **No host advantage:** Dedicated server is critical. Host at 0ms vs others at 50-150ms ruins peek/reaction gameplay. For a survivors-paced game, 20-30 tick rate with 50ms tolerance feels fine.

**Hosting options (cheap):**
- Fly.io / Railway — game instances on demand, pay per use
- Cloudflare Workers + Durable Objects — edge-located WebSockets
- Hetzner — dirt cheap dedicated servers
- 10-20 player matches = tiny bandwidth, dozens of matches on a single $5/month VPS

**AI-assisted development:**
- Claude — architecture, game design, balance systems
- Gemini — visual assets, shaders, particle effects
- Codex — networking layer, server auth, matchmaking
- Browser/JS stack has deepest AI training data vs niche engines like Godot/GDScript

### Monetization (Non-Predatory)
- No pay-to-win
- Cosmetics-only or $5 battle pass
- Fair game that respects player time
- Stands out in a market saturated with whale-hunting mobile clones

### Design Influences
- **StarCraft** — mirror matches, fog of war, Paintball custom map
- **Vampire Survivors / Halls of Torment** — wave-based PvE farming loop
- **Halo** — power weapon map control driving player flow
- **Hunt: Showdown / The Division Dark Zone** — PvPvE tension
- **Path of Exile April Fools Survivors Event** — temporary PvPvE, low-stakes fun
- **Kane's Wrath / C&C** — competitive RTS depth and balance philosophy
