'use client'

import { useState } from 'react'
import { useBackground } from './BackgroundProvider'

export function BackgroundLayer() {
  const { backgroundUrl, backgroundType, backgroundOpacity } = useBackground()
  const [mediaError, setMediaError] = useState(false)

  const showMedia = backgroundType !== 'none' && backgroundUrl && !mediaError
  const opacity = backgroundOpacity / 100

  if (!showMedia) return null

  const handleError = () => {
    setMediaError(true)
  }

  // Reset error state when URL changes
  const handleLoad = () => {
    setMediaError(false)
  }

  return (
    <>
      {backgroundType === 'image' && (
        <img
          key={backgroundUrl}
          className="fixed inset-0 w-full h-full object-cover pointer-events-none z-0"
          style={{ opacity }}
          src={backgroundUrl}
          alt=""
          onError={handleError}
          onLoad={handleLoad}
        />
      )}
      {backgroundType === 'video' && (
        <video
          key={backgroundUrl}
          className="fixed inset-0 w-full h-full object-cover pointer-events-none z-0"
          style={{ opacity }}
          src={backgroundUrl}
          autoPlay
          loop
          muted
          playsInline
          onError={handleError}
          onLoadedData={handleLoad}
        />
      )}
    </>
  )
}
