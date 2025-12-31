"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Heart,
  TrendingUp,
  Search,
  Download,
  Filter,
  BarChart3,
  BookOpen,
  Hash,
  Award,
  Activity,
  Archive as ArchiveIcon,
} from "lucide-react";
import { Button, Card, Badge, Input, Separator, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Tabs, TabsContent, TabsList, TabsTrigger } from "@ggprompts/ui";

// Generate archive data
const generateArchiveData = () => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = [2024, 2023, 2022, 2021];
  const categories = ["Tutorial", "Guide", "Deep Dive", "Opinion", "News"];
  const titles = [
    "Building Modern Web Applications",
    "Advanced TypeScript Patterns",
    "React Performance Optimization",
    "Database Design Best Practices",
    "API Security Guidelines",
    "Testing Strategies",
    "DevOps Automation",
    "Cloud Architecture",
    "Microservices Design",
    "GraphQL Best Practices",
  ];

  const articles: any[] = [];
  let id = 1;

  years.forEach((year) => {
    months.forEach((month, monthIndex) => {
      const count = Math.floor(Math.random() * 15) + 5;
      for (let i = 0; i < count; i++) {
        articles.push({
          id: id++,
          title: `${titles[i % titles.length]} ${year}`,
          excerpt: "Comprehensive guide with practical examples and best practices.",
          date: new Date(year, monthIndex, Math.floor(Math.random() * 28) + 1),
          year,
          month,
          monthIndex,
          category: categories[Math.floor(Math.random() * categories.length)],
          views: Math.floor(Math.random() * 50000) + 1000,
          likes: Math.floor(Math.random() * 500) + 20,
          readingTime: Math.floor(Math.random() * 15) + 5,
        });
      }
    });
  });

  return articles.sort((a, b) => b.date.getTime() - a.date.getTime());
};

const allArticles = generateArchiveData();

// Generate heat map data (365 days)
const generateHeatMapData = () => {
  const data = [];
  const today = new Date();
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const count = Math.floor(Math.random() * 8);
    data.push({
      date: date.toISOString().split("T")[0],
      count,
      intensity: count === 0 ? 0 : count <= 2 ? 1 : count <= 4 ? 2 : count <= 6 ? 3 : 4,
    });
  }
  return data;
};

const heatMapData = generateHeatMapData();

