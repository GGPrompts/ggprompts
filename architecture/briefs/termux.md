# Termux Architecture Research

**Beads Issue:** hsg-nvvz
**Style Guide:** codex-terminal-2031
**Folder:** architecture/termux/

## Research Topics

- Android terminal emulation (terminal view, pseudo-terminal)
- Bootstrap and package ecosystem (apt/pkg, cross-compiled packages)
- proot for non-root Linux environment simulation
- File system layout ($PREFIX, /data/data/com.termux/)
- Plugin system (Termux:API, Termux:Boot, Termux:Float, Termux:Styling)
- Build infrastructure (termux-packages build system, Docker-based CI)
- Hardware keyboard and touch input handling
- Session and notification management
- Integration with Android APIs via termux-api

## Key Public Sources

- Termux GitHub organization (github.com/termux)
- Termux wiki (wiki.termux.com)
- termux-packages build system documentation
- Termux source code (Java + shell scripts)
- Fredrik Fornwall (creator) design decisions

## Findings

### 1. App Module Architecture

The termux-app repository is a multi-module Gradle project with three library modules and one application module:

- **`app/`** -- Main Android application module containing `TermuxActivity`, `TermuxService`, `RunCommandService`, and `TermuxShellManager`. This is the APK entry point.
- **`terminal-emulator/`** -- Pure Java terminal emulation engine. Contains `TerminalEmulator`, `TerminalSession`, `TerminalBuffer`, and the JNI C code (`termux.c`) for pseudo-terminal management. No Android dependencies.
- **`terminal-view/`** -- Android `View` subclass (`TerminalView`) that renders the terminal emulator output. Depends on `terminal-emulator`.
- **`termux-shared/`** -- Shared constants, utilities, and IPC helpers used by the main app and all plugins. Contains `TermuxConstants` (all hardcoded paths), socket management, and file utilities. Depends on both `terminal-emulator` and `terminal-view`. Published via JitPack for plugin consumption.

Dependency chain: `app` -> `termux-shared` -> `terminal-view` -> `terminal-emulator`.

### 2. Terminal Emulation and Pseudo-Terminal

The terminal emulation stack has three layers:

**JNI Layer (`terminal-emulator/src/main/jni/termux.c`)**
- Opens `/dev/ptmx` (master PTY device) with `O_RDWR | O_CLOEXEC`
- Calls `grantpt()` and `unlockpt()` to configure the slave device
- Retrieves slave device name via `ptsname_r()`
- Configures terminal: enables `IUTF8`, disables flow control (`IXON`/`IXOFF`)
- Sets initial window size via `TIOCSWINSZ` ioctl
- Forks child process: child opens slave PTY, redirects stdin/stdout/stderr to it, closes all inherited FDs via `/proc/self/fd` enumeration, clears environment, calls `execvp()`
- Exposes 5 JNI functions: `createSubprocess`, `setPtyWindowSize`, `setPtyUTF8Mode`, `waitFor`, `close`

**TerminalSession (Java)**
- Wraps a shell process and a `TerminalEmulator` instance
- Multi-threaded I/O: input thread reads from shell output stream and queues data; emulation thread processes queued data through the emulator; main/UI thread handles display via client notifications
- Tracks process PID, can read CWD from `/proc/{pid}/cwd`
- `TerminalSessionClient` interface provides callbacks: `onTextChanged()`, `onTitleChanged()`, `onSessionFinished()`, `onBell()`, `setTerminalShellPid()`

**TerminalView (Android View)**
- Custom `View` that renders `TerminalBuffer` contents
- Handles touch input gestures (scroll, tap, long-press for text selection)
- Bridges to `TermuxTerminalViewClient` for input processing

Data flow: User Input -> TerminalView -> Client -> TermuxService -> TerminalSession -> Shell Process (via PTY master FD) -> TerminalEmulator (parses escape sequences) -> TerminalBuffer -> TerminalRenderer -> Screen.

### 3. Process Execution Model

Termux executes programs **natively on Android** -- no emulation or containerization by default. Programs are compiled with Android NDK and linked against Android's **Bionic libc** (not glibc).

Two execution modes:
- **Foreground terminals (TermuxSessions)**: Forked via `execvp()` through JNI
- **Background tasks (AppShell/TermuxTasks)**: Forked via `Runtime.exec()` in Java

