# VS Code Architecture Research

**Beads Issue:** hsg-jjr3
**Style Guide:** bento-grid
**Folder:** architecture/vscode/

## Research Topics

- Electron multi-process model (main, renderer, extension host)
- Extension Host architecture (isolated Node.js process)
- Language Server Protocol (LSP) integration
- Debug Adapter Protocol (DAP)
- Webview panels and custom editors
- Settings and configuration system
- Remote development (SSH, Containers, WSL, Tunnels)
- Monaco editor engine (shared with web)
- Extension marketplace and publishing

## Key Public Sources

- VS Code documentation (code.visualstudio.com/docs)
- VS Code GitHub repository (open source, well-documented)
- "VS Code - A Deep Dive" talks by Erich Gamma
- LSP specification (microsoft.github.io/language-server-protocol)
- VS Code extension API documentation

## Findings

### 1. Electron Multi-Process Model

VS Code runs as a multi-process Electron application with five cooperating OS processes:

**Main Process** (`src/vs/code/electron-main/app.ts`)
- Manages application lifecycle: startup, shutdown, auto-updates
- Window management, native file dialogs, process creation
- Only process with full Node.js API access and OS integration
- Entry point: `CodeMain.startup()` parses CLI, guards single-instance, starts Node IPC server

**Renderer Process** (`src/vs/workbench/electron-browser/desktop.main.ts`)
- Renders the Workbench UI using HTML, CSS, and TypeScript in a Chromium browser window
- Since the 2020-2023 sandboxing migration, renderers are fully sandboxed — no direct Node.js access
- Uses preload scripts and context bridge for controlled IPC to other processes
- Custom `vscode-file://` protocol replaced `file://` for HTTPS-level security

**Shared Process**
- Hidden Electron window with Node.js enabled
- Handles complex shared tasks: extension installation, telemetry
- All other windows can communicate with it
- File watchers and integrated terminal processes run as children of the shared process

**Extension Host** (moved to Electron utility process)
- Isolated process running all activated extensions (one per window)
- Originally in the renderer; migrated to utility process during sandboxing
- Communicates with renderer via message ports for direct, low-overhead IPC
- Has full Node.js support and can spawn child processes

**Pty Host**
- Dedicated process owning terminal shell subprocesses
- Separated to isolate terminal I/O from the main editor process

**IPC Mechanisms:**
| Transport | Connection | Technology |
|-----------|-----------|------------|
| ElectronIPCServer/Client | Renderer ↔ Main | Electron `ipcMain`/`ipcRenderer` |
| NodeIPCServer/Client | CLI ↔ App | Named pipes / Unix sockets |
| MessagePort | Renderer ↔ Shared Process, Renderer ↔ Extension Host | Web standard MessagePort API |

Services are exposed as named IPC channels (`"storage"`, `"nativeHost"`, `"dialog"`, etc.) and consumers retrieve proxy objects via `IPC.getChannel()`.

### 2. Extension Host Architecture

**Process Isolation Model:**
- Extensions run in a sandboxed Node.js process (desktop) or web worker (browser)
- One extension host process per VS Code window
- Extensions can freely spawn their own child processes
- Faulty or slow extensions cannot crash the editor UI

**RPC Protocol** (defined in `src/vs/workbench/api/common/extHost.protocol.ts`):
- Typed proxy system with `MainContext` and `ExtHostContext` proxy identifier namespaces
- `MainThread*` implementations (renderer side) in `src/vs/workbench/api/browser/`
- `ExtHost*` implementations (extension side) in `src/vs/workbench/api/common/`
- `extHostTypeConverters.ts` handles serialization between internal and public API types
- The `vscode` API object is assembled in `extHost.api.impl.ts` via `createApiFactoryAndRegisterActors()`

**Activation Model:**
- Extensions declare `activationEvents` in `package.json` (e.g., `onCommand:`, `onLanguage:`, `onView:`)
- Extensions stay dormant until their activation event fires — lazy loading by default
- Activation is asynchronous, so the UI never blocks on extension startup

