# Linear Architecture Research

**Beads Issue:** hsg-p9xh
**Style Guide:** minimalism
**Folder:** architecture/linear/

## Research Topics

- Local-first sync engine architecture
- Offline-capable data model
- Real-time collaboration protocol
- Tech stack (TypeScript, React, Electron)
- Database and persistence layer
- API design (GraphQL)
- Performance optimization philosophy
- Keyboard-first UX architecture

## Key Public Sources

- Linear blog (linear.app/blog)
- "Linear's Sync Engine" technical posts
- Karri Saarinen (CEO) talks on local-first architecture
- Linear changelog (detailed technical decisions)
- "Building Linear" podcast appearances

---

## Findings

### 1. Core Tech Stack

Linear's tech stack, confirmed by CTO Tuomas Artman in 2019 and expanded since:

- **Frontend:** React + MobX + TypeScript
- **Backend:** Node.js + TypeScript
- **Primary Database:** PostgreSQL
- **Caching Layer:** MongoDB (chosen for 3-4x performance advantage over BigTable for serialized model objects and delta sync packets)
- **Client Storage:** IndexedDB (browser-side persistence)
- **Real-time Transport:** WebSockets
- **API:** GraphQL (same API used internally and externally)
- **Desktop App:** Electron (wrapping the same React web app)
- **Collaborative Editing:** Y.js (CRDT, added later for rich-text issue descriptions)
- **Infrastructure:** Google Cloud Platform (GCP), initially us-east1
- **Infrastructure-as-Code:** Terraform
- **Proxy Layer:** Cloudflare Workers (for multi-region routing)
- **Messaging:** Google Pub/Sub (inter-service communication)

The entire infrastructure is managed by a team of approximately three people, designed to require minimal ongoing maintenance once optimized.

### 2. Local-First Sync Engine Architecture

The sync engine is Linear's defining technical achievement. CTO Tuomas Artman built four sync engines before Linear (gaming portal, Groupon POS, Uber mobile, and now Linear). The engine has two jobs: get the user up to date with the current state, and keep them up to date in real time.

#### Three Primary Layers

1. **Object Graph** - In-memory representation managed by MobX for reactive UI updates. Properties become observable through an `observabilityHelper` function that uses `Object.defineProperty` to define getters/setters. When a value is assigned, it checks whether a MobX box needs to be created on the model's `__mobx` object. React components wrapped with `observer` auto-re-render on changes.

2. **Object Pool** - Normalized data store implemented as a map called `modelLookup` on `SyncClient`, linking model IDs to model objects. Coordinates state changes and enables efficient retrieval by ID. When constructing a model, LSE initializes the object, hydrates it via `updateFromData`, then calls `attachToReferencedProperties` to resolve references.

3. **Transaction Queue** - Persisted to IndexedDB for offline capability. Operations are packaged as transactions sent to the server, designed to be reversible on the client in case of failure. Each transaction includes a monotonically increasing `syncId` ensuring correct operation order.

#### Data Flow

**Write path (local mutation):**
Object Graph -> Object Pool -> Transaction Queue -> IndexedDB -> Server (async)

The frontend directly manipulates the object graph, triggering a cascade. The `save()` method on any model object triggers the entire sync cycle. The network layer is not required for the app to function, enabling offline-first behavior. "The entire process is just one method call away."

**Read path (remote update):**
Server -> WebSocket -> Object Pool + IndexedDB -> MobX reactivity -> Object Graph -> React re-render

Remote updates arrive via WebSocket events. The client fetches updated data, reflects changes to both the Object Pool and IndexedDB, then dispatches events that update the Object Graph through MobX reactivity.

#### Model System

Models extend a base `Model` class using TypeScript decorators. A single TypeScript definition with decorators serves the database schema, GraphQL schema, and client model simultaneously -- eliminating separate schema maintenance.

