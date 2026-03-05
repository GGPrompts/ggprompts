# Netflix Architecture Research

**Beads Issue:** hsg-i66u
**Style Guide:** silent-film
**Folder:** architecture/netflix/

## Research Topics

- Microservices architecture (Zuul gateway, Eureka service discovery, Hystrix circuit breaker)
- Content delivery pipeline (encoding, CDN, Open Connect appliances)
- Chaos engineering (Chaos Monkey, Simian Army)
- Data platform (real-time streaming, Apache Kafka, Flink)
- Recommendation engine architecture
- Edge routing and API gateway patterns
- Studio production infrastructure

## Key Public Sources

- Netflix Tech Blog (netflixtechblog.com)
- Netflix OSS GitHub repositories
- QCon / InfoQ conference talks
- "Mastering Chaos" talk by Josh Evans

---

## Findings

### 1. Overall Architecture & Cloud Infrastructure

Netflix runs a cloud-native microservices architecture on **Amazon Web Services (AWS)** across multiple regions. The full AWS migration completed in **2016**. The system is composed of **over 1,000 loosely coupled microservices**, each responsible for a specific domain function.

**Key infrastructure layers:**
- **Control Plane** (AWS): All backend services — user authentication, API routing, recommendation, billing, content metadata, A/B testing, analytics
- **Data Plane** (Open Connect CDN): All video streaming delivery — content cached on appliances deployed inside ISP networks worldwide

**Core data stores:**
- **Apache Cassandra** — Primary distributed database for scale-out workloads (viewing history, user profiles, bookmarks)
- **EVCache** — Netflix's custom caching layer built on **Memcached**; stores session metadata, watch history, personalized recommendations. Maintains 3 full data copies across AWS Availability Zones
- **MySQL** — Used for billing, account data, and transactional workloads
- **CockroachDB** — Adopted for some globally consistent transactional needs
- **Amazon S3** — Object storage for encoded video assets, logs, analytics data

**Container platform — Titus:**
- Built on **Apache Mesos** with **Docker** containers running on **EC2** instances
- **Titus Master**: Replicated, leader-elected scheduler (Zookeeper for election, Cassandra for persistence); handles placement of containers onto agent pool
- **Titus Agents**: EC2 VMs that set up networking/storage and run Docker containers
- Scale: launches up to **500,000 containers** and **200,000 clusters per day** across tens of thousands of EC2 VMs in seven regionally isolated stacks

**Continuous delivery — Spinnaker:**
- Open-source multi-cloud CD platform built by Netflix
- Pipelines composed of **Stages** (which decompose into **Tasks**); stages can run in parallel or serially
- Key abstractions: **Server Groups** (load-balanced, fault-tolerant microservice unit), **Clusters** (logical grouping of server groups), **Applications** (logical grouping of clusters)
- Supports deployment strategies: **blue/green**, **highlander**, and **canary** deploys
- Triggers: Jenkins jobs, cron, manual, or other pipeline completions
- Multi-cloud: AWS EC2, Kubernetes, GCE, GKE, Azure, Cloud Foundry, Oracle Cloud

---

### 2. Microservices Architecture — Edge & Service Mesh

#### Zuul — API Gateway / Edge Service

Zuul is the **front door for all requests** from devices and web applications to Netflix's backend. It is a JVM-based L7 application gateway.

**Filter-based architecture:**
- Core logic runs through a chain of **Filters** — simple pass/fail tests applied to each request
- Filter types: **pre-routing** (authentication, rate limiting, routing decisions), **routing** (forwarding to origin), **post-routing** (response decoration, metrics), **error** (exception handling)
- Filters can be loaded and updated **dynamically at runtime** without redeployment

**Zuul 2:**
- Re-architected on **Netty** for **asynchronous, non-blocking I/O**
- Supports **persistent connections** (WebSockets, SSE) at high scale
- Handles: dynamic routing, monitoring, security, resiliency, load balancing, connection pooling, GZip compression

**Integration with other Netflix OSS:**
- Uses **Ribbon** for client-side load balancing to locate upstream instances
- Uses **Eureka** for service discovery to find available instances
- All requests wrapped in **Hystrix** commands so failures appear in Hystrix metrics

#### Eureka — Service Discovery

