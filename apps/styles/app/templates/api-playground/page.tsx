"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Send,
  Plus,
  Trash2,
  Copy,
  Check,
  Clock,
  Star,
  FolderOpen,
  Download,
  Upload,
  Code2,
  Key,
  Lock,
  Unlock,
  ChevronRight,
  ChevronDown,
  Search,
  Filter,
  Settings2,
  Globe,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Zap,
  FileJson,
  FileCode,
  Image as ImageIcon,
  RotateCw,
  Save,
  Share2,
  History,
} from "lucide-react"
import { Card, Button, Input, Label, Textarea, Tabs, TabsContent, TabsList, TabsTrigger, Badge, Switch, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@ggprompts/ui"

// Types
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS"
type AuthType = "none" | "bearer" | "basic" | "apikey"
type BodyType = "none" | "json" | "form" | "urlencoded" | "raw"

interface KeyValuePair {
  id: string
  key: string
  value: string
  enabled: boolean
}

interface RequestConfig {
  method: HttpMethod
  url: string
  params: KeyValuePair[]
  headers: KeyValuePair[]
  body: {
    type: BodyType
    content: string
    formData: KeyValuePair[]
  }
  auth: {
    type: AuthType
    token: string
    username: string
    password: string
    apiKey: string
    apiValue: string
  }
}

interface ResponseData {
  status: number
  statusText: string
  time: number
  size: number
  headers: Record<string, string>
  body: string
  type: "json" | "html" | "text" | "image"
}

interface HistoryItem {
  id: string
  method: HttpMethod
  url: string
  status: number
  time: number
  timestamp: Date
  starred: boolean
}

interface Collection {
  id: string
  name: string
  requests: SavedRequest[]
  expanded: boolean
}

interface SavedRequest {
  id: string
  name: string
  method: HttpMethod
  url: string
  config: RequestConfig
}

interface Environment {
  name: string
  variables: Record<string, string>
}

// Method colors
const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: "text-secondary border-secondary/30 bg-secondary/10",
  POST: "text-primary border-primary/30 bg-primary/10",
  PUT: "text-amber-400 border-amber-400/30 bg-amber-400/10",
  PATCH: "text-purple-400 border-purple-400/30 bg-purple-400/10",
  DELETE: "text-red-400 border-red-400/30 bg-red-400/10",
  HEAD: "text-muted-foreground border-muted/30 bg-muted/10",
  OPTIONS: "text-blue-400 border-blue-400/30 bg-blue-400/10",
}

// Sample environments
const SAMPLE_ENVIRONMENTS: Environment[] = [
  {
    name: "Development",
    variables: {
      base_url: "http://localhost:3000",
      api_key: "dev_key_123",
    },
  },
  {
    name: "Staging",
    variables: {
      base_url: "https://staging.example.com",
      api_key: "staging_key_456",
    },
  },
  {
    name: "Production",
    variables: {
      base_url: "https://api.example.com",
      api_key: "prod_key_789",
    },
  },
]

