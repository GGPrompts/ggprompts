"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Twitter,
  Github,
  Linkedin,
  Mail,
  Globe,
  MapPin,
  Calendar,
  BookOpen,
  Eye,
  Users,
  Award,
  TrendingUp,
  Clock,
  Filter,
  Search,
  Heart,
  MessageCircle,
  Share2,
  ExternalLink,
  ChevronRight,
  Star,
  Rss,
  Check,
} from "lucide-react";
import { Button, Card, Badge, Separator, Avatar, AvatarFallback, AvatarImage, Input, Tabs, TabsContent, TabsList, TabsTrigger, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ggprompts/ui";

// Mock author data
const authorData = {
  name: "Alexandra Chen",
  title: "Senior Developer & Technical Writer",
  bio: "Passionate about building developer tools, terminal interfaces, and creating beautiful web experiences. I write about Go, TypeScript, and modern web development.",
  avatar: "/avatar.jpg",
  location: "San Francisco, CA",
  joined: "January 2020",
  website: "https://alexchen.dev",
  email: "alex@example.com",
  twitter: "@alexchen",
  github: "alexchen",
  linkedin: "alexchen",
  stats: {
    articles: 127,
    views: "2.4M",
    followers: "18.5K",
    following: 342,
  },
  expertise: [
    "TypeScript",
    "Go",
    "React",
    "Next.js",
    "Terminal UIs",
    "DevOps",
    "System Design",
    "Performance",
    "Web3",
    "GraphQL",
  ],
  schedule: {
    frequency: "Weekly",
    nextPost: "November 25, 2024",
    preferredTopics: ["Web Development", "Go Programming", "Developer Tools"],
  },
  achievements: [
    { icon: Star, label: "Top Writer 2024", color: "text-yellow-500" },
    { icon: Award, label: "50K+ Views", color: "text-blue-500" },
    { icon: TrendingUp, label: "Trending Author", color: "text-primary" },
    { icon: Users, label: "10K+ Followers", color: "text-purple-500" },
  ],
};

// Generate 35+ articles for demonstration
const generateArticles = () => {
  const topics = [
    "Building Modern Terminal UIs",
    "TypeScript Best Practices",
    "React Server Components Deep Dive",
    "Go Concurrency Patterns",
    "Web Performance Optimization",
    "GraphQL Schema Design",
    "Testing Strategies in Go",
    "Next.js App Router Guide",
    "Database Indexing Strategies",
    "Container Orchestration Basics",
    "Functional Programming in TypeScript",
    "Building CLIs with Cobra",
    "Redis Caching Patterns",
    "Web Accessibility Guidelines",
    "Microservices Architecture",
    "Authentication Best Practices",
    "Real-time Data with WebSockets",
    "CSS Grid Mastery",
    "API Design Principles",
    "DevOps Pipeline Setup",
    "State Management in React",
    "Go Error Handling",
    "Serverless Functions",
    "Data Visualization",
    "Code Review Best Practices",
    "Git Workflow Strategies",
    "Docker Best Practices",
    "Web Security Fundamentals",
    "Testing React Components",
    "Database Migration Strategies",
    "GraphQL vs REST",
    "Monitoring and Logging",
    "Performance Profiling in Go",
    "Progressive Web Apps",
    "Type Safety in JavaScript",
  ];

  const categories = ["Tutorial", "Guide", "Deep Dive", "Opinion", "Case Study"];
  const tags = [
    "TypeScript",
    "Go",
    "React",
    "Next.js",
    "DevOps",
    "Performance",
    "Testing",
    "Architecture",
    "Security",
    "UI/UX",
  ];

  return topics.map((topic, i) => ({
    id: i + 1,
    title: topic,
    excerpt: `A comprehensive guide to ${topic.toLowerCase()} with practical examples and best practices.`,
    date: new Date(2024, 10 - Math.floor(i / 3), 21 - (i % 21)).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    readingTime: 5 + (i % 15),
    views: Math.floor(Math.random() * 50000) + 1000,
    likes: Math.floor(Math.random() * 500) + 20,
    comments: Math.floor(Math.random() * 50) + 5,
    category: categories[i % categories.length],
    tags: [tags[i % tags.length], tags[(i + 1) % tags.length], tags[(i + 2) % tags.length]],
    featured: i < 3,
  }));
};

const articles = generateArticles();

// Recent activity data
const recentActivity = [
  {
    type: "article",
    title: "Published: Building Modern Terminal UIs",
    time: "2 hours ago",
  },
  {
    type: "comment",
    title: "Commented on: TypeScript Best Practices",
    time: "5 hours ago",
  },
  {
    type: "like",
    title: "Liked: React Server Components Deep Dive",
    time: "1 day ago",
  },
  {
    type: "follow",
    title: "Followed Sarah Johnson",
    time: "2 days ago",
  },
  {
    type: "article",
    title: "Published: Go Concurrency Patterns",
    time: "3 days ago",
  },
];

export default function AuthorProfilePage() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [filterCategory, setFilterCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("articles");

  // Filter and sort articles
  const filteredArticles = articles
    .filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === "all" || article.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "recent") return b.id - a.id;
      if (sortBy === "popular") return b.views - a.views;
      if (sortBy === "trending") return b.likes - a.likes;
      return 0;
    });

  const popularArticles = [...articles].sort((a, b) => b.views - a.views).slice(0, 5);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Author Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass border-glow overflow-hidden">
            <div className="relative h-48 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80" />
            </div>

            <div className="relative px-8 pb-8">
              <div className="flex flex-col md:flex-row gap-6 -mt-16">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Avatar className="h-32 w-32 border-4 border-background shadow-2xl">
                    <AvatarImage src={authorData.avatar} />
                    <AvatarFallback className="text-4xl bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                      {authorData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>

                <div className="flex-1 space-y-4 pt-4">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <h1 className="text-4xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent terminal-glow mb-2">
                        {authorData.name}
                      </h1>
                      <p className="text-xl text-muted-foreground mb-3">
                        {authorData.title}
                      </p>
                      <p className="text-base max-w-2xl">{authorData.bio}</p>
                    </div>

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
                            <Users className="mr-2 h-4 w-4" />
                            Follow
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </div>

                  {/* Author Meta */}
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {authorData.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {authorData.joined}
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      <a
                        href={authorData.website}
                        className="hover:text-primary transition-colors"
                      >
                        alexchen.dev
                      </a>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="glass">
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="glass">
                      <Github className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="glass">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="glass">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="glass">
                      <Rss className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {[
                  { label: "Articles", value: authorData.stats.articles, icon: BookOpen },
                  { label: "Total Views", value: authorData.stats.views, icon: Eye },
                  { label: "Followers", value: authorData.stats.followers, icon: Users },
                  { label: "Following", value: authorData.stats.following, icon: Heart },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="glass-dark p-4 text-center hover:border-primary/50 transition-colors">
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
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
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-full md:w-[180px] glass-dark">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Tutorial">Tutorial</SelectItem>
                      <SelectItem value="Guide">Guide</SelectItem>
                      <SelectItem value="Deep Dive">Deep Dive</SelectItem>
                      <SelectItem value="Opinion">Opinion</SelectItem>
                      <SelectItem value="Case Study">Case Study</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full md:w-[180px] glass-dark">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="trending">Trending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Card>
            </motion.div>

            {/* Articles Grid */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {filteredArticles.length} Articles
                </h2>
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
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className="glass-dark">
                                {article.category}
                              </Badge>
                              {article.featured && (
                                <Badge className="bg-primary/20 text-primary border-primary/40">
                                  <Star className="h-3 w-3 mr-1" />
                                  Featured
                                </Badge>
                              )}
                            </div>

                            <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                              {article.title}
                            </h3>

                            <p className="text-muted-foreground line-clamp-2">
                              {article.excerpt}
                            </p>

                            <div className="flex flex-wrap gap-2">
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

                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {article.date}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {article.readingTime} min read
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
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredArticles.length === 0 && (
                <Card className="glass p-12 text-center">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg text-muted-foreground">No articles found</p>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Achievements
                </h3>
                <div className="space-y-3">
                  {authorData.achievements.map((achievement, i) => (
                    <motion.div
                      key={achievement.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-lg glass-dark"
                    >
                      <achievement.icon className={`h-5 w-5 ${achievement.color}`} />
                      <span className="text-sm">{achievement.label}</span>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Expertise Topics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="glass p-6">
                <h3 className="text-lg font-semibold mb-4">Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {authorData.expertise.map((topic, i) => (
                    <motion.div
                      key={topic}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.05 }}
                    >
                      <Badge variant="outline" className="glass-dark cursor-pointer hover:border-primary/50 transition-colors">
                        {topic}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Popular Articles */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="glass p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Most Popular
                </h3>
                <div className="space-y-4">
                  {popularArticles.map((article, i) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      className="group cursor-pointer"
                    >
                      <div className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <Eye className="h-3 w-3" />
                        {(article.views / 1000).toFixed(1)}K views
                      </div>
                      {i < popularArticles.length - 1 && <Separator className="mt-4" />}
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Writing Schedule */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="glass p-6">
                <h3 className="text-lg font-semibold mb-4">Writing Schedule</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frequency</span>
                    <span className="font-medium">{authorData.schedule.frequency}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Next Post</span>
                    <span className="font-medium">{authorData.schedule.nextPost}</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="glass p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {recentActivity.map((activity, i) => (
                    <div key={i} className="text-sm">
                      <div className="font-medium line-clamp-1">{activity.title}</div>
                      <div className="text-xs text-muted-foreground">{activity.time}</div>
                      {i < recentActivity.length - 1 && <Separator className="mt-3" />}
                    </div>
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
                <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get notified when {authorData.name.split(" ")[0]} publishes new articles.
                </p>
                <Button className="w-full" size="sm">
                  <Mail className="mr-2 h-4 w-4" />
                  Subscribe to Newsletter
                </Button>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
