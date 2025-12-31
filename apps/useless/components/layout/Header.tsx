'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { ShoppingCart, Search, Menu, X, Sparkles, User, LogOut, Package, Settings, Sun, Moon } from 'lucide-react'
import { Button } from '@ggprompts/ui'
import { Input } from '@ggprompts/ui'
import { Badge } from '@ggprompts/ui'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ggprompts/ui'
import { useCart } from '@/components/cart/CartProvider'
import { useTheme } from '@/components/ThemeProvider'
import { useSession, signOut } from '@/lib/auth-client'
import { WalletBalance } from '@/components/wallet/WalletBalance'
import { SecretLogoClicks } from '@/components/satirical/SecretLogoClicks'
import { cn } from '@ggprompts/ui'

const NAV_LINKS = [
  { href: '/products', label: 'Products' },
  { href: '/waitlist', label: 'Waitlist' },
  { href: '/submit-idea', label: 'Submit Idea' },
  { href: '/about', label: 'About' },
]

const COLOR_THEMES = [
  { value: 'terminal', label: 'Terminal', color: 'bg-emerald-500' },
  { value: 'amber', label: 'Amber', color: 'bg-amber-500' },
  { value: 'ocean', label: 'Ocean', color: 'bg-cyan-500' },
  { value: 'sunset', label: 'Sunset', color: 'bg-orange-500' },
  { value: 'forest', label: 'Forest', color: 'bg-lime-500' },
  { value: 'midnight', label: 'Midnight', color: 'bg-fuchsia-500' },
  { value: 'neon', label: 'Neon', color: 'bg-pink-500' },
  { value: 'slate', label: 'Slate', color: 'bg-sky-500' },
  { value: 'carbon', label: 'Carbon', color: 'bg-gray-500' },
] as const

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { itemCount } = useCart()
  const { colorTheme, setColorTheme, mode, toggleMode } = useTheme()
  const { data: session, isPending: isSessionLoading } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setMobileMenuOpen(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 w-full glass-overlay border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <SecretLogoClicks>
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-xl terminal-glow hover:opacity-80 transition-opacity"
            >
              <Sparkles className="h-6 w-6" />
              <span className="hidden sm:inline">Useless.io</span>
              <span className="sm:hidden">U.io</span>
            </Link>
          </SecretLogoClicks>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 ml-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  pathname === link.href
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden lg:flex items-center flex-1 max-w-lg mx-8"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Input
                type="search"
                placeholder="Search useless products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full min-w-[280px] bg-muted/50 border-border/50 text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Theme Selector - Desktop */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:flex hover:text-primary h-10 w-10" aria-label="Color theme picker">
                  <span className="text-lg">🎨</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 glass-overlay">
                <DropdownMenuLabel>Color Theme</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {COLOR_THEMES.map((t) => (
                  <DropdownMenuItem
                    key={t.value}
                    onClick={() => setColorTheme(t.value as any)}
                    className={cn(
                      'cursor-pointer flex items-center gap-2',
                      colorTheme === t.value && 'bg-primary/10 text-primary'
                    )}
                  >
                    <span className={cn('w-4 h-4 rounded-full', t.color)} />
                    {t.label}
                    {colorTheme === t.value && <span className="ml-auto">✓</span>}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Light/Dark Mode Toggle - Desktop */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex hover:text-primary h-10 w-10"
              onClick={toggleMode}
              aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {mode === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Wallet Balance - Desktop */}
            <div className="hidden md:block">
              <WalletBalance />
            </div>

            {/* User Menu */}
            {!isSessionLoading && (
              session?.user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="hover:text-primary h-10 w-10" aria-label="User account menu">
                      {session.user.image ? (
                        <Image
                          src={session.user.image}
                          alt={session.user.name || 'User avatar'}
                          width={28}
                          height={28}
                          className="rounded-full"
                        />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 glass-overlay">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{session.user.name || 'User'}</p>
                        <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/account/orders" className="cursor-pointer">
                        <Package className="mr-2 h-4 w-4" />
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login">
                  <Button variant="outline" size="sm" className="hidden sm:flex">
                    Sign In
                  </Button>
                </Link>
              )
            )}

            {/* Cart Button */}
            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:text-primary h-10 w-10"
                aria-label={itemCount > 0 ? `Shopping cart with ${itemCount} item${itemCount === 1 ? '' : 's'}` : 'Shopping cart (empty)'}
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs border-glow"
                    aria-hidden="true"
                  >
                    {itemCount > 9 ? '9+' : itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-10 w-10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav id="mobile-menu" className="md:hidden py-4 space-y-4 border-t border-border/40" aria-label="Mobile navigation">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="lg:hidden">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full bg-muted/50 border-border/50 text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </form>

            {/* Mobile Wallet Balance */}
            {session?.user && (
              <div className="px-3">
                <WalletBalance />
              </div>
            )}

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    pathname === link.href
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {session?.user ? (
                <>
                  <Link
                    href="/account/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut()
                      setMobileMenuOpen(false)
                    }}
                    className="px-3 py-2 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-center"
                >
                  Sign In
                </Link>
              )}
            </nav>

            {/* Mobile Light/Dark Toggle */}
            <div className="md:hidden px-3">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Mode
              </p>
              <button
                onClick={toggleMode}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 min-h-[44px] rounded-md text-sm font-medium transition-all w-full',
                  'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
                aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {mode === 'dark' ? (
                  <>
                    <Sun className="h-4 w-4" />
                    Switch to Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4" />
                    Switch to Dark Mode
                  </>
                )}
              </button>
            </div>

            {/* Mobile Theme Selector */}
            <div className="md:hidden" role="radiogroup" aria-label="Color theme selector">
              <p className="text-xs font-medium text-muted-foreground mb-2 px-3" id="theme-label">
                Color Theme
              </p>
              <div className="flex flex-wrap gap-2 px-3">
                {COLOR_THEMES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => {
                      setColorTheme(t.value as any)
                      setMobileMenuOpen(false)
                    }}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 min-h-[44px] rounded-md text-sm font-medium transition-all',
                      colorTheme === t.value
                        ? 'bg-primary/10 text-primary ring-1 ring-primary'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    )}
                    aria-label={`Set color theme to ${t.label}`}
                    aria-pressed={colorTheme === t.value}
                  >
                    <span className={cn('w-3 h-3 rounded-full', t.color)} aria-hidden="true" />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
