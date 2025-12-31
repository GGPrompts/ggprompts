"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  FileText,
  Download,
  Share2,
  Calendar,
  Users,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  Filter,
  Search,
  ChevronDown,
  ChevronRight,
  Info,
  AlertCircle,
  Target,
  Zap,
  Lock,
  Eye,
  Server,
  Database,
  Wifi,
  HardDrive,
  UserCheck,
  FileCheck,
  ClipboardCheck,
  ShieldAlert,
  Gauge,
  Upload,
  ExternalLink,
  RefreshCw,
  Settings,
  Bell,
  X,
} from "lucide-react"
import { Button, Card, Badge, Input, Tabs, TabsContent, TabsList, TabsTrigger, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, Progress, Separator, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@ggprompts/ui"
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  RadialBarChart,
  RadialBar,
} from "recharts"

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type ComplianceStatus = "compliant" | "partial" | "non-compliant"
type FindingSeverity = "critical" | "high" | "medium" | "low"
type ImplementationStatus = "implemented" | "partially-implemented" | "not-implemented" | "planned"
type Framework = "NIST-800-53" | "NIST-800-171" | "NIST-CSF" | "FedRAMP-Moderate" | "FedRAMP-High"

interface ControlFamily {
  id: string
  code: string
  name: string
  description: string
  icon: React.ElementType
  totalControls: number
  compliantControls: number
  partialControls: number
  nonCompliantControls: number
  compliancePercentage: number
  lastReviewed: string
  status: ComplianceStatus
  controls: Control[]
}

interface Control {
  id: string
  controlId: string
  familyCode: string
  title: string
  description: string
  baseline: string[] // ["Low", "Moderate", "High"]
  implementationStatus: ImplementationStatus
  evidence: Evidence[]
  assignedTo: string
  dueDate: string | null
  priority: "critical" | "high" | "medium" | "low"
  notes: string
  lastAssessed: string
  nextReview: string
}

interface Evidence {
  id: string
  type: "document" | "screenshot" | "log" | "certificate"
  name: string
  uploadDate: string
  uploadedBy: string
  size: string
}

interface Finding {
  id: string
  controlId: string
  controlTitle: string
  familyCode: string
  severity: FindingSeverity
  title: string
  description: string
  discoveredDate: string
  targetDate: string
  status: "open" | "in-progress" | "resolved" | "accepted-risk"
  assignedTo: string
  progress: number
  poamId: string // Plan of Action & Milestones ID
  remediation: string
  cost: number
  resources: string[]
}

interface Audit {
  id: string
  date: string
  auditor: string
  type: "internal" | "external" | "certification"
  framework: Framework
  score: number
  findingsCount: number
  criticalFindings: number
  status: "completed" | "in-progress" | "scheduled"
  report: string
  notes: string
}

interface ComplianceMetric {
  label: string
  value: string | number
  change: number
  trend: "up" | "down" | "stable"
  icon: React.ElementType
  description: string
}

interface ComplianceTrend {
  month: string
  score: number
  compliant: number
  partial: number
  nonCompliant: number
}

// ============================================================================
// MOCK DATA GENERATORS
// ============================================================================

