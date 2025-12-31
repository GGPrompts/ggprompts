'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { Customization } from '@/types/customization';

type AnimatedInputProps = {
  customization: Customization;
};

export function AnimatedInput({ customization }: AnimatedInputProps) {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const duration = parseInt(customization.duration) || 300;
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const opacityToHex = (opacity: number) => Math.round(opacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const fields = [
    { id: 'name', icon: User, placeholder: 'Full Name', type: 'text' },
    { id: 'email', icon: Mail, placeholder: 'Email Address', type: 'email' },
    { id: 'password', icon: Lock, placeholder: 'Password', type: 'password' },
  ];

  return (
    <div className="w-full max-w-sm space-y-4" style={baseStyle}>
      {fields.map((field, index) => {
        const Icon = field.icon;
        const isFocused = focusedField === field.id;

        return (
          <motion.div
            key={field.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: duration / 1000 }}
            className="relative"
          >
            <motion.div
              className="absolute inset-0 rounded-lg opacity-0"
              style={{
                background: `linear-gradient(135deg, ${customization.primaryColor}${opacityToHex(glassOpacity * 2)}, ${customization.secondaryColor}${opacityToHex(glassOpacity * 2)})`,
                borderRadius: `${customization.borderRadius}px`,
              }}
              animate={{ opacity: isFocused ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            />
            <div
              className="relative flex items-center gap-3 px-4 py-3 border-2 transition-all"
              style={{
                borderColor: isFocused ? customization.primaryColor : `${customization.textColor}20`,
                borderRadius: `${customization.borderRadius}px`,
                backgroundColor: `${customization.backgroundColor}${opacityToHex(glassOpacity * 3.4)}`,
              }}
            >
              <motion.div
                animate={{
                  color: isFocused ? customization.primaryColor : `${customization.textColor}60`,
                  scale: isFocused ? 1.1 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                <Icon className="w-5 h-5" />
              </motion.div>
              <input
                type={field.type}
                placeholder={field.placeholder}
                className="flex-1 bg-transparent outline-none placeholder-current"
                style={{
                  color: customization.textColor,
                  opacity: isFocused ? 1 : 0.7,
                }}
                onFocus={() => setFocusedField(field.id)}
                onBlur={() => setFocusedField(null)}
              />
              <motion.div
                className="absolute bottom-0 left-0 h-0.5"
                style={{ backgroundColor: customization.primaryColor }}
                initial={{ width: '0%' }}
                animate={{ width: isFocused ? '100%' : '0%' }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        );
      })}
      <p className="text-xs opacity-50 text-center" style={{ color: customization.textColor }}>
        Staggered entrance with focus animations
      </p>
    </div>
  );
}
