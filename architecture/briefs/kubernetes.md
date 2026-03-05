# Kubernetes Architecture Research

**Beads Issue:** hsg-xth1
**Style Guide:** topographic-map
**Folder:** architecture/kubernetes/

## Research Topics

- Control plane (kube-apiserver, etcd, kube-scheduler, kube-controller-manager)
- Data plane (kubelet, kube-proxy, container runtime)
- CRI/CNI/CSI plugin interfaces
- Pod lifecycle and scheduling
- Service mesh and networking model (ClusterIP, NodePort, LoadBalancer, Ingress)
- RBAC and admission controllers
- Operator pattern and CRDs
- etcd consensus and state management

## Key Public Sources

- kubernetes.io official architecture docs
- Kubernetes GitHub design proposals
- CNCF end-user case studies
- Kelsey Hightower talks and demos

## Findings

### Control Plane Architecture

The control plane is the brain of a Kubernetes cluster. It maintains the desired state and makes all scheduling/orchestration decisions. In production, control plane components typically run across multiple nodes for high availability.

**kube-apiserver** — The front door to the entire cluster. Every interaction (kubectl, controllers, kubelets) goes through the API server's RESTful HTTP API. It validates and processes requests, serves as the single point of communication between all components, and is the only component that talks directly to etcd. It can be scaled horizontally — multiple instances run behind a load balancer.

**etcd** — A distributed key-value store (written in Go) that serves as the cluster's single source of truth. Every Kubernetes object (Pod, Deployment, Service, ConfigMap, Secret) is persisted as a key-value entry in etcd. Uses the Raft consensus algorithm for strong consistency across replicas (see etcd section below). Only kube-apiserver reads/writes to etcd directly.

**kube-scheduler** — Watches for newly created Pods with no assigned node. Runs a two-phase algorithm: (1) **Filtering** — eliminates nodes that cannot run the Pod (insufficient resources, taints, affinity rules), then (2) **Scoring** — ranks remaining nodes by fitness (resource balance, topology spread, etc.). The highest-scoring node wins. Supports a pluggable scheduling framework with extension points: PreEnqueue, QueueSort, PreFilter, Filter, PostFilter, PreScore, Score, NormalizeScore, Reserve, Permit, PreBind, Bind, PostBind.

**kube-controller-manager** — A single binary that bundles dozens of independent control loops. Each controller watches a specific resource type via the API server and reconciles actual state toward desired state. Key controllers include:
- **ReplicaSet controller** — ensures the correct number of Pod replicas
- **Deployment controller** — manages rollouts and rollbacks
- **StatefulSet controller** — ordered deployment with stable identities
- **Job / CronJob controller** — run-to-completion and scheduled workloads
- **Node controller** — monitors node health, marks unreachable nodes
- **Service controller** — manages cloud load balancers
- **Endpoint / EndpointSlice controller** — populates service backends
- **Namespace controller** — cleans up resources in deleted namespaces
- **ServiceAccount controller** — creates default service accounts

**cloud-controller-manager** (optional) — Decouples cloud-provider-specific logic from the core controllers. Manages cloud load balancers, node lifecycle (instance metadata), and routes. Implementations exist for AWS, Azure, GCP, and others.

#### API Request Lifecycle

Every request to the cluster follows this pipeline:

```
Client (kubectl / controller / kubelet)
  → TLS termination
  → Authentication (client certs, bearer tokens, OIDC, ServiceAccount tokens)
  → Authorization (RBAC, ABAC, Webhook, Node)
  → Mutating Admission Webhooks (can modify the object)
  → Object Schema Validation
  → Validating Admission Webhooks (accept/reject only)
  → Persistence to etcd
  → Response to client
```

### Data Plane (Node Components)

Each worker node runs three components that execute and network the actual workloads:

**kubelet** — The primary node agent. Receives PodSpecs from the API server (via watch), ensures containers described in those specs are running and healthy. Communicates with the container runtime via the CRI gRPC interface. Reports node status and Pod status back to the API server. Handles volume mounts, liveness/readiness probes, resource monitoring, and Pod eviction under pressure (disk, memory, PID).

