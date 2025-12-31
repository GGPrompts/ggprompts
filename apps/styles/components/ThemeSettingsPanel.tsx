'use client'

import { Check, Palette, PaintBucket, Layers } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'
import { useBackground, type BackgroundTone } from '@/components/BackgroundProvider'
import { cn } from '@/lib/utils'

// Theme color previews (approximate primary colors for each theme)
const themeColors: Record<string, { bg: string; accent: string; label: string }> = {
  terminal: { bg: '#0a0f0d', accent: '#10b981', label: 'Terminal' },
  amber: { bg: '#0c0c14', accent: '#ffc857', label: 'Amber' },
  carbon: { bg: '#000000', accent: '#ffffff', label: 'Carbon' },
  light: { bg: '#fafbfc', accent: '#0066cc', label: 'Light' },
  ocean: { bg: '#001a33', accent: '#00d4ff', label: 'Ocean' },
  sunset: { bg: '#331a33', accent: '#ff6b6b', label: 'Sunset' },
  forest: { bg: '#0d1a0d', accent: '#84cc16', label: 'Forest' },
  midnight: { bg: '#0a0a1a', accent: '#e879f9', label: 'Midnight' },
  neon: { bg: '#0a0a0a', accent: '#ff0080', label: 'Neon' },
  slate: { bg: '#1a1f29', accent: '#38bdf8', label: 'Slate' },
}

// Background tone color previews
const toneColors: Record<BackgroundTone, { bg: string; label: string }> = {
  'charcoal': { bg: '#0d1117', label: 'Charcoal' },
  'deep-purple': { bg: '#0c0c14', label: 'Deep Purple' },
  'pure-black': { bg: '#000000', label: 'Pure Black' },
  'light': { bg: '#f3f4f6', label: 'Light' },
  'ocean': { bg: '#002b4d', label: 'Ocean' },
  'sunset': { bg: '#4d1a4d', label: 'Sunset' },
  'forest': { bg: '#1a331a', label: 'Forest' },
  'midnight': { bg: '#14142b', label: 'Midnight' },
  'neon-dark': { bg: '#0d0d0d', label: 'Neon Dark' },
  'slate': { bg: '#263241', label: 'Slate' },
}

const backgroundStyles = [
  { value: 'gradient', label: 'Gradient' },
  { value: 'mesh', label: 'Mesh' },
  { value: 'textured', label: 'Textured' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'stars', label: 'Stars' },
  { value: 'none', label: 'None' },
] as const

export function ThemeSettingsPanel() {
  const { theme, setTheme, themes } = useTheme()
  const { background, setBackground, backgroundTone, setBackgroundTone, backgroundTones } = useBackground()

  return (
    <div className="space-y-8">
      {/* Theme Selection */}
      <div>
        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-3">
          <Palette className="h-4 w-4" />
          Color Theme
        </label>
        <div className="grid grid-cols-5 gap-2">
          {themes.map((t) => {
            const colors = themeColors[t]
            const isSelected = theme === t
            return (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={cn(
                  "group relative flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all",
                  "hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50",
                  isSelected && "bg-primary/15 ring-2 ring-primary/50"
                )}
                title={colors.label}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full border-2 transition-transform",
                    "group-hover:scale-110",
                    isSelected ? "border-primary" : "border-border/50"
                  )}
                  style={{
                    background: `linear-gradient(135deg, ${colors.bg} 50%, ${colors.accent} 50%)`,
                  }}
                >
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check className="h-4 w-4 text-primary drop-shadow-lg" />
                    </div>
                  )}
                </div>
                <span className={cn(
                  "text-xs truncate w-full text-center",
                  isSelected ? "text-primary font-medium" : "text-muted-foreground"
                )}>
                  {colors.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Background Tone Selection */}
      <div>
        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-3">
          <PaintBucket className="h-4 w-4" />
          Background Tone
        </label>
        <div className="grid grid-cols-5 gap-2">
          {backgroundTones.map((tone) => {
            const colors = toneColors[tone]
            const isSelected = backgroundTone === tone
            const isLightTone = tone === 'light'
            return (
              <button
                key={tone}
                onClick={() => setBackgroundTone(tone)}
                className={cn(
                  "group relative flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all",
                  "hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50",
                  isSelected && "bg-primary/15 ring-2 ring-primary/50"
                )}
                title={colors.label}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full border-2 transition-transform",
                    "group-hover:scale-110",
                    isSelected ? "border-primary" : "border-border/50",
                    isLightTone && "border-border"
                  )}
                  style={{ background: colors.bg }}
                >
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check className={cn(
                        "h-4 w-4 drop-shadow-lg",
                        isLightTone ? "text-gray-600" : "text-primary"
                      )} />
                    </div>
                  )}
                </div>
                <span className={cn(
                  "text-xs truncate w-full text-center",
                  isSelected ? "text-primary font-medium" : "text-muted-foreground"
                )}>
                  {colors.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Background Style Selection */}
      <div>
        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-3">
          <Layers className="h-4 w-4" />
          Background Style
        </label>
        <div className="flex flex-wrap gap-2">
          {backgroundStyles.map((style) => {
            const isSelected = background === style.value
            return (
              <button
                key={style.value}
                onClick={() => setBackground(style.value)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  "border focus:outline-none focus:ring-2 focus:ring-primary/50",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background/50 text-muted-foreground border-border/50 hover:bg-primary/10 hover:text-foreground hover:border-primary/30"
                )}
              >
                {style.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
