"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tag,
  Search,
  TrendingUp,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Calendar,
  Filter,
  ChevronRight,
  Star,
  Users,
  Rss,
  Bell,
  Check,
  Hash,
  BookOpen,
  Bookmark,
  Share2,
  ArrowUpDown,
} from "lucide-react";
import { Button, Card, Badge, Input, Separator, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Avatar, AvatarFallback, AvatarImage, Tabs, TabsContent, TabsList, TabsTrigger } from "@ggprompts/ui";

// Tag data
const tagData = {
  name: "TypeScript",
  description:
    "TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.",
  icon: "💙",
  color: "from-blue-500 to-indigo-600",
  stats: {
    articles: 189,
    followers: "42.3K",
    views: "8.7M",
    contributors: 156,
  },
};

// Tag cloud data with varying sizes
const tagCloud = [
  { name: "React", count: 234, size: "xl", color: "text-secondary" },
  { name: "TypeScript", count: 189, size: "2xl", color: "text-blue-400", active: true },
  { name: "JavaScript", count: 312, size: "3xl", color: "text-yellow-400" },
  { name: "Next.js", count: 167, size: "xl", color: "text-white" },
  { name: "Node.js", count: 145, size: "lg", color: "text-green-400" },
  { name: "CSS", count: 198, size: "xl", color: "text-pink-400" },
  { name: "Go", count: 87, size: "md", color: "text-secondary" },
  { name: "Python", count: 156, size: "lg", color: "text-yellow-300" },
  { name: "Rust", count: 67, size: "md", color: "text-orange-400" },
  { name: "Vue", count: 123, size: "lg", color: "text-primary" },
  { name: "Angular", count: 98, size: "md", color: "text-red-400" },
  { name: "Svelte", count: 76, size: "sm", color: "text-orange-300" },
  { name: "Docker", count: 134, size: "lg", color: "text-blue-300" },
  { name: "Kubernetes", count: 89, size: "md", color: "text-blue-500" },
  { name: "AWS", count: 112, size: "md", color: "text-orange-500" },
  { name: "GraphQL", count: 98, size: "md", color: "text-pink-500" },
  { name: "MongoDB", count: 87, size: "sm", color: "text-green-500" },
  { name: "PostgreSQL", count: 76, size: "sm", color: "text-blue-600" },
  { name: "Redis", count: 54, size: "sm", color: "text-red-500" },
  { name: "Testing", count: 134, size: "lg", color: "text-purple-400" },
];

// Related tags
const relatedTags = [
  { name: "JavaScript", count: 312, growth: "+12%" },
  { name: "React", count: 234, growth: "+8%" },
  { name: "Next.js", count: 167, growth: "+15%" },
  { name: "Node.js", count: 145, growth: "+6%" },
  { name: "VS Code", count: 98, growth: "+10%" },
  { name: "Type Safety", count: 87, growth: "+18%" },
];

// Trending tags
const trendingTags = [
  { name: "AI/ML", count: 156, trend: "up", growth: "+45%" },
  { name: "Web3", count: 134, trend: "up", growth: "+38%" },
  { name: "Serverless", count: 112, trend: "up", growth: "+28%" },
  { name: "Edge Computing", count: 98, trend: "up", growth: "+33%" },
  { name: "Micro Frontends", count: 87, trend: "up", growth: "+22%" },
];

// Top contributors
const topContributors = [
  { name: "Sarah Chen", avatar: "/avatar.jpg", articles: 24, followers: "12K" },
  { name: "Mike Johnson", avatar: "/avatar.jpg", articles: 18, followers: "8.5K" },
  { name: "Emma Wilson", avatar: "/avatar.jpg", articles: 15, followers: "9.2K" },
  { name: "Alex Rodriguez", avatar: "/avatar.jpg", articles: 12, followers: "6.8K" },
  { name: "Lisa Anderson", avatar: "/avatar.jpg", articles: 10, followers: "7.1K" },
];

