'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Sparkles, ArrowRight, Zap, Star } from 'lucide-react';
import { Customization } from '@/types/customization';

type GlowButtonProps = {
  customization: Customization;
};

export function GlowButton({ customization }: GlowButtonProps) {
  const [hoveredButton, setHoveredButton] = useState<number | null>(null);
  const glowIntensity = parseInt(customization.glowIntensity) || 60;
  const glowSpread = parseInt(customization.glowSpread) || 40;
  const blurAmount = parseInt(customization.blurAmount) || 12;

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const buttons = [
    { label: 'Get Started', icon: ArrowRight, variant: 'primary' },
    { label: 'Learn More', icon: Star, variant: 'secondary' },
    { label: 'Power Up', icon: Zap, variant: 'accent' },
  ];

  return (
    <div className="w-full max-w-md space-y-8" style={baseStyle}>
      {/* Primary Glow Button */}
      <div className="flex flex-col items-center gap-4">
        <motion.button
          className="relative px-8 py-4 rounded-xl font-semibold text-lg overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
            color: customization.backgroundColor,
          }}
          onHoverStart={() => setHoveredButton(0)}
          onHoverEnd={() => setHoveredButton(null)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          animate={{
            boxShadow: hoveredButton === 0
              ? `0 0 ${glowSpread}px ${customization.primaryColor}${Math.round(glowIntensity).toString(16).padStart(2, '0')},
                 0 0 ${glowSpread * 2}px ${customization.primaryColor}${Math.round(glowIntensity * 0.5).toString(16).padStart(2, '0')},
                 0 0 ${glowSpread * 3}px ${customization.primaryColor}${Math.round(glowIntensity * 0.25).toString(16).padStart(2, '0')}`
              : `0 0 ${glowSpread * 0.5}px ${customization.primaryColor}40`,
          }}
        >
          {/* Animated shimmer */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            }}
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />

          {/* Glow particles */}
          {hoveredButton === 0 && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{ backgroundColor: 'white' }}
                  initial={{
                    x: '50%',
                    y: '50%',
                    scale: 0,
                  }}
                  animate={{
                    x: `${50 + (Math.random() - 0.5) * 200}%`,
                    y: `${50 + (Math.random() - 0.5) * 200}%`,
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </>
          )}

          <span className="relative flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Glowing Button
          </span>
        </motion.button>
        <p className="text-xs opacity-50" style={{ color: customization.textColor }}>
          Hover for animated glow effect
        </p>
      </div>

      {/* Button Row with Different Glow Styles */}
      <div className="flex flex-wrap justify-center gap-4">
        {buttons.map((button, index) => {
          const Icon = button.icon;
          const isHovered = hoveredButton === index + 1;
          const colors = {
            primary: customization.primaryColor,
            secondary: customization.secondaryColor,
            accent: '#f59e0b',
          };
          const color = colors[button.variant as keyof typeof colors];

          return (
            <motion.button
              key={button.label}
              className="relative px-6 py-3 rounded-lg font-medium flex items-center gap-2 border overflow-hidden"
              style={{
                borderColor: color,
                color: isHovered ? customization.backgroundColor : color,
                backgroundColor: isHovered ? color : 'transparent',
              }}
              onHoverStart={() => setHoveredButton(index + 1)}
              onHoverEnd={() => setHoveredButton(null)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: isHovered
                  ? `0 0 20px ${color}80, 0 0 40px ${color}40, 0 0 60px ${color}20, inset 0 0 20px ${color}30`
                  : `0 0 10px ${color}20`,
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Icon className="w-4 h-4" />
              {button.label}
            </motion.button>
          );
        })}
      </div>

      {/* Pulsing Glow Button */}
      <div className="flex flex-col items-center gap-4">
        <motion.button
          className="relative px-8 py-4 rounded-full font-semibold"
          style={{
            background: customization.backgroundColor,
            color: customization.primaryColor,
            border: `2px solid ${customization.primaryColor}`,
          }}
          animate={{
            boxShadow: [
              `0 0 10px ${customization.primaryColor}30, 0 0 20px ${customization.primaryColor}20`,
              `0 0 30px ${customization.primaryColor}60, 0 0 60px ${customization.primaryColor}40`,
              `0 0 10px ${customization.primaryColor}30, 0 0 20px ${customization.primaryColor}20`,
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
            Pulsing Glow
          </span>
        </motion.button>
        <p className="text-xs opacity-50" style={{ color: customization.textColor }}>
          Continuous pulsing animation
        </p>
      </div>

      {/* Rainbow Glow Button */}
      <div className="flex justify-center">
        <motion.button
          className="relative px-8 py-4 rounded-xl font-bold text-lg"
          style={{
            background: customization.backgroundColor,
            color: customization.textColor,
            border: `2px solid transparent`,
            backgroundClip: 'padding-box',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Rainbow border and glow */}
          <motion.div
            className="absolute -inset-0.5 rounded-xl opacity-75"
            style={{
              backgroundImage: `linear-gradient(90deg, ${customization.primaryColor}, ${customization.secondaryColor}, #f59e0b, #ef4444, ${customization.primaryColor})`,
              backgroundSize: '200% 100%',
              filter: `blur(${blurAmount}px)`,
            }}
            animate={{
              backgroundPosition: ['0% 50%', '200% 50%'],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
          <span
            className="relative block px-8 py-4 rounded-xl"
            style={{ backgroundColor: customization.backgroundColor }}
          >
            Rainbow Glow
          </span>
        </motion.button>
      </div>
    </div>
  );
}
