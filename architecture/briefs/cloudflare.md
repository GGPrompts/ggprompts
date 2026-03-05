# Cloudflare Architecture Research

**Beads Issue:** hsg-vfvz
**Style Guide:** infrared-thermal
**Folder:** architecture/cloudflare/

## Research Topics

- Global anycast network architecture
- Workers runtime (V8 isolates, not containers)
- Durable Objects (single-threaded stateful edge compute)
- R2 object storage (S3-compatible, zero egress)
- KV (eventually consistent key-value at edge)
- D1 (SQLite at the edge)
- DNS and DDoS mitigation layers
- Argo Smart Routing and Tunnel
- Pages and static site deployment

## Key Public Sources

- Cloudflare blog (blog.cloudflare.com) - exceptionally detailed
- "How Workers Works" technical deep-dive
- Cloudflare architecture whitepapers
- Birthday Week and Speed Week technical posts
- Workers documentation (developers.cloudflare.com)

## Findings

### Global Anycast Network

Cloudflare operates data centers in **330 cities across 120+ countries**. Every server in every data center is **homogeneous** — each runs every Cloudflare service simultaneously, eliminating service-chaining. The network has **405+ Tbps capacity** with **13,000+ network peering relationships**. Servers run AMD EPYC 9684X processors.

**Anycast routing**: Multiple data centers advertise the same IP addresses via BGP. Internet routers direct each request to the nearest (by network distance) data center. This provides automatic geographic load balancing, DDoS absorption (attack traffic spreads across all locations), and failover (if a data center goes offline, traffic reroutes to the next nearest).

**Backbone network**: Data centers connect via a private backbone using terrestrial fiber and subsea cables across six continents. Backbone capacity grew 500%+ since 2021. Uses two core technologies:
- **BGP** for internet routing
- **Segment Routing MPLS** for predetermined forwarding paths through label-switched tunnels (no intermediate route lookups)

Fiber infrastructure uses **dark fiber and DWDM** (Dense Wavelength Division Multiplexing) for multiple simultaneous data streams on different light wavelengths. **SR-TE** (Segment Routing Traffic Engineering) optimizes path selection beyond shortest-path routing. **Orpheus** provides automatic network self-healing by detecting and avoiding degraded paths in real time.

### Workers Runtime (V8 Isolates)

Workers uses the **V8 JavaScript engine** (same as Chromium/Node.js) but runs code in **isolates** instead of containers or VMs.

**Isolate model**: A single runtime instance runs hundreds or thousands of isolates with complete memory isolation between them. Each isolate starts ~100x faster than a Node.js container process and uses an order of magnitude less memory. This eliminates traditional cold starts entirely.

**Request lifecycle**: A request arrives at any Cloudflare data center → the Workers runtime invokes the `fetch()` handler → the Worker returns a `Response` object. The runtime uses a single-threaded event loop; async operations (fetch, KV reads) allow other requests to interleave via cooperative multitasking.

**Isolate lifecycle**: Isolates are not permanent. They may be evicted for resource limits, suspected sandbox escapes, or inactivity. Mutable global state is discouraged. No guarantee which data center or isolate instance handles a given request.

**Security**: V8 isolates prevent code from accessing memory outside their boundary, even within the same OS process. This is the primary sandboxing mechanism. Additional hardening exists beyond V8's built-in isolation.

**Supported APIs**: Workers implement standard Web APIs (Fetch, Streams, Web Crypto, Cache, etc.) plus Cloudflare-specific bindings for KV, R2, D1, Durable Objects, Queues, and more.

### Durable Objects (Stateful Edge Compute)

Durable Objects are specialized Workers that follow the **Actor model** — each instance is a globally unique, single-threaded actor with its own persistent storage.

**Key properties**:
- **Single-threaded**: No concurrent execution. JavaScript async/await allows interleaved I/O but synchronous code blocks the input gate, preventing data races
- **Globally unique**: Each object ID maps to exactly one instance running in one location
- **Persistent storage**: Two backends — **SQLite** (new, transactional, up to 1-10 GB per object) and **Key-Value API** (legacy). Storage is private to each object
- **Input/output gates**: Cloudflare's runtime uses gates to ensure correctness — input gates block new events during synchronous execution; output gates ensure writes complete before responses leave

