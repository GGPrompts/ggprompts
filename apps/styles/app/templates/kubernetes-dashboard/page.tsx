"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Server,
  Box,
  Activity,
  Cpu,
  HardDrive,
  Network,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  PlayCircle,
  PauseCircle,
  RefreshCw,
  Shield,
  Database,
  Globe,
  Terminal,
  Layers,
  Package,
  Settings,
  TrendingUp,
  TrendingDown,
  BarChart3,
  AlertCircle,
  Info,
  Zap,
  FileText,
  ChevronRight,
  Search,
  Filter,
  Download,
  Eye,
  ExternalLink,
  GitBranch,
  Lock,
  Unlock,
  User,
  Users,
} from "lucide-react"
import { Button, Card, Badge, Progress, Tabs, TabsContent, TabsList, TabsTrigger, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, ScrollArea, Separator } from "@ggprompts/ui"
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type ClusterHealth = "Healthy" | "Degraded" | "Critical"
type NodeStatus = "Ready" | "NotReady" | "Unknown"
type NodeRole = "control-plane" | "worker"
type PodStatus = "Running" | "Pending" | "Failed" | "CrashLoopBackOff" | "Succeeded" | "Unknown"
type PodPhase = "Pending" | "Running" | "Succeeded" | "Failed" | "Unknown"
type ServiceType = "ClusterIP" | "NodePort" | "LoadBalancer" | "ExternalName"
type EventSeverity = "Normal" | "Warning" | "Error"
type PodSecurityStandard = "Privileged" | "Baseline" | "Restricted"

interface Cluster {
  name: string
  version: string
  health: ClusterHealth
  nodes: number
  pods: number
  services: number
  deployments: number
  cpu: {
    used: number
    total: number
  }
  memory: {
    used: number
    total: number
  }
  network: {
    in: number
    out: number
  }
  disk: {
    used: number
    total: number
  }
  uptime: string
}

interface Node {
  name: string
  status: NodeStatus
  role: NodeRole
  cpu: {
    usage: number
    capacity: number
    requests: number
    limits: number
  }
  memory: {
    usage: number
    capacity: number
    requests: number
    limits: number
  }
  disk: {
    usage: number
    capacity: number
  }
  podCount: number
  podCapacity: number
  age: string
  version: string
  internalIP: string
  osImage: string
  kernelVersion: string
  containerRuntime: string
  labels: Record<string, string>
  taints: Array<{ key: string; effect: string }>
  conditions: Array<{ type: string; status: string }>
  metrics: Array<{ time: number; cpu: number; memory: number }>
}

interface Pod {
  name: string
  namespace: string
  status: PodStatus
  phase: PodPhase
  restartCount: number
  containers: number
  cpu: {
    request: string
    limit: string
    usage: string
  }
  memory: {
    request: string
    limit: string
    usage: string
  }
  age: string
  node: string
  ip: string
  qosClass: "Guaranteed" | "Burstable" | "BestEffort"
  controlledBy: string
  labels: Record<string, string>
  conditions: Array<{ type: string; status: string }>
}

interface Deployment {
  name: string
  namespace: string
  replicas: {
    desired: number
    current: number
    ready: number
    available: number
    unavailable: number
  }
  image: string
  strategy: "RollingUpdate" | "Recreate"
  age: string
  conditions: Array<{ type: string; status: string }>
  selector: Record<string, string>
  revisionHistory: number
}

interface Service {
  name: string
  namespace: string
  type: ServiceType
  clusterIP: string
  externalIP: string
  ports: Array<{ name: string; port: number; targetPort: number; protocol: string }>
  selector: Record<string, string>
  endpoints: number
  age: string
}

interface Ingress {
  name: string
  namespace: string
  hosts: string[]
  paths: Array<{ path: string; service: string; port: number }>
  tlsEnabled: boolean
  age: string
}

interface K8sEvent {
  id: string
  timestamp: Date
  severity: EventSeverity
  type: string
  object: string
  namespace: string
  reason: string
  message: string
}

interface Namespace {
  name: string
  status: "Active" | "Terminating"
  age: string
  pods: number
  cpu: {
    request: number
    limit: number
    usage: number
  }
  memory: {
    request: number
    limit: number
    usage: number
  }
  quotas: {
    cpu: { hard: string; used: string }
    memory: { hard: string; used: string }
    pods: { hard: number; used: number }
  }
  limitRanges: Array<{ type: string; min: string; max: string; default: string }>
}

interface SecurityContext {
  namespace: string
  podSecurityStandard: PodSecurityStandard
  violations: number
  privilegedPods: number
  hostNetworkPods: number
  hostPIDPods: number
  runAsRoot: number
  secrets: number
  secretsEncrypted: boolean
  serviceAccounts: number
  rbacRoles: number
  rbacBindings: number
  networkPolicies: number
  imageVulnerabilities: {
    critical: number
    high: number
    medium: number
    low: number
  }
}

// ============================================================================
// MOCK DATA GENERATORS
// ============================================================================

const generateClusters = (): Cluster[] => [
  {
    name: "production",
    version: "v1.28.4",
    health: "Healthy",
    nodes: 18,
    pods: 240,
    services: 38,
    deployments: 45,
    cpu: { used: 136, total: 160 },
    memory: { used: 461, total: 640 },
    network: { in: 128.5, out: 94.2 },
    disk: { used: 2.4, total: 8.0 },
    uptime: "47d 12h 34m",
  },
  {
    name: "staging",
    version: "v1.28.4",
    health: "Healthy",
    nodes: 6,
    pods: 82,
    services: 18,
    deployments: 22,
    cpu: { used: 28, total: 48 },
    memory: { used: 128, total: 192 },
    network: { in: 42.1, out: 31.8 },
    disk: { used: 0.8, total: 3.0 },
    uptime: "23d 8h 15m",
  },
  {
    name: "dev",
    version: "v1.27.8",
    health: "Degraded",
    nodes: 3,
    pods: 34,
    services: 12,
    deployments: 15,
    cpu: { used: 18, total: 24 },
    memory: { used: 72, total: 96 },
    network: { in: 18.4, out: 12.6 },
    disk: { used: 0.4, total: 1.5 },
    uptime: "12d 4h 22m",
  },
]

