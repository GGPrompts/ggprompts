'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { cn, Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, Avatar, AvatarFallback, AvatarImage, AnimatedBackground } from '@ggprompts/ui'
import { HeaderThemeSwitcher } from '@/components/ui/header-theme-switcher'
import { Sparkles, MessageSquare, User, Menu, Settings, LogOut, Newspaper, Terminal, Bot } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getAvatarUrl } from '@/lib/avatar'
import { Logo } from '@/components/Logo'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface UserProfile {
  avatar_url: string | null
  username: string | null
}


export function Navigation() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Handle scroll to show/hide header
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY
    const scrollThreshold = 10

    // Always show header at top of page
    if (currentScrollY < 50) {
      setIsVisible(true)
      setLastScrollY(currentScrollY)
      return
    }

    // Only update if scroll difference is significant
    if (Math.abs(currentScrollY - lastScrollY) < scrollThreshold) {
      return
    }

    // Hide on scroll down, show on scroll up
    if (currentScrollY > lastScrollY) {
      setIsVisible(false)
    } else {
      setIsVisible(true)
    }

    setLastScrollY(currentScrollY)
  }, [lastScrollY])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Fetch user profile for avatar
  const fetchProfile = useCallback(async (userId: string) => {
    const supabase = createClient()
    const { data } = await supabase
      .from('users')
      .select('avatar_url, username')
      .eq('id', userId)
      .single()
    if (data) {
      setProfile(data)
    }
  }, [])

  useEffect(() => {
    const supabase = createClient()

    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
      if (user) {
        fetchProfile(user.id)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [fetchProfile])

  // Listen for avatar updates from profile/settings pages
  useEffect(() => {
    const handleAvatarUpdate = (event: CustomEvent<{ avatarUrl: string }>) => {
      setProfile(prev => prev ? { ...prev, avatar_url: event.detail.avatarUrl } : null)
    }

    window.addEventListener('avatar-updated', handleAvatarUpdate as EventListener)
    return () => window.removeEventListener('avatar-updated', handleAvatarUpdate as EventListener)
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const getUserInitials = () => {
    if (!user) return '?'
    const email = user.email || ''
    const username = user.user_metadata?.username
    if (username) return username.charAt(0).toUpperCase()
    return email.charAt(0).toUpperCase()
  }

  const getDisplayName = () => {
    if (!user) return ''
    return user.user_metadata?.username || user.email?.split('@')[0] || 'User'
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/40 glass-overlay transition-transform duration-300",
        !isVisible && "-translate-y-full"
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="group">
          <Logo size="medium" layout="horizontal" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <AnimatedBackground
            defaultValue={pathname.startsWith('/prompts') ? 'prompts' : pathname.startsWith('/news') ? 'news' : pathname.startsWith('/forums') ? 'forums' : pathname.startsWith('/claude-code') ? 'claude-code' : pathname.startsWith('/automations') ? 'automations' : pathname.startsWith('/profile') ? 'profile' : undefined}
            className="rounded-lg bg-primary/20 border border-primary/30"
            transition={{
              type: 'spring',
              bounce: 0.2,
              duration: 0.3,
            }}
            enableHover
          >
            <Link
              href="/prompts"
              data-id="prompts"
              className={cn(
                "px-3 py-2 rounded-lg transition-colors",
                pathname.startsWith('/prompts') ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Sparkles className="w-4 h-4" />
              Prompts
            </Link>
            <Link
              href="/news"
              data-id="news"
              className={cn(
                "px-3 py-2 rounded-lg transition-colors",
                pathname.startsWith('/news') ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Newspaper className="w-4 h-4" />
              News
            </Link>
            <Link
              href="/forums"
              data-id="forums"
              className={cn(
                "px-3 py-2 rounded-lg transition-colors",
                pathname.startsWith('/forums') ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <MessageSquare className="w-4 h-4" />
              Forums
            </Link>
            <Link
              href="/claude-code"
              data-id="claude-code"
              className={cn(
                "px-3 py-2 rounded-lg transition-colors",
                pathname.startsWith('/claude-code') ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Terminal className="w-4 h-4" />
              Claude Code
            </Link>
            <Link
              href="/automations"
              data-id="automations"
              className={cn(
                "px-3 py-2 rounded-lg transition-colors",
                pathname.startsWith('/automations') ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Bot className="w-4 h-4" />
              Automations
            </Link>
            <Link
              href="/profile"
              data-id="profile"
              className={cn(
                "px-3 py-2 rounded-lg transition-colors",
                pathname.startsWith('/profile') ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <User className="w-4 h-4" />
              Profile
            </Link>
          </AnimatedBackground>
        </nav>

        {/* Right side - Theme switcher & Auth */}
        <div className="flex items-center gap-2">
          {/* Theme Switcher */}
          <HeaderThemeSwitcher />

          {/* Auth Button / User Menu */}
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={getAvatarUrl(user, profile ?? undefined)} alt={getDisplayName()} />
                    <AvatarFallback className="bg-primary/20 text-primary text-sm font-medium">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-dark w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{getDisplayName()}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" size="sm" className="hidden sm:flex" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          )}

          {/* Mobile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-dark w-48">
              <DropdownMenuItem asChild>
                <Link href="/prompts" className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Prompts
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/news" className="flex items-center gap-2">
                  <Newspaper className="w-4 h-4" />
                  News
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/forums" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Forums
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/claude-code" className="flex items-center gap-2">
                  <Terminal className="w-4 h-4" />
                  Claude Code
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/automations" className="flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  Automations
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {user ? (
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem asChild>
                  <Link href="/login" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Sign In
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
