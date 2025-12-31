'use client';

import { motion } from 'framer-motion';
import { Customization } from '@/types/customization';
import { Wand2, Rocket } from 'lucide-react';

type AnimatedBorderButtonProps = {
  customization: Customization;
};

export function AnimatedBorderButton({ customization }: AnimatedBorderButtonProps) {
  const hoverScale = parseFloat(customization.hoverScale) || 1.03;
  const gradientAngle = parseInt(customization.gradientAngle) || 135;

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
    borderRadius: `${customization.borderRadius}px`,
  };

  return (
    <div className="flex flex-col gap-6 items-center">
      {/* Rotating Gradient Border */}
      <motion.div
        className="relative p-[2px] overflow-hidden"
        style={{ borderRadius: `${customization.borderRadius}px` }}
        whileHover={{ scale: hoverScale }}
      >
        <motion.div
          className="absolute"
          style={{
            background: `conic-gradient(from 0deg, ${customization.primaryColor}, ${customization.secondaryColor}, ${customization.primaryColor})`,
            width: '200%',
            height: '200%',
            left: '-50%',
            top: '-50%',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        <motion.button
          className="relative px-8 py-3 font-semibold flex items-center gap-2"
          style={{
            ...baseStyle,
            backgroundColor: customization.surfaceColor,
            color: customization.textColor,
          }}
          whileTap={{ scale: 0.98 }}
        >
          <Wand2 className="w-4 h-4" style={{ color: customization.primaryColor }} />
          Rotating Border
        </motion.button>
      </motion.div>

      {/* Pulsing Border */}
      <motion.div
        className="relative p-[2px]"
        style={{ borderRadius: `${customization.borderRadius}px` }}
        whileHover={{ scale: hoverScale }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(${gradientAngle}deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
            borderRadius: `${customization.borderRadius}px`,
          }}
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.button
          className="relative px-8 py-3 font-semibold flex items-center gap-2"
          style={{
            ...baseStyle,
            backgroundColor: customization.surfaceColor,
            color: customization.textColor,
          }}
          whileTap={{ scale: 0.98 }}
        >
          <Rocket className="w-4 h-4" style={{ color: customization.secondaryColor }} />
          Pulsing Border
        </motion.button>
      </motion.div>

      {/* Shimmer Border */}
      <motion.div
        className="relative p-[2px] overflow-hidden"
        style={{ borderRadius: `${customization.borderRadius}px` }}
        whileHover={{ scale: hoverScale }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(${gradientAngle}deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
          }}
        />
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)`,
          }}
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        <motion.button
          className="relative px-8 py-3 font-semibold"
          style={{
            ...baseStyle,
            backgroundColor: customization.surfaceColor,
            color: customization.textColor,
          }}
          whileTap={{ scale: 0.98 }}
        >
          Shimmer Border
        </motion.button>
      </motion.div>

      {/* Rainbow Border */}
      <motion.div
        className="relative p-[2px] overflow-hidden"
        style={{ borderRadius: `${customization.borderRadius}px` }}
        whileHover={{ scale: hoverScale }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(${gradientAngle}deg,
              ${customization.primaryColor},
              #a855f7,
              ${customization.secondaryColor},
              #14b8a6,
              ${customization.primaryColor})`,
            backgroundSize: '300% 300%',
          }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
        <motion.button
          className="relative px-8 py-3 font-semibold"
          style={{
            ...baseStyle,
            backgroundColor: customization.surfaceColor,
            color: customization.textColor,
          }}
          whileTap={{ scale: 0.98 }}
        >
          Rainbow Border
        </motion.button>
      </motion.div>

      <p className="text-xs opacity-50" style={{ color: customization.textColor }}>
        Animated gradient borders
      </p>
    </div>
  );
}
