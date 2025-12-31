'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Calendar, Link, Mail, Github, Linkedin, Twitter, Globe,
  Edit, Upload, Star, GitFork, Clock, Award, TrendingUp, Users,
  ChevronRight, Download, Lock, Eye, EyeOff, Share2, Heart,
  Code, Coffee, Zap, Target, Trophy, Flame, CheckCircle2,
  MessageCircle, GitCommit, FileCode, Plus, Settings, MoreVertical,
  ExternalLink, Copy, Shield, BookOpen, Briefcase, GraduationCap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

// Mock data
const userData = {
  name: 'Alexandra Chen',
  username: '@alexchen',
  email: 'alex@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alexandra',
  coverImage: '/api/placeholder/1200/300',
  bio: 'Full-stack developer passionate about building elegant solutions. Open source enthusiast, terminal lover, and coffee addict ☕',
  location: 'San Francisco, CA',
  website: 'https://alexchen.dev',
  joined: 'January 2021',
  followers: 2847,
  following: 342,
  projects: 47,
  contributions: 1523,
  streak: 42,
  level: 12,
  xp: 8750,
  nextLevelXp: 10000,
  badges: [
    { id: 1, name: 'Early Adopter', icon: '🚀', description: 'Joined in the first year' },
    { id: 2, name: 'Code Ninja', icon: '🥷', description: '100+ commits in a month' },
    { id: 3, name: 'Team Player', icon: '🤝', description: 'Collaborated on 10+ projects' },
    { id: 4, name: 'Bug Hunter', icon: '🐛', description: 'Found and fixed 50+ bugs' },
    { id: 5, name: 'Mentor', icon: '🎓', description: 'Helped 20+ developers' },
  ],
  skills: [
    { name: 'TypeScript', level: 95, endorsements: 127 },
    { name: 'React', level: 90, endorsements: 98 },
    { name: 'Node.js', level: 85, endorsements: 76 },
    { name: 'Python', level: 80, endorsements: 65 },
    { name: 'Docker', level: 75, endorsements: 43 },
    { name: 'AWS', level: 70, endorsements: 38 },
  ],
  certifications: [
    { name: 'AWS Solutions Architect', issuer: 'Amazon', date: '2023' },
    { name: 'Google Cloud Professional', issuer: 'Google', date: '2023' },
  ],
  social: {
    github: 'alexchen',
    linkedin: 'alexandra-chen',
    twitter: 'alexchen_dev',
  }
};

const projects = [
  {
    id: 1,
    name: 'Terminal Dashboard',
    description: 'A beautiful TUI dashboard built with Bubble Tea',
    stars: 342,
    forks: 45,
    language: 'Go',
    languageColor: '#00ADD8',
    updated: '2 days ago',
    pinned: true,
    visibility: 'public',
    thumbnail: '/api/placeholder/400/200',
    tags: ['TUI', 'Go', 'Dashboard']
  },
  {
    id: 2,
    name: 'React Component Library',
    description: 'Modern component library with glassmorphic design',
    stars: 1256,
    forks: 178,
    language: 'TypeScript',
    languageColor: '#3178C6',
    updated: '5 days ago',
    pinned: true,
    visibility: 'public',
    thumbnail: '/api/placeholder/400/200',
    tags: ['React', 'TypeScript', 'UI']
  },
  {
    id: 3,
    name: 'ML Pipeline Tool',
    description: 'Automated machine learning pipeline orchestration',
    stars: 89,
    forks: 12,
    language: 'Python',
    languageColor: '#3776AB',
    updated: '1 week ago',
    pinned: false,
    visibility: 'private',
    thumbnail: '/api/placeholder/400/200',
    tags: ['ML', 'Python', 'Automation']
  },
];

const activities = [
  { id: 1, type: 'commit', message: 'feat: Add dark mode support', repo: 'Terminal Dashboard', time: '2 hours ago', icon: GitCommit },
  { id: 2, type: 'star', message: 'Starred awesome-tui-apps', repo: 'awesome-tui-apps', time: '5 hours ago', icon: Star },
  { id: 3, type: 'comment', message: 'Commented on issue #42', repo: 'React Component Library', time: '1 day ago', icon: MessageCircle },
  { id: 4, type: 'fork', message: 'Forked rust-terminal-apps', repo: 'rust-terminal-apps', time: '2 days ago', icon: GitFork },
  { id: 5, type: 'create', message: 'Created new repository', repo: 'ML Pipeline Tool', time: '3 days ago', icon: Plus },
];