**kube-proxy** — Runs on every node and implements the Kubernetes Service abstraction. Maintains network rules (iptables or IPVS) that route traffic destined for a Service's ClusterIP to the correct backend Pods. Supports three modes:
- **iptables mode** (default) — installs iptables rules for random backend selection
- **IPVS mode** — uses Linux IPVS for higher performance and more load-balancing algorithms (round-robin, least connections, source hashing, etc.)
- **nftables mode** — newer alternative using nftables

**Container Runtime** — The software that actually pulls images, creates containers, and manages their lifecycle. Must implement the Container Runtime Interface (CRI). Main runtimes:
- **containerd** — graduated CNCF project, most widely used, default in most distributions
- **CRI-O** — lightweight runtime purpose-built for Kubernetes, common in OpenShift
- Both use **runc** (OCI-compliant) as the low-level runtime by default, but can swap in sandboxed runtimes like **gVisor (runsc)** or **Kata Containers** for stronger isolation

### CRI / CNI / CSI Plugin Interfaces

Kubernetes uses three standardized plugin interfaces to decouple core logic from runtime, networking, and storage implementations:

**Container Runtime Interface (CRI)** — gRPC protocol between kubelet and container runtimes. Defines two services: RuntimeService (Pod sandbox lifecycle, container lifecycle, exec, attach, port-forward) and ImageService (pull, list, remove images). Introduced to replace the original Docker-specific code path. Kubelet talks CRI; the runtime translates to OCI specs.

**Container Network Interface (CNI)** — Specification for configuring Pod networking. Kubelet reads CNI config from `/etc/cni/net.d/` and invokes CNI plugins when Pods start/stop. The call chain is: `kubelet → CRI runtime → CNI plugin`. Responsibilities: assign Pod IP addresses, configure routes, set up network namespaces. Popular CNI plugins:
- **Calico** — BGP-based routing, network policy enforcement, eBPF dataplane option
- **Cilium** — eBPF-native networking and security, identity-based policy, built-in observability (Hubble)
- **Flannel** — simple VXLAN overlay, no network policy support
- **Weave Net** — encrypted mesh overlay
- **AWS VPC CNI** — assigns real VPC IPs to Pods for native cloud networking

**Container Storage Interface (CSI)** — Standardized interface for storage vendors to expose block and file storage to Kubernetes without modifying core code. Replaces the older in-tree volume plugins. Architecture involves three components:
- **CSI Controller** (Deployment) — handles provisioning, attach/detach, snapshots
- **CSI Node plugin** (DaemonSet) — runs on each node, handles mount/unmount
- **External provisioner/attacher sidecars** — Kubernetes-provided helper containers that watch PVC/PV objects and call CSI driver operations
- Popular drivers: AWS EBS CSI, GCE PD CSI, Azure Disk CSI, Portworx, Rook-Ceph, Longhorn

### Pod Lifecycle and Scheduling

#### Pod Phases

Pods move through defined phases:
1. **Pending** — accepted by the cluster but not yet scheduled or images not yet pulled
2. **Running** — bound to a node, at least one container running
3. **Succeeded** — all containers terminated with exit code 0
4. **Failed** — all containers terminated, at least one with non-zero exit
5. **Unknown** — Pod status cannot be determined (usually node communication failure)

#### Scheduling Deep Dive

When a new Pod is created:
1. API server persists it to etcd with `nodeName` empty
2. Scheduler detects the unscheduled Pod via its watch
3. **Scheduling Cycle** (serial per Pod):
   - **PreFilter** — compute aggregate info (e.g., Pod affinity topology)
   - **Filter** — eliminate infeasible nodes (resource fit, taints/tolerations, node selectors, affinity/anti-affinity, PV node affinity)
   - **PostFilter** — if no nodes pass filtering, attempt preemption (evict lower-priority Pods)
   - **PreScore** — compute shared data for scoring plugins
   - **Score** — rank surviving nodes (balanced resource allocation, topology spread, image locality)
   - **NormalizeScore** — normalize scores to comparable ranges
   - **Reserve** — tentatively claim resources (prevents races)
   - **Permit** — gate for gang scheduling; hold Pod until group is ready
