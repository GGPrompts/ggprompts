"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Cloud,
  Database,
  HardDrive,
  Network,
  Shield,
  Server,
  GitBranch,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Activity,
  TrendingUp,
  TrendingDown,
  Lock,
  Unlock,
  Play,
  Trash2,
  RotateCcw,
  Eye,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Settings,
  FileCode,
  Zap,
  Users,
  Calendar,
  ArrowRight,
  Info,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Globe,
  CloudRain,
  Box,
  Layers,
  Cpu,
  MemoryStick,
  Wifi,
} from "lucide-react"
import { Button, Card, Badge, Input, Tabs, TabsContent, TabsList, TabsTrigger, Progress, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, Separator, ScrollArea } from "@ggprompts/ui"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type Provider = "aws" | "azure" | "gcp"
type ResourceStatus = "created" | "modified" | "destroyed" | "tainted"
type DeploymentStatus = "success" | "failed" | "in-progress" | "rolled-back"
type DriftStatus = "in-sync" | "drifted" | "unknown"
type WorkspaceName = "dev" | "staging" | "production"

interface TerraformResource {
  id: string
  type: string // aws_instance, azurerm_storage_account, google_compute_instance
  name: string
  provider: Provider
  region: string
  status: ResourceStatus
  cost: number // Monthly estimate in USD
  tags: Record<string, string>
  lastModified: string
  dependencies: string[] // Resource IDs this depends on
  hasDrift: boolean
  module?: string // Module path if part of a module
}

interface Deployment {
  id: string
  triggeredBy: string // User or CI/CD system
  timestamp: string
  duration: string
  status: DeploymentStatus
  workspace: WorkspaceName
  changes: {
    added: number
    modified: number
    destroyed: number
  }
  planOutput?: string
  rollbackAvailable: boolean
}

interface DriftDetail {
  resourceId: string
  resourceType: string
  attribute: string
  expected: string
  actual: string
  severity: "low" | "medium" | "high" | "critical"
}

interface WorkspaceInfo {
  name: WorkspaceName
  resourceCount: number
  lastApply: string
  status: "active" | "inactive"
  variables: Record<string, string>
}

interface StateLock {
  isLocked: boolean
  lockedBy?: string
  lockId?: string
  duration?: string
  operation?: string
}

interface SecurityFinding {
  id: string
  severity: "critical" | "high" | "medium" | "low"
  category: string
  resource: string
  description: string
  remediation: string
}

interface CostTrend {
  month: string
  aws: number
  azure: number
  gcp: number
  total: number
}

// ============================================================================
// MOCK DATA GENERATORS
// ============================================================================

