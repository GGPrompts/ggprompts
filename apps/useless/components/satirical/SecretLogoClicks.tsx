'use client'

import { useState, useEffect, useCallback, type ReactNode } from 'react'
import { toast } from 'sonner'

interface SecretLogoClicksProps {
  children: ReactNode
}

const CLICK_MILESTONES = {
  10: {
    message: "SECRET DISCOUNT UNLOCKED: $0.00 OFF!",
    description: "You're welcome.",
  },
  20: {
    message: "Stop clicking. The logo is getting tired.",
    description: "Seriously, it needs a break.",
  },
  30: {
    message: "The logo is starting to question its existence.",
    description: "Are we all just pixels in someone's simulation?",
  },
  42: {
    message: "You found the meaning of life!",
    description: "It's 42. Now stop clicking.",
  },
  50: {
    message: "Achievement Unlocked: Persistent Clicker",
    description: "Your dedication to uselessness is impressive.",
  },
  69: {
    message: "Nice.",
    description: "Nice.",
  },
  100: {
    message: "LEGENDARY STATUS ACHIEVED",
    description: "You've clicked 100 times. Your parents would be... confused.",
  },
  150: {
    message: "The logo has filed a restraining order.",
    description: "Please maintain a 50-pixel distance.",
  },
  200: {
    message: "You've unlocked: Nothing Special",
    description: "But here's a virtual high-five anyway.",
  },
  256: {
    message: "Buffer overflow detected!",
    description: "Just kidding. But you're definitely overflowing with free time.",
  },
  300: {
    message: "MAXIMUM USELESSNESS ACHIEVED",
    description: "There's nothing more to unlock. You've peaked.",
  },
} as const

const STORAGE_KEY = 'useless-logo-clicks'

export function SecretLogoClicks({ children }: SecretLogoClicksProps) {
  const [clickCount, setClickCount] = useState(0)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load click count from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (stored) {
      const count = parseInt(stored, 10)
      if (!isNaN(count)) {
        setClickCount(count)
      }
    }
    setIsHydrated(true)
  }, [])

  // Save click count to sessionStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      sessionStorage.setItem(STORAGE_KEY, clickCount.toString())
    }
  }, [clickCount, isHydrated])

  const handleClick = useCallback(() => {
    const newCount = clickCount + 1
    setClickCount(newCount)

    // Check if we hit a milestone
    const milestone = CLICK_MILESTONES[newCount as keyof typeof CLICK_MILESTONES]
    if (milestone) {
      toast.success(milestone.message, {
        description: milestone.description,
        duration: 5000,
        className: 'border-primary/50',
      })
    }

    // Console easter eggs for the extra curious
    if (newCount === 1) {
      console.log('%c[Useless.io] You clicked the logo!', 'color: #10b981')
    } else if (newCount === 10) {
      console.log('%c[Useless.io] 10 clicks! Keep going...', 'color: #10b981')
    } else if (newCount === 50) {
      console.log(
        '%c[Useless.io] Achievement unlocked! You are truly dedicated to clicking things.',
        'color: #f59e0b; font-weight: bold'
      )
    } else if (newCount === 100) {
      console.log(
        '%c[Useless.io] 100 CLICKS! You absolute legend!',
        'color: #ef4444; font-weight: bold; font-size: 16px'
      )
      console.log(
        '%c    _____  _____  _____  \n   |  _  ||  _  ||  _  | \n   |___  ||___  ||___  | \n   |_____||_____||_____| ',
        'color: #10b981'
      )
    } else if (newCount >= 300 && newCount % 100 === 0) {
      console.log(
        `%c[Useless.io] ${newCount} clicks. You've transcended uselessness.`,
        'color: #a855f7; font-weight: bold'
      )
    }
  }, [clickCount])

  return (
    <span
      onClick={handleClick}
      className="cursor-pointer inline-flex"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
      aria-label="Logo (click for secrets)"
    >
      {children}
    </span>
  )
}
