# Fly.io Architecture Research

**Beads Issue:** hsg-kg8w
**Style Guide:** volcanic
**Folder:** architecture/fly-io/

## Research Topics

- Firecracker microVM runtime
- Global edge deployment model
- NATS-based internal coordination
- Corrosion (CRDT-based cluster state via SQLite + rqlite)
- Anycast networking and proxy layer
- Volume and persistent storage architecture
- Machine API (REST API for VM lifecycle)
- Fly Postgres (managed HA Postgres on VMs)
- Builder infrastructure (remote Docker builds)

## Key Public Sources

- Fly.io blog (fly.io/blog) - very detailed engineering posts
- "The Making of Fly.io" series
- fly.io/docs architecture section
- Thomas Ptacek's (founder) technical writing
- Fly.io GitHub repos (open source components)

## Findings

### 1. Firecracker MicroVM Runtime

Fly.io runs all application workloads inside **Firecracker microVMs** — lightweight virtual machines created by Amazon that use Linux KVM for hardware-level isolation. Firecracker is purpose-built as a minimal alternative to QEMU, exposing only 5 emulated devices to guests: virtio-net, virtio-block, virtio-vsock, serial console, and a minimal keyboard controller.

**Key performance characteristics:**
- Boot time: ~125ms to user-space code, ~300ms for full Machine startup
- Creation rate: up to 150 microVMs per second per host
- Memory overhead: less than 5 MiB per microVM
- Host hardware: dedicated servers with 8–32 physical CPU cores and 32–256GB RAM
- Best-effort CPU dedication: cores only do work for one microVM at a time (no steal time)

**OCI-to-VM pipeline:** Docker/OCI images are pulled via the Docker registry API, then converted to root filesystems using `containerd` with LVM2 thin provisioning and copy-on-write snapshots. A custom Rust init process (`/init`) handles mounting filesystems, reading injected config, configuring DNS for private networking, running an SSH server for WireGuard access, and spawning the application entrypoint. First deploy is slower (image pull + snapshot creation); subsequent boots reuse cached snapshots and are near-instant.

**RootFS limit:** 8GB maximum for non-GPU Machines. Images must be under this threshold.

### 2. Global Edge Deployment & Anycast Networking

Fly.io uses **BGP Anycast** to announce global IPv4 and IPv6 address blocks from all its datacenters simultaneously. When a client connects, standard internet routing delivers them to the geographically nearest datacenter. The platform then matches the incoming IP to a customer application and proxies the TCP connection to the closest available microVM.

**Fly Proxy** is a Rust-based proxy that runs on every server in the infrastructure. It handles:
- Accepting client connections on all ports and all Anycast addresses
- Matching requests to customer applications via Corrosion's gossip-based service discovery
- TLS termination (automatic for most public apps)
- Protocol-specific handlers: `http/tls` (default), `pg_tls` (Postgres), PROXY protocol
- Load balancing based on concurrency settings, current machine load, and geographic proximity (RTT measurements)
- Autostart/autostop of Machines based on demand
- The `fly-replay` response header for request redirection to other regions, Machines, or apps

**Backhaul:** Traffic arriving at one datacenter but destined for a microVM in another is forwarded via encrypted **WireGuard tunnels** between datacenters, adding minimal latency.

### 3. 6PN Private Networking (WireGuard Mesh)

Every Fly.io organization gets a **6PN** (IPv6 Private Network) — a full WireGuard mesh connecting all applications within the org. Each Firecracker microVM receives a unique IPv6 address (available as `fly-local-6pn` in `/etc/hosts`) that encodes the app ID, organization ID, and host hardware identifier.

**Implementation details:**
- WireGuard's **cryptokey routing** handles packet delivery without a dynamic routing protocol
- **eBPF programs** enforce access control and statically route IPv6 packets along the mesh
- DNS-based discovery via `.internal` addresses enables apps to locate other instances by region or app name
- External clients can join the 6PN via WireGuard VPN peers

### 4. NATS-Based Internal Coordination

Fly.io uses **NATS** as its internal messaging backbone. During Machine creation, for example, the API server sends NATS messages to available hosts in a region for resource reservation. NATS provides:
- **Pub/Sub** for event broadcasting (e.g., log streaming via `fly logs` uses NATS)
- **Request-Response** for synchronous coordination between platform components
- **JetStream** for durable streaming
- **Key-Value store** capability

