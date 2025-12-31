"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import {
  User,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Eye,
  Shield,
  ShieldOff,
  RefreshCw,
  Crown,
  Skull,
  Trophy,
  Wallet,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@ggprompts/ui";
import { Badge } from "@ggprompts/ui";
import { Button } from "@ggprompts/ui";
import { Input } from "@ggprompts/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ggprompts/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ggprompts/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ggprompts/ui";
import { toast } from "sonner";
import type { UserWithStats } from "./page";

type SortField = "name" | "balance" | "achievementCount" | "createdAt";
type SortDirection = "asc" | "desc";

interface UsersTableProps {
  users: UserWithStats[];
}

// Funny fallback initials based on user position
const funnyInitials = [
  "NPC",
  "???",
  "BOT",
  "IDK",
  "LOL",
  "WUT",
  "MEH",
  "ZZZ",
  "404",
  "N/A",
];

function getInitials(name: string | null, email: string, index: number): string {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  // Use email first letter + funny fallback
  const emailInitial = email[0].toUpperCase();
  return emailInitial + funnyInitials[index % funnyInitials.length][0];
}

export function UsersTable({ users }: UsersTableProps) {
  const [search, setSearch] = useState("");
  const [adminFilter, setAdminFilter] = useState<"all" | "admin" | "user">(
    "all"
  );
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    let result = [...users];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
      );
    }

    // Apply admin filter
    if (adminFilter === "admin") {
      result = result.filter((user) => user.isAdmin);
    } else if (adminFilter === "user") {
      result = result.filter((user) => !user.isAdmin);
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "name":
          comparison = (a.name || a.email).localeCompare(b.name || b.email);
          break;
        case "balance":
          comparison = parseFloat(a.balance) - parseFloat(b.balance);
          break;
        case "achievementCount":
          comparison = a.achievementCount - b.achievementCount;
          break;
        case "createdAt":
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [users, search, adminFilter, sortField, sortDirection]);

  // Toggle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Render sort icon
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4 ml-1" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1" />
    );
  };

  // Action handlers (placeholders)
  const handleViewProfile = (user: UserWithStats) => {
    toast.info(`Viewing profile for ${user.name || user.email}`, {
      description: "Profile view coming soon... maybe... probably not.",
    });
  };

  const handleToggleAdmin = (user: UserWithStats) => {
    const action = user.isAdmin ? "Demoting" : "Promoting";
    const newTitle = user.isAdmin ? "Mere Mortal" : "Supreme Overlord";
    toast.success(`${action} ${user.name || user.email}`, {
      description: `They are now a ${newTitle}. This is totally a real action.`,
    });
  };

  const handleResetBalance = (user: UserWithStats) => {
    toast.warning(`Resetting balance for ${user.name || user.email}`, {
      description:
        "Their Monopoly money has been reset to $1000. The economy is saved!",
    });
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      {/* Filters */}
      <div className="p-4 border-b border-border/20 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 glass border-border/30"
          />
        </div>
        <Select
          value={adminFilter}
          onValueChange={(value: "all" | "admin" | "user") =>
            setAdminFilter(value)
          }
        >
          <SelectTrigger className="w-full sm:w-[180px] glass border-border/30">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Souls</SelectItem>
            <SelectItem value="admin">Supreme Overlords</SelectItem>
            <SelectItem value="user">Mere Mortals</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow className="border-border/20 hover:bg-transparent">
            <TableHead className="w-[50px]">
              <Skull className="h-4 w-4" />
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 data-[state=open]:bg-accent"
                onClick={() => handleSort("name")}
              >
                Identity
                <SortIcon field="name" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 data-[state=open]:bg-accent"
                onClick={() => handleSort("balance")}
              >
                <Wallet className="h-4 w-4 mr-1" />
                Monopoly Money
                <SortIcon field="balance" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 data-[state=open]:bg-accent"
                onClick={() => handleSort("achievementCount")}
              >
                <Trophy className="h-4 w-4 mr-1" />
                Meaningless Badges
                <SortIcon field="achievementCount" />
              </Button>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 data-[state=open]:bg-accent"
                onClick={() => handleSort("createdAt")}
              >
                Joined
                <SortIcon field="createdAt" />
              </Button>
            </TableHead>
            <TableHead className="w-[50px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <User className="h-8 w-8" />
                  <p>No willing participants found</p>
                  <p className="text-xs">
                    They must have realized this was all pointless
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filteredUsers.map((user, index) => (
              <TableRow
                key={user.id}
                className="border-border/20 hover:bg-muted/20"
              >
                {/* Avatar */}
                <TableCell>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.image || ""} alt={user.name || ""} />
                    <AvatarFallback className="bg-secondary/20 text-secondary text-xs">
                      {getInitials(user.name, user.email, index)}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>

                {/* Name/Email */}
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {user.name || "Anonymous Soul"}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </TableCell>

                {/* Balance */}
                <TableCell>
                  <span className="font-mono text-yellow-500">
                    ${parseFloat(user.balance).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </TableCell>

                {/* Achievements */}
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4 text-purple-500" />
                    <span className="font-mono">{user.achievementCount}</span>
                  </div>
                </TableCell>

                {/* Admin Status */}
                <TableCell>
                  {user.isAdmin ? (
                    <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30 hover:bg-yellow-500/30">
                      <Crown className="h-3 w-3 mr-1" />
                      Supreme Overlord
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-muted-foreground border-muted-foreground/30"
                    >
                      <User className="h-3 w-3 mr-1" />
                      Mere Mortal
                    </Badge>
                  )}
                </TableCell>

                {/* Joined Date */}
                <TableCell className="text-muted-foreground">
                  {formatDate(user.createdAt)}
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>
                        Actions of Futility
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleViewProfile(user)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleAdmin(user)}>
                        {user.isAdmin ? (
                          <>
                            <ShieldOff className="h-4 w-4 mr-2" />
                            Demote to Mortal
                          </>
                        ) : (
                          <>
                            <Shield className="h-4 w-4 mr-2" />
                            Promote to Overlord
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleResetBalance(user)}
                        className="text-yellow-500 focus:text-yellow-500"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reset Monopoly Money
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Footer */}
      <div className="p-4 border-t border-border/20 text-sm text-muted-foreground">
        Showing {filteredUsers.length} of {users.length} willing participants
      </div>
    </div>
  );
}