const generateControlFamilies = (): ControlFamily[] => [
  {
    id: "ac",
    code: "AC",
    name: "Access Control",
    description: "Policies and procedures to limit information system access to authorized users",
    icon: Lock,
    totalControls: 25,
    compliantControls: 22,
    partialControls: 2,
    nonCompliantControls: 1,
    compliancePercentage: 92,
    lastReviewed: "2025-11-15",
    status: "compliant",
    controls: [
      {
        id: "ac-1",
        controlId: "AC-1",
        familyCode: "AC",
        title: "Policy and Procedures",
        description: "Develop, document, and disseminate access control policy and procedures",
        baseline: ["Low", "Moderate", "High"],
        implementationStatus: "implemented",
        evidence: [
          { id: "e1", type: "document", name: "Access_Control_Policy_v2.3.pdf", uploadDate: "2025-10-01", uploadedBy: "Sarah Chen", size: "1.2 MB" },
          { id: "e2", type: "document", name: "AC_Procedures_2025.docx", uploadDate: "2025-10-05", uploadedBy: "Sarah Chen", size: "856 KB" }
        ],
        assignedTo: "Sarah Chen",
        dueDate: null,
        priority: "high",
        notes: "Annual review completed. Policy updated to include zero-trust principles.",
        lastAssessed: "2025-11-10",
        nextReview: "2026-11-10"
      },
      {
        id: "ac-2",
        controlId: "AC-2",
        familyCode: "AC",
        title: "Account Management",
        description: "Manage information system accounts including creation, modification, and removal",
        baseline: ["Low", "Moderate", "High"],
        implementationStatus: "implemented",
        evidence: [
          { id: "e3", type: "screenshot", name: "Okta_Account_Provisioning.png", uploadDate: "2025-11-01", uploadedBy: "Mike Johnson", size: "2.1 MB" },
          { id: "e4", type: "log", name: "account_audit_Q4_2025.csv", uploadDate: "2025-11-08", uploadedBy: "System", size: "345 KB" }
        ],
        assignedTo: "Mike Johnson",
        dueDate: null,
        priority: "critical",
        notes: "Automated provisioning via Okta. Monthly access reviews conducted.",
        lastAssessed: "2025-11-12",
        nextReview: "2025-12-12"
      },
      {
        id: "ac-3",
        controlId: "AC-3",
        familyCode: "AC",
        title: "Access Enforcement",
        description: "Enforce approved authorizations for logical access based on policies",
        baseline: ["Low", "Moderate", "High"],
        implementationStatus: "partially-implemented",
        evidence: [
          { id: "e5", type: "screenshot", name: "RBAC_Configuration.png", uploadDate: "2025-10-20", uploadedBy: "Mike Johnson", size: "1.8 MB" }
        ],
        assignedTo: "Mike Johnson",
        dueDate: "2025-12-15",
        priority: "high",
        notes: "RBAC implemented for 90% of systems. Legacy applications need migration.",
        lastAssessed: "2025-11-05",
        nextReview: "2025-12-05"
      },
    ]
  },
  {
    id: "au",
    code: "AU",
    name: "Audit and Accountability",
    description: "Create, protect, and retain audit records to enable monitoring and investigation",
    icon: FileCheck,
    totalControls: 16,
    compliantControls: 14,
    partialControls: 2,
    nonCompliantControls: 0,
    compliancePercentage: 94,
    lastReviewed: "2025-11-18",
    status: "compliant",
    controls: [
      {
        id: "au-1",
        controlId: "AU-1",
        familyCode: "AU",
        title: "Policy and Procedures",
        description: "Develop, document, and disseminate audit and accountability policy",
        baseline: ["Low", "Moderate", "High"],
        implementationStatus: "implemented",
        evidence: [
          { id: "e6", type: "document", name: "Audit_Policy_v3.1.pdf", uploadDate: "2025-09-15", uploadedBy: "David Park", size: "980 KB" }
        ],
        assignedTo: "David Park",
        dueDate: null,
        priority: "high",
        notes: "Integrated with SIEM logging requirements.",
        lastAssessed: "2025-11-15",
        nextReview: "2026-11-15"
      },
      {
        id: "au-2",
        controlId: "AU-2",
        familyCode: "AU",
        title: "Event Logging",
        description: "Identify and log events that must be audited within the system",
        baseline: ["Low", "Moderate", "High"],
        implementationStatus: "implemented",
        evidence: [
          { id: "e7", type: "log", name: "SIEM_Event_Types.json", uploadDate: "2025-11-10", uploadedBy: "System", size: "125 KB" },
          { id: "e8", type: "screenshot", name: "Splunk_Dashboard.png", uploadDate: "2025-11-10", uploadedBy: "David Park", size: "3.2 MB" }
        ],
        assignedTo: "David Park",
        dueDate: null,
        priority: "critical",
        notes: "Splunk configured for centralized logging. 99.8% log coverage.",
        lastAssessed: "2025-11-18",
        nextReview: "2025-12-18"
      },
    ]
  },
  {
    id: "at",
    code: "AT",
    name: "Awareness and Training",
    description: "Security awareness and training programs for system users",
    icon: Users,
    totalControls: 6,
    compliantControls: 5,
    partialControls: 1,
    nonCompliantControls: 0,
    compliancePercentage: 89,
    lastReviewed: "2025-11-10",
    status: "compliant",
    controls: []
  },
  {
    id: "cm",
    code: "CM",
    name: "Configuration Management",
    description: "Establish and maintain baseline configurations and inventory of systems",
    icon: Settings,
    totalControls: 14,
    compliantControls: 11,
    partialControls: 2,
    nonCompliantControls: 1,
    compliancePercentage: 85,
    lastReviewed: "2025-11-12",
    status: "partial",
    controls: []
  },
  {
    id: "cp",
    code: "CP",
    name: "Contingency Planning",
    description: "Plans and procedures for system backup, recovery, and continuity",
    icon: RefreshCw,
    totalControls: 13,
    compliantControls: 12,
    partialControls: 1,
    nonCompliantControls: 0,
    compliancePercentage: 95,
    lastReviewed: "2025-11-08",
    status: "compliant",
    controls: []
  },
  {
    id: "ia",
    code: "IA",
    name: "Identification and Authentication",
    description: "Verify identities of users, processes, and devices",
    icon: UserCheck,
    totalControls: 12,
    compliantControls: 10,
    partialControls: 2,
    nonCompliantControls: 0,
    compliancePercentage: 90,
    lastReviewed: "2025-11-14",
    status: "compliant",
    controls: []
  },
  {
    id: "ir",
    code: "IR",
    name: "Incident Response",
    description: "Establish operational incident handling capability",
    icon: AlertCircle,
    totalControls: 10,
    compliantControls: 8,
    partialControls: 1,
    nonCompliantControls: 1,
    compliancePercentage: 85,
    lastReviewed: "2025-11-16",
    status: "partial",
    controls: []
  },
  {
    id: "ma",
    code: "MA",
    name: "Maintenance",
    description: "Perform periodic and timely system maintenance",
    icon: Activity,
    totalControls: 7,
    compliantControls: 6,
    partialControls: 1,
    nonCompliantControls: 0,
    compliancePercentage: 91,
    lastReviewed: "2025-11-05",
    status: "compliant",
    controls: []
  },
  {
    id: "mp",
    code: "MP",
    name: "Media Protection",
    description: "Protect system media and control physical access",
    icon: HardDrive,
    totalControls: 8,
    compliantControls: 7,
    partialControls: 0,
    nonCompliantControls: 1,
    compliancePercentage: 88,
    lastReviewed: "2025-10-28",
    status: "partial",
    controls: []
  },
  {
    id: "ps",
    code: "PS",
    name: "Personnel Security",
    description: "Ensure personnel are trustworthy and meet security requirements",
    icon: Users,
    totalControls: 9,
    compliantControls: 9,
    partialControls: 0,
    nonCompliantControls: 0,
    compliancePercentage: 100,
    lastReviewed: "2025-11-11",
    status: "compliant",
    controls: []
  },
  {
    id: "pe",
    code: "PE",
    name: "Physical and Environmental Protection",
    description: "Physical access controls and environmental protections",
    icon: Shield,
    totalControls: 20,
    compliantControls: 17,
    partialControls: 2,
    nonCompliantControls: 1,
    compliancePercentage: 89,
    lastReviewed: "2025-11-03",
    status: "compliant",
    controls: []
  },
  {
    id: "pl",
    code: "PL",
    name: "Planning",
    description: "Security planning to develop and implement system security plans",
    icon: Target,
    totalControls: 11,
    compliantControls: 10,
    partialControls: 1,
    nonCompliantControls: 0,
    compliancePercentage: 94,
    lastReviewed: "2025-11-07",
    status: "compliant",
    controls: []
  },
  {
    id: "ra",
    code: "RA",
    name: "Risk Assessment",
    description: "Assess risk and vulnerabilities to organizational operations",
    icon: ShieldAlert,
    totalControls: 10,
    compliantControls: 8,
    partialControls: 1,
    nonCompliantControls: 1,
    compliancePercentage: 85,
    lastReviewed: "2025-11-13",
    status: "partial",
    controls: []
  },
  {
    id: "ca",
    code: "CA",
    name: "Assessment, Authorization, and Monitoring",
    description: "Assess security controls and monitor effectiveness",
    icon: ClipboardCheck,
    totalControls: 9,
    compliantControls: 7,
    partialControls: 2,
    nonCompliantControls: 0,
    compliancePercentage: 86,
    lastReviewed: "2025-11-17",
    status: "partial",
    controls: []
  },
  {
    id: "sc",
    code: "SC",
    name: "System and Communications Protection",
    description: "Monitor, control, and protect communications at system boundaries",
    icon: Wifi,
    totalControls: 51,
    compliantControls: 43,
    partialControls: 5,
    nonCompliantControls: 3,
    compliancePercentage: 88,
    lastReviewed: "2025-11-09",
    status: "compliant",
    controls: []
  },
  {
    id: "si",
    code: "SI",
    name: "System and Information Integrity",
    description: "Identify, report, and correct information system flaws",
    icon: Database,
    totalControls: 23,
    compliantControls: 19,
    partialControls: 3,
    nonCompliantControls: 1,
    compliancePercentage: 87,
    lastReviewed: "2025-11-14",
    status: "compliant",
    controls: []
  },
  {
    id: "sa",
    code: "SA",
    name: "System and Services Acquisition",
    description: "Allocate resources and develop systems using secure development lifecycle",
    icon: Server,
    totalControls: 22,
    compliantControls: 18,
    partialControls: 3,
    nonCompliantControls: 1,
    compliancePercentage: 86,
    lastReviewed: "2025-11-06",
    status: "compliant",
    controls: []
  },
]