NATS clusters auto-discover peers via 6PN networking and `.internal` DNS lookups. The clustering ensures any connected client can reach any other subscriber regardless of which NATS node they connect to.

### 5. Corrosion (CRDT-Based Cluster State)

**Corrosion** is Fly.io's custom Rust service that replaced HashiCorp Consul for distributed state management. It propagates a SQLite database across all cluster nodes using CRDTs (Conflict-free Replicated Data Types), achieving eventual consistency without distributed consensus, central servers, or locking.

**Architecture:**
- Uses **cr-sqlite**, a CRDT extension for SQLite that tracks changes in a `crsql_changes` table
- Designated tables are marked as CRDT-managed; updates use **last-write-wins** with logical (causal) timestamps
- Changes are batched and gossiped via the **SWIM protocol** for cluster membership management
- **QUIC transport** between nodes for broadcasting changes and reconciling state for new nodes
- P99 replication time: ~1–2 seconds globally

**What it stores:** The state of every Fly Machine on the platform — a globally-synchronized SQLite database that serves as the service discovery catalog. Fly Proxy queries Corrosion to determine where to route requests.

**Design philosophy:** Inspired by link-state routing protocols (like OSPF) rather than consensus protocols (like Raft). Nodes randomly ping subsets of peers; failed heartbeats are marked "suspect" and validated by other random nodes for rapid convergence.

### 6. flyd — Worker Daemon & Orchestrator

**flyd** is Fly.io's Go-based orchestrator daemon that runs on every physical worker server. It replaced HashiCorp Nomad, which was abandoned because its bin-packing strategy, asynchronous scheduling, and centralized consensus model didn't fit Fly.io's needs (geographic distribution, scale-from-zero latency requirements).

**Key design decisions:**
- Each flyd instance is its own source of truth for local VM state
- State stored in an append-only **BoltDB** log of all operations
- Rigidly structured as a collection of **state machines** (e.g., "create a machine", "delete a volume") with Go generics
- Crash-resilient: if flyd bounces, it picks up where it left off from BoltDB
- Uses `containerd` ecosystem to convert Docker containers into VM root filesystems
- No consensus protocol between flyd instances — purely local state

**Scheduling model:** Market-based "immediate-or-cancel" orders. Requests to schedule jobs are bids for resources; workers are suppliers. The API proxy (flaps) queries all workers in a region synchronously and applies best-fit ranking using linear interpolation across resource utilization. Fails fast rather than queuing.

### 7. flaps — Machines API Server

**flaps** is the stateless API proxy that brokers between client requests and regional flyd instances. It implements the **Machines REST API** for full VM lifecycle control.

**Request flow:**
1. Client sends REST request to nearest regional flaps server (API servers run in every region)
2. For creation: flaps makes a preflight check to the **centralized database in Virginia** for authorization, then queries all workers in the target region for capacity
3. For start/stop: flaps knows exactly which host to contact (Machine is pinned to hardware)
4. flaps applies best-fit placement ranking and forwards the request to the chosen flyd

**Machine lifecycle states:** created → started → stopped → destroyed. Creation involves reserving space, fetching the container from the global registry, and building a root filesystem (can take low double-digit seconds). Subsequent starts are subsecond.

### 8. Volume & Persistent Storage

**Fly Volumes** are slices of NVMe drives on the same physical server as the Machine. They use **Linux LVM thin provisioning** to carve out storage from a pool on the NVMe drives.

**Characteristics:**
- Local storage only — not network-attached, not replicated
- One-to-one mapping: one volume per Machine, one Machine per volume
- Performance competitive with (slightly faster than) AWS EBS
- Volumes are pinned to specific hardware (like Machines)
- Daily snapshots sent to object storage, retained for 5 days
- Block-level cloning enables fast volume migration to new hosts

**Mount process:** The orchestrator (flyd) looks up the logical volume, recreates its block device node in the jail Firecracker runs inside, and sets up mount points.

### 9. Fly Postgres (Managed HA Postgres)

Fly Postgres runs PostgreSQL inside Fly Machines with volume-backed persistent storage. It's positioned as "unmanaged" — Fly provisions it but the user is responsible for maintenance.

**HA architecture (legacy Stolon-based):**
- **Stolon** (Go-based Postgres manager) handles leader election and streaming replication
- Three Stolon components per VM: sentinel (monitors cluster state), keeper (manages local Postgres), proxy (routes connections)
- Uses Consul as backend KV store for cluster coordination
- Streaming replication via Write-Ahead Log (WAL) — each WAL record sent to replicas after commit
- Automatic failover on node failure

