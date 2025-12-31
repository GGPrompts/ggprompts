"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Check,
  Calendar,
  Users,
  TrendingUp,
  Send,
  Star,
  ChevronRight,
  Settings,
  Bell,
  Download,
  Eye,
  Heart,
  Share2,
  Gift,
  Award,
  Sparkles,
  BookOpen,
  Clock,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Newsletter stats
const newsletterStats = {
  subscribers: "127.3K",
  openRate: "42.8%",
  clickRate: "18.5%",
  issues: 156,
  weeklyReaders: "89.4K",
  avgRating: 4.8,
};

// Frequency options
const frequencies = [
  {
    id: "daily",
    name: "Daily Digest",
    description: "Get a curated selection of articles every day",
    icon: "📬",
    subscribers: "23.5K",
  },
  {
    id: "weekly",
    name: "Weekly Roundup",
    description: "The best articles from the past week, every Monday",
    icon: "📮",
    subscribers: "87.2K",
    recommended: true,
  },
  {
    id: "monthly",
    name: "Monthly Highlights",
    description: "Top stories and insights once a month",
    icon: "📭",
    subscribers: "45.8K",
  },
  {
    id: "custom",
    name: "Custom Schedule",
    description: "Choose specific days and topics",
    icon: "⚙️",
    subscribers: "12.1K",
  },
];

// Topic categories
const topics = [
  { id: "web-dev", name: "Web Development", count: 45, icon: "🌐" },
  { id: "typescript", name: "TypeScript", count: 32, icon: "💙" },
  { id: "react", name: "React", count: 38, icon: "⚛️" },
  { id: "nodejs", name: "Node.js", count: 28, icon: "🟢" },
  { id: "devops", name: "DevOps", count: 24, icon: "🔧" },
  { id: "design", name: "UI/UX Design", count: 19, icon: "🎨" },
  { id: "ai", name: "AI & ML", count: 15, icon: "🤖" },
  { id: "mobile", name: "Mobile Dev", count: 12, icon: "📱" },
];

// Past issues
const generatePastIssues = () => {
  const titles = [
    "The Future of Web Development: 2024 Trends",
    "TypeScript 5.0: What's New and Improved",
    "Building Scalable React Applications",
    "Mastering Next.js App Router",
    "DevOps Best Practices for Modern Teams",
    "CSS Grid Layouts: Advanced Techniques",
    "GraphQL vs REST: Making the Right Choice",
    "Performance Optimization Deep Dive",
    "Testing Strategies for Large Codebases",
    "Cloud Architecture Patterns",
    "Microservices Design Principles",
    "Web Security Fundamentals",
    "Database Optimization Tips",
    "Modern JavaScript Features",
    "React Server Components Explained",
    "Container Orchestration Guide",
    "API Design Best Practices",
    "State Management in 2024",
    "Progressive Web Apps Tutorial",
    "Serverless Architecture Overview",
    "Git Workflow Strategies",
    "Code Review Best Practices",
    "Agile Development Methodologies",
    "CI/CD Pipeline Setup",
    "Monitoring and Logging",
    "Web Accessibility Guidelines",
    "Mobile-First Design",
    "Authentication Strategies",
    "Real-time Data with WebSockets",
    "Building Design Systems",
  ];

  return titles.map((title, i) => ({
    id: i + 1,
    title,
    issue: 156 - i,
    date: new Date(2024, 10 - Math.floor(i / 4), 21 - (i % 21)).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    excerpt:
      "This week's edition features exclusive insights, tutorials, and the latest news from the development community.",
    articles: Math.floor(Math.random() * 5) + 5,
    readers: Math.floor(Math.random() * 50000) + 40000,
    openRate: Math.floor(Math.random() * 20) + 35,
    featured: i < 3,
  }));
};

const pastIssues = generatePastIssues();

// Success stories
const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Senior Developer",
    avatar: "/avatar.jpg",
    quote:
      "This newsletter has become an essential part of my weekly routine. The curated content is always relevant and high-quality.",
    rating: 5,
  },
  {
    name: "Mike Chen",
    role: "Tech Lead",
    avatar: "/avatar.jpg",
    quote:
      "I've learned so much from the weekly roundups. The editors have a great eye for valuable content.",
    rating: 5,
  },
  {
    name: "Emma Wilson",
    role: "Full Stack Engineer",
    avatar: "/avatar.jpg",
    quote:
      "Perfect balance of tutorials, news, and opinion pieces. Highly recommend to any developer.",
    rating: 5,
  },
];