**Location**: Objects auto-provision geographically close to where first requested. Optional **location hints** can influence placement. Not all data centers support Durable Objects.

**Hibernation**: Objects stay active during requests and for several seconds after, then hibernate. The **WebSocket Hibernation API** eliminates billing during idle WebSocket connections.

**Use cases**: Real-time collaboration, chat rooms, game servers, rate limiters, coordination primitives — anything needing single-point-of-consistency without distributed consensus.

### R2 Object Storage

R2 is S3-compatible object storage with **zero egress fees**. Architecture has four layers:

1. **R2 Gateway**: Edge Workers at every data center handle authentication, S3 API translation, and routing
2. **Metadata Service**: Built on **Durable Objects** — stores object keys, checksums, versions. Provides **strong consistency** with integrated caching. Objects are invisible to reads until metadata commits complete
3. **Tiered Read Cache**: Multi-level caching via Cloudflare's CDN cache infrastructure. Serves frequently accessed objects from edge
4. **Distributed Storage Infrastructure**: Encrypted, erasure-coded persistent storage replicated within designated regions

**Write path**: Request → R2 Gateway authenticates → Metadata Service provides encryption key → Gateway determines storage cluster within bucket's location → encrypted data written and replicated within region.

**Read path**: Request → R2 Gateway authenticates → Metadata Service returns metadata → check tiered read cache → cache miss falls through to distributed storage in the object's region.

**Access methods**: Workers Binding (in-process, lowest latency), S3-compatible API (drop-in replacement for AWS S3 SDKs), REST API (dashboard/CLI).

**Data protection**: Encryption in transit and at rest. Encryption keys managed by the Metadata Service.

### Workers KV (Eventually Consistent Key-Value)

KV is a global, low-latency key-value store optimized for **read-heavy workloads**. Stores data centrally, caches at the edge after access.

**Consistency model**: Eventually consistent. Writes propagate globally within ~60 seconds. The writing data center sees changes immediately. Last-writer-wins for concurrent writes. Negative lookups (key not found) are also cached.

**Rearchitected backend (2025)**: After a major outage caused by single-provider dependency, Cloudflare rebuilt KV with a **hybrid dual-backend** architecture:
- **Primary**: Cloudflare's own distributed database with **three-way replication**. Optimized for the median object size of 288 bytes. P99 read latency under 5ms (down from 200ms on the old third-party provider)
- **Secondary**: **R2** automatically handles larger objects (up to 25 MB). The **KV Storage Proxy (KVSP)** routes objects between backends based on size

**KVSP** (KV Storage Proxy): Bridges Workers KV's HTTP interface and the database's binary protocol. Uses **consistent hashing** to stripe namespaces across multiple clusters, preventing hotspots.

**Three consistency mechanisms**:
1. **Write-phase reconciliation**: Failed writes queue for background sync
2. **Read-phase detection**: Mismatches between backends trigger synchronization
3. **Background crawlers**: Continuously scan for and fix inconsistencies

**Deletes** use **tombstones** with timestamps — both backends must have the tombstone before actual key removal.

### D1 (SQLite at the Edge)

D1 is a managed serverless SQL database built on **SQLite running inside Durable Objects**.

**Architecture**: Each D1 database is a **single Durable Object** in one location. All writes serialize through that one actor — no distributed consensus needed. Strong consistency is inherent because all operations run single-threaded through one SQLite instance.

**Read replicas**: Reads can be served from **automatic read replicas** at the nearest edge PoP, reducing latency for geographically distant users. Writes always route to the primary.

**Binding model**: Workers access D1 through a binding — no connection strings, no connection pooling, no cold-start connection overhead.

**Scale model**: Designed for **horizontal scale-out** across many small databases (10 GB max each). Per-user, per-tenant, or per-entity databases rather than one giant shared database. A database processing 10ms queries handles ~100 QPS; 100ms queries yield ~10 QPS (sequential execution).

**Disaster recovery**: Built-in with automatic backups and point-in-time restore.

### DNS and DDoS Mitigation

Cloudflare's DDoS protection operates across **OSI layers 3, 4, and 7** using a fully decentralized, autonomous system.

**Core components**:

- **dosd** (denial of service daemon): Runs on every server in every data center. Constantly samples packets and HTTP requests. Detects 98.6% of all L3/4 attacks and mitigates 81% of L7 attacks autonomously. Samples packets at **81x the rate** of the centralized Gatebot system
- **Gatebot**: Centralized system in the network core. Detects large, distributed volumetric attacks requiring cross-edge coordination
- **flowtrackd**: Complements dosd and Gatebot with additional decentralized flow analysis

**Mitigation stack** (Linux networking):
- **L4Drop**: XDP-based program that applies attack signatures at wire speed before kernel processing. Uses **eBPF** (extended Berkeley Packet Filter) programs
- **iptables**: Firewall rules for L3/4 mitigation
- **IP Jails**: L7 attacks dropped at L4 to avoid application-layer processing cost

**Detection flow**: dosd samples traffic → detects anomaly → generates real-time attack signature → pushes mitigation rule to the optimal location in the Linux stack for cost-efficient mitigation. No centralized consensus needed — each server decides independently.

**DNS protection**: Advanced DNS Protection handles fully randomized subdomain attacks (random prefix attacks / DNS water torture).

**Anycast absorption**: Attack traffic is automatically distributed across 330+ data centers and 405+ Tbps of capacity, preventing any single location from being overwhelmed.

### Argo Smart Routing and Tunnel

**Argo Smart Routing**: Optimizes traffic routing using real-time network intelligence gathered from routing ~93 million HTTP requests per second.

- Runs **on top of BGP** (not a replacement) as an overlay optimization
- Analyzes latency, packet loss, and congestion across all network paths
- Routes requests through Cloudflare's backbone, transit, and peering connections via the lowest-latency path
- **Argo Transit Selection** explicitly prioritizes backbone paths when they offer the best performance
- Uses **Segment Routing Traffic Engineering** to select optimal backbone paths

**Cloudflare Tunnel** (formerly Argo Tunnel): A private, outbound-only connection from origin servers to Cloudflare's edge.

- Runs **cloudflared** daemon on origin infrastructure
- Establishes outbound connections (tunnels) to Cloudflare edge — no inbound ports need to be opened
- When a request arrives for a tunneled hostname, Cloudflare proxies it through the tunnel to cloudflared
- Traffic through Tunnel automatically benefits from Argo Smart Routing
- Supports HTTP, WebSocket, TCP, and SSH traffic

### Pages and Static Site Deployment

Cloudflare Pages is a JAMstack deployment platform that is **converging with Workers** into a unified developer experience.

**Deployment pipeline**:
1. Connect GitHub/GitLab repository
2. Configure build command and output directory (or skip for pure static HTML)
3. Every push to the main branch triggers automatic build and deploy
4. Pull requests get **preview deployments** on unique URLs

**Pages Functions**: File-based routing that compiles to first-class Workers. `/functions/api/users.ts` handles `/api/users`. Pages Functions are Workers deployed on your behalf.

**Full-stack integration**: Pages projects can bind to KV, Durable Objects, R2, D1, and other Workers platform resources. Static assets + serverless functions + storage in one project.

**Workers Builds**: Integrated CI/CD built on the Workers platform itself. Git integration for automated builds and deployments.

**Hosting**: Served from Cloudflare's edge network. Each project gets a `*.pages.dev` subdomain with custom domain support via Cloudflare DNS.

### Data Flow Summary (How Components Connect)

```
User Request
  → Anycast DNS (nearest data center)
  → DDoS Mitigation (L4Drop/XDP → eBPF → iptables → dosd)
  → Cloudflare Edge Server (homogeneous — runs all services)
    → Workers Runtime (V8 isolate)
      → KV (read from edge cache, write to central + R2)
      → R2 (Gateway → Metadata/Durable Objects → Storage)
      → D1 (read replica at edge, writes to primary Durable Object)
      → Durable Objects (single-threaded actor at specific location)
    → Pages (static assets from edge cache + Functions as Workers)
    → Argo Smart Routing (optimized path to origin via backbone)
      → Cloudflare Tunnel (outbound connection to origin)
```

**Key architectural pattern**: Cloudflare builds higher-level services on top of lower-level ones:
- **D1** is built on **Durable Objects** (SQLite inside a DO)
- **R2 Metadata** is built on **Durable Objects**
- **Pages Functions** compile to **Workers**
- **KV** large objects overflow to **R2**
- **Durable Objects** are specialized **Workers** with persistent storage
- **Everything** runs on the homogeneous anycast edge network