**Current architecture:** Newer deployments use **repmgr** instead of Stolon for managing replication clusters.

**Networking:** Fly Proxy provides a specialized `pg_tls` handler for Postgres connections, terminating TLS at the edge and forwarding to the Postgres Machine.

### 10. Builder Infrastructure (Remote Docker Builds)

When users run `fly deploy`, images are built remotely using dedicated **builder Machines** within Fly.io's infrastructure.

**Architecture:**
- Builder is an independent Fly app auto-created per organization on first use
- Exposes a Docker server to which flyctl authenticates and requests builds
- Has attached NVMe volume storage for caching layers and manifests
- Builder instances auto-terminate after 10 minutes of inactivity
- Three build modes: Dockerfile, Buildpacks, and pre-built image
- Newer versions use **BuildKit** (Docker's next-gen build engine)

**Image distribution:** Fly.io runs a custom Docker registry (`registry.fly.io`) built by importing Docker's registry code as a Go library, with added:
- Bearer token authorization via Fly API (Macaroon-based)
- Repository name rewriting for multi-tenancy
- Cross-repository blob mount handling
- HMAC-tagged state parameter rewriting
- Access scoped per organization (images usable across apps in same org)

### 11. Security & Authentication (Macaroon Tokens)

Fly.io uses **Macaroon tokens** — a chained-HMAC bearer token construction (based on Google Research's Macaroons paper) — for API authentication and authorization.

**Key properties:**
- End users can take any existing token and **attenuate** (scope down) its permissions locally, without server involvement
- Scoping ranges from org-wide down to running a specific command on a single Machine
- Separation of authentication and authorization: permissions tokens (Macaroons) are distinct from authentication tokens
- Verification secrets exist only on isolated hardware in production
- Signature verification runs on a globally distributed **LiteFS-backed cluster** of verifiers

**Open source:** Available at `github.com/superfly/macaroon`

### 12. LiteFS (Distributed SQLite for Applications)

**LiteFS** is Fly.io's open-source distributed file system for replicating SQLite databases across a cluster of Machines. It extends the Litestream project with fine-grained transactional control.

**How it works:**
- Runs as a FUSE filesystem layer on the same node as the application
- Built on the **LTX (Lite Transaction File)** format — sorted lists of changed database pages
- Primary node accepts writes; replicas receive replicated LTX files
- Applications interact with vanilla SQLite — LiteFS is transparent
- LiteFS Cloud provides managed backups

### Cross-Cutting Architecture Summary

**Data flow for a typical request:**
1. Client DNS resolves to Anycast IP → routed to nearest datacenter
2. Fly Proxy (Rust) accepts connection, terminates TLS, matches to app via Corrosion
3. Proxy checks Machine availability, load, and concurrency settings
4. If no Machine running: autostart triggers via flaps → flyd boots Firecracker VM in ~300ms
5. Request forwarded to Machine (local or via WireGuard backhaul to another region)
6. Machine reads/writes to local NVMe volume and/or Postgres via 6PN

**Data flow for a deploy:**
1. `flyctl` pushes OCI image to `registry.fly.io` (Macaroon-authenticated)
2. Remote builder Machine (if Dockerfile) builds image via BuildKit
3. `flyctl` calls Machines API (flaps) to create/update Machines
4. flaps → centralized DB (Virginia) for preflight → NATS to workers for capacity
5. flyd on chosen worker pulls image via containerd, creates LVM snapshot, boots Firecracker
6. Corrosion gossips new Machine state globally within ~1–2 seconds
7. Fly Proxy discovers new Machine via Corrosion and begins routing traffic

**Key technology stack:**
- **Rust:** Fly Proxy, Corrosion, VM init process
- **Go:** flyd (orchestrator), flaps (API), flyctl (CLI), registry, Stolon
- **SQLite:** Corrosion (cluster state), LiteFS (app databases), BoltDB (flyd local state)
- **WireGuard:** Inter-datacenter backhaul, 6PN private networking, client VPN
- **Firecracker (KVM):** All compute isolation
- **NATS:** Internal messaging and coordination
- **Linux LVM:** Volume thin provisioning and copy-on-write snapshots
- **eBPF:** Network access control and static routing on 6PN mesh
- **QUIC:** Corrosion node-to-node transport
- **Macaroons:** API token authentication/authorization
