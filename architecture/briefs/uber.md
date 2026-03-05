# Uber Architecture Research

**Beads Issue:** hsg-5p9t
**Style Guide:** desert-sahara
**Folder:** architecture/uber/

## Research Topics

- Domain-Oriented Microservice Architecture (DOMA)
- Real-time dispatch and matching system
- Kafka backbone (trillions of messages/day)
- Geospatial indexing (H3 hexagonal grid)
- Schemaless (MySQL-backed distributed datastore)
- Ringpop (consistent hash ring)
- Peloton (unified resource scheduler)
- Map and ETA prediction pipeline
- Surge pricing architecture

## Key Public Sources

- Uber Engineering blog (eng.uber.com)
- "Domain-Oriented Microservice Architecture at Uber" blog post
- "Uber's Big Data Platform" talks
- Open source: H3, Jaeger, Cadence, Peloton
- InfoQ and QCon Uber architecture talks

---

## Findings

### 1. Domain-Oriented Microservice Architecture (DOMA)

Uber grew to approximately **2,200 critical microservices**, which created massive complexity: engineers sometimes needed to trace through 50 services across 12 teams for a single investigation. DOMA was introduced to tame this.

**Layer hierarchy** (each layer only depends on layers below it):

| Layer | Purpose | Example |
|---|---|---|
| **Infrastructure** | Org-wide engineering (storage, networking, observability) | Schemaless, Kafka, Ringpop |
| **Business** | Uber-level logic not specific to any product line | Payments, Identity, Pricing |
| **Product** | Line-of-business functionality | Rides, Eats, Freight |
| **Presentation** | Consumer-facing app features | Rider app screens |
| **Edge** | External API surface, mobile-aware | API gateway |

**Domains**: The 2,200 microservices are classified into ~70 domains (~50% implemented at time of publication). Domain size varies from one service to dozens.

**Gateway pattern**: Each domain exposes a single gateway service as the entry point. Upstream consumers call only the gateway, which abstracts internal services. This means teams can restructure, rename, or migrate internal services without forcing upstream migrations. Product teams that previously called numerous downstream services now call one.

**Extension architecture** (two mechanisms):
- **Logic Extensions**: Plugin interfaces where teams register handlers (e.g., driver "go online" safety checks iterate through registered validators without coupling).
- **Data Extensions**: Protobuf `Any` type allows attaching arbitrary context to core data models without bloating them.

**Impact**: Onboarding time reduced 25-50%. One platform reduced feature integration from 3 days to 3 hours. Platform support costs dropped an order of magnitude. Microservice half-life is ~1.5 years, so gateway insulation from migrations is critical.

### 2. Real-Time Dispatch and Matching (DISCO)

**DISCO** (Dispatch Optimization) is the system that matches riders to drivers in real time.

**Core services**:
- **Supply Service**: Tracks all driver locations via GPS updates every 4-5 seconds. Keeps state machines of all supply in memory.
- **Demand Service**: Receives rider requests via WebSocket, captures GPS location and requirements (seats, car type, pool).
- **Dispatch Service (DISCO)**: Matches supply to demand using cell-based geospatial sharding.
- **Location Service**: Stores real-time GPS updates.

**Geospatial sharding**: Uses Google S2 library to divide the map into ~3km cells, each with a unique cell ID used as a shard key. When a request comes in, DISCO draws a radius around the rider, filters nearby drivers meeting requirements (distance, ETA, ratings), calculates ETAs, and selects the best match.

**Matching algorithm**: Combines greedy matching for initial assignments with batch optimization that considers multiple pending requests simultaneously for globally better pairings. Supports future planning (e.g., revising routes on in-progress trips for UberPOOL).

**Technology**: Built on Node.js for async/event-driven WebSocket handling. Uses Ringpop for data distribution and cluster membership. Driver locations flow through Kafka REST APIs and are stored in worker node memory for sub-millisecond access.

**Objectives**: Minimize extra driving, minimize rider wait time, minimize overall ETA.

### 3. Kafka Backbone

Uber operates **one of the world's largest Kafka deployments**: trillions of messages and multiple petabytes per day.

