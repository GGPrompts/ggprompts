# Discord Architecture Research

**Beads Issue:** hsg-ccgk
**Style Guide:** gaming-esports
**Folder:** architecture/discord/

## Research Topics

- Real-time messaging infrastructure (WebSocket gateway)
- Elixir to Rust migration story
- Cassandra to ScyllaDB migration
- Guild (server) sharding and data partitioning
- Voice architecture (WebRTC, Opus codec, selective forwarding)
- Message storage and indexing
- Bot and API platform architecture
- CDN and media processing pipeline

## Key Public Sources

- Discord Engineering blog (discord.com/blog/engineering)
- "How Discord Stores Billions of Messages" blog post
- "How Discord Stores Trillions of Messages" (ScyllaDB migration)
- "Why Discord is Switching from Go to Rust" blog post
- "How Discord Handles Push Request Bursts of Over a Million Per Minute"
- "How Discord Indexes Trillions of Messages"
- "How Discord Handles Two and Half Million Concurrent Voice Users using WebRTC"
- "Using Rust to Scale Elixir for 11 Million Concurrent Users"
- "Modern Image Formats at Discord: Supporting WebP and AVIF"
- "Meet DAVE: Discord's New End-to-End Encryption for Audio & Video"
- "Real time communication at scale with Elixir at Discord" (elixir-lang.org)

---

## Findings

### 1. Technology Stack Overview

Discord's backend is built on a polyglot architecture:

- **Elixir/BEAM** -- Core real-time messaging backbone. ~20 microservices running on 400-500 machines, managed by a 5-person chat infrastructure team. Services communicate via Distributed Erlang with partially-meshed topology (`-connect_all false`). etcd handles service discovery.
- **Python** -- Powers the API monolith (the HTTP REST API).
- **Rust** -- Used for performance-critical services: Read States, Data Services (database proxy layer), Media Proxy, game SDK, video capture/encoding for Go Live, and Elixir NIFs.
- **C++** -- Voice/video media engine (SFU), native client audio engine, ScyllaDB itself.
- **Go** -- Formerly used for Read States (migrated to Rust) and Media Proxy (migrated to Rust).

Scale: 12+ million concurrent users, 26 million WebSocket events/second pushed to clients, 6.7 million active guilds.

### 2. Real-Time Messaging Infrastructure (WebSocket Gateway)

The gateway is the backbone of Discord's real-time event system.

**Components:**
- **Gateway servers** -- Elixir processes using Cowboy for WebSocket/TCP handling
- **GenStage** -- Provides load regulation with back-pressure and load-shedding for event fan-out
- **Pub/Sub system** -- Backend services publish events (new messages, typing indicators, presence changes) to a message bus; connected clients subscribed to those events receive them instantly

**Connection model:**
- Every active Discord client maintains a persistent WebSocket connection to a gateway server
- The gateway pushes events (messages, presence updates, typing indicators) without polling
- Clients are assigned to shards; each shard receives events only for its assigned guilds
- Shard formula: `(guild_id >> 22) % num_shards == shard_id`

**Compression:**
- Originally used zlib; migrated to Zstandard compression
- Achieved 40% reduction in gateway bandwidth usage

**Push notifications** use a separate pipeline:
- Two-stage GenStage system (Push Collector producer -> Pusher consumers)
- Push Collector: 1 Erlang process per machine, buffers incoming push requests
- Pusher: multiple processes per machine, demands exactly 100 requests at a time
- Uses Firebase XMPP (not HTTP) because XMPP enforces a 100-pending-request limit per connection, ideal for backpressure
- Handles bursts of 1M+ push requests per minute via load-shedding when buffer is full

### 3. Guild (Server) Sharding and Data Partitioning

**Guild process model:**
- Each guild is represented as a stateful Elixir GenServer process
- Guilds are distributed across the cluster using a hash ring
- BEAM's built-in fault tolerance and supervision handles process crashes and node failures
- Guilds are the atomic unit -- individual guilds cannot be further partitioned horizontally