**termux-exec (`libtermux-exec.so`)** is a critical LD_PRELOAD library that intercepts the `exec()` family of functions to rewrite paths like `/bin/sh` and `/usr/bin/env` to `$PREFIX/bin/sh` and `$PREFIX/bin/env`. This solves the fundamental problem that Android has no `/bin/` or `/usr/bin/` directories. Loaded automatically via `$LD_PRELOAD` for all spawned child processes.

**Key constraints:**
- External storage (`/sdcard`) mounted with `noexec` flag -- scripts must be passed to an interpreter
- Android >= 10 with `targetSdkVersion >= 29`: W^X (Write XOR Execute) policy prevents executing from app data directory; mitigated by termux-exec
- SELinux policies restrict access to many `/system/bin` executables

### 4. File System Layout

All Termux files live within the Android app sandbox at `/data/data/com.termux/`. The layout maps to Linux FHS as closely as possible:

| Path | Variable | Linux Equivalent |
|------|----------|------------------|
| `/data/data/com.termux/files` | `$TERMUX__ROOTFS` | `/` (root filesystem) |
| `/data/data/com.termux/files/usr` | `$PREFIX` / `$TERMUX__PREFIX` | `/usr` |
| `/data/data/com.termux/files/home` | `$HOME` / `$TERMUX__HOME` | `/home/user` |
| `/data/data/com.termux/files/usr/bin` | -- | `/bin` + `/usr/bin` + `/sbin` (all merged) |
| `/data/data/com.termux/files/usr/lib` | -- | `/lib` + `/usr/lib` |
| `/data/data/com.termux/files/usr/etc` | -- | `/etc` |
| `/data/data/com.termux/files/usr/tmp` | `$TMPDIR` | `/tmp` |
| `/data/data/com.termux/files/usr/var` | -- | `/var` |
| `/data/data/com.termux/files/usr/share` | -- | `/usr/share` |

**Path length constraints** (Linux syscall limits):
- Rootfs path max: 86 characters
- PREFIX path max: 90 characters
- Unix domain sockets: 108 characters max
- Shebang lines: 340 characters max (with termux-exec)
- Package names should be <= 21 characters

**Storage symlinks** (`~/storage/`): Created by `termux-setup-storage`, maps Android directories:
- `~/storage/shared` -> External storage root
- `~/storage/downloads` -> Downloads
- `~/storage/dcim` -> DCIM
- `~/storage/pictures`, `~/storage/music`, `~/storage/movies`, etc.

**Configuration** lives in `~/.termux/`:
- `termux.properties` -- Main config (extra keys, keyboard behavior, styling)
- `colors.properties` -- Terminal color scheme
- `font.ttf` -- Custom terminal font
- `boot/` -- Scripts for Termux:Boot plugin

### 5. Bootstrap and Package Ecosystem

**Bootstrap process:**
1. First launch validates file system access and device primary user status
2. Extracts bootstrap ZIP into staging directory (`$PREFIX-staging`)
3. Processes symlinks from `SYMLINKS.txt`
4. Atomically moves staging to final `$PREFIX` location
5. Sets executable permissions on binaries

Bootstrap ZIPs are generated weekly by `termux-packages/scripts/generate-bootstraps.sh` from the apt repository. They contain the minimal rootfs: `bash`, `apt`, `dpkg`, `coreutils`, and essential libraries.

**Package management:**
- Uses standard **dpkg** + **apt** with `.deb` packages (but NOT standard Debian packages -- they are cross-compiled for Termux paths)
- `pkg` is a wrapper around `apt` that auto-runs `apt update` before installs
- Package repositories served over HTTPS, mirrored globally
- Three package channels: **main** (`packages/`), **root** (`root-packages/`), **x11** (`x11-packages/`)

**Why standard Debian packages don't work:** Termux is not FHS-compliant. All paths are relocated to `$PREFIX` during compilation. Binaries are linked against Bionic libc, not glibc.

### 6. Build Infrastructure (termux-packages)

The `termux-packages` repository contains a sophisticated cross-compilation system:

**Build command:** `./build-package.sh <package-name> [-a <arch>] [-f] [-d]`

**Supported architectures:** `aarch64` (default), `arm`, `i686`, `x86_64`

**Each package defines `packages/<name>/build.sh`** with variables:
- `TERMUX_PKG_SRCURL` -- Source download URL
- `TERMUX_PKG_SHA256` -- Checksum verification
- `TERMUX_PKG_DEPENDS` -- Runtime dependencies
- `TERMUX_PKG_BUILD_IN_SRC` -- Build in source tree (vs. separate build dir)
- `TERMUX_PKG_HOSTBUILD` -- Needs native host compilation step