**Contribution Points System:**
- Extensions declare capabilities in `package.json` under `"contributes"`: commands, menus, views, languages, debuggers, tasks, problemMatchers
- Built-in features use `.contribution.ts` files that execute at startup
- This declarative approach lets VS Code render UI elements (menus, settings) without activating extensions

### 3. Language Server Protocol (LSP)

**Origin:** Created by Microsoft for VS Code, now an open standard used by dozens of editors and hundreds of language servers. Solves the M×N problem (M editors × N languages) by standardizing the interface.

**Architecture:**
- Language Client: a normal VS Code extension (JavaScript/TypeScript) with access to the full `vscode` namespace API
- Language Server: a separate process implementing language intelligence, written in any language
- Communication via JSON-RPC over stdio, sockets, or IPC pipes

**Protocol Flow:**
1. Client starts language server as a child process
2. `initialize` request/response — capability negotiation
3. `textDocument/didOpen` — document lifecycle begins; document truth moves to editor memory
4. `textDocument/didChange` — incremental edits synced to server
5. Server publishes `textDocument/publishDiagnostics` (errors, warnings)
6. Client sends feature requests: `textDocument/definition`, `textDocument/completion`, `textDocument/hover`, `textDocument/references`, `textDocument/rename`, `textDocument/codeAction`, `textDocument/formatting`, `textDocument/signatureHelp`
7. `textDocument/didClose` — file system becomes authoritative again

**Capability Negotiation:** Client and server announce supported features through capability objects. The absence of a flag means the feature is not supported, enabling graceful degradation.

**Key Design Decision:** LSP uses simple abstractions (text document URIs, cursor positions) rather than AST/compiler-level representations, making it language-agnostic and easy to implement.

**SDK Libraries:**
- `vscode-languageclient` npm module (client side, for VS Code extensions)
- `vscode-languageserver` npm module (server side, Node.js)
- SDKs also available for Java, C#, Python, Rust, and others

### 4. Debug Adapter Protocol (DAP)

**Architecture Pattern:** Mirrors LSP's approach — an intermediary "Debug Adapter" (DA) sits between VS Code's generic debugger UI and concrete debugger runtimes.

**Message Format:**
- HTTP-like headers (ASCII, `Content-Length` required, terminated by `\r\n\r\n`)
- JSON-encoded payload (UTF-8) for content
- Three message types: Requests (client → adapter), Responses (adapter → client), Events (unsolicited adapter → client notifications)

**Session Lifecycle:**
1. **Initialize** — capability exchange; adapter announces supported features
2. **Launch/Attach** — adapter starts debuggee (`launch`) or connects to running process (`attach`)
3. **Configure** — client sets breakpoints (`setBreakpoints`, `setFunctionBreakpoints`, `setExceptionBreakpoints`), then sends `configurationDone`
4. **Execute & Inspect** — on `stopped` event, client queries `threads` → `stackTrace` → `scopes` → `variables`
5. **Terminate** — `terminate` (graceful) → `disconnect` (forced); adapter sends `terminated` event

**Adapter Launch Modes:**
- Single-session: new adapter process per debug session, communicates via stdin/stdout
- Multi-session: persistent adapter on a network port accepting multiple connections

**Object Reference Lifetime:** Variable/scope references (integers) are valid only during the current suspended state and reset on resume, simplifying adapter memory management.

### 5. Webview Panels and Custom Editors

**Webview Panels:**
- Embedded iframes within VS Code controlled by extensions
- Render arbitrary HTML/CSS/JavaScript content
- Communicate with host extension via `postMessage` API (bidirectional message passing)
- Owned by the creating extension; destroyed when the extension disposes them
- Lifecycle event: `onDidDispose` fires when a webview is destroyed

**Custom Editors:**
- Alternative views shown in place of the standard text editor for specific file types
- View side implemented as a webview (HTML/CSS/JS)
- Two classes:
  - `CustomTextEditorProvider` — uses VS Code's `TextDocument` as data model; easier to implement
  - `CustomReadonlyEditorProvider` / `CustomEditorProvider` — for binary or non-text files; extension manages its own data model
- Registered via `registerCustomEditorProvider` and declared in `package.json` under `customEditors`

**Security:** Webviews run in isolated contexts with Content Security Policy restrictions. Extensions must use `asWebviewUri()` to load local resources.

