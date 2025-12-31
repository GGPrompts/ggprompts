'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Customization } from '@/types/customization';

type ParallaxScrollProps = {
  customization: Customization;
};

export function ParallaxScroll({ customization }: ParallaxScrollProps) {
  const parallaxSpeed = parseFloat(customization.parallaxSpeed) || 0.5;
  const layerCount = parseInt(customization.layerCount) || 3;
  const parallaxDirection = customization.parallaxDirection || 'vertical';
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const blurAmount = parseInt(customization.blurAmount || '12') || 12;
  const opacityHex = Math.round(glassOpacity * 2.55).toString(16).padStart(2, '0');

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const baseStyle = {
    fontFamily: customization.fontFamily,
  };

  // Generate layer configurations
  const layers = Array.from({ length: layerCount }, (_, i) => {
    const layerIndex = i + 1;
    const speed = parallaxSpeed * (layerIndex / layerCount);
    const opacity = 0.3 + (i / layerCount) * 0.7;
    const scale = 0.6 + (i / layerCount) * 0.4;

    return {
      speed,
      opacity,
      scale,
      elements: 3 + i,
    };
  });

  return (
    <div
      ref={containerRef}
      className="w-full h-96 relative overflow-hidden rounded-xl"
      style={{
        backgroundColor: customization.backgroundColor,
        ...baseStyle,
      }}
    >
      {/* Info overlay */}
      <div className="absolute top-4 left-4 z-20 p-3 rounded-lg" style={{ backgroundColor: `${customization.backgroundColor}${opacityHex}`, backdropFilter: `blur(${blurAmount}px)` }}>
        <p className="text-xs" style={{ color: customization.textColor }}>
          Speed: {(parallaxSpeed * 100).toFixed(0)}% | Layers: {layerCount} | Direction: {parallaxDirection}
        </p>
      </div>

      {/* Parallax layers */}
      {layers.map((layer, layerIndex) => {
        const isVertical = parallaxDirection === 'vertical';
        const movement = 100 * layer.speed;

        return (
          <ParallaxLayer
            key={layerIndex}
            scrollProgress={scrollYProgress}
            movement={movement}
            isVertical={isVertical}
          >
            <div
              className="absolute inset-0"
              style={{ opacity: layer.opacity }}
            >
              {/* Layer elements */}
              {Array.from({ length: layer.elements }).map((_, elemIndex) => {
                const xPos = 10 + (elemIndex * 30) % 80;
                const yPos = 15 + ((layerIndex * 25) + (elemIndex * 20)) % 70;
                const size = 40 + layerIndex * 20;

                return (
                  <motion.div
                    key={elemIndex}
                    className="absolute rounded-lg"
                    style={{
                      left: `${xPos}%`,
                      top: `${yPos}%`,
                      width: size,
                      height: size,
                      background: `linear-gradient(135deg, ${customization.primaryColor}${Math.round(layer.opacity * 255).toString(16).padStart(2, '0')}, ${customization.secondaryColor}${Math.round(layer.opacity * 255).toString(16).padStart(2, '0')})`,
                      border: `1px solid ${customization.primaryColor}40`,
                      transform: `scale(${layer.scale})`,
                    }}
                    animate={{
                      rotate: [0, 5, 0, -5, 0],
                    }}
                    transition={{
                      duration: 8 + layerIndex * 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                );
              })}

              {/* Decorative circles */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  right: `${10 + layerIndex * 15}%`,
                  bottom: `${20 + layerIndex * 10}%`,
                  width: 60 + layerIndex * 30,
                  height: 60 + layerIndex * 30,
                  border: `2px solid ${customization.primaryColor}${Math.round(layer.opacity * 128).toString(16).padStart(2, '0')}`,
                }}
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 4 + layerIndex,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>
          </ParallaxLayer>
        );
      })}

      {/* Center content - fixed position */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div
          className="text-center p-8 rounded-2xl"
          style={{
            backgroundColor: `${customization.backgroundColor}${opacityHex}`,
            backdropFilter: `blur(${blurAmount}px)`,
            border: `1px solid ${customization.primaryColor}30`,
          }}
        >
          <h3
            className="text-2xl font-bold mb-2"
            style={{ color: customization.textColor }}
          >
            Parallax Effect
          </h3>
          <p
            className="text-sm opacity-70"
            style={{ color: customization.textColor }}
          >
            Scroll to see {layerCount} layers in motion
          </p>
        </div>
      </div>

      {/* Gradient overlays */}
      <div
        className="absolute inset-x-0 top-0 h-20 z-10 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, ${customization.backgroundColor}, transparent)`,
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-20 z-10 pointer-events-none"
        style={{
          background: `linear-gradient(to top, ${customization.backgroundColor}, transparent)`,
        }}
      />
    </div>
  );
}

// Helper component for parallax movement
type ParallaxLayerProps = {
  children: React.ReactNode;
  scrollProgress: ReturnType<typeof useScroll>['scrollYProgress'];
  movement: number;
  isVertical: boolean;
};

function ParallaxLayer({ children, scrollProgress, movement, isVertical }: ParallaxLayerProps) {
  const transform = useTransform(
    scrollProgress,
    [0, 1],
    isVertical ? [`${movement}px`, `-${movement}px`] : ['0px', '0px']
  );

  const transformX = useTransform(
    scrollProgress,
    [0, 1],
    !isVertical ? [`${movement}px`, `-${movement}px`] : ['0px', '0px']
  );

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        y: transform,
        x: transformX,
      }}
    >
      {children}
    </motion.div>
  );
}
