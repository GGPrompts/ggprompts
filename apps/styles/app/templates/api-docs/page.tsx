'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Copy,
  Check,
  ChevronRight,
  Lock,
  Zap,
  Terminal,
  Code2,
  Globe,
  Shield,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Server,
  Database,
  Key,
  Hash,
  Send,
  ChevronDown
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

// API Endpoints data structure
const apiCategories = [
  {
    id: 'authentication',
    name: 'Authentication',
    icon: Lock,
    endpoints: [
      {
        id: 'auth-login',
        method: 'POST',
        path: '/api/auth/login',
        description: 'Authenticate user and receive JWT token'
      },
      {
        id: 'auth-refresh',
        method: 'POST',
        path: '/api/auth/refresh',
        description: 'Refresh authentication token'
      },
      {
        id: 'auth-logout',
        method: 'POST',
        path: '/api/auth/logout',
        description: 'Invalidate current session'
      }
    ]
  },
  {
    id: 'users',
    name: 'Users',
    icon: Globe,
    endpoints: [
      {
        id: 'users-list',
        method: 'GET',
        path: '/api/users',
        description: 'List all users with pagination'
      },
      {
        id: 'users-get',
        method: 'GET',
        path: '/api/users/:id',
        description: 'Get user by ID'
      },
      {
        id: 'users-create',
        method: 'POST',
        path: '/api/users',
        description: 'Create new user account'
      },
      {
        id: 'users-update',
        method: 'PUT',
        path: '/api/users/:id',
        description: 'Update user information'
      },
      {
        id: 'users-delete',
        method: 'DELETE',
        path: '/api/users/:id',
        description: 'Delete user account'
      }
    ]
  },
  {
    id: 'projects',
    name: 'Projects',
    icon: Database,
    endpoints: [
      {
        id: 'projects-list',
        method: 'GET',
        path: '/api/projects',
        description: 'List all projects'
      },
      {
        id: 'projects-create',
        method: 'POST',
        path: '/api/projects',
        description: 'Create new project'
      },
      {
        id: 'projects-update',
        method: 'PATCH',
        path: '/api/projects/:id',
        description: 'Partially update project'
      }
    ]
  },
  {
    id: 'analytics',
    name: 'Analytics',
    icon: Zap,
    endpoints: [
      {
        id: 'analytics-events',
        method: 'GET',
        path: '/api/analytics/events',
        description: 'Retrieve analytics events'
      },
      {
        id: 'analytics-metrics',
        method: 'GET',
        path: '/api/analytics/metrics',
        description: 'Get aggregated metrics'
      }
    ]
  }
]

// Method colors
const methodColors: Record<string, string> = {
  GET: 'bg-primary/20 text-primary border-primary/30',
  POST: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  PUT: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  PATCH: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  DELETE: 'bg-red-500/20 text-red-400 border-red-500/30'
}

// Status codes reference
const statusCodes = [
  { code: 200, label: 'OK', description: 'Request succeeded', type: 'success' },
  { code: 201, label: 'Created', description: 'Resource created successfully', type: 'success' },
  { code: 204, label: 'No Content', description: 'Request succeeded with no response body', type: 'success' },
  { code: 400, label: 'Bad Request', description: 'Invalid request parameters', type: 'error' },
  { code: 401, label: 'Unauthorized', description: 'Authentication required', type: 'error' },
  { code: 403, label: 'Forbidden', description: 'Insufficient permissions', type: 'error' },
  { code: 404, label: 'Not Found', description: 'Resource not found', type: 'error' },
  { code: 429, label: 'Too Many Requests', description: 'Rate limit exceeded', type: 'warning' },
  { code: 500, label: 'Internal Server Error', description: 'Server error occurred', type: 'error' }
]

// Code examples for different languages
const codeExamples = {
  curl: `curl -X POST https://api.example.com/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "password": "secure_password"
  }'`,
  javascript: `const response = await fetch('https://api.example.com/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'secure_password'
  })
});

const data = await response.json();
console.log(data.token);`,
  python: `import requests

response = requests.post(
    'https://api.example.com/api/auth/login',
    json={
        'email': 'user@example.com',
        'password': 'secure_password'
    }
)

data = response.json()
print(data['token'])`
}

