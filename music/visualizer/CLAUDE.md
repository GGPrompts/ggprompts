# Music Visualizer

Canvas-based music visualizer synced to the chiptune song library (57 songs). Pluggable renderer system — new visual styles can be authored independently.

## Architecture

```
music/visualizer/
  index.html              # Hub: full-viewport canvas + overlay UI
  engine.js               # Core: audio, cursor, analysis, canvas, renderer dispatch
  stick-fight-engine.js   # Stick-figure skeleton/pose/ragdoll toolkit
  video-utils.js          # Shared helpers: lerp, clamp01, rand, hexToRgb, rgba, etc.
  video-base-styles.css   # Shared video CSS: resets, canvas, play overlay, back-link
  base-renderer.js        # Factory: beat detection, beatPulse decay, renderer registration
  renderers/
    particle-field.js     # Particle bursts from channel quadrants
    waveform-grid.js      # Scrolling note blocks in horizontal lanes
    spectrum-rings.js     # Concentric rotating rings per channel
    starfield.js          # Music-reactive starfield (also used as landing page bg)
  music-videos/
    index.html            # VHS tape deck video browser
    *-video.html          # 54 individual beat-synced music videos
```

### Engine (`engine.js`) — `window.Visualizer`

Creates an `AudioContext` shared with `ChipPlayer` via `initExternal()`. On song load, normalizes the tracker-native JSON to compact format and runs pre-analysis.

**Pre-analysis** produces:
- `pitchRange` — min/max MIDI across all channels
- `channelRoles` — heuristic role per channel (lead/harmony/bass/percussion)
- `timeline[]` — flattened row-by-row note data for the full sequence
- `energy[]` — 0.0–1.0 per row (note density + pitch spread)
- `sectionChanges[]` — row indices where patterns change
- `totalDuration`, `secondsPerRow`, `secondsPerBeat`

**Song cursor** mirrors ChipPlayer's deterministic timing (`60 / (bpm * rpb)`) from `AudioContext.currentTime`. Computed every frame with fractional interpolation.

**Public API**: `init(canvas)`, `loadSong(json)`, `setRenderer(name)`, `play()`, `stop()`, `setVolume(v)`, `getRendererList()`, `getAnalysis()`, `getSong()`, `addFrameCallback(fn)`, `removeFrameCallback(fn)`

### Dependencies (not modified)

- `music/audio-tracker/playback-engine.js` — ChipPlayer audio engine
- `music/audio-tracker/songs/index.json` — song manifest (title, category, BPM)
- `music/audio-tracker/songs/*.json` — song data files

## Writing a New Renderer

Register on the global `window.Renderers` object. The engine handles all DOM, audio, and timing — renderers just draw.

```js
window.Renderers['my-renderer'] = {
  name: 'Display Name',

  // Called on song load or renderer switch
  init(ctx, width, height, analysis) {
    // Set up internal state, color palettes, etc.
    // `analysis` contains pitchRange, channelRoles, timeline, energy, etc.
  },

  // Called every animation frame during playback
  render(frameData) {
    // Draw to frameData.ctx (already DPR-scaled, cleared)
  },

  // Optional — called on window resize
  resize(width, height) {},

  // Optional — cleanup when switching away
  destroy() {}
};
```

### `frameData` passed to `render()`

| Field | Type | Description |
|---|---|---|
| `ctx` | CanvasRenderingContext2D | DPR-scaled, pre-cleared |
| `width`, `height` | number | CSS pixels (not physical) |
| `dt` | number | Delta time in seconds since last frame |
| `cursor` | object or null | `{ seqIndex, rowIndex, globalRow, fractionalRow, totalFracRow, beat, bar, elapsed, timelineIndex }` |
| `currentNotes` | array | `[ch0, ch1, ch2, ch3]` — each `{ midi, freq, instrument, wave, vol, channel, normalized }` or `null` |
| `analysis` | object | Pre-computed song analysis (see above) |
| `song` | object | Normalized song JSON |

`cursor` is `null` when stopped. `currentNotes[i].normalized` is 0.0–1.0 within the song's pitch range.

The factory also patches these onto `frameData`:

| Field | Type | Description |
|---|---|---|
| `beatPulse` | number | 0-1, set to 1 on beat change, auto-decayed by factory |
| `beatChanged` | boolean | `true` on the frame a new beat arrives |

### Renderer rules

- Never touch DOM or manage audio — just draw on the provided `ctx`
- Use `frameData.analysis.channelRoles` to assign visual meaning to channels
- Use `frameData.cursor.beat` / `fractionalRow` for beat-synced effects
- Use `frameData.analysis.energy[cursor.timelineIndex]` for intensity effects
- Handle `cursor === null` gracefully (idle/stopped state)

### Adding to the hub

1. Create `renderers/my-renderer.js`
2. Add a `<script>` tag in `index.html` before the inline `<script>` block
3. It auto-appears in the renderer dropdown

## Shared Video Modules

Music videos use three shared modules that eliminate boilerplate. All 54 existing videos use this pattern.

### `video-utils.js` — Utility Functions

Window globals (no namespace):

| Function | Signature | Description |
|----------|-----------|-------------|
| `lerp` | `(a, b, t)` | Linear interpolation |
| `lerpExp` | `(current, target, speed, dt)` | Exponential smoothing |
| `clamp01` | `(v)` | Clamp to 0-1 |
| `rand` | `(min, max)` | Random float in range |
| `randInt` | `(min, max)` | Random integer in range (inclusive) |
| `pickRandom` | `(arr)` | Random array element |
| `hexToRgb` | `(hex)` | Returns `{ r, g, b }` |
| `rgba` | `(hex, a)` | Returns `"rgba(r,g,b,a)"` string |

### `video-base-styles.css` — Shared CSS

Provides structural styling for all video pages via CSS custom properties. Each video sets theme values in a small inline `:root` block:

```css
:root {
    --vid-bg: #020810;           /* page background */
    --vid-bg-rgb: 2,8,16;       /* RGB components for rgba() */
    --vid-font: 'Cinzel', serif; /* display font */
    --vid-accent: #00e5cc;       /* accent color */
    --vid-accent-r: 0;           /* accent RGB components */
    --vid-accent-g: 229;
    --vid-accent-b: 204;
}
```

Covers: CSS resets, canvas positioning, play overlay, play button with pulse animation, back-link. Each video keeps only renderer-specific CSS inline.

### `base-renderer.js` — Renderer Factory

`BaseRenderer(slug, displayName, config)` handles renderer registration on `window.Renderers`, beat detection (lastBeat tracking), and beatPulse decay. Config options:

| Option | Default | Description |
|--------|---------|-------------|
| `beatDecay` | `8` | Exponential decay rate for beatPulse |
| `expDecay` | `true` | `false` for frame-based decay (`*= rate`) |
| `init` | required | `function(ctx, w, h, analysis)` |
| `render` | required | `function(frameData)` — factory patches `frameData.beatPulse` and `frameData.beatChanged` |
| `resize` | optional | `function(w, h)` |
| `destroy` | optional | `function()` |

## Writing a New Music Video

### HTML Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Song Name — Music Video</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=YourFont&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="video-base-styles.css">
    <style>
        :root {
            --vid-bg: #020810;
            --vid-bg-rgb: 2,8,16;
            --vid-font: 'Cinzel', serif;
            --vid-accent: #00e5cc;
            --vid-accent-r: 0;
            --vid-accent-g: 229;
            --vid-accent-b: 204;
        }
        /* renderer-specific CSS only */
    </style>
