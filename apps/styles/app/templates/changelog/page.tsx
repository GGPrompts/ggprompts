'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Calendar,
  User,
  GitBranch,
  GitCommit,
  ExternalLink,
  Download,
  Rss,
  Mail,
  Webhook,
  Copy,
  Check,
  AlertTriangle,
  Sparkles,
  Bug,
  Palette,
  FileText,
  GitCompare,
  Hash,
  Clock,
  ArrowRight,
  Code,
  Terminal,
  Package,
  Shield,
  Zap
} from 'lucide-react';

// Types
type ChangeType = 'feature' | 'bugfix' | 'breaking' | 'improvement' | 'documentation' | 'security' | 'performance';

type ReleaseType = 'major' | 'minor' | 'patch' | 'hotfix' | 'beta' | 'alpha';

interface Change {
  id: string;
  type: ChangeType;
  title: string;
  description?: string;
  issueNumber?: string;
  prNumber?: string;
  codeExample?: {
    before?: string;
    after?: string;
    migration?: string;
  };
}

interface Release {
  id: string;
  version: string;
  date: string;
  type: ReleaseType;
  author: string;
  team?: string;
  summary: string;
  changes: Change[];
  githubUrl?: string;
  downloadUrl?: string;
  prs?: string[];
  issues?: string[];
  breakingChanges?: boolean;
}

// Mock data
const releases: Release[] = [
  {
    id: '1',
    version: '2.0.0',
    date: '2024-11-20T10:00:00Z',
    type: 'major',
    author: 'Matt Richardson',
    team: 'Core Team',
    summary: 'Major release with new architecture and breaking changes',
    breakingChanges: true,
    changes: [
      {
        id: '1-1',
        type: 'breaking',
        title: 'Redesigned API architecture',
        description: 'Complete overhaul of the REST API with new endpoints and response formats',
        prNumber: '234',
        codeExample: {
          before: `// Old API
fetch('/api/users')
  .then(res => res.json())
  .then(data => console.log(data.users));`,
          after: `// New API v2
fetch('/api/v2/users', {
  headers: { 'X-API-Version': '2.0' }
})
  .then(res => res.json())
  .then(data => console.log(data.data));`,
          migration: `// Migration guide
1. Update all API endpoints to include /v2 prefix
2. Add X-API-Version header to all requests
3. Update response parsing (data.users → data.data)`
        }
      },
      {
        id: '1-2',
        type: 'feature',
        title: 'WebSocket support for real-time updates',
        description: 'Live data streaming with WebSocket connections',
        issueNumber: '145',
        prNumber: '230'
      },
      {
        id: '1-3',
        type: 'performance',
        title: '3x faster data processing',
        description: 'Optimized algorithms reduce processing time by 67%',
        prNumber: '228'
      }
    ],
    githubUrl: 'https://github.com/user/repo/releases/tag/v2.0.0',
    downloadUrl: 'https://github.com/user/repo/archive/v2.0.0.zip',
    prs: ['234', '230', '228'],
    issues: ['145', '142', '139']
  },
  {
    id: '2',
    version: '1.5.3',
    date: '2024-11-15T14:30:00Z',
    type: 'patch',
    author: 'Sarah Chen',
    summary: 'Bug fixes and performance improvements',
    changes: [
      {
        id: '2-1',
        type: 'bugfix',
        title: 'Fixed memory leak in data processor',
        description: 'Resolved issue causing gradual memory increase',
        issueNumber: '201',
        prNumber: '215'
      },
      {
        id: '2-2',
        type: 'improvement',
        title: 'Enhanced error messages',
        description: 'More descriptive error messages with troubleshooting hints',
        prNumber: '214'
      },
      {
        id: '2-3',
        type: 'documentation',
        title: 'Updated API documentation',
        description: 'Added examples and clarified edge cases',
        prNumber: '213'
      }
    ],
    githubUrl: 'https://github.com/user/repo/releases/tag/v1.5.3',
    downloadUrl: 'https://github.com/user/repo/archive/v1.5.3.zip',
    prs: ['215', '214', '213']
  },
  {
    id: '3',
    version: '1.5.2',
    date: '2024-11-10T09:00:00Z',
    type: 'hotfix',
    author: 'Alex Kumar',
    summary: 'Critical security patch',
    changes: [
      {
        id: '3-1',
        type: 'security',
        title: 'Fixed authentication bypass vulnerability',
        description: 'Patched critical security issue in auth flow',
        issueNumber: '200',
        prNumber: '210'
      }
    ],
    githubUrl: 'https://github.com/user/repo/releases/tag/v1.5.2',
    downloadUrl: 'https://github.com/user/repo/archive/v1.5.2.zip',
    prs: ['210']
  },
  {
    id: '4',
    version: '1.5.1',
    date: '2024-11-05T16:45:00Z',
    type: 'minor',
    author: 'Emily Rodriguez',
    team: 'Frontend Team',
    summary: 'New features and UI improvements',
    changes: [
      {
        id: '4-1',
        type: 'feature',
        title: 'Dark mode support',
        description: 'System-wide dark mode with automatic detection',
        issueNumber: '180',
        prNumber: '195'
      },
      {
        id: '4-2',
        type: 'feature',
        title: 'Export to CSV functionality',
        description: 'Export data in CSV format for external analysis',
        issueNumber: '175',
        prNumber: '194'
      },
      {
        id: '4-3',
        type: 'improvement',
        title: 'Faster page load times',
        description: 'Optimized bundle size and lazy loading',
        prNumber: '193'
      }
    ],
    githubUrl: 'https://github.com/user/repo/releases/tag/v1.5.1',
    downloadUrl: 'https://github.com/user/repo/archive/v1.5.1.zip',
    prs: ['195', '194', '193'],
    issues: ['180', '175']
  }
];

