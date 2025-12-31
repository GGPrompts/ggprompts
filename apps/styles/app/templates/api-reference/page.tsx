'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Code,
  Copy,
  Check,
  ChevronRight,
  ChevronDown,
  Zap,
  Lock,
  AlertTriangle,
  Info,
  Terminal,
  Book,
  Play,
  Shield,
  Clock,
  TrendingUp,
  Database,
  Key,
  Settings,
  Search,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'

// Types
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface Parameter {
  name: string
  type: string
  required: boolean
  description: string
  example?: string
}

interface Endpoint {
  id: string
  method: HttpMethod
  path: string
  title: string
  description: string
  category: string
  authentication: boolean
  rateLimit: string
  parameters?: Parameter[]
  requestBody?: {
    contentType: string
    schema: string
    example: string
  }
  responses: {
    code: number
    description: string
    example: string
  }[]
  codeExamples: {
    language: string
    code: string
  }[]
}

const methodConfig: Record<HttpMethod, { color: string; bg: string }> = {
  GET: { color: 'text-green-400', bg: 'bg-green-500/10' },
  POST: { color: 'text-blue-400', bg: 'bg-blue-500/10' },
  PUT: { color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  PATCH: { color: 'text-orange-400', bg: 'bg-orange-500/10' },
  DELETE: { color: 'text-red-400', bg: 'bg-red-500/10' },
}

// Mock API Endpoints Data
const endpoints: Endpoint[] = [
  {
    id: 'list-users',
    method: 'GET',
    path: '/api/v1/users',
    title: 'List Users',
    description: 'Retrieve a paginated list of all users in your organization.',
    category: 'Users',
    authentication: true,
    rateLimit: '100 requests/minute',
    parameters: [
      { name: 'page', type: 'integer', required: false, description: 'Page number for pagination', example: '1' },
      { name: 'limit', type: 'integer', required: false, description: 'Number of results per page (max 100)', example: '20' },
      { name: 'sort', type: 'string', required: false, description: 'Sort field and direction', example: 'created_at:desc' },
      { name: 'filter', type: 'string', required: false, description: 'Filter by user status', example: 'active' },
    ],
    responses: [
      {
        code: 200,
        description: 'Success',
        example: `{
  "data": [
    {
      "id": "usr_123abc",
      "email": "john@example.com",
      "name": "John Doe",
      "created_at": "2024-05-15T10:30:00Z",
      "status": "active"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "pages": 8
  }
}`,
      },
      {
        code: 401,
        description: 'Unauthorized - Invalid or missing API key',
        example: `{
  "error": {
    "code": "unauthorized",
    "message": "Invalid API key provided"
  }
}`,
      },
    ],
    codeExamples: [
      {
        language: 'cURL',
        code: `curl -X GET "https://api.example.com/v1/users?page=1&limit=20" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`,
      },
      {
        language: 'JavaScript',
        code: `const response = await fetch('https://api.example.com/v1/users?page=1&limit=20', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);`,
      },
      {
        language: 'Python',
        code: `import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}

response = requests.get(
    'https://api.example.com/v1/users',
    headers=headers,
    params={'page': 1, 'limit': 20}
)

data = response.json()
print(data)`,
      },
      {
        language: 'Go',
        code: `package main

import (
    "fmt"
    "io"
    "net/http"
)

func main() {
    req, _ := http.NewRequest("GET", "https://api.example.com/v1/users?page=1&limit=20", nil)
    req.Header.Set("Authorization", "Bearer YOUR_API_KEY")
    req.Header.Set("Content-Type", "application/json")

    client := &http.Client{}
    resp, _ := client.Do(req)
    defer resp.Body.Close()

    body, _ := io.ReadAll(resp.Body)
    fmt.Println(string(body))
}`,
      },
    ],
  },
  {
    id: 'create-user',
    method: 'POST',
    path: '/api/v1/users',
    title: 'Create User',
    description: 'Create a new user in your organization with specified details.',
    category: 'Users',
    authentication: true,
    rateLimit: '50 requests/minute',
    requestBody: {
      contentType: 'application/json',
      schema: `{
  "email": "string (required)",
  "name": "string (required)",
  "role": "string (optional)",
  "metadata": "object (optional)"
}`,
      example: `{
  "email": "jane@example.com",
  "name": "Jane Smith",
  "role": "developer",
  "metadata": {
    "department": "Engineering",
    "hire_date": "2024-05-15"
  }
}`,
    },
    responses: [
      {
        code: 201,
        description: 'Created',
        example: `{
  "id": "usr_456def",
  "email": "jane@example.com",
  "name": "Jane Smith",
  "role": "developer",
  "status": "active",
  "created_at": "2024-05-15T14:20:00Z"
}`,
      },
      {
        code: 400,
        description: 'Bad Request - Invalid input',
        example: `{
  "error": {
    "code": "validation_error",
    "message": "Email is required"
  }
}`,
      },
    ],
    codeExamples: [
      {
        language: 'cURL',
        code: `curl -X POST "https://api.example.com/v1/users" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "jane@example.com",
    "name": "Jane Smith",
    "role": "developer"
  }'`,
      },
      {
        language: 'JavaScript',
        code: `const response = await fetch('https://api.example.com/v1/users', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'jane@example.com',
    name: 'Jane Smith',
    role: 'developer'
  })
});

const data = await response.json();
console.log(data);`,
      },
      {
        language: 'Python',
        code: `import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}

payload = {
    'email': 'jane@example.com',
    'name': 'Jane Smith',
    'role': 'developer'
}

response = requests.post(
    'https://api.example.com/v1/users',
    headers=headers,
    json=payload
)

data = response.json()
print(data)`,
      },
    ],
  },
  {
    id: 'get-user',
    method: 'GET',
    path: '/api/v1/users/:id',
    title: 'Get User',
    description: 'Retrieve detailed information about a specific user by their ID.',
    category: 'Users',
    authentication: true,
    rateLimit: '200 requests/minute',
    parameters: [
      { name: 'id', type: 'string', required: true, description: 'Unique user identifier', example: 'usr_123abc' },
    ],
    responses: [
      {
        code: 200,
        description: 'Success',
        example: `{
  "id": "usr_123abc",
  "email": "john@example.com",
  "name": "John Doe",
  "role": "admin",
  "status": "active",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-05-15T14:20:00Z"
}`,
      },
      {
        code: 404,
        description: 'Not Found',
        example: `{
  "error": {
    "code": "not_found",
    "message": "User not found"
  }
}`,
      },
    ],
    codeExamples: [
      {
        language: 'cURL',
        code: `curl -X GET "https://api.example.com/v1/users/usr_123abc" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      },
      {
        language: 'JavaScript',
        code: `const userId = 'usr_123abc';
const response = await fetch(\`https://api.example.com/v1/users/\${userId}\`, {
  headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
});
const user = await response.json();`,
      },
    ],
  },
  {
    id: 'list-projects',
    method: 'GET',
    path: '/api/v1/projects',
    title: 'List Projects',
    description: 'Get all projects with optional filtering and sorting.',
    category: 'Projects',
    authentication: true,
    rateLimit: '100 requests/minute',
    parameters: [
      { name: 'status', type: 'string', required: false, description: 'Filter by status', example: 'active' },
      { name: 'user_id', type: 'string', required: false, description: 'Filter by user', example: 'usr_123abc' },
    ],
    responses: [
      {
        code: 200,
        description: 'Success',
        example: `{
  "data": [
    {
      "id": "prj_789xyz",
      "name": "Website Redesign",
      "status": "active",
      "created_at": "2024-05-01T00:00:00Z"
    }
  ]
}`,
      },
    ],
    codeExamples: [
      {
        language: 'cURL',
        code: `curl -X GET "https://api.example.com/v1/projects" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      },
    ],
  },
  {
    id: 'create-project',
    method: 'POST',
    path: '/api/v1/projects',
    title: 'Create Project',
    description: 'Create a new project with specified configuration.',
    category: 'Projects',
    authentication: true,
    rateLimit: '50 requests/minute',
    requestBody: {
      contentType: 'application/json',
      schema: `{
  "name": "string (required)",
  "description": "string (optional)",
  "settings": "object (optional)"
}`,
      example: `{
  "name": "New Project",
  "description": "Project description",
  "settings": {
    "visibility": "private"
  }
}`,
    },
    responses: [
      {
        code: 201,
        description: 'Created',
        example: `{
  "id": "prj_new123",
  "name": "New Project",
  "status": "active",
  "created_at": "2024-05-15T15:00:00Z"
}`,
      },
    ],
    codeExamples: [
      {
        language: 'JavaScript',
        code: `const response = await fetch('https://api.example.com/v1/projects', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'New Project',
    description: 'Project description'
  })
});`,
      },
    ],
  },
  {
    id: 'update-project',
    method: 'PATCH',
    path: '/api/v1/projects/:id',
    title: 'Update Project',
    description: 'Update specific fields of an existing project.',
    category: 'Projects',
    authentication: true,
    rateLimit: '50 requests/minute',
    requestBody: {
      contentType: 'application/json',
      schema: `{
  "name": "string (optional)",
  "description": "string (optional)",
  "status": "string (optional)"
}`,
      example: `{
  "name": "Updated Project Name",
  "status": "archived"
}`,
    },
    responses: [
      {
        code: 200,
        description: 'Success',
        example: `{
  "id": "prj_789xyz",
  "name": "Updated Project Name",
  "status": "archived",
  "updated_at": "2024-05-15T16:00:00Z"
}`,
      },
    ],
    codeExamples: [
      {
        language: 'Python',
        code: `response = requests.patch(
    'https://api.example.com/v1/projects/prj_789xyz',
    headers={'Authorization': 'Bearer YOUR_API_KEY'},
    json={'name': 'Updated Project Name'}
)`,
      },
    ],
  },
  {
    id: 'delete-project',
    method: 'DELETE',
    path: '/api/v1/projects/:id',
    title: 'Delete Project',
    description: 'Permanently delete a project and all its associated data.',
    category: 'Projects',
    authentication: true,
    rateLimit: '20 requests/minute',
    responses: [
      {
        code: 204,
        description: 'No Content - Successfully deleted',
        example: '',
      },
      {
        code: 404,
        description: 'Not Found',
        example: `{
  "error": {
    "code": "not_found",
    "message": "Project not found"
  }
}`,
      },
    ],
    codeExamples: [
      {
        language: 'cURL',
        code: `curl -X DELETE "https://api.example.com/v1/projects/prj_789xyz" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      },
    ],
  },
  {
    id: 'list-webhooks',
    method: 'GET',
    path: '/api/v1/webhooks',
    title: 'List Webhooks',
    description: 'Retrieve all configured webhooks for your account.',
    category: 'Webhooks',
    authentication: true,
    rateLimit: '100 requests/minute',
    responses: [
      {
        code: 200,
        description: 'Success',
        example: `{
  "data": [
    {
      "id": "wh_123",
      "url": "https://example.com/webhook",
      "events": ["user.created", "project.updated"],
      "active": true
    }
  ]
}`,
      },
    ],
    codeExamples: [
      {
        language: 'JavaScript',
        code: `const response = await fetch('https://api.example.com/v1/webhooks', {
  headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
});`,
      },
    ],
  },
  {
    id: 'create-webhook',
    method: 'POST',
    path: '/api/v1/webhooks',
    title: 'Create Webhook',
    description: 'Register a new webhook endpoint to receive event notifications.',
    category: 'Webhooks',
    authentication: true,
    rateLimit: '20 requests/minute',
    requestBody: {
      contentType: 'application/json',
      schema: `{
  "url": "string (required)",
  "events": "array (required)",
  "secret": "string (optional)"
}`,
      example: `{
  "url": "https://example.com/webhook",
  "events": ["user.created", "user.updated"],
  "secret": "whsec_abc123"
}`,
    },
    responses: [
      {
        code: 201,
        description: 'Created',
        example: `{
  "id": "wh_456",
  "url": "https://example.com/webhook",
  "events": ["user.created", "user.updated"],
  "active": true,
  "created_at": "2024-05-15T17:00:00Z"
}`,
      },
    ],
    codeExamples: [
      {
        language: 'JavaScript',
        code: `const response = await fetch('https://api.example.com/v1/webhooks', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://example.com/webhook',
    events: ['user.created', 'user.updated']
  })
});`,
      },
    ],
  },
]

