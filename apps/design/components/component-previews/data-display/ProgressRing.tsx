'use client';

import { motion } from 'framer-motion';
import { Customization } from '@/types/customization';

type ProgressRingProps = {
  customization: Customization;
};

export function ProgressRing({ customization }: ProgressRingProps) {
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const opacityHex = Math.round(glassOpacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const rings = [
    { label: 'Progress', value: 78, size: 120, strokeWidth: 8, color: customization.primaryColor },
    { label: 'Tasks', value: 92, size: 90, strokeWidth: 6, color: customization.secondaryColor },
    { label: 'Goals', value: 65, size: 60, strokeWidth: 5, color: '#a855f7' },
  ];

  const calculateStrokeDasharray = (value: number, size: number) => {
    const radius = (size - 20) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = (value / 100) * circumference;
    return { circumference, progress };
  };

  return (
    <div className="w-full max-w-sm" style={baseStyle}>
      <motion.div
        className="p-6 border text-center"
        style={{
          backgroundColor: `${customization.backgroundColor}${opacityHex}`,
          borderColor: `${customization.primaryColor}30`,
          borderRadius: `${customization.borderRadius}px`,
          boxShadow: `0 8px 32px ${customization.primaryColor}20`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Nested rings */}
        <div className="relative flex items-center justify-center h-32">
          {rings.map((ring, index) => {
            const { circumference, progress } = calculateStrokeDasharray(ring.value, ring.size);

            return (
              <motion.svg
                key={ring.label}
                width={ring.size}
                height={ring.size}
                className="absolute"
                style={{ transform: 'rotate(-90deg)' }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.15 }}
              >
                {/* Background ring */}
                <circle
                  cx={ring.size / 2}
                  cy={ring.size / 2}
                  r={(ring.size - 20) / 2}
                  fill="none"
                  stroke={`${customization.textColor}15`}
                  strokeWidth={ring.strokeWidth}
                />
                {/* Progress ring */}
                <motion.circle
                  cx={ring.size / 2}
                  cy={ring.size / 2}
                  r={(ring.size - 20) / 2}
                  fill="none"
                  stroke={ring.color}
                  strokeWidth={ring.strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: circumference - progress }}
                  transition={{ duration: 1.5, delay: index * 0.15, ease: 'easeOut' }}
                  style={{
                    filter: `drop-shadow(0 0 6px ${ring.color}80)`,
                  }}
                />
              </motion.svg>
            );
          })}

          {/* Center value */}
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
          >
            <p className="text-2xl font-bold" style={{ color: customization.primaryColor }}>
              {rings[0].value}%
            </p>
          </motion.div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4">
          {rings.map((ring, index) => (
            <motion.div
              key={ring.label}
              className="flex items-center gap-1.5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: ring.color,
                  boxShadow: `0 0 6px ${ring.color}60`,
                }}
              />
              <span className="text-xs" style={{ color: `${customization.textColor}70` }}>
                {ring.label}
              </span>
            </motion.div>
          ))}
        </div>

        <p className="text-xs opacity-50 mt-4" style={{ color: customization.textColor }}>
          Animated concentric progress rings
        </p>
      </motion.div>
    </div>
  );
}
