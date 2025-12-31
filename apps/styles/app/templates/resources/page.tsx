"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  FileCode,
  Wrench,
  Download,
  Star,
  Eye,
  Heart,
  Search,
  Filter,
  TrendingUp,
  Clock,
  Award,
  Plus,
  Grid3x3,
  List,
  ChevronRight,
  ExternalLink,
  Share2,
  Bookmark,
  Check,
  Github,
  Package,
  Code2,
  Lightbulb,
  Sparkles,
  Folder,
  Tag,
  ArrowUpDown,
} from "lucide-react";
import { Button, Card, Badge, Input, Separator, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Tabs, TabsContent, TabsList, TabsTrigger, Avatar, AvatarFallback, AvatarImage } from "@ggprompts/ui";

// Resource categories
const categories = [
  {
    id: "guides",
    name: "Guides & Tutorials",
    icon: BookOpen,
    color: "text-blue-400",
    count: 156,
    description: "Step-by-step guides and comprehensive tutorials",
  },
  {
    id: "templates",
    name: "Code Templates",
    icon: FileCode,
    color: "text-purple-400",
    count: 89,
    description: "Ready-to-use code snippets and project templates",
  },
  {
    id: "tools",
    name: "Developer Tools",
    icon: Wrench,
    color: "text-emerald-400",
    count: 124,
    description: "Essential tools and utilities for developers",
  },
  {
    id: "libraries",
    name: "Libraries & Packages",
    icon: Package,
    color: "text-orange-400",
    count: 203,
    description: "Curated collection of useful libraries",
  },
  {
    id: "examples",
    name: "Code Examples",
    icon: Code2,
    color: "text-cyan-400",
    count: 178,
    description: "Real-world code examples and patterns",
  },
  {
    id: "inspiration",
    name: "Design Inspiration",
    icon: Lightbulb,
    color: "text-yellow-400",
    count: 94,
    description: "UI/UX inspiration and design resources",
  },
];

// Generate resources
const generateResources = () => {
  const titles = [
    "React TypeScript Boilerplate",
    "Next.js E-Commerce Template",
    "Full-Stack Authentication System",
    "Component Design System",
    "API Documentation Generator",
    "Performance Testing Suite",
    "Database Migration Tools",
    "CI/CD Pipeline Template",
    "Monitoring Dashboard",
    "GraphQL Schema Generator",
    "Serverless Function Library",
    "Mobile App Starter Kit",
    "Admin Panel Template",
    "Blog Engine Template",
    "Real-time Chat System",
    "Payment Integration Guide",
    "File Upload System",
    "Email Template Library",
    "Form Validation Toolkit",
    "State Management Patterns",
    "Testing Framework Setup",
    "Docker Configuration Guide",
    "Kubernetes Deployment",
    "OAuth2 Implementation",
    "WebSocket Server Template",
    "REST API Boilerplate",
    "Microservices Framework",
    "Design Pattern Examples",
    "Algorithm Visualizer",
    "Data Structures Library",
    "Machine Learning Toolkit",
    "Image Processing Tools",
    "PDF Generation Library",
    "CSV Parser Utility",
    "JSON Schema Validator",
  ];

  const types = ["guide", "template", "tool", "library", "example"];
  const tags = [
    "React",
    "TypeScript",
    "Node.js",
    "Python",
    "Go",
    "Docker",
    "AWS",
    "Performance",
    "Security",
    "Testing",
  ];
  const authors = [
    "Sarah Chen",
    "Mike Johnson",
    "Emma Wilson",
    "Alex Rodriguez",
    "Lisa Anderson",
  ];

  return titles.map((title, i) => ({
    id: i + 1,
    title,
    description: `A comprehensive ${types[i % types.length]} for modern development workflows with best practices and production-ready code.`,
    type: types[i % types.length],
    category: categories[i % categories.length].id,
    author: authors[i % authors.length],
    avatar: "/avatar.jpg",
    downloads: Math.floor(Math.random() * 50000) + 1000,
    views: Math.floor(Math.random() * 100000) + 5000,
    stars: Math.floor(Math.random() * 500) + 50,
    rating: (Math.random() * 1.5 + 3.5).toFixed(1),
    reviews: Math.floor(Math.random() * 100) + 10,
    tags: [tags[i % tags.length], tags[(i + 1) % tags.length], tags[(i + 2) % tags.length]],
    lastUpdated: new Date(2024, 10 - Math.floor(i / 5), 21 - (i % 21)).toLocaleDateString(
      "en-US",
      { month: "short", day: "numeric", year: "numeric" }
    ),
    featured: i < 6,
    free: i % 3 !== 0,
  }));
};