export default function APIPlayground() {
  // State
  const [config, setConfig] = useState<RequestConfig>({
    method: "GET",
    url: "https://jsonplaceholder.typicode.com/posts",
    params: [],
    headers: [
      { id: "1", key: "Content-Type", value: "application/json", enabled: true },
    ],
    body: {
      type: "json",
      content: "{\n  \"title\": \"foo\",\n  \"body\": \"bar\",\n  \"userId\": 1\n}",
      formData: [],
    },
    auth: {
      type: "none",
      token: "",
      username: "",
      password: "",
      apiKey: "X-API-Key",
      apiValue: "",
    },
  })

  const [response, setResponse] = useState<ResponseData | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("params")
  const [responseTab, setResponseTab] = useState("body")
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [collections, setCollections] = useState<Collection[]>([
    {
      id: "1",
      name: "JSONPlaceholder API",
      expanded: true,
      requests: [
        {
          id: "r1",
          name: "Get Posts",
          method: "GET",
          url: "https://jsonplaceholder.typicode.com/posts",
          config: {
            method: "GET",
            url: "https://jsonplaceholder.typicode.com/posts",
            params: [],
            headers: [],
            body: { type: "none", content: "", formData: [] },
            auth: { type: "none", token: "", username: "", password: "", apiKey: "", apiValue: "" },
          },
        },
        {
          id: "r2",
          name: "Get Comments",
          method: "GET",
          url: "https://jsonplaceholder.typicode.com/comments",
          config: {
            method: "GET",
            url: "https://jsonplaceholder.typicode.com/comments",
            params: [{ id: "1", key: "postId", value: "1", enabled: true }],
            headers: [],
            body: { type: "none", content: "", formData: [] },
            auth: { type: "none", token: "", username: "", password: "", apiKey: "", apiValue: "" },
          },
        },
        {
          id: "r3",
          name: "Create Post",
          method: "POST",
          url: "https://jsonplaceholder.typicode.com/posts",
          config: {
            method: "POST",
            url: "https://jsonplaceholder.typicode.com/posts",
            params: [],
            headers: [{ id: "1", key: "Content-Type", value: "application/json", enabled: true }],
            body: {
              type: "json",
              content: '{\n  "title": "foo",\n  "body": "bar",\n  "userId": 1\n}',
              formData: [],
            },
            auth: { type: "none", token: "", username: "", password: "", apiKey: "", apiValue: "" },
          },
        },
      ],
    },
  ])
  const [currentEnvironment, setCurrentEnvironment] = useState<Environment>(SAMPLE_ENVIRONMENTS[0])
  const [showCollections, setShowCollections] = useState(true)
  const [showHistory, setShowHistory] = useState(false)
  const [codeLanguage, setCodeLanguage] = useState("curl")
  const [searchQuery, setSearchQuery] = useState("")

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("api-playground-history")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setHistory(parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        })))
      } catch (e) {
        console.error("Failed to load history", e)
      }
    }
  }, [])

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem("api-playground-history", JSON.stringify(history))
  }, [history])

  // Send request
  const sendRequest = async () => {
    setLoading(true)
    const startTime = Date.now()

    try {
      // Build URL with params
      let url = replaceVariables(config.url)
      const enabledParams = config.params.filter(p => p.enabled && p.key)
      if (enabledParams.length > 0) {
        const queryString = enabledParams
          .map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(replaceVariables(p.value))}`)
          .join("&")
        url += (url.includes("?") ? "&" : "?") + queryString
      }

      // Build headers
      const headers: Record<string, string> = {}
      config.headers
        .filter(h => h.enabled && h.key)
        .forEach(h => {
          headers[h.key] = replaceVariables(h.value)
        })

      // Add auth headers
      if (config.auth.type === "bearer" && config.auth.token) {
        headers["Authorization"] = `Bearer ${replaceVariables(config.auth.token)}`
      } else if (config.auth.type === "basic" && config.auth.username) {
        const encoded = btoa(`${config.auth.username}:${config.auth.password}`)
        headers["Authorization"] = `Basic ${encoded}`
      } else if (config.auth.type === "apikey" && config.auth.apiKey && config.auth.apiValue) {
        headers[config.auth.apiKey] = replaceVariables(config.auth.apiValue)
      }

      // Build body
      let body: string | undefined
      if (config.method !== "GET" && config.method !== "HEAD") {
        if (config.body.type === "json" || config.body.type === "raw") {
          body = replaceVariables(config.body.content)
        } else if (config.body.type === "urlencoded") {
          const params = config.body.formData
            .filter(p => p.enabled && p.key)
            .map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(replaceVariables(p.value))}`)
            .join("&")
          body = params
          headers["Content-Type"] = "application/x-www-form-urlencoded"
        }
      }

      // Mock response for demo purposes
      // In a real app, this would be: const res = await fetch(url, { method: config.method, headers, body })
      const mockResponse = await mockFetch(url, config.method, body)
      const endTime = Date.now()

      setResponse({
        status: mockResponse.status,
        statusText: mockResponse.statusText,
        time: endTime - startTime,
        size: JSON.stringify(mockResponse.body).length,
        headers: mockResponse.headers,
        body: typeof mockResponse.body === "string" ? mockResponse.body : JSON.stringify(mockResponse.body, null, 2),
        type: mockResponse.type,
      })

      // Add to history
      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        method: config.method,
        url: config.url,
        status: mockResponse.status,
        time: endTime - startTime,
        timestamp: new Date(),
        starred: false,
      }
      setHistory(prev => [historyItem, ...prev.slice(0, 99)])
    } catch (error) {
      setResponse({
        status: 0,
        statusText: "Error",
        time: Date.now() - startTime,
        size: 0,
        headers: {},
        body: error instanceof Error ? error.message : "Unknown error",
        type: "text",
      })
    } finally {
      setLoading(false)
    }
  }

  // Mock fetch for demo
  const mockFetch = async (url: string, method: HttpMethod, body?: string): Promise<any> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 400))

    if (url.includes("posts")) {
      if (method === "GET") {
        return {
          status: 200,
          statusText: "OK",
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Limit": "1000",
            "X-RateLimit-Remaining": "999",
          },
          type: "json",
          body: [
            { id: 1, title: "Post 1", body: "Content 1", userId: 1 },
            { id: 2, title: "Post 2", body: "Content 2", userId: 1 },
            { id: 3, title: "Post 3", body: "Content 3", userId: 2 },
          ],
        }
      } else if (method === "POST") {
        return {
          status: 201,
          statusText: "Created",
          headers: {
            "Content-Type": "application/json",
            "Location": "/posts/101",
          },
          type: "json",
          body: { id: 101, ...JSON.parse(body || "{}") },
        }
      }
    }

    if (url.includes("comments")) {
      return {
        status: 200,
        statusText: "OK",
        headers: { "Content-Type": "application/json" },
        type: "json",
        body: [
          { id: 1, postId: 1, name: "Comment 1", email: "user1@example.com", body: "Great post!" },
          { id: 2, postId: 1, name: "Comment 2", email: "user2@example.com", body: "Thanks for sharing" },
        ],
      }
    }

    return {
      status: 404,
      statusText: "Not Found",
      headers: { "Content-Type": "application/json" },
      type: "json",
      body: { error: "Endpoint not found" },
    }
  }

  // Replace environment variables
  const replaceVariables = (text: string): string => {
    let result = text
    Object.entries(currentEnvironment.variables).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{{${key}}}`, "g"), value)
    })
    return result
  }

  // Add key-value pair
  const addKeyValue = (type: "params" | "headers" | "formData") => {
    const newPair: KeyValuePair = {
      id: Date.now().toString(),
      key: "",
      value: "",
      enabled: true,
    }

    if (type === "params") {
      setConfig(prev => ({ ...prev, params: [...prev.params, newPair] }))
    } else if (type === "headers") {
      setConfig(prev => ({ ...prev, headers: [...prev.headers, newPair] }))
    } else if (type === "formData") {
      setConfig(prev => ({
        ...prev,
        body: { ...prev.body, formData: [...prev.body.formData, newPair] },
      }))
    }
  }

  // Remove key-value pair
  const removeKeyValue = (id: string, type: "params" | "headers" | "formData") => {
    if (type === "params") {
      setConfig(prev => ({ ...prev, params: prev.params.filter(p => p.id !== id) }))
    } else if (type === "headers") {
      setConfig(prev => ({ ...prev, headers: prev.headers.filter(h => h.id !== id) }))
    } else if (type === "formData") {
      setConfig(prev => ({
        ...prev,
        body: { ...prev.body, formData: prev.body.formData.filter(f => f.id !== id) },
      }))
    }
  }

  // Update key-value pair
  const updateKeyValue = (
    id: string,
    field: "key" | "value" | "enabled",
    value: string | boolean,
    type: "params" | "headers" | "formData"
  ) => {
    if (type === "params") {
      setConfig(prev => ({
        ...prev,
        params: prev.params.map(p => (p.id === id ? { ...p, [field]: value } : p)),
      }))
    } else if (type === "headers") {
      setConfig(prev => ({
        ...prev,
        headers: prev.headers.map(h => (h.id === id ? { ...h, [field]: value } : h)),
      }))
    } else if (type === "formData") {
      setConfig(prev => ({
        ...prev,
        body: {
          ...prev.body,
          formData: prev.body.formData.map(f => (f.id === id ? { ...f, [field]: value } : f)),
        },
      }))
    }
  }

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Generate code
  const generateCode = (language: string): string => {
    const url = config.url
    const method = config.method

    if (language === "curl") {
      let cmd = `curl -X ${method} "${url}"`

      config.headers
        .filter(h => h.enabled && h.key)
        .forEach(h => {
          cmd += ` \\\n  -H "${h.key}: ${h.value}"`
        })

      if (config.body.type === "json" && config.body.content) {
        cmd += ` \\\n  -d '${config.body.content.replace(/\n/g, "")}'`
      }

      return cmd
    }

    if (language === "javascript") {
      const headers: Record<string, string> = {}
      config.headers.filter(h => h.enabled && h.key).forEach(h => {
        headers[h.key] = h.value
      })

      return `fetch("${url}", {
  method: "${method}",
  headers: ${JSON.stringify(headers, null, 2)},${
        config.body.type === "json" && config.body.content
          ? `\n  body: ${config.body.content}`
          : ""
      }
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error))`
    }

    if (language === "python") {
      return `import requests

url = "${url}"
headers = {${config.headers
        .filter(h => h.enabled && h.key)
        .map(h => `\n    "${h.key}": "${h.value}"`)
        .join(",")}\n}${
        config.body.type === "json" && config.body.content
          ? `\ndata = ${config.body.content}`
          : ""
      }

response = requests.${method.toLowerCase()}(url, headers=headers${
        config.body.type === "json" && config.body.content ? ", json=data" : ""
      })
print(response.json())`
    }

    return "// Select a language"
  }

  // Load saved request
  const loadRequest = (request: SavedRequest) => {
    setConfig(request.config)
  }

  // Toggle collection
  const toggleCollection = (id: string) => {
    setCollections(prev =>
      prev.map(c => (c.id === id ? { ...c, expanded: !c.expanded } : c))
    )
  }

  // Star history item
  const toggleStar = (id: string) => {
    setHistory(prev =>
      prev.map(h => (h.id === id ? { ...h, starred: !h.starred } : h))
    )
  }

  // Get status color
  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "text-primary"
    if (status >= 300 && status < 400) return "text-secondary"
    if (status >= 400 && status < 500) return "text-amber-400"
    if (status >= 500) return "text-red-400"
    return "text-muted-foreground"
  }

  // Get status icon
  const getStatusIcon = (status: number) => {
    if (status >= 200 && status < 300) return <CheckCircle className="w-4 h-4" />
    if (status >= 400 && status < 500) return <AlertCircle className="w-4 h-4" />
    if (status >= 500) return <XCircle className="w-4 h-4" />
    return <Info className="w-4 h-4" />
  }

  // Format JSON
  const formatJSON = (str: string): string => {
    try {
      return JSON.stringify(JSON.parse(str), null, 2)
    } catch {
      return str
    }
  }

  // KeyboardShortcuts: Ctrl+Enter to send
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        sendRequest()
      }
    }
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [config])

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="relative">
              <Zap className="w-12 h-12 text-primary" />
              <motion.div
                className="absolute inset-0 bg-primary/20 blur-xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <h1 className="text-5xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent terminal-glow">API Playground</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Test, debug, and document your APIs with ease
          </p>
          <div className="flex items-center justify-center gap-2">
            <Select value={currentEnvironment.name} onValueChange={(name) => {
              const env = SAMPLE_ENVIRONMENTS.find(e => e.name === name)
              if (env) setCurrentEnvironment(env)
            }}>
              <SelectTrigger className="w-48 glass border-white/10">
                <Globe className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SAMPLE_ENVIRONMENTS.map(env => (
                  <SelectItem key={env.name} value={env.name}>
                    {env.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge variant="outline" className="border-primary/30 text-primary">
              {history.length} requests
            </Badge>
          </div>
        </motion.div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar - Collections & History */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 space-y-4"
          >
            <Card className="glass border-white/10 p-4">
              <Tabs defaultValue="collections">
                <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 mb-4">
                  <TabsList className="grid w-max md:w-full grid-cols-2">
                    <TabsTrigger value="collections" className="text-xs sm:text-sm whitespace-nowrap">
                      <FolderOpen className="w-4 h-4 mr-2" />
                      Collections
                    </TabsTrigger>
                    <TabsTrigger value="history" className="text-xs sm:text-sm whitespace-nowrap">
                      <History className="w-4 h-4 mr-2" />
                      History
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Collections Tab */}
                <TabsContent value="collections" className="space-y-2">
                  {collections.map(collection => (
                    <div key={collection.id} className="space-y-1">
                      <Button
                        variant="ghost"
                        className="w-full justify-start font-medium"
                        onClick={() => toggleCollection(collection.id)}
                      >
                        {collection.expanded ? (
                          <ChevronDown className="w-4 h-4 mr-2" />
                        ) : (
                          <ChevronRight className="w-4 h-4 mr-2" />
                        )}
                        {collection.name}
                        <Badge variant="outline" className="ml-auto text-xs">
                          {collection.requests.length}
                        </Badge>
                      </Button>

                      <AnimatePresence>
                        {collection.expanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="ml-4 space-y-1"
                          >
                            {collection.requests.map(request => (
                              <Button
                                key={request.id}
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-xs"
                                onClick={() => loadRequest(request)}
                              >
                                <Badge
                                  variant="outline"
                                  className={`mr-2 text-xs ${METHOD_COLORS[request.method]}`}
                                >
                                  {request.method}
                                </Badge>
                                <span className="truncate">{request.name}</span>
                              </Button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}

                  <Button variant="outline" size="sm" className="w-full mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    New Collection
                  </Button>
                </TabsContent>

                {/* History Tab */}
                <TabsContent value="history" className="space-y-2 max-h-[600px] overflow-y-auto">
                  <div className="flex items-center gap-2 mb-2">
                    <Input
                      placeholder="Search history..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="text-xs h-8"
                    />
                  </div>

                  {history
                    .filter(h => h.url.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(item => (
                      <div
                        key={item.id}
                        className="group flex items-start gap-2 p-2 rounded-lg hover:bg-white/5 cursor-pointer"
                        onClick={() => {
                          // Load request from history
                          setConfig(prev => ({ ...prev, method: item.method, url: item.url }))
                        }}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleStar(item.id)
                          }}
                        >
                          <Star
                            className={`w-3 h-3 ${
                              item.starred ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
                            }`}
                          />
                        </Button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              variant="outline"
                              className={`text-xs ${METHOD_COLORS[item.method]}`}
                            >
                              {item.method}
                            </Badge>
                            <span className={`text-xs ${getStatusColor(item.status)}`}>
                              {item.status}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{item.url}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{item.time}ms</span>
                            <span>•</span>
                            <span>{item.timestamp.toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}

                  {history.length === 0 && (
                    <div className="text-center text-muted-foreground text-sm py-8">
                      No request history yet
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </Card>
          </motion.div>

          {/* Main Panel - Request & Response */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-9 space-y-4"
          >
            {/* Request Builder */}
            <Card className="glass border-white/10 p-6">
              <div className="space-y-4">
                {/* Request Line */}
                <div className="flex gap-2">
                  <Select
                    value={config.method}
                    onValueChange={(value) => setConfig(prev => ({ ...prev, method: value as HttpMethod }))}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(["GET", "POST", "PUT", "PATCH", "DELETE"] as HttpMethod[]).map(method => (
                        <SelectItem key={method} value={method}>
                          <span className={METHOD_COLORS[method]}>{method}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    value={config.url}
                    onChange={(e) => setConfig(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="Enter request URL..."
                    className="flex-1"
                    onKeyDown={(e) => {
                      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                        sendRequest()
                      }
                    }}
                  />

                  <Button
                    onClick={sendRequest}
                    disabled={loading || !config.url}
                    className="min-w-32"
                  >
                    {loading ? (
                      <>
                        <RotateCw className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                  Press <kbd className="px-1 py-0.5 bg-muted border border-border rounded">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-muted border border-border rounded">Enter</kbd> to send
                </p>

                {/* Request Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="params">
                      Params
                      {config.params.filter(p => p.enabled && p.key).length > 0 && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          {config.params.filter(p => p.enabled && p.key).length}
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="headers">
                      Headers
                      {config.headers.filter(h => h.enabled && h.key).length > 0 && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          {config.headers.filter(h => h.enabled && h.key).length}
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="body">Body</TabsTrigger>
                    <TabsTrigger value="auth">Auth</TabsTrigger>
                  </TabsList>

                  {/* Params Tab */}
                  <TabsContent value="params" className="space-y-2">
                    <div className="space-y-2">
                      {config.params.map(param => (
                        <div key={param.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={param.enabled}
                            onChange={(e) => updateKeyValue(param.id, "enabled", e.target.checked, "params")}
                            className="rounded border-white/20"
                          />
                          <Input
                            placeholder="Key"
                            value={param.key}
                            onChange={(e) => updateKeyValue(param.id, "key", e.target.value, "params")}
                            className="flex-1"
                          />
                          <Input
                            placeholder="Value"
                            value={param.value}
                            onChange={(e) => updateKeyValue(param.id, "value", e.target.value, "params")}
                            className="flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeKeyValue(param.id, "params")}
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addKeyValue("params")}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Parameter
                    </Button>
                  </TabsContent>

                  {/* Headers Tab */}
                  <TabsContent value="headers" className="space-y-2">
                    <div className="space-y-2">
                      {config.headers.map(header => (
                        <div key={header.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={header.enabled}
                            onChange={(e) => updateKeyValue(header.id, "enabled", e.target.checked, "headers")}
                            className="rounded border-white/20"
                          />
                          <Input
                            placeholder="Header"
                            value={header.key}
                            onChange={(e) => updateKeyValue(header.id, "key", e.target.value, "headers")}
                            className="flex-1"
                          />
                          <Input
                            placeholder="Value"
                            value={header.value}
                            onChange={(e) => updateKeyValue(header.id, "value", e.target.value, "headers")}
                            className="flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeKeyValue(header.id, "headers")}
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addKeyValue("headers")}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Header
                      </Button>

                      <Select
                        onValueChange={(value) => {
                          const [key, val] = value.split(":")
                          addKeyValue("headers")
                          const lastId = config.headers[config.headers.length - 1]?.id || "0"
                          const newId = (parseInt(lastId) + 1).toString()
                          updateKeyValue(newId, "key", key, "headers")
                          updateKeyValue(newId, "value", val, "headers")
                        }}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Common headers" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Accept:application/json">Accept: application/json</SelectItem>
                          <SelectItem value="Content-Type:application/json">Content-Type: application/json</SelectItem>
                          <SelectItem value="User-Agent:Mozilla/5.0">User-Agent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  {/* Body Tab */}
                  <TabsContent value="body" className="space-y-4">
                    <Select
                      value={config.body.type}
                      onValueChange={(value) => setConfig(prev => ({
                        ...prev,
                        body: { ...prev.body, type: value as BodyType },
                      }))}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="raw">Raw Text</SelectItem>
                        <SelectItem value="urlencoded">URL Encoded</SelectItem>
                      </SelectContent>
                    </Select>

                    {(config.body.type === "json" || config.body.type === "raw") && (
                      <div>
                        <Textarea
                          value={config.body.content}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            body: { ...prev.body, content: e.target.value },
                          }))}
                          className="font-mono text-sm h-64"
                          placeholder={config.body.type === "json" ? "{\n  \"key\": \"value\"\n}" : "Enter text..."}
                        />
                        {config.body.type === "json" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => {
                              setConfig(prev => ({
                                ...prev,
                                body: { ...prev.body, content: formatJSON(prev.body.content) },
                              }))
                            }}
                          >
                            Format JSON
                          </Button>
                        )}
                      </div>
                    )}

                    {config.body.type === "urlencoded" && (
                      <div className="space-y-2">
                        {config.body.formData.map(field => (
                          <div key={field.id} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={field.enabled}
                              onChange={(e) => updateKeyValue(field.id, "enabled", e.target.checked, "formData")}
                              className="rounded border-white/20"
                            />
                            <Input
                              placeholder="Key"
                              value={field.key}
                              onChange={(e) => updateKeyValue(field.id, "key", e.target.value, "formData")}
                              className="flex-1"
                            />
                            <Input
                              placeholder="Value"
                              value={field.value}
                              onChange={(e) => updateKeyValue(field.id, "value", e.target.value, "formData")}
                              className="flex-1"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeKeyValue(field.id, "formData")}
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addKeyValue("formData")}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Field
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  {/* Auth Tab */}
                  <TabsContent value="auth" className="space-y-4">
                    <Select
                      value={config.auth.type}
                      onValueChange={(value) => setConfig(prev => ({
                        ...prev,
                        auth: { ...prev.auth, type: value as AuthType },
                      }))}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Auth</SelectItem>
                        <SelectItem value="bearer">Bearer Token</SelectItem>
                        <SelectItem value="basic">Basic Auth</SelectItem>
                        <SelectItem value="apikey">API Key</SelectItem>
                      </SelectContent>
                    </Select>

                    {config.auth.type === "bearer" && (
                      <div>
                        <Label>Token</Label>
                        <Input
                          type="password"
                          value={config.auth.token}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            auth: { ...prev.auth, token: e.target.value },
                          }))}
                          placeholder="Enter bearer token..."
                          className="mt-2"
                        />
                      </div>
                    )}

                    {config.auth.type === "basic" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Username</Label>
                          <Input
                            value={config.auth.username}
                            onChange={(e) => setConfig(prev => ({
                              ...prev,
                              auth: { ...prev.auth, username: e.target.value },
                            }))}
                            placeholder="Username"
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>Password</Label>
                          <Input
                            type="password"
                            value={config.auth.password}
                            onChange={(e) => setConfig(prev => ({
                              ...prev,
                              auth: { ...prev.auth, password: e.target.value },
                            }))}
                            placeholder="Password"
                            className="mt-2"
                          />
                        </div>
                      </div>
                    )}

                    {config.auth.type === "apikey" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Key Name</Label>
                          <Input
                            value={config.auth.apiKey}
                            onChange={(e) => setConfig(prev => ({
                              ...prev,
                              auth: { ...prev.auth, apiKey: e.target.value },
                            }))}
                            placeholder="X-API-Key"
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>Value</Label>
                          <Input
                            type="password"
                            value={config.auth.apiValue}
                            onChange={(e) => setConfig(prev => ({
                              ...prev,
                              auth: { ...prev.auth, apiValue: e.target.value },
                            }))}
                            placeholder="API key value"
                            className="mt-2"
                          />
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </Card>

            {/* Response Viewer */}
            {response && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="glass border-white/10 p-6">
                  {/* Response Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(response.status)}
                        <span className={`text-xl font-bold ${getStatusColor(response.status)}`}>
                          {response.status} {response.statusText}
                        </span>
                      </div>
                      <Badge variant="outline" className="border-secondary/30 text-secondary">
                        <Clock className="w-3 h-3 mr-1" />
                        {response.time}ms
                      </Badge>
                      <Badge variant="outline" className="border-primary/30 text-primary">
                        {response.size} bytes
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(response.body)}
                      >
                        {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                        Copy
                      </Button>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Code2 className="w-4 h-4 mr-2" />
                            Code
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="glass border-white/10 max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Generate Code</DialogTitle>
                            <DialogDescription>
                              Copy code snippets in your preferred language
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Select value={codeLanguage} onValueChange={setCodeLanguage}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="curl">cURL</SelectItem>
                                <SelectItem value="javascript">JavaScript (fetch)</SelectItem>
                                <SelectItem value="python">Python (requests)</SelectItem>
                              </SelectContent>
                            </Select>
                            <div className="relative">
                              <pre className="bg-background border border-white/10 rounded-lg p-4 overflow-x-auto max-h-96">
                                <code className="text-primary text-sm font-mono">
                                  {generateCode(codeLanguage)}
                                </code>
                              </pre>
                              <Button
                                variant="outline"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={() => copyToClipboard(generateCode(codeLanguage))}
                              >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  {/* Response Tabs */}
                  <Tabs value={responseTab} onValueChange={setResponseTab}>
                    <TabsList>
                      <TabsTrigger value="body">Body</TabsTrigger>
                      <TabsTrigger value="headers">
                        Headers
                        <Badge variant="outline" className="ml-2 text-xs">
                          {Object.keys(response.headers).length}
                        </Badge>
                      </TabsTrigger>
                    </TabsList>

                    {/* Body Tab */}
                    <TabsContent value="body">
                      <div className="border border-white/10 rounded-lg bg-background/50 p-4 max-h-96 overflow-auto">
                        {response.type === "json" ? (
                          <pre className="text-primary text-sm font-mono whitespace-pre-wrap">
                            {response.body}
                          </pre>
                        ) : (
                          <pre className="text-muted-foreground text-sm font-mono whitespace-pre-wrap">
                            {response.body}
                          </pre>
                        )}
                      </div>
                    </TabsContent>

                    {/* Headers Tab */}
                    <TabsContent value="headers">
                      <div className="border border-white/10 rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Header</TableHead>
                              <TableHead>Value</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {Object.entries(response.headers).map(([key, value]) => (
                              <TableRow key={key}>
                                <TableCell className="font-mono text-secondary">{key}</TableCell>
                                <TableCell className="font-mono text-foreground">{value}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>
                  </Tabs>
                </Card>
              </motion.div>
            )}

            {/* No response placeholder */}
            {!response && !loading && (
              <Card className="glass border-white/10 p-12">
                <div className="text-center text-muted-foreground">
                  <Send className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p className="text-lg">No response yet</p>
                  <p className="text-sm mt-2">Send a request to see the response</p>
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