**Client sharding:**
- Bot clients must shard at 2,500 guilds (enforced by Discord)
- Recommended ~1,000 guilds per shard
- Each shard maintains its own WebSocket connection to the gateway

**Limitation:** Socket connections are held by processes, so moving processes means disconnecting users. This makes flexible repartitioning nearly impossible without user disruption.

### 4. Elixir + Rust: The NIF Story

Discord did not fully migrate from Elixir to Rust. Instead, they use Rust NIFs (Native Implemented Functions) to accelerate hot paths within the BEAM VM.

**The Member List problem:**
- Guilds with 100,000+ members need sorted member lists
- Updating a list when a member joins requires a sorted insertion reporting the index
- Pure Elixir solutions (MapSet, ordsets, custom skip-list Cells) topped out at 27,000 microseconds worst-case for 250K items

**Solution: Rust SortedSet NIF via Rustler:**
- Rustler provides safe NIF bindings that guarantee no VM crashes or memory leaks
- Rust SortedSet at 1,000,000 items: 0.61 us best-case, 3.68 us worst-case
- 160x worst-case improvement over pure Elixir
- All operations stay under 1ms, eliminating need for BEAM reductions/yielding
- The Rust NIF appears as a regular Elixir module to callers
- Powers every single Discord guild's member list

### 5. Go to Rust: Read States Service

**Read States** tracks which channels/messages each user has read. Accessed on every connection, message send, and read action.

**Scale:**
- Millions of users per cache
- Tens of millions of Read States per cache
- Hundreds of thousands of cache updates per second
- Backed by Cassandra with immediate eviction commits + scheduled 30-second future commits

**Go problem:** Go's garbage collector runs every 2 minutes regardless of heap growth. It scanned the entire LRU cache to check for unreferenced memory, causing periodic latency spikes. Reducing cache size lowered spike magnitude but increased cache misses.

**Rust solution:**
- Ownership-based memory model: evicted items are immediately freed, no GC scanning
- Eliminated all latency spikes
- Average response time dropped to microseconds
- Capacity increased to 8 million Read States per node
- Used BTreeMap (not HashMap) for memory efficiency
- Built on Tokio async runtime (adopted nightly Rust for early async/await)

**Broader Rust adoption at Discord:** Read States, Data Services, Media Proxy, game SDK, video capture for Go Live, Elixir NIFs, and multiple backend services.

### 6. Message Storage: Cassandra to ScyllaDB Migration

**Evolution:**
- 2015: MongoDB (initial)
- 2017: Cassandra -- 12 nodes, billions of messages
- 2022: 177 Cassandra nodes, trillions of messages
- Post-2022: ScyllaDB -- 72 nodes (60% reduction), 9 TB disk per node

**Data model:**
- Messages partitioned by channel_id + static time buckets
- Each message uses a Snowflake ID (chronologically sortable, embeds timestamp)
- Replicated across 3 nodes

**Cassandra pain points:**
- Hot partitions caused unbounded concurrency and cascading latency
- "Gossip dance" -- temporarily removing nodes for compaction
- Java GC pauses degraded stability
- Extreme operational toil at 177-node scale

**Data Services layer (Rust):**
- Intermediary between API and database clusters
- **Request coalescing:** Multiple simultaneous requests for the same data trigger one DB query; other callers subscribe to the result
- **Consistent hash routing:** Channel IDs route to specific service instances for cache locality
- Built on Tokio async ecosystem

**Migration execution:**
- Initially planned 3 months using Spark
- Extended the Rust data services library to handle migration
- Custom migrator with SQLite checkpointing
- Achieved 3.2 million messages/second throughput
- Completed in 9 days (down from estimated 3 months)

**Performance gains:**
- P99 read latency: 40-125ms (Cassandra) -> 15ms (ScyllaDB)
- P99 write latency: 5-70ms -> 5ms (steady)

### 7. Message Search and Indexing (Elasticsearch)

**Legacy system (2017):**
- 2 Elasticsearch clusters with 200+ nodes each
- Messages lazily indexed via Redis-backed queue
- Bulk indexing batches spanned 50+ nodes; single node failure caused ~40% batch failure
- Redis queue dropped messages when CPU maxed during ES outages
- Lucene MAX_DOC limit (~2B messages/index) required manual intervention for large guilds
- Large clusters prevented rolling restarts (blocked Log4Shell patching)