4. **Binding Cycle** (can run concurrently):
   - **PreBind** — e.g., mount required volumes
   - **Bind** — update Pod's `nodeName` in etcd via API server
   - **PostBind** — cleanup, logging

#### Scheduling Constraints

Users influence scheduling through:
- **nodeSelector** — simple label matching
- **Node/Pod affinity/anti-affinity** — expressive rules (required vs. preferred)
- **Taints and tolerations** — nodes repel Pods unless tolerated
- **Topology spread constraints** — distribute Pods across zones/nodes
- **Priority and preemption** — higher-priority Pods can evict lower-priority ones
- **Resource requests/limits** — CPU, memory, GPU, ephemeral storage

### Networking Model and Service Types

#### Fundamental Networking Rules

Kubernetes enforces a flat network model:
- Every Pod gets a unique cluster-wide IP address
- Pods can communicate with any other Pod without NAT
- Containers within a Pod share the network namespace (communicate via localhost)
- Agents on a node (kubelet, kube-proxy) can communicate with all Pods on that node

#### Service Types

**ClusterIP** (default) — Assigns a virtual IP reachable only within the cluster. kube-proxy programs iptables/IPVS rules to load-balance traffic across backend Pods. Used for internal service-to-service communication.

**NodePort** — Extends ClusterIP by opening a static port (30000-32767) on every node's IP. External traffic to `<NodeIP>:<NodePort>` is forwarded to the Service. Typically used for development or on-premises setups.

**LoadBalancer** — Extends NodePort by provisioning an external load balancer via the cloud-controller-manager. The cloud LB distributes traffic to NodePorts. Each Service gets its own external IP.

**ExternalName** — Maps a Service to a DNS CNAME record (no proxying). Used to alias external services.

**Headless Service** (ClusterIP: None) — No virtual IP assigned. DNS returns Pod IPs directly. Used for StatefulSets and service discovery where clients need to connect to specific Pods.

#### EndpointSlices

Modern replacement for the Endpoints API. Each EndpointSlice holds up to 100 endpoints, enabling efficient updates in large clusters. The EndpointSlice controller watches Pods and Services, keeping backend lists current.

#### Ingress and Gateway API

**Ingress** — L7 (HTTP/HTTPS) traffic routing resource. Defines rules mapping hostnames/paths to backend Services. Requires an Ingress controller (NGINX, Traefik, HAProxy, Contour, etc.) deployed as a Pod in the cluster. Limitations: HTTP-only, limited expressiveness, single resource type.

**Gateway API** (successor to Ingress) — Richer, role-oriented model with three main resources:
- **GatewayClass** — defines the infrastructure provider (like StorageClass for storage)
- **Gateway** — configures and deploys the actual proxy (listeners, protocols, TLS)
- **HTTPRoute / TCPRoute / GRPCRoute** — route definitions attached to a Gateway
- Separates concerns: cluster operators manage GatewayClass and Gateway; developers manage Routes
- Supports TCP, UDP, gRPC, TLS passthrough, traffic splitting, header-based routing
- Implementations: Envoy Gateway, Istio, Cilium, Kong, Contour

#### Service Mesh

Service meshes handle east-west (service-to-service) traffic with:
- **Mutual TLS (mTLS)** — automatic encryption and identity between services
- **Traffic management** — retries, timeouts, circuit breaking, canary deployments
- **Observability** — distributed tracing, metrics, access logs
- **Policy** — rate limiting, authorization policies

**Istio** — Most widely adopted service mesh. Historically used Envoy sidecar proxies injected into every Pod. The control plane (istiod) configures all sidecars via xDS API. **Ambient mode** (GA since Istio 1.24) eliminates sidecars in favor of per-node ztunnel proxies (L4) and optional per-service waypoint proxies (L7), reducing resource overhead.

