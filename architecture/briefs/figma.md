# Figma Architecture Research

**Beads Issue:** hsg-umum
**Style Guide:** gradient-mesh
**Folder:** architecture/figma/

## Research Topics

- Multiplayer collaboration (CRDTs and operational transforms)
- WebAssembly rendering engine (C++ compiled to Wasm)
- Canvas rendering pipeline (WebGL)
- Plugin architecture and sandbox
- Component and design system infrastructure
- Real-time sync protocol
- File format and version history
- Dev Mode and code generation pipeline

## Key Public Sources

- Figma Engineering blog (figma.com/blog/engineering)
- "How Figma's Multiplayer Technology Works" blog post
- "Rust in Production at Figma" talk
- "Building a Professional Design Tool on the Web" (Evan Wallace, CTO)
- Figma plugin API documentation
- "Making Multiplayer More Reliable" blog post
- "Figma's Journey to TypeScript" blog post
- "Figma Rendering: Powered by WebGPU" blog post
- "How We Built the Figma Plugin System" blog post
- Andrew Chan's "Notes From Figma II: Engineering Learnings"
- Browsertech Digest: "Figma is a File Editor"

## Findings

### 1. Rendering Engine (C++ / WebAssembly / WebGL / WebGPU)

**Core Architecture**: Figma uses a hybrid C++/JavaScript architecture designed by co-founder and former CTO Evan Wallace. The document representation and canvas rendering run in C++, while the UI surrounding the canvas uses TypeScript + React. The C++ renderer is compiled to WebAssembly (Wasm) via **Emscripten** for the browser, and also compiled natively to x64/arm64 for server-side rendering, testing, and debugging.

**Evolution of Compilation**:
- Originally compiled C++ to **asm.js** (a strict subset of JavaScript)
- Migrated to **WebAssembly** in 2017, cutting load time by 3x regardless of document size
- Wasm still limited to 32-bit addressing (4GB max memory) and grow-only memory model, which causes issues on mobile (OOM kills after activity spikes)

**Rendering Pipeline**: A highly-optimized **tile-based GPU renderer** built from scratch using WebGL (originally WebGL 2.0 / OpenGL ES 3.0). Handles curves (Loop-Blinn algorithm), images, blurs, masking, blending, dithered gradients, blend modes, nested layer opacity — all GPU-rendered and fully anti-aliased. Bypasses the browser's HTML rendering pipeline entirely to work directly with the graphics card. Despite running in a browser, Figma's renderer was often faster than competitors' native applications.

**WebGPU Migration (2023+)**: Figma upgraded from WebGL to **WebGPU** (Chromium shipped WebGPU support in 2023). Key improvements:
- **Compute shaders** move work from CPU to GPU (e.g., blur rendering)
- **WGSL** shading language replaces GLSL
- **MSAA** (Multi-Sample Anti-Aliasing) support
- Explicit draw-call arguments, uniform buffer batching, dynamic device-compatibility fallback system
- Careful rollout monitoring across device types to maintain performance baselines

**Custom Subsystems**: Because Figma built its own renderer, they also had to build custom implementations of things browsers normally provide — e.g., their own color picker (since browser APIs like EyeDropper were insufficient).

### 2. Custom Programming Language (Skew)

Figma originally used **Skew**, a custom statically-typed, object-oriented language created by Evan Wallace that compiled to JavaScript. Key features:
- **Sound type system** with nominal typing (no monkey-patching, no prototypes)
- **Wrapped types**: zero-cost abstractions extending primitive types with methods compiled to global functions
- **Real 32-bit integers** leveraging asm.js browser engine optimizations
- **Compiler optimizations**: devirtualization, inlining, aggressive constant folding, dead code elimination — possible because the sound type system eliminated JavaScript dynamism

Skew was used for the mobile rendering/playback engine. It was abandoned because it created onboarding friction and lacked external ecosystem support. Migration to TypeScript was done in 3 phases using a custom transpiler. The migration became feasible because WebAssembly adoption meant the C++ engine replaced many core Skew components, reducing the performance cost of moving to TypeScript.

