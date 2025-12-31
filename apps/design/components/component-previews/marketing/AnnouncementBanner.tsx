'use client';

import { motion } from 'framer-motion';
import { X, Sparkles, ArrowRight, Megaphone } from 'lucide-react';
import { useState } from 'react';
import { Customization } from '@/types/customization';

type AnnouncementBannerProps = {
  customization: Customization;
};

export function AnnouncementBanner({ customization }: AnnouncementBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const gradientAngle = parseInt(customization.gradientAngle) || 135;
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const opacityToHex = (opacity: number) => Math.round(opacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  if (!isVisible) {
    return (
      <motion.div
        className="w-full max-w-lg flex justify-center"
        style={baseStyle}
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
      >
        <motion.button
          className="px-4 py-2 text-xs font-medium rounded-full flex items-center gap-2"
          style={{
            backgroundColor: `${customization.primaryColor}15`,
            color: customization.primaryColor,
            border: `1px solid ${customization.primaryColor}30`,
          }}
          onClick={() => setIsVisible(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Megaphone className="w-3 h-3" />
          Show announcement
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-lg" style={baseStyle}>
      <motion.div
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(${gradientAngle}deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
          borderRadius: `${Number(customization.borderRadius)}px`,
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        {/* Animated background pattern */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
                             radial-gradient(circle at 80% 50%, white 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
          animate={{
            x: [0, 40],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, transparent, white, transparent)`,
            opacity: 0.1,
          }}
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2,
          }}
        />

        <div className="relative z-10 px-4 py-3 flex items-center justify-between gap-4">
          {/* Content */}
          <div className="flex items-center gap-3 flex-1">
            <motion.div
              className="p-1.5 rounded-full bg-white/20 flex-shrink-0"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </motion.div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <span className="text-sm font-semibold text-white">
                New Feature Launch!
              </span>
              <span className="text-xs text-white/80">
                AI-powered automation is now available for all users.
              </span>
            </div>
          </div>

          {/* CTA and Close */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <motion.button
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-white/20 text-white hover:bg-white/30 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn more
              <ArrowRight className="w-3 h-3" />
            </motion.button>

            <motion.button
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              onClick={() => setIsVisible(false)}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-4 h-4 text-white" />
            </motion.button>
          </div>
        </div>

        {/* Progress bar (optional countdown effect) */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-white/30"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{
            duration: 10,
            ease: 'linear',
          }}
        />
      </motion.div>

      {/* Alternative styles */}
      <motion.div
        className="mt-4 p-4 rounded-xl flex items-center gap-4"
        style={{
          backgroundColor: `${customization.primaryColor}10`,
          border: `1px solid ${customization.primaryColor}30`,
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          className="p-2 rounded-lg flex-shrink-0"
          style={{
            background: `linear-gradient(${gradientAngle}deg, ${customization.primaryColor}20, ${customization.secondaryColor}20)`,
          }}
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <Megaphone className="w-5 h-5" style={{ color: customization.primaryColor }} />
        </motion.div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate" style={{ color: customization.textColor }}>
            Subtle announcement style
          </p>
          <p className="text-xs truncate" style={{ color: `${customization.textColor}60` }}>
            Great for less urgent notifications
          </p>
        </div>

        <motion.button
          className="text-xs font-medium flex-shrink-0"
          style={{ color: customization.primaryColor }}
          whileHover={{ x: 3 }}
        >
          View <ArrowRight className="w-3 h-3 inline ml-1" />
        </motion.button>
      </motion.div>
    </div>
  );
}
