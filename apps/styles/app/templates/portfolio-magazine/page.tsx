"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import {
  Calendar,
  Clock,
  Tag,
  Share2,
  Bookmark,
  Eye,
  Heart,
  MessageCircle,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Mail,
  Quote,
  Filter,
  Search,
  TrendingUp,
  Award,
  Zap,
  Terminal,
  Code2,
  Palette,
  Database,
  Globe,
  Users,
  Briefcase,
  GraduationCap,
  MapPin,
  Send
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mock data
const author = {
  name: "Morgan Blake",
  title: "Design Engineer & Creative Technologist",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan",
  bio: "Exploring the intersection of design, code, and storytelling. Based in Portland, crafting digital experiences that matter.",
  location: "Portland, OR",
  email: "morgan@blake.design",
  social: {
    github: "morganblake",
    linkedin: "morgan-blake",
    twitter: "morgan_codes"
  }
}

const featuredArticle = {
  id: 1,
  title: "Rebuilding Our Design System from the Ground Up",
  subtitle: "A comprehensive journey through modern design system architecture",
  category: "Design Systems",
  date: "January 15, 2024",
  readTime: "12 min read",
  excerpt: "After two years of rapid growth, our design system had become fragmented and difficult to maintain. Here's how we rebuilt it from scratch, implementing modern best practices and scaling it for the future.",
  image: "/api/placeholder/1200/600",
  tags: ["Design Systems", "React", "TypeScript", "Storybook"],
  stats: { views: 12453, likes: 342, comments: 28 },
  featured: true
}

const articles = [
  {
    id: 2,
    title: "The Art of Microinteractions in Modern Web Design",
    category: "UI/UX Design",
    date: "January 10, 2024",
    readTime: "8 min read",
    excerpt: "How subtle animations and feedback mechanisms can dramatically improve user experience and engagement.",
    image: "/api/placeholder/800/500",
    tags: ["Animation", "UX", "Design"],
    stats: { views: 8234, likes: 234, comments: 15 },
    column: "full"
  },
  {
    id: 3,
    title: "TypeScript Best Practices for Large-Scale Applications",
    category: "Engineering",
    date: "January 5, 2024",
    readTime: "10 min read",
    excerpt: "Lessons learned from building and maintaining TypeScript codebases with hundreds of thousands of lines.",
    image: "/api/placeholder/600/400",
    tags: ["TypeScript", "Engineering", "Best Practices"],
    stats: { views: 6789, likes: 189, comments: 12 },
    column: "left"
  },
  {
    id: 4,
    title: "Building Accessible Components",
    category: "Accessibility",
    date: "December 28, 2023",
    readTime: "6 min read",
    excerpt: "A practical guide to creating web components that work for everyone.",
    image: "/api/placeholder/600/400",
    tags: ["A11y", "React", "WCAG"],
    stats: { views: 5432, likes: 156, comments: 8 },
    column: "right"
  },
  {
    id: 5,
    title: "Performance Optimization Techniques",
    category: "Performance",
    date: "December 20, 2023",
    readTime: "9 min read",
    excerpt: "Making your web applications blazingly fast with modern optimization techniques.",
    image: "/api/placeholder/600/400",
    tags: ["Performance", "Optimization", "Web Vitals"],
    stats: { views: 7821, likes: 203, comments: 19 },
    column: "left"
  },
  {
    id: 6,
    title: "The Future of CSS: Container Queries",
    category: "CSS",
    date: "December 15, 2023",
    readTime: "7 min read",
    excerpt: "Exploring the game-changing container queries and how they're revolutionizing responsive design.",
    image: "/api/placeholder/600/400",
    tags: ["CSS", "Responsive Design", "Modern Web"],
    stats: { views: 6543, likes: 178, comments: 11 },
    column: "right"
  }
]

const categories = [
  { name: "All", count: 47, icon: Globe },
  { name: "Design Systems", count: 12, icon: Palette },
  { name: "Engineering", count: 18, icon: Code2 },
  { name: "UI/UX Design", count: 8, icon: Zap },
  { name: "Performance", count: 5, icon: TrendingUp },
  { name: "Accessibility", count: 4, icon: Users }
]

const pullQuote = {
  text: "Great design systems are not just component libraries—they're the shared language that empowers teams to build cohesive experiences at scale.",
  author: "Morgan Blake",
  context: "From 'Rebuilding Our Design System'"
}