**Load Strategies:**
- `instant` - Loaded during bootstrapping (teams, users, projects, labels)
- `lazy` - Loaded all at once when first needed
- `partial` - On-demand loading of subsets (issues, attachments)
- `explicitlyRequested` - Loaded only when explicitly requested (comments, history)
- `local` - Stored only in client-side IndexedDB

**Property Types:**
- Standard properties (persisted directly)
- References (e.g., Issue.assignee resolves to a User object, but only `assigneeId` is persisted)
- Back-references (e.g., User.assignedIssues is a computed one-to-many collection)

Metadata is stored in a `ModelRegistry` that defines behavior including load strategies and property types.

### 3. Bootstrapping & Delta Sync

#### Full Bootstrap

Endpoint: `/sync/bootstrap?type=full`

1. `StoreManager` creates appropriate stores (FullStore or PartialStore) for each model
2. Database validates schema via a `__schemaHash` combining model names, versions, and property names
3. Single request retrieves 40+ model types
4. Response format: newline-delimited plain text with `ModelName=<JSON>` entries
5. Data persisted to IndexedDB
6. Immediately-needed data hydrated into memory; observability activated
7. WebSocket connection established to receive delta packets

Initial bootstrap loads all accessible objects except issues, attachments, and comments. Large datasets load dynamically on-demand with a centralized de-duping loader managing multiple UI requests.

#### Partial Bootstrap

Endpoint: `/sync/bootstrap?type=partial`

Deferred loading of Comment and IssueHistory models, reducing initial payload size for faster first render.

#### Delta Sync

Endpoint: `/sync/delta`

The system maintains a `lastSyncId` value to track data freshness. If the client's `lastSyncId` diverges from the server, the delta endpoint replays the action range between the two sync points, restoring consistency.

#### SyncActions

Immutable records of data changes, each containing:
- Unique integer ID
- Model name and model ID
- Action type: `"I"` (Insert), `"U"` (Update), `"D"` (Delete), `"A"` (Archive)
- Optional data payload

Tracked by a `SyncActionStore`. The server broadcasts delta packets containing SyncActions to all clients, including the originator. Delta packets may differ from original transactions because the server may perform side effects during execution.

### 4. Conflict Resolution & Collaboration

#### Last-Writer-Wins (LWW)

For most model properties (priority, status, assignee, labels, etc.), Linear uses a last-writer-wins strategy. The server establishes the authoritative order of all transactions -- the collaboration model aligns more closely with Operational Transformation (OT) than CRDTs, relying on a centralized server for ordering.

#### Y.js for Rich Text

Linear did not use CRDTs until recently. They added Y.js specifically for collaborative editing of issue descriptions (rich text documents). This enables:
- Real-time cursor visibility across collaborators
- Table cell and block selection visibility
- Offline editing with automatic merge
- Version snapshots and undo/redo within documents

#### Optimistic Updates

Changes apply instantly to the local Object Graph and IndexedDB. The UI never waits for server confirmation. If a transaction fails server-side, it is reversed on the client.

### 5. Offline-Capable Data Model

Linear treats the client's IndexedDB as a real database, not merely a cache:

- The browser stores a copy of most workspace data locally
- Changes happen locally first, then sync asynchronously
- Each client maintains a nearly-complete local database copy
- The server is "just another client to sync with" rather than the exclusive source of truth
- Network latency is eliminated from the user interaction path entirely

**IndexedDB Schema Management:**
- Database module manages connectivity, table creation, and schema migrations
- Schema hash (`__schemaHash`) detects mismatches between code and stored data
- Two store types: `FullStore` (complete model collections) and `PartialStore` (on-demand subsets)

When properties change, the `propertyChanged` method registers modifications with old/new values, generating an `UpdateTransaction`. Lazy-loaded properties are fetched only when accessed.

### 6. Multi-Region Infrastructure

Linear expanded from single-region to multi-region to address GDPR/data residency requirements.

#### Architecture Pattern

Rather than sharding databases, Linear replicates the entire production deployment per region. Each region has its own isolated PostgreSQL database and full backend stack.

