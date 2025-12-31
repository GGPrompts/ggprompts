'use client'

import React, { useEffect, useState } from 'react'

interface MinimalBackgroundProps {
  opacity?: number
}

export const MinimalBackground: React.FC<MinimalBackgroundProps> = ({
  opacity = 1
}) => {
  const [theme, setTheme] = useState<string>('terminal')

  // Track theme changes
  useEffect(() => {
    const updateTheme = () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'terminal'
      setTheme(currentTheme)
    }

    updateTheme()
    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    })

    return () => observer.disconnect()
  }, [])

  // Get theme colors
  const getThemeGradient = () => {
    switch (theme) {
      case 'amber':
        return 'from-amber-950/20 via-amber-900/10 to-yellow-950/20'
      case 'carbon':
        return 'from-slate-900/30 via-slate-800/20 to-zinc-900/30'
      default: // terminal
        return 'from-emerald-950/20 via-teal-950/10 to-cyan-950/20'
    }
  }

  // Don't render in light theme
  if (theme === 'light') return null

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1, opacity }}
    >
      {/* Base gradient layer */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getThemeGradient()}`} />

      {/* Noise texture overlay using CSS */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
          opacity: 0.5,
          mixBlendMode: 'overlay'
        }}
      />

      {/* Subtle vignette effect */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.2) 100%)',
          pointerEvents: 'none'
        }}
      />

      {/* Animated subtle gradient shift */}
      <div
        className="absolute inset-0 animate-pulse"
        style={{
          background: theme === 'amber'
            ? 'radial-gradient(circle at 20% 50%, rgba(251, 191, 36, 0.02) 0%, transparent 50%)'
            : theme === 'carbon'
            ? 'radial-gradient(circle at 20% 50%, rgba(148, 163, 184, 0.02) 0%, transparent 50%)'
            : 'radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.02) 0%, transparent 50%)',
          animationDuration: '8s',
          animationTimingFunction: 'ease-in-out'
        }}
      />

      <div
        className="absolute inset-0 animate-pulse"
        style={{
          background: theme === 'amber'
            ? 'radial-gradient(circle at 80% 50%, rgba(245, 158, 11, 0.02) 0%, transparent 50%)'
            : theme === 'carbon'
            ? 'radial-gradient(circle at 80% 50%, rgba(100, 116, 139, 0.02) 0%, transparent 50%)'
            : 'radial-gradient(circle at 80% 50%, rgba(6, 182, 212, 0.02) 0%, transparent 50%)',
          animationDuration: '8s',
          animationDelay: '4s',
          animationTimingFunction: 'ease-in-out'
        }}
      />
    </div>
  )
}