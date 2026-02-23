# Tools

Interactive creative editors. Hub page at `tools/index.html` uses **Rococo** styling (pastel/gold/ornamental). Individual tools use their own aesthetic.

## Structure

```
tools/
  index.html              # Hub page (Rococo-themed card grid)
  CLAUDE.md               # This file
  animator/               # Stick Figure Animation Studio
    index.html            # Editor UI (Darkroom-themed)
    animator-engine.js    # Core: figure CRUD, IK solver, keyframes, undo/redo, save/load
    timeline.js           # Timeline UI: keyframe strips, scrubber, playback
    gif-export.js         # Pure-JS GIF encoder (LZW + median-cut quantizer)
```

## Stick Figure Animation Studio

Full-featured pose & keyframe animation editor for stick figures. Darkroom theme (`#0d0a08` background, safelight red accents, Special Elite + IBM Plex Mono fonts).

### Dependencies (loaded via `<script>`, not modified)

- `music/visualizer/stick-fight-engine.js` — `window.StickFight` (skeleton, poses, joint computation)
- `music/visualizer/video-utils.js` — `lerp`, `clamp01`, `rand`, etc.

### Editor Layout

CSS Grid: `grid-template-columns: 140px 1fr 260px; grid-template-rows: 44px 1fr 180px`

- **Toolbar** (top, full width): New, Open, Save, Export GIF, Undo, Redo
- **Figures Panel** (left): List of figures with color swatches, add/remove
- **Canvas** (center): Dark background with red grid lines, joint handles glow red
- **Properties Panel** (right): Figure props (name, color, height, facing, sword), pose presets, 14 parameter sliders, keyframe properties
- **Timeline** (bottom, full width): Canvas-rendered ruler, per-figure keyframe tracks with diamond markers, scrubber, playback controls

### Module Architecture

#### `animator-engine.js` — `window.AnimatorEngine`

Core logic, no DOM. Key exports:

| Function | Description |
|----------|-------------|
| `createFigure(opts)` | Wraps `StickFight.create()` with gait disabled + animator metadata (`_animId`, `_animName`) |
| `solveIK(fig, jointName, targetWX, targetWY)` | Inverse kinematics — adjusts fig.params to move a joint toward target |
| `captureFigureState(fig)` | Snapshot position + all params |
| `applyFigureState(fig, state)` | Restore a snapshot (sets both params and targets) |
| `interpolateStates(stateA, stateB, t)` | Lerp between two states |
| `createKeyframe(time, figures)` | Captures all figures into a keyframe |
| `sampleAnimation(animation, time, figures)` | Applies interpolated poses at a given time |
| `getAnimationDuration(animation)` | Max keyframe time + duration |
| `pushHistory / undo / redo` | 80-level undo/redo stack |
| `saveToJSON / loadFromJSON` | Serialize/deserialize animation data |
| `autosave / loadAutosave` | localStorage persistence |
| `drawHandles(ctx, fig, selectedJoint)` | Red glowing joint circles |
| `drawOnionSkin(ctx, fig, state, tint, alpha)` | Ghost frame rendering |
| `applyPose(fig, poseName)` | Apply named pose directly to params (no lerp) |

#### IK Solver Details

The StickFight engine only has forward kinematics (params → joints). The animator's IK solves analytically per joint group:

- **Arms** (hand/elbow drag): 2-bone IK via law of cosines. Computes `armAngle` from atan2 shoulder→target, `elbowBend` from triangle inequality.
- **Legs** (knee/ankle drag): Adjusts `kneeL`/`kneeR` offset and `legSpread`.
- **Head**: Maps drag delta to `headTilt` and `headBob` relative to neck.
- **Body** (hip/torso/neck): Adjusts `lean`, `bounce`, `hipShift`, `torsoTwist`.

Gait is disabled (`fig.gaitInfluence = 0`) in the editor to prevent locomotion interference.

#### `timeline.js` — `window.Timeline`

Canvas-rendered timeline UI. Key exports:

| Function | Description |
|----------|-------------|
| `init(opts)` | Creates canvas inside container, binds events |
| `play / pause / stop / togglePlay` | Playback via `requestAnimationFrame` |
| `stepForward / stepBackward` | Jump between keyframes |
| `setTime(t) / getTime()` | Scrubber position |
| `setSpeed(s) / setLoop(v) / setOnion(v)` | Playback options |
| `setAnimation(anim) / setFigures(figs)` | Update data references |

Keyframe diamonds are hit-testable and draggable. Ruler zoom via Ctrl+wheel, scroll via wheel.

#### `gif-export.js` — `window.GIFExport`

Pure-JS GIF89a encoder, no CDN dependencies:

- **Median-cut quantizer**: Reduces to 256 colors via recursive channel subdivision
- **LZW encoder**: Standard GIF compression with 12-bit code limit
- **`exportGIF(opts)`**: Returns `Promise<Blob>`. Renders frames to offscreen canvas, yields every 4 frames for UI responsiveness.
- **`downloadBlob(blob, filename)`**: Triggers browser download

### Animation Data Format (JSON)

```jsonc
{
  "version": 1,
  "name": "My Animation",
  "canvas": { "width": 800, "height": 600, "bgColor": "#0d0a08" },
  "figures": [
    {
      "id": "fig-a3x9k",
      "name": "Fighter A",
      "figH": 120, "color": "#c43c3c", "lineWidth": 3,
      "facing": 1, "weaponHand": "left", "swordLen": 0
    }
  ],
  "keyframes": [
    {
      "id": "kf-1",
      "time": 0,
      "duration": 0.5,
      "easing": "smooth",
      "figureStates": {
        "fig-a3x9k": {
          "x": 200, "y": 450, "facing": 1,
          "params": { "bounce": 0, "lean": 0.15, "armLAngle": -0.8, ... }
        }
      }
    }
  ]
}
```

### Playback & Interpolation

During playback, the editor does NOT call `StickFight.updateFigure()` (that would fight interpolation). Instead:
1. Finds surrounding keyframes for current time
2. Computes interpolation factor with easing (`smooth` = cubic smoothstep, `linear`, `snap` = hold then jump)
3. Lerps all params + position directly onto `fig.params` and `fig.targets`
4. Calls `StickFight.drawAll()` only

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Space | Play/pause |
| Left/Right arrows | Step to prev/next keyframe |
| Ctrl+Z | Undo |
| Ctrl+Shift+Z / Ctrl+Y | Redo |
| Ctrl+S | Save JSON |
| Delete/Backspace | Delete selected keyframe |

### Adding a New Tool

1. Create a subdirectory under `tools/` (e.g., `tools/my-tool/`)
2. Add an `index.html` — can use any aesthetic/theme
3. Add a card to `tools/index.html` (Rococo styling, gold gradient top border)
4. Reference any shared modules via relative paths (e.g., `../../music/visualizer/video-utils.js`)
