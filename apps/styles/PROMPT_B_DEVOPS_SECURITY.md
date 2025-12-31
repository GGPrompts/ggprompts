# Enterprise DevOps & Security Suite - Build Prompts for Claude.ai

## CONTEXT
I'm building a portfolio website with 95+ production-ready Next.js templates. I need you to create **3 advanced enterprise-grade DevOps/Security dashboards** that showcase understanding of containerization, infrastructure-as-code, and NIST compliance.

**Tech Stack:**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v3
- Framer Motion (3D animations)
- shadcn/ui components
- Glassmorphism design (terminal theme with emerald/cyan glow)

**File Location:** `/home/matt/projects/portfolio-style-guides/app/templates/[template-name]/page.tsx`

**Design System:**
- **Theme**: Terminal-inspired with emerald/cyan accents on dark slate
- **Glassmorphism**: Use `.glass` utility class (frosted glass effect)
- **Animations**: Framer Motion for hover effects, transitions, live updates
- **Icons**: lucide-react
- **Components**: Use shadcn/ui (Button, Card, Badge, Tabs, Dialog, Table, etc.)

---

## TEMPLATE 1: NIST COMPLIANCE DASHBOARD

### Requirements
Create a comprehensive security compliance dashboard at `/app/templates/nist-compliance/page.tsx`

**Core Features:**
1. **Compliance Overview:**
   - Overall compliance score (percentage + letter grade)
   - Framework selector (NIST 800-53, 800-171, CSF, FedRAMP)
   - Last audit date, next audit date
   - Trend chart (compliance score over last 6 months)
   - Risk heat map (by control family)

2. **Control Families (NIST 800-53):**
   Display cards for each family with status:
   - **AC** - Access Control (e.g., AC-1, AC-2, AC-3...)
   - **AU** - Audit and Accountability
   - **AT** - Awareness and Training
   - **CM** - Configuration Management
   - **CP** - Contingency Planning
   - **IA** - Identification and Authentication
   - **IR** - Incident Response
   - **MA** - Maintenance
   - **MP** - Media Protection
   - **PS** - Personnel Security
   - **PE** - Physical and Environmental Protection
   - **PL** - Planning
   - **RA** - Risk Assessment
   - **CA** - Security Assessment and Authorization
   - **SC** - System and Communications Protection
   - **SI** - System and Information Integrity
   - **SA** - System and Services Acquisition

   Each card shows:
   - Number of controls (e.g., "18 controls")
   - Compliance percentage
   - Status: Compliant, Partially Compliant, Non-Compliant
   - Last reviewed date
   - Click to expand and see individual controls

3. **Control Details Panel:**
   When clicking a family, show:
   - Control ID (e.g., AC-2: Account Management)
   - Control description
   - Implementation status (✓ Implemented, ⚠ Partially, ✗ Not Implemented)
   - Evidence uploaded (documents, screenshots)
   - Assigned to (team member)
   - Due date for remediation
   - Notes/comments

4. **Findings & Remediation:**
   - Table of open findings with severity (Critical, High, Medium, Low)
   - Remediation plan with timeline
   - Responsible party
   - POAM (Plan of Action & Milestones) tracker
   - Progress bars for each finding

5. **Audit History:**
   - Timeline of past audits
   - Findings from each audit
   - Remediation completion rate
   - Auditor notes

6. **Security Metrics:**
   - Mean Time to Remediate (MTTR)
   - Open vulnerabilities by severity
   - Compliance trend (improving/declining)
   - Control effectiveness scores

7. **Export & Reporting:**
   - Generate compliance report (PDF)
   - Export control matrix (CSV)
   - Share with auditors
   - Schedule automated reports

**Mock Data:**
- Overall compliance: 87% (B+ grade)
- Framework: NIST 800-53 Rev 5 (Moderate baseline)
- 320 total controls, 278 compliant, 31 partial, 11 non-compliant
- 15 open findings (2 critical, 4 high, 6 medium, 3 low)
- Last audit: 45 days ago
- 6 months of historical compliance data

**Design Notes:**
- Compliance score ring with gradient (red→amber→emerald)
- Control family cards use glassmorphism
- Heat map uses color coding (emerald=compliant, amber=partial, red=non-compliant)
- Findings table sortable and filterable
- Critical findings pulse with red glow

---

## TEMPLATE 2: KUBERNETES CLUSTER DASHBOARD

### Requirements
Create a container orchestration dashboard at `/app/templates/kubernetes-dashboard/page.tsx`

**Core Features:**
1. **Cluster Overview:**
   - Cluster name, version (e.g., k8s 1.28)
   - Cluster health status (Healthy/Degraded/Critical)
   - Total nodes, pods, services, deployments
   - CPU/Memory utilization (cluster-wide)
   - Network I/O, Disk I/O
   - Uptime

