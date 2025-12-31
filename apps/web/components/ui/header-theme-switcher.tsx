'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, Check, X, Layers, Image } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'
import { useBackground, type Background, type BackgroundTone } from '@/components/BackgroundProvider'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const themeConfig = [
  { name: 'terminal', label: 'Terminal', color: '#10b981', gradient: ['#10b981', '#06b6d4'] },
  { name: 'amber', label: 'Amber', color: '#ffc857', gradient: ['#ffc857', '#3b82f6'] },
  { name: 'carbon', label: 'Carbon', color: '#ffffff', gradient: ['#ffffff', '#404040'] },
  { name: 'light', label: 'Light', color: '#f8fafc', gradient: ['#ffffff', '#e2e8f0'] },
  { name: 'ocean', label: 'Ocean', color: '#00d4ff', gradient: ['#00d4ff', '#00e5cc'] },
  { name: 'sunset', label: 'Sunset', color: '#ff6633', gradient: ['#ff6633', '#ff4d8f'] },
  { name: 'forest', label: 'Forest', color: '#8aff00', gradient: ['#8aff00', '#73e600'] },
  { name: 'midnight', label: 'Midnight', color: '#ff66ff', gradient: ['#ff66ff', '#994dff'] },
  { name: 'neon', label: 'Neon', color: '#ff0099', gradient: ['#ff0099', '#00bfff'] },
  { name: 'slate', label: 'Slate', color: '#33b3ff', gradient: ['#33b3ff', '#0d9ddb'] },
] as const

const toneConfig: { name: BackgroundTone; label: string; color: string }[] = [
  { name: 'charcoal', label: 'Charcoal', color: '#1e293b' },
  { name: 'deep-purple', label: 'Purple', color: '#2e1065' },
  { name: 'pure-black', label: 'Black', color: '#000000' },
  { name: 'light', label: 'Light', color: '#f3f4f6' },
  { name: 'ocean', label: 'Ocean', color: '#002b4d' },
  { name: 'sunset', label: 'Sunset', color: '#4d1a4d' },
  { name: 'forest', label: 'Forest', color: '#1a331a' },
  { name: 'midnight', label: 'Midnight', color: '#14142b' },
  { name: 'neon-dark', label: 'Neon', color: '#0d0d0d' },
  { name: 'slate', label: 'Slate', color: '#263241' },
]

const styleConfig: { name: Background; label: string; icon: string }[] = [
  { name: 'gradient', label: 'Gradient', icon: '◐' },
  { name: 'mesh', label: 'Mesh', icon: '◈' },
  { name: 'textured', label: 'Textured', icon: '▤' },
  { name: 'minimal', label: 'Minimal', icon: '○' },
  { name: 'stars', label: 'Stars', icon: '✦' },
  { name: 'none', label: 'None', icon: '∅' },
]

type ThemeName = typeof themeConfig[number]['name']

export function HeaderThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const { background, setBackground, backgroundTone, setBackgroundTone } = useBackground()
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        panelRef.current &&
        buttonRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Close on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const currentTheme = themeConfig.find(t => t.name === theme)

  if (!mounted) return null

  return (
    <div className="relative">
      {/* Trigger Button */}
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
        aria-label="Toggle theme switcher"
        aria-expanded={isOpen}
      >
        <Palette className="w-5 h-5" />
        <span
          className="absolute bottom-1 right-1 w-2 h-2 rounded-full border border-background"
          style={{ backgroundColor: currentTheme?.color }}
        />
      </Button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', bounce: 0.25, duration: 0.3 }}
            className="absolute top-full right-0 mt-2 rounded-2xl p-4 w-72 shadow-2xl z-50 bg-popover/95 backdrop-blur-xl border border-border/50"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Theme</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md hover:bg-muted/50 transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Current Theme Display */}
            <div className="mb-4 p-3 rounded-xl bg-muted/30 border border-border/50">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg shadow-lg",
                    currentTheme?.name === 'light' && 'ring-1 ring-border/50'
                  )}
                  style={{
                    background: currentTheme
                      ? `linear-gradient(135deg, ${currentTheme.gradient[0]}, ${currentTheme.gradient[1]})`
                      : undefined,
                  }}
                />
                <div>
                  <p className="text-xs text-muted-foreground">Current</p>
                  <p className="text-sm font-medium text-foreground capitalize">
                    {currentTheme?.label || theme}
                  </p>
                </div>
              </div>
            </div>

            {/* Theme Grid */}
            <div className="grid grid-cols-5 gap-2">
              {themeConfig.map((t) => {
                const isActive = theme === t.name
                return (
                  <motion.button
                    key={t.name}
                    onClick={() => {
                      setTheme(t.name as ThemeName)
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      'group relative flex items-center justify-center p-1 rounded-lg transition-all duration-200',
                      isActive
                        ? 'bg-primary/20 ring-2 ring-primary/50'
                        : 'hover:bg-muted/50'
                    )}
                    title={t.label}
                  >
                    <div className="relative">
                      <div
                        className={cn(
                          'w-7 h-7 rounded-full shadow-md transition-all duration-300',
                          isActive && 'ring-2 ring-foreground/50',
                          t.name === 'light' && 'ring-1 ring-border/50'
                        )}
                        style={{
                          background: `linear-gradient(135deg, ${t.gradient[0]}, ${t.gradient[1]})`,
                          boxShadow: isActive
                            ? `0 0 12px ${t.color}60`
                            : `0 2px 8px ${t.color}30`,
                        }}
                      />
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            <Check
                              className="w-3 h-3 drop-shadow-lg"
                              style={{
                                color: t.name === 'light' || t.name === 'carbon' ? '#000' : '#fff',
                              }}
                              strokeWidth={3}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* Background Tone Section */}
            <div className="mt-4 pt-3 border-t border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Background Tone</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {toneConfig.map((t) => {
                  const isActive = backgroundTone === t.name
                  return (
                    <button
                      key={t.name}
                      onClick={() => setBackgroundTone(t.name)}
                      className={cn(
                        'relative w-full aspect-square rounded-md transition-all duration-200',
                        isActive
                          ? 'ring-2 ring-primary scale-105'
                          : 'hover:ring-1 hover:ring-primary/50 hover:scale-105'
                      )}
                      style={{ backgroundColor: t.color }}
                      title={t.label}
                    >
                      {isActive && (
                        <Check
                          className="absolute inset-0 m-auto w-3 h-3 drop-shadow-lg"
                          style={{ color: t.name === 'light' ? '#000' : '#fff' }}
                          strokeWidth={3}
                        />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Background Style Section */}
            <div className="mt-3 pt-3 border-t border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Image className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Background Style</span>
              </div>
              <div className="flex gap-1.5">
                {styleConfig.map((s) => {
                  const isActive = background === s.name
                  return (
                    <button
                      key={s.name}
                      onClick={() => setBackground(s.name)}
                      className={cn(
                        'flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all duration-200',
                        isActive
                          ? 'bg-primary/20 text-primary ring-1 ring-primary/50'
                          : 'bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                      )}
                      title={s.label}
                    >
                      <span className="text-sm">{s.icon}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Footer hint */}
            <p className="mt-3 text-[10px] text-muted-foreground text-center">
              Press <kbd className="px-1 py-0.5 bg-muted rounded text-[9px]">Esc</kbd> to close
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
