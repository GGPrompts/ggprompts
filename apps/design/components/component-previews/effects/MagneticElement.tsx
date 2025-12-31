'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { Magnet, MousePointer, Sparkles, Zap } from 'lucide-react';
import { Customization } from '@/types/customization';

type MagneticElementProps = {
  customization: Customization;
};

export function MagneticElement({ customization }: MagneticElementProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for cursor position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for smooth follow
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  // Rotation based on position
  const rotateX = useTransform(y, [-50, 50], [10, -10]);
  const rotateY = useTransform(x, [-50, 50], [-10, 10]);

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate distance from center (capped)
    const distanceX = Math.max(-50, Math.min(50, (e.clientX - centerX) * 0.3));
    const distanceY = Math.max(-50, Math.min(50, (e.clientY - centerY) * 0.3));

    mouseX.set(distanceX);
    mouseY.set(distanceY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <div className="w-full max-w-md" style={baseStyle}>
      {/* Main Magnetic Card */}
      <div
        ref={ref}
        className="relative perspective-1000"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{ perspective: '1000px' }}
      >
        <motion.div
          className="relative p-8 rounded-2xl border overflow-hidden cursor-none"
          style={{
            backgroundColor: customization.backgroundColor,
            borderColor: `${customization.primaryColor}30`,
            x,
            y,
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
            boxShadow: `0 20px 50px ${customization.primaryColor}20`,
          }}
          whileHover={{
            boxShadow: `0 30px 60px ${customization.primaryColor}40`,
          }}
        >
          {/* Gradient background */}
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${customization.primaryColor}, transparent 70%)`,
            }}
            animate={{
              background: isHovered
                ? `radial-gradient(circle at ${50 + mouseX.get()}% ${50 + mouseY.get()}%, ${customization.primaryColor}, transparent 70%)`
                : `radial-gradient(circle at 50% 50%, ${customization.primaryColor}, transparent 70%)`,
            }}
          />

          {/* Icon */}
          <motion.div
            className="relative w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${customization.primaryColor}30, ${customization.secondaryColor}30)`,
              transformStyle: 'preserve-3d',
              transform: 'translateZ(30px)',
            }}
          >
            <Magnet className="w-8 h-8" style={{ color: customization.primaryColor }} />
          </motion.div>

          {/* Content */}
          <div
            className="relative text-center"
            style={{ transformStyle: 'preserve-3d', transform: 'translateZ(20px)' }}
          >
            <h3
              className="text-xl font-bold mb-2"
              style={{ color: customization.textColor }}
            >
              Magnetic Effect
            </h3>
            <p
              className="text-sm opacity-70"
              style={{ color: customization.textColor }}
            >
              Move your cursor around to see the magnetic pull effect
            </p>
          </div>

          {/* Floating particles */}
          {isHovered && (
            <>
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: customization.primaryColor,
                    left: `${20 + i * 15}%`,
                    top: `${30 + (i % 3) * 20}%`,
                  }}
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.3, 0.8, 0.3],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </>
          )}
        </motion.div>
      </div>

      {/* Magnetic Buttons */}
      <div className="flex justify-center gap-4 mt-8">
        {[
          { icon: MousePointer, label: 'Cursor' },
          { icon: Sparkles, label: 'Magic' },
          { icon: Zap, label: 'Power' },
        ].map((item, index) => {
          const Icon = item.icon;
          return (
            <MagneticButton
              key={item.label}
              customization={customization}
              index={index}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </MagneticButton>
          );
        })}
      </div>

      {/* Instructions */}
      <motion.p
        className="text-center text-xs mt-6 opacity-50"
        style={{ color: customization.textColor }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.5 }}
      >
        Elements follow your cursor with spring physics
      </motion.p>
    </div>
  );
}

// Reusable Magnetic Button Component
function MagneticButton({
  customization,
  children,
  index,
}: {
  customization: Customization;
  children: React.ReactNode;
  index: number;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 200, damping: 20 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    x.set((e.clientX - centerX) * 0.4);
    y.set((e.clientY - centerY) * 0.4);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      className="w-16 h-16 rounded-xl flex flex-col items-center justify-center border"
      style={{
        backgroundColor: `${customization.primaryColor}10`,
        borderColor: `${customization.primaryColor}30`,
        color: customization.primaryColor,
        x: springX,
        y: springY,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{
        scale: 1.1,
        backgroundColor: `${customization.primaryColor}20`,
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      {children}
    </motion.button>
  );
}
