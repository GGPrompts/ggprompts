"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ggprompts/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@ggprompts/ui";
import { Badge } from "@ggprompts/ui";
import { Progress } from "@ggprompts/ui";
import { Separator } from "@ggprompts/ui";
import { Button } from "@ggprompts/ui";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ggprompts/ui";
import { Skeleton } from "@ggprompts/ui";
import Link from "next/link";

// Achievement definitions with satirical names and descriptions
const ACHIEVEMENT_DEFINITIONS: Record<
  string,
  { name: string; description: string; icon: string }
> = {
  first_purchase: {
    name: "First Mistake",
    description: "You bought something. Why?",
    icon: "🤦",
  },
  big_spender: {
    name: "Money Burner",
    description: "Set $500 on fire (digitally)",
    icon: "🔥",
  },
  review_king: {
    name: "Professional Complainer",
    description: "Wrote 10 reviews nobody will read",
    icon: "📝",
  },
  early_adopter: {
    name: "Trendy Sheep",
    description: "Joined before it was uncool",
    icon: "🐑",
  },
  collector: {
    name: "Digital Hoarder",
    description: "Owns 10+ useless items",
    icon: "📦",
  },
  loyal_customer: {
    name: "Stockholm Syndrome",
    description: "Keeps coming back despite everything",
    icon: "🔄",
  },
};

// All possible achievements for display
const ALL_ACHIEVEMENTS = [
  "first_purchase",
  "big_spender",
  "review_king",
  "early_adopter",
  "collector",
  "loyal_customer",
];

