import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { users, wallets, userAchievements } from "@/lib/db/schema";
import { eq, desc, count } from "drizzle-orm";
import { Users, Wallet, Trophy } from "lucide-react";
import { UsersTable } from "./UsersTable";

// Type for the user data we'll pass to the client component
export type UserWithStats = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  isAdmin: boolean;
  createdAt: Date;
  balance: string;
  achievementCount: number;
};

export default async function AdminUsersPage() {
  // Verify admin access
  await requireAdmin();

  // Fetch users with their wallet balances and achievement counts
  const usersWithWallets = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      image: users.image,
      isAdmin: users.isAdmin,
      createdAt: users.createdAt,
      balance: wallets.balance,
    })
    .from(users)
    .leftJoin(wallets, eq(users.id, wallets.userId))
    .orderBy(desc(users.createdAt));

  // Fetch achievement counts per user
  const achievementCounts = await db
    .select({
      userId: userAchievements.userId,
      count: count(userAchievements.id),
    })
    .from(userAchievements)
    .groupBy(userAchievements.userId);

  // Create a map of user ID to achievement count
  const achievementMap = new Map(
    achievementCounts.map((a) => [a.userId, a.count])
  );

  // Combine the data
  const usersData: UserWithStats[] = usersWithWallets.map((user) => ({
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    isAdmin: user.isAdmin,
    createdAt: user.createdAt,
    balance: user.balance || "0.00",
    achievementCount: achievementMap.get(user.id) || 0,
  }));

  // Calculate stats
  const totalUsers = usersData.length;
  const totalUselessBucks = usersData.reduce(
    (sum, user) => sum + parseFloat(user.balance),
    0
  );
  const totalAchievements = usersData.reduce(
    (sum, user) => sum + user.achievementCount,
    0
  );
  const avgAchievements =
    totalUsers > 0 ? (totalAchievements / totalUsers).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold terminal-glow">User Management</h1>
        <p className="text-muted-foreground mt-1">
          Oversee the willing participants in our grand experiment
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Users */}
        <div className="glass border border-border/20 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Willing Participants
              </p>
              <p className="text-2xl font-bold">{totalUsers.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground/70">
                All consented to the madness
              </p>
            </div>
          </div>
        </div>

        {/* Total UselessBucks */}
        <div className="glass border border-border/20 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-yellow-500/10">
              <Wallet className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Monopoly Money in Circulation
              </p>
              <p className="text-2xl font-bold text-yellow-500">
                ${totalUselessBucks.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-muted-foreground/70">
                Worth exactly nothing
              </p>
            </div>
          </div>
        </div>

        {/* Average Achievements */}
        <div className="glass border border-border/20 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-purple-500/10">
              <Trophy className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Avg Meaningless Badges
              </p>
              <p className="text-2xl font-bold text-purple-500">
                {avgAchievements}
              </p>
              <p className="text-xs text-muted-foreground/70">
                Per deluded soul
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass border border-border/20 rounded-lg">
        <UsersTable users={usersData} />
      </div>
    </div>
  );
}