2. **Nodes Panel:**
   - List of nodes (control plane + worker nodes)
   - Node status (Ready/NotReady/Unknown)
   - CPU/Memory/Disk usage per node
   - Pod count per node
   - Node labels, taints, tolerations
   - Capacity vs allocation
   - Live metrics with sparklines

3. **Pods View:**
   - Running pods grouped by namespace
   - Pod status (Running/Pending/Failed/CrashLoopBackOff)
   - Container count per pod
   - CPU/Memory requests and limits
   - Restart count (with warning if >5)
   - Age (creation time)
   - Node assignment
   - Logs button (opens modal with sample logs)

4. **Deployments & Services:**
   - Deployments table: Name, Namespace, Replicas (desired/current/ready), Image, Age
   - Rolling update status
   - Services table: Name, Type (ClusterIP/NodePort/LoadBalancer), Ports, Endpoints
   - Ingress rules

5. **Resource Monitoring:**
   - Real-time CPU usage chart (per namespace)
   - Memory usage chart
   - Network throughput
   - Pod scaling events
   - Resource quota usage (by namespace)

6. **Events Stream:**
   - Live event feed (pod scheduled, image pulled, container started, etc.)
   - Event severity (Normal, Warning, Error)
   - Timestamp, object, reason, message
   - Filter by namespace, severity, object type

7. **Namespace Isolation:**
   - Namespace selector dropdown
   - Resource breakdown per namespace
   - RBAC (Role-Based Access Control) summary
   - Network policies
   - Resource quotas and limits

8. **Security & Compliance:**
   - Pod Security Standards (Privileged/Baseline/Restricted)
   - Security context violations
   - Image vulnerability scanning results
   - Secrets count (with encryption status)
   - Service accounts

**Mock Data:**
- 3 clusters: production (18 nodes), staging (6 nodes), dev (3 nodes)
- Production cluster: 240 pods across 12 namespaces
- Nodes: 3 control plane (4 CPU, 16GB RAM), 15 workers (8 CPU, 32GB RAM)
- 85% CPU utilization, 72% memory utilization
- Recent events: 10 pod startups, 2 warnings (image pull slow), 1 scaling event
- 45 deployments, 38 services, 12 ingress rules

**Design Notes:**
- Node cards with live CPU/memory gauges
- Pod status badges with color coding (emerald=running, amber=pending, red=failed)
- Events stream auto-updates with fade-in animation
- Resource charts use area gradients
- Cluster switcher in header

---

## TEMPLATE 3: TERRAFORM IaC DASHBOARD

### Requirements
Create an Infrastructure-as-Code management dashboard at `/app/templates/terraform-dashboard/page.tsx`

**Core Features:**
1. **Infrastructure Overview:**
   - Total resources managed (count)
   - Providers (AWS, Azure, GCP icons with resource counts)
   - Terraform version
   - State file location (S3, Terraform Cloud, etc.)
   - Last apply date/time
   - Drift detection status (In Sync / Drift Detected / Unknown)

2. **Resource Inventory:**
   - Table of all resources with columns:
     - Resource Type (aws_instance, azurerm_storage, google_compute_instance)
     - Resource Name
     - Provider
     - Region/Zone
     - Status (Created, Modified, Destroyed)
     - Cost (monthly estimate)
     - Tags
   - Group by provider, region, or resource type
   - Search and filter
   - Total cost estimate at bottom

3. **Deployment History:**
   - Timeline of terraform apply/destroy operations
   - Who triggered (user/CI pipeline)
   - Changes summary (X added, Y changed, Z destroyed)
   - Duration
   - Success/Failed status
   - Rollback button for recent deployments
   - Diff view (show what changed)

4. **Drift Detection:**
   - Resources out of sync with state
   - Drift details (expected vs actual)
   - Auto-remediation options
   - Manual changes detected
   - Schedule drift detection scans

5. **Infrastructure Graph:**
   - Visual dependency graph of resources
   - Nodes = resources, Edges = dependencies
   - Click node to see resource details
   - Highlight resource chains
   - Module boundaries shown

6. **Terraform Workspaces:**
   - Workspace selector (dev, staging, production)
   - Resource count per workspace
   - Variable overrides per workspace
   - Promote changes between workspaces

7. **Cost Analysis:**
   - Monthly cost breakdown by resource type
   - Trend chart (last 6 months)
   - Cost per environment
   - Recommendations to reduce cost
   - Budget alerts

