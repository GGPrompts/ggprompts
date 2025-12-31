'use client'

import { Check, Palette, PaintBucket, Layers, Image, Video, X, AlertCircle } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'
import { useBackground, type BackgroundTone } from '@/components/BackgroundProvider'
import { usePageBackground, type PageBackgroundType } from '@/hooks/usePageBackground'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'

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

// Map dark themes to their recommended background tones for auto-coupling
// When selecting a dark theme while on 'light' background tone, auto-switch to compatible tone
const themeToTone: Record<string, BackgroundTone> = {
  terminal: 'charcoal',
  amber: 'deep-purple',
  carbon: 'pure-black',
  ocean: 'ocean',
  sunset: 'sunset',
  forest: 'forest',
  midnight: 'midnight',
  neon: 'neon-dark',
  slate: 'slate',
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
  { value: 'none', label: 'None' },
] as const

const backgroundTypes: { value: PageBackgroundType; label: string; icon: typeof Image }[] = [
  { value: 'none', label: 'None', icon: X },
  { value: 'image', label: 'Image', icon: Image },
  { value: 'video', label: 'Video', icon: Video },
]

export function ThemeSettingsPanel() {
  const { theme, setTheme, themes } = useTheme()
  const { background, setBackground, backgroundTone, setBackgroundTone, backgroundTones } = useBackground()
  const {
    backgroundUrl,
    backgroundType,
    backgroundOpacity,
    backgroundStyleOpacity,
    mediaError,
    setBackgroundUrl,
    setBackgroundType,
    setBackgroundOpacity,
    setBackgroundStyleOpacity,
  } = usePageBackground()

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
                onClick={() => {
                  setTheme(t)
                  // Auto-couple: if selecting a dark theme while on 'light' background tone,
                  // switch to a compatible background tone to prevent contrast issues
                  if (t !== 'light' && backgroundTone === 'light') {
                    const compatibleTone = themeToTone[t] || 'charcoal'
                    setBackgroundTone(compatibleTone)
                  }
                }}
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
                onClick={() => {
                  setBackgroundTone(tone)
                  // Auto-couple: if selecting 'light' background tone while on a dark theme,
                  // switch to Light theme to prevent contrast issues
                  if (tone === 'light' && theme !== 'light') {
                    setTheme('light')
                  }
                }}
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
        <div className="flex flex-wrap gap-2 mb-4">
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

        {/* Background style opacity slider */}
        {background !== 'none' && (
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 flex items-center justify-between">
              <span>Style Opacity</span>
              <span className="font-mono">{backgroundStyleOpacity}%</span>
            </label>
            <Slider
              value={[backgroundStyleOpacity]}
              onValueChange={([value]) => setBackgroundStyleOpacity(value)}
              min={0}
              max={100}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Reduce opacity to reveal custom media backgrounds underneath.
            </p>
          </div>
        )}
      </div>

      {/* Custom Background Media */}
      <div>
        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-3">
          <Image className="h-4 w-4" />
          Custom Background Media
        </label>
        <p className="text-xs text-muted-foreground mb-4">
          Add a custom image or video background that displays behind all content.
        </p>

        {/* Type selector */}
        <div className="flex flex-wrap gap-2 mb-4">
          {backgroundTypes.map((type) => {
            const Icon = type.icon
            const isSelected = backgroundType === type.value
            return (
              <button
                key={type.value}
                onClick={() => setBackgroundType(type.value)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  "border focus:outline-none focus:ring-2 focus:ring-primary/50",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background/50 text-muted-foreground border-border/50 hover:bg-primary/10 hover:text-foreground hover:border-primary/30"
                )}
              >
                <Icon className="h-4 w-4" />
                {type.label}
              </button>
            )
          })}
        </div>

        {/* URL input (shown when type is not 'none') */}
        {backgroundType !== 'none' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">
                {backgroundType === 'image' ? 'Image' : 'Video'} URL
              </label>
              <Input
                type="url"
                placeholder={backgroundType === 'image'
                  ? "https://example.com/background.jpg"
                  : "https://example.com/background.mp4"
                }
                value={backgroundUrl}
                onChange={(e) => setBackgroundUrl(e.target.value)}
                className="bg-black/10 dark:bg-white/10 border-border text-foreground placeholder:text-muted-foreground"
              />
              {mediaError && (
                <p className="text-xs text-destructive flex items-center gap-1 mt-1.5">
                  <AlertCircle className="h-3 w-3" />
                  Failed to load {backgroundType}. Check the URL.
                </p>
              )}
            </div>

            {/* Opacity slider */}
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 flex items-center justify-between">
                <span>Opacity</span>
                <span className="font-mono">{backgroundOpacity}%</span>
              </label>
              <Slider
                value={[backgroundOpacity]}
                onValueChange={([value]) => setBackgroundOpacity(value)}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Lower values are more subtle. Recommended: 15-30%
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