</head>
<body>
    <a href="music-videos/index.html" class="back-link">&larr; Music Videos</a>
    <canvas id="viz-canvas"></canvas>
    <div class="play-overlay" id="play-overlay">
        <div class="play-title">Song Name</div>
        <div class="play-sub">a short description</div>
        <div class="play-btn"></div>
    </div>

    <script src="../audio-tracker/playback-engine.js"></script>
    <script src="engine.js"></script>
    <script src="stick-fight-engine.js"></script>  <!-- only if using stick figures -->
    <script src="video-utils.js"></script>
    <script src="base-renderer.js"></script>
    <script>
    (function() {
        "use strict";
        var W = 0, H = 0, analysis = null;
        var beatPulse = 0, flashAlpha = 0;

        function init(ctx, w, h, anal) {
            W = w; H = h; analysis = anal;
            beatPulse = 0; flashAlpha = 0;
            // ... setup scene ...
        }

        function resize(w, h) { W = w; H = h; }

        function render(frameData) {
            var ctx = frameData.ctx, dt = frameData.dt || 1/60;
            var cursor = frameData.cursor;
            beatPulse = frameData.beatPulse;  // sync from factory

            if (!cursor) { /* draw idle state */ return; }

            var energy = analysis ? (analysis.energy[cursor.timelineIndex] || 0) : 0;

            if (frameData.beatChanged) {
                // spawn effects, trigger animations
            }
            flashAlpha *= Math.exp(-5 * dt);  // renderer manages own flash

            // ... draw scene ...
        }

        BaseRenderer('my-song-video', 'My Song Name', {
            beatDecay: 8,
            init: init, render: render, resize: resize
        });
    })();

    // ── Page bootstrap (same for all videos) ──
    (function() { /* ... see any existing video for the full bootstrap ... */ })();
    </script>
</body>
</html>
```

### Key Patterns

- **Beat sync**: Use `frameData.beatChanged` for one-shot effects (particle bursts, scene changes). Use `beatPulse` (0-1 decaying) for continuous pulsing (glow, size oscillation).
- **Flash**: Manage `flashAlpha` in your closure. Set it on events, decay each frame, draw a full-screen overlay with `ctx.globalAlpha = flashAlpha`.
- **Sections**: Use `analysis.sectionChanges` and `cursor.seqIndex` to map song structure to visual scenes.
- **Energy**: `analysis.energy[cursor.timelineIndex]` gives 0-1 intensity for the current moment.

## Stick Fight Engine (`stick-fight-engine.js`)

Shared stick-figure skeleton, pose, and ragdoll toolkit. Not a renderer — a module that video renderers call into. ES5 IIFE exposing `window.StickFight`.

### Loading

Add the script tag **after** `engine.js` and **before** the inline renderer:

```html
<script src="../audio-tracker/playback-engine.js"></script>
<script src="engine.js"></script>
<script src="stick-fight-engine.js"></script>
<script src="video-utils.js"></script>
<script src="base-renderer.js"></script>
<script>
// Renderer code here (see "Writing a New Music Video" below)
</script>
```

### Quick Start Pattern

```js
// In init():
var figH = H * 0.3;
var groundY = H * 0.78;
var center = W * 0.5;
var spread = Math.min(figH * 1.5, W * 0.15);  // figH-primary, W as safety cap
var a = StickFight.create({ x: center - spread, y: groundY, figH: figH, facing: 1, color: '#8898c8' });
var b = StickFight.create({ x: center + spread, y: groundY, figH: figH, facing: -1, color: '#c09070' });

// On beat:
StickFight.setPose(a, 'lunge');
StickFight.setPose(b, 'block');