const generateFindings = (): Finding[] => [
  {
    id: "f1",
    controlId: "AC-3",
    controlTitle: "Access Enforcement",
    familyCode: "AC",
    severity: "high",
    title: "Legacy systems lack RBAC implementation",
    description: "Three legacy applications (Finance Portal, HR System, Legacy CRM) do not enforce role-based access control. Users have excessive permissions.",
    discoveredDate: "2025-10-15",
    targetDate: "2025-12-15",
    status: "in-progress",
    assignedTo: "Mike Johnson",
    progress: 65,
    poamId: "POAM-2025-003",
    remediation: "Migrate legacy applications to centralized IAM. Implement RBAC for all three systems. Estimated 6 weeks.",
    cost: 45000,
    resources: ["Mike Johnson", "External Consultant", "DevOps Team"]
  },
  {
    id: "f2",
    controlId: "CM-2",
    controlTitle: "Baseline Configuration",
    familyCode: "CM",
    severity: "critical",
    title: "Production servers missing security baseline",
    description: "12 production servers deployed without approved security baseline configuration. CIS benchmarks not applied.",
    discoveredDate: "2025-10-28",
    targetDate: "2025-11-30",
    status: "in-progress",
    assignedTo: "James Wilson",
    progress: 40,
    poamId: "POAM-2025-005",
    remediation: "Apply CIS Level 1 benchmarks to all servers. Automate baseline enforcement via Ansible.",
    cost: 0,
    resources: ["James Wilson", "Infrastructure Team"]
  },
  {
    id: "f3",
    controlId: "IR-8",
    controlTitle: "Incident Response Plan",
    familyCode: "IR",
    severity: "critical",
    title: "Incident response plan not tested in 18 months",
    description: "Required annual tabletop exercise not conducted. Last test was March 2024.",
    discoveredDate: "2025-11-01",
    targetDate: "2025-12-01",
    status: "open",
    assignedTo: "Emily Rodriguez",
    progress: 10,
    poamId: "POAM-2025-007",
    remediation: "Schedule and conduct tabletop exercise by Nov 30. Update plan based on findings.",
    cost: 8000,
    resources: ["Emily Rodriguez", "CISO", "External Facilitator"]
  },
  {
    id: "f4",
    controlId: "SC-7",
    controlTitle: "Boundary Protection",
    familyCode: "SC",
    severity: "high",
    title: "DMZ segmentation incomplete",
    description: "Web application servers in DMZ can communicate directly with database servers in internal network.",
    discoveredDate: "2025-10-20",
    targetDate: "2025-12-31",
    status: "in-progress",
    assignedTo: "Robert Kim",
    progress: 55,
    poamId: "POAM-2025-004",
    remediation: "Implement network segmentation. Deploy application proxies. Update firewall rules.",
    cost: 32000,
    resources: ["Robert Kim", "Network Team", "Security Architecture"]
  },
  {
    id: "f5",
    controlId: "SI-2",
    controlTitle: "Flaw Remediation",
    familyCode: "SI",
    severity: "high",
    title: "Critical vulnerabilities not patched within SLA",
    description: "5 critical CVEs identified 45+ days ago remain unpatched on production systems.",
    discoveredDate: "2025-10-05",
    targetDate: "2025-11-25",
    status: "in-progress",
    assignedTo: "David Park",
    progress: 80,
    poamId: "POAM-2025-002",
    remediation: "Emergency patching window scheduled. 4 of 5 CVEs patched. Final CVE requires application upgrade.",
    cost: 12000,
    resources: ["David Park", "Operations Team"]
  },
  {
    id: "f6",
    controlId: "MP-6",
    controlTitle: "Media Sanitization",
    familyCode: "MP",
    severity: "high",
    title: "Media sanitization procedures not documented",
    description: "No formal process for sanitizing storage media before disposal or reuse.",
    discoveredDate: "2025-10-12",
    targetDate: "2026-01-15",
    status: "open",
    assignedTo: "Lisa Martinez",
    progress: 20,
    poamId: "POAM-2025-006",
    remediation: "Document sanitization procedures. Train IT staff. Procure certified sanitization software.",
    cost: 5000,
    resources: ["Lisa Martinez", "IT Operations"]
  },
  {
    id: "f7",
    controlId: "RA-5",
    controlTitle: "Vulnerability Monitoring and Scanning",
    familyCode: "RA",
    severity: "medium",
    title: "Authenticated scanning not enabled for all systems",
    description: "15% of systems scanned with unauthenticated scans only, limiting vulnerability detection.",
    discoveredDate: "2025-11-05",
    targetDate: "2026-01-31",
    status: "open",
    assignedTo: "David Park",
    progress: 15,
    poamId: "POAM-2025-008",
    remediation: "Configure credential scanning for all in-scope systems. Update Tenable configuration.",
    cost: 3000,
    resources: ["David Park"]
  },
  {
    id: "f8",
    controlId: "SA-11",
    controlTitle: "Developer Testing and Evaluation",
    familyCode: "SA",
    severity: "medium",
    title: "SAST not integrated into all CI/CD pipelines",
    description: "Static application security testing missing from 3 of 8 active development pipelines.",
    discoveredDate: "2025-10-18",
    targetDate: "2025-12-20",
    status: "in-progress",
    assignedTo: "Jennifer Lee",
    progress: 70,
    poamId: "POAM-2025-009",
    remediation: "Integrate SonarQube into remaining pipelines. Enforce quality gates.",
    cost: 0,
    resources: ["Jennifer Lee", "DevOps Team"]
  },
  {
    id: "f9",
    controlId: "PE-3",
    controlTitle: "Physical Access Control",
    familyCode: "PE",
    severity: "medium",
    title: "Badge reader logs not reviewed monthly",
    description: "Physical access logs for data center not reviewed as required by policy (monthly).",
    discoveredDate: "2025-11-08",
    targetDate: "2025-12-08",
    status: "open",
    assignedTo: "Security Operations",
    progress: 5,
    poamId: "POAM-2025-010",
    remediation: "Assign responsibility for monthly reviews. Create review checklist and schedule.",
    cost: 0,
    resources: ["Security Operations"]
  },
  {
    id: "f10",
    controlId: "CA-2",
    controlTitle: "Control Assessments",
    familyCode: "CA",
    severity: "medium",
    title: "Annual control assessment delayed",
    description: "Fiscal year 2025 control assessment scheduled for Q4 not yet started.",
    discoveredDate: "2025-11-10",
    targetDate: "2026-02-28",
    status: "open",
    assignedTo: "Sarah Chen",
    progress: 0,
    poamId: "POAM-2025-011",
    remediation: "Engage third-party assessor. Schedule assessment for January 2026.",
    cost: 75000,
    resources: ["Sarah Chen", "External Assessor", "All Control Owners"]
  },
  {
    id: "f11",
    controlId: "AC-2",
    controlTitle: "Account Management",
    familyCode: "AC",
    severity: "low",
    title: "Quarterly access reviews completed late",
    description: "Q3 2025 access review completed 2 weeks past due date.",
    discoveredDate: "2025-10-22",
    targetDate: "2025-11-30",
    status: "resolved",
    assignedTo: "Mike Johnson",
    progress: 100,
    poamId: "POAM-2025-001",
    remediation: "Implement automated reminders 2 weeks before review due dates.",
    cost: 0,
    resources: ["Mike Johnson"]
  },
  {
    id: "f12",
    controlId: "CM-3",
    controlTitle: "Configuration Change Control",
    familyCode: "CM",
    severity: "medium",
    title: "Change control process bypassed",
    description: "Emergency change made to production firewall without proper CAB approval.",
    discoveredDate: "2025-11-02",
    targetDate: "2025-11-20",
    status: "in-progress",
    assignedTo: "Change Advisory Board",
    progress: 90,
    poamId: "POAM-2025-012",
    remediation: "Conduct root cause analysis. Update emergency change procedures. Provide training.",
    cost: 0,
    resources: ["Change Advisory Board", "IT Management"]
  },
  {
    id: "f13",
    controlId: "AU-9",
    controlTitle: "Protection of Audit Information",
    familyCode: "AU",
    severity: "low",
    title: "Audit log retention period inconsistent",
    description: "Application logs retained for 180 days while policy requires 365 days.",
    discoveredDate: "2025-10-30",
    targetDate: "2025-12-31",
    status: "in-progress",
    assignedTo: "David Park",
    progress: 50,
    poamId: "POAM-2025-013",
    remediation: "Increase S3 lifecycle retention to 365 days. Update log management documentation.",
    cost: 2400,
    resources: ["David Park", "Cloud Team"]
  },
  {
    id: "f14",
    controlId: "IA-5",
    controlTitle: "Authenticator Management",
    familyCode: "IA",
    severity: "low",
    title: "Password complexity not enforced on legacy system",
    description: "Legacy HR system allows 6-character passwords, below 12-character requirement.",
    discoveredDate: "2025-11-12",
    targetDate: "2026-03-31",
    status: "open",
    assignedTo: "Mike Johnson",
    progress: 0,
    poamId: "POAM-2025-014",
    remediation: "System scheduled for decommission Q1 2026. Accepted risk until replacement.",
    cost: 0,
    resources: ["Mike Johnson", "HR Team"]
  },
  {
    id: "f15",
    controlId: "SC-28",
    controlTitle: "Protection of Information at Rest",
    familyCode: "SC",
    severity: "medium",
    title: "Encryption at rest not enabled for all databases",
    description: "Development and staging databases not encrypted at rest.",
    discoveredDate: "2025-10-25",
    targetDate: "2025-12-10",
    status: "in-progress",
    assignedTo: "Database Team",
    progress: 35,
    poamId: "POAM-2025-015",
    remediation: "Enable TDE (Transparent Data Encryption) on all non-production databases.",
    cost: 0,
    resources: ["Database Team", "Robert Kim"]
  },
]