**31-step build pipeline** (key steps):
1. `termux_step_setup_variables` -- Initialize environment
2. `termux_step_get_dependencies` -- Build or download dependencies
3. `termux_step_get_source` -- Download and extract source
4. `termux_step_setup_toolchain` -- Configure NDK cross-compiler (one-time)
5. `termux_step_patch_package` -- Apply `*.patch` files from package directory
6. `termux_step_configure` -- Auto-detects build system (autotools, CMake, Meson)
7. `termux_step_make` -- Compile
8. `termux_step_make_install` -- Install to prefix
9. `termux_step_massage` -- Strip binaries, create subpackages
10. `termux_step_create_debian_package` -- Generate `.deb` files

**Build system auto-detection:** Recognizes autotools (`configure`), CMake (`CMakeLists.txt`), and Meson (`meson.build`). Helper functions: `termux_setup_cmake`, `termux_setup_meson`, `termux_setup_rust`, `termux_setup_golang`, `termux_setup_nodejs`.

**Docker environment (recommended):**
- Image: `ghcr.io/termux/package-builder` (Ubuntu-based)
- Launch: `./scripts/run-docker.sh` creates container `termux-package-builder`
- Repo mounts at `/home/builder/termux-packages`
- Ensures reproducible builds matching CI environment

**CI/CD:** GitHub Actions-based. Patches and package updates go through PR review. Skip tags: `[no ci]`, `%ci:no-build`.

**Android NDK integration:** NDK provides the cross-compilation toolchain. Targets Android API level 24 (Android 7.0) minimum. NDK sysroot is patched during initial setup.

### 7. PRoot and proot-distro

**PRoot** is a user-space `chroot` implementation that uses `ptrace()` to intercept system calls and translate filesystem paths on the fly. No root access required.

How it works:
- Intercepts syscalls like `open()`, `stat()`, `chdir()` via `ptrace()`
- Rewrites path arguments to redirect from virtual root to actual directory
- Fakes user/group IDs (the `-0` flag simulates root UID)
- Can emulate foreign CPU architectures via QEMU user-mode

**Limitation:** Cannot perform real privilege escalation. Kernel/hardware operations requiring actual root will fail.

**proot-distro** is a shell script wrapper (`proot-distro.sh`) that manages full Linux distribution installations:
- **Plugin system:** Each distro is a shell script in `$PREFIX/etc/proot-distro/` defining `DISTRO_NAME`, `TARBALL_URL`, `TARBALL_SHA256`, and optional `distro_setup()` function
- **Operations:** `install`, `login`, `backup`, `restore`, `remove`, `rename`, `reset`
- **~20 supported distros:** Alpine, Arch Linux, Debian, Ubuntu, Fedora, Void Linux, OpenSUSE, Rocky Linux, AlmaLinux, Deepin, etc.
- **Architecture support:** aarch64, arm, i686, x86_64, riscv64 (varies by distro)
- Rootfs tarballs are downloaded and cached; each distro gets its own isolated directory

### 8. Plugin System and Inter-Process Communication

Termux plugins are separate Android APKs sharing the same `sharedUserId` (`com.termux`), giving them direct file system access to all Termux directories.

**Plugin apps:**
- **Termux:API** (`com.termux.api`) -- Bridge to Android system APIs (battery, camera, sensors, clipboard, notifications, SMS, location, etc.)
- **Termux:Boot** (`com.termux.boot`) -- Runs scripts from `~/.termux/boot/` at device boot
- **Termux:Float** (`com.termux.window`) -- Floating terminal window overlay
- **Termux:Styling** (`com.termux.styling`) -- Color schemes and Powerline-ready fonts
- **Termux:Widget** (`com.termux.widget`) -- Home screen shortcuts and widgets for scripts in `~/.shortcuts/`
- **Termux:Tasker** (`com.termux.tasker`) -- Tasker/Locale plugin integration

**Termux:API architecture (detailed):**

Command flow: `termux-battery-status` (shell script) -> `termux-api` (native binary) -> creates two Unix domain sockets (input + output) -> broadcasts Android Intent with socket addresses -> `TermuxApiReceiver` (BroadcastReceiver) dispatches by `api_method` parameter -> API implementation class (e.g., `BatteryStatusAPI`) interacts with Android system services -> `ResultReturner` sends JSON/binary data back through output socket -> result printed to stdout.

