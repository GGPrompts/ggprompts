'use client';

import { motion } from 'framer-motion';
import { Customization } from '@/types/customization';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';

type PillButtonProps = {
  customization: Customization;
};

export function PillButton({ customization }: PillButtonProps) {
  const hoverScale = parseFloat(customization.hoverScale) || 1.05;
  const shadowIntensity = parseInt(customization.shadowIntensity) || 50;
  const gradientAngle = parseInt(customization.gradientAngle) || 135;
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;

  // Convert percentage to hex for opacity values
  const badgeBgOpacityHex = Math.round(glassOpacity * 1.3 * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  return (
    <div className="flex flex-col gap-5 items-center">
      {/* Solid Pill */}
      <motion.button
        className="px-8 py-3 rounded-full flex items-center gap-2 text-white font-semibold"
        style={{
          ...baseStyle,
          backgroundColor: customization.primaryColor,
          boxShadow: `0 4px 15px ${customization.primaryColor}${Math.round(shadowIntensity).toString(16).padStart(2, '0')}`,
        }}
        whileHover={{
          scale: hoverScale,
          boxShadow: `0 6px 25px ${customization.primaryColor}${Math.round(shadowIntensity * 1.5).toString(16).padStart(2, '0')}`,
        }}
        whileTap={{ scale: 0.95 }}
      >
        Get Started
        <motion.span
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowRight className="w-4 h-4" />
        </motion.span>
      </motion.button>

      {/* Gradient Pill */}
      <motion.button
        className="px-8 py-3 rounded-full flex items-center gap-2 text-white font-semibold"
        style={{
          ...baseStyle,
          background: `linear-gradient(${gradientAngle}deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
          boxShadow: `0 4px 20px ${customization.primaryColor}${Math.round(shadowIntensity).toString(16).padStart(2, '0')}`,
        }}
        whileHover={{
          scale: hoverScale,
          boxShadow: `0 8px 30px ${customization.primaryColor}${Math.round(shadowIntensity * 1.5).toString(16).padStart(2, '0')}`,
        }}
        whileTap={{ scale: 0.95 }}
      >
        <Sparkles className="w-4 h-4" />
        Premium Feature
      </motion.button>

      {/* Outline Pill */}
      <motion.button
        className="px-8 py-3 rounded-full flex items-center gap-2 border-2 font-semibold"
        style={{
          ...baseStyle,
          borderColor: customization.primaryColor,
          color: customization.primaryColor,
          backgroundColor: 'transparent',
        }}
        whileHover={{
          scale: hoverScale,
          backgroundColor: customization.primaryColor,
          color: '#ffffff',
        }}
        whileTap={{ scale: 0.95 }}
      >
        Learn More
      </motion.button>

      {/* Small Pills Row */}
      <div className="flex gap-3">
        <motion.button
          className="px-5 py-2 rounded-full text-white text-sm font-medium"
          style={{
            ...baseStyle,
            fontSize: '14px',
            backgroundColor: customization.primaryColor,
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Tag
        </motion.button>
        <motion.button
          className="px-5 py-2 rounded-full text-sm font-medium"
          style={{
            ...baseStyle,
            fontSize: '14px',
            backgroundColor: `${customization.secondaryColor}${badgeBgOpacityHex}`,
            color: customization.secondaryColor,
          }}
          whileHover={{
            scale: 1.1,
            backgroundColor: customization.secondaryColor,
            color: '#ffffff',
          }}
          whileTap={{ scale: 0.95 }}
        >
          Badge
        </motion.button>
        <motion.button
          className="px-5 py-2 rounded-full text-sm font-medium flex items-center gap-1"
          style={{
            ...baseStyle,
            fontSize: '14px',
            background: `linear-gradient(${gradientAngle}deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
            color: '#ffffff',
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Zap className="w-3 h-3" />
          New
        </motion.button>
      </div>

      <p className="text-xs opacity-50" style={{ color: customization.textColor }}>
        Rounded pill-shaped buttons
      </p>
    </div>
  );
}