const generateAuditHistory = (): Audit[] => [
  {
    id: "a1",
    date: "2025-10-08",
    auditor: "CyberSec Assurance LLC",
    type: "external",
    framework: "NIST-800-53",
    score: 87,
    findingsCount: 15,
    criticalFindings: 2,
    status: "completed",
    report: "FY2025_Q3_Assessment_Report.pdf",
    notes: "Overall strong posture. Critical findings in CM and IR families require immediate attention."
  },
  {
    id: "a2",
    date: "2025-07-15",
    auditor: "Internal Audit Team",
    type: "internal",
    framework: "NIST-800-53",
    score: 84,
    findingsCount: 22,
    criticalFindings: 3,
    status: "completed",
    report: "FY2025_Q2_Internal_Audit.pdf",
    notes: "Improvement from Q1. Network segmentation project showing positive results."
  },
  {
    id: "a3",
    date: "2025-04-20",
    auditor: "FedRAMP 3PAO",
    type: "certification",
    framework: "FedRAMP-Moderate",
    score: 82,
    findingsCount: 28,
    criticalFindings: 4,
    status: "completed",
    report: "FedRAMP_Initial_Assessment.pdf",
    notes: "Conditional ATO granted. POAMs established for all findings with 90-day remediation timeline."
  },
  {
    id: "a4",
    date: "2025-02-10",
    auditor: "Internal Audit Team",
    type: "internal",
    framework: "NIST-800-53",
    score: 79,
    findingsCount: 31,
    criticalFindings: 5,
    status: "completed",
    report: "FY2025_Q1_Internal_Audit.pdf",
    notes: "Multiple control gaps identified. Significant remediation effort required."
  },
  {
    id: "a5",
    date: "2024-11-12",
    auditor: "CyberSec Assurance LLC",
    type: "external",
    framework: "NIST-800-53",
    score: 76,
    findingsCount: 35,
    criticalFindings: 6,
    status: "completed",
    report: "FY2024_Annual_Assessment.pdf",
    notes: "Baseline assessment post-migration to cloud infrastructure."
  },
  {
    id: "a6",
    date: "2026-01-15",
    auditor: "CyberSec Assurance LLC",
    type: "external",
    framework: "NIST-800-53",
    score: 0,
    findingsCount: 0,
    criticalFindings: 0,
    status: "scheduled",
    report: "",
    notes: "Annual FY2026 assessment. SOW finalized, awaiting kickoff."
  },
]

const generateComplianceTrends = (): ComplianceTrend[] => [
  { month: "Jun '25", score: 76, compliant: 246, partial: 48, nonCompliant: 26 },
  { month: "Jul '25", score: 79, compliant: 253, partial: 45, nonCompliant: 22 },
  { month: "Aug '25", score: 82, compliant: 262, partial: 42, nonCompliant: 16 },
  { month: "Sep '25", score: 84, compliant: 269, partial: 38, nonCompliant: 13 },
  { month: "Oct '25", score: 87, compliant: 278, partial: 31, nonCompliant: 11 },
  { month: "Nov '25", score: 87, compliant: 278, partial: 31, nonCompliant: 11 },
]

