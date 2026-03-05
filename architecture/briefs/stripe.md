# Stripe Architecture Research

**Beads Issue:** hsg-6m6u
**Style Guide:** swiss
**Folder:** architecture/stripe/

## Research Topics

- API design philosophy (RESTful, versioning, backwards compatibility)
- Idempotency system (idempotency keys, request deduplication)
- Payment state machines and transaction lifecycle
- Webhook delivery infrastructure (retry, signing, ordering)
- Ruby monolith architecture (Sorbet type system)
- PCI compliance architecture (tokenization, vault)
- Radar fraud detection pipeline
- Connect platform (multi-party payments)
- Infrastructure (AWS, databases, observability, availability)

## Key Public Sources

- Stripe Engineering blog (stripe.com/blog/engineering)
- "Designing robust and predictable APIs with idempotency" blog post
- Stripe API documentation (gold standard for API design)
- "How we built it: Stripe Radar" blog post
- "APIs as infrastructure: future-proofing Stripe with versioning" blog post
- Sorbet (sorbet.org) type checker documentation
- AWS re:Invent 2024 talk: "How Stripe achieves five and a half 9s of availability"
- "Architecture of Stripe's Document Database" (Quastor)

## Findings

### API Design and Versioning

Stripe has maintained backwards compatibility with every version of its API since inception in 2011. The versioning system uses **date-based rolling versions** (e.g., `2017-05-24`) rather than semver. Major releases (e.g., `2024-09-30.acacia`) ship twice a year and are the only releases that may contain breaking changes; monthly updates between majors are always backwards-compatible.

**Account pinning:** The first time a user makes an API request, their account is pinned to the current version. Users can override per-request via the `Stripe-Version` header or upgrade through the dashboard.

**Internal architecture -- Version Change Modules:** Engineers write code only against the latest API version. The versioning layer is separate from business logic:

1. Core logic generates a response in the current schema
2. The system determines the target version (from header, OAuth app, or account pin)
3. It walks backwards through time, applying each **version change module** sequentially

Each version change module specifies: documentation of the change, a transformation function, and which API resource types it applies to. For changes with side effects that cannot be encapsulated in a response transform, a `has_side_effects` annotation makes the module a no-op in the transformation layer, and developers check `VersionChanges.active?()` elsewhere in the codebase.

**Backwards-compatible changes** (safe to add without versioning): new API resources, new optional request parameters, new properties on existing responses.

**Developer tooling:** The version change modules power automatic changelog generation, personalized API docs (warning users about breaking changes relative to their pinned version), and declarative field-level change tracking.

### Idempotency System

Stripe implements idempotency on all mutating endpoints (POST) via the `Idempotency-Key` HTTP header. Clients generate a unique key (recommended: V4 UUID) and include it with each request. Keys expire after 24 hours.

