'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Grid3x3, List, MapPin, Briefcase, Code, Star,
  UserPlus, MessageCircle, Mail, Github, Linkedin, Twitter, Globe,
  ChevronDown, ChevronUp, Calendar, Award, TrendingUp, Users, Heart,
  Eye, CheckCircle2, X, Settings, Download, Share2, Verified, Clock,
  Zap, Trophy, Flame, Target, Coffee, Sparkles, ArrowUpDown, Filter as FilterIcon,
  Building, GraduationCap, Bookmark, ExternalLink, MoreVertical, Bell, Hash
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';

// Generate comprehensive user data
const roles = [
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'DevOps Engineer',
  'UI/UX Designer',
  'Product Manager',
  'Data Scientist',
  'Mobile Developer',
  'Tech Lead',
  'Engineering Manager',
];

const locations = [
  'San Francisco, CA',
  'New York, NY',
  'Austin, TX',
  'Seattle, WA',
  'Boston, MA',
  'Remote',
  'London, UK',
  'Berlin, Germany',
  'Toronto, Canada',
  'Singapore',
];

const companies = [
  'Google',
  'Meta',
  'Amazon',
  'Microsoft',
  'Apple',
  'Netflix',
  'Stripe',
  'Airbnb',
  'Vercel',
  'Shopify',
];

const skillsList = [
  'React', 'TypeScript', 'Node.js', 'Python', 'Go', 'Rust', 'Java',
  'Docker', 'Kubernetes', 'AWS', 'GraphQL', 'PostgreSQL', 'MongoDB',
  'Next.js', 'Vue.js', 'Angular', 'TailwindCSS', 'Figma', 'Swift',
];

const generateUsers = () => {
  const firstNames = ['Alex', 'Sarah', 'Jordan', 'Maya', 'Taylor', 'Casey', 'Morgan', 'Riley', 'Avery', 'Quinn',
    'Jamie', 'Cameron', 'Dakota', 'Skyler', 'Parker', 'Reese', 'Emerson', 'Charlie', 'Drew', 'Blake',
    'Sam', 'Chris', 'Jessie', 'Frankie', 'Hayden', 'Kendall', 'Logan', 'Peyton', 'River', 'Sydney'];
  const lastNames = ['Chen', 'Patel', 'Kim', 'Garcia', 'Rodriguez', 'Lee', 'Wilson', 'Martinez', 'Anderson', 'Taylor',
    'Thomas', 'Moore', 'Jackson', 'Martin', 'Thompson', 'White', 'Lopez', 'Gonzalez', 'Harris', 'Clark',
    'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen'];

  return Array.from({ length: 35 }, (_, i) => {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const username = `@${firstName.toLowerCase()}${lastName.toLowerCase()}`;
    const role = roles[Math.floor(Math.random() * roles.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    const userSkills = Array.from(
      { length: Math.floor(Math.random() * 6) + 3 },
      () => skillsList[Math.floor(Math.random() * skillsList.length)]
    ).filter((v, i, a) => a.indexOf(v) === i);

    const joinDate = new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28));

    return {
      id: i + 1,
      name,
      username,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      role,
      company,
      location,
      bio: `Passionate ${role.toLowerCase()} with ${Math.floor(Math.random() * 10) + 1}+ years of experience. Love building scalable applications and mentoring developers.`,
      skills: userSkills,
      followers: Math.floor(Math.random() * 10000),
      following: Math.floor(Math.random() * 1000),
      posts: Math.floor(Math.random() * 500),
      projects: Math.floor(Math.random() * 50),
      contributions: Math.floor(Math.random() * 5000),
      joinDate,
      verified: Math.random() > 0.7,
      online: Math.random() > 0.6,
      featured: i < 6,
      level: Math.floor(Math.random() * 20) + 1,
      streak: Math.floor(Math.random() * 100),
      badges: Math.floor(Math.random() * 10),
      social: {
        github: Math.random() > 0.5 ? username.slice(1) : null,
        linkedin: Math.random() > 0.5 ? username.slice(1) : null,
        twitter: Math.random() > 0.5 ? username.slice(1) : null,
        website: Math.random() > 0.5 ? `https://${firstName.toLowerCase()}.dev` : null,
      },
    };
  });
};

type SortOption = 'name' | 'joinDate' | 'followers' | 'contributions';
type ViewMode = 'grid' | 'list';

