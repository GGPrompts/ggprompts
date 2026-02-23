# Music — Mozart's Study

Chiptune music studio with 56+ songs, a sequencer, visualizer, music videos, and a virtual organ. Hub page styled with the Mozart's Study aesthetic (Cinzel/Cormorant Garamond/Crimson Pro, parchment/gold/mahogany).

## Structure

```
music/
  index.html              # Hub page — song browser + tool cards
  CLAUDE.md               # This file
  audio-tracker/          # FamiTracker-inspired sequencer
    index.html            # Sequencer UI
    organ.html            # Cathedral organ virtual instrument
    playback-engine.js    # ChipPlayer audio engine (shared dependency)
    synth.js              # Synthesizer module
    songs/
      index.json          # Song manifest (title, description, BPM, category)
      *.json              # Individual song files
  visualizer/             # Canvas visualizer
    CLAUDE.md             # Renderer authoring guide
    index.html            # Visualizer UI (full-viewport canvas + overlay)
    engine.js             # Core engine (audio, cursor, analysis, renderer dispatch)
    stick-fight-engine.js # Stick-figure skeleton/pose/ragdoll toolkit
    video-utils.js        # Shared helpers (lerp, rand, hexToRgb, rgba, etc.)
    video-base-styles.css # Shared video CSS (resets, canvas, play overlay)
    base-renderer.js      # Factory (beat detection, beatPulse decay, registration)
    renderers/            # Pluggable renderer modules
    music-videos/         # Beat-synced music videos
      index.html          # VHS tape deck video browser
      *-video.html        # Individual video files (54 videos)
```

## Hub Page (index.html)

- Loads song data dynamically from `audio-tracker/songs/index.json` via fetch()
- Song browser with search, category filter, and sortable columns (title/BPM/category)
- Action buttons per song: Tracker, Visualizer, Video (if available)
- Video availability determined by a JS lookup set (not all songs have videos)

## Cross-References

Games that use music resources (e.g., Survivors arena themes) reference files via `../../music/audio-tracker/` relative paths.

## Instrument Wave Types

The synth engine (`synth.js`) supports these wave types: `sine`, `square`, `sawtooth`, `triangle`, `pulse25`, `pulse12`, `noise`, `fm`, `pluck`.

**Do NOT use `"wave": "pluck"`** — the Karplus-Strong pluck synthesis sounds bad. Use `"wave": "fm"` instead for all guitar, harp, and plucked-string instruments. FM synthesis produces cleaner, more musical tones.

### FM Guitar/String Recipes (from Spanish Guitar)

```jsonc
// Nylon Guitar — warm, mellow
{ "wave": "fm", "fmRatio": 1, "fmDepth": 120, "fmWave": "sine",
  "filterType": "lowpass", "filterFreq": 2200, "filterQ": 0.8,
  "a": 0.002, "d": 0.45, "s": 0.05, "r": 0.3, "vol": 0.7 }

// 12-String Guitar — chorus shimmer (detuned pair)
{ "wave": "fm", "fmRatio": 1, "fmDepth": 140, "fmWave": "sine",
  "detuneOsc": true, "detuneAmount": 7,
  "a": 0.002, "d": 0.4, "s": 0.05, "r": 0.25, "vol": 0.55 }

// Crystal Harp / Pizzicato — bright, bell-like
{ "wave": "fm", "fmRatio": 2, "fmDepth": 200, "fmWave": "sine",
  "a": 0.001, "d": 0.6, "s": 0.05, "r": 0.4, "vol": 0.6 }

// Pluck Bass — deep, warm
{ "wave": "fm", "fmRatio": 1, "fmDepth": 80, "fmWave": "sine",
  "filterType": "lowpass", "filterFreq": 1600, "filterQ": 0.8,
  "a": 0.003, "d": 0.3, "s": 0.1, "r": 0.18, "vol": 0.55 }
```

**FM params guide:** `fmRatio` sets harmonic character (1=warm, 2=bell-like, 3+=metallic). `fmDepth` controls brightness (80=mellow, 200=bright, 500=harsh). Add `detuneOsc`/`detuneAmount` for chorus width.

## Adding a New Song

1. Create the song JSON in `audio-tracker/songs/`
2. Add an entry to `audio-tracker/songs/index.json`
3. The hub page picks it up automatically (no hub page edits needed)
4. Optionally create a video in `visualizer/` and add its slug to the VIDEO_SLUGS set in `index.html`
