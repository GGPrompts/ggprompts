'use client';

import { motion } from 'framer-motion';
import { Customization } from '@/types/customization';
import { Plus, Heart, Share2, Settings, Search, Bell } from 'lucide-react';

type IconButtonProps = {
  customization: Customization;
};

export function IconButton({ customization }: IconButtonProps) {
  const hoverScale = parseFloat(customization.hoverScale) || 1.1;
  const shadowIntensity = parseInt(customization.shadowIntensity) || 50;
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;

  // Convert percentage to hex for opacity values
  const squareBgOpacityHex = Math.round(glassOpacity * 1.3 * 2.55).toString(16).padStart(2, '0');

  const icons = [
    { Icon: Plus, label: 'Add' },
    { Icon: Heart, label: 'Like' },
    { Icon: Share2, label: 'Share' },
    { Icon: Settings, label: 'Settings' },
    { Icon: Search, label: 'Search' },
    { Icon: Bell, label: 'Notify' },
  ];

  return (
    <div className="flex flex-col gap-6 items-center">
      {/* Solid Icons Row */}
      <div className="flex gap-3">
        {icons.slice(0, 3).map(({ Icon, label }) => (
          <motion.button
            key={label}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
            style={{
              backgroundColor: customization.primaryColor,
              boxShadow: `0 4px 15px ${customization.primaryColor}${Math.round(shadowIntensity).toString(16).padStart(2, '0')}`,
            }}
            whileHover={{
              scale: hoverScale,
              boxShadow: `0 6px 25px ${customization.primaryColor}${Math.round(shadowIntensity * 1.5).toString(16).padStart(2, '0')}`,
            }}
            whileTap={{ scale: 0.9 }}
            title={label}
          >
            <Icon className="w-5 h-5 text-white" />
          </motion.button>
        ))}
      </div>

      {/* Outline Icons Row */}
      <div className="flex gap-3">
        {icons.slice(3, 6).map(({ Icon, label }) => (
          <motion.button
            key={label}
            className="w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all"
            style={{
              borderColor: customization.secondaryColor,
              color: customization.secondaryColor,
              backgroundColor: 'transparent',
            }}
            whileHover={{
              scale: hoverScale,
              backgroundColor: customization.secondaryColor,
              color: '#ffffff',
            }}
            whileTap={{ scale: 0.9 }}
            title={label}
          >
            <Icon className="w-5 h-5" />
          </motion.button>
        ))}
      </div>

      {/* Squared Variant */}
      <div className="flex gap-3">
        {icons.slice(0, 3).map(({ Icon, label }) => (
          <motion.button
            key={`square-${label}`}
            className="w-10 h-10 flex items-center justify-center transition-all"
            style={{
              backgroundColor: `${customization.primaryColor}${squareBgOpacityHex}`,
              color: customization.primaryColor,
              borderRadius: `${customization.borderRadius}px`,
            }}
            whileHover={{
              scale: hoverScale,
              backgroundColor: customization.primaryColor,
              color: '#ffffff',
            }}
            whileTap={{ scale: 0.9 }}
            title={label}
          >
            <Icon className="w-4 h-4" />
          </motion.button>
        ))}
      </div>

      <p className="text-xs opacity-50" style={{ color: customization.textColor }}>
        Circle, outline, and square variants
      </p>
    </div>
  );
}
