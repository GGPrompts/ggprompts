'use client'

import React, { useState, useEffect } from 'react'
import { useBackground } from './BackgroundProvider'
import { SpaceBackground } from './SpaceBackground'

function MediaBackground() {
  const { mediaBackground } = useBackground()
  const [mediaError, setMediaError] = useState(false)

  // Reset error state when URL changes
  useEffect(() => {
    setMediaError(false)
  }, [mediaBackground.url])

  const showMedia = mediaBackground.type !== 'none' && mediaBackground.url && !mediaError
  const mediaOpacity = mediaBackground.opacity / 100

  if (!showMedia) return null

  const handleError = () => setMediaError(true)

  if (mediaBackground.type === 'image') {
    return (
      <img
        key={mediaBackground.url}
        className="fixed inset-0 w-full h-full object-cover pointer-events-none"
        style={{ opacity: mediaOpacity, zIndex: -2 }}
        src={mediaBackground.url}
        alt=""
        onError={handleError}
      />
    )
  }

  if (mediaBackground.type === 'video') {
    return (
      <video
        key={mediaBackground.url}
        className="fixed inset-0 w-full h-full object-cover pointer-events-none"
        style={{ opacity: mediaOpacity, zIndex: -2 }}
        src={mediaBackground.url}
        autoPlay
        loop
        muted
        playsInline
        onError={handleError}
      />
    )
  }

  return null
}

export function MasterBackground() {
  const { background } = useBackground()

  // Map background type to CSS class
  const bgClass = {
    gradient: 'bg-style-gradient',
    mesh: 'bg-style-mesh',
    textured: 'bg-style-textured',
    minimal: 'bg-style-minimal',
    stars: null,
    none: null
  }[background]

  return (
    <>
      {/* Custom media layer - rendered UNDER everything else */}
      <MediaBackground />

      {/* Animated stars background */}
      {background === 'stars' && <SpaceBackground speed={0.5} opacity={1} />}

      {/* CSS-based background styles */}
      {bgClass && <div className={bgClass} aria-hidden="true" />}
    </>
  )
}