// Generate tagged articles
const generateArticles = () => {
  const titles = [
    "Advanced TypeScript Patterns for React",
    "Type-Safe API Clients in TypeScript",
    "Mastering TypeScript Generics",
    "Building Type-Safe Forms",
    "TypeScript Utility Types Explained",
    "Conditional Types Deep Dive",
    "TypeScript and GraphQL",
    "Strict Mode Best Practices",
    "Type Guards and Narrowing",
    "Decorators in TypeScript",
    "Mapped Types Tutorial",
    "Template Literal Types",
    "TypeScript Performance Tips",
    "Migrating to TypeScript",
    "TypeScript Compiler API",
    "Intersection and Union Types",
    "Type Inference Mastery",
    "TypeScript Error Handling",
    "Abstract Classes and Interfaces",
    "TypeScript Testing Strategies",
    "Async/Await with TypeScript",
    "TypeScript Module Systems",
    "Type Assertions Best Practices",
    "TypeScript Namespaces",
    "Tuple Types Explained",
    "Literal Types in TypeScript",
    "TypeScript with Express",
    "Type-Safe State Management",
    "TypeScript Build Tools",
    "Discriminated Unions",
    "TypeScript Best Practices 2024",
    "Type-Safe Redux",
    "TypeScript Monorepo Setup",
    "TypeScript and Web Workers",
    "Advanced Function Types",
  ];

  const authors = [
    "Sarah Chen",
    "Mike Johnson",
    "Emma Wilson",
    "Alex Rodriguez",
    "Lisa Anderson",
  ];

  const relatedTagsList = ["React", "JavaScript", "Next.js", "Node.js", "Testing"];

  return titles.map((title, i) => ({
    id: i + 1,
    title,
    excerpt: `A comprehensive guide to ${title.toLowerCase()} with practical examples and best practices.`,
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
    tags: [relatedTagsList[i % relatedTagsList.length]],
    featured: i < 3,
  }));
};

const articles = generateArticles();

