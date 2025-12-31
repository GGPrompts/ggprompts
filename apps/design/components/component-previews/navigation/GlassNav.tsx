'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Home, Folder, User, Settings, Bell } from 'lucide-react';
import { Customization } from '@/types/customization';

type GlassNavProps = {
  customization: Customization;
};

export function GlassNav({ customization }: GlassNavProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const blurAmount = parseInt(customization.blurAmount || '12') || 12;

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const navItems = [
    { icon: Home, label: 'Home' },
    { icon: Folder, label: 'Projects' },
    { icon: User, label: 'Profile' },
    { icon: Bell, label: 'Alerts' },
    { icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-full max-w-lg" style={baseStyle}>
      <motion.nav
        className="relative flex items-center justify-center gap-2 px-3 py-3 border"
        style={{
          backgroundColor: `${customization.primaryColor}${Math.round(glassOpacity * 2.55).toString(16).padStart(2, '0')}`,
          borderColor: `${customization.primaryColor}40`,
          borderRadius: `${customization.borderRadius}px`,
          backdropFilter: `blur(${blurAmount}px)`,
          boxShadow: `0 8px 32px ${customization.primaryColor}20, inset 0 1px 0 ${customization.primaryColor}20`,
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = index === activeIndex;

          return (
            <motion.button
              key={item.label}
              className="relative flex flex-col items-center justify-center w-12 h-10 rounded-lg z-10"
              onClick={() => setActiveIndex(index)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Active indicator per-item */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-lg"
                  style={{
                    backgroundColor: `${customization.primaryColor}30`,
                    boxShadow: `0 0 20px ${customization.primaryColor}40`,
                  }}
                  layoutId="nav-indicator"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <motion.div
                className="relative z-10"
                animate={{
                  color: isActive ? customization.primaryColor : `${customization.textColor}70`,
                }}
              >
                <Icon className="w-5 h-5" />
              </motion.div>
            </motion.button>
          );
        })}
      </motion.nav>

      <div className="mt-3 text-center">
        <motion.p
          className="text-sm font-medium"
          style={{ color: customization.primaryColor }}
          key={activeIndex}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {navItems[activeIndex].label}
        </motion.p>
        <p className="text-xs opacity-50 mt-1" style={{ color: customization.textColor }}>
          Glassmorphic navigation with smooth transitions
        </p>
      </div>
    </div>
  );
}
