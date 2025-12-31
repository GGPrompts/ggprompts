'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useRef } from 'react';
import { ChevronDown, Search, Bell } from 'lucide-react';
import { Customization } from '@/types/customization';
import { ThemedScrollArea } from '@/components/ui/themed-scroll-area';

type StickyHeaderProps = {
  customization: Customization;
};

export function StickyHeader({ customization }: StickyHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: containerRef });

  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const blurAmount = parseInt(customization.blurAmount || '12') || 12;
  const opacityToHex = (opacity: number) => Math.round(opacity * 2.55).toString(16).padStart(2, '0');

  const headerHeight = useTransform(scrollY, [0, 100], [80, 60]);
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.85]);
  const backgroundOpacity = useTransform(scrollY, [0, 50], [0, 1]);

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const navItems = [
    { label: 'Products', hasDropdown: true },
    { label: 'Solutions', hasDropdown: true },
    { label: 'Pricing', hasDropdown: false },
    { label: 'Resources', hasDropdown: true },
  ];

  return (
    <div className="w-full max-w-4xl overflow-hidden" style={baseStyle}>
      <ThemedScrollArea
        ref={containerRef}
        primaryColor={customization.primaryColor}
        className="relative h-52 rounded-xl border"
        style={{
          backgroundColor: customization.backgroundColor,
          borderColor: `${customization.primaryColor}30`,
        }}
        onScroll={(e) => {
          const target = e.target as HTMLDivElement;
          setIsScrolled(target.scrollTop > 20);
        }}
      >
        {/* Sticky Header */}
        <motion.header
          className="sticky top-0 z-50 w-full transition-all"
          style={{
            height: isScrolled ? 60 : 80,
          }}
        >
          {/* Background with blur */}
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundColor: isScrolled
                ? `${customization.backgroundColor}${Math.round((100 - glassOpacity) * 2.55).toString(16).padStart(2, '0')}`
                : 'transparent',
              backdropFilter: isScrolled ? `blur(${blurAmount}px)` : 'none',
              borderBottom: isScrolled
                ? `1px solid ${customization.primaryColor}20`
                : 'none',
              boxShadow: isScrolled
                ? `0 4px 20px ${customization.primaryColor}10`
                : 'none',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />

          {/* Header Content */}
          <div className="relative h-full flex items-center justify-between px-6">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-3"
              style={{ scale: isScrolled ? 0.85 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white"
                style={{
                  background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                }}
                whileHover={{ scale: 1.05 }}
              >
                D
              </motion.div>
              <span
                className="font-bold text-lg"
                style={{ color: customization.textColor }}
              >
                Design2Prompt
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.label}
                  className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  style={{ color: `${customization.textColor}cc` }}
                  whileHover={{
                    backgroundColor: `${customization.primaryColor}15`,
                    color: customization.primaryColor,
                  }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {item.label}
                  {item.hasDropdown && <ChevronDown className="w-3 h-3" />}
                </motion.button>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <motion.button
                className="p-2 rounded-md"
                style={{ color: `${customization.textColor}80` }}
                whileHover={{
                  backgroundColor: `${customization.primaryColor}15`,
                  color: customization.primaryColor,
                }}
              >
                <Search className="w-4 h-4" />
              </motion.button>
              <motion.button
                className="p-2 rounded-md relative"
                style={{ color: `${customization.textColor}80` }}
                whileHover={{
                  backgroundColor: `${customization.primaryColor}15`,
                  color: customization.primaryColor,
                }}
              >
                <Bell className="w-4 h-4" />
                <span
                  className="absolute top-1 right-1 w-2 h-2 rounded-full"
                  style={{ backgroundColor: customization.primaryColor }}
                />
              </motion.button>
              <motion.button
                className="ml-2 px-4 py-1.5 rounded-md text-sm font-medium text-white"
                style={{
                  background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Sign In
              </motion.button>
            </div>
          </div>
        </motion.header>

        {/* Scroll Content */}
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              className="p-4 rounded-lg"
              style={{
                backgroundColor: `${customization.primaryColor}10`,
                border: `1px solid ${customization.primaryColor}20`,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div
                className="h-3 w-3/4 rounded mb-2"
                style={{ backgroundColor: `${customization.textColor}30` }}
              />
              <div
                className="h-2 w-1/2 rounded"
                style={{ backgroundColor: `${customization.textColor}20` }}
              />
            </motion.div>
          ))}
        </div>
      </ThemedScrollArea>

      <div className="mt-3 text-center">
        <p className="text-sm font-medium" style={{ color: customization.primaryColor }}>
          Sticky Header
        </p>
        <p className="text-xs opacity-50 mt-1" style={{ color: customization.textColor }}>
          Scroll to see header shrink and blur effect
        </p>
      </div>
    </div>
  );
}
