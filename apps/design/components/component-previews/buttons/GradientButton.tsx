'use client';

import { motion } from 'framer-motion';
import { Customization } from '@/types/customization';

type GradientButtonProps = {
  customization: Customization;
  textContent?: Record<string, string>;
};

export function GradientButton({ customization, textContent }: GradientButtonProps) {
  const gradientAngle = parseInt(customization.gradientAngle) || 135;
  const hoverScale = parseFloat(customization.hoverScale) || 1.05;
  const shadowIntensity = parseInt(customization.shadowIntensity) || 50;

  const buttonText = textContent?.buttonText ?? 'Get Started';

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <motion.button
        className="px-8 py-3 rounded-lg font-bold text-white transition-all"
        style={{
          ...baseStyle,
          background: `linear-gradient(${gradientAngle}deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
          borderRadius: `${customization.borderRadius}px`,
          boxShadow: `0 4px 20px ${customization.primaryColor}${Math.round(shadowIntensity * 1.5).toString(16).padStart(2, '0')}`,
        }}
        whileHover={{
          scale: hoverScale,
          boxShadow: `0 8px 30px ${customization.primaryColor}${Math.round(shadowIntensity * 2).toString(16).padStart(2, '0')}`,
        }}
        whileTap={{ scale: 0.95 }}
      >
        {buttonText}
      </motion.button>
      <motion.button
        className="px-8 py-3 rounded-lg font-bold border-2 transition-all"
        style={{
          ...baseStyle,
          background: 'transparent',
          borderImage: `linear-gradient(${gradientAngle}deg, ${customization.primaryColor}, ${customization.secondaryColor}) 1`,
          borderRadius: `${customization.borderRadius}px`,
          color: customization.primaryColor,
        }}
        whileHover={{ scale: hoverScale }}
        whileTap={{ scale: 0.95 }}
      >
        Outline Variant
      </motion.button>
      <p className="text-xs opacity-50" style={{ color: customization.textColor }}>
        {gradientAngle}° angle · {hoverScale}x hover
      </p>
    </div>
  );
}