8. **State Management:**
   - State file version history
   - Lock status (who has lock, duration)
   - State file size
   - Backup status
   - Manual state operations (import, remove, taint)

9. **Plan Preview:**
   - Run terraform plan
   - Show changes before apply
   - Resource count changes (+/-/~)
   - Color-coded diff (green=add, amber=modify, red=destroy)
   - Apply button (with confirmation dialog)

10. **Compliance & Security:**
    - Security group rules audit
    - Public IP exposure warnings
    - Encryption status (at-rest, in-transit)
    - IAM policy analysis
    - Best practice violations (checkov/tfsec results)

**Mock Data:**
- 347 resources across AWS (235), Azure (78), GCP (34)
- Last deployment: 2 hours ago by "CI/CD Pipeline"
- 12 resources drifted (manual changes detected)
- Monthly cost: $4,832 (trend: +8% vs last month)
- 3 workspaces: dev (45 resources), staging (89 resources), prod (213 resources)
- Recent deployments: 15 in last 7 days (14 successful, 1 failed with rollback)
- Providers: AWS (us-east-1, us-west-2), Azure (eastus), GCP (us-central1)

**Design Notes:**
- Resource status uses icon + color (✓ emerald, ⚠ amber, ✗ red)
- Deployment timeline vertical with connecting lines
- Diff view uses Monaco-style code editor look (syntax highlighting)
- Cost chart with stacked bars by provider
- Dependency graph uses force-directed layout
- Drift detection badge pulses if drift detected

---

## ADDITIONAL CONTEXT

### Why These Dashboards Matter (for Portfolio)

**NIST Compliance Dashboard:**
- Shows understanding of cybersecurity frameworks
- Relevant for government contractors, healthcare, finance
- Demonstrates knowledge of regulatory requirements

**Kubernetes Dashboard:**
- Container orchestration is industry standard
- Cloud-native architecture knowledge
- DevOps/SRE skillset demonstration

**Terraform Dashboard:**
- Infrastructure-as-Code is critical for modern DevOps
- Multi-cloud awareness
- Cost optimization understanding

### Real-World Tools These Emulate
- **NIST**: GRC platforms like Drata, Vanta, Secureframe
- **Kubernetes**: Rancher, Lens, k9s, Datadog
- **Terraform**: Terraform Cloud, Spacelift, env0

---

## IMPORTANT GUIDELINES

### File Structure
Each template should be a single `page.tsx` file:
```tsx
"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { /* icons */ } from "lucide-react"
import { /* shadcn components */ } from "@/components/ui/*"

export default function TemplateName() {
  // State and logic
  // Mock data generators
  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Template content */}
    </div>
  )
}
```

### Glassmorphism Classes
```css
.glass {
  background: rgba(16, 185, 129, 0.03);
  backdrop-filter: blur(12px);
  border: 1px solid hsl(var(--border) / 0.3);
  box-shadow:
    0 0 20px rgba(16, 185, 129, 0.1),
    inset 0 0 20px rgba(16, 185, 129, 0.02);
}

.terminal-glow {
  text-shadow:
    0 0 10px rgba(16, 185, 129, 0.5),
    0 0 20px rgba(16, 185, 129, 0.3);
}
```

### Mock Data Realism
Use realistic values:
- AWS resource names: `aws_instance.web-server-prod-1a`
- Kubernetes pod names: `nginx-deployment-7d8f6c9b5d-xk2p9`
- NIST controls: `AC-2: Account Management`
- Terraform state: `s3://terraform-state/prod/terraform.tfstate`

### Color Coding Standards
- **Healthy/Compliant**: Emerald (`text-emerald-500`)
- **Warning/Partial**: Amber (`text-amber-500`)
- **Critical/Failed**: Red (`text-red-500`)
- **Info**: Cyan (`text-cyan-500`)

---

## TASK FOR YOU

**Please create all 3 templates** in separate code blocks, following:
1. All TypeScript types defined
2. Realistic enterprise mock data
3. Full interactivity (filters, modals, live updates)
4. Glassmorphic design with terminal theme
5. Smooth Framer Motion animations
6. Responsive layout (mobile-first)
7. Comments explaining technical concepts

**Start with Template 1 (NIST Compliance), then Template 2 (Kubernetes), then Template 3 (Terraform).**

Each template should be 1000-1800 lines of production-quality code. Make them showcase DEEP technical knowledge!

### Pro Tips:
- Add tooltips explaining technical terms (e.g., "POAM = Plan of Action & Milestones")
- Include "Export to PDF" or "Generate Report" buttons (non-functional, just UI)
- Show timestamps with relative time ("2 hours ago")
- Use monospace font for resource IDs, code snippets
- Add loading states and skeleton screens for realism