const generateResources = (): TerraformResource[] => [
  // AWS Resources
  {
    id: "aws_instance.web-server-prod-1a",
    type: "aws_instance",
    name: "web-server-prod-1a",
    provider: "aws",
    region: "us-east-1a",
    status: "created",
    cost: 124.80,
    tags: { Environment: "production", Team: "platform", Role: "web" },
    lastModified: "2 hours ago",
    dependencies: ["aws_security_group.web-sg", "aws_subnet.public-1a"],
    hasDrift: false,
  },
  {
    id: "aws_instance.web-server-prod-1b",
    type: "aws_instance",
    name: "web-server-prod-1b",
    provider: "aws",
    region: "us-east-1b",
    status: "created",
    cost: 124.80,
    tags: { Environment: "production", Team: "platform", Role: "web" },
    lastModified: "2 hours ago",
    dependencies: ["aws_security_group.web-sg", "aws_subnet.public-1b"],
    hasDrift: true,
  },
  {
    id: "aws_rds_instance.postgres-main",
    type: "aws_db_instance",
    name: "postgres-main",
    provider: "aws",
    region: "us-east-1",
    status: "created",
    cost: 287.50,
    tags: { Environment: "production", Team: "data", Engine: "postgres" },
    lastModified: "1 day ago",
    dependencies: ["aws_db_subnet_group.main", "aws_security_group.db-sg"],
    hasDrift: false,
    module: "modules/rds",
  },
  {
    id: "aws_s3_bucket.app-assets",
    type: "aws_s3_bucket",
    name: "app-assets-prod",
    provider: "aws",
    region: "us-east-1",
    status: "created",
    cost: 23.45,
    tags: { Environment: "production", Team: "frontend" },
    lastModified: "3 hours ago",
    dependencies: [],
    hasDrift: true,
  },
  {
    id: "aws_cloudfront_distribution.cdn",
    type: "aws_cloudfront_distribution",
    name: "main-cdn",
    provider: "aws",
    region: "global",
    status: "created",
    cost: 156.20,
    tags: { Environment: "production", Team: "frontend" },
    lastModified: "2 hours ago",
    dependencies: ["aws_s3_bucket.app-assets"],
    hasDrift: false,
  },
  {
    id: "aws_elasticache_cluster.redis-session",
    type: "aws_elasticache_cluster",
    name: "redis-session-store",
    provider: "aws",
    region: "us-east-1",
    status: "created",
    cost: 89.60,
    tags: { Environment: "production", Team: "platform", Engine: "redis" },
    lastModified: "2 hours ago",
    dependencies: ["aws_elasticache_subnet_group.redis"],
    hasDrift: false,
  },
  {
    id: "aws_lb.application",
    type: "aws_lb",
    name: "app-lb-prod",
    provider: "aws",
    region: "us-east-1",
    status: "created",
    cost: 67.30,
    tags: { Environment: "production", Team: "platform" },
    lastModified: "2 hours ago",
    dependencies: ["aws_subnet.public-1a", "aws_subnet.public-1b"],
    hasDrift: false,
  },
  {
    id: "aws_security_group.web-sg",
    type: "aws_security_group",
    name: "web-security-group",
    provider: "aws",
    region: "us-east-1",
    status: "modified",
    cost: 0,
    tags: { Environment: "production", Team: "security" },
    lastModified: "30 minutes ago",
    dependencies: ["aws_vpc.main"],
    hasDrift: true,
  },
  {
    id: "aws_security_group.db-sg",
    type: "aws_security_group",
    name: "database-security-group",
    provider: "aws",
    region: "us-east-1",
    status: "created",
    cost: 0,
    tags: { Environment: "production", Team: "security" },
    lastModified: "1 day ago",
    dependencies: ["aws_vpc.main"],
    hasDrift: false,
  },
  {
    id: "aws_vpc.main",
    type: "aws_vpc",
    name: "main-vpc",
    provider: "aws",
    region: "us-east-1",
    status: "created",
    cost: 0,
    tags: { Environment: "production", Team: "networking" },
    lastModified: "7 days ago",
    dependencies: [],
    hasDrift: false,
  },
  {
    id: "aws_subnet.public-1a",
    type: "aws_subnet",
    name: "public-subnet-1a",
    provider: "aws",
    region: "us-east-1a",
    status: "created",
    cost: 0,
    tags: { Environment: "production", Team: "networking", Type: "public" },
    lastModified: "7 days ago",
    dependencies: ["aws_vpc.main"],
    hasDrift: false,
  },
  {
    id: "aws_subnet.public-1b",
    type: "aws_subnet",
    name: "public-subnet-1b",
    provider: "aws",
    region: "us-east-1b",
    status: "created",
    cost: 0,
    tags: { Environment: "production", Team: "networking", Type: "public" },
    lastModified: "7 days ago",
    dependencies: ["aws_vpc.main"],
    hasDrift: false,
  },
  {
    id: "aws_iam_role.lambda-execution",
    type: "aws_iam_role",
    name: "lambda-execution-role",
    provider: "aws",
    region: "global",
    status: "created",
    cost: 0,
    tags: { Environment: "production", Team: "security" },
    lastModified: "5 days ago",
    dependencies: [],
    hasDrift: true,
  },
  {
    id: "aws_lambda_function.api-processor",
    type: "aws_lambda_function",
    name: "api-request-processor",
    provider: "aws",
    region: "us-east-1",
    status: "created",
    cost: 12.30,
    tags: { Environment: "production", Team: "backend" },
    lastModified: "1 hour ago",
    dependencies: ["aws_iam_role.lambda-execution"],
    hasDrift: false,
  },

  // Azure Resources
  {
    id: "azurerm_resource_group.main",
    type: "azurerm_resource_group",
    name: "rg-production-eastus",
    provider: "azure",
    region: "eastus",
    status: "created",
    cost: 0,
    tags: { Environment: "production", Team: "platform" },
    lastModified: "14 days ago",
    dependencies: [],
    hasDrift: false,
  },
  {
    id: "azurerm_storage_account.app-data",
    type: "azurerm_storage_account",
    name: "stprodappdata001",
    provider: "azure",
    region: "eastus",
    status: "created",
    cost: 45.80,
    tags: { Environment: "production", Team: "data" },
    lastModified: "3 days ago",
    dependencies: ["azurerm_resource_group.main"],
    hasDrift: false,
  },
  {
    id: "azurerm_kubernetes_cluster.aks-prod",
    type: "azurerm_kubernetes_cluster",
    name: "aks-prod-eastus",
    provider: "azure",
    region: "eastus",
    status: "created",
    cost: 432.70,
    tags: { Environment: "production", Team: "platform" },
    lastModified: "2 hours ago",
    dependencies: ["azurerm_resource_group.main"],
    hasDrift: true,
  },
  {
    id: "azurerm_sql_database.analytics",
    type: "azurerm_sql_database",
    name: "sqldb-analytics-prod",
    provider: "azure",
    region: "eastus",
    status: "created",
    cost: 178.90,
    tags: { Environment: "production", Team: "data" },
    lastModified: "1 day ago",
    dependencies: ["azurerm_sql_server.main"],
    hasDrift: false,
  },
  {
    id: "azurerm_sql_server.main",
    type: "azurerm_sql_server",
    name: "sql-prod-eastus-001",
    provider: "azure",
    region: "eastus",
    status: "created",
    cost: 0,
    tags: { Environment: "production", Team: "data" },
    lastModified: "7 days ago",
    dependencies: ["azurerm_resource_group.main"],
    hasDrift: false,
  },
  {
    id: "azurerm_virtual_network.vnet-prod",
    type: "azurerm_virtual_network",
    name: "vnet-prod-eastus",
    provider: "azure",
    region: "eastus",
    status: "created",
    cost: 0,
    tags: { Environment: "production", Team: "networking" },
    lastModified: "14 days ago",
    dependencies: ["azurerm_resource_group.main"],
    hasDrift: false,
  },
  {
    id: "azurerm_application_gateway.agw",
    type: "azurerm_application_gateway",
    name: "agw-prod-eastus",
    provider: "azure",
    region: "eastus",
    status: "created",
    cost: 156.40,
    tags: { Environment: "production", Team: "networking" },
    lastModified: "2 hours ago",
    dependencies: ["azurerm_virtual_network.vnet-prod"],
    hasDrift: false,
  },

  // GCP Resources
  {
    id: "google_compute_instance.app-server-1",
    type: "google_compute_instance",
    name: "app-server-us-central1-a",
    provider: "gcp",
    region: "us-central1-a",
    status: "created",
    cost: 98.70,
    tags: { environment: "production", team: "platform" },
    lastModified: "2 hours ago",
    dependencies: ["google_compute_network.vpc"],
    hasDrift: false,
  },
  {
    id: "google_compute_instance.app-server-2",
    type: "google_compute_instance",
    name: "app-server-us-central1-b",
    provider: "gcp",
    region: "us-central1-b",
    status: "created",
    cost: 98.70,
    tags: { environment: "production", team: "platform" },
    lastModified: "2 hours ago",
    dependencies: ["google_compute_network.vpc"],
    hasDrift: true,
  },
  {
    id: "google_storage_bucket.backups",
    type: "google_storage_bucket",
    name: "prod-backups-us-central1",
    provider: "gcp",
    region: "us-central1",
    status: "created",
    cost: 67.20,
    tags: { environment: "production", team: "data" },
    lastModified: "1 day ago",
    dependencies: [],
    hasDrift: false,
  },
  {
    id: "google_sql_database_instance.postgres",
    type: "google_sql_database_instance",
    name: "postgres-prod-instance",
    provider: "gcp",
    region: "us-central1",
    status: "created",
    cost: 245.60,
    tags: { environment: "production", team: "data" },
    lastModified: "3 days ago",
    dependencies: [],
    hasDrift: false,
  },
  {
    id: "google_compute_network.vpc",
    type: "google_compute_network",
    name: "prod-vpc-network",
    provider: "gcp",
    region: "global",
    status: "created",
    cost: 0,
    tags: { environment: "production", team: "networking" },
    lastModified: "14 days ago",
    dependencies: [],
    hasDrift: false,
  },
  {
    id: "google_container_cluster.gke-prod",
    type: "google_container_cluster",
    name: "gke-prod-us-central1",
    provider: "gcp",
    region: "us-central1",
    status: "created",
    cost: 387.90,
    tags: { environment: "production", team: "platform" },
    lastModified: "2 hours ago",
    dependencies: ["google_compute_network.vpc"],
    hasDrift: false,
  },
]

