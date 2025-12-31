'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Check } from 'lucide-react';
import { Customization } from '@/types/customization';

type CheckboxGroupProps = {
  customization: Customization;
};

type CheckboxOption = {
  id: string;
  label: string;
  description?: string;
};

const checkboxOptions: CheckboxOption[] = [
  { id: 'notifications', label: 'Push Notifications', description: 'Receive push notifications on your device' },
  { id: 'emails', label: 'Email Updates', description: 'Get weekly digest of updates' },
  { id: 'marketing', label: 'Marketing', description: 'Receive promotional offers and news' },
  { id: 'analytics', label: 'Analytics', description: 'Help improve our product with usage data' },
];

export function CheckboxGroup({ customization }: CheckboxGroupProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({
    notifications: true,
    emails: false,
    marketing: false,
    analytics: true,
  });
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const opacityToHex = (opacity: number) => Math.round(opacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const toggleCheckbox = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full max-w-sm" style={baseStyle}>
      <h3
        className="text-lg font-semibold mb-4"
        style={{ color: customization.textColor }}
      >
        Preferences
      </h3>
      <div className="space-y-3">
        {checkboxOptions.map((option, index) => {
          const isChecked = checked[option.id];

          return (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors"
              style={{
                backgroundColor: isChecked ? `${customization.primaryColor}${opacityToHex(glassOpacity * 0.7)}` : 'transparent',
                borderRadius: `${customization.borderRadius}px`,
              }}
              onClick={() => toggleCheckbox(option.id)}
            >
              <motion.div
                className="relative flex-shrink-0 w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center"
                style={{
                  borderColor: isChecked ? customization.primaryColor : `${customization.textColor}40`,
                  backgroundColor: isChecked ? customization.primaryColor : 'transparent',
                }}
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: isChecked ? 1 : 0,
                    opacity: isChecked ? 1 : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </motion.div>
              </motion.div>
              <div className="flex-1">
                <div
                  className="font-medium"
                  style={{ color: customization.textColor }}
                >
                  {option.label}
                </div>
                {option.description && (
                  <div
                    className="text-sm mt-0.5"
                    style={{ color: `${customization.textColor}60` }}
                  >
                    {option.description}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
      <motion.div
        className="mt-4 p-3 rounded-lg"
        style={{
          backgroundColor: `${customization.primaryColor}${opacityToHex(glassOpacity * 0.7)}`,
          borderRadius: `${customization.borderRadius}px`,
        }}
      >
        <p className="text-xs" style={{ color: `${customization.textColor}70` }}>
          Selected: {Object.entries(checked).filter(([, v]) => v).map(([k]) => k).join(', ') || 'None'}
        </p>
      </motion.div>
      <p className="mt-3 text-xs opacity-50 text-center" style={{ color: customization.textColor }}>
        Animated checkbox group with descriptions
      </p>
    </div>
  );
}
