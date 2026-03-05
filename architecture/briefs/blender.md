# Blender Architecture Research

**Beads Issue:** hsg-1xdd
**Style Guide:** low-poly
**Folder:** architecture/blender/

## Research Topics

- Core architecture (DNA/RNA data system, dependency graph)
- Render engines (Cycles path tracer, EEVEE real-time)
- Modifier stack and geometry nodes
- Python scripting layer and addon API
- Node-based material/shader system
- Animation system (armatures, NLA, drivers)
- File format (.blend) and library linking
- Compositor and video sequence editor
- Grease Pencil 2D/3D hybrid

## Key Public Sources

- Blender Developer Documentation (developer.blender.org)
- Blender source code (C/C++, well-structured)
- Blender Conference talks (archived on YouTube)
- Blender wiki architecture pages
- "Blender Internals" community documentation

## Findings

### Source Code Structure

Blender is written primarily in C, C++, and Python (~2M+ lines). The codebase follows an MVC-inspired architecture with clear module separation.

**Top-level directories:**
- `source/blender/` -- Main application code
- `intern/` -- Internal libraries maintained by Blender devs (isolated modules)
- `extern/` -- Third-party libraries not commonly available as system packages

**Key source/blender/ modules:**
- `makesdna/` -- DNA struct definitions (all persistent data types)
- `makesrna/` -- RNA property definitions (data access API layer)
- `blenkernel/` -- Kernel functions: data manipulation, allocation, freeing
- `blenlib/` -- Low-level utilities: math, linked lists, file ops, string handling
- `blenloader/` -- .blend file I/O and undo system
- `editors/` -- All UI editors and most operators (3D view, node editor, etc.)
- `modifiers/` -- Mesh, curve, and lattice modifiers
- `nodes/` -- Compositor, geometry, shader, and texture node systems
- `depsgraph/` -- Dependency graph for data relationships and evaluation
- `compositor/` -- Node-based image compositing engine
- `sequencer/` -- Video sequence editor core
- `gpu/` -- GPU abstraction layer (OpenGL, Vulkan, Metal backends)
- `python/` -- Python API bindings (bpy module)
- `io/` -- Import/export (USD, FBX, Alembic, OBJ, glTF, etc.)
- `sculpt_paint/` -- Sculpting and painting tools
- `animrig/` -- Animation and rigging APIs
- `geometry/` -- Mesh operations and geometry processing
- `bmesh/` -- Mesh editing API (used in edit mode)

**Key intern/ libraries:**
- `cycles/` -- Cycles render engine (standalone-capable)
- `ghost/` -- GHOST: cross-platform window/event system (Windows, macOS, Linux/Wayland/X11)
- `guardedalloc/` -- Guarded memory allocator with leak detection and bounds checking
- `audaspace/` -- Audio engine (C++ library with Python bindings, also standalone)
- `iksolver/` -- Inverse kinematics solver
- `itasc/` -- iTaSC advanced IK (constraint-based)
- `libmv/` -- Motion tracking library
- `mantaflow/` -- Fluid/smoke simulation
- `opensubdiv/` -- Subdivision surface integration (Pixar OpenSubdiv)
- `openvdb/` -- Sparse volume data (OpenVDB integration)
- `rigidbody/` -- Bullet physics integration
- `mikktspace/` -- Tangent space computation for normal maps
- `eigen/` -- Eigen linear algebra library wrapper
- `opencolorio/` -- Color management (OCIO integration)
- `sky/` -- Physically-based sky model

Module convention: each module has public `.h` headers at the top level defining exported API, and an `intern/` subdirectory containing `.c`/`.cpp` implementation files. The `editors/` folder is the best starting point for understanding what buttons and tools do.

---

### DNA System (Structure DNA)

DNA is Blender's low-level serialization system for .blend files. It provides forward and backward compatibility across versions.

**How it works:**
1. During compilation, a tool called `makesdna` parses C struct definitions from header files in `source/blender/makesdna/`
2. It generates a compact binary description of all structs called SDNA (Structure DNA)
3. When saving a .blend file, the SDNA block is embedded alongside the actual binary data
4. Each .blend file is self-descriptive: it contains the complete schema needed to interpret its contents

**Compatibility mechanism:**
- When loading a file, Blender compares the file's embedded SDNA against the current binary's SDNA
- Unknown newer fields are safely skipped or stored
- Missing older fields are added with sensible defaults
- Versioning code (`do_versions`) handles semantic changes between Blender versions

