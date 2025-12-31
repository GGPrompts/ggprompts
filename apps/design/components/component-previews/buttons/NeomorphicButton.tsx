'use client';

import { motion } from 'framer-motion';
import { Customization } from '@/types/customization';

type NeomorphicButtonProps = {
  customization: Customization;
  textContent?: Record<string, string>;
};

export function NeomorphicButton({ customization, textContent }: NeomorphicButtonProps) {
  const bgColor = customization.backgroundColor;
  const neoDepth = parseInt(customization.neoDepth) || 8;
  const softShadowIntensity = parseInt(customization.softShadowIntensity) || 20;
  const duration = parseInt(customization.duration) || 300;

  const buttonText = textContent?.buttonText ?? 'Press Me';

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <motion.button
        className="px-8 py-3 rounded-xl font-medium transition-all"
        style={{
          ...baseStyle,
          backgroundColor: bgColor,
          color: customization.textColor,
          borderRadius: `${customization.borderRadius}px`,
          boxShadow: `${neoDepth}px ${neoDepth}px ${neoDepth * 2}px ${customization.primaryColor}${softShadowIntensity.toString(16).padStart(2, '0')}, -${neoDepth}px -${neoDepth}px ${neoDepth * 2}px ${customization.secondaryColor}${Math.round(softShadowIntensity / 2).toString(16).padStart(2, '0')}`,
        }}
        whileHover={{
          boxShadow: `${neoDepth / 2}px ${neoDepth / 2}px ${neoDepth}px ${customization.primaryColor}${Math.round(softShadowIntensity * 1.5).toString(16).padStart(2, '0')}, -${neoDepth / 2}px -${neoDepth / 2}px ${neoDepth}px ${customization.secondaryColor}${softShadowIntensity.toString(16).padStart(2, '0')}`,
        }}
        whileTap={{
          boxShadow: `inset ${neoDepth / 2}px ${neoDepth / 2}px ${neoDepth}px ${customization.primaryColor}${softShadowIntensity.toString(16).padStart(2, '0')}, inset -${neoDepth / 2}px -${neoDepth / 2}px ${neoDepth}px ${customization.secondaryColor}${Math.round(softShadowIntensity / 2).toString(16).padStart(2, '0')}`,
        }}
        transition={{ duration: duration / 1000 }}
      >
        {buttonText}
      </motion.button>
      <p className="text-xs opacity-60" style={{ color: customization.textColor }}>
        Click to see pressed state · {neoDepth}px depth
      </p>
    </div>
  );
}