const generateNodes = (clusterName: string): Node[] => {
  const nodeCount = clusterName === "production" ? 18 : clusterName === "staging" ? 6 : 3
  const controlPlaneCount = clusterName === "production" ? 3 : 1

  const nodes: Node[] = []

  // Control plane nodes
  for (let i = 1; i <= controlPlaneCount; i++) {
    nodes.push({
      name: `${clusterName}-control-${i}`,
      status: "Ready",
      role: "control-plane",
      cpu: {
        usage: Math.floor(Math.random() * 2000 + 1000),
        capacity: 4000,
        requests: Math.floor(Math.random() * 1500 + 500),
        limits: Math.floor(Math.random() * 2000 + 1000),
      },
      memory: {
        usage: Math.floor(Math.random() * 8 + 4) * 1024,
        capacity: 16 * 1024,
        requests: Math.floor(Math.random() * 4 + 2) * 1024,
        limits: Math.floor(Math.random() * 8 + 4) * 1024,
      },
      disk: {
        usage: Math.floor(Math.random() * 60 + 20),
        capacity: 200,
      },
      podCount: Math.floor(Math.random() * 20 + 15),
      podCapacity: 110,
      age: `${Math.floor(Math.random() * 60 + 10)}d`,
      version: "v1.28.4",
      internalIP: `10.0.${i}.10`,
      osImage: "Ubuntu 22.04.3 LTS",
      kernelVersion: "5.15.0-91-generic",
      containerRuntime: "containerd://1.7.11",
      labels: {
        "kubernetes.io/hostname": `${clusterName}-control-${i}`,
        "node-role.kubernetes.io/control-plane": "",
        "topology.kubernetes.io/zone": `us-east-1${String.fromCharCode(96 + i)}`,
      },
      taints: [
        { key: "node-role.kubernetes.io/control-plane", effect: "NoSchedule" },
      ],
      conditions: [
        { type: "Ready", status: "True" },
        { type: "MemoryPressure", status: "False" },
        { type: "DiskPressure", status: "False" },
      ],
      metrics: Array.from({ length: 20 }, (_, idx) => ({
        time: Date.now() - (19 - idx) * 60000,
        cpu: Math.random() * 30 + 20,
        memory: Math.random() * 40 + 30,
      })),
    })
  }

  // Worker nodes
  for (let i = 1; i <= nodeCount - controlPlaneCount; i++) {
    const isNotReady = Math.random() < 0.05
    nodes.push({
      name: `${clusterName}-worker-${i}`,
      status: isNotReady ? "NotReady" : "Ready",
      role: "worker",
      cpu: {
        usage: Math.floor(Math.random() * 5000 + 2000),
        capacity: 8000,
        requests: Math.floor(Math.random() * 4000 + 1000),
        limits: Math.floor(Math.random() * 6000 + 2000),
      },
      memory: {
        usage: Math.floor(Math.random() * 16 + 8) * 1024,
        capacity: 32 * 1024,
        requests: Math.floor(Math.random() * 12 + 4) * 1024,
        limits: Math.floor(Math.random() * 20 + 8) * 1024,
      },
      disk: {
        usage: Math.floor(Math.random() * 150 + 50),
        capacity: 500,
      },
      podCount: Math.floor(Math.random() * 30 + 10),
      podCapacity: 110,
      age: `${Math.floor(Math.random() * 60 + 10)}d`,
      version: "v1.28.4",
      internalIP: `10.0.${Math.floor(i / 254) + 10}.${i % 254}`,
      osImage: "Ubuntu 22.04.3 LTS",
      kernelVersion: "5.15.0-91-generic",
      containerRuntime: "containerd://1.7.11",
      labels: {
        "kubernetes.io/hostname": `${clusterName}-worker-${i}`,
        "node.kubernetes.io/instance-type": "m5.2xlarge",
        "topology.kubernetes.io/zone": `us-east-1${String.fromCharCode(96 + ((i % 3) + 1))}`,
        "workload-type": i % 2 === 0 ? "compute" : "memory",
      },
      taints: [],
      conditions: isNotReady
        ? [
            { type: "Ready", status: "False" },
            { type: "MemoryPressure", status: "Unknown" },
            { type: "DiskPressure", status: "Unknown" },
          ]
        : [
            { type: "Ready", status: "True" },
            { type: "MemoryPressure", status: "False" },
            { type: "DiskPressure", status: "False" },
          ],
      metrics: Array.from({ length: 20 }, (_, idx) => ({
        time: Date.now() - (19 - idx) * 60000,
        cpu: Math.random() * 50 + 30,
        memory: Math.random() * 60 + 20,
      })),
    })
  }

  return nodes
}