- Server-client architecture where the **Eureka Server** is a registry; microservices self-register on startup
- Servers can be configured for **high availability** by replicating registered service state to peer servers
- Clients query Eureka to locate and consume services, enabling location-transparent communication

#### Hystrix — Circuit Breaker

- **Latency and fault tolerance library** that isolates points of access to remote systems
- Implements the **circuit breaker pattern**: when failure rate exceeds threshold, circuit opens and requests are short-circuited (fail fast) instead of waiting/cascading
- Provides **fallback mechanisms** — degraded responses when upstream services fail
- Exposes real-time metrics streams for monitoring dashboards (Hystrix Dashboard + **Turbine** for aggregation)
- Once the circuit is open, the proxy will not try to contact the failing service, preventing cascading failures

#### Ribbon — Client-Side Load Balancer

- Works with Eureka to distribute requests across healthy instances
- Supports multiple load-balancing strategies (round-robin, weighted, availability filtering)

---

### 3. Content Delivery Pipeline — Open Connect CDN

Netflix built its own purpose-built CDN called **Open Connect**, responsible for serving **100% of Netflix's video traffic**.

#### Open Connect Appliances (OCAs)

- Specialized caching servers containing **high-capacity storage** (100+ TB SSDs) and optimized network stacks
- Deployed **inside ISP networks** (embedded deployments) and at **major Internet Exchange Points** (IXP peering sites)
- Netflix provides OCAs **free of charge** to qualifying ISPs
- ~95% of Netflix traffic globally delivered via direct connections between OCAs and residential ISPs

#### Content Flow

1. **Ingest**: Source media files received from studios/partners, validated for quality and format
2. **Processing (Encoding)**: Source split into chunks, encoded in parallel across **hundreds of EC2 instances**
   - Uses **VMAF** (Video Multimethod Assessment Fusion) for perceptual quality measurement
   - **Per-title encoding optimization**: each title analyzed for complexity; custom encoding ladder generated
   - Multiple resolutions, bitrates, codecs (H.264, H.265/HEVC, VP9, AV1) produced
   - Reduces bandwidth by up to **40%** without sacrificing perceptual quality
3. **Distribution**: Encoded assets pushed to OCAs during **off-peak fill windows**
4. **Playback**: Client receives a **manifest** listing available streams; Netflix **steering service** directs client to the most optimal OCA based on file availability, health, and network proximity

#### Control Plane vs Data Plane Separation

- **Control plane** (AWS): Steering logic, OCA health monitoring, fill scheduling, manifest generation
- **Data plane** (OCAs): Serve video bits directly to clients with minimal latency

---

### 4. Chaos Engineering — Chaos Monkey & Simian Army

Netflix pioneered **chaos engineering** — the discipline of experimenting on distributed systems to build confidence in their ability to withstand turbulent conditions.

#### Origin Story

After a **three-day outage in August 2008** caused by a major database corruption in their monolithic architecture, Netflix migrated to AWS microservices. The core insight: "the best way to avoid failure is to fail constantly."

#### Chaos Monkey

- Randomly **terminates production instances** to ensure services tolerate instance failures
- Runs via **Spinnaker** (required dependency since Chaos Monkey 2.0, released 2016)
- Scheduling based on **mean time between terminations** (not probabilistic)
- **Trackers**: Go objects that report terminations to external services
- Open-sourced under Apache 2.0 in 2012

#### Simian Army Tools

| Tool | Function |
|------|----------|
| **Chaos Monkey** | Randomly terminates instances |
| **Latency Monkey** | Injects artificial delays in RESTful communication to simulate degradation |
| **Conformity Monkey** | Finds instances not adhering to best practices, shuts them down |
| **Doctor Monkey** | Health-checks instances (CPU, memory); removes unhealthy ones from service |
| **Janitor Monkey** | Identifies and cleans up unused resources (replaced by **Swabbie**) |
| **Security Monkey** | Detects security vulnerabilities and policy violations |
| **Chaos Gorilla** | Simulates outage of an entire **AWS Availability Zone** |
| **Chaos Kong** | Simulates loss of an entire **AWS Region** |

#### Failure Injection Testing (FIT)

