# Spotify Architecture Research

**Beads Issue:** hsg-sk08
**Style Guide:** kaleidoscope
**Folder:** architecture/spotify/

## Research Topics

- Event-driven microservices architecture
- Squad/tribe/chapter/guild organizational model
- Backstage developer portal (internal developer platform)
- Audio streaming and content delivery
- Personalization and recommendation (Discover Weekly, Release Radar)
- Data infrastructure (Google Cloud, BigQuery, Dataflow)
- Backend services (originally Java/Python, now polyglot)
- Podcast ingestion and delivery pipeline

## Key Public Sources

- Spotify Engineering blog (engineering.atspotify.com)
- Backstage.io documentation
- Spotify R&D publications
- "Spotify's Event Delivery" talks at QCon

---

## Findings

### 1. Event-Driven Microservices Architecture

Spotify operates **~810+ active microservices** managed by over 90 teams and 600+ developers. Each microservice owns its own database and handles a single domain concern (song retrieval, search, user auth, payments, recommendations, etc.).

**Communication patterns:**
- **gRPC with Protobuf** — the default inter-service protocol, replacing Spotify's earlier proprietary message protocol. Binary serialization makes requests ultrafast between the thousands of backend services.
- **Google Cloud Pub/Sub** — used for asynchronous, non-urgent event processing (e.g., updating play counters, triggering background analytics). Replaced on-premise Apache Kafka for event delivery in 2017.
- **Apache Kafka** — still used in some real-time streaming contexts (e.g., feeding user activity into Taste Profiles continuously).

**Event Delivery Infrastructure (EDI):**
- Originally built on Kafka 0.7 streaming logs to HDFS via Hadoop — Hadoop was a single point of failure.
- Migrated to Google Cloud Pub/Sub (2016–2017), with each Event Type getting its own Pub/Sub topic, ETL process, and final storage location.
- The **Event Service** is the entry point: it parses and recognizes Event Types and publishes them to Cloud Pub/Sub.
- Current scale: **1+ trillion events per day**, **1800+ distinct event types**.
- When teams define event schemas, Kubernetes operators automatically deploy PubSub queues, anonymization pipelines, and streaming jobs.

**Container orchestration:**
- **Kubernetes** manages all microservices. The largest service handles ~10 million requests/second and benefits from autoscaling.
- **Docker** containers are the deployment unit.

**Service discovery:**
- **Nameless** — Spotify's internal service discovery system. Services register with Nameless on startup and become discoverable to receive traffic.

**Internal libraries:**
- **Apollo** — Spotify's open-source Java libraries for writing microservices (HTTP server, URI routing, middleware). Used in production for years.

### 2. Squad / Tribe / Chapter / Guild Organizational Model

Introduced in 2011 by Henrik Kniberg and Anders Ivarsson in the whitepaper "Scaling Agile @ Spotify." This model maps directly to how microservices are owned and operated.

**Squads** (6–12 people):
- The basic unit. Functions like a mini-startup with full autonomy.
- Cross-functional: design, development, testing, and release capabilities.
- Owns one or more microservices end-to-end.
- Has a long-term mission (e.g., "search experience" or "payment processing").