export default function UserDirectoryTemplate() {
  const [users] = useState(generateUsers());
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [followedUsers, setFollowedUsers] = useState<number[]>([]);
  const itemsPerPage = 12;

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter((user) => {
      // Search filter
      const matchesSearch = searchQuery === '' ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

      // Role filter
      const matchesRole = selectedRole === 'all' || user.role === selectedRole;

      // Location filter
      const matchesLocation = selectedLocation === 'all' || user.location === selectedLocation;

      // Skills filter
      const matchesSkills = selectedSkills.length === 0 ||
        selectedSkills.every(skill => user.skills.includes(skill));

      // Online filter
      const matchesOnline = !showOnlineOnly || user.online;

      // Verified filter
      const matchesVerified = !showVerifiedOnly || user.verified;

      return matchesSearch && matchesRole && matchesLocation && matchesSkills && matchesOnline && matchesVerified;
    });

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'joinDate':
          comparison = a.joinDate.getTime() - b.joinDate.getTime();
          break;
        case 'followers':
          comparison = a.followers - b.followers;
          break;
        case 'contributions':
          comparison = a.contributions - b.contributions;
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [users, searchQuery, selectedRole, selectedLocation, selectedSkills, showOnlineOnly, showVerifiedOnly, sortBy, sortDirection]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedUsers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);

  const featuredUsers = users.filter(u => u.featured);

  const handleFollow = (userId: number) => {
    setFollowedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleUserClick = (user: typeof users[0]) => {
    setSelectedUser(user);
    setUserDialogOpen(true);
  };

  const toggleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortDirection('asc');
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedRole('all');
    setSelectedLocation('all');
    setSelectedSkills([]);
    setShowOnlineOnly(false);
    setShowVerifiedOnly(false);
  };

  const hasActiveFilters = searchQuery !== '' || selectedRole !== 'all' ||
    selectedLocation !== 'all' || selectedSkills.length > 0 ||
    showOnlineOnly || showVerifiedOnly;

  return (
    <div className="min-h-screen text-foreground p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="glass border-white/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl terminal-glow font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">User Directory</CardTitle>
                <CardDescription className="mt-2">
                  Discover and connect with {users.length} talented developers
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="border-primary/30">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button className="bg-primary hover:bg-primary/90">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Users
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Featured Users */}
        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" />
              Featured Members
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            {/* Left fade indicator */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />

            {/* Right fade indicator */}
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-4 pb-4">
                {featuredUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex-shrink-0 w-64"
                  >
                    <Card
                      className="glass border-white/10 hover:border-primary/30 transition-all cursor-pointer h-full"
                      onClick={() => handleUserClick(user)}
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center text-center">
                          <div className="relative mb-3">
                            <Avatar className="h-16 w-16 border-2 border-primary/30">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>{user.name[0]}</AvatarFallback>
                            </Avatar>
                            {user.online && (
                              <div className="absolute bottom-0 right-0 h-4 w-4 bg-green-400 rounded-full border-2 border-background" />
                            )}
                          </div>
                          <div className="flex items-center gap-1 mb-1">
                            <h3 className="font-semibold">{user.name}</h3>
                            {user.verified && (
                              <Verified className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{user.role}</p>
                          <div className="flex gap-2 mb-3">
                            <Badge variant="outline" className="text-xs">
                              <Trophy className="h-3 w-3 mr-1" />
                              Level {user.level}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <Flame className="h-3 w-3 mr-1" />
                              {user.streak}
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            className="w-full"
                            variant={followedUsers.includes(user.id) ? 'outline' : 'default'}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFollow(user.id);
                            }}
                          >
                            {followedUsers.includes(user.id) ? (
                              <>
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Following
                              </>
                            ) : (
                              <>
                                <UserPlus className="h-4 w-4 mr-2" />
                                Follow
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="h-3" />
            </ScrollArea>

            {/* Hint text */}
            <p className="text-xs text-muted-foreground text-center mt-2">
              ← Scroll to view more members →
            </p>
          </CardContent>
        </Card>

        {/* Filters and Search */}
        <Card className="glass border-white/10">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, skills, or bio..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-transparent border-white/10"
                  />
                </div>
              </div>

              {/* Role Filter */}
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-full lg:w-[200px] bg-transparent border-white/10">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent className="glass border-white/10">
                  <SelectItem value="all">All Roles</SelectItem>
                  {roles.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Location Filter */}
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-full lg:w-[200px] bg-transparent border-white/10">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent className="glass border-white/10">
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* More Filters */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-white/10">
                    <FilterIcon className="h-4 w-4 mr-2" />
                    Filters
                    {hasActiveFilters && (
                      <Badge variant="default" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                        !
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="glass border-white/10 w-56">
                  <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={showOnlineOnly}
                    onCheckedChange={setShowOnlineOnly}
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-green-400 rounded-full" />
                      Online Only
                    </div>
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={showVerifiedOnly}
                    onCheckedChange={setShowVerifiedOnly}
                  >
                    <Verified className="h-4 w-4 mr-2" />
                    Verified Only
                  </DropdownMenuCheckboxItem>
                  {hasActiveFilters && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={clearFilters}>
                        <X className="h-4 w-4 mr-2" />
                        Clear All Filters
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* View Mode Toggle */}
              <div className="flex gap-1 glass rounded-lg p-1 border border-white/10">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Skills Filter */}
            {selectedSkills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedSkills.map(skill => (
                  <Badge
                    key={skill}
                    variant="default"
                    className="cursor-pointer"
                    onClick={() => setSelectedSkills(prev => prev.filter(s => s !== skill))}
                  >
                    {skill}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{paginatedUsers.length}</span> of{' '}
            <span className="font-semibold text-foreground">{filteredAndSortedUsers.length}</span> users
          </p>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-white/10">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Sort by: {sortBy}
                  {sortDirection === 'desc' && <ChevronDown className="h-4 w-4 ml-2" />}
                  {sortDirection === 'asc' && <ChevronUp className="h-4 w-4 ml-2" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass border-white/10">
                <DropdownMenuItem onClick={() => toggleSort('name')}>
                  Name {sortBy === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleSort('joinDate')}>
                  Join Date {sortBy === 'joinDate' && (sortDirection === 'asc' ? '↑' : '↓')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleSort('followers')}>
                  Followers {sortBy === 'followers' && (sortDirection === 'asc' ? '↑' : '↓')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleSort('contributions')}>
                  Contributions {sortBy === 'contributions' && (sortDirection === 'asc' ? '↑' : '↓')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Users Grid/List */}
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {paginatedUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className="glass border-white/10 hover:border-primary/30 transition-all cursor-pointer h-full"
                    onClick={() => handleUserClick(user)}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center text-center">
                        {/* Avatar */}
                        <div className="relative mb-3">
                          <Avatar className="h-20 w-20">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          {user.online && (
                            <div className="absolute bottom-0 right-0 h-4 w-4 bg-green-400 rounded-full border-2 border-background" />
                          )}
                        </div>

                        {/* Name and Role */}
                        <div className="flex items-center gap-1 mb-1">
                          <h3 className="font-semibold truncate">{user.name}</h3>
                          {user.verified && (
                            <Verified className="h-4 w-4 text-primary flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{user.role}</p>
                        <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {user.location}
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-2 w-full mb-3 text-xs">
                          <div>
                            <div className="font-bold text-primary">{user.followers > 999 ? `${(user.followers / 1000).toFixed(1)}k` : user.followers}</div>
                            <div className="text-muted-foreground">Followers</div>
                          </div>
                          <div>
                            <div className="font-bold text-secondary">{user.posts}</div>
                            <div className="text-muted-foreground">Posts</div>
                          </div>
                          <div>
                            <div className="font-bold text-blue-400">{user.projects}</div>
                            <div className="text-muted-foreground">Projects</div>
                          </div>
                        </div>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-1 mb-3 justify-center">
                          {user.skills.slice(0, 3).map(skill => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {user.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{user.skills.length - 3}
                            </Badge>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 w-full">
                          <Button
                            size="sm"
                            className="flex-1"
                            variant={followedUsers.includes(user.id) ? 'outline' : 'default'}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFollow(user.id);
                            }}
                          >
                            {followedUsers.includes(user.id) ? 'Following' : 'Follow'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {paginatedUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className="glass border-white/10 hover:border-primary/30 transition-all cursor-pointer"
                    onClick={() => handleUserClick(user)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          {user.online && (
                            <div className="absolute bottom-0 right-0 h-4 w-4 bg-green-400 rounded-full border-2 border-background" />
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold truncate">{user.name}</h3>
                            {user.verified && (
                              <Verified className="h-4 w-4 text-primary flex-shrink-0" />
                            )}
                            <span className="text-sm text-muted-foreground truncate">{user.username}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-3 w-3" />
                              {user.role}
                            </span>
                            <span className="flex items-center gap-1">
                              <Building className="h-3 w-3" />
                              {user.company}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {user.location}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {user.skills.slice(0, 5).map(skill => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {user.skills.length > 5 && (
                              <Badge variant="outline" className="text-xs">
                                +{user.skills.length - 5} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="hidden lg:flex items-center gap-6 text-sm">
                          <div className="text-center">
                            <div className="font-bold text-primary">
                              {user.followers > 999 ? `${(user.followers / 1000).toFixed(1)}k` : user.followers}
                            </div>
                            <div className="text-xs text-muted-foreground">Followers</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-secondary">{user.posts}</div>
                            <div className="text-xs text-muted-foreground">Posts</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-blue-400">{user.contributions}</div>
                            <div className="text-xs text-muted-foreground">Contributions</div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 flex-shrink-0">
                          <Button
                            size="sm"
                            variant={followedUsers.includes(user.id) ? 'outline' : 'default'}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFollow(user.id);
                            }}
                          >
                            {followedUsers.includes(user.id) ? (
                              <>
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Following
                              </>
                            ) : (
                              <>
                                <UserPlus className="h-4 w-4 mr-2" />
                                Follow
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              Previous
            </Button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum = i + 1;
                if (totalPages > 5 && currentPage > 3) {
                  pageNum = currentPage - 2 + i;
                  if (pageNum > totalPages) pageNum = totalPages - 4 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'default' : 'outline'}
                    size="sm"
                    className="w-10"
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* User Detail Dialog */}
      <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
        <DialogContent className="glass-overlay border-white/10 max-w-2xl">
          {selectedUser && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                      <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
                    </Avatar>
                    {selectedUser.online && (
                      <div className="absolute bottom-0 right-0 h-5 w-5 bg-green-400 rounded-full border-2 border-background" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <DialogTitle>{selectedUser.name}</DialogTitle>
                      {selectedUser.verified && (
                        <Verified className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedUser.username}</p>
                    <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        {selectedUser.role}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        {selectedUser.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {selectedUser.location}
                      </span>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {/* Bio */}
                <p className="text-muted-foreground">{selectedUser.bio}</p>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="glass rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-primary">
                      {selectedUser.followers > 999
                        ? `${(selectedUser.followers / 1000).toFixed(1)}k`
                        : selectedUser.followers}
                    </div>
                    <div className="text-xs text-muted-foreground">Followers</div>
                  </div>
                  <div className="glass rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-secondary">{selectedUser.posts}</div>
                    <div className="text-xs text-muted-foreground">Posts</div>
                  </div>
                  <div className="glass rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-blue-400">{selectedUser.projects}</div>
                    <div className="text-xs text-muted-foreground">Projects</div>
                  </div>
                  <div className="glass rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-purple-400">{selectedUser.contributions}</div>
                    <div className="text-xs text-muted-foreground">Contributions</div>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.skills.map(skill => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Links
                  </h4>
                  <div className="flex gap-2">
                    {selectedUser.social.github && (
                      <Button variant="outline" size="sm">
                        <Github className="h-4 w-4 mr-2" />
                        GitHub
                      </Button>
                    )}
                    {selectedUser.social.linkedin && (
                      <Button variant="outline" size="sm">
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </Button>
                    )}
                    {selectedUser.social.twitter && (
                      <Button variant="outline" size="sm">
                        <Twitter className="h-4 w-4 mr-2" />
                        Twitter
                      </Button>
                    )}
                    {selectedUser.social.website && (
                      <Button variant="outline" size="sm">
                        <Globe className="h-4 w-4 mr-2" />
                        Website
                      </Button>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-white/10">
                  <Button
                    className="flex-1"
                    variant={followedUsers.includes(selectedUser.id) ? 'outline' : 'default'}
                    onClick={() => handleFollow(selectedUser.id)}
                  >
                    {followedUsers.includes(selectedUser.id) ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Follow
                      </>
                    )}
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button variant="outline">
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