### 3. Multiplayer Collaboration & Real-Time Sync

**Architecture**: Client/server model. Figma clients (web pages) connect to a cluster of servers over **WebSockets**. The server spawns a separate process for each multiplayer document; all users editing that document connect to the same server process.

**Conflict Resolution**: Figma chose **neither pure OT nor pure CRDT** — they built a custom system inspired by CRDTs but simpler. Every document is a tree of objects (similar to the HTML DOM) with a single root node. Each object has properties that use **last-writer-wins (LWW)** semantics. Object creation uses a mechanism similar to a **last-writer-wins set** in CRDT literature. Clients generate globally unique IDs for new objects.

**Server Role**: The server is the **single authority** for each document. It receives operations via WebSocket, validates against authoritative state, resolves conflicts, and broadcasts validated operations to all connected clients. The server maintains an in-memory copy of the document.

**Sync Protocol**: Clients send updates every **33ms (30 FPS)**. The server batches these for journaling. The serialization format is **Kiwi**, a schema-based binary format created by Evan Wallace — similar to Protocol Buffers but simpler, more compact, with better optional field support. Variable-length encoding for numeric values, zero-overhead nested structs, single-scan read/write operations.

**Undo/Redo**: Custom model where undo modifies redo history at the time of undo (and vice versa), ensuring that undo-many → copy → redo-all leaves the document unchanged.

**Server Language**: Originally written in **TypeScript**, then rewritten in **Rust** for an order-of-magnitude performance improvement and better resource usage. Rust's ownership model helped audit file update paths and ensure journal consistency.

### 4. Storage & Persistence

**File Storage**: Documents are persisted to **Amazon S3** as Kiwi-encoded binary blobs (`.fig` format). S3 checkpoints are written every **30–60 seconds**.

**Write-Ahead Log**: Between S3 checkpoints, changes are buffered to **Amazon DynamoDB** as a write-ahead log (journal). Journal entries have `start_sequence_number` and `end_sequence_number` to batch the 30 FPS client updates. 95% of edits are saved within 600ms.

**File Locking**: DynamoDB also stores file locks — a `(lock UUID, file key)` entry gives a multiplayer server process ownership of a file.

**Database**: Figma originally used a single **Amazon RDS PostgreSQL** database for file metadata. By 2022, they implemented **horizontal sharding** across the database (an 18-month project), achieving theoretically infinite scalability. Figma is described as one of AWS's largest database customers.

**Why Not a Traditional DB for File Data**: Using a relational database for design file data would either abuse it as a filesystem or add unnecessary application complexity. S3 offers significant cost advantages for file-like access patterns.

### 5. Plugin Architecture & Sandbox

**Two-Part Model**: Plugins consist of two isolated components:
1. **Main thread sandbox** — runs plugin logic with access to the Figma document (the "scene" — the layer hierarchy). Uses a **Realms**-based sandbox (minimal JS environment, no browser APIs like DOM or XMLHttpRequest). Runs on the main thread for performance.
2. **iframe** — handles UI rendering and browser API access (`figma.showUI()`). Full HTML/JS/browser API access inside the iframe.

**Communication**: The two parts communicate via **message passing** (`postMessage`). The sandbox can read/write the document tree; the iframe can make network requests, render custom UI, etc., but cannot directly access the document.

**Security Model**: Figma considered and rejected several approaches before settling on Realms:
- **iframes alone** — too slow for document access (serialization overhead)
- **Web Workers** — also require serialization; no synchronous document access
- **Realms/SES** — runs on main thread, can access document objects directly, but in a sandboxed JS environment that prevents access to globals

**Codegen Plugins**: Plugins can extend Dev Mode's code generation. They appear in the native language dropdown, and the `figma.codegen.on("generate")` callback fires on selection changes.

### 6. Component & Design System Infrastructure