**Atomic Phases Pattern** (from Brandur Leach's detailed implementation guide):

The request lifecycle is divided into discrete **atomic phases** -- local state mutations wrapped in ACID transactions, separated by **foreign state mutations** (calls to external services like payment processors). Each phase boundary is marked by a **recovery point** -- a named checkpoint stored in the database.

Example flow for a ride-payment service:
1. Phase 1 (tx): Upsert idempotency key record
2. Phase 2 (tx): Create local records (ride, audit logs)
3. Foreign mutation: Call Stripe charge API
4. Phase 3 (tx): Update ride with charge ID, stage background jobs

**Database schema** for idempotency keys:
- `idempotency_key`: Client-provided unique ID (scoped per user)
- `locked_at`: Prevents concurrent duplicate requests
- `request_params/method/path`: Validates retry requests match originals
- `response_code/body`: Cached results for completed requests
- `recovery_point`: Current state label (e.g., `started`, `ride_created`, `charge_created`, `finished`)

**State machine:** Recovery points form a directed acyclic graph. On retry, the server jumps to the last recovery point and resumes. Finished requests return the cached response immediately.

**Error handling:**
- Recoverable errors (timeouts): Unlock the key, return 5xx, allow retries
- Unrecoverable errors (invalid card): Set recovery point to `finished` with error response
- Concurrent conflicts: Return 409 using SERIALIZABLE transaction isolation

**Supporting infrastructure:**
- **Completer**: Finds abandoned incomplete requests and pushes them to completion
- **Reaper**: Deletes idempotency keys after ~72 hours
- **Enqueuer**: Moves jobs from `staged_jobs` table to worker queues post-commit

### Payment State Machine (PaymentIntent Lifecycle)

The PaymentIntent is the central stateful object tracking a customer's attempt to pay. It combines a PaymentMethod (the "how") with a PaymentIntent (the "what").

**Seven states:**
1. `requires_payment_method` -- Initial state after creation
2. `requires_confirmation` -- Payment details submitted (most integrations skip this)
3. `requires_action` -- Additional authentication needed (e.g., 3D Secure)
4. `processing` -- Asynchronous payment under review
5. `requires_capture` -- Manual authorization flow (funds held)
6. `succeeded` -- Payment complete, funds secured
7. `canceled` -- Intent invalidated, held funds released

**Key flows:**
- **Immediate card capture:** `requires_payment_method` -> `requires_confirmation` -> `succeeded`
- **Manual capture:** `requires_payment_method` -> `requires_confirmation` -> `requires_capture` -> `processing` -> `succeeded`
- **3D Secure auth:** `requires_payment_method` -> `requires_confirmation` -> `requires_action` -> `processing` -> `succeeded`
- **Decline/retry:** `processing` or `requires_capture` -> `requires_payment_method` (back to start)
- **Cancellation:** Any state except `processing`/`succeeded` -> `canceled`

**Internal payment pipeline components:**
- API Gateway: Authentication, rate limiting, idempotency key recording
- Payments Service: Creates/validates intents, manages state machine
- Transaction Processor: Business logic for payment execution
- Ledger: Double-entry bookkeeping for financial records
- Fraud Detection Module (Radar): Real-time risk scoring
- Notification System: Webhook dispatch for status changes

### Webhook Delivery Infrastructure

**Delivery and retry schedule:** Stripe attempts delivery for up to 3 days in live mode with exponential backoff: immediately, 5 min, 30 min, 2 hours, 5 hours, 10 hours, then every 12 hours. Sandbox webhooks retry 3 times over a few hours.

**Signature verification:** Uses HMAC-SHA256. Each delivery includes a `Stripe-Signature` header containing a timestamp and signature. The timestamp is part of the signed payload, preventing replay attacks (an attacker cannot change the timestamp without invalidating the signature).

**Retry behavior:** Each retry generates a new signature and timestamp -- the signature is specific to each delivery attempt, not the original event.

**Design principles:**
- Handlers must be idempotent (duplicate deliveries are possible during retries)
- Events should be verified via signature before processing
- Handlers should return 2xx quickly and process asynchronously

### Ruby Monolith and Sorbet Type System

**The monolith:** Stripe's core product is implemented in a single Ruby monolith -- over **15 million lines of code** across **150,000 Ruby files**. The company delayed decomposition to microservices until it had grown beyond 3,000 engineers with a decade of development in the monolith.

**The problem Sorbet solved:** By 2017, hundreds of engineers were working in millions of lines of Ruby. The most common production failure was `NoMethodError`. New engineers struggled to learn the codebase; experienced engineers feared sweeping changes.

**Sorbet development timeline:**
- November 2017: Started writing Sorbet from scratch
- May 2018: Type checking required in automated test suite
- June 2019: Open-sourced to the public

**Architecture of Sorbet:**
- Written in **C++** (not Ruby) for performance
- Typechecks ~100,000 lines/sec per core
- Only does **local type inference** (result of checking one method never affects another)
- **Multithreaded**, scales linearly across CPU cores
- Pre-serializes standard library definitions into the binary for fast startup
- For 80% of edits, reports errors in milliseconds; worst case is seconds
- Strictness levels: `typed: false` (ignore), `typed: true` (check), `typed: strict` (require signatures)

**Impact:** Sorbet is what made it possible for Stripe to maintain a monolith at this scale. Without it, they would have been forced into premature decomposition.

### PCI Compliance and Tokenization Vault

Stripe is certified as a **PCI Service Provider Level 1** -- the most stringent level in the payments industry.

**Card Data Vault (CDV) architecture:**
- PANs (Personal Account Numbers) are tokenized internally, isolating raw numbers from all other infrastructure
- No internal servers or daemons can obtain plaintext card numbers
- Cards can only be sent to service providers on a static allowlist
- All card numbers encrypted at rest with **AES-256**
- Decryption keys stored on separate machines from encrypted data
- The CDV runs in a **separate hosting environment** with no shared credentials with primary Stripe services (API, website, etc.)

**Integration methods that reduce PCI scope:**
- Stripe Checkout (hosted payment page)
- Stripe Elements (pre-built UI components)
- Mobile SDKs (iOS, Android)
- Terminal SDKs (in-person payments)
- Vault and Forward API (forward card details to third-party APIs without touching raw data)

### Radar Fraud Detection Pipeline

Radar is Stripe's ML-powered fraud detection system that scores every transaction in **under 100 milliseconds** using **1,000+ transaction characteristics**.

**Model evolution:**
- Originally: **Wide & Deep ensemble** (XGBoost + Deep Neural Network)
- Mid-2022: Migrated to **pure DNN-only architecture** with multi-branch design inspired by ResNeXt ("Network-in-Neuron" strategy)
- Result: Training time reduced by **85%+ (under 2 hours)**, enabling multiple experimental iterations per day vs. overnight jobs
- Currently testing **10x-100x increases** in training data volume

**Feature engineering pipeline:**
- Forensic analysis of past fraud attacks for behavioral patterns
- Pattern recognition across the Stripe network (e.g., throwaway email formats)
- Dark web monitoring with weekly team meetings on emerging fraud trends
- Rapid prototyping and performance testing of new features

**Real-time scoring flow:**
1. Transaction enters the payment pipeline
2. Radar extracts 1,000+ features (card info, device fingerprint, IP, behavioral signals, network-wide patterns)
3. DNN model produces a fraud probability score
4. Score determines: approve, block, or divert to additional verification (3D Secure)
5. Decision made in <100ms with **0.1% false positive rate**

**Explainability:**
- Feature attribution showing which characteristics drove the decision
- Geographic context (maps of purchase vs. shipping locations)
- Elasticsearch-powered related transaction retrieval for investigation
- Risk Insights API exposing contributing factors

**Training and deployment pipeline:**
- Automated tooling for regular training, tuning, and evaluation
- Continuous performance dashboards updated post-training, pre-release
- Tripled model release velocity to combat fraud trend drift
- Network effect: more Stripe merchants = more training data = better fraud detection for everyone

### Connect Platform (Multi-Party Payments)

Stripe Connect enables platforms and marketplaces to route payments between multiple parties.

**Account types:**
- **Standard**: Controlled by account holder, full Stripe dashboard access
- **Express**: Platform manages payout schedules and fund flows
- **Custom**: Fully white-labeled, account holder may never interact with Stripe directly

**Three charge types:**

1. **Direct charges**: Payment created on the connected account. Funds go to connected account; platform takes an application fee. Best for: SaaS platforms where users transact directly with sellers.

2. **Destination charges**: Payment created on platform, immediately transferred to one connected account. Platform decides fee split. Best for: marketplaces (home rental, ridesharing).

3. **Separate charges and transfers**: Payment created on platform, funds transferred to one or more connected accounts separately. Supports splitting a single payment across multiple recipients. Best for: multi-vendor marketplaces (food delivery splitting between restaurant and driver).

**Built-in capabilities:**
- Automatic platform fee deduction before fund transfer
- Automatic clawback from each party on refunds/chargebacks
- Currency conversion and international payouts in local currency
- Onboarding and KYC verification flows (Stripe-hosted or API-based)
- Connected account dashboards (hosted or embedded components)

### Infrastructure and Availability

**Scale:** ~3,000 engineers across 360 teams generating **500 million metrics every 10 seconds**. Target availability: **5.5 nines (99.99995%)**.

**Cloud platform:** Runs on **AWS**. The Core Infrastructure team abstracts cloud provider primitives to normalize patterns while maintaining high reliability and low latency at internet scale.

**Core Infrastructure organization covers:**
- Operating system components
- Databases (MongoDB, PostgreSQL, MySQL)
- High availability and disaster recovery
- AWS cloud infrastructure
- Linux servers and container orchestration
- Mesh networking and service discovery
- Change management
- Network edge infrastructure

**DocDB -- Internal Database as a Service:**
Built on top of MongoDB to handle petabytes of data at 99.999% uptime. Architecture:

- **Database Proxy**: Receives API requests, validates access controls, performs quality checks, routes operations
- **Chunk Metadata Service**: Central registry mapping data to shards; proxy consults this to locate data
- **Sharding**: Thousands of shards with dynamic rebalancing and fine-grained chunk movement control
- **Replication**: Each shard has multiple replicas synchronized via Change Data Capture (CDC)

**Zero-downtime migration protocol** (6 steps):
1. Registration and indexing (target shards build indexes)
2. Bulk import (snapshot and copy data chunks)
3. Async replication (continuously replicate writes from source to target)
4. Correctness verification (point-in-time snapshot comparison)
5. Traffic switchover (block source writes, replicate pending, update metadata -- seconds of downtime)
6. Finalization (mark complete, delete source data)

**Observability stack:**
- Amazon Managed Service for Prometheus (metrics at scale)
- Amazon Managed Grafana (visualization)
- Sharded and tiered storage (hot vs. cold data separation)
- Culture of engineer self-reliance for observability tooling
