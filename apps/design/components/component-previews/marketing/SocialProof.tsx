'use client';

import { motion } from 'framer-motion';
import { Star, ArrowRight } from 'lucide-react';
import { Customization } from '@/types/customization';

type SocialProofProps = {
  customization: Customization;
};

export function SocialProof({ customization }: SocialProofProps) {
  const gradientAngle = parseInt(customization.gradientAngle) || 135;
  const shadowIntensity = parseInt(customization.shadowIntensity) || 50;
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const opacityToHex = (opacity: number) => Math.round(opacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  // Sample avatars represented as initials
  const avatars = [
    { initials: 'JD', color: '#3b82f6' },
    { initials: 'SM', color: '#8b5cf6' },
    { initials: 'AK', color: '#ec4899' },
    { initials: 'MR', color: '#10b981' },
    { initials: 'LP', color: '#f59e0b' },
  ];

  return (
    <div className="w-full max-w-lg" style={baseStyle}>
      <motion.div
        className="relative p-6 overflow-hidden"
        style={{
          background: customization.backgroundColor,
          borderRadius: `${Number(customization.borderRadius) * 1.5}px`,
          border: `1px solid ${customization.primaryColor}20`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Main social proof section */}
        <div className="flex flex-col sm:flex-row items-center gap-5">
          {/* Avatar stack */}
          <motion.div
            className="flex items-center -space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {avatars.map((avatar, index) => (
              <motion.div
                key={index}
                className="relative w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{
                  backgroundColor: avatar.color,
                  zIndex: avatars.length - index,
                  boxShadow: `0 0 0 2px ${customization.backgroundColor}`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.3 + index * 0.1,
                  type: 'spring',
                  stiffness: 200,
                }}
                whileHover={{
                  scale: 1.15,
                  zIndex: 10,
                  boxShadow: `0 0 0 2px ${customization.backgroundColor}, 0 8px 20px ${avatar.color}40`,
                }}
              >
                {avatar.initials}
              </motion.div>
            ))}
            {/* More indicator */}
            <motion.div
              className="relative w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                backgroundColor: `${customization.primaryColor}20`,
                color: customization.primaryColor,
                boxShadow: `0 0 0 2px ${customization.backgroundColor}`,
                zIndex: 0,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, type: 'spring' }}
              whileHover={{ scale: 1.1 }}
            >
              +99
            </motion.div>
          </motion.div>

          {/* Text content */}
          <motion.div
            className="text-center sm:text-left"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p className="font-semibold" style={{ color: customization.textColor }}>
              Join{' '}
              <span
                style={{
                  background: `linear-gradient(${gradientAngle}deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                10,000+
              </span>{' '}
              happy users
            </p>
            <p className="text-xs" style={{ color: `${customization.textColor}60` }}>
              Trusted by teams at leading companies worldwide
            </p>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          className="my-5 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${customization.primaryColor}30, transparent)`,
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5 }}
        />

        {/* Rating and reviews */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {/* Stars and rating */}
          <div className="flex items-center gap-3">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star, index) => (
                <motion.div
                  key={star}
                  initial={{ opacity: 0, scale: 0, rotate: -180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{
                    delay: 0.7 + index * 0.1,
                    type: 'spring',
                    stiffness: 200,
                  }}
                >
                  <Star
                    className="w-5 h-5 fill-current"
                    style={{ color: '#fbbf24' }}
                  />
                </motion.div>
              ))}
            </div>
            <div>
              <span
                className="font-bold text-lg"
                style={{ color: customization.textColor }}
              >
                4.9
              </span>
              <span
                className="text-xs ml-1"
                style={{ color: `${customization.textColor}50` }}
              >
                out of 5
              </span>
            </div>
          </div>

          {/* Review count and CTA */}
          <div className="flex items-center gap-4">
            <p className="text-xs" style={{ color: `${customization.textColor}50` }}>
              Based on{' '}
              <span className="font-medium" style={{ color: customization.textColor }}>
                2,500+ reviews
              </span>
            </p>
            <motion.button
              className="flex items-center gap-1 text-xs font-medium"
              style={{ color: customization.primaryColor }}
              whileHover={{ x: 3 }}
            >
              Read reviews
              <ArrowRight className="w-3 h-3" />
            </motion.button>
          </div>
        </motion.div>

        {/* Floating badge */}
        <motion.div
          className="absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-bold text-white"
          style={{
            background: `linear-gradient(${gradientAngle}deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
            boxShadow: `0 4px 15px ${customization.primaryColor}40`,
          }}
          initial={{ opacity: 0, scale: 0, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: 12 }}
          transition={{ delay: 0.9, type: 'spring' }}
        >
          #1 Rated
        </motion.div>
      </motion.div>
    </div>
  );
}
