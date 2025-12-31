'use client'

import React, { useEffect, useRef, useState } from 'react'

interface Wave {
  amplitude: number
  frequency: number
  speed: number
  phase: number
  yOffset: number
  opacity: number
}

interface WavesBackgroundProps {
  speed?: number
  opacity?: number
}

export const WavesBackground: React.FC<WavesBackgroundProps> = ({
  speed = 1,
  opacity = 1
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const timeRef = useRef(0)
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
  const getThemeColors = () => {
    switch (theme) {
      case 'amber':
        return {
          primary: 'rgba(251, 191, 36, ',
          secondary: 'rgba(245, 158, 11, ',
          tertiary: 'rgba(217, 119, 6, '
        }
      case 'carbon':
        return {
          primary: 'rgba(148, 163, 184, ',
          secondary: 'rgba(100, 116, 139, ',
          tertiary: 'rgba(71, 85, 105, '
        }
      default: // terminal
        return {
          primary: 'rgba(16, 185, 129, ',
          secondary: 'rgba(6, 182, 212, ',
          tertiary: 'rgba(20, 184, 166, '
        }
    }
  }

  useEffect(() => {
    // Don't run animation in light theme
    if (theme === 'light') return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Define waves
    const waves: Wave[] = [
      {
        amplitude: 50,
        frequency: 0.002,
        speed: 0.01 * speed,
        phase: 0,
        yOffset: 0.3,
        opacity: 0.3
      },
      {
        amplitude: 40,
        frequency: 0.003,
        speed: 0.015 * speed,
        phase: Math.PI / 3,
        yOffset: 0.4,
        opacity: 0.25
      },
      {
        amplitude: 30,
        frequency: 0.004,
        speed: 0.02 * speed,
        phase: Math.PI / 2,
        yOffset: 0.5,
        opacity: 0.2
      },
      {
        amplitude: 35,
        frequency: 0.0025,
        speed: 0.012 * speed,
        phase: Math.PI,
        yOffset: 0.6,
        opacity: 0.15
      },
      {
        amplitude: 25,
        frequency: 0.0035,
        speed: 0.018 * speed,
        phase: Math.PI * 1.5,
        yOffset: 0.7,
        opacity: 0.1
      }
    ]

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const colors = getThemeColors()

      // Draw each wave
      waves.forEach((wave, index) => {
        ctx.beginPath()

        // Start from left edge
        ctx.moveTo(0, canvas.height)

        // Draw wave path
        for (let x = 0; x <= canvas.width; x += 5) {
          const y = canvas.height * wave.yOffset +
                   Math.sin(x * wave.frequency + timeRef.current * wave.speed + wave.phase) * wave.amplitude +
                   Math.sin(x * wave.frequency * 2 + timeRef.current * wave.speed * 0.5) * (wave.amplitude * 0.3)

          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }

        // Complete the path
        ctx.lineTo(canvas.width, canvas.height)
        ctx.lineTo(0, canvas.height)
        ctx.closePath()

        // Create gradient fill
        const gradient = ctx.createLinearGradient(0, canvas.height * wave.yOffset - wave.amplitude, 0, canvas.height)
        const colorKey = index === 0 ? 'primary' : index === 1 ? 'secondary' : 'tertiary'
        const color = colors[colorKey as keyof typeof colors]

        gradient.addColorStop(0, color + (wave.opacity * 0.8) + ')')
        gradient.addColorStop(0.5, color + (wave.opacity * 0.4) + ')')
        gradient.addColorStop(1, color + '0)')

        ctx.fillStyle = gradient
        ctx.globalAlpha = opacity
        ctx.fill()

        // Add glow effect for the top line
        ctx.strokeStyle = color + (wave.opacity * 2) + ')'
        ctx.lineWidth = 2
        ctx.globalAlpha = opacity * 0.6
        ctx.beginPath()

        for (let x = 0; x <= canvas.width; x += 5) {
          const y = canvas.height * wave.yOffset +
                   Math.sin(x * wave.frequency + timeRef.current * wave.speed + wave.phase) * wave.amplitude +
                   Math.sin(x * wave.frequency * 2 + timeRef.current * wave.speed * 0.5) * (wave.amplitude * 0.3)

          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }

        ctx.stroke()
      })

      // Add floating particles on waves
      const particleCount = 20
      ctx.globalAlpha = opacity * 0.4

      for (let i = 0; i < particleCount; i++) {
        const x = (canvas.width / particleCount) * i + Math.sin(timeRef.current * 0.01 + i) * 20
        const waveIndex = Math.floor(Math.random() * 3)
        const wave = waves[waveIndex]
        const y = canvas.height * wave.yOffset +
                 Math.sin(x * wave.frequency + timeRef.current * wave.speed + wave.phase) * wave.amplitude

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 3)
        gradient.addColorStop(0, colors.secondary + '0.8)')
        gradient.addColorStop(1, colors.secondary + '0)')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, 2 + Math.sin(timeRef.current * 0.05 + i) * 1, 0, Math.PI * 2)
        ctx.fill()
      }

      timeRef.current += 1
      animationRef.current = requestAnimationFrame(animate)
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!prefersReducedMotion) {
      animate()
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [speed, opacity, theme])

  // Don't render in light theme
  if (theme === 'light') return null

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ opacity }}
      />
    </div>
  )
}