**Two-tier topology**:
- **Regional Clusters**: Producers publish locally for low latency. Federated design with ~150 nodes per cluster.
- **Aggregate Clusters**: Messages replicate asynchronously from regional clusters across regions, providing a global data view.

**Key components**:
- **uReplicator** (open source): Extends Kafka MirrorMaker for cross-region replication with zero-data-loss guarantees.
- **uForwarder** (open source): Push-based Kafka consumer proxy, now the primary option for pub-sub consumption at Uber. Over 1,000 consumer services onboarded. Features context-aware routing, head-of-line blocking mitigation, adaptive auto-rebalancing, and partition-level delay processing.

**Consumer patterns**:
- **Active/Active**: Independent consumers in each region process identical topic data (used by surge pricing).
- **Active/Passive**: Single consumer in primary region; offset management service syncs progress across regions for failover.

**Offset management**: A dedicated service stores periodic checkpoints mapping source offsets to destination offsets, enabling accurate consumer resumption across regions despite different message ordering.

**Downstream integrations**: Pub/sub messaging, streaming analytics (Samza, Flink), database changelog distribution, HDFS data lake ingestion, Presto SQL queries on Kafka topics.

### 4. Geospatial Indexing (H3 Hexagonal Grid)

**H3** is Uber's open-source hierarchical hexagonal geospatial indexing system (C library, 64-bit cell identifiers).

**Projection**: Uses gnomonic projections on icosahedron faces (20-sided polyhedron). Grid is laid out directly on icosahedron faces, avoiding Mercator distortion.

**Base grid**: 122 base cells, 10 per face. 12 pentagons at icosahedron vertices (positioned in water via Buckminster Fuller orientation to minimize impact on populated areas).

**Resolution hierarchy**: 16 levels (0-15). Each finer resolution has cells with **1/7th the area** of the coarser level (aperture-7 subdivision).

**Why hexagons**: Each hexagon has 6 neighbors all at equal distance from center. Squares have two distances (edge vs diagonal), complicating gradient analysis. Uniform neighbor distance simplifies smoothing, clustering, and density calculations.

**Key API operations**:
- `geoToH3` / `h3ToGeo`: Convert between lat/lng and H3 index at a given resolution.
- `kRing(index, k)`: Retrieve all cells within grid distance k (approximates circular regions).
- `compact` / `uncompact`: Optimize storage by representing groups of cells at varying resolutions.
- Directed edges stored as 64-bit integers for movement tracking between adjacent cells.

**Uber applications**: Surge pricing zones (supply/demand measured per hexagonal cell), dispatch optimization (finding nearby drivers for UberPOOL), marketplace analytics.

### 5. Schemaless (MySQL-Backed Distributed Datastore)

Built in 2014 when Uber was outgrowing its Postgres setup. In production since October 2014.

**Data model**: The core unit is a **cell** -- an immutable JSON blob referenced by three keys: **row key**, **column name**, and **ref key**. Updates create new versions with higher ref keys (append-only, never overwrite).

**Node architecture**:
- **Worker nodes**: Stateless HTTP request handlers. Route requests to storage nodes, aggregate results. Scale independently.
- **Storage nodes**: Hold MySQL shards. Organized as clusters of **1 master + 2 minions** distributed across data centers.

**Sharding**: Fixed **4,096 shards** mapped to storage nodes based on row key hash. Each shard is a separate MySQL database with table columns: `added_id` (auto-increment PK), `row_key`, `column_name`, `ref_key`, `body` (compressed JSON), `created_at`. Compound index on the three key columns.

**Read/write paths**:
- **Reads**: Can query any node (master or minion, configurable per use case).
- **Writes**: Must go to master, then asynchronously replicate to minions.

**Failure handling**: Circuit breakers detect node failures. If master is down, writes buffer to random alternate masters via **hinted handoff** until replication catches up.

**Consistency**: Single-master-per-shard provides total write ordering, essential for trigger processing. Indexes are sharded based on a designated shard field.

**Evolution**: Later evolved toward a distributed SQL database. Migrated from InnoDB to **MyRocks** (RocksDB-based MySQL engine) for better compression and write performance.