const generateDeployments = (): Deployment[] => [
  {
    id: "deploy-2025-11-23-14-30",
    triggeredBy: "CI/CD Pipeline (GitHub Actions)",
    timestamp: "2 hours ago",
    duration: "3m 42s",
    status: "success",
    workspace: "production",
    changes: { added: 0, modified: 8, destroyed: 0 },
    rollbackAvailable: true,
  },
  {
    id: "deploy-2025-11-23-10-15",
    triggeredBy: "sarah.chen@company.com",
    timestamp: "6 hours ago",
    duration: "2m 18s",
    status: "success",
    workspace: "production",
    changes: { added: 2, modified: 3, destroyed: 0 },
    rollbackAvailable: true,
  },
  {
    id: "deploy-2025-11-22-16-45",
    triggeredBy: "CI/CD Pipeline (GitHub Actions)",
    timestamp: "Yesterday",
    duration: "4m 05s",
    status: "success",
    workspace: "production",
    changes: { added: 0, modified: 12, destroyed: 1 },
    rollbackAvailable: true,
  },
  {
    id: "deploy-2025-11-22-09-20",
    triggeredBy: "mike.rodriguez@company.com",
    timestamp: "Yesterday",
    duration: "5m 33s",
    status: "failed",
    workspace: "production",
    changes: { added: 5, modified: 2, destroyed: 0 },
    rollbackAvailable: false,
  },
  {
    id: "deploy-2025-11-21-14-10",
    triggeredBy: "CI/CD Pipeline (GitHub Actions)",
    timestamp: "2 days ago",
    duration: "3m 21s",
    status: "rolled-back",
    workspace: "production",
    changes: { added: 0, modified: 0, destroyed: 5 },
    rollbackAvailable: false,
  },
  {
    id: "deploy-2025-11-21-11-30",
    triggeredBy: "jenkins.automation@company.com",
    timestamp: "2 days ago",
    duration: "6m 12s",
    status: "success",
    workspace: "staging",
    changes: { added: 15, modified: 8, destroyed: 2 },
    rollbackAvailable: true,
  },
  {
    id: "deploy-2025-11-20-15-45",
    triggeredBy: "alex.kim@company.com",
    timestamp: "3 days ago",
    duration: "2m 47s",
    status: "success",
    workspace: "production",
    changes: { added: 3, modified: 5, destroyed: 1 },
    rollbackAvailable: true,
  },
]

const generateDriftDetails = (): DriftDetail[] => [
  {
    resourceId: "aws_instance.web-server-prod-1b",
    resourceType: "aws_instance",
    attribute: "instance_type",
    expected: "t3.medium",
    actual: "t3.large",
    severity: "high",
  },
  {
    resourceId: "aws_instance.web-server-prod-1b",
    resourceType: "aws_instance",
    attribute: "tags.CostCenter",
    expected: "engineering",
    actual: "platform",
    severity: "low",
  },
  {
    resourceId: "aws_s3_bucket.app-assets",
    resourceType: "aws_s3_bucket",
    attribute: "versioning.enabled",
    expected: "true",
    actual: "false",
    severity: "high",
  },
  {
    resourceId: "aws_security_group.web-sg",
    resourceType: "aws_security_group",
    attribute: "ingress.rule[2]",
    expected: "(not present)",
    actual: "0.0.0.0/0:22",
    severity: "critical",
  },
  {
    resourceId: "aws_iam_role.lambda-execution",
    resourceType: "aws_iam_role",
    attribute: "assume_role_policy",
    expected: "arn:aws:iam::aws:policy/...",
    actual: "arn:aws:iam::aws:policy/... (modified)",
    severity: "medium",
  },
  {
    resourceId: "azurerm_kubernetes_cluster.aks-prod",
    resourceType: "azurerm_kubernetes_cluster",
    attribute: "default_node_pool.node_count",
    expected: "3",
    actual: "5",
    severity: "medium",
  },
  {
    resourceId: "google_compute_instance.app-server-2",
    resourceType: "google_compute_instance",
    attribute: "machine_type",
    expected: "n1-standard-2",
    actual: "n1-standard-4",
    severity: "high",
  },
]

const generateWorkspaces = (): WorkspaceInfo[] => [
  {
    name: "production",
    resourceCount: 213,
    lastApply: "2 hours ago",
    status: "active",
    variables: {
      environment: "production",
      region: "us-east-1",
      instance_type: "t3.medium",
    },
  },
  {
    name: "staging",
    resourceCount: 89,
    lastApply: "2 days ago",
    status: "inactive",
    variables: {
      environment: "staging",
      region: "us-east-1",
      instance_type: "t3.small",
    },
  },
  {
    name: "dev",
    resourceCount: 45,
    lastApply: "1 week ago",
    status: "inactive",
    variables: {
      environment: "development",
      region: "us-west-2",
      instance_type: "t3.micro",
    },
  },
]

const generateSecurityFindings = (): SecurityFinding[] => [
  {
    id: "SEC-001",
    severity: "critical",
    category: "Network Security",
    resource: "aws_security_group.web-sg",
    description: "Security group allows SSH (port 22) from 0.0.0.0/0",
    remediation: "Restrict SSH access to specific IP ranges or use AWS Systems Manager Session Manager",
  },
  {
    id: "SEC-002",
    severity: "high",
    category: "Encryption",
    resource: "aws_s3_bucket.app-assets",
    description: "S3 bucket does not have encryption at rest enabled",
    remediation: "Enable AES-256 or AWS KMS encryption for the bucket",
  },
  {
    id: "SEC-003",
    severity: "high",
    category: "Public Access",
    resource: "aws_rds_instance.postgres-main",
    description: "RDS instance is publicly accessible",
    remediation: "Set publicly_accessible = false and use VPN or bastion host",
  },
  {
    id: "SEC-004",
    severity: "medium",
    category: "IAM",
    resource: "aws_iam_role.lambda-execution",
    description: "IAM role has overly permissive policies (wildcard actions)",
    remediation: "Apply principle of least privilege, specify exact actions needed",
  },
  {
    id: "SEC-005",
    severity: "medium",
    category: "Logging",
    resource: "aws_lb.application",
    description: "Load balancer does not have access logging enabled",
    remediation: "Enable access logs to S3 bucket for audit trail",
  },
  {
    id: "SEC-006",
    severity: "low",
    category: "Tagging",
    resource: "azurerm_storage_account.app-data",
    description: "Resource missing required tags: Owner, CostCenter",
    remediation: "Add required tags for compliance and cost allocation",
  },
]