const errorCodes = [
  { code: 400, name: 'Bad Request', description: 'The request was invalid or cannot be served.' },
  { code: 401, name: 'Unauthorized', description: 'Authentication failed or user doesn\'t have permissions.' },
  { code: 403, name: 'Forbidden', description: 'The request is understood, but it has been refused.' },
  { code: 404, name: 'Not Found', description: 'The requested resource could not be found.' },
  { code: 429, name: 'Too Many Requests', description: 'Rate limit exceeded. Please slow down your requests.' },
  { code: 500, name: 'Internal Server Error', description: 'An error occurred on our servers.' },
  { code: 503, name: 'Service Unavailable', description: 'The service is temporarily unavailable.' },
]

export default function APIReferencePage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint>(endpoints[0])
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = ['all', ...Array.from(new Set(endpoints.map((e) => e.category)))]

  const filteredEndpoints = endpoints.filter((endpoint) => {
    const matchesSearch =
      searchQuery === '' ||
      endpoint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      endpoint.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      endpoint.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === 'all' || endpoint.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <Code className="w-10 h-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent terminal-glow">API Reference</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Complete API documentation with code examples in multiple languages
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Endpoints', value: endpoints.length, icon: Terminal },
            { label: 'Categories', value: categories.length - 1, icon: Book },
            { label: 'Version', value: 'v1', icon: Settings },
            { label: 'Uptime', value: '99.9%', icon: TrendingUp },
          ].map((stat, index) => (
            <Card key={index} className="glass p-4 text-center">
              <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </motion.div>

        {/* Authentication Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-bold">Authentication</h3>
                <p className="text-muted-foreground">
                  All API requests require authentication using Bearer tokens. Include your API key in the Authorization header:
                </p>
                <Card className="glass-dark p-4 font-mono text-sm">
                  <div className="flex items-center justify-between">
                    <code>Authorization: Bearer YOUR_API_KEY</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyCode('Authorization: Bearer YOUR_API_KEY', 'auth')}
                    >
                      {copiedCode === 'auth' ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </Card>
                <div className="flex items-center gap-2 text-sm">
                  <Key className="w-4 h-4 text-primary" />
                  <span>Get your API key from your account settings</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-[300px_1fr] gap-6">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {/* Search */}
            <Card className="glass p-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search endpoints..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </Card>

            {/* Category Filter */}
            <Card className="glass p-4">
              <h3 className="font-semibold mb-3">Categories</h3>
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-lg transition-colors',
                      selectedCategory === category
                        ? 'bg-primary/20 text-primary'
                        : 'hover:bg-primary/10'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="capitalize">{category}</span>
                      <Badge variant="secondary" className="text-xs">
                        {category === 'all'
                          ? endpoints.length
                          : endpoints.filter((e) => e.category === category).length}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Endpoints List */}
            <Card className="glass">
              <ScrollArea className="h-[600px]">
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold mb-3">Endpoints</h3>
                  {filteredEndpoints.map((endpoint) => (
                    <button
                      key={endpoint.id}
                      onClick={() => setSelectedEndpoint(endpoint)}
                      className={cn(
                        'w-full text-left p-3 rounded-lg transition-all',
                        selectedEndpoint.id === endpoint.id
                          ? 'bg-primary/20 border-primary/50 border'
                          : 'hover:bg-primary/10 border border-transparent'
                      )}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className={cn('text-xs', methodConfig[endpoint.method].bg)}>
                            {endpoint.method}
                          </Badge>
                          <span className="text-xs font-mono text-muted-foreground truncate">
                            {endpoint.path}
                          </span>
                        </div>
                        <div className="text-sm font-semibold">{endpoint.title}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </motion.div>

          {/* Main Content - Endpoint Details */}
          <motion.div
            key={selectedEndpoint.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Endpoint Header */}
            <Card className="glass-overlay p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Badge className={cn('text-sm', methodConfig[selectedEndpoint.method].bg)}>
                        {selectedEndpoint.method}
                      </Badge>
                      <code className="text-lg font-mono">{selectedEndpoint.path}</code>
                    </div>
                    <h2 className="text-2xl font-bold">{selectedEndpoint.title}</h2>
                    <p className="text-muted-foreground">{selectedEndpoint.description}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Play className="w-4 h-4 mr-2" />
                    Try it
                  </Button>
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-primary" />
                    <span>{selectedEndpoint.authentication ? 'Auth required' : 'No auth'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{selectedEndpoint.rateLimit}</span>
                  </div>
                  <Badge variant="outline">{selectedEndpoint.category}</Badge>
                </div>
              </div>
            </Card>

            {/* Parameters */}
            {selectedEndpoint.parameters && selectedEndpoint.parameters.length > 0 && (
              <Card className="glass p-6">
                <h3 className="text-xl font-bold mb-4">Parameters</h3>
                <div className="space-y-4">
                  {selectedEndpoint.parameters.map((param) => (
                    <div key={param.name} className="border-l-2 border-primary/50 pl-4 space-y-1">
                      <div className="flex items-center gap-3">
                        <code className="font-mono font-semibold">{param.name}</code>
                        <Badge variant="outline" className="text-xs">
                          {param.type}
                        </Badge>
                        {param.required && (
                          <Badge variant="destructive" className="text-xs">
                            Required
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{param.description}</p>
                      {param.example && (
                        <code className="text-xs text-primary">Example: {param.example}</code>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Request Body */}
            {selectedEndpoint.requestBody && (
              <Card className="glass p-6">
                <h3 className="text-xl font-bold mb-4">Request Body</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Content-Type:</span>
                    <code className="font-mono">{selectedEndpoint.requestBody.contentType}</code>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Schema</h4>
                    <Card className="glass-dark p-4 font-mono text-sm">
                      <pre className="whitespace-pre-wrap">{selectedEndpoint.requestBody.schema}</pre>
                    </Card>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Example</h4>
                    <Card className="glass-dark p-4 font-mono text-sm">
                      <div className="flex items-start justify-between gap-4">
                        <pre className="whitespace-pre-wrap flex-1">{selectedEndpoint.requestBody.example}</pre>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyCode(selectedEndpoint.requestBody!.example, 'request-body')}
                        >
                          {copiedCode === 'request-body' ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>
              </Card>
            )}

            {/* Responses */}
            <Card className="glass p-6">
              <h3 className="text-xl font-bold mb-4">Responses</h3>
              <Accordion type="single" collapsible className="w-full">
                {selectedEndpoint.responses.map((response, index) => (
                  <AccordionItem key={index} value={`response-${index}`}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={response.code < 300 ? 'default' : 'destructive'}
                          className="w-16 justify-center"
                        >
                          {response.code}
                        </Badge>
                        <span>{response.description}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      {response.example && (
                        <Card className="glass-dark p-4 font-mono text-sm">
                          <div className="flex items-start justify-between gap-4">
                            <pre className="whitespace-pre-wrap flex-1">{response.example}</pre>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyCode(response.example, `response-${index}`)}
                            >
                              {copiedCode === `response-${index}` ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </Card>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>

            {/* Code Examples */}
            <Card className="glass p-6">
              <h3 className="text-xl font-bold mb-4">Code Examples</h3>
              <Tabs defaultValue={selectedEndpoint.codeExamples[0]?.language} className="w-full">
                <TabsList className="glass">
                  {selectedEndpoint.codeExamples.map((example) => (
                    <TabsTrigger key={example.language} value={example.language}>
                      {example.language}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {selectedEndpoint.codeExamples.map((example) => (
                  <TabsContent key={example.language} value={example.language} className="mt-4">
                    <Card className="glass-dark p-4 font-mono text-sm">
                      <div className="flex items-start justify-between gap-4">
                        <pre className="whitespace-pre-wrap flex-1">{example.code}</pre>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyCode(example.code, example.language)}
                        >
                          {copiedCode === example.language ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </Card>
          </motion.div>
        </div>

        {/* Error Codes Reference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl font-bold">Error Codes</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {errorCodes.map((error) => (
              <Card key={error.code} className="glass p-4">
                <div className="flex items-start gap-3">
                  <Badge variant={error.code < 500 ? 'default' : 'destructive'} className="mt-1">
                    {error.code}
                  </Badge>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{error.name}</h3>
                    <p className="text-sm text-muted-foreground">{error.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Rate Limiting Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-bold">Rate Limiting</h3>
                <p className="text-muted-foreground">
                  API requests are rate-limited to ensure fair usage. Rate limits vary by endpoint and plan tier.
                  Check response headers for current limit status:
                </p>
                <ul className="space-y-1 text-sm font-mono list-disc list-inside text-muted-foreground">
                  <li>X-RateLimit-Limit: Maximum requests per window</li>
                  <li>X-RateLimit-Remaining: Requests remaining</li>
                  <li>X-RateLimit-Reset: Time when limit resets (Unix timestamp)</li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