export default function TagPage() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [dateFilter, setDateFilter] = useState("all");
  const [savedSearch, setSavedSearch] = useState(false);

  // Filter and sort articles
  const filteredArticles = useMemo(() => {
    return articles
      .filter((article) => {
        const matchesSearch =
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

        let matchesDate = true;
        if (dateFilter !== "all") {
          const articleDate = new Date(article.date);
          const now = new Date();
          const daysDiff = Math.floor((now.getTime() - articleDate.getTime()) / (1000 * 60 * 60 * 24));

          if (dateFilter === "week") matchesDate = daysDiff <= 7;
          else if (dateFilter === "month") matchesDate = daysDiff <= 30;
          else if (dateFilter === "year") matchesDate = daysDiff <= 365;
        }

        return matchesSearch && matchesDate;
      })
      .sort((a, b) => {
        if (sortBy === "recent") return b.id - a.id;
        if (sortBy === "popular") return b.views - a.views;
        if (sortBy === "trending") return b.likes - a.likes;
        return 0;
      });
  }, [searchQuery, sortBy, dateFilter]);

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Tag Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass border-glow overflow-hidden">
            <div className={`relative h-32 bg-gradient-to-r ${tagData.color}`}>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-8xl opacity-20">{tagData.icon}</span>
              </div>
            </div>

            <div className="p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <Hash className="h-8 w-8 text-primary" />
                    <h1 className="text-4xl font-bold font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent terminal-glow">{tagData.name}</h1>
                  </div>
                  <p className="text-lg text-muted-foreground max-w-3xl">
                    {tagData.description}
                  </p>
                </div>

                <div className="flex gap-2">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="lg"
                      onClick={() => setIsFollowing(!isFollowing)}
                      className={isFollowing ? "bg-muted" : ""}
                    >
                      {isFollowing ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Following
                        </>
                      ) : (
                        <>
                          <Bell className="mr-2 h-4 w-4" />
                          Follow Tag
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

              {/* Tag Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {[
                  { label: "Articles", value: tagData.stats.articles, icon: BookOpen },
                  { label: "Followers", value: tagData.stats.followers, icon: Users },
                  { label: "Total Views", value: tagData.stats.views, icon: Eye },
                  { label: "Contributors", value: tagData.stats.contributors, icon: Star },
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

        {/* Tag Cloud Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Tag className="h-6 w-6 text-primary" />
              Related Tags Cloud
            </h2>
            <div className="flex flex-wrap gap-4 items-center justify-center p-8">
              {tagCloud.map((tag, i) => (
                <motion.div
                  key={tag.name}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.02 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="cursor-pointer"
                >
                  <span
                    className={`${sizeClasses[tag.size as keyof typeof sizeClasses]} ${
                      tag.color
                    } font-bold ${
                      tag.active ? "terminal-glow" : ""
                    } hover:terminal-glow transition-all`}
                  >
                    #{tag.name}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">({tag.count})</span>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search tagged articles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 glass-dark"
                    />
                  </div>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-full md:w-[180px] glass-dark">
                      <Calendar className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="week">Past Week</SelectItem>
                      <SelectItem value="month">Past Month</SelectItem>
                      <SelectItem value="year">Past Year</SelectItem>
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
                  <Button
                    variant={savedSearch ? "default" : "outline"}
                    size="icon"
                    onClick={() => setSavedSearch(!savedSearch)}
                    className="glass-dark"
                  >
                    <Bookmark className={`h-4 w-4 ${savedSearch ? "fill-current" : ""}`} />
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Articles */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{filteredArticles.length} Articles</h2>
              </div>

              <AnimatePresence mode="popLayout">
                {filteredArticles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                  >
                    <Card className="glass hover:border-primary/50 transition-all duration-300 group">
                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={article.avatar} />
                            <AvatarFallback>
                              {article.author
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 space-y-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">{article.author}</span>
                                <span className="text-xs text-muted-foreground">•</span>
                                <span className="text-xs text-muted-foreground">
                                  {article.date}
                                </span>
                                {article.featured && (
                                  <Badge className="ml-2 bg-primary/20 text-primary border-primary/40">
                                    <Star className="h-3 w-3 mr-1" />
                                    Featured
                                  </Badge>
                                )}
                              </div>
                              <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                                {article.title}
                              </h3>
                            </div>

                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {article.excerpt}
                            </p>

                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className="glass-dark">
                                <Hash className="h-3 w-3 mr-1" />
                                TypeScript
                              </Badge>
                              {article.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="glass text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-border/50">
                              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {article.readingTime} min
                                </div>
                                <div className="flex items-center gap-1">
                                  <Eye className="h-4 w-4" />
                                  {(article.views / 1000).toFixed(1)}K
                                </div>
                                <div className="flex items-center gap-1">
                                  <Heart className="h-4 w-4" />
                                  {article.likes}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MessageCircle className="h-4 w-4" />
                                  {article.comments}
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
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredArticles.length === 0 && (
                <Card className="glass p-12 text-center">
                  <Tag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg text-muted-foreground">No articles found</p>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tag Statistics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="glass p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Tag Statistics
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Growth (30d)</span>
                      <span className="font-bold text-primary">+18.5%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "18.5%" }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                      />
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg. Reading Time</span>
                      <span className="font-medium">12 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Engagement Rate</span>
                      <span className="font-medium">8.4%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Active Writers</span>
                      <span className="font-medium">156</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Related Tags */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="glass p-6">
                <h3 className="text-lg font-semibold mb-4">Related Tags</h3>
                <div className="space-y-2">
                  {relatedTags.map((tag, i) => (
                    <motion.div
                      key={tag.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-lg glass-dark hover:border-primary/50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4 text-primary" />
                        <div>
                          <div className="text-sm font-medium group-hover:text-primary transition-colors">
                            {tag.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {tag.count} articles
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs text-primary">
                        {tag.growth}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Trending Tags */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="glass p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Trending Now
                </h3>
                <div className="space-y-2">
                  {trendingTags.map((tag, i) => (
                    <motion.div
                      key={tag.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + i * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-lg glass-dark hover:border-primary/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <div>
                          <div className="text-sm font-medium">{tag.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {tag.count} articles
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs text-primary">
                        {tag.growth}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Top Contributors */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="glass p-6">
                <h3 className="text-lg font-semibold mb-4">Top Contributors</h3>
                <div className="space-y-3">
                  {topContributors.map((contributor, i) => (
                    <motion.div
                      key={contributor.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + i * 0.05 }}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                    >
                      <div className="text-sm font-bold text-muted-foreground w-6">
                        #{i + 1}
                      </div>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={contributor.avatar} />
                        <AvatarFallback>
                          {contributor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium group-hover:text-primary transition-colors">
                          {contributor.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {contributor.articles} articles • {contributor.followers} followers
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Newsletter CTA */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="glass-dark p-6 border-primary/50">
                <div className="text-center space-y-4">
                  <div className="text-4xl">{tagData.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Get #{tagData.name} Updates</h3>
                    <p className="text-sm text-muted-foreground">
                      Weekly digest of the best {tagData.name} articles
                    </p>
                  </div>
                  <Button className="w-full">
                    <Bell className="mr-2 h-4 w-4" />
                    Subscribe
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
