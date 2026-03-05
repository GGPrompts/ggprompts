# Shopify Architecture Research

**Beads Issue:** hsg-dt9h
**Style Guide:** cork-board
**Folder:** architecture/shopify/

## Research Topics

- Monolith-to-modular evolution (one of the largest Rails apps)
- Liquid templating engine
- Storefront Renderer (Rust/Lua, edge rendering)
- Checkout architecture and extensibility
- Oxygen hosting (edge deployment for Hydrogen storefronts)
- Hydrogen (React-based custom storefronts)
- App and extension platform
- Global edge CDN architecture
- Flash sale scaling (handling massive traffic spikes)

## Key Public Sources

- Shopify Engineering blog (shopify.engineering)
- "Deconstructing the Monolith" blog post series
- "Under the Hood of Shopify's Checkout" talks
- Shopify open source: Liquid, Polaris, Hydrogen
- Simon Eskildsen (former infra lead) talks and posts
- ByteByteGo Shopify Tech Stack deep-dive

## Findings

### The Modular Monolith (Shopify Core)

Shopify's core is one of the largest Ruby on Rails applications in existence: **2.8 million lines of Ruby**, **500,000+ commits**, worked on by **1,000+ developers**. Rather than decomposing into microservices, Shopify chose a "modular monolith" — keeping a single deployment unit but splitting it internally into **37 components** organized by business domain.

**Componentization mechanism:** Each component is a **Rails Engine** running in a single process. Components are organized in layers:
- **Platform components** — foundational shared functionality
- **Supporting components** — depend on Platform, expose their own APIs
- **Frontend components** — externally facing, depend on Supporting/Platform