### 6. Ringpop (Consistent Hash Ring)

Ringpop is a library for application-layer sharding with three core features: membership protocol, consistent hash ring, and request forwarding. Available in Go and Node.js.

**Consistent hash ring**:
- Implemented as a **red-black tree** (O(log n) lookups, inserts, removals).
- Hash function: **FarmHash** (fast, good distribution).
- **Replica points**: Uniform virtual nodes per physical node for even distribution. All nodes treated as homogeneous.

**Membership protocol**: Implements a **SWIM gossip protocol** variant over TCP. Nodes randomly ping each other; failed direct pings trigger indirect `ping-req` probes. Member list tracks addresses and statuses (alive, suspect, faulty) with incarnation numbers as logical clocks. Uniquely retains "down" members in the list for partition recovery.

**Flap damping**: Identifies unstable nodes with erratic state transitions. Penalties accumulate; exceeding suppression limits triggers damping (removal from ring). A `damp-req` protocol validates suspected flapping across multiple nodes before eviction.

**Request forwarding** (handle-or-forward pattern): Incoming requests hash to a ring position. If the current node owns it, process locally; otherwise proxy via **TChannel** (Uber's RPC protocol supporting out-of-order responses at 20,000-40,000 ops/sec). HTTP requests encapsulated in TChannel frames.

**Convergence**: Membership checksums compared on contact. Mismatches trigger bidirectional full syncs to exchange complete membership data.

**Usage at Uber**: Powers DISCO dispatch (data distribution across dispatch nodes), geospatial data sharding, and other services requiring consistent routing without centralized coordination.

### 7. Peloton (Unified Resource Scheduler)

Peloton co-schedules mixed workload types (batch, stateless, stateful, daemon) in a single cluster. Designed for 50,000+ hosts with millions of containers. Open-sourced by Uber.

**Four daemon types** (active-active architecture, one-directional dependencies):

| Daemon | Role |
|---|---|
| **Job Manager** | Job/task lifecycle, rolling upgrades for long-running services |
| **Resource Manager** | Maintains resource pool hierarchy, calculates entitlements, triggers preemption |
| **Placement Engine** | Finds task-to-host mappings considering constraints and host attributes. Pluggable per job type |
| **Host Manager** | Abstracts Mesos details, registers via Mesos HTTP API |

**Resource pool hierarchy**: Divides cluster by org/team. Four dimensions per pool:
- **Reservation**: Minimum guaranteed resources.
- **Limit**: Maximum consumable resources.
- **Share**: Relative weight for free capacity allocation.
- **Entitlement**: Dynamically adjusted current usable resources.

**Elastic resource sharing**: Implements **hierarchical max-min fairness**. Pools with high demand borrow underutilized resources, then reclaim via preemption when needed.

**Preemption** (two types):
- **Inter-pool**: Reclaims resources from pools exceeding entitlements.
- **Intra-pool**: Preempts lower-priority tasks for higher-priority jobs.

**Workload types**: Stateless (long-running services), Stateful (Cassandra, MySQL, Redis with local disk), Batch (Hadoop, Spark, TensorFlow -- preemptible), Daemon (per-host agents like Kafka, HAProxy).

**Infrastructure**: Runs atop **Apache Mesos**. Uses **Zookeeper** for service discovery and leader election. API uses **Protocol Buffers** + **YARPC** (Uber's RPC framework). For massive clusters, manages multiple sharded Mesos clusters.

### 8. Map and ETA Prediction Pipeline

**Routing engine (Gurafu)**:
- Evolved from open-source OSRM to in-house engine.
- Graph model: nodes = intersections, edges = road segments (with turn restrictions, speed limits, one-way constraints).
- Originally used **contraction hierarchies** but required 12-hour global rebuilds, incompatible with real-time traffic.
- Production solution: divides graph into **layers of small cells** that can be preprocessed in parallel when traffic changes, balancing speed with accuracy.
- Handles hundreds of thousands of ETA requests/second at single-digit millisecond latency.

**DeepETA (ML post-processing)**:
- Hybrid approach: routing engine predicts base ETA from segment-wise traversal times, then ML model predicts the **residual** between routing estimate and real-world outcomes.
- Architecture: **encoder-decoder with self-attention**. Selected from 7 evaluated architectures. Uses linear attention variant (O(Kd^2) vs standard O(K^2d)) for production latency.
- Features: all inputs discretized and embedded. Geospatial features use **multiple feature hashing** to map grid cells to compact bin ranges.
- Sparse model: only ~0.25% of hundreds of millions of parameters touched per request.
- Loss function: **asymmetric Huber loss** -- tunable between squared/absolute error, with separate underprediction vs overprediction costs.

**Serving pipeline**: Request -> **uRoute** service -> routing engine (route lines + base ETA) -> **Michelangelo** online prediction service (DeepETA model) -> refined ETA returned.

**Michelangelo (ML platform)**:
- Three planes: **control plane** (APIs, lifecycle management), **offline data plane** (feature computation, training, batch inference on Spark), **online data plane** (real-time inference, feature serving).
- Supports XGBoost, GLM, deep learning. Training uses Spark pipelines + distributed GPU training.
- **Michelangelo Job Controller**: unified federation layer for Ray and Spark workloads.
- Scale: ~400 active ML projects, 20K+ monthly training jobs, 5K+ models in production, **10 million real-time predictions/second** at peak.
- Auto-retraining workflows via **Canvas** framework.

### 9. Surge Pricing Architecture

Surge pricing dynamically adjusts ride prices based on real-time supply/demand imbalance.

**Data pipeline**: Event-driven architecture. Every ride request, driver location update, and trip completion generates an event flowing through **Apache Kafka**. Prioritizes **data freshness and availability over strict consistency** (AP over CP).

**Geospatial partitioning**: Supply and demand measured per **H3 hexagonal cell** in each city. Standardized grid enables consistent analysis across geographically diverse urban areas.

**Processing stack**:
- **Apache Kafka**: Event ingestion (ride requests, location updates).
- **Apache Flink**: Real-time geospatial stream processing.
- **Apache Pinot**: Real-time OLAP for metrics aggregation.
- **Redis/Memcached**: Driver location caching for fast lookups.
- **Presto**: Ad-hoc analytical queries.

**Algorithm**: Based on supply/demand ratio per H3 cell, incorporating real-time factors (traffic, weather, events). Uses **active/active Kafka consumer pattern** -- independent consumers in each region process identical data, enabling seamless regional failover.

**Predictive modeling**: Beyond reactive pricing, incorporates demand forecasting to anticipate surge conditions before they fully materialize.

### 10. Supporting Infrastructure (Cross-Cutting)

**Cadence** (open source, now CNCF): Distributed workflow orchestration engine for long-running business logic. Used by 1,000+ services at Uber. Architecture: Front End (stateless), History Service (workflow step logic), Matching Service (task-to-worker assignment), Internal Worker. Backend: Cassandra/MySQL/PostgreSQL + optional Kafka + Elasticsearch. Scales to millions of concurrent workflows. Asynchronous history event replication for zone failure recovery.

**TChannel**: Uber's RPC framing protocol. Supports out-of-order responses (prevents head-of-line blocking). Benchmarked at 20,000-40,000 ops/sec. Used by Ringpop for request forwarding and broadly across Uber services. Later largely succeeded by gRPC.

**YARPC**: Uber's RPC framework supporting multiple transports (TChannel, HTTP, gRPC). Used by Peloton and other services for cross-service communication.

**Jaeger** (open source, CNCF): Distributed tracing system, essential for debugging across 2,200+ microservices. Implements OpenTracing/OpenTelemetry standards.

**Open-source ecosystem summary**:

| Project | Purpose |
|---|---|
| H3 | Hexagonal geospatial indexing |
| Cadence | Workflow orchestration |
| Jaeger | Distributed tracing |
| Peloton | Resource scheduling |
| Ringpop | Consistent hash ring + gossip |
| uReplicator | Kafka cross-region replication |
| uForwarder | Kafka consumer proxy |
| TChannel | RPC protocol |