- Introduced October 2014 for **more precise failure injection** than Simian Army tools
- Works by pushing failure simulation metadata to **Zuul** edge gateway
- Zuul filters apply injected failure to matching requests
- Allows specific teams to perform targeted chaos experiments with fine-grained control over scope
- Built by Netflix engineers including Gremlin co-founder Kolton Andrus

#### Current Status

- Original Simian Army project **no longer actively maintained**
- Chaos Monkey continues as standalone service
- Conformity Monkey folded into Spinnaker backend
- Janitor Monkey replaced by **Swabbie**

---

### 5. Data Platform — Keystone, Kafka, Flink

Netflix processes **2+ trillion events per day** through its real-time data infrastructure.

#### Keystone Pipeline

The **Keystone Stream Processing Platform** is Netflix's data backbone — a petabyte-scale real-time event streaming and processing system.

**Two core services:**
1. **Routing Service** — Moves data from fronting Kafka to sinks: **S3**, **Elasticsearch**, and secondary Kafka topics. Separate routing jobs per sink for fault isolation.
2. **Messaging Service** — Kafka-based; responsible for producing, collecting, and transporting microservice events

**Scale:**
- ~**3 PB incoming** and ~**7 PB outgoing** data daily
- **100+ Kafka clusters**
- **At-least-once, out-of-order delivery** with <0.01% drop rate per day
- Independent Flink processing jobs per stream

#### Apache Kafka

- Central **message bus** for all event ingestion and transport
- Member actions in the Netflix app publish through API Gateway to Kafka topics
- Downstream processors (Flink jobs, batch ETL) consume from Kafka
- **Thousands of Kafka topics** across the organization

#### Apache Flink

- Chosen for strong **near-real-time event processing** capabilities
- **20,000+ Flink jobs** in production
- **1:1 mapping** from Kafka source topic to consuming Flink job (simpler maintenance/tuning)
- Flink processors apply filtering, projections, enrichment, and aggregation

#### Data Mesh & Streaming SQL

- Netflix introduced **Streaming SQL** in their Data Mesh, wrapping Flink's DataStream API behind standard SQL
- **1,200 SQL processors** created within one year of launch by non-infrastructure teams
- Democratized real-time data processing across the organization

#### Four Innovation Phases

1. **Batch ETL** — Traditional Hadoop/Hive batch processing
2. **Keystone Pipeline** — Real-time event routing with Kafka
3. **Stream Processing as a Service (SPaaS)** — Managed Flink jobs with self-service UI
4. **Data Mesh with Streaming SQL** — Federated ownership, SQL abstraction over Flink

---

### 6. Recommendation Engine Architecture

Netflix's recommendation system drives **75-80% of all viewing hours** and saves an estimated **$1 billion/year** in subscriber retention.

#### Three Computation Modes

| Mode | Latency | Data Freshness | Complexity | Use Case |
|------|---------|---------------|------------|----------|
| **Offline** | Hours | Stale between updates | Unlimited | Model training, batch feature engineering, large-scale matrix factorization |
| **Nearline** | Seconds-minutes | Near-real-time | Moderate | Incremental model updates, event-driven re-ranking based on recent actions |
| **Online** | Milliseconds | Real-time | Limited by latency budget | Live recommendation serving, blending precomputed results with real-time signals |

#### Manhattan Framework

- Netflix's internal **distributed computation framework** for near-real-time event flow
- Central to the algorithmic architecture — manages the nearline computation layer
- Processes user events (plays, ratings, searches, scrolls) and triggers model updates

#### Data Flow

1. User actions captured on device → sent to **API Gateway**
2. Events published to **Kafka** topics
3. **Offline**: Large datasets processed on AWS (Spark/Hadoop) to train ML models; results stored in **S3** and loaded into **Cassandra/EVCache**
4. **Nearline**: Manhattan consumes Kafka events, updates intermediate results in **Cassandra** and **EVCache**
5. **Online**: When user opens Netflix, online service blends precomputed offline/nearline results with real-time context (time of day, device, recent activity) and serves recommendations

#### ML Approaches

- **Ensemble methods**: Combines collaborative filtering, content-based filtering, deep neural networks, and graph-based models
- **Multi-task learning ("Hydra")**: Single models handle homepage ranking, search ordering, and notification personalization simultaneously
- **Contextual bandits**: Explore/exploit strategies for artwork personalization
- **A/B testing platform**: Every algorithm change tested on live traffic before full rollout

