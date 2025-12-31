"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  TrendingUp,
  Filter,
  Search,
  Grid3x3,
  List,
  ChevronRight,
  ChevronLeft,
  Star,
  Bell,
  Check,
  Rss,
  Share2,
  Calendar,
  Users,
  Tag,
  ArrowUpDown,
  SlidersHorizontal,
} from "lucide-react";
import { Button, Card, Badge, Input, Separator, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Tabs, TabsContent, TabsList, TabsTrigger, Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, Avatar, AvatarFallback, AvatarImage } from "@ggprompts/ui";

// Category data
const categoryData = {
  name: "Web Development",
  description:
    "Explore modern web development techniques, frameworks, and best practices. From frontend to backend, learn everything you need to build amazing web applications.",
  icon: "🌐",
  color: "from-blue-500 to-cyan-500",
  stats: {
    articles: 342,
    followers: "28.5K",
    weeklyPosts: 12,
    totalViews: "4.2M",
  },
  subcategories: [
    { name: "Frontend", count: 156, icon: "🎨" },
    { name: "Backend", count: 98, icon: "⚙️" },
    { name: "Full Stack", count: 45, icon: "🔗" },
    { name: "Performance", count: 43, icon: "⚡" },
  ],
  relatedCategories: [
    { name: "JavaScript", count: 234, icon: "📜" },
    { name: "TypeScript", count: 189, icon: "💙" },
    { name: "React", count: 167, icon: "⚛️" },
    { name: "Node.js", count: 145, icon: "🟢" },
    { name: "DevOps", count: 123, icon: "🔧" },
    { name: "CSS", count: 112, icon: "🎨" },
  ],
};

// Generate featured articles for carousel
const featuredArticles = [
  {
    id: 1,
    title: "The Complete Guide to Next.js 15 App Router",
    excerpt: "Master the new App Router with Server Components, streaming, and more.",
    author: "Sarah Chen",
    avatar: "/avatar.jpg",
    date: "Nov 21, 2024",
    readingTime: 15,
    views: 45000,
    image: "🚀",
    featured: true,
  },
  {
    id: 2,
    title: "Building Real-time Applications with WebSockets",
    excerpt: "Learn how to implement real-time features in your web applications.",
    author: "Mike Johnson",
    avatar: "/avatar.jpg",
    date: "Nov 20, 2024",
    readingTime: 12,
    views: 38000,
    image: "⚡",
    featured: true,
  },
  {
    id: 3,
    title: "Advanced TypeScript Patterns for React",
    excerpt: "Type-safe React components with advanced TypeScript techniques.",
    author: "Emma Wilson",
    avatar: "/avatar.jpg",
    date: "Nov 19, 2024",
    readingTime: 18,
    views: 52000,
    image: "💎",
    featured: true,
  },
];

// Generate articles
const generateArticles = () => {
  const titles = [
    "Modern CSS Grid Layouts",
    "React Server Components Deep Dive",
    "API Design Best Practices",
    "Web Performance Optimization",
    "Authentication Strategies",
    "Database Design Patterns",
    "Testing React Applications",
    "GraphQL vs REST APIs",
    "State Management in 2024",
    "Serverless Architecture",
    "Micro Frontends Guide",
    "Web Accessibility Standards",
    "Progressive Web Apps",
    "Build Tools Comparison",
    "SEO Best Practices",
    "Container Orchestration",
    "CI/CD Pipeline Setup",
    "Security Best Practices",
    "Monorepo Management",
    "Design Systems Guide",
    "Web Components Tutorial",
    "Headless CMS Overview",
    "JAMstack Architecture",
    "Edge Computing Basics",
    "Web Assembly Introduction",
    "Browser APIs Guide",
    "Service Workers Deep Dive",
    "CSS-in-JS Solutions",
    "Form Validation Patterns",
    "Error Handling Strategies",
    "Caching Strategies",
    "Rate Limiting Techniques",
    "File Upload Best Practices",
    "Real-time Collaboration",
    "Data Visualization Libraries",
  ];

  const authors = [
    "Sarah Chen",
    "Mike Johnson",
    "Emma Wilson",
    "Alex Rodriguez",
    "Lisa Anderson",
  ];
  const tags = [
    "React",
    "TypeScript",
    "Next.js",
    "Node.js",
    "CSS",
    "Performance",
    "Testing",
    "Security",
  ];

  return titles.map((title, i) => ({
    id: i + 1,
    title,
    excerpt: `A comprehensive guide to ${title.toLowerCase()} with practical examples and production-ready code.`,
    author: authors[i % authors.length],
    avatar: "/avatar.jpg",
    date: new Date(2024, 10 - Math.floor(i / 5), 21 - (i % 21)).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    readingTime: 5 + (i % 15),
    views: Math.floor(Math.random() * 50000) + 1000,
    likes: Math.floor(Math.random() * 500) + 20,
    comments: Math.floor(Math.random() * 50) + 5,
    tags: [tags[i % tags.length], tags[(i + 1) % tags.length]],
    subcategory: categoryData.subcategories[i % categoryData.subcategories.length].name,
  }));
};