Key components:
- **`SocketListener`** -- Server socket at `com.termux.api://listen`, verifies caller UID, parses command arguments into Intent extras
- **`TermuxApiReceiver`** -- Central dispatch hub, extracts `api_method`, checks Android permissions, delegates to 30+ API handler classes
- **API implementations** -- One class per Android API (SensorAPI, LocationAPI, CameraInfoAPI, ClipboardAPI, etc.)
- **`ResultReturner`** -- Connects to output socket, provides interfaces for JSON, binary, and streaming output

**External app integration:** Non-plugin apps can send `RUN_COMMAND` intents to `RunCommandService`, which validates permissions (requires `PROP_ALLOW_EXTERNAL_APPS=true` in `termux.properties`) and forwards commands to `TermuxService`. Results returned via pending intents.

**Content providers:** External file access through `content://com.termux.files/` and `content://com.termux.documents/` with path validation and policy checks.

### 9. Session and Service Management

**TermuxService** is a foreground Android Service that persists independently of the UI:
- Manages a list of `TermuxSession` instances (interactive terminals)
- Manages a list of `AppShell` instances (background tasks from plugins)
- Optionally holds wake lock and WiFi lock (shown in notification)
- Updates foreground notification with session/task counts
- Self-terminates when no sessions, tasks, or wakelocks remain

**TermuxActivity** binds to `TermuxService` via `ServiceConnection`:
- Creates `TermuxTerminalViewClient` and `TermuxTerminalSessionActivityClient` on connect
- Multiple terminal sessions displayed in a side drawer
- Sessions survive activity destruction (e.g., screen rotation, app backgrounding)

**Session creation flow:** `ExecutionCommand` -> `TermuxShellManager` -> creates `TermuxSession` (foreground) or `AppShell` (background) -> JNI `createSubprocess` -> PTY pair + forked process.

**Android >= 10 restriction:** Background `TermuxService` cannot start foreground terminal sessions until user taps the Termux notification. Mitigated by requesting "Draw Over Apps" permission (since Termux v0.100).

### 10. Input Handling

**Hardware keyboard:** Standard Android key event handling through `TerminalView.onKeyDown()`/`onKeyUp()`. Full support for Ctrl, Alt, Esc, arrow keys, function keys.

**Touch keyboard workarounds:**
- Volume Down acts as Ctrl key (e.g., Vol Down + L = Ctrl+L)
- Volume Up + Q or Volume Up + K toggles extra keys row
- Extra keys row: configurable via `~/.termux/termux.properties`, provides buttons for Esc, Ctrl, Alt, Tab, arrows, and custom keys
- Text Input View: native Android text input with autocorrect/prediction/swipe that pastes into terminal
- Long-press on keyboard button in left drawer toggles extra keys

**Extra keys configuration** supports multi-row layouts defined in `termux.properties` as JSON arrays of key definitions, including macro keys and popup keys (long-press alternatives).

### 11. Interesting Architectural Decisions

1. **Bionic libc instead of glibc:** Every package must be compiled against Android's C library, requiring extensive patching. This is the single biggest source of porting effort.

2. **Flat bin directory:** All of `/bin`, `/sbin`, `/usr/bin`, `/usr/sbin` are merged into a single `$PREFIX/bin`. Simplifies PATH but requires careful conflict avoidance.

3. **LD_PRELOAD for path translation:** Rather than patching every script's shebang, termux-exec globally intercepts `exec()` calls -- an elegant solution to the FHS incompatibility problem.

4. **ptrace-based PRoot:** Allows running unmodified Linux distros without kernel modifications, at the cost of syscall interception overhead.

5. **Unix domain sockets for API IPC:** The Termux:API plugin uses anonymous namespace Unix sockets (not Android Binder/AIDL) for data transfer between the terminal and the API app, enabling efficient bidirectional streaming.

6. **Bootstrap ZIP atomicity:** The staging-then-rename approach prevents partial installations from corrupting the environment.

7. **No build tools required:** The entire development/CI pipeline produces `.deb` packages via shell scripts and Docker, with no custom build system framework.

8. **Foreground service persistence:** Using Android's foreground service mechanism with notification ensures the OS doesn't kill terminal sessions, while giving users visibility and control.
