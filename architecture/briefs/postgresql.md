# PostgreSQL Architecture Research

**Beads Issue:** hsg-au6u
**Style Guide:** geological-mineral
**Folder:** architecture/postgresql/

## Research Topics

- Process architecture (postmaster, backend processes, background workers)
- MVCC (Multi-Version Concurrency Control) and tuple visibility
- WAL (Write-Ahead Logging) and crash recovery
- Query processing pipeline (parser, analyzer, rewriter, planner, executor)
- Buffer manager and shared memory
- Index types (B-tree, Hash, GiST, SP-GiST, GIN, BRIN)
- Extension system and hook architecture
- Logical and physical replication
- Vacuum and autovacuum

## Key Public Sources

- PostgreSQL official documentation (internals chapter)
- "The Internals of PostgreSQL" by Hironobu Suzuki
- pganalyze blog posts
- PostgreSQL source code comments (exceptionally well-documented)

## Findings

### Process Architecture

PostgreSQL uses a **multi-process architecture** (not multi-threaded). The **postmaster** is the supervisory daemon that manages the entire system.

**Postmaster responsibilities:**
- Listens on TCP port 5432 (configurable) for incoming connections
- Parses configuration (`postgresql.conf`, `pg_hba.conf`), validates data directory
- Allocates shared memory segments at startup
- Forks all child processes and monitors them via `SIGCHLD`
- Runs an infinite `ServerLoop` event loop checking for new connections and crashed children
- Implements signal-based administration: `SIGHUP` (reload config), `SIGINT` (fast shutdown), `SIGTERM` (smart shutdown), `SIGQUIT` (immediate shutdown)

**Backend processes:**
- One forked per client connection via `postmaster_child_launch()`
- Each backend inherits access to shared memory (buffer pool pointers, lock tables)
- Executes queries, manages transactions, returns results
- Limited by `max_connections` (default 100)

**Background maintenance processes (always running):**
- **Checkpointer** -- flushes all dirty pages to disk periodically, recycles WAL segments, creates recovery points
- **Background Writer (bgwriter)** -- proactively flushes dirty pages to maintain free buffer space, reducing backend eviction pressure
- **WAL Writer** -- transfers WAL data from WAL buffers to persistent storage on a timer
- **Autovacuum Launcher** -- spawns autovacuum worker processes on a schedule based on dead tuple thresholds
- **Stats Collector** -- gathers activity statistics from backends via UDP (replaced by shared memory stats in PG 15+)
- **Archiver** -- copies completed WAL segments to archive storage for PITR (Point-In-Time Recovery)
- **IO Workers** -- perform asynchronous page reads to reduce backend I/O blocking

**Replication processes:**
- **WAL Sender** -- streams WAL records to standbys; starts as a normal backend then transforms when the startup packet indicates `replication=true`
- **WAL Receiver** -- runs on standby, requests WAL from the primary's WAL sender
- **Startup Process** -- replays WAL records during recovery; on standbys it runs continuously

**Background Workers (extensible):**
- Custom processes registered via `RegisterBackgroundWorker()` in `_PG_init()` or dynamically via `RegisterDynamicBackgroundWorker()`
- Used for parallel query workers, logical replication apply workers, and extension-specific tasks
- Controlled by `max_worker_processes` (default 8)

**Inter-process communication:**
- Shared memory for data (buffer pool, lock tables, PGPROC array, CLOG)
- Signals for control flow (see signal table above)
- When a child crashes, `HandleChildCrash()` broadcasts termination to all children and restarts the startup process for crash recovery

**Shutdown coordination modes:**
- Smart: waits for all clients to disconnect, then checkpoints
- Fast: terminates backends immediately, performs final checkpoint
- Immediate: ungraceful exit, requires crash recovery on restart

---

### MVCC (Multi-Version Concurrency Control)

PostgreSQL implements **Snapshot Isolation (SI)**, a variation of MVCC where readers never block writers and writers never block readers. Unlike systems using Strict Two-Phase Locking (S2PL), PostgreSQL keeps multiple physical versions of each row.

**Tuple header fields:**
- **t_xmin** -- transaction ID (XID) that inserted this tuple version
- **t_xmax** -- XID that deleted/updated this tuple version (0 if still live)
- **t_cid** -- command ID within the transaction (for distinguishing multiple operations in one transaction)
- **t_ctid** -- tuple ID pointing to the next version of this row (self-referencing if this is the latest version)

