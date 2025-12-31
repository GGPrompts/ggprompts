'use client';

import { motion } from 'framer-motion';
import { Customization } from '@/types/customization';

type FloatingCardProps = {
  customization: Customization;
};

export function FloatingCard({ customization }: FloatingCardProps) {
  const floatHeight = parseInt(customization.floatHeight) || 10;
  const rotationX = parseInt(customization.rotationX) || 5;
  const rotationY = parseInt(customization.rotationY) || 5;
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const blurAmount = parseInt(customization.blurAmount || '12') || 12;

  // Convert percentage to hex for opacity values
  const opacityHex = Math.round(glassOpacity * 2.55).toString(16).padStart(2, '0');
  const borderOpacityHex = Math.round(glassOpacity * 2 * 2.55).toString(16).padStart(2, '0');
  const shadowOpacityHex = Math.round(glassOpacity * 2 * 2.55).toString(16).padStart(2, '0');
  const tagOpacityHex = Math.round(glassOpacity * 1.3 * 2.55).toString(16).padStart(2, '0');
  const tagLightOpacityHex = Math.round(glassOpacity * 0.7 * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  return (
    <motion.div
      className="w-full max-w-sm p-6 rounded-xl border transition-all cursor-pointer"
      style={{
        ...baseStyle,
        backgroundColor: customization.backgroundColor,
        borderColor: `${customization.primaryColor}${borderOpacityHex}`,
        borderRadius: `${customization.borderRadius}px`,
        color: customization.textColor,
        boxShadow: `0 20px 40px ${customization.primaryColor}${shadowOpacityHex}`,
        backdropFilter: `blur(${blurAmount}px)`,
      }}
      whileHover={{
        y: -floatHeight,
        rotateX: rotationX,
        rotateY: -rotationY,
        boxShadow: `0 ${30 + floatHeight}px ${60 + floatHeight}px ${customization.primaryColor}${Math.round(glassOpacity * 2.7 * 2.55).toString(16).padStart(2, '0')}`,
      }}
      transition={{ duration: Number(customization.duration) / 1000 }}
    >
      <h3 className="font-bold mb-2">3D Floating Card</h3>
      <p className="opacity-80 text-sm">
        Hover to see the 3D lift effect with perspective transforms.
      </p>
      <div className="mt-4 flex gap-2">
        <span
          className="px-2 py-1 text-xs rounded"
          style={{ backgroundColor: `${customization.primaryColor}${tagOpacityHex}` }}
        >
          Hover me
        </span>
        <span
          className="px-2 py-1 text-xs rounded opacity-60"
          style={{ backgroundColor: `${customization.primaryColor}${tagLightOpacityHex}` }}
        >
          {floatHeight}px lift
        </span>
      </div>
    </motion.div>
  );
}
