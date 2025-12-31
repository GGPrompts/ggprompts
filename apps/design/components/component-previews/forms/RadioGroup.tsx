'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Customization } from '@/types/customization';

type RadioGroupProps = {
  customization: Customization;
};

type RadioOption = {
  value: string;
  label: string;
  description: string;
  icon: string;
};

const radioOptions: RadioOption[] = [
  { value: 'startup', label: 'Startup', description: '12GB RAM / 6 CPUs / 160GB SSD', icon: '🚀' },
  { value: 'business', label: 'Business', description: '24GB RAM / 12 CPUs / 320GB SSD', icon: '💼' },
  { value: 'enterprise', label: 'Enterprise', description: '48GB RAM / 24 CPUs / 640GB SSD', icon: '🏢' },
];

export function RadioGroup({ customization }: RadioGroupProps) {
  const [selected, setSelected] = useState('business');
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const opacityToHex = (opacity: number) => Math.round(opacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  return (
    <div className="w-full max-w-sm" style={baseStyle}>
      <h3
        className="text-lg font-semibold mb-4"
        style={{ color: customization.textColor }}
      >
        Select Plan
      </h3>
      <div className="space-y-3">
        {radioOptions.map((option, index) => {
          const isSelected = selected === option.value;

          return (
            <motion.div
              key={option.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex items-start gap-4 p-4 border-2 cursor-pointer transition-all"
              style={{
                borderColor: isSelected ? customization.primaryColor : `${customization.textColor}20`,
                borderRadius: `${customization.borderRadius}px`,
                backgroundColor: isSelected ? `${customization.primaryColor}${opacityToHex(glassOpacity * 0.7)}` : 'transparent',
              }}
              onClick={() => setSelected(option.value)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Radio Circle */}
              <div className="relative flex-shrink-0 mt-1">
                <motion.div
                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                  style={{
                    borderColor: isSelected ? customization.primaryColor : `${customization.textColor}40`,
                  }}
                >
                  <motion.div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: customization.primaryColor }}
                    initial={{ scale: 0 }}
                    animate={{ scale: isSelected ? 1 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </motion.div>
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      boxShadow: `0 0 15px ${customization.primaryColor}60`,
                    }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{option.icon}</span>
                  <span
                    className="font-semibold"
                    style={{ color: customization.textColor }}
                  >
                    {option.label}
                  </span>
                </div>
                <p
                  className="text-sm mt-1"
                  style={{ color: `${customization.textColor}60` }}
                >
                  {option.description}
                </p>
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <motion.div
                  className="absolute top-2 right-2 px-2 py-0.5 text-xs font-medium rounded-full"
                  style={{
                    backgroundColor: customization.primaryColor,
                    color: '#fff',
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  Selected
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
      <p className="mt-4 text-xs opacity-50 text-center" style={{ color: customization.textColor }}>
        Card-style radio group with smooth selection
      </p>
    </div>
  );
}
