"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Clock,
  TrendingUp,
  Sparkles,
  AlertTriangle,
  ShoppingBag,
  Loader2,
  Flame,
  Star,
  Filter,
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@ggprompts/ui";
import { Badge } from "@ggprompts/ui";
import { Progress } from "@ggprompts/ui";
import { Separator } from "@ggprompts/ui";
import { Button } from "@ggprompts/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ggprompts/ui";
import { cn } from "@ggprompts/ui";
import { useSession } from "@/lib/auth-client";

// Gamification imports
import {
  ACHIEVEMENT_DEFINITIONS,
  ACHIEVEMENT_CATEGORIES,
  getAchievementsByCategory,
  type AchievementType,
  type AchievementCategory,
} from "@/lib/gamification/achievements";
import { getLevelInfo, LEVEL_NAMES } from "@/lib/gamification/levels";
import { AchievementBadge } from "@/components/gamification/AchievementBadge";
import { DailyClaimCard } from "@/components/gamification/DailyClaimCard";
import { StreakMilestones } from "@/components/gamification/StreakMilestones";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { XpProgressBar } from "@/components/gamification/XpProgressBar";

// Mock user data - in production would come from API
interface UserAchievement {
  achievementType: AchievementType;
  unlockedAt: string;
}

interface UserStats {
  totalSpent: number;
  hoursBrowsing: number;
  itemsViewed: number;
  cartAbandoned: number;
  reviewsWritten: number;
  totalXp: number;
  currentStreak: number;
}

// Mock data for demonstration
const mockUserAchievements: UserAchievement[] = [
  { achievementType: "first_purchase", unlockedAt: "2024-01-15T10:30:00Z" },
  { achievementType: "big_spender", unlockedAt: "2024-02-20T14:22:00Z" },
  { achievementType: "review_king", unlockedAt: "2024-03-10T09:15:00Z" },
  { achievementType: "early_adopter", unlockedAt: "2024-01-02T11:00:00Z" },
  { achievementType: "commitment_issues", unlockedAt: "2024-01-05T16:45:00Z" },
  { achievementType: "window_shopper", unlockedAt: "2024-02-15T12:00:00Z" },
  { achievementType: "midnight_shopper", unlockedAt: "2024-03-01T03:22:00Z" },
];

const mockProgress: Record<string, { current: number; target: number }> = {
  collector: { current: 14, target: 20 },
  loyal_customer: { current: 2, target: 3 },
  whale_watcher: { current: 2847, target: 10000 },
  completionist: { current: 7, target: 20 },
  review_novelist: { current: 342, target: 500 },
  social_butterfly: { current: 1, target: 3 },
  bargain_hunter: { current: 3, target: 5 },
  serial_returner: { current: 2, target: 5 },
};

const mockStats: UserStats = {
  totalSpent: 2847.93,
  hoursBrowsing: 42,
  itemsViewed: 312,
  cartAbandoned: 7,
  reviewsWritten: 12,
  totalXp: 1850,
  currentStreak: 12,
};

const mockWallet = {
  balance: "1523.45",
  lastClaimAt: null as Date | null,
  streak: 12,
};

