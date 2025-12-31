'use client'

import { useState } from 'react'
import { Card, CardContent, Avatar, AvatarFallback, AvatarImage, Badge, Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, cn } from '@ggprompts/ui'
import { Calendar, Sparkles, Heart, MessageSquare, Edit, Loader2, Check } from 'lucide-react'
import { Profile } from '@/lib/types'
import { getDiceBearStyles, generateDiceBearAvatar } from '@/lib/avatar'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface ProfileHeaderProps {
  profile: Profile
  stats: {
    promptCount: number
    postCount: number
    totalLikes: number
  }
  email?: string
  userId?: string
  oauthAvatarUrl?: string | null
  oauthProvider?: 'google' | 'github' | null
  onAvatarChange?: (newAvatarUrl: string) => void
}

export function ProfileHeader({ profile, stats, email, userId, oauthAvatarUrl, oauthProvider, onAvatarChange }: ProfileHeaderProps) {
  const providerName = oauthProvider === 'google' ? 'Google' : oauthProvider === 'github' ? 'GitHub' : 'OAuth'
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)
  const [useOAuthAvatar, setUseOAuthAvatar] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState(profile.avatar_url)

  const avatarStyles = getDiceBearStyles()

  const getInitials = (name: string | null) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    })
  }

  const handleSaveAvatar = async () => {
    if (!userId || (!selectedStyle && !useOAuthAvatar)) return

    setIsSaving(true)
    try {
      let newAvatarUrl: string | null = null

      if (useOAuthAvatar && oauthAvatarUrl) {
        // Use the OAuth avatar (GitHub, Google, etc.)
        newAvatarUrl = oauthAvatarUrl
      } else if (selectedStyle) {
        // Use DiceBear avatar
        newAvatarUrl = generateDiceBearAvatar(
          profile.username || email || userId,
          selectedStyle as Parameters<typeof generateDiceBearAvatar>[1]
        )
      }

      const supabase = createClient()
      const { error } = await supabase
        .from('users')
        .update({ avatar_url: newAvatarUrl, updated_at: new Date().toISOString() })
        .eq('id', userId)

      if (error) throw error

      setCurrentAvatarUrl(newAvatarUrl)
      onAvatarChange?.(newAvatarUrl || '')
      // Dispatch event so Navigation and other components can update
      window.dispatchEvent(new CustomEvent('avatar-updated', { detail: { avatarUrl: newAvatarUrl } }))
      setIsAvatarDialogOpen(false)
      setSelectedStyle(null)
      setUseOAuthAvatar(false)
      toast.success('Avatar updated!')
    } catch (error) {
      console.error('Failed to update avatar:', error)
      toast.error('Failed to update avatar')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="glass border-border/50 overflow-hidden">
      {/* Cover gradient */}
      <div className="relative h-32 sm:h-40 bg-gradient-to-br from-primary/30 via-primary/10 to-secondary/20">
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        {/* Decorative orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-secondary/20 rounded-full blur-2xl" />
      </div>

      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-16 sm:-mt-12 gap-4">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-4 border-background shadow-xl">
              {currentAvatarUrl && (
                <AvatarImage src={currentAvatarUrl} alt={profile.username || 'User'} />
              )}
              <AvatarFallback className="text-2xl bg-primary/20 text-primary">
                {getInitials(profile.username)}
              </AvatarFallback>
            </Avatar>
            {userId && (
              <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="icon"
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full glass hover:bg-primary/20 border border-border/50"
                    variant="ghost"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-overlay max-w-md">
                  <DialogHeader>
                    <DialogTitle>Change Avatar</DialogTitle>
                    <DialogDescription>
                      Choose your avatar style
                    </DialogDescription>
                  </DialogHeader>

                  {/* GitHub/OAuth Avatar Option */}
                  {oauthAvatarUrl && (
                    <div className="pb-3 border-b border-border/50">
                      <p className="text-sm text-muted-foreground mb-2">Connected Account</p>
                      <button
                        onClick={() => {
                          setUseOAuthAvatar(true)
                          setSelectedStyle(null)
                        }}
                        className={cn(
                          "relative p-2 rounded-lg border-2 transition-all hover:scale-105 flex items-center gap-3",
                          useOAuthAvatar
                            ? "border-primary bg-primary/10"
                            : "border-transparent hover:border-primary/50"
                        )}
                      >
                        <img
                          src={oauthAvatarUrl}
                          alt={`${providerName} avatar`}
                          className="w-12 h-12 rounded-full"
                        />
                        <span className="text-sm font-medium">Use {providerName} Avatar</span>
                        {useOAuthAvatar && (
                          <div className="absolute -top-1 -right-1 bg-primary rounded-full p-0.5">
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </div>
                        )}
                      </button>
                    </div>
                  )}

                  {/* DiceBear Styles */}
                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground mb-2">Generated Avatars</p>
                    <div className="grid grid-cols-5 gap-2">
                      {avatarStyles.map((style) => {
                        const previewUrl = generateDiceBearAvatar(
                          profile.username || email || userId,
                          style as Parameters<typeof generateDiceBearAvatar>[1],
                          64
                        )
                        const isSelected = selectedStyle === style && !useOAuthAvatar
                        return (
                          <button
                            key={style}
                            onClick={() => {
                              setSelectedStyle(style)
                              setUseOAuthAvatar(false)
                            }}
                            className={cn(
                              "relative p-1 rounded-lg border-2 transition-all hover:scale-105",
                              isSelected
                                ? "border-primary bg-primary/10"
                                : "border-transparent hover:border-primary/50"
                            )}
                          >
                            <img
                              src={previewUrl}
                              alt={style}
                              className="w-12 h-12 rounded"
                            />
                            {isSelected && (
                              <div className="absolute -top-1 -right-1 bg-primary rounded-full p-0.5">
                                <Check className="h-3 w-3 text-primary-foreground" />
                              </div>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAvatarDialogOpen(false)
                        setSelectedStyle(null)
                        setUseOAuthAvatar(false)
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveAvatar}
                      disabled={(!selectedStyle && !useOAuthAvatar) || isSaving}
                    >
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : null}
                      Save
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold terminal-glow">
                    {profile.username || 'Anonymous User'}
                  </h1>
                  <Badge variant="outline" className="border-primary/50 text-primary">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Creator
                  </Badge>
                </div>
                {email && (
                  <p className="text-sm text-muted-foreground mt-1">{email}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-4 mt-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Joined {formatDate(profile.created_at)}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="glass rounded-lg p-4 text-center border border-border/30">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl font-bold text-primary">{stats.promptCount}</div>
            <div className="text-xs text-muted-foreground">Prompts</div>
          </div>
          <div className="glass rounded-lg p-4 text-center border border-border/30">
            <div className="flex items-center justify-center gap-1 mb-1">
              <MessageSquare className="h-4 w-4 text-secondary" />
            </div>
            <div className="text-2xl font-bold text-secondary">{stats.postCount}</div>
            <div className="text-xs text-muted-foreground">Posts</div>
          </div>
          <div className="glass rounded-lg p-4 text-center border border-border/30">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Heart className="h-4 w-4 text-red-400" />
            </div>
            <div className="text-2xl font-bold text-red-400">{stats.totalLikes}</div>
            <div className="text-xs text-muted-foreground">Total Likes</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
