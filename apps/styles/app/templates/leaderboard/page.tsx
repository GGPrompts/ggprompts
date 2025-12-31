'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Medal, Crown, Award, TrendingUp, TrendingDown, Minus, ChevronUp,
  ChevronDown, Star, Zap, Flame, Target, Coffee, Code, GitCommit, Users,
  Calendar, Clock, Filter, Search, Info, ExternalLink, Share2, Download,
  BarChart3, Activity, Heart, MessageCircle, Eye, BookOpen, Sparkles,
  ArrowUp, ArrowDown, ArrowRight, CheckCircle2, Award as AwardIcon,
  Shield, Swords, Gem, Hexagon, Sword, Crosshair, Gauge, Flag, Radio
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

// Achievement badges
const badges = [
  { id: 'pioneer', name: 'Pioneer', icon: '🚀', color: 'text-blue-400', requirement: 'First 100 users' },
  { id: 'legend', name: 'Legend', icon: '⚔️', color: 'text-purple-400', requirement: 'Top 10 all-time' },
  { id: 'streak', name: 'Streak Master', icon: '🔥', color: 'text-orange-400', requirement: '100+ day streak' },
  { id: 'contributor', name: 'Top Contributor', icon: '💎', color: 'text-secondary', requirement: '1000+ contributions' },
  { id: 'mentor', name: 'Mentor', icon: '🎓', color: 'text-yellow-400', requirement: 'Helped 50+ users' },
  { id: 'speedster', name: 'Speedster', icon: '⚡', color: 'text-yellow-300', requirement: 'Fastest climber' },
];