**Technical characteristics:**
- DNA structs directly mirror C memory layout (sensitive to padding, pointer size, endianness)
- Structs prefixed with `##` are excluded from SDNA (can contain opaque types)
- Most DNA structs serve dual purpose: serialization format AND in-memory representation
- Blender also uses optimized runtime-only formats for editing and rendering

**Data flow:** `.blend file` --> `SDNA block + data blocks` --> `makesdna comparison` --> `versioning` --> `in-memory DNA structs`

---

### RNA System (Runtime Nucleic Acid)

RNA is the structured data access layer that sits above DNA. It provides rich metadata, type information, and runtime behavior for all Blender data. The Python API (`bpy`) is auto-generated from RNA definitions.

**How makesrna works:**
1. RNA definitions live in `rna_*.cc` files in `source/blender/makesrna/`
2. At compile time, `makesrna` generates static RNA structs with properties and callbacks
3. Output is baked into source code (no startup overhead)
4. Key headers: `RNA_types.h` (data structures), `RNA_access.h` (runtime access), `RNA_define.h` (definition API)

**DNA-to-RNA mapping:**
- Not a 1:1 mapping. Multiple RNA properties can map to one DNA member (e.g., bitflags become individual booleans)
- One RNA property can span multiple DNA members (e.g., mesh vertex collection uses both `mvert` and `totvert`)
- Automatic matching for arrays, strings, pointers, and ListBase collections
- Manual overrides via `RNA_def_*_sdna()` functions when automatic derivation fails
- Nested DNA members accessed via dot notation (e.g., `r.cfra`, `toolsettings->unwrapper`)

**Property system:**
- Types: boolean, int, float, string, enum, pointer, collection
- Subtypes provide semantic meaning (e.g., PROP_FILEPATH, PROP_COLOR, PROP_ANGLE)
- Each property can have: UI name/description, min/max ranges, default values, update callbacks, editability flags
- Naming conventions: `use_*` / `show_*` / `is_*` / `lock_*` for booleans, `*_factor` for 0-1 floats

**Integration points:**
- Python API (`bpy.data.*`) is auto-generated from RNA definitions
- UI system reads RNA metadata for automatic widget generation
- Animation system uses RNA paths for keyframe targeting
- Dependency graph uses RNA update callbacks for change propagation
- Operators use RNA properties for their parameters

**Data flow:** `DNA structs` --> `RNA definitions (makesrna)` --> `Python bpy module` / `UI widgets` / `animation paths` / `depsgraph updates`

---

### Dependency Graph (Depsgraph)

The dependency graph ensures efficient scene updates after any change, rebuilding only what depends on the modified value. It replaced Blender 2.7x's in-place modification approach with pure functional evaluation on copies.

**Architecture:**
- Directed acyclic graph (DAG) where nodes = scene entities, edges = dependencies
- Two-tier node structure: "outer" ID nodes (representing datablocks) contain inner operation nodes
- Each ID datablock gets its own ID node (flat structure, not nested Object > ObjectData)

**Copy-on-Write (CoW) mechanism:**
1. At graph construction: shallow copies of datablocks are created (pointer allocated, contents not yet filled)
2. During evaluation: worker threads populate the copies from evaluation threads
3. Geometry sharing: lightweight container structs (Mesh) are duplicated, but actual vertex/face arrays can reference originals when unmodified
4. Original DNA data is NEVER modified by evaluation -- render engines work only with generated copies

**Ownership model:**
- Each window owns its own depsgraph, tied to active workspace and render engine
- F12 final render uses a separate depsgraph owned by the Render structure
- This enables simultaneous multi-viewport states (e.g., rest pose in one viewport, animated playback in another)

**Evaluation pipeline:**
- Supports multi-threaded execution with dependency-ordered task scheduling
- All object types follow the same CoW + evaluation pattern
- Curves, NURBS, and metaballs evaluate natively, then convert to Mesh for engines without native support
- Render engines access data through a unified API regardless of data source

**Scope:** Handles dynamic per-frame updates (F-Curves, constraints, modifiers) but NOT one-time operations (e.g., mesh subdivide in edit mode)

**Data flow:** `Original DNA` --> `Depsgraph construction (shallow CoW copies)` --> `Multi-threaded evaluation (fill copies, apply modifiers/constraints)` --> `Generated data` --> `Render engines / viewport`

