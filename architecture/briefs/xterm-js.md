# xterm.js Architecture Research

**Beads Issue:** hsg-r77j
**Style Guide:** ascii-art
**Folder:** architecture/xterm-js/

## Research Topics

- Terminal emulation layer (VT100/VT220/xterm escape sequences)
- Input parser and state machine (based on Paul Flo Williams' parser)
- Renderer backends (Canvas, WebGL, DOM fallback)
- Buffer architecture (normal buffer, alternate buffer, scrollback)
- Addon system (fit, search, web-links, image, serialize)
- PTY integration patterns (node-pty, WebSocket relay)
- Unicode handling (wcwidth, grapheme clusters)
- Performance optimizations (dirty tracking, GPU rendering)
- Accessibility (screen reader support, live regions)

## Key Public Sources

- xterm.js GitHub repository (github.com/xtermjs/xterm.js)
- xterm.js API documentation
- Source code (TypeScript, well-structured modules)
- Used by: VS Code terminal, Hyper, Theia, Azure Cloud Shell, Tabby
- Daniel Imms (Tyriar, maintainer) blog posts and talks
- DeepWiki architectural analysis (deepwiki.com/xtermjs/xterm.js)
- Paul Flo Williams' VT parser state machine (vt100.net/emu/dec_ansi_parser)

## Findings

### Layered Architecture Overview

xterm.js implements a four-layer architecture separating platform-agnostic logic from browser-specific concerns:

- **Layer 1 -- Foundation**: Platform-agnostic infrastructure including the escape sequence parser state machine, buffer data structures, and dependency injection framework.
- **Layer 2 -- Core Terminal Logic**: Platform-agnostic terminal emulation with `CoreTerminal`, `InputHandler`, `BufferService`, and `OptionsService`. This layer runs independently in Node.js as `xterm-headless`.
- **Layer 3 -- Browser Integration**: Browser-specific services handling DOM manipulation, rendering coordination, viewport scrolling, mouse/keyboard input, and accessibility. The `Terminal` class extends `CoreTerminal`.
- **Layer 4 -- Public API**: Stable API surface exposed in `typings/xterm.d.ts` that external applications depend on.

#### Module Organization

```
src/
  common/              # Platform-agnostic core (runs in Node.js or browser)
    CoreTerminal.ts    # Core terminal logic, extended by browser Terminal
    InputHandler.ts    # Dispatches parser output to handler methods
    parser/            # EscapeSequenceParser state machine
    buffer/            # Buffer, BufferSet, BufferLine, CellData
    services/          # Dependency-injected core services
  browser/             # Browser-specific code
    Terminal.ts        # Extends CoreTerminal with DOM integration
    services/          # RenderService, SelectionService, etc.
    renderer/          # DOM, Canvas, WebGL renderer implementations
  headless/            # Node.js variant (no rendering, no DOM)
addons/                # Official addon packages (12 addons)
typings/               # xterm.d.ts public API declaration
```

The dependency hierarchy is strictly enforced: `common` is the foundation, `browser` and `headless` both depend on `common`, and `browser` does not depend on `headless` or vice versa.

### Dependency Injection and Services

xterm.js uses a service-oriented architecture with dependency injection (DI) through `InstantiationService`, a simplified version of VS Code's DI system. Components depend on interfaces rather than concrete implementations.

#### Core Services (src/common/services/)

| Service | Responsibility |
|---------|---------------|
| **OptionsService** | Manages configuration with validation; fires change events |
| **BufferService** | Manages normal/alternate buffers, scrolling, viewport tracking |
| **CoreService** | Tracks terminal modes, DEC private modes, keyboard state |
| **LogService** | Configurable logging at multiple levels |
| **UnicodeService** | Unicode version handling and character width calculations |
| **CharsetService** | Character set switching (G0, G1, etc.) |
| **OscLinkService** | Processes OSC 8 hyperlink sequences |
| **CoreMouseService** | Mouse tracking modes and event handling |

Services are instantiated via `InstantiationService` which automatically resolves dependencies based on constructor parameter types.

### Input Parser and State Machine

The parser is based on Paul Flo Williams' state machine for DEC-compatible video terminals (documented at vt100.net/emu/dec_ansi_parser). It specifies actions and transitions for every incoming character in every parser state, including C0 controls.

#### Components

- **EscapeSequenceParser** (`src/common/parser/EscapeSequenceParser.ts`): A state machine that recognizes VT sequences (CSI, OSC, DCS, ESC, APC) and dispatches to specialized handlers. Processes input character-by-character with state transitions.
- **InputHandler** (`src/common/InputHandler.ts`): Feeds data to the parser and dispatches output to handler methods organized by sequence type (e.g., `csiHandle_m()` for SGR attributes). Decodes input using `StringToUtf32` or `Utf8ToUtf32` before parsing.
- **WriteBuffer**: Queues incoming data for asynchronous processing, preventing UI blocking. Supports chunked processing with a max buffer length of 131,072 characters.

#### Data Flow: Write Pipeline

```
Input Source (API call or keyboard)
  -> terminal.write()
  -> WriteBuffer (async batching, chunking)
  -> InputHandler.parse()
  -> EscapeSequenceParser (state machine)
  -> Sequence Handlers (CSI/OSC/DCS/ESC/APC)
  -> Buffer Updates via BufferService
  -> Event Emission (onData, onWriteParsed, etc.)
  -> RenderService (browser only, debounced)
  -> Active IRenderer implementation
```

#### Sequence Handler Types

Five handler registration categories, each with a `registerXxxHandler()` API:

1. **CSI** (Control Sequence Introducer) -- e.g., `ESC [ 2 J` for erase display, `ESC [ m` for SGR attributes
2. **OSC** (Operating System Command) -- e.g., `ESC ] 0 ; title ST` for window title
3. **DCS** (Device Control String) -- for device control sequences with payload
4. **ESC** (Escape) -- e.g., `ESC 7` for save cursor
5. **APC** (Application Program Command)

Handlers are probed in reverse registration order. Returning `true` stops the chain; `false` continues to the next handler. Async handlers are supported but incur a throughput cost. OSC/DCS payloads are capped at 10MB.

### Renderer Backends

The rendering system abstracts multiple backends through the `IRenderer` interface. `RenderService` coordinates rendering by debouncing updates, batching changes into single frames, and supporting DEC synchronized output (mode 2026) for flicker-free rendering.

#### DOM Renderer (Default)

Creates HTML elements for visible terminal rows. Simplest implementation but slowest for heavy output.

#### Canvas Renderer (Addon)

Uses multiple layered `<canvas>` elements, each handling a specific concern:

1. **Text Layer** -- Background colors and foreground text (opaque base layer)
2. **Selection Layer** -- Mouse-based text selection highlighting
3. **Link Layer** -- Underlines when hovering over detected links
4. **Cursor Layer** -- Terminal cursor rendering

This separation allows the render engine to repaint only changed layers rather than the entire terminal.

**Texture Atlas**: An `ImageBitmap` containing pre-rendered ASCII characters in common styles. Instead of calling `fillText` per character, the renderer draws from the atlas using `drawImage`, with GPU co-location for speed.

**Dirty Tracking**: A slim internal model stores the minimal information about each cell's drawn state. On each frame, only cells that differ from the model are redrawn. This avoids full-line reconstruction.

#### WebGL Renderer (Addon)

The fastest renderer, using WebGL2 for GPU-accelerated drawing:

- Builds a `Float32Array` containing all data needed to draw the terminal
- Uploads a WebGL program (vertex shader + fragment shader) to the GPU
- The GPU does the actual drawing, freeing the main thread

**Texture Atlas Packing**: Uses multiple active rows, adding glyphs to the most suitable row based on pixel height. Supports multiple 512x512 texture pages that merge up to 4096x4096. When capacity is reached, the atlas clears and restarts (relatively inexpensive). All characters including Unicode and combined characters (emoji) are cached; glyphs are trimmed to minimal rectangles for space efficiency.

### Buffer Architecture

#### Dual Buffer System

- **BufferSet**: Manages two buffers -- normal (default) and alternate screen
- **Normal Buffer**: Default screen for command output; has associated scrollback history
- **Alternate Buffer**: Used by full-screen apps (vim, less, htop); provides a clean slate without disturbing main scrollback. No scrollback maintained for alternate buffer.

Switching between buffers changes the active pointer without data loss.

#### Data Structures

- **Buffer**: Extends `CircularList<BufferLine>` for efficient scrollback management. Lines are overwritten when scrollback limit is reached.
- **BufferLine**: Contains a `_data` field using a `Uint32Array` with 3 elements per column -- provides O(1) column-to-cell mapping. Attributes are bit-packed into foreground/background elements.
- **CellData**: Packed structure storing character code, combined attributes (flags, foreground color, background color), and character width.

#### Key Buffer Properties

- `viewportY` -- Line within the buffer where the top of the visible viewport sits
- `baseY` -- Line where the bottom page starts when fully scrolled down
- `Marker` objects survive line trimming by tracking line indices

The circular list architecture prevents unbounded memory growth while supporting configurable scrollback limits (default 1000 lines).

### Addon System

Addons extend the terminal through the `ITerminalAddon` interface:

```typescript
interface ITerminalAddon {
  activate(terminal: Terminal): void;  // Called on loadAddon()
  dispose(): void;                     // Cleanup: release subscriptions/resources
}
```

Usage: `terminal.loadAddon(new SomeAddon())`. Each addon returns an `IDisposable` for lifecycle management.

#### Official Addons (12)

| Addon | Purpose |
|-------|---------|
| **@xterm/addon-attach** | Connects to a process via WebSocket |
| **@xterm/addon-clipboard** | Browser clipboard integration |
| **@xterm/addon-fit** | Resizes terminal to fit container element |
| **@xterm/addon-image** | Inline image rendering support |
| **@xterm/addon-ligatures** | Font ligature rendering |
| **@xterm/addon-progress** | OSC 9;4 progress reporting API |
| **@xterm/addon-search** | Search through terminal buffer content |
| **@xterm/addon-serialize** | Export buffer to VT sequences or HTML |
| **@xterm/addon-unicode-graphemes** | Enhanced grapheme clustering (experimental) |
| **@xterm/addon-unicode11** | Unicode 11 character width standards |
| **@xterm/addon-web-fonts** | Web font loading and integration |
| **@xterm/addon-webgl** | WebGL2 GPU-accelerated rendering |

Addons can replace subsystems (renderers), add capabilities (image support), or extend parsing (Unicode handling). Third-party addons can be built using only the public API.

### PTY Integration Patterns

xterm.js is a frontend-only library. It connects to backend processes (shells) via a relay architecture:

#### Typical Stack

```
Browser                          Server
xterm.js  <-- WebSocket -->  WebSocket Server  <-->  node-pty (PTY)
                                                        |
                                                     Shell (bash/zsh)
```

- **node-pty**: Spawns a pseudo-terminal process on the server. Keeps the shell session active until explicitly closed.
- **WebSocket**: Bidirectional transport between browser and server.

#### Data Flow Cycle

1. User types in xterm.js -> `onData` event fires -> data sent via WebSocket
2. Server receives data -> writes to `ptyProcess.write()`
3. PTY executes command -> output emitted via `ptyProcess.onData`
4. Server sends output via WebSocket -> xterm.js `terminal.write()`

#### Flow Control

xterm.js processes data at 5-35 MB/s, constrained to avoid blocking the UI thread (targeting <16ms per frame). Three strategies for handling fast producers:

1. **Simple pause/resume**: Pause PTY on each write, resume in callback. Simple but creates excessive context switches.
2. **Watermark-based**: Use high/low watermarks (e.g., HIGH=100K, LOW=10K bytes) to reduce pause/resume frequency.
3. **Batched callbacks**: Create callbacks only every ~100K bytes instead of per-chunk, with pending callback count as the flow control signal.

WebSocket flow control requires custom ACK messages spanning the connection, since the WebSocket protocol has no built-in flow control hooks. A hardcoded 50MB buffer limit exists to prevent memory exhaustion.

### Unicode Handling

#### Current Approach

xterm.js uses a `wcwidth` implementation for character width calculations, similar to most terminal emulators. The `UnicodeService` manages version-specific width tables.

#### Grapheme Cluster Challenges

Full grapheme cluster support is complex because:
- Grapheme clusters join multiple cells that `wcwidth` would output separately into one perceived character
- A following character in a cluster might have `wcwidth != 0`, breaking cursor movement if widths are summed
- The total of individual `wcwidth` values typically exceeds the final cluster's display width

#### Addon Solution

`@xterm/addon-unicode-graphemes` provides experimental grapheme clustering support. The Unicode properties file is generated and versioned. Future plans include moving Unicode handling and base64 decoding into WebAssembly for better performance.

### Performance Optimizations

#### Rendering Performance

- **Dirty row tracking**: Inlined into the InputHandler; only rows that changed since last frame are redrawn
- **Texture atlas**: Pre-rendered character glyphs cached in GPU-friendly format; avoids per-character `fillText` calls
- **Layered canvas**: Separate layers for text, selection, links, and cursor reduce repaint scope
- **Render debouncing**: `RenderService` batches multiple state changes into single animation frames
- **Viewport clipping**: Only visible rows are rendered; scrollback content is not drawn

#### Write Pipeline Performance

- **Async batching**: `WriteBuffer` processes data in chunks (max 131,072 chars) to avoid blocking the UI thread
- **Frame budget targeting**: Processing stays under 16ms per frame for 60fps
- **Burst buffering / time-windowed coalescing**: Reduces GPU usage for environments where power consumption matters

#### Measured Results

The canvas renderer rewrite achieved approximately 5x to 45x speedup depending on the scenario, with secondary benefits including reduced battery consumption. The WebGL renderer provides additional gains by offloading drawing entirely to the GPU.

### Accessibility

#### Screen Reader Mode Design

xterm.js creates an off-screen accessibility tree alongside rendered terminal rows:

- **Virtual list**: Uses `aria-posinset` and `aria-setsize` ARIA attributes without requiring DOM elements for every terminal line
- **Assertive live region**: Announces terminal output as it arrives from the process
- **Animation frame updates**: The accessibility tree updates at up to 60fps, balancing responsiveness with performance

#### Character Announcement Logic

When a key is pressed:
1. The character is added to a queue
2. The keystroke is sent to the process
3. When the echo comes back, xterm.js pops the last value from the queue
4. If the echo matches the queued character, it is suppressed (user already heard the keypress)
5. If they don't match, the queue is cleared and the output is announced

This prevents redundant announcements of echoed input while ensuring generated output is always read.

#### Special Cases

- Tab characters are substituted with spaces since terminals advance the cursor without printing
- The live region announces a maximum of 20 rows and clears when the user types
- Focus listeners on tree boundary elements enable virtual list scrolling during screen reader navigation

### Event System

Events follow the `IEvent<T>` pattern, returning `IDisposable` for cleanup:

| Category | Events |
|----------|--------|
| **Input** | `onData`, `onBinary`, `onKey` |
| **State** | `onCursorMove`, `onResize`, `onScroll`, `onTitleChange`, `onSelectionChange` |
| **Rendering** | `onRender`, `onWriteParsed`, `onDimensionsChange` |
| **Notification** | `onBell`, `onLineFeed` |

### Key Design Patterns

1. **Separation of Concerns** -- Core logic in `src/common/`, browser code in `src/browser/`, headless in `src/headless/`
2. **Dependency Injection** -- Services depend on interfaces via `InstantiationService` (VS Code-style DI)
3. **Strategy Pattern** -- `IRenderer` abstraction allows pluggable rendering backends
4. **Event-Driven Architecture** -- State changes propagate through `EventEmitter` instances
5. **Plugin Architecture** -- Addons integrate through the standardized `ITerminalAddon` interface
6. **Circular Buffer** -- `CircularList` for bounded-memory scrollback management
7. **State Machine** -- Paul Flo Williams' parser model for deterministic escape sequence recognition
8. **Texture Atlas** -- GPU-friendly character caching shared between Canvas and WebGL renderers

### Technologies and Standards

- **Language**: TypeScript (compiled to ES6 modules)
- **Zero runtime dependencies** in the core library
- **Standards implemented**: VT100, VT220, xterm escape sequences, ECMA-48, DEC STD 070
- **Rendering APIs**: DOM, Canvas 2D, WebGL2
- **Accessibility**: ARIA live regions, `aria-posinset`/`aria-setsize` virtual lists
- **Unicode**: wcwidth tables, experimental grapheme clustering, planned WASM acceleration
- **Bundle size**: ~265KB (after v5 refactoring, down 30% from 379KB)
