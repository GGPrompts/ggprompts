'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

interface FloatingCardProps {
  children: React.ReactNode
  className?: string
}

export function FloatingCard({ children, className }: FloatingCardProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-100, 100], [5, -5]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-100, 100], [-5, 5]), { stiffness: 300, damping: 30 })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
    if (isMobile) return
    const rect = event.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set(event.clientX - centerX)
    y.set(event.clientY - centerY)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  // On mobile, render without 3D transforms to prevent overflow issues
  if (isMobile) {
    return (
      <div className={cn('relative', className)}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={cn('relative', className)}
    >
      <div style={{ transform: 'translateZ(20px)' }}>
        {children}
      </div>
    </motion.div>
  )
}