const relatedReading = [
  { title: "Component API Design Principles", readTime: "5 min" },
  { title: "Documentation as a Product", readTime: "7 min" },
  { title: "Scaling Design Tokens", readTime: "6 min" }
]

const achievements = [
  { icon: Award, label: "Featured in Design Weekly", color: "text-yellow-400" },
  { icon: Users, label: "10K+ Monthly Readers", color: "text-blue-400" },
  { icon: Zap, label: "Top Writer in Design", color: "text-purple-400" },
  { icon: Terminal, label: "Open Source Contributor", color: "text-green-400" }
]

export default function MagazinePortfolio() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen">
      {/* Magazine Header */}
      <header className="border-b border-white/10 sticky top-0 z-50 glass-dark">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent terminal-glow">
                The Blake Journal
              </h1>
              <nav className="hidden md:flex items-center gap-6 text-sm">
                <a href="#featured" className="hover:text-primary transition-colors">Featured</a>
                <a href="#articles" className="hover:text-primary transition-colors">Articles</a>
                <a href="#about" className="hover:text-primary transition-colors">About</a>
                <a href="#newsletter" className="hover:text-primary transition-colors">Newsletter</a>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Search className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Bookmark className="w-4 h-4" />
              </Button>
              <div className="hidden md:flex items-center gap-2">
                {[Github, Linkedin, Twitter].map((Icon, i) => (
                  <Button key={i} variant="ghost" size="icon">
                    <Icon className="w-4 h-4" />
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Hero */}
      <section id="featured" className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-primary/20 text-primary border-primary/50">
              Featured Story
            </Badge>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Featured Image */}
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-blue-500/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>

              {/* Featured Content */}
              <div>
                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    {featuredArticle.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {featuredArticle.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {featuredArticle.readTime}
                  </span>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold font-serif mb-4 leading-tight">
                  {featuredArticle.title}
                </h2>

                <p className="text-xl text-muted-foreground mb-4 leading-relaxed">
                  {featuredArticle.subtitle}
                </p>

                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  {featuredArticle.excerpt}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {featuredArticle.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="border-primary/30">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-6 mb-8">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {featuredArticle.stats.views.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {featuredArticle.stats.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {featuredArticle.stats.comments}
                    </span>
                  </div>
                </div>

                <Button size="lg" className="group">
                  Read Full Story
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pull Quote */}
      <section className="py-16 px-6 bg-muted/50">
        <div className="max-w-4xl mx-auto text-center">
          <Quote className="w-12 h-12 mx-auto mb-6 text-primary opacity-50" />
          <blockquote className="text-3xl md:text-4xl font-serif font-medium leading-relaxed mb-6">
            "{pullQuote.text}"
          </blockquote>
          <div className="text-muted-foreground">
            <p className="font-medium">{pullQuote.author}</p>
            <p className="text-sm">{pullQuote.context}</p>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section id="articles" className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Category Filter */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
              <div>
                <h2 className="text-3xl font-bold font-serif mb-2">All Articles</h2>
                <p className="text-muted-foreground">
                  In-depth explorations of design, code, and craft
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 glass-dark border-white/20 w-64"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48 glass-dark border-white/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-dark border-white/20">
                    {categories.map((cat) => (
                      <SelectItem key={cat.name} value={cat.name}>
                        <div className="flex items-center gap-2">
                          <cat.icon className="w-4 h-4" />
                          {cat.name} ({cat.count})
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                      selectedCategory === category.name
                        ? "bg-primary/20 border-primary/50 text-primary"
                        : "glass border-white/20 hover:border-primary/30"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{category.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {category.count}
                    </Badge>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Magazine-style Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {filteredArticles.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`${
                  article.column === "full"
                    ? "md:col-span-12"
                    : article.column === "left"
                    ? "md:col-span-7"
                    : "md:col-span-5"
                } group cursor-pointer`}
              >
                <Card className="glass border-white/10 overflow-hidden hover:border-primary/30 transition-all h-full">
                  {/* Article Image */}
                  <div className={`relative overflow-hidden ${
                    article.column === "full" ? "aspect-[21/9]" : "aspect-[16/10]"
                  }`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-blue-500/20 group-hover:scale-105 transition-transform duration-500" />
                    <Badge className="absolute top-4 right-4 bg-primary/20 text-primary border-primary/50">
                      {article.category}
                    </Badge>
                  </div>

                  <CardContent className="p-6 md:p-8">
                    {/* Meta Info */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {article.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className={`font-bold font-serif mb-3 group-hover:text-primary transition-colors ${
                      article.column === "full" ? "text-3xl md:text-4xl" : "text-2xl"
                    }`}>
                      {article.title}
                    </h3>

                    {/* Excerpt */}
                    <p className={`text-muted-foreground mb-6 leading-relaxed ${
                      article.column === "full" ? "text-lg" : "text-base"
                    }`}>
                      {article.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {article.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Stats & CTA */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {article.stats.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {article.stats.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {article.stats.comments}
                        </span>
                      </div>

                      <Button variant="ghost" className="group/btn">
                        Read More
                        <ChevronRight className="ml-1 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* About Author */}
      <section id="about" className="py-16 px-6 bg-muted/50">
        <div className="max-w-5xl mx-auto">
          <Card className="glass border-white/10">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                  <Avatar className="w-32 h-32 mb-6 border-4 border-primary/20">
                    <AvatarImage src={author.avatar} alt={author.name} />
                    <AvatarFallback>{author.name[0]}</AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col gap-3">
                    {[
                      { icon: Github, href: `https://github.com/${author.social.github}` },
                      { icon: Linkedin, href: `https://linkedin.com/in/${author.social.linkedin}` },
                      { icon: Twitter, href: `https://twitter.com/${author.social.twitter}` },
                      { icon: Mail, href: `mailto:${author.email}` }
                    ].map(({ icon: Icon, href }) => (
                      <a
                        key={href}
                        href={href}
                        className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{href.split('/').pop()}</span>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="text-3xl font-bold font-serif mb-3">About the Author</h3>
                  <h4 className="text-xl text-primary mb-6">{author.title}</h4>

                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                    {author.bio}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {achievements.map((achievement) => (
                      <div
                        key={achievement.label}
                        className="flex items-center gap-3 glass-dark rounded-lg p-4"
                      >
                        <achievement.icon className={`w-6 h-6 ${achievement.color}`} />
                        <span className="text-sm font-medium">{achievement.label}</span>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-6 bg-white/10" />

                  <div>
                    <h4 className="text-lg font-semibold mb-4">Related Reading</h4>
                    <div className="space-y-2">
                      {relatedReading.map((item) => (
                        <a
                          key={item.title}
                          href="#"
                          className="flex items-center justify-between p-3 glass rounded-lg hover:bg-white/5 transition-colors group"
                        >
                          <span className="text-sm group-hover:text-primary transition-colors">
                            {item.title}
                          </span>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {item.readTime}
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Newsletter */}
      <section id="newsletter" className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="glass-dark rounded-2xl p-12 border border-white/10">
              <Mail className="w-12 h-12 mx-auto mb-6 text-primary" />
              <h3 className="text-3xl font-bold font-serif mb-4">
                Subscribe to The Journal
              </h3>
              <p className="text-lg text-muted-foreground mb-8">
                Get the latest articles, insights, and updates delivered to your inbox every week.
              </p>

              <form className="flex gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  className="glass border-white/20"
                />
                <Button type="submit" size="lg">
                  <Send className="w-4 h-4 mr-2" />
                  Subscribe
                </Button>
              </form>

              <p className="text-xs text-muted-foreground mt-4">
                No spam. Unsubscribe anytime. 10,000+ subscribers
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold font-serif mb-4">The Blake Journal</h3>
              <p className="text-muted-foreground mb-4">
                Stories about design, development, and the craft of building digital products.
              </p>
              <div className="flex items-center gap-2">
                {[Github, Linkedin, Twitter, Mail].map((Icon, i) => (
                  <Button key={i} variant="ghost" size="icon">
                    <Icon className="w-4 h-4" />
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <a href="#" className="hover:text-foreground transition-colors">About</a>
                <a href="#" className="hover:text-foreground transition-colors">Archive</a>
                <a href="#" className="hover:text-foreground transition-colors">Topics</a>
                <a href="#" className="hover:text-foreground transition-colors">Newsletter</a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-foreground transition-colors">Terms of Use</a>
                <a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>

          <Separator className="my-8 bg-white/10" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2024 {author.name}. All rights reserved.</p>
            <p>Designed & built with Next.js and shadcn/ui</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
