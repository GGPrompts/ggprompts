'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { Customization } from '@/types/customization';

type CursorFollowProps = {
  customization: Customization;
};

export function CursorFollow({ customization }: CursorFollowProps) {
  const trailLength = parseInt(customization.trailLength) || 8;
  const cursorSize = parseInt(customization.cursorSize) || 20;
  const cursorBlendMode = customization.cursorBlendMode || 'screen';

  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [trailPositions, setTrailPositions] = useState<Array<{ x: number; y: number }>>([]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 300 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseX.set(x);
      mouseY.set(y);

      setTrailPositions(prev => {
        const newPositions = [...prev, { x, y }];
        return newPositions.slice(-trailLength);
      });
    };

    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, trailLength]);

  const baseStyle = {
    fontFamily: customization.fontFamily,
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-80 relative overflow-hidden rounded-xl"
      style={{
        backgroundColor: customization.backgroundColor,
        ...baseStyle,
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setTrailPositions([]);
      }}
    >
      {/* Background content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h3
            className="text-2xl font-bold"
            style={{ color: customization.textColor }}
          >
            Move your cursor
          </h3>
          <p
            className="text-sm opacity-60"
            style={{ color: customization.textColor }}
          >
            Trail Length: {trailLength} | Size: {cursorSize}px | Blend: {cursorBlendMode}
          </p>
        </div>
      </div>

      {/* Grid pattern background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(${customization.primaryColor}40 1px, transparent 1px),
                           linear-gradient(90deg, ${customization.primaryColor}40 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />

      {/* Trail elements */}
      {isHovering && trailPositions.map((pos, index) => {
        const scale = (index + 1) / trailLength;
        const opacity = scale * 0.8;
        const size = cursorSize * scale;

        return (
          <motion.div
            key={index}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: size,
              height: size,
              x: pos.x - size / 2,
              y: pos.y - size / 2,
              backgroundColor: customization.primaryColor,
              opacity,
              mixBlendMode: cursorBlendMode as React.CSSProperties['mixBlendMode'],
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.1 }}
          />
        );
      })}

      {/* Main cursor */}
      {isHovering && (
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: cursorSize,
            height: cursorSize,
            x: cursorX,
            y: cursorY,
            translateX: -cursorSize / 2,
            translateY: -cursorSize / 2,
            background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
            mixBlendMode: cursorBlendMode as React.CSSProperties['mixBlendMode'],
            boxShadow: `0 0 20px ${customization.primaryColor}80, 0 0 40px ${customization.primaryColor}40`,
          }}
        />
      )}

      {/* Floating decorative elements */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-16 h-16 rounded-lg"
          style={{
            background: `linear-gradient(135deg, ${customization.primaryColor}20, ${customization.secondaryColor}20)`,
            border: `1px solid ${customization.primaryColor}30`,
            left: `${15 + i * 18}%`,
            top: `${20 + (i % 2) * 40}%`,
          }}
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