const generateMetrics = (): ComplianceMetric[] => [
  {
    label: "Mean Time to Remediate",
    value: "42 days",
    change: -12,
    trend: "down",
    icon: Clock,
    description: "Average time from finding discovery to resolution"
  },
  {
    label: "Control Effectiveness",
    value: "91.2%",
    change: 3.4,
    trend: "up",
    icon: Target,
    description: "Percentage of controls operating as intended"
  },
  {
    label: "Open Critical Findings",
    value: 2,
    change: -1,
    trend: "down",
    icon: AlertCircle,
    description: "Critical severity findings requiring immediate action"
  },
  {
    label: "Audit Readiness",
    value: "87%",
    change: 5,
    trend: "up",
    icon: CheckCircle,
    description: "Percentage of controls with current evidence"
  },
]

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function NistCompliance() {
  const [selectedFramework, setSelectedFramework] = useState<Framework>("NIST-800-53")
  const [selectedFamily, setSelectedFamily] = useState<ControlFamily | null>(null)
  const [selectedControl, setSelectedControl] = useState<Control | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<ComplianceStatus | "all">("all")
  const [findingFilter, setFindingFilter] = useState<FindingSeverity | "all">("all")
  const [showControlDetails, setShowControlDetails] = useState(false)
  const [expandedFamilies, setExpandedFamilies] = useState<Set<string>>(new Set())

  const controlFamilies = useMemo(() => generateControlFamilies(), [])
  const findings = useMemo(() => generateFindings(), [])
  const auditHistory = useMemo(() => generateAuditHistory(), [])
  const complianceTrends = useMemo(() => generateComplianceTrends(), [])
  const metrics = useMemo(() => generateMetrics(), [])

  // Calculate overall statistics
  const totalControls = controlFamilies.reduce((sum, family) => sum + family.totalControls, 0)
  const totalCompliant = controlFamilies.reduce((sum, family) => sum + family.compliantControls, 0)
  const totalPartial = controlFamilies.reduce((sum, family) => sum + family.partialControls, 0)
  const totalNonCompliant = controlFamilies.reduce((sum, family) => sum + family.nonCompliantControls, 0)
  const overallScore = Math.round((totalCompliant / totalControls) * 100)

  // Filter families
  const filteredFamilies = controlFamilies.filter(family => {
    const matchesSearch = family.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         family.code.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || family.status === filterStatus
    return matchesSearch && matchesStatus
  })

  // Filter findings
  const filteredFindings = findings.filter(finding => {
    return findingFilter === "all" || finding.severity === findingFilter
  })

  // Get letter grade
  const getLetterGrade = (score: number): string => {
    if (score >= 95) return "A+"
    if (score >= 90) return "A"
    if (score >= 85) return "B+"
    if (score >= 80) return "B"
    if (score >= 75) return "C+"
    if (score >= 70) return "C"
    return "D"
  }

  // Get status color
  const getStatusColor = (status: ComplianceStatus) => {
    switch (status) {
      case "compliant": return "text-primary border-primary/30 bg-primary/10"
      case "partial": return "text-amber-400 border-amber-500/30 bg-amber-500/10"
      case "non-compliant": return "text-red-400 border-red-500/30 bg-red-500/10"
    }
  }

  const getSeverityColor = (severity: FindingSeverity) => {
    switch (severity) {
      case "critical": return "text-red-400 border-red-500/30 bg-red-500/10"
      case "high": return "text-orange-400 border-orange-500/30 bg-orange-500/10"
      case "medium": return "text-amber-400 border-amber-500/30 bg-amber-500/10"
      case "low": return "text-secondary border-secondary/30 bg-secondary/10"
    }
  }

  const getImplementationStatusColor = (status: ImplementationStatus) => {
    switch (status) {
      case "implemented": return "text-primary bg-primary/10 border-primary/30"
      case "partially-implemented": return "text-amber-400 bg-amber-500/10 border-amber-500/30"
      case "not-implemented": return "text-red-400 bg-red-500/10 border-red-500/30"
      case "planned": return "text-secondary bg-secondary/10 border-secondary/30"
    }
  }

  const toggleFamilyExpansion = (familyId: string) => {
    const newExpanded = new Set(expandedFamilies)
    if (newExpanded.has(familyId)) {
      newExpanded.delete(familyId)
    } else {
      newExpanded.add(familyId)
    }
    setExpandedFamilies(newExpanded)
  }

  // Pie chart data for compliance distribution
  const pieData = [
    { name: "Compliant", value: totalCompliant, color: "#10b981" },
    { name: "Partial", value: totalPartial, color: "#f59e0b" },
    { name: "Non-Compliant", value: totalNonCompliant, color: "#ef4444" },
  ]

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <TooltipProvider>
      <div className="min-h-screen p-4 md:p-6 lg:p-8 space-y-6 lg:space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent terminal-glow mb-2">
              NIST Compliance Dashboard
            </h1>
            <p className="text-secondary/70 text-sm md:text-base">
              Framework compliance monitoring and audit management
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Select value={selectedFramework} onValueChange={(v) => setSelectedFramework(v as Framework)}>
              <SelectTrigger className="w-[200px] glass border-primary/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NIST-800-53">NIST 800-53 Rev 5</SelectItem>
                <SelectItem value="NIST-800-171">NIST 800-171</SelectItem>
                <SelectItem value="NIST-CSF">NIST Cybersecurity Framework</SelectItem>
                <SelectItem value="FedRAMP-Moderate">FedRAMP Moderate</SelectItem>
                <SelectItem value="FedRAMP-High">FedRAMP High</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="glass border-primary/30">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>

            <Button variant="outline" className="glass border-primary/30">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>

            <Button className="bg-primary/20 border border-primary/30 hover:bg-primary/30">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="glass border-primary/30 p-4 hover:border-primary/50 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-medium ${
                      metric.trend === "up" ? "text-primary" :
                      metric.trend === "down" ? "text-red-400" :
                      "text-secondary/70"
                    }`}>
                      {metric.trend === "up" ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : metric.trend === "down" ? (
                        <TrendingDown className="h-3 w-3" />
                      ) : null}
                      {Math.abs(metric.change)}%
                    </div>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <p className="text-2xl font-bold text-foreground mb-1">{metric.value}</p>
                        <p className="text-xs text-secondary/70">{metric.label}</p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">{metric.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Compliance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Compliance Score Ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass border-primary/30 p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <Gauge className="h-5 w-5 text-primary" />
                Overall Compliance
              </h3>

              <div className="flex flex-col items-center">
                <div className="relative w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      cx="50%"
                      cy="50%"
                      innerRadius="70%"
                      outerRadius="100%"
                      data={[{ score: overallScore, fill: overallScore >= 90 ? "#10b981" : overallScore >= 80 ? "#f59e0b" : "#ef4444" }]}
                      startAngle={90}
                      endAngle={-270}
                    >
                      <RadialBar
                        background
                        dataKey="score"
                        cornerRadius={10}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold terminal-glow">{overallScore}%</div>
                    <div className="text-2xl font-semibold text-primary mt-1">{getLetterGrade(overallScore)}</div>
                  </div>
                </div>

                <div className="mt-6 w-full space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-secondary/70">Total Controls</span>
                    <span className="font-mono font-semibold text-foreground">{totalControls}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <span className="text-secondary/70">Compliant</span>
                    </div>
                    <span className="font-mono font-semibold text-primary">{totalCompliant}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <span className="text-secondary/70">Partial</span>
                    </div>
                    <span className="font-mono font-semibold text-amber-400">{totalPartial}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-secondary/70">Non-Compliant</span>
                    </div>
                    <span className="font-mono font-semibold text-red-400">{totalNonCompliant}</span>
                  </div>
                </div>

                <Separator className="my-4 bg-primary/20" />

                <div className="w-full space-y-2 text-xs text-secondary/70">
                  <div className="flex justify-between">
                    <span>Last Audit:</span>
                    <span className="text-foreground">Oct 8, 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Next Audit:</span>
                    <span className="text-foreground">Jan 15, 2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Baseline:</span>
                    <span className="text-foreground font-mono">Moderate</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Compliance Trend */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="glass border-primary/30 p-6 h-full">
              <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Compliance Trend (Last 6 Months)
              </h3>

              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={complianceTrends}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary) / 0.1)" />
                  <XAxis
                    dataKey="month"
                    stroke="rgba(255, 255, 255, 0.5)"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis
                    stroke="rgba(255, 255, 255, 0.5)"
                    style={{ fontSize: '12px' }}
                    domain={[70, 100]}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      color: "hsl(var(--popover-foreground))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                      itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                    />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#scoreGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>

              <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
                <div className="text-center">
                  <p className="text-secondary/70 mb-1">6-Month Change</p>
                  <p className="text-lg font-bold text-primary">+11%</p>
                </div>
                <div className="text-center">
                  <p className="text-secondary/70 mb-1">Trend</p>
                  <p className="text-lg font-bold text-primary flex items-center justify-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    Improving
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-secondary/70 mb-1">Target</p>
                  <p className="text-lg font-bold text-foreground">90%</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Risk Heat Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass border-primary/30 p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-primary" />
              Risk Heat Map by Control Family
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9 gap-3">
              {controlFamilies.map((family) => (
                <motion.div
                  key={family.id}
                  whileHover={{ scale: 1.05 }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    family.compliancePercentage >= 90
                      ? "bg-primary/10 border-primary/30 hover:border-primary/50"
                      : family.compliancePercentage >= 80
                      ? "bg-amber-500/10 border-amber-500/30 hover:border-amber-500/50"
                      : "bg-red-500/10 border-red-500/30 hover:border-red-500/50"
                  }`}
                  onClick={() => {
                    setSelectedFamily(family)
                    toggleFamilyExpansion(family.id)
                  }}
                >
                  <div className="text-center">
                    <p className="font-mono text-lg font-bold text-foreground mb-1">
                      {family.code}
                    </p>
                    <p className={`text-2xl font-bold ${
                      family.compliancePercentage >= 90
                        ? "text-primary"
                        : family.compliancePercentage >= 80
                        ? "text-amber-400"
                        : "text-red-400"
                    }`}>
                      {family.compliancePercentage}%
                    </p>
                    <p className="text-xs text-secondary/70 mt-1">
                      {family.totalControls} controls
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-secondary/70">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-primary/20 border border-primary/30"></div>
                <span>≥90% Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-amber-500/20 border border-amber-500/30"></div>
                <span>80-89% Partial</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-500/20 border border-red-500/30"></div>
                <span>&lt;80% At Risk</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Control Families & Findings Tabs */}
        <Tabs defaultValue="families" className="space-y-6">
          <TabsList className="glass border border-primary/30">
            <TabsTrigger value="families" className="data-[state=active]:bg-primary/20">
              Control Families
            </TabsTrigger>
            <TabsTrigger value="findings" className="data-[state=active]:bg-primary/20">
              Findings & POAM
            </TabsTrigger>
            <TabsTrigger value="audits" className="data-[state=active]:bg-primary/20">
              Audit History
            </TabsTrigger>
          </TabsList>

          {/* Control Families Tab */}
          <TabsContent value="families" className="space-y-4">
            <Card className="glass border-primary/30 p-4">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary/50" />
                  <Input
                    placeholder="Search control families..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 glass border-primary/30"
                  />
                </div>

                <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as ComplianceStatus | "all")}>
                  <SelectTrigger className="w-[200px] glass border-primary/30">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="compliant">Compliant</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="non-compliant">Non-Compliant</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                {filteredFamilies.map((family, index) => {
                  const Icon = family.icon
                  const isExpanded = expandedFamilies.has(family.id)
                  const hasControls = family.controls && family.controls.length > 0

                  return (
                    <motion.div
                      key={family.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <Card className="glass-dark border-primary/20 p-4 hover:border-primary/40 transition-all">
                        <div
                          className="flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                          onClick={() => hasControls && toggleFamilyExpansion(family.id)}
                        >
                          <div className="flex items-start gap-4 flex-1">
                            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                              <Icon className="h-6 w-6 text-primary" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-mono text-sm font-bold text-primary">
                                  {family.code}
                                </h4>
                                <h4 className="text-base font-semibold text-foreground">
                                  {family.name}
                                </h4>
                                {hasControls && (
                                  <div className="ml-auto">
                                    {isExpanded ? (
                                      <ChevronDown className="h-5 w-5 text-secondary/70" />
                                    ) : (
                                      <ChevronRight className="h-5 w-5 text-secondary/70" />
                                    )}
                                  </div>
                                )}
                              </div>
                              <p className="text-sm text-secondary/70 mb-3">
                                {family.description}
                              </p>

                              <div className="flex flex-wrap items-center gap-3 text-xs">
                                <Badge className={getStatusColor(family.status)}>
                                  {family.status === "compliant" && <CheckCircle className="h-3 w-3 mr-1" />}
                                  {family.status === "partial" && <AlertTriangle className="h-3 w-3 mr-1" />}
                                  {family.status === "non-compliant" && <XCircle className="h-3 w-3 mr-1" />}
                                  {family.status.replace("-", " ").toUpperCase()}
                                </Badge>

                                <span className="text-secondary/70">
                                  {family.totalControls} controls
                                </span>
                                <span className="text-primary">
                                  {family.compliantControls} compliant
                                </span>
                                {family.partialControls > 0 && (
                                  <span className="text-amber-400">
                                    {family.partialControls} partial
                                  </span>
                                )}
                                {family.nonCompliantControls > 0 && (
                                  <span className="text-red-400">
                                    {family.nonCompliantControls} non-compliant
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2 md:min-w-[180px]">
                            <div className="text-3xl font-bold terminal-glow">
                              {family.compliancePercentage}%
                            </div>
                            <Progress
                              value={family.compliancePercentage}
                              className="w-full md:w-32 h-2"
                            />
                            <p className="text-xs text-secondary/70">
                              Last reviewed: {new Date(family.lastReviewed).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Expanded Controls */}
                        <AnimatePresence>
                          {isExpanded && hasControls && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <Separator className="my-4 bg-primary/20" />
                              <div className="space-y-2">
                                <h5 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                                  <FileCheck className="h-4 w-4 text-primary" />
                                  Individual Controls ({family.controls.length})
                                </h5>
                                {family.controls.map((control) => (
                                  <div
                                    key={control.id}
                                    className="p-3 rounded-lg glass-overlay border border-primary/10 hover:border-primary/30 transition-all cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setSelectedControl(control)
                                      setShowControlDetails(true)
                                    }}
                                  >
                                    <div className="flex items-start justify-between gap-4">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                          <code className="font-mono text-sm font-bold text-secondary">
                                            {control.controlId}
                                          </code>
                                          <h6 className="text-sm font-semibold text-foreground">
                                            {control.title}
                                          </h6>
                                        </div>
                                        <p className="text-xs text-secondary/70 mb-2">
                                          {control.description}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-2">
                                          <Badge className={getImplementationStatusColor(control.implementationStatus)}>
                                            {control.implementationStatus.replace("-", " ")}
                                          </Badge>
                                          <Badge variant="outline" className="text-xs border-primary/20">
                                            {control.evidence.length} evidence
                                          </Badge>
                                          <span className="text-xs text-secondary/70">
                                            Assigned: {control.assignedTo}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {control.implementationStatus === "implemented" ? (
                                          <CheckCircle className="h-5 w-5 text-primary" />
                                        ) : control.implementationStatus === "partially-implemented" ? (
                                          <AlertTriangle className="h-5 w-5 text-amber-400" />
                                        ) : (
                                          <XCircle className="h-5 w-5 text-red-400" />
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </Card>
          </TabsContent>

          {/* Findings & POAM Tab */}
          <TabsContent value="findings" className="space-y-4">
            <Card className="glass border-primary/30 p-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-primary" />
                    Open Findings & POAM
                  </h3>
                  <p className="text-sm text-secondary/70 mt-1">
                    Plan of Action & Milestones for remediation tracking
                  </p>
                </div>

                <Select value={findingFilter} onValueChange={(v) => setFindingFilter(v as FindingSeverity | "all")}>
                  <SelectTrigger className="w-[180px] glass border-primary/30">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Findings Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 rounded-lg glass-dark border border-red-500/30">
                  <div className="text-2xl font-bold text-red-400 mb-1">
                    {findings.filter(f => f.severity === "critical").length}
                  </div>
                  <div className="text-xs text-secondary/70">Critical</div>
                </div>
                <div className="p-4 rounded-lg glass-dark border border-orange-500/30">
                  <div className="text-2xl font-bold text-orange-400 mb-1">
                    {findings.filter(f => f.severity === "high").length}
                  </div>
                  <div className="text-xs text-secondary/70">High</div>
                </div>
                <div className="p-4 rounded-lg glass-dark border border-amber-500/30">
                  <div className="text-2xl font-bold text-amber-400 mb-1">
                    {findings.filter(f => f.severity === "medium").length}
                  </div>
                  <div className="text-xs text-secondary/70">Medium</div>
                </div>
                <div className="p-4 rounded-lg glass-dark border border-secondary/30">
                  <div className="text-2xl font-bold text-secondary mb-1">
                    {findings.filter(f => f.severity === "low").length}
                  </div>
                  <div className="text-xs text-secondary/70">Low</div>
                </div>
              </div>

              {/* Findings List */}
              <div className="space-y-3">
                {filteredFindings.map((finding, index) => (
                  <motion.div
                    key={finding.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Card className={`glass-dark border p-4 hover:border-primary/40 transition-all ${
                      finding.severity === "critical" ? "border-red-500/30 animate-pulse-slow" : "border-primary/20"
                    }`}>
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <Badge className={getSeverityColor(finding.severity)}>
                              {finding.severity === "critical" && "🔴"}
                              {finding.severity === "high" && "🟠"}
                              {finding.severity === "medium" && "🟡"}
                              {finding.severity === "low" && "🔵"}
                              {" "}{finding.severity.toUpperCase()}
                            </Badge>
                            <code className="font-mono text-sm font-bold text-secondary">
                              {finding.controlId}
                            </code>
                            <span className="text-sm text-secondary/70">
                              {finding.controlTitle}
                            </span>
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge variant="outline" className="text-xs border-primary/20">
                                  {finding.poamId}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">Plan of Action & Milestones ID</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>

                          <h4 className="text-base font-semibold text-foreground mb-2">
                            {finding.title}
                          </h4>
                          <p className="text-sm text-secondary/70 mb-3">
                            {finding.description}
                          </p>

                          <div className="space-y-2 text-xs text-secondary/70">
                            <div className="flex items-center gap-2">
                              <Target className="h-3 w-3" />
                              <span className="font-semibold text-foreground">Remediation:</span>
                              <span>{finding.remediation}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-4">
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                <span>Discovered: {new Date(finding.discoveredDate).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3" />
                                <span className={
                                  new Date(finding.targetDate) < new Date() ? "text-red-400 font-semibold" : ""
                                }>
                                  Target: {new Date(finding.targetDate).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="h-3 w-3" />
                                <span>Assigned: {finding.assignedTo}</span>
                              </div>
                              {finding.cost > 0 && (
                                <div className="flex items-center gap-2">
                                  <span>Cost: ${finding.cost.toLocaleString()}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="lg:w-64 space-y-3">
                          <div>
                            <div className="flex items-center justify-between text-xs mb-2">
                              <span className="text-secondary/70">Progress</span>
                              <span className="font-mono font-bold text-foreground">{finding.progress}%</span>
                            </div>
                            <Progress value={finding.progress} className="h-2" />
                          </div>

                          <div className="flex items-center justify-between">
                            <Badge
                              className={
                                finding.status === "resolved" ? "bg-primary/20 text-primary border-primary/30" :
                                finding.status === "in-progress" ? "bg-secondary/20 text-secondary border-secondary/30" :
                                finding.status === "accepted-risk" ? "bg-amber-500/20 text-amber-400 border-amber-500/30" :
                                "bg-red-500/20 text-red-400 border-red-500/30"
                              }
                            >
                              {finding.status.replace("-", " ")}
                            </Badge>
                          </div>

                          {finding.resources.length > 0 && (
                            <div>
                              <p className="text-xs text-secondary/70 mb-1">Resources:</p>
                              <div className="flex flex-wrap gap-1">
                                {finding.resources.map((resource, i) => (
                                  <Badge key={i} variant="outline" className="text-xs border-primary/20">
                                    {resource}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Audit History Tab */}
          <TabsContent value="audits" className="space-y-4">
            <Card className="glass border-primary/30 p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Audit History & Timeline
              </h3>

              <div className="space-y-4">
                {auditHistory.map((audit, index) => (
                  <motion.div
                    key={audit.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={`glass-dark border p-4 ${
                      audit.status === "scheduled" ? "border-cyan-500/30" : "border-primary/20"
                    }`}>
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <Badge className={
                              audit.status === "completed" ? "bg-primary/20 text-primary border-primary/30" :
                              audit.status === "in-progress" ? "bg-secondary/20 text-secondary border-secondary/30" :
                              "bg-amber-500/20 text-amber-400 border-amber-500/30"
                            }>
                              {audit.status}
                            </Badge>
                            <Badge variant="outline" className="border-primary/20">
                              {audit.type}
                            </Badge>
                            <Badge variant="outline" className="border-primary/20">
                              {audit.framework}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-base font-semibold text-foreground">
                              {new Date(audit.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                              })}
                            </h4>
                            {audit.score > 0 && (
                              <span className="text-2xl font-bold terminal-glow">
                                {audit.score}%
                              </span>
                            )}
                          </div>

                          <p className="text-sm text-secondary/70 mb-3">
                            Auditor: <span className="text-foreground">{audit.auditor}</span>
                          </p>

                          {audit.status === "completed" && (
                            <div className="flex flex-wrap items-center gap-4 text-xs text-secondary/70 mb-3">
                              <div className="flex items-center gap-2">
                                <AlertCircle className="h-3 w-3" />
                                <span>{audit.findingsCount} findings</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <XCircle className="h-3 w-3 text-red-400" />
                                <span className="text-red-400">{audit.criticalFindings} critical</span>
                              </div>
                              {audit.report && (
                                <div className="flex items-center gap-2">
                                  <FileText className="h-3 w-3" />
                                  <span>{audit.report}</span>
                                </div>
                              )}
                            </div>
                          )}

                          <p className="text-sm text-secondary/70 italic">
                            {audit.notes}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2">
                          {audit.report && (
                            <Button variant="outline" size="sm" className="glass border-primary/30">
                              <Download className="h-4 w-4 mr-2" />
                              Download Report
                            </Button>
                          )}
                          <Button variant="outline" size="sm" className="glass border-primary/30">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Audit Trend Chart */}
              <div className="mt-8">
                <h4 className="text-sm font-semibold text-foreground mb-4">Audit Score Trend</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={auditHistory.filter(a => a.status === "completed").reverse()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary) / 0.1)" />
                    <XAxis
                      dataKey="date"
                      stroke="rgba(255, 255, 255, 0.5)"
                      style={{ fontSize: '10px' }}
                      tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", year: "2-digit" })}
                    />
                    <YAxis
                      stroke="rgba(255, 255, 255, 0.5)"
                      style={{ fontSize: '10px' }}
                      domain={[70, 100]}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        color: "hsl(var(--popover-foreground))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                      itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Control Details Dialog */}
        <Dialog open={showControlDetails} onOpenChange={setShowControlDetails}>
          <DialogContent className="glass-overlay border border-primary/30 max-w-3xl max-h-[90vh] overflow-y-auto">
            {selectedControl && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3 text-xl">
                    <code className="font-mono text-lg font-bold text-secondary terminal-glow">
                      {selectedControl.controlId}
                    </code>
                    <span>{selectedControl.title}</span>
                  </DialogTitle>
                  <DialogDescription className="text-secondary/70 text-sm mt-2">
                    {selectedControl.description}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                  {/* Status & Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-secondary/70 mb-2">Implementation Status</p>
                      <Badge className={getImplementationStatusColor(selectedControl.implementationStatus)}>
                        {selectedControl.implementationStatus.replace("-", " ").toUpperCase()}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-secondary/70 mb-2">Priority</p>
                      <Badge className={getSeverityColor(selectedControl.priority)}>
                        {selectedControl.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-secondary/70 mb-2">Baseline Applicability</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedControl.baseline.map((b) => (
                          <Badge key={b} variant="outline" className="text-xs border-primary/20">
                            {b}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-secondary/70 mb-2">Assigned To</p>
                      <p className="text-sm font-medium text-foreground">{selectedControl.assignedTo}</p>
                    </div>
                  </div>

                  <Separator className="bg-primary/20" />

                  {/* Assessment Dates */}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-secondary/70 mb-1">Last Assessed</p>
                      <p className="text-foreground font-medium">
                        {new Date(selectedControl.lastAssessed).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-secondary/70 mb-1">Next Review</p>
                      <p className="text-foreground font-medium">
                        {new Date(selectedControl.nextReview).toLocaleDateString()}
                      </p>
                    </div>
                    {selectedControl.dueDate && (
                      <div>
                        <p className="text-xs text-secondary/70 mb-1">Due Date</p>
                        <p className="text-red-400 font-medium">
                          {new Date(selectedControl.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  <Separator className="bg-primary/20" />

                  {/* Evidence */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Upload className="h-4 w-4 text-primary" />
                      Evidence ({selectedControl.evidence.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedControl.evidence.map((evidence) => (
                        <div
                          key={evidence.id}
                          className="flex items-center justify-between p-3 rounded-lg glass-dark border border-primary/10"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="p-2 rounded bg-primary/10">
                              {evidence.type === "document" && <FileText className="h-4 w-4 text-primary" />}
                              {evidence.type === "screenshot" && <Eye className="h-4 w-4 text-primary" />}
                              {evidence.type === "log" && <Activity className="h-4 w-4 text-primary" />}
                              {evidence.type === "certificate" && <Shield className="h-4 w-4 text-primary" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {evidence.name}
                              </p>
                              <p className="text-xs text-secondary/70">
                                {evidence.uploadedBy} • {new Date(evidence.uploadDate).toLocaleDateString()} • {evidence.size}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="ml-2">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {selectedControl.evidence.length === 0 && (
                        <p className="text-sm text-secondary/70 text-center py-4">
                          No evidence uploaded yet
                        </p>
                      )}
                    </div>
                    <Button variant="outline" className="w-full mt-3 glass border-primary/30">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Evidence
                    </Button>
                  </div>

                  {/* Notes */}
                  {selectedControl.notes && (
                    <>
                      <Separator className="bg-primary/20" />
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-2">Notes</h4>
                        <p className="text-sm text-secondary/70 italic">
                          {selectedControl.notes}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}