**How operations work:**
- **INSERT**: creates a new tuple with `t_xmin = current XID`, `t_xmax = 0`
- **DELETE**: sets `t_xmax = current XID` on the existing tuple (does not physically remove it)
- **UPDATE**: combination of DELETE + INSERT -- marks the old tuple with `t_xmax`, creates a new tuple with `t_xmin`, and chains them via `t_ctid`

**Transaction snapshots:**
- A snapshot captures: `xmin` (oldest active XID), `xmax` (first unassigned XID), and `xip_list` (list of in-progress XIDs)
- READ COMMITTED takes a new snapshot per statement
- REPEATABLE READ / SERIALIZABLE take one snapshot at transaction start

**Visibility check rules:**
- A tuple is visible if its `t_xmin` transaction committed before the snapshot was taken AND its `t_xmax` is either 0, belongs to an aborted transaction, or committed after the snapshot
- The CLOG (Commit Log, stored in `pg_xact/`) tracks transaction states: IN_PROGRESS, COMMITTED, ABORTED, SUB_COMMITTED
- Hint bits on tuple headers cache commit/abort status to avoid repeated CLOG lookups

**Isolation levels:**
- **READ COMMITTED** -- default; allows non-repeatable reads
- **REPEATABLE READ** -- prevents dirty reads and non-repeatable reads; detects serialization anomalies at commit time
- **SERIALIZABLE** -- true serializability via SSI (Serializable Snapshot Isolation), added in PG 9.1; detects write skew and other anomalies that plain SI misses by tracking read/write dependencies (rw-conflicts) and aborting dangerous transaction orderings

---

### WAL (Write-Ahead Logging)

The WAL guarantees durability: changes to data files are written only after the corresponding WAL record has been flushed to disk. This is PostgreSQL's crash recovery foundation.

**Core principle:** No dirty page is flushed to disk until its corresponding WAL record is on stable storage (the "WAL before data" rule).

**WAL file structure:**
- WAL is stored in `pg_wal/` as a sequence of 16 MB segment files (configurable via `--wal-segsize` at initdb)
- Each record is identified by a **Log Sequence Number (LSN)** -- a 64-bit byte offset into the WAL stream
- Segments are named by their starting LSN in hexadecimal

**Key functions (source code):**
- `XLogInsert()` -- constructs a WAL record and appends it to WAL buffers (called on every tuple insert/update/delete, page split, etc.)
- `XLogWrite()` -- flushes WAL buffers to disk
- `XLogFlush()` -- ensures WAL up to a given LSN is on stable storage (called before transaction commit)
- `StartupXLOG()` -- main crash recovery function; reads and replays WAL from the redo point

**Checkpoint mechanism:**
- A checkpoint flushes all dirty buffers from shared memory to disk and writes a checkpoint record to WAL
- The **redo point** is the LSN where crash recovery begins (the point where the last checkpoint started writing)
- Controlled by `checkpoint_timeout` (default 5 min) and `max_wal_size` (default 1 GB)
- The checkpointer process spreads I/O over the checkpoint interval using `checkpoint_completion_target` (default 0.9)

**Full-page writes (FPW):**
- After a checkpoint, the first modification to any page writes the entire 8 KB page image into WAL (not just the delta)
- This protects against torn pages (partial writes during OS crash)
- Subsequent modifications to the same page before the next checkpoint only write the delta
- Controlled by `full_page_writes` (default on -- should never be turned off)

**Crash recovery flow:**
1. Postmaster starts the startup process
2. `StartupXLOG()` reads the `pg_control` file to find the latest checkpoint
3. Begins replaying WAL records from the checkpoint's redo point
4. For each record, applies the change to the corresponding data page (idempotent -- safe to replay multiple times)
5. Continues until end of WAL is reached
6. System is consistent; normal operations can begin

**WAL levels:**
- `minimal` -- only enough for crash recovery
- `replica` -- adds data needed for WAL archiving and replication (default since PG 10)
- `logical` -- adds information for logical decoding/replication

---

### Query Processing Pipeline

The query pipeline flows: **SQL text -> Parser -> Analyzer -> Rewriter -> Planner -> Executor -> Results**. PostgreSQL's source describes this as "the most complicated subsystem."

