'use client'

import { cn } from '@/lib/utils'
import { Home } from 'lucide-react'

interface LogoProps {
  size?: 'small' | 'medium' | 'large'
  className?: string
  showText?: boolean
  showHomeIcon?: boolean
  layout?: 'horizontal' | 'stacked'
}

// Theme-aware logo icon using CSS mask
function LogoIcon({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'logo-icon-gradient animate-gradient',
        className
      )}
      style={{
        maskImage: 'url(/ggprompts-logo.svg)',
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskImage: 'url(/ggprompts-logo.svg)',
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
      }}
      aria-hidden="true"
    />
  )
}

export function Logo({
  size = 'medium',
  className,
  showText = true,
  showHomeIcon = false,
  layout = 'stacked'
}: LogoProps) {
  const sizeClasses = {
    small: {
      image: 'w-7 h-7',
      text: 'text-sm',
      cursor: 'text-sm',
      homeIcon: 'w-3 h-3',
    },
    medium: {
      image: 'w-12 h-12',
      text: 'text-xl',
      cursor: 'text-xl',
      homeIcon: 'w-3.5 h-3.5',
    },
    large: {
      image: 'w-16 h-16',
      text: 'text-3xl',
      cursor: 'text-3xl',
      homeIcon: 'w-4 h-4',
    },
  }

  const s = sizeClasses[size]

  if (layout === 'stacked') {
    return (
      <div className={cn('flex items-center gap-2 group', className)}>
        <div className="flex flex-col items-center">
          <LogoIcon className={cn(s.image, 'group-hover:scale-105 transition-transform')} />
          {showText && (
            <span className={cn('font-bold tracking-wider flex items-center -mt-1', s.text)}>
              <span className="gradient-text-theme animate-gradient">PROMPTS</span>
              <span
                className={cn(
                  'font-light animate-cursor-blink gradient-text-theme',
                  s.cursor
                )}
                aria-hidden="true"
              >
                _
              </span>
            </span>
          )}
        </div>
        {showHomeIcon && (
          <Home
            className={cn(s.homeIcon, 'text-muted-foreground group-hover:text-primary transition-colors')}
            aria-label="Home"
          />
        )}
      </div>
    )
  }

  // Horizontal layout
  return (
    <div className={cn('flex items-center gap-2 group', className)}>
      <LogoIcon className={cn(s.image, 'group-hover:scale-105 transition-transform')} />
      {showText && (
        <span className={cn('font-bold flex items-center', s.text)}>
          <span className="gradient-text-theme animate-gradient">PROMPTS</span>
          <span
            className={cn(
              'font-light ml-0.5 animate-cursor-blink gradient-text-theme',
              s.cursor
            )}
            aria-hidden="true"
          >
            _
          </span>
        </span>
      )}
      {showHomeIcon && (
        <Home
          className={cn(s.homeIcon, 'text-muted-foreground group-hover:text-primary transition-colors ml-1')}
          aria-label="Home"
        />
      )}
    </div>
  )
}