**Cilium** — eBPF-based mesh that avoids sidecar proxies entirely. Uses kernel-level packet processing for networking, security, and observability. Provides native support for Gateway API and NetworkPolicy.

#### Network Policy

Kubernetes-native L3/L4 firewall rules. Define allowed ingress/egress traffic per Pod using label selectors, namespace selectors, IP blocks, and port rules. Enforcement requires a CNI plugin that supports NetworkPolicy (Calico, Cilium, Weave Net — Flannel does not).

### RBAC and Admission Controllers

#### RBAC (Role-Based Access Control)

Uses the `rbac.authorization.k8s.io` API group. Four resource types:

| Resource | Scope | Purpose |
|----------|-------|---------|
| **Role** | Namespace | Grants permissions within one namespace |
| **ClusterRole** | Cluster | Grants permissions cluster-wide or on non-namespaced resources |
| **RoleBinding** | Namespace | Binds a Role or ClusterRole to subjects in one namespace |
| **ClusterRoleBinding** | Cluster | Binds a ClusterRole to subjects across all namespaces |

**Subjects** can be Users, Groups, or ServiceAccounts. **Rules** specify apiGroups, resources, and verbs (get, list, watch, create, update, patch, delete). Permissions are purely additive — there are no deny rules. Privilege escalation prevention: users cannot grant permissions they don't already have.

Built-in ClusterRoles: `cluster-admin` (superuser), `admin`, `edit`, `view` — aggregated via labels so extensions can contribute additional permissions.

#### Admission Controllers

Intercept API requests after authentication and authorization, before persistence. Compiled into kube-apiserver. Two dynamic extension mechanisms:

**MutatingAdmissionWebhook** — Called first. External HTTPS endpoints receive AdmissionReview requests and can modify the object (inject sidecars, add labels, set defaults). Called serially; each webhook sees the modifications of the previous one.

**ValidatingAdmissionWebhook** — Called second. Can accept or reject but cannot modify. Called in parallel for speed.

**ValidatingAdmissionPolicy** (GA in K8s 1.30) — In-process validation using CEL (Common Expression Language) expressions. No external webhook needed, lower latency, easier to audit.

Common built-in admission controllers:
- **LimitRanger** — enforces default resource requests/limits
- **ResourceQuota** — enforces namespace resource quotas
- **PodSecurity** — enforces Pod Security Standards (privileged, baseline, restricted)
- **NamespaceLifecycle** — prevents operations in terminating namespaces
- **ServiceAccount** — auto-mounts service account tokens
- **DefaultStorageClass** — assigns default StorageClass to PVCs

### Operator Pattern and CRDs

#### Custom Resource Definitions (CRDs)

CRDs extend the Kubernetes API with new resource types without modifying core code. When you create a CRD, the API server dynamically serves a new RESTful endpoint. Custom resources support:
- Standard CRUD via kubectl and client libraries
- Watch/list with label selectors
- OpenAPI v3 schema validation
- Status and scale subresources
- Conversion webhooks for multi-version support
- Categories and short names

#### The Operator Pattern

Formula: **Operator = CRD + Custom Controller + Domain Knowledge**

The controller runs the reconciliation loop:
```
Watch for changes to custom resource
  → Compare desired state (spec) with actual state
  → Take corrective action (create Pods, update configs, run migrations)
  → Update status subresource
  → Repeat
```

Operators encode human operational knowledge — how to deploy, scale, backup, restore, upgrade, and recover complex stateful applications. The controller is level-triggered (responds to current state, not events), making reconciliation idempotent and self-healing.

**Common use cases**: databases (PostgreSQL Operator, MySQL Operator), message queues (Strimzi for Kafka), monitoring (Prometheus Operator), certificates (cert-manager), GitOps (Argo CD, Flux).

