'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Customization } from '@/types/customization';

type FloatingLabelInputProps = {
  customization: Customization;
};

export function FloatingLabelInput({ customization }: FloatingLabelInputProps) {
  const [values, setValues] = useState({ email: '', password: '' });
  const [focused, setFocused] = useState<string | null>(null);
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const opacityToHex = (opacity: number) => Math.round(opacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const fields = [
    { id: 'email', label: 'Email Address', type: 'email' },
    { id: 'password', label: 'Password', type: 'password' },
  ];

  return (
    <div className="w-full max-w-sm space-y-6" style={baseStyle}>
      {fields.map((field) => {
        const isFocused = focused === field.id;
        const hasValue = values[field.id as keyof typeof values].length > 0;
        const isActive = isFocused || hasValue;

        return (
          <div key={field.id} className="relative">
            <motion.label
              className="absolute left-3 pointer-events-none origin-left"
              style={{ color: isActive ? customization.primaryColor : `${customization.textColor}60` }}
              animate={{
                y: isActive ? -24 : 12,
                scale: isActive ? 0.85 : 1,
                x: isActive ? -4 : 0,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              {field.label}
            </motion.label>
            <input
              type={field.type}
              className="w-full px-3 py-3 bg-transparent border-2 outline-none transition-colors"
              style={{
                borderColor: isFocused ? customization.primaryColor : `${customization.textColor}30`,
                borderRadius: `${customization.borderRadius}px`,
                color: customization.textColor,
              }}
              value={values[field.id as keyof typeof values]}
              onChange={(e) => setValues({ ...values, [field.id]: e.target.value })}
              onFocus={() => setFocused(field.id)}
              onBlur={() => setFocused(null)}
            />
            <AnimatePresence>
              {isFocused && (
                <motion.div
                  className="absolute inset-0 rounded-lg pointer-events-none"
                  style={{
                    borderRadius: `${customization.borderRadius}px`,
                    boxShadow: `0 0 20px ${customization.primaryColor}${opacityToHex(glassOpacity * 2.7)}`,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </AnimatePresence>
          </div>
        );
      })}
      <motion.button
        className="w-full py-3 font-bold text-white"
        style={{
          background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
          borderRadius: `${customization.borderRadius}px`,
        }}
        whileHover={{ scale: 1.02, boxShadow: `0 8px 30px ${customization.primaryColor}${opacityToHex(glassOpacity * 3.4)}` }}
        whileTap={{ scale: 0.98 }}
      >
        Continue
      </motion.button>
      <p className="text-xs opacity-50 text-center" style={{ color: customization.textColor }}>
        Material Design inspired floating labels
      </p>
    </div>
  );
}