---

### Cycles Render Engine

Cycles is Blender's physically-based path tracer. It lives in `intern/cycles/` and can run as a standalone library outside Blender.

**Module structure:**
- `session/` -- Session management: coordinates rendering, progress, multi-device load balancing
- `scene/` -- Scene graph: geometry, shaders, lights, cameras, integrator config, film/AOV definitions
- `device/` -- Device abstraction layer for CPU/GPU backends
- `kernel/` -- Platform-specific rendering kernels
- `bvh/` -- BVH acceleration structure construction

**Device abstraction:**
- Unified interface across: CPU (multithreaded), CUDA, OptiX (hardware RT), HIP (AMD), Metal (macOS), oneAPI (Intel)
- Multi-device abstraction handles memory allocation and BVH construction across heterogeneous devices
- Memory classes: `device_only_memory` (GPU-only workspace), `device_vector` (shared CPU/GPU, like std::vector), `device_texture` (native GPU texture handles)
- No unified memory -- explicit copy between host and device
- GPU devices with limited VRAM can fall back to host RAM for scene data (slower but enables larger scenes)

**Integrator pipeline (path tracing stages):**
1. `init_from_camera.h` -- Generate camera rays from pixel coordinates
2. `intersect_closest.h` -- BVH traversal to find closest geometry hit
3. `shade_surface.h` -- Evaluate material BSDFs, sample direct lighting
4. `shade_volume.h` -- Volumetric scattering and absorption
5. `shade_background.h` -- Process rays that miss all geometry
6. Light sampling via hierarchical light tree (importance sampling)
7. Path continuation for indirect illumination (recursive ray generation)

**Shader Virtual Machine (SVM):**
- Bytecode interpreter for shader node graphs
- Shaders encoded as a list of uint4 instructions in a 1D texture
- Stack-based execution: 16-float stack stored in GPU local memory
- Each node reads inputs from stack, computes, writes outputs to stack
- Result is a single closure (type + label + data + weight)
- Available on ALL device backends (CPU, CUDA, HIP, Metal, etc.)

**OSL (Open Shading Language):**
- Industry-standard alternative to SVM
- CPU-only and OptiX only (hardware limitation)
- Closure-based: no direct light access, renderer handles importance sampling
- Can be used alongside SVM -- every built-in node has both SVM and OSL implementations

**BVH acceleration:**
- Built using Surface Area Heuristic (SAH) with spatial splits
- Optimized with binning and multithreading during construction
- Multiple backend implementations: custom BVH2, Intel Embree, OptiX hardware BVH, Metal BVH
- GPU traversal designed for coherent intersection even across different BVH levels

**Film and output:**
- Progressive pixel accumulation
- Multiple render passes: diffuse, specular, shadow, AO, normal, UV, Cryptomatte
- Denoising via OpenImageDenoise (OIDN) using beauty + auxiliary passes

**Advanced features:**
- Subsurface scattering (random walk BSSRDF and disk-based)
- Manifold Next Event Estimation (MNEE) for caustics through refractive surfaces
- Multiple Importance Sampling (MIS) combining light and BSDF distributions
- Volume stack management for nested refractive media
- NanoVDB sparse storage for 3D volume textures

---

### EEVEE Render Engine

EEVEE is Blender's real-time rasterization engine, replacing the old Blender Internal renderer in 2.80. It uses GPU rasterization rather than ray tracing.

**Architecture:**
- Rasterization-based: determines visible surfaces from camera, applies lighting approximations
- Originally OpenGL-based, transitioning to Vulkan backend
- Designed for interactive viewport feedback and fast final renders
- Shares the same material node system as Cycles (same node graphs work in both engines)

**EEVEE Next (rewrite):**
- Major architectural overhaul for stability and visual accuracy
- Built on the new Vulkan GPU abstraction layer
- GPU abstraction uses `VKDevice` (singleton managing logical device), `VKContext` (per-window render state), `VKRenderGraph` (command recording)
- Pipeline architecture: any GPU state change requires a different pipeline object
- Descriptor sets (up to 4) reference buffers and images needed by each pipeline

**Rendering techniques:**
- Screen-space reflections and refractions
- Ambient occlusion (GTAO)
- Volumetric lighting and fog
- Soft shadows via shadow maps
- Bloom, depth of field, motion blur as post-processing
- Irradiance volumes and reflection cubemaps for indirect lighting
- Material nodes compile to GLSL shaders via `GPU_material_compile()` and `GPU_link()`

