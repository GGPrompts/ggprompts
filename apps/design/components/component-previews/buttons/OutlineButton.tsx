'use client';

import { motion } from 'framer-motion';
import { Customization } from '@/types/customization';

type OutlineButtonProps = {
  customization: Customization;
  textContent?: Record<string, string>;
};

export function OutlineButton({ customization, textContent }: OutlineButtonProps) {
  const hoverScale = parseFloat(customization.hoverScale) || 1.05;
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;

  const buttonText = textContent?.buttonText ?? 'Learn More';

  // Convert percentage to hex for opacity values
  const borderOpacityHex = Math.round(glassOpacity * 4 * 2.55).toString(16).padStart(2, '0');
  const glowOpacityHex = Math.round(glassOpacity * 2.7 * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
    borderRadius: `${customization.borderRadius}px`,
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      {/* Primary Outline */}
      <motion.button
        className="px-8 py-3 border-2 font-semibold transition-all relative overflow-hidden"
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
        transition={{ duration: 0.2 }}
      >
        {buttonText}
      </motion.button>

      {/* Secondary Outline */}
      <motion.button
        className="px-8 py-3 border-2 font-semibold transition-all"
        style={{
          ...baseStyle,
          borderColor: customization.secondaryColor,
          color: customization.secondaryColor,
          backgroundColor: 'transparent',
        }}
        whileHover={{
          scale: hoverScale,
          backgroundColor: customization.secondaryColor,
          color: '#ffffff',
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        Secondary Outline
      </motion.button>

      {/* Subtle Outline with Glow */}
      <motion.button
        className="px-8 py-3 border font-semibold transition-all"
        style={{
          ...baseStyle,
          borderColor: `${customization.primaryColor}${borderOpacityHex}`,
          color: customization.textColor,
          backgroundColor: 'transparent',
        }}
        whileHover={{
          scale: hoverScale,
          borderColor: customization.primaryColor,
          boxShadow: `0 0 20px ${customization.primaryColor}${glowOpacityHex}`,
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        Subtle Outline
      </motion.button>

      <p className="text-xs opacity-50" style={{ color: customization.textColor }}>
        Hover to fill
      </p>
    </div>
  );
}
