'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Shield,
  Lock,
  Key,
  Eye,
  Database,
  Server,
  Cloud,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  Award,
  Users,
  Clock,
  Globe,
  Smartphone,
  FileText,
  Download,
  ExternalLink,
  ArrowRight,
  Zap,
  Target,
  Building2,
  Scale,
  Fingerprint,
  Search,
  Bug,
  DollarSign,
  Mail,
  ChevronRight,
  Info,
  Code
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

// Security features
const securityFeatures = [
  {
    id: 'encryption',
    icon: Lock,
    title: 'End-to-End Encryption',
    description: 'All data encrypted in transit and at rest with AES-256',
    details: 'Military-grade encryption protects your data from unauthorized access. We use TLS 1.3 for data in transit and AES-256 for data at rest.',
    metrics: { value: 'AES-256', label: 'Encryption Standard' }
  },
  {
    id: 'authentication',
    icon: Key,
    title: 'Multi-Factor Authentication',
    description: 'Support for 2FA, MFA, and biometric authentication',
    details: 'Add an extra layer of security with time-based one-time passwords (TOTP), SMS, hardware keys (WebAuthn), and biometric authentication.',
    metrics: { value: '2FA/MFA', label: 'Auth Methods' }
  },
  {
    id: 'sso',
    icon: Fingerprint,
    title: 'Single Sign-On (SSO)',
    description: 'SAML 2.0 and OAuth 2.0 support for enterprise authentication',
    details: 'Integrate with your identity provider (Okta, Azure AD, Google Workspace) for centralized authentication and authorization.',
    metrics: { value: 'SAML/OAuth', label: 'SSO Support' }
  },
  {
    id: 'access-control',
    icon: Users,
    title: 'Role-Based Access Control',
    description: 'Granular permissions and role management',
    details: 'Define custom roles and permissions to control who can access what. Support for team hierarchies and resource-level permissions.',
    metrics: { value: '100+', label: 'Permission Levels' }
  },
  {
    id: 'audit-logs',
    icon: FileCheck,
    title: 'Comprehensive Audit Logs',
    description: 'Track all actions with immutable audit trails',
    details: 'Every action is logged with timestamps, user information, and IP addresses. Logs are tamper-proof and retained for compliance.',
    metrics: { value: '100%', label: 'Coverage' }
  },
  {
    id: 'backups',
    icon: Database,
    title: 'Automated Backups',
    description: 'Hourly backups with point-in-time recovery',
    details: 'Automated backups run every hour with 90-day retention. Restore to any point in time with a single click.',
    metrics: { value: 'Hourly', label: 'Backup Frequency' }
  },
  {
    id: 'ddos',
    icon: Shield,
    title: 'DDoS Protection',
    description: 'Enterprise-grade protection against attacks',
    details: 'Multi-layered DDoS mitigation with automatic threat detection and response. Protected by Cloudflare Enterprise.',
    metrics: { value: '99.99%', label: 'Uptime SLA' }
  },
  {
    id: 'monitoring',
    icon: Eye,
    title: '24/7 Monitoring',
    description: 'Real-time threat detection and response',
    details: 'Our security team monitors systems around the clock for suspicious activity. Automated alerts and incident response procedures.',
    metrics: { value: '24/7', label: 'Monitoring' }
  },
  {
    id: 'data-residency',
    icon: Globe,
    title: 'Data Residency',
    description: 'Choose where your data is stored',
    details: 'Select from multiple geographic regions to comply with data residency requirements. Data never leaves your chosen region.',
    metrics: { value: '5', label: 'Regions' }
  },
  {
    id: 'mobile-security',
    icon: Smartphone,
    title: 'Mobile App Security',
    description: 'Secure native mobile applications',
    details: 'iOS and Android apps with certificate pinning, secure storage, and biometric authentication.',
    metrics: { value: 'Secure', label: 'Mobile Apps' }
  },
  {
    id: 'api-security',
    icon: Server,
    title: 'API Security',
    description: 'Rate limiting and API key management',
    details: 'OAuth 2.0, API key rotation, rate limiting, and IP whitelisting for secure API access.',
    metrics: { value: 'OAuth 2.0', label: 'API Auth' }
  },
  {
    id: 'vulnerability',
    icon: Search,
    title: 'Vulnerability Scanning',
    description: 'Continuous security testing and patching',
    details: 'Automated vulnerability scans, dependency checks, and security patches applied within 24 hours of disclosure.',
    metrics: { value: '<24h', label: 'Patch Time' }
  }
]