### 6. Settings and Configuration System

**Layered Configuration:**
- **Default Settings** — defined by VS Code core and extensions in `package.json` (`contributes.configuration`)
- **User Settings** — global, apply to all VS Code instances (`settings.json` in user data directory)
- **Workspace Settings** — per-project, stored in `.vscode/settings.json`
- **Folder Settings** — per-folder in multi-root workspaces
- **Language-specific Settings** — scoped by language identifier (e.g., `[python]`)

**Precedence (highest wins):** Language-specific > Folder > Workspace > User > Default

**Notable:** Language-specific user settings override non-language-specific workspace settings, even at a narrower scope.

**Multi-root Workspaces:** `.code-workspace` JSON file lists multiple folders; each folder can have its own `.vscode/settings.json`.

**Service Implementation:** `IConfigurationService` resolves and watches settings, exposing them to all processes via IPC. Extensions access settings through `vscode.workspace.getConfiguration()`.

### 7. Remote Development Architecture

**Core Concept:** VS Code splits into a thin client (UI) running locally and a VS Code Server running remotely. The server hosts workspace extensions and provides full access to remote files, tools, and runtimes.

**Remote Targets:**
| Target | Transport | Key Detail |
|--------|----------|------------|
| SSH | Authenticated SSH tunnel | Server auto-installed on remote host |
| Containers | Docker exec channel | Dev Containers with `devcontainer.json` config |
| WSL | Random local port | Server runs inside Linux distribution |
| Tunnels | Secure tunnel (no SSH needed) | Uses VS Code Server with end-to-end encryption |

**Extension Host Split:**
- **Local Extension Host** — runs UI extensions (themes, snippets, keymaps) on the user's machine
- **Remote Extension Host** — runs workspace extensions (language servers, debuggers, file operations) on the remote machine inside VS Code Server

**Extension Location Declaration:** Extensions set `extensionKind` in `package.json`:
- `"ui"` — always runs locally
- `"workspace"` — runs where the workspace is
- Users can override via `remote.extensionKind` setting

**VS Code Server:**
- Lightweight installation, must match client version exactly
- Auto-installed/updated by Remote Development extensions
- Hosts the Remote Extension Host, file system access, terminal, and debugger
- Independent of any existing VS Code installation on the remote machine

**API Transparency:** Most `vscode.*` APIs automatically route to the correct machine. Special cases:
- `vscode.env.clipboard` — always executes locally
- `vscode.env.openExternal` — includes automatic localhost port forwarding
- File access uses `vscode.workspace.fs` abstraction over physical location

### 8. Monaco Editor Engine

**Relationship to VS Code:** Monaco is generated directly from VS Code's source code with service shims to run in a standalone browser context. It shares the same TypeScript codebase but ships as an independent library with its own versioning.

**Core Architecture:**
- **TextModel** (`src/vs/editor/common/model/textModel.ts`) — uses a **piece table** data structure for efficient incremental text edits, with built-in undo/redo
- **ViewModel** (`src/vs/editor/common/viewModel/viewModelImpl.ts`) — computed view on top of TextModel; handles line wrapping, code folding, viewport calculations; lazily computes visible lines
- **CodeEditorWidget** (`src/vs/editor/browser/widget/codeEditor/codeEditorWidget.ts`) — browser-facing editor instance, renders the UI

**Built-in Language Services:** Four full-featured language services run in separate web workers to keep the UI responsive:
- TypeScript/JavaScript
- HTML
- CSS/LESS/SCSS
- JSON

**Performance:** Only tokenizes visible code regions; defers off-screen tokenization. Incremental rendering redraws only changed portions of the UI.

**Standalone Usage:** Available as `monaco-editor` npm package. Used by Azure DevOps, GitHub (github.dev), CodeSandbox, CoderPad, and many other browser-based editors.

### 9. Extension Marketplace and Publishing

**VSIX Package Format:** Extensions are packaged as `.vsix` files (ZIP archives with a manifest). Created using `@vscode/vsce` CLI tool.