#### Request Flow

```
Client -> Cloudflare Workers Proxy -> Auth Service -> Regional Backend
```

1. **Cloudflare Workers Proxy** extracts authentication, calls auth service for a signed JWT and target region, forwards request with pre-signed headers. Caches authentication signatures to avoid repeated round-trips.
2. **Global Authentication Service** knows all user accounts, workspaces, and region associations. Uses one-way data flow -- regional services call the auth service directly; reverse operations use Google Pub/Sub for async task scheduling.
3. **Regional Backend** handles all business logic with isolated data.

#### Cross-Region Data Sync

Three patterns for shared tables (users, workspaces):
- **Creating:** Auth service first (enforces global constraints), then regional database
- **Deleting:** Same order, with Postgres triggers creating audit logs
- **Updating:** Regional service updates propagate asynchronously via internal API calls

Background tasks periodically validate all synced records for consistency between services.

#### Deployment

Rolled out with feature flags, initially only for Linear engineers. System timezone determines default region selection.

### 7. GraphQL API Design

Linear's public API is the same GraphQL API used internally. Key characteristics:

- **Full introspection** support for schema discovery
- **Complexity-based rate limiting:** 250,000 complexity points/hour (API key) or 200,000 points/hour (OAuth)
- **Mutations return only `lastSyncId`** -- actual data updates come through the WebSocket sync channel, not mutation responses
- **Streaming REST endpoints** for bootstrap and delta sync (not GraphQL) -- REST was chosen over GraphQL for these bulk operations for performance
- **Webhooks** for server-to-server integrations (programmatic registration)
- **Standard GraphQL error format** with extensions for additional context

The separation is notable: GraphQL handles queries and mutations, while the sync protocol uses streaming REST and WebSockets for bulk data transfer and real-time updates.

### 8. Performance Optimization Philosophy

Linear's core philosophy: "the tool should never be slow." Speed is treated as a feature, not a metric.

#### Architectural Optimizations

- **Local-first eliminates network latency** from all user interactions
- **Lazy/partial loading** avoids loading hundreds of thousands of objects upfront
- **Centralized de-duping loader** coalesces multiple concurrent UI requests for the same data
- **MobX reactive updates** avoid unnecessary React re-renders (only observed properties trigger updates)
- **IndexedDB persistence** means returning users skip full bootstrap -- only delta sync needed
- **Schema hash validation** enables fast startup by detecting whether cached data is still compatible

#### Ten Major Sync Optimizations (referenced by Tuomas Artman)

Key among them: dynamic issue loading, partial bootstrapping, MongoDB caching layer for serialized model objects, and delta sync packet caching. These collectively enabled Linear to scale to large enterprise workspaces without degrading the experience.

### 9. Keyboard-First UX Architecture

Linear's interface is designed keyboard-first:

- **Cmd/Ctrl+K** opens a global command palette (fuzzy search across all actions)
- **Single-key shortcuts** for common actions: `C` (create issue), `E` (edit), `/` (filter)
- **Vim-inspired navigation** with `J`/`K` for list traversal
- **Contextual shortcut hints** appear on hover after a brief delay, teaching users faster workflows
- **Every action accessible via keyboard** -- creating, moving, filtering, assigning, status changes

The keyboard-first approach is enabled by the sync engine: because all data is local, filtering, searching, and navigating are instant operations against IndexedDB rather than server round-trips.

### 10. Developer Experience & Team Philosophy

- **Frontend engineers interact only with local data structures** -- no manual network calls, no loading states for cached data, no manual UI updates. MobX handles reactivity automatically.
- **Single model definition** with decorators generates database schema, GraphQL types, and client models
- **Strict hiring** -- Linear avoids over-hiring, preferring to prioritize features over team expansion
- **Small infrastructure team** (~3 people) manages all of GCP, Terraform, multi-region deployment
- **Dogfooding** -- Linear uses Linear for all product development, providing direct feedback loops