const generateCostTrends = (): CostTrend[] => [
  { month: "Jun", aws: 2845, azure: 1234, gcp: 678, total: 4757 },
  { month: "Jul", aws: 2912, azure: 1289, gcp: 712, total: 4913 },
  { month: "Aug", aws: 3056, azure: 1345, gcp: 734, total: 5135 },
  { month: "Sep", aws: 3189, azure: 1401, gcp: 789, total: 5379 },
  { month: "Oct", aws: 3234, azure: 1456, gcp: 823, total: 5513 },
  { month: "Nov", aws: 3421, azure: 1523, gcp: 888, total: 5832 },
]

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function TerraformDashboard() {
  const [selectedWorkspace, setSelectedWorkspace] = useState<WorkspaceName>("production")
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [showDriftModal, setShowDriftModal] = useState(false)
  const [showSecurityModal, setShowSecurityModal] = useState(false)
  const [resourceFilter, setResourceFilter] = useState("")
  const [providerFilter, setProviderFilter] = useState<Provider | "all">("all")
  const [statusFilter, setStatusFilter] = useState<ResourceStatus | "all">("all")
  const [selectedDeployment, setSelectedDeployment] = useState<Deployment | null>(null)
  const [stateLock, setStateLock] = useState<StateLock>({
    isLocked: false,
  })

  // Generate mock data
  const allResources = useMemo(() => generateResources(), [])
  const deployments = useMemo(() => generateDeployments(), [])
  const driftDetails = useMemo(() => generateDriftDetails(), [])
  const workspaces = useMemo(() => generateWorkspaces(), [])
  const securityFindings = useMemo(() => generateSecurityFindings(), [])
  const costTrends = useMemo(() => generateCostTrends(), [])

  // Filter resources based on current workspace and filters
  const filteredResources = useMemo(() => {
    return allResources.filter((resource) => {
      const matchesSearch =
        resource.name.toLowerCase().includes(resourceFilter.toLowerCase()) ||
        resource.type.toLowerCase().includes(resourceFilter.toLowerCase()) ||
        resource.id.toLowerCase().includes(resourceFilter.toLowerCase())

      const matchesProvider = providerFilter === "all" || resource.provider === providerFilter
      const matchesStatus = statusFilter === "all" || resource.status === statusFilter

      return matchesSearch && matchesProvider && matchesStatus
    })
  }, [allResources, resourceFilter, providerFilter, statusFilter])

  // Calculate statistics
  const stats = useMemo(() => {
    const totalResources = allResources.length
    const awsCount = allResources.filter((r) => r.provider === "aws").length
    const azureCount = allResources.filter((r) => r.provider === "azure").length
    const gcpCount = allResources.filter((r) => r.provider === "gcp").length
    const driftedCount = allResources.filter((r) => r.hasDrift).length
    const totalCost = allResources.reduce((sum, r) => sum + r.cost, 0)

    return {
      totalResources,
      awsCount,
      azureCount,
      gcpCount,
      driftedCount,
      totalCost,
    }
  }, [allResources])

  // Cost breakdown by provider
  const costByProvider = useMemo(() => {
    const aws = allResources.filter((r) => r.provider === "aws").reduce((sum, r) => sum + r.cost, 0)
    const azure = allResources.filter((r) => r.provider === "azure").reduce((sum, r) => sum + r.cost, 0)
    const gcp = allResources.filter((r) => r.provider === "gcp").reduce((sum, r) => sum + r.cost, 0)

    return [
      { name: "AWS", value: aws, color: "#FF9900" },
      { name: "Azure", value: azure, color: "#0078D4" },
      { name: "GCP", value: gcp, color: "#4285F4" },
    ]
  }, [allResources])

  // Cost by resource type (top 10)
  const costByType = useMemo(() => {
    const typeMap = new Map<string, number>()

    allResources.forEach((resource) => {
      const current = typeMap.get(resource.type) || 0
      typeMap.set(resource.type, current + resource.cost)
    })

    return Array.from(typeMap.entries())
      .map(([type, cost]) => ({ type, cost }))
      .sort((a, b) => b.cost - a.cost)
      .slice(0, 10)
  }, [allResources])

  const getStatusIcon = (status: ResourceStatus) => {
    switch (status) {
      case "created":
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />
      case "modified":
        return <AlertTriangle className="h-4 w-4 text-amber-400" />
      case "destroyed":
        return <XCircle className="h-4 w-4 text-red-400" />
      case "tainted":
        return <AlertTriangle className="h-4 w-4 text-orange-400" />
    }
  }

  const getProviderIcon = (provider: Provider) => {
    switch (provider) {
      case "aws":
        return <Cloud className="h-4 w-4 text-orange-400" />
      case "azure":
        return <CloudRain className="h-4 w-4 text-blue-400" />
      case "gcp":
        return <Globe className="h-4 w-4 text-blue-500" />
    }
  }

  const getSeverityBadge = (severity: "critical" | "high" | "medium" | "low") => {
    const styles = {
      critical: "bg-red-500/20 text-red-400 border-red-500/30",
      high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      low: "bg-secondary/20 text-secondary border-secondary/30",
    }

    return (
      <Badge variant="outline" className={styles[severity]}>
        {severity.toUpperCase()}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="mx-auto max-w-[1800px] space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-foreground terminal-glow">
                Terraform Infrastructure Dashboard
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Infrastructure as Code Management & Monitoring
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Button
                size="sm"
                variant="outline"
                className="glass border-secondary/30"
                onClick={() => setShowPlanModal(true)}
              >
                <Play className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Run Plan</span>
              </Button>
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Zap className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Apply Changes</span>
              </Button>
            </div>
          </div>

          {/* Workspace Selector */}
          <Card className="glass border-secondary/20 p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <GitBranch className="h-5 w-5 text-secondary" />
                <span className="text-sm font-medium text-muted-foreground">Workspace:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {workspaces.map((ws) => (
                  <Button
                    key={ws.name}
                    variant={selectedWorkspace === ws.name ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedWorkspace(ws.name)}
                    className={
                      selectedWorkspace === ws.name
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm"
                        : "glass border-secondary/30 text-xs sm:text-sm"
                    }
                  >
                    {ws.name}
                    <Badge variant="outline" className="ml-1 sm:ml-2 border-white/20 text-xs">
                      {ws.resourceCount}
                    </Badge>
                  </Button>
                ))}
              </div>
              <Separator orientation="vertical" className="h-6 hidden sm:block" />
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <Clock className="h-4 w-4 shrink-0" />
                <span>
                  Last apply:{" "}
                  {workspaces.find((w) => w.name === selectedWorkspace)?.lastApply}
                </span>
              </div>
              {stateLock.isLocked && (
                <>
                  <Separator orientation="vertical" className="h-6 hidden sm:block" />
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-amber-400">
                    <Lock className="h-4 w-4 shrink-0" />
                    <span>
                      Locked by {stateLock.lockedBy} ({stateLock.duration})
                    </span>
                  </div>
                </>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Infrastructure Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Resources */}
            <Card className="glass border-primary/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Resources</p>
                  <h3 className="text-3xl font-bold text-primary mt-1">
                    {stats.totalResources}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">Managed by Terraform</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Layers className="h-6 w-6 text-primary" />
                </div>
              </div>
            </Card>

            {/* Monthly Cost */}
            <Card className="glass border-secondary/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Cost</p>
                  <h3 className="text-3xl font-bold text-secondary mt-1">
                    ${stats.totalCost.toLocaleString()}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-amber-400" />
                    <p className="text-xs text-amber-400">+8% vs last month</p>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-secondary" />
                </div>
              </div>
            </Card>

            {/* Drift Status */}
            <Card className="glass border-amber-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Drift Detected</p>
                  <h3 className="text-3xl font-bold text-amber-400 mt-1">
                    {stats.driftedCount}
                  </h3>
                  <button
                    className="text-xs text-secondary hover:underline mt-1"
                    onClick={() => setShowDriftModal(true)}
                  >
                    View details →
                  </button>
                </div>
                <div className="h-12 w-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-amber-400" />
                </div>
              </div>
            </Card>

            {/* Terraform Version */}
            <Card className="glass border-purple-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Terraform Version</p>
                  <h3 className="text-3xl font-bold text-purple-400 mt-1">v1.6.4</h3>
                  <p className="text-xs text-muted-foreground mt-1">Latest stable</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <FileCode className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Provider Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        >
          <Card className="glass border-orange-500/20 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Cloud className="h-5 w-5 text-orange-400" />
                <h3 className="font-semibold text-orange-400">AWS</h3>
              </div>
              <Badge variant="outline" className="border-orange-500/30 text-orange-400">
                {stats.awsCount} resources
              </Badge>
            </div>
            <Progress value={(stats.awsCount / stats.totalResources) * 100} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              us-east-1, us-west-2 • ${costByProvider[0]?.value.toLocaleString()}/mo
            </p>
          </Card>

          <Card className="glass border-blue-500/20 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CloudRain className="h-5 w-5 text-blue-400" />
                <h3 className="font-semibold text-blue-400">Azure</h3>
              </div>
              <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                {stats.azureCount} resources
              </Badge>
            </div>
            <Progress value={(stats.azureCount / stats.totalResources) * 100} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              eastus • ${costByProvider[1]?.value.toLocaleString()}/mo
            </p>
          </Card>

          <Card className="glass border-blue-600/20 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold text-blue-500">GCP</h3>
              </div>
              <Badge variant="outline" className="border-blue-600/30 text-blue-500">
                {stats.gcpCount} resources
              </Badge>
            </div>
            <Progress value={(stats.gcpCount / stats.totalResources) * 100} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              us-central1 • ${costByProvider[2]?.value.toLocaleString()}/mo
            </p>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs defaultValue="resources" className="space-y-4">
            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
              <TabsList className="glass border-secondary/20 w-max md:w-auto">
                <TabsTrigger value="resources" className="text-xs sm:text-sm whitespace-nowrap">
                  <Box className="h-4 w-4 mr-2" />
                  Resources
                </TabsTrigger>
                <TabsTrigger value="deployments" className="text-xs sm:text-sm whitespace-nowrap">
                  <Activity className="h-4 w-4 mr-2" />
                  Deployments
                </TabsTrigger>
                <TabsTrigger value="costs" className="text-xs sm:text-sm whitespace-nowrap">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Cost Analysis
                </TabsTrigger>
                <TabsTrigger value="security" className="text-xs sm:text-sm whitespace-nowrap">
                  <Shield className="h-4 w-4 mr-2" />
                  Security
                  <Badge variant="outline" className="ml-2 border-red-500/30 text-red-400">
                    {securityFindings.filter((f) => f.severity === "critical").length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="state" className="text-xs sm:text-sm whitespace-nowrap">
                  <Database className="h-4 w-4 mr-2" />
                  State
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Resources Tab */}
            <TabsContent value="resources" className="space-y-4">
              {/* Filters */}
              <Card className="glass border-secondary/20 p-4">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[250px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search resources..."
                        value={resourceFilter}
                        onChange={(e) => setResourceFilter(e.target.value)}
                        className="pl-9 glass-dark border-secondary/30"
                      />
                    </div>
                  </div>
                  <Select
                    value={providerFilter}
                    onValueChange={(v) => setProviderFilter(v as Provider | "all")}
                  >
                    <SelectTrigger className="w-[180px] glass-dark border-secondary/30">
                      <SelectValue placeholder="Filter by provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Providers</SelectItem>
                      <SelectItem value="aws">AWS</SelectItem>
                      <SelectItem value="azure">Azure</SelectItem>
                      <SelectItem value="gcp">GCP</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={statusFilter}
                    onValueChange={(v) => setStatusFilter(v as ResourceStatus | "all")}
                  >
                    <SelectTrigger className="w-[180px] glass-dark border-secondary/30">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="created">Created</SelectItem>
                      <SelectItem value="modified">Modified</SelectItem>
                      <SelectItem value="destroyed">Destroyed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Card>

              {/* Resource Table */}
              <Card className="glass border-secondary/20 overflow-hidden">
                <ScrollArea className="h-[600px]">
                  <div className="p-4">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-secondary/20">
                          <th className="text-left pb-3 text-sm font-medium text-muted-foreground">
                            Status
                          </th>
                          <th className="text-left pb-3 text-sm font-medium text-muted-foreground">
                            Resource ID
                          </th>
                          <th className="text-left pb-3 text-sm font-medium text-muted-foreground">
                            Type
                          </th>
                          <th className="text-left pb-3 text-sm font-medium text-muted-foreground">
                            Provider
                          </th>
                          <th className="text-left pb-3 text-sm font-medium text-muted-foreground">
                            Region
                          </th>
                          <th className="text-left pb-3 text-sm font-medium text-muted-foreground">
                            Cost/mo
                          </th>
                          <th className="text-left pb-3 text-sm font-medium text-muted-foreground">
                            Drift
                          </th>
                          <th className="text-left pb-3 text-sm font-medium text-muted-foreground">
                            Modified
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredResources.map((resource, idx) => (
                          <motion.tr
                            key={resource.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.02 }}
                            className="border-b border-secondary/10 hover:bg-secondary/5"
                          >
                            <td className="py-3">{getStatusIcon(resource.status)}</td>
                            <td className="py-3">
                              <code className="text-sm font-mono text-secondary">
                                {resource.id}
                              </code>
                              {resource.module && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  {resource.module}
                                </div>
                              )}
                            </td>
                            <td className="py-3 text-sm">{resource.type}</td>
                            <td className="py-3">
                              <div className="flex items-center gap-2">
                                {getProviderIcon(resource.provider)}
                                <span className="text-sm capitalize">{resource.provider}</span>
                              </div>
                            </td>
                            <td className="py-3 text-sm">{resource.region}</td>
                            <td className="py-3 text-sm">
                              {resource.cost > 0 ? `$${resource.cost.toFixed(2)}` : "-"}
                            </td>
                            <td className="py-3">
                              {resource.hasDrift ? (
                                <Badge variant="outline" className="border-amber-500/30 text-amber-400">
                                  Drifted
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="border-primary/30 text-primary">
                                  In Sync
                                </Badge>
                              )}
                            </td>
                            <td className="py-3 text-sm text-muted-foreground">
                              {resource.lastModified}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </ScrollArea>
                <div className="border-t border-secondary/20 p-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredResources.length} of {allResources.length} resources
                  </p>
                  <div className="text-sm font-semibold text-secondary">
                    Total Cost: ${filteredResources.reduce((sum, r) => sum + r.cost, 0).toFixed(2)}/mo
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Deployments Tab */}
            <TabsContent value="deployments" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Deployment Timeline */}
                <Card className="glass border-secondary/20 p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-secondary" />
                    Deployment History
                  </h3>
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-4">
                      {deployments.map((deployment, idx) => (
                        <motion.div
                          key={deployment.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="relative pl-8 pb-4"
                        >
                          {/* Timeline line */}
                          {idx < deployments.length - 1 && (
                            <div className="absolute left-[11px] top-6 bottom-0 w-[2px] bg-secondary/20" />
                          )}

                          {/* Timeline dot */}
                          <div
                            className={`absolute left-0 top-1 h-6 w-6 rounded-full flex items-center justify-center ${
                              deployment.status === "success"
                                ? "bg-emerald-500/20 border-2 border-emerald-500"
                                : deployment.status === "failed"
                                ? "bg-red-500/20 border-2 border-red-500"
                                : deployment.status === "rolled-back"
                                ? "bg-amber-500/20 border-2 border-amber-500"
                                : "bg-secondary/20 border-2 border-secondary"
                            }`}
                          >
                            {deployment.status === "success" ? (
                              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                            ) : deployment.status === "failed" ? (
                              <XCircle className="h-3 w-3 text-red-400" />
                            ) : deployment.status === "rolled-back" ? (
                              <RotateCcw className="h-3 w-3 text-amber-400" />
                            ) : (
                              <Activity className="h-3 w-3 text-secondary animate-pulse" />
                            )}
                          </div>

                          {/* Deployment card */}
                          <Card
                            className="glass-dark border-secondary/20 p-4 cursor-pointer hover:border-secondary/40 transition-colors"
                            onClick={() => setSelectedDeployment(deployment)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <code className="text-sm font-mono text-secondary">
                                  {deployment.id}
                                </code>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {deployment.triggeredBy}
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className={
                                  deployment.status === "success"
                                    ? "border-emerald-500/30 text-emerald-400"
                                    : deployment.status === "failed"
                                    ? "border-red-500/30 text-red-400"
                                    : "border-amber-500/30 text-amber-400"
                                }
                              >
                                {deployment.status}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {deployment.timestamp}
                              </span>
                              <span>{deployment.duration}</span>
                              <Badge variant="outline" className="border-secondary/30">
                                {deployment.workspace}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-4 mt-3 text-sm">
                              {deployment.changes.added > 0 && (
                                <span className="text-emerald-400">
                                  +{deployment.changes.added}
                                </span>
                              )}
                              {deployment.changes.modified > 0 && (
                                <span className="text-amber-400">
                                  ~{deployment.changes.modified}
                                </span>
                              )}
                              {deployment.changes.destroyed > 0 && (
                                <span className="text-red-400">
                                  -{deployment.changes.destroyed}
                                </span>
                              )}
                            </div>

                            {deployment.rollbackAvailable && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="mt-3 w-full glass-dark border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                                onClick={(e) => {
                                  e.stopPropagation()
                                }}
                              >
                                <RotateCcw className="h-3 w-3 mr-2" />
                                Rollback Available
                              </Button>
                            )}
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </Card>

                {/* Deployment Details */}
                <Card className="glass border-secondary/20 p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FileCode className="h-5 w-5 text-secondary" />
                    Deployment Details
                  </h3>
                  {selectedDeployment ? (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Deployment ID</p>
                        <code className="text-sm font-mono text-secondary">
                          {selectedDeployment.id}
                        </code>
                      </div>

                      <Separator className="bg-secondary/20" />

                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Changes Summary</p>
                        <div className="glass-dark border border-secondary/20 rounded-lg p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-emerald-400">Resources Added</span>
                            <span className="font-semibold text-emerald-400">
                              +{selectedDeployment.changes.added}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-amber-400">Resources Modified</span>
                            <span className="font-semibold text-amber-400">
                              ~{selectedDeployment.changes.modified}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-red-400">Resources Destroyed</span>
                            <span className="font-semibold text-red-400">
                              -{selectedDeployment.changes.destroyed}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Separator className="bg-secondary/20" />

                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Plan Output</p>
                        <ScrollArea className="h-[300px] glass-dark border border-secondary/20 rounded-lg p-4">
                          <pre className="text-xs font-mono">
                            <code className="text-muted-foreground">
{`Terraform will perform the following actions:

  # aws_instance.web-server-prod-1a will be updated in-place
  ~ resource "aws_instance" "web-server-prod-1a" {
        id                    = "i-0123456789abcdef0"
      ~ instance_type         = "t3.medium" -> "t3.large"
      ~ tags                  = {
          ~ "CostCenter" = "engineering" -> "platform"
        }
        # (15 unchanged attributes hidden)
    }

  # aws_security_group.web-sg will be updated in-place
  ~ resource "aws_security_group" "web-sg" {
        id          = "sg-0987654321fedcba0"
        name        = "web-security-group"
      + ingress {
          + from_port   = 22
          + to_port     = 22
          + protocol    = "tcp"
          + cidr_blocks = ["0.0.0.0/0"]
        }
        # (8 unchanged attributes hidden)
    }

Plan: 0 to add, 8 to change, 0 to destroy.`}
                            </code>
                          </pre>
                        </ScrollArea>
                      </div>

                      <div className="flex gap-3">
                        <Button variant="outline" className="flex-1 glass-dark border-secondary/30">
                          <Eye className="h-4 w-4 mr-2" />
                          View Full Logs
                        </Button>
                        {selectedDeployment.rollbackAvailable && (
                          <Button
                            variant="outline"
                            className="flex-1 glass-dark border-amber-500/30 text-amber-400"
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Rollback
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="h-[500px] flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <FileCode className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">Select a deployment to view details</p>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </TabsContent>

            {/* Cost Analysis Tab */}
            <TabsContent value="costs" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Cost Trend Chart */}
                <Card className="glass border-secondary/20 p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-secondary" />
                    6-Month Cost Trend
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={costTrends}>
                      <defs>
                        <linearGradient id="colorAws" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FF9900" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#FF9900" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorAzure" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0078D4" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#0078D4" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorGcp" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4285F4" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#4285F4" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--popover-foreground))",
                        }}
                        labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                        itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="aws"
                        stackId="1"
                        stroke="#FF9900"
                        fill="url(#colorAws)"
                        name="AWS"
                      />
                      <Area
                        type="monotone"
                        dataKey="azure"
                        stackId="1"
                        stroke="#0078D4"
                        fill="url(#colorAzure)"
                        name="Azure"
                      />
                      <Area
                        type="monotone"
                        dataKey="gcp"
                        stackId="1"
                        stroke="#4285F4"
                        fill="url(#colorGcp)"
                        name="GCP"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Previous Month</p>
                      <p className="text-lg font-semibold text-foreground">$5,513</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Current Month</p>
                      <p className="text-lg font-semibold text-secondary">$5,832</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Change</p>
                      <p className="text-lg font-semibold text-amber-400 flex items-center justify-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        +5.8%
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Cost by Provider Pie Chart */}
                <Card className="glass border-secondary/20 p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-secondary" />
                    Cost Distribution by Provider
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={costByProvider}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {costByProvider.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--popover-foreground))",
                        }}
                        labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                        itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                        formatter={(value: number) => `$${value.toFixed(2)}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {costByProvider.map((provider) => (
                      <div key={provider.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: provider.color }}
                          />
                          <span className="text-sm">{provider.name}</span>
                        </div>
                        <span className="text-sm font-semibold">
                          ${provider.value.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Top 10 Costliest Resources */}
                <Card className="glass border-secondary/20 p-6 lg:col-span-2">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Server className="h-5 w-5 text-secondary" />
                    Top 10 Costliest Resource Types
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={costByType} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                      <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                      <YAxis dataKey="type" type="category" stroke="#94a3b8" fontSize={11} width={200} />
                      <Tooltip
                        cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--popover-foreground))",
                        }}
                        labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                        itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                        formatter={(value: number) => `$${value.toFixed(2)}/mo`}
                      />
                      <Bar dataKey="cost" fill="#06b6d4" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-4">
              {/* Security Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="glass border-red-500/20 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Critical</p>
                      <h3 className="text-2xl font-bold text-red-400 mt-1">
                        {securityFindings.filter((f) => f.severity === "critical").length}
                      </h3>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-400" />
                  </div>
                </Card>
                <Card className="glass border-orange-500/20 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">High</p>
                      <h3 className="text-2xl font-bold text-orange-400 mt-1">
                        {securityFindings.filter((f) => f.severity === "high").length}
                      </h3>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-orange-400" />
                  </div>
                </Card>
                <Card className="glass border-amber-500/20 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Medium</p>
                      <h3 className="text-2xl font-bold text-amber-400 mt-1">
                        {securityFindings.filter((f) => f.severity === "medium").length}
                      </h3>
                    </div>
                    <Info className="h-8 w-8 text-amber-400" />
                  </div>
                </Card>
                <Card className="glass border-secondary/20 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Low</p>
                      <h3 className="text-2xl font-bold text-secondary mt-1">
                        {securityFindings.filter((f) => f.severity === "low").length}
                      </h3>
                    </div>
                    <Info className="h-8 w-8 text-secondary" />
                  </div>
                </Card>
              </div>

              {/* Security Findings */}
              <Card className="glass border-secondary/20 p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-secondary" />
                  Security Findings
                  <Badge variant="outline" className="ml-auto border-secondary/30">
                    Last scan: 2 hours ago
                  </Badge>
                </h3>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-3 pr-4">
                    {securityFindings.map((finding, idx) => (
                      <motion.div
                        key={finding.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <Card className="glass-dark border-secondary/20 p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {getSeverityBadge(finding.severity)}
                              <Badge variant="outline" className="border-secondary/30">
                                {finding.category}
                              </Badge>
                            </div>
                            <code className="text-xs font-mono text-secondary">
                              {finding.id}
                            </code>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <p className="text-xs text-muted-foreground">Resource</p>
                              <code className="text-sm font-mono text-foreground">
                                {finding.resource}
                              </code>
                            </div>

                            <div>
                              <p className="text-xs text-muted-foreground">Description</p>
                              <p className="text-sm">{finding.description}</p>
                            </div>

                            <div>
                              <p className="text-xs text-muted-foreground">Remediation</p>
                              <p className="text-sm text-emerald-400">{finding.remediation}</p>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-4">
                            <Button
                              size="sm"
                              variant="outline"
                              className="glass-dark border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                            >
                              <CheckCircle2 className="h-3 w-3 mr-2" />
                              Auto-Fix
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="glass-dark border-secondary/30"
                            >
                              <ExternalLink className="h-3 w-3 mr-2" />
                              Learn More
                            </Button>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </Card>
            </TabsContent>

            {/* State Tab */}
            <TabsContent value="state" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* State File Info */}
                <Card className="glass border-secondary/20 p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Database className="h-5 w-5 text-secondary" />
                    State File Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Backend Type</p>
                      <p className="text-sm font-mono mt-1">S3 (Remote)</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Bucket</p>
                      <code className="text-sm font-mono text-secondary">
                        terraform-state-prod-us-east-1
                      </code>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Key</p>
                      <code className="text-sm font-mono text-secondary">
                        production/terraform.tfstate
                      </code>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">State Version</p>
                      <p className="text-sm font-mono mt-1">4</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Terraform Version</p>
                      <p className="text-sm font-mono mt-1">1.6.4</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">File Size</p>
                      <p className="text-sm font-mono mt-1">234.7 KB</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Last Modified</p>
                      <p className="text-sm mt-1">2 hours ago</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Lock Status</p>
                      <div className="flex items-center gap-2 mt-1">
                        {stateLock.isLocked ? (
                          <>
                            <Lock className="h-4 w-4 text-amber-400" />
                            <span className="text-sm text-amber-400">
                              Locked by {stateLock.lockedBy}
                            </span>
                          </>
                        ) : (
                          <>
                            <Unlock className="h-4 w-4 text-emerald-400" />
                            <span className="text-sm text-emerald-400">Unlocked</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* State Operations */}
                <Card className="glass border-secondary/20 p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Settings className="h-5 w-5 text-secondary" />
                    State Operations
                  </h3>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start glass-dark border-secondary/30"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Pull State
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start glass-dark border-secondary/30"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Push State
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start glass-dark border-secondary/30"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh State
                    </Button>
                    <Separator className="bg-secondary/20" />
                    <p className="text-sm text-muted-foreground">Advanced Operations</p>
                    <Button
                      variant="outline"
                      className="w-full justify-start glass-dark border-amber-500/30 text-amber-400"
                    >
                      <Database className="h-4 w-4 mr-2" />
                      Import Resource
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start glass-dark border-amber-500/30 text-amber-400"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Resource
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start glass-dark border-red-500/30 text-red-400"
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Taint Resource
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start glass-dark border-red-500/30 text-red-400"
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Force Unlock
                    </Button>
                  </div>
                </Card>

                {/* State Version History */}
                <Card className="glass border-secondary/20 p-6 lg:col-span-2">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-secondary" />
                    State Version History
                  </h3>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-2 pr-4">
                      {[
                        { version: 4, timestamp: "2 hours ago", user: "CI/CD Pipeline", size: "234.7 KB" },
                        { version: 3, timestamp: "6 hours ago", user: "sarah.chen@company.com", size: "232.1 KB" },
                        { version: 2, timestamp: "Yesterday", user: "CI/CD Pipeline", size: "228.4 KB" },
                        { version: 1, timestamp: "2 days ago", user: "mike.rodriguez@company.com", size: "224.8 KB" },
                      ].map((version) => (
                        <Card
                          key={version.version}
                          className="glass-dark border-secondary/20 p-3 hover:border-secondary/40 cursor-pointer"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="border-secondary/30">
                                v{version.version}
                              </Badge>
                              <div>
                                <p className="text-sm">{version.user}</p>
                                <p className="text-xs text-muted-foreground">{version.timestamp}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-mono">{version.size}</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Plan Modal */}
      <AnimatePresence>
        {showPlanModal && (
          <Dialog open={showPlanModal} onOpenChange={setShowPlanModal}>
            <DialogContent className="glass-overlay border-secondary/30 max-w-4xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold terminal-glow">
                  Terraform Plan Preview
                </DialogTitle>
                <DialogDescription>
                  Review changes before applying to infrastructure
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Plan Summary */}
                <Card className="glass-dark border-secondary/20 p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">To Add</p>
                      <p className="text-2xl font-bold text-emerald-400">+2</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">To Change</p>
                      <p className="text-2xl font-bold text-amber-400">~5</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">To Destroy</p>
                      <p className="text-2xl font-bold text-red-400">-0</p>
                    </div>
                  </div>
                </Card>

                {/* Plan Output */}
                <div>
                  <p className="text-sm font-medium mb-2">Plan Output</p>
                  <ScrollArea className="h-[400px] glass-dark border border-secondary/20 rounded-lg p-4">
                    <pre className="text-xs font-mono">
                      <code className="text-muted-foreground">
{`Terraform used the selected providers to generate the following execution plan.
Resource actions are indicated with the following symbols:
  + create
  ~ update in-place
  - destroy

Terraform will perform the following actions:

  # aws_lambda_function.api-processor-v2 will be created
  + resource "aws_lambda_function" "api-processor-v2" {
      + arn                            = (known after apply)
      + function_name                  = "api-processor-v2"
      + handler                        = "index.handler"
      + runtime                        = "nodejs18.x"
      + memory_size                    = 256
      + timeout                        = 30
      + tags                           = {
          + "Environment" = "production"
          + "Team"        = "backend"
        }
    }

  # aws_instance.web-server-prod-1a will be updated in-place
  ~ resource "aws_instance" "web-server-prod-1a" {
        id                    = "i-0123456789abcdef0"
      ~ instance_type         = "t3.medium" -> "t3.large"
      ~ tags                  = {
          ~ "CostCenter" = "engineering" -> "platform"
            # (2 unchanged elements hidden)
        }
        # (15 unchanged attributes hidden)
    }

  # aws_s3_bucket.app-assets will be updated in-place
  ~ resource "aws_s3_bucket" "app-assets" {
        id     = "app-assets-prod"
      ~ versioning {
          ~ enabled = false -> true
        }
        # (8 unchanged blocks hidden)
    }

  # azurerm_kubernetes_cluster.aks-prod will be updated in-place
  ~ resource "azurerm_kubernetes_cluster" "aks-prod" {
        id                  = "/subscriptions/.../resourceGroups/rg-production/..."
        name                = "aks-prod-eastus"
      ~ default_node_pool {
          ~ node_count = 3 -> 5
            # (12 unchanged attributes hidden)
        }
        # (18 unchanged blocks hidden)
    }

Plan: 2 to add, 5 to change, 0 to destroy.

─────────────────────────────────────────────────────────────────────

Note: You didn't use the -out option to save this plan, so Terraform
can't guarantee to take exactly these actions if you run "terraform apply"
now.`}
                      </code>
                    </pre>
                  </ScrollArea>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowPlanModal(false)}
                  className="glass-dark border-secondary/30"
                >
                  Cancel
                </Button>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Zap className="h-4 w-4 mr-2" />
                  Apply Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Drift Details Modal */}
      <AnimatePresence>
        {showDriftModal && (
          <Dialog open={showDriftModal} onOpenChange={setShowDriftModal}>
            <DialogContent className="glass-overlay border-secondary/30 max-w-4xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold terminal-glow flex items-center gap-2">
                  <Activity className="h-5 w-5 text-amber-400" />
                  Drift Detection Details
                </DialogTitle>
                <DialogDescription>
                  {driftDetails.length} resources have drifted from their expected configuration
                </DialogDescription>
              </DialogHeader>

              <ScrollArea className="h-[500px]">
                <div className="space-y-3 pr-4">
                  {driftDetails.map((drift, idx) => (
                    <motion.div
                      key={`${drift.resourceId}-${drift.attribute}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Card className="glass-dark border-amber-500/20 p-4">
                        <div className="flex items-start justify-between mb-3">
                          <code className="text-sm font-mono text-secondary">
                            {drift.resourceId}
                          </code>
                          {getSeverityBadge(drift.severity)}
                        </div>

                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Attribute</p>
                            <code className="text-sm font-mono text-foreground">
                              {drift.attribute}
                            </code>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground">Expected</p>
                              <code className="text-sm font-mono text-emerald-400">
                                {drift.expected}
                              </code>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Actual</p>
                              <code className="text-sm font-mono text-red-400">
                                {drift.actual}
                              </code>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            variant="outline"
                            className="glass-dark border-emerald-500/30 text-emerald-400"
                          >
                            <RefreshCw className="h-3 w-3 mr-2" />
                            Auto-Remediate
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="glass-dark border-secondary/30"
                          >
                            <Eye className="h-3 w-3 mr-2" />
                            View Resource
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowDriftModal(false)}
                  className="glass-dark border-secondary/30"
                >
                  Close
                </Button>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Remediate All
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  )
}
