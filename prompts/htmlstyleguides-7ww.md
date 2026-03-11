# Add endless mode after wave 20

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-7ww` |
| **Status** | closed |
| **Priority** | 3 |
| **Labels** | ready |
| **Created** | 2026-02-26 03:02:50 |
| **Updated** | 2026-02-26 04:04:14 |

## Description

After completing wave 20 (victory), offer an 'Endless Mode' option that continues with infinitely scaling waves. Enemies keep getting stronger with exponential HP/speed/armor scaling. Track and display a high score (waves survived). Introduce new enemy compositions at milestone waves (25, 30, 40, 50). Boss waves continue every 5 waves with scaling stats.

## Worker Prompt & Notes

## prepared.prompt

## Context
Arcane Bastion ends at wave 20 with a victory screen. Many TD fans want to keep pushing their builds to see how far they can go. Endless mode provides that infinite challenge after the main campaign.

## Task
Add endless mode to `games/tower-defense/engine.js` and `enemies.js`:

1. **Victory Screen Option** — After wave 20 victory:
   - Show current victory stats
   - Add "Continue to Endless Mode" button alongside "Back to Menu"
   - Clicking endless sets `endlessMode = true` and resumes from wave 21

2. **Endless Wave Scaling** (in enemies.js `getWave()`):
   - HP scaling continues exponentially: `hpMult = 1.0 + (wave-1)*0.08 + pow(wave/12, 1.6)*0.4`
   - Speed caps at 2x base speed to remain playable
   - Armor: `floor(wave/4)` (slightly faster than normal)
   - Enemy count: grows to `min(80, 5 + floor(wave*2.5))` — higher cap
   - Boss every 5 waves (cycle through the 4 boss types with increasing stats)
   - New enemy mix: all types available, weighted toward harder types

3. **Endless Boss Rotation** — Waves 25, 30, 35, 40... cycle bosses:
   - Wave 25: Infernal Lord (3x stats)
   - Wave 30: Crystal Hydra (3x stats)
   - Wave 35: Lich King (3x stats)
   - Wave 40: Shadow Dragon (3x stats)
   - Wave 45+: Dual bosses (2 bosses at once!)

4. **Milestone Rewards**:
   - Every 5 waves in endless: bonus gold = wave * 10
   - Wave 30, 40, 50: play Audio.waveComplete() fanfare

5. **HUD Updates**:
   - Show "ENDLESS" badge next to wave counter
   - Track and save best endless wave in localStorage (separate from normal best)
   - Show endless best on menu screen

6. **Game Over** — Normal game over when nexus dies. Show "Endless Wave X" in stats.

## Key Files
- `games/tower-defense/engine.js` — victory handler, state machine, totalWaves variable (line 40), localStorage save/load
- `games/tower-defense/enemies.js` — getWave() (~line 1432), boss wave definitions (~line 1415), scaling formulas
- `games/tower-defense/index.html` — victory screen HTML (~line 685), menu screen for endless best display

## When Done
Close issue: bd close htmlstyleguides-7ww --reason="Added endless mode with infinite scaling, boss rotation, and milestone rewards"
