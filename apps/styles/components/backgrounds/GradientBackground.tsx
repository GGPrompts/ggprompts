'use client'

import React, { useEffect, useRef, useState } from 'react'

interface Blob {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
}

interface GradientBackgroundProps {
  speed?: number
  opacity?: number
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  speed = 1,
  opacity = 1
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const blobsRef = useRef<Blob[]>([])
  const offCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const offCtxRef = useRef<CanvasRenderingContext2D | null>(null)
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
        return [
          'rgba(251, 191, 36, 0.3)',
          'rgba(245, 158, 11, 0.3)',
          'rgba(217, 119, 6, 0.3)',
          'rgba(180, 83, 9, 0.3)'
        ]
      case 'carbon':
        return [
          'rgba(148, 163, 184, 0.3)',
          'rgba(100, 116, 139, 0.3)',
          'rgba(71, 85, 105, 0.3)',
          'rgba(51, 65, 85, 0.3)'
        ]
      default: // terminal
        return [
          'rgba(16, 185, 129, 0.3)',
          'rgba(6, 182, 212, 0.3)',
          'rgba(20, 184, 166, 0.3)',
          'rgba(13, 148, 136, 0.3)'
        ]
    }
  }

  useEffect(() => {
    // Don't run animation in light theme
    if (theme === 'light') return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      // Create or resize off-screen canvas
      if (!offCanvasRef.current) {
        offCanvasRef.current = document.createElement('canvas')
      }
      offCanvasRef.current.width = canvas.width
      offCanvasRef.current.height = canvas.height
      offCtxRef.current = offCanvasRef.current.getContext('2d')

      // Initialize blobs - more blobs for better distribution on large screens
      const colors = getThemeColors()
      const blobCount = Math.min(Math.ceil(canvas.width / 400), 8) // Scale with screen width, max 8
      blobsRef.current = Array.from({ length: blobCount }, (_, index) => ({
        x: (index / blobCount) * canvas.width + (Math.random() - 0.5) * 200,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3 * speed,
        vy: (Math.random() - 0.5) * 0.3 * speed,
        radius: 150 + Math.random() * 250, // Varied sizes
        color: colors[index % colors.length]
      }))
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Animation loop
    let frameCount = 0
    const animate = () => {
      if (!ctx || !canvas || !offCtxRef.current || !offCanvasRef.current) return
      frameCount++

      // Clear canvases
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      offCtxRef.current.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw blobs
      blobsRef.current.forEach((blob, index) => {
        // Update position
        blob.x += blob.vx
        blob.y += blob.vy

        // Bounce off walls with smooth transition
        if (blob.x - blob.radius < 0) {
          blob.x = blob.radius
          blob.vx = Math.abs(blob.vx)
        }
        if (blob.x + blob.radius > canvas.width) {
          blob.x = canvas.width - blob.radius
          blob.vx = -Math.abs(blob.vx)
        }
        if (blob.y - blob.radius < 0) {
          blob.y = blob.radius
          blob.vy = Math.abs(blob.vy)
        }
        if (blob.y + blob.radius > canvas.height) {
          blob.y = canvas.height - blob.radius
          blob.vy = -Math.abs(blob.vy)
        }

        // Add slight random movement for organic feel
        blob.vx += (Math.random() - 0.5) * 0.01 * speed
        blob.vy += (Math.random() - 0.5) * 0.01 * speed

        // Limit maximum velocity
        const maxSpeed = 1 * speed
        blob.vx = Math.max(-maxSpeed, Math.min(maxSpeed, blob.vx))
        blob.vy = Math.max(-maxSpeed, Math.min(maxSpeed, blob.vy))

        // Create radial gradient for each blob
        const gradient = offCtxRef.current!.createRadialGradient(
          blob.x, blob.y, 0,
          blob.x, blob.y, blob.radius
        )

        // Update color based on current theme
        const colors = getThemeColors()
        blob.color = colors[index % colors.length]

        gradient.addColorStop(0, blob.color.replace('0.3', '0.4'))
        gradient.addColorStop(0.5, blob.color.replace('0.3', '0.2'))
        gradient.addColorStop(1, 'transparent')

        offCtxRef.current!.fillStyle = gradient
        offCtxRef.current!.fillRect(
          blob.x - blob.radius,
          blob.y - blob.radius,
          blob.radius * 2,
          blob.radius * 2
        )
      })

      // Apply gaussian blur effect by drawing multiple times with transparency
      ctx.globalAlpha = opacity * 0.8
      ctx.filter = 'blur(60px)'
      ctx.drawImage(offCanvasRef.current, 0, 0)

      ctx.filter = 'blur(30px)'
      ctx.globalAlpha = opacity * 0.4
      ctx.drawImage(offCanvasRef.current, 0, 0)

      ctx.filter = 'none'
      ctx.globalAlpha = 1

      // Add subtle noise texture (only every 5th frame for performance)
      if (frameCount % 5 === 0) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data

        // Only process every 4th pixel for better performance
        for (let i = 0; i < data.length; i += 16) {
          const noise = (Math.random() - 0.5) * 10
          data[i] += noise     // R
          data[i + 1] += noise // G
          data[i + 2] += noise // B
        }

        ctx.putImageData(imageData, 0, 0)
      }

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