#### Intermediate Storage

- **Cassandra**: Offline/nearline computed features and model outputs
- **EVCache**: Hot recommendation results for low-latency online serving
- **MySQL**: Metadata and configuration

---

### 7. Studio Production Infrastructure — Cosmos Platform

Netflix built the **Cosmos** platform for media processing — combining microservices, asynchronous workflows, and serverless functions.

#### Three Subsystems

| Subsystem | Role | Details |
|-----------|------|---------|
| **Optimus** | API Layer | Maps external requests to internal business models; the entry point for all media processing requests |
| **Plato** | Workflow Orchestration | Forward-chaining rule engine for domain logic; supports DAG-based workflows. Orchestrates stateless functions and services. Handles workflows lasting minutes to years |
| **Stratum** | Serverless Compute | Generates strongly-typed RPC clients; runs stateless, compute-intensive functions (encoding, quality analysis, etc.) |

#### Communication

- All three subsystems communicate **asynchronously** via **Timestone**, a high-scale, low-latency priority queuing system
- Programming model: "microservices that trigger workflows that orchestrate serverless functions"

#### Media Processing Pipeline

1. **Ingest**: Receive source media from studios/partners via Optimus API
2. **Workflow**: Plato decomposes the job into a DAG of tasks (transcode, quality check, subtitle extraction, audio normalization)
3. **Compute**: Stratum serverless functions execute each task on elastic EC2 capacity
4. **Quality**: VMAF scores computed for every encoded variant
5. **Output**: Final assets delivered to Open Connect CDN for distribution

#### Migration Strategy

- Development started **2018**, production use since **2019**
- Used **"strangler fig" pattern**: Cosmos grew around the legacy system (Reloaded), gradually replacing it
- Now powers **~40 services** for media processing

#### Video Encoding Service (VES)

- A Cosmos microservice specifically for video encoding
- Per-title optimization: analyzes content complexity to generate custom encoding ladders
- Parallel chunk encoding across hundreds of EC2 instances
- Multiple codec support: H.264, H.265/HEVC, VP9, AV1

---

### 8. Architectural Patterns & Cross-Cutting Concerns

#### Key Patterns Used

- **Circuit Breaker** (Hystrix): Prevent cascading failures
- **Service Discovery** (Eureka): Location-transparent service communication
- **API Gateway** (Zuul): Single entry point with dynamic routing filters
- **Client-Side Load Balancing** (Ribbon): Distribute load across instances
- **Bulkhead Isolation**: Thread pool isolation per dependency (Hystrix)
- **Strangler Fig**: Incremental migration from monolith/legacy to new architecture
- **Event Sourcing / CQRS**: Kafka as event log; separate read/write paths
- **Control Plane / Data Plane Separation**: AWS for logic, Open Connect for data delivery

#### Deployment & Operations

- **Spinnaker** for CD pipelines with canary analysis
- **Titus** for container orchestration on EC2
- **Chaos Engineering** (FIT + Chaos Monkey) for resilience validation
- **Atlas** — Netflix's telemetry platform for metrics collection and alerting
- **Mantis** — Real-time stream processing platform for operational insights

#### Technology Stack Summary

| Layer | Technologies |
|-------|-------------|
| Edge / Gateway | Zuul 2 (Netty), Ribbon, Eureka |
| Microservices | Java, Spring Boot, gRPC |
| Containers | Titus (Mesos + Docker on EC2) |
| Databases | Cassandra, CockroachDB, MySQL |
| Caching | EVCache (Memcached) |
| Messaging | Apache Kafka (100+ clusters) |
| Stream Processing | Apache Flink (20,000+ jobs) |
| Batch Processing | Apache Spark, Hadoop/Hive |
| Object Storage | Amazon S3 |
| CDN | Open Connect (custom OCAs) |
| CI/CD | Spinnaker, Jenkins |
| Chaos | Chaos Monkey, FIT, Simian Army |
| Media Processing | Cosmos (Optimus + Plato + Stratum) |
| ML/Recommendations | Manhattan, collaborative filtering, deep learning, Hydra |
| Monitoring | Atlas (metrics), Mantis (real-time ops) |
