'use client'

import React, { useEffect } from 'react'
import { useBackground } from './BackgroundProvider'
import { usePageBackground } from '@/hooks/usePageBackground'

export function MasterBackground() {
  const { background } = useBackground()
  const {
    backgroundUrl,
    backgroundType,
    backgroundOpacity,
    backgroundStyleOpacity,
    showMedia,
    handleMediaError,
  } = usePageBackground()

  const mediaOpacity = backgroundOpacity / 100
  const styleOpacity = backgroundStyleOpacity / 100

  // Set CSS variable for body background opacity when custom media is active
  useEffect(() => {
    const root = document.documentElement
    if (showMedia) {
      // When custom media is active, body background should also respect style opacity
      root.style.setProperty('--body-bg-opacity', String(styleOpacity))
    } else {
      // When no custom media, body background is fully opaque
      root.style.setProperty('--body-bg-opacity', '1')
    }
    return () => {
      root.style.removeProperty('--body-bg-opacity')
    }
  }, [showMedia, styleOpacity])

  // Map background type to CSS class
  const bgClass = {
    gradient: 'bg-style-gradient',
    mesh: 'bg-style-mesh',
    textured: 'bg-style-textured',
    minimal: 'bg-style-minimal',
    none: null
  }[background]

  return (
    <>
      {/* Base gradient/mesh/textured background */}
      {bgClass && (
        <div
          className={bgClass}
          style={{ opacity: styleOpacity }}
          aria-hidden="true"
        />
      )}

      {/* Custom media background (image/video) - z-[-2] to sit behind body::before (z-[-1]) */}
      {showMedia && backgroundType === 'image' && (
        <img
          className="fixed inset-0 w-full h-full object-cover pointer-events-none z-[-2]"
          style={{ opacity: mediaOpacity }}
          src={backgroundUrl}
          alt=""
          onError={handleMediaError}
        />
      )}
      {showMedia && backgroundType === 'video' && (
        <video
          className="fixed inset-0 w-full h-full object-cover pointer-events-none z-[-2]"
          style={{ opacity: mediaOpacity }}
          src={backgroundUrl}
          autoPlay
          loop
          muted
          playsInline
          onError={handleMediaError}
        />
      )}
    </>
  )
}