// Generate contribution data for heatmap
const generateContributions = () => {
  const contributions = [];
  const today = new Date();
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    contributions.push({
      date: date.toISOString().split('T')[0],
      count: Math.floor(Math.random() * 5),
    });
  }
  return contributions;
};

const contributionData = generateContributions();

const similarUsers = [
  { id: 1, name: 'Sarah Kim', username: '@sarahkim', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', mutual: 12 },
  { id: 2, name: 'David Liu', username: '@davidliu', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', mutual: 8 },
  { id: 3, name: 'Emma Wilson', username: '@emmaw', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma', mutual: 15 },
];

export default function UserProfileTemplate() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [privacySettings, setPrivacySettings] = useState({
    showEmail: false,
    showLocation: true,
    showActivity: true,
    showProjects: true,
  });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const exportProfile = (format: 'json' | 'pdf') => {
    if (format === 'json') {
      const data = JSON.stringify({ userData, projects, activities }, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${userData.username}-profile.json`;
      a.click();
    } else {
      // Mock PDF export
      alert('PDF export would be implemented here');
    }
  };

  const getContributionColor = (count: number) => {
    if (count === 0) return 'bg-muted/50';
    if (count === 1) return 'bg-primary/50';
    if (count === 2) return 'bg-primary/50';
    if (count === 3) return 'bg-primary/50';
    return 'bg-primary/50';
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen text-foreground relative overflow-hidden"
    >
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              rgba(16, 185, 129, 0.1) 0%,
              transparent 50%)`
          }}
        />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="glass border-white/10 overflow-hidden mb-8">
          {/* Cover Image */}
          <div className="relative h-48 sm:h-64 bg-gradient-to-br from-primary/20 via-secondary/20 to-blue-500/20">
            <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
            <Button
              size="sm"
              className="absolute top-4 right-4 glass hover:bg-white/10"
              variant="ghost"
            >
              <Upload className="h-4 w-4 mr-2" />
              Change Cover
            </Button>
          </div>

          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-20 sm:-mt-16 gap-4">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback>{userData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full glass hover:bg-white/10"
                  variant="ghost"
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>

              {/* Profile Actions */}
              <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl sm:text-3xl font-bold terminal-glow font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {userData.name}
                      </h1>
                      <Badge variant="outline" className="border-primary/30 text-primary">
                        Level {userData.level}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{userData.username}</p>
                  </div>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                        <Button className="bg-primary hover:bg-primary">
                          Save Profile
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          className="border-primary/30 hover:bg-primary/10"
                          onClick={() => setIsEditing(true)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                        <Button
                          className={isFollowing ? 'bg-primary hover:bg-primary' : ''}
                          variant={isFollowing ? 'default' : 'outline'}
                          onClick={() => setIsFollowing(!isFollowing)}
                        >
                          {isFollowing ? 'Following' : 'Follow'}
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="glass border-white/10">
                            <DropdownMenuItem onClick={() => exportProfile('json')}>
                              <Download className="h-4 w-4 mr-2" />
                              Export as JSON
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => exportProfile('pdf')}>
                              <FileCode className="h-4 w-4 mr-2" />
                              Export as PDF
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Share2 className="h-4 w-4 mr-2" />
                              Share Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="h-4 w-4 mr-2" />
                              Copy Profile Link
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <p className="mt-6 text-muted-foreground max-w-3xl">
              {userData.bio}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap gap-4 mt-6 text-sm text-muted-foreground">
              {privacySettings.showLocation && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {userData.location}
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Joined {userData.joined}
              </div>
              <div className="flex items-center gap-1">
                <Link className="h-4 w-4" />
                <a href={userData.website} className="hover:text-primary transition-colors">
                  {userData.website.replace('https://', '')}
                </a>
              </div>
              {privacySettings.showEmail && (
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {userData.email}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-6">
              <div className="glass rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-primary">{userData.followers.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Followers</div>
              </div>
              <div className="glass rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-secondary">{userData.following}</div>
                <div className="text-xs text-muted-foreground">Following</div>
              </div>
              <div className="glass rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-400">{userData.projects}</div>
                <div className="text-xs text-muted-foreground">Projects</div>
              </div>
              <div className="glass rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-purple-400">{userData.contributions.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Contributions</div>
              </div>
              <div className="glass rounded-lg p-3 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Flame className="h-5 w-5 text-orange-400" />
                  <span className="text-2xl font-bold text-orange-400">{userData.streak}</span>
                </div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </div>
            </div>

            {/* XP Progress */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm font-medium">Level {userData.level} Progress</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {userData.xp.toLocaleString()} / {userData.nextLevelXp.toLocaleString()} XP
                </span>
              </div>
              <Progress value={(userData.xp / userData.nextLevelXp) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
            <TabsList className="glass border-white/10 p-1 h-auto flex-wrap w-max md:w-auto">
              <TabsTrigger value="overview" className="data-[state=active]:bg-primary/20 text-xs sm:text-sm whitespace-nowrap">
                Overview
              </TabsTrigger>
              <TabsTrigger value="projects" className="data-[state=active]:bg-primary/20 text-xs sm:text-sm whitespace-nowrap">
                Projects
              </TabsTrigger>
              <TabsTrigger value="activity" className="data-[state=active]:bg-primary/20 text-xs sm:text-sm whitespace-nowrap">
                Activity
              </TabsTrigger>
              <TabsTrigger value="about" className="data-[state=active]:bg-primary/20 text-xs sm:text-sm whitespace-nowrap">
                About
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Pinned Projects */}
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Pinned Projects
                </CardTitle>
                <CardDescription>Drag to reorder • Click to view</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.filter(p => p.pinned).map((project) => (
                    <motion.div
                      key={project.id}
                      whileHover={{ scale: 1.02 }}
                      className="glass rounded-lg p-4 cursor-pointer border border-white/5 hover:border-primary/30 transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: project.languageColor }} />
                          <h3 className="font-semibold">{project.name}</h3>
                          {project.visibility === 'private' && <Lock className="h-3 w-3 text-muted-foreground" />}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {project.language}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4" />
                          {project.stars}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitFork className="h-4 w-4" />
                          {project.forks}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {project.updated}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.slice(0, 3).map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="glass rounded-full p-2">
                        <activity.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          {activity.message} in <span className="font-semibold text-primary">{activity.repo}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-400" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {userData.badges.map((badge) => (
                    <TooltipProvider key={badge.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="glass rounded-lg p-4 text-center cursor-pointer border border-white/5 hover:border-primary/30"
                          >
                            <div className="text-3xl mb-2">{badge.icon}</div>
                            <p className="text-xs font-medium">{badge.name}</p>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent className="glass border-white/10">
                          <p>{badge.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle>All Projects</CardTitle>
                <CardDescription>
                  {privacySettings.showProjects ? 'Public and private repositories' : 'Projects are hidden'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {privacySettings.showProjects ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project) => (
                      <motion.div
                        key={project.id}
                        whileHover={{ y: -4 }}
                        className="glass rounded-lg overflow-hidden border border-white/5 hover:border-primary/30 transition-all"
                      >
                        <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10" />
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold flex items-center gap-2">
                              {project.name}
                              {project.visibility === 'private' && <Lock className="h-3 w-3" />}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              {project.language}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {project.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {project.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1">
                                <Star className="h-3 w-3" />
                                {project.stars}
                              </span>
                              <span className="flex items-center gap-1">
                                <GitFork className="h-3 w-3" />
                                {project.forks}
                              </span>
                            </div>
                            <span>{project.updated}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Lock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Projects are currently private</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            {/* Contribution Graph */}
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle>Contribution Graph</CardTitle>
                <CardDescription>Your activity over the past year</CardDescription>
              </CardHeader>
              <CardContent>
                {privacySettings.showActivity ? (
                  <>
                    <ScrollArea className="w-full">
                      <div className="grid grid-flow-col gap-1 p-2" style={{ gridTemplateRows: 'repeat(7, 1fr)' }}>
                        {contributionData.map((day, i) => (
                          <TooltipProvider key={i}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className={`w-3 h-3 rounded-sm ${getContributionColor(day.count)}
                                    hover:ring-2 hover:ring-emerald-400 cursor-pointer transition-all`}
                                />
                              </TooltipTrigger>
                              <TooltipContent className="glass border-white/10">
                                <p className="text-xs">
                                  {day.count} contribution{day.count !== 1 ? 's' : ''} on {day.date}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                    <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                      <span>Less</span>
                      <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-sm bg-muted/50" />
                        <div className="w-3 h-3 rounded-sm bg-primary/50" />
                        <div className="w-3 h-3 rounded-sm bg-primary/50" />
                        <div className="w-3 h-3 rounded-sm bg-primary/50" />
                        <div className="w-3 h-3 rounded-sm bg-primary/50" />
                      </div>
                      <span>More</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <EyeOff className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Activity graph is currently private</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Activity Timeline */}
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="relative">
                        <div className="glass rounded-full p-2">
                          <activity.icon className="h-4 w-4 text-primary" />
                        </div>
                        {index < activities.length - 1 && (
                          <div className="absolute top-10 left-1/2 w-px h-12 bg-gradient-to-b from-primary/20 to-transparent -translate-x-1/2" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          {activity.message} in{' '}
                          <span className="font-semibold text-primary hover:underline cursor-pointer">
                            {activity.repo}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            {/* Skills & Expertise */}
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-blue-400" />
                  Skills & Expertise
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userData.skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{skill.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {skill.endorsements} endorsements
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-yellow-400" />
                  Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userData.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center justify-between p-3 glass rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{cert.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {cert.issuer} • {cert.date}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-purple-400" />
                  Social Links
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <a
                    href={`https://github.com/${userData.social.github}`}
                    className="flex items-center gap-3 p-3 glass rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <Github className="h-5 w-5" />
                    <span>GitHub</span>
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </a>
                  <a
                    href={`https://linkedin.com/in/${userData.social.linkedin}`}
                    className="flex items-center gap-3 p-3 glass rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <Linkedin className="h-5 w-5" />
                    <span>LinkedIn</span>
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </a>
                  <a
                    href={`https://twitter.com/${userData.social.twitter}`}
                    className="flex items-center gap-3 p-3 glass rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <Twitter className="h-5 w-5" />
                    <span>Twitter</span>
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-400" />
                  Privacy Settings
                </CardTitle>
                <CardDescription>Control what others can see on your profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show Email</p>
                    <p className="text-xs text-muted-foreground">Display your email address publicly</p>
                  </div>
                  <Switch
                    checked={privacySettings.showEmail}
                    onCheckedChange={(checked) =>
                      setPrivacySettings(prev => ({ ...prev, showEmail: checked }))
                    }
                  />
                </div>
                <Separator className="bg-white/10" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show Location</p>
                    <p className="text-xs text-muted-foreground">Display your location on profile</p>
                  </div>
                  <Switch
                    checked={privacySettings.showLocation}
                    onCheckedChange={(checked) =>
                      setPrivacySettings(prev => ({ ...prev, showLocation: checked }))
                    }
                  />
                </div>
                <Separator className="bg-white/10" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show Activity</p>
                    <p className="text-xs text-muted-foreground">Display contribution graph and timeline</p>
                  </div>
                  <Switch
                    checked={privacySettings.showActivity}
                    onCheckedChange={(checked) =>
                      setPrivacySettings(prev => ({ ...prev, showActivity: checked }))
                    }
                  />
                </div>
                <Separator className="bg-white/10" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show Projects</p>
                    <p className="text-xs text-muted-foreground">Display your projects publicly</p>
                  </div>
                  <Switch
                    checked={privacySettings.showProjects}
                    onCheckedChange={(checked) =>
                      setPrivacySettings(prev => ({ ...prev, showProjects: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Similar Users Sidebar */}
        <Card className="glass border-white/10 mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-secondary" />
              Similar Developers
            </CardTitle>
            <CardDescription>People you might want to follow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {similarUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 glass rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.username} • {user.mutual} mutual
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="border-primary/30">
                    Follow
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Floating Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 right-8 flex flex-col gap-2"
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  className="glass border-white/10 shadow-lg hover:bg-white/10"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  <ChevronRight className="h-5 w-5 rotate-[-90deg]" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="glass border-white/10">
                <p>Back to top</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.div>
      </div>
    </div>
  );
}