**Modern architecture:**
- 40 Elasticsearch clusters with thousands of indices
- Deployed on Kubernetes using Elastic Cloud on Kubernetes (ECK) operator
- Each cluster has dedicated ingest, master-eligible, and data node roles
- "Cell" topology: smaller clusters grouped logically with zonal resilience

**Sharding strategy:**
- Guild messages: sharded by `guild_id` in guild-messages ES cell
- DM messages: sharded by `user_id` in separate user-dm-messages ES cell
- Shard-to-guild mapping persisted in Cassandra (source of truth) and cached in Redis

**Message routing:**
- PubSub-based router batches messages grouped by destination (ES cluster + index)
- Prevents partial batch failures by ensuring all messages in a bulk op target the same node

**Big Freaking Guilds (BFGs):**
- Specialized indices with multiple primary shards for parallel querying
- Dual-indexing flow for zero-downtime reindexing during migration

**Index contents:**
- Stores attachment names and message text for search
- Only returns message_id, channel_id, guild_id (avoids data duplication with primary store)

**Performance:**
- p50 < 100ms, p95 and p99 < 500ms
- Indexing throughput doubled vs legacy
- Median query latency improved from 500ms to under 100ms

### 8. Voice Architecture (WebRTC + SFU)

Three backend services power voice:

**Discord Gateway** -- Maintains WebSocket connections for guild events, messages, presence.

**Discord Guilds** -- Manages voice server assignment and maintains voice state objects per channel participant.

**Discord Voice** -- Two components:
1. **Signaling component** -- Generates stream identifiers and encryption keys, forwards speaking indications
2. **Selective Forwarding Unit (SFU)** -- Homegrown C++ media relay

**SFU capabilities:**
- Forwards audio and video traffic within channels
- Drops audio from server-muted users
- Bridges between native and browser clients (dual encryption/transport)
- Handles RTCP for video quality optimization
- Tailored to Discord's use case for maximum performance

**Client architecture:**
- Web browsers: native browser WebRTC
- Desktop/mobile: custom C++ media engine built atop WebRTC native library
- Custom engine enables: bypassing Windows audio ducking, raw audio access for voice activity detection, system-wide push-to-talk, priority speaker indicators in media packets

**Protocol optimizations:**
- Replaces standard SDP signaling (~10KB) with minimal ~1000 bytes (server address, encryption method, codec, stream ID)
- No ICE needed (all clients connect through relay servers) -- improves NAT reliability, hides user IPs
- Replaced DTLS/SRTP with Salsa20 encryption for performance
- Silent periods: no audio transmitted, requires sequence number rewriting

**Audio:** Opus codec, stereo (2 channels), 48kHz sample rate.

**Scale (as of blog post):** 850+ voice servers, 13 regions, 30+ data centers, 2.6M concurrent voice users, 220+ Gbps egress, 120+ Mpps.

**DAVE Protocol (E2EE for Audio/Video, 2024-2026):**
- End-to-end encryption for DMs, group DMs, voice channels, and Go Live streams
- Enforced for all non-Stage voice calls starting March 2, 2026
- Uses WebRTC Encoded Transforms + Messaging Layer Security (MLS) for group key exchange
- Per-sender symmetric key encryption; Discord servers cannot decrypt
- Epoch-based key rotation: keys change when participants join/leave
- Voice gateway serves as MLS delivery service
- Open-source protocol, externally audited by Trail of Bits

### 9. Bot and API Platform Architecture

**Two API surfaces:**
1. **HTTP REST API** -- Python monolith for CRUD operations
2. **WebSocket Gateway** -- Elixir-based real-time event stream

**Bot interaction models (mutually exclusive per app):**
1. **Gateway events** -- Bot maintains persistent WebSocket connection, receives `INTERACTION_CREATE` events
2. **Interactions Endpoint URL** -- Outgoing webhook; Discord POSTs interaction payloads to a configured URL (enables serverless/Lambda architectures)

