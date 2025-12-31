'use client';

import { motion } from 'framer-motion';
import { Zap, ArrowRight, Check } from 'lucide-react';
import { Customization } from '@/types/customization';

type FeatureShowcaseProps = {
  customization: Customization;
};

export function FeatureShowcase({ customization }: FeatureShowcaseProps) {
  const gradientAngle = parseInt(customization.gradientAngle) || 135;
  const shadowIntensity = parseInt(customization.shadowIntensity) || 50;
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const opacityToHex = (opacity: number) => Math.round(opacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const benefits = [
    'Lightning-fast performance',
    'Built-in security features',
    'Real-time collaboration',
    '24/7 expert support',
  ];

  return (
    <div className="w-full max-w-lg" style={baseStyle}>
      <motion.div
        className="relative overflow-hidden"
        style={{
          background: customization.backgroundColor,
          borderRadius: `${Number(customization.borderRadius) * 2}px`,
          border: `1px solid ${customization.primaryColor}20`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex flex-col md:flex-row">
          {/* Image/Visual Side */}
          <motion.div
            className="relative p-6 flex items-center justify-center"
            style={{
              background: `linear-gradient(${gradientAngle}deg, ${customization.primaryColor}10, ${customization.secondaryColor}10)`,
              flex: '1',
              minHeight: '200px',
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Decorative pattern */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `radial-gradient(${customization.primaryColor}50 1px, transparent 1px)`,
                backgroundSize: '16px 16px',
              }}
            />

            {/* Feature icon/illustration */}
            <motion.div
              className="relative z-10 p-6 rounded-2xl"
              style={{
                background: `linear-gradient(${gradientAngle}deg, ${customization.primaryColor}30, ${customization.secondaryColor}30)`,
                boxShadow: `0 20px 50px ${customization.primaryColor}30`,
              }}
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl blur-xl"
                style={{
                  background: `linear-gradient(${gradientAngle}deg, ${customization.primaryColor}50, ${customization.secondaryColor}50)`,
                }}
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              />
              <div
                className="relative z-10 p-4 rounded-xl"
                style={{
                  background: `linear-gradient(${gradientAngle}deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                }}
              >
                <Zap className="w-10 h-10 text-white" />
              </div>
            </motion.div>

            {/* Floating elements */}
            <motion.div
              className="absolute top-8 right-8 w-3 h-3 rounded-full"
              style={{ backgroundColor: customization.primaryColor }}
              animate={{
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-8 left-8 w-2 h-2 rounded-full"
              style={{ backgroundColor: customization.secondaryColor }}
              animate={{
                y: [0, 10, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            />
          </motion.div>

          {/* Content Side */}
          <div className="p-6 flex-1">
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-medium rounded-full"
              style={{
                backgroundColor: `${customization.primaryColor}15`,
                color: customization.primaryColor,
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Zap className="w-3 h-3" />
              <span>Core Feature</span>
            </motion.div>

            {/* Title */}
            <motion.h3
              className="text-2xl font-bold mb-3"
              style={{ color: customization.textColor }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Supercharge Your{' '}
              <span
                style={{
                  background: `linear-gradient(${gradientAngle}deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Productivity
              </span>
            </motion.h3>

            {/* Description */}
            <motion.p
              className="mb-5 text-sm leading-relaxed"
              style={{ color: `${customization.textColor}70` }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Experience the power of AI-driven automation that learns from your
              workflow and optimizes every step of your process.
            </motion.p>

            {/* Benefits list */}
            <motion.div
              className="space-y-2 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <div
                    className="p-1 rounded-full"
                    style={{ backgroundColor: `${customization.primaryColor}20` }}
                  >
                    <Check className="w-3 h-3" style={{ color: customization.primaryColor }} />
                  </div>
                  <span className="text-sm" style={{ color: `${customization.textColor}80` }}>
                    {benefit}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.button
              className="flex items-center gap-2 text-sm font-semibold group"
              style={{ color: customization.primaryColor }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              whileHover={{ x: 5 }}
            >
              Learn more about this feature
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