**Frameworks for building operators**:
- **Kubebuilder** (Go) — official Kubernetes SIG project, scaffold-based
- **Operator SDK** (Go, Ansible, Helm) — Red Hat project, includes OLM for lifecycle management
- **kube-rs** (Rust) — high-performance Rust framework
- **Kopf** (Python) — Pythonic operator framework
- **Metacontroller** — declarative operators via webhooks (any language)

#### Operator Capability Levels (Operator Framework maturity model):
1. **Basic Install** — automated deployment
2. **Seamless Upgrades** — patch and minor version upgrades
3. **Full Lifecycle** — backup, restore, failure recovery
4. **Deep Insights** — metrics, alerts, log processing
5. **Auto Pilot** — auto-scaling, auto-tuning, anomaly detection

### etcd Consensus and State Management

#### Architecture

etcd is a distributed, strongly consistent key-value store. Typical production deployment: 3 or 5 member cluster (odd number for quorum). Written in Go, uses gRPC for client and peer communication.

**Key properties**:
- **Strongly consistent** — linearizable reads and writes via Raft
- **Watch support** — clients subscribe to key change notifications (powers all Kubernetes controllers)
- **MVCC (Multi-Version Concurrency Control)** — maintains revision history, enabling consistent snapshots and watch resumption
- **Lease system** — TTL-based key expiration, used for leader election and distributed locking
- **Compact prefix key space** — keys organized hierarchically (e.g., `/registry/pods/default/my-pod`)

#### Raft Consensus Protocol

Raft ensures all etcd members agree on the same sequence of state changes:

**Leader Election**:
- One member is elected leader; others are followers
- Leader sends periodic heartbeats; if followers don't hear from the leader within a randomized timeout, they start an election
- Candidate requests votes; majority wins
- Only the leader handles write requests

**Log Replication**:
1. Client sends write to leader
2. Leader appends entry to its log
3. Leader replicates entry to all followers
4. When a majority (quorum) acknowledges, entry is committed
5. Leader applies entry to its state machine and responds to client
6. Followers apply committed entries to their state machines

**Quorum**: requires `(n/2) + 1` members to agree. 3-member cluster tolerates 1 failure; 5-member cluster tolerates 2 failures.

**Safety guarantees**: once an entry is committed, it will not be lost even if leaders fail. New leaders always have all committed entries (election restriction).

#### Kubernetes-Specific etcd Patterns

- **API server is the sole client** — all other components read/write cluster state through the API server, never directly to etcd
- **Watch-based architecture** — controllers establish long-lived watches on the API server, which maps to etcd watches. This event-driven model avoids polling and enables near-real-time reconciliation
- **Resource versioning** — every Kubernetes object carries a `resourceVersion` (mapped to etcd's mod_revision). Used for optimistic concurrency (conflict detection on updates) and watch resumption
- **Key layout**: `/registry/<resource-type>/<namespace>/<name>` for namespaced resources
- **Compaction** — old revisions are periodically compacted to reclaim storage. The API server configures the compaction interval
- **Snapshots** — periodic snapshots enable backup/restore of entire cluster state
- **Performance considerations**: etcd is sensitive to disk I/O latency. SSDs are strongly recommended. Large clusters (>1000 nodes) may need tuning (heartbeat interval, election timeout, snapshot count)

### High Availability Patterns

#### Control Plane HA
- Multiple API server instances behind a load balancer
- etcd cluster with 3 or 5 members across failure domains
- Leader-elected scheduler and controller-manager (only one active, others on standby via lease-based election through the API server)
- Spread control plane nodes across availability zones

#### Data Plane HA
- Pod disruption budgets (PDBs) — guarantee minimum available replicas during voluntary disruptions
- Topology spread constraints — distribute Pods across zones/nodes
- Pod anti-affinity — prevent co-location of critical replicas
- Horizontal Pod Autoscaler (HPA) — scale based on CPU, memory, or custom metrics
- Cluster Autoscaler — add/remove nodes based on pending Pods and utilization