const generatePods = (clusterName: string): Pod[] => {
  const namespaces = ["default", "kube-system", "production", "api", "frontend", "backend", "database", "monitoring", "logging", "ingress", "cert-manager", "argocd"]
  const podCount = clusterName === "production" ? 240 : clusterName === "staging" ? 82 : 34

  const pods: Pod[] = []
  const deployments = [
    "nginx-deployment",
    "redis-deployment",
    "postgres-deployment",
    "api-gateway",
    "user-service",
    "payment-service",
    "notification-service",
    "frontend-app",
    "backend-api",
    "worker-queue",
    "prometheus",
    "grafana",
    "elasticsearch",
    "kibana",
    "fluentd",
    "cert-manager",
    "ingress-nginx",
    "argocd-server",
    "vault",
    "consul",
  ]

  for (let i = 0; i < podCount; i++) {
    const deployment = deployments[Math.floor(Math.random() * deployments.length)]
    const namespace = namespaces[Math.floor(Math.random() * namespaces.length)]
    const replicaSet = `${deployment}-${Math.random().toString(36).substring(2, 12)}`
    const podName = `${replicaSet}-${Math.random().toString(36).substring(2, 7)}`

    const statusRoll = Math.random()
    let status: PodStatus
    let phase: PodPhase

    if (statusRoll < 0.85) {
      status = "Running"
      phase = "Running"
    } else if (statusRoll < 0.92) {
      status = "Pending"
      phase = "Pending"
    } else if (statusRoll < 0.96) {
      status = "CrashLoopBackOff"
      phase = "Failed"
    } else if (statusRoll < 0.98) {
      status = "Failed"
      phase = "Failed"
    } else {
      status = "Succeeded"
      phase = "Succeeded"
    }

    const restartCount = status === "CrashLoopBackOff" ? Math.floor(Math.random() * 20 + 5) : Math.floor(Math.random() * 3)
    const containers = Math.floor(Math.random() * 3 + 1)

    const cpuRequest = Math.floor(Math.random() * 1000 + 100)
    const cpuLimit = cpuRequest + Math.floor(Math.random() * 500 + 100)
    const cpuUsage = Math.floor(Math.random() * cpuRequest * 0.8)

    const memoryRequest = Math.floor(Math.random() * 500 + 128)
    const memoryLimit = memoryRequest + Math.floor(Math.random() * 300 + 128)
    const memoryUsage = Math.floor(Math.random() * memoryRequest * 0.9)

    const qosRoll = Math.random()
    let qosClass: "Guaranteed" | "Burstable" | "BestEffort"
    if (qosRoll < 0.3) {
      qosClass = "Guaranteed"
    } else if (qosRoll < 0.8) {
      qosClass = "Burstable"
    } else {
      qosClass = "BestEffort"
    }

    pods.push({
      name: podName,
      namespace,
      status,
      phase,
      restartCount,
      containers,
      cpu: {
        request: `${cpuRequest}m`,
        limit: `${cpuLimit}m`,
        usage: `${cpuUsage}m`,
      },
      memory: {
        request: `${memoryRequest}Mi`,
        limit: `${memoryLimit}Mi`,
        usage: `${memoryUsage}Mi`,
      },
      age: `${Math.floor(Math.random() * 30)}d${Math.floor(Math.random() * 24)}h`,
      node: `${clusterName}-worker-${Math.floor(Math.random() * 15 + 1)}`,
      ip: `10.244.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      qosClass,
      controlledBy: `ReplicaSet/${replicaSet}`,
      labels: {
        app: deployment.split("-")[0],
        version: `v${Math.floor(Math.random() * 3 + 1)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
        environment: namespace === "production" ? "production" : "staging",
      },
      conditions: [
        { type: "Initialized", status: "True" },
        { type: "Ready", status: status === "Running" ? "True" : "False" },
        { type: "ContainersReady", status: status === "Running" ? "True" : "False" },
        { type: "PodScheduled", status: "True" },
      ],
    })
  }

  return pods
}

const generateDeployments = (clusterName: string): Deployment[] => {
  const deploymentCount = clusterName === "production" ? 45 : clusterName === "staging" ? 22 : 15
  const namespaces = ["default", "production", "api", "frontend", "backend", "monitoring"]
  const apps = [
    { name: "nginx", image: "nginx:1.25.3" },
    { name: "redis", image: "redis:7.2.3-alpine" },
    { name: "postgres", image: "postgres:16.1-alpine" },
    { name: "api-gateway", image: "api-gateway:v2.4.1" },
    { name: "user-service", image: "user-service:v1.8.2" },
    { name: "payment-service", image: "payment-service:v3.1.0" },
    { name: "notification-service", image: "notification-service:v1.5.4" },
    { name: "frontend-app", image: "frontend:v4.2.1" },
    { name: "backend-api", image: "backend:v3.9.0" },
    { name: "worker-queue", image: "worker:v2.1.3" },
  ]

  return Array.from({ length: deploymentCount }, (_, i) => {
    const app = apps[i % apps.length]
    const desired = Math.floor(Math.random() * 5 + 1) * 2
    const current = Math.random() < 0.9 ? desired : desired - 1
    const ready = current

    return {
      name: `${app.name}-deployment`,
      namespace: namespaces[Math.floor(Math.random() * namespaces.length)],
      replicas: {
        desired,
        current,
        ready,
        available: ready,
        unavailable: desired - ready,
      },
      image: app.image,
      strategy: Math.random() < 0.9 ? "RollingUpdate" : "Recreate",
      age: `${Math.floor(Math.random() * 90 + 10)}d`,
      conditions: [
        { type: "Available", status: "True" },
        { type: "Progressing", status: "True" },
      ],
      selector: {
        app: app.name,
      },
      revisionHistory: 10,
    }
  })
}