**1. Parser** (`src/backend/parser/`)
- Uses **Flex** (lexical analyzer) for tokenization and **Bison** (parser generator) for grammar rules
- Grammar defined in `gram.y` (~15,000 lines), lexer in `scan.l`
- Produces a raw **parse tree** of `Node` structures
- Only checks syntax -- no semantic validation (doesn't verify that tables exist)

**2. Analyzer** (`src/backend/parser/analyze.c`)
- Performs **semantic analysis** on the parse tree
- Looks up tables, columns, functions, and operators in the **system catalog** (`pg_class`, `pg_attribute`, `pg_proc`, `pg_operator`)
- Resolves names to internal **Object Identifiers (OIDs)**
- Infers and validates data types, inserts implicit type casts
- Produces a **query tree** (`Query` struct)

**3. Rewriter** (`src/backend/rewrite/rewriteHandler.c`)
- Applies **rule-based transformations** stored in `pg_rewrite`
- Expands **views** into their underlying queries (a view is stored as a `SELECT` rule on a dummy relation)
- Applies user-defined rules (`CREATE RULE`)
- Can produce multiple query trees from a single input (e.g., `INSTEAD` rules)

**4. Planner/Optimizer** (`src/backend/optimizer/`)
- **Cost-based optimizer** that evaluates many possible execution strategies
- Uses table statistics from `pg_statistic` (maintained by ANALYZE) for selectivity estimation
- Calls `get_relation_info()` to retrieve page counts, tuple counts, available indexes

- **Scan types considered:**
  - Sequential Scan -- reads every page; best for small tables or low selectivity
  - Index Scan -- traverses B-tree (or other index) to find qualifying rows
  - Index Only Scan -- returns data directly from the index (if visibility map confirms all-visible)
  - Bitmap Index Scan / Bitmap Heap Scan -- builds a bitmap of matching pages, then fetches them (good for medium selectivity)
  - TID Scan -- direct tuple access by physical location

- **Join algorithms:**
  - **Nested Loop Join** -- for each row in outer, scan inner; good for small inner or indexed inner
  - **Hash Join** -- builds hash table from inner, probes with outer; good for equi-joins on large tables
  - **Merge Join** -- merges two pre-sorted inputs; good when both sides are already sorted or indexable

- Generates a **plan tree** of `Plan` nodes; each node represents an operation
- For complex queries with many joins, uses **Genetic Query Optimizer (GEQO)** when join count exceeds `geqo_threshold` (default 12)
- Outputs a `PlannedStmt` structure

**5. Executor** (`src/backend/executor/`)
- Implements the **iterator (pull-based/Volcano) model**: each plan node has `ExecInit`, `ExecProcNode` (returns one tuple at a time), and `ExecEnd` methods
- The top node pulls tuples from child nodes recursively
- Accesses heap tables and indexes through the **access method API** (abstraction layer)
- Results returned as `TupleTableSlot` objects via a `DestReceiver` interface
- DDL statements bypass the executor and go through `ProcessUtility`

---

### Buffer Manager and Shared Memory

**Shared memory layout (allocated at startup):**
- **Shared Buffer Pool** -- cached data pages (default 128 MB, controlled by `shared_buffers`)
- **WAL Buffers** -- staging area for WAL records before flush (default ~3% of shared_buffers, controlled by `wal_buffers`)
- **CLOG Buffers** -- cached pages from the commit log (`pg_xact/`), storing transaction states (2 bits per XID: IN_PROGRESS, COMMITTED, ABORTED, SUB_COMMITTED)
- **Subtransaction Buffers** -- track savepoint/subtransaction relationships
- **Multixact Buffers** -- manage shared row locks (multiple transactions locking the same row)
- **PGPROC Array** -- one entry per backend/worker, tracking current XID, database OID, wait state
- **Lock Tables** -- shared hash tables for heavyweight locks, lightweight locks (LWLocks), and spinlocks
- **Proc Signal Array** -- for inter-process signaling

**Per-backend local memory:**
- **work_mem** (default 4 MB) -- per-operation memory for sorts and hash tables; exceeded operations spill to temp files
- **maintenance_work_mem** (default 64 MB) -- for VACUUM, CREATE INDEX, ALTER TABLE
- **temp_buffers** (default 8 MB) -- per-session cache for temporary tables

**Buffer pool architecture:**
- All data is stored in **8 KB pages** (compile-time configurable)
- The buffer pool is an array of **buffer slots**, each holding one 8 KB page
- Three parallel data structures:
  1. **Buffer blocks** -- the actual 8 KB page data
  2. **Buffer descriptors** -- ~64-byte metadata per slot: buffer tag (relation + fork + block number), flags (dirty, valid, I/O in progress), pin count, usage count
  3. **Buffer hash table** -- maps `(tablespace OID, relation OID, fork number, block number)` to buffer slot index; provides O(1) lookup

**Clock-sweep eviction (buffer replacement):**
- The buffer descriptors form a logical clock face with a `nextVictimBuffer` pointer
- When a free slot is needed, the clock hand sweeps:
  - If usage count > 0: decrement by 1, skip
  - If usage count == 0 and pin count == 0: select as victim
- On each page access, usage count is incremented (up to a cap of 5)
- This approximates LRU without the overhead of maintaining a linked list

**Ring buffer strategy:**
- For large sequential scans, VACUUM, and bulk writes, PostgreSQL uses a small ring buffer (256 KB - 16 MB) instead of the main buffer pool
- Prevents large operations from evicting useful cached pages ("buffer pollution")

**Concurrency:**
- The buffer hash table is **partitioned** (since PG 8.2) into 128 partitions, each with its own LWLock, eliminating the single-lock bottleneck
- Buffer descriptors use spinlocks for header field updates
- Pin/unpin operations use atomic compare-and-swap

---

### Index Types

PostgreSQL supports six built-in index access methods, each with different internal data structures and use cases.

**B-tree** (default, most common)
- Implements the **Lehman-Yao algorithm** -- a concurrent B-tree variant with right-link pointers allowing lock-free reads during page splits
- Balanced tree maintaining sorted order; O(log n) search, insert, delete
- Supports `<`, `<=`, `=`, `>=`, `>`, `BETWEEN`, `IN`, `IS NULL`, pattern matching with fixed prefix (`LIKE 'foo%'`)
- Internal nodes store keys + child pointers; leaf nodes store keys + heap TIDs
- Page splits create a new right sibling and insert a copy of the separator key into the parent
- Supports **index-only scans** when the visibility map confirms all-visible pages
- Deduplication (PG 13+) stores multiple TIDs per key entry, reducing index size

**Hash**
- Bucket-based index using a hash function; only supports equality (`=`) comparisons
- Structure: metapage -> bucket pages -> overflow pages
- WAL-logged since PG 10 (previously not crash-safe)
- Faster than B-tree for pure equality lookups on high-cardinality columns, but far less flexible
- Cannot be used for range queries or sorting

**GiST (Generalized Search Tree)**
- Balanced tree framework supporting arbitrary data types via **operator classes**
- Each internal node stores a "bounding" predicate that contains all entries in its subtree
- "Lossy" indexes -- may produce false positives that the executor filters out automatically
- Used for: geometric data (`@>`, `&&`, `<->`), full-text search (`@@`), range types, ltree, inet
- Supports nearest-neighbor (KNN) searches via `ORDER BY <-> point`
- Extensions define `consistent`, `union`, `penalty`, `picksplit`, `same` methods

**SP-GiST (Space-Partitioned GiST)**
- Framework for **non-balanced, space-partitioning** tree structures
- Implements quadtrees, k-d trees, and radix trees (tries)
- Best for data with natural clustering but uneven distribution (e.g., phone numbers, IP addresses, geometric points)
- Partitions space into non-overlapping regions (unlike GiST's overlapping bounding regions)
- Supports prefix searching and spatial queries

**GIN (Generalized Inverted Index)**
- **Inverted index** mapping element values to sets of rows containing them
- Structure: entry tree (B-tree of keys) -> posting lists (sorted lists of heap TIDs) or posting trees (B-tree of TIDs for high-frequency keys)
- Ideal for: full-text search (`tsvector`), arrays (`@>`), JSONB containment (`@>`, `?`, `?|`, `?&`), trigram similarity (`pg_trgm`)
- **Fast update** mode (default on): new entries go into a pending list, merged into the main index during VACUUM or when the pending list exceeds `gin_pending_list_limit`
- Larger on disk than GiST but typically faster for lookups

**BRIN (Block Range Index)**
- Stores **summary information** (min/max by default) for ranges of consecutive physical table pages
- Extremely compact -- often 1000x smaller than a B-tree on the same column
- Effective only when column values correlate with physical row order (e.g., timestamps in an append-only table)
- `pages_per_range` controls granularity (default 128 pages)
- On lookup: eliminates block ranges that cannot contain matching rows, then sequential-scans the remaining ranges
- Supports minmax, inclusion, and bloom operator classes

---

### Extension System and Hook Architecture

PostgreSQL's extension system allows adding new data types, functions, operators, index methods, languages, and more without modifying core code.

**Extension packaging:**
- An extension is a SQL script + optional shared library (`.so`/`.dll`) + control file (`.control`)
- Installed via `CREATE EXTENSION name`; the control file specifies version, dependencies, schema, and whether it requires superuser
- Extension objects are tracked in `pg_extension` and `pg_depend` catalogs

**Hook mechanism:**
- Hooks are **global function pointers** (initially NULL) declared as `extern` in PostgreSQL headers
- When an extension loads, its `_PG_init()` function saves the current hook pointer and replaces it with a custom handler
- On unload, `_PG_fini()` restores the saved pointer
- This enables **hook chaining/stacking**: multiple extensions can hook the same point, each calling the previously saved handler

**Approximately 30 hooks organized into categories:**

- **Query Processing Hooks:**
  - `post_parse_analyze_hook` -- after parsing/analysis, before rewriting
  - `planner_hook` -- replaces or wraps the entire planner
  - `join_search_hook` -- custom join ordering
  - `set_rel_pathlist_hook` -- add custom scan paths

- **Executor Hooks:**
  - `ExecutorStart_hook`, `ExecutorRun_hook`, `ExecutorFinish_hook`, `ExecutorEnd_hook` -- wrap each executor phase
  - `ProcessUtility_hook` -- intercept DDL/utility statements

- **Security Hooks:**
  - `ClientAuthentication_hook` -- intercept authentication decisions
  - `object_access_hook` -- monitor/control access to database objects
  - `check_password_hook` -- validate password policies

- **Initialization Hooks:**
  - `shmem_startup_hook` -- allocate custom shared memory at startup
  - `emit_log_hook` -- intercept log messages

- **PL/pgSQL Hooks:**
  - `func_setup`, `func_beg`, `func_end`, `stmt_beg`, `stmt_end` -- instrument PL/pgSQL execution

**Notable extensions using hooks:**
- **pg_stat_statements** -- uses all four executor hooks to track query elapsed time and call counts
- **TimescaleDB** -- uses `planner_hook` to rewrite queries for hypertable chunks, `post_parse_analyze_hook` for query transformation, `ProcessUtility_hook` for DDL interception
- **pgAudit** -- uses executor and utility hooks for audit logging
- **auto_explain** -- uses executor hooks to log slow query plans

**Other extension mechanisms (beyond hooks):**
- Custom access methods (`CREATE ACCESS METHOD`)
- Custom data types + operator classes
- Foreign Data Wrappers (`CREATE FOREIGN DATA WRAPPER`)
- Custom background workers
- Custom WAL resource managers (PG 15+)
- Table Access Method API (PG 12+) -- pluggable storage engines

---

### Logical and Physical Replication

PostgreSQL supports two replication paradigms: physical (byte-level WAL shipping) and logical (row-level change streaming).

**Physical (Streaming) Replication:**
- Standby connects to primary with `replication=true` in startup packet
- WAL sender on primary streams WAL records continuously to WAL receiver on standby
- WAL receiver writes records to standby's `pg_wal/` and the startup process replays them
- The standby is an exact byte-for-byte copy of the primary (same data directory layout)
- Supports **synchronous** (`synchronous_commit`, `synchronous_standby_names`) and **asynchronous** modes
- **Hot Standby**: standby accepts read-only queries while replaying WAL
- Replication slots prevent the primary from recycling WAL segments the standby still needs

**Streaming replication protocol:**
- Uses PostgreSQL's standard wire protocol in COPY-both mode
- `XLogData` messages carry WAL bytes with LSN positions
- `Primary Keepalive` messages from server with "reply requested" flag
- `Standby Status Update` messages report write/flush/apply LSN positions
- `Hot Standby Feedback` messages send the standby's `xmin` to prevent vacuum of still-needed rows on primary
- Timeline handling supports failover scenarios -- streaming can cross timeline boundaries

**Logical Replication:**
- Built on top of **logical decoding** -- a WAL decoder that extracts row-level changes
- Publisher creates **publications** (sets of tables + operation filters: INSERT/UPDATE/DELETE/TRUNCATE)
- Subscriber creates **subscriptions** pointing to publisher connection + publication names
- Requires `wal_level = logical`

**Logical replication data flow:**
1. Subscriber connects; publisher spawns a **WAL sender** process
2. WAL sender starts logical decoding, loading the **pgoutput** output plugin
3. pgoutput reads WAL, transforms changes into the logical replication protocol, filters by publication spec
4. Changes queue into the **reorder buffer** -- collects transaction pieces in WAL order
5. When a transaction commits, the reorder buffer reassembles it and invokes pgoutput
6. Changes stream to the subscriber's **apply worker** using the streaming replication protocol
7. Apply worker maps remote tables to local tables and applies changes in transactional order

**Initial table synchronization:**
- When a subscription starts, dedicated **table sync workers** (one per table) are spawned
- Each creates a temporary replication slot with `USE_SNAPSHOT`
- Copies existing data via `COPY`, then replays incremental changes until catching up to the apply worker's LSN
- After sync, the table sync worker exits and the apply worker takes over

**Key differences from physical replication:**
- Logical: selective tables/columns, cross-version, cross-platform, allows writes on subscriber
- Physical: entire cluster, same major version, read-only standby, simpler setup

**Replication slots:**
- Prevent WAL recycling for disconnected consumers
- Physical slots track LSN position; logical slots also track the oldest XID needed for catalog lookups
- `pg_replication_slots` view shows slot status
- Failover slots (PG 17+) can be synced to standbys for seamless failover

---

### Vacuum and Autovacuum

VACUUM is essential because PostgreSQL's MVCC never removes old tuple versions in-place. Dead tuples accumulate and must be reclaimed.

**Why dead tuples form:**
- DELETE sets `t_xmax` but leaves the tuple physically in the heap
- UPDATE creates a new version and marks the old one dead
- Dead tuples are invisible to all current/future transactions but still occupy disk space
- Without VACUUM, tables suffer **bloat** (wasted space) and eventual **XID wraparound** (catastrophic data loss)

**Regular VACUUM (concurrent, non-blocking):**

*Phase 1 -- Heap Scan:*
- Scans each heap page, checking the visibility map (VM) to skip all-visible pages
- Identifies dead tuples and records their TIDs in a **dead tuple array** (limited by `maintenance_work_mem`)
- If the array fills before the table is fully scanned, processes what it has, then continues

*Phase 2 -- Index Vacuum:*
- For each index on the table, scans the entire index and removes entries pointing to dead TIDs
- This is the most expensive phase for tables with many indexes

*Phase 3 -- Heap Vacuum:*
- Returns to the heap and marks dead tuple slots as free space in the **Free Space Map (FSM)**
- Future INSERTs can reuse these slots
- Updates the visibility map: pages with no dead tuples are marked **all-visible**

**Visibility Map (VM):**
- Two bits per heap page:
  - **All-visible** -- all tuples on this page are visible to all transactions (VACUUM and index-only scans can skip it)
  - **All-frozen** (PG 9.6+) -- all tuples are frozen (freeze processing can skip it)
- Dramatically speeds up VACUUM on large tables where most data is unchanged

**Freeze processing (XID wraparound prevention):**
- XIDs are 32-bit (~4 billion); PostgreSQL uses modular arithmetic to compare them
- Without freezing, after ~2 billion transactions, old XIDs would appear to be "in the future" and tuples would vanish
- VACUUM freezes tuples by replacing their `t_xmin` with `FrozenTransactionId` (XID 2), making them permanently visible
- `vacuum_freeze_min_age` (default 50M) -- minimum age before freezing
- `vacuum_freeze_table_age` (default 150M) -- triggers aggressive (full-table) vacuum scan
- `autovacuum_freeze_max_age` (default 200M) -- forces anti-wraparound vacuum regardless of dead tuple count

**Autovacuum:**
- The **autovacuum launcher** process wakes every `autovacuum_naptime` (default 1 min)
- Checks `pg_stat_all_tables` for tables exceeding the dead tuple threshold:
  `dead_tuples > autovacuum_vacuum_threshold + autovacuum_vacuum_scale_factor * live_tuples`
  (defaults: threshold=50, scale_factor=0.2, meaning 20% dead + 50)
- Spawns **autovacuum workers** (up to `autovacuum_max_workers`, default 3)
- Workers throttle I/O via `autovacuum_vacuum_cost_delay` and `autovacuum_vacuum_cost_limit` to avoid impacting production queries
- Also triggers ANALYZE to update `pg_statistic` when insert/update/delete counts exceed thresholds

**VACUUM FULL:**
- Rewrites the entire table into a new file, compacting it and eliminating all dead space
- Requires an **ACCESS EXCLUSIVE** lock (blocks all reads and writes)
- Reclaims disk space to the OS (regular VACUUM only reclaims space for reuse within the table file)
- Rebuilds all indexes
- Should be used sparingly; regular VACUUM is preferred for routine maintenance

**CLOG (pg_xact) truncation:**
- VACUUM also truncates old CLOG segment files once all XIDs in them are frozen or no longer needed
- Prevents unbounded growth of the commit log
