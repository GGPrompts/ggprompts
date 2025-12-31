"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Clock,
  Calendar,
  Share2,
  Copy,
  Check,
  Twitter,
  Github,
  Linkedin,
  Link,
  User,
  ChevronRight,
  BookOpen,
  Hash
} from "lucide-react";
import { Button, Card, Badge, Separator, Avatar, AvatarFallback, AvatarImage, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@ggprompts/ui";

// Mock data for demonstration
const articleData = {
  title: "Building Modern Terminal UIs with Bubbletea and Lipgloss",
  subtitle: "A deep dive into creating beautiful command-line interfaces in Go",
  author: {
    name: "Matt Developer",
    bio: "Full-stack developer passionate about terminal interfaces and developer tools",
    avatar: "/avatar.jpg",
    twitter: "@mattdev",
    github: "mattdev"
  },
  publishedDate: "November 21, 2024",
  readingTime: 12,
  tags: ["Go", "TUI", "Bubbletea", "Lipgloss", "Terminal"],
  tableOfContents: [
    { id: "introduction", title: "Introduction", level: 1 },
    { id: "getting-started", title: "Getting Started", level: 1 },
    { id: "installation", title: "Installation", level: 2 },
    { id: "basic-setup", title: "Basic Setup", level: 2 },
    { id: "building-components", title: "Building Components", level: 1 },
    { id: "state-management", title: "State Management", level: 2 },
    { id: "styling", title: "Styling with Lipgloss", level: 2 },
    { id: "advanced-patterns", title: "Advanced Patterns", level: 1 },
    { id: "conclusion", title: "Conclusion", level: 1 }
  ],
  relatedArticles: [
    {
      title: "Creating CLIs with Cobra and Viper",
      excerpt: "Learn how to build powerful command-line tools in Go",
      readingTime: 8,
      date: "November 15, 2024",
      slug: "cli-cobra-viper"
    },
    {
      title: "Terminal Color Schemes and Theming",
      excerpt: "Understanding ANSI colors and modern terminal theming",
      readingTime: 6,
      date: "November 10, 2024",
      slug: "terminal-theming"
    },
    {
      title: "Performance Optimization in Go",
      excerpt: "Best practices for writing efficient Go code",
      readingTime: 15,
      date: "November 5, 2024",
      slug: "go-performance"
    }
  ]
};

// Code examples for demonstration
const codeExamples = {
  installation: `go get github.com/charmbracelet/bubbletea
go get github.com/charmbracelet/lipgloss`,

  basicModel: `package main

import (
    "fmt"
    tea "github.com/charmbracelet/bubbletea"
)

type model struct {
    choices  []string
    cursor   int
    selected map[int]struct{}
}

func initialModel() model {
    return model{
        choices:  []string{"Buy carrots", "Buy celery", "Buy kohlrabi"},
        selected: make(map[int]struct{}),
    }
}

func (m model) Init() tea.Cmd {
    return nil
}`,

  styling: `var (
    titleStyle = lipgloss.NewStyle().
        Foreground(lipgloss.Color("#10B981")).
        Background(lipgloss.Color("#000000")).
        Bold(true).
        Padding(0, 1)

    selectedStyle = lipgloss.NewStyle().
        Foreground(lipgloss.Color("#06B6D4")).
        Background(lipgloss.Color("#0A0A0A")).
        Bold(true)
)`
};

export default function BlogPostTemplate() {
  const [activeSection, setActiveSection] = useState("introduction");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Scroll spy for table of contents
  useEffect(() => {
    const handleScroll = () => {
      const sections = articleData.tableOfContents.map(item =>
        document.getElementById(item.id)
      ).filter(Boolean);

      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(articleData.tableOfContents[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const copyToClipboard = async (code: string, id: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const shareArticle = (platform: string) => {
    const url = window.location.href;
    const title = articleData.title;

    const shareUrls: { [key: string]: string } = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      copy: url
    };

    if (platform === "copy") {
      navigator.clipboard.writeText(url);
    } else {
      window.open(shareUrls[platform], "_blank");
    }
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen ">
        {/* Header/Hero Section */}
        <motion.header
          className="relative overflow-hidden border-b border-border/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="container mx-auto px-4 py-16 relative">
            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
              <a href="/" className="hover:text-primary transition-colors">Home</a>
              <ChevronRight className="w-4 h-4" />
              <a href="/blog" className="hover:text-primary transition-colors">Blog</a>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground">Article</span>
            </nav>

            {/* Title Section */}
            <div className="max-w-4xl">
              <div className="flex items-center gap-4 mb-4">
                {articleData.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="border-primary/50 text-primary">
                    <Hash className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-mono font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {articleData.title}
              </h1>

              <p className="text-xl text-muted-foreground mb-8">
                {articleData.subtitle}
              </p>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  {articleData.publishedDate}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  {articleData.readingTime} min read
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  ~{Math.round(articleData.readingTime * 200)} words
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Table of Contents - Sticky Sidebar */}
            <motion.aside
              className="lg:col-span-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="sticky top-8">
                <Card className="glass border-border/50 p-6">
                  <h3 className="text-lg font-semibold mb-4 text-primary">
                    Table of Contents
                  </h3>
                  <nav className="space-y-2">
                    {articleData.tableOfContents.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`
                          block w-full text-left transition-all duration-200
                          ${item.level === 2 ? "pl-4" : ""}
                          ${activeSection === item.id
                            ? "text-primary border-l-2 border-primary pl-3 -ml-1"
                            : "text-muted-foreground hover:text-foreground hover:pl-3 -ml-1"
                          }
                        `}
                      >
                        {item.title}
                      </button>
                    ))}
                  </nav>
                </Card>
              </div>
            </motion.aside>

            {/* Article Content */}
            <motion.article
              className="lg:col-span-6 prose prose-invert max-w-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="glass-dark border-border/50 p-8">
                {/* Introduction Section */}
                <section id="introduction" className="mb-12">
                  <h2 className="text-3xl font-bold mb-6 text-primary terminal-glow">
                    Introduction
                  </h2>
                  <p className="text-lg leading-relaxed mb-4 text-foreground/90">
                    Terminal User Interfaces (TUIs) have experienced a renaissance in recent years,
                    with modern libraries making it easier than ever to create beautiful, interactive
                    command-line applications. In this article, we'll explore how to build sophisticated
                    TUIs using Bubbletea and Lipgloss, two powerful libraries from Charm.
                  </p>
                  <p className="text-lg leading-relaxed text-foreground/90">
                    Whether you're building developer tools, system utilities, or just want to add
                    some flair to your command-line applications, these libraries provide the perfect
                    foundation for creating delightful user experiences in the terminal.
                  </p>
                </section>

                {/* Getting Started Section */}
                <section id="getting-started" className="mb-12">
                  <h2 className="text-3xl font-bold mb-6 text-primary terminal-glow">
                    Getting Started
                  </h2>

                  <section id="installation" className="mb-8">
                    <h3 className="text-2xl font-semibold mb-4 text-foreground">
                      Installation
                    </h3>
                    <p className="mb-4 text-foreground/90">
                      First, let's install the required dependencies. Both Bubbletea and Lipgloss
                      are Go modules, so installation is straightforward:
                    </p>

                    {/* Code Block Component */}
                    <div className="relative group mb-6">
                      <div className="absolute top-3 right-3 z-10">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                              onClick={() => copyToClipboard(codeExamples.installation, "install")}
                            >
                              {copiedCode === "install" ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{copiedCode === "install" ? "Copied!" : "Copy to clipboard"}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <pre className="glass-dark border border-border/50 rounded-lg p-4 overflow-x-auto">
                        <code className="text-sm font-mono text-primary/90">
                          {codeExamples.installation}
                        </code>
                      </pre>
                    </div>
                  </section>

                  <section id="basic-setup" className="mb-8">
                    <h3 className="text-2xl font-semibold mb-4 text-foreground">
                      Basic Setup
                    </h3>
                    <p className="mb-4 text-foreground/90">
                      The foundation of any Bubbletea application is the Model. Here's a simple
                      example that demonstrates the basic structure:
                    </p>

                    <div className="relative group mb-6">
                      <div className="absolute top-3 right-3 z-10">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                              onClick={() => copyToClipboard(codeExamples.basicModel, "basic")}
                            >
                              {copiedCode === "basic" ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{copiedCode === "basic" ? "Copied!" : "Copy to clipboard"}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <pre className="glass-dark border border-border/50 rounded-lg p-4 overflow-x-auto">
                        <code className="text-sm font-mono text-primary/90 whitespace-pre">
                          {codeExamples.basicModel}
                        </code>
                      </pre>
                    </div>
                  </section>
                </section>

                {/* Building Components Section */}
                <section id="building-components" className="mb-12">
                  <h2 className="text-3xl font-bold mb-6 text-primary terminal-glow">
                    Building Components
                  </h2>

                  <section id="state-management" className="mb-8">
                    <h3 className="text-2xl font-semibold mb-4 text-foreground">
                      State Management
                    </h3>
                    <p className="mb-4 text-foreground/90">
                      Bubbletea follows the Elm architecture, which means all state is managed
                      through a central model. Updates to the state happen through messages,
                      ensuring predictable state changes and easy debugging.
                    </p>

                    {/* Example with image */}
                    <div className="mb-6 rounded-lg overflow-hidden border border-border/50">
                      <div className="aspect-video bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">
                          [State Management Diagram Placeholder]
                        </span>
                      </div>
                    </div>
                  </section>

                  <section id="styling" className="mb-8">
                    <h3 className="text-2xl font-semibold mb-4 text-foreground">
                      Styling with Lipgloss
                    </h3>
                    <p className="mb-4 text-foreground/90">
                      Lipgloss provides a powerful styling system that makes it easy to create
                      beautiful terminal interfaces. You can define reusable styles and apply
                      them consistently throughout your application:
                    </p>

                    <div className="relative group mb-6">
                      <div className="absolute top-3 right-3 z-10">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                              onClick={() => copyToClipboard(codeExamples.styling, "styling")}
                            >
                              {copiedCode === "styling" ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{copiedCode === "styling" ? "Copied!" : "Copy to clipboard"}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <pre className="glass-dark border border-border/50 rounded-lg p-4 overflow-x-auto">
                        <code className="text-sm font-mono text-primary/90 whitespace-pre">
                          {codeExamples.styling}
                        </code>
                      </pre>
                    </div>
                  </section>
                </section>

                {/* Advanced Patterns Section */}
                <section id="advanced-patterns" className="mb-12">
                  <h2 className="text-3xl font-bold mb-6 text-primary terminal-glow">
                    Advanced Patterns
                  </h2>
                  <p className="mb-4 text-foreground/90">
                    As your TUI applications grow in complexity, you'll want to adopt patterns
                    that help maintain code organization and reusability. Some advanced patterns
                    include component composition, command chaining, and viewport management for
                    scrollable content.
                  </p>

                  {/* Info Box */}
                  <Card className="glass border-primary/50 p-6 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="text-primary mt-0.5">💡</div>
                      <div>
                        <h4 className="font-semibold mb-2 text-primary">Pro Tip</h4>
                        <p className="text-sm text-foreground/80">
                          Consider using Bubble Tea's viewport component for handling scrollable
                          content in your TUIs. It provides smooth scrolling and automatic height
                          management.
                        </p>
                      </div>
                    </div>
                  </Card>
                </section>

                {/* Conclusion Section */}
                <section id="conclusion" className="mb-12">
                  <h2 className="text-3xl font-bold mb-6 text-primary terminal-glow">
                    Conclusion
                  </h2>
                  <p className="text-lg leading-relaxed text-foreground/90">
                    Building modern Terminal User Interfaces with Bubbletea and Lipgloss opens
                    up a world of possibilities for creating engaging command-line applications.
                    These libraries provide the tools needed to build everything from simple
                    interactive prompts to complex dashboard applications, all while maintaining
                    the efficiency and accessibility that makes terminal applications so powerful.
                  </p>
                </section>

                <Separator className="my-8 border-border/50" />

                {/* Share Section */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Share this article:</span>
                    <div className="flex gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => shareArticle("twitter")}
                          >
                            <Twitter className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Share on Twitter</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => shareArticle("linkedin")}
                          >
                            <Linkedin className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Share on LinkedIn</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => shareArticle("copy")}
                          >
                            <Link className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy link</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Author Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="glass border-border/50 p-6 mt-8">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16 border-2 border-primary/50">
                      <AvatarImage src={articleData.author.avatar} />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        <User className="h-8 w-8" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{articleData.author.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {articleData.author.bio}
                      </p>
                      <div className="flex gap-3">
                        <a
                          href={`https://twitter.com/${articleData.author.twitter}`}
                          className="text-sm text-primary hover:text-primary/80 transition-colors"
                        >
                          <Twitter className="h-4 w-4 inline mr-1" />
                          {articleData.author.twitter}
                        </a>
                        <a
                          href={`https://github.com/${articleData.author.github}`}
                          className="text-sm text-primary hover:text-primary/80 transition-colors"
                        >
                          <Github className="h-4 w-4 inline mr-1" />
                          {articleData.author.github}
                        </a>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Related Articles */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <h2 className="text-2xl font-bold mb-6 mt-12 text-primary terminal-glow">
                  Related Articles
                </h2>
                <div className="grid gap-4">
                  {articleData.relatedArticles.map((article, index) => (
                    <Card
                      key={article.slug}
                      className="glass border-border/50 p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 cursor-pointer"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2 hover:text-primary transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {article.readingTime} min
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {article.date}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground mt-1" />
                      </div>
                    </Card>
                  ))}
                </div>
              </motion.div>
            </motion.article>

            {/* Right Sidebar - Share & Tags */}
            <motion.aside
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="sticky top-8 space-y-6">
                {/* Quick Share Card */}
                <Card className="glass border-border/50 p-6">
                  <h3 className="text-lg font-semibold mb-4 text-primary">
                    Quick Share
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      className="border-border/50 hover:border-primary/50"
                      onClick={() => shareArticle("twitter")}
                    >
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="border-border/50 hover:border-primary/50"
                      onClick={() => shareArticle("linkedin")}
                    >
                      <Linkedin className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="border-border/50 hover:border-primary/50"
                      onClick={() => shareArticle("copy")}
                    >
                      <Link className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>

                {/* Tags Card */}
                <Card className="glass border-border/50 p-6">
                  <h3 className="text-lg font-semibold mb-4 text-primary">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {articleData.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-primary/10 border-primary/30 hover:bg-primary/20 cursor-pointer transition-colors"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </Card>

                {/* Reading Progress */}
                <Card className="glass border-border/50 p-6">
                  <h3 className="text-lg font-semibold mb-4 text-primary">
                    Reading Progress
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Time remaining</span>
                      <span className="text-foreground">~10 min</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full w-1/6 transition-all duration-300" />
                    </div>
                  </div>
                </Card>
              </div>
            </motion.aside>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}