// Generate comprehensive leaderboard data
const generateLeaderboardData = () => {
  const firstNames = ['Alex', 'Sarah', 'Jordan', 'Maya', 'Taylor', 'Casey', 'Morgan', 'Riley', 'Avery', 'Quinn',
    'Jamie', 'Cameron', 'Dakota', 'Skyler', 'Parker', 'Reese', 'Emerson', 'Charlie', 'Drew', 'Blake',
    'Sam', 'Chris', 'Jessie', 'Frankie', 'Hayden', 'Kendall', 'Logan', 'Peyton', 'River', 'Sydney',
    'Phoenix', 'Sage', 'Rowan', 'Finley', 'Quinn', 'Ash', 'Bay', 'Ocean', 'Sky', 'Rain'];
  const lastNames = ['Chen', 'Patel', 'Kim', 'Garcia', 'Rodriguez', 'Lee', 'Wilson', 'Martinez', 'Anderson', 'Taylor',
    'Thomas', 'Moore', 'Jackson', 'Martin', 'Thompson', 'White', 'Lopez', 'Gonzalez', 'Harris', 'Clark',
    'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen'];

  return Array.from({ length: 100 }, (_, i) => {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;

    // Generate scores with realistic distribution
    const baseScore = 10000 - (i * 90) - Math.floor(Math.random() * 100);
    const prevRank = i + 1 + Math.floor(Math.random() * 5) - 2;
    const rankChange = prevRank - (i + 1);

    // Activity breakdown
    const posts = Math.floor(Math.random() * 500) + 100;
    const comments = Math.floor(Math.random() * 1000) + 200;
    const likes = Math.floor(Math.random() * 5000) + 500;
    const shares = Math.floor(Math.random() * 300) + 50;
    const contributions = Math.floor(Math.random() * 200) + 50;

    // Calculate level based on score
    const level = Math.floor(baseScore / 500) + 1;

    // Assign badges
    const userBadges = [];
    if (i < 100) userBadges.push('pioneer');
    if (i < 10) userBadges.push('legend');
    if (Math.random() > 0.7) userBadges.push('streak');
    if (contributions > 150) userBadges.push('contributor');
    if (Math.random() > 0.8) userBadges.push('mentor');
    if (rankChange > 3) userBadges.push('speedster');

    // Generate trend data (sparkline)
    const trendData = Array.from({ length: 7 }, () => Math.floor(Math.random() * 100) + 50);

    return {
      id: i + 1,
      rank: i + 1,
      prevRank,
      rankChange,
      name,
      username: `@${firstName.toLowerCase()}${lastName.toLowerCase()}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      score: baseScore,
      level,
      badges: userBadges,
      stats: {
        posts,
        comments,
        likes,
        shares,
        contributions,
      },
      streak: Math.floor(Math.random() * 150) + 1,
      trendData,
      verified: i < 20 || Math.random() > 0.8,
      country: ['US', 'UK', 'CA', 'AU', 'DE', 'FR', 'JP', 'SG'][Math.floor(Math.random() * 8)],
    };
  });
};

type TimeFrame = 'daily' | 'weekly' | 'monthly' | 'all-time';
type Category = 'overall' | 'activity' | 'contributions' | 'engagement';

export default function LeaderboardTemplate() {
  const [leaderboardData] = useState(generateLeaderboardData());
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('all-time');
  const [category, setCategory] = useState<Category>('overall');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<typeof leaderboardData[0] | null>(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  // Current user (simulated as rank 42)
  const currentUser = leaderboardData[41];

  const filteredData = useMemo(() => {
    return leaderboardData.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [leaderboardData, searchQuery]);

  // Get top 3 for podium
  const topThree = filteredData.slice(0, 3);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-400" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return null;
    }
  };

  const getRankChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-400" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-400" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getLevelColor = (level: number) => {
    if (level >= 20) return 'text-purple-400';
    if (level >= 15) return 'text-blue-400';
    if (level >= 10) return 'text-secondary';
    if (level >= 5) return 'text-green-400';
    return 'text-gray-400';
  };

  const renderSparkline = (data: number[]) => {
    const max = Math.max(...data);
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 60;
      const y = 20 - (value / max) * 20;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width="60" height="20" className="inline-block">
        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-primary"
        />
      </svg>
    );
  };

  const openUserDetails = (user: typeof leaderboardData[0]) => {
    setSelectedUser(user);
    setUserDialogOpen(true);
  };

  return (
    <div className="min-h-screen text-foreground p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="glass border-white/10 overflow-hidden relative">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-purple-500/5 opacity-50" />
          <CardHeader className="relative">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl md:text-3xl terminal-glow flex items-center gap-3">
                  <Trophy className="h-8 w-8 text-yellow-400" />
                  Leaderboard
                </CardTitle>
                <CardDescription className="mt-2">
                  Top performers ranked by contributions and engagement
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="border-primary/30">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" className="border-primary/30">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Filters */}
        <Card className="glass border-white/10">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-transparent border-white/10"
                  />
                </div>
              </div>

              {/* Timeframe */}
              <Select value={timeFrame} onValueChange={(v) => setTimeFrame(v as TimeFrame)}>
                <SelectTrigger className="w-full lg:w-[180px] bg-transparent border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass border-white/10">
                  <SelectItem value="daily">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Daily
                    </div>
                  </SelectItem>
                  <SelectItem value="weekly">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Weekly
                    </div>
                  </SelectItem>
                  <SelectItem value="monthly">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Monthly
                    </div>
                  </SelectItem>
                  <SelectItem value="all-time">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4" />
                      All-Time
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Info Button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-white/10"
                      onClick={() => setDetailsDialogOpen(true)}
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>How rankings work</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardContent>
        </Card>

        {/* Category Tabs */}
        <Tabs value={category} onValueChange={(v) => setCategory(v as Category)}>
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
            <TabsList className="glass border-white/10 w-max md:w-auto grid grid-cols-2 sm:grid-cols-4">
              <TabsTrigger value="overall" className="text-xs sm:text-sm whitespace-nowrap">
                <Trophy className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Overall</span>
              </TabsTrigger>
              <TabsTrigger value="activity" className="text-xs sm:text-sm whitespace-nowrap">
                <Activity className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Activity</span>
              </TabsTrigger>
              <TabsTrigger value="contributions" className="text-xs sm:text-sm whitespace-nowrap">
                <GitCommit className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Contributions</span>
                <span className="sm:hidden">Contrib</span>
              </TabsTrigger>
              <TabsTrigger value="engagement" className="text-xs sm:text-sm whitespace-nowrap">
                <Heart className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Engagement</span>
                <span className="sm:hidden">Engage</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={category} className="space-y-6">
            {/* Podium - Top 3 */}
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-400" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 items-end">
                  {/* 2nd Place */}
                  {topThree[1] && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="order-1"
                    >
                      <Card
                        className="glass border-white/10 hover:border-gray-400/50 transition-all cursor-pointer"
                        onClick={() => openUserDetails(topThree[1])}
                      >
                        <CardContent className="p-4 text-center">
                          <div className="flex justify-center mb-3">
                            <Medal className="h-12 w-12 text-gray-400" />
                          </div>
                          <div className="relative inline-block mb-3">
                            <Avatar className="h-20 w-20 border-4 border-gray-400/50">
                              <AvatarImage src={topThree[1].avatar} alt={topThree[1].name} />
                              <AvatarFallback>{topThree[1].name[0]}</AvatarFallback>
                            </Avatar>
                            <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gray-400">
                              #2
                            </Badge>
                          </div>
                          <h3 className="font-bold text-lg mb-1">{topThree[1].name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{topThree[1].username}</p>
                          <div className="glass rounded-lg p-2">
                            <div className="text-2xl font-bold text-gray-400">{topThree[1].score.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">points</div>
                          </div>
                          <div className="flex justify-center gap-1 mt-3">
                            {topThree[1].badges.slice(0, 3).map(badgeId => {
                              const badge = badges.find(b => b.id === badgeId);
                              return badge ? (
                                <TooltipProvider key={badge.id}>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <div className="text-xl">{badge.icon}</div>
                                    </TooltipTrigger>
                                    <TooltipContent className="glass border-white/10">
                                      <p className="font-semibold">{badge.name}</p>
                                      <p className="text-xs text-muted-foreground">{badge.requirement}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ) : null;
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {/* 1st Place */}
                  {topThree[0] && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0 }}
                      className="order-2"
                    >
                      <Card
                        className="glass border-yellow-400/50 hover:border-yellow-400 transition-all cursor-pointer relative overflow-hidden"
                        onClick={() => openUserDetails(topThree[0])}
                      >
                        <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/10 to-transparent pointer-events-none" />
                        <CardContent className="p-6 text-center relative">
                          <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                            className="flex justify-center mb-3"
                          >
                            <Crown className="h-16 w-16 text-yellow-400" />
                          </motion.div>
                          <div className="relative inline-block mb-3">
                            <Avatar className="h-24 w-24 border-4 border-yellow-400">
                              <AvatarImage src={topThree[0].avatar} alt={topThree[0].name} />
                              <AvatarFallback>{topThree[0].name[0]}</AvatarFallback>
                            </Avatar>
                            <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-400">
                              #1
                            </Badge>
                          </div>
                          <h3 className="font-bold text-xl mb-1">{topThree[0].name}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{topThree[0].username}</p>
                          <div className="glass rounded-lg p-3 border border-yellow-400/30">
                            <div className="text-3xl font-bold text-yellow-400">
                              {topThree[0].score.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">points</div>
                          </div>
                          <div className="flex justify-center gap-1 mt-4">
                            {topThree[0].badges.slice(0, 4).map(badgeId => {
                              const badge = badges.find(b => b.id === badgeId);
                              return badge ? (
                                <TooltipProvider key={badge.id}>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <div className="text-2xl">{badge.icon}</div>
                                    </TooltipTrigger>
                                    <TooltipContent className="glass border-white/10">
                                      <p className="font-semibold">{badge.name}</p>
                                      <p className="text-xs text-muted-foreground">{badge.requirement}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ) : null;
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {/* 3rd Place */}
                  {topThree[2] && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="order-3"
                    >
                      <Card
                        className="glass border-white/10 hover:border-amber-600/50 transition-all cursor-pointer"
                        onClick={() => openUserDetails(topThree[2])}
                      >
                        <CardContent className="p-4 text-center">
                          <div className="flex justify-center mb-3">
                            <Medal className="h-12 w-12 text-amber-600" />
                          </div>
                          <div className="relative inline-block mb-3">
                            <Avatar className="h-20 w-20 border-4 border-amber-600/50">
                              <AvatarImage src={topThree[2].avatar} alt={topThree[2].name} />
                              <AvatarFallback>{topThree[2].name[0]}</AvatarFallback>
                            </Avatar>
                            <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-600">
                              #3
                            </Badge>
                          </div>
                          <h3 className="font-bold text-lg mb-1">{topThree[2].name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{topThree[2].username}</p>
                          <div className="glass rounded-lg p-2">
                            <div className="text-2xl font-bold text-amber-600">{topThree[2].score.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">points</div>
                          </div>
                          <div className="flex justify-center gap-1 mt-3">
                            {topThree[2].badges.slice(0, 3).map(badgeId => {
                              const badge = badges.find(b => b.id === badgeId);
                              return badge ? (
                                <TooltipProvider key={badge.id}>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <div className="text-xl">{badge.icon}</div>
                                    </TooltipTrigger>
                                    <TooltipContent className="glass border-white/10">
                                      <p className="font-semibold">{badge.name}</p>
                                      <p className="text-xs text-muted-foreground">{badge.requirement}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ) : null;
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* My Ranking */}
            <Card className="glass border-primary/30 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 glass rounded-lg">
                    <span className="text-lg font-bold text-primary">#{currentUser.rank}</span>
                  </div>
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{currentUser.name}</span>
                      <Badge variant="outline" className="border-primary/30">You</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{currentUser.score.toLocaleString()} points</span>
                      <span className="flex items-center gap-1">
                        {getRankChangeIcon(currentUser.rankChange)}
                        {Math.abs(currentUser.rankChange)} places
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" className="border-primary/30">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Full Leaderboard */}
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle>Rankings</CardTitle>
                <CardDescription>
                  Showing {filteredData.length} {filteredData.length === 1 ? 'user' : 'users'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredData.slice(3).map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className={`glass rounded-lg p-4 hover:border-primary/30 transition-all cursor-pointer border ${
                        user.id === currentUser.id ? 'border-primary/30 bg-primary/5' : 'border-white/10'
                      }`}
                      onClick={() => openUserDetails(user)}
                    >
                      <div className="flex items-center gap-4">
                        {/* Rank */}
                        <div className="flex items-center gap-3 w-20">
                          <div className="flex items-center justify-center w-10 h-10 glass rounded-lg">
                            {getRankIcon(user.rank) || (
                              <span className="text-sm font-bold">{user.rank}</span>
                            )}
                          </div>
                          <div className="text-xs">
                            {getRankChangeIcon(user.rankChange)}
                          </div>
                        </div>

                        {/* User Info */}
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold truncate">{user.name}</span>
                            {user.verified && (
                              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                            )}
                            {user.id === currentUser.id && (
                              <Badge variant="outline" className="border-primary/30">You</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{user.username}</span>
                            <Separator orientation="vertical" className="h-3" />
                            <span className={getLevelColor(user.level)}>Level {user.level}</span>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="hidden lg:flex items-center gap-6">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <div className="text-center">
                                  <div className="text-sm font-semibold">{user.stats.contributions}</div>
                                  <div className="text-xs text-muted-foreground">Contributions</div>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Total contributions</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <div className="flex items-center gap-1">
                                  <Flame className="h-4 w-4 text-orange-400" />
                                  <span className="text-sm font-semibold">{user.streak}</span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{user.streak} day streak</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>

                        {/* Trend */}
                        <div className="hidden xl:block">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                {renderSparkline(user.trendData)}
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>7-day trend</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>

                        {/* Badges */}
                        <div className="hidden md:flex gap-1">
                          {user.badges.slice(0, 3).map(badgeId => {
                            const badge = badges.find(b => b.id === badgeId);
                            return badge ? (
                              <TooltipProvider key={badge.id}>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <div className="text-lg">{badge.icon}</div>
                                  </TooltipTrigger>
                                  <TooltipContent className="glass border-white/10">
                                    <p className="font-semibold">{badge.name}</p>
                                    <p className="text-xs text-muted-foreground">{badge.requirement}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ) : null;
                          })}
                          {user.badges.length > 3 && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <div className="flex items-center justify-center w-6 h-6 glass rounded-full text-xs">
                                    +{user.badges.length - 3}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{user.badges.length} total badges</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>

                        {/* Score */}
                        <div className="text-right">
                          <div className="text-xl font-bold text-primary">
                            {user.score.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">points</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* User Details Dialog */}
      <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
        <DialogContent className="glass border-white/10 max-w-2xl">
          {selectedUser && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                    <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <DialogTitle>{selectedUser.name}</DialogTitle>
                      {selectedUser.verified && (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedUser.username}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge variant="outline" className="border-primary/30">
                        Rank #{selectedUser.rank}
                      </Badge>
                      <Badge variant="outline" className={getLevelColor(selectedUser.level)}>
                        Level {selectedUser.level}
                      </Badge>
                      {selectedUser.rankChange !== 0 && (
                        <Badge variant={selectedUser.rankChange > 0 ? 'default' : 'destructive'}>
                          {selectedUser.rankChange > 0 ? '↑' : '↓'} {Math.abs(selectedUser.rankChange)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {/* Score */}
                <div className="glass rounded-lg p-4 text-center">
                  <div className="text-4xl font-bold text-primary mb-1">
                    {selectedUser.score.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Points</div>
                </div>

                {/* Stats Breakdown */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Activity Breakdown
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Posts</span>
                        <span className="font-semibold">{selectedUser.stats.posts}</span>
                      </div>
                      <Progress value={(selectedUser.stats.posts / 500) * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Comments</span>
                        <span className="font-semibold">{selectedUser.stats.comments}</span>
                      </div>
                      <Progress value={(selectedUser.stats.comments / 1000) * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Likes Received</span>
                        <span className="font-semibold">{selectedUser.stats.likes}</span>
                      </div>
                      <Progress value={(selectedUser.stats.likes / 5000) * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Contributions</span>
                        <span className="font-semibold">{selectedUser.stats.contributions}</span>
                      </div>
                      <Progress value={(selectedUser.stats.contributions / 200) * 100} className="h-2" />
                    </div>
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Achievements ({selectedUser.badges.length})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedUser.badges.map(badgeId => {
                      const badge = badges.find(b => b.id === badgeId);
                      return badge ? (
                        <div key={badge.id} className="glass rounded-lg p-3 text-center">
                          <div className="text-3xl mb-2">{badge.icon}</div>
                          <div className="text-xs font-semibold">{badge.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">{badge.requirement}</div>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>

                {/* 7-day Trend */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    7-Day Performance
                  </h4>
                  <div className="glass rounded-lg p-4">
                    <svg width="100%" height="100" className="text-primary">
                      <polyline
                        points={selectedUser.trendData.map((value, index) => {
                          const max = Math.max(...selectedUser.trendData);
                          const x = (index / (selectedUser.trendData.length - 1)) * 100;
                          const y = 100 - (value / max) * 80;
                          return `${x}%,${y}`;
                        }).join(' ')}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                      {selectedUser.trendData.map((value, index) => {
                        const max = Math.max(...selectedUser.trendData);
                        const x = (index / (selectedUser.trendData.length - 1)) * 100;
                        const y = 100 - (value / max) * 80;
                        return (
                          <circle
                            key={index}
                            cx={`${x}%`}
                            cy={y}
                            r="4"
                            fill="currentColor"
                          />
                        );
                      })}
                    </svg>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-white/10">
                  <Button className="flex-1">
                    <Users className="h-4 w-4 mr-2" />
                    Follow
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button variant="outline">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Info Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="glass border-white/10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              How Rankings Work
            </DialogTitle>
            <DialogDescription>
              Understanding the leaderboard scoring system
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Point System</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Post created</span>
                  <span className="font-semibold text-primary">+10 points</span>
                </div>
                <div className="flex justify-between">
                  <span>Comment posted</span>
                  <span className="font-semibold text-primary">+5 points</span>
                </div>
                <div className="flex justify-between">
                  <span>Like received</span>
                  <span className="font-semibold text-primary">+2 points</span>
                </div>
                <div className="flex justify-between">
                  <span>Share received</span>
                  <span className="font-semibold text-primary">+15 points</span>
                </div>
                <div className="flex justify-between">
                  <span>Contribution merged</span>
                  <span className="font-semibold text-primary">+50 points</span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-2">Achievements</h4>
              <div className="grid grid-cols-2 gap-2">
                {badges.map(badge => (
                  <div key={badge.id} className="glass rounded-lg p-2 text-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{badge.icon}</span>
                      <span className="font-semibold">{badge.name}</span>
                    </div>
                    <p className="text-muted-foreground">{badge.requirement}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-2">Timeframes</h4>
              <p className="text-sm text-muted-foreground">
                Rankings are calculated based on the selected timeframe. Daily, weekly, and monthly
                rankings reset at the beginning of each period. All-time rankings show cumulative scores
                since account creation.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