**Draw Manager:**
- Coordinates all viewport rendering engines
- Scene data flows through the Draw Manager to engine-specific draw code
- GPU backend handles low-level resource management and command submission

**Data flow:** `Scene` --> `Depsgraph (evaluated copies)` --> `Draw Manager` --> `EEVEE engine` --> `GPU shaders (compiled from node trees)` --> `Framebuffer output`

---

### Modifier Stack and Geometry Nodes

**Modifier stack:**
- Sequential pipeline: each modifier takes input geometry and outputs modified geometry
- Evaluated top-to-bottom during depsgraph evaluation on CoW copies
- Types: mesh modifiers, curve/lattice modifiers, physics modifiers
- Each modifier defined in `source/blender/modifiers/`

**Geometry Nodes:**
- Visual programming system for procedural geometry manipulation
- Implemented as a special modifier type: receives geometry from previous modifier, outputs to next
- Node groups define the processing graph; group inputs/outputs map to modifier stack interface
- Uses an attribute-based data model for flexible per-element data (position, normal, custom attributes)
- Supports multiple geometry types: mesh, curves, point cloud, instances, volumes

**Architecture advantages over traditional modifiers:**
- Multiple data types processed in the same graph
- Parallel branches that merge into final output
- Attribute system replaces vertex groups with arbitrary named data channels
- Custom modifiers: node groups can be packaged with a high-level interface (settings panel, no node editor needed)

**Integration:**
- Blender 5.0 introduced built-in modifiers (arrays, scattering, instancing) implemented as Geometry Nodes under the hood
- Geometry Nodes operate on the same `CurvesGeometry` backend as Grease Pencil and hair
- Full access to scene data via object info, collection info, and other input nodes

---

### Python Scripting Layer and Addon API

**Embedded interpreter:**
- Python interpreter starts with Blender and runs for the entire session
- Blender provides `bpy`, `mathutils`, `bmesh`, `gpu`, and other modules to the embedded interpreter
- Much of Blender's own UI is drawn by Python scripts
- Some internal tools are implemented in Python

**bpy module structure:**
- `bpy.data` -- Access to all library data (objects, meshes, materials, scenes, etc.)
- `bpy.context` -- Current active state (selected objects, active tool, mode)
- `bpy.ops` -- Operator execution (buttons, menu items, tools)
- `bpy.types` -- All registrable types (operators, panels, menus, properties)
- `bpy.props` -- Property types for addon settings
- `bpy.utils` -- Utility functions (register/unregister, path helpers)
- `bpy.app` -- Application info (version, build, handlers)

**Class registration system:**
- Addons define Python subclasses of Blender types (Operator, Panel, Menu, PropertyGroup)
- Classes registered via `bpy.utils.register_class()` or module-level `register()`
- Blender collects subclasses by module, enabling per-module register/unregister
- Instance lifecycle: classes are re-instantiated per use (panels get new instance every redraw)
- `__init__()` and `__del__()` are called but storing state on instances is rarely useful

**Addon metadata:**
- `bl_info` dictionary: name, author, version, blender compatibility, description, category
- `register()` / `unregister()` functions enable hot-reload and toggling
- Addons can be single files or packages (directories with `__init__.py`)

**Data flow:** `User action` --> `Operator (Python or C)` --> `bpy.ops` --> `RNA property changes` --> `Depsgraph update` --> `Viewport refresh`

---

### Node-Based Material/Shader System

**Architecture:**
- Unified node graph shared between Cycles and EEVEE
- Node trees stored as `bNodeTree` DNA structs with type `NTREE_SHADER`
- Each node has typed input/output sockets connected by links
- Node evaluation compiles differently per render engine

**Compilation backends:**
- **SVM (Cycles):** Node graph compiled to bytecode instructions executed by the Shader Virtual Machine
- **OSL (Cycles, CPU/OptiX only):** Nodes can use Open Shading Language scripts; `.osl` source compiled to `.oso` bytecode
- **GLSL (EEVEE):** Node graph compiled to GPU shader code via `GPU_material_compile()` using `GPU_link()` calls