export default function ApiDocsTemplate() {
  const [selectedEndpoint, setSelectedEndpoint] = useState('auth-login')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedVersion, setSelectedVersion] = useState('v2.1.0')
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['authentication'])
  const [playgroundMethod, setPlaygroundMethod] = useState('GET')
  const [playgroundUrl, setPlaygroundUrl] = useState('/api/users')
  const [playgroundResponse, setPlaygroundResponse] = useState('')

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const runPlayground = () => {
    // Mock API response
    const mockResponse = {
      status: 200,
      data: {
        users: [
          { id: 1, name: 'John Doe', email: 'john@example.com' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
        ],
        pagination: {
          page: 1,
          total: 2,
          per_page: 10
        }
      }
    }
    setPlaygroundResponse(JSON.stringify(mockResponse, null, 2))
  }

  // Find current endpoint details
  const currentEndpoint = apiCategories
    .flatMap(cat => cat.endpoints)
    .find(ep => ep.id === selectedEndpoint)

  return (
    <div className="min-h-screen ">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 glass rounded-lg border-glow">
                <Terminal className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent terminal-glow">API Documentation</h1>
                <p className="text-muted-foreground mt-1">RESTful API Reference & Interactive Playground</p>
              </div>
            </div>

            {/* Version Selector */}
            <Select value={selectedVersion} onValueChange={setSelectedVersion}>
              <SelectTrigger className="w-32 glass border-primary/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-dark border-primary/30">
                <SelectItem value="v2.1.0">v2.1.0</SelectItem>
                <SelectItem value="v2.0.0">v2.0.0</SelectItem>
                <SelectItem value="v1.9.0">v1.9.0</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search endpoints, methods, or descriptions..."
              className="pl-10 glass border-primary/30 text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[300px,1fr] gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass border-primary/30 sticky top-6">
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="p-4 space-y-2">
                  {apiCategories.map((category) => (
                    <div key={category.id} className="space-y-1">
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-primary/10 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <category.icon className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-foreground">
                            {category.name}
                          </span>
                        </div>
                        <ChevronRight
                          className={cn(
                            "w-4 h-4 text-primary transition-transform",
                            expandedCategories.includes(category.id) && "rotate-90"
                          )}
                        />
                      </button>

                      <AnimatePresence>
                        {expandedCategories.includes(category.id) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="ml-6 space-y-1 overflow-hidden"
                          >
                            {category.endpoints.map((endpoint) => (
                              <button
                                key={endpoint.id}
                                onClick={() => setSelectedEndpoint(endpoint.id)}
                                className={cn(
                                  "w-full text-left p-2 rounded-lg text-sm transition-all",
                                  selectedEndpoint === endpoint.id
                                    ? "bg-primary/20 text-primary border-l-2 border-primary"
                                    : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                                )}
                              >
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="outline"
                                    className={cn("text-xs", methodColors[endpoint.method])}
                                  >
                                    {endpoint.method}
                                  </Badge>
                                  <span className="truncate font-mono text-xs">
                                    {endpoint.path}
                                  </span>
                                </div>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </motion.div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Endpoint Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass border-primary/30 p-6">
                {currentEndpoint && (
                  <>
                    <div className="flex items-start justify-between mb-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <Badge
                            variant="outline"
                            className={cn("text-sm", methodColors[currentEndpoint.method])}
                          >
                            {currentEndpoint.method}
                          </Badge>
                          <code className="text-lg font-mono text-primary">
                            {currentEndpoint.path}
                          </code>
                        </div>
                        <p className="text-muted-foreground">{currentEndpoint.description}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-primary/30 text-primary hover:bg-primary/10"
                        onClick={() => {
                          setPlaygroundMethod(currentEndpoint.method)
                          setPlaygroundUrl(currentEndpoint.path)
                        }}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Try it
                      </Button>
                    </div>

                    <Separator className="bg-primary/20 my-6" />

                    {/* Request Examples */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">Request Examples</h3>

                      <Tabs defaultValue="curl" className="w-full">
                        <TabsList className="glass border-primary/30">
                          <TabsTrigger value="curl">cURL</TabsTrigger>
                          <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                          <TabsTrigger value="python">Python</TabsTrigger>
                        </TabsList>

                        {Object.entries(codeExamples).map(([lang, code]) => (
                          <TabsContent key={lang} value={lang} className="mt-4">
                            <div className="relative">
                              <pre className="glass-dark rounded-lg p-4 overflow-x-auto">
                                <code className="text-sm font-mono text-primary">
                                  {code}
                                </code>
                              </pre>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="absolute top-2 right-2 text-primary hover:text-primary"
                                onClick={() => handleCopy(code, lang)}
                              >
                                {copiedCode === lang ? (
                                  <Check className="w-4 h-4" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </TabsContent>
                        ))}
                      </Tabs>
                    </div>

                    <Separator className="bg-primary/20 my-6" />

                    {/* Response Example */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">Response Example</h3>
                      <div className="relative">
                        <pre className="glass-dark rounded-lg p-4 overflow-x-auto">
                          <code className="text-sm font-mono text-primary">
{`{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "123",
      "email": "user@example.com",
      "name": "John Doe"
    }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}`}
                          </code>
                        </pre>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-2 right-2 text-primary hover:text-primary"
                          onClick={() => handleCopy('response', 'response')}
                        >
                          {copiedCode === 'response' ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </Card>
            </motion.div>

            {/* Authentication */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass border-primary/30 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">Authentication</h2>
                </div>

                <p className="text-muted-foreground mb-4">
                  All API requests require authentication using Bearer tokens in the Authorization header.
                </p>

                <div className="space-y-4">
                  <div className="glass-dark rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-2">Header Format:</p>
                    <code className="text-primary font-mono">
                      Authorization: Bearer YOUR_ACCESS_TOKEN
                    </code>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="glass-dark rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Key className="w-4 h-4 text-amber-400" />
                        <p className="text-sm font-medium text-foreground">API Key</p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Long-lived tokens for server-to-server communication
                      </p>
                    </div>
                    <div className="glass-dark rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Hash className="w-4 h-4 text-secondary" />
                        <p className="text-sm font-medium text-foreground">JWT Token</p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Short-lived tokens for user authentication (expires in 1 hour)
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Rate Limiting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="glass border-primary/30 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">Rate Limiting</h2>
                </div>

                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    API requests are limited based on your subscription tier. Rate limit headers are included in all responses.
                  </p>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="glass-dark rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-primary mb-1">100</p>
                      <p className="text-xs text-muted-foreground">Requests/min</p>
                      <Badge variant="outline" className="mt-2 text-xs border-border">
                        Free Tier
                      </Badge>
                    </div>
                    <div className="glass-dark rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-secondary mb-1">1,000</p>
                      <p className="text-xs text-muted-foreground">Requests/min</p>
                      <Badge variant="outline" className="mt-2 text-xs border-secondary">
                        Pro Tier
                      </Badge>
                    </div>
                    <div className="glass-dark rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-purple-400 mb-1">10,000</p>
                      <p className="text-xs text-muted-foreground">Requests/min</p>
                      <Badge variant="outline" className="mt-2 text-xs border-purple-500">
                        Enterprise
                      </Badge>
                    </div>
                  </div>

                  <div className="glass-dark rounded-lg p-4">
                    <p className="text-sm font-medium text-foreground mb-2">Response Headers:</p>
                    <div className="space-y-1 font-mono text-xs">
                      <div className="text-primary">X-RateLimit-Limit: 100</div>
                      <div className="text-amber-300">X-RateLimit-Remaining: 95</div>
                      <div className="text-secondary">X-RateLimit-Reset: 1642435200</div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Status Codes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="glass border-primary/30 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">Status Codes</h2>
                </div>

                <div className="space-y-2">
                  {statusCodes.map((status) => (
                    <div
                      key={status.code}
                      className="glass-dark rounded-lg p-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        {status.type === 'success' && (
                          <CheckCircle className="w-4 h-4 text-primary" />
                        )}
                        {status.type === 'warning' && (
                          <AlertCircle className="w-4 h-4 text-amber-400" />
                        )}
                        {status.type === 'error' && (
                          <XCircle className="w-4 h-4 text-red-400" />
                        )}
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={cn(
                              "font-mono text-xs",
                              status.type === 'success' && "border-primary text-primary",
                              status.type === 'warning' && "border-amber-500 text-amber-400",
                              status.type === 'error' && "border-red-500 text-red-400"
                            )}
                          >
                            {status.code}
                          </Badge>
                          <span className="text-sm font-medium text-foreground">
                            {status.label}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {status.description}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* API Playground */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="glass border-primary/30 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Code2 className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">API Playground</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Select value={playgroundMethod} onValueChange={setPlaygroundMethod}>
                      <SelectTrigger className="w-32 glass border-primary/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-dark border-primary/30">
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                        <SelectItem value="PATCH">PATCH</SelectItem>
                        <SelectItem value="DELETE">DELETE</SelectItem>
                      </SelectContent>
                    </Select>

                    <Input
                      value={playgroundUrl}
                      onChange={(e) => setPlaygroundUrl(e.target.value)}
                      placeholder="/api/endpoint"
                      className="flex-1 glass border-primary/30 font-mono text-primary"
                    />

                    <Button
                      onClick={runPlayground}
                      className="bg-primary/20 border-primary/30 text-primary hover:bg-primary/30"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Request
                    </Button>
                  </div>

                  {playgroundMethod !== 'GET' && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Request Body:</p>
                      <textarea
                        className="w-full h-32 glass-dark rounded-lg p-4 font-mono text-sm text-primary border border-primary/30 bg-muted/50"
                        placeholder='{"key": "value"}'
                      />
                    </div>
                  )}

                  {playgroundResponse && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Response:</p>
                      <pre className="glass-dark rounded-lg p-4 overflow-x-auto">
                        <code className="text-sm font-mono text-primary">
                          {playgroundResponse}
                        </code>
                      </pre>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="glass border-primary/30 p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Quick Links</h2>

                <div className="grid md:grid-cols-3 gap-4">
                  <a
                    href="#"
                    className="glass-dark rounded-lg p-4 hover:bg-primary/10 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Server className="w-5 h-5 text-primary group-hover:text-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">API Status</p>
                        <p className="text-xs text-muted-foreground">Check service health</p>
                      </div>
                    </div>
                  </a>

                  <a
                    href="#"
                    className="glass-dark rounded-lg p-4 hover:bg-primary/10 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Info className="w-5 h-5 text-secondary group-hover:text-secondary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Changelog</p>
                        <p className="text-xs text-muted-foreground">Latest updates</p>
                      </div>
                    </div>
                  </a>

                  <a
                    href="#"
                    className="glass-dark rounded-lg p-4 hover:bg-primary/10 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Code2 className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
                      <div>
                        <p className="text-sm font-medium text-foreground">SDKs</p>
                        <p className="text-xs text-muted-foreground">Client libraries</p>
                      </div>
                    </div>
                  </a>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}