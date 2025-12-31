'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function VoidPage() {
  const [showSecondText, setShowSecondText] = useState(false)
  const [showPixel, setShowPixel] = useState(false)
  const [pixelPosition, setPixelPosition] = useState({ x: 50, y: 50 })

  useEffect(() => {
    // Console messages for the curious
    console.log('%c', 'font-size: 100px')
    console.log(
      '%c/void',
      'color: #666; font-size: 24px; font-weight: bold'
    )
    console.log(
      '%cYou found the void. Congratulations.',
      'color: #444; font-size: 14px'
    )
    console.log(
      '%cThere is nothing here. Or is there? Keep watching...',
      'color: #333; font-size: 12px; font-style: italic'
    )
    console.log(
      '%c',
      'font-size: 50px'
    )
    console.log(
      '%cHINT: The escape route appears after 10 seconds. Look closely.',
      'color: #222; font-size: 10px'
    )

    // Show second text after 5 seconds
    const secondTextTimer = setTimeout(() => {
      setShowSecondText(true)
    }, 5000)

    // Show pixel after 10 seconds with random position
    const pixelTimer = setTimeout(() => {
      // Random position, keeping it at least 10% from edges
      setPixelPosition({
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 80,
      })
      setShowPixel(true)
    }, 10000)

    return () => {
      clearTimeout(secondTextTimer)
      clearTimeout(pixelTimer)
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      {/* Main content container */}
      <div className="text-center z-10">
        {/* Primary text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="text-neutral-600 text-lg font-mono select-none"
        >
          Nothing here. As expected.
        </motion.p>

        {/* Secondary text */}
        <AnimatePresence>
          {showSecondText && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 3 }}
              className="text-neutral-700 text-sm font-mono mt-4 select-none"
            >
              ...or is there?
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Hidden pixel escape route */}
      <AnimatePresence>
        {showPixel && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            style={{
              position: 'absolute',
              left: `${pixelPosition.x}%`,
              top: `${pixelPosition.y}%`,
            }}
          >
            <Link
              href="/"
              className="block w-2 h-2 bg-neutral-800 hover:bg-primary hover:scale-[3] transition-all duration-300 cursor-pointer"
              title="Escape the void"
              aria-label="Return to home page"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle void effect - barely visible gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.3) 100%)',
        }}
      />

      {/* Very subtle scan line effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        }}
      />
    </div>
  )
}
