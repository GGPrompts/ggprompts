'use client'

import { Settings, Palette, Layers, PaintBucket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTheme } from '@/components/ThemeProvider'
import { useBackground, type BackgroundTone } from '@/components/BackgroundProvider'

const toneLabels: Record<BackgroundTone, string> = {
  'charcoal': 'Charcoal',
  'deep-purple': 'Deep Purple',
  'pure-black': 'Pure Black',
  'light': 'Light',
  'ocean': 'Ocean',
  'sunset': 'Sunset',
  'forest': 'Forest',
  'midnight': 'Midnight',
  'neon-dark': 'Neon Dark',
  'slate': 'Slate'
}

export function ThemeCustomizer() {
  const { theme, setTheme } = useTheme()
  const { background, setBackground, backgroundTone, setBackgroundTone, backgroundTones } = useBackground()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="glass border-primary/30 hover:border-primary/50 h-9 w-9"
          title="Customize Theme"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 glass" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Palette className="h-3 w-3" />
              Theme
            </label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-full h-8 font-mono text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="font-mono">
                <SelectItem value="terminal">Terminal</SelectItem>
                <SelectItem value="amber">Amber</SelectItem>
                <SelectItem value="carbon">Carbon</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="ocean">Ocean</SelectItem>
                <SelectItem value="sunset">Sunset</SelectItem>
                <SelectItem value="forest">Forest</SelectItem>
                <SelectItem value="midnight">Midnight</SelectItem>
                <SelectItem value="neon">Neon</SelectItem>
                <SelectItem value="slate">Slate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <PaintBucket className="h-3 w-3" />
              Background Tone
            </label>
            <Select value={backgroundTone} onValueChange={setBackgroundTone}>
              <SelectTrigger className="w-full h-8 font-mono text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="font-mono">
                {backgroundTones.map((tone) => (
                  <SelectItem key={tone} value={tone}>
                    {toneLabels[tone]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Layers className="h-3 w-3" />
              Background Style
            </label>
            <Select value={background} onValueChange={setBackground}>
              <SelectTrigger className="w-full h-8 font-mono text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="font-mono">
                <SelectItem value="gradient">Gradient</SelectItem>
                <SelectItem value="mesh">Mesh</SelectItem>
                <SelectItem value="textured">Textured</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