// Each frame:
StickFight.updateAll([a, b], dt);
StickFight.drawAll(ctx, [a, b]);
```

### API Reference

| Function | Description |
|----------|-------------|
| `create(opts)` | New figure. Options: `x, y, figH, facing (1/-1), color, lineWidth, poseSpeed, weaponHand, leadSide` |
| `setPose(fig, name)` | Set targets from named pose library |
| `setTarget(fig, key, val)` | Override a single target parameter |
| `computeJoints(fig)` | Returns 13 joint positions (relative to feet at 0,0) |
| `drawFigure(ctx, fig, joints?)` | Draw one figure (joints computed if omitted) |
| `updateFigure(fig, dt)` | Lerp params toward targets (or step ragdoll). Also tracks velocity for gait. |
| `updateAll(figs, dt)` | Batch update |
| `drawAll(ctx, figs)` | Batch draw (auto-handles pose vs ragdoll mode) |
| `goRagdoll(fig, groundY, impulseX, impulseY)` | Switch to Verlet ragdoll physics |
| `attack(attacker, moveName, target)` | Start a combat move with hit detection |
| `choreograph(figA, figB, sequence)` | Create a scripted exchange sequence |
| `advanceChoreography(choreo, dt)` | Step choreography forward |
| `hitStop(fig, frames)` | Freeze pose lerp for N frames (impact freeze) |
| `screenShake(intensity, duration)` | Create shake object for canvas offset |
| `updateShake(shake, dt)` | Step shake decay, read `shake.x`/`shake.y` |
| `freezeFrame(figs, duration)` | Pause all figures temporarily |
| `onContact(callback)` | Register hit callback: `fn(contact, attacker, target)` |
| `lerpExp(cur, tgt, speed, dt)` | Exponential lerp helper |
| `defaultParams()` | Fresh pose parameter object |

### Figure Object

Created by `StickFight.create()`. Key fields:

```
fig.x, fig.y         — world position (feet)
fig.figH             — total figure height in pixels
fig.facing           — 1 (right) or -1 (left)
fig.color            — stroke color
fig.lineWidth        — stroke width (default 3)
fig.params           — current pose parameters (lerped each frame)
fig.targets          — target pose parameters (set by setPose/setTarget)
fig.poseSpeed        — lerp speed (default 10, higher = snappier)
fig.mode             — 'pose' or 'ragdoll'
fig.ragdoll          — Verlet state (null until goRagdoll called)
fig.weaponHand       — 'left' (default) or 'right' — which hand draws the weapon
fig.leadSide         — 'left' (default) or 'right' — forward foot/hand in stance
fig.velocity         — computed lateral velocity in px/s (read-only, set by updateFigure)
fig.lastContact      — last hit contact event or null (set by combat system)
```

### Pose Parameters

All params are numbers, lerped smoothly each frame:

| Param | Range | Effect |
|-------|-------|--------|
| `bounce` | -1..1 | Vertical bob (positive = up) |
| `lean` | -1..1 | Torso lean (positive = forward relative to facing) |
| `armLAngle` | radians | Left arm angle from straight-down (negative = up/forward) |
| `armRAngle` | radians | Right arm angle |
| `elbowLBend` | 0..1 | Left forearm bend |
| `elbowRBend` | 0..1 | Right forearm bend |
| `legSpread` | 0..1 | Stance width |
| `kneeL` | -1..1 | Left knee offset (negative = forward) |
| `kneeR` | -1..1 | Right knee offset |
| `torsoTwist` | -1..1 | Shoulder rotation around spine (positive = left shoulder forward) |
| `hipShift` | -1..1 | Lateral hip displacement |
| `headTilt` | -1..1 | Head tilt left/right |
| `headBob` | -1..1 | Head nod up/down |
| `swordAngle` | radians | Weapon angle (only drawn if swordLen > 0) |
| `swordLen` | 0..1 | Weapon length as fraction of figH (0 = no weapon) |

### Named Poses

`idle` `guard` `lunge` `punch` `kick` `block` `recoil` `dance_basic` `arms_up` `kneel` `fallen` `salute`

Use `setPose` to set all targets at once, then `setTarget` to tweak individual params:

```js
StickFight.setPose(fig, 'guard');
StickFight.setTarget(fig, 'swordAngle', -0.5);  // custom sword position
StickFight.setTarget(fig, 'lean', 0.3);          // lean forward more
```

### Bone Proportions (fractions of figH)

```
headR: 0.07, neck: 0.06, shoulder: 0.09, torso: 0.28,
upperArm: 0.13, forearm: 0.12, thigh: 0.20, shin: 0.19
```

Accessible as `StickFight.BONE`. Total standing height ≈ `shin + thigh + torso + neck + headR*2` = ~0.81 * figH (rest is bounce headroom).

### Joint Names (13 points)

`head` `neck` `shoulderL` `shoulderR` `elbowL` `elbowR` `handL` `handR` `hip` `kneeL` `kneeR` `ankleL` `ankleR`

Positions are relative to (0,0) at the figure's feet, y-negative = up. Use `computeJoints(fig)` to get them, e.g. for attaching effects to a hand or checking sword tip position.

### Ragdoll

Switch a figure to ragdoll mode when it should collapse/fly/tumble:

```js
// On the killing blow:
StickFight.goRagdoll(fig, groundY, impulseX, impulseY);
// impulseX/Y in pixels/sec — e.g. (200, -300) launches up-right
```

- Snapshots current joint positions into 13 Verlet point masses
- Distance constraints keep limbs connected
- Ground collision with configurable bounce (0.3) and friction (0.85)
- Auto-settles after 0.5s of low velocity
- `updateAll` and `drawAll` handle ragdoll figures automatically
- Once ragdolled, the figure stays ragdolled (no automatic recovery)

### Weapons

Figures can hold a sword/weapon. Set `weaponHand` on create, and initialize both params and targets for `swordLen` and `swordAngle`:

```js
var fig = StickFight.create({ x: 100, y: 400, figH: 120, facing: 1, weaponHand: 'left' });
fig.params.swordLen = 0.35;      // MUST set both params AND targets
fig.targets.swordLen = 0.35;
fig.params.swordAngle = -0.8;    // MUST set both — prevents lerp from 0 on first frames
fig.targets.swordAngle = -0.8;
```

The engine draws the blade (silver) from the weapon hand with a guard crossbar (figure color). For attack flash effects (glow on sword tip), handle that in your renderer — see `fencing-match-in-a-thunderstorm-video.html` for the pattern.

### Stance & Handedness

Figures have `weaponHand` ('left'/'right') and `leadSide` ('left'/'right'). Attack moves auto-mirror based on `leadSide` — a `slash` animates the lead arm regardless of which side leads. The engine's `mirrorKeyframes()` handles L↔R swapping.

```js
// Orthodox fencer (left lead, left weapon)
var fencerA = StickFight.create({ weaponHand: 'left', leadSide: 'left', ... });
// Southpaw opponent (right lead, right weapon)
var fencerB = StickFight.create({ weaponHand: 'right', leadSide: 'right', ... });
```

### Locomotion

Figures automatically animate a walk/run gait when moved laterally. The engine tracks `fig.velocity` from frame-to-frame `fig.x` changes and drives foot-plant, pelvis sway, and shoulder counter-rotation. No video code changes needed — just update `fig.x` and the gait activates.

Tunable via `StickFight.GAIT` (velocityThreshold, strideLength, pelvisSwayAmount, etc.).

### Coordinate System

- `fig.y` is the **ground line** (feet position). Figures extend upward (negative y).
- `drawFigure` translates to `(fig.x, fig.y)` internally, so joint coords are local.
- Ragdoll points are in **world coordinates** (no translation needed).
- `facing` flips arm movement direction but not the skeleton — arms that reach "forward" go in the facing direction.

### Integration Tips

- **Non-combat videos** only need `create` + `setPose` + `updateAll` + `drawAll` — no weapons, no ragdoll.
- **Custom poses**: use `setTarget` to tweak individual params after `setPose`, or skip `setPose` entirely and set all targets manually.
- **Beat sync**: call `setPose` on beat changes, let `updateAll(figs, dt)` handle smooth transitions.
- **Multiple figures**: pass arrays to `updateAll` / `drawAll`. Create as many as you need.
- **Scene-specific drawing** (hair, clothing, faces, glow effects) stays in the video renderer — the engine just draws the skeleton.
- **Position movement**: update `fig.x` directly in your renderer (the engine doesn't move figures laterally).

### Pitfalls — Common Bugs to Avoid

**Always set `swordAngle` in every pose/move a weapon-wielding figure can transition through.** If a MOVE's keyframes don't include `swordAngle`, the target stays at whatever the previous move left it. When the arm moves to a new position but the sword angle is stale, the blade extends in the wrong direction — often backward off-screen. Every MOVE that a sword-wielding figure might use (slash, lunge, block, etc.) must include `swordAngle` keyframes that track the arm position.

**Always set both `params` AND `targets` for `swordLen` and `swordAngle` at init.** If you only set `targets`, the params start at 0 and lerp toward the target over the first few frames, causing a visible glitch where the sword pops from nothing or from angle 0.

**Always animate both arms in weapon MOVES.** If a MOVE only sets keyframes for the weapon arm (e.g., `armLAngle`), the off-hand arm stays at its previous position and looks broken/dangling. Fencing moves should set the rear arm to a proper counterbalance position (swept back during lunges, held up during guard).

**Canvas `arc()` wraps the wrong way for `facing = -1`.** When using `ctx.arc(x, y, r, startAngle, endAngle)` for slash trails or sweep effects, and the angles include `* fig.facing`, the arc will take the long way around (~263° instead of ~97°) for left-facing figures. Always pass `fig.facing < 0` as the `anticlockwise` parameter:
```js
ctx.arc(hand.x, hand.y, radius, startAng, endAng, fig.facing < 0);
```

**Use `StickFight.onContact()` for impact FX, not beat events.** Spawning sparks/blood at fixed midpoints or on every beat looks like pantomime. Register a contact callback and spawn FX at `contact.point` for precise, believable impacts.

### Positioning — Think in Body Lengths, Not Screen Fractions

**NEVER** position figures using `W * fraction` (e.g., `x: W * 0.3`). On wide monitors, figures end up impossibly far apart relative to their body size and attack reach.

**ALWAYS** position figures relative to `figH` (body lengths) from a center point:

```js
// GOOD — spacing scales with figure size
var center = W * 0.5;
var spread = Math.min(figH * 2.0, W * 0.2);  // figH drives, W caps for tiny screens
fig.x = center - spread;