export default function AchievementsPage() {
  const { data: session, isPending: sessionLoading } = useSession();
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | "all">("all");
  const [wallet, setWallet] = useState(mockWallet);

  // Simulate loading user achievements
  useEffect(() => {
    const loadAchievements = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setUserAchievements(mockUserAchievements);
      setLoading(false);
    };

    if (session?.user) {
      loadAchievements();
    } else if (!sessionLoading) {
      setLoading(false);
    }
  }, [session, sessionLoading]);

  // Calculate level info
  const levelInfo = useMemo(() => getLevelInfo(mockStats.totalXp), []);

  // Calculate stats
  const stats = useMemo(() => {
    const unlockedCount = userAchievements.length;
    const totalCount = Object.keys(ACHIEVEMENT_DEFINITIONS).length;
    const regretLevel = Math.min(100, Math.round((mockStats.totalSpent / 10000) * 100));

    return {
      unlockedCount,
      totalCount,
      totalSpent: mockStats.totalSpent,
      regretLevel,
      hoursBrowsing: mockStats.hoursBrowsing,
      itemsViewed: mockStats.itemsViewed,
      cartAbandoned: mockStats.cartAbandoned,
      totalXp: mockStats.totalXp,
    };
  }, [userAchievements]);

  // Filter achievements by category
  const filteredAchievements = useMemo(() => {
    const allAchievements = Object.values(ACHIEVEMENT_DEFINITIONS);
    if (selectedCategory === "all") {
      return allAchievements;
    }
    return getAchievementsByCategory(selectedCategory);
  }, [selectedCategory]);

  // Separate unlocked and locked achievements
  const unlockedTypes = useMemo(
    () => new Set(userAchievements.map((a) => a.achievementType)),
    [userAchievements]
  );

  // Handle daily claim
  const handleDailyClaim = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const amount = 15 * (mockStats.currentStreak >= 7 ? 2 : 1);
    setWallet((prev) => ({
      ...prev,
      balance: (parseFloat(prev.balance) + amount).toFixed(2),
      lastClaimAt: new Date(),
      streak: prev.streak + 1,
    }));
    return {
      success: true,
      amount,
      newStreak: wallet.streak + 1,
      message: "Keep the streak alive!",
    };
  };

  // Loading state
  if (sessionLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="glass-overlay rounded-2xl p-12 text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading your questionable accomplishments...</p>
        </div>
      </div>
    );
  }

  // Empty state (no achievements at all)
  if (userAchievements.length === 0 && !loading) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <Trophy className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-primary terminal-glow">Your Achievements</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-overlay">
            <CardContent className="p-12 text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/20 flex items-center justify-center">
                <AlertTriangle className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">
                You haven&apos;t made any questionable decisions yet
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                How responsible of you. But don&apos;t worry, we have plenty of useless items waiting to help you unlock achievements.
              </p>
              <Button asChild className="border-glow">
                <Link href="/products">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Start Making Bad Choices
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-3">
          <Trophy className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-primary terminal-glow">Your Achievements</h1>
        </div>
        <p className="text-muted-foreground">
          A monument to your poor financial decisions and questionable taste
        </p>
      </motion.div>

      {/* Top Row: Level + Daily Claim + Streak */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Level & XP Card */}
        <Card className="glass-overlay border-primary/30 lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Your Level
              </CardTitle>
              <LevelBadge level={levelInfo.level} title={levelInfo.title} size="md" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-2">
              <p className="text-2xl font-bold text-primary terminal-glow">{levelInfo.title}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {levelInfo.level < 100 ? `Next: ${levelInfo.nextTitle}` : "Maximum uselessness achieved!"}
              </p>
            </div>
            <XpProgressBar
              currentXp={levelInfo.currentLevelXp}
              xpToNextLevel={levelInfo.xpToNextLevel}
              level={levelInfo.level}
              title={levelInfo.title}
              nextTitle={levelInfo.nextTitle}
            />
            <div className="text-center text-xs text-muted-foreground">
              Total XP: {stats.totalXp.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        {/* Daily Claim Card */}
        <div className="lg:col-span-1">
          <DailyClaimCard wallet={wallet} onClaim={handleDailyClaim} />
        </div>

        {/* Streak Milestones */}
        <div className="lg:col-span-1">
          <StreakMilestones currentStreak={mockStats.currentStreak} />
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {/* Achievements Unlocked */}
        <Card className="glass border-glow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Unlocked</p>
                <p className="text-xl font-bold">
                  <span className="text-primary terminal-glow">{stats.unlockedCount}</span>
                  <span className="text-muted-foreground">/{stats.totalCount}</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Spent */}
        <Card className="glass border-glow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/20">
                <TrendingUp className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">UselessBucks Spent</p>
                <p className="text-xl font-bold text-primary terminal-glow">
                  ${stats.totalSpent.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Streak */}
        <Card className="glass border-glow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/20">
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Current Streak</p>
                <p className="text-xl font-bold text-orange-500">
                  {mockStats.currentStreak} days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Regret Level */}
        <Card className="glass border-glow">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-yellow-500/20">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  </div>
                  <span className="text-xs text-muted-foreground">Regret Level</span>
                </div>
                <span className="text-sm font-bold text-yellow-500">{stats.regretLevel}%</span>
              </div>
              <Progress value={stats.regretLevel} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Fun Stats Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glass-dark border-primary/30">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center justify-center gap-6 text-center text-sm">
              <div>
                <p className="text-2xl font-bold text-primary">{stats.itemsViewed}</p>
                <p className="text-muted-foreground text-xs">Items Viewed</p>
              </div>
              <Separator orientation="vertical" className="h-10 hidden sm:block" />
              <div>
                <p className="text-2xl font-bold text-yellow-500">{stats.cartAbandoned}</p>
                <p className="text-muted-foreground text-xs">Carts Abandoned</p>
              </div>
              <Separator orientation="vertical" className="h-10 hidden sm:block" />
              <div>
                <p className="text-2xl font-bold text-cyan-500">{stats.hoursBrowsing}h</p>
                <p className="text-muted-foreground text-xs">Hours Browsing</p>
              </div>
              <Separator orientation="vertical" className="h-10 hidden sm:block" />
              <div>
                <p className="text-2xl font-bold text-purple-500">
                  {Math.round((stats.unlockedCount / stats.totalCount) * 100)}%
                </p>
                <p className="text-muted-foreground text-xs">Completionist</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Achievement Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            All Achievements
          </h2>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filter by:</span>
          </div>
        </div>

        <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as AchievementCategory | "all")}>
          <TabsList className="glass w-full flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="all" className="flex-1">
              All ({Object.keys(ACHIEVEMENT_DEFINITIONS).length})
            </TabsTrigger>
            {(Object.keys(ACHIEVEMENT_CATEGORIES) as AchievementCategory[]).map((cat) => (
              <TabsTrigger key={cat} value={cat} className="flex-1">
                {ACHIEVEMENT_CATEGORIES[cat].emoji} {ACHIEVEMENT_CATEGORIES[cat].label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredAchievements.map((achievement, index) => {
                  const isUnlocked = unlockedTypes.has(achievement.id);
                  const userAchievement = userAchievements.find(
                    (a) => a.achievementType === achievement.id
                  );
                  const progress = mockProgress[achievement.id];

                  return (
                    <motion.div
                      key={achievement.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <AchievementBadge
                        achievement={achievement}
                        unlocked={isUnlocked}
                        unlockedAt={userAchievement ? new Date(userAchievement.unlockedAt) : undefined}
                        size="lg"
                        showProgress={!isUnlocked && !!progress}
                        progress={progress}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Footer Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center py-6"
      >
        <p className="text-sm text-muted-foreground italic">
          &quot;Every achievement is a testament to your commitment to meaningless consumption.&quot;
        </p>
        <p className="text-xs text-muted-foreground/50 mt-1">
          - The Useless.io Team (who are very proud of you)
        </p>
      </motion.div>
    </div>
  );
}
