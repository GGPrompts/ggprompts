'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Menu, X, ChevronDown, Play, Zap } from 'lucide-react';
import { Customization } from '@/types/customization';

type TransparentHeaderProps = {
  customization: Customization;
};

export function TransparentHeader({ customization }: TransparentHeaderProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const blurAmount = parseInt(customization.blurAmount || '12') || 12;
  const opacityToHex = (opacity: number) => Math.round(opacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const navItems = [
    { label: 'Features', hasDropdown: true },
    { label: 'Integrations', hasDropdown: true },
    { label: 'Pricing', hasDropdown: false },
    { label: 'Docs', hasDropdown: false },
  ];

  return (
    <div className="w-full max-w-4xl" style={baseStyle}>
      {/* Background with gradient for context */}
      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${customization.primaryColor}40, ${customization.secondaryColor}40, ${customization.backgroundColor})`,
        }}
      >
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 rounded-full"
          style={{
            backgroundColor: `${customization.primaryColor}${opacityToHex(glassOpacity * 2)}`,
            filter: `blur(${blurAmount * 2}px)`,
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-20 right-20 w-40 h-40 rounded-full"
          style={{
            backgroundColor: `${customization.secondaryColor}${opacityToHex(glassOpacity * 1.6)}`,
            filter: `blur(${blurAmount * 2}px)`,
          }}
          animate={{
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Glassmorphic Header */}
        <motion.header
          className="relative z-10 m-4 px-6 py-4 border"
          style={{
            backgroundColor: `${customization.backgroundColor}${Math.round(glassOpacity * 2.55)
              .toString(16)
              .padStart(2, '0')}`,
            borderColor: `${customization.primaryColor}30`,
            borderRadius: `${customization.borderRadius}px`,
            backdropFilter: `blur(${blurAmount}px)`,
            boxShadow: `0 8px 32px ${customization.primaryColor}15, inset 0 1px 0 ${customization.primaryColor}10`,
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                  boxShadow: `0 4px 15px ${customization.primaryColor}40`,
                }}
                animate={{
                  boxShadow: [
                    `0 4px 15px ${customization.primaryColor}40`,
                    `0 4px 25px ${customization.primaryColor}60`,
                    `0 4px 15px ${customization.primaryColor}40`,
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Zap className="w-4 h-4 text-white" />
              </motion.div>
              <span
                className="font-bold text-lg"
                style={{ color: customization.textColor }}
              >
                Pulse
              </span>
            </motion.div>

            {/* Navigation */}
            <nav className="flex items-center gap-1">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.label}
                  className="relative flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium"
                  style={{
                    color:
                      hoveredItem === item.label
                        ? customization.primaryColor
                        : `${customization.textColor}90`,
                  }}
                  onHoverStart={() => setHoveredItem(item.label)}
                  onHoverEnd={() => setHoveredItem(null)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {/* Hover background */}
                  {hoveredItem === item.label && (
                    <motion.div
                      className="absolute inset-0 rounded-lg"
                      style={{ backgroundColor: `${customization.primaryColor}15` }}
                      layoutId="nav-hover"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                  {item.hasDropdown && (
                    <ChevronDown className="w-3 h-3 relative z-10" />
                  )}
                </motion.button>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <motion.button
                className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                style={{ color: `${customization.textColor}90` }}
                whileHover={{
                  backgroundColor: `${customization.primaryColor}15`,
                  color: customization.primaryColor,
                }}
              >
                Sign In
              </motion.button>
              <motion.button
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg"
                style={{
                  background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                  boxShadow: `0 4px 15px ${customization.primaryColor}30`,
                }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: `0 6px 20px ${customization.primaryColor}50`,
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Play className="w-3 h-3" />
                Watch Demo
              </motion.button>
            </div>
          </div>
        </motion.header>

        {/* Content preview area */}
        <div className="relative z-10 px-8 pb-8">
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2
              className="text-2xl font-bold mb-2"
              style={{
                background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Hero Section Preview
            </h2>
            <p
              className="text-sm"
              style={{ color: `${customization.textColor}60` }}
            >
              Header floats over gradient background
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mt-3 text-center">
        <p className="text-sm font-medium" style={{ color: customization.primaryColor }}>
          Transparent Glassmorphic Header
        </p>
        <p className="text-xs opacity-50 mt-1" style={{ color: customization.textColor }}>
          Frosted glass effect with blur backdrop
        </p>
      </div>
    </div>
  );
}