interface ProfileData {
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    createdAt: string;
  };
  wallet: {
    balance: string;
    lastClaimAt: string | null;
  } | null;
  stats: {
    totalMoneyWasted: string;
    itemsRegretted: number;
    ordersPlaced: number;
    reviewsWritten: number;
    timeWastedHours: number;
    regretLevel: number;
    buyersRemorseScore: number;
    accountAgeDays: number;
  };
  achievements: { type: string; unlockedAt: string }[];
  recentOrders: {
    id: string;
    total: string;
    status: string;
    itemCount: number;
    createdAt: string;
  }[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ProfilePage() {
  const { data: session, isPending: sessionLoading } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionLoading && !session?.user) {
      router.push("/login?redirect=/account/profile");
      return;
    }

    if (session?.user) {
      fetchProfile();
    }
  }, [session, sessionLoading, router]);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/account/profile");
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }
      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (sessionLoading || loading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="glass border-destructive/30 max-w-md">
          <CardContent className="p-8 text-center">
            <div className="text-4xl mb-4">💀</div>
            <h2 className="text-xl font-bold text-destructive mb-2">
              Oops! Something broke.
            </h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchProfile} variant="outline">
              Try Again (we believe in second chances)
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) return null;

  const unlockedAchievements = profile.achievements.map((a) => a.type);
  const memberSince = new Date(profile.user.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <TooltipProvider>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Profile Header */}
            <motion.div variants={itemVariants}>
              <Card className="glass border-primary/30 mb-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                <CardContent className="p-8 relative">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <Avatar className="h-24 w-24 border-2 border-primary/50">
                      <AvatarImage
                        src={profile.user.image || undefined}
                        alt={profile.user.name || "User"}
                      />
                      <AvatarFallback className="text-2xl bg-primary/20">
                        {profile.user.name?.[0]?.toUpperCase() ||
                          profile.user.email[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-center md:text-left">
                      <h1 className="text-3xl font-bold terminal-glow">
                        {profile.user.name || "Anonymous Shopper"}
                      </h1>
                      <p className="text-muted-foreground">
                        {profile.user.email}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Making questionable decisions since {memberSince}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                        <Badge variant="outline" className="border-primary/50">
                          {profile.stats.accountAgeDays} days of regret
                        </Badge>
                        <Badge variant="outline" className="border-primary/50">
                          {unlockedAchievements.length}/{ALL_ACHIEVEMENTS.length}{" "}
                          bad decisions unlocked
                        </Badge>
                      </div>
                    </div>
                    {profile.wallet && (
                      <div className="text-center glass-dark rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-1">
                          UselessBucks Balance
                        </p>
                        <p className="text-3xl font-bold text-primary terminal-glow">
                          ${profile.wallet.balance}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          (Monopoly money, basically)
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Regret Dashboard */}
            <motion.div variants={itemVariants} className="mb-8">
              <h2 className="text-2xl font-bold mb-6 terminal-glow flex items-center gap-2">
                <span>📊</span> Regret Dashboard
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Total Money Wasted"
                  value={`$${profile.stats.totalMoneyWasted}`}
                  subtitle="Could've bought real things"
                  icon="💸"
                  delay={0}
                />
                <StatCard
                  title="Items Regretted"
                  value={profile.stats.itemsRegretted.toString()}
                  subtitle="Each one a tiny betrayal"
                  icon="📦"
                  delay={0.1}
                />
                <StatCard
                  title="Orders Placed"
                  value={profile.stats.ordersPlaced.toString()}
                  subtitle="Opportunities for buyer's remorse"
                  icon="🛒"
                  delay={0.2}
                />
                <StatCard
                  title="Reviews Written"
                  value={profile.stats.reviewsWritten.toString()}
                  subtitle="Cries into the void"
                  icon="✍️"
                  delay={0.3}
                />
                <StatCard
                  title="Time Wasted Browsing"
                  value={`${profile.stats.timeWastedHours}h`}
                  subtitle="You won't get those back"
                  icon="⏰"
                  delay={0.4}
                />
                <StatCard
                  title="Buyer's Remorse Score"
                  value={profile.stats.buyersRemorseScore.toString()}
                  subtitle="Higher is... worse?"
                  icon="😰"
                  delay={0.5}
                />
                <StatCard
                  title="Days Since Joining"
                  value={profile.stats.accountAgeDays.toString()}
                  subtitle="Days you can't take back"
                  icon="📅"
                  delay={0.6}
                />
                <StatCard
                  title="Avg Regret Per Day"
                  value={`$${(
                    parseFloat(profile.stats.totalMoneyWasted) /
                    Math.max(1, profile.stats.accountAgeDays)
                  ).toFixed(2)}`}
                  subtitle="Consistent disappointment"
                  icon="📉"
                  delay={0.7}
                />
              </div>
            </motion.div>

            {/* Regret Level Progress */}
            <motion.div variants={itemVariants}>
              <Card className="glass border-primary/30 mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span>🌡️</span> Overall Regret Level
                  </CardTitle>
                  <CardDescription>
                    A scientific measurement of your purchasing decisions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Mild Disappointment
                      </span>
                      <span className="text-primary font-bold">
                        {profile.stats.regretLevel}%
                      </span>
                      <span className="text-muted-foreground">
                        Existential Crisis
                      </span>
                    </div>
                    <Progress
                      value={profile.stats.regretLevel}
                      className="h-4"
                    />
                    <p className="text-sm text-muted-foreground text-center">
                      {profile.stats.regretLevel < 25
                        ? "You're doing okay. For now."
                        : profile.stats.regretLevel < 50
                          ? "The regret is building. Keep shopping!"
                          : profile.stats.regretLevel < 75
                            ? "You're officially a valued customer of bad decisions."
                            : "Congratulations! You've achieved maximum regret capacity."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Achievements */}
            <motion.div variants={itemVariants} className="mb-8">
              <h2 className="text-2xl font-bold mb-6 terminal-glow flex items-center gap-2">
                <span>🏆</span> Hall of Shame (Achievements)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {ALL_ACHIEVEMENTS.map((achievementType, index) => {
                  const def = ACHIEVEMENT_DEFINITIONS[achievementType];
                  const unlocked = unlockedAchievements.includes(achievementType);
                  const achievement = profile.achievements.find(
                    (a) => a.type === achievementType
                  );

                  return (
                    <motion.div
                      key={achievementType}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Card
                            className={`glass border-primary/20 transition-all cursor-pointer ${
                              unlocked
                                ? "border-primary/50 bg-primary/5"
                                : "opacity-50 grayscale"
                            }`}
                          >
                            <CardContent className="p-6">
                              <div className="flex items-center gap-4">
                                <div
                                  className={`text-4xl p-2 rounded-lg ${
                                    unlocked
                                      ? "bg-primary/20"
                                      : "bg-muted/20"
                                  }`}
                                >
                                  {unlocked ? def.icon : "🔒"}
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-semibold">
                                    {unlocked ? def.name : "???"}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {unlocked
                                      ? def.description
                                      : "Keep making mistakes to unlock"}
                                  </p>
                                  {unlocked && achievement && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Unlocked{" "}
                                      {new Date(
                                        achievement.unlockedAt
                                      ).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                                {unlocked && (
                                  <Badge className="bg-primary/20 text-primary border-primary/30">
                                    Unlocked
                                  </Badge>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {unlocked
                              ? `You earned "${def.name}" - ${def.description}`
                              : "This achievement is still locked. Keep shopping!"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div variants={itemVariants}>
              <Card className="glass border-primary/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <span>📜</span> Recent Regrettable Purchases
                      </CardTitle>
                      <CardDescription>
                        A timeline of your questionable decisions
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/account/orders">View All Orders</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {profile.recentOrders.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-4xl mb-4">🛒</p>
                      <p className="text-muted-foreground">
                        No orders yet. Your wallet is safe... for now.
                      </p>
                      <Button className="mt-4" asChild>
                        <Link href="/products">Start Making Mistakes</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {profile.recentOrders.map((order, index) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-4 rounded-lg glass-dark"
                        >
                          <div>
                            <p className="font-medium">
                              Order #{order.id.slice(-8).toUpperCase()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.itemCount} item
                              {order.itemCount !== 1 ? "s" : ""} of regret
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant={
                                order.status === "delivered"
                                  ? "default"
                                  : "outline"
                              }
                              className={
                                order.status === "delivered"
                                  ? "bg-primary/20 text-primary"
                                  : ""
                              }
                            >
                              {order.status}
                            </Badge>
                            <p className="text-lg font-bold text-primary mt-1">
                              ${order.total}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Footer Disclaimer */}
            <motion.div variants={itemVariants} className="mt-8 text-center">
              <Separator className="mb-8" />
              <p className="text-sm text-muted-foreground">
                All statistics are scientifically calculated using our
                proprietary Regret Algorithm (patent pending).
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                No actual financial advice was harmed in the making of this
                profile page.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  );
}

// Stat Card Component
function StatCard({
  title,
  value,
  subtitle,
  icon,
  delay,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="glass border-primary/20 h-full hover:border-primary/40 transition-colors">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold text-primary terminal-glow mt-1">
                {value}
              </p>
              <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>
            </div>
            <span className="text-2xl">{icon}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Loading Skeleton Component
function ProfileSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Skeleton */}
        <Card className="glass border-primary/30 mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="flex-1 text-center md:text-left space-y-3">
                <Skeleton className="h-8 w-48 mx-auto md:mx-0" />
                <Skeleton className="h-4 w-64 mx-auto md:mx-0" />
                <Skeleton className="h-4 w-40 mx-auto md:mx-0" />
              </div>
              <div className="text-center">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-10 w-40" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="glass border-primary/20">
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-24 mb-3" />
                  <Skeleton className="h-8 w-20 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
