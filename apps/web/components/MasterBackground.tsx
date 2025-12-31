'use client'

import React, { useState } from 'react'
import { useBackground } from './BackgroundProvider'
import { SpaceBackground } from './SpaceBackground'

export function MasterBackground() {
  const {
    background,
    backgroundUrl,
    backgroundMediaType,
    backgroundOpacity
  } = useBackground()

  const [mediaError, setMediaError] = useState(false)

  // Reset error when URL changes
  React.useEffect(() => {
    setMediaError(false)
  }, [backgroundUrl])

  // Check if custom URL background should be shown
  const showCustomMedia = backgroundMediaType !== 'none' && backgroundUrl && !mediaError
  const mediaOpacityValue = backgroundOpacity / 100

  // Render animated stars background
  if (background === 'stars' && !showCustomMedia) {
    return <SpaceBackground speed={0.5} opacity={1} />
  }

  // Map background type to CSS class
  const bgClass = {
    gradient: 'bg-style-gradient',
    mesh: 'bg-style-mesh',
    textured: 'bg-style-textured',
    minimal: 'bg-style-minimal',
    stars: null, // handled separately with SpaceBackground component
    none: null
  }[background]

  return (
    <>
      {/* CSS background layer */}
      {bgClass && <div className={bgClass} aria-hidden="true" />}

      {/* Custom URL background layer (renders on top with its own opacity) */}
      {showCustomMedia && backgroundMediaType === 'image' && (
        <img
          className="fixed inset-0 w-full h-full object-cover pointer-events-none z-0"
          style={{ opacity: mediaOpacityValue }}
          src={backgroundUrl}
          alt=""
          onError={() => setMediaError(true)}
          aria-hidden="true"
        />
      )}
      {showCustomMedia && backgroundMediaType === 'video' && (
        <video
          className="fixed inset-0 w-full h-full object-cover pointer-events-none z-0"
          style={{ opacity: mediaOpacityValue }}
          src={backgroundUrl}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setMediaError(true)}
          aria-hidden="true"
        />
      )}
    </>
  )
}
