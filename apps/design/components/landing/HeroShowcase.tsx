'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { colorPresets, PresetKey } from '@/config/presets.config';
import { fontThemes } from '@/lib/fonts';
import { Customization, defaultCustomization } from '@/types/customization';

// Lazy load preview components
import dynamic from 'next/dynamic';

const GlassCard = dynamic(
  () => import('@/components/component-previews/cards/GlassCard').then((m) => ({ default: m.GlassCard })),
  { ssr: false }
);
const PricingCard = dynamic(
  () => import('@/components/component-previews/pricing/PricingCard').then((m) => ({ default: m.PricingCard })),
  { ssr: false }
);
const LoginCard = dynamic(
  () => import('@/components/component-previews/auth/LoginCard').then((m) => ({ default: m.LoginCard })),
  { ssr: false }
);
const StatCard = dynamic(
  () => import('@/components/component-previews/data-display/StatCard').then((m) => ({ default: m.StatCard })),
  { ssr: false }
);

// Theme presets to cycle through
const themePresets: PresetKey[] = ['terminal', 'sunset', 'ocean', 'forest', 'rose'];

// Components to showcase
const showcaseComponents = [
  { id: 'glass-card', name: 'Glass Card', Component: GlassCard },
  { id: 'pricing-card', name: 'Pricing Card', Component: PricingCard },
  { id: 'login-card', name: 'Login Card', Component: LoginCard },
  { id: 'stat-card', name: 'Stat Cards', Component: StatCard },
] as const;

// Animation interval (single interval for synchronized rotation)
const ROTATION_INTERVAL = 5000; // 5 seconds per rotation

type HeroShowcaseProps = {
  className?: string;
};

export function HeroShowcase({ className = '' }: HeroShowcaseProps) {
  const [themeIndex, setThemeIndex] = useState(0);
  const [componentIndex, setComponentIndex] = useState(0);
  const [fontIndex, setFontIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Use ref to track interval so we can reset it
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Hydration fix
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Advance all indices
  const advanceRotation = useCallback(() => {
    setThemeIndex((prev) => (prev + 1) % themePresets.length);
    setComponentIndex((prev) => (prev + 1) % showcaseComponents.length);
    setFontIndex((prev) => (prev + 1) % fontThemes.length);
  }, []);

  // Start/restart the interval
  const startInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(advanceRotation, ROTATION_INTERVAL);
  }, [advanceRotation]);

  // Single synchronized rotation
  useEffect(() => {
    startInterval();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startInterval]);

  // Handle manual theme selection - reset interval to prevent speed-up
  const handleThemeClick = useCallback((index: number) => {
    setThemeIndex(index);
    startInterval(); // Reset the interval timer
  }, [startInterval]);

  // Current theme colors
  const currentTheme = colorPresets[themePresets[themeIndex]];
  const currentFont = fontThemes[fontIndex];
  const CurrentComponent = showcaseComponents[componentIndex].Component;

  // Build customization object for components - create fresh each render to ensure updates
  const customization: Customization = {
    ...defaultCustomization,
    primaryColor: currentTheme.primaryColor,
    secondaryColor: currentTheme.secondaryColor,
    backgroundColor: currentTheme.backgroundColor,
    textColor: currentTheme.textColor,
    fontFamily: currentFont.fontFamily,
  };

  if (!isClient) {
    return (
      <div className={`relative ${className}`}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-full max-w-md h-64 bg-white/5 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Background glow that follows theme color */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          background: `radial-gradient(ellipse at center, ${currentTheme.primaryColor}15 0%, transparent 70%)`,
        }}
        transition={{ duration: 1 }}
      />

      {/* Main showcase container */}
      <div className="relative">
        {/* Theme indicator dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {themePresets.map((preset, index) => (
            <motion.button
              key={preset}
              className="w-3 h-3 rounded-full transition-all"
              style={{
                backgroundColor: colorPresets[preset].primaryColor,
                opacity: index === themeIndex ? 1 : 0.3,
                transform: index === themeIndex ? 'scale(1.3)' : 'scale(1)',
              }}
              onClick={() => handleThemeClick(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`Switch to ${colorPresets[preset].name} theme`}
            />
          ))}
        </div>

        {/* Component showcase - fixed height to prevent layout shift */}
        <div className="relative h-[520px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${themePresets[themeIndex]}-${showcaseComponents[componentIndex].id}-${fontIndex}`}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex items-center justify-center w-full"
            >
              <div
                className={currentFont.className}
                style={{ fontFamily: currentFont.fontFamily }}
              >
                <CurrentComponent customization={customization} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Component & Font labels */}
        <div className="flex items-center justify-center gap-6 mt-6 text-sm">
          <motion.div
            key={showcaseComponents[componentIndex].name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10"
          >
            <span className="text-gray-400">Component:</span>{' '}
            <span className="text-white font-medium">{showcaseComponents[componentIndex].name}</span>
          </motion.div>

          <motion.div
            key={currentFont.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10"
          >
            <span className="text-gray-400">Font:</span>{' '}
            <span className="text-white font-medium">{currentFont.name}</span>
          </motion.div>

          <motion.div
            key={currentTheme.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-3 py-1.5 rounded-full border"
            style={{
              backgroundColor: `${currentTheme.primaryColor}15`,
              borderColor: `${currentTheme.primaryColor}40`,
            }}
          >
            <span className="text-gray-400">Theme:</span>{' '}
            <span style={{ color: currentTheme.primaryColor }} className="font-medium">
              {currentTheme.name}
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