**Platform-Specific Extensions:** Since VS Code 1.61, extensions can publish separate VSIX packages per platform:
- `win32-x64`, `win32-arm64`
- `linux-x64`, `linux-arm64`, `linux-armhf`
- `alpine-x64`, `alpine-arm64`
- `darwin-x64`, `darwin-arm64`
- `web`

VS Code automatically downloads the package matching the current platform.

**Publishing Pipeline:**
1. Create Azure DevOps Personal Access Token (PAT)
2. Create publisher via `vsce create-publisher`
3. Package with `vsce package`
4. Publish with `vsce publish`

**Marketplace Infrastructure:** Hosted on Visual Studio Marketplace (marketplace.visualstudio.com), backed by Azure DevOps for authentication and distribution.

**Alternative:** Open VSX Registry (open-vsx.org) serves VS Code forks like VSCodium, Gitpod, and Eclipse Theia that cannot use the Microsoft Marketplace.

### 10. Workbench and Service Architecture

**Source Code Layering** (enforced at build time — lower layers cannot import higher):

| Layer | Path | Purpose |
|-------|------|---------|
| Base | `src/vs/base/` | Platform-agnostic utilities, event emitters, IPC primitives |
| Editor | `src/vs/editor/` | Monaco editor core (TextModel, ViewModel, CodeEditorWidget) |
| Platform | `src/vs/platform/` | Injectable platform services (file system, config, storage) |
| Workbench | `src/vs/workbench/` | Shell layout, editor groups, extension bridges, features |
| Code | `src/vs/code/` | Electron main process, CLI, web bootstrap |

**Dependency Injection:** Constructor-based DI via `IInstantiationService`. Services implement interfaces (e.g., `IFileService`, `IConfigurationService`, `IEditorService`) and are registered in a `ServiceCollection`. The instantiation service analyzes constructor signatures and recursively resolves dependencies.

**Key Service Interfaces:**
| Service | Role |
|---------|------|
| `IFileService` | File system abstraction (local, remote, virtual) |
| `IConfigurationService` | Settings resolution and change watching |
| `IExtensionService` | Extension lifecycle management |
| `IEditorService` | Editor group and tab management |
| `ITerminalService` | Integrated terminal instances |
| `IDebugService` | Debugger sessions and state |
| `IWorkbenchLayoutService` | Part visibility and resizing |

**Workbench Parts** (positioned by `SerializableGrid` in `src/vs/workbench/browser/layout.ts`):
- TitlebarPart — window chrome and menu bar
- ActivityBarPart — left icon sidebar (views switcher)
- SidebarPart — file explorer, search, source control, etc.
- EditorPart — central editor area with grouped tabs
- PanelPart — bottom/right panel (terminal, problems, output, debug console)
- AuxiliaryBarPart — secondary right sidebar
- StatusbarPart — bottom status strip

**Startup Sequence (Desktop):**
1. `CodeMain.startup()` — parse CLI, single-instance guard, start Node IPC server
2. `CodeApplication.startup()` — initialize services, spawn shared process, open windows
3. `DesktopMain.open()` — connect to main/shared processes, bootstrap Workbench
4. `Workbench.startup()` — create Parts, load persisted layout, trigger extension activation

**Startup Sequence (Web):**
1. HTML loads `workbench.ts`, reads meta configuration
2. `BrowserMain.open()` — connect to optional remote agent
3. Same `Workbench.startup()` flow (without native main process)

### 11. Historical Context (Erich Gamma)

- Project started ~2011 as "Monaco" — an experiment to see what was possible building a code editor in the browser using HTML, CSS, and JavaScript
- Code-named "Project Ticino" (after the Swiss canton)
- Initial team based in Zurich, Switzerland (Gamma's Eclipse heritage)
- Grew into a 350k+ line TypeScript application built on Electron, Node.js, and hundreds of open source components
- LSP was introduced in 2016 to solve the M×N language tooling problem
- Integrated terminal contributed by a second team in Redmond
- Remote development was a major architectural pivot, partly driven by WSL and the desire to run VS Code in the browser — required refactoring the codebase back toward browser compatibility
- Gamma is one of the "Gang of Four" (GoF) authors of *Design Patterns* (1994), which influenced VS Code's heavy use of patterns like dependency injection, observer (event emitters), and strategy (providers)
