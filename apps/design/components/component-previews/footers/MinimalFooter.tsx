'use client';

import { motion } from 'framer-motion';
import { Heart, Zap } from 'lucide-react';
import { Customization } from '@/types/customization';

type MinimalFooterProps = {
  customization: Customization;
};

export function MinimalFooter({ customization }: MinimalFooterProps) {
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const blurAmount = parseInt(customization.blurAmount || '12') || 12;
  const opacityToHex = (opacity: number) => Math.round(opacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const links = ['About', 'Blog', 'Careers', 'Press', 'Privacy', 'Terms'];

  return (
    <div className="w-full max-w-lg" style={baseStyle}>
      <motion.footer
        className="relative py-8 px-6 rounded-xl border"
        style={{
          backgroundColor: customization.backgroundColor,
          borderColor: `${customization.primaryColor}20`,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Subtle gradient line at top */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-0.5 rounded-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${customization.primaryColor}, transparent)`,
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.2 }}
        />

        <div className="text-center space-y-6">
          {/* Logo */}
          <motion.div
            className="flex items-center justify-center gap-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
              }}
            >
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold" style={{ color: customization.textColor }}>
              Acme
            </span>
          </motion.div>

          {/* Navigation Links */}
          <motion.nav
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {links.map((link, index) => (
              <motion.a
                key={link}
                href="#"
                className="text-sm font-medium transition-colors"
                style={{ color: `${customization.textColor}70` }}
                whileHover={{ color: customization.primaryColor }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                {link}
              </motion.a>
            ))}
          </motion.nav>

          {/* Divider */}
          <motion.div
            className="w-16 h-px mx-auto"
            style={{ backgroundColor: `${customization.primaryColor}30` }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4 }}
          />

          {/* Copyright */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm" style={{ color: `${customization.textColor}50` }}>
              &copy; 2024 Acme Inc. All rights reserved.
            </p>
            <motion.p
              className="text-xs flex items-center justify-center gap-1"
              style={{ color: `${customization.textColor}40` }}
            >
              Made with
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              >
                <Heart
                  className="w-3 h-3"
                  style={{ color: customization.primaryColor, fill: customization.primaryColor }}
                />
              </motion.span>
              in San Francisco
            </motion.p>
          </motion.div>
        </div>
      </motion.footer>

      <div className="mt-3 text-center">
        <p className="text-sm font-medium" style={{ color: customization.primaryColor }}>
          Minimal Footer
        </p>
        <p className="text-xs opacity-50 mt-1" style={{ color: customization.textColor }}>
          Clean centered layout with essential links
        </p>
      </div>
    </div>
  );
}
