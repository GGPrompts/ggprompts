'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, MessageCircle, Share2, Bookmark, MoreVertical, Image as ImageIcon,
  Link2, BarChart3, Send, X, Check, TrendingUp, Users, Hash, Sparkles,
  Globe, Lock, UserPlus, Filter, ChevronDown, Verified, Smile, Camera,
  Video, MapPin, Calendar, Repeat2, Eye, Award, Flame, Clock, Search,
  AlertCircle, CheckCircle2, Info, Star, ArrowUp, ArrowDown, Bell, Settings
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

// Mock user data
const currentUser = {
  id: 0,
  name: 'You',
  username: '@yourusername',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
  verified: true,
};

// Generate mock posts
const generatePosts = () => {
  const users = [
    { id: 1, name: 'Sarah Chen', username: '@sarahchen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', verified: true },
    { id: 2, name: 'Alex Rivera', username: '@alexrivera', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', verified: false },
    { id: 3, name: 'Maya Patel', username: '@mayapatel', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya', verified: true },
    { id: 4, name: 'Jordan Lee', username: '@jordanlee', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan', verified: false },
    { id: 5, name: 'Taylor Swift', username: '@taylorswift', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor', verified: true },
    { id: 6, name: 'Chris Evans', username: '@chrisevans', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chris', verified: true },
    { id: 7, name: 'Emma Watson', username: '@emmawatson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma', verified: true },
    { id: 8, name: 'Ryan Reynolds', username: '@ryanreynolds', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ryan', verified: false },
    { id: 9, name: 'Zendaya', username: '@zendaya', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zendaya', verified: true },
    { id: 10, name: 'Tom Holland', username: '@tomholland', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom', verified: false },
  ];

  const postTypes = ['text', 'image', 'link', 'poll'];
  const topics = ['#webdev', '#design', '#ai', '#tech', '#coding', '#startup', '#productivity', '#react', '#nextjs', '#typescript'];
  const contents = [
    'Just shipped a new feature! The team worked incredibly hard on this. Check it out!',
    'Hot take: TypeScript is not just JavaScript with types. It fundamentally changes how you think about code architecture.',
    'Anyone else spending their weekend debugging CSS grid? Just me? 😅',
    'Building in public is terrifying but also incredibly rewarding. Here\'s what I learned...',
    'The best code is code you don\'t have to write. Simplicity wins every time.',
    'Reminder: Your imposter syndrome is lying to you. You belong here.',
    'Just had the most productive coding session. Sometimes you just need to step away and come back fresh.',
    'Shoutout to everyone who answers questions on Stack Overflow. You\'re the real MVPs.',
    'New blog post: "10 Things I Wish I Knew Before Learning React" - Link in bio!',
    'Coffee count today: 4. Bug count fixed: 1. Worth it? Absolutely.',
    'The terminal aesthetic is making a comeback and I\'m here for it 🖥️✨',
    'Pro tip: Write documentation like you\'re explaining it to yourself 6 months from now.',
    'Just discovered this amazing open source project. The community is incredible!',
    'Why does every project start with "this will be quick" and end with "what have I done"?',
    'Celebrating 1 year at my dream job! Grateful for this amazing team 🎉',
    'The difference between junior and senior developers? Seniors know when NOT to code.',
    'Accessibility isn\'t a feature, it\'s a requirement. Period.',
    'Fell into a rabbit hole of tech docs and emerged 3 hours later with more questions.',
    'Sometimes the best solution is to turn it off and on again. Still works in 2024.',
    'Working on something exciting. Can\'t share details yet but 👀',
  ];

  return Array.from({ length: 25 }, (_, i) => {
    const user = users[Math.floor(Math.random() * users.length)];
    const type = postTypes[Math.floor(Math.random() * postTypes.length)];
    const content = contents[Math.floor(Math.random() * contents.length)];
    const timeOptions = ['2m', '15m', '1h', '3h', '5h', '8h', '12h', '1d', '2d', '3d'];

    return {
      id: i + 1,
      user,
      content,
      type,
      timestamp: timeOptions[Math.floor(Math.random() * timeOptions.length)],
      likes: Math.floor(Math.random() * 1000),
      comments: Math.floor(Math.random() * 200),
      shares: Math.floor(Math.random() * 100),
      bookmarked: Math.random() > 0.7,
      liked: Math.random() > 0.6,
      image: type === 'image' ? `/api/placeholder/600/400` : null,
      link: type === 'link' ? {
        url: 'https://example.com/article',
        title: 'How to Build Better Software in 2024',
        description: 'A comprehensive guide to modern development practices and tools.',
        thumbnail: '/api/placeholder/400/200',
      } : null,
      poll: type === 'poll' ? {
        question: 'What\'s your favorite programming language?',
        options: [
          { id: 1, text: 'JavaScript/TypeScript', votes: 245, percentage: 45 },
          { id: 2, text: 'Python', votes: 178, percentage: 33 },
          { id: 3, text: 'Go', votes: 67, percentage: 12 },
          { id: 4, text: 'Rust', votes: 54, percentage: 10 },
        ],
        totalVotes: 544,
        votedOption: Math.random() > 0.5 ? 1 : null,
      } : null,
      topics: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () =>
        topics[Math.floor(Math.random() * topics.length)]
      ),
    };
  });
};

const trendingTopics = [
  { tag: '#WebDev', posts: '125K', trend: 'up' },
  { tag: '#AI', posts: '89K', trend: 'up' },
  { tag: '#NextJS', posts: '67K', trend: 'up' },
  { tag: '#TypeScript', posts: '54K', trend: 'down' },
  { tag: '#React', posts: '203K', trend: 'up' },
];

const whoToFollow = [
  { id: 11, name: 'Dan Abramov', username: '@dan_abramov', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dan', verified: true, bio: 'Working on React' },
  { id: 12, name: 'Kent C. Dodds', username: '@kentcdodds', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kent', verified: true, bio: 'Teaching JavaScript' },
  { id: 13, name: 'Sarah Drasner', username: '@sarah_edo', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahD', verified: true, bio: 'VP of DX at Netlify' },
];

export default function SocialFeedTemplate() {
  const [posts, setPosts] = useState(generatePosts());
  const [activeFilter, setActiveFilter] = useState<'following' | 'trending' | 'recent'>('following');
  const [composerOpen, setComposerOpen] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<typeof posts[0] | null>(null);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [newPostNotification, setNewPostNotification] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate new posts appearing
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setNewPostNotification(true);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1,
        };
      }
      return post;
    }));
  };

  const handleBookmark = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          bookmarked: !post.bookmarked,
        };
      }
      return post;
    }));
  };

  const handleShare = (post: typeof posts[0]) => {
    setSelectedPost(post);
    setShareDialogOpen(true);
  };

  const handleComment = (post: typeof posts[0]) => {
    setSelectedPost(post);
    setCommentDialogOpen(true);
  };

  const submitPost = () => {
    if (!newPost.trim()) return;

    const post = {
      id: posts.length + 1,
      user: currentUser,
      content: newPost,
      type: selectedImage ? 'image' : 'text',
      timestamp: 'Just now',
      likes: 0,
      comments: 0,
      shares: 0,
      bookmarked: false,
      liked: false,
      image: selectedImage,
      link: null,
      poll: null,
      topics: [],
    };

    setPosts([post, ...posts]);
    setNewPost('');
    setSelectedImage(null);
    setComposerOpen(false);
  };

  const submitComment = () => {
    if (!commentText.trim() || !selectedPost) return;

    setPosts(posts.map(post => {
      if (post.id === selectedPost.id) {
        return {
          ...post,
          comments: post.comments + 1,
        };
      }
      return post;
    }));

    setCommentText('');
    setCommentDialogOpen(false);
  };

  const loadNewPosts = () => {
    const newPosts = generatePosts().slice(0, 3);
    setPosts([...newPosts, ...posts]);
    setNewPostNotification(false);
    scrollAreaRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredPosts = posts.filter((post) => {
    if (activeFilter === 'trending') {
      return post.likes > 500;
    }
    return true;
  }).sort((a, b) => {
    if (activeFilter === 'trending') {
      return b.likes - a.likes;
    }
    return 0;
  });

  const getRelativeTime = (timestamp: string) => {
    return timestamp;
  };

  return (
    <div className="min-h-screen text-foreground">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Navigation */}
          <div className="hidden lg:block lg:col-span-3 p-6">
            <div className="sticky top-6 space-y-4">
              <Card className="glass border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                      <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{currentUser.name}</p>
                      <p className="text-sm text-muted-foreground">{currentUser.username}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div>
                      <div className="font-bold text-primary">1,234</div>
                      <div className="text-xs text-muted-foreground">Posts</div>
                    </div>
                    <div>
                      <div className="font-bold text-secondary">5.6K</div>
                      <div className="text-xs text-muted-foreground">Followers</div>
                    </div>
                    <div>
                      <div className="font-bold text-blue-400">892</div>
                      <div className="text-xs text-muted-foreground">Following</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <nav className="space-y-2">
                <Button variant="ghost" className="w-full justify-start gap-3" size="lg">
                  <Users className="h-5 w-5" />
                  Feed
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-3" size="lg">
                  <Bell className="h-5 w-5" />
                  Notifications
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-3" size="lg">
                  <Bookmark className="h-5 w-5" />
                  Bookmarks
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-3" size="lg">
                  <Settings className="h-5 w-5" />
                  Settings
                </Button>
              </nav>
            </div>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-6 p-6 space-y-6">
            {/* Header */}
            <Card className="glass border-white/10">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl terminal-glow font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Social Feed</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary/30"
                    onClick={() => setComposerOpen(!composerOpen)}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    New Post
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {/* New Post Notification */}
            <AnimatePresence>
              {newPostNotification && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Button
                    className="w-full glass border-primary/30 hover:bg-primary/10"
                    onClick={loadNewPosts}
                  >
                    <ArrowUp className="h-4 w-4 mr-2" />
                    New posts available
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Post Composer */}
            <AnimatePresence>
              {composerOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Card className="glass border-white/10">
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                          <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-3">
                          <Textarea
                            placeholder="What's happening?"
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            className="min-h-[100px] resize-none bg-transparent border-white/10"
                          />
                          {selectedImage && (
                            <div className="relative">
                              <img src={selectedImage} alt="Selected" className="rounded-lg w-full" />
                              <Button
                                size="icon"
                                variant="ghost"
                                className="absolute top-2 right-2 glass"
                                onClick={() => setSelectedImage(null)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <ImageIcon className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Add image</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <Video className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Add video</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <BarChart3 className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Create poll</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <Smile className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Add emoji</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setComposerOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                className="bg-primary hover:bg-primary/90"
                                onClick={submitPost}
                                disabled={!newPost.trim()}
                              >
                                <Send className="h-4 w-4 mr-2" />
                                Post
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Filter Tabs */}
            <Tabs value={activeFilter} onValueChange={(v) => setActiveFilter(v as any)} className="w-full">
              <TabsList className="glass border-white/10 w-full">
                <TabsTrigger value="following" className="flex-1">
                  <Users className="h-4 w-4 mr-2" />
                  Following
                </TabsTrigger>
                <TabsTrigger value="trending" className="flex-1">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Trending
                </TabsTrigger>
                <TabsTrigger value="recent" className="flex-1">
                  <Clock className="h-4 w-4 mr-2" />
                  Recent
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Posts Feed */}
            <div className="space-y-4">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="glass border-white/10 hover:border-primary/30 transition-all">
                    <CardContent className="p-4">
                      {/* Post Header */}
                      <div className="flex items-start gap-3 mb-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={post.user.avatar} alt={post.user.name} />
                          <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold truncate">{post.user.name}</span>
                            {post.user.verified && (
                              <Verified className="h-4 w-4 text-primary flex-shrink-0" />
                            )}
                            <span className="text-muted-foreground truncate">
                              {post.user.username}
                            </span>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-muted-foreground">{post.timestamp}</span>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="glass border-white/10">
                            <DropdownMenuItem>
                              <Bookmark className="h-4 w-4 mr-2" />
                              Save post
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <UserPlus className="h-4 w-4 mr-2" />
                              Follow {post.user.name}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <AlertCircle className="h-4 w-4 mr-2" />
                              Report post
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Post Content */}
                      <div className="mb-3">
                        <p className="text-foreground whitespace-pre-wrap">{post.content}</p>

                        {/* Topics */}
                        {post.topics.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {post.topics.map((topic, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="border-primary/30 text-primary cursor-pointer hover:bg-primary/10"
                              >
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Image */}
                        {post.image && (
                          <div className="mt-3 rounded-lg overflow-hidden border border-white/10">
                            <img src={post.image} alt="Post image" className="w-full" />
                          </div>
                        )}

                        {/* Link Preview */}
                        {post.link && (
                          <div className="mt-3 glass rounded-lg overflow-hidden border border-white/10 cursor-pointer hover:border-primary/30 transition-all">
                            <img src={post.link.thumbnail} alt={post.link.title} className="w-full" />
                            <div className="p-3">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                <Link2 className="h-3 w-3" />
                                {post.link.url}
                              </div>
                              <h4 className="font-semibold mb-1">{post.link.title}</h4>
                              <p className="text-sm text-muted-foreground">{post.link.description}</p>
                            </div>
                          </div>
                        )}

                        {/* Poll */}
                        {post.poll && (
                          <div className="mt-3 space-y-2">
                            <p className="font-semibold">{post.poll.question}</p>
                            {post.poll.options.map((option) => (
                              <div key={option.id}>
                                <Button
                                  variant="outline"
                                  className={`w-full justify-between h-auto p-3 ${
                                    post.poll!.votedOption === option.id
                                      ? 'border-primary/50 bg-primary/10'
                                      : 'border-white/10'
                                  }`}
                                  onClick={() => {
                                    // Handle vote
                                  }}
                                >
                                  <span className="flex-1 text-left">{option.text}</span>
                                  <span className="text-primary font-semibold">{option.percentage}%</span>
                                </Button>
                                <Progress value={option.percentage} className="h-1 mt-1" />
                              </div>
                            ))}
                            <p className="text-xs text-muted-foreground">
                              {post.poll.totalVotes.toLocaleString()} votes
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Post Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`gap-2 ${post.liked ? 'text-pink-500' : ''}`}
                          onClick={() => handleLike(post.id)}
                        >
                          <Heart className={`h-4 w-4 ${post.liked ? 'fill-current' : ''}`} />
                          {post.likes > 0 && post.likes.toLocaleString()}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleComment(post)}
                        >
                          <MessageCircle className="h-4 w-4" />
                          {post.comments > 0 && post.comments.toLocaleString()}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleShare(post)}
                        >
                          <Share2 className="h-4 w-4" />
                          {post.shares > 0 && post.shares.toLocaleString()}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={post.bookmarked ? 'text-primary' : ''}
                          onClick={() => handleBookmark(post.id)}
                        >
                          <Bookmark className={`h-4 w-4 ${post.bookmarked ? 'fill-current' : ''}`} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {/* Load More */}
              <Button variant="outline" className="w-full border-white/10" size="lg">
                <ChevronDown className="h-4 w-4 mr-2" />
                Load more posts
              </Button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block lg:col-span-3 p-6">
            <div className="sticky top-6 space-y-4">
              {/* Search */}
              <Card className="glass border-white/10">
                <CardContent className="p-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      className="pl-9 bg-transparent border-white/10"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Trending Topics */}
              <Card className="glass border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Trending
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <motion.div
                      key={topic.tag}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-all"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4 text-primary" />
                          <span className="font-semibold">{topic.tag}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{topic.posts} posts</p>
                      </div>
                      <div className={topic.trend === 'up' ? 'text-green-400' : 'text-red-400'}>
                        {topic.trend === 'up' ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              {/* Who to Follow */}
              <Card className="glass border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <UserPlus className="h-5 w-5 text-secondary" />
                    Who to Follow
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {whoToFollow.map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-all"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="font-semibold truncate">{user.name}</span>
                          {user.verified && (
                            <Verified className="h-3 w-3 text-primary flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{user.username}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{user.bio}</p>
                      </div>
                      <Button size="sm" variant="outline" className="border-primary/30 flex-shrink-0">
                        Follow
                      </Button>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="glass border-white/10">
          <DialogHeader>
            <DialogTitle>Share Post</DialogTitle>
            <DialogDescription>Share this post with your followers</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Button className="w-full" variant="outline">
              <Repeat2 className="h-4 w-4 mr-2" />
              Repost
            </Button>
            <Button className="w-full" variant="outline">
              <MessageCircle className="h-4 w-4 mr-2" />
              Quote Post
            </Button>
            <Button className="w-full" variant="outline">
              <Link2 className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
            <Button className="w-full" variant="outline">
              <Send className="h-4 w-4 mr-2" />
              Send via Message
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Comment Dialog */}
      <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
        <DialogContent className="glass border-white/10">
          <DialogHeader>
            <DialogTitle>Reply to {selectedPost?.user.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedPost && (
              <div className="glass rounded-lg p-3 border border-white/10">
                <div className="flex items-start gap-3 mb-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={selectedPost.user.avatar} alt={selectedPost.user.name} />
                    <AvatarFallback>{selectedPost.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{selectedPost.user.name}</span>
                      <span className="text-xs text-muted-foreground">{selectedPost.timestamp}</span>
                    </div>
                    <p className="text-sm line-clamp-3">{selectedPost.content}</p>
                  </div>
                </div>
              </div>
            )}
            <div className="flex gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
              </Avatar>
              <Textarea
                placeholder="Post your reply..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="resize-none bg-transparent border-white/10"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setCommentDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-primary hover:bg-primary/90"
                onClick={submitComment}
                disabled={!commentText.trim()}
              >
                Reply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