// Compliance certifications
const certifications = [
  {
    id: 'soc2',
    name: 'SOC 2 Type II',
    icon: Award,
    description: 'Audited controls for security, availability, and confidentiality',
    status: 'Certified',
    year: '2024',
    report: true
  },
  {
    id: 'gdpr',
    name: 'GDPR Compliant',
    icon: Scale,
    description: 'Full compliance with European data protection regulations',
    status: 'Compliant',
    year: '2024',
    report: false
  },
  {
    id: 'hipaa',
    name: 'HIPAA Compliant',
    icon: Shield,
    description: 'Healthcare data protection and privacy standards',
    status: 'Certified',
    year: '2024',
    report: true
  },
  {
    id: 'iso',
    name: 'ISO 27001',
    icon: Award,
    description: 'International standard for information security management',
    status: 'In Progress',
    year: '2024',
    report: false
  },
  {
    id: 'pci',
    name: 'PCI DSS',
    icon: Shield,
    description: 'Payment card industry data security standards',
    status: 'Certified',
    year: '2024',
    report: true
  },
  {
    id: 'ccpa',
    name: 'CCPA Compliant',
    icon: Scale,
    description: 'California consumer privacy act compliance',
    status: 'Compliant',
    year: '2024',
    report: false
  }
]

// Security practices
const practices = [
  {
    category: 'Development',
    icon: Code,
    items: [
      'Secure software development lifecycle (SDLC)',
      'Code reviews and pair programming',
      'Automated security testing in CI/CD',
      'Dependency vulnerability scanning',
      'Static application security testing (SAST)',
      'Dynamic application security testing (DAST)'
    ]
  },
  {
    category: 'Infrastructure',
    icon: Cloud,
    items: [
      'Multi-region redundancy',
      'Zero-trust network architecture',
      'Infrastructure as code (IaC) with security scanning',
      'Container security and image scanning',
      'Network segmentation and firewalls',
      'Regular security patches and updates'
    ]
  },
  {
    category: 'Operations',
    icon: Target,
    items: [
      'Incident response plan and procedures',
      'Regular disaster recovery drills',
      'Security awareness training for all employees',
      'Background checks for all team members',
      'Vendor security assessments',
      'Regular penetration testing'
    ]
  },
  {
    category: 'Data',
    icon: Database,
    items: [
      'Data classification and handling procedures',
      'Encryption at rest and in transit',
      'Secure data deletion and retention policies',
      'Regular backup testing and validation',
      'Data loss prevention (DLP) tools',
      'Privacy by design principles'
    ]
  }
]

// Incident history
const incidents = [
  {
    date: 'No incidents reported',
    type: 'Clean Record',
    severity: 'success',
    description: 'We have had zero security breaches or data incidents since founding.',
    impact: 'N/A',
    resolution: 'N/A'
  }
]

// Bug bounty program
const bugBountyTiers = [
  {
    severity: 'Critical',
    reward: '$5,000 - $10,000',
    description: 'Remote code execution, authentication bypass, SQL injection affecting production',
    icon: AlertTriangle,
    color: 'text-red-500'
  },
  {
    severity: 'High',
    reward: '$2,000 - $5,000',
    description: 'Privilege escalation, XSS with data access, CSRF on critical endpoints',
    icon: AlertTriangle,
    color: 'text-orange-500'
  },
  {
    severity: 'Medium',
    reward: '$500 - $2,000',
    description: 'Information disclosure, business logic flaws, rate limiting bypass',
    icon: Info,
    color: 'text-yellow-500'
  },
  {
    severity: 'Low',
    reward: '$100 - $500',
    description: 'Security misconfigurations, outdated dependencies, minor information leaks',
    icon: Info,
    color: 'text-blue-500'
  }
]