**Closure system:**
- Materials produce closures representing surface/volume behavior (not raw colors)
- BSDF closures: diffuse, glossy, glass, translucent, subsurface, etc.
- Volume closures: absorption, scattering
- Emission closures
- Mix/Add shader nodes combine closures by weight
- Renderer handles importance sampling of combined closures

**OSL integration modes:**
- Internal: `.osl` source stored in text datablock, `.oso` bytecode embedded in node
- External file: references `.osl` file on disk, auto-compiled to `.oso`
- Module name: looked up in shader search path

**Node categories:** Input (textures, coordinates, object info), Shader (BSDFs, emission, volume), Texture (noise, voronoi, musgrave), Color (mix, curves, ramp), Vector (mapping, bump, normal), Converter (math, separate/combine), Output (material, world, light)

---

### Animation System

**Core components:**
- **Actions:** Named collections of F-Curves, the fundamental animation data unit
- **F-Curves:** Individual property animation curves with keyframes and interpolation
- **NLA (Non-Linear Animation):** Layered action blending on a timeline
- **Drivers:** Property values driven by expressions or other properties
- **Constraints:** Runtime modifications to transforms (IK, copy rotation, track-to, etc.)
- **Armatures:** Skeleton objects with hierarchical bones for character deformation

**Key source files:**
- `anim_sys.c` -- Animation evaluation during scene updates
- `fcurve.c` -- F-Curve evaluation, interpolation, driver execution
- `nla.c` -- NLA strip management and blending
- `action.c` -- Action storage and manipulation
- `keyframing.c` -- Keyframe insertion/editing
- `constraint.c` -- Constraint evaluation
- `armature_deform.c` -- Skeletal deformation application
- `fcurve_driver.c` / `fcurve_cache.c` -- Driver evaluation and caching

**NLA evaluation model:**
- Strips evaluated as a chain of functions: `final = f_N(f_{N-1}(...f_1(defaults, strip_1)...), strip_N)`
- Each strip can blend, add, or replace values from the previous result
- Extrapolation settings control behavior outside strip bounds
- Action strips reference Actions; transition strips blend between adjacent action strips

**Evaluation pipeline:**
1. Depsgraph triggers animation evaluation for current frame
2. NLA strips evaluated bottom-to-top, blending action results
3. F-Curves interpolate between keyframes (bezier, linear, constant)
4. Drivers evaluate expressions/dependencies
5. Constraints applied to transform results
6. Armature deformation propagated to mesh vertices

**Editor interfaces:**
- Graph Editor (`spacegraph.c`): F-Curve visualization and editing
- Action Editor (`spaceaction.c`): Keyframe timeline per-action
- NLA Editor: Strip arrangement and blending
- Dope Sheet: Summary view across all animated data

---

### .blend File Format and Library Linking

**File structure:**
- Binary format following TLV (type-length-value) pattern
- Starts with file header (12 bytes): magic "BLENDER", pointer size (4/8 bytes), endianness (little/big), version number
- Followed by sequence of file blocks, each with: 4-char code, data length, old memory pointer, SDNA struct index, item count
- File-block headers are 20 bytes (32-bit) or 24 bytes (64-bit)
- Second-to-last block has code `DNA1` -- the embedded SDNA schema
- Last block has code `ENDB` -- end marker

**Self-descriptive format:**
- Each .blend file carries the complete DNA schema used to write it
- On load, Blender reconstructs a catalog from the file's SDNA
- Field-by-field comparison with current version's SDNA enables automatic conversion
- Unknown fields are preserved, missing fields get defaults
- No external schema files needed -- any .blend is interpretable by any Blender version

**Saving mechanism:**
- Blender writes in-memory data structures directly to disk (minimal transformation)
- File blocks correspond to individual datablocks (objects, meshes, materials, etc.)
- Old memory pointers stored for relinking internal references after load

**Library linking:**
- Objects, meshes, materials, textures, etc. can be linked from other .blend files
- Linked data is read-only (references the source file)
- Appending copies data into the current file (becomes independent)
- If a library file is missing at load time, Blender creates placeholder datablocks
- Relocating the library restores the data automatically
- Library overrides allow local modifications to linked data

**Data flow:** `In-memory DNA structs` --> `File blocks + SDNA schema` --> `.blend file` --> `Load: SDNA catalog + versioning` --> `Reconstructed DNA structs`

---

### Compositor

**Architecture (two systems):**

**Legacy CPU Compositor:**
- Tile-based execution: processes the entire node tree per tile
- Multi-threaded: tiles distributed across CPU threads
- Shows partial results as tiles complete
- Each tile processes input-to-output through the full node tree

