# Git Architecture Research

**Beads Issue:** hsg-iee2
**Style Guide:** library-card-catalog
**Folder:** architecture/git/

## Research Topics

- Content-addressable object store (blobs, trees, commits, tags)
- DAG (directed acyclic graph) commit model
- Packfiles and delta compression
- Refs, branches, and HEAD
- Index (staging area) internals
- Merge strategies (recursive, octopus, ort)
- Transport protocols (smart HTTP, SSH, git://)
- Hooks system
- Garbage collection and object pruning

## Key Public Sources

- "Pro Git" book by Scott Chacon (git-scm.com/book)
- Git internals documentation (git-scm.com/docs/git-internals)
- Git source code (well-commented C)
- "Git from the Bottom Up" by John Wiegley
- Linus Torvalds' original design emails

## Findings

### Content-Addressable Object Store

Git is fundamentally a **content-addressable filesystem** -- a key-value store where every piece of data is identified by its SHA-1 (or SHA-256) hash. All objects live in `.git/objects/`, stored with the first 2 hex characters as a subdirectory and the remaining 38 as the filename. Every object is zlib-compressed on disk.

**Object format:** Each object is hashed as `"<type> <bytesize>\0<content>"`. The SHA-1 of this string becomes the object's address. Identical content always produces the same hash, enabling automatic deduplication.

**Four object types:**

| Type | Purpose | Contents |
|------|---------|----------|
| **blob** | File content | Raw bytes (no filename or metadata) |
| **tree** | Directory listing | Entries of `<mode> <name>` pointing to blob/tree SHA-1s |
| **commit** | Snapshot + history | Tree SHA-1, parent SHA-1(s), author/committer, message |
| **tag** | Annotated label | Target object SHA-1, type, tag name, tagger, message, optional GPG signature |

**Tree entry modes:** `100644` (normal file), `100755` (executable), `120000` (symlink), `040000` (subdirectory/subtree), `160000` (gitlink/submodule).

**Commit structure (plaintext inside the object):**
```
tree <tree-sha1>
parent <parent-sha1>        # zero or more parent lines
author <name> <email> <unix-timestamp> <tz>
committer <name> <email> <unix-timestamp> <tz>

<commit message>
```

**Key plumbing commands:** `git hash-object -w` (create blob), `git cat-file -p/-t` (inspect object), `git update-index` (write to index), `git write-tree` (index to tree), `git commit-tree` (create commit).

---

### DAG (Directed Acyclic Graph) Commit Model

The commit history forms a **Directed Acyclic Graph** where:
- **Nodes** = commit objects
- **Edges** = parent pointers (each commit points backward to its parent(s))
- **Directed** = edges flow from child to parent (newer to older)
- **Acyclic** = no commit can be its own ancestor (SHA-1 hashing makes cycles impossible)

**Graph properties:**
- **Initial commits** have zero parents (root nodes of the DAG)
- **Normal commits** have exactly one parent
- **Merge commits** have two or more parents, recording the union of divergent histories
- **Branches** are mutable pointers ("post-it notes") attached to DAG nodes
- **Tags** are immutable pointers to specific nodes

**Reachability analysis** drives many Git operations: garbage collection removes unreachable objects; `git log` traverses reachable ancestors; `git merge-base` finds lowest common ancestors.

The DAG is **append-only** -- existing nodes are never mutated. Commands like `git commit --amend` and `git rebase` create new nodes and move references, leaving old nodes unreachable (eventually garbage collected).

**Object graph layers:** The full object graph includes blobs and trees too. A commit points to a tree, which points to blobs and subtrees, forming a snapshot of the entire working directory at that moment. Shared blobs/trees across commits provide structural sharing.

---

### Packfiles and Delta Compression

Git stores objects in two forms: **loose objects** (individual zlib-compressed files) and **packfiles** (consolidated binary archives with delta compression).

**Packfile binary format:**
```
Header:  "PACK" (4 bytes) | version (4 bytes, network order) | object count (4 bytes)
Body:    concatenated object entries
Trailer: 20-byte SHA-1 checksum of all preceding content
```

**Object entry types (3-bit type field):**

| Type ID | Name | Description |
|---------|------|-------------|
| 1 | OBJ_COMMIT | Full commit object |
| 2 | OBJ_TREE | Full tree object |
| 3 | OBJ_BLOB | Full blob object |
| 4 | OBJ_TAG | Full tag object |
| 6 | OFS_DELTA | Delta with negative byte offset to base object in same pack |
| 7 | REF_DELTA | Delta with 20-byte SHA-1 reference to base object |

**Delta compression algorithm:**
- Objects are sorted by type, then by filename, then by size
- A **sliding window** (default `--window=10`) compares each object against nearby objects to find the best delta base
- Delta depth is capped by `--depth` (default 50) to prevent long decompression chains
- Delta instructions are either **copy** (MSB=1, copy bytes from base) or **insert** (MSB=0, insert new literal bytes)
- Newer versions are stored intact; older versions as deltas (optimizes access to recent content)

**Pack index (.idx) file:**
- **Fanout table:** 256 entries mapping first-byte values to object count boundaries, enabling O(1) bucket lookup
- **Sorted object IDs:** Lexicographic order for binary search within buckets
- **Offset table:** Byte offsets into the .pack file for direct seeking

**Multi-Pack-Index (MIDX):** Consolidates indexes across multiple packfiles, storing object ID, pack ID, and offset to eliminate linear scanning.

**What triggers packing:**
- `git gc` (manual)
- `git gc --auto` (triggered at ~7,000 loose objects or >50 packfiles)
- `git push` (creates pack for transfer)
- `git repack` (explicit repacking)

**Compression results:** Typical 50%+ space reduction. Example: a 22KB file stored across versions drops from 14KB (two loose objects) to ~7KB (one full + one delta).

---

### Refs, Branches, and HEAD

**References (refs)** are human-readable names stored as plain text files containing a single SHA-1 hash.

**Directory layout:**
```
.git/refs/
  heads/       # Local branches (refs/heads/main, refs/heads/feature)
  tags/        # Tag references (refs/tags/v1.0)
  remotes/     # Remote-tracking refs (refs/remotes/origin/main)
```

**Branch mechanics:**
- A branch is simply a 41-byte file (40-char SHA-1 + newline) in `.git/refs/heads/`
- When you commit, Git updates the current branch file to point to the new commit
- Creating a branch = writing a new ref file; deleting = removing it
- `git update-ref` is the safe plumbing command (handles locking, reflog)

**HEAD:**
- Usually a **symbolic reference**: `ref: refs/heads/main`
- In **detached HEAD** state: contains a raw SHA-1
- `git symbolic-ref HEAD` reads/writes the symbolic reference
- HEAD cannot point outside of `refs/` for safety

**Lightweight vs annotated tags:**
- **Lightweight:** Plain ref file pointing directly to a commit SHA-1
- **Annotated:** Ref file pointing to a tag object, which itself points to the target commit (includes tagger, date, message, optional GPG signature)

**Remote-tracking refs:**
- Read-only bookmarks managed by Git (updated on fetch/push)
- HEAD never symbolically references a remote-tracking branch
- Stored in `refs/remotes/<remote>/<branch>`

**Packed refs:** `git gc` consolidates individual ref files into `.git/packed-refs` (one line per ref). Git checks loose refs first, then falls back to packed-refs. Format:
```
# pack-refs with: peeled fully-peeled
<sha1> refs/heads/main
<sha1> refs/tags/v1.0
^<sha1>                    # peeled tag (commit the annotated tag points to)
```

**Reflog:** `.git/logs/` stores a history of every ref change (commits, resets, checkouts). Entries expire after 90 days (reachable) or 30 days (unreachable) by default.

---

### Index (Staging Area) Internals

The index (`.git/index`) is a **binary file** that acts as a cache between the working tree and the repository. It represents the "next commit" -- the proposed snapshot.

**Binary format header (12 bytes):**
```
4-byte signature:  "DIRC" (dircache)
4-byte version:    2, 3, or 4
32-bit entry count
```

**Each cache entry contains (minimum 62 bytes + variable path):**

| Field | Size | Purpose |
|-------|------|---------|
| ctime (sec + nsec) | 8 bytes | Creation time (change detection) |
| mtime (sec + nsec) | 8 bytes | Modification time (change detection) |
| dev | 4 bytes | Device number |
| ino | 4 bytes | Inode number |
| mode | 4 bytes | File type (4 bits) + permissions (12 bits) |
| uid | 4 bytes | Owner user ID |
| gid | 4 bytes | Owner group ID |
| file size | 4 bytes | Truncated to 32-bit |
| Object SHA-1 | 20 bytes | Hash of the blob content |
| Flags | 2 bytes | assume-valid, extended, stage (2-bit), name length (12-bit) |
| Extended flags | 2 bytes | (v3+) skip-worktree, intent-to-add |
| Entry path | variable | NUL-terminated, relative to repo root |

**Entries are sorted** lexicographically by path (memcmp order). The 2-bit **stage** field tracks merge conflicts: stage 0 = normal, stages 1/2/3 = base/ours/theirs during conflict.

**Version differences:**
- **v2:** Basic format, no extended flags, 8-byte-aligned padding after path
- **v3:** Adds extended flags (skip-worktree for sparse checkout, intent-to-add for `git add -N`)
- **v4:** Path prefix compression (stores diff from previous entry's path), no padding

**Extensions (optional, identified by 4-byte signatures):**

| Extension | Purpose |
|-----------|---------|
| `TREE` | Cache tree -- precomputed tree objects for unchanged regions, speeds up `git commit` |
| `REUC` | Resolve undo -- preserves conflict data after resolution |
| `link` | Split index -- shared base index for large repositories |
| `UNTR` | Untracked cache -- cached untracked file list |
| `FSMN` | File system monitor -- fsmonitor hook data |
| `EOIE` | End of index entry -- enables parallel extension loading |
| `IEOT` | Index entry offset table -- enables multi-threaded index loading |
| `sdir` | Sparse directory entries -- sparse checkout optimization |

**File terminated by** a SHA-1/SHA-256 checksum over all preceding content.

**Three-layer architecture:** Working tree (filesystem) -> Index (staging area) -> Repository (committed objects). The index is the bridge: `git add` updates index entries from the working tree; `git commit` writes the index as a tree object into the repository.

---

### Merge Strategies

Git supports multiple merge strategy backends selected via `git merge -s <strategy>`.

**Three-way merge algorithm (core mechanism):**
1. Find the **merge base** (common ancestor) of the two branch tips
2. Compare each branch's tree against the base
3. If only one side changed a file, take that change
4. If both sides changed the same file, attempt automatic line-level merge
5. If both sides changed the same lines, mark as conflict

**Available strategies:**

| Strategy | Heads | Default When | Key Features |
|----------|-------|-------------|--------------|
| **ort** | 2 | Single branch merge (v2.33+) | Rename detection, histogram diff, virtual merge base, submodule support |
| **recursive** | 2 | Legacy (now synonym for ort since v2.50) | Original implementation of the same algorithm |
| **resolve** | 2 | Never (manual) | Simpler 3-way merge, no rename detection |
| **octopus** | 2+ | Multiple branches | Refuses if manual conflict resolution needed |
| **ours** | any | Never (manual) | Result is always current branch; ignores all other changes |
| **subtree** | 2 | Never (manual) | Adjusts tree structure to match subtree layout |

**ort/recursive -- virtual merge base:** When multiple common ancestors exist (criss-cross merge), the algorithm recursively merges the common ancestors to create a synthetic merge base. This avoids ambiguity and reduces mismerges.

**ort strategy options (`-X`):**
- `ours` / `theirs` -- auto-resolve conflicting hunks by favoring one side (non-conflicting changes still merged)
- `patience` / `histogram` / `minimal` / `myers` -- diff algorithm selection (ort defaults to histogram)
- `find-renames[=<n>]` -- rename detection with similarity threshold
- `ignore-space-change` / `ignore-all-space` -- whitespace handling
- `renormalize` -- re-run clean/smudge filters during merge

**Octopus strategy:** Merges N branches sequentially (first two, then result with third, etc.). Aborts entirely if any step produces conflicts. Used for bundling topic branches.

---

### Transport Protocols

Git supports two protocol categories: **dumb** (deprecated, read-only HTTP) and **smart** (interactive negotiation).

**Smart protocol architecture -- two process pairs:**

| Operation | Client Process | Server Process | Direction |
|-----------|---------------|----------------|-----------|
| Push | `send-pack` | `receive-pack` | Client -> Server |
| Fetch/Clone | `fetch-pack` | `upload-pack` | Server -> Client |

**Protocol flow (fetch example over SSH):**
```
1. Client opens SSH: ssh git@server "git-upload-pack 'repo.git'"
2. Reference discovery: server sends all refs + capabilities
3. Want/have negotiation:
   - Client sends "want <sha1>" for needed objects
   - Client sends "have <sha1>" for already-owned objects
   - Server responds with ACK/NAK
4. Packfile transfer: server computes minimal packfile, streams it
5. Client unpacks and updates refs
```

**Wire protocol format:**
- **pkt-line:** Each chunk prefixed with 4-hex-digit length (includes the 4 bytes themselves)
- `0000` = flush packet (end of section)
- Example: `00a5ca82a6...` = 165-byte chunk

**Transport layers:**

| Transport | URL | Mechanism | Auth | Features |
|-----------|-----|-----------|------|----------|
| **SSH** | `git@host:repo.git` | Opens `git-upload-pack`/`git-receive-pack` via SSH | SSH keys | Read/write, encrypted |
| **Smart HTTP** | `https://host/repo.git` | POST to `/info/refs?service=git-upload-pack` then `/git-upload-pack` | HTTP auth | Read/write, firewall-friendly |
| **git://** | `git://host/repo.git` | Custom daemon on port 9418 | None | Read-only (typically), fastest |
| **Dumb HTTP** | `http://host/repo.git` | Sequential GET requests for individual objects | HTTP auth | Read-only, deprecated |

**Capability negotiation:** Server advertises capabilities in reference discovery: `report-status`, `delete-refs`, `side-band-64k`, `ofs-delta`, `thin-pack`, `multi_ack`, `shallow`, `no-progress`, `include-tag`. Client selects which to use.

**Push flow:** Client sends lines of `<old-sha1> <new-sha1> <refname>` (all-zeros on left = new ref; all-zeros on right = delete ref), followed by a packfile containing needed objects. Server runs `receive-pack`, optionally triggers `pre-receive` and `update` hooks, then updates refs.

---

### Hooks System

Hooks are **executable scripts** in `.git/hooks/` that fire on specific Git events. They are not transferred during clone (local-only by default).

**Hook execution model:**
- **Pre-hooks** can abort operations (non-zero exit = cancel)
- **Post-hooks** are notifications only (cannot prevent the completed action)
- `--no-verify` flag bypasses client-side pre-hooks
- Server-side hooks cannot be bypassed by clients

**Client-side hooks (committing workflow):**

| Hook | Trigger | Can Abort? | Use Cases |
|------|---------|------------|-----------|
| `pre-commit` | Before commit message prompt | Yes | Lint, test, whitespace check |
| `prepare-commit-msg` | After default message created, before editor opens | Yes | Template injection, auto-populate |
| `commit-msg` | After message written | Yes | Validate message format |
| `post-commit` | After commit completes | No | Notifications, logging |

**Client-side hooks (patch workflow):**

| Hook | Trigger | Can Abort? |
|------|---------|------------|
| `applypatch-msg` | During `git am`, before apply | Yes |
| `pre-applypatch` | After patch applied, before commit | Yes |
| `post-applypatch` | After `git am` commit | No |

**Client-side hooks (other):**

| Hook | Trigger | Can Abort? | Use Cases |
|------|---------|------------|-----------|
| `pre-rebase` | Before rebase starts | Yes | Prevent rebase of pushed commits |
| `post-rewrite` | After `commit --amend` or `rebase` | No | Re-run post-checkout-like tasks |
| `post-checkout` | After `git checkout` | No | Set up environment, generate docs |
| `post-merge` | After `git merge` | No | Restore permissions, external files |
| `pre-push` | During push, before object transfer | Yes | Validate refs, run tests |
| `pre-auto-gc` | Before `git gc --auto` | Yes | Delay GC if bad timing |

**Server-side hooks:**

| Hook | Trigger | Scope | Can Reject? |
|------|---------|-------|-------------|
| `pre-receive` | First, on push arrival | All refs at once | Yes (rejects entire push) |
| `update` | Per-branch during push | Single ref | Yes (rejects just that ref) |
| `post-receive` | After push completes | All refs | No (notification only) |

**Server-side hook arguments:**
- `pre-receive`: reads `<old-sha1> <new-sha1> <refname>` lines from stdin
- `update`: receives ref name, old SHA-1, new SHA-1 as arguments
- `post-receive`: same stdin format as pre-receive

---

### Garbage Collection and Object Pruning

**`git gc` performs four operations:**
1. Packs loose objects into packfiles (`git repack`)
2. Consolidates multiple packfiles into one
3. Packs loose refs into `.git/packed-refs`
4. Removes unreachable objects older than the grace period

**Auto-gc thresholds (configurable):**
- `gc.auto` = 6700 loose objects (triggers packing)
- `gc.autopacklimit` = 50 packfiles (triggers consolidation)

**Object reachability:** An object is reachable if any ref, reflog entry, or the index points to it (directly or transitively through the DAG). Unreachable objects are "dangling."

**Pruning timeline:**
- Reflog entries expire after 90 days (reachable) or 30 days (unreachable) by default (`gc.reflogExpire`, `gc.reflogExpireUnreachable`)
- `git prune` removes unreachable loose objects (called by `git gc`)
- `git prune --expire now` forces immediate removal

**Data recovery tools:**
- `git reflog` -- find recently-orphaned commits via HEAD history
- `git fsck --full` -- filesystem check, reports dangling blobs/commits/trees
- `git branch recover-branch <sha1>` -- re-attach a dangling commit

**Object inspection:**
```
git count-objects -v        # loose object count and sizes
git verify-pack -v *.idx    # inspect packfile contents and delta chains
git rev-list --objects --all | grep <sha1>   # find which path an object belongs to
```

**Large object removal (history rewriting):**
- `git filter-branch --index-filter 'git rm --cached --ignore-unmatch <file>'` rewrites history
- After rewriting: remove `.git/refs/original`, `.git/logs/`, then `git gc` to reclaim space
- Modern alternative: `git filter-repo` (external tool, faster)

---

### Architectural Design Decisions

**Why content-addressable storage?** Identical content is automatically deduplicated across the entire repository history. Integrity verification is built-in -- any bit-flip changes the hash and is immediately detectable.

**Why immutable objects + mutable refs?** The object store is append-only (safe for concurrent access, trivially cacheable), while refs provide the mutable "view" layer. This separation enables lock-free reads and simple distributed replication.

**Why snapshot-based (not delta-based) commits?** Each commit stores a complete tree pointer, not a changeset. This makes checkout O(tree-size) rather than O(history-length), and enables constant-time diff between any two commits. Deltas are purely a storage optimization in packfiles, invisible to the logical model.

**Why the index?** The staging area enables partial commits (committing only some changes), conflict resolution (stage slots 1/2/3), and performance optimization (stat cache avoids re-hashing unchanged files).

**Why SHA-1?** Originally chosen for speed and collision resistance. Git is migrating to SHA-256 (`extensions.objectFormat`) for stronger cryptographic guarantees. The hash serves triple duty: content address, integrity check, and deduplication key.
