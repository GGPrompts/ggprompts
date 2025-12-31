'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import { Customization } from '@/types/customization';

type CTASectionProps = {
  customization: Customization;
  textContent?: Record<string, string>;
};

export function CTASection({ customization, textContent }: CTASectionProps) {
  const gradientAngle = parseInt(customization.gradientAngle) || 135;
  const shadowIntensity = parseInt(customization.shadowIntensity) || 50;
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const opacityToHex = (opacity: number) => Math.round(opacity * 2.55).toString(16).padStart(2, '0');

  const headline = textContent?.headline ?? 'Ready to Get Started?';
  const subtext = textContent?.subtext ?? 'Join thousands of developers building amazing products.';
  const primaryCta = textContent?.primaryCta ?? 'Start Free Trial';
  const secondaryCta = textContent?.secondaryCta ?? 'Schedule Demo';

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  return (
    <div className="w-full max-w-lg" style={baseStyle}>
      <motion.div
        className="relative p-8 overflow-hidden text-center"
        style={{
          background: `linear-gradient(${gradientAngle}deg, ${customization.backgroundColor}, ${customization.backgroundColor}ee)`,
          borderRadius: `${Number(customization.borderRadius) * 2}px`,
          border: `1px solid ${customization.primaryColor}40`,
          boxShadow: `0 20px 60px ${customization.primaryColor}${Math.round(shadowIntensity * 0.3).toString(16).padStart(2, '0')}`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at top, ${customization.primaryColor}${opacityToHex(glassOpacity * 2)}, transparent 50%),
                        radial-gradient(ellipse at bottom, ${customization.secondaryColor}${opacityToHex(glassOpacity * 1.3)}, transparent 50%)`,
          }}
          animate={{
            opacity: [glassOpacity / 100 * 1.3, glassOpacity / 100 * 2.6, glassOpacity / 100 * 1.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              backgroundColor: i % 2 === 0 ? customization.primaryColor : customization.secondaryColor,
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}

        {/* Content */}
        <div className="relative z-10">
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 text-xs font-semibold rounded-full"
            style={{
              background: `linear-gradient(${gradientAngle}deg, ${customization.primaryColor}20, ${customization.secondaryColor}20)`,
              color: customization.primaryColor,
              border: `1px solid ${customization.primaryColor}40`,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-3 h-3" />
            <span>Limited Time Offer</span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            className="text-3xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span
              style={{
                background: `linear-gradient(${gradientAngle}deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {headline}
            </span>
          </motion.h2>

          {/* Subtext */}
          <motion.p
            className="mb-8 max-w-md mx-auto leading-relaxed"
            style={{ color: `${customization.textColor}70` }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {subtext}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              className="flex items-center gap-2 px-6 py-3 font-semibold text-white rounded-xl text-sm relative overflow-hidden"
              style={{
                background: `linear-gradient(${gradientAngle}deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                boxShadow: `0 8px 30px ${customization.primaryColor}50`,
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: `0 12px 40px ${customization.primaryColor}70`,
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(90deg, transparent, ${customization.textColor}20, transparent)`,
                }}
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              />
              <Zap className="w-4 h-4" />
              <span className="relative z-10">{primaryCta}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <motion.button
              className="px-6 py-3 font-semibold border rounded-xl text-sm"
              style={{
                borderColor: `${customization.primaryColor}50`,
                color: customization.textColor,
                backgroundColor: `${customization.primaryColor}05`,
              }}
              whileHover={{
                backgroundColor: `${customization.primaryColor}15`,
                borderColor: customization.primaryColor,
              }}
              whileTap={{ scale: 0.95 }}
            >
              {secondaryCta}
            </motion.button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            className="mt-6 flex items-center justify-center gap-6 text-xs"
            style={{ color: `${customization.textColor}50` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <span className="flex items-center gap-1">
              <motion.span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: '#10b981' }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              No credit card required
            </span>
            <span>14-day free trial</span>
            <span>Cancel anytime</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