**New Real-time GPU Compositor (Blender 3.5+):**
- GPU-accelerated for real-time viewport compositing
- Operation-based: executes entire operations across the full image before moving to the next node
- CPU backend divides operations into rectangles matching available thread count
- GPU backend divides based on optimal work group size
- Any render engine supporting viewport rendering is compatible (including Cycles)
- Node trees can be applied directly in the 3D viewport

**Blender 4.2 render compositor rewrite:**
- Significant performance improvements (often several times faster)
- Both CPU and GPU backends rewritten
- Compositor effect strip introduced for VSE integration (uses compositor node trees on video strips)

**Rendering order:** `3D Camera/Scene` --> `Compositor` --> `Video Sequence Editor` (sequential pipeline)

**Node types:** Input (render layers, image, mask, movie clip), Filter (blur, glare, denoise), Color (color balance, curves, mix), Converter (separate/combine RGBA/HSVA), Matte (keying, color spill), Distort (lens distortion, transform), Output (composite, viewer, file output)

---

### Video Sequence Editor (VSE)

**Architecture:**
- Non-linear video editing system with multi-channel timeline
- Follows Blender's standard space-type architecture with timeline and preview regions
- Code split between core (`source/blender/sequencer/`) and editor (`source/blender/editors/space_sequencer/`)

**Core module responsibilities:**
- Strip rendering and compositing
- Modifiers and effects processing
- Proxy generation and management
- Frame caching and prefetching
- Strip operation logic (trim, split, duplicate, etc.)

**Strip types:**
- Scene strips (render another Blender scene inline)
- Movie/image/image sequence strips
- Sound strips (audio via Audaspace)
- Effect strips (cross, gamma cross, wipe, transform, speed control, color mix, glow, text)
- Compositor effect strips (apply compositor node trees to strip inputs)
- Meta strips (group multiple strips)
- Adjustment layer strips

**Data model:**
- Strip struct contains timeline positioning and media content data
- `blender::seq` namespace provides strip creation and management functions
- Strips organized in channels on a timeline with blend modes

**Pipeline position:** VSE runs LAST in the rendering order (after 3D render and compositor), enabling scene strips to include composited results.

---

### Grease Pencil 2D/3D Hybrid

**Architecture (Grease Pencil 3.0 rewrite):**
- Root: ID data-block containing layer tree, drawings array, materials array, and layer attributes
- Completely rewritten to use `CurvesGeometry` backend (same as hair curves system)
- Designed for multi-threading and Geometry Nodes compatibility

**Data structure:**
- **Layer tree:** Hierarchical structure -- leaf nodes are layers, inner nodes are layer groups
- **Drawings:** Static stroke sets stored as `CurvesGeometry` (attribute-based)
- **Layer ordering:** Bottom-up convention (first layer = bottommost in visual stack)

**Stroke attributes (per-point):**
- Geometry: `position`, `radius`, `opacity`
- Appearance: `vertex_color`, `rotation`, `softness` (gradient effects)
- Structure: `cyclic`, `curve_type` (POLY, BEZIER, CATMULL_ROM, NURBS)
- Materials: `material_index`, `fill_color`, `fill_opacity`
- Animation: `delta_time`, `init_time` for stroke playback timing
- Selection: `.selection` for point selection in edit mode

**Animation model:**
- Layers maintain independent keyframe-to-frame mappings
- Keyframes reference drawing indices by frame number
- Implicit keyframe holding between explicit keyframes
- Per-layer animation data independent of other layers

**2D/3D hybrid workflow:**
- 2D mode: front-facing plane, flat background, static camera (traditional animation/storyboard)
- 3D mode: strokes at various depths, drawn on surfaces or at 3D cursor, depth-based occlusion with 3D objects
- Vector-based strokes: resolution-independent, editable/sculptable/animatable like 3D objects

**Geometry Nodes integration:**
- CurvesGeometry representation enables full compatibility with Geometry Nodes
- Procedural stroke generation and modification via node graphs
- Same attribute system used by mesh, curves, and point cloud geometry types

**Data flow:** `Drawing input (tablet/mouse)` --> `CurvesGeometry strokes` --> `Layer tree organization` --> `Depsgraph evaluation` --> `Render (as geometry in 3D space or flat 2D overlay)`