export default function SecurityPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredFeatures = selectedCategory === 'all'
    ? securityFeatures
    : securityFeatures.filter(f => f.id.includes(selectedCategory))

  return (
    <TooltipProvider>
      <div className="min-h-screen text-foreground">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-24">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-primary/20 text-primary border-primary/30">
              <Shield className="w-3 h-3 mr-1" />
              Enterprise-Grade Security
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 terminal-glow font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Your data is safe with us
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              We take security seriously. Our platform is built with security best practices,
              compliance certifications, and continuous monitoring to protect your data.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Download className="w-4 h-4 mr-2" />
                Security Overview PDF
              </Button>
              <Button size="lg" variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                Contact Security Team
              </Button>
            </div>
          </motion.div>

          {/* Trust Signals */}
          <motion.div
            className="grid md:grid-cols-4 gap-6 mt-16 max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {[
              { icon: Shield, value: 'SOC 2', label: 'Type II Certified' },
              { icon: Lock, value: 'AES-256', label: 'Encryption' },
              { icon: Eye, value: '24/7', label: 'Monitoring' },
              { icon: Award, value: 'Zero', label: 'Data Breaches' }
            ].map((stat, idx) => {
              const Icon = stat.icon
              return (
                <Card key={idx} className="glass border-border/30 p-6 text-center">
                  <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              )
            })}
          </motion.div>
        </section>

        {/* Compliance Certifications */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Compliance & Certifications</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Industry-recognized standards and certifications
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {certifications.map((cert, idx) => {
              const Icon = cert.icon
              return (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                >
                  <Card className="glass border-border/30 p-6 h-full">
                    <div className="flex items-start justify-between mb-4">
                      <Icon className="w-10 h-10 text-primary" />
                      <Badge
                        variant="outline"
                        className={cn(
                          "border-primary/30",
                          cert.status === 'Certified' && "bg-primary/20 text-primary",
                          cert.status === 'Compliant' && "bg-primary/10 text-primary",
                          cert.status === 'In Progress' && "bg-muted/20 text-muted-foreground"
                        )}
                      >
                        {cert.status}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{cert.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{cert.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <span>Year: {cert.year}</span>
                      {cert.report && <CheckCircle2 className="w-4 h-4 text-primary" />}
                    </div>
                    {cert.report && (
                      <Button variant="outline" size="sm" className="w-full">
                        <Download className="w-3 h-3 mr-2" />
                        Download Report
                      </Button>
                    )}
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* Security Features */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Security Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive security controls to protect your data
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {securityFeatures.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.03, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="glass border-border/30 p-5 h-full hover:border-primary/30 transition-all group">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 mb-4 group-hover:border-primary/40 transition-all">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {feature.description}
                      </p>
                      <div className="glass-dark rounded-lg p-3 border border-border/10">
                        <div className="text-lg font-bold text-primary">
                          {feature.metrics.value}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {feature.metrics.label}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* Security Practices */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Security Practices</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              How we maintain security across all aspects of our business
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {practices.map((practice, idx) => {
              const Icon = practice.icon
              return (
                <motion.div
                  key={practice.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <Card className="glass border-border/30 p-8 h-full">
                    <div className="flex items-center gap-3 mb-6">
                      <Icon className="w-8 h-8 text-primary" />
                      <h3 className="text-2xl font-bold">{practice.category}</h3>
                    </div>
                    <ul className="space-y-3">
                      {practice.items.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* Incident History */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Security Incident History</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Transparent reporting of all security incidents
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="glass border-primary/30 p-8 text-center">
              <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3">Zero Security Incidents</h3>
              <p className="text-muted-foreground mb-6">
                We are proud to report that we have had zero security breaches or data
                incidents since our founding in 2019. Our commitment to security best
                practices and continuous monitoring keeps your data safe.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { value: '0', label: 'Data Breaches' },
                  { value: '0', label: 'Security Incidents' },
                  { value: '5 years', label: 'Clean Record' }
                ].map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-4xl font-bold text-primary mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        {/* Bug Bounty Program */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Bug Bounty Program</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Help us stay secure and earn rewards for responsible disclosure
            </p>
          </div>

          <div className="max-w-4xl mx-auto mb-8">
            <Card className="glass border-border/30 p-8">
              <div className="flex items-start gap-4 mb-6">
                <Bug className="w-10 h-10 text-primary flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Responsible Disclosure</h3>
                  <p className="text-muted-foreground">
                    We welcome security researchers to report vulnerabilities through our
                    bug bounty program. All valid submissions are eligible for rewards and
                    public recognition (with your permission).
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {bugBountyTiers.map((tier, idx) => {
                  const Icon = tier.icon
                  return (
                    <div
                      key={tier.severity}
                      className="glass-dark rounded-lg p-4 border border-border/20"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Icon className={cn("w-5 h-5", tier.color)} />
                          <h4 className="font-bold">{tier.severity}</h4>
                        </div>
                        <Badge variant="outline" className="border-primary/30">
                          <DollarSign className="w-3 h-3 mr-1" />
                          {tier.reward}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{tier.description}</p>
                    </div>
                  )
                })}
              </div>

              <div className="mt-6 pt-6 border-t border-border/20">
                <Button className="w-full bg-primary hover:bg-primary/90">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Full Program Details
                </Button>
              </div>
            </Card>
          </div>
        </section>

        {/* Privacy Policy & Documentation */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Documentation & Policies</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Detailed documentation of our security and privacy practices
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { title: 'Privacy Policy', icon: FileText, updated: 'Jan 2024' },
              { title: 'Security Whitepaper', icon: FileCheck, updated: 'Feb 2024' },
              { title: 'Data Processing Agreement', icon: Scale, updated: 'Jan 2024' },
              { title: 'Terms of Service', icon: FileText, updated: 'Dec 2023' },
              { title: 'SOC 2 Report', icon: Award, updated: 'Mar 2024' },
              { title: 'GDPR Compliance', icon: Globe, updated: 'Jan 2024' },
              { title: 'Incident Response Plan', icon: AlertTriangle, updated: 'Feb 2024' },
              { title: 'Vulnerability Disclosure', icon: Bug, updated: 'Jan 2024' }
            ].map((doc, idx) => {
              const Icon = doc.icon
              return (
                <motion.div
                  key={doc.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <Card className="glass border-border/30 p-6 hover:border-primary/30 transition-all group cursor-pointer">
                    <Icon className="w-8 h-8 text-primary mb-4" />
                    <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      Updated: {doc.updated}
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="w-3 h-3 mr-2" />
                      Download
                    </Button>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* Contact Security Team */}
        <section className="container mx-auto px-4 py-16">
          <Card className="glass border-primary/30 p-12 text-center max-w-4xl mx-auto">
            <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4">Questions about security?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our security team is here to help. Contact us for security inquiries,
              audits, or to report vulnerabilities.
            </p>
            <div className="flex flex-col items-center gap-4 mb-8">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <a href="mailto:security@company.com" className="text-lg font-medium hover:text-primary transition-colors">
                  security@company.com
                </a>
              </div>
              <p className="text-sm text-muted-foreground">
                PGP Key: Available on request • Response time: Within 24 hours
              </p>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Contact Security Team
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline">
                Report Vulnerability
              </Button>
            </div>
          </Card>
        </section>
      </div>
    </TooltipProvider>
  )
}