const generateServices = (clusterName: string): Service[] => {
  const serviceCount = clusterName === "production" ? 38 : clusterName === "staging" ? 18 : 12
  const namespaces = ["default", "production", "api", "frontend", "backend", "monitoring"]

  return Array.from({ length: serviceCount }, (_, i) => {
    const typeRoll = Math.random()
    let type: ServiceType
    if (typeRoll < 0.6) {
      type = "ClusterIP"
    } else if (typeRoll < 0.8) {
      type = "NodePort"
    } else if (typeRoll < 0.95) {
      type = "LoadBalancer"
    } else {
      type = "ExternalName"
    }

    return {
      name: `service-${i + 1}`,
      namespace: namespaces[Math.floor(Math.random() * namespaces.length)],
      type,
      clusterIP: `10.96.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      externalIP: type === "LoadBalancer" ? `52.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` : "",
      ports: [
        {
          name: "http",
          port: 80,
          targetPort: 8080,
          protocol: "TCP",
        },
      ],
      selector: {
        app: `app-${i + 1}`,
      },
      endpoints: Math.floor(Math.random() * 8 + 2),
      age: `${Math.floor(Math.random() * 120 + 10)}d`,
    }
  })
}

const generateIngresses = (clusterName: string): Ingress[] => {
  const ingressCount = clusterName === "production" ? 12 : clusterName === "staging" ? 6 : 3

  return Array.from({ length: ingressCount }, (_, i) => ({
    name: `ingress-${i + 1}`,
    namespace: "production",
    hosts: [`app${i + 1}.example.com`, `www.app${i + 1}.example.com`],
    paths: [
      { path: "/api", service: `api-service-${i + 1}`, port: 8080 },
      { path: "/", service: `frontend-service-${i + 1}`, port: 80 },
    ],
    tlsEnabled: Math.random() < 0.8,
    age: `${Math.floor(Math.random() * 90 + 10)}d`,
  }))
}

const generateEvents = (clusterName: string): K8sEvent[] => {
  const eventTypes = [
    { type: "Pod", reason: "Scheduled", message: "Successfully assigned to node", severity: "Normal" as EventSeverity },
    { type: "Pod", reason: "Pulling", message: "Pulling image", severity: "Normal" as EventSeverity },
    { type: "Pod", reason: "Pulled", message: "Successfully pulled image", severity: "Normal" as EventSeverity },
    { type: "Pod", reason: "Created", message: "Created container", severity: "Normal" as EventSeverity },
    { type: "Pod", reason: "Started", message: "Started container", severity: "Normal" as EventSeverity },
    { type: "Pod", reason: "BackOff", message: "Back-off restarting failed container", severity: "Warning" as EventSeverity },
    { type: "Pod", reason: "FailedScheduling", message: "0/10 nodes are available: insufficient cpu", severity: "Warning" as EventSeverity },
    { type: "Pod", reason: "Unhealthy", message: "Readiness probe failed", severity: "Warning" as EventSeverity },
    { type: "Deployment", reason: "ScalingReplicaSet", message: "Scaled up replica set to 3", severity: "Normal" as EventSeverity },
    { type: "Node", reason: "NodeReady", message: "Node status is now: NodeReady", severity: "Normal" as EventSeverity },
    { type: "Node", reason: "NodeNotReady", message: "Node status is now: NodeNotReady", severity: "Error" as EventSeverity },
    { type: "HorizontalPodAutoscaler", reason: "SuccessfulRescale", message: "New size: 5; reason: cpu resource utilization above target", severity: "Normal" as EventSeverity },
  ]

  const namespaces = ["default", "kube-system", "production", "api", "frontend", "backend", "monitoring"]

  return Array.from({ length: 50 }, (_, i) => {
    const event = eventTypes[Math.floor(Math.random() * eventTypes.length)]
    const namespace = namespaces[Math.floor(Math.random() * namespaces.length)]

    return {
      id: `event-${i}`,
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 3600000)),
      severity: event.severity,
      type: event.type,
      object: `${event.type.toLowerCase()}-${Math.floor(Math.random() * 100)}`,
      namespace,
      reason: event.reason,
      message: event.message,
    }
  }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

const generateNamespaces = (clusterName: string): Namespace[] => {
  const namespaces = [
    "default",
    "kube-system",
    "kube-public",
    "kube-node-lease",
    "production",
    "api",
    "frontend",
    "backend",
    "database",
    "monitoring",
    "logging",
    "ingress",
  ]

  return namespaces.map((name) => ({
    name,
    status: "Active" as const,
    age: `${Math.floor(Math.random() * 180 + 10)}d`,
    pods: Math.floor(Math.random() * 40 + 5),
    cpu: {
      request: Math.floor(Math.random() * 20 + 5),
      limit: Math.floor(Math.random() * 40 + 10),
      usage: Math.floor(Math.random() * 15 + 3),
    },
    memory: {
      request: Math.floor(Math.random() * 40 + 10),
      limit: Math.floor(Math.random() * 80 + 20),
      usage: Math.floor(Math.random() * 30 + 8),
    },
    quotas: {
      cpu: { hard: "32", used: "18" },
      memory: { hard: "128Gi", used: "64Gi" },
      pods: { hard: 100, used: Math.floor(Math.random() * 80 + 10) },
    },
    limitRanges: [
      { type: "Container", min: "50m", max: "2", default: "500m" },
      { type: "Pod", min: "100m", max: "4", default: "1" },
    ],
  }))
}

const generateSecurityContexts = (namespaces: Namespace[]): SecurityContext[] => {
  return namespaces.map((ns) => ({
    namespace: ns.name,
    podSecurityStandard: (["Privileged", "Baseline", "Restricted"] as PodSecurityStandard[])[Math.floor(Math.random() * 3)],
    violations: Math.floor(Math.random() * 5),
    privilegedPods: Math.floor(Math.random() * 3),
    hostNetworkPods: Math.floor(Math.random() * 2),
    hostPIDPods: Math.floor(Math.random() * 2),
    runAsRoot: Math.floor(Math.random() * 8),
    secrets: Math.floor(Math.random() * 20 + 5),
    secretsEncrypted: Math.random() < 0.8,
    serviceAccounts: Math.floor(Math.random() * 15 + 3),
    rbacRoles: Math.floor(Math.random() * 10 + 2),
    rbacBindings: Math.floor(Math.random() * 12 + 3),
    networkPolicies: Math.floor(Math.random() * 8 + 1),
    imageVulnerabilities: {
      critical: Math.floor(Math.random() * 3),
      high: Math.floor(Math.random() * 8),
      medium: Math.floor(Math.random() * 15),
      low: Math.floor(Math.random() * 25),
    },
  }))
}

const generateMetricsHistory = (points: number = 20) => {
  return Array.from({ length: points }, (_, i) => ({
    time: new Date(Date.now() - (points - i - 1) * 60000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    cpu: Math.floor(Math.random() * 30 + 50),
    memory: Math.floor(Math.random() * 25 + 45),
    network: Math.floor(Math.random() * 100 + 50),
    pods: Math.floor(Math.random() * 20 + 200),
  }))
}

const generateNamespaceMetrics = (namespaces: string[]) => {
  return namespaces.slice(0, 8).map((ns) => ({
    namespace: ns,
    cpu: Math.floor(Math.random() * 20 + 5),
    memory: Math.floor(Math.random() * 40 + 10),
    pods: Math.floor(Math.random() * 40 + 5),
  }))
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const getStatusColor = (status: string) => {
  switch (status) {
    case "Ready":
    case "Running":
    case "Healthy":
    case "Active":
    case "Normal":
    case "True":
      return "text-primary border-primary/30 bg-primary/10"
    case "Pending":
    case "Warning":
    case "Degraded":
      return "text-amber-400 border-amber-500/30 bg-amber-500/10"
    case "Failed":
    case "CrashLoopBackOff":
    case "NotReady":
    case "Critical":
    case "Error":
    case "False":
      return "text-red-400 border-red-500/30 bg-red-500/10"
    case "Unknown":
    case "Terminating":
      return "text-gray-400 border-gray-500/30 bg-gray-500/10"
    case "Succeeded":
      return "text-secondary border-secondary/30 bg-secondary/10"
    default:
      return "text-gray-400 border-gray-500/30 bg-gray-500/10"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Ready":
    case "Running":
    case "Healthy":
    case "Active":
    case "Normal":
      return CheckCircle2
    case "Pending":
    case "Warning":
    case "Degraded":
      return AlertTriangle
    case "Failed":
    case "CrashLoopBackOff":
    case "NotReady":
    case "Critical":
    case "Error":
      return XCircle
    case "Unknown":
    case "Terminating":
      return AlertCircle
    default:
      return Info
  }
}

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)}GB`
}

const formatUptime = (uptime: string): string => {
  return uptime
}

const getQoSColor = (qos: string) => {
  switch (qos) {
    case "Guaranteed":
      return "text-primary"
    case "Burstable":
      return "text-amber-400"
    case "BestEffort":
      return "text-red-400"
    default:
      return "text-gray-400"
  }
}

const getPodSecurityColor = (standard: PodSecurityStandard) => {
  switch (standard) {
    case "Restricted":
      return "text-primary border-primary/30"
    case "Baseline":
      return "text-amber-400 border-amber-500/30"
    case "Privileged":
      return "text-red-400 border-red-500/30"
    default:
      return "text-gray-400 border-gray-500/30"
  }
}

// ============================================================================
// SAMPLE POD LOGS
// ============================================================================

const generatePodLogs = (podName: string): string => {
  const logs = [
    `[${new Date().toISOString()}] INFO  Starting application ${podName}`,
    `[${new Date().toISOString()}] INFO  Loading configuration from /etc/config`,
    `[${new Date().toISOString()}] INFO  Connecting to database at postgres:5432`,
    `[${new Date().toISOString()}] INFO  Database connection established`,
    `[${new Date().toISOString()}] INFO  Starting HTTP server on port 8080`,
    `[${new Date().toISOString()}] INFO  Registering routes: /health, /metrics, /api/v1`,
    `[${new Date().toISOString()}] INFO  Server ready to accept connections`,
    `[${new Date().toISOString()}] INFO  Received request: GET /health`,
    `[${new Date().toISOString()}] INFO  Health check passed`,
    `[${new Date().toISOString()}] INFO  Received request: GET /metrics`,
    `[${new Date().toISOString()}] INFO  Metrics exported successfully`,
    `[${new Date().toISOString()}] DEBUG Cache hit for key: user:12345`,
    `[${new Date().toISOString()}] INFO  Received request: POST /api/v1/users`,
    `[${new Date().toISOString()}] INFO  User created: id=67890`,
    `[${new Date().toISOString()}] WARN  Slow query detected: SELECT * FROM users WHERE active=true (245ms)`,
    `[${new Date().toISOString()}] INFO  Received request: GET /api/v1/users/67890`,
    `[${new Date().toISOString()}] INFO  User retrieved successfully`,
    `[${new Date().toISOString()}] INFO  Cache updated for key: user:67890`,
    `[${new Date().toISOString()}] INFO  Request completed in 12ms`,
  ]

  return logs.join("\n")
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function KubernetesDashboard() {
  const clusters = generateClusters()
  const [selectedCluster, setSelectedCluster] = useState(clusters[0].name)
  const [selectedNamespace, setSelectedNamespace] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPod, setSelectedPod] = useState<Pod | null>(null)
  const [showLogs, setShowLogs] = useState(false)

  const cluster = clusters.find((c) => c.name === selectedCluster) || clusters[0]
  const nodes = generateNodes(selectedCluster)
  const pods = generatePods(selectedCluster)
  const deployments = generateDeployments(selectedCluster)
  const services = generateServices(selectedCluster)
  const ingresses = generateIngresses(selectedCluster)
  const events = generateEvents(selectedCluster)
  const namespaces = generateNamespaces(selectedCluster)
  const securityContexts = generateSecurityContexts(namespaces)
  const metricsHistory = generateMetricsHistory()
  const namespaceMetrics = generateNamespaceMetrics(namespaces.map((ns) => ns.name))

  // Filter pods by namespace and search
  const filteredPods = pods.filter((pod) => {
    const namespaceMatch = selectedNamespace === "all" || pod.namespace === selectedNamespace
    const searchMatch = searchQuery === "" || pod.name.toLowerCase().includes(searchQuery.toLowerCase()) || pod.namespace.toLowerCase().includes(searchQuery.toLowerCase())
    return namespaceMatch && searchMatch
  })

  // Live metrics simulation
  const [liveMetrics, setLiveMetrics] = useState(metricsHistory)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
      setLiveMetrics((prev) => {
        const newMetrics = [...prev.slice(1), {
          time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          cpu: Math.floor(Math.random() * 30 + 50),
          memory: Math.floor(Math.random() * 25 + 45),
          network: Math.floor(Math.random() * 100 + 50),
          pods: Math.floor(Math.random() * 20 + 200),
        }]
        return newMetrics
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Event stream simulation
  const [liveEvents, setLiveEvents] = useState(events)

  useEffect(() => {
    const interval = setInterval(() => {
      const eventTemplates = [
        { type: "Pod", reason: "Started", message: "Started container", severity: "Normal" as EventSeverity },
        { type: "Pod", reason: "Pulled", message: "Successfully pulled image", severity: "Normal" as EventSeverity },
        { type: "Deployment", reason: "ScalingReplicaSet", message: "Scaled up replica set", severity: "Normal" as EventSeverity },
      ]

      const template = eventTemplates[Math.floor(Math.random() * eventTemplates.length)]
      const newEvent: K8sEvent = {
        id: `event-${Date.now()}`,
        timestamp: new Date(),
        severity: template.severity,
        type: template.type,
        object: `${template.type.toLowerCase()}-${Math.floor(Math.random() * 100)}`,
        namespace: namespaces[Math.floor(Math.random() * namespaces.length)].name,
        reason: template.reason,
        message: template.message,
      }

      setLiveEvents((prev) => [newEvent, ...prev.slice(0, 49)])
    }, 10000)

    return () => clearInterval(interval)
  }, [namespaces])

  const cpuPercentage = (cluster.cpu.used / cluster.cpu.total) * 100
  const memoryPercentage = (cluster.memory.used / cluster.memory.total) * 100
  const diskPercentage = (cluster.disk.used / cluster.disk.total) * 100

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold terminal-glow mb-2 font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Kubernetes Dashboard
            </h1>
            <p className="text-muted-foreground">
              Container orchestration monitoring and management
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Select value={selectedCluster} onValueChange={setSelectedCluster}>
              <SelectTrigger className="w-40 glass border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-dark border-white/10">
                {clusters.map((cluster) => (
                  <SelectItem key={cluster.name} value={cluster.name}>
                    {cluster.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon" className="glass border-white/10">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Cluster Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glass border-white/10 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Server className="h-5 w-5 text-secondary" />
                <span className="text-sm text-muted-foreground">Cluster Status</span>
              </div>
              <Badge className={getStatusColor(cluster.health)}>
                {cluster.health}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-foreground">{cluster.version}</p>
              <p className="text-xs text-muted-foreground">Uptime: {cluster.uptime}</p>
            </div>
          </Card>

          <Card className="glass border-white/10 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Box className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Resources</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Nodes</p>
                <p className="text-xl font-bold text-foreground">{cluster.nodes}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Pods</p>
                <p className="text-xl font-bold text-foreground">{cluster.pods}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Services</p>
                <p className="text-xl font-bold text-primary">{cluster.services}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Deploys</p>
                <p className="text-xl font-bold text-primary">{cluster.deployments}</p>
              </div>
            </div>
          </Card>

          <Card className="glass border-white/10 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="h-5 w-5 text-amber-400" />
              <span className="text-sm text-muted-foreground">CPU & Memory</span>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">CPU</span>
                  <span className="text-foreground font-mono">
                    {cluster.cpu.used} / {cluster.cpu.total} cores
                  </span>
                </div>
                <Progress value={cpuPercentage} className="h-2" />
                <p className="text-xs text-right mt-1 text-muted-foreground">{cpuPercentage.toFixed(1)}%</p>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Memory</span>
                  <span className="text-foreground font-mono">
                    {cluster.memory.used}GB / {cluster.memory.total}GB
                  </span>
                </div>
                <Progress value={memoryPercentage} className="h-2" />
                <p className="text-xs text-right mt-1 text-muted-foreground">{memoryPercentage.toFixed(1)}%</p>
              </div>
            </div>
          </Card>

          <Card className="glass border-white/10 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Network className="h-5 w-5 text-purple-400" />
              <span className="text-sm text-muted-foreground">Network & Disk</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Network In</span>
                <span className="text-foreground font-mono">{cluster.network.in} MB/s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Network Out</span>
                <span className="text-foreground font-mono">{cluster.network.out} MB/s</span>
              </div>
              <Separator className="bg-white/10" />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Disk Usage</span>
                <span className="text-foreground font-mono">
                  {cluster.disk.used}TB / {cluster.disk.total}TB
                </span>
              </div>
              <Progress value={diskPercentage} className="h-2" />
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <TabsList className="glass border-white/10 w-max md:w-auto">
            <TabsTrigger value="overview" className="text-xs sm:text-sm whitespace-nowrap">Overview</TabsTrigger>
            <TabsTrigger value="nodes" className="text-xs sm:text-sm whitespace-nowrap">Nodes</TabsTrigger>
            <TabsTrigger value="pods" className="text-xs sm:text-sm whitespace-nowrap">Pods</TabsTrigger>
            <TabsTrigger value="workloads" className="text-xs sm:text-sm whitespace-nowrap">Workloads</TabsTrigger>
            <TabsTrigger value="network" className="text-xs sm:text-sm whitespace-nowrap">Network</TabsTrigger>
            <TabsTrigger value="security" className="text-xs sm:text-sm whitespace-nowrap">Security</TabsTrigger>
            <TabsTrigger value="events" className="text-xs sm:text-sm whitespace-nowrap">Events</TabsTrigger>
          </TabsList>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Live Metrics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">CPU Usage Over Time</h3>
                <Activity className="h-5 w-5 text-secondary" />
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={liveMetrics}>
                  <defs>
                    <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="time" stroke="#9ca3af" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                  <Area type="monotone" dataKey="cpu" stroke="#10b981" fill="url(#cpuGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card className="glass border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Memory Usage Over Time</h3>
                <HardDrive className="h-5 w-5 text-purple-400" />
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={liveMetrics}>
                  <defs>
                    <linearGradient id="memoryGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="time" stroke="#9ca3af" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                  <Area type="monotone" dataKey="memory" stroke="#8b5cf6" fill="url(#memoryGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Namespace Resource Usage */}
          <Card className="glass border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Resource Usage by Namespace</h3>
              <Layers className="h-5 w-5 text-secondary" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={namespaceMetrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="namespace" stroke="#9ca3af" style={{ fontSize: "12px" }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Legend />
                <Bar dataKey="cpu" fill="#10b981" name="CPU (cores)" />
                <Bar dataKey="memory" fill="#8b5cf6" name="Memory (GB)" />
                <Bar dataKey="pods" fill="#06b6d4" name="Pods" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="glass-dark border-white/10 p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Healthy Nodes</p>
                  <p className="text-2xl font-bold text-foreground">
                    {nodes.filter((n) => n.status === "Ready").length}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="glass-dark border-white/10 p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                  <PlayCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Running Pods</p>
                  <p className="text-2xl font-bold text-foreground">
                    {pods.filter((p) => p.status === "Running").length}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="glass-dark border-white/10 p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <AlertTriangle className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Warnings</p>
                  <p className="text-2xl font-bold text-foreground">
                    {liveEvents.filter((e) => e.severity === "Warning").length}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="glass-dark border-white/10 p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                  <XCircle className="h-6 w-6 text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Failed Pods</p>
                  <p className="text-2xl font-bold text-foreground">
                    {pods.filter((p) => p.status === "Failed" || p.status === "CrashLoopBackOff").length}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Nodes Tab */}
        <TabsContent value="nodes" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search nodes..."
                className="glass border-white/10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {nodes.map((node, index) => (
              <motion.div
                key={node.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="glass border-white/10 p-6">
                  <div className="space-y-4">
                    {/* Node Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Server className="h-5 w-5 text-secondary" />
                          <h3 className="font-mono text-lg font-semibold text-foreground">{node.name}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(node.status)}>{node.status}</Badge>
                          <Badge variant="outline" className="border-border text-muted-foreground">
                            {node.role}
                          </Badge>
                          <Badge variant="outline" className="border-border text-muted-foreground">
                            {node.age}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Node Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Cpu className="h-4 w-4 text-primary" />
                          <span className="text-sm text-muted-foreground">CPU</span>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Usage</span>
                            <span className="font-mono text-foreground">
                              {node.cpu.usage}m / {node.cpu.capacity}m
                            </span>
                          </div>
                          <Progress value={(node.cpu.usage / node.cpu.capacity) * 100} className="h-2" />
                          <div className="flex justify-between text-xs mt-1">
                            <span className="text-muted-foreground">Requests: {node.cpu.requests}m</span>
                            <span className="text-muted-foreground">Limits: {node.cpu.limits}m</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <HardDrive className="h-4 w-4 text-purple-400" />
                          <span className="text-sm text-muted-foreground">Memory</span>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Usage</span>
                            <span className="font-mono text-foreground">
                              {(node.memory.usage / 1024).toFixed(1)}GB / {(node.memory.capacity / 1024).toFixed(0)}GB
                            </span>
                          </div>
                          <Progress value={(node.memory.usage / node.memory.capacity) * 100} className="h-2" />
                          <div className="flex justify-between text-xs mt-1">
                            <span className="text-muted-foreground">Requests: {(node.memory.requests / 1024).toFixed(1)}GB</span>
                            <span className="text-muted-foreground">Limits: {(node.memory.limits / 1024).toFixed(1)}GB</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pod Capacity */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Box className="h-4 w-4 text-secondary" />
                        <span className="text-sm text-muted-foreground">Pods</span>
                      </div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Running</span>
                        <span className="font-mono text-foreground">
                          {node.podCount} / {node.podCapacity}
                        </span>
                      </div>
                      <Progress value={(node.podCount / node.podCapacity) * 100} className="h-2" />
                    </div>

                    {/* Node Details */}
                    <Separator className="bg-white/10" />

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Internal IP:</span>
                        <span className="ml-2 font-mono text-foreground">{node.internalIP}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Version:</span>
                        <span className="ml-2 font-mono text-foreground">{node.version}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground">OS:</span>
                        <span className="ml-2 font-mono text-foreground">{node.osImage}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Runtime:</span>
                        <span className="ml-2 font-mono text-foreground">{node.containerRuntime}</span>
                      </div>
                    </div>

                    {/* Node Conditions */}
                    {node.conditions.length > 0 && (
                      <>
                        <Separator className="bg-white/10" />
                        <div className="flex flex-wrap gap-2">
                          {node.conditions.map((condition) => (
                            <Badge
                              key={condition.type}
                              variant="outline"
                              className={`text-xs ${getStatusColor(condition.status)}`}
                            >
                              {condition.type}: {condition.status}
                            </Badge>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Taints */}
                    {node.taints.length > 0 && (
                      <>
                        <Separator className="bg-white/10" />
                        <div>
                          <p className="text-xs text-muted-foreground mb-2">Taints:</p>
                          <div className="flex flex-wrap gap-2">
                            {node.taints.map((taint, i) => (
                              <Badge key={i} variant="outline" className="text-xs border-amber-500/30 text-amber-400">
                                {taint.key}: {taint.effect}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Pods Tab */}
        <TabsContent value="pods" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search pods..."
                className="glass border-white/10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedNamespace} onValueChange={setSelectedNamespace}>
              <SelectTrigger className="w-48 glass border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-dark border-white/10">
                <SelectItem value="all">All Namespaces</SelectItem>
                {namespaces.map((ns) => (
                  <SelectItem key={ns.name} value={ns.name}>
                    {ns.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card className="glass border-white/10">
            <ScrollArea className="h-[600px]">
              <div className="p-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Namespace</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Restarts</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">CPU/Memory</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">QoS</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Age</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPods.map((pod, index) => (
                      <motion.tr
                        key={pod.name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.02 }}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Box className="h-4 w-4 text-secondary" />
                            <span className="font-mono text-sm text-foreground">{pod.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="border-border text-muted-foreground font-mono text-xs">
                            {pod.namespace}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(pod.status)}>{pod.status}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`font-mono text-sm ${pod.restartCount > 5 ? "text-red-400" : "text-muted-foreground"}`}>
                            {pod.restartCount}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-xs font-mono text-muted-foreground">
                            <div>{pod.cpu.usage} / {pod.cpu.limit}</div>
                            <div>{pod.memory.usage} / {pod.memory.limit}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-sm font-mono ${getQoSColor(pod.qosClass)}`}>
                            {pod.qosClass}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm font-mono text-muted-foreground">{pod.age}</td>
                        <td className="py-3 px-4">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-2"
                            onClick={() => {
                              setSelectedPod(pod)
                              setShowLogs(true)
                            }}
                          >
                            <Terminal className="h-4 w-4" />
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ScrollArea>
          </Card>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>
              Showing {filteredPods.length} of {pods.length} pods
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary/30 border border-primary" />
                <span>Running: {pods.filter((p) => p.status === "Running").length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-amber-500/30 border border-amber-500" />
                <span>Pending: {pods.filter((p) => p.status === "Pending").length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/30 border border-red-500" />
                <span>Failed: {pods.filter((p) => p.status === "Failed" || p.status === "CrashLoopBackOff").length}</span>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Workloads Tab */}
        <TabsContent value="workloads" className="space-y-6">
          {/* Deployments */}
          <Card className="glass border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Deployments</h3>
              <Package className="h-5 w-5 text-secondary" />
            </div>
            <ScrollArea className="h-[400px]">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Namespace</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Replicas</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Image</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Strategy</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Age</th>
                  </tr>
                </thead>
                <tbody>
                  {deployments.map((deployment) => (
                    <tr key={deployment.name} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4 font-mono text-sm text-foreground">{deployment.name}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="border-border text-muted-foreground font-mono text-xs">
                          {deployment.namespace}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-foreground">
                            {deployment.replicas.ready}/{deployment.replicas.desired}
                          </span>
                          {deployment.replicas.ready === deployment.replicas.desired ? (
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-amber-400" />
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{deployment.image}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="border-border text-muted-foreground text-xs">
                          {deployment.strategy}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-mono text-sm text-muted-foreground">{deployment.age}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          </Card>
        </TabsContent>

        {/* Network Tab */}
        <TabsContent value="network" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Services */}
            <Card className="glass border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Services</h3>
                <Globe className="h-5 w-5 text-secondary" />
              </div>
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {services.map((service) => (
                    <Card key={service.name} className="glass-dark border-white/10 p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sm text-foreground">{service.name}</span>
                          <Badge className={service.type === "LoadBalancer" ? "bg-primary/20 text-primary" : "bg-muted/20 text-muted-foreground"}>
                            {service.type}
                          </Badge>
                        </div>
                        <div className="text-xs space-y-1">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Namespace:</span>
                            <span className="font-mono text-muted-foreground">{service.namespace}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Cluster IP:</span>
                            <span className="font-mono text-muted-foreground">{service.clusterIP}</span>
                          </div>
                          {service.externalIP && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">External IP:</span>
                              <span className="font-mono text-primary">{service.externalIP}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Ports:</span>
                            <span className="font-mono text-muted-foreground">
                              {service.ports.map((p) => `${p.port}:${p.targetPort}`).join(", ")}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Endpoints:</span>
                            <span className="font-mono text-muted-foreground">{service.endpoints}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </Card>

            {/* Ingresses */}
            <Card className="glass border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Ingress Rules</h3>
                <Network className="h-5 w-5 text-purple-400" />
              </div>
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {ingresses.map((ingress) => (
                    <Card key={ingress.name} className="glass-dark border-white/10 p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sm text-foreground">{ingress.name}</span>
                          {ingress.tlsEnabled && (
                            <Badge className="bg-primary/20 text-primary">
                              <Lock className="h-3 w-3 mr-1" />
                              TLS
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Hosts:</p>
                            <div className="flex flex-wrap gap-1">
                              {ingress.hosts.map((host) => (
                                <Badge key={host} variant="outline" className="border-border text-muted-foreground text-xs font-mono">
                                  {host}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Rules:</p>
                            <div className="space-y-1">
                              {ingress.paths.map((path, i) => (
                                <div key={i} className="text-xs font-mono text-muted-foreground flex items-center gap-2">
                                  <ChevronRight className="h-3 w-3" />
                                  <span>{path.path}</span>
                                  <span className="text-muted-foreground/50">→</span>
                                  <span className="text-secondary">{path.service}</span>
                                  <span className="text-muted-foreground/50">:</span>
                                  <span>{path.port}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {securityContexts.slice(0, 8).map((ctx) => (
              <Card key={ctx.namespace} className="glass border-white/10 p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-secondary" />
                      <h3 className="font-mono text-lg font-semibold text-foreground">{ctx.namespace}</h3>
                    </div>
                    <Badge className={getPodSecurityColor(ctx.podSecurityStandard)}>
                      {ctx.podSecurityStandard}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Violations</p>
                      <p className={`text-2xl font-bold ${ctx.violations > 0 ? "text-red-400" : "text-primary"}`}>
                        {ctx.violations}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Secrets</p>
                      <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold text-foreground">{ctx.secrets}</p>
                        {ctx.secretsEncrypted ? (
                          <Lock className="h-4 w-4 text-primary" />
                        ) : (
                          <Unlock className="h-4 w-4 text-red-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-white/10" />

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Privileged Pods:</span>
                      <span className={`font-mono ${ctx.privilegedPods > 0 ? "text-red-400" : "text-muted-foreground"}`}>
                        {ctx.privilegedPods}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Host Network:</span>
                      <span className={`font-mono ${ctx.hostNetworkPods > 0 ? "text-amber-400" : "text-muted-foreground"}`}>
                        {ctx.hostNetworkPods}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Run as Root:</span>
                      <span className={`font-mono ${ctx.runAsRoot > 0 ? "text-amber-400" : "text-muted-foreground"}`}>
                        {ctx.runAsRoot}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Network Policies:</span>
                      <span className="font-mono text-primary">{ctx.networkPolicies}</span>
                    </div>
                  </div>

                  <Separator className="bg-white/10" />

                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Image Vulnerabilities:</p>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="text-center">
                        <p className="text-xl font-bold text-red-400">{ctx.imageVulnerabilities.critical}</p>
                        <p className="text-xs text-muted-foreground">Critical</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold text-orange-400">{ctx.imageVulnerabilities.high}</p>
                        <p className="text-xs text-muted-foreground">High</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold text-amber-400">{ctx.imageVulnerabilities.medium}</p>
                        <p className="text-xs text-muted-foreground">Medium</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold text-muted-foreground">{ctx.imageVulnerabilities.low}</p>
                        <p className="text-xs text-muted-foreground">Low</p>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-white/10" />

                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div className="text-center">
                      <p className="text-lg font-bold text-foreground">{ctx.serviceAccounts}</p>
                      <p className="text-muted-foreground">Service Accounts</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-foreground">{ctx.rbacRoles}</p>
                      <p className="text-muted-foreground">RBAC Roles</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-foreground">{ctx.rbacBindings}</p>
                      <p className="text-muted-foreground">Bindings</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-6">
          <Card className="glass border-white/10">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Live Event Stream</h3>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm text-muted-foreground">Live</span>
                </div>
              </div>

              <ScrollArea className="h-[600px]">
                <div className="space-y-2">
                  <AnimatePresence>
                    {liveEvents.map((event, index) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className={`glass-dark border-l-4 ${
                          event.severity === "Error"
                            ? "border-l-red-500"
                            : event.severity === "Warning"
                            ? "border-l-amber-500"
                            : "border-l-emerald-500"
                        } p-4`}>
                          <div className="flex items-start gap-4">
                            <div className={`mt-1 ${
                              event.severity === "Error"
                                ? "text-red-400"
                                : event.severity === "Warning"
                                ? "text-amber-400"
                                : "text-primary"
                            }`}>
                              {React.createElement(getStatusIcon(event.severity), { className: "h-5 w-5" })}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className={getStatusColor(event.severity)}>
                                  {event.severity}
                                </Badge>
                                <Badge variant="outline" className="border-border text-muted-foreground font-mono text-xs">
                                  {event.type}
                                </Badge>
                                <Badge variant="outline" className="border-border text-muted-foreground font-mono text-xs">
                                  {event.namespace}
                                </Badge>
                                <span className="text-xs text-muted-foreground ml-auto">
                                  {event.timestamp.toLocaleTimeString()}
                                </span>
                              </div>

                              <p className="text-sm font-mono text-foreground mb-1">{event.object}</p>
                              <p className="text-sm text-muted-foreground">
                                <span className="text-secondary">{event.reason}:</span> {event.message}
                              </p>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Pod Logs Modal */}
      <Dialog open={showLogs} onOpenChange={setShowLogs}>
        <DialogContent className="glass-overlay border-white/20 max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-secondary" />
              <span className="font-mono">{selectedPod?.name}</span>
            </DialogTitle>
            <DialogDescription>
              Namespace: {selectedPod?.namespace} | Node: {selectedPod?.node}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[500px] w-full">
            <pre className="bg-muted/50 rounded-lg p-4 text-xs font-mono text-primary overflow-x-auto">
              {selectedPod && generatePodLogs(selectedPod.name)}
            </pre>
          </ScrollArea>

          <div className="flex justify-end gap-2">
            <Button variant="outline" className="glass border-white/10" onClick={() => setShowLogs(false)}>
              Close
            </Button>
            <Button className="bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30">
              <Download className="h-4 w-4 mr-2" />
              Download Logs
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