**Rate limiting (three tiers):**
1. **Per-route** -- Specific to each endpoint + HTTP method, shared across related endpoints via `X-RateLimit-Bucket` header. Scoped by top-level resource (guild_id, channel_id, webhook_id/token)
2. **Global** -- 50 requests/second across all endpoints per bot
3. **Invalid-request limit** -- 10,000 invalid requests (401/403/429) per 10 minutes per IP, triggers temporary ban

**Rate limit response:** HTTP 429 with JSON body containing `retry_after` field and `Retry-After` header.

### 10. CDN and Media Processing Pipeline

**Two media domains:**
- `cdn.discordapp.com` -- Static CDN for original assets
- `media.discordapp.net` -- Media Proxy for on-the-fly processing

**Media Proxy service (recently ported Go -> Rust):**
- Inspects, converts, and resizes every attachment and embedded image
- Processing flow: Detection -> Transformation -> Optimization -> Storage -> Delivery

**Lilliput** -- Discord's open-source image processing library (C++/Go bindings):
- Animated WebP transformation support (v1.3.1)
- AVIF detection and transformation via libyuv, aom, libavif dependencies
- Metadata inspection for animation detection

**Format support:**
- WebP: 8-bit color (16M colors), superior compression, near-universal support
- AVIF: up to 12-bit color, HDR support, advanced compression
- GIF: legacy format retained for compatibility
- Animated emojis served as animated WebP (29% median size reduction over GIF)
- HDR AVIF tone-mapped to SDR when converting to 8-bit formats

**Performance results:**
- 29.4% median response size reduction (GIF 31.3KB -> WebP 22.1KB)
- 42.5% p95 size reduction (GIF 228KB -> WebP 131KB)
- 95%+ animated emoji requests served as WebP
- 60fps display of dozens of animated emojis simultaneously

**`is_animated` flag** propagated throughout API systems; respects user Reduced Motion accessibility settings.

### Architecture Component Map (for Mermaid diagrams)

**Client layer:**
- Web (browser WebRTC) / Desktop (C++ engine) / Mobile (C++ engine)
- Each maintains WebSocket to Gateway + optional WebSocket to Voice server

**Gateway layer (Elixir):**
- WebSocket Gateway servers (Cowboy)
- GenStage for back-pressure/load-shedding
- Pub/Sub event bus
- Push notification pipeline (GenStage -> Firebase XMPP)

**Application services:**
- Python API monolith (HTTP REST)
- ~20 Elixir microservices (Distributed Erlang, etcd discovery)
- Read States service (Rust, Tokio, BTreeMap LRU)
- Data Services (Rust, request coalescing, consistent hash routing)
- Voice signaling (Elixir control plane)
- Media Proxy (Rust, Lilliput)

**Media layer:**
- Voice SFU (C++, Salsa20/DAVE encryption, Opus 48kHz stereo)
- 850+ voice servers across 13 regions

**Data layer:**
- ScyllaDB (message storage, 72 nodes, Snowflake IDs, channel+time partitioning)
- Elasticsearch (search indexing, 40 clusters on K8s/ECK, guild+DM cells)
- Cassandra (Read States backing store, ES shard mapping source of truth)
- Redis (caching, ES shard mapping cache, formerly push queue)

**CDN/Media:**
- cdn.discordapp.com (static assets)
- media.discordapp.net (Media Proxy: resize, convert, optimize)
- WebP/AVIF/GIF format pipeline

**Key data flows:**
1. Message send: Client -> Gateway WS -> Elixir Pub/Sub -> fan-out to subscribed clients + Data Services (Rust) -> ScyllaDB + ES indexing router
2. Message read: Client -> API (Python) -> Data Services (Rust, coalescing) -> ScyllaDB
3. Search: Client -> API -> Elasticsearch cell (guild or DM)
4. Voice: Client -> Gateway (voice state) -> Voice server assignment -> Signaling WS + SFU (C++) media relay
5. Media upload: Client -> API -> CDN storage + Media Proxy processing -> CDN delivery