// BAD — breaks on ultrawide
fig.x = W * 0.3;
```

This applies to:
- **Initial figure positions** — center ± `figH * N`
- **Arena/clamp bounds** — max half-width from center as `figH * N`
- **Movement speeds** — `figH * 1.5 * dt` not `200 * dt`
- **Spawn offsets** — `arenaEdge - figH * 0.5` not `arenaEdge - 50`
- **Approach/hang distances** — `attackRange + figH * 0.5` not `attackRange + 60`

Use `Math.min(figH * factor, W * fraction)` so layout works on both narrow and ultrawide screens. The `resize()` handler must use the same formula as `init()`.

### Videos Using the Engine

| Video | Pattern |
|-------|---------|
| `fencing-match-in-a-thunderstorm-video.html` | 2 armed fencers, choreograph() + attack() + onContact() sparks |
| `through-the-fire-and-flames-video.html` | 2 warriors + dragon, full combat + gore |
| `system-infection-video.html` | Hero vs enemy waves, arena combat + boss fights |
| `the-duel-at-worlds-end-video.html` | 2 musicians on cliff, performance poses |
| `tavern-brawl-crescendo-video.html` | Patron pairs, choreograph() + pairwise combat + onContact() FX |
| `hollow-choir-ascendant-video.html` | Ritual procession figures |
| `wap-video.html` | Pole + floor dancers, club performance |
| `survivors-*-video.html` (4 videos) | Single survivor figure, poses only |
| `classical-runner-overture-video.html` | Runner figure, poses only |
| `long-december-video.html` | Figures with poses only |
| `the-divas-aria-video.html` | Performance figures |

## Embeddability

Other pages can embed a visualizer background:

```html
<canvas id="bg-viz" style="position:fixed;top:0;left:0;width:100%;height:100%"></canvas>
<script src="music/audio-tracker/playback-engine.js"></script>
<script src="music/visualizer/engine.js"></script>
<script src="music/visualizer/renderers/particle-field.js"></script>
<script>
  Visualizer.init(document.getElementById('bg-viz'));
  fetch('music/audio-tracker/songs/crystal-caves.json')
    .then(r => r.json())
    .then(json => {
      Visualizer.loadSong(json);
      Visualizer.setRenderer('particle-field');
    });
</script>
```

### Frame callbacks for secondary canvases

When the Visualizer is bound to one canvas (e.g. a jukebox) but you want a second canvas to also react to the music, use frame callbacks:

```js
Visualizer.addFrameCallback(function(frameData) {
  // frameData has same fields as render(): ctx, width, height, dt, cursor, currentNotes, analysis, song
  // Draw to your own canvas using the music data (ignore frameData.ctx — that's the primary canvas)
});
```

The starfield renderer uses this pattern: `initStandalone(canvas)` starts its own animation loop, and `onFrame(frameData)` feeds it music data from the Visualizer's frame callback. See `landing.html` for the integration.