const articles = generateArticles();

// Popular tags
const popularTags = [
  { name: "React", count: 156 },
  { name: "TypeScript", count: 142 },
  { name: "Next.js", count: 98 },
  { name: "Node.js", count: 87 },
  { name: "CSS", count: 76 },
  { name: "Performance", count: 65 },
  { name: "Testing", count: 54 },
  { name: "Security", count: 43 },
];

export default function CategoryPage() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [filterSubcategory, setFilterSubcategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 12;

  // Filter and sort articles
  const filteredArticles = articles
    .filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubcategory =
        filterSubcategory === "all" || article.subcategory === filterSubcategory;
      return matchesSearch && matchesSubcategory;
    })
    .sort((a, b) => {
      if (sortBy === "recent") return b.id - a.id;
      if (sortBy === "popular") return b.views - a.views;
      if (sortBy === "trending") return b.likes - a.likes;
      return 0;
    });

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Category Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass border-glow overflow-hidden">
            <div className={`relative h-32 bg-gradient-to-r ${categoryData.color}`}>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-8xl opacity-20">{categoryData.icon}</span>
              </div>
            </div>

            <div className="p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="flex-1">
                  <h1 className="text-4xl font-mono font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {categoryData.name}
                  </h1>
                  <p className="text-lg text-muted-foreground max-w-3xl">
                    {categoryData.description}
                  </p>
                </div>

                <div className="flex gap-2">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="lg"
                      onClick={() => setIsSubscribed(!isSubscribed)}
                      className={isSubscribed ? "bg-muted" : ""}
                    >
                      {isSubscribed ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Subscribed
                        </>
                      ) : (
                        <>
                          <Bell className="mr-2 h-4 w-4" />
                          Subscribe
                        </>
                      )}
                    </Button>
                  </motion.div>
                  <Button variant="outline" size="lg" className="glass">
                    <Rss className="mr-2 h-4 w-4" />
                    RSS
                  </Button>
                  <Button variant="outline" size="lg" className="glass">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Category Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {[
                  { label: "Articles", value: categoryData.stats.articles, icon: BookOpen },
                  { label: "Followers", value: categoryData.stats.followers, icon: Users },
                  { label: "Weekly Posts", value: categoryData.stats.weeklyPosts, icon: Calendar },
                  { label: "Total Views", value: categoryData.stats.totalViews, icon: Eye },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="glass-dark p-4 text-center">
                      <stat.icon className="h-5 w-5 mx-auto mb-2 text-primary" />
                      <div className="text-2xl font-bold terminal-glow">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Featured Articles Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Star className="h-6 w-6 text-primary" />
                Featured Articles
              </h2>
            </div>

            <Carousel className="w-full">
              <CarouselContent>
                {featuredArticles.map((article, i) => (
                  <CarouselItem key={article.id} className="md:basis-1/2 lg:basis-1/3">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="h-full"
                    >
                      <Card className="glass-dark h-full border-primary/30 hover:border-primary/60 transition-all duration-300">
                        <div className="p-6 flex flex-col h-full">
                          <div className="text-6xl mb-4">{article.image}</div>
                          <Badge className="w-fit mb-3 bg-primary/20 text-primary border-primary/40">
                            Featured
                          </Badge>
                          <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center justify-between pt-4 border-t border-border/50">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={article.avatar} />
                                <AvatarFallback className="text-xs">
                                  {article.author
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground">
                                {article.author}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Eye className="h-3 w-3" />
                              {(article.views / 1000).toFixed(0)}K
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="glass" />
              <CarouselNext className="glass" />
            </Carousel>
          </Card>
        </motion.div>

        {/* Subcategories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass p-6">
            <h3 className="text-lg font-semibold mb-4">Subcategories</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categoryData.subcategories.map((sub, i) => (
                <motion.div
                  key={sub.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card
                    className="glass-dark p-4 cursor-pointer hover:border-primary/50 transition-all"
                    onClick={() => setFilterSubcategory(sub.name)}
                  >
                    <div className="text-3xl mb-2">{sub.icon}</div>
                    <div className="font-semibold">{sub.name}</div>
                    <div className="text-sm text-muted-foreground">{sub.count} articles</div>
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
                      placeholder="Search articles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 glass-dark"
                    />
                  </div>
                  <Select value={filterSubcategory} onValueChange={setFilterSubcategory}>
                    <SelectTrigger className="w-full md:w-[180px] glass-dark">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subcategories</SelectItem>
                      {categoryData.subcategories.map((sub) => (
                        <SelectItem key={sub.name} value={sub.name}>
                          {sub.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full md:w-[180px] glass-dark">
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="trending">Trending</SelectItem>
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

            {/* Articles */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  {filteredArticles.length} Articles
                </h2>
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
              </div>

              <AnimatePresence mode="popLayout">
                <div
                  className={
                    viewMode === "grid"
                      ? "grid md:grid-cols-2 gap-6"
                      : "space-y-4"
                  }
                >
                  {paginatedArticles.map((article, index) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                      layout
                    >
                      <Card className="glass hover:border-primary/50 transition-all duration-300 group h-full">
                        <div className="p-6 flex flex-col h-full">
                          <div className="flex items-start gap-3 mb-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={article.avatar} />
                              <AvatarFallback>
                                {article.author
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm">{article.author}</div>
                              <div className="text-xs text-muted-foreground">{article.date}</div>
                            </div>
                            <Badge variant="outline" className="glass-dark text-xs">
                              {article.subcategory}
                            </Badge>
                          </div>

                          <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {article.title}
                          </h3>

                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                            {article.excerpt}
                          </p>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {article.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="glass text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-border/50">
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {article.readingTime}m
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {(article.views / 1000).toFixed(1)}K
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                {article.likes}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              Read
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>

              {/* Pagination */}
              {totalPages > 1 && (
                <Card className="glass p-4">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="glass-dark"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="glass-dark w-10"
                          >
                            {page}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="glass-dark"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular Tags */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="glass p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Tag className="h-5 w-5 text-primary" />
                  Popular Tags
                </h3>
                <div className="space-y-2">
                  {popularTags.map((tag, i) => (
                    <motion.div
                      key={tag.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.05 }}
                      className="flex items-center justify-between p-2 rounded-lg glass-dark hover:border-primary/50 transition-colors cursor-pointer"
                    >
                      <span className="text-sm">{tag.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {tag.count}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Related Categories */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="glass p-6">
                <h3 className="text-lg font-semibold mb-4">Related Categories</h3>
                <div className="space-y-2">
                  {categoryData.relatedCategories.map((cat, i) => (
                    <motion.div
                      key={cat.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + i * 0.05 }}
                      className="flex items-center gap-3 p-3 rounded-lg glass-dark hover:border-primary/50 transition-colors cursor-pointer group"
                    >
                      <span className="text-2xl">{cat.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium group-hover:text-primary transition-colors">
                          {cat.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {cat.count} articles
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Newsletter CTA */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="glass-dark p-6 border-primary/50">
                <div className="text-center space-y-4">
                  <div className="text-4xl">📬</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
                    <p className="text-sm text-muted-foreground">
                      Get the latest {categoryData.name.toLowerCase()} articles in your inbox
                    </p>
                  </div>
                  <Button className="w-full">
                    <Bell className="mr-2 h-4 w-4" />
                    Subscribe to Newsletter
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
