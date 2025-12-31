'use client'

import React, { useState, useEffect } from 'react'
import { useBackground, type MediaBackgroundType } from './BackgroundProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ImageIcon, Video, X, Check } from 'lucide-react'

export function BackgroundMediaSettings() {
  const { mediaBackground, setMediaBackground } = useBackground()
  const [localUrl, setLocalUrl] = useState(mediaBackground.url)
  const [isOpen, setIsOpen] = useState(false)

  // Sync local URL state when popover opens
  useEffect(() => {
    if (isOpen) {
      setLocalUrl(mediaBackground.url)
    }
  }, [isOpen, mediaBackground.url])

  const handleApplyUrl = () => {
    setMediaBackground({ url: localUrl })
  }

  const handleClearMedia = () => {
    setMediaBackground({ url: '', type: 'none', opacity: 20 })
    setLocalUrl('')
  }

  const hasActiveMedia = mediaBackground.type !== 'none' && mediaBackground.url

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`h-7 font-mono text-sm glass border-primary/30 ${hasActiveMedia ? 'text-primary' : ''}`}
        >
          {mediaBackground.type === 'video' ? (
            <Video className="h-3 w-3 mr-1" />
          ) : (
            <ImageIcon className="h-3 w-3 mr-1" />
          )}
          {hasActiveMedia ? 'Media BG' : 'Add Media'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 glass-dark border-primary/30" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-mono font-medium text-sm">Background Media</h4>
            {hasActiveMedia && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearMedia}
                className="h-6 px-2 text-xs text-destructive hover:text-destructive"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>

          {/* Media Type */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Type</Label>
            <Select
              value={mediaBackground.type}
              onValueChange={(value: MediaBackgroundType) => setMediaBackground({ type: value })}
            >
              <SelectTrigger className="h-8 text-sm glass border-primary/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="font-mono">
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="video">Video</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* URL Input */}
          {mediaBackground.type !== 'none' && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">URL (http/https)</Label>
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder={mediaBackground.type === 'video' ? 'https://example.com/video.mp4' : 'https://example.com/image.jpg'}
                  value={localUrl}
                  onChange={(e) => setLocalUrl(e.target.value)}
                  className="h-8 text-sm glass border-primary/30 flex-1"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleApplyUrl}
                  className="h-8 px-2 border-primary/30"
                  disabled={localUrl === mediaBackground.url}
                >
                  <Check className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}

          {/* Opacity Slider */}
          {mediaBackground.type !== 'none' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Opacity</Label>
                <span className="text-xs font-mono text-muted-foreground">{mediaBackground.opacity}%</span>
              </div>
              <Slider
                value={[mediaBackground.opacity]}
                onValueChange={([value]) => setMediaBackground({ opacity: value })}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Lower values keep glassmorphism visible
              </p>
            </div>
          )}

          {/* Preview hint */}
          {hasActiveMedia && (
            <p className="text-xs text-muted-foreground pt-2 border-t border-primary/20">
              Background renders behind all other effects
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