const allResources = generateResources();

// Curated collections
const collections = [
  {
    id: "beginners",
    name: "Beginner's Toolkit",
    description: "Essential resources for developers just starting out",
    icon: "🎓",
    resources: 24,
    followers: "12.5K",
  },
  {
    id: "fullstack",
    name: "Full-Stack Starter Pack",
    description: "Everything you need to build complete applications",
    icon: "🚀",
    resources: 32,
    followers: "18.2K",
  },
  {
    id: "performance",
    name: "Performance Optimization",
    description: "Tools and guides for lightning-fast applications",
    icon: "⚡",
    resources: 18,
    followers: "9.8K",
  },
  {
    id: "devops",
    name: "DevOps Essentials",
    description: "Infrastructure, deployment, and automation resources",
    icon: "🔧",
    resources: 28,
    followers: "15.3K",
  },
];

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [savedResources, setSavedResources] = useState<number[]>([]);

  // Filter and sort resources
  const filteredResources = useMemo(() => {
    return allResources
      .filter((resource) => {
        const matchesSearch =
          resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resource.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
        const matchesType = selectedType === "all" || resource.type === selectedType;

        return matchesSearch && matchesCategory && matchesType;
      })
      .sort((a, b) => {
        if (sortBy === "popular") return b.downloads - a.downloads;
        if (sortBy === "trending") return b.views - a.views;
        if (sortBy === "rating") return parseFloat(b.rating) - parseFloat(a.rating);
        if (sortBy === "recent") return b.id - a.id;
        return 0;
      });
  }, [searchQuery, selectedCategory, selectedType, sortBy]);

  const featuredResources = allResources.filter((r) => r.featured);

  const toggleSave = (id: number) => {
    setSavedResources((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Resources Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass border-glow p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 flex items-center gap-3">
                  <Folder className="h-10 w-10 text-primary" />
                  Developer Resources
                </h1>
                <p className="text-lg text-muted-foreground">
                  Discover {allResources.length}+ curated resources, templates, and tools to
                  supercharge your development
                </p>
              </div>

              <div className="flex gap-2">
                <Button size="lg" className="glass text-foreground">
                  <Plus className="mr-2 h-4 w-4" />
                  Submit Resource
                </Button>
                <Button variant="outline" size="lg" className="glass">
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, i) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card
                  className={`glass-dark p-6 cursor-pointer transition-all ${
                    selectedCategory === category.id
                      ? "border-primary/60 bg-primary/10"
                      : "hover:border-primary/40"
                  }`}
                  onClick={() =>
                    setSelectedCategory(selectedCategory === category.id ? "all" : category.id)
                  }
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg glass ${category.color}`}>
                      <category.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{category.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {category.description}
                      </p>
                      <Badge variant="outline" className="glass text-xs">
                        {category.count} resources
                      </Badge>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Featured Resources Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Featured Resources
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredResources.map((resource, i) => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="glass-dark h-full border-primary/30 hover:border-primary/60 transition-all group">
                    <div className="p-6 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-3">
                        <Badge className="bg-primary/20 text-primary border-primary/40">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                        {resource.free && (
                          <Badge variant="outline" className="text-primary border-primary/50">
                            Free
                          </Badge>
                        )}
                      </div>

                      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                        {resource.title}
                      </h3>

                      <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-2">
                        {resource.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {resource.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="glass text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <Separator className="mb-4" />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            {(resource.downloads / 1000).toFixed(1)}K
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-primary text-primary" />
                            {resource.rating}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="glass p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search resources, tags, authors..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 glass-dark"
                    />
                  </div>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-full md:w-[150px] glass-dark">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="guide">Guides</SelectItem>
                      <SelectItem value="template">Templates</SelectItem>
                      <SelectItem value="tool">Tools</SelectItem>
                      <SelectItem value="library">Libraries</SelectItem>
                      <SelectItem value="example">Examples</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full md:w-[150px] glass-dark">
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="trending">Trending</SelectItem>
                      <SelectItem value="rating">Top Rated</SelectItem>
                      <SelectItem value="recent">Most Recent</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="icon"
                      onClick={() => setViewMode("grid")}
                      className="glass-dark"
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="icon"
                      onClick={() => setViewMode("list")}
                      className="glass-dark"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Resources */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{filteredResources.length} Resources</h2>
              </div>

              <AnimatePresence mode="popLayout">
                <div
                  className={viewMode === "grid" ? "grid md:grid-cols-2 gap-6" : "space-y-4"}
                >
                  {filteredResources.map((resource, index) => (
                    <motion.div
                      key={resource.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.03 }}
                      layout
                    >
                      <Card className="glass hover:border-primary/50 transition-all duration-300 group h-full">
                        <div className="p-6 flex flex-col h-full">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={resource.avatar} />
                                <AvatarFallback>
                                  {resource.author
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="text-sm font-medium">{resource.author}</div>
                                <div className="text-xs text-muted-foreground">
                                  {resource.lastUpdated}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleSave(resource.id)}
                              className="glass-dark"
                            >
                              <Bookmark
                                className={`h-4 w-4 ${
                                  savedResources.includes(resource.id) ? "fill-primary" : ""
                                }`}
                              />
                            </Button>
                          </div>

                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="outline" className="glass text-xs capitalize">
                              {resource.type}
                            </Badge>
                            {!resource.free && (
                              <Badge variant="outline" className="text-xs text-yellow-500 border-yellow-500/50">
                                Premium
                              </Badge>
                            )}
                          </div>

                          <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                            {resource.title}
                          </h3>

                          <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-2">
                            {resource.description}
                          </p>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {resource.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="glass text-xs">
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <Separator className="mb-4" />

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Download className="h-3 w-3" />
                                {(resource.downloads / 1000).toFixed(1)}K
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-primary text-primary" />
                                {resource.rating}
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {(resource.views / 1000).toFixed(1)}K
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">
                                <Share2 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>

              {filteredResources.length === 0 && (
                <Card className="glass p-12 text-center">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg text-muted-foreground">No resources found</p>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Curated Collections */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="glass p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Curated Collections
                </h3>
                <div className="space-y-3">
                  {collections.map((collection, i) => (
                    <motion.div
                      key={collection.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      className="glass-dark p-4 rounded-lg hover:border-primary/50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{collection.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm group-hover:text-primary transition-colors">
                            {collection.name}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {collection.description}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <span>{collection.resources} resources</span>
                            <span>•</span>
                            <span>{collection.followers} followers</span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Top Downloads */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="glass p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Trending This Week
                </h3>
                <div className="space-y-3">
                  {allResources
                    .sort((a, b) => b.downloads - a.downloads)
                    .slice(0, 5)
                    .map((resource, i) => (
                      <motion.div
                        key={resource.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + i * 0.05 }}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                      >
                        <div className="text-sm font-bold text-primary w-6">#{i + 1}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">
                            {resource.title}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <Download className="h-3 w-3" />
                            {(resource.downloads / 1000).toFixed(1)}K downloads
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </Card>
            </motion.div>

            {/* Submit Resource CTA */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Card className="glass-dark p-6 border-primary/50">
                <div className="text-center space-y-4">
                  <div className="text-4xl">🎁</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Share Your Work</h3>
                    <p className="text-sm text-muted-foreground">
                      Have a resource to share with the community?
                    </p>
                  </div>
                  <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Submit Resource
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Newsletter CTA */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
            >
              <Card className="glass p-6">
                <h3 className="text-lg font-semibold mb-2">Weekly Digest</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get the best new resources delivered to your inbox
                </p>
                <Button variant="outline" className="w-full glass-dark">
                  Subscribe
                </Button>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
