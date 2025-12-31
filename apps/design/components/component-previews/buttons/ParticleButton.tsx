'use client';

import { motion } from 'framer-motion';
import { Customization } from '@/types/customization';

type ParticleButtonProps = {
  customization: Customization;
};

export function ParticleButton({ customization }: ParticleButtonProps) {
  const particleCount = parseInt(customization.particleCount) || 20;
  const explosionRadius = parseInt(customization.explosionRadius) || 50;
  const duration = parseInt(customization.duration) || 300;
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;

  // Convert percentage to hex for opacity values
  const gradientOpacityHex = Math.round(glassOpacity * 2.7 * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <motion.button
        className="relative px-8 py-3 rounded-lg font-bold text-white overflow-hidden"
        style={{
          ...baseStyle,
          background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
          borderRadius: `${customization.borderRadius}px`,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="relative z-10">Particle Button</span>
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${customization.primaryColor}${gradientOpacityHex} 0%, transparent ${explosionRadius}%)`,
          }}
          animate={{
            scale: [1, 1 + explosionRadius / 50, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{ duration: duration / 500, repeat: Infinity }}
        />
        {/* Particle indicators */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {Array.from({ length: Math.min(particleCount, 8) }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                backgroundColor: customization.secondaryColor,
                opacity: 0.6,
              }}
              animate={{
                x: [0, Math.cos(i * (Math.PI / 4)) * explosionRadius * 0.3],
                y: [0, Math.sin(i * (Math.PI / 4)) * explosionRadius * 0.3],
                opacity: [0.6, 0],
              }}
              transition={{ duration: duration / 300, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </div>
      </motion.button>
      <p className="text-xs opacity-60" style={{ color: customization.textColor }}>
        {particleCount} particles · {explosionRadius}px radius
      </p>
    </div>
  );
}