// Referral program
const referralTiers = [
  { referrals: 5, reward: "Exclusive Badge", icon: "🎖️", unlocked: true },
  { referrals: 10, reward: "Premium Content Access", icon: "⭐", unlocked: true },
  { referrals: 25, reward: "Author Recognition", icon: "🏆", unlocked: false },
  { referrals: 50, reward: "Lifetime Premium", icon: "👑", unlocked: false },
];

export default function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState("weekly");
  const [selectedTopics, setSelectedTopics] = useState<string[]>(["web-dev", "typescript"]);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubscribe = () => {
    setShowSuccess(true);
    setTimeout(() => setIsSubscribed(true), 1000);
  };

  const toggleTopic = (topicId: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]
    );
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Newsletter Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass border-glow overflow-hidden">
            <div className="relative h-48 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Mail className="h-24 w-24 text-primary/20" />
              </div>
            </div>

            <div className="p-8">
              <div className="text-center max-w-3xl mx-auto space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Badge className="mb-4 bg-primary/20 text-primary border-primary/40">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Join {newsletterStats.subscribers} Developers
                  </Badge>
                  <h1 className="text-5xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent terminal-glow mb-4">
                    Developer Newsletter
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    Get the best articles, tutorials, and developer news delivered straight to
                    your inbox. Join thousands of developers staying ahead of the curve.
                  </p>
                </motion.div>

                <AnimatePresence mode="wait">
                  {!isSubscribed ? (
                    <motion.div
                      key="subscribe-form"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: 0.3 }}
                      className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                    >
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="glass-dark text-lg h-12"
                      />
                      <Button
                        size="lg"
                        onClick={handleSubscribe}
                        className="h-12 px-8"
                        disabled={!email}
                      >
                        <Send className="mr-2 h-5 w-5" />
                        Subscribe
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="glass-dark p-6 rounded-lg max-w-md mx-auto border-2 border-primary/50"
                    >
                      <Check className="h-12 w-12 mx-auto mb-3 text-primary" />
                      <h3 className="text-xl font-bold mb-2">Successfully Subscribed!</h3>
                      <p className="text-muted-foreground">
                        Check your email to confirm your subscription.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <p className="text-sm text-muted-foreground">
                  No spam. Unsubscribe anytime. Read by {newsletterStats.weeklyReaders} developers
                  weekly.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                {[
                  { label: "Subscribers", value: newsletterStats.subscribers, icon: Users },
                  { label: "Open Rate", value: newsletterStats.openRate, icon: Eye },
                  { label: "Total Issues", value: newsletterStats.issues, icon: Mail },
                  { label: "Avg Rating", value: newsletterStats.avgRating, icon: Star },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                  >
                    <Card className="glass-dark p-4 text-center">
                      <stat.icon className="h-5 w-5 mx-auto mb-2 text-primary" />
                      <div className="text-2xl font-bold terminal-glow">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Frequency Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Choose Your Frequency</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {frequencies.map((freq, i) => (
                <motion.div
                  key={freq.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card
                    className={`glass-dark p-6 cursor-pointer transition-all ${
                      selectedFrequency === freq.id
                        ? "border-primary/60 bg-primary/10"
                        : "hover:border-primary/40"
                    }`}
                    onClick={() => setSelectedFrequency(freq.id)}
                  >
                    <div className="text-center space-y-3">
                      <div className="text-4xl">{freq.icon}</div>
                      <div>
                        <div className="font-semibold flex items-center justify-center gap-2">
                          {freq.name}
                          {freq.recommended && (
                            <Badge variant="outline" className="text-xs">
                              Popular
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          {freq.description}
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {freq.subscribers} subscribers
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Topics to Subscribe */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glass p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Select Your Topics</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {topics.map((topic, i) => (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.05 }}
                >
                  <Card
                    className={`glass-dark p-4 cursor-pointer transition-all ${
                      selectedTopics.includes(topic.id)
                        ? "border-primary/60 bg-primary/5"
                        : "hover:border-primary/30"
                    }`}
                    onClick={() => toggleTopic(topic.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedTopics.includes(topic.id)}
                        onCheckedChange={() => toggleTopic(topic.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{topic.icon}</span>
                          <span className="font-medium text-sm">{topic.name}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {topic.count} articles/month
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Past Issues */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="glass p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-primary" />
                    Past Issues
                  </h2>
                  <Button variant="outline" size="sm" className="glass-dark">
                    <Download className="mr-2 h-4 w-4" />
                    Export All
                  </Button>
                </div>

                <div className="space-y-4">
                  {pastIssues.slice(0, 15).map((issue, i) => (
                    <motion.div
                      key={issue.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + i * 0.05 }}
                    >
                      <Card className="glass-dark hover:border-primary/50 transition-all group">
                        <div className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="text-center min-w-[60px]">
                              <div className="text-xs text-muted-foreground mb-1">Issue</div>
                              <div className="text-2xl font-bold terminal-glow">
                                {issue.issue}
                              </div>
                            </div>

                            <div className="flex-1 space-y-2">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    {issue.featured && (
                                      <Badge className="bg-primary/20 text-primary border-primary/40">
                                        <Star className="h-3 w-3 mr-1" />
                                        Featured
                                      </Badge>
                                    )}
                                  </div>
                                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                                    {issue.title}
                                  </h3>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {issue.excerpt}
                                  </p>
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

                              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {issue.date}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <BookOpen className="h-3 w-3" />
                                    {issue.articles} articles
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Eye className="h-3 w-3" />
                                    {(issue.readers / 1000).toFixed(1)}K readers
                                  </div>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {issue.openRate}% open rate
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Sample Content Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="glass p-6">
                <h3 className="text-lg font-semibold mb-4">What's Inside?</h3>
                <div className="space-y-3">
                  {[
                    { icon: "📚", label: "5-7 Curated Articles" },
                    { icon: "💡", label: "Expert Insights" },
                    { icon: "🔥", label: "Trending Topics" },
                    { icon: "🎯", label: "Career Tips" },
                    { icon: "🛠️", label: "Tool Recommendations" },
                    { icon: "📰", label: "Industry News" },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + i * 0.05 }}
                      className="flex items-center gap-3 p-2 rounded-lg glass-dark"
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-sm">{item.label}</span>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Success Stories */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Card className="glass p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  What Readers Say
                </h3>
                <div className="space-y-4">
                  {testimonials.map((testimonial, i) => (
                    <motion.div
                      key={testimonial.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + i * 0.1 }}
                      className="glass-dark p-4 rounded-lg"
                    >
                      <div className="flex gap-1 mb-2">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-3 w-3 fill-primary text-primary"
                          />
                        ))}
                      </div>
                      <p className="text-sm mb-3 italic">"{testimonial.quote}"</p>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary" />
                        <div>
                          <div className="text-sm font-medium">{testimonial.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {testimonial.role}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Referral Program */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
            >
              <Card className="glass-dark p-6 border-primary/50">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Gift className="h-5 w-5 text-primary" />
                  Referral Rewards
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Earn rewards by inviting friends to subscribe
                </p>

                <div className="space-y-3">
                  {referralTiers.map((tier, i) => (
                    <motion.div
                      key={tier.referrals}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.1 + i * 0.1 }}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${
                        tier.unlocked
                          ? "bg-primary/10 border-primary/40"
                          : "bg-muted/20 border-border/50"
                      }`}
                    >
                      <span className="text-2xl">{tier.icon}</span>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{tier.reward}</div>
                        <div className="text-xs text-muted-foreground">
                          {tier.referrals} referrals
                        </div>
                      </div>
                      {tier.unlocked && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </motion.div>
                  ))}
                </div>

                <Button className="w-full mt-4" variant="outline">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Referral Link
                </Button>
              </Card>
            </motion.div>

            {/* Manage Preferences */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
            >
              <Card className="glass p-6">
                <h3 className="text-lg font-semibold mb-4">Manage Subscription</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start glass-dark">
                    <Settings className="mr-2 h-4 w-4" />
                    Update Preferences
                  </Button>
                  <Button variant="outline" className="w-full justify-start glass-dark">
                    <Bell className="mr-2 h-4 w-4" />
                    Notification Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start glass-dark">
                    <Download className="mr-2 h-4 w-4" />
                    Download Archive
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