**Boundary enforcement tooling:**
- **Packwerk** — static analysis tool that detects unwanted cross-component constant references at PR time; runs in minutes
- **Sorbet** (Stripe's Ruby type checker) — enforces input/output contracts on component boundaries with minimal runtime overhead
- **ActiveSupport::Notifications** — publish/subscribe event system enabling dependency inversion between components

**Ownership model:** Every component is explicitly owned by a team. Whole-codebase chores like Rails upgrades are distributed across owning teams.

**Performance investments in Ruby:**
- **YJIT** — a JIT compiler for Ruby built in Rust, developed at Shopify, improving runtime performance
- **Bootsnap** — accelerates Ruby/Rails boot times
- **Tapioca** — automates Sorbet RBI file generation

### Pods Architecture (Infrastructure Isolation)

Introduced in 2016, pods are Shopify's unit of **fault isolation and horizontal scaling** (not Kubernetes pods). A pod is a set of merchant shops living on a **fully isolated set of datastores**.

**Pod composition:**
- Dedicated **MySQL instance** (sharded by merchant/shop)
- Dedicated **Redis node** (job queues, caching)
- Dedicated **Memcached cluster** (query/page caching)
- Shared app servers, job workers, and load balancers — but each shared resource communicates with **only one pod at a time**

**Routing:** **Sorting Hat** is the load balancer component that matches every incoming request to a pod and adds a pod-identifying header. App servers then query only that pod's datastores.

**Disaster recovery:** Each pod maintains **paired data centers** (active + standby). The **Pod Mover** tool can fail a pod over to its recovery data center **in under one minute** without dropping requests or jobs. Shopify runs failover drills frequently and can trigger them via Slack command.

**Resilience tooling:**
- **Semian** — circuit breaker library protecting Redis/MySQL connections from cascading failures
- **Toxiproxy** — simulates network failures in pre-production testing

### Database & Data Infrastructure

**Primary database:** MySQL, sharded across **100+ shards**. Sharding key is `user_id` (merchant ID) since most tables relate to a merchant.

**Vitess adoption:** For the Shop app backend, Shopify adopted **Vitess** (YouTube's open-source MySQL sharding middleware). Components: **VTGate** (query routing), **VSchema** (shard mapping), **VTTablet** (per-shard MySQL proxy).

**Change Data Capture (CDC):**
- **Debezium** connectors (one per MySQL shard, ~150 connectors across 12 K8s pods) read binlogs
- Events flow into **Apache Kafka** intermediate topics, then a **Kafka Streams** app consolidates into **one compacted topic per logical table** (partitioned by primary key)
- p99 latency: **< 10 seconds** from MySQL write to Kafka availability
- BFCM 2020 throughput: 65K records/sec average, spikes to 100K/sec
- Large records (>1MB) overflow to **Google Cloud Storage** with Kafka pointers

**Kafka at scale:** Peak throughput of **66 million messages per second**. Feeds search indexing, ML pipelines, analytics, notifications, and real-time embeddings.

**Internal APIs:**
- **REST** — legacy internal communication
- **GraphQL** — public-facing API standard (Storefront API, Admin API)
- **gRPC** — new internal service-to-service standard

### Storefront Renderer (SFR)

A dedicated Ruby application extracted from the monolith specifically for rendering merchant storefronts with Liquid templates. Achieves **4-6x faster response times** than the legacy monolith path.

**Architecture:**
- Separate Ruby app (not Rails), with handcrafted SQL instead of ActiveRecord ORM
- Reads from **dedicated MySQL read replicas** (active-active replication)
- Runs on **Kubernetes** across multiple global regions
- Decoupled from the monolith's pod-writer constraint, enabling multi-region serving

**Four-layer caching system:**
1. **In-memory LRU cache** — per-process, for hot data during flash sales
2. **Node-local Redis** — shared across workers on same machine, no network hop
3. **Query result cache** — transparently caches MySQL query results in Redis
4. **Full-page cache** — stores complete rendered HTML for matching cache keys

**Simplify-Batch-Cache pattern:**
- **Simplify** — plain Ruby objects from raw SQL rows, no ORM overhead
- **Batch** — MySQL multi-statement queries load all needed data in a single round trip
- **Cache** — Liquid object memoizer prevents 16-20 datastore calls per request (up to 4,000 in extreme cases)

**Memory optimization:** In-place mutation (`map!` over `map`), string interpolation over concatenation, method-level allocation budgets.

**Traffic routing:** **OpenResty** (nginx + Lua) routes storefront traffic. A JSON-based rule system controls render_rate (% of traffic to new SFR) and verify_rate (% compared against legacy). Rules are stored in a control plane and managed via a **"spy" chatbot**. Verification runs out-of-band using nginx timers to avoid latency impact.

### Liquid Templating Engine

Open-source template language created by Shopify in 2006, written in Ruby.

**Design principles:**
- **Security-first** — non-evaling; merchants can edit templates without executing arbitrary code
- **Separate compile/render** — expensive parsing done once, then rendered repeatedly with different data
- **Stateless execution** — no side effects between renders

**Core constructs:**
- **Objects** (`{{ }}`) — output dynamic content
- **Tags** (`{% %}`) — control flow (if, for, assign, etc.)
- **Filters** (`|`) — transform output (date formatting, string manipulation, etc.)

Liquid is the rendering layer for all 4M+ Shopify storefronts and is also used by Jekyll, Zendesk, and other platforms.

### Checkout Architecture & Extensibility

Checkout is Shopify's most performance-critical and security-sensitive path. The extensibility platform allows third-party apps to customize checkout without accessing raw HTML or payment data.

**Extension types:**
- **Checkout UI Extensions** — add custom UI (offers, fields, loyalty programs) visible in both guest checkout and Shop Pay
- **Shopify Functions** — replace or extend server-side business logic (discounts, shipping, order routing) via WebAssembly
- **Branding API** — advanced visual customization (colors, fonts, layout) beyond basic theming
- **Pixels** — event tracking for analytics and marketing attribution

**Remote DOM architecture:**
- Extensions define UI in a **sandboxed Web Worker** using a DOM-like API
- The sandbox serializes UI updates as JSON messages over a **MessageChannel**
- The host page's **RemoteReceiver** reconstructs the component tree and renders native HTML elements
- Extensions never touch the real DOM, payment fields, or other extensions
- Hosts exist in JavaScript (web), Kotlin (Android), and Swift (iOS)
- Open-source library: **remote-dom** (successor to remote-ui)

**Security model:** All custom code runs in Web Workers. No custom code executes on the parent page. Communication is sanitized by a managed bridge. PCI DSS v4 compliant by design.

**Performance:** Checkout extensibility delivers **up to 1% higher conversion** on average vs. legacy checkout.

### Shopify Functions & WebAssembly

Shopify Functions execute third-party backend logic on Shopify's own infrastructure using WebAssembly sandboxing.

**Execution environment:**
- Originally used **Lucet** (Fastly's Wasm runtime) wrapped in a Rust web service
- Module execution: ~**100 microseconds** in Lucet, ~**4ms** total (p99)
- Functions are **pure** — no network calls, no database access, no side effects
- Strict limits: **256KB** max module size, **5ms** max execution time

**Input/output model:** Functions declare a **GraphQL input query** defining what data they need. Shopify provides the data as JSON via stdin; the function returns transformed output via stdout.

**Language support:**
- **Rust** — recommended, produces smallest/fastest Wasm modules
- **JavaScript** — via **Javy**, a JS-to-Wasm toolchain using **QuickJS** (ES2020-compliant C engine). Dynamic linking reduces user module size to ~220 bytes + bytecode. ~3x slower than Rust but still under 5ms
- Any language that compiles to Wasm (Zig, TinyGo, AssemblyScript, C++)

**Javy architecture:** Two-stage compilation — QuickJS engine compiled to Wasm separately, user code compiled to bytecode only. Connected via `javy_quickjs_provider_v1` interface with just two functions: `realloc` and `eval_bytecode`.

**Future work:** Contracted with Igalia to port **SpiderMonkey** to Wasm for significant JS performance gains. Exploring JIT-in-Wasm standards.

### Hydrogen & Oxygen (Headless Commerce)

**Hydrogen** is Shopify's React-based framework for building custom headless storefronts. Built on **React Router** (formerly Remix). Provides commerce-specific components, hooks, and utilities (cart, product, collection, etc.).

**Oxygen** is the edge hosting platform for Hydrogen storefronts:
- Built on **Cloudflare Workers** (V8 isolate model)
- **Worker chaining architecture:**
  - **Gateway Worker** — handles auth validation and request routing
  - **Storefront Worker** — executes Hydrogen app code
  - Uses Cloudflare's **Dynamic Dispatch API** (Workers for Platforms)
- **Trace Worker** — captures performance telemetry from Storefront Workers

**Deployment:** Continuous deployment via GitHub Actions. Hydrogen CLI builds, creates Oxygen deployment, returns preview link. Available at no extra charge on paid Shopify plans.

**Backend connectivity:**
- Shopify **Storefront API** (GraphQL) for product/collection/cart data
- Shopify **Admin API** (GraphQL) for merchant management
- Shopify CDN for assets
- Shopify Identity and Access Management for auth

**Observability stack (external-facing):**
- **Grafana** — dashboards and alerting
- **Cortex** — metrics collection
- **Loki** — log aggregation
- **Tempo** — distributed tracing

### Global Edge CDN & Flash Sale Scaling

**CDN:** Powered by **Fastly** with **300+ edge locations** worldwide. Static assets (images, CSS, JS) cached at edge, reducing latency 40-60% vs. single-origin.

**Flash sale strategy:**
- **Automatic scaling** — Shopify Plus provisions additional compute within seconds during traffic surges (10x+ normal traffic)
- **Dedicated checkout server clusters** — handle 10,000+ concurrent checkouts
- **Load testing:** Custom tool called **Coronoma** simulates flash sale traffic. For known promotions, Shopify pre-tests specific stores and may allocate a **dedicated pod** temporarily
- **Merchant coordination:** Tracks marketing calendars; for major launches, runs unscheduled load tests and confirms capacity in reserve infrastructure

**Scale records (BFCM 2024):**
- 173 billion requests in 24 hours
- **284 million requests/minute** at peak
- 12 TB egress per minute
- 45 million database reads/second
- 7.6 million database writes/second
- 216 million embeddings processed daily

### Frontend & Developer Experience

**Web admin:** React + TypeScript, GraphQL-only data fetching, stateless architecture (no shared cross-view state)

**Mobile:** React Native for iOS/Android. Shopify contributes to FlashList, Skia, WebGPU, Reanimated.

**Design system:** **Polaris** — Shopify's open-source React component library for admin UIs.

**CI/CD:**
- **Google Kubernetes Engine (GKE)** for all container orchestration
- **Buildkite** orchestrates CI with hundreds of parallel workers
- **400,000+ unit tests** run on every monolith build
- **Graphite** for PR stacking and merge queues
- **No staging environments** — canary deployments with feature flags, fast rollback
- **Maintenance Tasks** — standardized background job framework

### App Platform Architecture

Third-party apps extend Shopify through multiple extension surfaces:

**Extension surfaces:**
- Checkout UI Extensions (Remote DOM in Web Workers)
- Shopify Functions (Wasm on Shopify infrastructure)
- Theme App Extensions (Liquid blocks injected into themes)
- Admin Extensions (embedded in Shopify Admin via Polaris)
- Post-Purchase Extensions (upsells after payment)

**App hosting:** Apps are external web services that authenticate via OAuth and communicate through GraphQL Admin API. Shopify provides **App Bridge** for embedding app UIs in the admin iframe.

**Webhooks:** Delivered via HTTP POST or **Amazon EventBridge**. Backed by Redis job queues for reliable delivery.
