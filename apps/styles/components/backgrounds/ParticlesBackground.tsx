'use client'

import React, { useEffect, useRef, useState } from 'react'

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  shape: 'circle' | 'square' | 'triangle'
  rotation: number
  rotationSpeed: number
  opacity: number
}

interface ParticlesBackgroundProps {
  speed?: number
  opacity?: number
}

export const ParticlesBackground: React.FC<ParticlesBackgroundProps> = ({
  speed = 1,
  opacity = 1
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number | undefined>(undefined)
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
          secondary: 'rgba(245, 158, 11, '
        }
      case 'carbon':
        return {
          primary: 'rgba(148, 163, 184, ',
          secondary: 'rgba(100, 116, 139, '
        }
      default: // terminal
        return {
          primary: 'rgba(16, 185, 129, ',
          secondary: 'rgba(6, 182, 212, '
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

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Initialize particles
    const particleCount = Math.min(window.innerWidth / 20, 50)
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5 * speed,
      speedY: (Math.random() - 0.5) * 0.5 * speed,
      shape: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)] as Particle['shape'],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      opacity: Math.random() * 0.5 + 0.3
    }))

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const colors = getThemeColors()

      particlesRef.current.forEach(particle => {
        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY
        particle.rotation += particle.rotationSpeed

        // Parallax effect based on mouse position
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDistance = 200

        if (distance < maxDistance) {
          const force = (1 - distance / maxDistance) * 0.01
          particle.x += dx * force
          particle.y += dy * force
        }

        // Wrap around edges
        if (particle.x < -50) particle.x = canvas.width + 50
        if (particle.x > canvas.width + 50) particle.x = -50
        if (particle.y < -50) particle.y = canvas.height + 50
        if (particle.y > canvas.height + 50) particle.y = -50

        // Draw particle
        ctx.save()
        ctx.translate(particle.x, particle.y)
        ctx.rotate(particle.rotation)
        ctx.globalAlpha = particle.opacity * opacity

        // Set color with glow effect
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, particle.size * 3)
        gradient.addColorStop(0, colors.primary + '0.8)')
        gradient.addColorStop(0.5, colors.secondary + '0.4)')
        gradient.addColorStop(1, colors.primary + '0)')

        ctx.fillStyle = gradient

        switch (particle.shape) {
          case 'circle':
            ctx.beginPath()
            ctx.arc(0, 0, particle.size, 0, Math.PI * 2)
            ctx.fill()
            break
          case 'square':
            ctx.fillRect(-particle.size, -particle.size, particle.size * 2, particle.size * 2)
            break
          case 'triangle':
            ctx.beginPath()
            ctx.moveTo(0, -particle.size)
            ctx.lineTo(particle.size, particle.size)
            ctx.lineTo(-particle.size, particle.size)
            ctx.closePath()
            ctx.fill()
            break
        }

        ctx.restore()
      })

      // Draw connections between nearby particles
      ctx.strokeStyle = colors.primary + '0.1)'
      ctx.lineWidth = 0.5

      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i]
          const p2 = particlesRef.current[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.globalAlpha = (1 - distance / 150) * 0.2 * opacity
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
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
      window.removeEventListener('mousemove', handleMouseMove)
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