// Change type configuration
const changeTypeConfig = {
  feature: {
    icon: Sparkles,
    label: 'New Feature',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/30'
  },
  bugfix: {
    icon: Bug,
    label: 'Bug Fix',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30'
  },
  breaking: {
    icon: AlertTriangle,
    label: 'Breaking Change',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30'
  },
  improvement: {
    icon: Palette,
    label: 'Improvement',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30'
  },
  documentation: {
    icon: FileText,
    label: 'Documentation',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30'
  },
  security: {
    icon: Shield,
    label: 'Security',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30'
  },
  performance: {
    icon: Zap,
    label: 'Performance',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30'
  }
};

// Release type configuration
const releaseTypeConfig = {
  major: { label: 'Major', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  minor: { label: 'Minor', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  patch: { label: 'Patch', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  hotfix: { label: 'Hotfix', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  beta: { label: 'Beta', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  alpha: { label: 'Alpha', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' }
};

export default function ChangelogTemplate() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<ChangeType[]>([]);
  const [expandedReleases, setExpandedReleases] = useState<Set<string>>(new Set(['1']));
  const [showFilters, setShowFilters] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [webhookConfigured, setWebhookConfigured] = useState(false);

  // Filter releases based on search and selected types
  const filteredReleases = useMemo(() => {
    return releases.filter(release => {
      const matchesSearch = !searchQuery ||
        release.version.toLowerCase().includes(searchQuery.toLowerCase()) ||
        release.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        release.changes.some(change =>
          change.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          change.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesTypes = selectedTypes.length === 0 ||
        release.changes.some(change => selectedTypes.includes(change.type));

      return matchesSearch && matchesTypes;
    });
  }, [searchQuery, selectedTypes]);

  const toggleExpanded = (releaseId: string) => {
    setExpandedReleases(prev => {
      const newSet = new Set(prev);
      if (newSet.has(releaseId)) {
        newSet.delete(releaseId);
      } else {
        newSet.add(releaseId);
      }
      return newSet;
    });
  };

  const toggleTypeFilter = (type: ChangeType) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const toggleVersionSelection = (version: string) => {
    if (selectedVersions.includes(version)) {
      setSelectedVersions(prev => prev.filter(v => v !== version));
    } else if (selectedVersions.length < 2) {
      setSelectedVersions(prev => [...prev, version]);
    }
  };

  return (
    <div className="min-h-screen text-foreground p-8 relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-green-500/10 via-transparent to-transparent" />
      </div>

      {/* Terminal grid effect */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_40%,transparent_100%)]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg border border-primary/30">
              <Terminal className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Changelog
              </h1>
              <p className="text-muted-foreground mt-1">Product updates and version history</p>
            </div>
          </div>

          {/* Current Version Banner */}
          <div className="glass border-primary/30 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">Current Version:</span>
                <span className="font-mono text-primary text-lg font-semibold">v2.0.0</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Released 1 day ago</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-primary/20 text-primary rounded-md border border-primary/30 hover:bg-primary/30 transition-colors text-sm flex items-center gap-1.5">
                <Download className="w-4 h-4" />
                Download
              </button>
              <button className="px-3 py-1.5 bg-card/50 text-muted-foreground rounded-md border border-border hover:bg-card transition-colors text-sm flex items-center gap-1.5">
                <GitBranch className="w-4 h-4" />
                View on GitHub
              </button>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          {/* Search Bar */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search changelog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-card/50 border border-border rounded-lg focus:outline-none focus:border-primary/50 focus:bg-card/70 transition-all text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 rounded-lg border transition-all flex items-center gap-2 ${
                showFilters
                  ? 'bg-primary/20 border-primary/30 text-primary'
                  : 'bg-card/50 border-border text-muted-foreground hover:bg-card/70'
              }`}
            >
              <Filter className="w-5 h-5" />
              Filters
              {selectedTypes.length > 0 && (
                <span className="px-2 py-0.5 bg-primary/30 rounded-full text-xs">
                  {selectedTypes.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setCompareMode(!compareMode)}
              className={`px-4 py-3 rounded-lg border transition-all flex items-center gap-2 ${
                compareMode
                  ? 'bg-blue-500/20 border-blue-500/30 text-blue-400'
                  : 'bg-card/50 border-border text-muted-foreground hover:bg-card/70'
              }`}
            >
              <GitCompare className="w-5 h-5" />
              Compare
            </button>
          </div>

          {/* Filter Options */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="glass border-border p-4 rounded-lg space-y-3">
                  <div className="text-sm text-muted-foreground mb-2">Filter by change type:</div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(changeTypeConfig).map(([type, config]) => {
                      const Icon = config.icon;
                      const isSelected = selectedTypes.includes(type as ChangeType);
                      return (
                        <button
                          key={type}
                          onClick={() => toggleTypeFilter(type as ChangeType)}
                          className={`px-3 py-1.5 rounded-md border transition-all flex items-center gap-1.5 text-sm ${
                            isSelected
                              ? `${config.bgColor} ${config.borderColor} ${config.color}`
                              : 'bg-card/50 border-border text-muted-foreground hover:bg-card/70'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {config.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Compare Mode */}
          <AnimatePresence>
            {compareMode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="glass border-blue-500/30 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm text-blue-400">
                      Select two versions to compare (Mock Feature)
                    </div>
                    {selectedVersions.length === 2 && (
                      <button className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-md border border-blue-500/30 hover:bg-blue-500/30 transition-colors text-sm flex items-center gap-1.5">
                        View Comparison
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {releases.map(release => (
                      <button
                        key={release.id}
                        onClick={() => toggleVersionSelection(release.version)}
                        disabled={!selectedVersions.includes(release.version) && selectedVersions.length >= 2}
                        className={`px-3 py-1.5 font-mono text-sm rounded-md border transition-all ${
                          selectedVersions.includes(release.version)
                            ? 'bg-blue-500/20 border-blue-500/30 text-blue-400'
                            : 'bg-card/50 border-border text-muted-foreground hover:bg-card/70 disabled:opacity-50 disabled:cursor-not-allowed'
                        }`}
                      >
                        {release.version}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-[1fr,300px] gap-8">
          {/* Timeline and Releases */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-[21px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-primary/30 to-transparent" />

            {/* Releases */}
            <div className="space-y-8">
              {filteredReleases.map((release, index) => (
                <motion.div
                  key={release.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Timeline Node */}
                  <div className="absolute left-0 top-6">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center ${
                      index === 0 ? 'bg-primary/20 border-2 border-primary' : 'bg-card border-2 border-border'
                    }`}>
                      <GitCommit className={`w-5 h-5 ${index === 0 ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    {index === 0 && (
                      <div className="absolute -top-1 -right-1">
                        <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                      </div>
                    )}
                  </div>

                  {/* Release Card */}
                  <div className="ml-16">
                    <div className={`glass rounded-lg overflow-hidden transition-all ${
                      release.breakingChanges ? 'border-red-500/30' : 'border-border'
                    }`}>
                      {/* Release Header */}
                      <button
                        onClick={() => toggleExpanded(release.id)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-left">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-mono text-xl font-semibold text-primary">
                                {release.version}
                              </span>
                              <span className={`px-2 py-0.5 text-xs rounded-md border ${
                                releaseTypeConfig[release.type].color
                              }`}>
                                {releaseTypeConfig[release.type].label}
                              </span>
                              {release.breakingChanges && (
                                <span className="px-2 py-0.5 text-xs rounded-md border bg-red-500/20 border-red-500/30 text-red-400 flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  Breaking
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(release.date).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {release.author}
                              </span>
                              {release.team && (
                                <span className="flex items-center gap-1">
                                  <Hash className="w-4 h-4" />
                                  {release.team}
                                </span>
                              )}
                            </div>
                            <p className="text-muted-foreground mt-2">{release.summary}</p>
                          </div>
                        </div>
                        {expandedReleases.has(release.id) ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </button>

                      {/* Expanded Content */}
                      <AnimatePresence>
                        {expandedReleases.has(release.id) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t border-border"
                          >
                            <div className="p-6 space-y-4">
                              {/* Changes */}
                              {release.changes.map(change => {
                                const config = changeTypeConfig[change.type];
                                const Icon = config.icon;
                                return (
                                  <div key={change.id} className="space-y-3">
                                    <div className="flex items-start gap-3">
                                      <div className={`mt-0.5 p-1.5 rounded-md ${config.bgColor} ${config.borderColor} border`}>
                                        <Icon className={`w-4 h-4 ${config.color}`} />
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <h4 className="font-medium text-foreground">{change.title}</h4>
                                          {change.prNumber && (
                                            <a
                                              href="#"
                                              className="text-xs text-muted-foreground hover:text-primary transition-colors"
                                            >
                                              #{change.prNumber}
                                            </a>
                                          )}
                                          {change.issueNumber && (
                                            <a
                                              href="#"
                                              className="text-xs text-muted-foreground hover:text-primary transition-colors"
                                            >
                                              fixes #{change.issueNumber}
                                            </a>
                                          )}
                                        </div>
                                        {change.description && (
                                          <p className="text-sm text-muted-foreground">{change.description}</p>
                                        )}

                                        {/* Code Examples */}
                                        {change.codeExample && (
                                          <div className="mt-3 space-y-3">
                                            {change.codeExample.before && (
                                              <div className="relative">
                                                <div className="text-xs text-red-400 mb-1">Before:</div>
                                                <div className="bg-muted/50 border border-border rounded-md p-3 font-mono text-sm">
                                                  <pre className="text-muted-foreground overflow-x-auto">
                                                    <code>{change.codeExample.before}</code>
                                                  </pre>
                                                  <button
                                                    onClick={() => copyCode(change.codeExample?.before ?? '', `before-${change.id}`)}
                                                    className="absolute top-8 right-2 p-1.5 bg-card/50 rounded hover:bg-card transition-colors"
                                                  >
                                                    {copiedCode === `before-${change.id}` ? (
                                                      <Check className="w-4 h-4 text-primary" />
                                                    ) : (
                                                      <Copy className="w-4 h-4 text-muted-foreground" />
                                                    )}
                                                  </button>
                                                </div>
                                              </div>
                                            )}
                                            {change.codeExample.after && (
                                              <div className="relative">
                                                <div className="text-xs text-primary mb-1">After:</div>
                                                <div className="bg-muted/50 border border-border rounded-md p-3 font-mono text-sm">
                                                  <pre className="text-muted-foreground overflow-x-auto">
                                                    <code>{change.codeExample.after}</code>
                                                  </pre>
                                                  <button
                                                    onClick={() => copyCode(change.codeExample?.after ?? '', `after-${change.id}`)}
                                                    className="absolute top-8 right-2 p-1.5 bg-card/50 rounded hover:bg-card transition-colors"
                                                  >
                                                    {copiedCode === `after-${change.id}` ? (
                                                      <Check className="w-4 h-4 text-primary" />
                                                    ) : (
                                                      <Copy className="w-4 h-4 text-muted-foreground" />
                                                    )}
                                                  </button>
                                                </div>
                                              </div>
                                            )}
                                            {change.codeExample.migration && (
                                              <div className="relative">
                                                <div className="text-xs text-blue-400 mb-1">Migration Guide:</div>
                                                <div className="bg-muted/50 border border-blue-500/30 rounded-md p-3 font-mono text-sm">
                                                  <pre className="text-muted-foreground overflow-x-auto">
                                                    <code>{change.codeExample.migration}</code>
                                                  </pre>
                                                  <button
                                                    onClick={() => copyCode(change.codeExample?.migration ?? '', `migration-${change.id}`)}
                                                    className="absolute top-8 right-2 p-1.5 bg-card/50 rounded hover:bg-card transition-colors"
                                                  >
                                                    {copiedCode === `migration-${change.id}` ? (
                                                      <Check className="w-4 h-4 text-primary" />
                                                    ) : (
                                                      <Copy className="w-4 h-4 text-muted-foreground" />
                                                    )}
                                                  </button>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}

                              {/* Links */}
                              <div className="pt-4 border-t border-border flex items-center gap-3">
                                {release.githubUrl && (
                                  <a
                                    href={release.githubUrl}
                                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                                  >
                                    <GitBranch className="w-4 h-4" />
                                    GitHub Release
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                                {release.downloadUrl && (
                                  <a
                                    href={release.downloadUrl}
                                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                                  >
                                    <Download className="w-4 h-4" />
                                    Download
                                  </a>
                                )}
                                {release.prs && release.prs.length > 0 && (
                                  <span className="text-sm text-muted-foreground">
                                    {release.prs.length} PRs
                                  </span>
                                )}
                                {release.issues && release.issues.length > 0 && (
                                  <span className="text-sm text-muted-foreground">
                                    {release.issues.length} Issues
                                  </span>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 ml-16"
            >
              <button className="w-full py-3 bg-card/50 border border-border rounded-lg hover:bg-card/70 transition-colors text-muted-foreground">
                Load Older Versions
              </button>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Subscription Options */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass border-border p-6 rounded-lg"
            >
              <h3 className="font-semibold mb-4 text-primary">Stay Updated</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setEmailSubscribed(!emailSubscribed)}
                  className={`w-full px-4 py-2.5 rounded-md border transition-all flex items-center gap-2 text-sm ${
                    emailSubscribed
                      ? 'bg-primary/20 border-primary/30 text-primary'
                      : 'bg-card/50 border-border text-muted-foreground hover:bg-card/70'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  {emailSubscribed ? 'Subscribed to Updates' : 'Email Notifications'}
                </button>
                <button className="w-full px-4 py-2.5 bg-card/50 border border-border rounded-md hover:bg-card/70 transition-colors text-muted-foreground flex items-center gap-2 text-sm">
                  <Rss className="w-4 h-4" />
                  RSS Feed
                </button>
                <button
                  onClick={() => setWebhookConfigured(!webhookConfigured)}
                  className={`w-full px-4 py-2.5 rounded-md border transition-all flex items-center gap-2 text-sm ${
                    webhookConfigured
                      ? 'bg-blue-500/20 border-blue-500/30 text-blue-400'
                      : 'bg-card/50 border-border text-muted-foreground hover:bg-card/70'
                  }`}
                >
                  <Webhook className="w-4 h-4" />
                  {webhookConfigured ? 'Webhook Configured' : 'Configure Webhook'}
                </button>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass border-border p-6 rounded-lg"
            >
              <h3 className="font-semibold mb-4 text-primary">Release Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Releases</span>
                  <span className="font-mono text-foreground">{releases.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">This Month</span>
                  <span className="font-mono text-foreground">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg. Time Between</span>
                  <span className="font-mono text-foreground">5 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contributors</span>
                  <span className="font-mono text-foreground">4</span>
                </div>
              </div>
            </motion.div>

            {/* Version Jump */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass border-border p-6 rounded-lg"
            >
              <h3 className="font-semibold mb-4 text-primary">Jump to Version</h3>
              <select className="w-full px-3 py-2 bg-card/50 border border-border rounded-md text-foreground text-sm focus:outline-none focus:border-primary/50">
                {releases.map(release => (
                  <option key={release.id} value={release.version}>
                    {release.version} - {new Date(release.date).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Download Options */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="glass border-border p-6 rounded-lg"
            >
              <h3 className="font-semibold mb-4 text-primary">Downloads</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-2.5 bg-primary/20 border border-primary/30 rounded-md hover:bg-primary/30 transition-colors text-primary flex items-center justify-center gap-2 text-sm">
                  <Download className="w-4 h-4" />
                  Latest Release (v2.0.0)
                </button>
                <button className="w-full px-4 py-2.5 bg-card/50 border border-border rounded-md hover:bg-card/70 transition-colors text-muted-foreground flex items-center justify-center gap-2 text-sm">
                  <FileText className="w-4 h-4" />
                  View Raw Changelog
                </button>
              </div>
            </motion.div>

            {/* Related Links */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="glass border-border p-6 rounded-lg"
            >
              <h3 className="font-semibold mb-4 text-primary">Resources</h3>
              <div className="space-y-2">
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <Code className="w-4 h-4" />
                  API Documentation
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <GitBranch className="w-4 h-4" />
                  Contributing Guide
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <Shield className="w-4 h-4" />
                  Security Policy
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}