export default function ArchivePage() {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"timeline" | "calendar" | "stats">("timeline");

  // Calculate statistics
  const stats = useMemo(() => {
    const filtered = allArticles.filter((a) => a.year.toString() === selectedYear);
    const totalViews = filtered.reduce((sum, a) => sum + a.views, 0);
    const totalLikes = filtered.reduce((sum, a) => sum + a.likes, 0);
    const categories = new Set(filtered.map((a) => a.category));

    const monthlyStats = Array.from({ length: 12 }, (_, i) => {
      const monthArticles = filtered.filter((a) => a.monthIndex === i);
      return {
        month: new Date(2024, i).toLocaleDateString("en-US", { month: "short" }),
        count: monthArticles.length,
        views: monthArticles.reduce((sum, a) => sum + a.views, 0),
      };
    });

    return {
      totalArticles: filtered.length,
      totalViews,
      totalLikes,
      categories: categories.size,
      monthlyStats,
      avgArticlesPerMonth: (filtered.length / 12).toFixed(1),
    };
  }, [selectedYear]);

  // Filter articles
  const filteredArticles = useMemo(() => {
    return allArticles.filter((article) => {
      const matchesYear = article.year.toString() === selectedYear;
      const matchesMonth = !selectedMonth || article.month === selectedMonth;
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || article.category === categoryFilter;

      return matchesYear && matchesMonth && matchesSearch && matchesCategory;
    });
  }, [selectedYear, selectedMonth, searchQuery, categoryFilter]);

  // Group by month
  const articlesByMonth = useMemo(() => {
    const grouped: { [key: string]: typeof allArticles } = {};
    filteredArticles.forEach((article) => {
      const key = article.month;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(article);
    });
    return grouped;
  }, [filteredArticles]);

  const intensityColors = [
    "bg-muted",
    "bg-primary/20",
    "bg-primary/40",
    "bg-primary/60",
    "bg-primary/80",
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Archive Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass border-glow p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-2xl md:text-4xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent terminal-glow mb-2 flex items-center gap-3">
                  <ArchiveIcon className="h-10 w-10 text-primary" />
                  Article Archive
                </h1>
                <p className="text-lg text-muted-foreground">
                  Explore our complete collection of {allArticles.length}+ articles
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="lg" className="glass">
                  <Download className="mr-2 h-4 w-4" />
                  Export Archive
                </Button>
                <Button variant="outline" size="lg" className="glass">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Year Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { label: "Articles", value: stats.totalArticles, icon: BookOpen },
              { label: "Total Views", value: `${(stats.totalViews / 1000000).toFixed(1)}M`, icon: Eye },
              { label: "Total Likes", value: `${(stats.totalLikes / 1000).toFixed(1)}K`, icon: Heart },
              { label: "Categories", value: stats.categories, icon: Hash },
              { label: "Avg/Month", value: stats.avgArticlesPerMonth, icon: Calendar },
              { label: "Top Rated", value: "24", icon: Award },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
              >
                <Card className="glass-dark p-4 text-center hover:border-primary/50 transition-colors">
                  <stat.icon className="h-5 w-5 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold terminal-glow">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* View Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass p-6">
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
              <TabsList className="grid w-full md:w-auto grid-cols-3 glass-dark">
                <TabsTrigger value="timeline" className="text-xs md:text-sm">
                  <Clock className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Timeline View</span>
                  <span className="md:hidden">Timeline</span>
                </TabsTrigger>
                <TabsTrigger value="calendar" className="text-xs md:text-sm">
                  <Activity className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Calendar Heat Map</span>
                  <span className="md:hidden">Calendar</span>
                </TabsTrigger>
                <TabsTrigger value="stats" className="text-xs md:text-sm">
                  <BarChart3 className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Statistics</span>
                  <span className="md:hidden">Stats</span>
                </TabsTrigger>
              </TabsList>

              {/* Timeline View */}
              <TabsContent value="timeline" className="space-y-6 mt-6">
                {/* Year Navigation */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setSelectedYear((y) => (parseInt(y) - 1).toString())
                    }
                    disabled={selectedYear === "2021"}
                    className="glass-dark"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="text-2xl font-bold terminal-glow">{selectedYear}</div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setSelectedYear((y) => (parseInt(y) + 1).toString())
                    }
                    disabled={selectedYear === "2024"}
                    className="glass-dark"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Month Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 12 }, (_, i) => {
                    const month = new Date(2024, i).toLocaleDateString("en-US", {
                      month: "long",
                    });
                    const count =
                      allArticles.filter(
                        (a) => a.year.toString() === selectedYear && a.monthIndex === i
                      ).length;
                    return (
                      <motion.div
                        key={month}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + i * 0.02 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Card
                          className={`glass-dark p-4 cursor-pointer transition-all ${
                            selectedMonth === month
                              ? "border-primary/60 bg-primary/10"
                              : "hover:border-primary/40"
                          }`}
                          onClick={() =>
                            setSelectedMonth(selectedMonth === month ? null : month)
                          }
                        >
                          <div className="text-center">
                            <div className="text-sm font-semibold mb-2">{month}</div>
                            <div className="text-2xl font-bold terminal-glow">{count}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              articles
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Filters */}
                <Card className="glass-dark p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 glass"
                      />
                    </div>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-full md:w-[180px] glass">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Tutorial">Tutorial</SelectItem>
                        <SelectItem value="Guide">Guide</SelectItem>
                        <SelectItem value="Deep Dive">Deep Dive</SelectItem>
                        <SelectItem value="Opinion">Opinion</SelectItem>
                        <SelectItem value="News">News</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </Card>

                {/* Timeline Articles */}
                <div className="space-y-8">
                  {Object.entries(articlesByMonth)
                    .sort(([a], [b]) => {
                      const months = [
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December",
                      ];
                      return months.indexOf(b) - months.indexOf(a);
                    })
                    .map(([month, articles], groupIndex) => (
                      <motion.div
                        key={month}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: groupIndex * 0.1 }}
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <h3 className="text-xl font-bold">{month}</h3>
                          <Badge variant="outline" className="glass-dark">
                            {articles.length} articles
                          </Badge>
                          <Separator className="flex-1" />
                        </div>

                        <div className="space-y-4 pl-4 border-l-2 border-primary/30">
                          {articles.map((article, i) => (
                            <motion.div
                              key={article.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                            >
                              <Card className="glass hover:border-primary/50 transition-all group">
                                <div className="p-4">
                                  <div className="flex items-start gap-4">
                                    <div className="text-sm text-muted-foreground min-w-[80px]">
                                      {article.date.toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                      })}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                      <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="glass text-xs">
                                          {article.category}
                                        </Badge>
                                      </div>
                                      <h4 className="font-semibold group-hover:text-primary transition-colors">
                                        {article.title}
                                      </h4>
                                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                          <Clock className="h-3 w-3" />
                                          {article.readingTime} min
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
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    ))}

                  {Object.keys(articlesByMonth).length === 0 && (
                    <Card className="glass p-12 text-center">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg text-muted-foreground">No articles found</p>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Calendar Heat Map */}
              <TabsContent value="calendar" className="mt-6">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2">Publishing Activity</h3>
                    <p className="text-muted-foreground">
                      Article publication frequency over the last year
                    </p>
                  </div>

                  <Card className="glass-dark p-6 overflow-x-auto">
                    <div className="min-w-full sm:min-w-[600px] lg:min-w-[800px]">
                      <div className="grid grid-cols-53 gap-1">
                        {heatMapData.map((day, i) => (
                          <motion.div
                            key={day.date}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.001 }}
                            whileHover={{ scale: 1.2 }}
                            className={`h-3 w-3 rounded-sm ${
                              intensityColors[day.intensity]
                            } cursor-pointer`}
                            title={`${day.date}: ${day.count} articles`}
                          />
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                        <span>Less</span>
                        <div className="flex gap-1">
                          {intensityColors.map((color, i) => (
                            <div key={i} className={`h-3 w-3 rounded-sm ${color}`} />
                          ))}
                        </div>
                        <span>More</span>
                      </div>
                    </div>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="glass p-6 text-center">
                      <Activity className="h-8 w-8 mx-auto mb-3 text-primary" />
                      <div className="text-3xl font-bold terminal-glow mb-1">247</div>
                      <div className="text-sm text-muted-foreground">
                        Active Days
                      </div>
                    </Card>
                    <Card className="glass p-6 text-center">
                      <TrendingUp className="h-8 w-8 mx-auto mb-3 text-primary" />
                      <div className="text-3xl font-bold terminal-glow mb-1">28</div>
                      <div className="text-sm text-muted-foreground">
                        Longest Streak
                      </div>
                    </Card>
                    <Card className="glass p-6 text-center">
                      <BarChart3 className="h-8 w-8 mx-auto mb-3 text-primary" />
                      <div className="text-3xl font-bold terminal-glow mb-1">3.2</div>
                      <div className="text-sm text-muted-foreground">
                        Avg per Week
                      </div>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Statistics Dashboard */}
              <TabsContent value="stats" className="mt-6">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-center mb-6">
                    {selectedYear} Statistics Dashboard
                  </h3>

                  {/* Monthly Chart */}
                  <Card className="glass p-6">
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Monthly Article Count
                    </h4>
                    <div className="space-y-3">
                      {stats.monthlyStats.map((stat, i) => {
                        const maxCount = Math.max(...stats.monthlyStats.map((s) => s.count));
                        const percentage = (stat.count / maxCount) * 100;
                        return (
                          <motion.div
                            key={stat.month}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 text-sm font-medium">{stat.month}</div>
                              <div className="flex-1">
                                <div className="h-8 bg-muted rounded-lg overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ delay: i * 0.05 + 0.2, duration: 0.5 }}
                                    className="h-full bg-gradient-to-r from-primary to-secondary flex items-center justify-end pr-3"
                                  >
                                    <span className="text-xs font-bold text-white">
                                      {stat.count}
                                    </span>
                                  </motion.div>
                                </div>
                              </div>
                              <div className="w-24 text-sm text-muted-foreground text-right">
                                {(stat.views / 1000).toFixed(1)}K views
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </Card>

                  {/* Top Articles */}
                  <Card className="glass p-6">
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      Top Articles of {selectedYear}
                    </h4>
                    <div className="space-y-3">
                      {filteredArticles
                        .sort((a, b) => b.views - a.views)
                        .slice(0, 10)
                        .map((article, i) => (
                          <motion.div
                            key={article.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-center gap-3 p-3 rounded-lg glass-dark hover:border-primary/50 transition-colors"
                          >
                            <div className="text-lg font-bold text-primary w-8">
                              #{i + 1}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm line-clamp-1">
                                {article.title}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {article.date.toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {(article.views / 1000).toFixed(1)}K
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                {article.likes}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
