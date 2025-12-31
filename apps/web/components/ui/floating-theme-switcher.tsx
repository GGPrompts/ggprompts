'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, Check, X } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'
import { cn } from '@/lib/utils'

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

type ThemeName = typeof themeConfig[number]['name']

export function FloatingThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
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
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', bounce: 0.25, duration: 0.4 }}
            className="absolute bottom-16 right-0 glass-overlay rounded-2xl p-4 w-72 shadow-2xl"
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
                  className="w-8 h-8 rounded-lg shadow-lg"
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
            <div className="grid grid-cols-5 gap-3 pb-6">
              {themeConfig.map((t) => {
                const isActive = theme === t.name
                return (
                  <motion.button
                    key={t.name}
                    onClick={() => {
                      setTheme(t.name as ThemeName)
                    }}
                    whileHover={{ scale: 1.15, zIndex: 10 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      'group relative flex items-center justify-center p-1.5 rounded-xl transition-all duration-200',
                      isActive
                        ? 'bg-primary/20 ring-2 ring-primary/50'
                        : 'hover:bg-muted/50'
                    )}
                  >
                    {/* Color Orb */}
                    <div className="relative">
                      <div
                        className={cn(
                          'w-9 h-9 rounded-full shadow-lg transition-all duration-300',
                          isActive && 'ring-2 ring-foreground/50',
                          t.name === 'light' && 'ring-1 ring-border/50'
                        )}
                        style={{
                          background: `linear-gradient(135deg, ${t.gradient[0]}, ${t.gradient[1]})`,
                          boxShadow: isActive
                            ? `0 0 20px ${t.color}60, 0 0 40px ${t.color}30`
                            : `0 4px 12px ${t.color}30`,
                        }}
                      />
                      {/* Check mark overlay */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            <Check
                              className="w-4 h-4 drop-shadow-lg"
                              style={{
                                color: t.name === 'light' || t.name === 'carbon' ? '#000' : '#fff',
                              }}
                              strokeWidth={3}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    {/* Hover tooltip */}
                    <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                      <span
                        className="px-2 py-1 text-[10px] font-medium border border-border rounded-md shadow-xl whitespace-nowrap"
                        style={{
                          backgroundColor: 'hsl(var(--card))',
                          color: 'hsl(var(--card-foreground))'
                        }}
                      >
                        {t.label}
                      </span>
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* Footer hint */}
            <p className="mt-4 text-[10px] text-muted-foreground text-center">
              Press <kbd className="px-1 py-0.5 bg-muted rounded text-[9px]">Esc</kbd> to close
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <motion.button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'relative w-14 h-14 rounded-2xl shadow-2xl transition-all duration-300',
          'glass flex items-center justify-center',
          'hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.4)]',
          isOpen && 'ring-2 ring-primary/50'
        )}
        aria-label="Toggle theme switcher"
        aria-expanded={isOpen}
      >
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-1 rounded-xl overflow-hidden"
          animate={{
            background: currentTheme
              ? [
                  `linear-gradient(0deg, ${currentTheme.gradient[0]}40, ${currentTheme.gradient[1]}40)`,
                  `linear-gradient(180deg, ${currentTheme.gradient[0]}40, ${currentTheme.gradient[1]}40)`,
                  `linear-gradient(360deg, ${currentTheme.gradient[0]}40, ${currentTheme.gradient[1]}40)`,
                ]
              : undefined,
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Icon */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: 'spring', bounce: 0.3 }}
        >
          <Palette className="w-6 h-6 text-foreground relative z-10" />
        </motion.div>

        {/* Current theme indicator dot */}
        <div
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-background shadow-lg"
          style={{
            backgroundColor: currentTheme?.color,
            boxShadow: `0 0 10px ${currentTheme?.color}80`,
          }}
        />
      </motion.button>
    </div>
  )
}
