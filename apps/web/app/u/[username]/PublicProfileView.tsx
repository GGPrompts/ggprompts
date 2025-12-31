'use client'

import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  FileText,
  MessageSquare,
  ThumbsUp,
  Sparkles,
  Heart,
  Copy,
  Calendar,
  Lock,
  ExternalLink
} from 'lucide-react'
import { formatStatNumber } from '@/lib/userStats'
import { getAvatarUrl } from '@/lib/avatar'
import type { PublicProfile, RecentPrompt, RecentPost } from '@/lib/types'

interface Props {
  profile: PublicProfile
  recentPrompts: RecentPrompt[]
  recentPosts: RecentPost[]
}

export function PublicProfileView({ profile, recentPrompts, recentPosts }: Props) {
  const getUserInitials = () => {
    if (profile.display_name) {
      return profile.display_name.substring(0, 2).toUpperCase()
    }
    if (profile.username) {
      return profile.username.substring(0, 2).toUpperCase()
    }
    return 'GG'
  }

  const showStats = profile.privacy_settings?.show_detailed_stats !== false
  const showActivity = profile.privacy_settings?.show_recent_activity !== false

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Profile Header */}
      <Card className="glass-card mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            {/* Avatar */}
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-primary/20">
              <AvatarImage
                src={getAvatarUrl({ id: profile.id } as any, { avatar_url: profile.avatar_url, username: profile.username })}
                alt={profile.username}
              />
              <AvatarFallback className="bg-primary/20 text-primary text-2xl font-bold">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                {profile.display_name || profile.username}
              </h1>
              <p className="text-muted-foreground text-lg">@{profile.username}</p>

              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Member since {new Date(profile.created_at).toLocaleDateString()}</span>
              </div>

              {profile.bio && (
                <p className="mt-4 text-foreground/80 max-w-xl">{profile.bio}</p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/prompts?author=${profile.username}`}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    View Prompts
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Section */}
      {showStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Forum Activity */}
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Forum Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground text-sm mb-1">
                    <FileText className="h-4 w-4" />
                    <span>Posts</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {formatStatNumber(profile.forum_posts_count || 0)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground text-sm mb-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>Comments</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {formatStatNumber(profile.forum_comments_count || 0)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground text-sm mb-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>Votes</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {formatStatNumber(profile.forum_votes_count || 0)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prompt Stats */}
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Submitted Prompts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground text-sm mb-1">
                    <Sparkles className="h-4 w-4" />
                    <span>Created</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {formatStatNumber(profile.prompts_created_count || 0)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground text-sm mb-1">
                    <Heart className="h-4 w-4" />
                    <span>Likes</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {formatStatNumber(profile.prompt_likes_count || 0)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground text-sm mb-1">
                    <Copy className="h-4 w-4" />
                    <span>Copies</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {formatStatNumber(profile.prompt_copies_count || 0)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Activity */}
      {showActivity && (recentPrompts.length > 0 || recentPosts.length > 0) && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-xl">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recent Prompts */}
              {recentPrompts.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Latest Prompts
                  </h4>
                  <div className="space-y-2">
                    {recentPrompts.map((prompt) => (
                      <Link
                        key={prompt.id}
                        href={`/prompts?prompt=${prompt.id}`}
                        className="block p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="font-medium text-foreground line-clamp-1">
                          {prompt.title}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          {prompt.category && (
                            <span className="px-2 py-0.5 rounded bg-primary/10 text-primary">
                              {prompt.category}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" /> {prompt.like_count}
                          </span>
                          <span className="flex items-center gap-1">
                            <Copy className="h-3 w-3" /> {prompt.usage_count}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Forum Posts */}
              {recentPosts.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Latest Forum Posts
                  </h4>
                  <div className="space-y-2">
                    {recentPosts.map((post) => (
                      <Link
                        key={post.id}
                        href={`/forums/${post.id}`}
                        className="block p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="font-medium text-foreground line-clamp-1">
                          {post.title}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          {post.forums?.name && (
                            <span>in {post.forums.name}</span>
                          )}
                          <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {recentPrompts.length === 0 && recentPosts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No recent activity to display</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Private Profile Notice */}
      {!showStats && !showActivity && (
        <Card className="glass-card">
          <CardContent className="py-12 text-center">
            <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              This user has limited their profile visibility
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