**Document Model**: Tree of objects rooted at a single document node → page nodes → layer hierarchy. Components can be nested (instances within instances), enabling modular design system architecture.

**Variants**: Group similar components into a single container with shared properties (state, size, layout, etc.). Properties follow the **prop/value format** matching frontend frameworks (React, Vue). Forward-slash `/` naming conventions create hierarchical property groupings.

**Variables System**: Figma Variables move core design system logic from the component layer into a **centralized abstract data layer** with three tiers:
- **Primitive Variables** — raw values (colors, spacing, etc.)
- **Semantic Variables** — contextual meaning (brand-aware, mode-aware)
- **Components** — reference only the Semantic layer

This architecture supports dark mode, multi-brand deployments, responsive breakpoints, and accessibility standards.

**Performance Rewrite**: Figma completed a major refactoring of the design systems data model. Results: variable updates and mode switches are **30–60% faster**; heavy state swaps improved from 3500ms → 350ms and 2500ms → 450ms.

**Layout Engines**: Figma's auto-layout feature ran on **two separate layout engines** managing different parts of the document with some overlap — a constant source of subtle bugs that required significant refactoring.

### 7. Dev Mode & Code Generation Pipeline

**Inspect Panel**: When a developer selects an object in Dev Mode, the Code section generates code snippets based on the object type:
- **Text selections**: typographic preview + layout, typography, and content info
- **Other selections**: box model with margin, border, and padding details
- Supports multiple output languages (CSS, iOS, Android)

**Code Connect**: A bridge between codebase and Dev Mode. Two implementation paths:
- **Code Connect UI** — runs inside Figma, language-agnostic, visual linking
- **Code Connect CLI** — runs in the developer's repository, supports property mappings and dynamic code examples

With Code Connect configured, Dev Mode shows **real design system code** from the team's codebase instead of auto-generated snippets. This also enhances **Figma MCP server** output for AI code generation agents.

**Plugin Extension**: Inspection plugins pull context from external tools; codegen plugins add custom language/framework support beyond Figma's built-in options.

### 8. Infrastructure & Scaling Summary

| Layer | Technology |
|---|---|
| Rendering engine | C++ → WebAssembly (Emscripten) |
| GPU API | WebGL 2.0 → WebGPU |
| Shading language | GLSL → WGSL |
| UI framework | Skew → TypeScript + React |
| Multiplayer server | TypeScript → Rust |
| Serialization format | Kiwi (custom binary, like Protobuf) |
| File storage | Amazon S3 |
| Write-ahead log | Amazon DynamoDB |
| Metadata database | Amazon RDS PostgreSQL (horizontally sharded) |
| Real-time transport | WebSockets |
| Plugin sandbox | Realms (main thread) + iframe (UI) |
| Plugin communication | postMessage |
| Design-to-code bridge | Code Connect (UI or CLI) |
| Cloud provider | AWS |

### 9. Key Architectural Decisions & Tradeoffs

- **Custom renderer over DOM/Canvas 2D**: Enabled GPU-accelerated rendering matching native app performance, but required building everything from scratch (color pickers, text layout, etc.)
- **C++ over JavaScript for core**: Performance-critical path runs in C++/Wasm, but creates a split-world debugging challenge (C++ in Xcode, UI in browser devtools)
- **Custom language (Skew) then abandonment**: Squeezed extra performance from sound type system optimizations, but onboarding cost and ecosystem isolation made it unsustainable
- **LWW over full OT**: Simpler than operational transforms, sufficient for a design tool where objects have independent properties (unlike collaborative text editing)
- **S3 + DynamoDB WAL over traditional database**: File-like access patterns fit object storage better; DynamoDB provides horizontal write scaling for the journal
- **Realms sandbox over Web Workers**: Synchronous main-thread document access critical for plugin performance, at the cost of needing careful sandbox security
- **Separate processes per document**: Clean isolation but requires infrastructure to route all editors of a document to the same server process