**Tribes** (<100 people):
- A collection of squads grouped by business area (e.g., "mobile player," "content platform," "monetization").
- Has a Tribe Lead who coordinates across squads.
- Size capped at ~100 to maintain communication and cohesion (Dunbar's number).

**Chapters:**
- People with similar skills within the same tribe (e.g., all backend engineers in the mobile player tribe).
- Led by a Chapter Lead who is also a squad member and serves as line manager.
- Enables skill development and consistency within a tribe.

**Guilds:**
- Informal, cross-tribe communities of interest (e.g., AI guild, DevOps guild, testing guild).
- No formal leader — a volunteer Guild Coordinator organizes meetups and knowledge sharing.
- Transcend organizational boundaries to spread practices company-wide.

**Mapping to architecture:** Each squad owns its microservices autonomously, which is why Spotify ended up with 800+ services — organizational structure mirrors system architecture (Conway's Law in action).

### 3. Backstage Developer Portal

Built internally at Spotify to manage the complexity of 800+ microservices across 500+ engineering teams. Open-sourced in 2020, now a CNCF incubating project.

**Three-layer architecture:**
1. **Frontend** — React-based UI built as a tree of extensions. Plugins provide visual components.
2. **Backend** — Node.js backend plugins operating as independent microservices. Provides logging, database access, and extension points.
3. **Database** — PostgreSQL (production) or SQLite (development), accessed via the Knex query builder. Each plugin gets logically separated database connections.

**Core features (delivered as plugins):**

| Feature | Purpose |
|---------|---------|
| **Software Catalog** | Central metadata repository for all software entities (services, APIs, libraries, systems, teams). Entities defined in YAML descriptor files. |
| **Software Templates (Scaffolder)** | Standardized project creation. Templates load code skeletons, inject variables, publish to GitHub/GitLab. |
| **TechDocs** | Docs-like-code: Markdown files stored alongside code, transformed to HTML, rendered and searchable inside Backstage. |
| **Kubernetes plugin** | View pod status, deployments, and logs for cataloged services. |
| **Search** | Unified search across all catalog entities and documentation. |

**Plugin types:**
- **Standalone** — runs entirely in the browser, no API calls.
- **Service backend** — calls internal organizational APIs.
- **Third-party backend** — calls external SaaS APIs via Backstage's proxy (to bypass CORS).

**Caching:** Supports memory (dev), Memcache, Redis, Valkey, and Infinispan via Keyv.

**Commercial offering:** Spotify Portal for Backstage adds no-code setup, service maturity scoring, incident management integration, and advanced analytics.

### 4. Audio Streaming and Content Delivery

Spotify serves 50+ million tracks plus images and assets to 200+ million monthly active users.

**Multi-CDN strategy:**
- **Akamai + AWS CloudFront** — business-critical audio streaming (low latency, high bandwidth).
- **Fastly** — other content (images, client updates, metadata). Uses Varnish Configuration Language (VCL) for intelligent caching and edge logic.

**Audio storage and formats:**
- Multiple quality levels stored per track: **96kbps, 160kbps, 320kbps**.
- Formats: **Ogg Vorbis** (primary) and **AAC**.
- Songs are chunked and compressed, enabling adaptive bitrate streaming based on connection speed and device.
- Origin storage in **AWS S3** and **Google Cloud Storage**.

**Edge and caching:**
- VCL pushes application logic to edge servers (location-based, language-based, device-based personalization).
- Popular content cached at edge servers globally for buffer-free playback.
- **SquadCDN** — Spotify's internal self-service CDN configuration tool combining Fastly APIs with VCL, allowing engineering teams to manage their own CDN rules.

**Adaptive streaming:**
- Dynamic quality selection based on real-time network conditions.
- Edge computing reduces latency by processing requests at the CDN edge rather than routing to origin.

### 5. Personalization and Recommendation

Spotify's recommendation system powers Discover Weekly, Release Radar, Daily Mixes, and Wrapped. It combines three core techniques:

**Collaborative Filtering:**
- Analyzes billions of user-created playlists to find co-occurrence patterns.
- Users with similar listening histories get cross-recommended tracks.
- Matrix factorization models run at massive scale on the data platform.

**Content-Based Filtering (NLP):**
- Powered by **The Echo Nest** (acquired 2014).
- Crawls the web for music-related text (blogs, reviews, social media) and applies NLP to extract semantic features about artists and songs.
- Builds "cultural vectors" representing how people talk about music.

**Audio Analysis (Deep Learning):**
- **Convolutional Neural Networks (CNNs)** with 4 convolutional layers + 3 fully-connected layers analyze raw audio spectrograms.
- Extracts musical features (tempo, key, energy, danceability, acousticness) directly from waveforms.
- Crucial for recommending new/obscure tracks with no listening history (cold start problem).

**Ranking pipeline:**
- ML models (likely Gradient Boosted Decision Trees or neural nets) score each user-song pair.
- Input features: collaborative filtering affinity, audio similarity, NLP similarity, context (time of day, device), global popularity, user behavior history.
- Output: ranked list of candidates for each playlist slot.

**Taste Profiles:**
- Continuously updated via real-time Kafka streams of user listening events.
- Represent each user's musical preferences as a multi-dimensional vector.

### 6. Data Infrastructure

Spotify's data platform handles **1+ trillion events/day** (~70 TB compressed daily).

**Evolution:**
1. **Era 1 (Pre-2016):** On-premise Hadoop cluster (~2,500 nodes, one of Europe's largest). Luigi (Python) for job orchestration. Scalding (Scala/Cascading) for batch. Apache Storm for streaming. Hive for SQL queries. Kafka for event transport. Cassandra for key-value storage.
2. **Era 2 (2016–present):** Full migration to Google Cloud Platform.

**Current GCP stack:**

| Component | Replaces | Purpose |
|-----------|----------|---------|
| **Google Cloud Pub/Sub** | Kafka | Event transport and queuing |
| **Google Cloud Dataflow** | Hadoop MapReduce / Storm | Managed batch + streaming execution |
| **BigQuery** | Hive / HDFS | SQL analytics warehouse |
| **Google Cloud Bigtable** | Cassandra | High-speed key-value lookups |
| **Google Cloud Storage** | HDFS | Object/file storage |
| **Google Cloud Datastore/Spanner** | PostgreSQL (some) | Transactional storage |
| **Google Compute Engine** | On-premise servers | Compute |

**Scio** — Spotify's open-source Scala API for Apache Beam:
- Unified batch + streaming programming model (batch is a special case of streaming).
- Two core primitives: **ParDo** (parallel processing) and **GroupByKey** (shuffle).
- Native connectors for GCS, Pub/Sub, BigQuery, Bigtable, Datastore, Spanner.
- Most data pipelines at Spotify are written in Scio.
- Used for: music recommendations, monetization, artist insights, business analytics, Wrapped.

**Wrapped pipeline (case study):**
- Wrapped 2019 was the largest Dataflow job ever run — 5x larger than 2018 at 75% of the cost.
- Wrapped 2020 introduced **Sort Merge Bucket (SMB) joins** to eliminate expensive shuffles, replacing Bigtable as an intermediate layer.
- Data split across three workstreams: data processing, client/design, and backend systems.

**Data governance:**
- Retention policies, access controls, lineage tracking, and quality checks on all pipeline endpoints.
- Anonymization pipelines with internal key-handling systems for privacy compliance.
- Alerts for data lateness, long-running/failing workflows.
- Backstage integration for resource management and cost analysis.

### 7. Backend Services and Technology Stack

**Languages:**
- **Java** — primary backend language. Spring Framework for RESTful APIs. Apollo libraries for microservices.
- **Python** — data processing, ML pipelines, scripting. Luigi (Python-based workflow orchestrator) was born here.
- **Scala** — Scio data pipelines, some core services.
- **Kotlin, Go** — increasingly adopted for newer services.

**Databases:**
- **Apache Cassandra** — user data (playlists, libraries) — high availability, horizontal scaling.
- **Google Cloud Bigtable** — high-speed lookups (recommendation serving, session data).
- **PostgreSQL** — transactional workloads (payments, subscriptions).
- **Elasticsearch** — search indexing for tracks, artists, albums, podcasts.
- **BigQuery** — analytics and reporting.

**Infrastructure:**
- **Kubernetes** on GCP — orchestrates all microservices.
- **Docker** — container runtime.
- **gRPC + Protobuf** — default service-to-service communication.
- **Google Cloud Pub/Sub** — async messaging.
- **Backstage** — developer portal, service catalog, and documentation hub.

**Observability:**
- Monitoring integrated with Backstage.
- Alerts for service health, data pipeline status, and infrastructure costs.

### 8. Podcast Ingestion and Delivery Pipeline

Spotify's podcast catalog grows by **hundreds of thousands of episodes per day**.

**Ingestion architecture:**
- Central API ingests new episodes and triggers processing via **DAG (directed acyclic graph) logic**.
- Each episode is routed through multiple ML services for enrichment.

**ML processing pipeline:**
- **6+ ML models** running as an ensemble, trained across TensorFlow, PyTorch, Scikit-learn, and Gensim.
- Tasks include: transcription, language detection, sound event detection, topic classification, and preview generation.
- Hardware: **NVIDIA T4 GPUs** (16GB memory per instance) with model swapping via fusion breaks.

**Klio framework:**
- Spotify's open-source audio processing framework built on Apache Beam.
- Supports both batch and streaming pipelines for audio file processing.
- Streaming deployment reduced median preview generation latency from **111.7 minutes to 3.7 minutes** (30x improvement).

**Infrastructure:**
- Runs on **Google Cloud Dataflow** with dynamic autoscaling.
- Dependency management via **Poetry** before Dockerization.
- Fusion breaks optimize GPU usage by loading one model stage at a time.

**Delivery:**
- Processed audio served through the same multi-CDN infrastructure as music (Akamai, AWS, Fastly).
- Multiple quality levels and adaptive streaming for podcast audio.
- Metadata (show descriptions, episode titles, transcripts) stored in the content catalog and indexed in Elasticsearch.
